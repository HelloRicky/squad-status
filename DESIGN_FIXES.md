# Design Fixes for SvelteKit Migration

## Issues Identified

### 1. **Typography Hierarchy** ❌
- Agent names need to be larger and bolder (1.25rem / 700 weight)
- Task descriptions should be 0.875rem
- Role/metadata should be 0.75rem
- Missing distinct visual hierarchy

### 2. **Color Contrast** ❌
- Timestamps too dim (should be slate-300 #cbd5e1 for better contrast)
- Secondary text needs better contrast ratios (4.5:1 minimum)
- Stale timestamps should use lighter red (#fca5a5 instead of #EF4444)

### 3. **Border Treatments** ❌
- Working status should have 2px solid border (not 1px)
- Missing breathing animation border glow effect
- Border colors not matching status properly

### 4. **Avatar Sizing** ❌
- Card view: 4rem (64px) on desktop, 3.5rem (56px) on mobile
- Compact view: 2.5rem (40px)
- Table view: 3rem (48px)
- Currently inconsistent

### 5. **Status Indicators** ❌
- Should be 16px × 16px (w-4 h-4), currently w-3 h-3
- Missing shape variations (circle for working, square for idle, triangle for error)
- Missing accessibility improvements

### 6. **Spacing & Padding** ❌
- Card padding: 1.5rem (p-6) for normal, 0.75rem (p-3) for compact
- Agent card hover should scale to 1.05
- Gap between cards should be 1rem in card view

### 7. **Missing Visual Effects** ❌
- Click arrow indicator on hover
- Breathing border animation for working status
- Pulse glow animation on status dots
- Stale agent opacity treatment (0.85 for warning, 0.6 for critical)

### 8. **Font Weight Issues** ❌
- Agent names should be font-bold (700), currently might be lighter
- Status text should be font-medium (500)

## Fixes Applied
- [ ] Typography hierarchy corrected
- [ ] Color contrast improved
- [ ] Border treatments fixed
- [ ] Avatar sizing standardized
- [ ] Status indicators enlarged and shaped
- [ ] Spacing normalized
- [ ] Visual effects restored
- [ ] Font weights corrected
