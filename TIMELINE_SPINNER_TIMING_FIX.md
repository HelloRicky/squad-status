# Timeline Spinner Timing Fix

**Date:** 2026-02-14  
**Branch:** dev  
**Commit:** 9613c10  
**Deploy URL:** https://dev.squad-status.pages.dev

## Problem

The loading spinner was appearing **after** the data had already been fetched, creating a poor user experience where:
1. User scrolls to bottom
2. Brief pause (while data loads)
3. Spinner appears momentarily
4. Content appears immediately

This happened because the spinner was rendered as part of `renderTimeline()`, which is called **after** the fetch completes.

## Solution

Reorganized the loading flow to show the spinner **before** fetching and hide it **after** rendering:

### Flow Diagram

**Before:**
```
1. isLoadingMore = true
2. Fetch data (spinner NOT visible)
3. renderTimeline() → spinner appears
4. isLoadingMore = false (spinner gone)
```

**After:**
```
1. isLoadingMore = true
2. showTimelineSpinner() → spinner visible
3. Fetch data (spinner STAYS visible)
4. renderTimeline() → data rendered
5. hideTimelineSpinner() → spinner removed
6. isLoadingMore = false
```

## Implementation

### New Helper Functions

#### `showTimelineSpinner(reset)`
- Shows spinner immediately when loading starts
- For initial load (reset=true): Replaces entire container with timeline line + spinner
- For pagination (reset=false): Appends spinner at bottom, removing any existing loader/end marker

```javascript
function showTimelineSpinner(reset = false) {
    const container = document.getElementById('timelineItems');
    
    if (reset) {
        container.innerHTML = `
            <div class="timeline-line"></div>
            <div id="timelineLoader" class="text-center py-6">
                <div class="timeline-spinner"></div>
            </div>
        `;
    } else {
        // Remove existing loader/end marker
        const existingLoader = document.getElementById('timelineLoader');
        const existingEnd = document.getElementById('timelineEnd');
        if (existingLoader) existingLoader.remove();
        if (existingEnd) existingEnd.remove();
        
        // Add spinner at bottom
        container.insertAdjacentHTML('beforeend', `
            <div id="timelineLoader" class="text-center py-6">
                <div class="timeline-spinner"></div>
            </div>
        `);
    }
}
```

#### `hideTimelineSpinner()`
- Removes the spinner after data is rendered

```javascript
function hideTimelineSpinner() {
    const loader = document.getElementById('timelineLoader');
    if (loader) {
        loader.remove();
    }
}
```

### Updated `fetchActivities()`

```javascript
async function fetchActivities(reset = false) {
    // ... validation ...
    
    isLoadingMore = true;
    
    // 1. Show spinner BEFORE fetch
    showTimelineSpinner(reset);
    
    try {
        // 2. Fetch data (spinner visible)
        const response = await fetch(...);
        const activities = await response.json();
        
        // 3. Render data
        renderTimeline(sortedActivities, reset);
        
        // 4. Hide spinner AFTER render
        hideTimelineSpinner();
    } catch (error) {
        showTimelineError(error.message);
    } finally {
        isLoadingMore = false;
    }
}
```

### Simplified `renderTimeline()`

Removed all spinner management logic from `renderTimeline()`. Now it only:
1. Renders timeline content
2. Adds "End of timeline" marker if `hasMoreActivities` is false

## User Experience

### Initial Load
1. User opens Timeline panel
2. **Spinner appears immediately**
3. Data fetches
4. Data renders
5. Spinner disappears

### Pagination (Scroll to Bottom)
1. User scrolls to 90%
2. **Spinner appears immediately at bottom**
3. More data fetches
4. New items render above spinner
5. Spinner disappears (or "End of timeline" appears)

### End of Timeline
When no more data is available:
- Spinner is hidden
- "End of timeline" marker appears

## Visual Consistency

The spinner remains visible throughout the entire loading process, providing clear feedback that work is happening. Users no longer see:
- Abrupt content jumps
- Late-appearing spinners
- Confusing "nothing is happening" moments

## Files Modified

- `index.html` - Added spinner helper functions, updated fetchActivities flow

## Testing Recommendations

1. **Initial load:** Open Timeline panel, verify spinner shows immediately
2. **Pagination:** Scroll to bottom, verify spinner appears before data loads
3. **End of timeline:** Keep scrolling, verify "End of timeline" replaces spinner
4. **Network throttling:** Use browser DevTools to slow network, confirm spinner stays visible during entire fetch

## Deployment

Automatically deployed via GitHub Actions to:
- **Dev environment:** https://dev.squad-status.pages.dev
- **Trigger:** Push to `dev` branch
- **Commit:** 9613c10
