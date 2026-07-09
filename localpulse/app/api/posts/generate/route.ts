import { NextResponse } from "next/server";
import { getUpcomingOccasions } from "@/lib/automation/seasonal-calendar";
import { extractPhrasesFromReview } from "@/lib/ai/extract-phrases";
import { generateManualPost, generatePostFromReview, generateSeasonalPost } from "@/lib/ai/generate-post";
import { sendPostReadyEmail } from "@/lib/notifications/post-email";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

type GenerateBody = {
  source_type?: "review" | "seasonal" | "manual";
  review_id?: string;
  context?: string;
  tone?: string;
  occasionName?: string;
  occasionDate?: string;
};

function phrasesFromJson(value: Json | null) {
  if (value && typeof value === "object" && !Array.isArray(value) && Array.isArray(value.phrases)) {
    return value.phrases.map(String);
  }

  return [];
}

export async function POST(request: Request) {
  const supabase = createClient();
  const service = createServiceRoleClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as GenerateBody;
  const sourceType = body.source_type ?? "manual";

  const { data: business } = await supabase
    .from("businesses")
    .select("id,name,category,location,owner_id")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!business) {
    return NextResponse.json({ success: false, error: "No business found" }, { status: 404 });
  }

  let content = "";
  let sourceReviewId: string | null = null;
  let reviewerName: string | null = null;

  if (sourceType === "review") {
    if (!body.review_id) {
      return NextResponse.json({ success: false, error: "review_id is required" }, { status: 400 });
    }

    const { data: review, error } = await service
      .from("reviews")
      .select("*")
      .eq("id", body.review_id)
      .eq("business_id", business.id)
      .single();

    if (error || !review) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    let phrases = phrasesFromJson(review.extracted_phrases);
    if (!review.phrases_extracted || !phrases.length) {
      phrases = await extractPhrasesFromReview(
        review.review_text ?? "",
        review.reviewer_name ?? "Anonymous",
        review.rating ?? 0,
      );

      await service
        .from("reviews")
        .update({ extracted_phrases: { phrases }, phrases_extracted: true })
        .eq("id", review.id);
    }

    content = await generatePostFromReview({
      businessName: business.name,
      category: business.category,
      location: business.location,
      reviewerName: review.reviewer_name ?? "Anonymous",
      phrases,
      tone: body.tone,
    });
    sourceReviewId = review.id;
    reviewerName = review.reviewer_name;
  } else if (sourceType === "seasonal") {
    const nextOccasion = getUpcomingOccasions(30)[0];
    const occasionName = body.occasionName ?? nextOccasion?.name;
    const occasionDate = body.occasionDate ?? nextOccasion?.date;

    if (!occasionName || !occasionDate) {
      return NextResponse.json({ success: false, error: "occasionName is required" }, { status: 400 });
    }

    content = await generateSeasonalPost({
      businessName: business.name,
      category: business.category,
      location: business.location,
      occasionName,
      occasionDate,
      tone: body.tone,
    });
  } else {
    if (!body.context?.trim()) {
      return NextResponse.json({ success: false, error: "context is required" }, { status: 400 });
    }

    content = await generateManualPost({
      businessName: business.name,
      category: business.category,
      location: business.location,
      context: body.context,
      tone: body.tone,
    });
  }

  const { data: post, error: insertError } = await service
    .from("posts")
    .insert({
      business_id: business.id,
      content,
      source_type: sourceType,
      source_review_id: sourceReviewId,
      status: "pending_approval",
    })
    .select("*")
    .single();

  if (insertError || !post) {
    return NextResponse.json(
      { success: false, error: insertError?.message ?? "Unable to create post" },
      { status: 400 },
    );
  }

  if (sourceReviewId) {
    await service
      .from("reviews")
      .update({ post_created: true, converted_to_post: true, post_id: post.id })
      .eq("id", sourceReviewId);
  }

  const { data: profile } = await service
    .from("profiles")
    .select("email,full_name")
    .eq("id", user.id)
    .maybeSingle();

  await sendPostReadyEmail({
    to: profile?.email ?? user.email,
    ownerName: profile?.full_name ?? user.email,
    businessName: business.name,
    postContent: content,
    reviewerName,
    appUrl: new URL(request.url).origin,
  });

  return NextResponse.json({ success: true, post });
}
