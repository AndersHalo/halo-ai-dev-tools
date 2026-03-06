---
name: prd-mock-audit
description: "Audit UX HTML mocks against a PRD. Bi-directional gap analysis (PRD→Mock and Mock→PRD), component consistency, mock self-validation, and PRD internal consistency. Generates markdown report, annotated HTML with color-coded highlights, and interactive coverage heatmap."
---

# PRD vs. Mock — Complete Audit Skill

Systematically analyze HTML UX mocks against a PRD. Produces a comprehensive audit: functional inventory, bi-directional gap analysis, component consistency, mock self-validation, and PRD internal consistency.

**Scope boundary:** This skill audits mocks against the **PRD only**.
- **Visual/UX details** (colors, typography, tokens, spacing) — only if PRD specifies them
- **Accessibility/WCAG** — only if PRD specifies accessibility requirements
- If the PRD does not mention a topic, skip the corresponding section/phase entirely

### When to use this skill vs. docs-audit

| | **prd-mock-audit** (this skill) | **docs-audit** |
|---|---|---|
| **Stage** | Post-implementation — mocks already built | Pre-implementation — aligning documents before build |
| **Inputs** | PRD + HTML mock files | PRD + UX Design System and/or Mock documents |
| **Focus** | Quality of the built mock vs. what the PRD says | Cross-document consistency, coverage gaps, naming drift |
| **Outputs** | Annotated HTML, gap analysis, component consistency | Reconciliation report, coverage heatmap, Excalidraw diagrams, verification map |
| **Use when** | You have working HTML and want to verify correctness | You want to ensure PRD, UX, and Mock docs agree before coding |

---

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| PRD file | **Yes** | Path to PRD markdown file |
| HTML mock files | **Yes** | Path(s) to HTML mock file(s) or directory |
| Previous audit report | No | Path to previous `analysis.md` for delta mode |

All paths must be explicitly provided. Never auto-discover. Confirm with user before starting.

## Outputs

All go into `docs/audit/prd/{analysis_name}/` (kebab-case, e.g., `dashboard-mvp-2026-03-04`).

```
docs/audit/prd/{analysis_name}/
├── analysis.md                     # Main audit report
├── coverage-heatmap.html           # Interactive heatmap (optional)
└── annotated/
    └── {page}-annotated.html       # Annotated HTML copies
```

---

## Finding Categories (9)

### Annotated on HTML (8 categories)

| # | Prefix | Category | Color | Hex | Direction |
|---|--------|----------|-------|-----|-----------|
| 1 | **C** | Contradiction | Red | `#ef4444` | PRD → Mock |
| 2 | **G** | Gap | Blue | `#3b82f6` | PRD → Mock |
| 3 | **A** | Accessibility | Yellow | `#f59e0b` | PRD → Mock (conditional) |
| 4 | **D** | Design Decision | Green | `#10b981` | Mock → PRD |
| 5 | **S** | Scope Creep | Orange | `#f97316` | Mock → PRD |
| 6 | **P** | Placeholder | Gray | `#9ca3af` | Mock → PRD |
| 7 | **X** | Component Inconsistency | Purple | `#8b5cf6` | Cross-page |
| 8 | **M** | Mock Self-Validation | Teal | `#14b8a6` | Mock ↔ Mock |

### Report-only (1 category — NOT annotated on HTML)

| # | Prefix | Category | Color | Hex | Scope |
|---|--------|----------|-------|-----|-------|
| 9 | **R** | PRD Internal Issue | Indigo | `#6366f1` | PRD contradictions, ambiguity |

### Severity Levels

| Level | Meaning |
|-------|---------|
| BLOCKER | Objectively wrong / blocking development |
| MAJOR | Significant rework needed |
| MINOR | Cosmetic or low-impact |

### Finding ID Rules
- All IDs globally sequential per prefix: C1, C2, G1, G2, M1, M2, etc.
- Descriptions must be **verbatim identical** across analysis.md, annotated HTML, and heatmap
- Severity must be consistent across all outputs

---

## Workflow

### Phase 1 — Mock UI Inventory

Read each HTML mock. For each, extract:

**A. Component Census** (always) — Every UI component by type, count, location, variants.

**B. Color Palette** (only if PRD defines colors) — Every unique color from inline styles and `<style>` blocks vs. PRD values.

**C. Typography Map** (only if PRD defines typography) — Font families, sizes, weights vs. PRD values.

**D. Layout Patterns** (only if PRD defines layout) — Page structure, grid systems, spacing tokens, container widths.

**E. Interactive Elements** (always) — All interactive elements with states shown and states missing.

**F. Media & Assets** (always) — Images, icons, SVGs with alt text status. Flag placeholder content.

### Phase 2 — PRD Requirement Extraction

1. Read full PRD, extract all Functional Requirements (FR numbers + sub-requirements)
2. Build complete requirement list with descriptions for traceability

### Phase 3 — Bi-directional Comparison

#### Direction A: PRD → Mock

For each FR, check if mock represents it accurately:
- **Contradiction (C)** — Mock shows something PRD forbids or defines differently
- **Gap (G)** — PRD requires something the mock omits

#### Direction B: Mock → PRD

For each mock element with no matching FR:
- **Design Decision (D)** — Reasonable UX enhancement not in PRD (loading states, hover effects, tooltips)
- **Scope Creep (S)** — Feature beyond PRD scope (extra widgets, unrequested charts)
- **Placeholder (P)** — Temporary content (lorem ipsum, stock photos, `example.com`)

### Phase 4 — Accessibility Audit (conditional)

**Skip if PRD doesn't mention accessibility/WCAG.**

If PRD specifies accessibility, check:

**Tier 1 — Structural:** Missing alt attributes, non-semantic HTML, missing form labels, skip-nav links, heading hierarchy, lang attribute, ARIA roles, tabindex misuse.

**Tier 2 — Visual & Interaction:** Color contrast ratios (WCAG AA: 4.5:1 normal, 3:1 large), touch target sizes, focus indicators, color-only information, motion without `prefers-reduced-motion`.

Generate accessibility scorecard with WCAG level estimate (AAA/AA/A/Below A).

### Phase 5 — Component Consistency

Compare same-type components across all mock pages. Flag:
- **Behavior** inconsistencies (always checked)
- **Structure** inconsistencies (always checked)
- **Style** inconsistencies (only if PRD defines design tokens)

### Phase 5A — PRD Page Description Compliance (conditional)

**Only if PRD contains page-level prose descriptions** (beyond numbered FRs).

1. Extract described elements from PRD page narratives
2. Cross-reference each with mock
3. Classify as Gap (G) or Contradiction (C) — uses global ID sequence, no duplicates with Phase 3

### Phase 5B — Mock Self-Validation (always)

Validate mock's internal consistency independent of PRD. See [phase-details.md](phase-details.md) for detailed procedures.

**Part A — Data Consistency:** Systematic claim-by-claim validation. Inventory every numeric count, total, percentage, state indicator, navigation signal, and cross-reference on each page. Validate each against visible source data. 8 mismatch types: count, sum, percentage, state, location, reference, temporal, cross-element.

**Part B — Structural & Flow:** Navigation integrity (dead-ends, orphans), interaction completeness (missing states), orphan elements, logic/affordance contradictions, cross-page flow validation. 6 structural sub-types.

All findings use M prefix, single sequence M1-MN.

### Phase 5C — PRD Internal Consistency (always)

Analyze PRD for internal contradictions. See [phase-details.md](phase-details.md) for detailed procedures.

7 check types: contradictory requirements, ambiguous FRs, undefined references, overlapping FRs, inconsistent terminology, missing prerequisites, scope gaps.

All findings use R prefix (report-only, NOT in annotated HTML). If R finding affects Phase 3 results, cross-reference in the C/G finding.

### Phase 6 — Requirement Traceability Matrix

Map every FR and sub-requirement to status across mocks:
- **Covered** — Mock accurately represents the requirement
- **Partial** — Mock shows requirement incompletely
- **Missing** — No mock addresses this requirement
- **Contradicted** — Mock actively contradicts the requirement

Coverage: `(Covered + 0.5 × Partial) / Total × 100`

### Phase 7 — Markdown Report

Generate `analysis.md`. See [report-template.md](report-template.md) for complete structure.

Parts: Executive Summary → Mock UI Inventory → PRD→Mock Analysis → Mock→PRD Analysis → Accessibility (conditional) → Component Consistency → Page Description Compliance (conditional) → Mock Self-Validation → PRD Internal Consistency → Cross-Cutting Issues → Recommendations.

### Phase 8 — Annotated HTML Files

For each mock, create `annotated/{name}-annotated.html`. See [reference.md](reference.md) for complete CSS, HTML, and JavaScript templates.

**A. Inline Highlights** — 8 color-coded dashed outlines with circular badges. Every badge has `data-ann-id`, `data-ann-title`, `data-ann-severity`. Hover tooltip on badges.

**B. Interactive Panel** — 400px fixed slide-out panel (dark `#18181b` theme):
- Toggle button (top-right) with dot + count per category
- Summary stats bar (total / blocker / major / minor)
- Search input (real-time filter)
- 2-row legend grid
- 8 collapsible sections with static descriptions (visible when collapsed)
- Visibility toggle per category (hides panel section + inline highlights)
- Bidirectional navigation: badge ↔ panel with pulse animation
- Keyboard: `Esc` close, `[`/`]` prev/next, `/` search

### Phase 9 — Validation & Self-Check

**A. Report Integrity:** Count consistency, ID sequencing, FR reference validity, coverage math.

**B. Annotated HTML:** Badge-panel sync (both directions), toggle counts, stats bar, data attributes, severity pills, section descriptions, sidebar links.

**C. Accessibility** (if Phase 4 ran): Contrast math, scorecard totals, WCAG criterion validity.

**D. Cross-Page:** Component matrix completeness, finding deduplication, PRD-scoped sections.

**E. Cross-Output Consistency** (analysis.md ↔ annotated HTML ↔ heatmap):
- Finding ID completeness across outputs (R prefix = report-only, skip annotated HTML)
- Heatmap `HEATMAP_DATA` rows/columns/statuses match traceability matrix
- Heatmap `detail` text is **verbatim** from analysis.md (not paraphrased)
- Heatmap `desc` matches sub-requirement description from traceability matrix
- Coverage % consistent across outputs
- Severity consistent across outputs

**F. Self-Validation Checks:** M findings don't duplicate C/G findings. M sequence unified. R findings report-only. R cross-references noted.

### Phase 10 — Delta Mode (optional)

Compare current findings against previous `analysis.md`. Classify each as Resolved / Persistent / New / Regressed. Add Delta Summary section. See [report-template.md](report-template.md) §Delta Summary.

### Phase 11 — Interactive Coverage Heatmap (optional)

Generate `coverage-heatmap.html`. See [reference.md](reference.md) for complete template.

- Rows = FR requirements, Columns = mock pages
- Cells: Green (covered), Yellow (partial), Red (contradicted), Gray (missing)
- Filters, search, sticky headers, tooltip, click-to-detail
- **Anti-drift rule:** Every `detail` string must be copied verbatim from analysis.md. Re-read findings before writing heatmap data.

### Phase 12 — Build Requirements (optional)

If user requests build readiness: explore codebase, add "Page Build Requirements" section. See [reference.md](reference.md) §Build Requirements.

---

## Parallelization

- Read PRD + all mocks in parallel (Phases 1 & 2)
- Create annotated HTML files in parallel using Task agents (Phase 8)

---

## Cross-references

- For complete CSS, HTML templates, JS, and heatmap: [reference.md](reference.md)
- For analysis.md report structure: [report-template.md](report-template.md)
- For Phase 5B/5C detailed procedures: [phase-details.md](phase-details.md)
