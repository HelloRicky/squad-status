# Timeline Loading Spinner Feature

**Date:** 2026-02-14  
**Branch:** dev  
**Commit:** fe869a4  
**Deploy URL:** https://dev.squad-status.pages.dev

## Overview

Added a loading spinner that appears when the user scrolls to the bottom of the Timeline panel and more content is being loaded.

## Implementation Details

### 1. CSS Animation
Added a new `@keyframes spin` animation and `.timeline-spinner` class:
- Simple rotating spinner
- Purple/indigo theme matching timeline colors (`rgba(139, 92, 246, ...)`)
- Size: 28px (within 24-32px spec)
- Smooth 0.8s linear rotation

```css
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.timeline-spinner {
    width: 28px;
    height: 28px;
    border: 3px solid rgba(139, 92, 246, 0.2);
    border-top-color: rgba(139, 92, 246, 0.8);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto;
}
```

### 2. Loading State Integration
Updated `renderTimeline()` function to:
- Show spinner in `#timelineLoader` div when `hasMoreActivities` is true
- Hide spinner and show "End of timeline" message when no more content
- Centered below the last timeline item with proper padding

### 3. Behavior
- **Shows spinner when:** User scrolls to bottom (90%) AND `isLoadingMore` is true
- **Hides spinner when:** 
  - Load completes (`isLoadingMore` becomes false)
  - "End of timeline" is reached (`hasMoreActivities` is false)
- **Does not show:** When timeline has reached the end

## User Experience

1. User opens Timeline panel → sees initial 20 activities
2. User scrolls down → smooth scrolling
3. User reaches 90% scroll → spinner appears automatically
4. More content loads → spinner visible during fetch
5. Content appears → spinner updates if more content available
6. Reaches end → spinner replaced with "End of timeline" message

## Visual Design

- **Color:** Purple/indigo gradient (`rgba(139, 92, 246, ...)`)
- **Size:** 28px diameter
- **Style:** Circular border with rotating highlight
- **Position:** Centered, 24px vertical padding
- **Animation:** Smooth continuous rotation

## Testing

Manual testing recommended:
1. Open Timeline panel
2. Scroll to bottom
3. Verify spinner appears while loading
4. Verify smooth transition when content loads
5. Verify "End of timeline" appears when done

## Files Modified

- `index.html` - Added spinner CSS and updated render logic

## Deployment

Automatically deployed via GitHub Actions to:
- **Dev environment:** https://dev.squad-status.pages.dev
- **Trigger:** Push to `dev` branch
- **Status:** Deployment in progress (triggered by commit fe869a4)
