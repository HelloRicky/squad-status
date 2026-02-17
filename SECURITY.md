# Security Model

## Hardcoded Credentials - Why It's Safe

The Supabase URL and anon key in `index.html` are **intentionally public**:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key-here';
```

### Why This Works

1. **Anon keys are designed to be public** - They're meant to be embedded in client-side code
2. **Row Level Security (RLS) provides the actual security layer**
3. **Static site deployment** - No build step on Cloudflare Pages means env vars aren't practical

### Security Guarantee: Row Level Security (RLS)

The database tables (`agent_status` and `agent_status_history`) MUST have RLS enabled with these policies:

#### Current Policies (SECURE):
- ✅ **SELECT**: Public read access (`USING (true)`)  
  → Anyone can view the dashboard
- ✅ **INSERT/UPDATE/DELETE**: Service role only (`auth.role() = 'service_role'`)  
  → Only authenticated agents can update their status

#### Migration Applied:
See `/supabase/migrations/20260214_fix_rls_policies.sql` for the complete policy implementation.

### What Makes This Safe

**Public Anon Key + RLS = Secure**

- The anon key lets users **read** the dashboard (intended)
- RLS policies prevent **writing** without service credentials
- Service role key (`MC_SUPABASE_SERVICE_KEY`) is kept secret on agent servers

### Verification

To verify RLS is working correctly:

```bash
# Should succeed (public read):
curl "${SUPABASE_URL}/rest/v1/agent_status?select=*" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}"

# Should fail (unauthorized write):
curl -X POST "${SUPABASE_URL}/rest/v1/agent_status" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"agent_id":"test","status":"working"}'
```

Expected response for writes: **403 Forbidden** or **401 Unauthorized**

---

## ⚠️ IMPORTANT: Do NOT Commit Service Keys

**Never commit these:**
- `MC_SUPABASE_SERVICE_KEY` (grants full database access)
- `SUPABASE_DB_PASSWORD` (direct postgres access)
- Any other service role credentials

These must remain in environment variables on agent servers only.

---

## Questions?

**Q: Why not use environment variables?**  
A: Cloudflare Pages static sites don't support runtime env vars without a build step. For a simple dashboard, hardcoded public keys + RLS is the standard pattern.

**Q: Can someone abuse the anon key?**  
A: Only if RLS is misconfigured. With proper policies, they can only read public data (the dashboard).

**Q: How do agents update their status?**  
A: Via the service role key stored securely on their servers, never exposed to browsers.
