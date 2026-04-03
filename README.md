# Recovery Compass Website

Recovery Compass Website is the Next.js marketing site and early-access capture flow for the Recovery Compass product line. It covers the landing page, program-exploration sections, legal pages, SEO metadata, and the Supabase-backed waitlist endpoint.

## Status snapshot

Current repo state as of March 29, 2026:

- The homepage is a section-based marketing site with hero, philosophy, problem, solution, program explorer, FAQ, and CTA sections.
- Waitlist submissions are handled through `POST /api/waitlist` and stored in Supabase.
- Legal/support routes are already in the app router.
- SEO essentials are wired in: metadata, Open Graph, Twitter tags, `robots.ts`, and `sitemap.ts`.
- Non-smoking program pricing is still placeholder content, matching the current product status.

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Main marketing landing page |
| `/privacy` | Privacy policy |
| `/terms` | Terms and conditions |
| `/support` | Support page |
| `/api/waitlist` | Waitlist submission endpoint |

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
├── supabase/             Waitlist migration
├── SUPABASE_SETUP.md     Step-by-step waitlist setup guide
└── lighthouse-report.json
```

## Local development

### Prerequisites

- Node.js 20+
- npm
- A Supabase project for the waitlist table

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
```

### Run the waitlist migration

Apply the SQL in:

```text
web/supabase/migrations/20260208_initial_schema.sql
```

That migration creates the `waitlist` table and the RLS policies needed for public signups.

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

## Waitlist flow

The website collects:

- first name
- last name
- email
- phone
- country code

The frontend form posts to `app/api/waitlist/route.ts`, which inserts into Supabase and returns duplicate-email errors cleanly.

## Design and content notes

- The site uses a calm wellness visual system built around deep forest and sage tones.
- Program cards rotate across three buckets: Break Habits, Restore Balance, and Build Vitality.
- CTA copy and pricing blocks intentionally reflect the current launch state, including `TBD` pricing where product decisions are not final yet.

## Deployment

The repo is set up for Vercel-style deployment:

1. Add the Supabase environment variables to the hosting environment.
2. Deploy the Next.js app.
3. Re-run the waitlist migration against the production Supabase project if needed.

For a longer walkthrough, use [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md).

## Ownership

This codebase is proprietary to Recovery Compass.
