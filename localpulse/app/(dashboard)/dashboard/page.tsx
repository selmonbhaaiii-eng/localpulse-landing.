import Link from "next/link";
import { ArrowRight, Gauge, Sparkles, Star } from "lucide-react";
import { ConnectGBPBanner } from "@/components/dashboard/ConnectGBPBanner";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { GeneratePostModal } from "@/components/dashboard/GeneratePostModal";
import { createClient } from "@/lib/supabase/server";
import { getUpcomingOccasions } from "@/lib/automation/seasonal-calendar";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: business } = user
    ? await supabase
        .from("businesses")
        .select("id,name,category,location,gbp_connected,total_reviews,avg_rating,health_score,posts_this_month")
        .eq("owner_id", user.id)
        .limit(1)
        .maybeSingle()
    : { data: null };

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [{ data: posts }, { data: reviews }, { count: newReviewsCount }, { data: reviewOptions }] = business
    ? await Promise.all([
        supabase
          .from("posts")
          .select("*")
          .eq("business_id", business.id)
          .order("created_at", { ascending: false })
          .limit(4),
        supabase
          .from("reviews")
          .select("*")
          .eq("business_id", business.id)
          .order("review_date", { ascending: false })
          .limit(3),
        supabase
          .from("reviews")
          .select("id", { count: "exact", head: true })
          .eq("business_id", business.id)
          .gte("review_date", startOfMonth.toISOString()),
        supabase
          .from("reviews")
          .select("id,reviewer_name,rating,review_text")
          .eq("business_id", business.id)
          .eq("post_created", false)
          .gte("rating", 4)
          .order("review_date", { ascending: false })
          .limit(10),
      ])
    : [{ data: [] }, { data: [] }, { count: 0 }, { data: [] }];

  const pendingPosts = (posts ?? []).filter((post) => post.status === "pending_approval");
  const stats = [
    { label: "Posts Published", value: String(business?.posts_this_month ?? 0), accent: "bg-lp-accent" },
    { label: "Profile Views", value: "0", accent: "bg-lp-accent2" },
    { label: "New Reviews", value: String(newReviewsCount ?? 0), accent: "bg-lp-accent3" },
    { label: "Map Pack Rank", value: "#-", accent: "bg-lp-red" },
  ];
  const occasions = getUpcomingOccasions(30).map((occasion) => ({
    name: occasion.name,
    date: occasion.date,
    daysUntil: occasion.daysUntil,
  }));

  return (
    <div className="space-y-6">
      {!business?.gbp_connected ? <ConnectGBPBanner /> : null}

      <DashboardStats stats={stats} />

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl border border-lp-border bg-lp-surface p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-lp-text">Post Queue</h2>
            <span className="rounded-full border border-lp-border bg-lp-surface2 px-2.5 py-1 text-xs font-bold text-lp-text2">
              {pendingPosts.length} pending
            </span>
          </div>
          {pendingPosts.length ? (
            <div className="space-y-3">
              {pendingPosts.map((post) => (
                <Link
                  key={post.id}
                  href="/dashboard/queue"
                  className="block rounded-xl border border-lp-border bg-lp-bg/40 p-4 transition hover:border-lp-border2 hover:bg-lp-surface2"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-lp-accent/20 bg-lp-accent/10 px-2.5 py-1 text-xs font-bold text-lp-accent">
                      Pending Approval
                    </span>
                    <ArrowRight className="size-4 text-lp-text3" />
                  </div>
                  <p className="line-clamp-3 text-sm leading-6 text-lp-text2">{post.content}</p>
                </Link>
              ))}
            </div>
          ) : (
          <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-dashed border-lp-border2 bg-lp-bg/40 p-8 text-center">
            <div>
              <Sparkles className="mx-auto size-8 text-lp-text3" />
              <p className="mt-4 font-heading text-xl font-bold text-lp-text">No posts yet</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-lp-text2">
                Generate your first review, seasonal, or manual GBP post.
              </p>
            </div>
          </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-lp-border bg-lp-surface p-6">
            <h2 className="font-heading text-2xl font-bold text-lp-text">GBP Health Score</h2>
            <div className="mt-6 flex items-center justify-center">
              <div className="relative flex size-44 items-center justify-center rounded-full border-[14px] border-lp-surface3">
                <div className="absolute inset-[-14px] rounded-full border-[14px] border-lp-accent/20" />
                <div className="text-center">
                  <p className="font-heading text-5xl font-extrabold text-lp-text">
                    {business?.health_score ?? 0}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-lp-text3">Score</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-lp-border bg-lp-surface p-6">
            <div className="mb-4 flex items-center gap-2">
              <Gauge className="size-5 text-lp-accent2" />
              <h2 className="font-heading text-2xl font-bold text-lp-text">Quick Generate</h2>
            </div>
            <p className="mb-5 text-sm leading-6 text-lp-text2">Create a post from a review, festival, or custom prompt.</p>
            <GeneratePostModal reviews={reviewOptions ?? []} occasions={occasions} />
          </div>

          <div className="rounded-xl border border-lp-border bg-lp-surface p-6">
            <div className="mb-4 flex items-center gap-2">
              <Star className="size-5 text-lp-accent3" />
              <h2 className="font-heading text-2xl font-bold text-lp-text">Recent Reviews</h2>
            </div>
            <div className="space-y-3">
              {(reviews ?? []).length ? (
                (reviews ?? []).map((review) => (
                  <div key={review.id} className="rounded-lg border border-lp-border bg-lp-bg/40 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-lp-text">{review.reviewer_name ?? "Anonymous"}</p>
                      <p className="text-xs font-bold text-lp-accent3">{review.rating ?? 0} stars</p>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-lp-text2">{review.review_text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-lp-text2">No reviews synced yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
