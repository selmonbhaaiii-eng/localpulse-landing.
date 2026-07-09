"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { BusinessPlan } from "@/types/database";

export type InviteClientState = {
  ok: boolean;
  message: string;
};

const validPlans: BusinessPlan[] = ["trial", "starter", "agency"];

export async function inviteClient(
  _previousState: InviteClientState,
  formData: FormData,
): Promise<InviteClientState> {
  const businessName = String(formData.get("businessName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const location = String(formData.get("location") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const plan = String(formData.get("plan") ?? "trial") as BusinessPlan;

  if (!businessName || !email || !location || !validPlans.includes(plan)) {
    return { ok: false, message: "Please complete all required fields." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "You must be signed in as an admin." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { ok: false, message: "Only admins can invite clients." };
  }

  const service = createServiceRoleClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback`;
  const { data: inviteData, error: inviteError } = await service.auth.admin.inviteUserByEmail(
    email,
    {
      data: { role: "client" },
      redirectTo,
    },
  );

  if (inviteError || !inviteData.user?.id) {
    return {
      ok: false,
      message: inviteError?.message ?? "Unable to invite this client.",
    };
  }

  const ownerId = inviteData.user.id;

  await service.from("profiles").upsert(
    {
      id: ownerId,
      email,
      role: "client",
    },
    { onConflict: "id" },
  );

  const { error: businessError } = await service.from("businesses").insert({
    owner_id: ownerId,
    name: businessName,
    category,
    location,
    plan,
    plan_status: plan === "trial" ? "trial" : "active",
    monthly_post_limit: plan === "agency" ? 100 : 30,
    health_score: 0,
    posts_this_month: 0,
  });

  if (businessError) {
    return { ok: false, message: businessError.message };
  }

  revalidatePath("/admin/clients");
  return { ok: true, message: `Invite sent to ${email}` };
}
