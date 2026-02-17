# Squad Status - SvelteKit Deployment Documentation

## Deployment Setup (Feb 14, 2026)

### Cloudflare Pages Configuration

**Project:** squad-status  
**Production URL:** https://squad-status.pages.dev  
**Dev URL:** https://dev.squad-status.pages.dev

### Environment Variables (Cloudflare Pages)

Set via Wrangler CLI:

```bash
wrangler pages secret put SUPABASE_URL --project-name=squad-status
wrangler pages secret put SUPABASE_SERVICE_KEY --project-name=squad-status
```

**Values:**
- `SUPABASE_URL`: `https://eetgrdpfxvlefcvshvjx.supabase.co`
- `SUPABASE_SERVICE_KEY`: From `MC_SUPABASE_SERVICE_KEY` env var

### GitHub Secrets

Required secrets for GitHub Actions workflow (`.github/workflows/deploy.yml`):

- ✓ `SUPABASE_URL` - Set 2026-02-14
- ✓ `SUPABASE_SERVICE_KEY` - Set 2026-02-14
- ✓ `CLOUDFLARE_API_TOKEN` - Set 2026-02-13
- ✓ `CLOUDFLARE_ACCOUNT_ID` - Set 2026-02-14 (`0b72cf677a2a0b8ae91a911d4df33591`)
- ✓ `DISCORD_WEBHOOK` - Set 2026-02-13

### Configuration Files

**wrangler.toml:**
```toml
name = "squad-status"
compatibility_date = "2024-01-01"
pages_build_output_dir = ".svelte-kit/cloudflare"

# SvelteKit Cloudflare Pages configuration
```

**svelte.config.js:**
- Adapter: `@sveltejs/adapter-cloudflare`
- Build output: `.svelte-kit/cloudflare`

### Deployment Process

1. **Automatic Deployment:**
   - Pushing to `main` or `dev` branches triggers GitHub Actions
   - Workflow builds SvelteKit app and deploys to Cloudflare Pages
   - Branch `dev` deploys to `dev.squad-status.pages.dev`
   - Branch `main` deploys to `squad-status.pages.dev`

2. **Manual Deployment:**
   ```bash
   npm run build
   wrangler pages deploy .svelte-kit/cloudflare --project-name=squad-status
   ```

### Verification (Feb 14, 2026)

✓ Site loads: https://dev.squad-status.pages.dev (HTTP 200)  
✓ Agents API: `/api/agents` - Returns 5 agents  
✓ Timeline API: `/api/timeline` - Returns 50 activities with pagination

### Notes

- Repo history was rewritten on Feb 14, 2026 to remove hardcoded credentials
- All environment variables are now injected at build time
- Discord notifications are sent on successful deployments
- The SvelteKit adapter creates edge functions for API routes

### Troubleshooting

If deployment fails:
1. Check GitHub Actions logs: `gh run list && gh run view <run-id>`
2. Verify Cloudflare Pages secrets: `wrangler pages secret list --project-name=squad-status`
3. Check build output locally: `npm run build`
4. Verify environment variables are available at build time

### Migration from Static HTML

The project was migrated from static HTML to SvelteKit on Feb 14, 2026:
- Previous deployment used basic HTML/JS/CSS
- New deployment uses SvelteKit with SSR and edge functions
- API routes moved from external calls to SvelteKit endpoints
- Environment variables now properly injected instead of hardcoded
