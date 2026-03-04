# Project-Specific Rules & Screenshot Configuration

This document defines the extension mechanism for framework-specific checks and screenshot/viewport configuration.

---

## Project-Specific Rules

The skill supports an optional extension mechanism for framework-specific or brand-specific checks. These are provided by the user at invocation time or defined in a project config file.

### Format

```yaml
project-rules:
  - id: PSR-1
    name: "Shadcn Component Usage"
    category: K  # Maps to Component Fidelity
    severity: MAJOR
    description: "Badge must use Shadcn Badge component with variant prop, not custom CSS classes."
    check: "Look for .status-badge, .badge-healthy, .badge-warning CSS classes — these are deprecated."

  - id: PSR-2
    name: "CSS Variable Usage"
    category: T  # Maps to Token Drift
    severity: MINOR
    description: "Colors must be referenced via CSS custom properties, never hardcoded hex values."
    check: "Scan for hardcoded color hex values in inline styles and <style> blocks."

  - id: PSR-3
    name: "Brand Compliance"
    category: T
    severity: BLOCKER
    description: "Primary brand color must be exactly #E84D26 (oklch(0.577 0.188 26.53))."
    check: "Verify --primary token value matches brand guide."
```

### Processing

- Project-specific rules are evaluated during Phase 4 (Bi-directional Comparison).
- Findings are tagged with the mapped category prefix + a `[PSR-{id}]` annotation.
- Example finding ID: `T14 [PSR-2]` — Token Drift finding triggered by project-specific rule PSR-2.

### Category Mapping

| `category` value | Maps to | Description |
|---|---|---|
| `T` | Token Drift | Color, spacing, radius, shadow, transition values |
| `Y` | Typography Mismatch | Font properties |
| `K` | Component Fidelity | Component structure, variants, anatomy |
| `L` | Layout Deviation | Grid, dimensions, spacing |
| `I` | State & Interaction | Hover, focus, disabled, transitions |
| `R` | Responsive Mismatch | Breakpoint behavior |
| `U` | Undocumented Pattern | Patterns not in UX spec |
| `S` | Visual Scope Creep | Beyond UX scope |
| `M` | Mock Self-Validation | Internal contradictions |

---

## Screenshot Configuration

### Default Viewports

| Name | Width | Height | Device Scale | When |
|------|-------|--------|-------------|------|
| Desktop | 1440 | 900 | 1x | Always |
| Tablet | 768 | 1024 | 1x | If UX defines responsive breakpoints |
| Mobile | 375 | 812 | 2x | If UX defines responsive breakpoints |

### Override from UX Spec

If the UX document defines specific breakpoints (e.g., `≤ 1280px`, `≤ 1100px`), use those exact widths:

```
Desktop: max-content-width or 1440 (whichever UX spec implies)
Breakpoint 1: 1280 × 900
Breakpoint 2: 1100 × 900
Tablet: 768 × 1024
Mobile: 375 × 812
```

### Puppeteer Options

```javascript
// Browser launch
{
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  defaultViewport: null
}

// Page navigation
{
  waitUntil: 'networkidle0',  // Ensure fonts + async assets load
  timeout: 30000
}

// Screenshot capture
{
  fullPage: true,
  type: 'png',
  captureBeyondViewport: true
}
```

### Fallback (No Puppeteer)

If Puppeteer is unavailable and cannot be installed:
1. Skip Phases 1 (Screenshot Capture), 5 (Runtime Analysis), and 12 (Visual Audit Pages).
2. Note in analysis.md executive summary: `Screenshots: unavailable (Puppeteer not found)`.
3. All other phases proceed normally — HTML source analysis still produces full audit.
4. Visual Audit pages are not generated.
5. Coverage heatmap still generated from HTML analysis.
