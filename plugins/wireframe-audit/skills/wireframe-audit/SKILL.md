---
name: wireframe-audit
description: "Audit HTML wireframes against PRD and/or UX Design System documents. Three modes: PRD-only, UX-only, Full (PRD+UX). Generates structured JSON, markdown report, interactive dashboard, and screenshot gallery with component-level finding markers."
---

# Wireframe Audit

## Purpose

Audit HTML wireframe implementations against their source documents (PRD, UX Design System, or both). This skill answers:

- Does the wireframe implement what the PRD requires?
- Does the wireframe match the UX design system specs?
- What did the wireframe add that no document defines?
- What do the documents define that the wireframe is missing?
- Do PRD and UX contradict each other? (Full mode)

### When to use this skill vs. docs-audit

| Use **wireframe-audit** when... | Use **docs-audit** when... |
|---|---|
| You have HTML wireframes and want to verify they match PRD and/or UX specs | You have 2-3 documents (PRD, UX, Mock descriptions) and need alignment before building |
| You want Puppeteer-powered visual evidence (screenshots, computed styles, DOM inspection) | Mock is markdown descriptions or screenshots, not HTML |
| You want to see exactly which component on-screen has an issue | You want document-level reconciliation with Excalidraw diagrams |
| Focus: implementation correctness of built wireframes | Focus: document alignment before implementation |

The two skills are **complementary**: run docs-audit first to align documents, then wireframe-audit after HTML wireframes are built.

---

## Inputs

| # | Input | Required | Description |
|---|-------|----------|-------------|
| 1 | **Wireframe HTML file(s)** | Yes | Path(s) to HTML wireframe file(s) or directory |
| 2 | **PRD file** | No | Markdown file with product requirements |
| 3 | **UX Design System file** | No | Markdown file with design tokens, components, layout, states |
| 4 | **Previous audit folder** | No | Path to previous `docs/audit/wireframe/{name}/` folder for delta mode |

**Rules:**
- Wireframe is always required
- At least one of PRD or UX must be provided
- All file paths must be provided explicitly by the user. Never auto-discover.
- Ask user which mode before starting: PRD-only, UX-only, or Full (PRD+UX)

---

## Audit Modes

| Mode | Documents | Comparison Directions |
|------|-----------|----------------------|
| **PRD-only** | Wireframe + PRD | PRD <-> Wireframe |
| **UX-only** | Wireframe + UX | UX <-> Wireframe |
| **Full** | Wireframe + PRD + UX | PRD <-> Wireframe, UX <-> Wireframe, PRD <-> UX cross-check |

---

## Outputs

All written to `docs/audit/wireframe/{analysis_name}/` where `{analysis_name}` is kebab-case `[project-name]-[YYYY-MM-DD]`.

```
docs/audit/wireframe/{analysis_name}/
├── wireframe-data.json              # Structured data (single source of truth)
├── analysis.md                      # Markdown report
├── wireframe-dashboard.html         # Interactive dashboard (findings + coverage)
├── wireframe-screenshots.html       # Screenshot gallery with overlay markers
├── screenshots/                     # Puppeteer full-page captures
│   └── {page-name}.png
└── delta-summary.md                 # Only in delta mode
```

### Data-Template Separation

Same pattern as docs-audit. All visual outputs load `wireframe-data.json` via `fetch()`. HTML files are static templates that never grow with finding count.

### Generation Order (mandatory)

1. **wireframe-data.json** — First. All analysis data.
2. **analysis.md** — Second. Formats JSON into markdown.
3. **wireframe-dashboard.html** — Third. Static template.
4. **wireframe-screenshots.html** — Fourth. Static template.

### Token Budget Rules

- Never inline finding data into HTML. Templates use `fetch('./wireframe-data.json')`.
- If token budget runs low, prioritize: (1) JSON, (2) MD, (3) dashboard, (4) screenshots HTML.
- JSON + MD is the minimum viable output.

---

## Finding Categories

All findings use descriptive names as primary labels. No code abbreviations.

### PRD <-> Wireframe *(PRD-only, Full)*

| Category | Color | Hex | Description |
|----------|-------|-----|-------------|
| **Contradiction** | Red | `#ef4444` | Wireframe contradicts what the PRD defines |
| **PRD Gap** | Blue | `#3b82f6` | PRD defines something the wireframe does not implement |
| **Design Decision** | Green | `#10b981` | Wireframe implements something not defined in PRD |
| **Accessibility Gap** | Yellow | `#f59e0b` | PRD mentions accessibility requirements the wireframe doesn't meet (conditional) |

### UX <-> Wireframe *(UX-only, Full)*

| Category | Color | Hex | Description |
|----------|-------|-----|-------------|
| **Token Drift** | Rose | `#f43f5e` | Design token value in wireframe does not match UX spec |
| **Typography Mismatch** | Sky | `#0ea5e9` | Font family, size, weight, line-height deviates from UX type scale |
| **Component Fidelity** | Orange | `#f97316` | Component markup, anatomy, hierarchy, or variant deviates from UX spec |
| **Layout Deviation** | Purple | `#8b5cf6` | Grid, dimensions, padding, alignment does not match UX layout |
| **State Gap** | Amber | `#f59e0b` | Interactive state defined in UX but absent or wrong in wireframe |
| **Responsive Mismatch** | Teal | `#14b8a6` | Breakpoint behavior defined in UX not reflected in wireframe |
| **Wireframe Extra** | Lime | `#84cc16` | Element in wireframe that is not defined in the UX design system |
| **UX Unimplemented** | Indigo | `#6366f1` | Element defined in UX that is not present in wireframe |

### Cross-Source *(Full only)*

| Category | Color | Hex | Description |
|----------|-------|-----|-------------|
| **Cross-Source Conflict** | Pink | `#ec4899` | PRD and UX contradict each other regarding the wireframe |

### Shared *(All modes)*

| Category | Color | Hex | Description |
|----------|-------|-----|-------------|
| **Scope Creep** | Slate | `#64748b` | Element beyond the scope of all provided documents |
| **Placeholder** | Gray | `#9ca3af` | Lorem ipsum, stock photos, hardcoded sample data |
| **Cross-Page Inconsistency** | Violet | `#7c3aed` | Same component renders differently across wireframe pages |

### Severity Levels

| Level | Meaning |
|-------|---------|
| **Blocker** | Objectively wrong — blocks development |
| **Major** | Significant rework needed |
| **Minor** | Cosmetic or low-impact |

### Finding ID Format

IDs use descriptive kebab-case names, sequential per category:

`contradiction-1`, `contradiction-2`, `prd-gap-1`, `token-drift-1`, `component-fidelity-3`, etc.

No single-letter codes. The finding ID itself tells you the category.

---

## Workflow

### Phase 0 — Environment & Screenshots

1. Check Puppeteer availability (`npx puppeteer`). If not installed, attempt `npm install --save-dev puppeteer`. If install fails, continue without screenshots — note limitation in report.
2. Create output directory structure.
3. **Capture full-page screenshots** of each wireframe HTML:
   - Default viewport: 1440 x 900
   - Single screenshot per page (like docs-audit)
   - Only capture additional breakpoints if UX defines responsive breakpoints AND the single screenshot is insufficient
   - Save to `screenshots/{page-name}.png`
4. If previous audit folder provided, load `wireframe-data.json` for delta mode (Phase 10).
5. **Estimate context pressure**: If total document lines > 5000, warn user about potential session split.

### Phase 1 — Document Extraction

Parse source documents into structured inventories. Only extract what each document defines.

#### PRD Extraction *(skip if PRD not provided)*

| Inventory | Description |
|-----------|-------------|
| Functional Requirements | ID, title, description, page/view, priority |
| Page/View Registry | Name, purpose, requirement list |
| Component Mentions | Component name, context, requirements |
| State Requirements | State name, component/page, requirement |
| Flow Definitions | Flow name, steps, requirements |
| Business Rules | Rule, applies to, requirement |
| Page Sections | Page, section, contents, requirements (conditional — only if PRD describes page structure) |

#### UX Extraction *(skip if UX not provided)*

| Inventory | Description |
|-----------|-------------|
| Design Tokens | CSS variables, colors, spacing, shadows, radii |
| Typography | Font families, sizes, weights, line-heights per element |
| Component Registry | Name, variants, sub-components, props, type (primitive/composite/layout/custom) |
| Component States | Component, state, trigger, visual change, transition |
| Page/View Definitions | Pages with component placement |
| Layout Specs | Grid, dimensions, spacing, responsive breakpoints |
| Interaction Patterns | Transitions, animations, gestures, keyboard behavior |
| Responsive Behavior | Breakpoints, what changes at each |

### Phase 2 — Wireframe Inventory

Extract what the wireframe actually implements. Combines HTML source analysis with Puppeteer runtime extraction (when available).

| Inventory | Puppeteer-enhanced | Description |
|-----------|-------------------|-------------|
| Component Census | Yes — DOM queries | Component types, counts, locations, variants, selectors |
| Color Palette | Yes — `getComputedStyle` | Only if PRD or UX define colors |
| Typography Map | Yes — computed font properties | Only if PRD or UX define typography |
| Layout Patterns | Yes — `getBoundingClientRect()` | Only if PRD or UX define layout |
| Interactive Elements | Yes — state detection | All interactive elements with states shown/missing |
| Media & Assets | No | Images, icons, SVGs with alt text status |

#### Puppeteer Element Detection

For each requirement and component from Phase 1, search the wireframe DOM:

1. **Build search checklist** from PRD requirements, component mentions, and UX component registry
2. For each checklist item, run heuristic queries:
   - ARIA role match (`[role="table"]`, `[role="search"]`)
   - Semantic HTML tags (`<nav>`, `<table>`, `<dialog>`)
   - Attribute match (`aria-label`, `data-testid`, `placeholder`)
   - Class/ID partial match (kebab-case, camelCase, PascalCase)
   - Text content match (fallback)
3. Record: found/not_found, matched selector, visibility, bounding box (`{ x, y, width, height }`)
4. If UX provided: cross-reference found elements against UX Component Registry to identify which UX component rendered each element

See [puppeteer-detection.md](puppeteer-detection.md) for the script template.

### Phase 3 — PRD <-> Wireframe Analysis *(PRD-only, Full)*

#### Direction A: PRD -> Wireframe (is each requirement implemented?)

For each functional requirement:

| Check | Finding if failed |
|-------|-------------------|
| Is the feature/page present in the wireframe? | **PRD Gap** |
| Are required components visually present? (uses Puppeteer detection data) | **PRD Gap** |
| Are required states shown? | **PRD Gap** |
| Does wireframe show behavior contradicting PRD? | **Contradiction** |
| Do data fields match PRD requirements? | **Contradiction** |

Page compliance: verify wireframe pages match PRD page descriptions.
Component check: only if PRD specifies components.
Accessibility: only if PRD mentions accessibility/WCAG requirements.

#### Direction B: Wireframe -> PRD (what did the wireframe add?)

For each wireframe element with no matching requirement:

| Check | Finding if failed |
|-------|-------------------|
| Does this component map to a PRD requirement? | **Design Decision** |
| Does this page map to a PRD page/view? | **Design Decision** |
| Are there data fields shown with no PRD requirement? | **Design Decision** |

### Phase 4 — UX <-> Wireframe Analysis *(UX-only, Full)*

#### Direction A: UX -> Wireframe (is the design system implemented?)

**Token Drift:**
For each design token: compare UX spec value against wireframe's computed value (Puppeteer `getComputedStyle`). Flag hardcoded values where CSS variable was specified.

**Typography Mismatch:**
Verify font-family, size, weight, line-height for each element-type mapping. Use Puppeteer for actual rendered font verification (`document.fonts.check()`).

**Component Fidelity:**
- Structure & anatomy: locate each UX component in wireframe, compare anatomy, variants
- Sub-component completeness: verify required sub-components present and in correct order
- State coverage: verify each defined state is implemented (use Puppeteer interactive state capture: `page.hover()`, `page.focus()`)
- Visual behavior: verify truncation, conditional content, dynamic sizing

**Layout Deviation:**
Compare dimensions, grid definitions, padding/margin, z-index. Use Puppeteer `getBoundingClientRect()` for actual measurements.

**State Gap:**
Check hover/active/focus/disabled implementation, transition specs, cursor styles, focus rings. Use Puppeteer to trigger and measure states.

**Responsive Mismatch:**
If UX defines breakpoints: resize viewport with `page.setViewport()`, re-measure elements, compare against UX spec. Take screenshots at each breakpoint if needed.

#### Direction B: Wireframe -> UX (what's not documented?)

| Check | Finding if generated |
|-------|---------------------|
| Colors, components, patterns not in UX spec | **Wireframe Extra** |
| Decorative elements, animations beyond UX scope | **Wireframe Extra** |

#### Direction C: UX -> Wireframe (what's not implemented?)

| Check | Finding if generated |
|-------|---------------------|
| UX component not found in wireframe DOM | **UX Unimplemented** |
| UX state defined but not implemented | **UX Unimplemented** |
| UX layout spec not reflected in wireframe | **UX Unimplemented** |

### Phase 5 — Cross-Source Conflict Detection *(Full only)*

For each requirement/component that appears in both PRD and UX:

| Check | Finding if detected |
|-------|---------------------|
| PRD says X, UX says Y about the same feature | **Cross-Source Conflict** |
| PRD requires component variant UX doesn't define | **Cross-Source Conflict** |
| UX defines behavior PRD contradicts | **Cross-Source Conflict** |

### Phase 6 — Shared Checks *(All modes)*

**Scope Creep:** Wireframe elements beyond the scope of all provided documents.

**Placeholder:** Lorem ipsum, stock photos, hardcoded data, missing/broken images, `example.com` links.

**Cross-Page Inconsistency:** Compare same-type components across all wireframe pages. Use Puppeteer to extract computed styles of same selectors across pages and diff them.

### Phase 7 — Traceability & Scoring

Build requirement-level scorecard:

| Status | Meaning |
|--------|---------|
| **Implemented** | Wireframe accurately implements the requirement/spec |
| **Partial** | Wireframe shows requirement incompletely |
| **Missing** | Wireframe does not address this requirement/spec |
| **Contradicted** | Wireframe actively contradicts the requirement/spec |

Coverage formula: `(Implemented + 0.5 x Partial) / Total x 100`

Build traceability matrix:
- PRD mode: rows = functional requirements, columns = wireframe pages
- UX mode: rows = UX spec items (tokens, components, states), columns = wireframe pages
- Full mode: combined rows (PRD requirements + UX spec items)

Each cell includes status + linked finding IDs + reason text explaining the status.

### Phase 8 — Generate wireframe-data.json (FIRST)

Single source of truth for all visual outputs. See [data-schema.md](data-schema.md) for complete schema.

Must include:
- `meta` — mode, date, document names, file paths
- `scores` — overall coverage, per-document coverage
- `stats` — finding counts by category (full names) and severity
- `requirements` — all items from traceability matrix with status, reason, per-document status
- `findings` — all findings with category (full name), severity, description, quotes, linked screenshots
- `inventories` — extracted inventories from each document
- `screenshots` — paths to Puppeteer captures
- `elementDetection` — Puppeteer element detection results with bounding boxes

### Phase 9 — Generate analysis.md

Markdown report. All data comes from `wireframe-data.json`.

Sections:
1. Executive summary with coverage scores and finding counts
2. Per-document coverage breakdown
3. Requirement-by-requirement traceability table
4. Findings by category (using full category names as section headers)
5. Cross-source conflicts (Full mode)
6. Recommendations by severity

### Phase 10 — Generate wireframe-dashboard.html (static template)

Static HTML shell that loads `wireframe-data.json` via `fetch()`. Two tabs:

#### Findings Tab

- Filterable list of all findings
- Group by: category, page, severity
- Each finding expandible with: full description, severity badge, category badge, quotes from PRD/UX, link to screenshot marker
- Filter by: category (full names), severity, wireframe page
- Search by: requirement ID, keyword, component name

#### Coverage Tab

- Heatmap grid: rows = requirements/spec items, columns = wireframe pages
- Cells color-coded: green (implemented), yellow (partial), red (contradicted), gray (missing)
- Click cell to see linked findings and reason text
- Filter by status
- Sticky headers, search, keyboard navigation

### Phase 11 — Generate wireframe-screenshots.html (static template)

Static HTML shell that loads `wireframe-data.json` via `fetch()`. Screenshot gallery with component-level detail.

**Per wireframe page:**

- Full-page screenshot displayed as background image
- **SVG overlay markers** positioned using bounding box data from Puppeteer element detection
- Each marker numbered and color-coded by severity (red = blocker, orange = major, gray = minor)
- **Components without findings** shown with subtle green marker (confirms coverage)
- **Missing components** (in PRD/UX but not found in wireframe DOM) listed in bottom panel with "Not found in wireframe" label and selectors attempted

**Click on marker opens side panel showing:**

1. **Screenshot crop** — zoomed view of the component's bounding box area
2. **Component identity** — visible text, matched selector, class/ID
3. **PRD reference** — what the PRD says about this component (requirement ID, title, full description)
4. **UX reference** — what the UX spec says (component name, section, variants, states)
5. **All findings** for this component — category (full name), severity badge, description
6. If multiple findings on same component, all listed

**Navigation:**
- Tabs per wireframe page at top
- Filters by category and severity (show/hide markers)
- Keyboard: arrow keys navigate markers, Esc closes panel, 1-9 switch pages

### Phase 12 — Validation

1. `wireframe-data.json` is valid JSON and parseable
2. Every finding in `analysis.md` exists in `wireframe-data.json`
3. Finding descriptions are verbatim identical between MD and JSON
4. Severity consistent across all outputs
5. Counts in executive summary match `stats` in JSON
6. Every finding references specific text from involved documents
7. Category names are full descriptive names (no abbreviations)
8. Bounding boxes have positive width/height and non-negative x/y
9. All expected files exist in output directory
10. Screenshots exist for each wireframe page (if Puppeteer available)

### Phase 13 — Delta Mode (optional, incremental)

Same pattern as docs-audit. Activated when input #4 (previous audit folder) is provided.

#### 13A. Load Previous State

Load `wireframe-data.json` from previous folder. Extract requirements, findings, scores.

#### 13B. Identify Changes

User specifies what changed (requirement IDs, sections, or "all"). If not specified, ask once.

#### 13C. Carry Forward Unchanged

For requirements NOT in change set: copy directly from previous data. Mark `"deltaStatus": "carried_forward"`. Do NOT re-read documents or re-analyze.

#### 13D. Analyze Changed Requirements

Run Phases 1-7 only for changed requirements. Mark new findings as `"deltaStatus": "new"` or `"changed"`.

#### 13E. Merge & Recalculate

Combine carried-forward + new results. Recalculate scores and stats.

#### 13F. Generate delta-summary.md

Score trends, new/resolved/changed findings, carry-forward counts.

#### 13G. Generate Outputs

Proceed to Phases 8-12 with merged data.

---

## Important Principles

1. **Wireframe-scoped** — Only evaluate what the source documents define. No accessibility audit unless PRD mentions it. No responsive testing unless UX defines breakpoints.
2. **Visual-first** — Screenshots are primary evidence. When Puppeteer is available, findings reference visual evidence.
3. **Bi-directional** — Always audit both directions for each document pair.
4. **No abbreviations** — Finding categories use full descriptive names everywhere. No single-letter codes.
5. **Verbatim descriptions** — Finding descriptions must be identical across analysis.md, dashboard, and screenshot gallery.
6. **Severity consistency** — A finding's severity must be the same in all outputs.
7. **Puppeteer throughout** — Use Puppeteer during extraction and comparison phases, not as a final step. Computed styles, DOM queries, and layout measurements happen inline.
8. **Data-first generation** — Always generate `wireframe-data.json` before any visual output. HTML templates load data at runtime via `fetch()`.
9. **Sequential output generation** — JSON -> MD -> dashboard -> screenshots HTML. If token budget runs low, stop after dashboard.
10. **Direct execution, no subagents** — Run all phases directly. No delegation to sub-tasks. Read each document once, extract all inventories in a single pass.
11. **Graceful degradation** — If Puppeteer unavailable, produce complete audit from HTML source alone. Note limitation in report. Screenshot gallery will show placeholder.
12. **Session-safe checkpointing** — `wireframe-data.json` is the checkpoint. If context runs out, resume from JSON.

---

## Cross-references

- For wireframe-data.json schema, see [data-schema.md](data-schema.md)
- For Puppeteer detection script template, see [puppeteer-detection.md](puppeteer-detection.md)
