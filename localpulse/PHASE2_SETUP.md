# Phase 2 Setup

Phase 2 adds Google Business Profile OAuth and review sync. The code is in place, but Google and
Supabase still need manual setup before the connect flow can work.

## 1. Run The Supabase Migration

Open Supabase SQL Editor and run:

```text
supabase/phase2_migration.sql
```

This adds GBP connection columns, review sync flags, and the `error_logs` table.

## 2. Create Google OAuth Credentials

In Google Cloud Console:

1. Create or select a project.
2. Enable these APIs:
   - Google My Business API
   - Business Profile Performance API
   - My Business Account Management API
   - Business Profile Business Information API
3. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URI:

```text
http://localhost:3000/api/auth/google/callback
```

4. Copy the Client ID and Client Secret.

## 3. Update `.env.local`

Fill these values:

```env
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
ENCRYPTION_KEY=generate_with_openssl_rand_base64_32
CRON_SECRET=generate_with_openssl_rand_base64_32
APP_URL=http://localhost:3000
```

Generate the two secrets with:

```powershell
openssl rand -base64 32
openssl rand -base64 32
```

Use one output for `ENCRYPTION_KEY` and the other for `CRON_SECRET`.

Restart the dev server after changing `.env.local`.

## 4. Test The Connect Flow

Login as a client account that owns a business row, then open:

```text
http://localhost:3000/dashboard/connect
```

Click **Connect with Google**.

If the Google setup is correct, the callback saves encrypted tokens, marks the business as connected,
and runs the first review sync.

## 5. Manual Review Sync

After GBP is connected, the reviews page has a **Sync Now** button:

```text
http://localhost:3000/dashboard/reviews
```

It calls:

```text
POST /api/reviews/sync
```

## 6. Cron Sync

The app includes:

```text
supabase/functions/sync-reviews/index.ts
```

Add these Supabase Edge Function secrets:

```env
APP_URL=https://your-deployed-app-url
CRON_SECRET=your_cron_secret
```

Schedule it in Supabase to run every 2 hours:

```text
0 */2 * * *
```

The Edge Function calls:

```text
POST /api/internal/sync-reviews
```

with the `CRON_SECRET` bearer token.
