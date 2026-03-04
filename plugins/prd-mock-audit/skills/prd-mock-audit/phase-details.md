# Phase Details — Mock Self-Validation & PRD Internal Consistency

This document contains detailed procedures for Phase 5B (Mock Self-Validation) and Phase 5C (PRD Internal Consistency). Loaded on-demand during those phases.

---

## Phase 5B — Mock Self-Validation

Validate that the mock is internally consistent — independent of the PRD. Catches issues where the mock contradicts itself, has broken flows, or shows data that doesn't add up. Two concern areas: **data consistency** and **structural/flow integrity**.

**Always executed.** Does not depend on PRD content.

---

### Part A — Intra-Page Data Consistency

#### Procedure (execute for every page)

**Step 1 — Inventory all "claim" elements.** Scan each page for every element making a verifiable assertion about content visible on the same page:

| Claim Category | What to Look For |
|----------------|-----------------|
| **Numeric counts** | Badges, counters, headers, labels, list titles, tab counts, pagination, notification dots, queue sizes |
| **Totals / aggregates** | Sums, averages, or aggregates of visible list/table/grid values |
| **Percentages / ratios** | Progress bars, pie charts, health bars, completion rings, XP bars |
| **States / status** | Badges, colors, icons, toggles, active classes, enabled/disabled styling |
| **Navigation / location** | Breadcrumbs, sidebar active items, tab selection, step indicators, page titles |
| **References / relationships** | Legend labels vs. chart series, column headers vs. cell data, button labels vs. target content |
| **Temporal claims** | Relative time ("3 days ago") checkable against visible timestamps |

Domain-specific examples:

| Domain | Example Claims |
|--------|---------------|
| **Dashboard / Admin** | KPI card "Revenue: $120K", tab badge "Active (12)", summary total |
| **E-commerce** | Cart badge "3 items", subtotal price, "47 results found", stock count |
| **Game UI** | Health bar at 50% with "90/100 HP", "Round 3 of 10", inventory "12/20 slots" |
| **Social / Feed** | "24 comments" header, "5 mutual friends", follower count vs. visible list |
| **Forms / Wizards** | Step indicator "Step 2 of 4", "3 errors found" vs. visible errors |
| **Content / CMS** | "12 articles" section header, category badges, "Published" vs. draft watermark |
| **Project Management** | Burndown chart vs. task list, "5 open tasks", progress % vs. checklist |

**Step 2 — Identify verifiable source.** For each claim, locate the visible content that confirms or contradicts it. If no source is visible, note "no verifiable source" — this is not a finding.

**Step 3 — Validate.** For each claim + source pair:

| Check | Procedure |
|-------|-----------|
| **Count** | Count visible items, compare against claimed number |
| **Sum** | Add visible values, compare against claimed total |
| **Percentage** | Compute `(part / whole) × 100`, compare against claim or visual fill |
| **State** | Verify indicator matches actual state in associated content |
| **Location** | Verify all "where am I" signals agree with page content |
| **Reference** | Verify referenced element exists and matches claim |
| **Temporal** | Verify date math between claim and visible timestamps |

**Step 4 — Cross-element correlation.** Look for element pairs referencing the same data with different values: chart vs. adjacent table, two labels showing different counts, filter state vs. displayed content, breakdown segments that don't sum to total.

**Step 5 — Record findings.** For every mismatch:

| Field | Required Content |
|-------|-----------------|
| Element | What UI element makes the claim — location and type |
| Claims | Exact value or state displayed |
| Actual | What validation reveals |
| Validation | Show the work — the count, sum, or logic used |
| Type | Mismatch type (see below) |

#### Mismatch Types

| Type | Description |
|------|-------------|
| Count mismatch | Claimed quantity ≠ actual visible count |
| Sum mismatch | Claimed total ≠ sum of visible values |
| Percentage mismatch | Claimed ratio ≠ computed ratio from visible data |
| State conflict | Visual indicator contradicts the content it describes |
| Location conflict | Navigation indicators disagree with each other or page content |
| Reference conflict | Element references another by name/value/count but doesn't match |
| Temporal conflict | Time-based claim inconsistent with visible timestamps |
| Cross-element conflict | Two+ elements on same page show different values for same data |

---

### Part B — Structural & Flow Validation

#### 1. Navigation & Flow Integrity

| Check | What to Look For |
|-------|-----------------|
| Dead-end links | Link/button references non-existent page or section |
| Orphan pages | Mock page unreachable through navigation |
| Circular-only flows | Section with no way to exit or go back |
| Broken breadcrumbs | Breadcrumb references non-existent pages |
| Missing "back" paths | Detail/edit/modal page with no return path |

#### 2. Interaction Completeness

| Element | Expected States | Common Gaps |
|---------|----------------|-------------|
| Form with submit | Empty → filled → validating → success/error | Missing validation, no success state |
| Delete action | Trigger → confirmation → result | Missing confirmation dialog |
| Toggle/switch | On → off (and vice versa) | Only one state shown |
| Search/filter | Default → active → results → empty | Missing empty state |
| Pagination | First → middle → last page | Only one page shown |
| Modal/dialog | Trigger → open → close/complete | No close mechanism |
| Loading states | Idle → loading → loaded → error | No loading indicator |

#### 3. Orphan & Disconnected Elements

- Button with no apparent action or destination
- Empty section/panel with no empty-state explanation
- Form field unrelated to any visible form or data flow
- Icon/badge with no context, label, or tooltip
- Tab/accordion with no content behind it

#### 4. Logic & Affordance Contradictions

| Pattern | Example |
|---------|---------|
| Disabled look, interactive role | Grayed button as primary action, no path to enable |
| Interactive look, static role | Link-styled text serving as static display |
| Multiple primary actions | Two "primary" buttons competing in same context |
| Contradicting CTAs | "Save" and "Submit" in same form, unclear distinction |
| Conflicting empty states | Empty message alongside populated list |

#### 5. Cross-Page Flow Validation

- Create flow: creation page exists? Returns to list after success?
- Edit flow: edit page/modal exists? Pre-populated? Save feedback?
- Delete flow: confirmation? List updated after deletion?
- Detail flow: list item leads to detail view? Can go back?
- Flows in navigation but absent from mock set

#### Structural Sub-Types

| Sub-Type | Description |
|----------|-------------|
| Dead-end | Navigation leads to non-existent destination |
| Missing state | Interactive element lacks required lifecycle states |
| Orphan element | UI element with no apparent purpose or connection |
| Affordance conflict | Visual design suggests behavior the structure contradicts |
| Incomplete flow | Multi-step flow missing pages, steps, or feedback |
| Unreachable page | Mock page exists but no navigation path leads to it |

---

### Finding Classification (Parts A and B unified)

- **Prefix:** `M` (Mock self-validation)
- **Color:** Teal (`#14b8a6`)
- **Single ID sequence:** M1, M2, ..., MN across both data and structural findings
- **Severity:**
  - **BLOCKER** — Mismatch or broken flow that would produce objectively broken behavior
  - **MAJOR** — Visible contradiction or incomplete interaction causing confusion/rework
  - **MINOR** — Minor inconsistency unlikely to affect implementation logic

---

## Phase 5C — PRD Internal Consistency

Analyze the PRD against itself for internal contradictions, ambiguities, and gaps. A PRD that contradicts itself makes Phase 3 unreliable — if the PRD says two conflicting things, any mock is simultaneously "correct" and "wrong."

**Always executed.** Runs after Phase 2 (requirement extraction).

### What to Check

#### 1. Contradictory Requirements
Two or more FRs that directly conflict. Example: FR1.2 says "email + password auth" while FR4.1 says "SSO only."

#### 2. Ambiguous / Vague Requirements
FRs open to multiple interpretations: unquantified terms ("fast", "large"), undefined scope ("handle errors gracefully"), implicit behavior ("manage profile"), conditional without condition ("disabled when appropriate").

#### 3. Undefined References
FRs mentioning entities, roles, statuses, pages, or terms never defined in the PRD. Example: "Premium users" referenced in FR3.2 but no tier system defined.

#### 4. Overlapping / Duplicate Requirements
Two FRs describing the same behavior in different terms, potentially with subtle differences.

#### 5. Inconsistent Terminology
Same concept referred to by different names across the PRD. Example: "Dashboard", "Overview", and "Home page" all referring to the same view.

#### 6. Missing Prerequisites
FRs depending on capabilities, data, or infrastructure not specified elsewhere. Example: "Show real-time notifications" with no notification system defined.

#### 7. Scope Gaps
Obvious functional areas the PRD should cover based on its own context but doesn't. Example: defines user roles but no role management; defines a data table but no pagination.

### Finding Classification

- **Prefix:** `R` (Requirement issue)
- **Color:** Indigo (`#6366f1`)
- **Report-only** — R findings appear in analysis.md only, NOT in annotated HTML
- **Cross-reference:** If an R finding affects Phase 3 findings, the C/G finding should note "See R{N}"
- **Severity:**
  - **BLOCKER** — Direct contradiction making implementation impossible. Affected audit results unreliable.
  - **MAJOR** — Ambiguity or gap significant enough to cause developer guesswork/rework.
  - **MINOR** — Terminology inconsistency or minor overlap.
