# Timeline Day Tags Bug Fix

## Date: 2026-02-14

## Problem
When scrolling down in the Timeline and loading more events via pagination, duplicate day tags ("Today", "Yesterday", or date labels) were appearing even though the events continued from the same day.

## Root Cause
The `groupActivitiesByDay()` and `renderTimeline()` functions were operating in isolation for each pagination fetch. The day grouping logic reset on each load, causing the same date labels to be rendered multiple times when new activities from an already-displayed day were loaded.

## Solution Implemented

### Changes Made
1. **Added global state tracking** (`displayedDates` Set):
   ```javascript
   let displayedDates = new Set(); // Track which day tags we've already shown
   ```

2. **Reset tracker on Timeline open**:
   - Clear `displayedDates` when Timeline is opened to ensure fresh state

3. **Conditional day node rendering**:
   - Modified `renderTimeline()` to check if a date has already been displayed
   - Only render day node if `!displayedDates.has(dateKey)`
   - Add date to the Set after rendering: `displayedDates.add(dateKey)`

4. **Proper item index tracking**:
   - When appending (not resetting), calculate `itemIndex` from existing timeline items
   - Ensures correct left/right alternation across pagination boundaries

### Code Changes
**File**: `index.html`

**Lines Modified**:
- Added `displayedDates` Set to timeline state (~line 42)
- Clear Set in `toggleTimeline()` when opening (~line 1037)
- Updated `renderTimeline()` to check Set before rendering day nodes (~line 1073-1078)

## Testing
- ✅ Day tags only appear once per day
- ✅ Loading more events from same day does not repeat the day tag
- ✅ New day tags appear when date changes
- ✅ Timeline panel opens/closes correctly
- ✅ Alternating left/right positioning maintained across pagination

## Deployment
- **Commit**: `6492256`
- **Branch**: `dev`
- **URL**: https://dev.squad-status.pages.dev
- **Status**: ✅ Deployed and verified

## Impact
Users can now scroll through the Timeline without seeing confusing duplicate date labels. The timeline experience is cleaner and more professional.
