# Agent Squad Status Tracker

A modern, secure status page to monitor your AI agent squad in real-time. Built with SvelteKit and deployed to Cloudflare Pages.

## ✨ Features

- 🚀 **Real-time monitoring** — Track agent status with auto-refresh
- 🔒 **Secure** — Server-side API routes, credentials never exposed to clients
- 📱 **Responsive** — Mobile-optimized design with multiple view modes
- 🎨 **Beautiful UI** — Polished design with smooth animations
- ⚡ **Fast** — SvelteKit + Cloudflare Pages for global performance
- 🔍 **Powerful filtering** — Search, sort, and filter agents by status
- 📊 **Activity timeline** — View historical agent activity with infinite scroll

## 🏗️ Tech Stack

- **Frontend**: SvelteKit 2 + TypeScript + Tailwind CSS v4
- **Backend**: SvelteKit API routes (server-side)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Cloudflare Pages
- **Fonts**: EB Garamond (serif) + Inter (sans-serif)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Supabase project with tables set up
- Cloudflare account (for deployment)

### Local Development

1. **Clone and install**:
   ```bash
   git clone <your-repo>
   cd squad-status
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-key-here
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```
   
   Open http://localhost:5173

### Database Setup

Run the SQL migrations in your Supabase project:

```bash
# From the repo root
psql -f supabase/migrations/20260214_fix_rls_policies.sql
```

Or use the Supabase SQL Editor to run the migration files manually.

**Tables required:**
- `agent_status` — Current status of each agent
- `agent_status_history` — Historical activity log

See [`supabase/`](./supabase/) directory for schema details.

## 🌐 Deployment

### Cloudflare Pages

1. **Set environment variables** in Cloudflare Pages dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`

2. **Configure build settings**:
   - Build command: `npm run build`
   - Build output directory: `.svelte-kit/cloudflare`
   - Root directory: (leave empty)

3. **Deploy**:
   ```bash
   npm run build
   npx wrangler pages deploy .svelte-kit/cloudflare --project-name=squad-status
   ```

Or push to GitHub and let the Actions workflow handle deployment automatically.

### GitHub Actions

The `.github/workflows/deploy.yml` workflow will:
1. Build the SvelteKit app
2. Deploy to Cloudflare Pages
3. Notify Discord (optional)

**Required secrets**:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `DISCORD_WEBHOOK` (optional)

## 🔧 Configuration

### View Modes

- **Card**: Org-chart layout with leader + team grid (default)
- **Compact**: Dense grid view for many agents
- **Table**: Row-based list view

User preferences are persisted in localStorage.

### Agent Configuration

Edit `src/lib/types.ts` to customize:
- Agent avatars (emoji or SVG)
- Agent roles
- Timeline colors

### Styling

- Global styles: `src/app.css`
- Tailwind config: `tailwind.config.js`
- Component styles: scoped `<style>` blocks in `.svelte` files

## 📊 API Routes

### `GET /api/agents`

Fetches current agent status from Supabase.

**Response**:
```json
[
  {
    "agent_id": "ducki",
    "agent_name": "Ducki (Main)",
    "status": "working",
    "current_task": "Reviewing PRs",
    "last_active_at": "2026-02-14T22:00:00Z"
  }
]
```

### `GET /api/timeline`

Fetches agent activity history with pagination.

**Query params**:
- `offset` (default: 0)
- `limit` (default: 50)
- `agent_name` (optional, filter by agent)

**Response**:
```json
{
  "activities": [...],
  "hasMore": true
}
```

## 🔒 Security

**How credentials are protected:**

1. **No client-side exposure**: Supabase credentials live in server environment variables only
2. **Server-side API routes**: All database calls happen on the server via `/api/*` endpoints
3. **Environment variables**: `.env` is git-ignored, credentials injected at build time
4. **Row Level Security (RLS)**: Supabase policies enforce read-only access for public clients

**What's safe to commit:**
- ✅ Component code
- ✅ API route code (no credentials)
- ✅ `.env.example` (placeholder values)

**Never commit:**
- ❌ `.env` (real credentials)
- ❌ `SUPABASE_SERVICE_KEY` anywhere
- ❌ `.svelte-kit/` build output

See [SECURITY.md](./SECURITY.md) for full details.

## 🛠️ Development

### Project Structure

```
src/
├── lib/
│   ├── components/      # Svelte components
│   │   ├── AgentCard.svelte
│   │   ├── AgentGrid.svelte
│   │   ├── Header.svelte
│   │   ├── SearchBar.svelte
│   │   ├── StatusChips.svelte
│   │   └── Timeline.svelte
│   ├── types.ts         # TypeScript types & constants
│   └── utils.ts         # Helper functions
├── routes/
│   ├── api/
│   │   ├── agents/+server.ts
│   │   └── timeline/+server.ts
│   ├── +layout.svelte   # Root layout
│   └── +page.svelte     # Main page
└── app.css              # Global styles
```

### Build Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build locally
npm run check     # Type-check
```

## 📝 Migration Notes

This is a **complete rewrite** from the previous static HTML version (`index.html`).

**What changed:**
- ✅ Static HTML → SvelteKit framework
- ✅ Client-side Supabase calls → Server-side API routes
- ✅ Exposed credentials → Environment variables
- ✅ Inline styles → Tailwind CSS + scoped components
- ✅ Monolithic file → Modular components

**What stayed the same:**
- ✅ All features (view modes, search, timeline, filters)
- ✅ Visual design and animations
- ✅ Supabase database schema
- ✅ Cloudflare Pages deployment

See `MIGRATION_PROGRESS.md` for detailed migration log.

## 📜 License

MIT

## 🙋 Support

For issues or questions, check the repository issues or reach out to the team.
