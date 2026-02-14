# Timeline: Pin LIVE Tasks to Top

**Date:** 2025-02-14  
**Status:** ✅ Completed  
**Deployment:** https://dev.squad-status.pages.dev

## Requirement

Pin currently LIVE tasks (ended_at = NULL) to the top of the timeline, with completed tasks appearing below in chronological order.

## Implementation

### Changes Made

Modified `index.html` - `fetchActivities()` function:

1. **Separate LIVE and completed activities:**
   ```javascript
   // Separate LIVE and completed activities
   const liveActivities = processedActivities.filter(a => a.is_live);
   const completedActivities = processedActivities.filter(a => !a.is_live);
   
   // Combine: LIVE first (sorted by started_at desc), then completed (sorted by started_at desc)
   const sortedActivities = [...liveActivities, ...completedActivities];
   ```

2. **Render order:**
   - LIVE tasks appear at the top (already have green pulse animation)
   - Completed tasks follow in chronological order (newest first)
   - When a LIVE task completes (ended_at gets set), it naturally moves to its chronological position

### Visual Indicators

- **LIVE tasks:** Green pulsing glow + "LIVE" label (existing styling)
- **Completed tasks:** Standard styling with duration displayed

### User Experience

1. Open timeline panel
2. LIVE tasks are always visible at the top
3. As you scroll down, you see completed tasks in reverse chronological order
4. When a LIVE task completes, on next refresh it moves to its proper chronological position

## Deployment

- **Commit:** 9c580b7
- **Branch:** dev
- **URL:** https://dev.squad-status.pages.dev
- **Auto-deploy:** GitHub Actions triggered on push to dev

## Testing

To verify:

1. Visit https://dev.squad-status.pages.dev
2. Click "Timeline" button
3. Start a task using hooks: `./hooks/agent-start.sh pixel "Test task"`
4. Verify the task appears at the top with green pulse and "LIVE" label
5. Complete the task: `./hooks/agent-done.sh pixel`
6. Refresh timeline and verify it moves to chronological position

## Related

- TIMELINE_REDESIGN.md - Icon on timeline, task above line, time below line
- TIMELINE_FEATURE.md - Original timeline implementation
