# Environment Map

This repo currently has two effective environments:

- `local`
- `production`

There is not yet a true `staging` deployment path for the website. Local and
preview testing still depend on manually pointed secrets rather than a dedicated
isolated stack.

## Current state

### Local website runtime

Primary source:

- `web/.env.local`

Variables currently used by the app:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `GOOGLE_SITE_VERIFICATION`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RESEND_API_KEY`
- `FROM_EMAIL`
- `NEXT_PUBLIC_FROM_EMAIL` as legacy fallback only
- `COMMERCE_ALERT_EMAILS`
- `ALERT_EMAIL`
- `ENQUIRY_ALERT_EMAILS`
- `COMMERCE_RECONCILE_SECRET`
- `APP_PURCHASE_EMAIL_SECRET`

### External integrations

The website is responsible for:

- Razorpay order creation and payment verification
- Razorpay webhook handling
- Resend transactional emails
- Supabase auth/session flows
- internal app-purchase onboarding email endpoint consumed by the app webhook

## Target environment model

Use three environments:

1. `local`
2. `staging`
3. `production`

### Local

Purpose:

- feature work
- local checkout and auth testing
- email flow testing against safe recipients or staging domains

### Staging

Purpose:

- QA of auth and purchase flows
- end-to-end testing with the mobile app staging build
- safe verification of app-purchase email dispatch

Must be isolated from production for:

- Supabase project
- Razorpay test credentials
- Resend sending domain or sender identity
- internal reconcile secret
- app purchase email secret
- public site URL

### Production

Purpose:

- live website
- live Razorpay payments
- live transactional email sending
- live app-purchase onboarding email handling

## Required staging work

1. Create a staging Vercel project or a stable preview environment strategy.
2. Create a staging Supabase project for web auth/data.
3. Use Razorpay test credentials in staging.
4. Create staging Resend sender/domain configuration.
5. Generate staging values for:
   - `COMMERCE_RECONCILE_SECRET`
   - `APP_PURCHASE_EMAIL_SECRET`
6. Set `NEXT_PUBLIC_SITE_URL` to the staging domain.
7. Point the app staging webhook email endpoint at the staging web deployment.

## Current config gaps

1. The app repo expects an internal app-purchase email endpoint and secret, but
   there is no documented staging pairing across repos.
2. `NEXT_PUBLIC_SITE_URL` is used by email templates and should be explicitly
   set in each environment.
3. `NEXT_PUBLIC_RAZORPAY_KEY_ID` is required for checkout UI but was missing
   from the example env file.

## Cross-repo staging contract

For staging to work end to end:

- app staging webhook env:
  - `APP_PURCHASE_EMAIL_ENDPOINT=https://<staging-web-domain>/api/internal/app-purchase-email`
  - `APP_PURCHASE_EMAIL_SECRET=<staging-shared-secret>`
- web staging env:
  - `APP_PURCHASE_EMAIL_SECRET=<same-staging-shared-secret>`

This secret must be different from production.

## Next implementation step

When you are ready to create staging, do this in order:

1. Create staging Vercel project/domain.
2. Create staging Supabase project and run website migrations.
3. Set staging Supabase env vars in Vercel.
4. Set Razorpay test keys in staging.
5. Set staging Resend sender and API key.
6. Set staging `APP_PURCHASE_EMAIL_SECRET` and `COMMERCE_RECONCILE_SECRET`.
7. Update the app staging webhook env to call the staging web endpoint.
8. Verify auth, checkout, webhook, welcome email, and app-purchase email flows.
