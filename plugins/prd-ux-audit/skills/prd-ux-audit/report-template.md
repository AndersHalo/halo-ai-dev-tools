# Reconciliation Report Template (reconciliation.md)

This document defines the structure for the main markdown reconciliation report generated in Phase 6.

---

## Report Structure

```markdown
# PRD ↔ UX Reconciliation Report — {Title}

**Date:** YYYY-MM-DD
**PRD:** {filename}
**UX Spec:** {filename}

## Executive Summary

| Metric | Value |
|--------|-------|
| PRD requirements analyzed | N |
| UX components/pages analyzed | N |
| Alignment score | X% |
| Total findings | N |
| Conflicts (V) | N |
| Naming Drift (N) | N |
| UX Coverage Gaps (W) | N |
| UX Scope Additions (Q) | N |
| PRD Internal Issues (D) | N |
| UX Internal Issues (E) | N |
| Blockers | N |
| Major | N |
| Minor | N |

## Risk Assessment

[BLOCKER conflicts that must be resolved before mock development can start]
[MAJOR gaps that will cause rework if not addressed]
[MINOR terminology issues to clean up]

---

## Part 1: PRD Inventory
### 1.1 Functional Requirements (P1)
### 1.2 Page/View Registry (P2)
### 1.3 Component Mentions (P3)
### 1.4 State Requirements (P4)
### 1.5 Flow Definitions (P5)
### 1.6 Business Rules (P6)

## Part 2: UX Spec Inventory
### 2.1 Design Tokens Summary (U1)
### 2.2 Typography Summary (U2)
### 2.3 Component Registry (U3)
### 2.4 Component States (U4)
### 2.5 Page/View Definitions (U5)
### 2.6 Layout Specs (U6)
### 2.7 Interaction Patterns (U7)
### 2.8 Responsive Behavior (U8)

## Part 3: Requirement Reconciliation Matrix

| FR ID | Requirement | UX Coverage | Status | Findings |
|-------|------------|-------------|--------|----------|
| FR-1 | User login page | Login page + AuthForm component | ✅ Aligned | — |
| FR-12 | Pagination 20/page | InfiniteScroll component | ❌ Conflict | V3 |
| FR-15 | Filter by category | (not defined) | ⚠ Gap | W2 |

## Part 4: PRD → UX Analysis
### 4.1 Conflicts (V)
### 4.2 UX Coverage Gaps (W)
### 4.3 Naming Drift (N)

## Part 5: UX → PRD Analysis
### 5.1 UX Scope Additions (Q)

## Part 6: Internal Consistency
### 6.1 PRD Internal Issues (D)
### 6.2 UX Internal Issues (E)

## Part 7: Recommendations
### Blockers (resolve before mock development)
### Major (resolve during design iteration)
### Minor (clean up during next document revision)
```

---

## Finding Table Format

Each finding section (4.1 through 6.2) uses this table format:

```markdown
| ID | Severity | Requirement | PRD Says | UX Says | Description |
|----|----------|-------------|----------|---------|-------------|
| V1 | BLOCKER | FR-12 | "Pagination with 20 items per page" | "InfiniteScroll component with virtual list" | PRD requires pagination but UX defines infinite scroll — contradictory interaction pattern |
```

**Rules:**
- Finding ID must be globally unique within its prefix
- PRD Says / UX Says columns must quote specific text from the source documents
- Descriptions must be verbatim across reconciliation.md and prd-ux-matrix.html
- For W (gap) findings, UX Says column shows "(not defined)"
- For Q (addition) findings, PRD Says column shows "(not required)"
- For N (naming) findings, both columns show the different terms used
