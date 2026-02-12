#!/bin/bash
# agent-error.sh - Mark agent as in error state
# Usage: ./agent-error.sh <agent_id> <error_message>
# Example: ./agent-error.sh linus "Database connection failed"

set -euo pipefail

# Validate arguments
if [ $# -lt 2 ]; then
    echo "❌ Error: Missing required arguments"
    echo "Usage: $0 <agent_id> <error_message>"
    echo "Example: $0 linus 'Database connection failed'"
    exit 1
fi

AGENT_ID=$1
shift
ERROR_MSG="$*"

# Validate environment variables
if [ -z "${MC_SUPABASE_URL:-}" ] || [ -z "${MC_SUPABASE_SERVICE_KEY:-}" ]; then
    echo "❌ Error: Missing required environment variables"
    echo "Required: MC_SUPABASE_URL, MC_SUPABASE_SERVICE_KEY"
    exit 1
fi

echo "📝 Marking $AGENT_ID as error: $ERROR_MSG"

# Update current status to error
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$MC_SUPABASE_URL/rest/v1/agent_status?agent_id=eq.$AGENT_ID" \
  -H "apikey: $MC_SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $MC_SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d "{\"status\": \"error\", \"current_task\": \"ERROR: $ERROR_MSG\", \"last_active_at\": \"now()\"}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -ne 204 ] && [ "$HTTP_CODE" -ne 200 ]; then
    echo "❌ Error: Failed to update agent_status (HTTP $HTTP_CODE)"
    echo "$BODY"
    exit 1
fi

# Log error to history
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$MC_SUPABASE_URL/rest/v1/agent_status_history" \
  -H "apikey: $MC_SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $MC_SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d "{\"agent_id\": \"$AGENT_ID\", \"status\": \"error\", \"task\": \"ERROR: $ERROR_MSG\"}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -ne 201 ]; then
    echo "⚠️  Warning: Failed to log error to agent_status_history (HTTP $HTTP_CODE)"
    echo "$BODY"
fi

echo "❌ $AGENT_ID marked as error: $ERROR_MSG"
