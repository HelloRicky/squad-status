# Development Guidelines

## GitHub Actions CI/CD Setup

This repository uses GitHub Actions to automatically deploy to Cloudflare Pages on every push to `master` or `dev` branches.

### Required GitHub Secrets

You must configure the following secrets in your GitHub repository settings:

1. **Navigate to:** `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

2. **Add these secrets:**

   | Secret Name | Description | How to Obtain |
   |------------|-------------|---------------|
   | `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages permissions | 1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)<br>2. Click "Create Token"<br>3. Use "Edit Cloudflare Workers" template<br>4. Add "Cloudflare Pages" permissions<br>5. Copy the token |
   | `DISCORD_WEBHOOK` | Discord webhook URL for deployment notifications | Already configured:<br>`https://discord.com/api/webhooks/1469532186595037384/q3t2I3PES6BU3YJS0zAWN3duToLIDLhnrjxB7E4bDj0xDLxvZ_gy8dDHMcPrUqZ2PEYV` |

### Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) automatically:

1. ✅ Checks out the code
2. ✅ Deploys to Cloudflare Pages (static HTML, no build step required)
3. ✅ Sends a Discord notification on success

**Note:** Since this is a static HTML project, there are no build steps. The entire directory is deployed as-is.

### Manual Deployment

To deploy manually:

```bash
npx wrangler pages deploy . --project-name=squad-status
```

### Troubleshooting

**Deployment fails:** Verify `CLOUDFLARE_API_TOKEN` has the correct permissions.

**Discord notification fails:** Check that `DISCORD_WEBHOOK` is set correctly.

---

For project overview, see [README.md](README.md).
