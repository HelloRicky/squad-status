# Timeline Migration to agent_status_history

## Summary
Successfully migrated the Squad Status Timeline from the legacy `activities` table to the new `agent_status_history` table.

## Changes Made

### Database Migration
- **Old Table:** `activities`
  - Fields: `agent_name`, `activity_type`, `description`, `created_at`
  
- **New Table:** `agent_status_history`
  - Fields: `agent_id`, `status`, `task`, `started_at`, `ended_at`

### Code Updates (index.html)

#### 1. Updated fetchActivities() function
- Changed query from `activities` table to `agent_status_history`
- Simplified data fetching (removed dual query for current + historical)
- Now fetches 50 most recent items in a single query
- Added filtering to only show activities with task descriptions
- Marks activities with `ended_at = null` as "LIVE"

#### 2. Field Mappings
| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `agent_name` | `agent_id` | Mapped to display names via `agentNameMap` |
| `activity_type` | `status` | Used to determine activity state |
| `description` | `task` | Activity/task description |
| `created_at` | `started_at` | When activity started |
| N/A | `ended_at` | When activity ended (null = ongoing) |

#### 3. Display Logic
- **LIVE Activities**: Shows "🔴 LIVE" badge for `ended_at = null`
- **In Progress**: Shows "⏳ In Progress" for ongoing tasks
- **Completed**: Shows "✅ Completed" for finished tasks
- **Duration**: Calculated from `started_at` to `ended_at` (or shows "ongoing")

## Deployment

- **Branch:** `dev`
- **Commit:** `9682cc4` - "Update Timeline to use agent_status_history table"
- **Deployed to:** https://dev.squad-status.pages.dev
- **Status:** ✅ Successfully deployed (HTTP 200)

## Testing

To test the new timeline:
1. Visit https://dev.squad-status.pages.dev
2. Click the "Timeline" button in the header
3. Verify:
   - Timeline loads from `agent_status_history`
   - Activities show agent_id → status → task format
   - Duration is calculated correctly
   - LIVE activities are highlighted with red badge
   - Completed activities show green badge

## Database Schema Reference

```sql
-- agent_status_history table
CREATE TABLE agent_status_history (
  agent_id TEXT NOT NULL,      -- e.g., "ducki", "pixel"
  status TEXT NOT NULL,         -- "working", "idle", "error"
  task TEXT,                    -- Task description (nullable)
  started_at TIMESTAMP NOT NULL,-- When this status started
  ended_at TIMESTAMP            -- When it ended (NULL = current)
);
```

## Next Steps

1. ✅ Code updated
2. ✅ Committed to dev branch
3. ✅ Deployed to dev environment
4. ⏳ Test timeline functionality
5. ⏳ Monitor for any issues
6. ⏳ Merge to main when validated

## Notes

- The old `activities` table is not used anymore by the Timeline
- Agent names are mapped from `agent_id` using the existing `agentNameMap`
- Timeline now supports showing duration for completed tasks
- Infinite scroll removed (now loads 50 items at once for simplicity)
