# Reconciliation Report Template (reconciliation.md)

This document defines the structure for the main markdown reconciliation report generated in Phase 7.

---

## Report Structure

```markdown
# Multi-Document Reconciliation Report — {Title}

**Date:** YYYY-MM-DD
**Mode:** {Bilateral: PRD+UX | Bilateral: PRD+Mock | Trilateral: PRD+UX+Mock}
**PRD:** {filename}
**UX Spec:** {filename or "Not provided"}
**Mock:** {filename or "Not provided"}

## Glossary

### Finding Categories

| Code | Name | Color | Scope | Meaning |
|------|------|-------|-------|---------|
| **V** | Conflict | Red | Any 2+ docs | Two or more documents define contradictory behavior |
| **N** | Naming Drift | Violet | Any 2+ docs | Same concept uses different names across documents |
| **W** | Coverage Gap | Blue | PRD -> target | PRD requires something the target document does not define |
| **Q** | Scope Addition | Orange | Target -> PRD | A satellite document adds something with no PRD justification |
| **C** | Cascade Violation | Pink | PRD -> UX -> Mock | Progressive drift across the document chain |
| **S** | Specificity Gap | Amber | Downstream -> source | Downstream document invented details not in source |
| **D** | PRD Internal Issue | Indigo | PRD only | Contradictions, ambiguity, or gaps within the PRD |
| **E** | UX Internal Issue | Teal | UX only | Contradictions or undefined references within UX |
| **M** | Mock Internal Issue | Slate | Mock only | Contradictions or inconsistencies within the Mock |

### Severity Levels

| Level | Meaning |
|-------|---------|
| **BLOCKER** | Documents directly contradict — blocks next phase |
| **MAJOR** | Significant gap or ambiguity — likely causes rework |
| **MINOR** | Terminology inconsistency or minor omission — low risk |

### Document Pair Tags

| Tag | Meaning |
|-----|---------|
| `[PRD<>UX]` | Finding involves PRD and UX documents |
| `[PRD<>Mock]` | Finding involves PRD and Mock documents |
| `[UX<>Mock]` | Finding involves UX and Mock documents |
| `[PRD>UX>Mock]` | Cascade finding spanning all three documents |

### Inventory Codes

| Code | Source | Description |
|------|--------|-------------|
| P1 | PRD | Functional Requirements |
| P2 | PRD | Page/View Registry |
| P3 | PRD | Component Mentions |
| P4 | PRD | State Requirements |
| P5 | PRD | Flow Definitions |
| P6 | PRD | Business Rules |
| P7 | PRD | Page Sections (conditional) |
| U1 | UX | Design Tokens |
| U2 | UX | Typography |
| U3 | UX | Component Registry |
| U4 | UX | Component States |
| U5 | UX | Page/View Definitions |
| U6 | UX | Layout Specs |
| U7 | UX | Interaction Patterns |
| U8 | UX | Responsive Behavior |
| U9 | UX | Page Composition (conditional) |
| U10 | UX | Component-Page Matrix (conditional) |
| U11 | UX | Navigation Map (conditional) |
| K1 | Mock | Screen Registry |
| K2 | Mock | Visual Component Inventory |
| K3 | Mock | Screen Layout |
| K4 | Mock | State Representations |
| K5 | Mock | Navigation/Flow Shown |
| K6 | Mock | Data & Content Shown |
| K7 | Mock | Visual Specifications (conditional) |

### Reconciliation Statuses

| Status | Meaning |
|--------|---------|
| **Aligned** | Requirement fully covered in all provided documents, no conflicts |
| **Partial** | Covered in some documents but gaps remain |
| **Conflict** | Two or more documents contradict on this requirement |
| **Gap** | Missing from one or more target documents |
| **N/A** | Requirement doesn't need definition in target documents |

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Input mode | {Bilateral/Trilateral} |
| PRD requirements analyzed | N |
| UX components/pages analyzed | N (or "N/A") |
| Mock screens analyzed | N (or "N/A") |
| **Overall alignment score** | X% |
| Per-document coverage: UX | X% (or "N/A") |
| Per-document coverage: Mock | X% (or "N/A") |
| Total findings | N |
| Conflicts (V) | N |
| Naming Drift (N) | N |
| Coverage Gaps (W) | N |
| Scope Additions (Q) | N |
| Cascade Violations (C) | N (or "N/A" if bilateral) |
| Specificity Gaps (S) | N |
| PRD Internal Issues (D) | N |
| UX Internal Issues (E) | N (or "N/A") |
| Mock Internal Issues (M) | N (or "N/A") |
| Blockers | N |
| Major | N |
| Minor | N |

## Document Maturity Assessment

### PRD Maturity

| Dimension | Coverage | Notes |
|-----------|----------|-------|
| Requirements clarity | High/Medium/Low | ... |
| Page/view definitions | High/Medium/Low | ... |
| State specifications | High/Medium/Low | ... |
| Flow definitions | High/Medium/Low | ... |
| Business rules | High/Medium/Low | ... |

### UX Maturity (if provided)

| Dimension | Coverage | Notes |
|-----------|----------|-------|
| Component coverage | High/Medium/Low | ... |
| State definitions | High/Medium/Low | ... |
| Layout specifications | High/Medium/Low | ... |
| Responsive behavior | High/Medium/Low | ... |
| Design tokens | High/Medium/Low | ... |

### Mock Maturity (if provided)

| Dimension | Coverage | Notes |
|-----------|----------|-------|
| Screen coverage | High/Medium/Low | ... |
| State representation | High/Medium/Low | ... |
| Data completeness | High/Medium/Low | ... |
| Flow coverage | High/Medium/Low | ... |
| Visual consistency | High/Medium/Low | ... |

## Risk Assessment

[BLOCKER conflicts that must be resolved before proceeding]
[MAJOR gaps that will cause rework if not addressed]
[MINOR terminology issues to clean up]
[Cascade violations that indicate systemic interpretation drift]

---

## Part 1: PRD Inventory
### 1.1 Functional Requirements (P1)
### 1.2 Page/View Registry (P2)
### 1.3 Component Mentions (P3)
### 1.4 State Requirements (P4)
### 1.5 Flow Definitions (P5)
### 1.6 Business Rules (P6)
### 1.7 Page Sections (P7) <- conditional

## Part 2: UX Spec Inventory (skip section if UX not provided)
### 2.1 Design Tokens Summary (U1)
### 2.2 Typography Summary (U2)
### 2.3 Component Registry (U3)
### 2.4 Component States (U4)
### 2.5 Page/View Definitions (U5)
### 2.6 Layout Specs (U6)
### 2.7 Interaction Patterns (U7)
### 2.8 Responsive Behavior (U8)
### 2.9 Page Composition (U9) <- conditional
### 2.10 Component-Page Matrix (U10) <- conditional
### 2.11 Navigation Map (U11) <- conditional

## Part 3: Mock Inventory (skip section if Mock not provided)
### 3.1 Screen Registry (K1)
### 3.2 Visual Component Inventory (K2)
### 3.3 Screen Layout (K3)
### 3.4 State Representations (K4)
### 3.5 Navigation/Flow Shown (K5)
### 3.6 Data & Content Shown (K6)
### 3.7 Visual Specifications (K7) <- conditional

## Part 4: Requirement Reconciliation Matrix

### Multi-document reconciliation table

| FR ID | Requirement | PRD Status | UX Coverage | Mock Coverage | Overall Status | Findings |
|-------|------------|------------|-------------|---------------|----------------|----------|
| FR-1 | User login | Defined | Login page + AuthForm | Login screen shown | Aligned | — |
| FR-12 | Pagination | Defined | InfiniteScroll | Paginated table | Conflict | V3, V8 |
| FR-15 | Filter by category | Defined | (not defined) | Filter bar shown | Partial | W2 |
| FR-22 | Export data | Defined | (not defined) | (not shown) | Gap | W5, W6 |

> Columns adapt to input mode. In bilateral mode, only the relevant document column appears.

## Part 5: PRD <-> UX Analysis (skip if UX not provided)
### 5.1 Conflicts (V) `[PRD<>UX]`
### 5.2 Coverage Gaps (W) `[PRD<>UX]`
### 5.3 Naming Drift (N) `[PRD<>UX]`
### 5.4 Scope Additions (Q) `[PRD<>UX]`

## Part 6: PRD <-> Mock Analysis (skip if Mock not provided)
### 6.1 Conflicts (V) `[PRD<>Mock]`
### 6.2 Coverage Gaps (W) `[PRD<>Mock]`
### 6.3 Naming Drift (N) `[PRD<>Mock]`
### 6.4 Scope Additions (Q) `[PRD<>Mock]`

## Part 7: UX <-> Mock Analysis (skip if not trilateral)
### 7.1 Conflicts (V) `[UX<>Mock]`
### 7.2 Scope Additions (Q) `[UX<>Mock]`

## Part 8: Cascade & Specificity Analysis (skip if not trilateral)
### 8.1 Cascade Violations (C) `[PRD>UX>Mock]`
### 8.2 Specificity Gaps (S)

## Part 9: Internal Consistency
### 9.1 PRD Internal Issues (D)
### 9.2 UX Internal Issues (E) <- skip if UX not provided
### 9.3 Mock Internal Issues (M) <- skip if Mock not provided

## Part 10: Recommendations
### Blockers (resolve before proceeding to next phase)
### Major (resolve during current iteration)
### Minor (clean up during next document revision)
### Cascade actions (address systemic interpretation drift)

## Part 11: Diagram Index

| Diagram | File | Description |
|---------|------|-------------|
| Coverage Heatmap | `diagrams/coverage-heatmap.excalidraw` | Requirement x Document coverage grid |
| Venn Overlap | `diagrams/venn-overlap.excalidraw` | Document overlap showing shared and unique definitions |
| Traceability Flow | `diagrams/traceability-flow.excalidraw` | Requirement flow from PRD through UX to Mock |
| Gap Treemap | `diagrams/gap-treemap.excalidraw` | Findings distribution by area and severity |
```

---

## Finding Table Format

Each finding section uses this table format:

```markdown
| ID | Severity | Docs | Requirement | PRD Says | UX Says | Mock Says | Description |
|----|----------|------|-------------|----------|---------|-----------|-------------|
| V1 | BLOCKER | [PRD<>UX] | FR-12 | "Pagination with 20 items per page" | "InfiniteScroll with virtual list" | — | PRD requires pagination but UX defines infinite scroll |
```

**Column rules:**
- **Docs** column always shows the document pair tag
- **PRD Says** always filled (PRD is always present)
- **UX Says** shows "(not provided)" if UX not in input, "(not defined)" for W findings, "(not required)" — never used since PRD is always the source
- **Mock Says** shows "(not provided)" if Mock not in input, "(not shown)" for W findings
- For Q (addition) findings, the source document column shows the addition, PRD Says shows "(not required)"
- For C (cascade) findings, all three columns must be filled showing the progressive drift
- For S (specificity) findings, highlight the invented detail with **bold** in the downstream column
- Descriptions must be verbatim across reconciliation.md and reconciliation-matrix.html

### Cascade Finding Format

Cascade findings (C) use an enhanced format showing the interpretation chain:

```markdown
| ID | Severity | Requirement | PRD Says | UX Interpreted As | Mock Built As | Drift Description |
|----|----------|-------------|----------|--------------------|---------------|-------------------|
| C1 | MAJOR | FR-7 | "Users can filter resources by type" | "FilterDropdown with multi-select checkboxes" | "Single radio button group" | PRD allows filtering (generic), UX added multi-select (assumption), Mock reduced to single-select (further drift) |
```

### Specificity Gap Format

```markdown
| ID | Severity | Docs | Source Says | Downstream Invented | Description |
|----|----------|------|------------|---------------------|-------------|
| S1 | MAJOR | [PRD<>UX] | "Display user profile" | "Profile card with avatar (120x120), name, email, role badge, last-login timestamp" | UX invented 5 specific fields and sizing not mentioned in PRD |
```
