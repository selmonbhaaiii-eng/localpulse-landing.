# How To Run LocalPulse

Use this when you just want to see what we have so far.

## 1. Open the Project Folder

In PowerShell:

```powershell
cd "C:\Users\Mohd.Onais\Documents\New project\localpulse"
```

## 2. Install Dependencies

If `node_modules` already exists, you can skip this. Otherwise run:

```powershell
npm.cmd install
```

Use `npm.cmd` on this Windows machine because PowerShell may block the `npm.ps1` shim.

## 3. Start the App

```powershell
npm.cmd run dev
```

When it is running, open:

```text
http://localhost:3000/login
```

That is the main page you can view immediately.

## 4. What You Can See Right Now

With placeholder Supabase keys, you can view the public login screen:

```text
http://localhost:3000/login
```

The protected pages will redirect to login until real Supabase auth is configured:

```text
http://localhost:3000/admin/clients
http://localhost:3000/dashboard
```

That redirect is expected. It means the route protection is working.

## 5. To Test Real Login And Dashboards

Create a Supabase project, then run this SQL in the Supabase SQL editor:

```text
supabase/schema.sql
```

Then replace the placeholder values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=your_resend_key
ADMIN_EMAIL=your@email.com
```

In Supabase Auth settings:

```text
Site URL: http://localhost:3000
Redirect URL: http://localhost:3000/auth/callback
```

Restart the dev server after changing `.env.local`.

## 6. Admin Login Flow

Use the email from `ADMIN_EMAIL` on the `/login` page.

After clicking the magic link, the app should send you here:

```text
http://localhost:3000/admin/clients
```

## 7. Client Login Flow

From the admin clients page, click `Add Client`, enter a business and owner email, and send the invite.

After the client clicks their magic link, the app should send them here:

```text
http://localhost:3000/dashboard
```

## 8. Useful Checks

Run these when you want to confirm the code is healthy:

```powershell
npm.cmd run lint
npm.cmd run build
```

Both passed after Phase 1 was built.

## 9. If Port 3000 Is Busy

Run on another port:

```powershell
npm.cmd run dev -- --port 3001
```

Then open:

```text
http://localhost:3001/login
```

If you change the port and want magic links to work, update `NEXT_PUBLIC_APP_URL` and the Supabase redirect URL to match that port.
