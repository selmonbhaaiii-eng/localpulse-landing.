import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Business = Database["public"]["Tables"]["businesses"]["Row"];

function calculateProfileCompleteness(business: Business | null) {
  if (!business) return 0;

  const checks = [
    business.name,
    business.category,
    business.location,
    business.gbp_connected,
    business.gbp_location_id,
    business.gbp_account_name,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export async function calculateHealthScore(businessId: string): Promise<number> {
  const supabase = createServiceRoleClient();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: posts }, { data: reviews }, { data: business }] = await Promise.all([
    supabase
      .from("posts")
      .select("id")
      .eq("business_id", businessId)
      .eq("status", "published")
      .gte("published_at", thirtyDaysAgo),
    supabase.from("reviews").select("id, reply_text").eq("business_id", businessId),
    supabase.from("businesses").select("*").eq("id", businessId).single(),
  ]);

  const postFrequency = Math.min(((posts?.length ?? 0) / 12) * 100, 100);
  const reviewResponseRate = reviews?.length
    ? (reviews.filter((review) => review.reply_text).length / reviews.length) * 100
    : 0;
  const profileComplete = calculateProfileCompleteness(business);

  const score = Math.round(postFrequency * 0.4 + reviewResponseRate * 0.3 + profileComplete * 0.3);

  await supabase.from("businesses").update({ health_score: score }).eq("id", businessId);
  return score;
}
