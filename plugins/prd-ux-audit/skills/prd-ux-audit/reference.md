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
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #f1f5f9;
    padding: 28px 32px 20px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 12px rgba(0,0,0,.15);
  }
  .mx-header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  .mx-header h1 {
    font-size: 22px;
    font-weight: 700;
  }
  .mx-header-actions {
    display: flex;
    gap: 8px;
  }
  .mx-header-btn {
    padding: 5px 12px;
    border: 1px solid rgba(255,255,255,.2);
    border-radius: 6px;
    background: rgba(255,255,255,.08);
    color: #cbd5e1;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all .15s;
  }
  .mx-header-btn:hover { background: rgba(255,255,255,.15); color: #fff; }
  .mx-header-btn.active { background: rgba(255,255,255,.2); color: #fff; border-color: rgba(255,255,255,.4); }
  .mx-header .mx-subtitle {
    font-size: 13px;
    color: #94a3b8;
  }

  /* --- Alignment Gauge --- */
  .mx-gauge {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 32px;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
  }
  .mx-gauge-label {
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    white-space: nowrap;
  }
  .mx-gauge-bar {
    flex: 1;
    height: 10px;
    background: #e2e8f0;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
  }
  .mx-gauge-fill {
    height: 100%;
    border-radius: 5px;
    transition: width .6s ease;
  }
  .mx-gauge-score {
    font-size: 20px;
    font-weight: 800;
    white-space: nowrap;
  }
  /* Gauge color thresholds set via inline style by JS */

  /* --- Stats Bar --- */
  .mx-stats {
    display: flex;
    gap: 4px;
    padding: 12px 32px;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
    flex-wrap: wrap;
  }
  .mx-stat {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 6px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
  }
  .mx-stat-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .mx-stat-value {
    font-size: 16px;
    font-weight: 700;
  }
  .mx-stat-total {
    margin-right: 8px;
    padding: 6px 16px;
    background: #0f172a;
    color: #f1f5f9;
    border-radius: 6px;
    border: none;
  }
  .mx-stat-total .mx-stat-value { color: #fff; }

  /* --- Controls --- */
  .mx-controls {
    display: flex;
    gap: 8px;
    padding: 12px 32px;
    background: #f1f5f9;
    border-bottom: 1px solid #e2e8f0;
    flex-wrap: wrap;
    align-items: center;
  }
  .mx-search {
    padding: 8px 12px 8px 36px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 13px;
    width: 280px;
    outline: none;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E") 10px center no-repeat;
  }
  .mx-search:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }
  .mx-controls-group {
    display: flex;
    gap: 4px;
    padding: 2px;
    background: #e2e8f0;
    border-radius: 8px;
  }
  .mx-filter-btn {
    padding: 5px 12px;
    border: none;
    border-radius: 6px;
    background: transparent;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all .15s;
    color: #64748b;
  }
  .mx-filter-btn:hover { background: rgba(255,255,255,.6); color: #1e293b; }
  .mx-filter-btn.active { background: #fff; color: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
  .mx-filter-btn .mx-filter-count {
    font-size: 10px;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 10px;
    margin-left: 4px;
  }
  .mx-controls-sep {
    width: 1px;
    height: 24px;
    background: #cbd5e1;
    margin: 0 4px;
  }
  .mx-sev-filter {
    padding: 5px 10px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: #fff;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all .15s;
    color: #64748b;
  }
  .mx-sev-filter:hover { background: #f8fafc; }
  .mx-sev-filter.active { border-color: #0f172a; color: #0f172a; background: #f8fafc; }
  .mx-row-count {
    font-size: 12px;
    color: #94a3b8;
    margin-left: auto;
    white-space: nowrap;
  }

  /* --- Legend Panel (collapsible) --- */
  .mx-legend {
    max-height: 0;
    overflow: hidden;
    transition: max-height .3s ease, padding .3s ease;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
  }
  .mx-legend.open {
    max-height: 600px;
    padding: 20px 32px;
  }
  .mx-legend-title {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 16px;
  }
  .mx-legend-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  .mx-legend-section h4 {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: #64748b;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid #e2e8f0;
  }
  .mx-legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    padding: 3px 0;
    color: #475569;
  }
  .mx-legend-code {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 20px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .mx-legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* --- Hint bar --- */
  .mx-hints {
    display: flex;
    gap: 16px;
    padding: 8px 32px;
    background: #fefce8;
    border-bottom: 1px solid #fde68a;
    font-size: 11px;
    color: #92400e;
    align-items: center;
  }
  .mx-hints kbd {
    display: inline-block;
    padding: 1px 5px;
    background: #fff;
    border: 1px solid #d4d4d8;
    border-radius: 3px;
    font-family: monospace;
    font-size: 11px;
    box-shadow: 0 1px 0 #d4d4d8;
  }

  /* --- Matrix Container --- */
  .mx-body {
    padding: 24px 32px;
  }

  /* --- Click hint on rows --- */
  .mx-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 10px;
    overflow: hidden;
    transition: box-shadow .15s;
    cursor: pointer;
    position: relative;
  }
  .mx-row:hover { box-shadow: 0 2px 12px rgba(0,0,0,.07); }
  .mx-row::after {
    content: '';
    position: absolute;
    top: 16px;
    right: 12px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #cbd5e1;
    transition: transform .2s;
  }
  .mx-row.expanded::after { transform: rotate(180deg); }

  /* Status stripe on left edge */
  .mx-row[data-status="aligned"] { border-left: 4px solid #22c55e; }
  .mx-row[data-status="partial"] { border-left: 4px solid #f59e0b; }
  .mx-row[data-status="conflict"] { border-left: 4px solid #ef4444; }
  .mx-row[data-status="gap"] { border-left: 4px solid #3b82f6; }
  .mx-row[data-status="addition"] { border-left: 4px solid #f97316; }

  /* --- Columns --- */
  .mx-col {
    padding: 14px 18px;
  }
  .mx-col-prd {
    border-right: 1px solid #e2e8f0;
    background: #fffbeb;
  }
  .mx-col-ux {
    background: #eff6ff;
  }
  .mx-col-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: #64748b;
    margin-bottom: 6px;
  }
  .mx-col-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 3px;
  }
  .mx-col-text {
    font-size: 13px;
    color: #475569;
    line-height: 1.5;
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
    margin-bottom: 6px;
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
    gap: 5px;
    padding: 3px 9px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    margin-top: 6px;
    margin-right: 4px;
    cursor: pointer;
    transition: all .15s;
  }
  .mx-finding:hover { opacity: .85; transform: translateY(-1px); }
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
    padding: 10px 14px;
    border-left: 3px solid;
    margin: 10px 0;
    font-size: 12px;
    background: #fff;
    border-radius: 0 6px 6px 0;
    line-height: 1.5;
  }
  .mx-detail-quote-prd { border-color: #eab308; background: #fffef5; }
  .mx-detail-quote-ux { border-color: #3b82f6; background: #f8fbff; }
  .mx-detail-quote-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 4px;
  }
  .mx-detail-recommendation {
    margin-top: 12px;
    padding: 10px 14px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 6px;
    font-size: 12px;
    color: #166534;
  }
  .mx-detail-recommendation strong {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: .03em;
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
    stroke: #22c55e;
  }
  .mx-empty-state h3 {
    font-size: 16px;
    color: #15803d;
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

<!-- ===== HEADER ===== -->
<div class="mx-header">
  <div class="mx-header-top">
    <h1>PRD ↔ UX Reconciliation Matrix</h1>
    <div class="mx-header-actions">
      <button class="mx-header-btn" data-action="toggle-legend">Legend</button>
      <button class="mx-header-btn" data-action="expand-all">Expand All</button>
      <button class="mx-header-btn" data-action="collapse-all">Collapse All</button>
    </div>
  </div>
  <div class="mx-subtitle">{PRD_TITLE} — {UX_TITLE} — {DATE}</div>
</div>

<!-- ===== COLLAPSIBLE LEGEND ===== -->
<div class="mx-legend" id="legend-panel">
  <div class="mx-legend-title">Glossary &amp; Legend</div>
  <div class="mx-legend-grid">
    <div class="mx-legend-section">
      <h4>Finding Categories</h4>
      <div class="mx-legend-item"><span class="mx-legend-code" style="background:#fee2e2;color:#dc2626;">V</span> <strong>Conflict</strong> — PRD and UX contradict each other</div>
      <div class="mx-legend-item"><span class="mx-legend-code" style="background:#ede9fe;color:#7c3aed;">N</span> <strong>Naming Drift</strong> — Same concept, different names</div>
      <div class="mx-legend-item"><span class="mx-legend-code" style="background:#dbeafe;color:#2563eb;">W</span> <strong>UX Gap</strong> — PRD requires it, UX doesn't define it</div>
      <div class="mx-legend-item"><span class="mx-legend-code" style="background:#fff7ed;color:#ea580c;">Q</span> <strong>UX Addition</strong> — UX defines it, PRD doesn't require it</div>
      <div class="mx-legend-item"><span class="mx-legend-code" style="background:#e0e7ff;color:#6366f1;">D</span> <strong>PRD Issue</strong> — Internal PRD contradiction (report only)</div>
      <div class="mx-legend-item"><span class="mx-legend-code" style="background:#ccfbf1;color:#0d9488;">E</span> <strong>UX Issue</strong> — Internal UX contradiction (report only)</div>
    </div>
    <div class="mx-legend-section">
      <h4>Row Statuses</h4>
      <div class="mx-legend-item"><span class="mx-legend-dot" style="background:#22c55e;"></span> <strong>Aligned</strong> — Requirement fully covered, no conflicts</div>
      <div class="mx-legend-item"><span class="mx-legend-dot" style="background:#f59e0b;"></span> <strong>Partial</strong> — Some coverage, gaps remain</div>
      <div class="mx-legend-item"><span class="mx-legend-dot" style="background:#ef4444;"></span> <strong>Conflict</strong> — PRD and UX contradict</div>
      <div class="mx-legend-item"><span class="mx-legend-dot" style="background:#3b82f6;"></span> <strong>Gap</strong> — No UX definition exists</div>
      <div class="mx-legend-item"><span class="mx-legend-dot" style="background:#f97316;"></span> <strong>Addition</strong> — UX defines something PRD doesn't require</div>
      <h4 style="margin-top:16px;">Severity Levels</h4>
      <div class="mx-legend-item"><span class="mx-severity mx-sev-blocker">BLOCKER</span> Documents contradict — blocks mock development</div>
      <div class="mx-legend-item"><span class="mx-severity mx-sev-major">MAJOR</span> Significant gap — likely causes rework</div>
      <div class="mx-legend-item"><span class="mx-severity mx-sev-minor">MINOR</span> Low-risk terminology or cosmetic issue</div>
    </div>
  </div>
</div>

<!-- ===== ALIGNMENT GAUGE ===== -->
<div class="mx-gauge">
  <span class="mx-gauge-label">Alignment Score</span>
  <div class="mx-gauge-bar">
    <div class="mx-gauge-fill" id="gauge-fill" style="width:{ALIGNMENT_SCORE}%;"></div>
  </div>
  <span class="mx-gauge-score" id="gauge-score">{ALIGNMENT_SCORE}%</span>
</div>

<!-- ===== STATS BAR ===== -->
<div class="mx-stats">
  <div class="mx-stat mx-stat-total">
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
</div>

<!-- ===== CONTROLS ===== -->
<div class="mx-controls">
  <input type="text" class="mx-search" placeholder="Search by ID, keyword, component..." data-action="search">
  <div class="mx-controls-group">
    <button class="mx-filter-btn active" data-filter="all">All</button>
    <button class="mx-filter-btn" data-filter="conflict">Conflicts</button>
    <button class="mx-filter-btn" data-filter="gap">Gaps</button>
    <button class="mx-filter-btn" data-filter="partial">Partial</button>
    <button class="mx-filter-btn" data-filter="addition">Additions</button>
    <button class="mx-filter-btn" data-filter="aligned">Aligned</button>
  </div>
  <div class="mx-controls-sep"></div>
  <button class="mx-sev-filter" data-severity="all">All Sev.</button>
  <button class="mx-sev-filter" data-severity="blocker">Blockers</button>
  <button class="mx-sev-filter" data-severity="major">Major</button>
  <button class="mx-sev-filter" data-severity="minor">Minor</button>
  <span class="mx-row-count" id="row-count"></span>
</div>

<!-- ===== KEYBOARD HINTS ===== -->
<div class="mx-hints">
  <span><kbd>/</kbd> Search</span>
  <span><kbd>Esc</kbd> Clear</span>
  <span><kbd>[</kbd> <kbd>]</kbd> Prev / Next row</span>
  <span><kbd>Enter</kbd> Expand / Collapse</span>
  <span><kbd>L</kbd> Toggle legend</span>
  <span>Click any row to expand details</span>
</div>

<!-- ===== MATRIX BODY ===== -->
<div class="mx-body" id="matrix-body">
  <!-- MATRIX_ROWS -->
  <!--
  Example row structure (data-severity is the highest severity finding in this row):

  <div class="mx-row" data-status="conflict" data-severity="blocker" data-fr="FR-12" data-keywords="pagination table infinite scroll">
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
      <div class="mx-detail-recommendation">
        <strong>Recommendation:</strong> Align on pagination vs infinite scroll before mock development. Consider hybrid approach with configurable page sizes.
      </div>
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

<!-- ===== FOOTER ===== -->
<div class="mx-footer">
  PRD ↔ UX Reconciliation — Generated {DATE}
</div>

<script>
(function() {
  const body = document.getElementById('matrix-body');
  const search = document.querySelector('[data-action="search"]');
  const filterBtns = document.querySelectorAll('.mx-filter-btn');
  const sevBtns = document.querySelectorAll('.mx-sev-filter');
  const rowCountEl = document.getElementById('row-count');
  const legendPanel = document.getElementById('legend-panel');
  const gaugeFill = document.getElementById('gauge-fill');
  const gaugeScore = document.getElementById('gauge-score');
  let focusedRowIdx = -1;

  /* --- Gauge color --- */
  const score = parseInt(gaugeScore.textContent) || 0;
  const gaugeColor = score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  gaugeFill.style.background = `linear-gradient(90deg, ${gaugeColor}, ${gaugeColor}dd)`;
  gaugeScore.style.color = gaugeColor;

  /* --- Row count --- */
  function updateRowCount() {
    const visible = document.querySelectorAll('.mx-row:not([style*="display: none"])').length;
    const total = document.querySelectorAll('.mx-row').length;
    rowCountEl.textContent = visible === total ? `${total} items` : `${visible} of ${total} items`;
  }
  updateRowCount();

  /* --- Row expand/collapse --- */
  body.addEventListener('click', (e) => {
    const row = e.target.closest('.mx-row');
    if (!row) return;
    if (e.target.closest('.mx-finding')) {
      row.classList.add('expanded');
      return;
    }
    row.classList.toggle('expanded');
  });

  /* --- Filter by status --- */
  let activeStatus = 'all';
  let activeSeverity = 'all';

  function applyFilters() {
    document.querySelectorAll('.mx-row').forEach(row => {
      const statusMatch = activeStatus === 'all' || row.dataset.status === activeStatus;
      const sevMatch = activeSeverity === 'all' || row.dataset.severity === activeSeverity || (!row.dataset.severity && activeSeverity === 'all');
      row.style.display = statusMatch && sevMatch ? '' : 'none';
    });
    updateRowCount();
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeStatus = btn.dataset.filter;
      applyFilters();
    });
  });

  /* --- Filter by severity --- */
  sevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sevBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSeverity = btn.dataset.severity;
      applyFilters();
    });
  });
  sevBtns[0].classList.add('active');

  /* --- Search --- */
  search.addEventListener('input', () => {
    const q = search.value.toLowerCase();
    document.querySelectorAll('.mx-row').forEach(row => {
      const text = (row.dataset.fr + ' ' + row.dataset.keywords + ' ' + row.textContent).toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
    if (!q) {
      filterBtns.forEach(b => b.classList.remove('active'));
      filterBtns[0].classList.add('active');
      activeStatus = 'all';
      applyFilters();
    }
    updateRowCount();
  });

  /* --- Legend toggle --- */
  function toggleLegend() {
    legendPanel.classList.toggle('open');
    const btn = document.querySelector('[data-action="toggle-legend"]');
    btn.classList.toggle('active', legendPanel.classList.contains('open'));
  }
  document.querySelector('[data-action="toggle-legend"]').addEventListener('click', toggleLegend);

  /* --- Expand / Collapse all --- */
  document.querySelector('[data-action="expand-all"]').addEventListener('click', () => {
    document.querySelectorAll('.mx-row').forEach(r => r.classList.add('expanded'));
  });
  document.querySelector('[data-action="collapse-all"]').addEventListener('click', () => {
    document.querySelectorAll('.mx-row').forEach(r => r.classList.remove('expanded'));
  });

  /* --- Keyboard navigation --- */
  function getVisibleRows() {
    return [...document.querySelectorAll('.mx-row:not([style*="display: none"])')];
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      search.value = '';
      search.dispatchEvent(new Event('input'));
      search.blur();
      return;
    }
    if (e.key === '/' && document.activeElement !== search) {
      e.preventDefault();
      search.focus();
      return;
    }
    if (e.key === 'l' || e.key === 'L') {
      if (document.activeElement === search) return;
      toggleLegend();
      return;
    }
    const rows = getVisibleRows();
    if (!rows.length) return;
    if (e.key === ']') {
      e.preventDefault();
      focusedRowIdx = Math.min(focusedRowIdx + 1, rows.length - 1);
      rows[focusedRowIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      rows.forEach(r => r.style.outline = '');
      rows[focusedRowIdx].style.outline = '2px solid #3b82f6';
    }
    if (e.key === '[') {
      e.preventDefault();
      focusedRowIdx = Math.max(focusedRowIdx - 1, 0);
      rows[focusedRowIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
      rows.forEach(r => r.style.outline = '');
      rows[focusedRowIdx].style.outline = '2px solid #3b82f6';
    }
    if (e.key === 'Enter' && focusedRowIdx >= 0 && document.activeElement !== search) {
      e.preventDefault();
      rows[focusedRowIdx].classList.toggle('expanded');
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

### Data attributes per row

| Attribute | Value |
|-----------|-------|
| `data-status` | aligned / partial / conflict / gap / addition |
| `data-severity` | blocker / major / minor (highest severity finding in this row; omit for aligned rows with no findings) |
| `data-fr` | FR ID(s) for search |
| `data-keywords` | Space-separated search terms |

### Detail panel content

Every row with findings must have a `.mx-detail` section containing:
- Finding ID + severity + description (verbatim from reconciliation.md)
- PRD quote block with exact text from PRD (`.mx-detail-quote-prd`)
- UX quote block with exact text from UX or "Not defined" for W findings (`.mx-detail-quote-ux`)
- Recommendation block (`.mx-detail-recommendation`) with actionable next step

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
- [ ] Alignment gauge score and color match reconciliation.md
- [ ] Stats bar counts match reconciliation.md
- [ ] Search filters rows correctly
- [ ] Status filter buttons work
- [ ] Severity filter buttons work
- [ ] Row expand/collapse works (click + Enter key)
- [ ] Expand All / Collapse All buttons work
- [ ] Legend panel opens/closes correctly
- [ ] Legend content matches finding categories and severity definitions
- [ ] Keyboard navigation works (/, Esc, [, ], Enter, L)
- [ ] Row count updates when filters/search applied
- [ ] Finding descriptions are verbatim from reconciliation.md
- [ ] PRD/UX quotes match source documents
- [ ] Recommendation blocks present for rows with findings
- [ ] Rows ordered by priority (conflicts → gaps → partial → additions → aligned)
- [ ] Naming drift table appears if N findings exist
- [ ] `data-severity` attribute set on each row with findings

### Cross-Output Consistency
- [ ] Every finding ID in reconciliation.md exists in prd-ux-matrix.html
- [ ] Finding descriptions are character-for-character identical
- [ ] Severity for each finding is the same in both outputs
- [ ] Status per requirement is consistent
