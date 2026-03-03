---
name: prd-mock-audit
description: Audit UX HTML mocks against a PRD. Performs functional component inventory, bi-directional gap analysis (PRD→Mock and Mock→PRD), and component consistency checks. UX details (colors, typography, layout tokens) and accessibility/WCAG are only audited if the PRD explicitly defines them. Generates a structured markdown report, annotated HTML copies with color-coded highlights and slide-out panel, and an interactive coverage heatmap. Supports delta mode and build readiness assessment.
---

# PRD vs. Mock — Complete Audit Skill

Systematically analyze HTML UX mocks and compare them against a PRD. Produces a comprehensive audit covering: functional component inventory, bi-directional gap analysis, accessibility deep-dive, and component consistency. Outputs a structured markdown report, annotated HTML copies, and an interactive coverage heatmap.

**Scope boundary:** This skill audits mocks against the **PRD only**. All analysis is scoped to what the PRD explicitly defines:
- **Visual/UX details** (colors, typography, design tokens, spacing, layout) — only if the PRD specifies them. Otherwise excluded; a separate UX design doc vs. mock skill handles those.
- **Accessibility/WCAG** — only if the PRD specifies accessibility requirements. Otherwise excluded; accessibility standards may be defined in a separate policy, compliance document, or other source outside this skill's scope.

## When to Use

- User asks to compare/audit mocks against the PRD
- User asks "what's missing" or "what's wrong" with the mocks
- User wants a functional inventory of what's in the mocks
- User asks about accessibility or WCAG compliance (only if PRD mentions it)
- User wants annotated HTML files showing issues
- User asks for build readiness or implementation status
- User asks to validate wireframes, designs, or mockups against PRD requirements

## Inputs Required

**All input paths must be explicitly provided by the user.** Do not infer, guess, or auto-search for any files. If the user does not provide a required path, ask them for it before proceeding.

| Input | Required | Description |
|-------|----------|-------------|
| PRD file | **Yes** | Path to the PRD markdown file. Ask the user to provide the exact path. |
| HTML mock files | **Yes** | Path(s) to the HTML mock file(s) or a directory containing them. Ask the user to provide the exact path(s). |
| Previous audit report | No | Path to a previous `analysis.md` for delta/diff mode. Only needed if user requests a delta comparison. Ask the user for the path if they want delta mode. |

**Before starting the audit, confirm with the user:**
1. The exact file path of the PRD
2. The exact file path(s) or directory of the HTML mocks
3. Whether they want delta mode (and if so, the path to the previous audit report)
4. A suggested `{analysis_name}` for the output folder (propose one based on the PRD title + today's date, but let the user confirm or override)

## Output Structure

All outputs go into a single folder: `docs/audit/prd/{analysis_name}/`

**Naming convention for `{analysis_name}`:** Use kebab-case. Propose a name based on the PRD title + today's date, but the user must confirm or override it. Examples:
- `employee-portal-2026-03-03`
- `checkout-flow-2026-03-03`
- `dashboard-mvp-2026-03-03`

**Folder contents:**

```
docs/audit/prd/{analysis_name}/
├── analysis.md                          # Main audit report (Phase 7)
├── coverage-heatmap.html                # Interactive heatmap (Phase 11, optional)
└── annotated/                           # Annotated HTML copies (Phase 8)
    ├── {page-one}-annotated.html
    ├── {page-two}-annotated.html
    └── ...
```

| Output | Path | Description |
|--------|------|-------------|
| Markdown report | `docs/audit/prd/{analysis_name}/analysis.md` | Full audit report |
| Annotated HTMLs | `docs/audit/prd/{analysis_name}/annotated/{name}-annotated.html` | One per mock file |
| Coverage heatmap | `docs/audit/prd/{analysis_name}/coverage-heatmap.html` | Interactive grid (optional) |

For **delta mode**, the previous audit is found by looking for the most recent `analysis.md` in any sibling folder under `docs/audit/prd/`.

## Workflow

### Phase 1 — Mock UI Inventory

Before any comparison, catalog what exists in each HTML mock. This provides the raw data for all subsequent analysis phases.

**IMPORTANT — PRD-Scoped Principle:** This skill audits mocks against the **PRD only**. Every section and phase is scoped to what the PRD explicitly defines:
- **UX visual details** (colors, typography, design tokens, spacing, layout) — skip if PRD does not define them. A separate UX design doc vs. mock skill covers those.
- **Accessibility/WCAG** — skip if PRD does not define accessibility requirements. Accessibility standards may live in a separate policy or compliance document outside this skill's scope.
- If the PRD does not mention a topic, **skip the corresponding section/phase entirely.**

Read each HTML mock file completely. For each mock, extract:

#### A. Component Census (Always included)

Identify every UI component and catalog by type. This is functional inventory needed for requirement traceability.

| Component Type | Count | Location(s) | Variants |
|----------------|-------|-------------|----------|
| Buttons | N | header, form, modal | primary, secondary, icon-only, ghost |
| Forms/Inputs | N | login section, search | text, email, password, select, checkbox, radio |
| Tables | N | dashboard main | sortable, paginated, static |
| Cards | N | grid layout, sidebar | metric, content, profile, action |
| Modals/Dialogs | N | — | confirmation, form, info |
| Navigation | N | sidebar, header, footer | main nav, breadcrumb, tabs, pagination |
| Lists | N | content area | ordered, unordered, definition, data |
| Alerts/Toasts | N | top of page | success, error, warning, info |
| Badges/Tags | N | tables, cards | status, category, count |
| Tooltips/Popovers | N | icons, labels | hover, click |
| Dropdowns/Menus | N | header, forms | select, action menu, context menu |
| Progress/Loaders | N | — | bar, spinner, skeleton |

#### B. Color Palette Extraction (Only if PRD specifies colors/design tokens)

**Skip this section if the PRD does not define a color palette, brand colors, or design tokens.**

If the PRD specifies colors, extract every unique color from inline styles and `<style>` blocks and compare against PRD-defined values:

| Color | Hex | PRD Expected | Match? | Usage | Count | Semantic Role |
|-------|-----|-------------|--------|-------|-------|---------------|
| Blue | #3b82f6 | #3b82f6 | Yes | buttons, links | 12 | Primary Action |
| Red | #ef4444 | #dc2626 | No | error states | 3 | Destructive/Error |
| Gray 700 | #374151 | Not specified | N/A | body text | 18 | Text Primary |

Groups: **Primary**, **Secondary**, **Accent**, **Neutral** (grays), **Semantic** (success/warning/error/info), **Surface** (backgrounds)

#### C. Typography Map (Only if PRD specifies typography)

**Skip this section if the PRD does not define font families, sizes, or typographic scale.**

If the PRD specifies typography, map what the mock uses and compare:

| Element | Font Family | Size | Weight | PRD Expected | Match? | Usage |
|---------|------------|------|--------|-------------|--------|-------|
| H1 | Inter | 32px | 700 | Inter 32px/700 | Yes | Page titles |
| Body | Inter | 14px | 400 | System 16px/400 | No | General text |

#### D. Layout Patterns (Only if PRD specifies layout requirements)

**Skip this section if the PRD does not define layout structure, grid systems, or spacing tokens.**

If the PRD specifies layout requirements, compare:
- **Page structure** — e.g., sidebar (280px) + main content vs. PRD-defined layout
- **Grid systems** — column counts, gap sizes vs. PRD specifications
- **Spacing tokens** — recurring padding/margin values vs. PRD-defined spacing scale
- **Container widths** — max-width values vs. PRD specifications

#### E. Interactive Elements Inventory (Always included)

Functional inventory of all interactive elements and their visible states:

| Element | Type | Count | States Shown | Missing States |
|---------|------|-------|--------------|----------------|
| Submit Button | button | 3 | default | hover, active, disabled, loading |
| Nav Links | anchor | 12 | default, active | hover, focus |
| Search Input | text input | 1 | default, placeholder | focus, filled, error |
| Dropdown | select | 2 | closed | open, selected |
| Toggle | switch | 1 | off | on, disabled |

#### F. Media & Assets (Always included)

| Asset | Type | Count | Alt Text | Dimensions | Notes |
|-------|------|-------|----------|------------|-------|
| User avatars | img | 5 | 2/5 have alt | 40x40 | Placeholder images |
| Hero image | img | 1 | No | 800x400 | Stock photo |
| Icons | SVG | 18 | N/A | Various | Lucide/Heroicons |
| Logo | SVG | 1 | No alt | 120x40 | Inline SVG |

Note: Flag placeholder content (lorem ipsum, stock photos, `example.com`, hardcoded data).

### Phase 2 — PRD Requirement Extraction

1. Read the full PRD and extract all Functional Requirements (FR numbers + sub-requirements)
2. Optionally read the UX design doc for MVP scope exclusions
3. Build a complete requirement list with descriptions for traceability

### Phase 3 — Bi-directional Comparison

Perform the comparison in two explicit directions:

#### Direction A: PRD → Mock (What's required but missing or wrong)

For each FR and sub-requirement, check if the mock accurately represents it. Classify into:

- **Contradiction (Red)** — Mock shows something the PRD forbids or defines differently
  - Severity: BLOCKER (building to mock produces wrong behavior), MAJOR (developer confusion), MINOR (cosmetic)
- **Gap (Blue)** — PRD requires something the mock omits entirely
  - Severity: BLOCKER (critical feature missing), MAJOR (developer wouldn't know to build it), MINOR (low-impact omission)

#### Direction B: Mock → PRD (What's implemented but undocumented)

For each element in the mock inventory (Phase 1) that has no matching PRD requirement, classify into one of three sub-types:

- **Design Decision (Green)** — Reasonable UX enhancement the PRD doesn't mention
  - Examples: loading states, empty states, hover effects, micro-interactions, helpful tooltips, breadcrumbs
  - Recommendation: Update PRD to include these
  - Severity: MINOR (good addition) or MAJOR (significant feature not documented)

- **Scope Creep (Orange)** — Feature or element that goes beyond PRD scope
  - Examples: extra dashboard widgets, unrequested analytics charts, additional user roles shown, features from a future phase
  - Recommendation: Discuss with stakeholders before building
  - Severity: MAJOR (could delay timeline) or BLOCKER (contradicts project scope)

- **Placeholder (Gray)** — Likely temporary content that needs replacement
  - Examples: lorem ipsum text, stock photos, hardcoded data, `example.com` URLs, TODO comments
  - Recommendation: Replace with real content before development
  - Severity: MINOR (cosmetic) or MAJOR (masks real requirements)

### Phase 4 — Accessibility Audit (Only if PRD specifies accessibility requirements)

**Skip this entire phase if the PRD does not mention accessibility, WCAG compliance, or a11y requirements.** Accessibility standards may be defined in a separate policy, compliance document, or other source outside this skill's scope.

If the PRD specifies accessibility requirements, perform the checks below scoped to what the PRD defines. For example, if the PRD requires "WCAG AA compliance", run all Tier 1 and Tier 2 checks. If the PRD only mentions specific items (e.g., "all images must have alt text"), only check those.

#### Tier 1 — Structural Checks

1. Missing `alt` attributes on images
2. Non-semantic HTML (e.g., `<div>` used as buttons, missing `<nav>`, `<main>`, `<header>`, `<footer>` landmarks)
3. Missing form labels or `aria-label` / `aria-labelledby` attributes
4. Missing skip-navigation links
5. Heading hierarchy — check h1→h2→h3 ordering, flag skipped levels (e.g., h1 then h3)
6. Language attribute — `<html lang="...">` must be present
7. ARIA roles on custom interactive widgets (tabs, accordions, dialogs)
8. Tabindex misuse — flag `tabindex` values > 0

#### Tier 2 — Visual & Interaction Checks

9. **Color Contrast Analysis** — For each text-on-background combination:
   - Calculate contrast ratio using relative luminance formula
   - Normal text (< 18px or < 14px bold): must meet **4.5:1** (WCAG AA)
   - Large text (≥ 18px or ≥ 14px bold): must meet **3:1** (WCAG AA)
   - Enhanced (AAA): 7:1 for normal, 4.5:1 for large
   - Report as table:

   | Text Color | BG Color | Ratio | Text Size | Pass/Fail | WCAG Level | Element |
   |------------|----------|-------|-----------|-----------|------------|---------|

10. **Touch/Click Target Sizes** — Flag interactive elements that appear to be < 44x44px (WCAG 2.5.5 AAA) or < 24x24px (WCAG 2.5.8 AA)
11. **Focus Indicators** — Check for `:focus` / `:focus-visible` styles; flag `outline: none` or `outline: 0` without a visible replacement
12. **Color-Only Information** — Flag cases where meaning is conveyed only through color with no text/icon alternative (e.g., red/green status without labels)
13. **Motion & Animation** — Check for CSS animations/transitions without `prefers-reduced-motion` media query
14. **Text in Images** — Flag text content embedded in images without a text alternative

#### Accessibility Scorecard Output (only if this phase was executed)

| Category | Issues | Max Severity | WCAG Criterion |
|----------|--------|--------------|----------------|
| Color Contrast | N | MAJOR/MINOR | 1.4.3 (AA) / 1.4.6 (AAA) |
| Semantics & Landmarks | N | MAJOR/MINOR | 1.3.1, 4.1.2 |
| Keyboard & Focus | N | MAJOR/MINOR | 2.1.1, 2.4.7 |
| Labels & ARIA | N | MAJOR/MINOR | 1.1.1, 4.1.2 |
| Touch Targets | N | MINOR | 2.5.5, 2.5.8 |
| Color-Only Info | N | MAJOR/MINOR | 1.4.1 |
| Motion | N | MINOR | 2.3.3 |
| **Overall** | **N** | | **Estimated: A / AA / AAA** |

Assign overall WCAG level estimate:
- **AAA** — No issues or only MINOR issues in enhanced criteria
- **AA** — No MAJOR/BLOCKER issues in AA criteria
- **A** — Has MAJOR issues in AA criteria but meets basic A requirements
- **Below A** — Has BLOCKER issues in fundamental criteria

### Phase 5 — Component Consistency Analysis

Compare same-type components across all mock pages to detect inconsistencies in behavior and structure. Style consistency (colors, spacing, fonts) is **only checked if the PRD defines those design attributes**.

| Component | Pages Present | Consistent? | Type | Discrepancies |
|-----------|--------------|-------------|------|---------------|
| Primary Button | All 5 pages | No | Behavior | Page 5: missing hover state |
| Nav Sidebar | Pages 1,2,3 | Yes | — | — |
| Data Table | Pages 2,4 | No | Structure | Page 4 missing sort icons |
| Footer | Pages 1,2,3,5 | No | Structure | Page 5 missing contact link |
| Page Header | All 5 pages | Yes | — | — |

Flag these types of inconsistencies:
- **Behavior** (always checked) — Different states, interactions, or functionality for equivalent components
- **Structure** (always checked) — Different HTML structure or missing sub-elements
- **Style** (only if PRD defines design tokens) — Different colors, sizes, spacing, fonts for the same component type

### Phase 5A — PRD Page Description Compliance

PRDs often contain **narrative descriptions of each page or screen** beyond the numbered FRs. These descriptions outline the intended purpose, layout, and key elements of a page in prose form (e.g., *"The Dashboard displays a summary of active projects, a notifications panel, and a quick-access toolbar"*). This phase checks whether every element mentioned in those descriptions is actually present in the mock.

**When to run:** Only if the PRD contains page/screen descriptions (sections like "Page Overview", "Screen Descriptions", "Page Specifications", or similar narrative blocks that describe what each page should contain). If the PRD only has numbered FRs with no page-level prose, skip this phase.

#### Procedure

1. **Extract page descriptions** — Scan the PRD for any prose descriptions of individual pages/screens. These may appear as:
   - Dedicated "Page Description" or "Screen Overview" sections
   - Introductory paragraphs before each page's FR list
   - User flow descriptions that detail what the user sees on each page
   - Wireframe annotations or mockup intent descriptions

2. **Parse described elements** — For each page description, extract every concrete UI element, data point, or behavior mentioned. Be thorough — include both explicit elements ("a table of active projects") and implied ones ("users can filter by status" implies a filter control).

3. **Cross-reference with mock** — For each described element, verify its presence in the corresponding HTML mock:

| Page | Described Element | PRD Section | Present in Mock? | Finding |
|------|-------------------|-------------|------------------|---------|
| Dashboard | Summary of active projects | §3.1 intro | Yes | — |
| Dashboard | Notifications panel | §3.1 intro | No | G{N} — Missing |
| Dashboard | Quick-access toolbar | §3.1 intro | Partial | G{N} — Only 2 of 5 actions shown |
| Settings | User preference toggles | §5.2 para 2 | Yes | — |
| Settings | Export data button | §5.2 para 2 | No | G{N} — Not present |

4. **Classify findings** — Findings from this phase use existing categories:
   - **Gap (G)** — A described element is missing from the mock entirely
   - **Contradiction (C)** — A described element is present but implemented differently than described
   - These findings are numbered in the global G/C sequences (not restarted)

5. **Note:** This phase may produce findings that overlap with Phase 3 (bi-directional comparison). If a finding was already captured as an FR-level gap in Phase 3, do not duplicate it. Only add findings for elements described in page prose that were **not already covered** by FR-level analysis.

### Phase 5B — Intra-Page Data Consistency

Validate that the wireframe is internally consistent with its own displayed data — independent of the PRD. Any UI element that makes a **claim** (a number, a label, a state, a relationship) verifiable against other visible content on the same page must be checked. When claims don't match what is actually shown, developers build to contradictory specs.

**This phase is always executed.** It does not depend on the PRD content. It applies to any type of wireframe regardless of domain: dashboards, e-commerce, games, social platforms, content management, forms, landing pages, admin panels, etc.

#### Procedure (systematic — execute for every page)

For each wireframe page, execute these steps in order:

**Step 1 — Inventory all "claim" elements.** Scan the page and list every element that makes a verifiable assertion about content visible on the same page. A "claim" is anything a user or developer could check by looking at surrounding content.

| Claim Category | What to Look For |
|----------------|-----------------|
| **Numeric counts** | Any text that states a quantity: badges, counters, headers, labels, list titles, tab counts, pagination, inventory counts, notification dots, queue sizes |
| **Totals / aggregates** | Any text that sums, averages, or aggregates values from a visible list, table, grid, or set of elements |
| **Percentages / ratios** | Any text or visual (progress bar, pie chart, health bar, completion ring, XP bar) that expresses a proportion derivable from visible data |
| **States / status** | Any indicator (badge, color, icon, toggle, active class, highlight, enabled/disabled styling) that asserts the state of something whose actual state is also visible |
| **Navigation / location** | Any element that claims "where you are": breadcrumbs, sidebar active items, tab selection, step indicators, page titles, level/stage indicators |
| **References / relationships** | Any element that references another element on the same page by name, ID, count, or content: legend labels vs. chart series, column headers vs. cell data, button labels vs. target content |
| **Temporal claims** | Any text asserting when something happened or how recent/old it is, checkable against visible dates or timestamps elsewhere on the page |

Domain-specific claim examples:

| Domain | Example Claims |
|--------|---------------|
| **Dashboard / Admin** | KPI card "Revenue: $120K", tab badge "Active (12)", summary total, filter result count |
| **E-commerce** | Cart badge "3 items", subtotal price, "47 results found", stock availability "In Stock (5 left)" |
| **Game UI** | Health bar at 50% with "90/100 HP" text, "Round 3 of 10", inventory count "12/20 slots", XP bar vs. level label |
| **Social / Feed** | "24 comments" header with visible comments, "5 mutual friends", follower count vs. visible list, "3 new messages" badge |
| **Forms / Wizards** | Step indicator "Step 2 of 4" with visible steps, "3 errors found" with visible error messages, required field count |
| **Content / CMS** | "12 articles" section header, category count badges, "Published" status vs. draft watermark, tag counts |
| **Project Management** | Sprint burndown chart vs. task list, "5 open tasks" label, progress percentage vs. completed/total checklist items |

Record each claim element in a working table:

| # | Element (location on page) | Claim Value | Claim Category |
|---|---------------------------|-------------|----------------|

**Step 2 — Identify the corresponding verifiable source.** For each claim, locate the actual visible content on the same page that can confirm or contradict it:

- A counter says `"N items"` → count the actual visible items it refers to
- A total says `"$X"` → find the individual values and sum them
- A visual bar/ring shows ~Y% → find the part/whole counts and compute the real ratio
- A status indicator says `"State X"` → check if associated content reflects that state
- A navigation element highlights `"Section A"` → check if page content matches Section A
- A legend lists `"Series A, B, C"` → check if the chart/table actually has those series
- A label says `"N days ago"` → check if a visible timestamp confirms the date math

If no corresponding source is visible on the page, note it as **"no verifiable source"** — this is not a finding. The wireframe may intentionally show a summary without underlying detail.

**Step 3 — Perform validation.** For each claim + source pair:

| Check | Procedure |
|-------|-----------|
| **Count** | Manually count the visible items and compare against the claimed number |
| **Sum** | Add up the visible individual values and compare against the claimed total |
| **Percentage** | Compute `(part / whole) × 100` from visible data and compare against the claimed ratio or visual fill level |
| **State** | Verify the visual indicator matches the actual state shown in associated content |
| **Location** | Verify all "where am I" signals agree with each other and with the page content |
| **Reference** | Verify that the referenced element exists and matches what is claimed about it |
| **Temporal** | Verify date math is consistent between the claim and visible timestamps |

**Step 4 — Cross-element correlation.** After individual checks, look for pairs or groups of elements on the same page that reference the **same underlying data** but show different values:

- A chart/visual and an adjacent table or legend showing different values for the same metric
- Two labels in different sections of the same page showing different counts for the same thing
- A filter/control showing a selected state that doesn't match the displayed content
- Multiple navigation indicators that disagree on current location
- A breakdown (segments, slices, categories) that doesn't sum to the displayed total
- A detail view that contradicts the summary view it was expanded from

**Step 5 — Record findings.** For every mismatch, create a finding with all fields:

| Field | Required Content |
|-------|-----------------|
| **Element** | What UI element makes the claim — location and type |
| **Claims** | Exact value or state displayed |
| **Actual** | What validation reveals |
| **Validation** | Show the work — the count, sum, or logic used |
| **Type** | Mismatch type from the table below |

#### Mismatch Types

| Type | Description |
|------|-------------|
| **Count mismatch** | A claimed quantity doesn't match the actual count of visible items |
| **Sum mismatch** | A claimed total doesn't match the sum of visible individual values |
| **Percentage mismatch** | A claimed ratio doesn't match the computed ratio from visible data (includes visual bars/rings) |
| **State conflict** | A visual state indicator contradicts the content it describes |
| **Location conflict** | Navigation/location indicators disagree with each other or with the page content |
| **Reference conflict** | An element references another element by name/value/count but the reference doesn't match |
| **Temporal conflict** | A time-based claim is inconsistent with visible timestamps or dates |
| **Cross-element conflict** | Two or more elements on the same page show different values for the same data |

#### Finding Classification

Intra-page data consistency issues use a dedicated category:
- **Prefix:** `I` (Intra-page data consistency)
- **Color:** Teal (`#14b8a6`) — distinct from all other categories
- **Severity:**
  - **BLOCKER** — A mismatch that a developer would hardcode, producing objectively broken behavior (e.g., a total that doesn't match its line items creates two contradictory data sources)
  - **MAJOR** — A visible contradiction that causes confusion or development rework (e.g., a counter shows the wrong number, a health bar visual contradicts its text label)
  - **MINOR** — A minor inconsistency unlikely to affect implementation logic (e.g., a relative time label off by one unit)

#### Output Table

| # | Severity | Page | Element | Claims | Actual | Validation | Type |
|---|----------|------|---------|--------|--------|------------|------|
| I1 | MAJOR | Product List | Results header | "47 products found" | 12 product cards visible | Counted product cards on page: 12 | Count mismatch |
| I2 | MAJOR | Cart | Cart total | "Subtotal: $127.50" | Item prices sum to $98.00 | $29.00 + $45.00 + $24.00 = $98.00 | Sum mismatch |
| I3 | BLOCKER | Game HUD | Health bar | Bar at ~50% fill | HP text reads "90/100" | 90/100 = 90%, bar should be nearly full | Percentage mismatch |
| I4 | MAJOR | Settings | Sidebar nav | Active on "Profile" | Page heading is "Settings" | Sidebar active item ≠ page title | Location conflict |

### Phase 6 — Requirement Traceability Matrix

1. List every FR and its sub-requirements from the PRD
2. For each requirement, mark its status across all mocks:
   - **Covered** — Mock accurately represents the requirement
   - **Partial** — Mock shows the requirement but incompletely or inaccurately
   - **Missing** — No mock addresses this requirement
   - **Contradicted** — A mock actively contradicts this requirement
3. Calculate a **Coverage Score** per page and overall:
   - `Coverage % = (Covered + 0.5 × Partial) / Total Requirements × 100`
4. Include the matrix in the markdown report (Phase 7)

### Phase 7 — Markdown Report

Create `docs/audit/prd/{analysis_name}/analysis.md` with the following structure:

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
| Intra-Page Data Mismatches | N |

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

## Part 5B: Intra-Page Data Consistency

### 5B.1 Consistency Summary
| Mismatch Type | Count | Max Severity |
|---------------|-------|--------------|
| Count mismatch | N | — |
| Sum mismatch | N | — |
| Percentage mismatch | N | — |
| State conflict | N | — |
| Location conflict | N | — |
| Reference conflict | N | — |
| Temporal conflict | N | — |
| Cross-element conflict | N | — |
| **Total** | **N** | — |

### 5B.2 Per-Page Consistency Findings
#### Page N: [Page Name] (`filename.html`)

**Claim Inventory:** N claim elements identified, N with verifiable data source.

| # | Severity | Element | Claims | Actual | Validation | Type |
|---|----------|---------|--------|--------|------------|------|

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

### Phase 8 — Annotated HTML Files

For each mock file, create `docs/audit/prd/{analysis_name}/annotated/[filename]-annotated.html` with:

#### A. Inline Highlights (on page elements)

Eight color-coded highlight categories, all with **badges positioned at top-right** for consistency:
- **Red dashed outline** (`3px dashed #ef4444`) — Contradictions
- **Blue dashed outline** (`3px dashed #3b82f6`) — Gaps
- **Yellow dashed outline** (`3px dashed #f59e0b`) — Accessibility issues
- **Green dashed outline** (`3px dashed #10b981`) — Design Decisions
- **Orange dashed outline** (`3px dashed #f97316`) — Scope Creep
- **Gray dashed outline** (`3px dashed #9ca3af`) — Placeholders
- **Purple dashed outline** (`3px dashed #8b5cf6`) — Component Inconsistencies
- **Teal dashed outline** (`3px dashed #14b8a6`) — Intra-Page Data Consistency issues

Every badge must include `data-ann-id`, `data-ann-title`, and `data-ann-severity` attributes to power the hover tooltip.

**Hover tooltips:** When the user hovers over any badge, a compact tooltip appears showing the finding ID, title, severity, and category color. This enables quick triage without opening the panel.

#### B. Interactive Annotation Panel

A fixed slide-out panel (400px, dark theme) on the right side with full interactivity:

**Header & Controls:**
- **Toggle button** — pill-shaped, fixed top-right, shows dot + count per active category
- **Summary stats bar** — total findings, blocker count, major count, minor count
- **Search input** — filters findings by ID, keyword, or FR number in real time
- **Legend** — 2-row grid layout, only showing categories that have findings

**Finding Sections** — one collapsible section per category (only include sections with findings):
  1. Contradictions (Red)
  2. Gaps (Blue)
  3. Accessibility (Yellow)
  4. Design Decisions (Green)
  5. Scope Creep (Orange)
  6. Placeholders (Gray)
  7. Component Inconsistencies (Purple)
  8. Data Consistency (Teal)

Each section header has a **visibility toggle** button. Toggling a category off hides both the panel section and all inline highlights of that category on the page.

**Each finding item includes:**
- Colored badge with finding ID
- Title + **severity pill** (BLOCKER / MAJOR / MINOR with color-coded background)
- Description text

**Bidirectional navigation:**
- **Badge → Panel:** Clicking a badge on the page opens the panel and scrolls to that finding, highlighting it briefly
- **Panel → Page:** Clicking a finding in the panel scrolls the page to the highlighted element with a pulse animation

**Keyboard shortcuts** (active when panel is open):
- `Esc` — close panel
- `[` / `]` — navigate to previous / next finding (scrolls both panel and page)
- `/` — focus the search input

See [reference.md](reference.md) for complete CSS, HTML templates, and JavaScript.

### Phase 9 — Validation & Self-Check

After generating all outputs, perform these validation checks before delivering results:

#### A. Report Integrity Checks
1. **Count consistency** — Executive Summary totals match the actual number of findings listed
2. **ID sequencing** — All IDs are sequential with no gaps or duplicates
3. **Reference validity** — Every PRD reference (FR number) in findings exists in the actual PRD
4. **Traceability completeness** — Every FR sub-requirement appears in the traceability matrix
5. **Coverage math** — Coverage % calculations are arithmetically correct
6. **Inventory completeness** — Every visible functional component in the mock is cataloged in Phase 1

#### B. Annotated HTML Checks
1. **File validity** — Each annotated HTML has no unclosed tags introduced by annotations
2. **Badge-to-panel sync** — Every inline badge ID has a matching entry in the panel
3. **Panel-to-badge sync** — Every panel entry has a corresponding inline highlight (or note explaining why it cannot be highlighted, e.g., a gap for something entirely missing)
4. **Toggle counts match** — Toggle button counts match actual items per section
5. **Stats bar accuracy** — Summary stats bar (total, blocker, major, minor) match actual findings
6. **Sidebar links** — All sidebar nav links point to `-annotated.html` versions
7. **Original functionality** — Existing page scripts, tabs, and filters are not broken by annotations
8. **Data attributes** — Every inline badge has `data-ann-id`, `data-ann-title`, `data-ann-severity` attributes
9. **Severity pills** — Every panel item has a severity pill matching its finding severity
10. **Bidirectional IDs** — Panel item `id="ann-{ID}"` and `data-target` match the page element's `id`

#### C. Accessibility Audit Checks (only if Phase 4 was executed)
1. **Contrast calculations** — Spot-check contrast ratio math for accuracy
2. **Scorecard totals** — Scorecard issue counts match per-page findings
3. **WCAG criterion references** — All cited WCAG criteria are valid

#### D. Cross-Page Checks
1. **Component consistency matrix** — All shared components are listed
2. **Finding deduplication** — Same issue on multiple pages is noted as cross-cutting, not double-counted
3. **PRD-scoped sections** — Verify that design token sections (color, typography, layout) are only present if the PRD defines them; omit if not

#### E. Cross-Output Consistency Checks (analysis.md ↔ annotated HTML ↔ heatmap)

All three outputs are generated sequentially in a single pass. Because the heatmap is written last, **paraphrasing drift** can cause its descriptions to diverge from the analysis and annotated HTML. These checks catch and prevent that:

1. **Finding ID completeness** — Every finding ID in analysis.md (C1–CN, G1–GN, A1–AN, D1–DN, S1–SN, P1–PN, X1–XN, I1–IN) must appear in the corresponding annotated HTML file(s), both as an inline badge and a panel entry
2. **Annotated → analysis sync** — Every finding in an annotated HTML panel must be listed in analysis.md. No orphan findings in annotated files
3. **Heatmap → traceability matrix sync** — The heatmap `HEATMAP_DATA` JSON must have exactly the same rows (FR/sub-requirement), columns (pages), and statuses (covered/partial/missing/contradicted) as the traceability matrix in analysis.md Part 2.2
4. **Heatmap findingId validity** — Every `findingId` value in the heatmap JSON must correspond to an actual finding ID in analysis.md
5. **Heatmap description verbatim check** — For every heatmap cell with a `findingId`, verify the `detail` text matches the corresponding finding description in analysis.md **word-for-word**. Flag any paraphrase, synonym substitution, or hallucinated detail. Common drift patterns:
   - Specifics changed (e.g., "tabular format" → "stacked bar chart")
   - Sub-issue shifted (e.g., "project count clickable" → "row-to-profile affordance")
   - Vague generalization (e.g., "missing hover tooltip" → "placement and styling")
   - Synonym substitution (e.g., "completion rate trend line" → "burn-up/burn-down chart variant")
6. **Heatmap FR descriptions match** — The `desc` field for each heatmap row must match the sub-requirement description in the traceability matrix, not a paraphrase
7. **Coverage % consistency** — Per-page and overall coverage percentages in the heatmap summary row must match the values in analysis.md Part 2.1
8. **Severity consistency** — Finding severities in annotated HTML panels must match analysis.md. No severity upgrades or downgrades between outputs
9. **Annotated HTML title match** — The `data-ann-title` attribute on each inline badge must match the finding title in the analysis.md report and the panel item title in the same annotated HTML

**If any drift is detected:** Re-read the specific finding from analysis.md and correct the divergent output (heatmap detail, annotated HTML title/description, etc.) to match verbatim.

### Phase 10 — Delta / Diff Mode (Optional)

If a previous audit exists, find the most recent `analysis.md` in a sibling folder under `docs/audit/prd/` and compare the current findings against it.

1. Parse the previous report's finding IDs, severities, and descriptions
2. For each current finding, classify as:
   - **Resolved** — Previously reported, no longer present
   - **Persistent** — Still present from the previous audit
   - **New** — Not in the previous report
   - **Regressed** — Was resolved in a prior audit but has reappeared
3. Add a **Delta Summary** section after the Executive Summary:

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

4. In the per-page findings tables, add a `Status` column showing `NEW`, `PERSISTENT`, or `REGRESSED`
5. Add a **Resolved Items** section listing previously reported findings that are now fixed

### Phase 11 — Interactive Coverage Heatmap (Optional)

Generate `docs/audit/prd/{analysis_name}/coverage-heatmap.html` to visualize the traceability matrix.

1. **Rows** = FR requirements (grouped by functional area)
2. **Columns** = Mock pages
3. **Cells** = Color-coded by status:
   - Green (`#10b981`) = Covered
   - Yellow (`#f59e0b`) = Partial
   - Red (`#ef4444`) = Contradicted
   - Gray (`#6b7280`) = Missing
   - Empty = Not applicable
4. **Interactivity:**
   - Hover for tooltip with finding ID and description
   - Click to show finding detail below the grid
   - Sticky row/column headers
   - Summary row with per-page coverage %
   - Summary column with per-requirement status
5. **Filters:**
   - Toggle buttons by status
   - Search box to filter by FR number or keyword

#### Anti-Drift Rule — Verbatim Descriptions

**CRITICAL:** The `HEATMAP_DATA` JSON is generated late in a long output pass. By this point, contextual memory of earlier findings can drift, causing paraphrased or hallucinated descriptions instead of exact matches. To prevent this:

1. **Copy, don't rewrite.** Every `detail` string in the heatmap `HEATMAP_DATA` JSON MUST be copied verbatim from the corresponding finding in `analysis.md`. Do NOT paraphrase, summarize, or rewrite descriptions from memory.
2. **Source mapping.** For each heatmap cell with a `findingId`:
   - If status is `contradicted` → copy the "Finding" text from the matching `C{N}` row in analysis.md Part 2.3
   - If status is `missing` → copy the "Finding" text from the matching `G{N}` row in analysis.md Part 2.4
   - If status is `partial` → copy the relevant finding text from whichever finding ID is referenced
   - If status is `covered` → use a brief factual note (e.g., "Fully represented in mock"), no finding ID needed
3. **Re-read before writing.** Before generating the heatmap data, re-read the analysis.md traceability matrix (Part 2.2) and per-page findings (Parts 2.3, 2.4) to refresh context. Do NOT write heatmap data from memory alone.
4. **FR descriptions.** The `desc` field for each row must match the sub-requirement description from the traceability matrix in analysis.md Part 2.2 — do not rephrase.

**Common drift errors to avoid:**
- Substituting a related but different sub-issue (e.g., writing "row-to-profile affordance" when the finding says "project count clickable")
- Hallucinating specifics not in the PRD (e.g., writing "stacked bar chart" when the PRD says "tabular format")
- Generalizing a specific finding (e.g., writing "placement and styling" when the finding specifically says "missing hover tooltip")
- Using a synonym that changes meaning (e.g., "burn-up/burn-down chart variant" instead of "completion rate trend line")

See [reference.md](reference.md) for the complete heatmap HTML/CSS/JS template.

### Phase 12 — Build Requirements (Optional)

If the user asks for build readiness / implementation status:

1. Explore the codebase to find what's been implemented:
   - Frontend pages/components in `apps/frontend/src/`
   - Backend modules/controllers in `apps/api/src/`
   - Shared UI components in `libs/ui/src/`
   - Database schema in `prisma/schema.prisma`
2. Add a "Page Build Requirements" section to the markdown report
3. Add a green "Build Requirements" section to each annotated HTML panel

## Finding ID Prefixes

| Category | Prefix | Sequence | Example |
|----------|--------|----------|---------|
| Contradiction | C | Global across all pages | C1, C2, ..., CN |
| Gap | G | Global across all pages | G1, G2, ..., GN |
| Accessibility | A | Global across all pages | A1, A2, ..., AN |
| Design Decision | D | Global across all pages | D1, D2, ..., DN |
| Scope Creep | S | Global across all pages | S1, S2, ..., SN |
| Placeholder | P | Global across all pages | P1, P2, ..., PN |
| Consistency | X | Global across all pages | X1, X2, ..., XN |
| Data Consistency | I | Global across all pages | I1, I2, ..., IN |
| Build Requirement | B | Per page, restart numbering | B1, B2, ... per page |

## Color Scheme

| Category | Outline | Badge BG | Panel Count BG | Dot Class |
|----------|---------|----------|----------------|-----------|
| Contradiction | `#ef4444` | `#ef4444` | `rgba(239,68,68,0.15)` | `.dot-r` |
| Gap / Missing | `#3b82f6` | `#3b82f6` | `rgba(59,130,246,0.15)` | `.dot-b` |
| Accessibility | `#f59e0b` | `#f59e0b` | `rgba(245,158,11,0.15)` | `.dot-y` |
| Design Decision | `#10b981` | `#10b981` | `rgba(16,185,129,0.15)` | `.dot-g` |
| Scope Creep | `#f97316` | `#f97316` | `rgba(249,115,22,0.15)` | `.dot-o` |
| Placeholder | `#9ca3af` | `#9ca3af` | `rgba(156,163,175,0.15)` | `.dot-gr` |
| Component Issue | `#8b5cf6` | `#8b5cf6` | `rgba(139,92,246,0.15)` | `.dot-p` |
| Data Consistency | `#14b8a6` | `#14b8a6` | `rgba(20,184,166,0.15)` | `.dot-t` |

## Parallelization

- Read PRD + all mocks in parallel (Phase 1 & 2)
- Create annotated HTML files in parallel using Task agents (Phase 8)
- Each agent handles one HTML file independently

## Additional Resources

- For the complete standard panel CSS, HTML template, and JavaScript, see [reference.md](reference.md)
