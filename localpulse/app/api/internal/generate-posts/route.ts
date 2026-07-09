import { NextResponse } from "next/server";
import { extractPhrasesFromReview } from "@/lib/ai/extract-phrases";
import { generatePostFromReview, generateSeasonalPost } from "@/lib/ai/generate-post";
import { getUpcomingOccasions } from "@/lib/automation/seasonal-calendar";
import { sendPostReadyEmail } from "@/lib/notifications/post-email";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Business = Database["public"]["Tables"]["businesses"]["Row"];
type ReviewWithBusiness = Database["public"]["Tables"]["reviews"]["Row"] & {
  businesses: Business | null;
};

function isAuthorized(request: Request) {
  const expected = process.env.CRON_SECRET;
  return Boolean(expected && request.headers.get("Authorization") === `Bearer ${expected}`);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, businesses(*)")
    .eq("phrases_extracted", false)
    .eq("post_created", false)
    .gte("rating", 4)
    .limit(20);

  let reviewPosts = 0;
  for (const review of (reviews ?? []) as ReviewWithBusiness[]) {
    const business = review.businesses;
    if (!business) continue;

    const phrases = await extractPhrasesFromReview(
      review.review_text ?? "",
      review.reviewer_name ?? "Anonymous",
      review.rating ?? 0,
    );

    await supabase
      .from("reviews")
      .update({ extracted_phrases: { phrases }, phrases_extracted: true })
      .eq("id", review.id);

    const content = await generatePostFromReview({
      businessName: business.name,
      location: business.location,
      category: business.category,
      reviewerName: review.reviewer_name ?? "Anonymous",
      phrases,
    });

    const { data: post } = await supabase
      .from("posts")
      .insert({
        business_id: review.business_id,
        content,
        source_type: "review",
        source_review_id: review.id,
        status: "pending_approval",
      })
      .select("*")
      .single();

    if (post) {
      reviewPosts += 1;
      await supabase
        .from("reviews")
        .update({ post_created: true, converted_to_post: true, post_id: post.id })
        .eq("id", review.id);

      const { data: owner } = business.owner_id
        ? await supabase.from("profiles").select("email,full_name").eq("id", business.owner_id).maybeSingle()
        : { data: null };

      await sendPostReadyEmail({
        to: owner?.email,
        ownerName: owner?.full_name,
        businessName: business.name,
        postContent: content,
        reviewerName: review.reviewer_name,
        appUrl: new URL(request.url).origin,
      });
    }
  }

  const upcoming = getUpcomingOccasions(7);
  let seasonalPosts = 0;

  if (upcoming.length) {
    const { data: businesses } = await supabase
      .from("businesses")
      .select("*")
      .eq("gbp_connected", true)
      .in("plan_status", ["active", "trial"]);

    for (const business of businesses ?? []) {
      for (const occasion of upcoming) {
        const { data: existing } = await supabase
          .from("posts")
          .select("id")
          .eq("business_id", business.id)
          .eq("source_type", "seasonal")
          .ilike("content", `%${occasion.name}%`)
          .maybeSingle();

        if (existing) continue;

        const content = await generateSeasonalPost({
          businessName: business.name,
          location: business.location,
          category: business.category,
          occasionName: occasion.name,
          occasionDate: occasion.date,
        });

        const { data: post } = await supabase
          .from("posts")
          .insert({
            business_id: business.id,
            content,
            source_type: "seasonal",
            status: "pending_approval",
          })
          .select("id")
          .single();

        if (post) seasonalPosts += 1;
      }
    }
  }

  return NextResponse.json({ success: true, reviewPosts, seasonalPosts });
}
