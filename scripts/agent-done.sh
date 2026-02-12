#!/bin/bash
# agent-done.sh - Mark agent as idle and close history record
# Usage: ./agent-done.sh <agent_id>

set -euo pipefail

# Validate arguments
if [ $# -ne 1 ]; then
    echo "❌ Error: Missing required argument"
    echo "Usage: $0 <agent_id>"
    echo "Example: $0 linus"
    exit 1
fi

AGENT_ID=$1

# Validate environment variables
if [ -z "${MC_SUPABASE_URL:-}" ] || [ -z "${MC_SUPABASE_SERVICE_KEY:-}" ]; then
    echo "❌ Error: Missing required environment variables"
    echo "Required: MC_SUPABASE_URL, MC_SUPABASE_SERVICE_KEY"
    exit 1
fi

echo "📝 Marking $AGENT_ID as idle"

# Update current status to idle
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$MC_SUPABASE_URL/rest/v1/agent_status?agent_id=eq.$AGENT_ID" \
  -H "apikey: $MC_SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $MC_SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{"status": "idle", "current_task": null, "last_active_at": "now()"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -ne 204 ] && [ "$HTTP_CODE" -ne 200 ]; then
    echo "❌ Error: Failed to update agent_status (HTTP $HTTP_CODE)"
    echo "$BODY"
    exit 1
fi

# Close out history record
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$MC_SUPABASE_URL/rest/v1/agent_status_history?agent_id=eq.$AGENT_ID&ended_at=is.null" \
  -H "apikey: $MC_SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $MC_SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d '{"ended_at": "now()"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -ne 204 ] && [ "$HTTP_CODE" -ne 200 ]; then
    echo "⚠️  Warning: Failed to close history record (HTTP $HTTP_CODE)"
    echo "$BODY"
fi

echo "✅ $AGENT_ID marked as idle"
