# Docs Reconciliation — Template Reference

This file contains the HTML/CSS/JS templates for generated outputs. Loaded on-demand.

---

## 1. Reconciliation Matrix HTML Template (reconciliation-matrix.html)

### Design Principles

1. **Zero-legend interface** — Every element is self-explanatory. Users never need to open a legend or glossary to understand the dashboard. Colors are always paired with plain-language labels.
2. **No codes as primary labels** — Internal finding codes (V1, W3, N2) are never shown as the main label. They appear only as small reference IDs for cross-referencing with the markdown report. The primary label is always the human-readable category name: "Conflict", "Coverage Gap", "Naming Drift", etc.
3. **Progressive disclosure** — Summary first (score + metrics), then requirement list, then expanded detail on click.
4. **Copy-friendly** — Expanded detail panels are fully selectable. Clicking inside them never collapses the card.
5. **Responsive** — Stacks on narrow viewports.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Docs Reconciliation</title>
<style>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    --text-xs: 11px; --text-sm: 12px; --text-md: 14px; --text-lg: 16px; --text-xl: 24px;
    --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px; --sp-5: 20px; --sp-6: 24px; --sp-8: 32px;
    --r-sm: 6px; --r-md: 8px; --r-lg: 12px;
    --n-50: #f8fafc; --n-100: #f1f5f9; --n-200: #e2e8f0; --n-300: #cbd5e1;
    --n-400: #94a3b8; --n-500: #64748b; --n-600: #475569; --n-700: #334155; --n-800: #1e293b; --n-900: #0f172a;
    --c-ok: #22c55e; --c-ok-bg: #dcfce7; --c-ok-t: #15803d;
    --c-warn: #f59e0b; --c-warn-bg: #fef3c7; --c-warn-t: #a16207;
    --c-err: #ef4444; --c-err-bg: #fee2e2; --c-err-t: #dc2626;
    --c-info: #3b82f6; --c-info-bg: #dbeafe; --c-info-t: #2563eb;
    --c-add: #f97316; --c-add-bg: #fff7ed; --c-add-t: #ea580c;
    --c-pink: #ec4899; --c-pink-bg: #fce7f3; --c-pink-t: #db2777;
    --c-violet: #7c3aed; --c-violet-bg: #ede9fe; --c-violet-t: #7c3aed;
    --c-amber: #f59e0b; --c-amber-bg: #fef3c7; --c-amber-t: #b45309;
    --doc-prd: #eab308; --doc-prd-bg: #fffbeb;
    --doc-ux: #3b82f6; --doc-ux-bg: #eff6ff;
    --doc-mock: #22c55e; --doc-mock-bg: #f0fdf4;
  }

  body { font-family: var(--font); background: var(--n-50); color: var(--n-800); line-height: 1.5; -webkit-font-smoothing: antialiased; }
  .wrap { max-width: 1280px; margin: 0 auto; padding: 0 var(--sp-6); }

  /* ===========================================
     HERO
     =========================================== */
  .hero { background: linear-gradient(135deg, var(--n-900), var(--n-800)); color: var(--n-100); padding: var(--sp-8) 0 var(--sp-6); }
  .hero-row { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--sp-4); flex-wrap: wrap; margin-bottom: var(--sp-6); }
  .hero h1 { font-size: var(--text-xl); font-weight: 700; }
  .hero-sub { font-size: var(--text-md); color: var(--n-400); margin-top: var(--sp-1); }
  .hero-badge { display: inline-block; padding: 2px 10px; border-radius: var(--r-sm); font-size: var(--text-xs); font-weight: 600; background: rgba(99,102,241,.25); color: #a5b4fc; margin-left: var(--sp-2); vertical-align: middle; }
  .hero-actions { display: flex; gap: var(--sp-2); }
  .hero-btn { padding: var(--sp-2) var(--sp-3); border: 1px solid rgba(255,255,255,.15); border-radius: var(--r-sm); background: rgba(255,255,255,.06); color: var(--n-300); font-size: var(--text-sm); font-weight: 500; cursor: pointer; transition: all .15s; font-family: var(--font); }
  .hero-btn:hover { background: rgba(255,255,255,.12); color: #fff; }

  /* Score + Metrics */
  .metrics { display: grid; grid-template-columns: auto 1fr; gap: var(--sp-6); align-items: center; }
  .score-ring { width: 88px; height: 88px; position: relative; display: flex; align-items: center; justify-content: center; }
  .score-ring svg { position: absolute; inset: 0; transform: rotate(-90deg); }
  .score-ring-track { fill: none; stroke: rgba(255,255,255,.1); stroke-width: 6; }
  .score-ring-fill { fill: none; stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset .8s ease; }
  .score-ring-value { font-size: var(--text-xl); font-weight: 800; color: #fff; position: relative; z-index: 1; }
  .score-ring-label { position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: var(--text-xs); color: var(--n-400); white-space: nowrap; }
  .mcards { display: flex; gap: var(--sp-3); flex-wrap: wrap; }
  .mcard { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.08); border-radius: var(--r-md); padding: var(--sp-3) var(--sp-4); min-width: 100px; text-align: center; }
  .mcard-v { font-size: var(--text-xl); font-weight: 800; color: #fff; }
  .mcard-l { font-size: var(--text-xs); color: var(--n-400); margin-top: 2px; }
  .mcard-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: var(--sp-1); vertical-align: middle; }
  .doc-bars { display: flex; gap: var(--sp-4); margin-top: var(--sp-5); flex-wrap: wrap; }
  .doc-bar { flex: 1; min-width: 200px; display: flex; align-items: center; gap: var(--sp-3); padding: var(--sp-2) var(--sp-4); background: rgba(255,255,255,.05); border-radius: var(--r-md); }
  .doc-bar-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .doc-bar-name { font-size: var(--text-sm); font-weight: 600; color: var(--n-300); white-space: nowrap; }
  .doc-bar-track { flex: 1; height: 6px; background: rgba(255,255,255,.1); border-radius: 3px; overflow: hidden; }
  .doc-bar-fill { height: 100%; border-radius: 3px; transition: width .6s ease; }
  .doc-bar-pct { font-size: var(--text-md); font-weight: 700; color: #fff; min-width: 40px; text-align: right; }

  /* ===========================================
     VIEW SWITCHER (prominent, not subtle tabs)
     =========================================== */
  .view-switch { display: flex; gap: var(--sp-2); padding: var(--sp-4) 0; background: #fff; border-bottom: 1px solid var(--n-200); }
  .view-btn {
    flex: 1; max-width: 280px; padding: var(--sp-3) var(--sp-4);
    border: 2px solid var(--n-200); border-radius: var(--r-md);
    background: #fff; cursor: pointer; transition: all .15s;
    font-family: var(--font); text-align: left;
  }
  .view-btn:hover { border-color: var(--n-300); background: var(--n-50); }
  .view-btn.active { border-color: var(--c-info); background: var(--c-info-bg); }
  .view-btn-title { font-size: var(--text-md); font-weight: 700; color: var(--n-800); display: flex; align-items: center; gap: var(--sp-2); }
  .view-btn-title .badge { font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 10px; background: var(--n-100); color: var(--n-500); }
  .view-btn.active .view-btn-title .badge { background: var(--c-info); color: #fff; }
  .view-btn-desc { font-size: var(--text-xs); color: var(--n-500); margin-top: 2px; }

  /* ===========================================
     TOOLBAR (sticky)
     =========================================== */
  .toolbar { position: sticky; top: 0; z-index: 90; background: #fff; border-bottom: 1px solid var(--n-200); box-shadow: 0 1px 3px rgba(0,0,0,.05); }
  .toolbar-inner { display: flex; align-items: center; gap: var(--sp-3); padding: var(--sp-3) 0; flex-wrap: wrap; }
  .toolbar-search {
    padding: var(--sp-2) var(--sp-3) var(--sp-2) 34px;
    border: 1px solid var(--n-300); border-radius: var(--r-sm);
    font-size: var(--text-sm); width: 240px; outline: none; font-family: var(--font);
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E") 10px center no-repeat;
  }
  .toolbar-search:focus { border-color: var(--c-info); box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
  .toolbar-sep { width: 1px; height: 20px; background: var(--n-200); }
  .pill-group { display: flex; gap: 2px; background: var(--n-100); border-radius: var(--r-sm); padding: 2px; }
  .pill { padding: var(--sp-1) var(--sp-3); border: none; border-radius: var(--r-sm); background: transparent; font-size: var(--text-xs); font-weight: 600; cursor: pointer; transition: all .15s; color: var(--n-500); font-family: var(--font); white-space: nowrap; }
  .pill:hover { background: rgba(255,255,255,.7); color: var(--n-700); }
  .pill.active { background: #fff; color: var(--n-900); box-shadow: 0 1px 2px rgba(0,0,0,.06); }
  .fbtn { padding: var(--sp-1) var(--sp-2); border: 1px solid var(--n-200); border-radius: var(--r-sm); background: #fff; font-size: var(--text-xs); font-weight: 600; cursor: pointer; transition: all .15s; color: var(--n-500); font-family: var(--font); white-space: nowrap; }
  .fbtn:hover { border-color: var(--n-400); color: var(--n-700); }
  .fbtn.active { border-color: var(--n-800); color: var(--n-900); background: var(--n-50); }
  .toolbar-count { font-size: var(--text-sm); color: var(--n-400); margin-left: auto; white-space: nowrap; }

  /* ===========================================
     VIEWS
     =========================================== */
  .view { display: none; }
  .view.active { display: block; }
  .view-body { padding: var(--sp-6) 0 var(--sp-8); }

  /* ===========================================
     REQUIREMENT CARDS
     =========================================== */
  .card { background: #fff; border: 1px solid var(--n-200); border-radius: var(--r-lg); margin-bottom: var(--sp-3); overflow: hidden; transition: box-shadow .15s; position: relative; }
  .card:hover { box-shadow: 0 2px 8px rgba(0,0,0,.05); }
  .card[data-status="aligned"] { border-left: 4px solid var(--c-ok); }
  .card[data-status="partial"] { border-left: 4px solid var(--c-warn); }
  .card[data-status="conflict"] { border-left: 4px solid var(--c-err); }
  .card[data-status="gap"] { border-left: 4px solid var(--c-info); }
  .card[data-status="addition"] { border-left: 4px solid var(--c-add); }
  .card[data-status="cascade"] { border-left: 4px solid var(--c-pink); }

  .card-head { padding: var(--sp-4) var(--sp-5); cursor: pointer; display: flex; align-items: flex-start; gap: var(--sp-4); }
  .card-head:hover { background: var(--n-50); }
  .card-main { flex: 1; min-width: 0; }
  .card-top { display: flex; align-items: center; gap: var(--sp-2); margin-bottom: var(--sp-1); flex-wrap: wrap; }
  .status-label { display: inline-block; padding: 2px 10px; border-radius: var(--r-sm); font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; }
  .status-aligned { background: var(--c-ok-bg); color: var(--c-ok-t); }
  .status-partial { background: var(--c-warn-bg); color: var(--c-warn-t); }
  .status-conflict { background: var(--c-err-bg); color: var(--c-err-t); }
  .status-gap { background: var(--c-info-bg); color: var(--c-info-t); }
  .status-addition { background: var(--c-add-bg); color: var(--c-add-t); }
  .status-cascade { background: var(--c-pink-bg); color: var(--c-pink-t); }
  .card-id { font-size: var(--text-sm); font-weight: 600; color: var(--n-500); font-family: monospace; }
  .card-title { font-size: var(--text-md); font-weight: 600; color: var(--n-800); }
  .card-desc { font-size: var(--text-sm); color: var(--n-600); margin-top: 2px; }
  .card-tags { display: flex; gap: var(--sp-2); flex-wrap: wrap; margin-top: var(--sp-2); }

  /* Finding tag: shows CATEGORY NAME as primary, code as tiny ref */
  .ftag { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: var(--r-sm); font-size: var(--text-xs); font-weight: 700; line-height: 1.3; }
  .ftag-ref { font-size: 9px; font-weight: 600; opacity: .5; font-family: monospace; }
  .ftag-conflict { background: var(--c-err-bg); color: var(--c-err-t); }
  .ftag-naming { background: var(--c-violet-bg); color: var(--c-violet-t); }
  .ftag-gap { background: var(--c-info-bg); color: var(--c-info-t); }
  .ftag-addition { background: var(--c-add-bg); color: var(--c-add-t); }
  .ftag-cascade { background: var(--c-pink-bg); color: var(--c-pink-t); }
  .ftag-specificity { background: var(--c-amber-bg); color: var(--c-amber-t); }
  .sev { font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 3px; text-transform: uppercase; color: #fff; }
  .sev-blocker { background: #dc2626; }
  .sev-major { background: #f59e0b; }
  .sev-minor { background: #6b7280; }
  .dtag { font-size: 10px; font-weight: 600; padding: 1px 6px; border-radius: 3px; background: var(--n-100); color: var(--n-500); }

  .card-arrow { width: 28px; height: 28px; border-radius: var(--r-sm); background: var(--n-100); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; transition: all .15s; }
  .card-arrow svg { width: 14px; height: 14px; transition: transform .2s; color: var(--n-400); }
  .card.expanded .card-arrow svg { transform: rotate(180deg); }
  .card.expanded .card-arrow { background: var(--n-200); }

  /* Document columns */
  .card-docs { display: none; border-top: 1px solid var(--n-200); }
  .card.expanded .card-docs { display: grid; }
  .card-doc { padding: var(--sp-4) var(--sp-5); border-right: 1px solid var(--n-200); }
  .card-doc:last-child { border-right: none; }
  .card-doc-prd { background: var(--doc-prd-bg); }
  .card-doc-ux { background: var(--doc-ux-bg); }
  .card-doc-mock { background: var(--doc-mock-bg); }
  .card-doc-label { font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--n-500); margin-bottom: var(--sp-2); display: flex; align-items: center; gap: var(--sp-2); }
  .card-doc-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .card-doc-text { font-size: var(--text-sm); color: var(--n-700); line-height: 1.6; }
  .card-doc-empty { font-size: var(--text-sm); color: var(--n-400); font-style: italic; }

  /* Findings detail (copy-safe) */
  .card-detail { display: none; border-top: 1px solid var(--n-200); padding: var(--sp-4) var(--sp-5); background: var(--n-50); cursor: auto; user-select: text; -webkit-user-select: text; }
  .card.expanded .card-detail { display: block; }
  .fcard { background: #fff; border: 1px solid var(--n-200); border-radius: var(--r-md); padding: var(--sp-4); margin-bottom: var(--sp-3); }
  .fcard:last-child { margin-bottom: 0; }
  .fcard-head { display: flex; align-items: center; gap: var(--sp-2); flex-wrap: wrap; margin-bottom: var(--sp-3); }
  .fcard-desc { font-size: var(--text-sm); color: var(--n-700); line-height: 1.6; margin-bottom: var(--sp-3); }
  .fcard-quote { padding: var(--sp-3) var(--sp-4); border-left: 3px solid; margin: var(--sp-2) 0; font-size: var(--text-sm); border-radius: 0 var(--r-sm) var(--r-sm) 0; line-height: 1.6; user-select: text; }
  .fcard-quote-prd { border-color: var(--doc-prd); background: #fffef5; }
  .fcard-quote-ux { border-color: var(--doc-ux); background: #f8fbff; }
  .fcard-quote-mock { border-color: var(--doc-mock); background: #f5fef7; }
  .fcard-quote-label { font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; color: var(--n-500); margin-bottom: var(--sp-1); }
  .fcard-cascade { padding: var(--sp-3) var(--sp-4); background: var(--c-pink-bg); border: 1px solid #fbcfe8; border-radius: var(--r-md); margin: var(--sp-3) 0; }
  .fcard-cascade-title { font-size: var(--text-xs); font-weight: 700; color: var(--c-pink-t); margin-bottom: var(--sp-2); }
  .fcard-cascade-chain { display: flex; align-items: center; gap: var(--sp-2); flex-wrap: wrap; }
  .fcard-cascade-step { padding: var(--sp-1) var(--sp-3); border-radius: var(--r-sm); font-weight: 600; font-size: var(--text-xs); }
  .fcard-cascade-arrow { color: var(--c-pink-t); font-weight: 700; }
  .fcard-rec { margin-top: var(--sp-3); padding: var(--sp-3) var(--sp-4); background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--r-md); font-size: var(--text-sm); color: #166534; }
  .fcard-rec b { font-size: var(--text-xs); text-transform: uppercase; letter-spacing: .03em; }

  /* ===========================================
     NAMING DRIFT
     =========================================== */
  .naming { background: #fff; border: 1px solid var(--n-200); border-radius: var(--r-lg); overflow: hidden; margin-bottom: var(--sp-6); }
  .naming-head { padding: var(--sp-3) var(--sp-5); background: var(--c-violet-bg); font-size: var(--text-sm); font-weight: 700; color: var(--c-violet-t); }
  .naming table { width: 100%; font-size: var(--text-sm); border-collapse: collapse; }
  .naming th { padding: var(--sp-2) var(--sp-4); text-align: left; font-weight: 600; background: var(--n-50); color: var(--n-600); white-space: nowrap; }
  .naming td { padding: var(--sp-2) var(--sp-4); color: var(--n-700); vertical-align: top; }
  .naming tr:not(:last-child) td { border-bottom: 1px solid var(--n-100); }

  /* ===========================================
     HEATMAP
     =========================================== */
  .hm-title { font-size: var(--text-lg); font-weight: 700; margin-bottom: var(--sp-4); }
  .hm-desc { font-size: var(--text-sm); color: var(--n-500); margin-bottom: var(--sp-4); }
  .hm-grid { display: grid; gap: 2px; background: var(--n-200); border: 1px solid var(--n-200); border-radius: var(--r-md); overflow: hidden; }
  .hm-h { background: var(--n-900); color: var(--n-100); font-size: var(--text-sm); font-weight: 700; padding: var(--sp-3) var(--sp-4); text-align: center; }
  .hm-h-corner { text-align: left; }
  .hm-label { background: #fff; font-size: var(--text-sm); font-weight: 600; padding: var(--sp-2) var(--sp-4); color: var(--n-800); display: flex; align-items: center; gap: var(--sp-2); border-right: 1px solid var(--n-200); }
  .hm-label-id { font-size: 10px; font-weight: 700; color: var(--n-500); font-family: monospace; }
  .hm-cell { padding: var(--sp-2) var(--sp-1); text-align: center; font-size: var(--text-xs); font-weight: 600; }
  .hm-cell[data-s="ok"] { background: var(--c-ok-bg); color: var(--c-ok-t); }
  .hm-cell[data-s="partial"] { background: var(--c-warn-bg); color: var(--c-warn-t); }
  .hm-cell[data-s="conflict"] { background: var(--c-err-bg); color: var(--c-err-t); }
  .hm-cell[data-s="gap"] { background: var(--c-info-bg); color: var(--c-info-t); }
  .hm-cell[data-s="addition"] { background: var(--c-add-bg); color: var(--c-add-t); }
  .hm-cell[data-s="na"] { background: var(--n-100); color: var(--n-400); }
  .hm-cell[data-s="src"] { background: var(--c-warn-bg); color: #92400e; }
  .hm-group { grid-column: 1 / -1; background: var(--n-100); padding: var(--sp-2) var(--sp-4); font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--n-600); }
  .hm-legend { display: flex; gap: var(--sp-4); padding: var(--sp-3) 0; margin-top: var(--sp-3); flex-wrap: wrap; }
  .hm-legend-i { display: flex; align-items: center; gap: var(--sp-2); font-size: var(--text-sm); color: var(--n-600); }
  .hm-legend-sw { width: 16px; height: 16px; border-radius: 3px; flex-shrink: 0; }

  /* ===========================================
     STATES / FOOTER
     =========================================== */
  .state { text-align: center; padding: var(--sp-8); }
  .state p { font-size: var(--text-md); }
  .state .sub { font-size: var(--text-sm); color: var(--n-400); margin-top: var(--sp-2); }
  .footer { text-align: center; padding: var(--sp-6); font-size: var(--text-sm); color: var(--n-400); border-top: 1px solid var(--n-200); }

  @media (max-width: 768px) {
    .wrap { padding: 0 var(--sp-4); }
    .hero { padding: var(--sp-5) 0; }
    .metrics { grid-template-columns: 1fr; }
    .score-ring { margin: 0 auto; }
    .mcards { justify-content: center; }
    .doc-bars { flex-direction: column; }
    .toolbar-search { width: 100%; order: -1; }
    .card-docs { grid-template-columns: 1fr !important; }
    .card-doc { border-right: none; border-bottom: 1px solid var(--n-200); }
    .card-doc:last-child { border-bottom: none; }
    .view-switch { flex-direction: column; }
    .view-btn { max-width: none; }
  }
</style>
</head>
<body>

<!-- HERO -->
<div class="hero"><div class="wrap">
  <div class="hero-row">
    <div><h1 id="h-title">Docs Reconciliation</h1><div class="hero-sub" id="h-sub"></div></div>
    <div class="hero-actions">
      <button class="hero-btn" data-action="expand-all">Expand All</button>
      <button class="hero-btn" data-action="collapse-all">Collapse All</button>
    </div>
  </div>
  <div class="metrics">
    <div class="score-ring"><svg viewBox="0 0 88 88"><circle class="score-ring-track" cx="44" cy="44" r="38"/><circle class="score-ring-fill" id="arc" cx="44" cy="44" r="38"/></svg><span class="score-ring-value" id="score-v">0%</span><span class="score-ring-label">Overall Alignment</span></div>
    <div class="mcards" id="mcards"></div>
  </div>
  <div class="doc-bars" id="doc-bars"></div>
</div></div>

<!-- VIEW SWITCHER -->
<div class="toolbar" style="position:relative;z-index:89;">
<div class="wrap">
  <div class="view-switch" id="view-switch">
    <button class="view-btn active" data-view="matrix">
      <div class="view-btn-title">Requirements <span class="badge" id="vc-matrix"></span></div>
      <div class="view-btn-desc">Detailed requirement-by-requirement comparison across documents</div>
    </button>
    <button class="view-btn" data-view="heatmap">
      <div class="view-btn-title">Coverage Map</div>
      <div class="view-btn-desc">Visual grid showing which requirements are covered in each document</div>
    </button>
  </div>
</div>
</div>

<!-- TOOLBAR -->
<div class="toolbar"><div class="wrap">
  <div class="toolbar-inner">
    <input type="text" class="toolbar-search" placeholder="Search requirements..." data-action="search">
    <div class="pill-group" id="pills">
      <button class="pill active" data-filter="all">All</button>
      <button class="pill" data-filter="conflict">Conflicts</button>
      <button class="pill" data-filter="gap">Gaps</button>
      <button class="pill" data-filter="partial">Partial</button>
      <button class="pill" data-filter="addition">Additions</button>
      <button class="pill" data-filter="aligned">Aligned</button>
    </div>
    <div class="toolbar-sep"></div>
    <button class="fbtn active" data-severity="all">All Severity</button>
    <button class="fbtn" data-severity="blocker">Blockers</button>
    <button class="fbtn" data-severity="major">Major</button>
    <button class="fbtn" data-severity="minor">Minor</button>
    <span class="toolbar-count" id="row-count"></span>
  </div>
</div></div>

<!-- MATRIX VIEW -->
<div class="view active" id="view-matrix"><div class="wrap"><div class="view-body">
  <div id="naming-box"></div>
  <div id="matrix"></div>
</div></div></div>

<!-- HEATMAP VIEW -->
<div class="view" id="view-heatmap"><div class="wrap"><div class="view-body">
  <div class="hm-title">Coverage Map</div>
  <div class="hm-desc">Each cell shows whether a document covers that requirement. Colors indicate alignment status. No codes or abbreviations &mdash; just plain status.</div>
  <div id="hm-grid"></div>
  <div class="hm-legend">
    <div class="hm-legend-i"><div class="hm-legend-sw" style="background:var(--c-warn-bg);"></div> Source (PRD)</div>
    <div class="hm-legend-i"><div class="hm-legend-sw" style="background:var(--c-ok-bg);"></div> Aligned</div>
    <div class="hm-legend-i"><div class="hm-legend-sw" style="background:var(--c-warn-bg);border:1px solid #fde68a;"></div> Partial</div>
    <div class="hm-legend-i"><div class="hm-legend-sw" style="background:var(--c-err-bg);"></div> Conflict</div>
    <div class="hm-legend-i"><div class="hm-legend-sw" style="background:var(--c-info-bg);"></div> Gap (Missing)</div>
    <div class="hm-legend-i"><div class="hm-legend-sw" style="background:var(--c-add-bg);"></div> Addition</div>
    <div class="hm-legend-i"><div class="hm-legend-sw" style="background:var(--n-100);"></div> Not Applicable</div>
  </div>
</div></div></div>

<!-- LOADING / ERROR -->
<div id="ld" class="state"><p>Loading reconciliation data&hellip;</p></div>
<div id="err" class="state" style="display:none;"><p style="color:var(--c-err);">Failed to load data</p><p class="sub">Ensure reconciliation-data.json is in the same folder as this file.</p></div>

<div class="footer" id="foot">Docs Reconciliation</div>

<script>
(function(){
  var D=null;

  /* Human-readable names — these are the PRIMARY labels shown to users */
  var NAME={V:'Conflict',N:'Naming Drift',W:'Coverage Gap',Q:'Scope Addition',C:'Cascade',S:'Specificity Gap',D:'PRD Issue',E:'UX Issue',M:'Mock Issue'};
  var FCLS={V:'ftag-conflict',N:'ftag-naming',W:'ftag-gap',Q:'ftag-addition',C:'ftag-cascade',S:'ftag-specificity'};
  var SL={aligned:'Aligned',partial:'Partial',conflict:'Conflict',gap:'Gap',addition:'Addition',cascade:'Cascade',na:'N/A',source:'Source'};
  var SO=['cascade','conflict','gap','partial','addition','aligned'];
  var SORD={blocker:0,major:1,minor:2};
  var DCLS={prd:'card-doc-prd',ux:'card-doc-ux',mock:'card-doc-mock'};
  var DQCLS={prd:'fcard-quote-prd',ux:'fcard-quote-ux',mock:'fcard-quote-mock'};
  var DQVERB={prd:'PRD states',ux:'UX defines',mock:'Mock shows'};

  /* Heatmap status labels — plain language, NO codes */
  var HM_LABEL={aligned:'Aligned',partial:'Partial',conflict:'Conflict',gap:'Missing',addition:'Added',na:'N/A',source:'Defined'};
  var HM_DS={aligned:'ok',partial:'partial',conflict:'conflict',gap:'gap',addition:'addition',na:'na',source:'src'};

  function friendly(t){if(!t)return'';return t.replace('[PRD<>UX]','PRD vs UX').replace('[PRD<>Mock]','PRD vs Mock').replace('[UX<>Mock]','UX vs Mock').replace('[PRD>UX>Mock]','PRD \u2192 UX \u2192 Mock');}
  function esc(s){var e=document.createElement('span');e.textContent=s||'';return e.innerHTML;}
  function dkeys(d){var k=['prd'];if(d.meta.documents.ux&&d.meta.documents.ux.name)k.push('ux');if(d.meta.documents.mock&&d.meta.documents.mock.name)k.push('mock');return k;}
  function dname(d,k){return k==='prd'?'PRD':(d.meta.documents[k]?d.meta.documents[k].name:k);}
  function dcolor(d,k){return k==='prd'?'var(--doc-prd)':(d.meta.documents[k]?d.meta.documents[k].color:'#999');}

  fetch('./reconciliation-data.json').then(function(r){return r.json();}).then(function(data){D=data;document.getElementById('ld').style.display='none';render(data);}).catch(function(e){document.getElementById('ld').style.display='none';document.getElementById('err').style.display='block';console.error(e);});

  function render(d){
    var keys=dkeys(d);
    document.getElementById('h-title').innerHTML=esc(d.meta.title)+'<span class="hero-badge">'+esc(d.meta.mode)+'</span>';
    document.getElementById('h-sub').textContent=d.meta.date+' \u2014 '+keys.map(function(k){return dname(d,k);}).join(', ');

    /* Score ring */
    var s=d.scores.overallAlignment,c=2*Math.PI*38,arc=document.getElementById('arc');
    arc.setAttribute('stroke-dasharray',c);arc.setAttribute('stroke-dashoffset',c-(c*s/100));
    arc.style.stroke=s>=80?'var(--c-ok)':s>=50?'var(--c-warn)':'var(--c-err)';
    document.getElementById('score-v').textContent=s+'%';

    /* Metric cards */
    var mc=document.getElementById('mcards');
    var items=[{v:d.stats.totalRequirements,l:'Requirements',c:''},{v:d.stats.byStatus.aligned||0,l:'Aligned',c:'var(--c-ok)'},{v:d.stats.byStatus.conflict||0,l:'Conflicts',c:'var(--c-err)'},{v:d.stats.byStatus.gap||0,l:'Gaps',c:'var(--c-info)'},{v:d.stats.byStatus.addition||0,l:'Additions',c:'var(--c-add)'}];
    if(d.meta.mode==='trilateral')items.push({v:d.stats.byStatus.cascade||0,l:'Cascades',c:'var(--c-pink)'});
    mc.innerHTML=items.map(function(i){return '<div class="mcard"><div class="mcard-v">'+i.v+'</div><div class="mcard-l">'+(i.c?'<span class="mcard-dot" style="background:'+i.c+'"></span>':'')+i.l+'</div></div>';}).join('');

    /* Doc bars */
    var db=document.getElementById('doc-bars');
    db.innerHTML=keys.filter(function(k){return k!=='prd';}).map(function(k){var cv=d.scores.perDocument[k];if(cv===null||cv===undefined)return'';return '<div class="doc-bar"><div class="doc-bar-dot" style="background:'+dcolor(d,k)+'"></div><span class="doc-bar-name">'+esc(dname(d,k))+' Coverage</span><div class="doc-bar-track"><div class="doc-bar-fill" style="width:'+cv+'%;background:'+dcolor(d,k)+'"></div></div><span class="doc-bar-pct">'+cv+'%</span></div>';}).join('');

    document.getElementById('vc-matrix').textContent=d.stats.totalFindings;

    /* Doc pair filters */
    if(d.meta.mode==='trilateral'){var si=document.querySelectorAll('.toolbar-sep');var ls=si[si.length-1];['All Pairs','PRD vs UX','PRD vs Mock','UX vs Mock'].forEach(function(l,i){var b=document.createElement('button');b.className='fbtn dpbtn'+(i===0?' active':'');b.dataset.docs=['all','prd-ux','prd-mock','ux-mock'][i];b.textContent=l;ls.parentNode.insertBefore(b,ls);});var ns=document.createElement('div');ns.className='toolbar-sep';ls.parentNode.insertBefore(ns,ls);}

    if(d.namingDrift&&d.namingDrift.length)renderNaming(d,keys);
    renderHeatmap(d,keys);
    renderMatrix(d,keys);
    document.getElementById('foot').textContent='Docs Reconciliation \u2014 '+d.meta.date+' \u2014 '+d.meta.mode;
    initControls();
  }

  /* --- Naming Drift --- */
  function renderNaming(d,keys){
    var c=document.getElementById('naming-box');
    var h='<div class="naming"><div class="naming-head">Naming Drift &mdash; These concepts are called different things in different documents</div><table><thead><tr><th>Concept</th><th>PRD Term</th>';
    if(keys.indexOf('ux')!==-1)h+='<th>UX Term</th>';
    if(keys.indexOf('mock')!==-1)h+='<th>Mock Term</th>';
    h+='<th>Between</th><th>Severity</th></tr></thead><tbody>';
    d.namingDrift.forEach(function(n){
      h+='<tr><td>'+esc(n.context)+'</td>';
      h+='<td>\u201c'+esc(n.terms.prd)+'\u201d</td>';
      if(keys.indexOf('ux')!==-1)h+='<td>'+(n.terms.ux?'\u201c'+esc(n.terms.ux)+'\u201d':'\u2014')+'</td>';
      if(keys.indexOf('mock')!==-1)h+='<td>'+(n.terms.mock?'\u201c'+esc(n.terms.mock)+'\u201d':'\u2014')+'</td>';
      h+='<td><span class="dtag">'+esc(friendly(n.docsTag))+'</span></td>';
      h+='<td><span class="sev sev-'+n.severity+'">'+n.severity.toUpperCase()+'</span></td></tr>';
    });
    h+='</tbody></table></div>';
    c.innerHTML=h;
  }

  /* --- Heatmap: ONLY plain-language status words, no finding IDs --- */
  function renderHeatmap(d,keys){
    var c=document.getElementById('hm-grid');
    var cols='200px'+keys.map(function(){return ' 1fr';}).join('');
    var h='<div class="hm-grid" style="grid-template-columns:'+cols+';">';
    h+='<div class="hm-h hm-h-corner">Requirement</div>';
    keys.forEach(function(k){h+='<div class="hm-h">'+esc(k==='prd'?'PRD (Source of Truth)':dname(d,k))+'</div>';});
    var gm={};(d.groups||[]).forEach(function(g){g.requirementIds.forEach(function(id){gm[id]=g;});});
    var lg=null;
    sortR(d.requirements).forEach(function(req){
      var g=gm[req.id];
      if(g&&g.id!==lg){h+='<div class="hm-group">'+esc(g.name)+'</div>';lg=g.id;}
      h+='<div class="hm-label"><span class="hm-label-id">'+esc(req.id)+'</span> '+esc(req.title)+'</div>';
      keys.forEach(function(k){
        if(k==='prd'){h+='<div class="hm-cell" data-s="src" title="'+esc(req.title)+': Defined in PRD (source of truth)">Defined</div>';return;}
        var pd=req.perDocument[k];var st=pd?pd.status:'na';if(!st||st==='null')st='na';
        var label=HM_LABEL[st]||st;
        var ds=HM_DS[st]||'na';
        h+='<div class="hm-cell" data-s="'+ds+'" title="'+esc(dname(d,k)+': '+label)+'">'+label+'</div>';
      });
    });
    h+='</div>';c.innerHTML=h;
  }

  /* --- Matrix --- */
  function renderMatrix(d,keys){
    var fm={};d.findings.forEach(function(f){fm[f.id]=f;});
    var gc=keys.map(function(){return '1fr';}).join(' ');
    var h='';
    sortR(d.requirements).forEach(function(req){
      var st=req.overallStatus,sv=hiSev(req,fm),dp=docP(req,fm);
      h+='<div class="card" data-status="'+st+'"'+(sv?' data-severity="'+sv+'':'')+' data-fr="'+esc(req.id)+'" data-docs="'+dp+'" data-keywords="'+esc(req.keywords||'')+'">';

      /* Header */
      h+='<div class="card-head"><div class="card-main"><div class="card-top"><span class="status-label status-'+st+'">'+(SL[st]||st)+'</span><span class="card-id">'+esc(req.id)+'</span></div>';
      h+='<div class="card-title">'+esc(req.title)+'</div>';
      var pp=req.perDocument.prd;h+='<div class="card-desc">'+esc(pp?pp.summary:req.description)+'</div>';
      if(req.findingIds&&req.findingIds.length){
        h+='<div class="card-tags">';
        req.findingIds.forEach(function(fid){
          var f=fm[fid];if(!f)return;
          /* PRIMARY = human name, secondary = tiny ref code */
          h+='<span class="ftag '+(FCLS[f.code]||'')+'">'+(NAME[f.code]||f.code)+' <span class="ftag-ref">'+fid+'</span></span>';
          h+='<span class="sev sev-'+f.severity+'">'+f.severity.toUpperCase()+'</span>';
        });
        h+='</div>';
      }
      h+='</div>';
      h+='<div class="card-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg></div>';
      h+='</div>';

      /* Doc columns */
      h+='<div class="card-docs" style="grid-template-columns:'+gc+';">';
      keys.forEach(function(k){
        var cls=DCLS[k]||'';var pd=req.perDocument[k];
        h+='<div class="card-doc '+cls+'">';
        h+='<div class="card-doc-label"><span class="card-doc-dot" style="background:'+dcolor(d,k)+'"></span> '+esc(dname(d,k))+'</div>';
        if(k==='prd'){h+='<div class="card-doc-text">'+esc(pd?pd.summary:req.description)+'</div>';}
        else if(pd&&pd.summary){
          h+='<div class="card-doc-text">'+esc(pd.summary)+'</div>';
          var sat=(pd.findingIds||[]).filter(function(fid){var f=fm[fid];return f&&'QS'.indexOf(f.code)!==-1;});
          if(sat.length){h+='<div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap;">';sat.forEach(function(fid){var f=fm[fid];h+='<span class="ftag '+(FCLS[f.code]||'')+'">'+(NAME[f.code]||f.code)+' <span class="ftag-ref">'+fid+'</span></span>';});h+='</div>';}
        } else {h+='<div class="card-doc-empty">'+(st==='addition'?'Not required by PRD':'Not covered in this document')+'</div>';}
        h+='</div>';
      });
      h+='</div>';

      /* Finding details (copy-safe) */
      if(req.findingIds&&req.findingIds.length){
        h+='<div class="card-detail">';
        req.findingIds.forEach(function(fid){
          var f=fm[fid];if(!f)return;
          h+='<div class="fcard"><div class="fcard-head">';
          h+='<span class="ftag '+(FCLS[f.code]||'')+'" style="margin:0">'+(NAME[f.code]||f.code)+' <span class="ftag-ref">'+fid+'</span></span>';
          h+='<span class="sev sev-'+f.severity+'">'+f.severity.toUpperCase()+'</span>';
          h+='<span class="dtag">'+esc(friendly(f.docsTag))+'</span>';
          h+='</div>';
          h+='<div class="fcard-desc">'+esc(f.description)+'</div>';
          if(f.code==='C'){var cas=d.cascades.find(function(c){return c.findingId===fid;});if(cas){h+='<div class="fcard-cascade"><div class="fcard-cascade-title">How this drifted across documents:</div><div class="fcard-cascade-chain"><span class="fcard-cascade-step" style="background:var(--doc-prd-bg);color:#92400e;">PRD: \u201c'+esc(cas.chain.prd)+'\u201d</span><span class="fcard-cascade-arrow">\u2192</span><span class="fcard-cascade-step" style="background:var(--doc-ux-bg);color:#1d4ed8;">UX: \u201c'+esc(cas.chain.ux)+'\u201d</span><span class="fcard-cascade-arrow">\u2192</span><span class="fcard-cascade-step" style="background:var(--doc-mock-bg);color:#166534;">Mock: \u201c'+esc(cas.chain.mock)+'\u201d</span></div></div>';}}
          ['prd','ux','mock'].forEach(function(dk){if(f.quotes&&f.quotes[dk]){h+='<div class="fcard-quote '+(DQCLS[dk]||'')+'"><div class="fcard-quote-label">'+(DQVERB[dk]||dk)+':</div>\u201c'+esc(f.quotes[dk])+'\u201d</div>';}});
          h+='<div class="fcard-rec"><b>Recommendation:</b> '+esc(f.recommendation)+'</div>';
          h+='</div>';
        });
        h+='</div>';
      }
      h+='</div>';
    });
    document.getElementById('matrix').innerHTML=h;
  }

  function sortR(r){return r.slice().sort(function(a,b){var sa=SO.indexOf(a.overallStatus),sb=SO.indexOf(b.overallStatus);if(sa===-1)sa=99;if(sb===-1)sb=99;return sa-sb;});}
  function hiSev(r,fm){var b=null;(r.findingIds||[]).forEach(function(f){var x=fm[f];if(!x)return;if(!b||(SORD[x.severity]||99)<(SORD[b]||99))b=x.severity;});return b;}
  function docP(r,fm){var p={};(r.findingIds||[]).forEach(function(f){var x=fm[f];if(!x)return;var t=x.docsTag.replace(/[\[\]>]/g,'').toLowerCase().replace(/\s/g,'');t.split(',').forEach(function(v){p[v]=true;});});return Object.keys(p).join(' ');}

  /* =====================================================
     CONTROLS
     ===================================================== */
  function initControls(){
    var aS='all',aV='all',aD='all';
    var pills=document.querySelectorAll('#pills .pill');
    var sevs=document.querySelectorAll('.fbtn[data-severity]');
    var searchEl=document.querySelector('[data-action="search"]');
    var rcEl=document.getElementById('row-count');

    function cnt(){var v=document.querySelectorAll('.card:not([style*="display: none"])').length,t=document.querySelectorAll('.card').length;rcEl.textContent=v===t?t+' requirements':v+' of '+t;}
    cnt();

    function apply(){document.querySelectorAll('.card').forEach(function(c){var sm=aS==='all'||c.dataset.status===aS;var sv=aV==='all'||c.dataset.severity===aV||(!c.dataset.severity&&aV==='all');var dm=aD==='all'||(c.dataset.docs&&c.dataset.docs.indexOf(aD)!==-1);c.style.display=sm&&sv&&dm?'':'none';});cnt();}

    pills.forEach(function(p){p.addEventListener('click',function(){pills.forEach(function(x){x.classList.remove('active');});p.classList.add('active');aS=p.dataset.filter;apply();});});
    sevs.forEach(function(b){b.addEventListener('click',function(){sevs.forEach(function(x){x.classList.remove('active');});b.classList.add('active');aV=b.dataset.severity;apply();});});
    document.querySelectorAll('.dpbtn').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.dpbtn').forEach(function(x){x.classList.remove('active');});b.classList.add('active');aD=b.dataset.docs;apply();});});

    /* Card expand — ONLY from header, never from detail */
    document.getElementById('matrix').addEventListener('click',function(e){
      if(e.target.closest('.card-detail'))return;
      if(window.getSelection&&window.getSelection().toString().length>0)return;
      var hd=e.target.closest('.card-head');if(!hd)return;
      var card=hd.closest('.card');if(card)card.classList.toggle('expanded');
    });

    searchEl.addEventListener('input',function(){var q=searchEl.value.toLowerCase();document.querySelectorAll('.card').forEach(function(c){var t=(c.dataset.fr+' '+c.dataset.keywords+' '+c.dataset.docs+' '+c.textContent).toLowerCase();c.style.display=t.indexOf(q)!==-1?'':'none';});if(!q){aS='all';apply();pills.forEach(function(p){p.classList.remove('active');});pills[0].classList.add('active');}cnt();});

    /* View switcher */
    var vbs=document.querySelectorAll('.view-btn');var vs=document.querySelectorAll('.view');
    vbs.forEach(function(b){b.addEventListener('click',function(){vbs.forEach(function(x){x.classList.remove('active');});b.classList.add('active');vs.forEach(function(v){v.classList.remove('active');});var t=document.getElementById('view-'+b.dataset.view);if(t)t.classList.add('active');});});

    document.querySelector('[data-action="expand-all"]').addEventListener('click',function(){document.querySelectorAll('.card').forEach(function(c){c.classList.add('expanded');});});
    document.querySelector('[data-action="collapse-all"]').addEventListener('click',function(){document.querySelectorAll('.card').forEach(function(c){c.classList.remove('expanded');});});

    /* Keyboard */
    var fi=-1;
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){searchEl.value='';searchEl.dispatchEvent(new Event('input'));searchEl.blur();return;}
      if(e.key==='/'&&document.activeElement!==searchEl){e.preventDefault();searchEl.focus();return;}
      if((e.key==='h'||e.key==='H')&&document.activeElement!==searchEl){var hb=document.querySelector('[data-view="heatmap"]');(hb.classList.contains('active')?document.querySelector('[data-view="matrix"]'):hb).click();return;}
      var cards=Array.from(document.querySelectorAll('.card:not([style*="display: none"])'));if(!cards.length)return;
      if(e.key===']'){e.preventDefault();fi=Math.min(fi+1,cards.length-1);cards[fi].scrollIntoView({behavior:'smooth',block:'center'});cards.forEach(function(c){c.style.outline='';});cards[fi].style.outline='2px solid var(--c-info)';cards[fi].style.outlineOffset='2px';}
      if(e.key==='['){e.preventDefault();fi=Math.max(fi-1,0);cards[fi].scrollIntoView({behavior:'smooth',block:'center'});cards.forEach(function(c){c.style.outline='';});cards[fi].style.outline='2px solid var(--c-info)';cards[fi].style.outlineOffset='2px';}
      if(e.key==='Enter'&&fi>=0&&document.activeElement!==searchEl){e.preventDefault();cards[fi].classList.toggle('expanded');}
    });
  }
})();
</script>
</body>
</html>
```

---

## 2. Key UI Rules

### No codes as primary labels

Finding codes (V1, W3, N2) are **never** the primary text users see. They appear only as tiny reference IDs:

```
[Conflict  v1]    ← "Conflict" is primary, "v1" is tiny ref
[Coverage Gap  w3] ← "Coverage Gap" is primary, "w3" is tiny ref
```

### Heatmap cells: plain status words only

| Cell status | Text shown | Meaning |
|-------------|-----------|---------|
| Source (PRD) | `Defined` | PRD defines this requirement |
| Aligned | `Aligned` | Document covers it |
| Partial | `Partial` | Incomplete coverage |
| Conflict | `Conflict` | Contradicts PRD |
| Gap | `Missing` | Not in this document |
| Addition | `Added` | Not required by PRD |
| N/A | `N/A` | Not applicable |

**Never** show finding IDs (V1, W3) in heatmap cells.

### PRD column header

Always shows `PRD (Source of Truth)` — not just "PRD".

### Naming drift table

- First column: **Concept** (what it refers to), not finding ID
- Terms in quotes: `"Total Headcount"` vs `"Total Resources"`
- "Between" column: `PRD vs UX` (not `[PRD<>UX]`)
- No N1/N2/N3 codes shown

### View switcher

Two prominent card-style buttons (not subtle tab underlines):
- **Requirements** — "Detailed requirement-by-requirement comparison across documents"
- **Coverage Map** — "Visual grid showing which requirements are covered in each document"

### Card click behavior

| Area | Action |
|------|--------|
| `.card-head` | Toggle expand/collapse |
| `.card-docs` | Nothing (text selectable) |
| `.card-detail` | Nothing (text selectable, copy-friendly) |
| Any area with text selected | Nothing |

### Card ordering

1. Cascades → 2. Conflicts → 3. Gaps → 4. Partial → 5. Additions → 6. Aligned

### Responsive

At <768px: columns stack, search full-width, view buttons stack.

---

## 3. Pre-Delivery Checklist

### Zero-legend compliance
- [ ] NO finding codes (V1, W3, N2) shown as primary labels anywhere
- [ ] All finding tags show human name first: "Conflict", "Coverage Gap", etc.
- [ ] Finding code appears only as tiny `ftag-ref` suffix for report cross-reference
- [ ] Heatmap cells show plain words: "Aligned", "Missing", "Conflict", "Partial"
- [ ] Heatmap PRD column says "Defined" not "PRD"
- [ ] Naming drift table uses "Concept" column, no N1/N2 IDs
- [ ] Document pair tags say "PRD vs UX" not "[PRD<>UX]"

### Layout
- [ ] Score ring displays correct percentage
- [ ] Metric cards show correct counts with plain labels
- [ ] View switcher has two prominent card-buttons with descriptions
- [ ] Coverage Map view clearly discoverable
- [ ] Toolbar is sticky when scrolling

### Interactions
- [ ] Card expands only from header click
- [ ] Text in expanded detail is fully selectable/copyable
- [ ] Text selection prevents accidental toggle
- [ ] Search, status, severity filters all work
- [ ] Keyboard shortcuts: /, Esc, [, ], Enter, H

### Data integrity
- [ ] Finding descriptions verbatim from reconciliation.md
- [ ] Cascade chain shows drift with arrows
- [ ] Quote blocks cite actual document text
- [ ] Counts in hero match actual data
