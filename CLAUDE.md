# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An AI agent squad status tracker built with SvelteKit 2, TypeScript, and Tailwind CSS v4. Displays real-time agent status via server-side API routes that query Supabase. Deployed to Cloudflare Pages.

## Development Commands

```bash
npm run dev              # Start dev server (localhost:5173)
npm run build            # Production build for Cloudflare Pages
npm run preview          # Preview production build locally
npm run check            # Type-check with svelte-check
npm run check:watch      # Type-check in watch mode
```

## Architecture

### Security-First Design

**Critical**: This app uses a security-first architecture where Supabase credentials are NEVER exposed to clients:

- Database access happens exclusively in server-side API routes (`/src/routes/api/*/+server.ts`)
- Custom Supabase client (`/src/lib/server/supabase.ts`) uses native fetch, not the Supabase SDK
- Environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) are only accessible server-side
- Client-side components fetch data from `/api/*` endpoints, never directly from Supabase

**When adding features:**
1. New database queries → Create/modify API routes in `/src/routes/api/`
2. Never import `$lib/server/supabase.ts` from client-side components
3. Never use Supabase client libraries on the client

### Database Schema

Two main tables in Supabase:

- **`agent_status`**: Current status of each agent (agent_id, agent_name, status, current_task, last_active_at)
- **`agent_status_history`**: Historical activity log (id, agent_name, task, status, started_at, ended_at)

Migrations are in `supabase/migrations/`. Apply via Supabase SQL Editor or psql.

### Key Files

- **`src/lib/types.ts`**: TypeScript interfaces and agent configuration
  - `Agent` and `Activity` interfaces
  - `agentAvatars`: Maps agent names to SVG/emoji avatars and gradient colors
  - `agentRoles`: Maps agent names to role descriptions
  - Add new agents here by updating these mappings

- **`src/lib/server/supabase.ts`**: Server-only Supabase client
  - `supabaseFetch()`: Makes authenticated requests to Supabase REST API
  - Only import this from `+server.ts` files (never from components)

- **`src/routes/api/agents/+server.ts`**: GET endpoint returning current agent status
- **`src/routes/api/timeline/+server.ts`**: GET endpoint returning activity history with pagination

### Component Structure

All UI components are in `src/lib/components/`:

- **AgentCard.svelte**: Individual agent card with status indicator
- **AgentGrid.svelte**: Grid layout for agents (handles card/compact/table views)
- **Timeline.svelte**: Activity timeline with infinite scroll
- **Header.svelte**: Top bar with view mode switcher
- **SearchBar.svelte**: Search and filter controls
- **StatusChips.svelte**: Status filter chips

Main page (`src/routes/+page.svelte`) orchestrates these components, handles data fetching, and manages view state.

## Cloudflare Pages Deployment

Uses `@sveltejs/adapter-cloudflare` to build for Cloudflare Pages.

Build output: `.svelte-kit/cloudflare/`

Required environment variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Set these in Cloudflare Pages dashboard or via GitHub Actions secrets.

## Adding New Agents

1. Add entry to `agentAvatars` in `src/lib/types.ts` with emoji/SVG and gradient color
2. Add entry to `agentRoles` with role description
3. Insert row in Supabase `agent_status` table (can be done via SQL or API)

## View Modes

The UI supports three view modes (persisted in localStorage):

- **Card**: Default org-chart style layout
- **Compact**: Dense grid for many agents
- **Table**: Row-based list view

View mode state is managed in the main page component.

## Styling

- Global styles: `src/app.css`
- Tailwind v4 (uses `@tailwindcss/postcss` for processing)
- Custom fonts: EB Garamond (serif) + Inter (sans-serif)
- Component-scoped styles in `<style>` blocks within `.svelte` files

## Important Notes

- This is a complete rewrite from a previous static HTML version
- Never commit `.env` (use `.env.example` for templates)
- The app fetches agent status every 30 seconds via auto-refresh
- Timeline uses infinite scroll with 50 activities per page
