# Web Agent Context

## Surface

This is the active Next.js website/admin repo for Recovery Compass. Use it for diet-plan, admin, referral, checkout, detox, and program-finder work.

## Stack

- Next.js, React, TypeScript, Supabase, Vitest, Razorpay, Resend, Puppeteer PDF generation.

## Rules

- Use existing helpers for auth, admin permissions, audit logging, Supabase access, diet-plan generation, email, and PDF rendering.
- Preserve exact intake/config labels that drive logic, especially diet-plan questionnaire labels such as `Non-veg (no beef)`.
- Keep route changes covered by targeted Vitest tests where practical.
- Run targeted tests first, then broader `npm run test`, `npm run lint`, or `npm run build` when the change warrants it.
- Graphify output lives at the workspace root (`recovery-compass/graphify-out/`), not inside this repo.
