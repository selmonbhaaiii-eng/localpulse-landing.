// @ts-nocheck
// Supabase Edge Function scheduled every 15 minutes.
// It calls the Next.js publish endpoint so Google token refresh can reuse app helpers.

Deno.serve(async (req) => {
  const authHeader = req.headers.get("Authorization");
  const cronSecret = Deno.env.get("CRON_SECRET");
  const appUrl = Deno.env.get("APP_URL");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!appUrl) {
    return Response.json({ error: "APP_URL secret is required" }, { status: 500 });
  }

  const response = await fetch(`${appUrl}/api/posts/publish`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cronSecret}` },
  });

  const payload = await response.json().catch(() => ({}));
  return Response.json(payload, { status: response.status });
});
