# 🚨 Setup Required: Environment Variables

## What Changed

Hardcoded Supabase credentials have been **removed** from the source code and replaced with environment variable injection at build time.

## ⚠️ Action Required

Before the next deployment will work, you **must** configure environment variables:

### Option 1: GitHub Actions (Current Setup)

Add these secrets to your GitHub repository:

1. Go to: https://github.com/HelloRicky/squad-status/settings/secrets/actions
2. Click **"New repository secret"**
3. Add each of these:

```
Name: SUPABASE_URL
Value: https://your-project.supabase.co

Name: SUPABASE_ANON_KEY
Value: your-supabase-anon-key-here
```

### Option 2: Cloudflare Pages Dashboard

Alternatively (or in addition), configure in Cloudflare Pages:

1. Go to: https://dash.cloudflare.com → Pages → squad-status
2. Navigate to: **Settings → Environment variables**
3. Add for **Production** and **Preview** environments:

```
Variable name: SUPABASE_URL
Value: https://your-project.supabase.co

Variable name: SUPABASE_ANON_KEY
Value: your-supabase-anon-key-here
```

4. Update build settings:
   - **Build command**: `./build.sh`
   - **Build output directory**: `.`

## How It Works

1. **Build time**: The `build.sh` script runs
2. **Environment variables**: Script reads `SUPABASE_URL` and `SUPABASE_ANON_KEY`
3. **Generation**: Creates `config.js` with the credentials
4. **Deployment**: `config.js` is deployed (but never committed to git)
5. **Runtime**: `index.html` loads `config.js` to get credentials

## Verification

After setting up environment variables:

1. **Push a commit** to trigger GitHub Actions
   ```bash
   git commit --allow-empty -m "test: trigger build"
   git push origin dev
   ```

2. **Check GitHub Actions**:
   - Go to: https://github.com/HelloRicky/squad-status/actions
   - Verify the "Build config.js" step succeeds
   - Check that no "WARNING" messages appear

3. **Check deployed site**:
   - Open: https://dev.squad-status.pages.dev
   - Open browser DevTools (F12) → Console
   - Verify no errors about missing variables
   - Confirm agent status cards load properly

## Troubleshooting

### Build fails with "SUPABASE_URL not set"
- Check that secrets are added to GitHub repository
- Verify secret names match exactly (case-sensitive)

### Dashboard shows "your-anon-key-here"
- Environment variables weren't set when build ran
- Re-run deployment after adding secrets
- Check Cloudflare Pages build logs

### Timeline doesn't load
- Invalid credentials in environment variables
- Double-check the values match your Supabase project
- Verify RLS policies are configured (see SECURITY.md)

## Documentation

Full setup guide: [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)

---

**Next Steps**:
1. ✅ Code changes pushed to `dev` branch
2. ⏳ **Add environment variables** (GitHub or Cloudflare Pages)
3. ⏳ Test deployment
4. ⏳ Merge to `master` when verified

**Contact**: @Linus for questions
