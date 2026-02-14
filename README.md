# Agent Squad Status Tracker

A simple, beautiful status page to monitor your AI agent squad in real-time.

## Features

- 🚀 Real-time status monitoring
- 📱 Mobile-friendly design
- 🔄 Auto-refreshes every 30 seconds
- 🎨 Clean, modern UI
- 🔒 Read-only public access (no authentication needed)
- ⚡ Deployed to Cloudflare Pages for instant global access

## Setup

### 1. Create Supabase Tables

**IMPORTANT:** Run the complete setup SQL from the repository root:

```bash
# Initial setup (creates tables)
psql -f setup.sql

# Security policies (REQUIRED - prevents unauthorized writes)
psql -f supabase/migrations/20260214_fix_rls_policies.sql
```

Or manually via Supabase SQL Editor - see `setup.sql` and `supabase/migrations/20260214_fix_rls_policies.sql`.

**🔒 Security:** See [SECURITY.md](SECURITY.md) for details on the RLS security model.

### 2. Deploy to Cloudflare Pages

**No configuration needed!** The Supabase credentials in `index.html` are already set up and safe to commit (they're public anon keys protected by RLS).

1. Push this repo to GitHub (dev branch)
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. Click "Create a project"
4. Connect your GitHub repo
5. Use these settings:
   - **Branch**: `dev`
   - **Build command**: (leave empty)
   - **Build output directory**: `/`
   - **Root directory**: `/`

That's it! Your status page will be live at `https://your-project.pages.dev`

### 3. Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. Click "Create a project"
4. Connect your GitHub repo
5. Use these settings:
   - Build command: (leave empty)
   - Build output directory: `/`
   - Root directory: `/`

That's it! Your status page will be live at `https://your-project.pages.dev`

## Usage

### Update Agent Status (Pre-hook)

When an agent starts a task:

```bash
curl -X PATCH "$MC_SUPABASE_URL/rest/v1/agent_status?agent_id=eq.linus" \
  -H "apikey: $MC_SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $MC_SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{"status": "working", "current_task": "Deploy X", "last_active_at": "now()"}'
```

### Clear Agent Status (Post-hook)

When an agent completes a task:

```bash
curl -X PATCH "$MC_SUPABASE_URL/rest/v1/agent_status?agent_id=eq.linus" \
  -H "apikey: $MC_SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $MC_SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{"status": "idle", "current_task": null, "last_active_at": "now()"}'
```

### Set Error Status

When an agent encounters an error:

```bash
curl -X PATCH "$MC_SUPABASE_URL/rest/v1/agent_status?agent_id=eq.linus" \
  -H "apikey: $MC_SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $MC_SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{"status": "error", "current_task": "Failed: reason", "last_active_at": "now()"}'
```

## Environment Variables

The hooks need these environment variables:

- `MC_SUPABASE_URL` - Your Supabase project URL
- `MC_SUPABASE_SERVICE_KEY` - Your Supabase service role key (for updates)
- `MC_SUPABASE_ANON_KEY` - Your Supabase anon key (for the public status page)

## Status Values

- `idle` - Agent is waiting for work (green)
- `working` - Agent is actively working on a task (orange)
- `error` - Agent encountered an error (red)

## Tech Stack

- Pure HTML/CSS/JavaScript (no build step!)
- Supabase for real-time data
- Cloudflare Pages for hosting

## Security

**Q: Why are Supabase credentials hardcoded in the HTML?**

A: The anon key is designed to be public. Security is enforced via Row Level Security (RLS) policies:
- ✅ Public users can **read** the dashboard
- ❌ Only agents with service keys can **write** status updates

See [SECURITY.md](SECURITY.md) for complete details and verification steps.

**Q: What should NOT be committed?**

Never commit:
- `MC_SUPABASE_SERVICE_KEY` (full database access)
- `SUPABASE_DB_PASSWORD` (postgres access)
- Other service role credentials

These remain in environment variables on agent servers only.

## License

MIT
