# Timeline Infinite Scroll Bug Fix

## Problem
When users scrolled to the end of the timeline, the page would hang because:
- The `fetchActivities()` function wasn't using pagination
- It always fetched the same 50 records with no offset
- `hasMoreActivities` never became `false` when there were 50+ total records
- This caused infinite fetching of the same data

## Solution
Implemented proper pagination using Supabase's Range header:

### 1. Added Pagination
- Changed page size from 50 to 20 items for smoother loading
- Used `Range` header: `${rangeStart}-${rangeEnd}` for pagination
- Properly incremented `timelineOffset` by actual fetched count

### 2. End Detection
- Set `hasMoreActivities = false` when fewer items than `pageSize` are returned
- This correctly detects when there's no more data

### 3. End of Timeline Indicator
- Added visual "End of timeline" message with checkmark icon
- Shows when `hasMoreActivities` is false
- Prevents confusion and provides closure

## Technical Changes

**Before:**
```javascript
const response = await fetch(
    `${SUPABASE_URL}/rest/v1/agent_status_history?select=*&order=started_at.desc&limit=50`,
    { headers: { ... } }
);
```

**After:**
```javascript
const pageSize = 20;
const rangeStart = timelineOffset;
const rangeEnd = timelineOffset + pageSize - 1;

const response = await fetch(
    `${SUPABASE_URL}/rest/v1/agent_status_history?select=*&order=started_at.desc`,
    { 
        headers: { 
            'Range': `${rangeStart}-${rangeEnd}`,
            ...
        } 
    }
);
```

## Testing
To verify the fix:
1. Open https://dev.squad-status.pages.dev
2. Click Timeline
3. Scroll to the bottom
4. Verify:
   - No hanging/infinite loading
   - "End of timeline" message appears
   - No console errors

## Deployment
- Committed: cb8595b
- Branch: dev
- Live at: https://dev.squad-status.pages.dev
