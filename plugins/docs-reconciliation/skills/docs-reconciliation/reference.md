# Docs Reconciliation — Template Reference

This file contains the HTML/CSS/JS templates for generated outputs. Loaded on-demand.

---

## 1. Reconciliation Matrix HTML Template (reconciliation-matrix.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Docs Reconciliation Dashboard</title>
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
  .mx-header h1 { font-size: 22px; font-weight: 700; }
  .mx-header-actions { display: flex; gap: 8px; }
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
  .mx-header .mx-subtitle { font-size: 13px; color: #94a3b8; }
  .mx-mode-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    background: rgba(99,102,241,.3);
    color: #a5b4fc;
    margin-left: 8px;
  }

  /* --- Tab Navigation --- */
  .mx-tabs {
    display: flex;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
    padding: 0 32px;
  }
  .mx-tab {
    padding: 12px 20px;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all .15s;
  }
  .mx-tab:hover { color: #1e293b; }
  .mx-tab.active { color: #0f172a; border-bottom-color: #3b82f6; }
  .mx-tab-count {
    font-size: 10px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 10px;
    margin-left: 6px;
    background: #f1f5f9;
    color: #64748b;
  }
  .mx-tab.active .mx-tab-count { background: #dbeafe; color: #2563eb; }

  /* --- View panels (toggled by tabs) --- */
  .mx-view { display: none; }
  .mx-view.active { display: block; }

  /* --- Alignment Gauge --- */
  .mx-gauge {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 32px;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
  }
  .mx-gauge-label { font-size: 13px; font-weight: 600; color: #475569; white-space: nowrap; }
  .mx-gauge-bar {
    flex: 1; height: 10px; background: #e2e8f0;
    border-radius: 5px; overflow: hidden; position: relative;
  }
  .mx-gauge-fill { height: 100%; border-radius: 5px; transition: width .6s ease; }
  .mx-gauge-score { font-size: 20px; font-weight: 800; white-space: nowrap; }

  /* --- Per-document gauges --- */
  .mx-doc-gauges {
    display: flex;
    gap: 16px;
    padding: 10px 32px;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
  }
  .mx-doc-gauge {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
  }
  .mx-doc-gauge-icon {
    width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
  }
  .mx-doc-gauge-label { font-size: 12px; font-weight: 600; color: #475569; }
  .mx-doc-gauge-bar {
    flex: 1; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;
  }
  .mx-doc-gauge-fill { height: 100%; border-radius: 3px; }
  .mx-doc-gauge-score { font-size: 14px; font-weight: 700; }

  /* --- Stats Bar --- */
  .mx-stats {
    display: flex; gap: 4px; padding: 12px 32px;
    background: #fff; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap;
  }
  .mx-stat {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 600;
    padding: 6px 14px; border-radius: 6px;
    background: #f8fafc; border: 1px solid #e2e8f0;
  }
  .mx-stat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .mx-stat-value { font-size: 16px; font-weight: 700; }
  .mx-stat-total {
    margin-right: 8px; padding: 6px 16px;
    background: #0f172a; color: #f1f5f9;
    border-radius: 6px; border: none;
  }
  .mx-stat-total .mx-stat-value { color: #fff; }

  /* --- Controls --- */
  .mx-controls {
    display: flex; gap: 8px; padding: 12px 32px;
    background: #f1f5f9; border-bottom: 1px solid #e2e8f0;
    flex-wrap: wrap; align-items: center;
  }
  .mx-search {
    padding: 8px 12px 8px 36px;
    border: 1px solid #cbd5e1; border-radius: 6px;
    font-size: 13px; width: 280px; outline: none;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E") 10px center no-repeat;
  }
  .mx-search:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.15); }
  .mx-controls-group {
    display: flex; gap: 4px; padding: 2px;
    background: #e2e8f0; border-radius: 8px;
  }
  .mx-filter-btn {
    padding: 5px 12px; border: none; border-radius: 6px;
    background: transparent; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all .15s; color: #64748b;
  }
  .mx-filter-btn:hover { background: rgba(255,255,255,.6); color: #1e293b; }
  .mx-filter-btn.active { background: #fff; color: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
  .mx-filter-btn .mx-filter-count {
    font-size: 10px; font-weight: 700;
    padding: 1px 5px; border-radius: 10px; margin-left: 4px;
  }
  .mx-controls-sep { width: 1px; height: 24px; background: #cbd5e1; margin: 0 4px; }
  .mx-sev-filter {
    padding: 5px 10px; border: 1px solid #cbd5e1; border-radius: 6px;
    background: #fff; font-size: 11px; font-weight: 600;
    cursor: pointer; transition: all .15s; color: #64748b;
  }
  .mx-sev-filter:hover { background: #f8fafc; }
  .mx-sev-filter.active { border-color: #0f172a; color: #0f172a; background: #f8fafc; }
  .mx-doc-filter {
    padding: 5px 10px; border: 1px solid #cbd5e1; border-radius: 6px;
    background: #fff; font-size: 11px; font-weight: 600;
    cursor: pointer; transition: all .15s; color: #64748b;
  }
  .mx-doc-filter:hover { background: #f8fafc; }
  .mx-doc-filter.active { border-color: #6366f1; color: #6366f1; background: #eef2ff; }
  .mx-row-count { font-size: 12px; color: #94a3b8; margin-left: auto; white-space: nowrap; }

  /* --- Legend Panel (collapsible) --- */
  .mx-legend {
    max-height: 0; overflow: hidden;
    transition: max-height .3s ease, padding .3s ease;
    background: #fff; border-bottom: 1px solid #e2e8f0;
  }
  .mx-legend.open { max-height: 800px; padding: 20px 32px; }
  .mx-legend-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
  .mx-legend-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }
  .mx-legend-section h4 {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .05em; color: #64748b; margin-bottom: 8px;
    padding-bottom: 4px; border-bottom: 1px solid #e2e8f0;
  }
  .mx-legend-item {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; padding: 3px 0; color: #475569;
  }
  .mx-legend-code {
    display: inline-flex; align-items: center; justify-content: center;
    width: 28px; height: 20px; border-radius: 4px;
    font-size: 11px; font-weight: 700; flex-shrink: 0;
  }
  .mx-legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

  /* --- Keyboard Hints --- */
  .mx-hints {
    display: flex; gap: 16px; padding: 8px 32px;
    background: #fefce8; border-bottom: 1px solid #fde68a;
    font-size: 11px; color: #92400e; align-items: center;
  }
  .mx-hints kbd {
    display: inline-block; padding: 1px 5px; background: #fff;
    border: 1px solid #d4d4d8; border-radius: 3px;
    font-family: monospace; font-size: 11px; box-shadow: 0 1px 0 #d4d4d8;
  }

  /* =========================================
     HEATMAP VIEW
     ========================================= */
  .mx-heatmap {
    padding: 24px 32px;
  }
  .mx-heatmap-title {
    font-size: 16px; font-weight: 700; margin-bottom: 16px; color: #0f172a;
  }
  .mx-heatmap-grid {
    display: grid;
    gap: 2px;
    background: #e2e8f0;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
  }
  /* grid-template-columns set dynamically: "200px repeat(N, 1fr)" where N = document count */
  .mx-hm-header {
    background: #0f172a;
    color: #f1f5f9;
    font-size: 12px;
    font-weight: 700;
    padding: 10px 14px;
    text-align: center;
  }
  .mx-hm-header-corner { text-align: left; }
  .mx-hm-label {
    background: #fff;
    font-size: 12px;
    font-weight: 600;
    padding: 8px 14px;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 6px;
    border-right: 1px solid #e2e8f0;
  }
  .mx-hm-label-id {
    font-size: 10px;
    font-weight: 700;
    color: #64748b;
    font-family: monospace;
  }
  .mx-hm-cell {
    padding: 8px;
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all .15s;
    position: relative;
  }
  .mx-hm-cell:hover { opacity: .85; transform: scale(1.05); z-index: 1; }
  .mx-hm-cell[data-status="aligned"] { background: #dcfce7; color: #15803d; }
  .mx-hm-cell[data-status="partial"] { background: #fef3c7; color: #a16207; }
  .mx-hm-cell[data-status="conflict"] { background: #fee2e2; color: #dc2626; }
  .mx-hm-cell[data-status="gap"] { background: #dbeafe; color: #2563eb; }
  .mx-hm-cell[data-status="addition"] { background: #fff7ed; color: #ea580c; }
  .mx-hm-cell[data-status="na"] { background: #f1f5f9; color: #94a3b8; }
  .mx-hm-cell[data-status="source"] { background: #fef3c7; color: #92400e; }
  /* Group divider row */
  .mx-hm-group {
    grid-column: 1 / -1;
    background: #f1f5f9;
    padding: 6px 14px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: #475569;
  }
  /* Heatmap legend */
  .mx-hm-legend {
    display: flex;
    gap: 16px;
    padding: 12px 0;
    margin-top: 12px;
    flex-wrap: wrap;
  }
  .mx-hm-legend-item {
    display: flex; align-items: center; gap: 6px; font-size: 12px; color: #475569;
  }
  .mx-hm-legend-swatch {
    width: 16px; height: 16px; border-radius: 3px; flex-shrink: 0;
  }

  /* =========================================
     MATRIX VIEW (row-based)
     ========================================= */
  .mx-body { padding: 24px 32px; }

  .mx-row {
    display: grid;
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
  /* grid-template-columns set per mode: "1fr 1fr" (bilateral) or "1fr 1fr 1fr" (trilateral) */
  .mx-row:hover { box-shadow: 0 2px 12px rgba(0,0,0,.07); }
  .mx-row::after {
    content: '';
    position: absolute; top: 16px; right: 12px;
    width: 0; height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #cbd5e1;
    transition: transform .2s;
  }
  .mx-row.expanded::after { transform: rotate(180deg); }

  /* Status stripe */
  .mx-row[data-status="aligned"] { border-left: 4px solid #22c55e; }
  .mx-row[data-status="partial"] { border-left: 4px solid #f59e0b; }
  .mx-row[data-status="conflict"] { border-left: 4px solid #ef4444; }
  .mx-row[data-status="gap"] { border-left: 4px solid #3b82f6; }
  .mx-row[data-status="addition"] { border-left: 4px solid #f97316; }
  .mx-row[data-status="cascade"] { border-left: 4px solid #ec4899; }

  /* --- Columns --- */
  .mx-col { padding: 14px 18px; }
  .mx-col-prd { border-right: 1px solid #e2e8f0; background: #fffbeb; }
  .mx-col-ux { background: #eff6ff; }
  .mx-col-mock { border-left: 1px solid #e2e8f0; background: #f0fdf4; }
  /* In bilateral PRD+Mock, the mock column uses the second slot */
  .mx-col-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .05em; color: #64748b; margin-bottom: 6px;
  }
  .mx-col-title { font-size: 14px; font-weight: 600; margin-bottom: 3px; }
  .mx-col-text { font-size: 13px; color: #475569; line-height: 1.5; }
  .mx-col-empty { font-size: 13px; color: #94a3b8; font-style: italic; }

  /* --- Status Badge --- */
  .mx-status {
    display: inline-block; padding: 2px 8px; border-radius: 4px;
    font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;
  }
  .mx-status-aligned { background: #dcfce7; color: #15803d; }
  .mx-status-partial { background: #fef3c7; color: #a16207; }
  .mx-status-conflict { background: #fee2e2; color: #dc2626; }
  .mx-status-gap { background: #dbeafe; color: #2563eb; }
  .mx-status-addition { background: #fff7ed; color: #ea580c; }
  .mx-status-cascade { background: #fce7f3; color: #db2777; }

  /* --- Finding Badges --- */
  .mx-finding {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 9px; border-radius: 4px;
    font-size: 12px; font-weight: 600;
    margin-top: 6px; margin-right: 4px;
    cursor: pointer; transition: all .15s;
  }
  .mx-finding:hover { opacity: .85; transform: translateY(-1px); }
  .mx-finding-V { background: #fee2e2; color: #dc2626; }
  .mx-finding-N { background: #ede9fe; color: #7c3aed; }
  .mx-finding-W { background: #dbeafe; color: #2563eb; }
  .mx-finding-Q { background: #fff7ed; color: #ea580c; }
  .mx-finding-C { background: #fce7f3; color: #db2777; }
  .mx-finding-S { background: #fef3c7; color: #b45309; }

  /* --- Severity Pills --- */
  .mx-severity {
    font-size: 10px; font-weight: 700; padding: 1px 6px;
    border-radius: 3px; text-transform: uppercase;
  }
  .mx-sev-blocker { background: #dc2626; color: #fff; }
  .mx-sev-major { background: #f59e0b; color: #fff; }
  .mx-sev-minor { background: #6b7280; color: #fff; }

  /* --- Doc Pair Tag --- */
  .mx-doc-tag {
    display: inline-block; padding: 1px 6px; border-radius: 3px;
    font-size: 10px; font-weight: 600; font-family: monospace;
    background: #f1f5f9; color: #64748b; margin-left: 4px;
  }

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
  .mx-detail-desc { margin-bottom: 8px; line-height: 1.6; }
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
  .mx-detail-quote-mock { border-color: #22c55e; background: #f5fef7; }
  .mx-detail-quote-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    color: #64748b; margin-bottom: 4px;
  }
  .mx-detail-cascade {
    margin: 12px 0;
    padding: 12px 16px;
    background: #fdf2f8;
    border: 1px solid #fbcfe8;
    border-radius: 6px;
  }
  .mx-detail-cascade-chain {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    flex-wrap: wrap;
  }
  .mx-detail-cascade-step {
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 11px;
  }
  .mx-detail-cascade-arrow { color: #ec4899; font-weight: 700; }
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
    font-size: 10px; text-transform: uppercase; letter-spacing: .03em;
  }

  /* --- Naming Drift Table --- */
  .mx-naming-table {
    margin-bottom: 24px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    border-left: 4px solid #7c3aed;
    overflow: hidden;
  }
  .mx-naming-header {
    padding: 12px 20px;
    background: #ede9fe;
    font-size: 13px;
    font-weight: 700;
    color: #7c3aed;
  }
  .mx-naming-table table {
    width: 100%; font-size: 13px; border-collapse: collapse;
  }
  .mx-naming-table th {
    padding: 8px 16px; text-align: left; font-weight: 600; background: #f8fafc;
  }
  .mx-naming-table td { padding: 8px 16px; }

  /* --- Footer --- */
  .mx-footer {
    text-align: center; padding: 24px;
    font-size: 12px; color: #94a3b8;
    border-top: 1px solid #e2e8f0; margin-top: 32px;
  }
</style>
</head>
<body>

<!-- ===== HEADER ===== -->
<div class="mx-header">
  <div class="mx-header-top">
    <h1>Docs Reconciliation Dashboard <span class="mx-mode-badge">{MODE}</span></h1>
    <div class="mx-header-actions">
      <button class="mx-header-btn" data-action="toggle-legend">Legend</button>
      <button class="mx-header-btn" data-action="expand-all">Expand All</button>
      <button class="mx-header-btn" data-action="collapse-all">Collapse All</button>
    </div>
  </div>
  <div class="mx-subtitle">{PRD_TITLE} — {DATE} — Documents: {DOC_LIST}</div>
</div>

<!-- ===== COLLAPSIBLE LEGEND ===== -->
<div class="mx-legend" id="legend-panel">
  <div class="mx-legend-title">Glossary & Legend</div>
  <div class="mx-legend-grid">
    <div class="mx-legend-section">
      <h4>Finding Categories</h4>
      <div class="mx-legend-item"><span class="mx-legend-code" style="background:#fee2e2;color:#dc2626;">V</span> <strong>Conflict</strong> — Two+ docs contradict each other</div>
      <div class="mx-legend-item"><span class="mx-legend-code" style="background:#ede9fe;color:#7c3aed;">N</span> <strong>Naming Drift</strong> — Same concept, different names</div>
      <div class="mx-legend-item"><span class="mx-legend-code" style="background:#dbeafe;color:#2563eb;">W</span> <strong>Coverage Gap</strong> — PRD requires, target missing</div>
      <div class="mx-legend-item"><span class="mx-legend-code" style="background:#fff7ed;color:#ea580c;">Q</span> <strong>Scope Addition</strong> — Doc adds without PRD backing</div>
      <div class="mx-legend-item"><span class="mx-legend-code" style="background:#fce7f3;color:#db2777;">C</span> <strong>Cascade Violation</strong> — Progressive drift PRD->UX->Mock</div>
      <div class="mx-legend-item"><span class="mx-legend-code" style="background:#fef3c7;color:#b45309;">S</span> <strong>Specificity Gap</strong> — Downstream invented details</div>
      <div class="mx-legend-item"><span class="mx-legend-code" style="background:#e0e7ff;color:#6366f1;">D</span> <strong>PRD Issue</strong> — Internal PRD problem (report only)</div>
      <div class="mx-legend-item"><span class="mx-legend-code" style="background:#ccfbf1;color:#0d9488;">E</span> <strong>UX Issue</strong> — Internal UX problem (report only)</div>
      <div class="mx-legend-item"><span class="mx-legend-code" style="background:#f1f5f9;color:#64748b;">M</span> <strong>Mock Issue</strong> — Internal Mock problem (report only)</div>
    </div>
    <div class="mx-legend-section">
      <h4>Row Statuses</h4>
      <div class="mx-legend-item"><span class="mx-legend-dot" style="background:#22c55e;"></span> <strong>Aligned</strong> — Fully covered, no conflicts</div>
      <div class="mx-legend-item"><span class="mx-legend-dot" style="background:#f59e0b;"></span> <strong>Partial</strong> — Some coverage, gaps remain</div>
      <div class="mx-legend-item"><span class="mx-legend-dot" style="background:#ef4444;"></span> <strong>Conflict</strong> — Documents contradict</div>
      <div class="mx-legend-item"><span class="mx-legend-dot" style="background:#3b82f6;"></span> <strong>Gap</strong> — Missing from target document(s)</div>
      <div class="mx-legend-item"><span class="mx-legend-dot" style="background:#f97316;"></span> <strong>Addition</strong> — Added without PRD backing</div>
      <div class="mx-legend-item"><span class="mx-legend-dot" style="background:#ec4899;"></span> <strong>Cascade</strong> — Progressive drift across chain</div>
    </div>
    <div class="mx-legend-section">
      <h4>Severity Levels</h4>
      <div class="mx-legend-item"><span class="mx-severity mx-sev-blocker">BLOCKER</span> Contradicts — blocks next phase</div>
      <div class="mx-legend-item"><span class="mx-severity mx-sev-major">MAJOR</span> Significant gap — causes rework</div>
      <div class="mx-legend-item"><span class="mx-severity mx-sev-minor">MINOR</span> Low-risk terminology or cosmetic</div>
      <h4 style="margin-top:16px;">Document Pair Tags</h4>
      <div class="mx-legend-item"><span class="mx-doc-tag">[PRD&lt;&gt;UX]</span> PRD and UX finding</div>
      <div class="mx-legend-item"><span class="mx-doc-tag">[PRD&lt;&gt;Mock]</span> PRD and Mock finding</div>
      <div class="mx-legend-item"><span class="mx-doc-tag">[UX&lt;&gt;Mock]</span> UX and Mock finding</div>
      <div class="mx-legend-item"><span class="mx-doc-tag">[PRD&gt;UX&gt;Mock]</span> Cascade across all three</div>
    </div>
  </div>
</div>

<!-- ===== ALIGNMENT GAUGE ===== -->
<div class="mx-gauge">
  <span class="mx-gauge-label">Overall Alignment</span>
  <div class="mx-gauge-bar">
    <div class="mx-gauge-fill" id="gauge-fill" style="width:{ALIGNMENT_SCORE}%;"></div>
  </div>
  <span class="mx-gauge-score" id="gauge-score">{ALIGNMENT_SCORE}%</span>
</div>

<!-- ===== PER-DOCUMENT GAUGES ===== -->
<div class="mx-doc-gauges">
  <!-- Repeat per provided document. Omit documents not in input. -->
  <!--
  <div class="mx-doc-gauge">
    <div class="mx-doc-gauge-icon" style="background:{DOC_COLOR}"></div>
    <span class="mx-doc-gauge-label">{DOC_NAME} Coverage</span>
    <div class="mx-doc-gauge-bar">
      <div class="mx-doc-gauge-fill" style="width:{DOC_COVERAGE}%; background:{DOC_COLOR};"></div>
    </div>
    <span class="mx-doc-gauge-score" style="color:{DOC_COLOR}">{DOC_COVERAGE}%</span>
  </div>
  -->
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
  <!-- Only in trilateral mode: -->
  <!--
  <div class="mx-stat">
    <div class="mx-stat-dot" style="background:#ec4899"></div>
    <span class="mx-stat-value">{CASCADE_COUNT}</span> Cascades
  </div>
  -->
</div>

<!-- ===== VIEW TABS ===== -->
<div class="mx-tabs">
  <div class="mx-tab active" data-view="matrix">Matrix <span class="mx-tab-count">{TOTAL_FINDINGS}</span></div>
  <div class="mx-tab" data-view="heatmap">Heatmap</div>
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
    <button class="mx-filter-btn" data-filter="cascade">Cascades</button>
    <button class="mx-filter-btn" data-filter="aligned">Aligned</button>
  </div>
  <div class="mx-controls-sep"></div>
  <button class="mx-sev-filter" data-severity="all">All Sev.</button>
  <button class="mx-sev-filter" data-severity="blocker">Blockers</button>
  <button class="mx-sev-filter" data-severity="major">Major</button>
  <button class="mx-sev-filter" data-severity="minor">Minor</button>
  <div class="mx-controls-sep"></div>
  <!-- Document pair filters — only shown in trilateral mode -->
  <!--
  <button class="mx-doc-filter active" data-docs="all">All Pairs</button>
  <button class="mx-doc-filter" data-docs="prd-ux">[PRD<>UX]</button>
  <button class="mx-doc-filter" data-docs="prd-mock">[PRD<>Mock]</button>
  <button class="mx-doc-filter" data-docs="ux-mock">[UX<>Mock]</button>
  -->
  <span class="mx-row-count" id="row-count"></span>
</div>

<!-- ===== KEYBOARD HINTS ===== -->
<div class="mx-hints">
  <span><kbd>/</kbd> Search</span>
  <span><kbd>Esc</kbd> Clear</span>
  <span><kbd>[</kbd> <kbd>]</kbd> Prev / Next row</span>
  <span><kbd>Enter</kbd> Expand / Collapse</span>
  <span><kbd>L</kbd> Toggle legend</span>
  <span><kbd>H</kbd> Toggle heatmap</span>
  <span>Click any row to expand details</span>
</div>

<!-- ===== HEATMAP VIEW ===== -->
<div class="mx-view" id="view-heatmap">
  <div class="mx-heatmap">
    <div class="mx-heatmap-title">Coverage Heatmap — Requirements x Documents</div>
    <div id="heatmap-grid"></div>
    <div class="mx-hm-legend">
      <div class="mx-hm-legend-item"><div class="mx-hm-legend-swatch" style="background:#fef3c7;"></div> PRD (Source)</div>
      <div class="mx-hm-legend-item"><div class="mx-hm-legend-swatch" style="background:#dcfce7;"></div> Aligned</div>
      <div class="mx-hm-legend-item"><div class="mx-hm-legend-swatch" style="background:#fef3c7;border:1px solid #fde68a;"></div> Partial</div>
      <div class="mx-hm-legend-item"><div class="mx-hm-legend-swatch" style="background:#fee2e2;"></div> Conflict</div>
      <div class="mx-hm-legend-item"><div class="mx-hm-legend-swatch" style="background:#dbeafe;"></div> Gap</div>
      <div class="mx-hm-legend-item"><div class="mx-hm-legend-swatch" style="background:#fff7ed;"></div> Addition</div>
      <div class="mx-hm-legend-item"><div class="mx-hm-legend-swatch" style="background:#f1f5f9;"></div> N/A</div>
    </div>
  </div>
</div>

<!-- ===== MATRIX VIEW ===== -->
<div class="mx-view active" id="view-matrix">
  <div id="naming-drift-container"></div>
  <div class="mx-body" id="matrix-body">
    <!-- Populated dynamically from reconciliation-data.json -->
  </div>
</div>

<!-- ===== LOADING STATE ===== -->
<div id="loading-state" style="text-align:center;padding:64px 32px;color:#94a3b8;">
  <p style="font-size:14px;">Loading reconciliation data...</p>
</div>

<!-- ===== ERROR STATE ===== -->
<div id="error-state" style="display:none;text-align:center;padding:64px 32px;color:#dc2626;">
  <p style="font-size:14px;font-weight:600;">Failed to load reconciliation-data.json</p>
  <p style="font-size:12px;color:#94a3b8;margin-top:8px;">Make sure the HTML file is in the same directory as reconciliation-data.json</p>
</div>

<!-- ===== FOOTER ===== -->
<div class="mx-footer">
  Docs Reconciliation Dashboard
</div>

<script>
(function() {
  /* =====================================================
     DATA-DRIVEN RENDERING
     All content is loaded from reconciliation-data.json.
     This template NEVER contains inline finding data.
     ===================================================== */

  var DATA = null;

  /* --- DOM refs --- */
  var body = document.getElementById('matrix-body');
  var search = document.querySelector('[data-action="search"]');
  var filterBtns = document.querySelectorAll('.mx-filter-btn');
  var sevBtns = document.querySelectorAll('.mx-sev-filter');
  var rowCountEl = document.getElementById('row-count');
  var legendPanel = document.getElementById('legend-panel');
  var gaugeFill = document.getElementById('gauge-fill');
  var gaugeScore = document.getElementById('gauge-score');
  var tabs = document.querySelectorAll('.mx-tab');
  var views = document.querySelectorAll('.mx-view');
  var focusedRowIdx = -1;

  /* --- Status/severity config --- */
  var STATUS_LABELS = { aligned:'Aligned', partial:'Partial', conflict:'Conflict', gap:'Gap', addition:'Addition', cascade:'Cascade' };
  var STATUS_ORDER = ['cascade','conflict','gap','partial','addition','aligned'];
  var SEV_ORDER = { blocker:0, major:1, minor:2 };
  var FINDING_COLORS = { V:'#fee2e2', N:'#ede9fe', W:'#dbeafe', Q:'#fff7ed', C:'#fce7f3', S:'#fef3c7' };
  var FINDING_TEXT = { V:'#dc2626', N:'#7c3aed', W:'#2563eb', Q:'#ea580c', C:'#db2777', S:'#b45309' };
  var DOC_LABELS = { prd:'PRD Requirement', ux:'UX Definition', mock:'Mock Representation' };
  var DOC_CLASSES = { prd:'mx-col-prd', ux:'mx-col-ux', mock:'mx-col-mock' };
  var DOC_QUOTE_CLASSES = { prd:'mx-detail-quote-prd', ux:'mx-detail-quote-ux', mock:'mx-detail-quote-mock' };
  var DOC_QUOTE_LABELS = { prd:'PRD says', ux:'UX says', mock:'Mock shows' };

  /* --- Fetch data --- */
  fetch('./reconciliation-data.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      DATA = data;
      document.getElementById('loading-state').style.display = 'none';
      renderDashboard(data);
    })
    .catch(function(err) {
      document.getElementById('loading-state').style.display = 'none';
      document.getElementById('error-state').style.display = 'block';
      console.error('Failed to load reconciliation-data.json:', err);
    });

  /* =====================================================
     RENDER DASHBOARD
     ===================================================== */
  function renderDashboard(d) {
    /* Header */
    document.querySelector('.mx-subtitle').textContent = d.meta.title + ' — ' + d.meta.date + ' — Documents: ' + getDocList(d);
    document.querySelector('.mx-mode-badge').textContent = d.meta.mode;
    document.querySelector('.mx-footer').textContent = 'Docs Reconciliation Dashboard — Generated ' + d.meta.date + ' — Mode: ' + d.meta.mode;

    /* Gauge */
    var score = d.scores.overallAlignment;
    gaugeFill.style.width = score + '%';
    gaugeScore.textContent = score + '%';
    var gc = score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
    gaugeFill.style.background = 'linear-gradient(90deg,' + gc + ',' + gc + 'dd)';
    gaugeScore.style.color = gc;

    /* Per-document gauges */
    renderDocGauges(d);

    /* Stats bar */
    renderStats(d);

    /* Tabs count */
    document.querySelector('[data-view="matrix"] .mx-tab-count').textContent = d.stats.totalFindings;

    /* Doc pair filters (trilateral only) */
    if (d.meta.mode === 'trilateral') { renderDocFilters(); }

    /* Naming drift table */
    if (d.namingDrift && d.namingDrift.length > 0) { renderNamingDrift(d); }

    /* Heatmap */
    renderHeatmap(d);

    /* Matrix rows */
    renderMatrix(d);

    /* Activate controls */
    initControls();
  }

  function getDocList(d) {
    var docs = ['PRD'];
    if (d.meta.documents.ux && d.meta.documents.ux.name) docs.push(d.meta.documents.ux.name);
    if (d.meta.documents.mock && d.meta.documents.mock.name) docs.push(d.meta.documents.mock.name);
    return docs.join(', ');
  }

  function getDocKeys(d) {
    var keys = ['prd'];
    if (d.meta.documents.ux && d.meta.documents.ux.name) keys.push('ux');
    if (d.meta.documents.mock && d.meta.documents.mock.name) keys.push('mock');
    return keys;
  }

  function esc(s) { var el = document.createElement('span'); el.textContent = s || ''; return el.innerHTML; }

  /* --- Per-document gauges --- */
  function renderDocGauges(d) {
    var container = document.querySelector('.mx-doc-gauges');
    container.innerHTML = '';
    var keys = getDocKeys(d);
    keys.forEach(function(k) {
      if (k === 'prd') return;
      var cov = d.scores.perDocument[k];
      if (cov === null || cov === undefined) return;
      var doc = d.meta.documents[k];
      var div = document.createElement('div');
      div.className = 'mx-doc-gauge';
      div.innerHTML = '<div class="mx-doc-gauge-icon" style="background:' + doc.color + '"></div>' +
        '<span class="mx-doc-gauge-label">' + esc(doc.name) + ' Coverage</span>' +
        '<div class="mx-doc-gauge-bar"><div class="mx-doc-gauge-fill" style="width:' + cov + '%;background:' + doc.color + ';"></div></div>' +
        '<span class="mx-doc-gauge-score" style="color:' + doc.color + '">' + cov + '%</span>';
      container.appendChild(div);
    });
  }

  /* --- Stats --- */
  function renderStats(d) {
    var container = document.querySelector('.mx-stats');
    container.innerHTML = '';
    var items = [
      { label:'Requirements', value:d.stats.totalRequirements, cls:'mx-stat-total' },
      { label:'Aligned', value:d.stats.byStatus.aligned, color:'#22c55e' },
      { label:'Partial', value:d.stats.byStatus.partial, color:'#f59e0b' },
      { label:'Conflicts', value:d.stats.byStatus.conflict, color:'#ef4444' },
      { label:'Gaps', value:d.stats.byStatus.gap, color:'#3b82f6' },
      { label:'Additions', value:d.stats.byStatus.addition, color:'#f97316' }
    ];
    if (d.meta.mode === 'trilateral') {
      items.push({ label:'Cascades', value:d.stats.byStatus.cascade || 0, color:'#ec4899' });
    }
    items.forEach(function(item) {
      var div = document.createElement('div');
      div.className = 'mx-stat' + (item.cls ? ' ' + item.cls : '');
      var dot = item.color ? '<div class="mx-stat-dot" style="background:' + item.color + '"></div>' : '';
      div.innerHTML = dot + '<span class="mx-stat-value">' + item.value + '</span> ' + item.label;
      container.appendChild(div);
    });
  }

  /* --- Doc pair filters --- */
  function renderDocFilters() {
    var sep = document.querySelectorAll('.mx-controls-sep');
    var lastSep = sep[sep.length - 1];
    var pairs = [
      { label:'All Pairs', docs:'all' },
      { label:'[PRD<>UX]', docs:'prd-ux' },
      { label:'[PRD<>Mock]', docs:'prd-mock' },
      { label:'[UX<>Mock]', docs:'ux-mock' }
    ];
    pairs.forEach(function(p, i) {
      var btn = document.createElement('button');
      btn.className = 'mx-doc-filter' + (i === 0 ? ' active' : '');
      btn.dataset.docs = p.docs;
      btn.textContent = p.label;
      lastSep.parentNode.insertBefore(btn, lastSep.nextSibling);
    });
  }

  /* --- Naming drift --- */
  function renderNamingDrift(d) {
    var container = document.getElementById('naming-drift-container');
    var keys = getDocKeys(d);
    var html = '<div class="mx-naming-table"><div class="mx-naming-header">Naming Drift — Same concepts, different names</div><table><thead><tr><th>ID</th><th>PRD Term</th>';
    if (keys.indexOf('ux') !== -1) html += '<th>UX Term</th>';
    if (keys.indexOf('mock') !== -1) html += '<th>Mock Term</th>';
    html += '<th>Docs</th><th>Context</th><th>Severity</th></tr></thead><tbody>';
    d.namingDrift.forEach(function(n) {
      html += '<tr><td><span class="mx-finding mx-finding-N" style="margin:0;">' + esc(n.findingId) + '</span></td>';
      html += '<td>"' + esc(n.terms.prd) + '"</td>';
      if (keys.indexOf('ux') !== -1) html += '<td>' + (n.terms.ux ? '"' + esc(n.terms.ux) + '"' : '—') + '</td>';
      if (keys.indexOf('mock') !== -1) html += '<td>' + (n.terms.mock ? '"' + esc(n.terms.mock) + '"' : '—') + '</td>';
      html += '<td><span class="mx-doc-tag">' + esc(n.docsTag) + '</span></td>';
      html += '<td>' + esc(n.context) + '</td>';
      html += '<td><span class="mx-severity mx-sev-' + n.severity + '">' + n.severity.toUpperCase() + '</span></td></tr>';
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
  }

  /* --- Heatmap --- */
  function renderHeatmap(d) {
    var container = document.getElementById('heatmap-grid');
    var keys = getDocKeys(d);
    var cols = '200px' + keys.map(function() { return ' 1fr'; }).join('');
    var html = '<div class="mx-heatmap-grid" style="grid-template-columns:' + cols + ';">';
    /* Header */
    html += '<div class="mx-hm-header mx-hm-header-corner">Requirement</div>';
    keys.forEach(function(k) {
      var name = k === 'prd' ? 'PRD (Source)' : d.meta.documents[k].name;
      html += '<div class="mx-hm-header">' + esc(name) + '</div>';
    });
    /* Group rows */
    var groupMap = {};
    (d.groups || []).forEach(function(g) { g.requirementIds.forEach(function(id) { groupMap[id] = g; }); });
    var lastGroup = null;
    sortRequirements(d.requirements).forEach(function(req) {
      var g = groupMap[req.id];
      if (g && g.id !== lastGroup) {
        html += '<div class="mx-hm-group">' + esc(g.name) + '</div>';
        lastGroup = g.id;
      }
      html += '<div class="mx-hm-label"><span class="mx-hm-label-id">' + esc(req.id) + '</span> ' + esc(req.title) + '</div>';
      keys.forEach(function(k) {
        if (k === 'prd') {
          html += '<div class="mx-hm-cell" data-status="source" title="PRD: Source of truth">PRD</div>';
        } else {
          var pd = req.perDocument[k];
          var st = pd ? pd.status : 'na';
          if (!st || st === 'null') st = 'na';
          var ids = pd && pd.findingIds ? pd.findingIds.join(', ') : '';
          var text = st === 'aligned' ? 'OK' : st === 'na' ? 'N/A' : ids || st;
          var title = d.meta.documents[k].name + ': ' + (STATUS_LABELS[st] || st) + (ids ? ' ' + ids : '');
          html += '<div class="mx-hm-cell" data-status="' + st + '" title="' + esc(title) + '">' + esc(text) + '</div>';
        }
      });
    });
    html += '</div>';
    container.innerHTML = html;
  }

  /* --- Matrix --- */
  function renderMatrix(d) {
    var keys = getDocKeys(d);
    var colCount = keys.length;
    var gridCols = keys.map(function() { return '1fr'; }).join(' ');
    var findingMap = {};
    d.findings.forEach(function(f) { findingMap[f.id] = f; });
    var sorted = sortRequirements(d.requirements);
    var html = '';
    sorted.forEach(function(req) {
      var st = req.overallStatus;
      var highSev = getHighestSeverity(req, findingMap);
      var docPairs = getDocPairs(req, findingMap);
      html += '<div class="mx-row" style="grid-template-columns:' + gridCols + ';" data-status="' + st + '"' +
        (highSev ? ' data-severity="' + highSev + '"' : '') +
        ' data-fr="' + esc(req.id) + '" data-docs="' + docPairs + '" data-keywords="' + esc(req.keywords || '') + '">';
      /* Columns */
      keys.forEach(function(k) {
        var cls = DOC_CLASSES[k] || '';
        var label = DOC_LABELS[k] || k;
        var pd = req.perDocument[k];
        html += '<div class="mx-col ' + cls + '">';
        html += '<div class="mx-col-label">' + label + '</div>';
        if (k === 'prd') {
          html += '<span class="mx-status mx-status-' + st + '">' + (STATUS_LABELS[st] || st) + '</span>';
          html += '<div class="mx-col-title">' + esc(req.id) + ': ' + esc(req.title) + '</div>';
          html += '<div class="mx-col-text">' + esc(pd ? pd.summary : req.description) + '</div>';
          /* Finding badges on PRD col (V, W, N, C) */
          var badges = (req.findingIds || []).filter(function(fid) {
            var f = findingMap[fid];
            return f && 'VNWC'.indexOf(f.code) !== -1;
          });
          if (badges.length) {
            html += '<div>';
            badges.forEach(function(fid) {
              var f = findingMap[fid];
              html += '<span class="mx-finding mx-finding-' + f.code + '" data-finding="' + fid + '">' + fid +
                ' <span class="mx-severity mx-sev-' + f.severity + '">' + f.severity.toUpperCase() + '</span>' +
                ' <span class="mx-doc-tag">' + esc(f.docsTag) + '</span></span>';
            });
            html += '</div>';
          }
        } else {
          if (pd && pd.summary) {
            html += '<div class="mx-col-title">' + esc(pd.summary) + '</div>';
            /* Q/S badges on satellite cols */
            var satBadges = (pd.findingIds || []).filter(function(fid) {
              var f = findingMap[fid];
              return f && 'QS'.indexOf(f.code) !== -1;
            });
            if (satBadges.length) {
              html += '<div>';
              satBadges.forEach(function(fid) {
                var f = findingMap[fid];
                html += '<span class="mx-finding mx-finding-' + f.code + '" data-finding="' + fid + '">' + fid +
                  ' <span class="mx-severity mx-sev-' + f.severity + '">' + f.severity.toUpperCase() + '</span></span>';
              });
              html += '</div>';
            }
          } else {
            var emptyText = st === 'addition' ? 'Not required by PRD' : 'Not defined in ' + (d.meta.documents[k] ? d.meta.documents[k].name : k);
            html += '<div class="mx-col-empty">' + emptyText + '</div>';
          }
        }
        html += '</div>';
      });
      /* Detail panel */
      if (req.findingIds && req.findingIds.length) {
        html += '<div class="mx-detail">';
        req.findingIds.forEach(function(fid, idx) {
          var f = findingMap[fid];
          if (!f) return;
          if (idx > 0) html += '<hr style="border:none;border-top:1px solid #e2e8f0;margin:12px 0;">';
          html += '<div class="mx-detail-desc"><strong>' + fid + ' ' + f.severity.toUpperCase() + ' — ' + esc(f.description) + '</strong> <span class="mx-doc-tag">' + esc(f.docsTag) + '</span></div>';
          /* Cascade chain */
          if (f.code === 'C') {
            var cas = d.cascades.find(function(c) { return c.findingId === fid; });
            if (cas) {
              html += '<div class="mx-detail-cascade">';
              html += '<div style="font-size:11px;font-weight:700;color:#db2777;margin-bottom:8px;">Cascade Chain:</div>';
              html += '<div class="mx-detail-cascade-chain">';
              html += '<span class="mx-detail-cascade-step" style="background:#fffbeb;color:#92400e;">PRD: "' + esc(cas.chain.prd) + '"</span>';
              html += '<span class="mx-detail-cascade-arrow">-></span>';
              html += '<span class="mx-detail-cascade-step" style="background:#eff6ff;color:#1d4ed8;">UX: ' + esc(cas.chain.ux) + '</span>';
              html += '<span class="mx-detail-cascade-arrow">-></span>';
              html += '<span class="mx-detail-cascade-step" style="background:#f0fdf4;color:#166534;">Mock: ' + esc(cas.chain.mock) + '</span>';
              html += '</div></div>';
            }
          }
          /* Quotes */
          ['prd','ux','mock'].forEach(function(dk) {
            if (f.quotes && f.quotes[dk]) {
              html += '<div class="mx-detail-quote ' + (DOC_QUOTE_CLASSES[dk] || '') + '">';
              html += '<div class="mx-detail-quote-label">' + (DOC_QUOTE_LABELS[dk] || dk) + '</div>';
              html += '"' + esc(f.quotes[dk]) + '"';
              html += '</div>';
            }
          });
          html += '<div class="mx-detail-recommendation"><strong>Recommendation:</strong> ' + esc(f.recommendation) + '</div>';
        });
        html += '</div>';
      }
      html += '</div>';
    });
    body.innerHTML = html;
  }

  /* --- Sort requirements by status priority then severity --- */
  function sortRequirements(reqs) {
    return reqs.slice().sort(function(a, b) {
      var sa = STATUS_ORDER.indexOf(a.overallStatus);
      var sb = STATUS_ORDER.indexOf(b.overallStatus);
      if (sa === -1) sa = 99;
      if (sb === -1) sb = 99;
      if (sa !== sb) return sa - sb;
      return 0;
    });
  }

  function getHighestSeverity(req, findingMap) {
    var best = null;
    (req.findingIds || []).forEach(function(fid) {
      var f = findingMap[fid];
      if (!f) return;
      if (!best || (SEV_ORDER[f.severity] || 99) < (SEV_ORDER[best] || 99)) best = f.severity;
    });
    return best;
  }

  function getDocPairs(req, findingMap) {
    var pairs = {};
    (req.findingIds || []).forEach(function(fid) {
      var f = findingMap[fid];
      if (!f) return;
      var tag = f.docsTag.replace(/[\[\]>]/g, '').toLowerCase().replace(/\s/g, '');
      tag.split(',').forEach(function(t) { pairs[t] = true; });
    });
    return Object.keys(pairs).join(' ');
  }

  /* =====================================================
     CONTROLS (filter, search, keyboard — static logic)
     ===================================================== */
  function initControls() {
    var activeStatus = 'all';
    var activeSeverity = 'all';
    var activeDocs = 'all';

    function updateRowCount() {
      var visible = document.querySelectorAll('.mx-row:not([style*="display: none"])').length;
      var total = document.querySelectorAll('.mx-row').length;
      rowCountEl.textContent = visible === total ? total + ' items' : visible + ' of ' + total + ' items';
    }
    updateRowCount();

    function applyFilters() {
      document.querySelectorAll('.mx-row').forEach(function(row) {
        var sm = activeStatus === 'all' || row.dataset.status === activeStatus;
        var sv = activeSeverity === 'all' || row.dataset.severity === activeSeverity || (!row.dataset.severity && activeSeverity === 'all');
        var dm = activeDocs === 'all' || (row.dataset.docs && row.dataset.docs.indexOf(activeDocs) !== -1);
        row.style.display = sm && sv && dm ? '' : 'none';
      });
      updateRowCount();
    }

    /* Status filters */
    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        filterBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeStatus = btn.dataset.filter;
        applyFilters();
      });
    });

    /* Severity filters */
    sevBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        sevBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeSeverity = btn.dataset.severity;
        applyFilters();
      });
    });
    sevBtns[0].classList.add('active');

    /* Doc pair filters (dynamic) */
    document.querySelectorAll('.mx-doc-filter').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.mx-doc-filter').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeDocs = btn.dataset.docs;
        applyFilters();
      });
    });

    /* Row expand/collapse */
    body.addEventListener('click', function(e) {
      var row = e.target.closest('.mx-row');
      if (!row) return;
      if (e.target.closest('.mx-finding')) { row.classList.add('expanded'); return; }
      row.classList.toggle('expanded');
    });

    /* Search */
    search.addEventListener('input', function() {
      var q = search.value.toLowerCase();
      document.querySelectorAll('.mx-row').forEach(function(row) {
        var text = (row.dataset.fr + ' ' + row.dataset.keywords + ' ' + row.dataset.docs + ' ' + row.textContent).toLowerCase();
        row.style.display = text.indexOf(q) !== -1 ? '' : 'none';
      });
      if (!q) { activeStatus = 'all'; applyFilters(); filterBtns.forEach(function(b) { b.classList.remove('active'); }); filterBtns[0].classList.add('active'); }
      updateRowCount();
    });

    /* Tab switching */
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        tabs.forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        views.forEach(function(v) { v.classList.remove('active'); });
        var target = document.getElementById('view-' + tab.dataset.view);
        if (target) target.classList.add('active');
      });
    });

    /* Legend toggle */
    function toggleLegend() {
      legendPanel.classList.toggle('open');
      document.querySelector('[data-action="toggle-legend"]').classList.toggle('active', legendPanel.classList.contains('open'));
    }
    document.querySelector('[data-action="toggle-legend"]').addEventListener('click', toggleLegend);

    /* Expand/Collapse all */
    document.querySelector('[data-action="expand-all"]').addEventListener('click', function() {
      document.querySelectorAll('.mx-row').forEach(function(r) { r.classList.add('expanded'); });
    });
    document.querySelector('[data-action="collapse-all"]').addEventListener('click', function() {
      document.querySelectorAll('.mx-row').forEach(function(r) { r.classList.remove('expanded'); });
    });

    /* Keyboard navigation */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { search.value = ''; search.dispatchEvent(new Event('input')); search.blur(); return; }
      if (e.key === '/' && document.activeElement !== search) { e.preventDefault(); search.focus(); return; }
      if ((e.key === 'l' || e.key === 'L') && document.activeElement !== search) { toggleLegend(); return; }
      if ((e.key === 'h' || e.key === 'H') && document.activeElement !== search) {
        var ht = document.querySelector('[data-view="heatmap"]');
        (ht.classList.contains('active') ? document.querySelector('[data-view="matrix"]') : ht).click();
        return;
      }
      var rows = Array.from(document.querySelectorAll('.mx-row:not([style*="display: none"])'));
      if (!rows.length) return;
      if (e.key === ']') { e.preventDefault(); focusedRowIdx = Math.min(focusedRowIdx + 1, rows.length - 1); rows[focusedRowIdx].scrollIntoView({ behavior:'smooth', block:'center' }); rows.forEach(function(r) { r.style.outline=''; }); rows[focusedRowIdx].style.outline = '2px solid #3b82f6'; }
      if (e.key === '[') { e.preventDefault(); focusedRowIdx = Math.max(focusedRowIdx - 1, 0); rows[focusedRowIdx].scrollIntoView({ behavior:'smooth', block:'center' }); rows.forEach(function(r) { r.style.outline=''; }); rows[focusedRowIdx].style.outline = '2px solid #3b82f6'; }
      if (e.key === 'Enter' && focusedRowIdx >= 0 && document.activeElement !== search) { e.preventDefault(); rows[focusedRowIdx].classList.toggle('expanded'); }
    });
  }
})();
</script>
</body>
</html>
```

---

## 2. Matrix Row Generation Rules

### Status assignment per row

| Condition | `data-status` |
|-----------|---------------|
| Requirement fully covered in all present documents, no findings | `aligned` |
| Requirement partially covered (some W findings) | `partial` |
| V finding exists for this requirement | `conflict` |
| Only W findings (no coverage at all in one+ doc) | `gap` |
| Row represents a Q finding (scope addition) | `addition` |
| C finding exists (cascade violation) | `cascade` |

### Row ordering

1. **Cascade** (C) first — systemic issue
2. **Conflicts** (V) second — highest priority
3. **Gaps** (W) third
4. **Partial** fourth
5. **Additions** (Q) fifth
6. **Aligned** last

Within each group, order by severity (BLOCKER -> MAJOR -> MINOR), then by FR ID.

### Finding badge placement

- V findings: badge in the **PRD column** (since PRD is always involved)
- N findings: badge in the **PRD column**
- W findings: badge in the **PRD column** (PRD requires, target missing)
- Q findings: badge in the **target document column** (that doc adds scope)
- C findings: badge in the **PRD column** (cascade originates from PRD)
- S findings: badge in the **downstream document column** (where detail was invented)

### Data attributes per row

| Attribute | Value |
|-----------|-------|
| `data-status` | aligned / partial / conflict / gap / addition / cascade |
| `data-severity` | blocker / major / minor (highest finding; omit for aligned) |
| `data-fr` | FR ID(s) for search |
| `data-docs` | Space-separated doc pairs: `prd-ux`, `prd-mock`, `ux-mock`, `prd-ux-mock` |
| `data-keywords` | Space-separated search terms |

### Detail panel content

Every row with findings must have a `.mx-detail` section containing:
- Finding ID + severity + description + doc pair tag (verbatim from reconciliation.md)
- Quote blocks for each involved document (`.mx-detail-quote-prd`, `.mx-detail-quote-ux`, `.mx-detail-quote-mock`)
- For cascade findings: cascade chain visualization (`.mx-detail-cascade`)
- Recommendation block (`.mx-detail-recommendation`)

### Column adaptation

| Mode | Columns | grid-template-columns |
|------|---------|----------------------|
| PRD + UX | PRD, UX | `1fr 1fr` |
| PRD + Mock | PRD, Mock | `1fr 1fr` |
| PRD + UX + Mock | PRD, UX, Mock | `1fr 1fr 1fr` |

Column backgrounds:
- PRD: `#fffbeb` (amber tint)
- UX: `#eff6ff` (blue tint)
- Mock: `#f0fdf4` (green tint)

---

## 3. Heatmap Generation Rules

### Grid structure

- First column (200px): requirement labels with FR ID
- Remaining columns (1fr each): one per document
- PRD column always shows "PRD" as source of truth (amber background)
- Group rows by feature area with `.mx-hm-group` divider rows

### Cell content

| Status | Cell text | Purpose |
|--------|-----------|---------|
| source | `PRD` | PRD column — always source of truth |
| aligned | `OK` | Document covers this requirement |
| partial | Finding ID(s) | Partial coverage |
| conflict | Finding ID(s) | Contradicts PRD |
| gap | Finding ID(s) | Not defined |
| addition | Finding ID(s) | Added without PRD backing |
| na | `N/A` | Requirement doesn't apply to this document |

### Heatmap tooltips

Each cell must have a `title` attribute: `"{DocName}: {Status} {FindingIDs}"`

---

## 4. Pre-Delivery Checklist

### Finding Quality
- [ ] Every finding quotes specific text from source documents
- [ ] Conflict (V) findings cite all involved documents
- [ ] Gap (W) findings cite the PRD requirement and name the missing document
- [ ] Addition (Q) findings cite the element and name the adding document
- [ ] Cascade (C) findings trace through all three documents with quotes
- [ ] Specificity (S) findings identify the invented detail
- [ ] Naming (N) findings list all document terms and context
- [ ] Every finding has a document pair tag
- [ ] Severities are justified and consistent

### IDs & Counts
- [ ] All finding IDs globally unique per prefix
- [ ] Executive summary counts match actual findings
- [ ] Alignment score calculation correct: aligned / (total - N/A) x 100

### reconciliation.md
- [ ] All sections present per report-template.md
- [ ] Sections for non-provided documents are skipped entirely
- [ ] Reconciliation matrix table covers every FR with per-document columns
- [ ] Recommendations organized by severity
- [ ] Document maturity assessment included for each provided document

### reconciliation-matrix.html
- [ ] Opens in browser without errors
- [ ] Mode badge shows correct mode (bilateral/trilateral)
- [ ] Correct number of columns per input mode
- [ ] Alignment gauge score and color match reconciliation.md
- [ ] Per-document gauges show correct coverage percentages
- [ ] Stats bar counts match reconciliation.md
- [ ] Tab switching between Matrix and Heatmap works
- [ ] Search filters rows correctly
- [ ] Status filter buttons work
- [ ] Severity filter buttons work
- [ ] Document pair filter buttons work (trilateral only)
- [ ] Row expand/collapse works (click + Enter key)
- [ ] Expand All / Collapse All buttons work
- [ ] Legend panel opens/closes and shows all 9 finding categories
- [ ] Keyboard navigation works (/, Esc, [, ], Enter, L, H)
- [ ] Row count updates when filters/search applied
- [ ] Finding descriptions verbatim from reconciliation.md
- [ ] Document quotes match source documents
- [ ] Cascade chain visualization correct for C findings
- [ ] Recommendation blocks present for rows with findings
- [ ] Rows ordered by priority
- [ ] Naming drift table appears if N findings exist
- [ ] Heatmap grid has correct column count
- [ ] Heatmap cells have correct status colors
- [ ] Heatmap legend is complete
- [ ] Heatmap group dividers match feature areas

### Excalidraw diagrams
- [ ] All .excalidraw files are valid JSON
- [ ] Coverage heatmap matches reconciliation.md data
- [ ] Venn diagram circle count matches input mode
- [ ] Traceability flow column count matches input mode
- [ ] All diagrams include complete legends
- [ ] Colors match the finding category colors defined in SKILL.md

### Cross-Output Consistency
- [ ] Every finding ID in reconciliation.md exists in reconciliation-matrix.html
- [ ] Finding descriptions character-for-character identical
- [ ] Severity for each finding same in both outputs
- [ ] Status per requirement consistent
- [ ] Heatmap cell statuses match matrix row statuses
- [ ] Excalidraw diagram data matches report data
