# How to Apply RLS Security Migration

## CRITICAL: This migration MUST be applied to secure your database!

The current RLS policies allow **anonymous users to write** to the database. This migration restricts writes to service role only.

## Option 1: Via Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard/project/your-project/sql/new
2. Copy the contents of `migrations/20260214_fix_rls_policies.sql`
3. Paste into the SQL Editor
4. Click **Run**
5. Verify with the test below

## Option 2: Via Command Line

```bash
# Set your database password
export PGPASSWORD="your-db-password"

# Apply the migration
psql "postgresql://postgres:${PGPASSWORD}@db.your-project.supabase.co:5432/postgres" \
  -f supabase/migrations/20260214_fix_rls_policies.sql
```

## Option 3: Via Supabase CLI

```bash
# Link the project (one-time)
supabase link --project-ref your-project

# Push migrations
supabase db push
```

## Verification

After applying, test that writes are blocked for anonymous users:

```bash
# This should FAIL with 401/403:
curl -X POST "https://your-project.supabase.co/rest/v1/agent_status" \
  -H "apikey: your-supabase-anon-key-here" \
  -H "Authorization: Bearer your-supabase-anon-key-here" \
  -H "Content-Type: application/json" \
  -d '{"agent_id":"hacker","status":"working"}'

# This should SUCCEED (read access):
curl "https://your-project.supabase.co/rest/v1/agent_status?select=*" \
  -H "apikey: your-supabase-anon-key-here" \
  -H "Authorization: Bearer your-supabase-anon-key-here"
```

## Troubleshooting

**Network unreachable errors:**
- Use the Supabase Dashboard SQL Editor instead
- Check if your firewall blocks port 5432

**Migration already applied:**
- The migration uses `DROP POLICY IF EXISTS`, so it's safe to run multiple times

**Still seeing write access with anon key:**
- Double-check the migration was applied successfully
- Check active policies: `SELECT * FROM pg_policies WHERE tablename IN ('agent_status', 'agent_status_history');`
