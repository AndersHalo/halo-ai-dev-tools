---
name: docs-audit
description: "Multi-document reconciliation engine. Cross-references PRD, UX Design System, and Mock documents to detect conflicts, coverage gaps, self-additions, naming drift, cascade violations, and specificity gaps. Generates a markdown report, interactive HTML dashboard, and optionally editable Excalidraw diagrams."
---

# Multi-Document Reconciliation Audit

## Purpose

Cross-reference product documents to find misalignments **before** code is written. PRD is always the source of truth. Compare it against one or both satellite documents:

- **PRD** (always present) — Features, requirements, business rules, user flows
- **UX Design System** (optional) — Components, tokens, layout, states, interactions
- **Mock** (optional) — Visual representation, screen compositions, actual UI decisions

This skill answers:

- Are all documents aligned on the same features?
- Does each document contradict another on shared definitions?
- Did a downstream document invent details not in the PRD? (specificity gap)
- Did the PRD telephone-game through UX into Mock? (cascade violation)
- What does each document add that others don't cover?
- What's missing from each document?

### When to use this skill vs. wireframe-audit

| Use **docs-audit** when... | Use **wireframe-audit** when... |
|---|---|
| You have 2-3 documents (PRD, UX, Mock) and need to check **alignment before building** | You have HTML wireframes and need a **detailed implementation audit** |
| Mock is a markdown description, screenshots, OR HTML | Wireframe is **HTML only** — the skill reads the actual DOM with Puppeteer |
| You want to compare PRD vs UX (no mock at all) | You always need HTML wireframe + PRD and/or UX |
| You need trilateral cascade detection (PRD -> UX -> Mock drift) | You need visual evidence with screenshot markers per component |
| You want Excalidraw diagrams and a verification map | You want a dashboard with findings explorer + coverage heatmap + screenshot gallery |
| Focus: document-level alignment + internal consistency | Focus: implementation correctness of built wireframes |

The two skills are **complementary**: run docs-audit first to align documents, then wireframe-audit after HTML wireframes are built to verify implementation quality.

---

## Inputs

| # | Input | Required | Description |
|---|-------|----------|-------------|
| 1 | **PRD file** | Yes | Markdown file with product requirements, features, pages, flows |
| 2 | **UX Design System file** | No | Markdown file with design tokens, components, layout, states, responsive behavior |
| 3 | **Mock file or folder** | No | Markdown description of mocks, annotated screenshots, or HTML mock files |
| 4 | **Previous reconciliation folder** | No | Enables incremental delta mode — loads `reconciliation-data.json` from a prior run, carries forward unchanged requirements, and only re-analyzes new/changed ones. User specifies which requirements or sections changed. Generates a `delta-summary.md` showing new, resolved, and changed findings. |
| 5 | **Generate Excalidraw diagrams** | No | If not provided by the user, **ask**: "Would you like to generate Excalidraw diagrams (coverage heatmap, Venn overlap, traceability flow, gap treemap)? These are optional and can be generated later from the JSON data." Accepts yes/no. Defaults to no if the user does not specify. |
**Rules:**
- At least **PRD + one other document** must be provided
- All file paths must be provided explicitly by the user. Never auto-discover.
- The skill adapts to whichever combination is provided (PRD+UX, PRD+Mock, PRD+UX+Mock)
- If the user explicitly includes or excludes diagrams in their request, respect that choice without asking again
- **Puppeteer visual verification** runs automatically when mock input #3 contains `.html` files. No user prompt needed — it is part of the standard workflow. Requires `npx puppeteer` to be available. If Puppeteer is not installed, skip gracefully with a warning.

---

## Input Modes

| Mode | Documents | Comparison Directions |
|------|-----------|----------------------|
| **Bilateral: PRD+UX** | PRD, UX | PRD <-> UX |
| **Bilateral: PRD+Mock** | PRD, Mock | PRD <-> Mock |
| **Trilateral: Full** | PRD, UX, Mock | PRD <-> UX, PRD <-> Mock, UX <-> Mock, PRD -> UX -> Mock cascade |

---

## Outputs

All written to `docs/audit/reconciliation/{analysis_name}/` where `{analysis_name}` is kebab-case `[prd-title]-[YYYY-MM-DD]`.

```
docs/audit/reconciliation/{analysis_name}/
├── reconciliation.md                # Main markdown report
├── reconciliation-data.json         # Structured data (single source of truth for all visual outputs)
├── reconciliation-matrix.html       # Interactive HTML dashboard (loads reconciliation-data.json)
├── visual-verification/             # Only if HTML mocks detected (Puppeteer auto-runs)
│   ├── visual-verify.mjs            # Generated Puppeteer script
│   ├── verification-results.json    # DOM verification results per component
│   ├── verification-map.html        # Interactive screenshot viewer with bounding box overlays
│   ├── mock-dashboard.png           # Full-page screenshot per HTML mock
│   └── mock-settings.png            # (one .png per .html mock file)
├── diagrams/                        # Only if user opts in to diagram generation
│   ├── coverage-heatmap.excalidraw  # Requirement x Document coverage grid
│   ├── venn-overlap.excalidraw      # 2 or 3 circle document overlap
│   ├── traceability-flow.excalidraw # Requirement flow: PRD -> UX -> Mock
│   └── gap-treemap.excalidraw       # Findings by area, sized by count
└── delta-summary.md                 # Only in delta mode — shows new/resolved/changed findings + score trends
```

### Data-Template Separation (anti-truncation strategy)

**Problem**: Large HTML files with inline data exhaust the output token budget, causing truncated or missing outputs.

**Solution**: All visual outputs (HTML, Excalidraw) are driven by a single `reconciliation-data.json` file. The HTML is a static template that loads this JSON at runtime. This means:

- **reconciliation-data.json** — Generated first. Contains all findings, scores, inventories, and metadata in a compact structured format. This is the single source of truth for all visual outputs.
- **reconciliation-matrix.html** — Static template (never changes size regardless of finding count). Loads `reconciliation-data.json` via `fetch()` and renders dynamically. Template is defined in [reference.md](reference.md).
- **Excalidraw files** — Generated from the same JSON data. Each diagram reads specific slices of the data.
- **reconciliation.md** — The only file that inlines data (markdown is compact and token-efficient).

### Generation Order (mandatory)

Outputs must be generated in this exact order to prevent token exhaustion:

1. **reconciliation-data.json** — First. All analysis data in one compact file.
2. **reconciliation.md** — Second. Reads from the analysis data already computed.
3. **reconciliation-matrix.html** — Third. Static template only — no finding data inlined. Copy the template from [reference.md](reference.md) verbatim.
4. **Excalidraw diagrams** — Last. Only if user opted in. One file at a time, each reading from JSON data.

### Token Budget Rules

- **Never inline finding data into HTML**. The HTML template uses `fetch('./reconciliation-data.json')` to load data at runtime.
- **Never duplicate data** across outputs. If it's in the JSON, reference it — don't rewrite it.
- **Generate Excalidraw files sequentially**, not all at once. Each one is a separate write operation.
- **If token budget is running low**, prioritize in this order: (1) JSON data, (2) MD report, (3) HTML template, (4) Excalidraw diagrams (if opted in). The JSON + MD pair is the minimum viable output.

### Context Window Management (anti-context-exhaustion strategy)

**Problem**: Analysis of large documents consumes most of the context window. By the time output generation starts, context runs out and later phases are skipped — leaving empty or missing files.

**Solution**: Phase checkpointing with `reconciliation-data.json` as the recovery anchor.

#### Execution Stages

The workflow is split into **two independent stages** that can run in separate sessions if needed:

**Stage 1 — Analysis (Phases 0-7)**: Read documents, extract inventories, run comparisons, generate `reconciliation-data.json`. This is the context-heavy stage. Once the JSON is written to disk, all analysis is persisted.

**Stage 2 — Output Generation (Phases 8-12)**: Read only `reconciliation-data.json` (not the original documents). Generate MD, HTML, and Excalidraw outputs. This stage is context-light because it only reads compact JSON.

#### Checkpoint Rules

1. **Write `reconciliation-data.json` as early as possible** — immediately after Phase 6 scoring completes. Do not wait until all outputs are generated.
2. **After writing JSON, never re-read the original PRD/UX/Mock documents.** All data needed for output generation lives in the JSON. This frees context for output phases.
3. **If context is running low after writing JSON**, stop the current session. The user can start a new session and say: "Generate outputs from `docs/audit/reconciliation/{analysis_name}/reconciliation-data.json`". The skill resumes from Phase 8.
4. **Each output file is independently recoverable.** If any file is missing after a session, re-run only the missing phase by reading the JSON.

#### Context Budget Estimation

Before starting, estimate context pressure:

| Document size | Estimated context cost | Can complete in one session? |
|--------------|----------------------|------------------------------|
| Small (each <2000 lines total) | ~30% of context | Yes — all phases |
| Medium (2000-5000 lines total) | ~50% of context | Likely — may skip Excalidraw |
| Large (>5000 lines total) | ~70%+ of context | Split into 2 sessions |

For medium/large documents, **proactively warn the user** at the start:
> "These documents are large. I'll generate the analysis JSON and MD report first. If context runs low, I'll save progress and you can run a follow-up session for the HTML and diagrams."

#### Resume Protocol

When the user asks to resume or generate outputs from an existing JSON:

1. Read `reconciliation-data.json` — do NOT read the original documents
2. Check which output files already exist in the output directory
3. **Ask the user** if they want Excalidraw diagrams (same prompt as Phase 0 step 6), unless diagrams already exist in the output directory
4. Generate only the missing files (respecting diagram opt-in choice)
5. Run Phase 11 validation on all outputs

---

## Finding Categories (9)

All findings use descriptive names as primary labels. No code abbreviations.

### Cross-document findings (shown in matrix, report, and dashboard)

| # | Category | Key | Color | Hex | Scope | Description |
|---|----------|-----|-------|-----|-------|-------------|
| 1 | **Conflict** | `conflict` | Red | `#ef4444` | Any 2+ docs | Two or more documents define contradictory behavior for the same feature |
| 2 | **Naming Drift** | `naming-drift` | Violet | `#7c3aed` | Any 2+ docs | Same concept uses different names across documents |
| 3 | **Coverage Gap** | `coverage-gap` | Blue | `#3b82f6` | PRD -> target | PRD requires something the target document does not define |
| 4 | **Scope Addition** | `scope-addition` | Orange | `#f97316` | Target -> PRD | A satellite document defines something with no PRD justification |
| 5 | **Cascade Violation** | `cascade-violation` | Pink | `#ec4899` | PRD -> UX -> Mock | Progressive drift: PRD says X, UX interpreted as Y, Mock built Z |
| 6 | **Specificity Gap** | `specificity-gap` | Amber | `#f59e0b` | Downstream -> source | A downstream document invented details not present in its source |

### Internal findings (shown in Document Health tab of dashboard)

| # | Category | Key | Color | Hex | Scope |
|---|----------|-----|-------|-----|-------|
| 7 | **PRD Internal Issue** | `prd-internal` | Indigo | `#6366f1` | Contradictions, ambiguity, or gaps within the PRD itself |
| 8 | **UX Internal Issue** | `ux-internal` | Teal | `#14b8a6` | Contradictions, ambiguity, or undefined references within UX |
| 9 | **Mock Internal Issue** | `mock-internal` | Slate | `#64748b` | Contradictions, inconsistencies, or orphan elements within the Mock |

### Severity Levels

| Level | Meaning |
|-------|---------|
| Blocker | Documents directly contradict — cannot proceed to next phase until resolved |
| Major | Significant gap or ambiguity — likely causes rework if not resolved |
| Minor | Terminology inconsistency or minor omission — low risk |

---

## Finding ID Rules

- IDs use descriptive kebab-case names, sequential per category: `conflict-1`, `conflict-2`, `naming-drift-1`, `coverage-gap-1`, `scope-addition-1`, `cascade-violation-1`, `specificity-gap-1`, `prd-internal-1`, `ux-internal-1`, `mock-internal-1`
- Each finding ID is unique across the entire report
- Finding descriptions must be **verbatim identical** in `reconciliation.md` and `reconciliation-matrix.html`
- Severity for a given ID must be consistent across all outputs
- Every finding must include a **suffix tag** indicating which documents are involved: `[PRD<>UX]`, `[PRD<>Mock]`, `[UX<>Mock]`, `[PRD>UX>Mock]`
- **Sister findings:** When the same requirement or concept has gaps, conflicts, or drift across multiple document pairs, each pair gets its own finding with a unique sequential ID. Never consolidate cross-pair issues into a single finding. Two different `docsTag` values always means two different finding IDs.

---

## Workflow

### Phase 0 — Input Validation & Resume Check

**0A. Resume check** — Before anything else, check if this is a resume session:

1. If the user points to an existing `reconciliation-data.json`, this is a **resume session**
2. Read the JSON file — do NOT read the original PRD/UX/Mock documents
3. List existing files in the output directory to determine which outputs are missing
4. Skip directly to the first missing output phase (Phase 8, 9, 10, or 11)
5. If all outputs exist, run Phase 11 validation only

**0B. Fresh session** — If no existing JSON:

1. Verify all provided files exist and are readable
2. Determine input mode (bilateral or trilateral) based on which documents are provided
3. Create output directory `docs/audit/reconciliation/{analysis_name}/`
4. If previous reconciliation folder provided, load it for delta comparison
5. **Estimate context pressure**: Count total lines across all input documents. If >5000 lines total, warn the user that the workflow may need to split across sessions, and that `reconciliation-data.json` will be the checkpoint
6. **Resolve diagram choice**: If the user already specified input #5 (generate diagrams yes/no), use that. Otherwise, ask: "Would you like to generate Excalidraw diagrams (coverage heatmap, Venn overlap, traceability flow, gap treemap)? These are optional and can be generated later from the JSON data." Record the choice as `generateDiagrams` (boolean). If false, skip Phase 10 entirely.
7. **Detect HTML mocks**: If mock input #3 contains `.html` files, set `visualVerification = true` and Phase 3B will run automatically. If no HTML mocks, set `visualVerification = false` and skip Phase 3B.

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

**P7. Page Sections** (conditional — only if PRD describes page-level structure)

| Field | Description |
|-------|-------------|
| Page | Page/view name |
| Section | Named area, region, or panel |
| Contents | What PRD says belongs in this section |
| Requirements | FR IDs governing this section |

### Phase 2 — UX Spec Extraction (skip if UX not provided)

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

**Completeness note:** When the UX document mentions a component by name but does not define its behavior, variants, or states, mark it as `mentioned-only` rather than `defined`. During Phase 4A, a `mentioned-only` component does NOT satisfy a PRD requirement that specifies interaction details.

**U4. Component States** — Which states each component supports (hover, focus, disabled, loading, empty, error)

**U5. Page/View Definitions** — Pages the UX defines, with component placement

**U6. Layout Specs** — Grid, dimensions, spacing, responsive breakpoints

**U7. Interaction Patterns** — Transitions, animations, gestures, keyboard behavior

**U8. Responsive Behavior** — Breakpoints, what changes at each

**U9. Page Composition** (conditional)

| Field | Description |
|-------|-------------|
| Page | Page/view name |
| Sections | Named areas/regions within the page |
| Component placement | Which components appear in each section |
| Hierarchy | Parent-child nesting of layout and components |

**U10. Component-Page Matrix** (conditional)

| Field | Description |
|-------|-------------|
| Component | Component name |
| Pages used | List of pages where this component appears |
| Variants per page | Which variant is used on each page |

**U11. Navigation Map** (conditional)

| Field | Description |
|-------|-------------|
| Source page | Starting page/view |
| Target page | Destination page/view |
| Trigger | What initiates the navigation |
| Conditions | Guards or prerequisites |

### Phase 3 — Mock Extraction (skip if Mock not provided)

Parse mock documents into structured inventories. Mocks may be markdown descriptions, annotated screenshot references, or HTML files.

**K1. Screen Registry**

| Field | Description |
|-------|-------------|
| Screen name | Name or label of the screen/view |
| Description | What the screen shows |
| Source | File or reference |

**K2. Visual Component Inventory**

| Field | Description |
|-------|-------------|
| Component | What's visually present (button, table, card, modal, etc.) |
| Screen | Which screen it appears on |
| Visual properties | Size, color, position, text content as visible |
| Variants shown | Which variant is rendered |

**Functional completeness:** For each component, assess whether the Mock implements it fully or only partially. Record as `full` (complete interaction surface present), `trigger-only` (button/icon/link present but no interaction surface behind it), or `partial` (some elements present but key behaviors missing) in the `Variants shown` field. During Phase 4C, a `trigger-only` or `partial` component does NOT satisfy a PRD requirement that specifies interactive behavior.

**K3. Screen Layout**

| Field | Description |
|-------|-------------|
| Screen | Screen name |
| Sections | Visual areas/regions |
| Component placement | What appears where |
| Visual hierarchy | Nesting, ordering |

**K4. State Representations**

| Field | Description |
|-------|-------------|
| Screen | Screen name |
| State shown | Which state is rendered (empty, loading, error, filled, etc.) |
| Visual treatment | How the state looks |

**K5. Navigation/Flow Shown**

| Field | Description |
|-------|-------------|
| Source screen | Starting screen |
| Target screen | Destination screen |
| Trigger element | Button, link, or action shown |

**K6. Data & Content Shown**

| Field | Description |
|-------|-------------|
| Screen | Screen name |
| Data fields | What data is displayed (column names, labels, values) |
| Content decisions | Specific text, placeholder values, sample data used |

**K7. Visual Specifications** (conditional — only if mock includes design details)

| Field | Description |
|-------|-------------|
| Element | Component or area |
| Colors used | Actual hex/rgb values visible |
| Typography | Font sizes, weights visible |
| Spacing | Margins, padding visible |

### Phase 3B — Puppeteer Element Detection — SKIP if `visualVerification` is false

Runs automatically when mock input #3 contains `.html` files. If no HTML mocks, skip to Phase 4.

**Purpose**: Render HTML mock files with Puppeteer and detect whether requirements (P1) and components (P3) from the PRD actually exist as visible elements in the rendered page. This is a presence check only — it answers "is this element in the DOM?" not "does it look correct?".

#### 3B.1 — Build the search checklist

Combine PRD inventories into a checklist of elements to look for:

| Source | What to search for | Example |
|--------|-------------------|---------|
| P3 (PRD Component Mentions) | Component names and their context | "search input", "data table", "filter dropdown" |
| P1 (Functional Requirements) | Key interaction surfaces | "export button", "date range picker" |
| P2 (Page/View Registry) | Page titles and landmarks | "Dashboard", "Settings" |

For each item, generate search heuristics:
- **Text match** — Look for visible text content matching the component name or label
- **Role match** — Query by ARIA role (`role="search"`, `role="table"`, `role="navigation"`)
- **Semantic match** — Query by semantic HTML tags (`<search>`, `<table>`, `<nav>`, `<dialog>`, `<form>`)
- **Attribute match** — Query by `aria-label`, `data-testid`, `placeholder`, `name` attributes
- **Class/ID match** — Query by class names or IDs containing the component name (case-insensitive partial match)

#### 3B.2 — Run Puppeteer detection script

For each HTML mock file, execute a Puppeteer script that:

1. Launches a headless browser
2. Opens the HTML file (`file://` protocol)
3. Waits for the page to be fully loaded (`networkidle0`)
4. For each item on the search checklist:
   a. Run all heuristic queries against the DOM
   b. Record whether the element was **found** or **not found**
   c. If found, record the matched selector and whether the element is visible (non-zero dimensions, not `display:none`)
5. Take a full-page screenshot and save to the output directory as `visual-verification/{mock-filename}.png`
6. Output results as `visual-verification/verification-results.json`

See [puppeteer-visual-verification.md](puppeteer-visual-verification.md) for the script template.

#### 3B.3 — Enrich K2 inventory

Use the Puppeteer results to add a `domVerified: true/false` field to K2 (Visual Component Inventory) entries. For verified components, also record `visible: true/false`.

#### 3B.4 — Generate verification summary

Add a `visualVerification` section to `reconciliation-data.json` containing:

```json
{
  "visualVerification": {
    "enabled": true,
    "mocksScanned": ["mock-dashboard.html", "mock-settings.html"],
    "screenshots": ["visual-verification/mock-dashboard.png", "visual-verification/mock-settings.png"],
    "checklist": [
      {
        "source": "P3",
        "name": "search input",
        "mockFile": "mock-dashboard.html",
        "status": "found",
        "selector": "input[type='search']",
        "visible": true,
        "boundingBox": { "x": 240, "y": 80, "width": 320, "height": 40 },
        "uxComponentMatch": { "componentName": "SearchInput", "uxSection": "Section 3.2", "variants": ["default", "focused"] }
      },
      {
        "source": "P1",
        "name": "DataTable",
        "mockFile": "mock-dashboard.html",
        "status": "not_found",
        "selectorsQueried": ["[role='table']", "[class*='table']", "table"],
        "boundingBox": null,
        "uxComponentMatch": null
      }
    ],
    "summary": {
      "total": 24,
      "found": 18,
      "notFound": 6
    }
  }
}
```

**How Phase 4 uses this data**: When Phase 4C (PRD -> Mock) checks whether a component is present in the mock, it first checks `visualVerification.checklist`. A `not_found` status from Puppeteer is strong DOM-level evidence for a **Coverage Gap** finding. Include in the finding description: "Puppeteer verification: element not found in rendered HTML after querying [N] selectors."

### Phase 3B.5 — UX Component Matching — SKIP if UX not provided or Phase 3B did not run

After Puppeteer detection completes and before Phase 4, cross-reference each found element against the UX component registry (U3) to identify which UX component rendered it.

#### Matching logic

For each checklist item with `status: "found"`:

1. **Selector-to-component mapping** — Parse the matched CSS selector and compare against U3 component names:
   - Class name overlap: if selector matched `[class*="department-tile"]` and U3 has a component named "DepartmentTile", that's a match
   - Convert between naming conventions (kebab-case, camelCase, PascalCase) when comparing
   - Partial matches count (e.g., selector `.bar-target` matching U3 component "BarChart" via shared prefix)

2. **Component-Page Matrix (U10)** — If available, check which components U10 says should appear on the page that corresponds to this mock file. Prefer matches where U10 confirms the component belongs on this page.

3. **Section reference** — If the UX document uses numbered sections (e.g., "3.6 DepartmentTile"), record the section reference in `uxSection`.

4. **Variants** — If U3 or U4 defines variants for the matched component, record which variants are listed.

#### Output

For each found checklist item, populate:

```json
{
  "uxComponentMatch": {
    "componentName": "DepartmentTile",
    "uxSection": "Section 3.6",
    "variants": ["default", "selected", "empty"]
  }
}
```

If no UX component match is found, set `uxComponentMatch` to `null`. This is not an error — it may indicate the Mock implements something the UX doesn't define (potential Q finding).

### Phase 4 — Cross-Document Comparison

Run comparison checks based on input mode. Each check direction only runs if both source and target documents are present.

**CRITICAL — Cross-phase independence rule:**
- Each comparison direction (4A, 4B, 4C, 4D, 4E, 4F) runs **independently from scratch**.
- A finding produced in one direction does NOT satisfy the same check in another direction.
- If a PRD requirement has gaps in multiple satellite documents, each gap produces a **separate finding** with its own unique ID and the corresponding `docsTag`.
- Never skip, merge, or deduplicate findings across document pairs. Two different `docsTag` values = two different findings, even if the underlying PRD requirement is the same.
- When starting each sub-phase (4A, 4B, 4C, etc.), iterate over the full inventory from scratch — do not filter out items that already have findings from a prior sub-phase.

#### 4A. PRD -> UX (does UX cover what PRD requires?)

**A1. Requirement-level checks** — For each PRD requirement (P1):

| Check | Finding if failed |
|-------|-------------------|
| Is the feature/page defined in UX (U5)? | **Coverage Gap** `[PRD<>UX]` |
| Are required components designed in UX (U3)? | **Coverage Gap** `[PRD<>UX]` |
| Are required states designed (U4)? | **Coverage Gap** `[PRD<>UX]` |
| Does UX define the same behavior PRD requires? | **Conflict** `[PRD<>UX]` |
| Do component/page names match? | **Naming Drift** `[PRD<>UX]` |

**A2. Flow checks** (if P5 and U11 both exist):

| Check | Finding if failed |
|-------|-------------------|
| Does UX navigation map cover all flow steps? | **Coverage Gap** `[PRD<>UX]` |
| Do flow step sequences match? | **Conflict** `[PRD<>UX]` |

**A3. Page section checks** (if P7 and U9 both exist):

| Check | Finding if failed |
|-------|-------------------|
| Is this section present in UX page composition? | **Coverage Gap** `[PRD<>UX]` |
| Do section contents match PRD expectations? | **Conflict** `[PRD<>UX]` |

**A4. Component variant checks** (if P3 mentions variants and U3 defines them):

| Check | Finding if failed |
|-------|-------------------|
| Does UX define all variants PRD references? | **Coverage Gap** `[PRD<>UX]` |

#### 4B. UX -> PRD (does UX add things beyond PRD?)

**B1. Component/page checks** — For each UX component (U3) and page (U5):

| Check | Finding if failed |
|-------|-------------------|
| Does this component map to a PRD requirement? | **Scope Addition** `[PRD<>UX]` |
| Does this page map to a PRD page/view? | **Scope Addition** `[PRD<>UX]` |
| Are there UX states with no PRD justification? | **Scope Addition** `[PRD<>UX]` |
| Are there interaction patterns not in PRD? | **Scope Addition** `[PRD<>UX]` |

**B2. Page composition checks** (if U9 exists):

| Check | Finding if failed |
|-------|-------------------|
| Does this section have PRD backing (P7 or P1)? | **Scope Addition** `[PRD<>UX]` |

**B3. Navigation checks** (if U11 exists):

| Check | Finding if failed |
|-------|-------------------|
| Does this navigation flow map to a PRD flow (P5)? | **Scope Addition** `[PRD<>UX]` |

#### 4C. PRD -> Mock (does Mock cover what PRD requires?)

**Puppeteer enhancement**: If Phase 3B ran, check `visualVerification.checklist` for each component. A `not_found` status is strong DOM-level evidence for a Coverage Gap. Include in the finding: "Puppeteer: element not found after querying [N] selectors."

**Requirement-level checks** — For each PRD requirement (P1):

| Check | Finding if failed |
|-------|-------------------|
| Is the feature/page represented in a mock screen (K1)? | **Coverage Gap** `[PRD<>Mock]` |
| Are required components visually present (K2)? Use `visualVerification.checklist` if available. | **Coverage Gap** `[PRD<>Mock]` |
| Are required states shown (K4)? | **Coverage Gap** `[PRD<>Mock]` |
| Does the mock show behavior contradicting PRD? | **Conflict** `[PRD<>Mock]` |
| Do data fields match PRD requirements (K6 vs P1)? | **Conflict** `[PRD<>Mock]` |

**Flow checks** (if P5 and K5 both exist):

| Check | Finding if failed |
|-------|-------------------|
| Does mock navigation cover all flow steps? | **Coverage Gap** `[PRD<>Mock]` |
| Do flow step sequences match? | **Conflict** `[PRD<>Mock]` |

#### 4D. Mock -> PRD (does Mock add things beyond PRD?)

**Screen/component checks** — For each mock screen (K1) and component (K2):

| Check | Finding if failed |
|-------|-------------------|
| Does this screen map to a PRD page/view? | **Scope Addition** `[PRD<>Mock]` |
| Does this component map to a PRD requirement? | **Scope Addition** `[PRD<>Mock]` |
| Are there data fields shown with no PRD requirement? | **Scope Addition** `[PRD<>Mock]` |

#### 4E. UX <-> Mock (do UX and Mock agree?) — Only in trilateral mode

**Component alignment** — For each UX component (U3) present in mock (K2):

| Check | Finding if failed |
|-------|-------------------|
| Does mock render the component as UX specifies? | **Conflict** `[UX<>Mock]` |
| Do variant choices match UX definitions? | **Conflict** `[UX<>Mock]` |
| Does mock follow UX state definitions? | **Conflict** `[UX<>Mock]` |

**Layout alignment** (if U9 and K3 both exist):

| Check | Finding if failed |
|-------|-------------------|
| Does mock layout match UX page composition? | **Conflict** `[UX<>Mock]` |

**Visual spec alignment** (if U1/U2 and K7 both exist):

| Check | Finding if failed |
|-------|-------------------|
| Do mock colors match UX design tokens? | **Conflict** `[UX<>Mock]` |
| Does mock typography match UX specs? | **Conflict** `[UX<>Mock]` |

**Mock additions beyond UX**:

| Check | Finding if failed |
|-------|-------------------|
| Does mock show components not in UX registry? | **Scope Addition** `[UX<>Mock]` |
| Does mock show states not in UX state definitions? | **Scope Addition** `[UX<>Mock]` |

#### 4F. Cascade Detection — Only in trilateral mode

For each requirement that appears in all three documents, trace the interpretation chain:

**F1. Cascade violation check** — PRD -> UX -> Mock:

| Check | Finding if failed |
|-------|-------------------|
| PRD says X, UX says Y (drift), Mock says Z (further drift) | **Cascade Violation** `[PRD>UX>Mock]` |
| Progressive interpretation: each document drifts further from PRD's original intent | **Cascade Violation** `[PRD>UX>Mock]` |

**F2. Specificity gap check**:

| Check | Finding if failed |
|-------|-------------------|
| UX invented details not present in PRD | **Specificity Gap** `[PRD<>UX]` |
| Mock invented details not present in UX | **Specificity Gap** `[UX<>Mock]` |
| Mock invented details not present in PRD | **Specificity Gap** `[PRD<>Mock]` |

### Phase 5 — Internal Consistency

#### 5A. PRD Self-Check (PRD Internal Issue findings)

| Check | Example |
|-------|---------|
| Contradictory requirements | FR-5 says "public access", FR-12 says "auth required" for same page |
| Undefined references | FR-8 references "admin dashboard" but no page defined |
| Ambiguous requirements | "The system should handle large datasets" — no threshold |
| Duplicate/overlapping FRs | FR-3 and FR-15 describe the same feature differently |
| Inconsistent terminology | Uses "Resource" and "Asset" interchangeably |

#### 5B. UX Self-Check (UX Internal Issue findings) — skip if UX not provided

| Check | Example |
|-------|---------|
| Undefined tokens | Component references `--accent` but token not defined |
| Contradictory specs | Card says `border-radius: 12px` in one place, `8px` in another |
| Missing states | Button component defines hover but not disabled |
| Incomplete responsive | Desktop defined, tablet/mobile not specified |
| Orphan components | Component defined but not placed on any page |
| Page composition gaps | Page lists a section but no components assigned |
| Navigation dead-ends | Page in navigation map has no outbound routes |

#### 5C. Mock Self-Check (Mock Internal Issue findings) — skip if Mock not provided

| Check | Example |
|-------|---------|
| Inconsistent components | Same component looks different across screens |
| Missing states | Error screen referenced in flow but not mocked |
| Orphan screens | Screen exists but unreachable from navigation |
| Data inconsistency | Same entity shows different fields on different screens |
| Visual inconsistency | Different colors/fonts for same element type across screens |

### Phase 6 — Reconciliation Scoring

Build a requirement-level scorecard. For each requirement, assign a status **and a reason** explaining why it received that status:

| Status | Meaning |
|--------|---------|
| **Aligned** | PRD requirement fully covered in all provided documents, no conflicts |
| **Partial** | Covered in some documents but gaps remain |
| **Conflict** | Two or more documents contradict on this requirement |
| **Gap** | Missing from one or more target documents |
| **N/A** | Requirement doesn't need definition in target documents (backend, infrastructure) |

**Status reason** (mandatory for every requirement): A concise, human-readable explanation of why this requirement received its status. The reason must reference the specific documents and findings involved. Examples:

| Status | Example reason |
|--------|---------------|
| Aligned | "Defined in PRD (FR-3), UX (SearchInput component with variants), and Mock (visible on Dashboard screen)" |
| Partial | "PRD defines date range filter (FR-7); UX has DatePicker component but Mock does not show it on any screen (coverage-gap-4)" |
| Conflict | "PRD says max 50 results per page (FR-12); UX specifies infinite scroll with no pagination (conflict-2)" |
| Gap | "PRD requires export to CSV (FR-15); not defined in UX or Mock (coverage-gap-8, coverage-gap-9)" |
| N/A | "Backend authentication requirement — no UI representation needed" |

The reason is stored in `requirements[].reason` in the JSON and displayed in the matrix and MD report.

Calculate per-document and overall scores:

- **Overall alignment score**: % of requirements Aligned across all documents
- **Per-document coverage**: % of requirements covered in each document
- **Document maturity score**: Per-document completeness rating (how much of its own domain it covers)
- **Conflict count**: Total Conflict findings
- **Gap count**: Total Coverage Gap findings
- **Addition count**: Total Scope Addition findings
- **Cascade count**: Total Cascade Violation findings (trilateral only)
- **Specificity count**: Total Specificity Gap findings

### Phase 7 — Generate reconciliation-data.json (FIRST — before any visual output)

This is the **single source of truth** for all visual outputs. Generate it before any other output file.

See [data-schema.md](data-schema.md) for the complete JSON schema.

The JSON must include:
- `meta` — mode, date, document names, file paths
- `scores` — overall alignment, per-document coverage, per-document maturity
- `stats` — finding counts by category and severity
- `requirements` — array of all PRD requirements with per-document status and a `reason` string explaining why each requirement has its status
- `findings` — array of all findings with ID, code, severity, docs tag, descriptions, quotes
- `inventories` — extracted inventories from each document (P1-P7, U1-U11, K1-K7)
- `namingDrift` — array of Naming Drift findings with terms per document
- `cascades` — array of Cascade Violation findings with full 3-step chain (trilateral only)
- `venn` — pre-computed overlap counts for diagram generation
- `groups` — feature area groupings for heatmap and treemap

**Token budget note**: This file is compact JSON — far smaller than equivalent inline HTML. A 50-requirement, 30-finding audit produces ~15-25KB of JSON vs ~80-120KB of inline HTML.

### Phase 8 — Generate reconciliation.md

See [report-template.md](report-template.md) for the complete structure.

Key sections:
- Executive summary with alignment scores and finding counts
- Document maturity assessment per document
- Requirement-by-requirement reconciliation table (showing status per document and the reason for each status)
- Conflict details (with full context from all involved documents)
- Coverage Gap details (tagged by which document is missing coverage)
- Scope Addition details (tagged by which document adds scope)
- Cascade Violation details (with full 3-doc trace)
- Specificity Gap details (with invented details highlighted)
- Naming Drift table
- Internal issues (PRD Internal, UX Internal, Mock Internal findings)
- Recommendations by severity

All data comes from the already-generated `reconciliation-data.json`. Do not re-analyze — just format the JSON data into markdown.

### Phase 9 — Generate reconciliation-matrix.html (static template)

See [reference.md](reference.md) for the complete HTML/CSS/JS template.

**CRITICAL: Do not inline any finding data into this file.** Copy the HTML template from [reference.md](reference.md) and ensure it loads data via:

```javascript
fetch('./reconciliation-data.json')
  .then(r => r.json())
  .then(data => renderDashboard(data));
```

The template is a static shell with:
- All CSS styles (fixed size, never grows with data)
- All JS rendering logic (reads JSON, creates DOM elements)
- Empty containers that JS populates at runtime
- Complete legend with all 9 finding categories (full names, no abbreviations), severities, statuses, and doc pair tags

The HTML file size is constant (~25-30KB) regardless of whether the audit has 5 findings or 500. This prevents token exhaustion.

Interactive features (all driven by JSON data at runtime):
- **Tab switching** between Matrix view, Heatmap view, and **Document Health** view
- **Coverage heatmap** — rows are requirements, columns are documents, cells are color-coded
- **Side-by-side matrix** — adapts to 2 or 3 columns based on `meta.mode`
- **Status reason** — each requirement row displays its `reason` text explaining why it has its current status. Shown inline below the requirement title or in an expandable detail panel.
- **Finding badges** inline with expandable details
- **Filter by**: status, severity, category (full names), document pair
- **Search by**: FR ID, keyword, component name
- **Per-document coverage gauges**
- **Alignment gauge** with overall score
- **Keyboard navigation** (/, Esc, [, ], Enter, L, H)

#### Document Health Tab

Third tab in the dashboard. Shows internal consistency issues per document — findings that indicate a document contradicts itself.

**Layout:** One column per provided document (PRD, UX, Mock). Each column shows:

1. **Document health score** in the header — percentage of internal checks that passed. Stored in `scores.health.prd`, `scores.health.ux`, `scores.health.mock`.
2. **Issue count badge** — total internal findings for that document.
3. **Expandable finding cards** — each internal finding (PRD Internal Issue, UX Internal Issue, Mock Internal Issue) with:
   - Category name (full, no abbreviation)
   - Severity badge (Blocker / Major / Minor)
   - Description
   - Exact quote from the document showing the contradiction/ambiguity
   - Recommendation
4. **Filter by severity** — Blocker / Major / Minor toggle filters across all columns.

**Data source:** Filters `findings[]` where `categoryKey` is `prd-internal`, `ux-internal`, or `mock-internal`. Health scores from `scores.health`.

### Phase 9B — Generate verification-map.html — SKIP if `visualVerification` is false

See [verification-map-template.md](verification-map-template.md) for the complete HTML/CSS/JS template.

**CRITICAL: Same data-template separation pattern.** This is a static HTML shell that loads `reconciliation-data.json` via `fetch()`. No inline data.

```javascript
fetch('../reconciliation-data.json')
  .then(r => r.json())
  .then(data => init(data));
```

**Complete coverage principle**: Every requirement from `requirements[]` and every UX component from `inventories.ux.U3` must appear in the UI. Nothing is omitted. Found elements get bounding boxes on screenshots; missing elements appear in the gaps/issues panel.

The template renders four integrated views:

- **Screenshot view** (default) — One tab per mock screenshot with SVG bounding box overlays. Each box is color-coded by requirement status (green=aligned, amber=partial, red=conflict, blue=gap). Labels show both the FR ID and the matched UX component name for dual traceability. Clicking a box opens the detail panel.

- **List view** — Table of ALL requirements (not just Puppeteer-verified ones) with columns: requirement ID + title, UX component match, reconciliation status, DOM status (found/not found/---), and matched selector. Every requirement in the reconciliation appears here.

- **Detail panel** — Three sections per selected element:
  1. **PRD Requirement**: ID, title, full description, status badge, and reason text
  2. **UX Component**: Matched component name, UX section reference, and variant list. Shows "No UX component matched" when absent.
  3. **DOM Detection**: Found/not-found status, matched selector, visibility, bounding box coordinates, and selectors tried (for not-found items)
  4. **Findings**: All linked findings with ID, severity badge, docsTag, and description

- **Side panel tabs**:
  1. **Detail** — Selected element detail (above)
  2. **Requirements** — Scrollable list of ALL requirements with status dot, title, reason, and DOM tag (Found/Missing/---)
  3. **UX Components** — Scrollable list of ALL UX components from U3 inventory, each showing match count against DOM elements
  4. **Issues** — Focused list of ONLY conflict and gap requirements with red/blue badges, Puppeteer evidence ("N selectors tried"), and linked findings. Badge count in tab header.

- **Summary header** — Pill badges showing counts: aligned, partial, conflict, gap. Plus total requirements, found count, not-found count.

- **Filters** — Status (aligned/partial/conflict/gap/na), DOM status (found/not found), UX component dropdown, mock file tabs.

- **Keyboard** — 1/2/3/4 switch panel tabs, Esc clears selection, arrow keys navigate.

Output path: `visual-verification/verification-map.html`

### Phase 10 — Generate Excalidraw Diagrams (one at a time) — SKIP if `generateDiagrams` is false

Only run this phase if the user opted in during Phase 0 step 6. If skipped, proceed directly to Phase 11.

See [excalidraw-templates.md](excalidraw-templates.md) for the JSON structure templates.

**Generate each file sequentially** — do not attempt all four in a single output. Read the required data slice from `reconciliation-data.json` for each diagram.

#### 10A. coverage-heatmap.excalidraw

Data source: `requirements[]` + `scores.perDocument`

Grid visualization:
- **Rows** = PRD requirements (grouped by `groups[]`)
- **Columns** = Documents (only those in `meta.documents`)
- **Cells** = Color-coded rectangles: green (aligned), yellow (partial), red (conflict), blue (gap), orange (addition), gray (N/A)
- **Row labels** on the left with FR ID and short title
- **Column headers** with document name and coverage percentage
- **Legend** at bottom with all status colors and their meanings

#### 10B. venn-overlap.excalidraw

Data source: `venn` object (pre-computed counts)

Overlap diagram:
- **2 circles** for bilateral mode, **3 circles** for trilateral
- **Intersection zones** labeled with count of shared definitions
- **Exclusive zones** labeled with count of self-additions
- **Center** (all overlap) shows fully aligned requirement count
- Color-coded: PRD = amber, UX = blue, Mock = green

#### 10C. traceability-flow.excalidraw

Data source: `requirements[]` + `findings[]`

Flow diagram showing requirement traceability:
- **Left column**: PRD requirements (amber rectangles)
- **Middle column** (if UX present): UX components/pages (blue rectangles)
- **Right column** (if Mock present): Mock screens (green rectangles)
- **Arrow colors**: green = aligned, red = conflict, orange = drift, dashed gray = gap
- **Cascade violations** highlighted with pink arrows spanning all columns

#### 10D. gap-treemap.excalidraw

Data source: `findings[]` + `groups[]`

Treemap showing findings distribution:
- **Outer rectangles** = Feature areas or pages
- **Inner rectangles** = Individual findings, sized by severity (BLOCKER largest)
- **Colors** match finding category colors
- **Labels** show finding ID and short description
- **Legend** at bottom

### Phase 11 — Validation & Self-Check

1. `reconciliation-data.json` is valid JSON and parseable
2. HTML template loads JSON successfully (test: open in browser, check console for errors)
3. Every finding ID in reconciliation.md exists in `reconciliation-data.json`
4. Finding descriptions are verbatim identical between MD and JSON
5. Severity consistent across MD and JSON
6. Counts in executive summary match `stats` object in JSON
7. Every Conflict finding references specific text from all involved documents
8. Every Coverage Gap finding cites the PRD requirement and identifies which document has the gap
9. Every Scope Addition finding cites the element and identifies which document added scope
10. Every Cascade Violation finding traces through all three documents with quotes
11. Every Specificity Gap finding identifies the invented detail and its source
12. Document pair tags (`[PRD<>UX]`, etc.) are present on every finding
13. No orphan findings (every finding maps to a requirement, component, or screen)
14. Conditional inventories and checks only ran when source data existed
15. Excalidraw files (if generated) are valid JSON matching the Excalidraw v2 schema
16. All diagrams (if generated) include complete legends
17. **Output completeness check**: Verify all expected files exist in the output directory before declaring done. If diagrams were opted out, do not flag their absence. If visual verification was opted out, do not flag its absence. If any expected file is missing, regenerate it from `reconciliation-data.json`.
18. **Visual verification consistency** (if Phase 3B ran): Every Coverage Gap finding for `[PRD<>Mock]` that has Puppeteer evidence must include the Puppeteer result in the finding description. The `visualVerification` section in `reconciliation-data.json` must match the `verification-results.json` file.
19. **Cross-pair coverage check (trilateral only):** For every PRD requirement that has a W or V finding tagged `[PRD<>UX]`, verify that Phase 4C independently evaluated the same requirement against Mock. If Mock also has a gap or conflict, a separate finding with `[PRD<>Mock]` must exist. Conversely, for every `[PRD<>Mock]` finding, verify Phase 4A independently evaluated against UX. Flag any requirement that has a finding in one direction but was never evaluated in the other.
20. **Verification map consistency** (if Phase 3B ran): `verification-map.html` exists in `visual-verification/`. Every checklist item with `status: "found"` must have a non-null `boundingBox` in `reconciliation-data.json`. The `uxComponentMatch` field must be populated for found items when UX document is provided (Phase 3B.5 ran).
21. **Bounding box validity** (if Phase 3B ran): Every `boundingBox` must have positive `width` and `height`. Coordinates `x` and `y` must be non-negative. If any bounding box is invalid, log a warning but do not fail.

### Phase 12 — Delta Mode (incremental analysis)

Activated when input #4 (previous reconciliation folder) is provided. This phase enables **incremental reconciliation** — only new or changed requirements are re-analyzed, while unchanged requirements carry forward their previous results.

#### 12A. Load Previous State

1. Load `reconciliation-data.json` from the previous reconciliation folder (not the MD report — the JSON is the structured source of truth)
2. Extract from the previous JSON:
   - `previousRequirements[]` — all requirement objects with their statuses, reasons, and finding mappings
   - `previousFindings[]` — all finding objects with IDs, codes, severities, descriptions
   - `previousScores` — alignment scores and per-document coverage
   - `previousMeta` — date, mode, document names

#### 12B. Identify What Changed

The user specifies what changed. Accept any of these formats:
- **Requirement IDs**: "FR-12, FR-15, FR-20 are new or changed"
- **Section reference**: "Section 3.2 of the PRD was rewritten"
- **Document-level**: "The UX document was updated" (re-analyze all UX-facing comparisons)
- **Full re-run**: "Everything changed" (falls back to full analysis, still generates delta summary)

If the user does not specify what changed, **ask once**: "Which requirements or sections changed since the last run? (e.g., FR-12, FR-15, or 'Section 3 of the PRD'). Say 'all' for a full re-run with delta comparison."

Build the **change set**:
- `changedRequirementIds` — explicit IDs the user listed
- `changedSections` — PRD sections that were rewritten (map to requirement IDs by reading the new PRD)
- `newRequirementIds` — requirement IDs present in the current PRD but absent from `previousRequirements[]`
- `removedRequirementIds` — requirement IDs present in `previousRequirements[]` but absent from current PRD

#### 12C. Carry Forward Unchanged Requirements

For every requirement NOT in the change set:
1. Copy the requirement object (status, reason, per-document status) directly from `previousRequirements[]` into the current `requirements[]`
2. Copy all findings linked to that requirement from `previousFindings[]` into the current `findings[]`
3. Mark these as `"deltaStatus": "carried_forward"` in the JSON output

**Do NOT re-read source documents or re-analyze** for carried-forward requirements. This saves significant context and tokens.

#### 12D. Analyze Changed Requirements

For requirements in the change set:
1. Run Phases 1-6 **only for the changed requirements** — extract relevant inventories, compare against all documents, generate findings
2. If a changed requirement previously had findings, those old findings are **replaced** by the new analysis
3. Mark new findings as `"deltaStatus": "new"` or `"deltaStatus": "changed"`
4. If a previously-existing requirement now has no findings where it had them before, the old findings are marked `"deltaStatus": "resolved"`

For `newRequirementIds`: Run full analysis (Phases 1-6). Mark as `"deltaStatus": "new"`.
For `removedRequirementIds`: Do not include in current output. Record in delta summary as removed.

#### 12E. Merge Results

1. Combine carried-forward + newly-analyzed requirements into a single `requirements[]` array
2. Combine carried-forward + new findings into a single `findings[]` array
3. Recalculate `scores` and `stats` from the merged data
4. Update `meta.deltaMode = true`, `meta.previousRun = "<previous folder path>"`, `meta.changeSet = { changed: [...], new: [...], removed: [...] }`

#### 12F. Generate Delta Summary

Generate `delta-summary.md` with:

1. **Run comparison header**: current date vs previous date, documents compared
2. **Score trend**: alignment score previous -> current (with arrow indicator)
3. **Per-document maturity trend**: previous -> current per document
4. **New findings**: findings that did not exist in the previous run (from changed/new requirements)
5. **Resolved findings**: findings from the previous run that no longer appear (requirement changed and finding gone, or requirement removed)
6. **Changed findings**: findings where the same requirement still has a finding but severity, status, or description changed
7. **Persistent findings**: findings that carried forward unchanged (count only, no detail)
8. **New requirements added**: list of requirement IDs added since last run
9. **Requirements removed**: list of requirement IDs no longer in PRD
10. **Carry-forward count**: "N requirements carried forward without re-analysis"

Also add `delta` section to `reconciliation-data.json`:
```json
{
  "delta": {
    "previousRunDate": "2026-02-15",
    "currentRunDate": "2026-03-06",
    "scoresTrend": { "previous": 72, "current": 81 },
    "carriedForward": 38,
    "reAnalyzed": 7,
    "newRequirements": ["FR-51", "FR-52"],
    "removedRequirements": ["FR-10"],
    "newFindings": ["conflict-31", "coverage-gap-45"],
    "resolvedFindings": ["conflict-12", "coverage-gap-20"],
    "changedFindings": ["conflict-5"],
    "persistentFindingCount": 22
  }
}
```

#### 12G. Generate Outputs

After merging, proceed to Phases 7-11 as normal using the merged data. The MD report and HTML dashboard show the complete current state (not just the delta). The delta summary is an **additional** output file.

---

## Important Principles

1. **Document-scoped** — Only compare what's written. Don't infer intent beyond the text.
2. **Verbatim citations** — Every finding must quote specific text from all involved documents.
3. **PRD is source of truth** — When there's ambiguity about what's "correct", PRD wins.
4. **Severity consistency** — A finding's severity must be the same in all outputs.
5. **Multi-directional** — Always check all applicable directions for the input mode.
6. **Non-destructive** — Never modify the input documents.
7. **Adaptive extraction** — Not all documents define the same things. Extract only what exists. Skip inventories and comparison sub-checks when source data is absent. Never fabricate structure the document doesn't describe.
8. **Format-agnostic** — Documents may use tables, prose, ASCII trees, bullet lists, or any format. Parse whatever structure the document provides.
9. **Data consistency** — The MD report, HTML dashboard, and Excalidraw diagrams must all reflect exactly the same findings. Never rewrite or summarize differently between outputs.
10. **Self-describing outputs** — Every shorthand code, color, or label must have a visible legend or glossary in the same output. No unexplained abbreviations.
11. **Data-first generation** — Always generate `reconciliation-data.json` before any visual output. The HTML template is static and loads data at runtime via `fetch()`. Never inline finding data into HTML. This prevents output token exhaustion on large audits.
12. **Sequential output generation** — Generate files in order: JSON -> MD -> HTML dashboard -> verification-map.html (if visual verification ran) -> Excalidraw (one diagram at a time, only if user opted in). If token budget runs low, stop after HTML dashboard — the JSON + MD pair is the minimum viable output.
13. **Output completeness verification** — After all files are generated, verify every expected file exists. If any is missing, regenerate it from `reconciliation-data.json` (not from scratch).
14. **Session-safe checkpointing** — `reconciliation-data.json` is the checkpoint. Once written, all analysis is persisted. If context runs out, the user starts a new session pointing to the JSON and only missing outputs are generated. Never re-read original documents in a resume session.
15. **Proactive context warnings** — At Phase 0, estimate context pressure from input document sizes. If documents total >5000 lines, warn the user upfront that the workflow will split across sessions. Do not silently run out of context and leave empty files.
16. **Direct execution, no subagents** — Run all phases (extraction, comparison, output generation) directly in the main conversation. Do NOT delegate extraction or comparison to subagents/sub-tasks. Subagents add tool-call overhead, duplicate context reads, and run slower than sequential direct execution. Read each document once, extract all inventories in a single pass, then proceed to comparison. The only exception is Phase 10 (Excalidraw diagrams), where each diagram may be generated as a separate write operation.

---

## Cross-references

- For reconciliation-data.json schema, see [data-schema.md](data-schema.md)
- For reconciliation.md report structure, see [report-template.md](report-template.md)
- For reconciliation-matrix.html template, see [reference.md](reference.md)
- For Excalidraw diagram templates, see [excalidraw-templates.md](excalidraw-templates.md)
- For Puppeteer visual verification script, see [puppeteer-visual-verification.md](puppeteer-visual-verification.md)
- For verification map HTML template, see [verification-map-template.md](verification-map-template.md)
