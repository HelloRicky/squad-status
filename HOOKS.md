# Agent Status Hooks

Simple scripts to update agent status from anywhere.

## Setup

Ensure these environment variables are set:

```bash
export MC_SUPABASE_URL="https://your-project.supabase.co"
export MC_SUPABASE_SERVICE_KEY="your-service-key"
```

## Quick Start

### Agent Starting Work

```bash
./hooks/agent-start.sh linus "Deploying status page"
```

### Agent Finished Work

```bash
./hooks/agent-done.sh linus
```

### Agent Encountered Error

```bash
./hooks/agent-error.sh linus "Database connection failed"
```

## Manual Control

For more control, use the main update script:

```bash
./hooks/update-status.sh <agent_id> <status> [task_description]
```

**Valid statuses:**
- `idle` - Agent is available
- `working` - Agent is busy
- `error` - Agent has an error

**Examples:**

```bash
# Start working on something
./hooks/update-status.sh ducki working "Coordinating team tasks"

# Back to idle
./hooks/update-status.sh ducki idle

# Report error
./hooks/update-status.sh pixel error "Build failed: missing dependency"
```

## Integration Examples

### In Shell Scripts

```bash
#!/bin/bash
AGENT_ID="linus"

# Start
./hooks/agent-start.sh $AGENT_ID "Running database migration"

# Do work
npm run db:migrate

if [ $? -eq 0 ]; then
    ./hooks/agent-done.sh $AGENT_ID
else
    ./hooks/agent-error.sh $AGENT_ID "Migration failed"
fi
```

### Using curl Directly

If you can't use the scripts, call the API directly:

```bash
# Update status
curl -X PATCH "$MC_SUPABASE_URL/rest/v1/agent_status?agent_id=eq.linus" \
  -H "apikey: $MC_SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $MC_SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{"status": "working", "current_task": "Deploy X", "last_active_at": "now()"}'
```

## Agent IDs

Current squad:
- `ducki` - Ducki (Main)
- `pixel` - Pixel
- `linus` - Linus
- `tesla` - Tesla
- `shakespeare` - Shakespeare

## Testing

Test if your setup works:

```bash
# Set yourself to working
./hooks/agent-start.sh linus "Testing status hooks"

# Check the status page
# You should see your status update within 30 seconds

# Set back to idle
./hooks/agent-done.sh linus
```

## Troubleshooting

**"MC_SUPABASE_URL and MC_SUPABASE_SERVICE_KEY must be set"**
- Make sure environment variables are exported
- Check: `echo $MC_SUPABASE_URL`

**"Could not find the table 'public.agent_status'"**
- Run the SQL setup from README.md first
- Tables must be created before hooks work

**"Row level security policy violation"**
- Check that RLS policies are set up correctly
- Make sure you're using the SERVICE_KEY, not ANON_KEY
