# Analysis Report Template (analysis.md)

This document defines the complete structure for the main markdown audit report generated in Phase 7.

---

## Report Structure

```markdown
# PRD vs. Mock — Complete Audit Report

**Date:** [today]
**Scope:** [N] HTML mocks vs PRD [version]

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Mock Pages Analyzed | N |
| PRD Requirements (FRs) | N |
| Overall PRD Coverage | N% |
| Contradictions | N (N blockers) |
| Gaps (PRD → Mock) | N |
| Design Decisions (Mock → PRD) | N |
| Scope Creep Items | N |
| Placeholders Found | N |
| Accessibility Issues | N (or "N/A — not in PRD scope") |
| Estimated WCAG Level | A / AA / AAA (or "N/A") |
| Component Inconsistencies | N |
| Page Description Gaps | N (or "N/A — no page descriptions in PRD") |
| Mock Self-Validation Issues | N |
| PRD Internal Issues | N |

### Risk Assessment
- **BLOCKERS:** N items require mock revision before development can begin
- **MAJOR:** N items need resolution during design phase
- **MINOR:** N items can be resolved during implementation

---

## Part 1: Mock UI Inventory

### 1.1 PRD-Defined Design Tokens (include only sections the PRD specifies)

<!-- Include ONLY the subsections below that correspond to design attributes explicitly defined in the PRD. Omit any section the PRD does not cover — those belong to the UX design doc comparison skill. -->

#### Color Palette (only if PRD defines colors)
| Color | Hex | PRD Expected | Match? | Usage | Semantic Role |
|-------|-----|-------------|--------|-------|---------------|

#### Typography Scale (only if PRD defines typography)
| Element | Font | Size | Weight | PRD Expected | Match? | Usage |
|---------|------|------|--------|-------------|--------|-------|

#### Layout & Spacing (only if PRD defines layout)
[Compare mock layout against PRD-specified structure]

### 1.2 Per-Page Functional Inventory

#### Page N: [Page Name] (`filename.html`)

**Component Summary:**
| Type | Count | Variants |
|------|-------|----------|

**Interactive Elements:** N total ([states coverage summary])
**Media:** N images (N with alt text), N icons, N SVGs
**Placeholder Content:** [None / List of placeholder items found]

---

## Part 2: PRD → Mock Analysis (What's Required)

### 2.1 Overall Coverage Score
| Page | Covered | Partial | Missing | Contradicted | Coverage % |
|------|---------|---------|---------|--------------|------------|
| [Page Name] | N | N | N | N | N% |
| **Total** | N | N | N | N | **N%** |

### 2.2 Requirement Traceability Matrix
| FR | Sub-Req | Description | Page(s) | Status | Finding ID |
|----|---------|-------------|---------|--------|------------|

### 2.3 Contradictions (Red)

#### Page N: [Page Name] (`filename.html`)
| # | Severity | Finding | PRD Reference | Mock Shows | Should Be |
|---|----------|---------|---------------|------------|-----------|

### 2.4 Gaps (Blue)

#### Page N: [Page Name] (`filename.html`)
| # | Severity | Finding | PRD Reference | What's Missing |
|---|----------|---------|---------------|----------------|

---

## Part 3: Mock → PRD Analysis (What's Implemented but Undocumented)

### 3.1 Design Decisions (Green) — Recommend adding to PRD
| # | Page | Element | Description | Recommendation |
|---|------|---------|-------------|----------------|

### 3.2 Scope Creep (Orange) — Needs stakeholder discussion
| # | Page | Element | Description | Risk | Recommendation |
|---|------|---------|-------------|------|----------------|

### 3.3 Placeholders (Gray) — Needs replacement before development
| # | Page | Element | Description | Action Needed |
|---|------|---------|-------------|---------------|

---

## Part 4: Accessibility Audit (only if PRD defines accessibility/WCAG requirements — omit entire part otherwise)

### 4.1 Accessibility Scorecard
| Category | Issues | Max Severity | WCAG Criterion |
|----------|--------|--------------|----------------|
| Color Contrast | N | — | 1.4.3 / 1.4.6 |
| Semantics & Landmarks | N | — | 1.3.1, 4.1.2 |
| Keyboard & Focus | N | — | 2.1.1, 2.4.7 |
| Labels & ARIA | N | — | 1.1.1, 4.1.2 |
| Touch Targets | N | — | 2.5.5, 2.5.8 |
| Color-Only Info | N | — | 1.4.1 |
| Motion | N | — | 2.3.3 |
| **Estimated WCAG Level** | | | **A / AA / AAA** |

### 4.2 Color Contrast Analysis
| Text Color | BG Color | Ratio | Text Size | Result | WCAG | Element |
|------------|----------|-------|-----------|--------|------|---------|

### 4.3 Per-Page Accessibility Findings

#### Page N: [Page Name] (`filename.html`)
| # | Severity | Finding | Element | Issue | WCAG Criterion |
|---|----------|---------|---------|-------|----------------|

---

## Part 5: Component Consistency

### 5.1 Cross-Page Component Matrix
| Component | Pages Present | Consistent? | Discrepancies |
|-----------|--------------|-------------|---------------|

### 5.2 Inconsistency Details
[Detailed description of each inconsistency with affected pages and specific differences]

---

## Part 5A: PRD Page Description Compliance (only if PRD contains page-level prose descriptions — omit if not)

### 5A.1 Description Coverage Summary
| Page | Described Elements | Present | Missing | Partial | Coverage % |
|------|-------------------|---------|---------|---------|------------|

### 5A.2 Per-Page Description Findings
#### Page N: [Page Name] (`filename.html`)
| # | Described Element | PRD Section | Present? | Finding ID | Notes |
|---|-------------------|-------------|----------|------------|-------|

---

## Part 5B: Mock Self-Validation

### 5B.1 Summary
| Category | Issue Type | Count | Max Severity |
|----------|------------|-------|--------------|
| Data | Count mismatch | N | — |
| Data | Sum mismatch | N | — |
| Data | Percentage mismatch | N | — |
| Data | State conflict | N | — |
| Data | Location conflict | N | — |
| Data | Reference conflict | N | — |
| Data | Temporal conflict | N | — |
| Data | Cross-element conflict | N | — |
| Structural | Dead-end navigation | N | — |
| Structural | Missing interaction states | N | — |
| Structural | Orphan elements | N | — |
| Structural | Affordance conflicts | N | — |
| Structural | Incomplete flows | N | — |
| Structural | Unreachable pages | N | — |
| **Total** | | **N** | — |

### 5B.2 Per-Page Data Consistency Findings
#### Page N: [Page Name] (`filename.html`)

**Claim Inventory:** N claim elements identified, N with verifiable data source.

| # | Severity | Element | Claims | Actual | Validation | Type |
|---|----------|---------|--------|--------|------------|------|

### 5B.3 Per-Page Structural Findings
#### Page N: [Page Name] (`filename.html`)
| # | Severity | Element | Issue | Expected | Sub-Type |
|---|----------|---------|-------|----------|----------|

### 5B.4 Cross-Page Flow Findings
| # | Severity | Pages Involved | Flow | Issue | Sub-Type |
|---|----------|----------------|------|-------|----------|

---

## Part 5C: PRD Internal Consistency

### 5C.1 PRD Issues Summary
| Issue Type | Count | Max Severity |
|------------|-------|--------------|
| Contradictory requirements | N | — |
| Ambiguous requirements | N | — |
| Undefined references | N | — |
| Overlapping/duplicate FRs | N | — |
| Inconsistent terminology | N | — |
| Missing prerequisites | N | — |
| Scope gaps | N | — |
| **Total** | **N** | — |

### 5C.2 PRD Findings
| # | Severity | Type | FRs Affected | Description | Impact on Audit |
|---|----------|------|-------------|-------------|-----------------|

---

## Part 6: Cross-Cutting Issues
[Issues that span multiple pages or affect the entire design system]

---

## Part 7: Recommendations

### Blockers — Must Fix Before Development
[Prioritized list]

### Major — Fix During Design Phase
[Prioritized list]

### Minor — Fix During Implementation
[Prioritized list]

### PRD Updates Recommended
[Design decisions from Part 3.1 that should be formally added to the PRD]
```

---

## Delta Summary Section (Phase 10)

When delta mode is active, add this section after Executive Summary:

```markdown
## Delta Summary (vs. previous audit [DATE])
| Status | Contradictions | Gaps | Accessibility | Design Decisions | Scope Creep | Consistency | Total |
|--------|---------------|------|---------------|-----------------|-------------|-------------|-------|
| Resolved | N | N | N | N | N | N | N |
| Persistent | N | N | N | N | N | N | N |
| New | N | N | N | N | N | N | N |
| Regressed | N | N | N | N | N | N | N |

**Net change:** [+N / -N] findings since last audit
**Coverage change:** [previous]% → [current]% ([+/-]N pp)
**WCAG change:** [previous level] → [current level]
```

---

## Finding Table Formats

### Contradiction (C)
```markdown
| # | Severity | Finding | PRD Reference | Mock Shows | Should Be |
|---|----------|---------|---------------|------------|-----------|
```

### Gap (G)
```markdown
| # | Severity | Finding | PRD Reference | What's Missing |
|---|----------|---------|---------------|----------------|
```

### Mock Self-Validation (M) — Data Consistency
```markdown
| # | Severity | Page | Element | Claims | Actual | Validation | Type |
|---|----------|------|---------|--------|--------|------------|------|
```

### Mock Self-Validation (M) — Structural
```markdown
| # | Severity | Page(s) | Element | Issue | Expected | Sub-Type |
|---|----------|---------|---------|-------|----------|----------|
```

### PRD Internal Issue (R)
```markdown
| # | Severity | Type | FRs Affected | Description | Impact on Audit |
|---|----------|------|-------------|-------------|-----------------|
```

**Rules:**
- Finding ID must be globally unique within its prefix
- Descriptions must be verbatim across all outputs (analysis.md, annotated HTML, heatmap)
- PRD Reference must cite exact FR numbers
