# Quick Start Guide

Get your agent status tracker running in 15 minutes!

## Prerequisites
- ✅ Supabase account (already configured)
- ✅ GitHub account
- ✅ Cloudflare account (free tier works!)

## Step-by-Step Setup

### 1️⃣ Create Database Tables (5 min)

Visit: https://supabase.com/dashboard/project/eetgrdpfxvlefcvshvjx/sql

Click "New Query" and paste:

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

Click **Run** (or `Ctrl+Enter`)

### 2️⃣ Create GitHub Repo (2 min)

**Option A - Web UI:**
1. Go to https://github.com/new
2. Name: `squad-status`
3. Public repo
4. Create!

Then push:
```bash
cd ~/.openclaw/workspace-linus/squad-status
git remote add origin git@github.com:YOUR_USERNAME/squad-status.git
git branch -M main
git push -u origin main
```

**Option B - CLI:**
```bash
gh repo create squad-status --public --source=. --push
```

### 3️⃣ Deploy to Cloudflare Pages (5 min)

1. Go to https://dash.cloudflare.com
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Authorize GitHub
4. Select `squad-status` repo
5. Settings:
   - Build command: (empty)
   - Output: `/`
6. **Save and Deploy**

🎉 Live at: `https://squad-status.pages.dev`

### 4️⃣ Test It! (3 min)

```bash
cd ~/.openclaw/workspace-linus/squad-status

# Test connection
./test/test-connection.sh

# Update status
./hooks/agent-start.sh linus "Testing the system"

# Visit your Cloudflare Pages URL
# You should see Linus as "working"!

# Set back to idle
./hooks/agent-done.sh linus
```

## Daily Usage

### Start working on something:
```bash
./hooks/agent-start.sh <agent_id> "<task description>"
```

### Finished working:
```bash
./hooks/agent-done.sh <agent_id>
```

### Report an error:
```bash
./hooks/agent-error.sh <agent_id> "<error message>"
```

## Agent IDs
- `ducki` - Ducki (Main)
- `pixel` - Pixel  
- `linus` - Linus
- `tesla` - Tesla
- `shakespeare` - Shakespeare

## URLs

- **Status Page**: https://squad-status.pages.dev (yours will differ)
- **Supabase Dashboard**: https://supabase.com/dashboard/project/eetgrdpfxvlefcvshvjx
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **GitHub Repo**: https://github.com/YOUR_USERNAME/squad-status

## Need Help?

- 📖 Full docs: `README.md`
- 🪝 Hook details: `HOOKS.md`
- 🚀 Deployment: `DEPLOYMENT.md`
- 📊 Overview: `PROJECT_SUMMARY.md`

---

**Total setup time**: ~15 minutes  
**Maintenance required**: Zero!  
**Cost**: $0 (all free tiers)
