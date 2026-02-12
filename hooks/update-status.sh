#!/bin/bash
# Agent Status Update Hook
# Usage: ./update-status.sh <agent_id> <status> [task_description]

set -e

if [ -z "$MC_SUPABASE_URL" ] || [ -z "$MC_SUPABASE_SERVICE_KEY" ]; then
    echo "❌ Error: MC_SUPABASE_URL and MC_SUPABASE_SERVICE_KEY must be set"
    exit 1
fi

AGENT_ID=$1
STATUS=$2
TASK=$3

if [ -z "$AGENT_ID" ] || [ -z "$STATUS" ]; then
    echo "Usage: $0 <agent_id> <status> [task_description]"
    echo ""
    echo "Examples:"
    echo "  $0 linus working 'Deploying status page'"
    echo "  $0 linus idle"
    echo "  $0 linus error 'Database connection failed'"
    exit 1
fi

# Build JSON payload
if [ -z "$TASK" ]; then
    PAYLOAD="{\"status\": \"$STATUS\", \"current_task\": null, \"last_active_at\": \"now()\"}"
else
    # Escape quotes in task description
    TASK_ESCAPED=$(echo "$TASK" | sed 's/"/\\"/g')
    PAYLOAD="{\"status\": \"$STATUS\", \"current_task\": \"$TASK_ESCAPED\", \"last_active_at\": \"now()\"}"
fi

echo "Updating $AGENT_ID status to: $STATUS"
if [ -n "$TASK" ]; then
    echo "Task: $TASK"
fi

curl -X PATCH "$MC_SUPABASE_URL/rest/v1/agent_status?agent_id=eq.$AGENT_ID" \
  -H "apikey: $MC_SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $MC_SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d "$PAYLOAD"

echo ""
echo "✅ Status updated successfully"
