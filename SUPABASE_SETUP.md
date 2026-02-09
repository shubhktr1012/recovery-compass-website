# Supabase Setup Instructions

Follow these steps to connect the waitlist form to your Supabase project.

## 1. Create a Supabase Project
1.  Go to [database.new](https://database.new) and create a new project.
2.  Once created, go to **Project Settings** > **API**.
3.  Copy the `Project URL` and `anon` public key.
    *   **Note**: You might see it labeled as `Legacy` or `Publishable`. Either is fine, as long as it is the **public** key (not `service_role`).

## 2. Configure Environment Variables
1.  In the `web` directory, copy `.env.example` to `.env.local`:
    ```bash
    cp .env.example .env.local
    ```
2.  Open `.env.local` and paste your credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```
3.  **Restart your dev server** (`npm run dev`) to load the new variables.

## 3. Run Database Migration
1.  Open the migration file: `web/supabase/migrations/20260208_initial_schema.sql`.
2.  Copy the entire content of the file.
3.  Go to your Supabase Dashboard > **SQL Editor**.
4.  Paste the SQL and click **Run**.
    *   This creates the `waitlist` table.
    *   It sets up **Row Level Security (RLS)** to allow public inserts (sign-ups) but restrict reading data to admins/service roles only.

## 4. Verify Integration
1.  Refresh your application.
2.  Fill out the Waitlist form in the CTA section.
3.  Click "Join Waitlist".
4.  Check your Supabase Dashboard > **Table Editor** > `waitlist` table. You should see the new entry!

## Handoff to Client
To move this to a client's account, simply:
1.  Ask them to create their own Supabase project.
2.  Run the same SQL migration (Step 3) on their project.
3.  Update the environment variables in Vercel (or wherever you deploy) with *their* keys (Step 2).

## Vercel Deployment Guide
Since `.env.local` is not committed (for security), you must manually add the keys to Vercel:
1.  Go to your **Vercel Dashboard** > Select Project > **Settings**.
2.  Click **Environment Variables**.
3.  Add the following:
    *   `NEXT_PUBLIC_SUPABASE_URL`: (Paste your Project URL)
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Paste your Anon Key)
4.  **Redeploy** the latest commit for these changes to take effect.


## Data Migration (Optional)
**Important:** Changing the API keys in your `.env.local` to the client's account will **NOT** automatically move the existing data. The app will simply start writing to the *new* database, which starts empty.

If you have collected emails during development/testing that you want to move to their account:
1.  Go to your Supabase Dashboard > **Table Editor** > `waitlist`.
2.  Click **Export to CSV**.
3.  Go to the Client's Supabase Dashboard > **Table Editor** > `waitlist`.
4.  Click **Import Data** and upload the CSV file.
