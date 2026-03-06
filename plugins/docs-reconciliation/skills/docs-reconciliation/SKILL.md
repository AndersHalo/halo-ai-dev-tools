---
name: docs-reconciliation
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

---

## Inputs

| # | Input | Required | Description |
|---|-------|----------|-------------|
| 1 | **PRD file** | Yes | Markdown file with product requirements, features, pages, flows |
| 2 | **UX Design System file** | No | Markdown file with design tokens, components, layout, states, responsive behavior |
| 3 | **Mock file or folder** | No | Markdown description of mocks, annotated screenshots, or HTML mock files |
| 4 | **Previous reconciliation folder** | No | Enables delta mode — compares against a prior run |
| 5 | **Generate Excalidraw diagrams** | No | If not provided by the user, **ask**: "Would you like to generate Excalidraw diagrams (coverage heatmap, Venn overlap, traceability flow, gap treemap)? These are optional and can be generated later from the JSON data." Accepts yes/no. Defaults to no if the user does not specify. |

**Rules:**
- At least **PRD + one other document** must be provided
- All file paths must be provided explicitly by the user. Never auto-discover.
- The skill adapts to whichever combination is provided (PRD+UX, PRD+Mock, PRD+UX+Mock)
- If the user explicitly includes or excludes diagrams in their request, respect that choice without asking again

---

## Input Modes

| Mode | Documents | Comparison Directions |
|------|-----------|----------------------|
| **Bilateral: PRD+UX** | PRD, UX | PRD <-> UX |
| **Bilateral: PRD+Mock** | PRD, Mock | PRD <-> Mock |
| **Trilateral: Full** | PRD, UX, Mock | PRD <-> UX, PRD <-> Mock, UX <-> Mock, PRD -> UX -> Mock cascade |

---

## Outputs

All written to `docs/audit/docs-reconciliation/{analysis_name}/` where `{analysis_name}` is kebab-case `[prd-title]-[YYYY-MM-DD]`.

```
docs/audit/docs-reconciliation/{analysis_name}/
├── reconciliation.md                # Main markdown report
├── reconciliation-data.json         # Structured data (single source of truth for all visual outputs)
├── reconciliation-matrix.html       # Interactive HTML dashboard (loads reconciliation-data.json)
├── diagrams/                        # Only if user opts in to diagram generation
│   ├── coverage-heatmap.excalidraw  # Requirement x Document coverage grid
│   ├── venn-overlap.excalidraw      # 2 or 3 circle document overlap
│   ├── traceability-flow.excalidraw # Requirement flow: PRD -> UX -> Mock
│   └── gap-treemap.excalidraw       # Findings by area, sized by count
└── delta-summary.md                 # Only in delta mode
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
3. **If context is running low after writing JSON**, stop the current session. The user can start a new session and say: "Generate outputs from `docs/audit/docs-reconciliation/{analysis_name}/reconciliation-data.json`". The skill resumes from Phase 8.
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

### Cross-document findings (shown in matrix and report)

| # | Code | Name | Color | Hex | Scope | Description |
|---|------|------|-------|-----|-------|-------------|
| 1 | **V** | Conflict | Red | `#ef4444` | Any 2+ docs | Two or more documents define contradictory behavior for the same feature |
| 2 | **N** | Naming Drift | Violet | `#7c3aed` | Any 2+ docs | Same concept uses different names across documents |
| 3 | **W** | Coverage Gap | Blue | `#3b82f6` | PRD -> target | PRD requires something the target document does not define |
| 4 | **Q** | Scope Addition | Orange | `#f97316` | Target -> PRD | A satellite document defines something with no PRD justification |
| 5 | **C** | Cascade Violation | Pink | `#ec4899` | PRD -> UX -> Mock | Progressive drift: PRD says X, UX interpreted as Y, Mock built Z |
| 6 | **S** | Specificity Gap | Amber | `#f59e0b` | Downstream -> source | A downstream document invented details not present in its source |

### Internal findings (report-only, not in matrix)

| # | Code | Name | Color | Hex | Scope |
|---|------|------|-------|-----|-------|
| 7 | **D** | PRD Internal Issue | Indigo | `#6366f1` | Contradictions, ambiguity, or gaps within the PRD itself |
| 8 | **E** | UX Internal Issue | Teal | `#14b8a6` | Contradictions, ambiguity, or undefined references within UX |
| 9 | **M** | Mock Internal Issue | Slate | `#64748b` | Contradictions, inconsistencies, or orphan elements within the Mock |

### Severity Levels

| Level | Meaning |
|-------|---------|
| BLOCKER | Documents directly contradict — cannot proceed to next phase until resolved |
| MAJOR | Significant gap or ambiguity — likely causes rework if not resolved |
| MINOR | Terminology inconsistency or minor omission — low risk |

---

## Finding ID Rules

- IDs are globally sequential per prefix: V1, V2, N1, N2, W1, Q1, C1, S1, D1, E1, M1
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
3. Create output directory `docs/audit/docs-reconciliation/{analysis_name}/`
4. If previous reconciliation folder provided, load it for delta comparison
5. **Estimate context pressure**: Count total lines across all input documents. If >5000 lines total, warn the user that the workflow may need to split across sessions, and that `reconciliation-data.json` will be the checkpoint
6. **Resolve diagram choice**: If the user already specified input #5 (generate diagrams yes/no), use that. Otherwise, ask: "Would you like to generate Excalidraw diagrams (coverage heatmap, Venn overlap, traceability flow, gap treemap)? These are optional and can be generated later from the JSON data." Record the choice as `generateDiagrams` (boolean). If false, skip Phase 10 entirely.

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
| Is the feature/page defined in UX (U5)? | **W** — Coverage Gap `[PRD<>UX]` |
| Are required components designed in UX (U3)? | **W** — Coverage Gap `[PRD<>UX]` |
| Are required states designed (U4)? | **W** — Coverage Gap `[PRD<>UX]` |
| Does UX define the same behavior PRD requires? | **V** — Conflict `[PRD<>UX]` |
| Do component/page names match? | **N** — Naming Drift `[PRD<>UX]` |

**A2. Flow checks** (if P5 and U11 both exist):

| Check | Finding if failed |
|-------|-------------------|
| Does UX navigation map cover all flow steps? | **W** — Coverage Gap `[PRD<>UX]` |
| Do flow step sequences match? | **V** — Conflict `[PRD<>UX]` |

**A3. Page section checks** (if P7 and U9 both exist):

| Check | Finding if failed |
|-------|-------------------|
| Is this section present in UX page composition? | **W** — Coverage Gap `[PRD<>UX]` |
| Do section contents match PRD expectations? | **V** — Conflict `[PRD<>UX]` |

**A4. Component variant checks** (if P3 mentions variants and U3 defines them):

| Check | Finding if failed |
|-------|-------------------|
| Does UX define all variants PRD references? | **W** — Coverage Gap `[PRD<>UX]` |

#### 4B. UX -> PRD (does UX add things beyond PRD?)

**B1. Component/page checks** — For each UX component (U3) and page (U5):

| Check | Finding if failed |
|-------|-------------------|
| Does this component map to a PRD requirement? | **Q** — Scope Addition `[PRD<>UX]` |
| Does this page map to a PRD page/view? | **Q** — Scope Addition `[PRD<>UX]` |
| Are there UX states with no PRD justification? | **Q** — Scope Addition `[PRD<>UX]` |
| Are there interaction patterns not in PRD? | **Q** — Scope Addition `[PRD<>UX]` |

**B2. Page composition checks** (if U9 exists):

| Check | Finding if failed |
|-------|-------------------|
| Does this section have PRD backing (P7 or P1)? | **Q** — Scope Addition `[PRD<>UX]` |

**B3. Navigation checks** (if U11 exists):

| Check | Finding if failed |
|-------|-------------------|
| Does this navigation flow map to a PRD flow (P5)? | **Q** — Scope Addition `[PRD<>UX]` |

#### 4C. PRD -> Mock (does Mock cover what PRD requires?)

**C1. Requirement-level checks** — For each PRD requirement (P1):

| Check | Finding if failed |
|-------|-------------------|
| Is the feature/page represented in a mock screen (K1)? | **W** — Coverage Gap `[PRD<>Mock]` |
| Are required components visually present (K2)? | **W** — Coverage Gap `[PRD<>Mock]` |
| Are required states shown (K4)? | **W** — Coverage Gap `[PRD<>Mock]` |
| Does the mock show behavior contradicting PRD? | **V** — Conflict `[PRD<>Mock]` |
| Do data fields match PRD requirements (K6 vs P1)? | **V** — Conflict `[PRD<>Mock]` |

**C2. Flow checks** (if P5 and K5 both exist):

| Check | Finding if failed |
|-------|-------------------|
| Does mock navigation cover all flow steps? | **W** — Coverage Gap `[PRD<>Mock]` |
| Do flow step sequences match? | **V** — Conflict `[PRD<>Mock]` |

#### 4D. Mock -> PRD (does Mock add things beyond PRD?)

**D1. Screen/component checks** — For each mock screen (K1) and component (K2):

| Check | Finding if failed |
|-------|-------------------|
| Does this screen map to a PRD page/view? | **Q** — Scope Addition `[PRD<>Mock]` |
| Does this component map to a PRD requirement? | **Q** — Scope Addition `[PRD<>Mock]` |
| Are there data fields shown with no PRD requirement? | **Q** — Scope Addition `[PRD<>Mock]` |

#### 4E. UX <-> Mock (do UX and Mock agree?) — Only in trilateral mode

**E1. Component alignment** — For each UX component (U3) present in mock (K2):

| Check | Finding if failed |
|-------|-------------------|
| Does mock render the component as UX specifies? | **V** — Conflict `[UX<>Mock]` |
| Do variant choices match UX definitions? | **V** — Conflict `[UX<>Mock]` |
| Does mock follow UX state definitions? | **V** — Conflict `[UX<>Mock]` |

**E2. Layout alignment** (if U9 and K3 both exist):

| Check | Finding if failed |
|-------|-------------------|
| Does mock layout match UX page composition? | **V** — Conflict `[UX<>Mock]` |

**E3. Visual spec alignment** (if U1/U2 and K7 both exist):

| Check | Finding if failed |
|-------|-------------------|
| Do mock colors match UX design tokens? | **V** — Conflict `[UX<>Mock]` |
| Does mock typography match UX specs? | **V** — Conflict `[UX<>Mock]` |

**E4. Mock additions beyond UX**:

| Check | Finding if failed |
|-------|-------------------|
| Does mock show components not in UX registry? | **Q** — Scope Addition `[UX<>Mock]` |
| Does mock show states not in UX state definitions? | **Q** — Scope Addition `[UX<>Mock]` |

#### 4F. Cascade Detection — Only in trilateral mode

For each requirement that appears in all three documents, trace the interpretation chain:

**F1. Cascade violation check** — PRD -> UX -> Mock:

| Check | Finding if failed |
|-------|-------------------|
| PRD says X, UX says Y (drift), Mock says Z (further drift) | **C** — Cascade Violation `[PRD>UX>Mock]` |
| Progressive interpretation: each document drifts further from PRD's original intent | **C** — Cascade Violation `[PRD>UX>Mock]` |

**F2. Specificity gap check**:

| Check | Finding if failed |
|-------|-------------------|
| UX invented details not present in PRD | **S** — Specificity Gap `[PRD<>UX]` |
| Mock invented details not present in UX | **S** — Specificity Gap `[UX<>Mock]` |
| Mock invented details not present in PRD | **S** — Specificity Gap `[PRD<>Mock]` |

### Phase 5 — Internal Consistency

#### 5A. PRD Self-Check (D findings)

| Check | Example |
|-------|---------|
| Contradictory requirements | FR-5 says "public access", FR-12 says "auth required" for same page |
| Undefined references | FR-8 references "admin dashboard" but no page defined |
| Ambiguous requirements | "The system should handle large datasets" — no threshold |
| Duplicate/overlapping FRs | FR-3 and FR-15 describe the same feature differently |
| Inconsistent terminology | Uses "Resource" and "Asset" interchangeably |

#### 5B. UX Self-Check (E findings) — skip if UX not provided

| Check | Example |
|-------|---------|
| Undefined tokens | Component references `--accent` but token not defined |
| Contradictory specs | Card says `border-radius: 12px` in one place, `8px` in another |
| Missing states | Button component defines hover but not disabled |
| Incomplete responsive | Desktop defined, tablet/mobile not specified |
| Orphan components | Component defined but not placed on any page |
| Page composition gaps | Page lists a section but no components assigned |
| Navigation dead-ends | Page in navigation map has no outbound routes |

#### 5C. Mock Self-Check (M findings) — skip if Mock not provided

| Check | Example |
|-------|---------|
| Inconsistent components | Same component looks different across screens |
| Missing states | Error screen referenced in flow but not mocked |
| Orphan screens | Screen exists but unreachable from navigation |
| Data inconsistency | Same entity shows different fields on different screens |
| Visual inconsistency | Different colors/fonts for same element type across screens |

### Phase 6 — Reconciliation Scoring

Build a requirement-level scorecard:

| Status | Meaning |
|--------|---------|
| **Aligned** | PRD requirement fully covered in all provided documents, no conflicts |
| **Partial** | Covered in some documents but gaps remain |
| **Conflict** | Two or more documents contradict on this requirement |
| **Gap** | Missing from one or more target documents |
| **N/A** | Requirement doesn't need definition in target documents (backend, infrastructure) |

Calculate per-document and overall scores:

- **Overall alignment score**: % of requirements Aligned across all documents
- **Per-document coverage**: % of requirements covered in each document
- **Document maturity score**: Per-document completeness rating (how much of its own domain it covers)
- **Conflict count**: Total V findings
- **Gap count**: Total W findings
- **Addition count**: Total Q findings
- **Cascade count**: Total C findings (trilateral only)
- **Specificity count**: Total S findings

### Phase 7 — Generate reconciliation-data.json (FIRST — before any visual output)

This is the **single source of truth** for all visual outputs. Generate it before any other output file.

See [data-schema.md](data-schema.md) for the complete JSON schema.

The JSON must include:
- `meta` — mode, date, document names, file paths
- `scores` — overall alignment, per-document coverage, per-document maturity
- `stats` — finding counts by category and severity
- `requirements` — array of all PRD requirements with per-document status
- `findings` — array of all findings with ID, code, severity, docs tag, descriptions, quotes
- `inventories` — extracted inventories from each document (P1-P7, U1-U11, K1-K7)
- `namingDrift` — array of N findings with terms per document
- `cascades` — array of C findings with full 3-step chain (trilateral only)
- `venn` — pre-computed overlap counts for diagram generation
- `groups` — feature area groupings for heatmap and treemap

**Token budget note**: This file is compact JSON — far smaller than equivalent inline HTML. A 50-requirement, 30-finding audit produces ~15-25KB of JSON vs ~80-120KB of inline HTML.

### Phase 8 — Generate reconciliation.md

See [report-template.md](report-template.md) for the complete structure.

Key sections:
- Executive summary with alignment scores and finding counts
- Document maturity assessment per document
- Requirement-by-requirement reconciliation table (showing status per document)
- Conflict details (V findings with full context from all involved documents)
- Gap details (W findings, tagged by which document is missing coverage)
- Addition details (Q findings, tagged by which document adds scope)
- Cascade violations (C findings with full 3-doc trace)
- Specificity gaps (S findings with invented details highlighted)
- Naming drift table (N findings)
- Internal issues (D, E, M findings)
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
- Complete legend with all 9 finding categories, severities, statuses, and doc pair tags

The HTML file size is constant (~25-30KB) regardless of whether the audit has 5 findings or 500. This prevents token exhaustion.

Interactive features (all driven by JSON data at runtime):
- **Tab switching** between Matrix view and Heatmap view
- **Coverage heatmap** — rows are requirements, columns are documents, cells are color-coded
- **Side-by-side matrix** — adapts to 2 or 3 columns based on `meta.mode`
- **Finding badges** inline with expandable details
- **Filter by**: status, severity, category, document pair
- **Search by**: FR ID, keyword, component name
- **Per-document coverage gauges**
- **Alignment gauge** with overall score
- **Keyboard navigation** (/, Esc, [, ], Enter, L, H)

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
7. Every V finding references specific text from all involved documents
8. Every W finding cites the PRD requirement and identifies which document has the gap
9. Every Q finding cites the element and identifies which document added scope
10. Every C finding traces through all three documents with quotes
11. Every S finding identifies the invented detail and its source
12. Document pair tags (`[PRD<>UX]`, etc.) are present on every finding
13. No orphan findings (every finding maps to a requirement, component, or screen)
14. Conditional inventories and checks only ran when source data existed
15. Excalidraw files (if generated) are valid JSON matching the Excalidraw v2 schema
16. All diagrams (if generated) include complete legends
17. **Output completeness check**: Verify all expected files exist in the output directory before declaring done. If diagrams were opted out, do not flag their absence. If any expected file is missing, regenerate it from `reconciliation-data.json`.
18. **Cross-pair coverage check (trilateral only):** For every PRD requirement that has a W or V finding tagged `[PRD<>UX]`, verify that Phase 4C independently evaluated the same requirement against Mock. If Mock also has a gap or conflict, a separate finding with `[PRD<>Mock]` must exist. Conversely, for every `[PRD<>Mock]` finding, verify Phase 4A independently evaluated against UX. Flag any requirement that has a finding in one direction but was never evaluated in the other.

### Phase 12 — Delta Mode (optional)

If a previous reconciliation folder is provided:

1. Load previous `reconciliation.md`
2. Compare findings: Resolved / Persistent / New / Regressed
3. Generate `delta-summary.md` with:
   - New conflicts introduced
   - Conflicts resolved
   - Gaps that opened or closed
   - Additions that were formalized into PRD or removed
   - Cascade violations resolved or introduced
   - Alignment score trend per document
   - Document maturity score trend

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
12. **Sequential output generation** — Generate files in order: JSON -> MD -> HTML -> Excalidraw (one diagram at a time, only if user opted in). If token budget runs low, stop after HTML — the JSON + MD pair is the minimum viable output.
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
