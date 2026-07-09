import { NextResponse } from "next/server";
import { extractPhrasesFromReview } from "@/lib/ai/extract-phrases";
import { generatePostFromReview } from "@/lib/ai/generate-post";
import { sendPostReadyEmail } from "@/lib/notifications/post-email";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const service = createServiceRoleClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { review_id: reviewId } = (await request.json().catch(() => ({}))) as { review_id?: string };
  if (!reviewId) {
    return NextResponse.json({ success: false, error: "review_id is required" }, { status: 400 });
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id,name,category,location")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!business) {
    return NextResponse.json({ success: false, error: "No business found" }, { status: 404 });
  }

  const { data: review, error } = await service
    .from("reviews")
    .select("*")
    .eq("id", reviewId)
    .eq("business_id", business.id)
    .single();

  if (error || !review) {
    return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
  }

  const phrases = await extractPhrasesFromReview(
    review.review_text ?? "",
    review.reviewer_name ?? "Anonymous",
    review.rating ?? 0,
  );

  await service
    .from("reviews")
    .update({ extracted_phrases: { phrases }, phrases_extracted: true })
    .eq("id", review.id);

  const content = await generatePostFromReview({
    businessName: business.name,
    category: business.category,
    location: business.location,
    reviewerName: review.reviewer_name ?? "Anonymous",
    phrases,
  });

  const { data: post, error: postError } = await service
    .from("posts")
    .insert({
      business_id: business.id,
      content,
      source_type: "review",
      source_review_id: review.id,
      status: "pending_approval",
    })
    .select("*")
    .single();

  if (postError || !post) {
    return NextResponse.json(
      { success: false, error: postError?.message ?? "Unable to create post" },
      { status: 400 },
    );
  }

  await service
    .from("reviews")
    .update({ post_created: true, converted_to_post: true, post_id: post.id })
    .eq("id", review.id);

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
    reviewerName: review.reviewer_name,
    appUrl: new URL(request.url).origin,
  });

  return NextResponse.json({ success: true, phrases, post });
}
