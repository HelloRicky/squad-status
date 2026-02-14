# Timeline Right-Side Alignment Fix

**Date:** 2026-02-14  
**Branch:** `dev`  
**Deployed:** https://dev.squad-status.pages.dev

## Problem

Right-side timeline content was positioned higher than the horizontal line, while left-side content was correctly aligned. This created a visual inconsistency where:

- Left side: Content aligned AT or BELOW the horizontal line ✓
- Right side: Content appeared ABOVE the horizontal line ✗
- Profile icons were not vertically centered with content

## Root Cause

The issue was in the CSS grid alignment:

```css
/* BEFORE - Incorrect */
.timeline-item-container {
    align-items: start;  /* All items aligned to TOP */
    /* ... */
}

.timeline-icon-container {
    padding-top: 0.5rem;  /* Icon pushed DOWN */
    /* ... */
}
```

This caused:
1. Content wrappers (left & right) started at the TOP of the grid row
2. Icon container also started at TOP but had extra padding pushing it DOWN
3. Horizontal line calculated from icon's center, creating misalignment

## Solution

Changed grid alignment from `start` to `center` and removed unnecessary padding:

```css
/* AFTER - Correct */
.timeline-item-container {
    align-items: center;  /* All items vertically centered */
    /* ... */
}

.timeline-icon-container {
    /* Removed padding-top */
    /* ... */
}
```

Now all grid items (left content, icon, right content) are vertically centered together, ensuring:
- Horizontal line is at consistent vertical position across both sides
- Content (task + timestamp) aligns properly with the line
- Profile icon is vertically centered with content

## Changes Made

**File:** `index.html`

1. Changed `.timeline-item-container` from `align-items: start` to `align-items: center`
2. Removed `padding-top: 0.5rem` from `.timeline-icon-container`

## Testing

✅ Deployed to dev environment: https://dev.squad-status.pages.dev  
✅ Both left and right timeline items now align consistently  
✅ Horizontal lines at same vertical position  
✅ Profile icons centered with content  

## Commit

```
commit 1762813
Fix timeline right-side alignment by centering grid items

- Changed align-items from 'start' to 'center' on timeline-item-container
- Removed padding-top from timeline-icon-container
- Now both left and right content align properly with horizontal line
```
