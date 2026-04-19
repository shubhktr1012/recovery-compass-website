# Recovery Compass Website

Recovery Compass Website is the Next.js marketing site and enquiry capture flow
for the Recovery Compass product line. It covers the landing page,
program-exploration sections, legal pages, SEO metadata, and the Supabase-backed
enquiries endpoint.

## Status snapshot

Current repo state as of March 29, 2026:

- The homepage is a section-based marketing site with hero, philosophy, problem,
  solution, program explorer, FAQ, and CTA sections.
- Enquiry submissions are handled through `POST /api/enquiries` and stored in
  Supabase.
- Legal/support routes are already in the app router.
- SEO essentials are wired in: metadata, Open Graph, Twitter tags, `robots.ts`,
  and `sitemap.ts`.
- Non-smoking program pricing is still placeholder content, matching the current
  product status.

## Main routes

| Route            | Purpose                     |
| ---------------- | --------------------------- |
| `/`              | Main marketing landing page |
| `/privacy`       | Privacy policy              |
| `/terms`         | Terms and conditions        |
| `/support`       | Support page                |
| `/api/enquiries` | Enquiry submission endpoint |

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Lenis smooth scrolling
- Radix UI primitives
- Supabase JS client
- Local Satoshi and Erode fonts via `next/font/local`

## What is in this repo

```text
web/
├── app/                  Routes, metadata, sitemap, and API handlers
├── components/           Sections, forms, legal content, and UI primitives
├── lib/                  Supabase client and shared helpers
├── public/               Logos, OG image, CTA art, and other assets
├── supabase/             Website schema migrations
├── SUPABASE_SETUP.md     Step-by-step website form setup guide
└── lighthouse-report.json
```

## Local development

### Prerequisites

- Node.js 20+
- npm
- A Supabase project for the enquiries table

### Install

```bash
npm install
```

### Environment variables

Copy the example file and add your project values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_SITE_VERIFICATION=your-google-site-verification-token
RESEND_API_KEY=your-resend-api-key
ENQUIRY_ALERT_EMAILS=anjan@your-company.com
```

### Run the enquiries migration

Apply the SQL in:

```text
web/supabase/migrations/20260418172000_create_enquiries.sql
```

That migration creates the `enquiries` table and the RLS policies needed for
public submissions.

### Start the dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Enquiry flow

The website collects:

- name
- email
- phone (optional)
- message

The frontend form posts to `app/api/enquiries/route.ts`, which inserts into
Supabase and sends a best-effort notification email to the configured internal
inbox.

## SEO setup

The site already includes:

- root metadata with canonical and Open Graph tags
- `app/robots.ts`
- `app/sitemap.ts`
- `metadataBase` set to the live domain

For Google Search Console:

1. Add `GOOGLE_SITE_VERIFICATION` to the hosting environment.
2. Deploy the site.
3. Verify the domain in Search Console.
4. Submit `https://recoverycompass.co/sitemap.xml`.

For Lighthouse:

1. Run a local production build.
2. Audit the homepage and a program page.
3. Track the performance, accessibility, and SEO scores as a baseline.

## Design and content notes

- The site uses a calm wellness visual system built around deep forest and sage
  tones.
- Program cards rotate across three buckets: Break Habits, Restore Balance, and
  Build Vitality.
- CTA copy and pricing blocks intentionally reflect the current launch state,
  including `TBD` pricing where product decisions are not final yet.

## Deployment

The repo is set up for Vercel-style deployment:

1. Add the Supabase environment variables to the hosting environment.
2. Deploy the Next.js app.
3. Re-run the enquiries migration against the production Supabase project if
   needed.

For a longer walkthrough, use [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md).

## Ownership

This codebase is proprietary to Recovery Compass.
