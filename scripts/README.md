# Agent Status Wrapper Scripts

Independent scripts for automatic agent status tracking in Mission Control.

## Overview

These scripts handle pre-hook and post-hook status updates automatically, regardless of workflow orchestration. They interact directly with Supabase to track agent activity in real-time.

## Scripts

### 1. `spawn-agent.sh` — Start Task Hook

Marks an agent as "working" and logs the task to history.

**Usage:**
```bash
./spawn-agent.sh <agent_id> <task_description>
```

**Example:**
```bash
./spawn-agent.sh linus "Deploy to Cloudflare"
```

**What it does:**
- Updates `agent_status` table: sets status to "working", stores task description
- Creates new entry in `agent_status_history` with start timestamp
- Validates environment variables before execution
- Returns error if update fails

---

### 2. `agent-done.sh` — Completion Hook

Marks an agent as "idle" and closes the current history record.

**Usage:**
```bash
./agent-done.sh <agent_id>
```

**Example:**
```bash
./agent-done.sh linus
```

**What it does:**
- Updates `agent_status` table: sets status to "idle", clears current_task
- Closes open history record by setting `ended_at` timestamp
- Validates environment variables before execution
- Returns error if update fails

---

### 3. `agent-error.sh` — Error Hook

Marks an agent in error state with a descriptive message.

**Usage:**
```bash
./agent-error.sh <agent_id> <error_message>
```

**Example:**
```bash
./agent-error.sh linus "Database connection failed"
```

**What it does:**
- Updates `agent_status` table: sets status to "error", stores error message
- Creates new entry in `agent_status_history` with error details
- Validates environment variables before execution
- Returns error if update fails

---

## Requirements

### Environment Variables

Both scripts require the following environment variables:

```bash
export MC_SUPABASE_URL="https://your-project.supabase.co"
export MC_SUPABASE_SERVICE_KEY="your-service-role-key"
```

### Permissions

Scripts must be executable:
```bash
chmod +x *.sh
```

## Error Handling

All scripts include:
- Argument validation
- Environment variable checks
- HTTP response code validation
- Descriptive error messages
- Non-zero exit codes on failure

## Testing

Test the complete workflow:

```bash
# Start a task
./spawn-agent.sh linus "Test workflow"

# Verify status
curl -s "$MC_SUPABASE_URL/rest/v1/agent_status?agent_id=eq.linus" \
  -H "apikey: $MC_SUPABASE_SERVICE_KEY" | jq '.[] | .status'

# Complete the task
./agent-done.sh linus

# Or mark as error
./agent-error.sh linus "Something went wrong"
```

## Integration

These scripts can be used:
- Standalone for manual agent tracking
- In CI/CD pipelines
- As pre/post hooks in workflow orchestration
- By other automation tools

## Database Schema

Requires these Supabase tables:

**agent_status:**
- `agent_id` (text, primary key)
- `agent_name` (text)
- `status` (text: idle|working|error)
- `current_task` (text, nullable)
- `last_active_at` (timestamp)

**agent_status_history:**
- `id` (uuid, primary key)
- `agent_id` (text, foreign key)
- `status` (text)
- `task` (text, nullable)
- `started_at` (timestamp, default: now())
- `ended_at` (timestamp, nullable)
