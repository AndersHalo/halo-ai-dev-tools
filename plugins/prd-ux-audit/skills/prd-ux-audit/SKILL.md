---
name: prd-ux-audit
description: "Bi-directional reconciliation of a PRD against a UX Design System document. Detects conflicts, coverage gaps, terminology drift, and undocumented UX additions. Generates a markdown report and interactive HTML matrix."
---

# PRD ↔ UX Design System Reconciliation Audit

## Purpose

Compare a Product Requirements Document (PRD) against a UX Design System specification to find misalignments **before** any mock or code is built. This skill answers:

- Does every PRD requirement have a corresponding UX definition?
- Does the UX spec add patterns not backed by the PRD?
- Do both documents use consistent terminology?
- Are there outright contradictions between what the PRD requires and what the UX defines?

No HTML mocks are needed. This is a **document-level** analysis.

---

## Inputs

| # | Input | Required | Description |
|---|-------|----------|-------------|
| 1 | **PRD file** | Yes | Markdown file containing product requirements, features, pages, user flows |
| 2 | **UX Design System file** | Yes | Markdown file with design tokens, typography, components, layout, states, responsive behavior |
| 3 | **Previous reconciliation folder** | No | Enables delta mode — compares against a prior run |

All file paths must be provided explicitly by the user. Never auto-discover.

---

## Outputs

All written to `docs/audit/prd-ux/{analysis_name}/` where `{analysis_name}` is kebab-case `[prd-title]-[YYYY-MM-DD]`.

```
docs/audit/prd-ux/{analysis_name}/
├── reconciliation.md              # Main markdown report
├── prd-ux-matrix.html             # Interactive side-by-side HTML
└── delta-summary.md               # Only in delta mode
```

---

## Finding Categories (6)

### Annotated in reports and matrix

| # | Prefix | Category | Color | Hex | Direction | Description |
|---|--------|----------|-------|-----|-----------|-------------|
| 1 | **V** | Conflict | Red | `#ef4444` | PRD ↔ UX | PRD and UX define contradictory behavior for the same feature |
| 2 | **N** | Naming Drift | Violet | `#7c3aed` | PRD ↔ UX | Same concept uses different names across documents |
| 3 | **W** | UX Coverage Gap | Blue | `#3b82f6` | PRD → UX | PRD requires something the UX spec does not define |
| 4 | **Q** | UX Scope Addition | Orange | `#f97316` | UX → PRD | UX defines something with no PRD justification |

### Report-only (informational, not in matrix)

| # | Prefix | Category | Color | Hex | Scope |
|---|--------|----------|-------|-----|-------|
| 5 | **D** | PRD Internal Issue | Indigo | `#6366f1` | Contradictions, ambiguity, or gaps within the PRD itself |
| 6 | **E** | UX Internal Issue | Teal | `#14b8a6` | Contradictions, ambiguity, or undefined references within UX |

### Severity Levels

| Level | Meaning |
|-------|---------|
| BLOCKER | Documents directly contradict — cannot build mock until resolved |
| MAJOR | Significant gap or ambiguity — likely causes rework if not resolved |
| MINOR | Terminology inconsistency or minor omission — low risk |

---

## Finding ID Rules

- IDs are globally sequential per prefix: V1, V2, N1, N2, W1, Q1, D1, E1
- Each finding ID is unique across the entire report
- Finding descriptions must be **verbatim identical** in `reconciliation.md` and `prd-ux-matrix.html`
- Severity for a given ID must be consistent across all outputs

---

## Workflow

### Phase 0 — Input Validation

1. Verify PRD and UX files exist and are readable
2. Create output directory `docs/audit/prd-ux/{analysis_name}/`
3. If previous reconciliation folder provided, load it for delta comparison

### Phase 1 — PRD Extraction

Parse the PRD into structured inventories:

**P1. Functional Requirements**

| Field | Description |
|-------|-------------|
| ID | Requirement identifier (FR-1, REQ-1, or auto-assigned) |
| Title | Short name |
| Description | Full requirement text |
| Page/View | Which page it belongs to (if specified) |
| Priority | Must-have / Should-have / Nice-to-have (if specified) |

**P2. Page/View Registry**

| Field | Description |
|-------|-------------|
| Name | Page or view name |
| Purpose | What it does |
| Requirements | List of FR IDs that apply |

**P3. Component Mentions**

| Field | Description |
|-------|-------------|
| Component | Name as mentioned in PRD (e.g., "data table", "filter dropdown") |
| Context | Where/how it's mentioned |
| Requirements | FR IDs that reference it |

**P4. State Requirements**

| Field | Description |
|-------|-------------|
| State | empty, error, loading, success, disabled, etc. |
| Component/Page | Where this state applies |
| Requirement | FR ID |

**P5. Flow Definitions**

| Field | Description |
|-------|-------------|
| Flow name | User journey name |
| Steps | Ordered list of steps/pages |
| Requirements | FR IDs |

**P6. Business Rules**

| Field | Description |
|-------|-------------|
| Rule | Validation, permission, limit, constraint |
| Applies to | Component/page |
| Requirement | FR ID |

**P7. Page Sections** (if PRD describes page-level structure)

| Field | Description |
|-------|-------------|
| Page | Page/view name |
| Section | Named area, region, or panel (e.g., "header", "sidebar", "filter bar") |
| Contents | What PRD says belongs in this section |
| Requirements | FR IDs governing this section |

> Only extract if the PRD describes sections, areas, or regions within pages. Skip if the PRD only lists features without page structure.

### Phase 2 — UX Spec Extraction

Parse the UX document into structured inventories. **Only extract inventories that the document defines** — skip any inventory the UX does not address.

**U1. Design Tokens** — CSS variables, colors, spacing, shadows, radii

**U2. Typography** — Font families, sizes, weights, line-heights per element type

**U3. Component Registry**

| Field | Description |
|-------|-------------|
| Name | Component name as defined in UX |
| Variants | List of defined variants |
| Sub-components | Child components |
| Props/Config | Configurable properties |

**U4. Component States** — Which states each component supports (hover, focus, disabled, loading, empty, error)

**U5. Page/View Definitions** — Pages the UX defines, with component placement

**U6. Layout Specs** — Grid, dimensions, spacing, responsive breakpoints

**U7. Interaction Patterns** — Transitions, animations, gestures, keyboard behavior

**U8. Responsive Behavior** — Breakpoints, what changes at each

**U9. Page Composition** (if UX defines per-page structure)

| Field | Description |
|-------|-------------|
| Page | Page/view name |
| Sections | Named areas/regions within the page |
| Component placement | Which components appear in each section |
| Hierarchy | Parent-child nesting of layout and components (if described) |

> Extract from layout trees, wireframe descriptions, page structure sections, or any format the UX uses to describe what goes where on each page. Skip if UX only lists components without page placement.

**U10. Component-Page Matrix** (if UX maps components to pages)

| Field | Description |
|-------|-------------|
| Component | Component name |
| Pages used | List of pages where this component appears |
| Variants per page | Which variant is used on each page (if specified) |

> Extract from component inventory tables, page-specific sections, or cross-reference lists. Skip if UX does not map components to pages.

**U11. Navigation Map** (if UX defines page-to-page flows)

| Field | Description |
|-------|-------------|
| Source page | Starting page/view |
| Target page | Destination page/view |
| Trigger | What initiates the navigation (click, link, action) |
| Conditions | Guards or prerequisites (if specified) |

> Extract from navigation diagrams, flow descriptions, or sitemap sections. Skip if UX does not define inter-page navigation.

### Phase 3 — Bi-directional Comparison

#### Direction A: PRD → UX (does UX cover what PRD requires?)

**A1. Requirement-level checks** — For each PRD requirement (P1):

| Check | Finding if failed |
|-------|-------------------|
| Is the feature/page defined in UX (U5)? | **W** — UX Coverage Gap |
| Are required components designed in UX (U3)? | **W** — UX Coverage Gap |
| Are required states designed (U4)? | **W** — UX Coverage Gap |
| Does UX define the same behavior PRD requires? | **V** — Conflict (if contradictory) |
| Do component/page names match? | **N** — Naming Drift |

**A2. Flow checks** (if P5 and U11 both exist) — For each PRD flow (P5):

| Check | Finding if failed |
|-------|-------------------|
| Does UX navigation map cover all flow steps? | **W** — UX Coverage Gap |
| Do flow step sequences match? | **V** — Conflict (if different order/steps) |

**A3. Page section checks** (if P7 and U9 both exist) — For each PRD page section (P7):

| Check | Finding if failed |
|-------|-------------------|
| Is this section present in UX page composition? | **W** — UX Coverage Gap |
| Do section contents match PRD expectations? | **V** — Conflict (if different contents) |

**A4. Component variant checks** (if P3 mentions variants and U3 defines them):

| Check | Finding if failed |
|-------|-------------------|
| Does UX define all variants PRD references? | **W** — UX Coverage Gap |

#### Direction B: UX → PRD (does UX add things beyond PRD?)

**B1. Component/page checks** — For each UX component (U3) and page (U5):

| Check | Finding if failed |
|-------|-------------------|
| Does this component map to a PRD requirement? | **Q** — UX Scope Addition |
| Does this page map to a PRD page/view? | **Q** — UX Scope Addition |
| Are there UX states with no PRD justification? | **Q** — UX Scope Addition |
| Are there interaction patterns not in PRD? | **Q** — UX Scope Addition |

**B2. Page composition checks** (if U9 exists) — For each UX page section:

| Check | Finding if failed |
|-------|-------------------|
| Does this section have PRD backing (P7 or P1)? | **Q** — UX Scope Addition |
| Are there components placed on pages without PRD justification? | **Q** — UX Scope Addition |

**B3. Navigation checks** (if U11 exists) — For each UX navigation route:

| Check | Finding if failed |
|-------|-------------------|
| Does this navigation flow map to a PRD flow (P5)? | **Q** — UX Scope Addition |

#### Conflict Detection (V findings)

Compare matched pairs where both documents define the same feature:

| Conflict type | Example |
|---------------|---------|
| Behavior | PRD: "pagination 20/page" vs UX: "infinite scroll" |
| Component choice | PRD: "dropdown" vs UX: "radio buttons" |
| Layout | PRD: "3-column grid" vs UX: "2-column with sidebar" |
| State handling | PRD: "show error inline" vs UX: "error toast notification" |
| Flow | PRD: "5-step wizard" vs UX: "3 pages" |
| Data | PRD: "show email + phone" vs UX: "show email only" |
| Page structure | PRD: "sidebar with filters" vs UX: "top filter bar" |
| Navigation | PRD: "wizard with back/next" vs UX: "tab-based navigation" |

### Phase 4 — Internal Consistency

#### 4A. PRD Self-Check (D findings)

| Check | Example |
|-------|---------|
| Contradictory requirements | FR-5 says "public access", FR-12 says "auth required" for same page |
| Undefined references | FR-8 references "admin dashboard" but no page defined |
| Ambiguous requirements | "The system should handle large datasets" — no threshold |
| Duplicate/overlapping FRs | FR-3 and FR-15 describe the same feature differently |
| Inconsistent terminology | Uses "Resource" and "Asset" interchangeably |

#### 4B. UX Self-Check (E findings)

| Check | Example |
|-------|---------|
| Undefined tokens | Component references `--accent` but token not defined |
| Contradictory specs | Card says `border-radius: 12px` in one place, `8px` in another |
| Missing states | Button component defines hover but not disabled |
| Incomplete responsive | Desktop defined, tablet/mobile not specified |
| Orphan components | Component defined but not placed on any page (U3 vs U10) |
| Page composition gaps | Page lists a section but no components assigned to it (U9) |
| Navigation dead-ends | Page in navigation map has no outbound routes (U11) |
| Component-page mismatch | Component-page matrix lists a component on a page not in U5 |

### Phase 5 — Reconciliation Scoring

Build a requirement-level scorecard:

| Status | Meaning |
|--------|---------|
| **Aligned** | PRD requirement fully covered in UX, no conflicts |
| **Partial** | UX covers some aspects but gaps remain |
| **Conflict** | PRD and UX contradict on this requirement |
| **UX Gap** | No UX definition for this requirement |
| **N/A** | Requirement doesn't need UX definition (backend, infrastructure) |

Calculate:
- **Alignment score**: % of requirements that are Aligned
- **Conflict count**: Number of V findings
- **Gap count**: Number of W findings
- **Addition count**: Number of Q findings

### Phase 6 — Generate reconciliation.md

See [report-template.md](report-template.md) for the complete structure.

Key sections:
- Executive summary with alignment score and finding counts
- Requirement-by-requirement reconciliation table
- Conflict details (V findings with full context from both documents)
- Gap details (W findings)
- Addition details (Q findings)
- Naming drift table (N findings)
- Internal issues (D, E findings)
- Recommendations by severity

### Phase 7 — Generate prd-ux-matrix.html

See [reference.md](reference.md) §1 for the complete HTML/CSS/JS template.

Interactive HTML page with:
- Side-by-side layout: PRD requirements on left, UX definitions on right
- Color-coded status per requirement row (aligned/partial/conflict/gap)
- Finding badges inline with details
- Filter by status, severity, category
- Search by FR ID, keyword, component name
- Summary stats bar at top
- Click to expand full context for any finding

### Phase 8 — Validation & Self-Check

1. Every finding ID in reconciliation.md appears in prd-ux-matrix.html (except D/E — report-only)
2. Finding descriptions are verbatim identical across outputs
3. Severity consistent across outputs
4. Counts in executive summary match actual findings
5. Every V finding references specific text from both PRD and UX
6. Every W finding cites the PRD requirement that has no UX coverage
7. Every Q finding cites the UX element with no PRD backing
8. No orphan findings (every finding maps to a requirement, component, or page section)
9. Conditional inventories (P7, U9, U10, U11) only appear in report if source data existed
10. Phase 3 sub-checks (A2–A4, B2–B3) only ran when both sides had data

### Phase 9 — Delta Mode (optional)

If a previous reconciliation folder is provided:

1. Load previous `reconciliation.md`
2. Compare findings: Resolved / Persistent / New / Regressed
3. Generate `delta-summary.md` with:
   - New conflicts introduced
   - Conflicts resolved
   - Gaps that opened or closed
   - Alignment score trend

---

## Important Principles

1. **Document-scoped** — Only compare what's written. Don't infer intent beyond the text.
2. **Verbatim citations** — Every finding must quote specific text from both documents.
3. **No mock needed** — This skill never reads HTML files. It's purely document analysis.
4. **Severity consistency** — A finding's severity must be the same in all outputs.
5. **Bidirectional** — Always check both PRD→UX and UX→PRD directions.
6. **Non-destructive** — Never modify the input PRD or UX files.
7. **Adaptive extraction** — Not all documents define the same things. Extract only what exists. Skip inventories (P7, U9–U11) and comparison sub-checks (A2–A4, B2–B3) when source data is absent. Never fabricate structure the document doesn't describe.
8. **Format-agnostic** — Documents may use tables, prose, ASCII trees, bullet lists, or any format. Parse whatever structure the document provides.

---

## Cross-references

- For reconciliation.md report structure, see [report-template.md](report-template.md)
- For prd-ux-matrix.html template, see [reference.md](reference.md)
