#!/bin/bash
# Test Supabase connection and data

echo "🔍 Testing Supabase Connection..."
echo ""

if [ -z "$MC_SUPABASE_URL" ] || [ -z "$MC_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: MC_SUPABASE_URL and MC_SUPABASE_ANON_KEY must be set"
    exit 1
fi

echo "✅ Environment variables found"
echo "   URL: ${MC_SUPABASE_URL:0:40}..."
echo "   Key: ${MC_SUPABASE_ANON_KEY:0:30}..."
echo ""

echo "📊 Fetching agent status..."
echo ""

RESPONSE=$(curl -s "$MC_SUPABASE_URL/rest/v1/agent_status?order=agent_id.asc" \
  -H "apikey: $MC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $MC_SUPABASE_ANON_KEY")

# Check if response contains error
if echo "$RESPONSE" | grep -q "\"code\":"; then
    echo "❌ Error from Supabase:"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
    echo ""
    echo "💡 Make sure you've run the SQL setup from README.md"
    exit 1
fi

# Pretty print the response
if command -v jq &> /dev/null; then
    echo "$RESPONSE" | jq -r '.[] | "  \(.agent_id | ljust(12)) | \(.status | ljust(8)) | \(.current_task // "—")"'
    echo ""
    echo "✅ Connection successful! Found $(echo "$RESPONSE" | jq '. | length') agents"
else
    echo "$RESPONSE"
    echo ""
    echo "✅ Connection successful!"
    echo "   (install jq for prettier output: apt install jq)"
fi

echo ""
echo "🌐 You can now open index.html in a browser to test the UI"
