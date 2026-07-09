import { NextResponse } from "next/server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

type ApproveBody = {
  post_id?: string;
  action?: "approve" | "reject" | "edit";
  edited_content?: string;
};

export async function POST(request: Request) {
  const supabase = createClient();
  const service = createServiceRoleClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as ApproveBody;
  if (!body.post_id || !body.action) {
    return NextResponse.json({ success: false, error: "post_id and action are required" }, { status: 400 });
  }

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!business) {
    return NextResponse.json({ success: false, error: "No business found" }, { status: 404 });
  }

  const { data: post } = await service
    .from("posts")
    .select("id")
    .eq("id", body.post_id)
    .eq("business_id", business.id)
    .maybeSingle();

  if (!post) {
    return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  const scheduledAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const update =
    body.action === "reject"
      ? { status: "draft" as const, updated_at: now }
      : {
          content: body.action === "edit" ? body.edited_content?.trim() : undefined,
          status: "approved" as const,
          approved_by: user.id,
          approved_at: now,
          scheduled_at: scheduledAt,
          updated_at: now,
        };

  if (body.action === "edit" && !body.edited_content?.trim()) {
    return NextResponse.json({ success: false, error: "edited_content is required" }, { status: 400 });
  }

  const { data: updatedPost, error } = await service
    .from("posts")
    .update(update)
    .eq("id", body.post_id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, post: updatedPost });
}
