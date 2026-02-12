#!/bin/bash
# spawn-agent.sh - Mark agent as working and log task start
# Usage: ./spawn-agent.sh <agent_id> <task_description>
# Example: ./spawn-agent.sh linus "Deploy to Cloudflare"

set -euo pipefail

# Validate arguments
if [ $# -lt 2 ]; then
    echo "❌ Error: Missing required arguments"
    echo "Usage: $0 <agent_id> <task_description>"
    echo "Example: $0 linus 'Deploy to Cloudflare'"
    exit 1
fi

AGENT_ID=$1
shift
TASK="$*"

# Validate environment variables
if [ -z "${MC_SUPABASE_URL:-}" ] || [ -z "${MC_SUPABASE_SERVICE_KEY:-}" ]; then
    echo "❌ Error: Missing required environment variables"
    echo "Required: MC_SUPABASE_URL, MC_SUPABASE_SERVICE_KEY"
    exit 1
fi

echo "📝 Marking $AGENT_ID as working: $TASK"

# Pre-hook: Mark working
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$MC_SUPABASE_URL/rest/v1/agent_status?agent_id=eq.$AGENT_ID" \
  -H "apikey: $MC_SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $MC_SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d "{\"status\": \"working\", \"current_task\": \"$TASK\", \"last_active_at\": \"now()\"}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -ne 204 ] && [ "$HTTP_CODE" -ne 200 ]; then
    echo "❌ Error: Failed to update agent_status (HTTP $HTTP_CODE)"
    echo "$BODY"
    exit 1
fi

# Also log to history
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$MC_SUPABASE_URL/rest/v1/agent_status_history" \
  -H "apikey: $MC_SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $MC_SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d "{\"agent_id\": \"$AGENT_ID\", \"status\": \"working\", \"task\": \"$TASK\"}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -ne 201 ]; then
    echo "⚠️  Warning: Failed to log to agent_status_history (HTTP $HTTP_CODE)"
    echo "$BODY"
fi

echo "✅ $AGENT_ID marked as working: $TASK"
