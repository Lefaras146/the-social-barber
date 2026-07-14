## Plan: Connect your own Supabase project

### Current state
This project is currently using Lovable Cloud-managed Supabase. The app reads Supabase credentials from environment variables/secrets, and the database has been created and seeded there.

### Goal
Replace the managed backend with your own Supabase project so all database, auth, and storage calls point to your account.

### What I need from you
Please have these ready (do not paste them in chat until you confirm you want to proceed):

1. **Supabase Project URL** — e.g. `https://<project-ref>.supabase.co`
2. **Anon / Publishable key** — starts with `eyJ...` or `sb_publishable_...`
3. **Service Role key** — found in Project Settings → API; keep it secret
4. **Project reference ID** — the `<project-ref>` part of your Supabase URL

### What I will do after you confirm

1. Update the project secrets/environment variables to point to your Supabase project:
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
2. Apply the existing booking-engine migrations to your new Supabase database so the schema, indexes, RLS policies, and seed data are recreated there.
3. Verify the connection by reading from the new database (e.g. list barbers and services).

### Important notes
- Any bookings or data stored in the current managed Supabase will NOT transfer automatically. This will be a fresh database on your project.
- You must keep the service role key private; it will only be stored as a runtime secret, not in the code.
- Auth/social-provider configuration (Google, etc.) may need to be re-enabled in your Supabase dashboard after the switch.

### Next step
Confirm you want to proceed and I will open a secure form for you to enter the Supabase credentials. No code or database changes will happen until you confirm.