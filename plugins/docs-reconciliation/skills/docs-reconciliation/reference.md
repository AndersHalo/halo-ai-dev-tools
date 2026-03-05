# Docs Reconciliation — Template Reference

This file contains the HTML/CSS/JS templates for generated outputs. Loaded on-demand.

---

## 1. Reconciliation Matrix HTML Template (reconciliation-matrix.html)

### Design Principles

1. **Progressive disclosure** — Summary first, details on demand. Users see the health of their documents in 2 seconds, drill into specifics when ready.
2. **F-pattern scanning** — Key metrics top-left, status indicators on the left edge, actions on the right.
3. **Human-readable everywhere** — No codes without labels. "Conflict" not "V". "PRD vs UX" not "[PRD<>UX]".
4. **Copy-friendly** — Expanded detail panels are fully selectable. Clicking inside them never collapses the row.
5. **Responsive** — Stacks gracefully on narrow viewports.
6. **Minimal cognitive load** — 4 typography sizes, restrained color palette, generous whitespace.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Docs Reconciliation</title>
<style>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  /* ===========================================
     DESIGN TOKENS
     =========================================== */
  :root {
    /* Typography */
    --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    --text-xs: 11px;
    --text-sm: 12px;
    --text-md: 14px;
    --text-lg: 16px;
    --text-xl: 24px;
    --text-2xl: 32px;

    /* Spacing (4px base) */
    --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px;
    --sp-5: 20px; --sp-6: 24px; --sp-8: 32px; --sp-10: 40px;

    /* Radius */
    --r-sm: 6px; --r-md: 8px; --r-lg: 12px; --r-xl: 16px;

    /* Neutrals */
    --n-50: #f8fafc; --n-100: #f1f5f9; --n-200: #e2e8f0; --n-300: #cbd5e1;
    --n-400: #94a3b8; --n-500: #64748b; --n-600: #475569;
    --n-700: #334155; --n-800: #1e293b; --n-900: #0f172a;

    /* Status colors */
    --c-aligned: #22c55e; --c-aligned-bg: #dcfce7; --c-aligned-text: #15803d;
    --c-partial: #f59e0b; --c-partial-bg: #fef3c7; --c-partial-text: #a16207;
    --c-conflict: #ef4444; --c-conflict-bg: #fee2e2; --c-conflict-text: #dc2626;
    --c-gap: #3b82f6; --c-gap-bg: #dbeafe; --c-gap-text: #2563eb;
    --c-addition: #f97316; --c-addition-bg: #fff7ed; --c-addition-text: #ea580c;
    --c-cascade: #ec4899; --c-cascade-bg: #fce7f3; --c-cascade-text: #db2777;

    /* Finding type colors */
    --f-V: #fee2e2; --f-V-text: #dc2626;
    --f-N: #ede9fe; --f-N-text: #7c3aed;
    --f-W: #dbeafe; --f-W-text: #2563eb;
    --f-Q: #fff7ed; --f-Q-text: #ea580c;
    --f-C: #fce7f3; --f-C-text: #db2777;
    --f-S: #fef3c7; --f-S-text: #b45309;

    /* Document colors */
    --doc-prd: #eab308; --doc-prd-bg: #fffbeb;
    --doc-ux: #3b82f6; --doc-ux-bg: #eff6ff;
    --doc-mock: #22c55e; --doc-mock-bg: #f0fdf4;

    /* Severity */
    --sev-blocker: #dc2626; --sev-major: #f59e0b; --sev-minor: #6b7280;
  }

  /* ===========================================
     BASE
     =========================================== */
  body {
    font-family: var(--font);
    background: var(--n-50);
    color: var(--n-800);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  .container { max-width: 1280px; margin: 0 auto; padding: 0 var(--sp-6); }

  /* ===========================================
     HERO / HEADER
     =========================================== */
  .hero {
    background: linear-gradient(135deg, var(--n-900) 0%, var(--n-800) 100%);
    color: var(--n-100);
    padding: var(--sp-8) 0 var(--sp-6);
  }
  .hero-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: var(--sp-6); gap: var(--sp-4);
    flex-wrap: wrap;
  }
  .hero h1 { font-size: var(--text-xl); font-weight: 700; line-height: 1.2; }
  .hero-subtitle { font-size: var(--text-md); color: var(--n-400); margin-top: var(--sp-1); }
  .hero-badge {
    display: inline-block; padding: 2px 10px; border-radius: var(--r-sm);
    font-size: var(--text-xs); font-weight: 600;
    background: rgba(99,102,241,.25); color: #a5b4fc;
    margin-left: var(--sp-2); vertical-align: middle;
  }
  .hero-actions { display: flex; gap: var(--sp-2); flex-shrink: 0; }
  .hero-btn {
    padding: var(--sp-2) var(--sp-3); border: 1px solid rgba(255,255,255,.15);
    border-radius: var(--r-sm); background: rgba(255,255,255,.06);
    color: var(--n-300); font-size: var(--text-sm); font-weight: 500;
    cursor: pointer; transition: all .15s; font-family: var(--font);
  }
  .hero-btn:hover { background: rgba(255,255,255,.12); color: #fff; }
  .hero-btn.active { background: rgba(255,255,255,.18); color: #fff; border-color: rgba(255,255,255,.3); }

  /* --- Score + Metric Cards --- */
  .metrics {
    display: grid; grid-template-columns: auto 1fr; gap: var(--sp-6);
    align-items: center;
  }
  .score-ring {
    width: 88px; height: 88px; position: relative;
    display: flex; align-items: center; justify-content: center;
  }
  .score-ring svg { position: absolute; inset: 0; transform: rotate(-90deg); }
  .score-ring-track { fill: none; stroke: rgba(255,255,255,.1); stroke-width: 6; }
  .score-ring-fill { fill: none; stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset .8s ease; }
  .score-ring-value {
    font-size: var(--text-xl); font-weight: 800; color: #fff;
    position: relative; z-index: 1;
  }
  .score-ring-label {
    position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%);
    font-size: var(--text-xs); color: var(--n-400); white-space: nowrap;
  }
  .metric-cards {
    display: flex; gap: var(--sp-3); flex-wrap: wrap;
  }
  .metric-card {
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.08);
    border-radius: var(--r-md); padding: var(--sp-3) var(--sp-4);
    min-width: 100px; text-align: center;
    transition: background .15s;
  }
  .metric-card:hover { background: rgba(255,255,255,.1); }
  .metric-card-value { font-size: var(--text-xl); font-weight: 800; color: #fff; }
  .metric-card-label { font-size: var(--text-xs); color: var(--n-400); margin-top: 2px; }
  .metric-card-dot {
    display: inline-block; width: 8px; height: 8px; border-radius: 50%;
    margin-right: var(--sp-1); vertical-align: middle;
  }

  /* --- Document Coverage Bars --- */
  .doc-bars {
    display: flex; gap: var(--sp-4); margin-top: var(--sp-5);
    flex-wrap: wrap;
  }
  .doc-bar {
    flex: 1; min-width: 200px;
    display: flex; align-items: center; gap: var(--sp-3);
    padding: var(--sp-2) var(--sp-4);
    background: rgba(255,255,255,.05); border-radius: var(--r-md);
  }
  .doc-bar-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .doc-bar-name { font-size: var(--text-sm); font-weight: 600; color: var(--n-300); white-space: nowrap; }
  .doc-bar-track {
    flex: 1; height: 6px; background: rgba(255,255,255,.1); border-radius: 3px; overflow: hidden;
  }
  .doc-bar-fill { height: 100%; border-radius: 3px; transition: width .6s ease; }
  .doc-bar-pct { font-size: var(--text-md); font-weight: 700; color: #fff; min-width: 40px; text-align: right; }

  /* ===========================================
     TOOLBAR (sticky)
     =========================================== */
  .toolbar {
    position: sticky; top: 0; z-index: 90;
    background: #fff; border-bottom: 1px solid var(--n-200);
    box-shadow: 0 1px 3px rgba(0,0,0,.05);
  }
  .toolbar-inner {
    display: flex; align-items: center; gap: var(--sp-3);
    padding: var(--sp-3) 0; flex-wrap: wrap;
  }
  .toolbar-tabs {
    display: flex; gap: 0; margin-right: var(--sp-4);
  }
  .toolbar-tab {
    padding: var(--sp-2) var(--sp-4); font-size: var(--text-sm); font-weight: 600;
    color: var(--n-500); cursor: pointer; border-bottom: 2px solid transparent;
    transition: all .15s; background: none; border-top: none; border-left: none; border-right: none;
    font-family: var(--font);
  }
  .toolbar-tab:hover { color: var(--n-800); }
  .toolbar-tab.active { color: var(--n-900); border-bottom-color: var(--c-gap); }
  .toolbar-tab-count {
    font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 10px;
    margin-left: var(--sp-1); background: var(--n-100); color: var(--n-500);
  }
  .toolbar-tab.active .toolbar-tab-count { background: var(--c-gap-bg); color: var(--c-gap-text); }
  .toolbar-search {
    padding: var(--sp-2) var(--sp-3) var(--sp-2) 34px;
    border: 1px solid var(--n-300); border-radius: var(--r-sm);
    font-size: var(--text-sm); width: 240px; outline: none;
    font-family: var(--font);
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E") 10px center no-repeat;
  }
  .toolbar-search:focus { border-color: var(--c-gap); box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
  .toolbar-sep { width: 1px; height: 20px; background: var(--n-200); }

  /* Filter pills */
  .pill-group { display: flex; gap: 2px; background: var(--n-100); border-radius: var(--r-sm); padding: 2px; }
  .pill {
    padding: var(--sp-1) var(--sp-3); border: none; border-radius: var(--r-sm);
    background: transparent; font-size: var(--text-xs); font-weight: 600;
    cursor: pointer; transition: all .15s; color: var(--n-500); font-family: var(--font);
    white-space: nowrap;
  }
  .pill:hover { background: rgba(255,255,255,.7); color: var(--n-700); }
  .pill.active { background: #fff; color: var(--n-900); box-shadow: 0 1px 2px rgba(0,0,0,.06); }

  /* Severity & doc-pair filters */
  .filter-btn {
    padding: var(--sp-1) var(--sp-2); border: 1px solid var(--n-200); border-radius: var(--r-sm);
    background: #fff; font-size: var(--text-xs); font-weight: 600;
    cursor: pointer; transition: all .15s; color: var(--n-500); font-family: var(--font);
    white-space: nowrap;
  }
  .filter-btn:hover { border-color: var(--n-400); color: var(--n-700); }
  .filter-btn.active { border-color: var(--n-800); color: var(--n-900); background: var(--n-50); }
  .toolbar-count { font-size: var(--text-sm); color: var(--n-400); margin-left: auto; white-space: nowrap; }

  /* ===========================================
     HELP PANEL (floating, toggled by ? button)
     =========================================== */
  .help-panel {
    position: fixed; top: 0; right: -420px; width: 400px; height: 100vh;
    background: #fff; box-shadow: -4px 0 24px rgba(0,0,0,.12);
    z-index: 200; overflow-y: auto; transition: right .3s ease;
    padding: var(--sp-6);
  }
  .help-panel.open { right: 0; }
  .help-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,.3);
    z-index: 199; display: none;
  }
  .help-overlay.open { display: block; }
  .help-panel-title {
    font-size: var(--text-lg); font-weight: 700; margin-bottom: var(--sp-5);
    display: flex; align-items: center; justify-content: space-between;
  }
  .help-close {
    width: 28px; height: 28px; border: none; background: var(--n-100);
    border-radius: var(--r-sm); cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    color: var(--n-500); transition: all .15s;
  }
  .help-close:hover { background: var(--n-200); color: var(--n-800); }
  .help-section { margin-bottom: var(--sp-5); }
  .help-section h4 {
    font-size: var(--text-xs); font-weight: 700; text-transform: uppercase;
    letter-spacing: .05em; color: var(--n-500); margin-bottom: var(--sp-2);
    padding-bottom: var(--sp-1); border-bottom: 1px solid var(--n-200);
  }
  .help-item {
    display: flex; align-items: center; gap: var(--sp-2);
    font-size: var(--text-sm); padding: 3px 0; color: var(--n-600);
  }
  .help-badge {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 28px; height: 20px; border-radius: var(--r-sm); padding: 0 6px;
    font-size: var(--text-xs); font-weight: 700; flex-shrink: 0;
  }
  .help-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .help-kbd {
    display: flex; gap: var(--sp-4); flex-wrap: wrap; margin-top: var(--sp-2);
  }
  .help-kbd span { font-size: var(--text-xs); color: var(--n-500); }
  .help-kbd kbd {
    display: inline-block; padding: 1px 5px; background: var(--n-100);
    border: 1px solid var(--n-200); border-radius: 3px;
    font-family: monospace; font-size: var(--text-xs);
    box-shadow: 0 1px 0 var(--n-200);
  }

  /* ===========================================
     VIEWS
     =========================================== */
  .view { display: none; }
  .view.active { display: block; }
  .view-body { padding: var(--sp-6) 0 var(--sp-10); }

  /* ===========================================
     REQUIREMENT CARDS (Matrix View)
     =========================================== */
  .req-card {
    background: #fff; border: 1px solid var(--n-200);
    border-radius: var(--r-lg); margin-bottom: var(--sp-3);
    overflow: hidden; transition: box-shadow .15s;
    position: relative;
  }
  .req-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,.05); }

  /* Status stripe */
  .req-card[data-status="aligned"] { border-left: 4px solid var(--c-aligned); }
  .req-card[data-status="partial"] { border-left: 4px solid var(--c-partial); }
  .req-card[data-status="conflict"] { border-left: 4px solid var(--c-conflict); }
  .req-card[data-status="gap"] { border-left: 4px solid var(--c-gap); }
  .req-card[data-status="addition"] { border-left: 4px solid var(--c-addition); }
  .req-card[data-status="cascade"] { border-left: 4px solid var(--c-cascade); }

  /* Card header (always visible, clickable) */
  .req-header {
    padding: var(--sp-4) var(--sp-5);
    cursor: pointer;
    display: flex; align-items: flex-start; gap: var(--sp-4);
    position: relative;
  }
  .req-header:hover { background: var(--n-50); }
  .req-header-main { flex: 1; min-width: 0; }
  .req-header-top {
    display: flex; align-items: center; gap: var(--sp-2);
    margin-bottom: var(--sp-1); flex-wrap: wrap;
  }
  .req-status {
    display: inline-block; padding: 2px 8px; border-radius: var(--r-sm);
    font-size: var(--text-xs); font-weight: 700; text-transform: uppercase;
  }
  .req-status-aligned { background: var(--c-aligned-bg); color: var(--c-aligned-text); }
  .req-status-partial { background: var(--c-partial-bg); color: var(--c-partial-text); }
  .req-status-conflict { background: var(--c-conflict-bg); color: var(--c-conflict-text); }
  .req-status-gap { background: var(--c-gap-bg); color: var(--c-gap-text); }
  .req-status-addition { background: var(--c-addition-bg); color: var(--c-addition-text); }
  .req-status-cascade { background: var(--c-cascade-bg); color: var(--c-cascade-text); }
  .req-id { font-size: var(--text-sm); font-weight: 600; color: var(--n-500); font-family: monospace; }
  .req-title { font-size: var(--text-md); font-weight: 600; color: var(--n-800); }
  .req-desc { font-size: var(--text-sm); color: var(--n-600); margin-top: 2px; }
  .req-findings-summary {
    display: flex; gap: var(--sp-2); flex-wrap: wrap; margin-top: var(--sp-2);
  }

  /* Finding chip (in header) */
  .chip {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: var(--r-sm);
    font-size: var(--text-xs); font-weight: 600;
    line-height: 1.2;
  }
  .chip-label { font-weight: 700; }
  .chip-code { opacity: .6; font-family: monospace; font-size: 10px; }
  .chip-V { background: var(--f-V); color: var(--f-V-text); }
  .chip-N { background: var(--f-N); color: var(--f-N-text); }
  .chip-W { background: var(--f-W); color: var(--f-W-text); }
  .chip-Q { background: var(--f-Q); color: var(--f-Q-text); }
  .chip-C { background: var(--f-C); color: var(--f-C-text); }
  .chip-S { background: var(--f-S); color: var(--f-S-text); }
  .sev-pill {
    font-size: 10px; font-weight: 700; padding: 1px 6px;
    border-radius: 3px; text-transform: uppercase; color: #fff;
  }
  .sev-blocker { background: var(--sev-blocker); }
  .sev-major { background: var(--sev-major); }
  .sev-minor { background: var(--sev-minor); }
  .doc-tag {
    font-size: 10px; font-weight: 600; padding: 1px 6px;
    border-radius: 3px; background: var(--n-100); color: var(--n-500);
  }

  /* Expand arrow */
  .req-expand {
    width: 28px; height: 28px; border-radius: var(--r-sm);
    background: var(--n-100); display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 2px; transition: all .15s;
  }
  .req-expand svg { width: 14px; height: 14px; transition: transform .2s; color: var(--n-400); }
  .req-card.expanded .req-expand svg { transform: rotate(180deg); }
  .req-card.expanded .req-expand { background: var(--n-200); }

  /* Document columns (collapsed = hidden, expanded = shown) */
  .req-docs {
    display: none; border-top: 1px solid var(--n-200);
  }
  .req-card.expanded .req-docs { display: grid; }
  .req-doc {
    padding: var(--sp-4) var(--sp-5);
    border-right: 1px solid var(--n-200);
  }
  .req-doc:last-child { border-right: none; }
  .req-doc-prd { background: var(--doc-prd-bg); }
  .req-doc-ux { background: var(--doc-ux-bg); }
  .req-doc-mock { background: var(--doc-mock-bg); }
  .req-doc-label {
    font-size: var(--text-xs); font-weight: 700; text-transform: uppercase;
    letter-spacing: .04em; color: var(--n-500); margin-bottom: var(--sp-2);
    display: flex; align-items: center; gap: var(--sp-2);
  }
  .req-doc-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .req-doc-text { font-size: var(--text-sm); color: var(--n-700); line-height: 1.6; }
  .req-doc-empty { font-size: var(--text-sm); color: var(--n-400); font-style: italic; }
  .req-doc-chips { margin-top: var(--sp-2); display: flex; gap: var(--sp-1); flex-wrap: wrap; }

  /* Finding detail cards (expanded) */
  .req-findings {
    display: none; border-top: 1px solid var(--n-200);
    padding: var(--sp-4) var(--sp-5);
    background: var(--n-50);
    cursor: auto; user-select: text; -webkit-user-select: text;
  }
  .req-card.expanded .req-findings { display: block; }
  .finding-card {
    background: #fff; border: 1px solid var(--n-200); border-radius: var(--r-md);
    padding: var(--sp-4); margin-bottom: var(--sp-3);
  }
  .finding-card:last-child { margin-bottom: 0; }
  .finding-header {
    display: flex; align-items: center; gap: var(--sp-2);
    flex-wrap: wrap; margin-bottom: var(--sp-3);
  }
  .finding-desc { font-size: var(--text-sm); color: var(--n-700); line-height: 1.6; margin-bottom: var(--sp-3); }
  .finding-quote {
    padding: var(--sp-3) var(--sp-4); border-left: 3px solid;
    margin: var(--sp-2) 0; font-size: var(--text-sm);
    border-radius: 0 var(--r-sm) var(--r-sm) 0;
    line-height: 1.6; user-select: text; -webkit-user-select: text;
  }
  .finding-quote-prd { border-color: var(--doc-prd); background: #fffef5; }
  .finding-quote-ux { border-color: var(--doc-ux); background: #f8fbff; }
  .finding-quote-mock { border-color: var(--doc-mock); background: #f5fef7; }
  .finding-quote-label {
    font-size: var(--text-xs); font-weight: 700; text-transform: uppercase;
    color: var(--n-500); margin-bottom: var(--sp-1);
  }
  .finding-cascade {
    padding: var(--sp-3) var(--sp-4); background: var(--c-cascade-bg);
    border: 1px solid #fbcfe8; border-radius: var(--r-md);
    margin: var(--sp-3) 0;
  }
  .finding-cascade-title { font-size: var(--text-xs); font-weight: 700; color: var(--c-cascade-text); margin-bottom: var(--sp-2); }
  .finding-cascade-chain {
    display: flex; align-items: center; gap: var(--sp-2);
    flex-wrap: wrap; font-size: var(--text-sm);
  }
  .finding-cascade-step {
    padding: var(--sp-1) var(--sp-3); border-radius: var(--r-sm);
    font-weight: 600; font-size: var(--text-xs);
  }
  .finding-cascade-arrow { color: var(--c-cascade-text); font-weight: 700; }
  .finding-rec {
    margin-top: var(--sp-3); padding: var(--sp-3) var(--sp-4);
    background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--r-md);
    font-size: var(--text-sm); color: #166534;
  }
  .finding-rec-label { font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: .03em; }

  /* ===========================================
     NAMING DRIFT TABLE
     =========================================== */
  .naming-section {
    background: #fff; border: 1px solid var(--n-200); border-radius: var(--r-lg);
    border-left: 4px solid var(--f-N-text); overflow: hidden; margin-bottom: var(--sp-6);
  }
  .naming-header {
    padding: var(--sp-3) var(--sp-5); background: var(--f-N);
    font-size: var(--text-sm); font-weight: 700; color: var(--f-N-text);
  }
  .naming-section table { width: 100%; font-size: var(--text-sm); border-collapse: collapse; }
  .naming-section th {
    padding: var(--sp-2) var(--sp-4); text-align: left; font-weight: 600;
    background: var(--n-50); color: var(--n-600);
  }
  .naming-section td { padding: var(--sp-2) var(--sp-4); color: var(--n-700); }
  .naming-section tr:not(:last-child) td { border-bottom: 1px solid var(--n-100); }

  /* ===========================================
     HEATMAP VIEW
     =========================================== */
  .heatmap-title { font-size: var(--text-lg); font-weight: 700; margin-bottom: var(--sp-4); }
  .heatmap-grid {
    display: grid; gap: 2px; background: var(--n-200);
    border: 1px solid var(--n-200); border-radius: var(--r-md); overflow: hidden;
  }
  .hm-header {
    background: var(--n-900); color: var(--n-100);
    font-size: var(--text-sm); font-weight: 700;
    padding: var(--sp-3) var(--sp-4); text-align: center;
  }
  .hm-header-corner { text-align: left; }
  .hm-label {
    background: #fff; font-size: var(--text-sm); font-weight: 600;
    padding: var(--sp-2) var(--sp-4); color: var(--n-800);
    display: flex; align-items: center; gap: var(--sp-2);
    border-right: 1px solid var(--n-200);
  }
  .hm-label-id { font-size: 10px; font-weight: 700; color: var(--n-500); font-family: monospace; }
  .hm-cell {
    padding: var(--sp-2); text-align: center; font-size: var(--text-xs); font-weight: 600;
    cursor: default; transition: opacity .15s;
  }
  .hm-cell:hover { opacity: .8; }
  .hm-cell[data-status="aligned"] { background: var(--c-aligned-bg); color: var(--c-aligned-text); }
  .hm-cell[data-status="partial"] { background: var(--c-partial-bg); color: var(--c-partial-text); }
  .hm-cell[data-status="conflict"] { background: var(--c-conflict-bg); color: var(--c-conflict-text); }
  .hm-cell[data-status="gap"] { background: var(--c-gap-bg); color: var(--c-gap-text); }
  .hm-cell[data-status="addition"] { background: var(--c-addition-bg); color: var(--c-addition-text); }
  .hm-cell[data-status="na"] { background: var(--n-100); color: var(--n-400); }
  .hm-cell[data-status="source"] { background: var(--c-partial-bg); color: #92400e; }
  .hm-group {
    grid-column: 1 / -1; background: var(--n-100);
    padding: var(--sp-2) var(--sp-4); font-size: var(--text-xs);
    font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: var(--n-600);
  }
  .hm-legend {
    display: flex; gap: var(--sp-4); padding: var(--sp-3) 0;
    margin-top: var(--sp-3); flex-wrap: wrap;
  }
  .hm-legend-item { display: flex; align-items: center; gap: var(--sp-2); font-size: var(--text-sm); color: var(--n-600); }
  .hm-legend-swatch { width: 16px; height: 16px; border-radius: 3px; flex-shrink: 0; }

  /* ===========================================
     LOADING / ERROR / FOOTER
     =========================================== */
  .state-msg { text-align: center; padding: var(--sp-10) var(--sp-8); }
  .state-msg p { font-size: var(--text-md); }
  .state-msg .sub { font-size: var(--text-sm); color: var(--n-400); margin-top: var(--sp-2); }
  .footer {
    text-align: center; padding: var(--sp-6);
    font-size: var(--text-sm); color: var(--n-400);
    border-top: 1px solid var(--n-200);
  }

  /* ===========================================
     RESPONSIVE
     =========================================== */
  @media (max-width: 768px) {
    .container { padding: 0 var(--sp-4); }
    .hero { padding: var(--sp-5) 0; }
    .hero h1 { font-size: var(--text-lg); }
    .metrics { grid-template-columns: 1fr; gap: var(--sp-4); }
    .score-ring { margin: 0 auto; }
    .metric-cards { justify-content: center; }
    .doc-bars { flex-direction: column; }
    .toolbar-inner { padding: var(--sp-2) 0; }
    .toolbar-search { width: 100%; order: -1; }
    .req-docs { grid-template-columns: 1fr !important; }
    .req-doc { border-right: none; border-bottom: 1px solid var(--n-200); }
    .req-doc:last-child { border-bottom: none; }
    .help-panel { width: 100%; right: -100%; }
    .heatmap-grid { font-size: 10px; }
  }
</style>
</head>
<body>

<!-- ===== HERO ===== -->
<div class="hero">
  <div class="container">
    <div class="hero-top">
      <div>
        <h1 id="hero-title">Docs Reconciliation<span class="hero-badge" id="hero-mode"></span></h1>
        <div class="hero-subtitle" id="hero-sub"></div>
      </div>
      <div class="hero-actions">
        <button class="hero-btn" data-action="help">? Help</button>
        <button class="hero-btn" data-action="expand-all">Expand All</button>
        <button class="hero-btn" data-action="collapse-all">Collapse All</button>
      </div>
    </div>
    <div class="metrics">
      <div class="score-ring" id="score-ring">
        <svg viewBox="0 0 88 88"><circle class="score-ring-track" cx="44" cy="44" r="38"/><circle class="score-ring-fill" id="score-arc" cx="44" cy="44" r="38"/></svg>
        <span class="score-ring-value" id="score-value">0%</span>
        <span class="score-ring-label">Overall Alignment</span>
      </div>
      <div class="metric-cards" id="metric-cards"></div>
    </div>
    <div class="doc-bars" id="doc-bars"></div>
  </div>
</div>

<!-- ===== HELP PANEL (slide-in drawer) ===== -->
<div class="help-overlay" id="help-overlay"></div>
<div class="help-panel" id="help-panel">
  <div class="help-panel-title">Reference Guide <button class="help-close" id="help-close">&times;</button></div>
  <div class="help-section">
    <h4>Finding Types</h4>
    <div class="help-item"><span class="help-badge" style="background:var(--f-V);color:var(--f-V-text);">V</span> <strong>Conflict</strong> — Documents contradict each other</div>
    <div class="help-item"><span class="help-badge" style="background:var(--f-N);color:var(--f-N-text);">N</span> <strong>Naming Drift</strong> — Same concept, different names</div>
    <div class="help-item"><span class="help-badge" style="background:var(--f-W);color:var(--f-W-text);">W</span> <strong>Coverage Gap</strong> — Required by PRD, missing elsewhere</div>
    <div class="help-item"><span class="help-badge" style="background:var(--f-Q);color:var(--f-Q-text);">Q</span> <strong>Scope Addition</strong> — Added without PRD requirement</div>
    <div class="help-item"><span class="help-badge" style="background:var(--f-C);color:var(--f-C-text);">C</span> <strong>Cascade</strong> — Progressive drift across documents</div>
    <div class="help-item"><span class="help-badge" style="background:var(--f-S);color:var(--f-S-text);">S</span> <strong>Specificity Gap</strong> — Downstream invented details</div>
    <div class="help-item"><span class="help-badge" style="background:#e0e7ff;color:#6366f1;">D</span> <strong>PRD Issue</strong> — Internal PRD inconsistency</div>
    <div class="help-item"><span class="help-badge" style="background:#ccfbf1;color:#0d9488;">E</span> <strong>UX Issue</strong> — Internal UX inconsistency</div>
    <div class="help-item"><span class="help-badge" style="background:var(--n-100);color:var(--n-500);">M</span> <strong>Mock Issue</strong> — Internal Mock inconsistency</div>
  </div>
  <div class="help-section">
    <h4>Requirement Status</h4>
    <div class="help-item"><span class="help-dot" style="background:var(--c-aligned);"></span> <strong>Aligned</strong> — Fully covered, no conflicts</div>
    <div class="help-item"><span class="help-dot" style="background:var(--c-partial);"></span> <strong>Partial</strong> — Some coverage, gaps remain</div>
    <div class="help-item"><span class="help-dot" style="background:var(--c-conflict);"></span> <strong>Conflict</strong> — Documents contradict</div>
    <div class="help-item"><span class="help-dot" style="background:var(--c-gap);"></span> <strong>Gap</strong> — Missing from one or more documents</div>
    <div class="help-item"><span class="help-dot" style="background:var(--c-addition);"></span> <strong>Addition</strong> — Not required by PRD</div>
    <div class="help-item"><span class="help-dot" style="background:var(--c-cascade);"></span> <strong>Cascade</strong> — Progressive drift</div>
  </div>
  <div class="help-section">
    <h4>Severity Levels</h4>
    <div class="help-item"><span class="sev-pill sev-blocker">BLOCKER</span> Contradicts — blocks progress</div>
    <div class="help-item"><span class="sev-pill sev-major">MAJOR</span> Significant gap — causes rework</div>
    <div class="help-item"><span class="sev-pill sev-minor">MINOR</span> Low-risk cosmetic issue</div>
  </div>
  <div class="help-section">
    <h4>Keyboard Shortcuts</h4>
    <div class="help-kbd">
      <span><kbd>/</kbd> Search</span>
      <span><kbd>Esc</kbd> Clear</span>
      <span><kbd>[</kbd><kbd>]</kbd> Navigate</span>
      <span><kbd>Enter</kbd> Expand</span>
      <span><kbd>?</kbd> Help</span>
      <span><kbd>H</kbd> Coverage Map</span>
    </div>
  </div>
</div>

<!-- ===== TOOLBAR ===== -->
<div class="toolbar">
  <div class="container">
    <div class="toolbar-inner">
      <div class="toolbar-tabs">
        <button class="toolbar-tab active" data-view="matrix">Requirements <span class="toolbar-tab-count" id="tab-count-matrix"></span></button>
        <button class="toolbar-tab" data-view="heatmap">Coverage Map</button>
      </div>
      <input type="text" class="toolbar-search" placeholder="Search requirements..." data-action="search">
      <div class="pill-group" id="status-pills">
        <button class="pill active" data-filter="all">All</button>
        <button class="pill" data-filter="conflict">Conflicts</button>
        <button class="pill" data-filter="gap">Gaps</button>
        <button class="pill" data-filter="partial">Partial</button>
        <button class="pill" data-filter="addition">Additions</button>
        <button class="pill" data-filter="aligned">Aligned</button>
      </div>
      <div class="toolbar-sep"></div>
      <button class="filter-btn active" data-severity="all">All Severity</button>
      <button class="filter-btn" data-severity="blocker">Blockers</button>
      <button class="filter-btn" data-severity="major">Major</button>
      <button class="filter-btn" data-severity="minor">Minor</button>
      <span class="toolbar-count" id="row-count"></span>
    </div>
  </div>
</div>

<!-- ===== MATRIX VIEW ===== -->
<div class="view active" id="view-matrix">
  <div class="container">
    <div class="view-body">
      <div id="naming-drift-container"></div>
      <div id="matrix-body"></div>
    </div>
  </div>
</div>

<!-- ===== HEATMAP VIEW ===== -->
<div class="view" id="view-heatmap">
  <div class="container">
    <div class="view-body">
      <div class="heatmap-title">Coverage Map &mdash; Requirements vs Documents</div>
      <div id="heatmap-grid"></div>
      <div class="hm-legend">
        <div class="hm-legend-item"><div class="hm-legend-swatch" style="background:var(--c-partial-bg);"></div> Source (PRD)</div>
        <div class="hm-legend-item"><div class="hm-legend-swatch" style="background:var(--c-aligned-bg);"></div> Aligned</div>
        <div class="hm-legend-item"><div class="hm-legend-swatch" style="background:var(--c-partial-bg);border:1px solid #fde68a;"></div> Partial</div>
        <div class="hm-legend-item"><div class="hm-legend-swatch" style="background:var(--c-conflict-bg);"></div> Conflict</div>
        <div class="hm-legend-item"><div class="hm-legend-swatch" style="background:var(--c-gap-bg);"></div> Gap</div>
        <div class="hm-legend-item"><div class="hm-legend-swatch" style="background:var(--c-addition-bg);"></div> Addition</div>
        <div class="hm-legend-item"><div class="hm-legend-swatch" style="background:var(--n-100);"></div> N/A</div>
      </div>
    </div>
  </div>
</div>

<!-- ===== LOADING / ERROR ===== -->
<div id="loading-state" class="state-msg"><p>Loading reconciliation data&hellip;</p></div>
<div id="error-state" class="state-msg" style="display:none;">
  <p style="color:var(--c-conflict);">Failed to load reconciliation-data.json</p>
  <p class="sub">Ensure this HTML file is in the same directory as reconciliation-data.json</p>
</div>

<!-- ===== FOOTER ===== -->
<div class="footer" id="footer">Docs Reconciliation Dashboard</div>

<script>
(function() {
  /* =====================================================
     DATA-DRIVEN RENDERING
     All content loaded from reconciliation-data.json.
     This template NEVER contains inline finding data.
     ===================================================== */

  var DATA = null;

  /* --- DOM refs --- */
  var matrixBody = document.getElementById('matrix-body');
  var searchEl = document.querySelector('[data-action="search"]');
  var statusPills = document.querySelectorAll('#status-pills .pill');
  var sevBtns = document.querySelectorAll('.filter-btn[data-severity]');
  var rowCountEl = document.getElementById('row-count');
  var tabs = document.querySelectorAll('.toolbar-tab');
  var views = document.querySelectorAll('.view');
  var focusedIdx = -1;

  /* --- Human-readable labels --- */
  var NAMES = {
    V:'Conflict', N:'Naming Drift', W:'Coverage Gap',
    Q:'Scope Addition', C:'Cascade', S:'Specificity Gap',
    D:'PRD Issue', E:'UX Issue', M:'Mock Issue'
  };
  var STATUS = {
    aligned:'Aligned', partial:'Partial', conflict:'Conflict',
    gap:'Gap', addition:'Addition', cascade:'Cascade', na:'N/A', source:'Source'
  };
  var STATUS_ORDER = ['cascade','conflict','gap','partial','addition','aligned'];
  var SEV_ORDER = {blocker:0,major:1,minor:2};
  var DOC_CLS = {prd:'req-doc-prd',ux:'req-doc-ux',mock:'req-doc-mock'};
  var DOC_QUOTE_CLS = {prd:'finding-quote-prd',ux:'finding-quote-ux',mock:'finding-quote-mock'};
  var DOC_QUOTE_VERB = {prd:'PRD states',ux:'UX defines',mock:'Mock shows'};

  function friendly(tag) {
    if (!tag) return '';
    return tag.replace('[PRD<>UX]','PRD vs UX').replace('[PRD<>Mock]','PRD vs Mock')
      .replace('[UX<>Mock]','UX vs Mock').replace('[PRD>UX>Mock]','PRD \u2192 UX \u2192 Mock');
  }
  function esc(s) { var e=document.createElement('span'); e.textContent=s||''; return e.innerHTML; }
  function docKeys(d) {
    var k=['prd'];
    if (d.meta.documents.ux&&d.meta.documents.ux.name) k.push('ux');
    if (d.meta.documents.mock&&d.meta.documents.mock.name) k.push('mock');
    return k;
  }
  function docName(d,k) { return k==='prd'?'PRD':(d.meta.documents[k]?d.meta.documents[k].name:k); }
  function docColor(d,k) { return k==='prd'?'var(--doc-prd)':(d.meta.documents[k]?d.meta.documents[k].color:'#999'); }

  /* --- Fetch data --- */
  fetch('./reconciliation-data.json')
    .then(function(r){return r.json();})
    .then(function(data){ DATA=data; document.getElementById('loading-state').style.display='none'; render(data); })
    .catch(function(err){ document.getElementById('loading-state').style.display='none'; document.getElementById('error-state').style.display='block'; console.error(err); });

  /* =====================================================
     RENDER
     ===================================================== */
  function render(d) {
    var keys = docKeys(d);

    /* Hero */
    document.getElementById('hero-title').innerHTML = esc(d.meta.title) + '<span class="hero-badge">' + esc(d.meta.mode) + '</span>';
    document.getElementById('hero-mode').textContent = d.meta.mode;
    document.getElementById('hero-sub').textContent = d.meta.date + ' \u2014 ' + keys.map(function(k){return docName(d,k);}).join(', ');

    /* Score ring */
    var score = d.scores.overallAlignment;
    var circ = 2 * Math.PI * 38;
    var arc = document.getElementById('score-arc');
    arc.setAttribute('stroke-dasharray', circ);
    arc.setAttribute('stroke-dashoffset', circ - (circ * score / 100));
    var sc = score>=80?'var(--c-aligned)':score>=50?'var(--c-partial)':'var(--c-conflict)';
    arc.style.stroke = sc;
    document.getElementById('score-value').textContent = score+'%';

    /* Metric cards */
    var mc = document.getElementById('metric-cards');
    var items = [
      {v:d.stats.totalRequirements, l:'Requirements', c:''},
      {v:d.stats.byStatus.aligned||0, l:'Aligned', c:'var(--c-aligned)'},
      {v:d.stats.byStatus.conflict||0, l:'Conflicts', c:'var(--c-conflict)'},
      {v:d.stats.byStatus.gap||0, l:'Gaps', c:'var(--c-gap)'},
      {v:d.stats.byStatus.addition||0, l:'Additions', c:'var(--c-addition)'}
    ];
    if (d.meta.mode==='trilateral') items.push({v:d.stats.byStatus.cascade||0,l:'Cascades',c:'var(--c-cascade)'});
    mc.innerHTML = items.map(function(i){
      var dot = i.c ? '<span class="metric-card-dot" style="background:'+i.c+'"></span>' : '';
      return '<div class="metric-card"><div class="metric-card-value">'+i.v+'</div><div class="metric-card-label">'+dot+i.l+'</div></div>';
    }).join('');

    /* Doc coverage bars */
    var db = document.getElementById('doc-bars');
    db.innerHTML = keys.filter(function(k){return k!=='prd';}).map(function(k){
      var cov = d.scores.perDocument[k]; if (cov===null||cov===undefined) return '';
      return '<div class="doc-bar"><div class="doc-bar-dot" style="background:'+docColor(d,k)+'"></div>'+
        '<span class="doc-bar-name">'+esc(docName(d,k))+' Coverage</span>'+
        '<div class="doc-bar-track"><div class="doc-bar-fill" style="width:'+cov+'%;background:'+docColor(d,k)+'"></div></div>'+
        '<span class="doc-bar-pct">'+cov+'%</span></div>';
    }).join('');

    /* Tab count */
    document.getElementById('tab-count-matrix').textContent = d.stats.totalFindings;

    /* Doc pair filters (trilateral) */
    if (d.meta.mode==='trilateral') {
      var sep = document.querySelector('.toolbar-sep');
      ['All Pairs','PRD vs UX','PRD vs Mock','UX vs Mock'].forEach(function(label,i){
        var b = document.createElement('button');
        b.className = 'filter-btn doc-pair-btn' + (i===0?' active':'');
        b.dataset.docs = ['all','prd-ux','prd-mock','ux-mock'][i];
        b.textContent = label;
        sep.parentNode.insertBefore(b, sep);
      });
      var newSep = document.createElement('div');
      newSep.className = 'toolbar-sep';
      sep.parentNode.insertBefore(newSep, sep);
    }

    /* Naming drift */
    if (d.namingDrift && d.namingDrift.length) renderNaming(d, keys);

    /* Heatmap */
    renderHeatmap(d, keys);

    /* Matrix */
    renderMatrix(d, keys);

    /* Footer */
    document.getElementById('footer').textContent = 'Docs Reconciliation \u2014 Generated '+d.meta.date+' \u2014 '+d.meta.mode;

    /* Init controls */
    initControls();
  }

  /* --- Naming drift --- */
  function renderNaming(d, keys) {
    var c = document.getElementById('naming-drift-container');
    var h = '<div class="naming-section"><div class="naming-header">Naming Drift \u2014 Same concept called different things across documents</div><table><thead><tr><th>Finding</th><th>PRD Term</th>';
    if (keys.indexOf('ux')!==-1) h+='<th>UX Term</th>';
    if (keys.indexOf('mock')!==-1) h+='<th>Mock Term</th>';
    h += '<th>Documents</th><th>Context</th><th>Severity</th></tr></thead><tbody>';
    d.namingDrift.forEach(function(n){
      h += '<tr><td><span class="chip chip-N"><span class="chip-label">Naming Drift</span> <span class="chip-code">'+esc(n.findingId)+'</span></span></td>';
      h += '<td>\u201c'+esc(n.terms.prd)+'\u201d</td>';
      if (keys.indexOf('ux')!==-1) h+='<td>'+(n.terms.ux?'\u201c'+esc(n.terms.ux)+'\u201d':'\u2014')+'</td>';
      if (keys.indexOf('mock')!==-1) h+='<td>'+(n.terms.mock?'\u201c'+esc(n.terms.mock)+'\u201d':'\u2014')+'</td>';
      h += '<td><span class="doc-tag">'+esc(friendly(n.docsTag))+'</span></td>';
      h += '<td>'+esc(n.context)+'</td>';
      h += '<td><span class="sev-pill sev-'+n.severity+'">'+n.severity.toUpperCase()+'</span></td></tr>';
    });
    h += '</tbody></table></div>';
    c.innerHTML = h;
  }

  /* --- Heatmap --- */
  function renderHeatmap(d, keys) {
    var c = document.getElementById('heatmap-grid');
    var cols = '200px'+keys.map(function(){return ' 1fr';}).join('');
    var h = '<div class="heatmap-grid" style="grid-template-columns:'+cols+';">';
    h += '<div class="hm-header hm-header-corner">Requirement</div>';
    keys.forEach(function(k){ h+='<div class="hm-header">'+esc(docName(d,k)+(k==='prd'?' (Source)':''))+'</div>'; });
    var gm={}; (d.groups||[]).forEach(function(g){g.requirementIds.forEach(function(id){gm[id]=g;});});
    var lg=null;
    sortReqs(d.requirements).forEach(function(req){
      var g=gm[req.id];
      if (g&&g.id!==lg) { h+='<div class="hm-group">'+esc(g.name)+'</div>'; lg=g.id; }
      h += '<div class="hm-label"><span class="hm-label-id">'+esc(req.id)+'</span> '+esc(req.title)+'</div>';
      keys.forEach(function(k){
        if (k==='prd') { h+='<div class="hm-cell" data-status="source" title="PRD: Source">Source</div>'; return; }
        var pd=req.perDocument[k]; var st=pd?pd.status:'na'; if(!st||st==='null') st='na';
        h+='<div class="hm-cell" data-status="'+st+'" title="'+esc(docName(d,k)+': '+(STATUS[st]||st))+'">'+(STATUS[st]||st)+'</div>';
      });
    });
    h += '</div>';
    c.innerHTML = h;
  }

  /* --- Matrix --- */
  function renderMatrix(d, keys) {
    var fm={}; d.findings.forEach(function(f){fm[f.id]=f;});
    var gridCols = keys.map(function(){return '1fr';}).join(' ');
    var h = '';
    sortReqs(d.requirements).forEach(function(req){
      var st = req.overallStatus;
      var sev = highSev(req,fm);
      var dp = docPairs(req,fm);
      h += '<div class="req-card" data-status="'+st+'"'+(sev?' data-severity="'+sev+'":'')+' data-fr="'+esc(req.id)+'" data-docs="'+dp+'" data-keywords="'+esc(req.keywords||'')+'">';

      /* --- Header (always visible) --- */
      h += '<div class="req-header">';
      h += '<div class="req-header-main">';
      h += '<div class="req-header-top">';
      h += '<span class="req-status req-status-'+st+'">'+(STATUS[st]||st)+'</span>';
      h += '<span class="req-id">'+esc(req.id)+'</span>';
      h += '</div>';
      h += '<div class="req-title">'+esc(req.title)+'</div>';
      var prdPd = req.perDocument.prd;
      h += '<div class="req-desc">'+esc(prdPd?prdPd.summary:req.description)+'</div>';
      /* Finding chips */
      if (req.findingIds && req.findingIds.length) {
        h += '<div class="req-findings-summary">';
        req.findingIds.forEach(function(fid){
          var f=fm[fid]; if(!f) return;
          h += '<span class="chip chip-'+f.code+'"><span class="chip-label">'+(NAMES[f.code]||f.code)+'</span> <span class="chip-code">'+fid+'</span></span>';
          h += '<span class="sev-pill sev-'+f.severity+'">'+f.severity.toUpperCase()+'</span>';
        });
        h += '</div>';
      }
      h += '</div>'; /* .req-header-main */
      h += '<div class="req-expand"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg></div>';
      h += '</div>'; /* .req-header */

      /* --- Document columns (shown when expanded) --- */
      h += '<div class="req-docs" style="grid-template-columns:'+gridCols+';">';
      keys.forEach(function(k){
        var cls = DOC_CLS[k]||'';
        var pd = req.perDocument[k];
        h += '<div class="req-doc '+cls+'">';
        h += '<div class="req-doc-label"><span class="req-doc-dot" style="background:'+docColor(d,k)+'"></span> '+esc(docName(d,k))+'</div>';
        if (k==='prd') {
          h += '<div class="req-doc-text">'+esc(pd?pd.summary:req.description)+'</div>';
        } else if (pd && pd.summary) {
          h += '<div class="req-doc-text">'+esc(pd.summary)+'</div>';
          var sat = (pd.findingIds||[]).filter(function(fid){ var f=fm[fid]; return f&&'QS'.indexOf(f.code)!==-1; });
          if (sat.length) {
            h += '<div class="req-doc-chips">';
            sat.forEach(function(fid){ var f=fm[fid]; h+='<span class="chip chip-'+f.code+'"><span class="chip-label">'+(NAMES[f.code]||f.code)+'</span> <span class="chip-code">'+fid+'</span></span>'; });
            h += '</div>';
          }
        } else {
          h += '<div class="req-doc-empty">'+(st==='addition'?'Not required by PRD':'Not covered')+'</div>';
        }
        h += '</div>';
      });
      h += '</div>'; /* .req-docs */

      /* --- Finding detail cards (shown when expanded, copy-friendly) --- */
      if (req.findingIds && req.findingIds.length) {
        h += '<div class="req-findings">';
        req.findingIds.forEach(function(fid){
          var f=fm[fid]; if(!f) return;
          h += '<div class="finding-card">';
          h += '<div class="finding-header">';
          h += '<span class="chip chip-'+f.code+'" style="margin:0"><span class="chip-label">'+(NAMES[f.code]||f.code)+'</span> <span class="chip-code">'+fid+'</span></span>';
          h += '<span class="sev-pill sev-'+f.severity+'">'+f.severity.toUpperCase()+'</span>';
          h += '<span class="doc-tag">'+esc(friendly(f.docsTag))+'</span>';
          h += '</div>';
          h += '<div class="finding-desc">'+esc(f.description)+'</div>';
          /* Cascade chain */
          if (f.code==='C') {
            var cas = d.cascades.find(function(c){return c.findingId===fid;});
            if (cas) {
              h += '<div class="finding-cascade"><div class="finding-cascade-title">How this requirement drifted across documents:</div>';
              h += '<div class="finding-cascade-chain">';
              h += '<span class="finding-cascade-step" style="background:var(--doc-prd-bg);color:#92400e;">PRD: \u201c'+esc(cas.chain.prd)+'\u201d</span>';
              h += '<span class="finding-cascade-arrow">\u2192</span>';
              h += '<span class="finding-cascade-step" style="background:var(--doc-ux-bg);color:#1d4ed8;">UX: \u201c'+esc(cas.chain.ux)+'\u201d</span>';
              h += '<span class="finding-cascade-arrow">\u2192</span>';
              h += '<span class="finding-cascade-step" style="background:var(--doc-mock-bg);color:#166534;">Mock: \u201c'+esc(cas.chain.mock)+'\u201d</span>';
              h += '</div></div>';
            }
          }
          /* Quotes */
          ['prd','ux','mock'].forEach(function(dk){
            if (f.quotes&&f.quotes[dk]) {
              h += '<div class="finding-quote '+(DOC_QUOTE_CLS[dk]||'')+'">';
              h += '<div class="finding-quote-label">'+(DOC_QUOTE_VERB[dk]||dk)+':</div>';
              h += '\u201c'+esc(f.quotes[dk])+'\u201d</div>';
            }
          });
          h += '<div class="finding-rec"><span class="finding-rec-label">Recommendation:</span> '+esc(f.recommendation)+'</div>';
          h += '</div>'; /* .finding-card */
        });
        h += '</div>'; /* .req-findings */
      }
      h += '</div>'; /* .req-card */
    });
    matrixBody.innerHTML = h;
  }

  /* --- Helpers --- */
  function sortReqs(reqs) {
    return reqs.slice().sort(function(a,b){
      var sa=STATUS_ORDER.indexOf(a.overallStatus); var sb=STATUS_ORDER.indexOf(b.overallStatus);
      if(sa===-1) sa=99; if(sb===-1) sb=99;
      return sa-sb;
    });
  }
  function highSev(req,fm) {
    var b=null;
    (req.findingIds||[]).forEach(function(fid){var f=fm[fid];if(!f)return;if(!b||(SEV_ORDER[f.severity]||99)<(SEV_ORDER[b]||99))b=f.severity;});
    return b;
  }
  function docPairs(req,fm) {
    var p={};
    (req.findingIds||[]).forEach(function(fid){var f=fm[fid];if(!f)return;var t=f.docsTag.replace(/[\[\]>]/g,'').toLowerCase().replace(/\s/g,'');t.split(',').forEach(function(x){p[x]=true;});});
    return Object.keys(p).join(' ');
  }

  /* =====================================================
     CONTROLS
     ===================================================== */
  function initControls() {
    var activeStatus='all', activeSev='all', activeDocs='all';

    function countVisible() {
      var vis=document.querySelectorAll('.req-card:not([style*="display: none"])').length;
      var tot=document.querySelectorAll('.req-card').length;
      rowCountEl.textContent = vis===tot ? tot+' requirements' : vis+' of '+tot;
    }
    countVisible();

    function applyFilters() {
      document.querySelectorAll('.req-card').forEach(function(c){
        var sm = activeStatus==='all'||c.dataset.status===activeStatus;
        var sv = activeSev==='all'||c.dataset.severity===activeSev||(!c.dataset.severity&&activeSev==='all');
        var dm = activeDocs==='all'||(c.dataset.docs&&c.dataset.docs.indexOf(activeDocs)!==-1);
        c.style.display = sm&&sv&&dm ? '' : 'none';
      });
      countVisible();
    }

    /* Status pills */
    statusPills.forEach(function(p){
      p.addEventListener('click',function(){
        statusPills.forEach(function(x){x.classList.remove('active');});
        p.classList.add('active'); activeStatus=p.dataset.filter; applyFilters();
      });
    });

    /* Severity */
    sevBtns.forEach(function(b){
      b.addEventListener('click',function(){
        sevBtns.forEach(function(x){x.classList.remove('active');});
        b.classList.add('active'); activeSev=b.dataset.severity; applyFilters();
      });
    });

    /* Doc pair filters */
    document.querySelectorAll('.doc-pair-btn').forEach(function(b){
      b.addEventListener('click',function(){
        document.querySelectorAll('.doc-pair-btn').forEach(function(x){x.classList.remove('active');});
        b.classList.add('active'); activeDocs=b.dataset.docs; applyFilters();
      });
    });

    /* Row expand/collapse — header click only, detail is copy-safe */
    matrixBody.addEventListener('click',function(e){
      if (e.target.closest('.req-findings')) return;
      if (window.getSelection&&window.getSelection().toString().length>0) return;
      var header = e.target.closest('.req-header');
      if (!header) return;
      var card = header.closest('.req-card');
      if (card) card.classList.toggle('expanded');
    });

    /* Search */
    searchEl.addEventListener('input',function(){
      var q=searchEl.value.toLowerCase();
      document.querySelectorAll('.req-card').forEach(function(c){
        var t=(c.dataset.fr+' '+c.dataset.keywords+' '+c.dataset.docs+' '+c.textContent).toLowerCase();
        c.style.display=t.indexOf(q)!==-1?'':'none';
      });
      if(!q){activeStatus='all';applyFilters();statusPills.forEach(function(p){p.classList.remove('active');});statusPills[0].classList.add('active');}
      countVisible();
    });

    /* Tabs */
    tabs.forEach(function(tab){
      tab.addEventListener('click',function(){
        tabs.forEach(function(t){t.classList.remove('active');});
        tab.classList.add('active');
        views.forEach(function(v){v.classList.remove('active');});
        var target=document.getElementById('view-'+tab.dataset.view);
        if(target)target.classList.add('active');
      });
    });

    /* Help panel */
    var helpPanel=document.getElementById('help-panel');
    var helpOverlay=document.getElementById('help-overlay');
    function toggleHelp(){helpPanel.classList.toggle('open');helpOverlay.classList.toggle('open');}
    document.querySelector('[data-action="help"]').addEventListener('click',toggleHelp);
    document.getElementById('help-close').addEventListener('click',toggleHelp);
    helpOverlay.addEventListener('click',toggleHelp);

    /* Expand/Collapse all */
    document.querySelector('[data-action="expand-all"]').addEventListener('click',function(){
      document.querySelectorAll('.req-card').forEach(function(c){c.classList.add('expanded');});
    });
    document.querySelector('[data-action="collapse-all"]').addEventListener('click',function(){
      document.querySelectorAll('.req-card').forEach(function(c){c.classList.remove('expanded');});
    });

    /* Keyboard */
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){searchEl.value='';searchEl.dispatchEvent(new Event('input'));searchEl.blur();if(helpPanel.classList.contains('open'))toggleHelp();return;}
      if(e.key==='/'&&document.activeElement!==searchEl){e.preventDefault();searchEl.focus();return;}
      if(e.key==='?'&&document.activeElement!==searchEl){toggleHelp();return;}
      if((e.key==='h'||e.key==='H')&&document.activeElement!==searchEl){
        var ht=document.querySelector('[data-view="heatmap"]');
        (ht.classList.contains('active')?document.querySelector('[data-view="matrix"]'):ht).click();return;
      }
      var cards=Array.from(document.querySelectorAll('.req-card:not([style*="display: none"])'));
      if(!cards.length) return;
      if(e.key===']'){e.preventDefault();focusedIdx=Math.min(focusedIdx+1,cards.length-1);cards[focusedIdx].scrollIntoView({behavior:'smooth',block:'center'});cards.forEach(function(c){c.style.outline='';});cards[focusedIdx].style.outline='2px solid var(--c-gap)';cards[focusedIdx].style.outlineOffset='2px';}
      if(e.key==='['){e.preventDefault();focusedIdx=Math.max(focusedIdx-1,0);cards[focusedIdx].scrollIntoView({behavior:'smooth',block:'center'});cards.forEach(function(c){c.style.outline='';});cards[focusedIdx].style.outline='2px solid var(--c-gap)';cards[focusedIdx].style.outlineOffset='2px';}
      if(e.key==='Enter'&&focusedIdx>=0&&document.activeElement!==searchEl){e.preventDefault();cards[focusedIdx].classList.toggle('expanded');}
    });
  }
})();
</script>
</body>
</html>
```

---

## 2. Requirement Card Structure

### Card anatomy

Each requirement renders as a `.req-card` with three zones:

```
┌─ req-card ──────────────────────────────────────┐
│ ┌─ req-header (always visible, clickable) ────┐ │
│ │ [Conflict] FR-1                        [▼]  │ │
│ │ User Login                                   │ │
│ │ Users must be able to log in with email...   │ │
│ │ [Conflict V1] [BLOCKER] [Coverage Gap W3]... │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─ req-docs (expanded only) ──────────────────┐ │
│ │ PRD          │ UX Design    │ Mock           │ │
│ │ "Users..."   │ "Login..."   │ "Shows..."     │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─ req-findings (expanded only, copy-safe) ───┐ │
│ │ ┌─ finding-card ──────────────────────────┐  │ │
│ │ │ [Conflict V1] [BLOCKER] [PRD vs UX]     │  │ │
│ │ │ Description text...                      │  │ │
│ │ │ PRD states: "..."                        │  │ │
│ │ │ UX defines: "..."                        │  │ │
│ │ │ Recommendation: ...                      │  │ │
│ │ └─────────────────────────────────────────┘  │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Click behavior

| Area | Click action |
|------|--------------|
| `.req-header` | Toggle expand/collapse |
| `.req-docs` | Nothing (text selectable) |
| `.req-findings` | Nothing (text selectable, copy-friendly) |
| Any area with text selected | Nothing (preserves selection) |

### Status assignment per card

| Condition | `data-status` |
|-----------|---------------|
| Requirement fully covered, no findings | `aligned` |
| Partially covered | `partial` |
| V finding exists | `conflict` |
| Only W findings | `gap` |
| Q finding (scope addition) | `addition` |
| C finding (cascade) | `cascade` |

### Card ordering

1. **Cascades** first — systemic cross-document drift
2. **Conflicts** second — highest priority
3. **Gaps** third — missing coverage
4. **Partial** fourth
5. **Additions** fifth
6. **Aligned** last

Within each group, order by severity (BLOCKER > MAJOR > MINOR), then by FR ID.

### Finding chip display

Chips always show **human-readable name first**, code as secondary:

```
[Conflict V1]  [Coverage Gap W3]  [Scope Addition Q2]
```

Never show bare codes like `V1` or `W3` without the category name.

### Data attributes per card

| Attribute | Value |
|-----------|-------|
| `data-status` | aligned / partial / conflict / gap / addition / cascade |
| `data-severity` | blocker / major / minor (highest finding; omit for aligned) |
| `data-fr` | FR ID for search |
| `data-docs` | Space-separated: `prd-ux`, `prd-mock`, `ux-mock` |
| `data-keywords` | Space-separated search terms |

### Column adaptation

| Mode | Columns | grid-template-columns |
|------|---------|----------------------|
| PRD + UX | PRD, UX | `1fr 1fr` |
| PRD + Mock | PRD, Mock | `1fr 1fr` |
| PRD + UX + Mock | PRD, UX, Mock | `1fr 1fr 1fr` |

On viewports < 768px, columns stack vertically (`grid-template-columns: 1fr`).

---

## 3. Heatmap Rules

### Grid structure

- First column (200px): requirement labels with FR ID
- Remaining columns (1fr each): one per document
- PRD column always shows "Source" (amber background)
- Group rows by feature area with `.hm-group` divider rows

### Cell content

Cells show **human-readable status words**:

| Status | Cell text | Meaning |
|--------|-----------|---------|
| source | `Source` | PRD — source of truth |
| aligned | `Aligned` | Covered |
| partial | `Partial` | Incomplete |
| conflict | `Conflict` | Contradicts PRD |
| gap | `Gap` | Not defined |
| addition | `Addition` | Not in PRD |
| na | `N/A` | Not applicable |

### Tooltips

Each cell: `title="{DocName}: {Status}"` (e.g., "UX Design: Aligned")

---

## 4. Pre-Delivery Checklist

### Findings
- [ ] Every finding quotes specific text from source documents
- [ ] Conflict findings cite all involved documents
- [ ] Coverage Gap findings name the PRD requirement and missing document
- [ ] Scope Addition findings name the adding document
- [ ] Cascade findings trace through all three documents
- [ ] Naming Drift findings list terms and context
- [ ] Every finding has a human-readable document pair tag
- [ ] Severities are consistent across all outputs

### Counts
- [ ] Finding IDs globally unique per prefix
- [ ] Summary counts match actual findings
- [ ] Alignment score: aligned / (total - N/A) x 100

### reconciliation.md
- [ ] All sections present per report-template.md
- [ ] Non-provided document sections skipped
- [ ] Reconciliation matrix covers every FR
- [ ] Recommendations organized by severity

### reconciliation-matrix.html
- [ ] Opens in browser without console errors
- [ ] Score ring displays correct percentage and color
- [ ] Metric cards show correct counts
- [ ] Document coverage bars match report data
- [ ] Help panel opens with `?` button and lists all finding types
- [ ] Requirements tab shows correct finding count
- [ ] Search filters cards correctly
- [ ] Status pill filters work
- [ ] Severity filters work
- [ ] Document pair filters work (trilateral only)
- [ ] **Card expands only from header click**, not from detail area
- [ ] **Text in expanded detail is fully selectable and copyable**
- [ ] **Text selection anywhere prevents accidental toggle**
- [ ] Expand All / Collapse All buttons work
- [ ] Keyboard shortcuts work (/, Esc, [, ], Enter, ?, H)
- [ ] Finding chips show **human-readable name + code** (e.g., "Conflict V1")
- [ ] Document pair tags show **plain language** (e.g., "PRD vs UX")
- [ ] Heatmap cells show **status words** (e.g., "Aligned", "Gap")
- [ ] Finding descriptions verbatim from reconciliation.md
- [ ] Cascade chain shows drift narrative with arrows
- [ ] Responsive layout stacks columns on mobile
- [ ] Naming drift table visible when N findings exist
- [ ] Heatmap group dividers match feature areas

### Excalidraw diagrams
- [ ] Valid JSON matching Excalidraw v2 schema
- [ ] Data matches report
- [ ] Circle/column count matches input mode
- [ ] Complete legends with category colors
