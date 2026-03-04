# Puppeteer Runtime Analysis — Detailed Phase Reference

This document contains detailed instructions for Phase 5 (Runtime Analysis), Phase 6 (Cross-Page Puppeteer), and Phase 7 (Self-Validation Puppeteer). It is loaded on-demand when Puppeteer is available.

---

## Phase 5 — Runtime Analysis Engine

**Purpose:** Use Puppeteer's browser engine to programmatically extract computed styles, verify rendered values, test interactive states, and measure actual layout — detecting issues invisible in HTML source analysis.

**Why this matters:** Reading CSS source tells you what the developer *intended*. Puppeteer tells you what the browser *actually rendered* after cascade, specificity, inheritance, fallbacks, and runtime behavior.

All checks run inside `page.evaluate()` and return structured JSON. Screenshots are taken as **evidence**, not as the primary analysis tool.

### 5A — Computed Token Extraction

Run `scripts/runtime-audit.js` — the `tokens` section.

For each design token in UX spec, extract the actual rendered value via `getComputedStyle`. Compare against expected value using canvas-based color normalization.

**What this catches that source analysis cannot:**
- CSS variable resolved to wrong value after `:root` override
- Specificity conflict: a more specific rule overrides the token
- Inherited values that cascade differently than expected
- `oklch()` / `hsl()` / `rgb()` resolved values differ from expected hex
- Hardcoded value that *happens* to match — still flagged as not using the variable

### 5B — Font Loading Verification

Run `scripts/runtime-audit.js` — the `fonts` section.

Uses `document.fonts.check()` to verify fonts are actually loaded (not just declared). Extracts the primary rendered font for each element to detect fallback usage.

**What this catches:**
- Google Font failed to load → fell back to system font. **Only detectable at runtime.**
- Font weight 600 not loaded → browser synthesizes bold
- Italic variant not loaded → browser synthesizes italic
- Unexpected fonts loaded (undocumented font-face declarations)

### 5C — Interactive State Capture

Run `scripts/runtime-audit.js` — the `states` section.

Uses `page.hover()`, `page.focus()` to programmatically trigger states. Captures computed styles in resting, hover, and focus states. Takes evidence screenshots of state changes.

**What this catches:**
- Hover state missing — no visual change when UX spec defines one
- Hover state wrong — shadow or color changes to wrong value
- Focus ring missing — critical accessibility: no visible focus indicator
- Cursor wrong — interactive element doesn't show `pointer` cursor
- Transition missing — state changes instantly when spec says `0.15s ease`
- Evidence screenshots saved to `screenshots/states/`

### 5D — Layout Measurement

Run `scripts/runtime-audit.js` — the `layout` section.

Uses `getBoundingClientRect()` and `getComputedStyle()` to measure actual rendered dimensions, padding, margin, grid, and overflow state.

**What this catches:**
- Sidebar is 256px, not 220px — margin set by framework default
- Grid resolves to `repeat(3, 1fr)` instead of `repeat(4, 1fr)` due to container query
- Padding collapsed by margin: actual gap is 16px not 24px
- **Content overflow** — text or elements bleeding outside their container
- Z-index stacking: modal below header instead of above

### 5E — Responsive Behavior Testing

Run `scripts/runtime-audit.js` — the `responsive` section.

Programmatically resizes viewport with `page.setViewport()`, waits for reflow, then re-measures target elements. Takes screenshots at each breakpoint.

**What this catches:**
- Grid doesn't collapse from 4-col to 2-col at ≤1280px — **measured, not guessed from CSS**
- Element that should stack vertically on mobile stays horizontal
- Element that should hide on mobile is still visible
- Font size doesn't adjust at breakpoint
- **Actual reflow behavior** — where elements actually end up after resize

### 5F — Transition & Animation Verification

Run `scripts/runtime-audit.js` — the `transitions` section.

Extracts `transitionProperty`, `transitionDuration`, `transitionTimingFunction` from computed styles and compares against UX spec values.

### 5G — Color Contrast Audit (conditional)

Run `scripts/contrast-audit.js`.

**Trigger:** UX spec mentions WCAG, accessibility, contrast ratios, OR defines foreground/background color token pairs.

Calculates actual contrast ratios using WCAG 2.1 relative luminance formula. Traverses DOM to find effective background color (walks up parent chain). Checks both AA and AAA thresholds.

**Finding classification:**
- `CONTRAST_FAIL_AA` → T (Token Drift) severity BLOCKER
- `CONTRAST_FAIL_AAA` → T (Token Drift) severity MINOR

**Contrast Scorecard** (added to analysis.md Part 3):

| Token Pair | Foreground | Background | Ratio | AA (4.5:1) | AAA (7:1) | Usage |
|------------|-----------|------------|-------|------------|-----------|-------|

### 5H — Dark Mode / Theme Verification (conditional)

Run `scripts/dark-mode-audit.js`.

**Trigger:** UX spec defines dark mode tokens, `prefers-color-scheme` behavior, `data-theme` attribute, or multiple color scheme definitions.

Uses `page.emulateMediaFeatures()` to toggle theme. Re-verifies all tokens and runs contrast check in dark mode. Takes dark mode screenshot for visual comparison.

**What this catches:**
- Dark mode defined but tokens don't change when theme toggles
- Dark mode contrast ratios fail (text barely visible on dark background)
- Components don't respond to theme change (hardcoded colors)

**Finding classification:**
- Token doesn't change → T with note `[Dark Mode]`
- Dark mode contrast failure → T with note `[Dark Mode — Contrast]`

### 5I — Component Runtime Validation (conditional)

Run `scripts/component-validation.js`.

**Trigger:** Phase 2 produced non-empty C1 (Component Registry) or C2 (Sub-Component Map).

Validates composite component structure, sub-component presence/order, state rendering, and visual behaviors (truncation, scroll, max-size, skeleton) using live DOM inspection.

**Config format for `componentSpecs`:**
```javascript
{
  name: 'DataTable',
  selector: '.data-table',
  subComponents: [
    { name: 'TableHeader', selector: 'thead', required: true, expectedPosition: 'first' },
    { name: 'Pagination', selector: '.pagination', required: false, expectedPosition: 'last' }
  ],
  states: [
    { name: 'loading', visibleInDOM: '.skeleton', required: false },
    { name: 'empty', visibleInDOM: '.empty-state', required: false }
  ],
  behaviors: [
    { name: 'cell-truncation', type: 'truncation', selector: 'td' },
    { name: 'body-scroll', type: 'scroll', selector: 'tbody' },
    { name: 'max-height', type: 'maxSize', selector: '.table-wrapper', maxHeight: 600 }
  ]
}
```

**Result mapping:**

| Finding Type | Maps To | Example |
|---|---|---|
| `COMPONENT_MISSING` | K (Component Fidelity) | `K4 [Runtime] Component "DataTable" not found in DOM` |
| `SUBCOMPONENT_MISSING` | K (Component Fidelity) | `K5 [Runtime] Required sub-component "Pagination" missing` |
| `SUBCOMPONENT_ORDER` | K (Component Fidelity) | `K6 [Runtime] "TableHeader" at wrong position` |
| `STATE_NOT_RENDERED` | I (State/Interaction) | `I7 [Runtime] State "loading" indicator not found` |
| `BEHAVIOR_MISSING` | K (Component Fidelity) | `K8 [Runtime] Text truncation missing on .cell-content` |
| `BEHAVIOR_EXCEEDED` | L (Layout) | `L5 [Runtime] .table-wrapper height exceeds max` |

---

## Phase 5 Output Classification

All findings are tagged `[Runtime — Puppeteer]`:

| Check | Category | Example |
|-------|----------|---------|
| Token computed value mismatch | T | `T7 [Runtime] --primary resolves to #e84d27, expected #E84D26` |
| Font not loaded / fallback | Y | `Y4 [Runtime] Playfair Display not loaded, rendering as Georgia` |
| Hover state missing | I | `I2 [Runtime] .metric-card has no hover shadow change` |
| Focus ring missing | I | `I5 [Runtime] input:focus has no visible outline` |
| Width mismatch | L | `L3 [Runtime] .sidebar actual width 256px, spec says 220px` |
| Content overflow | L | `L8 [Runtime] .table-container has horizontal overflow` |
| Grid doesn't collapse | R | `R1 [Runtime] .metrics-grid still 4-col at 1280px` |
| Transition wrong | I | `I9 [Runtime] .card transition is 0.3s, spec says 0.15s` |
| Undocumented font | U | `U3 [Runtime] Font "Roboto" loaded but not in UX spec` |
| Contrast fails AA | T | `T12 [Runtime — Contrast] ratio 2.8:1, needs 4.5:1` |
| Dark mode token unchanged | T | `T15 [Runtime — Dark Mode] --background still #F5F3F0` |

Evidence screenshots saved to `screenshots/states/` and `screenshots/dark-mode/`.

---

## Phase 6 — Cross-Page Consistency (Puppeteer complement)

Run `scripts/cross-page-consistency.js`.

Extract computed styles of the **same component selector** across different pages and diff them. This catches inconsistencies that source analysis misses because the same CSS class can resolve to different computed values depending on page context.

**Properties compared:** width, height, backgroundColor, color, fontFamily, fontSize, fontWeight, padding, margin, borderRadius, boxShadow, gap, gridTemplateColumns.

**What this catches:**
- Sidebar is 220px on Directory page but 240px on Profile page
- `.metric-card` has `border-radius: 12px` on one page and `8px` on another
- Font size differs due to page-specific override
- Background color changes between pages due to specificity conflict

---

## Phase 7 — Mock Self-Validation (Puppeteer complement)

### Parts A & B: Data & Navigation Validation

Run `scripts/self-validation.js`.

Automates count validation, dead link detection, percentage sums, state contradictions, and overflow detection.

**What this catches:**
- Header claims "47 resources" but table only has 45 `<tr>` elements
- Anchor link `#section-details` points to nonexistent element
- Badge says "Active" but has `opacity: 0.3`
- Table container overflows horizontally with no scroll handler

### Part C: Semantic HTML Validation (conditional)

Run `scripts/semantic-html-audit.js`.

**Condition:** Execute ONLY if UX spec defines component specifications that imply specific HTML elements, OR mentions accessibility/semantic HTML/ARIA.

**Checks:**
1. **Interactive elements:** `<div onclick>` should be `<button>` or `<a>`
2. **role="button"** without keyboard support (tabindex + key handler)
3. **Heading hierarchy:** skipped levels, multiple/missing `<h1>`
4. **Landmark regions:** `<main>`, `<nav>`, `<header>`, `<footer>`
5. **Form inputs** without associated `<label>` or `aria-label`
6. **Images** missing `alt` attributes

**What this catches:**
- `<div onclick="...">` used instead of `<button>`
- Heading hierarchy skips from `<h1>` to `<h3>`
- No `<main>` landmark wrapping primary content
- Form inputs without labels
- Images without alt text
- `role="button"` on `<div>` without keyboard support
