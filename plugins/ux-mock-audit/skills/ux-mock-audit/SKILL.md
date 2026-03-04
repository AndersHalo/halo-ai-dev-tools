---
name: ux-mock-audit
description: "Bi-directional audit of a UX Design System document against HTML mock implementations. Captures screenshots via Puppeteer, compares rendered output against design specs, and produces: markdown report, annotated HTML, visual-audit screenshot overlays, and interactive coverage heatmap."
---

# UX Design System vs. Mock Audit

## When to Use

1. A UX design-system document exists and HTML mocks have been built from it.
2. You need to verify that mocks faithfully implement the design tokens, typography, components, layout, states, and responsive behavior defined in the UX spec.
3. You want a visual audit with **screenshots** showing exactly what the mock renders.
4. You need bi-directional traceability: UX → Mock (is it implemented?) and Mock → UX (is it documented?).
5. You want to compare a new audit against a previous one (delta / regression mode).
6. You want to validate mock internal consistency (data, flow, cross-page).

## Inputs

| # | Input | Required | Description |
|---|-------|----------|-------------|
| 1 | **UX Design System file** | Yes | Markdown (or similar) document specifying design tokens, typography, components, layout, states, responsive behavior. |
| 2 | **HTML mock file(s)** | Yes | One or more `.html` files implementing the design system. |
| 3 | **Project-specific rules** | No | Optional YAML/Markdown block defining framework-specific checks. See [project-rules.md](project-rules.md). |
| 4 | **Previous audit folder** | No | For delta mode — path to a previous `docs/audit/ux/{name}/` folder. |

## Output Structure

All outputs are written to a single folder:

```
docs/audit/ux/{analysis_name}/
├── analysis.md                          # Main markdown report
├── screenshots/
│   ├── desktop/                         # Default viewport (1440 × 900)
│   ├── tablet/                          # 768 × 1024 (if UX defines responsive)
│   └── mobile/                          # 375 × 812 (if UX defines responsive)
├── visual-audit/
│   ├── {page-name}-visual-audit.html    # Screenshot + overlay annotations
├── annotated/
│   ├── {page-name}-annotated.html       # Code-level annotated HTML
└── coverage-heatmap.html                # Interactive coverage grid
```

**Naming convention for `{analysis_name}`:** kebab-case.
Pattern: `[ux-title]-[YYYY-MM-DD]`. Example: `halo-design-system-2026-03-04`.

---

## Finding Categories (11 + 1 Report-Only)

### Direction A — UX → Mock (Spec not implemented or wrong)

| Cat | Prefix | Color | Hex | Description |
|-----|--------|-------|-----|-------------|
| Token Drift | T | Red | `#ef4444` | Design token value in mock does not match UX spec |
| Typography Mismatch | Y | Blue | `#3b82f6` | Font family, size, weight, line-height deviates from UX type scale |
| Component Fidelity | K | Orange | `#f97316` | Component markup, anatomy, hierarchy, or variant deviates from UX spec |
| Layout Deviation | L | Purple | `#8b5cf6` | Grid, dimensions, padding, alignment does not match UX layout |
| State & Interaction Gap | I | Amber | `#f59e0b` | Interactive state defined in UX but absent/wrong in mock |
| Responsive Mismatch | R | Teal | `#14b8a6` | Breakpoint behavior defined in UX not reflected in mock |

### Direction B — Mock → UX (Implemented but not documented)

| Cat | Prefix | Color | Hex | Description |
|-----|--------|-------|-----|-------------|
| Undocumented Pattern | U | Green | `#10b981` | Mock implements patterns not in UX — candidates to add to design system |
| Visual Scope Creep | S | Rose | `#f43f5e` | Mock introduces elements or interactions beyond UX scope |
| Placeholder Content | P | Gray | `#9ca3af` | Temporary content: stock images, lorem ipsum, hardcoded data |

### Cross-cutting

| Cat | Prefix | Color | Hex | Description |
|-----|--------|-------|-----|-------------|
| Cross-Page Inconsistency | X | Violet | `#7c3aed` | Same component renders differently across mock pages |
| Mock Self-Validation | M | Cyan | `#06b6d4` | Mock contradicts itself: data mismatches, dead-end flows, orphan elements |

### Report-Only

| Cat | Prefix | Color | Hex | Description |
|-----|--------|-------|-----|-------------|
| UX Spec Issue | E | Indigo | `#6366f1` | UX document internal contradiction. NOT annotated on HTML — analysis.md only. |

---

## Severity Levels

| Level | Meaning | Guideline |
|-------|---------|-----------|
| **BLOCKER** | Building to mock spec produces objectively wrong visual output | Token value wrong, component structure broken, layout fundamentally different |
| **MAJOR** | Developer will need significant rework or clarification | Missing component variant, ambiguous spec, important state missing |
| **MINOR** | Cosmetic or unlikely to cause implementation confusion | Slight spacing difference, minor transition mismatch |

---

## Workflow Phases

### Phase 0 — Environment Check & Screenshot Setup

1. Check if `npx puppeteer` or `npx playwright` is available.
2. If neither: attempt `npm install --save-dev puppeteer`. If install fails, continue without screenshots.
3. Determine viewports from UX spec. See [project-rules.md](project-rules.md) §Screenshot Configuration.
4. Create the output directory structure.

### Phase 1 — Screenshot Capture

For each mock HTML file, for each viewport: launch Puppeteer, set viewport, navigate to `file://` path with `waitUntil: 'networkidle0'`, capture full-page screenshot.

**Output:** `screenshots/{viewport}/{page-name}-full.png`
**Parallelization:** Capture all pages × viewports in parallel using multiple Bash calls.

### Phase 2 — UX Spec Extraction

**Purpose:** Parse the UX design system document into structured audit checklists.

**A. Design Token Inventory**
| Token Name | Category | Specified Value | CSS Variable / Class | Usage Context |

Categories: colors, spacing, border-radius, shadows, transitions, opacity, z-index.

**B. Typography Inventory**
| Element / Context | Font Family | Size | Weight | Line-Height | Letter-Spacing | Transform | Class/Variable |

**C. Component Inventory**

**C1. Component Registry**
| Component Name | Type | Anatomy (child elements) | Variants | Section Reference |

Type: `primitive` (Button, Badge, Input), `composite` (Card, DataTable, Form), `layout` (Sidebar, Header, Grid), `custom` (project-specific).

**C2. Sub-Component Map** (for composite and custom components)
| Parent Component | Sub-Component | Required | Slot/Position | Notes |

**C3. Component State Matrix**
| Component | State | Trigger | Visual Change | Content Change | Transition |

States: `default`, `hover`, `active`, `focus`, `disabled`, `loading`, `error`, `empty`, `selected`, `expanded`, `collapsed`, or any custom state.

**C4. Component Visual Behavior** (extract from prose descriptions)
| Component | Behavior | Condition | Expected Visual Output |

**C5. Deprecated / Restricted Patterns**
| Pattern | Replacement | Reason | Component Affected |

**D. Layout Inventory**
| Context | Property | Value | Responsive Changes |

**E. State & Interaction Inventory**
| Component / Element | State | Visual Change | Transition Spec |

**F. Responsive Inventory**
| Breakpoint | Components Affected | Change Description |

**G. Project-Specific Rules** (if provided)
| Rule ID | Category | Description | Framework |

### Phase 3 — Mock UI Inventory

**Purpose:** Extract what the mock actually implements. Combines HTML source analysis with **Puppeteer runtime extraction**.

**A. Component Census**

**A1. Component Registry**
| Component Type | Count | Location(s) | Variants Observed | Selector / Pattern |

**A2. Sub-Component Extraction** (for composite components)
| Parent Component | Child Elements Found | Nesting Depth | Optional Children Present |

**A3. Component State Snapshot**
| Component | States Found in CSS/HTML | Implementation Method | Missing vs UX Spec |

**A4. Visual Behavior Indicators**
| Component | Behavior Indicator | Implementation | Source |

**B. Color Palette Extraction** (Puppeteer-enhanced: `getComputedStyle` for actual rendered colors)
| Color | Hex/Value | How Referenced | Count | Usage Context | Computed Match |

**C. Typography Map** (Puppeteer-enhanced: actual rendered font properties)
| Element | Font Family | Size | Weight | Line-Height | Letter-Spacing | Computed |

**D. Layout Patterns** (Puppeteer-enhanced: `getBoundingClientRect()` for actual dimensions)
| Pattern | Implementation | Values | Measured |

**E. Interactive Elements**
| Element | Type | States Shown | States Missing |

**F. Media & Assets**
| Asset | Type | Count | Alt Text | Dimensions |

### Phase 4 — Bi-directional Comparison

**Purpose:** Core audit — compare UX spec against mock in both directions.

#### Direction A: UX → Mock

**Token Drift (T):**
1. For each color token: compare hex/oklch/rgb values.
2. For each spacing token: compare padding/margin/gap values.
3. For each radius/shadow/transition token: compare values.
4. Flag hardcoded values where CSS variable was specified (MINOR even if value matches).

**Typography Mismatch (Y):**
1. Verify font-family, size, weight, line-height for each element-type mapping.
2. Check text-transform, letter-spacing, font import, rendering hints.

**Component Fidelity (K):**

*K-A. Structure & Anatomy:*
1. Locate each UX component in mock. Compare anatomy, variants, deprecated patterns, required props.

*K-B. Sub-Component Completeness:* (uses C2 map)
2. Verify required sub-components present, correct order/position, correct nesting.

*K-C. Component State Coverage:* (uses C3 matrix)
3. Verify each defined state is implemented. Check compound states, transitions, flag undocumented states as U.

*K-D. Visual Behavior Verification:* (uses C4 table)
4. Verify truncation, conditional content, dynamic sizing behaviors. Flag missing as MAJOR, undocumented as S.

**Layout Deviation (L):**
1. Compare dimensions, grid definitions, padding/margin, page structure, z-index stacking.

**State & Interaction Gap (I):**
1. Check hover/active/focus/disabled implementation, transition specs, cursor styles, focus rings.

**Responsive Mismatch (R):**
1. Check media queries and responsive classes for each breakpoint. Compare screenshots. Flag missing behavior.

#### Direction B: Mock → UX

**Undocumented Pattern (U):** Colors, components, typography, layout patterns not in UX spec.
**Visual Scope Creep (S):** Decorative elements, animations, interactions beyond UX scope.
**Placeholder Content (P):** Lorem ipsum, stock photos, hardcoded data, missing/broken images.

### Phase 5 — Puppeteer Runtime Analysis

**Purpose:** Use Puppeteer to extract computed styles, verify rendered values, test interactive states, and measure actual layout.

Run scripts from `scripts/` directory. For detailed sub-phase instructions, see [puppeteer-phases.md](puppeteer-phases.md).

| Sub-phase | Script | Condition | What it checks |
|-----------|--------|-----------|----------------|
| 5A | `scripts/runtime-audit.js` | Always | Computed token values vs UX spec |
| 5B | `scripts/runtime-audit.js` | Always | Font loading verification |
| 5C | `scripts/runtime-audit.js` | Always | Interactive state capture (hover, focus) |
| 5D | `scripts/runtime-audit.js` | Always | Layout measurement via `getBoundingClientRect` |
| 5E | `scripts/runtime-audit.js` | Always | Responsive behavior (viewport resize + measure) |
| 5F | `scripts/runtime-audit.js` | Always | Transition & animation verification |
| 5G | `scripts/contrast-audit.js` | If UX spec mentions WCAG/accessibility/contrast | WCAG AA/AAA contrast ratios |
| 5H | `scripts/dark-mode-audit.js` | If UX spec defines dark mode/themes | Theme toggle + token re-verification |
| 5I | `scripts/component-validation.js` | If Phase 2 has C1-C4 data | Sub-component, state, behavior validation |

### Phase 6 — Cross-Page Consistency (X)

**Purpose:** Compare same-type components across all mock pages.

1. Build component matrix: Component × Page → Visual Properties.
2. For each component type appearing in 2+ pages: compare structure, styling, behavior.
3. Flag inconsistencies as X findings.

**Puppeteer complement:** Run `scripts/cross-page-consistency.js`. See [puppeteer-phases.md](puppeteer-phases.md) §Phase 6.

### Phase 7 — Mock Self-Validation (M)

**Purpose:** Check mock against itself for internal contradictions.

**Part A — Data Consistency:** Numeric claims match visible data, percentages add up, status labels match indicators, navigation targets exist.

**Part B — Structural & Flow:** Dead-end links, missing states, orphan elements, alignment inconsistencies, cross-page flow breaks.

**Puppeteer complement:** Run `scripts/self-validation.js`. See [puppeteer-phases.md](puppeteer-phases.md) §Phase 7.

**Part C — Semantic HTML Validation (conditional):**
Run `scripts/semantic-html-audit.js` if UX spec implies specific HTML elements or mentions accessibility. See [puppeteer-phases.md](puppeteer-phases.md) §Phase 7 Part C.

### Phase 8 — UX Spec Internal Consistency (E — report-only)

**Purpose:** Check UX document against itself for contradictions.

1. **Contradictory definitions:** Same token defined with different values.
2. **Ambiguous specs:** Vague or incomplete component definitions.
3. **Undefined references:** References to undefined tokens or patterns.
4. **Overlapping definitions:** Multiple components spec'd identically.
5. **Terminology inconsistency:** Same concept named differently.
6. **Missing specs:** Component mentioned but not fully defined.
7. **Code-prose mismatch:** Code example contradicts prose description.

**E-prefix findings appear ONLY in analysis.md, NOT in annotated HTML.**

### Phase 9 — Coverage Scoring

1. List every spec item from Phase 2 inventories.
2. Mark status per mock page: **Implemented**, **Partial**, **Drifted**, **Missing**.
3. Calculate per-category coverage: `(Implemented + 0.5 × Partial) / Total × 100`
4. Calculate **Overall Design System Coverage** as weighted average.
5. Build traceability matrix for heatmap.

### Phase 10 — Markdown Report (analysis.md)

Generate the main audit report. See [report-template.md](report-template.md) for the complete structure.

### Phase 11 — Annotated HTML Files

Same system as PRD audit (see reference.md for templates):
- One file per mock: `annotated/{page-name}-annotated.html`
- 11 color-coded highlight categories (T, Y, K, L, I, R, U, S, P, X, M).
- Interactive right panel with search, filter, bidirectional navigation.
- Toggle button with category counts.
- Keyboard shortcuts (Esc, `[`, `]`, `/`).

**E findings are NOT annotated on HTML.**

### Phase 12 — Visual Audit Pages (Screenshot Overlays)

For each mock: `visual-audit/{page-name}-visual-audit.html`

- Full-page screenshot with colored semi-transparent overlay boxes for each finding.
- Badge + tooltip + detail panel per overlay.
- Viewport tabs for multi-viewport screenshots.
- Diff toggle for delta mode.

See reference.md §Visual Audit Template.

### Phase 13 — Interactive Coverage Heatmap

Grid visualization: rows = UX spec items, columns = mock pages, cells = color-coded status.

**Empty State:** If Phase 2 finds NO structured design system data, the heatmap is still generated but shows an empty state notification listing what categories would enable coverage tracking.

See reference.md §Heatmap Template (includes empty state styles and auto-detection).

### Phase 14 — Validation & Self-Check

**A. Report Integrity:** Finding counts match, ID sequences continuous, percentages correct, screenshots exist.
**B. Annotated HTML:** Badge↔panel bidirectional match, toggle counts correct, original mock preserved.
**C. Visual Audit Pages:** Screenshots exist, overlay positions valid, viewport tabs work.
**D. Heatmap:** All spec items as rows, all pages as columns, verbatim descriptions from analysis.md.
**E. Cross-Output Consistency:** Finding ID, severity, and description identical across all outputs.

### Phase 15 — Delta Mode (Optional)

**Trigger:** User provides path to previous audit folder.

1. Classify findings: **Resolved**, **Persistent**, **New**, **Regressed**.
2. Compare screenshots between audits.
3. Add Delta Summary section to analysis.md.

---

## Additional Resources

- For Puppeteer runtime analysis details, see [puppeteer-phases.md](puppeteer-phases.md)
- For analysis.md report structure, see [report-template.md](report-template.md)
- For project-specific rules and screenshot config, see [project-rules.md](project-rules.md)
- For HTML/CSS/JS templates (annotations, visual audit, heatmap), see [reference.md](reference.md)
- For executable Puppeteer scripts, see [scripts/](scripts/)

---

## Finding ID Prefixes & Numbering

| Category | Prefix | Sequence | Example |
|----------|--------|----------|---------|
| Token Drift | T | Global | T1, T2, ..., TN |
| Typography Mismatch | Y | Global | Y1, Y2, ..., YN |
| Component Fidelity | K | Global | K1, K2, ..., KN |
| Layout Deviation | L | Global | L1, L2, ..., LN |
| State & Interaction Gap | I | Global | I1, I2, ..., IN |
| Responsive Mismatch | R | Global | R1, R2, ..., RN |
| Undocumented Pattern | U | Global | U1, U2, ..., UN |
| Visual Scope Creep | S | Global | S1, S2, ..., SN |
| Placeholder Content | P | Global | P1, P2, ..., PN |
| Cross-Page Inconsistency | X | Global | X1, X2, ..., XN |
| Mock Self-Validation | M | Global | M1, M2, ..., MN |
| UX Spec Issue | E | Global (report-only) | E1, E2, ..., EN |

---

## Color Scheme

| Category | Outline | Badge BG | Panel Count BG | Dot Class |
|----------|---------|----------|----------------|-----------|
| Token Drift (T) | `#ef4444` | `#ef4444` | `rgba(239,68,68,0.15)` | `.dot-t` |
| Typography (Y) | `#3b82f6` | `#3b82f6` | `rgba(59,130,246,0.15)` | `.dot-y` |
| Component (K) | `#f97316` | `#f97316` | `rgba(249,115,22,0.15)` | `.dot-k` |
| Layout (L) | `#8b5cf6` | `#8b5cf6` | `rgba(139,92,246,0.15)` | `.dot-l` |
| State/Interaction (I) | `#f59e0b` | `#f59e0b` | `rgba(245,158,11,0.15)` | `.dot-i` |
| Responsive (R) | `#14b8a6` | `#14b8a6` | `rgba(20,184,166,0.15)` | `.dot-r` |
| Undocumented (U) | `#10b981` | `#10b981` | `rgba(16,185,129,0.15)` | `.dot-u` |
| Scope Creep (S) | `#f43f5e` | `#f43f5e` | `rgba(244,63,94,0.15)` | `.dot-s` |
| Placeholder (P) | `#9ca3af` | `#9ca3af` | `rgba(156,163,175,0.15)` | `.dot-p` |
| Cross-Page (X) | `#7c3aed` | `#7c3aed` | `rgba(124,58,237,0.15)` | `.dot-x` |
| Self-Validation (M) | `#06b6d4` | `#06b6d4` | `rgba(6,182,212,0.15)` | `.dot-m` |
| UX Spec Issue (E) | `#6366f1` | `#6366f1` | — (report-only) | — |

---

## Key Principles

### 1. UX-Scoped
Only evaluate what the UX design system document defines. No accessibility audit unless UX spec mentions it. No responsive testing unless UX defines breakpoints.

### 2. Visual-First
Screenshots are primary evidence. When Puppeteer is available, every finding should reference visual evidence where applicable.

### 3. Bi-directional
Always audit both directions: UX→Mock (is it built right?) and Mock→UX (is it documented?).

### 4. Framework-Agnostic
Base skill works with ANY design system. Framework-specific checks go in [project-rules.md](project-rules.md).

### 5. Verbatim Descriptions
Finding descriptions must be identical across analysis.md, annotated HTML, visual audit pages, and heatmap. Copy, never paraphrase.

### 6. Screenshot as Evidence
Runtime findings are marked `[Runtime — Puppeteer]`. Reference screenshot paths.

### 7. Severity Consistency
A finding's severity must be the same in all outputs.

### 8. Graceful Degradation
If Puppeteer unavailable, produce complete audit from HTML source alone. Note limitation in report.
