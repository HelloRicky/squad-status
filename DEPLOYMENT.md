# Deployment Guide

## Step 1: Create GitHub Repository

Since automated repo creation requires additional permissions, create it manually:

1. Go to https://github.com/new
2. Repository name: `squad-status`
3. Description: `Real-time AI agent status tracker`
4. Visibility: **Public**
5. Click "Create repository"

Then push your local code:

```bash
cd ~/.openclaw/workspace-linus/squad-status

# Add remote (replace YOUR_USERNAME)
git remote add origin git@github.com:YOUR_USERNAME/squad-status.git

# Push code
git branch -M main
git push -u origin main
```

## Step 2: Create Supabase Tables

1. Go to your Supabase project: https://supabase.com/dashboard/project/your-project
2. Navigate to **SQL Editor** (left sidebar)
3. Click **+ New Query**
4. Paste the SQL from `README.md` (the CREATE TABLE commands)
5. Click **Run** or press `Ctrl+Enter`

You should see:
- `agent_status` table created
- `agent_status_history` table created
- RLS policies enabled
- 5 agents seeded (ducki, pixel, linus, tesla, shakespeare)

## Step 3: Deploy to Cloudflare Pages

### Option A: Via Dashboard (Recommended)

1. Go to https://dash.cloudflare.com/
2. Click **Workers & Pages** in the left sidebar
3. Click **Create application** → **Pages** → **Connect to Git**
4. Authorize GitHub if needed
5. Select your `squad-status` repository
6. Configure build settings:
   - **Project name**: `squad-status` (or your choice)
   - **Production branch**: `main`
   - **Build command**: (leave empty)
   - **Build output directory**: `/`
   - **Root directory**: `/`
7. Click **Save and Deploy**

Your site will be live at: `https://squad-status.pages.dev`

### Option B: Via Wrangler CLI

```bash
# Install Wrangler if needed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
cd ~/.openclaw/workspace-linus/squad-status
wrangler pages deploy . --project-name=squad-status
```

## Step 4: Verify Everything Works

1. **Check the Supabase tables:**
   ```bash
   curl -s "$MC_SUPABASE_URL/rest/v1/agent_status" \
     -H "apikey: $MC_SUPABASE_ANON_KEY" | jq
   ```

   You should see 5 agents with `idle` status.

2. **Test a status update:**
   ```bash
   cd ~/.openclaw/workspace-linus/squad-status
   ./hooks/agent-start.sh linus "Testing deployment"
   ```

3. **Visit your Cloudflare Pages URL:**
   - You should see all 5 agents
   - Linus should show as "working" with task "Testing deployment"
   - The page should auto-refresh every 30 seconds

4. **Set back to idle:**
   ```bash
   ./hooks/agent-done.sh linus
   ```

## Step 5: Bookmark and Share

Your status page is now publicly accessible! Share the URL with your team:

- **Example URL**: `https://squad-status.pages.dev`
- No port forwarding needed ✅
- No authentication required ✅
- Mobile-friendly ✅
- Auto-updates every 30 seconds ✅

## Custom Domain (Optional)

To use a custom domain like `status.yourdomain.com`:

1. In Cloudflare Pages settings, click **Custom domains**
2. Add your domain
3. Update your DNS records as instructed
4. Wait for SSL certificate provisioning (~5 minutes)

## Troubleshooting

### Tables not found error

Run the SQL setup from Step 2.

### Status page shows "Error loading"

1. Check browser console for errors
2. Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `index.html`
3. Ensure RLS policies allow public SELECT

### Hooks return errors

1. Verify environment variables are set:
   ```bash
   echo $MC_SUPABASE_URL
   echo $MC_SUPABASE_SERVICE_KEY
   ```
2. Make sure you're using `SERVICE_KEY` (not `ANON_KEY`) for updates
3. Check RLS policies allow INSERT/UPDATE

### Cloudflare Pages deployment fails

1. Ensure repository is public
2. Check that GitHub integration is authorized
3. Verify build settings are empty (no build step needed)

## Maintenance

### Adding a New Agent

```sql
INSERT INTO agent_status (agent_id, agent_name, status)
VALUES ('newagent', 'New Agent Name', 'idle');
```

### Removing an Agent

```sql
DELETE FROM agent_status WHERE agent_id = 'oldagent';
```

### Viewing Status History

```sql
SELECT * FROM agent_status_history
WHERE agent_id = 'linus'
ORDER BY started_at DESC
LIMIT 10;
```

## Updating the Status Page

To update the design or functionality:

1. Edit `index.html` locally
2. Test by opening it in a browser
3. Commit and push to GitHub:
   ```bash
   git add index.html
   git commit -m "Update status page design"
   git push
   ```
4. Cloudflare Pages auto-deploys on every push to `main`

---

**Need help?** Check the main [README.md](README.md) or [HOOKS.md](HOOKS.md)
