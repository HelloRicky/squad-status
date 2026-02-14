# Timeline Mobile Layout Fix

**Date:** 2026-02-14  
**Branch:** dev  
**Commit:** 2b19ec3  
**Deployment:** https://dev.squad-status.pages.dev

## Problem

The timeline mobile layout was using full-width stacked cards which took up too much vertical space and didn't match the desktop aesthetic.

**Before:**
- Mobile: Cards stacked full-width (centered)
- Desktop: Alternating left/right cards with centered timeline

## Solution

Applied the alternating left/right card layout to **all screen sizes** (including mobile), removing the mobile-specific override that centered cards.

**After:**
- Mobile: Alternating left/right cards (same as desktop)
- Desktop: Alternating left/right cards (unchanged)
- Both maintain centered vertical timeline line

## Changes Made

### 1. Removed Mobile Override
**File:** `index.html`

**Removed** the media query that forced mobile cards to center:
```css
/* OLD - Removed */
@media (max-width: 640px) {
    .timeline-item-container.left,
    .timeline-item-container.right {
        justify-content: center;
        padding-left: 1rem;
        padding-right: 1rem;
    }
}
```

### 2. Applied Alternating Layout to All Breakpoints
**Kept** the alternating left/right pattern for all screen sizes:
```css
/* Applied to ALL breakpoints */
.timeline-item-container.left {
    justify-content: flex-start;
    padding-right: 50%;
    padding-left: 0.75rem;
}

.timeline-item-container.right {
    justify-content: flex-end;
    padding-left: 50%;
    padding-right: 0.75rem;
}
```

### 3. Mobile-Specific Refinements
Added **tighter padding** for mobile to optimize space:
```css
@media (max-width: 640px) {
    .timeline-item-container.left {
        padding-right: 50%;
        padding-left: 0.5rem;
    }

    .timeline-item-container.right {
        padding-left: 50%;
        padding-right: 0.5rem;
    }
}
```

### 4. Responsive Card Sizing
Made cards **more compact** on mobile:
```css
@media (max-width: 640px) {
    .timeline-card {
        max-width: 100%;
        padding: 1rem;           /* Reduced from 1.25rem */
        border-radius: 0.75rem;  /* Reduced from 1rem */
    }
}
```

### 5. Kept Timeline Elements Visible
**Removed** the media query that hid connector dots and lines on mobile:
```css
/* OLD - Removed */
@media (max-width: 640px) {
    .timeline-connector { display: none; }
    .timeline-dot { display: none; }
}
```

Now the timeline dots and connector lines are **visible on all screen sizes**.

## Visual Improvements

### Mobile (< 640px)
- ✅ Alternating left/right cards
- ✅ Centered vertical timeline line
- ✅ Visible connector dots
- ✅ Visible connector lines
- ✅ Compact cards (45% width each side)
- ✅ Reduced padding (0.5rem)
- ✅ Smaller card padding (1rem)

### Desktop (≥ 640px)
- ✅ Alternating left/right cards (unchanged)
- ✅ Centered vertical timeline line
- ✅ Visible connector dots
- ✅ Visible connector lines
- ✅ Standard cards (max 280px width)
- ✅ Standard padding (0.75rem)
- ✅ Standard card padding (1.25rem)

## Result

The mobile timeline now has the **same alternating aesthetic** as desktop, just scaled down. This:
- **Reduces vertical space** usage on mobile
- **Maintains visual consistency** across all screen sizes
- **Keeps the elegant timeline design** with centered line and connector dots
- **Optimizes for smaller screens** with tighter spacing and compact cards

## Testing

Test on multiple mobile screen sizes:
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- Pixel 5 (393px)
- iPhone 12 Pro Max (428px)
- iPad Mini (768px)

All should show alternating left/right cards with visible timeline elements.

## Deployment

Changes are live on the dev branch at:  
**https://dev.squad-status.pages.dev**

Cloudflare Pages will automatically deploy this commit.
