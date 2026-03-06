# Verification Map HTML Template (verification-map.html)

Interactive traceability dashboard that maps **every** PRD requirement and **every** UX component onto mock screenshots. Shows where each requirement is implemented (or missing), which UX component rendered it, and highlights all conflicts and gaps visually.

**Output path**: `visual-verification/verification-map.html`

**Data source**: `reconciliation-data.json` (loaded via relative path `../reconciliation-data.json`)

---

## Design Principles

1. **Complete coverage** — Every requirement from `requirements[]` and every UX component from `inventories.ux.U3` appears in the UI. Nothing is omitted. Found elements get bounding boxes on screenshots; missing elements appear in the gaps panel with clear callouts.
2. **Dual traceability** — Each found element shows both its PRD requirement origin AND its UX component match. The user sees the full chain: PRD requirement -> UX component -> DOM element on screen.
3. **Conflict-first visibility** — Conflicts (red) and gaps (blue) are surfaced prominently. The summary bar shows counts. The gaps/conflicts panel is always visible, not hidden behind a toggle.
4. **Progressive disclosure** — Overview first (screenshot with overlays + summary stats), then detail on click (side panel with full context). Filters let users drill down without losing orientation.
5. **Accessible dark UI** — High contrast, keyboard navigable, readable at a glance.

---

## Template Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Map — {title}</title>
  <style>
    /* --- Reset & Base --- */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.5; }

    /* --- App Shell --- */
    .app { display: grid; grid-template-rows: auto auto auto 1fr auto; height: 100vh; overflow: hidden; }

    /* --- Header --- */
    .header { padding: 14px 24px; background: #1e293b; border-bottom: 1px solid #334155; display: flex; align-items: center; gap: 16px; }
    .header h1 { font-size: 17px; font-weight: 600; white-space: nowrap; }
    .header .subtitle { font-size: 12px; color: #64748b; }
    .header .summary-pills { margin-left: auto; display: flex; gap: 8px; }
    .header .pill { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
    .header .pill-aligned { background: #14532d; color: #4ade80; }
    .header .pill-partial { background: #451a03; color: #fbbf24; }
    .header .pill-conflict { background: #450a0a; color: #f87171; }
    .header .pill-gap { background: #172554; color: #60a5fa; }
    .header .pill-na { background: #1e293b; color: #64748b; border: 1px solid #334155; }
    .header .pill .count { font-size: 14px; }

    /* --- Toolbar (filters + tabs) --- */
    .toolbar { display: flex; align-items: center; background: #0f172a; border-bottom: 1px solid #1e293b; padding: 0 24px; gap: 0; }
    .toolbar .tabs { display: flex; gap: 0; }
    .toolbar .tabs button { background: none; border: none; color: #64748b; padding: 10px 16px; font-size: 13px; cursor: pointer; border-bottom: 2px solid transparent; transition: color 0.15s, border-color 0.15s; }
    .toolbar .tabs button:hover { color: #94a3b8; }
    .toolbar .tabs button.active { color: #e2e8f0; border-bottom-color: #3b82f6; }
    .toolbar .divider { width: 1px; height: 24px; background: #334155; margin: 0 12px; }
    .toolbar .filters { display: flex; gap: 6px; align-items: center; }
    .toolbar select { background: #1e293b; border: 1px solid #334155; color: #e2e8f0; padding: 5px 10px; border-radius: 6px; font-size: 12px; cursor: pointer; }
    .toolbar select:focus { outline: 1px solid #3b82f6; }
    .toolbar .view-toggle { display: flex; gap: 0; margin-left: auto; }
    .toolbar .view-toggle button { background: #1e293b; border: 1px solid #334155; color: #94a3b8; padding: 5px 12px; font-size: 12px; cursor: pointer; }
    .toolbar .view-toggle button:first-child { border-radius: 6px 0 0 6px; }
    .toolbar .view-toggle button:last-child { border-radius: 0 6px 6px 0; border-left: none; }
    .toolbar .view-toggle button.active { background: #3b82f6; border-color: #3b82f6; color: white; }

    /* --- Main content area --- */
    .main { display: grid; grid-template-columns: 1fr 380px; overflow: hidden; }

    /* --- Screenshot viewer (left) --- */
    .viewer { overflow: auto; background: #020617; position: relative; }
    .viewer .screenshot-wrap { position: relative; display: inline-block; min-width: 100%; }
    .viewer .screenshot-wrap img { display: block; max-width: none; }
    .viewer .screenshot-wrap svg { position: absolute; top: 0; left: 0; pointer-events: none; }
    .viewer .screenshot-wrap svg .box-group { pointer-events: all; cursor: pointer; }
    .viewer .screenshot-wrap svg .box-group rect.bbox { stroke-width: 2; fill-opacity: 0.08; transition: fill-opacity 0.15s, stroke-width 0.15s; }
    .viewer .screenshot-wrap svg .box-group:hover rect.bbox { fill-opacity: 0.22; stroke-width: 3; }
    .viewer .screenshot-wrap svg .box-group.selected rect.bbox { fill-opacity: 0.18; stroke-width: 3; stroke-dasharray: none; }
    .viewer .screenshot-wrap svg .box-group rect.label-bg { rx: 3; }
    .viewer .screenshot-wrap svg .box-group text.label { font: 600 11px/1 monospace; fill: #fff; }
    .viewer .screenshot-wrap svg .box-group text.sublabel { font: 400 10px/1 -apple-system, sans-serif; fill: rgba(255,255,255,0.7); }
    .viewer .no-screenshot { padding: 60px; text-align: center; color: #475569; }

    /* --- Side panel (right) --- */
    .side-panel { background: #1e293b; border-left: 1px solid #334155; display: flex; flex-direction: column; overflow: hidden; }
    .side-panel .panel-tabs { display: flex; border-bottom: 1px solid #334155; flex-shrink: 0; }
    .side-panel .panel-tabs button { flex: 1; background: none; border: none; color: #64748b; padding: 10px 8px; font-size: 12px; font-weight: 500; cursor: pointer; border-bottom: 2px solid transparent; transition: color 0.15s; }
    .side-panel .panel-tabs button:hover { color: #94a3b8; }
    .side-panel .panel-tabs button.active { color: #e2e8f0; border-bottom-color: #3b82f6; }
    .side-panel .panel-tabs .badge { background: #ef4444; color: white; font-size: 10px; padding: 1px 6px; border-radius: 10px; margin-left: 4px; }
    .side-panel .panel-content { flex: 1; overflow-y: auto; padding: 0; }

    /* --- Detail view (side panel) --- */
    .detail { padding: 16px; }
    .detail .detail-header { margin-bottom: 16px; }
    .detail .detail-header .req-id { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
    .detail .detail-header .req-id.aligned { color: #4ade80; }
    .detail .detail-header .req-id.partial { color: #fbbf24; }
    .detail .detail-header .req-id.conflict { color: #f87171; }
    .detail .detail-header .req-id.gap { color: #60a5fa; }
    .detail .detail-header .req-id.na { color: #64748b; }
    .detail .detail-header h3 { font-size: 15px; font-weight: 600; color: #f8fafc; margin-bottom: 4px; }
    .detail .detail-header .status-badge { display: inline-block; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
    .detail .detail-header .status-badge.aligned { background: #14532d; color: #4ade80; }
    .detail .detail-header .status-badge.partial { background: #451a03; color: #fbbf24; }
    .detail .detail-header .status-badge.conflict { background: #450a0a; color: #f87171; }
    .detail .detail-header .status-badge.gap { background: #172554; color: #60a5fa; }
    .detail .detail-header .status-badge.na { background: #1e293b; color: #64748b; }
    .detail .section { margin-bottom: 16px; }
    .detail .section-title { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #475569; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px solid #334155; }
    .detail .field { margin-bottom: 8px; }
    .detail .field-label { font-size: 11px; color: #64748b; margin-bottom: 1px; }
    .detail .field-value { font-size: 13px; color: #cbd5e1; }
    .detail .reason-text { font-size: 12px; color: #94a3b8; font-style: italic; background: #0f172a; padding: 8px 10px; border-radius: 6px; border-left: 3px solid #334155; }
    .detail .ux-card { background: #172554; border: 1px solid #1e40af; border-radius: 8px; padding: 12px; margin-bottom: 8px; }
    .detail .ux-card .ux-name { font-weight: 600; font-size: 14px; color: #60a5fa; }
    .detail .ux-card .ux-section { font-size: 12px; color: #93c5fd; margin-top: 2px; }
    .detail .ux-card .ux-variants { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
    .detail .ux-card .ux-variant { font-size: 11px; background: #1e3a5f; padding: 2px 8px; border-radius: 4px; color: #93c5fd; }
    .detail .ux-card-empty { background: #1e293b; border: 1px dashed #334155; border-radius: 8px; padding: 12px; color: #475569; font-size: 12px; text-align: center; }
    .detail .selector-box { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; background: #0f172a; padding: 8px 10px; border-radius: 6px; color: #a5b4fc; word-break: break-all; border: 1px solid #1e293b; }
    .detail .finding-card { background: #0f172a; border-radius: 6px; padding: 10px; margin-bottom: 6px; border-left: 3px solid; }
    .detail .finding-card.blocker { border-left-color: #ef4444; }
    .detail .finding-card.major { border-left-color: #f59e0b; }
    .detail .finding-card.minor { border-left-color: #64748b; }
    .detail .finding-card .finding-header { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
    .detail .finding-card .finding-id { font-weight: 700; font-size: 12px; color: #f8fafc; }
    .detail .finding-card .finding-sev { font-size: 10px; text-transform: uppercase; font-weight: 600; padding: 1px 6px; border-radius: 3px; }
    .detail .finding-card .finding-sev.blocker { background: #450a0a; color: #f87171; }
    .detail .finding-card .finding-sev.major { background: #451a03; color: #fbbf24; }
    .detail .finding-card .finding-sev.minor { background: #1e293b; color: #94a3b8; }
    .detail .finding-card .finding-desc { font-size: 12px; color: #94a3b8; }
    .detail .empty-state { text-align: center; padding: 40px 16px; color: #475569; }
    .detail .empty-state .icon { font-size: 32px; margin-bottom: 8px; opacity: 0.5; }
    .detail .empty-state p { font-size: 13px; }

    /* --- Requirements list (side panel tab) --- */
    .req-list { padding: 0; }
    .req-list .req-row { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-bottom: 1px solid #0f172a; cursor: pointer; transition: background 0.1s; }
    .req-list .req-row:hover { background: #0f172a; }
    .req-list .req-row.selected { background: #172554; }
    .req-list .req-row .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .req-list .req-row .dot.aligned { background: #22c55e; }
    .req-list .req-row .dot.partial { background: #f59e0b; }
    .req-list .req-row .dot.conflict { background: #ef4444; }
    .req-list .req-row .dot.gap { background: #3b82f6; }
    .req-list .req-row .dot.na { background: #475569; }
    .req-list .req-row .req-info { flex: 1; min-width: 0; }
    .req-list .req-row .req-info .req-title { font-size: 13px; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .req-list .req-row .req-info .req-sub { font-size: 11px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .req-list .req-row .dom-tag { font-size: 10px; padding: 2px 6px; border-radius: 4px; flex-shrink: 0; }
    .req-list .req-row .dom-tag.found { background: #14532d; color: #4ade80; }
    .req-list .req-row .dom-tag.not-found { background: #450a0a; color: #f87171; }
    .req-list .req-row .dom-tag.no-mock { background: #1e293b; color: #475569; }

    /* --- UX components list (side panel tab) --- */
    .ux-list { padding: 0; }
    .ux-list .ux-row { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-bottom: 1px solid #0f172a; cursor: pointer; transition: background 0.1s; }
    .ux-list .ux-row:hover { background: #0f172a; }
    .ux-list .ux-row.selected { background: #172554; }
    .ux-list .ux-row .ux-icon { width: 24px; height: 24px; border-radius: 6px; background: #172554; border: 1px solid #1e40af; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #60a5fa; font-weight: 700; flex-shrink: 0; }
    .ux-list .ux-row .ux-info { flex: 1; min-width: 0; }
    .ux-list .ux-row .ux-info .ux-title { font-size: 13px; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ux-list .ux-row .ux-info .ux-sub { font-size: 11px; color: #64748b; }
    .ux-list .ux-row .match-count { font-size: 11px; color: #94a3b8; flex-shrink: 0; }

    /* --- Gaps & Conflicts panel (side panel tab) --- */
    .issues-list { padding: 0; }
    .issues-list .issue-row { padding: 12px 16px; border-bottom: 1px solid #0f172a; cursor: pointer; transition: background 0.1s; }
    .issues-list .issue-row:hover { background: #0f172a; }
    .issues-list .issue-row .issue-header { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
    .issues-list .issue-row .issue-type { font-size: 10px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; padding: 2px 6px; border-radius: 3px; }
    .issues-list .issue-row .issue-type.conflict { background: #450a0a; color: #f87171; }
    .issues-list .issue-row .issue-type.gap { background: #172554; color: #60a5fa; }
    .issues-list .issue-row .issue-req { font-size: 12px; color: #e2e8f0; font-weight: 500; }
    .issues-list .issue-row .issue-desc { font-size: 12px; color: #64748b; margin-top: 2px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .issues-list .issue-row .selectors-tried { font-size: 11px; color: #475569; font-family: monospace; margin-top: 4px; }
    .issues-list .empty-issues { padding: 40px 16px; text-align: center; color: #22c55e; font-size: 13px; }

    /* --- Legend bar --- */
    .legend-bar { display: flex; align-items: center; gap: 16px; padding: 8px 24px; background: #0f172a; border-top: 1px solid #1e293b; font-size: 11px; color: #64748b; flex-shrink: 0; }
    .legend-bar .item { display: flex; align-items: center; gap: 4px; }
    .legend-bar .swatch { width: 10px; height: 10px; border-radius: 2px; }
    .legend-bar .sep { width: 1px; height: 14px; background: #334155; }
    .legend-bar .help { margin-left: auto; color: #475569; }
    .legend-bar kbd { background: #1e293b; border: 1px solid #334155; padding: 1px 5px; border-radius: 3px; font-size: 10px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="app">
    <!-- Header with summary pills -->
    <div class="header">
      <div>
        <h1 id="title">Verification Map</h1>
        <div class="subtitle" id="subtitle"></div>
      </div>
      <div class="summary-pills" id="summary-pills"></div>
    </div>

    <!-- Toolbar: mock tabs + filters + view toggle -->
    <div class="toolbar">
      <div class="tabs" id="mock-tabs"></div>
      <div class="divider"></div>
      <div class="filters">
        <select id="filter-status">
          <option value="all">All statuses</option>
          <option value="aligned">Aligned</option>
          <option value="partial">Partial</option>
          <option value="conflict">Conflict</option>
          <option value="gap">Gap</option>
          <option value="na">N/A</option>
        </select>
        <select id="filter-dom">
          <option value="all">All elements</option>
          <option value="found">Found in DOM</option>
          <option value="not_found">Not found in DOM</option>
        </select>
        <select id="filter-ux"></select>
      </div>
      <div class="view-toggle">
        <button class="active" id="view-screenshot">Screenshot</button>
        <button id="view-list">List</button>
      </div>
    </div>

    <!-- Main content -->
    <div class="main">
      <!-- Left: screenshot viewer -->
      <div class="viewer" id="viewer"></div>

      <!-- Right: side panel -->
      <div class="side-panel">
        <div class="panel-tabs">
          <button class="active" data-panel="detail">Detail</button>
          <button data-panel="requirements">Requirements <span class="badge" id="req-count"></span></button>
          <button data-panel="ux-components">UX Components <span class="badge" id="ux-count" style="background:#3b82f6"></span></button>
          <button data-panel="issues">Issues <span class="badge" id="issue-count"></span></button>
        </div>
        <div class="panel-content" id="panel-content">
          <div class="detail" id="detail-panel">
            <div class="empty-state">
              <div class="icon">&#9678;</div>
              <p>Select a highlighted element on the screenshot or pick a requirement from the list</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="legend-bar">
      <div class="item"><div class="swatch" style="background:#22c55e;"></div> Aligned</div>
      <div class="item"><div class="swatch" style="background:#f59e0b;"></div> Partial</div>
      <div class="item"><div class="swatch" style="background:#ef4444;"></div> Conflict</div>
      <div class="item"><div class="swatch" style="background:#3b82f6;"></div> Gap</div>
      <div class="item"><div class="swatch" style="background:#64748b;"></div> N/A</div>
      <div class="sep"></div>
      <div class="item"><div class="swatch" style="background:#22c55e; border-radius:50%;"></div> Found in DOM</div>
      <div class="item"><div class="swatch" style="background:#ef4444; border:1px dashed #ef4444; background:none;"></div> Not found</div>
      <div class="sep"></div>
      <div class="help"><kbd>/</kbd> Search &nbsp; <kbd>Esc</kbd> Clear &nbsp; <kbd>&uarr;&darr;</kbd> Navigate</div>
    </div>
  </div>

  <script>
    // ========== Data Loading ==========
    fetch('../reconciliation-data.json')
      .then(r => r.json())
      .then(data => init(data))
      .catch(err => {
        document.getElementById('viewer').innerHTML =
          `<div style="padding:60px;color:#f87171;text-align:center;">Failed to load data: ${err.message}</div>`;
      });

    // ========== State ==========
    let DATA, VV, REQ_MAP, FINDING_MAP, UX_COMPONENTS, CHECKLIST_BY_MOCK;
    let currentMock = null, selectedItemId = null, activePanel = 'detail';

    // ========== Init ==========
    function init(data) {
      DATA = data;
      VV = data.visualVerification || { enabled: false, checklist: [], mocksScanned: [], screenshots: [], summary: { total: 0, found: 0, notFound: 0 } };

      // Build lookups
      REQ_MAP = {};
      (data.requirements || []).forEach(r => REQ_MAP[r.id] = r);
      FINDING_MAP = {};
      (data.findings || []).forEach(f => FINDING_MAP[f.id] = f);

      // UX components from inventory
      UX_COMPONENTS = (data.inventories?.ux?.U3 || []);

      // Group checklist by mock
      CHECKLIST_BY_MOCK = {};
      (VV.checklist || []).forEach(item => {
        if (!CHECKLIST_BY_MOCK[item.mockFile]) CHECKLIST_BY_MOCK[item.mockFile] = [];
        CHECKLIST_BY_MOCK[item.mockFile].push(item);
      });

      renderHeader();
      renderMockTabs();
      renderFilters();
      setupPanelTabs();
      setupViewToggle();
      setupKeyboard();

      // Show first mock
      const firstMock = VV.mocksScanned?.[0];
      if (firstMock) selectMock(firstMock);
      showPanel('detail');
    }

    // ========== Header ==========
    function renderHeader() {
      document.getElementById('title').textContent = `Verification Map — ${DATA.meta?.title || 'Reconciliation'}`;
      document.getElementById('subtitle').textContent = `${DATA.meta?.date || ''} | ${(DATA.requirements || []).length} requirements | ${VV.summary?.found || 0} found in DOM | ${VV.summary?.notFound || 0} not found`;

      // Summary pills from requirement statuses
      const counts = { aligned: 0, partial: 0, conflict: 0, gap: 0, na: 0 };
      (DATA.requirements || []).forEach(r => { if (counts[r.overallStatus] !== undefined) counts[r.overallStatus]++; });

      const pills = document.getElementById('summary-pills');
      Object.entries(counts).forEach(([status, count]) => {
        if (count === 0 && status === 'na') return;
        const pill = document.createElement('div');
        pill.className = `pill pill-${status}`;
        pill.innerHTML = `<span class="count">${count}</span> ${status}`;
        pills.appendChild(pill);
      });
    }

    // ========== Mock Tabs ==========
    function renderMockTabs() {
      const tabs = document.getElementById('mock-tabs');
      (VV.mocksScanned || []).forEach(file => {
        const btn = document.createElement('button');
        btn.textContent = file.replace(/\.html$/, '');
        btn.onclick = () => selectMock(file);
        btn.dataset.mock = file;
        tabs.appendChild(btn);
      });
      if (!VV.mocksScanned?.length) {
        tabs.innerHTML = '<button class="active" disabled>No HTML mocks</button>';
      }
    }

    function selectMock(file) {
      currentMock = file;
      document.querySelectorAll('#mock-tabs button').forEach(b => b.classList.toggle('active', b.dataset.mock === file));
      renderScreenshot();
    }

    // ========== Filters ==========
    function renderFilters() {
      // UX component filter
      const uxSelect = document.getElementById('filter-ux');
      const opt0 = document.createElement('option');
      opt0.value = 'all'; opt0.textContent = 'All UX components';
      uxSelect.appendChild(opt0);
      const matched = [...new Set(VV.checklist.filter(c => c.uxComponentMatch?.componentName).map(c => c.uxComponentMatch.componentName))].sort();
      matched.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name; opt.textContent = name;
        uxSelect.appendChild(opt);
      });
      if (!matched.length) uxSelect.style.display = 'none';

      // Attach filter listeners
      document.getElementById('filter-status').onchange = renderScreenshot;
      document.getElementById('filter-dom').onchange = renderScreenshot;
      uxSelect.onchange = renderScreenshot;
    }

    // ========== Screenshot Viewer ==========
    function renderScreenshot() {
      const viewer = document.getElementById('viewer');
      if (!currentMock) {
        viewer.innerHTML = '<div class="no-screenshot">No mock selected</div>';
        return;
      }

      const mockIdx = VV.mocksScanned.indexOf(currentMock);
      const screenshotPath = mockIdx >= 0 && VV.screenshots[mockIdx] ? VV.screenshots[mockIdx].replace(/^visual-verification\//, '') : null;

      const statusFilter = document.getElementById('filter-status').value;
      const domFilter = document.getElementById('filter-dom').value;
      const uxFilter = document.getElementById('filter-ux').value;

      viewer.innerHTML = '';
      const wrap = document.createElement('div');
      wrap.className = 'screenshot-wrap';

      // Image
      if (screenshotPath) {
        const img = document.createElement('img');
        img.src = screenshotPath;
        img.onload = () => {
          svg.setAttribute('width', img.naturalWidth);
          svg.setAttribute('height', img.naturalHeight);
        };
        wrap.appendChild(img);
      }

      // SVG overlay
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '0');
      svg.setAttribute('height', '0');
      svg.style.cssText = 'position:absolute;top:0;left:0;';

      const items = CHECKLIST_BY_MOCK[currentMock] || [];
      items.forEach((item, i) => {
        const req = findReqForItem(item);
        const status = req?.overallStatus || 'na';

        // Apply filters
        if (statusFilter !== 'all' && status !== statusFilter) return;
        if (domFilter !== 'all' && item.status !== domFilter) return;
        if (uxFilter !== 'all' && item.uxComponentMatch?.componentName !== uxFilter) return;

        if (item.status === 'found' && item.boundingBox) {
          const box = item.boundingBox;
          const color = statusColor(status);
          const itemId = `item-${i}`;

          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.setAttribute('class', `box-group ${selectedItemId === itemId ? 'selected' : ''}`);
          g.onclick = () => { selectedItemId = itemId; selectItem(item, req); renderScreenshot(); };

          // Label background
          const labelText = req ? `${req.id}` : item.name;
          const uxLabel = item.uxComponentMatch?.componentName ? ` ${item.uxComponentMatch.componentName}` : '';
          const fullLabel = labelText + uxLabel;
          const labelW = Math.max(fullLabel.length * 7 + 12, 50);
          const labelH = uxLabel ? 28 : 16;

          const lbg = svgRect(box.x, box.y - labelH - 2, labelW, labelH, color, 0.9);
          lbg.setAttribute('class', 'label-bg');
          g.appendChild(lbg);

          // FR ID label
          const txt = svgText(box.x + 6, box.y - (uxLabel ? 16 : 6), labelText, 'label');
          g.appendChild(txt);

          // UX component sublabel
          if (uxLabel) {
            const sub = svgText(box.x + 6, box.y - 4, uxLabel.trim(), 'sublabel');
            g.appendChild(sub);
          }

          // Bounding box
          const rect = svgRect(box.x, box.y, box.width, box.height, color, 0.08);
          rect.setAttribute('class', 'bbox');
          rect.setAttribute('stroke', color);
          rect.setAttribute('fill', color);
          g.appendChild(rect);

          svg.appendChild(g);
        }
      });

      wrap.appendChild(svg);
      viewer.appendChild(wrap);
    }

    function svgRect(x, y, w, h, fill, opacity) {
      const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      r.setAttribute('x', x); r.setAttribute('y', y);
      r.setAttribute('width', w); r.setAttribute('height', h);
      r.setAttribute('fill', fill); r.setAttribute('fill-opacity', opacity);
      r.setAttribute('rx', '3');
      return r;
    }

    function svgText(x, y, text, cls) {
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', x); t.setAttribute('y', y);
      t.setAttribute('class', cls);
      t.textContent = text;
      return t;
    }

    function statusColor(status) {
      return { aligned: '#22c55e', partial: '#f59e0b', conflict: '#ef4444', gap: '#3b82f6', na: '#64748b' }[status] || '#64748b';
    }

    // ========== Item matching ==========
    function findReqForItem(item) {
      if (!DATA.requirements) return null;
      // Try direct ID match first
      const byId = DATA.requirements.find(r => r.id.toLowerCase() === item.name.toLowerCase());
      if (byId) return byId;
      // Match by keyword/title
      const nameLower = item.name.toLowerCase();
      return DATA.requirements.find(r =>
        r.title?.toLowerCase().includes(nameLower) ||
        r.keywords?.toLowerCase().includes(nameLower) ||
        nameLower.includes(r.title?.toLowerCase())
      );
    }

    // ========== Side Panel ==========
    function setupPanelTabs() {
      document.querySelectorAll('.panel-tabs button').forEach(btn => {
        btn.onclick = () => showPanel(btn.dataset.panel);
      });
      // Badge counts
      document.getElementById('req-count').textContent = (DATA.requirements || []).length;
      document.getElementById('ux-count').textContent = UX_COMPONENTS.length;
      const issueCount = (DATA.requirements || []).filter(r => r.overallStatus === 'conflict' || r.overallStatus === 'gap').length;
      document.getElementById('issue-count').textContent = issueCount;
      if (issueCount === 0) document.getElementById('issue-count').style.display = 'none';
    }

    function showPanel(panel) {
      activePanel = panel;
      document.querySelectorAll('.panel-tabs button').forEach(b => b.classList.toggle('active', b.dataset.panel === panel));
      const content = document.getElementById('panel-content');

      if (panel === 'detail') {
        if (!selectedItemId) {
          content.innerHTML = `<div class="detail"><div class="empty-state"><div class="icon">&#9678;</div><p>Select a highlighted element on the screenshot or pick a requirement from the list</p></div></div>`;
        }
      } else if (panel === 'requirements') {
        renderReqList(content);
      } else if (panel === 'ux-components') {
        renderUxList(content);
      } else if (panel === 'issues') {
        renderIssuesList(content);
      }
    }

    // ========== Requirements List ==========
    function renderReqList(container) {
      let html = '<div class="req-list">';
      (DATA.requirements || []).forEach(req => {
        // Find if this requirement has a Puppeteer checklist match
        const checklistItem = (VV.checklist || []).find(c => findReqForItem(c)?.id === req.id);
        const domStatus = checklistItem ? checklistItem.status : 'no-mock';
        const domLabel = domStatus === 'found' ? 'DOM' : domStatus === 'not_found' ? 'Missing' : '---';
        const domClass = domStatus === 'found' ? 'found' : domStatus === 'not_found' ? 'not-found' : 'no-mock';

        html += `<div class="req-row" onclick="selectRequirement('${req.id}')">
          <div class="dot ${req.overallStatus}"></div>
          <div class="req-info">
            <div class="req-title">${req.id} — ${req.title}</div>
            <div class="req-sub">${req.reason || req.overallStatus}</div>
          </div>
          <div class="dom-tag ${domClass}">${domLabel}</div>
        </div>`;
      });
      html += '</div>';
      container.innerHTML = html;
    }

    // ========== UX Components List ==========
    function renderUxList(container) {
      if (!UX_COMPONENTS.length) {
        container.innerHTML = '<div class="detail"><div class="empty-state"><p>No UX components in inventory (U3 not provided)</p></div></div>';
        return;
      }
      let html = '<div class="ux-list">';
      UX_COMPONENTS.forEach((comp, i) => {
        const name = comp.name || comp.component || comp.title || `Component ${i + 1}`;
        const matchCount = (VV.checklist || []).filter(c => c.uxComponentMatch?.componentName === name).length;
        html += `<div class="ux-row" onclick="selectUxComponent(${i})">
          <div class="ux-icon">U</div>
          <div class="ux-info">
            <div class="ux-title">${name}</div>
            <div class="ux-sub">${comp.page || comp.pages || ''}</div>
          </div>
          <div class="match-count">${matchCount ? matchCount + ' match' + (matchCount > 1 ? 'es' : '') : 'No match'}</div>
        </div>`;
      });
      html += '</div>';
      container.innerHTML = html;
    }

    // ========== Issues List (Gaps + Conflicts) ==========
    function renderIssuesList(container) {
      const issues = (DATA.requirements || []).filter(r => r.overallStatus === 'conflict' || r.overallStatus === 'gap');
      if (!issues.length) {
        container.innerHTML = '<div class="issues-list"><div class="empty-issues">No conflicts or gaps found</div></div>';
        return;
      }
      let html = '<div class="issues-list">';
      issues.forEach(req => {
        const type = req.overallStatus;
        const checklistItem = (VV.checklist || []).find(c => findReqForItem(c)?.id === req.id && c.status === 'not_found');
        const findings = (req.findingIds || []).map(id => FINDING_MAP[id]).filter(Boolean);
        const topFinding = findings[0];

        html += `<div class="issue-row" onclick="selectRequirement('${req.id}')">
          <div class="issue-header">
            <span class="issue-type ${type}">${type}</span>
            <span class="issue-req">${req.id} — ${req.title}</span>
          </div>
          <div class="issue-desc">${req.reason || topFinding?.description || ''}</div>
          ${checklistItem ? `<div class="selectors-tried">DOM: Not found (${(checklistItem.selectorsQueried || []).length} selectors tried)</div>` : ''}
        </div>`;
      });
      html += '</div>';
      container.innerHTML = html;
    }

    // ========== Select handlers ==========
    function selectItem(item, req) {
      showPanel('detail');
      const content = document.getElementById('panel-content');
      let html = '<div class="detail">';

      // Header
      html += '<div class="detail-header">';
      if (req) {
        html += `<div class="req-id ${req.overallStatus}">${req.id}</div>`;
        html += `<h3>${req.title}</h3>`;
        html += `<span class="status-badge ${req.overallStatus}">${req.overallStatus}</span>`;
      } else {
        html += `<h3>${item.name}</h3>`;
        html += `<div style="font-size:12px;color:#64748b;">${item.source} inventory item</div>`;
      }
      html += '</div>';

      // PRD section
      if (req) {
        html += '<div class="section"><div class="section-title">PRD Requirement</div>';
        html += `<div class="field"><div class="field-value">${req.description}</div></div>`;
        if (req.reason) html += `<div class="reason-text">${req.reason}</div>`;
        html += '</div>';
      }

      // UX Component section
      html += '<div class="section"><div class="section-title">UX Component</div>';
      if (item.uxComponentMatch) {
        const ux = item.uxComponentMatch;
        html += `<div class="ux-card">`;
        html += `<div class="ux-name">${ux.componentName}</div>`;
        if (ux.uxSection) html += `<div class="ux-section">${ux.uxSection}</div>`;
        if (ux.variants?.length) {
          html += `<div class="ux-variants">${ux.variants.map(v => `<span class="ux-variant">${v}</span>`).join('')}</div>`;
        }
        html += '</div>';
      } else {
        html += '<div class="ux-card-empty">No UX component matched to this element</div>';
      }
      html += '</div>';

      // DOM Detection section
      html += '<div class="section"><div class="section-title">DOM Detection</div>';
      html += `<div class="field"><div class="field-label">Status</div><div class="field-value">${item.status === 'found' ? 'Found in DOM' : 'Not found'}</div></div>`;
      if (item.selector) html += `<div class="field"><div class="field-label">Matched Selector</div><div class="selector-box">${item.selector}</div></div>`;
      if (item.visible !== null) html += `<div class="field"><div class="field-label">Visible</div><div class="field-value">${item.visible ? 'Yes' : 'No'}</div></div>`;
      if (item.boundingBox) html += `<div class="field"><div class="field-label">Position</div><div class="field-value" style="font-family:monospace;font-size:12px;">${item.boundingBox.x}, ${item.boundingBox.y} (${item.boundingBox.width} x ${item.boundingBox.height})</div></div>`;
      if (item.status === 'not_found' && item.selectorsQueried?.length) {
        html += `<div class="field"><div class="field-label">Selectors Tried (${item.selectorsQueried.length})</div><div class="selector-box">${item.selectorsQueried.join('<br>')}</div></div>`;
      }
      html += '</div>';

      // Findings section
      const findings = req ? (req.findingIds || []).map(id => FINDING_MAP[id]).filter(Boolean) : [];
      if (findings.length) {
        html += '<div class="section"><div class="section-title">Findings</div>';
        findings.forEach(f => {
          html += `<div class="finding-card ${f.severity}">`;
          html += `<div class="finding-header"><span class="finding-id">${f.id}</span><span class="finding-sev ${f.severity}">${f.severity}</span><span style="font-size:11px;color:#64748b;">${f.docsTag}</span></div>`;
          html += `<div class="finding-desc">${f.description}</div>`;
          html += '</div>';
        });
        html += '</div>';
      }

      html += '</div>';
      content.innerHTML = html;
    }

    window.selectRequirement = function(reqId) {
      const req = REQ_MAP[reqId];
      if (!req) return;
      // Find matching checklist item
      const item = (VV.checklist || []).find(c => findReqForItem(c)?.id === reqId) || {
        source: 'P1', name: req.title, mockFile: currentMock, status: 'not_found',
        selector: null, visible: null, boundingBox: null, selectorsQueried: [], uxComponentMatch: null
      };
      selectedItemId = `req-${reqId}`;
      selectItem(item, req);
      showPanel('detail');
    };

    window.selectUxComponent = function(idx) {
      const comp = UX_COMPONENTS[idx];
      if (!comp) return;
      const name = comp.name || comp.component || comp.title || '';
      // Find checklist items that match this UX component
      const matches = (VV.checklist || []).filter(c => c.uxComponentMatch?.componentName === name);
      const content = document.getElementById('panel-content');
      let html = '<div class="detail">';
      html += `<div class="detail-header"><div class="req-id" style="color:#60a5fa;">UX COMPONENT</div><h3>${name}</h3></div>`;
      html += `<div class="section"><div class="section-title">Component Details</div>`;
      Object.entries(comp).forEach(([key, val]) => {
        if (val && typeof val === 'string') html += `<div class="field"><div class="field-label">${key}</div><div class="field-value">${val}</div></div>`;
      });
      html += '</div>';
      if (matches.length) {
        html += `<div class="section"><div class="section-title">Found in DOM (${matches.length})</div>`;
        matches.forEach(m => {
          const req = findReqForItem(m);
          html += `<div class="finding-card minor" style="cursor:pointer;" onclick="selectRequirement('${req?.id || ''}')">`;
          html += `<div class="finding-header"><span class="finding-id">${req?.id || m.name}</span><span style="font-size:11px;color:#4ade80;">found</span></div>`;
          html += `<div class="finding-desc">${m.selector} on ${m.mockFile}</div>`;
          html += '</div>';
        });
        html += '</div>';
      } else {
        html += '<div class="section"><div class="section-title">DOM Matches</div><div class="ux-card-empty">No DOM elements matched to this component</div></div>';
      }
      html += '</div>';
      content.innerHTML = html;
      showPanel('detail');
    };

    // ========== View Toggle ==========
    function setupViewToggle() {
      document.getElementById('view-screenshot').onclick = () => {
        document.getElementById('view-screenshot').classList.add('active');
        document.getElementById('view-list').classList.remove('active');
        renderScreenshot();
      };
      document.getElementById('view-list').onclick = () => {
        document.getElementById('view-list').classList.add('active');
        document.getElementById('view-screenshot').classList.remove('active');
        renderListView();
      };
    }

    function renderListView() {
      const viewer = document.getElementById('viewer');
      const items = CHECKLIST_BY_MOCK[currentMock] || [];
      let html = '<div style="padding:16px;">';
      html += '<table style="width:100%;border-collapse:collapse;font-size:13px;">';
      html += '<thead><tr style="border-bottom:1px solid #334155;"><th style="text-align:left;padding:8px;color:#64748b;font-size:11px;">Requirement</th><th style="text-align:left;padding:8px;color:#64748b;font-size:11px;">UX Component</th><th style="text-align:left;padding:8px;color:#64748b;font-size:11px;">Status</th><th style="text-align:left;padding:8px;color:#64748b;font-size:11px;">DOM</th><th style="text-align:left;padding:8px;color:#64748b;font-size:11px;">Selector</th></tr></thead><tbody>';

      // Show ALL requirements, not just checklist items
      (DATA.requirements || []).forEach(req => {
        const item = items.find(c => findReqForItem(c)?.id === req.id);
        const uxName = item?.uxComponentMatch?.componentName || '---';
        const domStatus = item ? item.status : '---';
        const selector = item?.selector || '---';
        const statusBg = { aligned: '#14532d', partial: '#451a03', conflict: '#450a0a', gap: '#172554', na: '#1e293b' }[req.overallStatus] || '#1e293b';
        const statusFg = statusColor(req.overallStatus);

        html += `<tr style="border-bottom:1px solid #1e293b;cursor:pointer;" onclick="selectRequirement('${req.id}')">`;
        html += `<td style="padding:8px;"><span style="color:${statusFg};font-weight:600;">${req.id}</span> ${req.title}</td>`;
        html += `<td style="padding:8px;color:#60a5fa;">${uxName}</td>`;
        html += `<td style="padding:8px;"><span style="background:${statusBg};color:${statusFg};padding:2px 6px;border-radius:4px;font-size:11px;font-weight:600;">${req.overallStatus}</span></td>`;
        html += `<td style="padding:8px;"><span style="color:${domStatus === 'found' ? '#4ade80' : domStatus === 'not_found' ? '#f87171' : '#475569'};font-size:12px;">${domStatus}</span></td>`;
        html += `<td style="padding:8px;font-family:monospace;font-size:11px;color:#64748b;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${selector}</td>`;
        html += '</tr>';
      });

      html += '</tbody></table></div>';
      viewer.innerHTML = html;
    }

    // ========== Keyboard ==========
    function setupKeyboard() {
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { selectedItemId = null; showPanel('detail'); renderScreenshot(); }
        if (e.key === '1') showPanel('detail');
        if (e.key === '2') showPanel('requirements');
        if (e.key === '3') showPanel('ux-components');
        if (e.key === '4') showPanel('issues');
      });
    }
  </script>
</body>
</html>
```

---

## Key Design Decisions

### Complete requirement coverage
Every requirement from `requirements[]` appears in the Requirements panel and List view, regardless of whether Puppeteer found it in the DOM. Requirements without a checklist match show a "---" DOM status, making it clear they were not verified (e.g., backend requirements, or components not in the scanned mock).

### Complete UX component coverage
Every UX component from `inventories.ux.U3` appears in the UX Components panel. Each shows how many DOM matches it has. Components with zero matches are clearly marked, helping identify UX components that may not be implemented.

### Dual traceability on every element
Bounding box labels show both the FR ID and the UX component name. The detail panel has dedicated sections for PRD (requirement text + reason) and UX (component name + section + variants), making the full chain visible.

### Conflict and gap prominence
- Summary pills in the header show counts by status, with conflicts in red and gaps in blue
- Dedicated "Issues" panel tab with a red badge count
- Issues list shows each conflict/gap requirement with its reason and Puppeteer evidence
- Bounding box colors on screenshots make conflicts (red) and gaps (blue) immediately visible

### Three views for different workflows
1. **Screenshot view** — Visual verification with bounding boxes (default)
2. **List view** — Table of ALL requirements with columns for UX component, status, DOM status, and selector
3. **Issues view** — Focused list of only conflicts and gaps

### Data-template separation
Static HTML template (~15KB constant) loads all data from `reconciliation-data.json` via fetch. No inline data. File size never grows with audit size.
