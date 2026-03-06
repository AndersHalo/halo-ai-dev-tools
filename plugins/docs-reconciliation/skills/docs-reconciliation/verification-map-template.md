# Verification Map HTML Template (verification-map.html)

This is the static HTML/CSS/JS template for the interactive verification map. It loads `reconciliation-data.json` via `fetch()` and renders screenshot overlays with bounding boxes for Puppeteer-verified elements.

**Output path**: `visual-verification/verification-map.html`

**Data source**: `reconciliation-data.json` (loaded via relative path `../reconciliation-data.json`)

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
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; }

    /* --- Layout --- */
    .app { display: grid; grid-template-columns: 1fr 360px; grid-template-rows: auto 1fr auto; height: 100vh; }
    .header { grid-column: 1 / -1; padding: 16px 24px; background: #1e293b; border-bottom: 1px solid #334155; display: flex; align-items: center; gap: 16px; }
    .header h1 { font-size: 18px; font-weight: 600; }
    .header .stats { margin-left: auto; display: flex; gap: 12px; font-size: 13px; color: #94a3b8; }
    .header .stats .found { color: #22c55e; }
    .header .stats .not-found { color: #ef4444; }

    /* --- Tab bar --- */
    .tab-bar { grid-column: 1 / -1; display: flex; background: #1e293b; border-bottom: 1px solid #334155; padding: 0 24px; }
    .tab-bar button { background: none; border: none; color: #94a3b8; padding: 10px 16px; font-size: 13px; cursor: pointer; border-bottom: 2px solid transparent; }
    .tab-bar button.active { color: #e2e8f0; border-bottom-color: #3b82f6; }

    /* --- Screenshot viewer --- */
    .viewer { position: relative; overflow: auto; background: #020617; }
    .viewer .screenshot-container { position: relative; display: inline-block; }
    .viewer .screenshot-container img { display: block; max-width: none; }
    .viewer .screenshot-container svg { position: absolute; top: 0; left: 0; pointer-events: none; }
    .viewer .screenshot-container svg rect { pointer-events: all; cursor: pointer; stroke-width: 2; fill-opacity: 0.1; }
    .viewer .screenshot-container svg rect:hover { fill-opacity: 0.25; stroke-width: 3; }
    .viewer .screenshot-container svg text { font-size: 11px; font-family: monospace; fill: white; pointer-events: none; }
    .viewer .screenshot-container svg .label-bg { fill-opacity: 0.85; }

    /* --- Side panel --- */
    .side-panel { background: #1e293b; border-left: 1px solid #334155; overflow-y: auto; padding: 16px; }
    .side-panel .empty { color: #64748b; font-size: 13px; padding: 24px 0; text-align: center; }
    .side-panel h3 { font-size: 14px; margin-bottom: 8px; color: #f8fafc; }
    .side-panel .field { margin-bottom: 12px; }
    .side-panel .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 2px; }
    .side-panel .field-value { font-size: 13px; color: #cbd5e1; }
    .side-panel .ux-match { background: #1e3a5f; border: 1px solid #2563eb; border-radius: 6px; padding: 10px; margin-bottom: 12px; }
    .side-panel .ux-match .component-name { font-weight: 600; color: #60a5fa; }
    .side-panel .ux-match .section-ref { font-size: 12px; color: #93c5fd; }
    .side-panel .variants { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
    .side-panel .variant-tag { font-size: 11px; background: #334155; padding: 2px 8px; border-radius: 4px; color: #94a3b8; }
    .side-panel .finding-link { display: block; font-size: 12px; color: #60a5fa; text-decoration: none; margin-top: 4px; }
    .side-panel .finding-link:hover { text-decoration: underline; }
    .side-panel .selector-display { font-family: monospace; font-size: 12px; background: #0f172a; padding: 6px 8px; border-radius: 4px; color: #a5b4fc; word-break: break-all; }

    /* --- Not-found list --- */
    .not-found-section { grid-column: 1 / -1; background: #1e293b; border-top: 1px solid #334155; max-height: 280px; overflow-y: auto; }
    .not-found-section h2 { font-size: 14px; padding: 12px 24px; background: #1e293b; border-bottom: 1px solid #334155; position: sticky; top: 0; }
    .not-found-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .not-found-table th { text-align: left; padding: 8px 12px; background: #0f172a; color: #94a3b8; font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; position: sticky; top: 38px; }
    .not-found-table td { padding: 8px 12px; border-bottom: 1px solid #1e293b; }
    .not-found-table .selectors-tried { font-family: monospace; font-size: 11px; color: #64748b; max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .not-found-table .selectors-tried:hover { white-space: normal; }
    .not-found-table .finding-id { color: #f87171; font-weight: 500; }

    /* --- Filters --- */
    .filters { display: flex; gap: 8px; padding: 8px 24px; background: #0f172a; border-bottom: 1px solid #334155; grid-column: 1 / -1; }
    .filters select, .filters button { background: #1e293b; border: 1px solid #334155; color: #e2e8f0; padding: 4px 10px; border-radius: 4px; font-size: 12px; cursor: pointer; }
    .filters button.active { background: #3b82f6; border-color: #3b82f6; }

    /* --- Status colors --- */
    .status-aligned { stroke: #22c55e; fill: #22c55e; }
    .status-partial { stroke: #f59e0b; fill: #f59e0b; }
    .status-conflict { stroke: #ef4444; fill: #ef4444; }
    .status-gap { stroke: #3b82f6; fill: #3b82f6; }
    .status-na { stroke: #64748b; fill: #64748b; }

    /* --- Legend --- */
    .legend { grid-column: 1 / -1; display: flex; gap: 16px; padding: 8px 24px; background: #0f172a; border-top: 1px solid #334155; font-size: 11px; color: #94a3b8; }
    .legend .item { display: flex; align-items: center; gap: 4px; }
    .legend .swatch { width: 12px; height: 12px; border-radius: 2px; border: 1px solid; }
  </style>
</head>
<body>
  <div class="app">
    <div class="header">
      <h1>Verification Map</h1>
      <div class="stats">
        <span class="found" id="found-count"></span>
        <span class="not-found" id="not-found-count"></span>
      </div>
    </div>
    <div class="filters" id="filters"></div>
    <div class="tab-bar" id="tab-bar"></div>
    <div class="viewer" id="viewer"></div>
    <div class="side-panel" id="side-panel">
      <div class="empty">Click a highlighted element to see details</div>
    </div>
    <div class="not-found-section" id="not-found-section">
      <h2>Not Found Elements</h2>
      <table class="not-found-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Element</th>
            <th>Mock File</th>
            <th>Selectors Tried</th>
            <th>Finding</th>
          </tr>
        </thead>
        <tbody id="not-found-body"></tbody>
      </table>
    </div>
    <div class="legend">
      <div class="item"><div class="swatch" style="background:#22c55e;border-color:#22c55e;"></div> Aligned</div>
      <div class="item"><div class="swatch" style="background:#f59e0b;border-color:#f59e0b;"></div> Partial</div>
      <div class="item"><div class="swatch" style="background:#ef4444;border-color:#ef4444;"></div> Conflict</div>
      <div class="item"><div class="swatch" style="background:#3b82f6;border-color:#3b82f6;"></div> Gap</div>
      <div class="item"><div class="swatch" style="background:#64748b;border-color:#64748b;"></div> N/A</div>
    </div>
  </div>

  <script>
    // --- Data loading ---
    fetch('../reconciliation-data.json')
      .then(r => r.json())
      .then(data => renderVerificationMap(data))
      .catch(err => {
        document.getElementById('viewer').innerHTML =
          `<div style="padding:40px;color:#f87171;">Failed to load reconciliation-data.json: ${err.message}</div>`;
      });

    function renderVerificationMap(data) {
      const vv = data.visualVerification;
      if (!vv || !vv.enabled) {
        document.getElementById('viewer').innerHTML =
          '<div style="padding:40px;color:#94a3b8;">Visual verification was not enabled for this run.</div>';
        return;
      }

      // Stats
      document.getElementById('found-count').textContent = `Found: ${vv.summary.found}`;
      document.getElementById('not-found-count').textContent = `Not found: ${vv.summary.notFound}`;

      // Build requirement lookup for status colors
      const reqMap = {};
      (data.requirements || []).forEach(r => { reqMap[r.id] = r; });

      // Build finding lookup
      const findingMap = {};
      (data.findings || []).forEach(f => { findingMap[f.id] = f; });

      // Group checklist by mock file
      const byMock = {};
      vv.checklist.forEach(item => {
        if (!byMock[item.mockFile]) byMock[item.mockFile] = [];
        byMock[item.mockFile].push(item);
      });

      // Render tabs
      const tabBar = document.getElementById('tab-bar');
      const mockFiles = Object.keys(byMock);
      mockFiles.forEach((file, i) => {
        const btn = document.createElement('button');
        btn.textContent = file.replace(/\.html$/, '');
        btn.className = i === 0 ? 'active' : '';
        btn.onclick = () => showMock(file, btn);
        tabBar.appendChild(btn);
      });

      // Render filters
      const filters = document.getElementById('filters');
      const statusOptions = ['all', 'aligned', 'partial', 'conflict', 'gap'];
      const statusSelect = document.createElement('select');
      statusSelect.id = 'filter-status';
      statusOptions.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s; opt.textContent = s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1);
        statusSelect.appendChild(opt);
      });
      statusSelect.onchange = () => refreshOverlay();
      filters.appendChild(statusSelect);

      // UX component filter (if any matches exist)
      const uxComponents = [...new Set(
        vv.checklist
          .filter(c => c.uxComponentMatch?.componentName)
          .map(c => c.uxComponentMatch.componentName)
      )].sort();
      if (uxComponents.length > 0) {
        const uxSelect = document.createElement('select');
        uxSelect.id = 'filter-ux';
        const allOpt = document.createElement('option');
        allOpt.value = 'all'; allOpt.textContent = 'All UX components';
        uxSelect.appendChild(allOpt);
        uxComponents.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c; opt.textContent = c;
          uxSelect.appendChild(opt);
        });
        uxSelect.onchange = () => refreshOverlay();
        filters.appendChild(uxSelect);
      }

      let currentMock = mockFiles[0];

      function showMock(file, btn) {
        currentMock = file;
        tabBar.querySelectorAll('button').forEach(b => b.className = '');
        btn.className = 'active';
        refreshOverlay();
      }

      function refreshOverlay() {
        const viewer = document.getElementById('viewer');
        const statusFilter = document.getElementById('filter-status')?.value || 'all';
        const uxFilter = document.getElementById('filter-ux')?.value || 'all';

        // Find screenshot path for current mock
        const mockIndex = vv.mocksScanned.indexOf(currentMock);
        const screenshotPath = mockIndex >= 0 ? vv.screenshots[mockIndex] : null;

        const items = byMock[currentMock] || [];
        const foundItems = items.filter(c => c.status === 'found' && c.boundingBox);

        // Build container
        viewer.innerHTML = '';
        const container = document.createElement('div');
        container.className = 'screenshot-container';

        // Screenshot image
        const img = document.createElement('img');
        img.src = screenshotPath ? screenshotPath.replace(/^visual-verification\//, '') : '';
        img.onload = () => {
          svg.setAttribute('width', img.naturalWidth);
          svg.setAttribute('height', img.naturalHeight);
        };
        container.appendChild(img);

        // SVG overlay
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';

        foundItems.forEach(item => {
          // Find the requirement this item relates to
          const req = findRequirementForItem(item, data.requirements);
          const status = req?.overallStatus || 'na';

          // Apply filters
          if (statusFilter !== 'all' && status !== statusFilter) return;
          if (uxFilter !== 'all' && item.uxComponentMatch?.componentName !== uxFilter) return;

          const box = item.boundingBox;
          const statusClass = `status-${status}`;

          // Label background
          const labelText = req ? `${req.id} ${req.title}` : item.name;
          const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          labelBg.setAttribute('x', box.x);
          labelBg.setAttribute('y', box.y - 16);
          labelBg.setAttribute('width', Math.max(labelText.length * 7, 60));
          labelBg.setAttribute('height', 16);
          labelBg.setAttribute('class', `label-bg ${statusClass}`);
          labelBg.setAttribute('rx', '2');
          svg.appendChild(labelBg);

          // Label text
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', box.x + 4);
          text.setAttribute('y', box.y - 4);
          text.textContent = labelText;
          svg.appendChild(text);

          // Bounding box rectangle
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', box.x);
          rect.setAttribute('y', box.y);
          rect.setAttribute('width', box.width);
          rect.setAttribute('height', box.height);
          rect.setAttribute('class', statusClass);
          rect.setAttribute('rx', '3');
          rect.onclick = () => showDetail(item, req, data);
          svg.appendChild(rect);
        });

        container.appendChild(svg);
        viewer.appendChild(container);
      }

      function findRequirementForItem(item, requirements) {
        // Match by source: P1 items are requirements themselves, P3 items match via keywords
        if (item.source === 'P1') {
          return requirements.find(r => r.title.toLowerCase().includes(item.name.toLowerCase())
            || item.name.toLowerCase().includes(r.id.toLowerCase()));
        }
        return requirements.find(r =>
          r.keywords?.toLowerCase().includes(item.name.toLowerCase())
          || r.title.toLowerCase().includes(item.name.toLowerCase())
        );
      }

      function showDetail(item, req, data) {
        const panel = document.getElementById('side-panel');
        let html = '';

        if (req) {
          html += `<h3>${req.id} — ${req.title}</h3>`;
          html += `<div class="field"><div class="field-label">Requirement</div><div class="field-value">${req.description}</div></div>`;
          html += `<div class="field"><div class="field-label">Status</div><div class="field-value">${req.overallStatus}</div></div>`;
          html += `<div class="field"><div class="field-label">Reason</div><div class="field-value">${req.reason || '—'}</div></div>`;
        } else {
          html += `<h3>${item.name}</h3>`;
          html += `<div class="field"><div class="field-label">Source</div><div class="field-value">${item.source}</div></div>`;
        }

        // UX component match
        if (item.uxComponentMatch) {
          const ux = item.uxComponentMatch;
          html += `<div class="ux-match">`;
          html += `<div class="component-name">${ux.componentName}</div>`;
          if (ux.uxSection) html += `<div class="section-ref">${ux.uxSection}</div>`;
          if (ux.variants?.length) {
            html += `<div class="variants">${ux.variants.map(v => `<span class="variant-tag">${v}</span>`).join('')}</div>`;
          }
          html += `</div>`;
        }

        // Matched selector
        html += `<div class="field"><div class="field-label">Matched Selector</div><div class="selector-display">${item.selector}</div></div>`;
        html += `<div class="field"><div class="field-label">Visible</div><div class="field-value">${item.visible ? 'Yes' : 'No'}</div></div>`;

        // Linked findings
        if (req?.findingIds?.length) {
          html += `<div class="field"><div class="field-label">Findings</div>`;
          req.findingIds.forEach(fid => {
            const f = findingMap[fid];
            if (f) {
              html += `<a class="finding-link" href="../reconciliation-matrix.html#${fid}">${fid} — ${f.name} (${f.severity})</a>`;
            }
          });
          html += `</div>`;
        }

        panel.innerHTML = html;
      }

      // Render not-found table
      const notFoundBody = document.getElementById('not-found-body');
      const notFoundItems = vv.checklist.filter(c => c.status === 'not_found');
      notFoundItems.forEach(item => {
        const tr = document.createElement('tr');
        // Find linked W finding
        const wFinding = data.findings.find(f =>
          f.code === 'W' && f.docsTag.includes('Mock')
          && f.description.toLowerCase().includes(item.name.toLowerCase())
        );
        tr.innerHTML = `
          <td>${item.source}</td>
          <td>${item.name}</td>
          <td>${item.mockFile}</td>
          <td class="selectors-tried" title="${(item.selectorsQueried || []).join(', ')}">${(item.selectorsQueried || []).join(', ')}</td>
          <td>${wFinding ? `<a class="finding-link" href="../reconciliation-matrix.html#${wFinding.id}"><span class="finding-id">${wFinding.id}</span></a>` : '—'}</td>
        `;
        notFoundBody.appendChild(tr);
      });

      // Show first mock
      if (mockFiles.length > 0) refreshOverlay();
    }
  </script>
</body>
</html>
```

---

## Key Design Decisions

### Data-template separation
- This HTML file is a **static template** (~8-10KB) that never grows with data
- All element data comes from `reconciliation-data.json` loaded via `fetch('../reconciliation-data.json')`
- Screenshots are loaded as `<img>` from relative paths in the `visual-verification/` directory

### Bounding box rendering
- Uses SVG overlay on top of screenshot `<img>` for precise positioning
- Rectangles use `boundingBox.{x, y, width, height}` directly from the JSON
- Colors derived from the requirement's `overallStatus` field
- Labels show FR ID + short title positioned above each box

### UX component matching display
- When a found element has a non-null `uxComponentMatch`, the side panel shows the UX component name, section reference, and variants
- This connects the visual element on screen to its design system definition

### Screenshot paths
- The template lives at `visual-verification/verification-map.html`
- Screenshots are in the same directory: `visual-verification/mock-*.png`
- JSON is one level up: `../reconciliation-data.json`
- The `img.src` strips the `visual-verification/` prefix since the HTML is already in that directory
