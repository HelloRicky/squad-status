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

Run this SQL in your Supabase SQL Editor:

```sql
-- Current status (quick lookup)
CREATE TABLE IF NOT EXISTS agent_status (
  agent_id TEXT PRIMARY KEY,
  agent_name TEXT,
  status TEXT DEFAULT 'idle',
  current_task TEXT,
  last_active_at TIMESTAMPTZ DEFAULT now()
);

-- History (SCD Type 2)
CREATE TABLE IF NOT EXISTS agent_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT,
  status TEXT,
  task TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE agent_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_status_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read access" ON agent_status
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read access" ON agent_status_history
  FOR SELECT USING (true);

-- Allow updates via service key
CREATE POLICY IF NOT EXISTS "Allow updates" ON agent_status
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow inserts" ON agent_status
  FOR INSERT WITH CHECK (true);

-- Seed agents
INSERT INTO agent_status (agent_id, agent_name, status) VALUES
  ('ducki', 'Ducki (Main)', 'idle'),
  ('pixel', 'Pixel', 'idle'),
  ('linus', 'Linus', 'idle'),
  ('tesla', 'Tesla', 'idle'),
  ('shakespeare', 'Shakespeare', 'idle')
ON CONFLICT (agent_id) DO NOTHING;
```

### 2. Configure the Status Page

Edit `index.html` and replace these values:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

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

## License

MIT
