import { PostQueue } from "@/components/dashboard/PostQueue";
import { getUpcomingOccasions } from "@/lib/automation/seasonal-calendar";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function QueuePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: business } = user
    ? await supabase
        .from("businesses")
        .select("id,posts_this_month")
        .eq("owner_id", user.id)
        .limit(1)
        .maybeSingle()
    : { data: null };

  const [{ data: posts }, { data: reviews }] = business
    ? await Promise.all([
        supabase
          .from("posts")
          .select("*, reviews(reviewer_name,rating,review_text)")
          .eq("business_id", business.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("reviews")
          .select("id,reviewer_name,rating,review_text")
          .eq("business_id", business.id)
          .eq("post_created", false)
          .gte("rating", 4)
          .order("review_date", { ascending: false })
          .limit(20),
      ])
    : [{ data: [] }, { data: [] }];

  const occasions = getUpcomingOccasions(30).map((occasion) => ({
    name: occasion.name,
    date: occasion.date,
    daysUntil: occasion.daysUntil,
  }));

  return (
    <PostQueue
      initialPosts={posts ?? []}
      reviews={reviews ?? []}
      occasions={occasions}
      postsThisMonth={business?.posts_this_month ?? 0}
    />
  );
}
