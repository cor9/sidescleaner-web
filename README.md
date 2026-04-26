# SidesCleaner Web

Next.js search portal for the SidesCleaner casting catalog. Reads from the same
Supabase project that the M1 pipeline writes to.

## What's in here

- **Search & filter** by project type, format, genre, gender, age range, and "lead in scene"
- **Detail page** per script with full synopsis, scene summary, character list, and PDF link
- **Magic-link auth** via Supabase, locked to an email allowlist
- **Marquee design system** — Fraunces italic + Inter, Marquee Red on cream

## Stack

- Next.js 15 (App Router) on React 19
- Tailwind CSS with Marquee tokens in `tailwind.config.ts`
- Supabase JS via `@supabase/ssr`
- Hosted on Vercel (free tier handles this fine)

---

## Local setup

```bash
cd ~/sidescleaner-web
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL (same one the pipeline writes to)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the **anon** key (not service_role; RLS protects the data)
- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` for local, your Vercel URL for prod
- `ALLOWED_EMAILS` — comma-separated email allowlist; only these can sign in

Then:

```bash
npm run dev
```

Open `http://localhost:3000`. You'll get bounced to `/login`. Enter an allowlisted
email, click the magic link in your inbox, and you're in.

---

## One-time Supabase setup

The pipeline already created the `scripts` and `roles` tables. The web app only
needs **read** access from the anon key, controlled by RLS.

In the Supabase SQL editor, run:

```sql
-- Enable RLS
alter table scripts enable row level security;
alter table roles   enable row level security;

-- Allow authenticated users to read everything
create policy "scripts_read_authenticated"
  on scripts for select
  to authenticated
  using (true);

create policy "roles_read_authenticated"
  on roles for select
  to authenticated
  using (true);
```

The pipeline keeps using the **service_role** key, which bypasses RLS, so writes
keep working unchanged.

---

## Deploy to Vercel

1. Push this folder to a new GitHub repo: `cor9/sidescleaner-web`
2. Go to [vercel.com](https://vercel.com) → New Project → Import the repo
3. Framework preset auto-detects Next.js
4. Add the four env vars from `.env.example` in the Vercel project settings
5. Deploy
6. Copy your Vercel URL into Supabase: **Authentication → URL Configuration**
   - Site URL: your Vercel URL
   - Redirect URLs: add `https://<your-domain>/api/auth/callback`
7. Update `NEXT_PUBLIC_SITE_URL` in Vercel env vars to match the deployed URL, redeploy

That's it. Push to main, Vercel ships it.

---

## Adding collaborators

Just add their email to `ALLOWED_EMAILS` in Vercel env vars and redeploy. They
sign in with their own magic link — no password to share, no account creation
flow.

---

## What's next

A few things deliberately left for v2:

- **Sort options** (currently newest first only)
- **Saved searches / bookmarks**
- **Re-extraction** when you tweak the system prompt — replay over `raw_extraction`
- **PDF inline preview** instead of opening in a new tab
- **Talent matching** — paste a resume, get scripts where they'd fit
