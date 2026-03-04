# PRD ↔ UX Audit — Template Reference

This file contains the HTML/CSS/JS templates for generated outputs. Loaded on-demand.

---

## 1. PRD ↔ UX Matrix HTML Template (prd-ux-matrix.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PRD ↔ UX Reconciliation Matrix</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  /* --- Base --- */
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #f8fafc;
    color: #1e293b;
    line-height: 1.5;
  }

  /* --- Header --- */
  .mx-header {
    background: #0f172a;
    color: #f1f5f9;
    padding: 24px 32px;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .mx-header h1 {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .mx-header .mx-subtitle {
    font-size: 13px;
    color: #94a3b8;
  }

  /* --- Stats Bar --- */
  .mx-stats {
    display: flex;
    gap: 16px;
    padding: 16px 32px;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
    flex-wrap: wrap;
  }
  .mx-stat {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
  }
  .mx-stat-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .mx-stat-value {
    font-size: 18px;
    font-weight: 700;
  }

  /* --- Controls --- */
  .mx-controls {
    display: flex;
    gap: 12px;
    padding: 16px 32px;
    background: #f1f5f9;
    border-bottom: 1px solid #e2e8f0;
    flex-wrap: wrap;
    align-items: center;
  }
  .mx-search {
    padding: 8px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 13px;
    width: 260px;
    outline: none;
  }
  .mx-search:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }
  .mx-filter-btn {
    padding: 6px 14px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: #fff;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all .15s;
  }
  .mx-filter-btn:hover { background: #f1f5f9; }
  .mx-filter-btn.active { background: #0f172a; color: #fff; border-color: #0f172a; }

  /* --- Matrix Container --- */
  .mx-body {
    padding: 24px 32px;
  }

  /* --- Requirement Row --- */
  .mx-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 12px;
    overflow: hidden;
    transition: box-shadow .15s;
  }
  .mx-row:hover { box-shadow: 0 2px 8px rgba(0,0,0,.06); }

  /* Status stripe on left edge */
  .mx-row[data-status="aligned"] { border-left: 4px solid #22c55e; }
  .mx-row[data-status="partial"] { border-left: 4px solid #f59e0b; }
  .mx-row[data-status="conflict"] { border-left: 4px solid #ef4444; }
  .mx-row[data-status="gap"] { border-left: 4px solid #3b82f6; }
  .mx-row[data-status="addition"] { border-left: 4px solid #f97316; }

  /* --- Columns --- */
  .mx-col {
    padding: 16px 20px;
  }
  .mx-col-prd {
    border-right: 1px solid #e2e8f0;
    background: #fefce8;  /* warm tint for PRD side */
  }
  .mx-col-ux {
    background: #eff6ff;  /* cool tint for UX side */
  }
  .mx-col-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: #64748b;
    margin-bottom: 8px;
  }
  .mx-col-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .mx-col-text {
    font-size: 13px;
    color: #475569;
  }
  .mx-col-empty {
    font-size: 13px;
    color: #94a3b8;
    font-style: italic;
  }

  /* --- Status Badge --- */
  .mx-status {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .mx-status-aligned { background: #dcfce7; color: #15803d; }
  .mx-status-partial { background: #fef3c7; color: #a16207; }
  .mx-status-conflict { background: #fee2e2; color: #dc2626; }
  .mx-status-gap { background: #dbeafe; color: #2563eb; }
  .mx-status-addition { background: #fff7ed; color: #ea580c; }

  /* --- Finding Badges (inline) --- */
  .mx-finding {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    margin-top: 8px;
    margin-right: 6px;
    cursor: pointer;
    transition: opacity .15s;
  }
  .mx-finding:hover { opacity: .8; }
  .mx-finding-V { background: #fee2e2; color: #dc2626; }
  .mx-finding-N { background: #ede9fe; color: #7c3aed; }
  .mx-finding-W { background: #dbeafe; color: #2563eb; }
  .mx-finding-Q { background: #fff7ed; color: #ea580c; }

  /* --- Severity Pills --- */
  .mx-severity {
    font-size: 10px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 3px;
    text-transform: uppercase;
  }
  .mx-sev-blocker { background: #dc2626; color: #fff; }
  .mx-sev-major { background: #f59e0b; color: #fff; }
  .mx-sev-minor { background: #6b7280; color: #fff; }

  /* --- Expanded Detail --- */
  .mx-detail {
    grid-column: 1 / -1;
    padding: 16px 20px;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    display: none;
    font-size: 13px;
  }
  .mx-row.expanded .mx-detail { display: block; }
  .mx-detail-desc {
    margin-bottom: 8px;
    line-height: 1.6;
  }
  .mx-detail-quote {
    padding: 8px 12px;
    border-left: 3px solid;
    margin: 8px 0;
    font-size: 12px;
    background: #fff;
    border-radius: 0 4px 4px 0;
  }
  .mx-detail-quote-prd { border-color: #eab308; }
  .mx-detail-quote-ux { border-color: #3b82f6; }
  .mx-detail-quote-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 4px;
  }

  /* --- Empty State --- */
  .mx-empty-state {
    text-align: center;
    padding: 64px 32px;
    color: #94a3b8;
  }
  .mx-empty-state svg {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
    stroke: #cbd5e1;
  }
  .mx-empty-state h3 {
    font-size: 16px;
    color: #64748b;
    margin-bottom: 8px;
  }

  /* --- Footer --- */
  .mx-footer {
    text-align: center;
    padding: 24px;
    font-size: 12px;
    color: #94a3b8;
    border-top: 1px solid #e2e8f0;
    margin-top: 32px;
  }
</style>
</head>
<body>

<div class="mx-header">
  <h1>PRD ↔ UX Reconciliation Matrix</h1>
  <div class="mx-subtitle">{PRD_TITLE} — {UX_TITLE} — {DATE}</div>
</div>

<div class="mx-stats">
  <div class="mx-stat">
    <span class="mx-stat-value">{TOTAL_REQUIREMENTS}</span> Requirements
  </div>
  <div class="mx-stat">
    <div class="mx-stat-dot" style="background:#22c55e"></div>
    <span class="mx-stat-value">{ALIGNED_COUNT}</span> Aligned
  </div>
  <div class="mx-stat">
    <div class="mx-stat-dot" style="background:#f59e0b"></div>
    <span class="mx-stat-value">{PARTIAL_COUNT}</span> Partial
  </div>
  <div class="mx-stat">
    <div class="mx-stat-dot" style="background:#ef4444"></div>
    <span class="mx-stat-value">{CONFLICT_COUNT}</span> Conflicts
  </div>
  <div class="mx-stat">
    <div class="mx-stat-dot" style="background:#3b82f6"></div>
    <span class="mx-stat-value">{GAP_COUNT}</span> Gaps
  </div>
  <div class="mx-stat">
    <div class="mx-stat-dot" style="background:#f97316"></div>
    <span class="mx-stat-value">{ADDITION_COUNT}</span> Additions
  </div>
  <div class="mx-stat" style="margin-left:auto;">
    Alignment: <span class="mx-stat-value">{ALIGNMENT_SCORE}%</span>
  </div>
</div>

<div class="mx-controls">
  <input type="text" class="mx-search" placeholder="Search by FR ID, keyword, component..." data-action="search">
  <button class="mx-filter-btn active" data-filter="all">All</button>
  <button class="mx-filter-btn" data-filter="conflict">Conflicts</button>
  <button class="mx-filter-btn" data-filter="gap">Gaps</button>
  <button class="mx-filter-btn" data-filter="partial">Partial</button>
  <button class="mx-filter-btn" data-filter="addition">Additions</button>
  <button class="mx-filter-btn" data-filter="aligned">Aligned</button>
</div>

<div class="mx-body" id="matrix-body">
  <!-- MATRIX_ROWS -->
  <!--
  Example row structure:

  <div class="mx-row" data-status="conflict" data-fr="FR-12" data-keywords="pagination table infinite scroll">
    <div class="mx-col mx-col-prd">
      <div class="mx-col-label">PRD Requirement</div>
      <span class="mx-status mx-status-conflict">Conflict</span>
      <div class="mx-col-title">FR-12: Data Table Pagination</div>
      <div class="mx-col-text">Table must support pagination with 20 items per page and page navigation controls.</div>
      <div>
        <span class="mx-finding mx-finding-V" data-finding="V3">V3 <span class="mx-severity mx-sev-blocker">BLOCKER</span></span>
      </div>
    </div>
    <div class="mx-col mx-col-ux">
      <div class="mx-col-label">UX Definition</div>
      <div class="mx-col-title">DataTable → InfiniteScroll</div>
      <div class="mx-col-text">DataTable component uses InfiniteScroll sub-component with virtual list rendering. No pagination controls defined.</div>
    </div>
    <div class="mx-detail">
      <div class="mx-detail-desc"><strong>V3 BLOCKER — Contradictory table navigation pattern</strong></div>
      <div class="mx-detail-quote mx-detail-quote-prd">
        <div class="mx-detail-quote-label">PRD says</div>
        "Table must support pagination with 20 items per page and page navigation controls."
      </div>
      <div class="mx-detail-quote mx-detail-quote-ux">
        <div class="mx-detail-quote-label">UX says</div>
        "DataTable uses InfiniteScroll sub-component with virtual list rendering for performance."
      </div>
      <div class="mx-detail-desc" style="margin-top:12px;">PRD requires discrete pagination but UX defines infinite scroll — these are mutually exclusive interaction patterns. Resolve before mock development.</div>
    </div>
  </div>

  For gap rows (W), the UX column shows:
  <div class="mx-col mx-col-ux">
    <div class="mx-col-label">UX Definition</div>
    <div class="mx-col-empty">Not defined in UX spec</div>
  </div>

  For addition rows (Q), the PRD column shows:
  <div class="mx-col mx-col-prd">
    <div class="mx-col-label">PRD Requirement</div>
    <div class="mx-col-empty">Not required by PRD</div>
  </div>
  -->
</div>

<div class="mx-footer">
  PRD ↔ UX Reconciliation — Generated {DATE}
</div>

<script>
(function() {
  const body = document.getElementById('matrix-body');
  const search = document.querySelector('[data-action="search"]');
  const filterBtns = document.querySelectorAll('.mx-filter-btn');

  /* --- Row expand/collapse --- */
  body.addEventListener('click', (e) => {
    const row = e.target.closest('.mx-row');
    if (!row) return;
    /* Don't toggle if clicking a finding badge */
    if (e.target.closest('.mx-finding')) {
      const detail = row.querySelector('.mx-detail');
      if (detail) {
        row.classList.add('expanded');
      }
      return;
    }
    row.classList.toggle('expanded');
  });

  /* --- Filter by status --- */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.mx-row').forEach(row => {
        if (filter === 'all' || row.dataset.status === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  /* --- Search --- */
  search.addEventListener('input', () => {
    const q = search.value.toLowerCase();
    document.querySelectorAll('.mx-row').forEach(row => {
      const text = (row.dataset.fr + ' ' + row.dataset.keywords + ' ' + row.textContent).toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
    /* Reset filter buttons */
    filterBtns.forEach(b => b.classList.remove('active'));
    if (!q) filterBtns[0].classList.add('active');
  });

  /* --- Keyboard: Escape clears search, / focuses search --- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      search.value = '';
      search.dispatchEvent(new Event('input'));
      search.blur();
    }
    if (e.key === '/' && document.activeElement !== search) {
      e.preventDefault();
      search.focus();
    }
  });
})();
</script>
</body>
</html>
```

---

## 2. Matrix Row Generation Rules

When generating `prd-ux-matrix.html`, follow these rules:

### Status assignment per row

| Condition | `data-status` |
|-----------|---------------|
| PRD requirement fully covered in UX, no findings | `aligned` |
| PRD requirement partially covered (some W findings) | `partial` |
| V finding exists for this requirement | `conflict` |
| Only W findings (no UX coverage at all) | `gap` |
| Row represents a Q finding (UX addition) | `addition` |

### Row ordering

1. **Conflicts** (V) first — highest priority
2. **Gaps** (W) second
3. **Partial** third
4. **Additions** (Q) fourth
5. **Aligned** last

Within each group, order by severity (BLOCKER → MAJOR → MINOR), then by FR ID.

### Finding badge placement

- V and N findings: badge appears in the **PRD column** (since both sides are involved)
- W findings: badge appears in the **PRD column** (PRD requires, UX missing)
- Q findings: badge appears in the **UX column** (UX defines, PRD doesn't require)

### Detail panel content

Every row with findings must have a `.mx-detail` section containing:
- Finding ID + severity + description (verbatim from reconciliation.md)
- PRD quote block with exact text from PRD
- UX quote block with exact text from UX (or "Not defined" for W findings)
- Recommendation text

---

## 3. Naming Drift (N) Special Handling

Naming drift findings appear as a dedicated summary table at the top of the matrix body, before the requirement rows:

```html
<div class="mx-naming-table" style="margin-bottom:24px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; border-left:4px solid #7c3aed; overflow:hidden;">
  <div style="padding:12px 20px; background:#ede9fe; font-size:13px; font-weight:700; color:#7c3aed;">
    Naming Drift — Same concepts, different names
  </div>
  <table style="width:100%; font-size:13px; border-collapse:collapse;">
    <thead>
      <tr style="background:#f8fafc;">
        <th style="padding:8px 16px; text-align:left; font-weight:600;">ID</th>
        <th style="padding:8px 16px; text-align:left; font-weight:600;">PRD Term</th>
        <th style="padding:8px 16px; text-align:left; font-weight:600;">UX Term</th>
        <th style="padding:8px 16px; text-align:left; font-weight:600;">Context</th>
        <th style="padding:8px 16px; text-align:left; font-weight:600;">Severity</th>
      </tr>
    </thead>
    <tbody>
      <!-- N findings as rows -->
      <!-- <tr>
        <td style="padding:8px 16px;"><span class="mx-finding mx-finding-N" style="margin:0;">N1</span></td>
        <td style="padding:8px 16px;">"Resource Card"</td>
        <td style="padding:8px 16px;">"Asset Tile"</td>
        <td style="padding:8px 16px;">Both refer to the primary content card on the directory page</td>
        <td style="padding:8px 16px;"><span class="mx-severity mx-sev-minor">MINOR</span></td>
      </tr> -->
    </tbody>
  </table>
</div>
```

---

## 4. Empty State

If no findings are detected (perfect alignment), show this instead of the matrix:

```html
<div class="mx-empty-state">
  <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 12l2 2 4-4"/>
    <circle cx="12" cy="12" r="10"/>
  </svg>
  <h3>Perfect Alignment</h3>
  <p>All PRD requirements are fully covered in the UX spec with no conflicts, gaps, or terminology issues.</p>
</div>
```

---

## 5. Pre-Delivery Checklist

### Finding Quality
- [ ] Every finding quotes specific text from source documents
- [ ] Conflict (V) findings cite both PRD and UX text
- [ ] Gap (W) findings cite the PRD requirement with no UX match
- [ ] Addition (Q) findings cite the UX element with no PRD match
- [ ] Naming (N) findings list both terms and context
- [ ] Severities are justified and consistent

### IDs & Counts
- [ ] All finding IDs are globally unique per prefix
- [ ] Executive summary counts match actual findings
- [ ] Alignment score calculation is correct: aligned / (total − N/A) × 100

### reconciliation.md
- [ ] All sections present per report-template.md
- [ ] Reconciliation matrix table covers every FR
- [ ] Recommendations organized by severity

### prd-ux-matrix.html
- [ ] Opens in browser without errors
- [ ] Stats bar counts match reconciliation.md
- [ ] Search filters rows correctly
- [ ] Status filter buttons work
- [ ] Row expand/collapse works
- [ ] Finding descriptions are verbatim from reconciliation.md
- [ ] PRD/UX quotes match source documents
- [ ] Rows ordered by priority (conflicts → gaps → partial → additions → aligned)
- [ ] Naming drift table appears if N findings exist

### Cross-Output Consistency
- [ ] Every finding ID in reconciliation.md exists in prd-ux-matrix.html
- [ ] Finding descriptions are character-for-character identical
- [ ] Severity for each finding is the same in both outputs
- [ ] Status per requirement is consistent
