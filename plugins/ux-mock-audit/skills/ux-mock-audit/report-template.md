# Analysis Report Template (analysis.md)

This document defines the structure for the main markdown audit report generated in Phase 10.

---

## Report Structure

```markdown
# UX Design System Audit — {Title}

**Date:** YYYY-MM-DD
**UX Spec:** {filename} (version)
**Mocks:** {list of files}
**Viewports:** Desktop (WxH), Tablet (WxH), Mobile (WxH)
**Screenshots:** {count} captured

## Executive Summary

| Metric | Value |
|--------|-------|
| Mock pages audited | N |
| UX spec items | N |
| Overall coverage | X% |
| Total findings | N |
| Blockers | N |
| Major | N |
| Minor | N |
| Token Drift (T) | N |
| Typography Mismatch (Y) | N |
| Component Fidelity (K) | N |
| Layout Deviation (L) | N |
| State & Interaction Gap (I) | N |
| Responsive Mismatch (R) | N |
| Undocumented Pattern (U) | N |
| Visual Scope Creep (S) | N |
| Placeholder Content (P) | N |
| Cross-Page Inconsistency (X) | N |
| Mock Self-Validation (M) | N |
| UX Spec Issues (E) | N |
| Screenshots captured | N |

## Risk Assessment
[BLOCKER, MAJOR, MINOR summaries]

---

## Part 1: UX Spec Inventory
[Token, Typography, Component, Layout, State, Responsive inventories from Phase 2]

## Part 2: Mock UI Inventory
[Per-page inventories from Phase 3]

## Part 3: UX → Mock Analysis
### 3.1 Coverage Score by Category
### 3.2 Token Drift Findings (T)
### 3.3 Typography Mismatch Findings (Y)
### 3.4 Component Fidelity Findings (K)
### 3.5 Layout Deviation Findings (L)
### 3.6 State & Interaction Gap Findings (I)
### 3.7 Responsive Mismatch Findings (R)

## Part 4: Mock → UX Analysis
### 4.1 Undocumented Patterns (U)
### 4.2 Visual Scope Creep (S)
### 4.3 Placeholder Content (P)

## Part 5: Visual Analysis (Screenshots)
### 5.1 Rendered Token Verification
### 5.2 Layout Verification
### 5.3 Responsive Comparison
### 5.4 Visual Anomalies
[Reference screenshots: `screenshots/{viewport}/{page}.png`]

## Part 6: Cross-Page Consistency (X)
### 6.1 Component Consistency Matrix
### 6.2 Inconsistency Details

## Part 7: Mock Self-Validation (M)
### 7.1 Data Consistency
### 7.2 Structural & Flow

## Part 8: UX Spec Issues (E)
[Report-only findings — NOT annotated on HTML]

## Part 9: Recommendations
### Blockers (must fix before development)
### Major (fix during design/build phase)
### Minor (fix during implementation)
### UX Spec Updates Recommended
```

---

## Finding Table Format

Each finding section (3.2 through 4.3, 6.2, 7.1-7.2) uses this table format:

```markdown
| ID | Severity | Page | Element | Description | Screenshot |
|----|----------|------|---------|-------------|------------|
| T1 | BLOCKER | dashboard | `.btn-primary` | Background color #E84D27 does not match UX spec #E84D26. Using hardcoded hex instead of var(--primary). | [desktop](screenshots/desktop/dashboard-full.png) |
```

**Rules:**
- Finding ID must be globally unique within its prefix
- Descriptions must be verbatim across all outputs (analysis.md, annotated HTML, visual audit, heatmap)
- Screenshot column links to evidence when available
- Runtime findings include `[Runtime]` tag in description
