# PRD vs. Mock Audit — Reference Guide

Complete templates and patterns for generating annotated HTML audit files.

---

## Full Annotation CSS

Add this entire block to the `<style>` of each annotated HTML file. These styles assume the page already has a `--font-body` CSS variable defined (falls back to Inter/system sans-serif).

```css
/* ============================================================
   ANNOTATION SYSTEM — Panel, Highlights, Tooltips, Animations
   ============================================================ */

/* --- Toggle Button (fixed pill, top-right) --- */
.ann-toggle-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10001;
  background: linear-gradient(135deg, #1e1b4b, #312e81);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-family: var(--font-body, 'Inter', -apple-system, sans-serif);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
}
.ann-toggle-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(0,0,0,0.4);
}
.ann-toggle-btn .ann-count {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.ann-toggle-btn .dot-r  { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; }
.ann-toggle-btn .dot-b  { width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; }
.ann-toggle-btn .dot-y  { width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; }
.ann-toggle-btn .dot-g  { width: 8px; height: 8px; border-radius: 50%; background: #10b981; }
.ann-toggle-btn .dot-o  { width: 8px; height: 8px; border-radius: 50%; background: #f97316; }
.ann-toggle-btn .dot-gr { width: 8px; height: 8px; border-radius: 50%; background: #9ca3af; }
.ann-toggle-btn .dot-p  { width: 8px; height: 8px; border-radius: 50%; background: #8b5cf6; }
.ann-toggle-btn .dot-t  { width: 8px; height: 8px; border-radius: 50%; background: #14b8a6; }

/* --- Panel Container --- */
.ann-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  z-index: 10000;
  background: #18181b;
  color: #e4e4e7;
  font-family: var(--font-body, 'Inter', -apple-system, sans-serif);
  box-shadow: -4px 0 30px rgba(0,0,0,0.35);
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.ann-panel.open { transform: translateX(0); }

/* --- Panel Header --- */
.ann-panel-head {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #27272a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.ann-panel-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
}
.ann-panel-page {
  font-size: 11px;
  font-weight: 500;
  color: #71717a;
  padding: 3px 10px;
  background: #27272a;
  border-radius: 12px;
}
.ann-close-btn {
  background: none;
  border: 1px solid #3f3f46;
  color: #a1a1aa;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.ann-close-btn:hover {
  background: #27272a;
  color: #fff;
  border-color: #52525b;
}

/* --- Summary Stats Bar --- */
.ann-stats {
  display: flex;
  gap: 16px;
  padding: 10px 24px;
  border-bottom: 1px solid #27272a;
  flex-shrink: 0;
  align-items: baseline;
}
.ann-stat {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 11px;
  color: #71717a;
}
.ann-stat-num {
  font-weight: 700;
  font-size: 16px;
}
.ann-stat-num.total   { color: #fff; }
.ann-stat-num.blocker { color: #f87171; }
.ann-stat-num.major   { color: #fb923c; }
.ann-stat-num.minor   { color: #a1a1aa; }

/* --- Search Input --- */
.ann-search-wrap {
  padding: 8px 24px 12px;
  border-bottom: 1px solid #27272a;
  flex-shrink: 0;
}
.ann-search {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #3f3f46;
  background: #27272a;
  color: #e4e4e7;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}
.ann-search:focus { border-color: #6366f1; }
.ann-search::placeholder { color: #52525b; }

/* --- Legend (2-row grid) --- */
.ann-legend {
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 6px 14px;
  padding: 12px 24px;
  border-bottom: 1px solid #27272a;
  flex-shrink: 0;
}
.ann-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #a1a1aa;
}
.ann-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.ann-legend-dot.red    { background: #ef4444; }
.ann-legend-dot.blue   { background: #3b82f6; }
.ann-legend-dot.yellow { background: #f59e0b; }
.ann-legend-dot.green  { background: #10b981; }
.ann-legend-dot.orange { background: #f97316; }
.ann-legend-dot.gray   { background: #9ca3af; }
.ann-legend-dot.purple { background: #8b5cf6; }
.ann-legend-dot.teal   { background: #14b8a6; }

/* --- Scrollable Body --- */
.ann-scroll {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #3f3f46 transparent;
}
.ann-scroll::-webkit-scrollbar { width: 5px; }
.ann-scroll::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 3px; }
.ann-scroll::-webkit-scrollbar-track { background: transparent; }

/* --- Collapsible Sections --- */
.ann-section { border-bottom: 1px solid #27272a; }
.ann-section-head {
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}
.ann-section-head:hover { background: #1f1f23; }
.ann-section-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}
.ann-section-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ann-section-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  padding: 0 8px;
}
.ann-section-count.red    { background: rgba(239,68,68,0.15); color: #f87171; }
.ann-section-count.blue   { background: rgba(59,130,246,0.15); color: #60a5fa; }
.ann-section-count.yellow { background: rgba(245,158,11,0.15); color: #fbbf24; }
.ann-section-count.green  { background: rgba(16,185,129,0.15); color: #34d399; }
.ann-section-count.orange { background: rgba(249,115,22,0.15); color: #fb923c; }
.ann-section-count.gray   { background: rgba(156,163,175,0.15); color: #d1d5db; }
.ann-section-count.purple { background: rgba(139,92,246,0.15); color: #a78bfa; }
.ann-section-count.teal   { background: rgba(20,184,166,0.15); color: #2dd4bf; }
.ann-filter-toggle {
  background: none;
  border: none;
  color: #71717a;
  cursor: pointer;
  padding: 2px 4px;
  font-size: 16px;
  line-height: 1;
  transition: color 0.2s;
}
.ann-filter-toggle:hover { color: #e4e4e7; }
.ann-filter-toggle.off { color: #3f3f46; }
.ann-section-chevron {
  font-size: 12px;
  color: #52525b;
  transition: transform 0.25s ease;
}
.ann-section.collapsed .ann-section-chevron { transform: rotate(-90deg); }
.ann-section.collapsed .ann-section-body { display: none; }
.ann-section.cat-hidden .ann-section-body { display: none; }
.ann-section.cat-hidden .ann-section-head { opacity: 0.4; }

.ann-section-body { padding: 4px 24px 16px; }

/* --- Finding Items --- */
.ann-item {
  padding: 12px 0;
  border-bottom: 1px solid #27272a;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.15s;
}
.ann-item:last-child { border-bottom: none; }
.ann-item:hover { background: rgba(255,255,255,0.03); }
.ann-item.active {
  background: rgba(99,102,241,0.1);
  border-left: 2px solid #6366f1;
  padding-left: 10px;
}
.ann-item-badge {
  flex-shrink: 0;
  min-width: 36px;
  height: 22px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  margin-top: 2px;
}
.ann-item-badge.red    { background: #ef4444; }
.ann-item-badge.blue   { background: #3b82f6; }
.ann-item-badge.yellow { background: #f59e0b; }
.ann-item-badge.green  { background: #10b981; }
.ann-item-badge.orange { background: #f97316; }
.ann-item-badge.gray   { background: #9ca3af; }
.ann-item-badge.purple { background: #8b5cf6; }
.ann-item-badge.teal   { background: #14b8a6; }
.ann-item-content { flex: 1; min-width: 0; }
.ann-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}
.ann-item-title {
  font-size: 13px;
  font-weight: 600;
  color: #fafafa;
  line-height: 1.3;
}
.ann-item-desc {
  font-size: 12px;
  color: #a1a1aa;
  line-height: 1.5;
}

/* --- Severity Pills --- */
.ann-severity {
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
}
.ann-severity.blocker { background: rgba(239,68,68,0.15); color: #f87171; }
.ann-severity.major   { background: rgba(249,115,22,0.15); color: #fb923c; }
.ann-severity.minor   { background: rgba(161,161,170,0.15); color: #a1a1aa; }

/* --- Keyboard Hint --- */
.ann-kbd-hint {
  padding: 6px 24px 10px;
  font-size: 11px;
  color: #3f3f46;
  border-top: 1px solid #27272a;
  flex-shrink: 0;
  display: flex;
  gap: 12px;
}
.ann-kbd-hint kbd {
  padding: 1px 5px;
  border-radius: 3px;
  background: #27272a;
  border: 1px solid #3f3f46;
  font-family: inherit;
  font-size: 10px;
  color: #71717a;
}

/* ============================================================
   INLINE HIGHLIGHTS — Applied directly to mock page elements
   All badges positioned at top-right for consistency.
   ============================================================ */

/* Contradiction (Red) */
.annotation-highlight {
  position: relative;
  outline: 3px dashed #ef4444 !important;
  outline-offset: 4px;
}
.annotation-badge {
  position: absolute;
  top: -14px;
  right: -14px;
  width: 28px;
  height: 28px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(239,68,68,0.4);
  cursor: pointer;
  transition: transform 0.15s;
}
.annotation-badge:hover { transform: scale(1.15); }

/* Gap / Missing (Blue) */
.gap-highlight {
  position: relative;
  outline: 3px dashed #3b82f6 !important;
  outline-offset: 4px;
}
.gap-badge {
  position: absolute;
  top: -14px;
  right: -14px;
  width: 28px;
  height: 28px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(59,130,246,0.4);
  cursor: pointer;
  transition: transform 0.15s;
}
.gap-badge:hover { transform: scale(1.15); }

/* Accessibility (Yellow) */
.a11y-highlight {
  position: relative;
  outline: 3px dashed #f59e0b !important;
  outline-offset: 4px;
}
.a11y-badge {
  position: absolute;
  top: -14px;
  right: -14px;
  width: 28px;
  height: 28px;
  background: #f59e0b;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(245,158,11,0.4);
  cursor: pointer;
  transition: transform 0.15s;
}
.a11y-badge:hover { transform: scale(1.15); }

/* Design Decision (Green) */
.decision-highlight {
  position: relative;
  outline: 3px dashed #10b981 !important;
  outline-offset: 4px;
}
.decision-badge {
  position: absolute;
  top: -14px;
  right: -14px;
  width: 28px;
  height: 28px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(16,185,129,0.4);
  cursor: pointer;
  transition: transform 0.15s;
}
.decision-badge:hover { transform: scale(1.15); }

/* Scope Creep (Orange) */
.scope-creep-highlight {
  position: relative;
  outline: 3px dashed #f97316 !important;
  outline-offset: 4px;
}
.scope-creep-badge {
  position: absolute;
  top: -14px;
  right: -14px;
  width: 28px;
  height: 28px;
  background: #f97316;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(249,115,22,0.4);
  cursor: pointer;
  transition: transform 0.15s;
}
.scope-creep-badge:hover { transform: scale(1.15); }

/* Placeholder (Gray) */
.placeholder-highlight {
  position: relative;
  outline: 3px dashed #9ca3af !important;
  outline-offset: 4px;
}
.placeholder-badge {
  position: absolute;
  top: -14px;
  right: -14px;
  width: 28px;
  height: 28px;
  background: #9ca3af;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(156,163,175,0.4);
  cursor: pointer;
  transition: transform 0.15s;
}
.placeholder-badge:hover { transform: scale(1.15); }

/* Component Inconsistency (Purple) */
.consistency-highlight {
  position: relative;
  outline: 3px dashed #8b5cf6 !important;
  outline-offset: 4px;
}
.consistency-badge {
  position: absolute;
  top: -14px;
  right: -14px;
  width: 28px;
  height: 28px;
  background: #8b5cf6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(139,92,246,0.4);
  cursor: pointer;
  transition: transform 0.15s;
}
.consistency-badge:hover { transform: scale(1.15); }

/* Mock Self-Validation (Teal) */
.coherence-highlight {
  position: relative;
  outline: 3px dashed #14b8a6 !important;
  outline-offset: 4px;
}
.coherence-badge {
  position: absolute;
  top: -14px;
  right: -14px;
  width: 28px;
  height: 28px;
  background: #14b8a6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(20,184,166,0.4);
  cursor: pointer;
  transition: transform 0.15s;
}
.coherence-badge:hover { transform: scale(1.15); }

/* ============================================================
   HOVER TOOLTIP — Shows finding summary on badge hover
   ============================================================ */
.ann-tooltip {
  display: none;
  position: fixed;
  z-index: 10002;
  background: #27272a;
  color: #e4e4e7;
  padding: 10px 14px;
  border-radius: 8px;
  font-family: var(--font-body, 'Inter', -apple-system, sans-serif);
  font-size: 12px;
  line-height: 1.4;
  max-width: 280px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  pointer-events: none;
  border-left: 3px solid var(--ann-tt-color, #71717a);
}
.ann-tooltip-id {
  font-weight: 700;
  margin-bottom: 2px;
}
.ann-tooltip-title {
  color: #fafafa;
}
.ann-tooltip-sev {
  display: inline-block;
  margin-top: 4px;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}
.ann-tooltip-sev.blocker { background: rgba(239,68,68,0.2); color: #f87171; }
.ann-tooltip-sev.major   { background: rgba(249,115,22,0.2); color: #fb923c; }
.ann-tooltip-sev.minor   { background: rgba(161,161,170,0.2); color: #a1a1aa; }

/* ============================================================
   PULSE ANIMATION — Visual feedback when scrolling to element
   ============================================================ */
@keyframes ann-pulse-ring {
  0%   { outline-offset: 4px; }
  40%  { outline-offset: 10px; }
  100% { outline-offset: 4px; }
}
.ann-pulse {
  animation: ann-pulse-ring 0.5s ease 2;
}
```

For elements inside `overflow: hidden` containers, you may need:
```css
.parent-container { overflow: visible !important; }
```

---

## How to Apply Highlights

Add the appropriate highlight class + a badge span to the target element. Every badge must include `data-ann-id`, `data-ann-title`, and `data-ann-severity` attributes for the tooltip system.

```html
<!-- Contradiction (Red) -->
<div class="metric-card annotation-highlight" id="c1">
  <span class="annotation-badge"
        data-ann-id="C1"
        data-ann-title="Metric shows percentage instead of count"
        data-ann-severity="MAJOR">C1</span>
  <!-- original content unchanged -->
</div>

<!-- Gap (Blue) -->
<div class="section-card gap-highlight" id="g5">
  <span class="gap-badge"
        data-ann-id="G5"
        data-ann-title="Missing password reset flow"
        data-ann-severity="BLOCKER">G5</span>
  <!-- original content unchanged -->
</div>

<!-- Accessibility (Yellow) — wrap void elements like <img> in a <div> -->
<div class="a11y-highlight" id="a2" style="position:relative;display:inline-block;">
  <span class="a11y-badge"
        data-ann-id="A2"
        data-ann-title="Image missing alt attribute"
        data-ann-severity="MAJOR">A2</span>
  <img class="hero-image" src="hero.png">
</div>

<!-- Design Decision (Green) -->
<div class="breadcrumb-nav decision-highlight" id="d1">
  <span class="decision-badge"
        data-ann-id="D1"
        data-ann-title="Breadcrumb navigation added"
        data-ann-severity="MINOR">D1</span>
  <!-- original content unchanged -->
</div>

<!-- Scope Creep (Orange) -->
<div class="analytics-widget scope-creep-highlight" id="s1">
  <span class="scope-creep-badge"
        data-ann-id="S1"
        data-ann-title="Analytics dashboard not in PRD"
        data-ann-severity="MAJOR">S1</span>
  <!-- original content unchanged -->
</div>

<!-- Placeholder (Gray) -->
<p class="placeholder-highlight" id="p1">
  <span class="placeholder-badge"
        data-ann-id="P1"
        data-ann-title="Lorem ipsum placeholder text"
        data-ann-severity="MINOR">P1</span>
  Lorem ipsum dolor sit amet...
</p>

<!-- Component Inconsistency (Purple) -->
<button class="btn-primary consistency-highlight" id="x1">
  <span class="consistency-badge"
        data-ann-id="X1"
        data-ann-title="Button padding differs from other pages"
        data-ann-severity="MINOR">X1</span>
  Submit
</button>

<!-- Mock Self-Validation (Teal) — data consistency example -->
<div class="stat-card coherence-highlight" id="m1">
  <span class="coherence-badge"
        data-ann-id="M1"
        data-ann-title="Claims: 'Active (12)' — Actual: 5 rows with Active status [Count mismatch]"
        data-ann-severity="MAJOR">M1</span>
  <!-- original content unchanged -->
</div>

<!-- Mock Self-Validation (Teal) — structural example -->
<button class="btn-edit coherence-highlight" id="m5">
  <span class="coherence-badge"
        data-ann-id="M5"
        data-ann-title="Edit button leads to non-existent edit page [Dead-end]"
        data-ann-severity="BLOCKER">M5</span>
  Edit
</button>
```

**Notes:**
- All badges are positioned at `top: -14px; right: -14px` for consistency. Users always know where to look.
- If two findings overlap on the same element (rare), offset the second badge with `right: 20px` to stack them horizontally.
- For void elements like `<img>`, wrap them in a `<div>` with `position: relative; display: inline-block;` and place the badge inside the wrapper.

---

## Toggle Button HTML Template

Place right after `<body>`, before the sidebar/main content:

```html
<!-- ANNOTATION TOGGLE -->
<button class="ann-toggle-btn" id="annToggle" onclick="annOpenPanel()">
  <span>Audit Findings</span>
  <span class="ann-count"><span class="dot-r"></span> {CONTRADICTION_COUNT}</span>
  <span class="ann-count"><span class="dot-b"></span> {GAP_COUNT}</span>
  <span class="ann-count"><span class="dot-y"></span> {A11Y_COUNT}</span>
  <span class="ann-count"><span class="dot-g"></span> {DESIGN_DECISION_COUNT}</span>
  <span class="ann-count"><span class="dot-o"></span> {SCOPE_CREEP_COUNT}</span>
  <span class="ann-count"><span class="dot-p"></span> {CONSISTENCY_COUNT}</span>
  <span class="ann-count"><span class="dot-t"></span> {MOCK_VALIDATION_COUNT}</span>
</button>
```

Only include dot lines for categories that have findings. Omit any line where count is 0. Placeholder findings (gray) are not shown in the toggle — they only appear in the panel.

---

## Tooltip HTML Template

Place right after the toggle button (a single global element, shared by all badges):

```html
<!-- BADGE HOVER TOOLTIP -->
<div class="ann-tooltip" id="annTooltip">
  <div class="ann-tooltip-id"></div>
  <div class="ann-tooltip-title"></div>
  <span class="ann-tooltip-sev"></span>
</div>
```

---

## Panel HTML Template

Place before `</body>`:

```html
<!-- ===== ANNOTATION PANEL ===== -->
<div class="ann-panel" id="annPanel">
  <div class="ann-panel-head">
    <div class="ann-panel-title">
      PRD Audit
      <span class="ann-panel-page">{PAGE_NAME}</span>
    </div>
    <button class="ann-close-btn" onclick="annClosePanel()">&times;</button>
  </div>

  <!-- Summary Stats -->
  <div class="ann-stats">
    <div class="ann-stat"><span class="ann-stat-num total">{TOTAL}</span> findings</div>
    <div class="ann-stat"><span class="ann-stat-num blocker">{BLOCKER_COUNT}</span> blocker</div>
    <div class="ann-stat"><span class="ann-stat-num major">{MAJOR_COUNT}</span> major</div>
    <div class="ann-stat"><span class="ann-stat-num minor">{MINOR_COUNT}</span> minor</div>
  </div>

  <!-- Search -->
  <div class="ann-search-wrap">
    <input class="ann-search" type="text" id="annSearch" placeholder="Search by ID, keyword, or FR..." oninput="annFilterSearch(this.value)">
  </div>

  <!-- Legend (2-row grid — only include items for categories with findings) -->
  <div class="ann-legend">
    <span class="ann-legend-item"><span class="ann-legend-dot red"></span> Contradiction</span>
    <span class="ann-legend-item"><span class="ann-legend-dot blue"></span> Gap</span>
    <span class="ann-legend-item"><span class="ann-legend-dot yellow"></span> Accessibility</span>
    <span class="ann-legend-item"><span class="ann-legend-dot green"></span> Design Decision</span>
    <span class="ann-legend-item"><span class="ann-legend-dot orange"></span> Scope Creep</span>
    <span class="ann-legend-item"><span class="ann-legend-dot gray"></span> Placeholder</span>
    <span class="ann-legend-item"><span class="ann-legend-dot purple"></span> Consistency</span>
    <span class="ann-legend-item"><span class="ann-legend-dot teal"></span> Mock Validation</span>
  </div>

  <!-- Scrollable Findings -->
  <div class="ann-scroll">

    <!-- CONTRADICTIONS (Red) -->
    <div class="ann-section" id="annSectionContradiction">
      <div class="ann-section-head" onclick="annToggleSection('annSectionContradiction')">
        <span class="ann-section-label">Contradictions <span class="ann-section-count red">{COUNT}</span></span>
        <span class="ann-section-controls">
          <button class="ann-filter-toggle" onclick="event.stopPropagation(); annToggleCategory('contradiction')" title="Show/hide on page">&#9678;</button>
          <span class="ann-section-chevron">&#9660;</span>
        </span>
      </div>
      <div class="ann-section-body">
        <!-- Repeat .ann-item for each finding -->
        <div class="ann-item" id="ann-C1" data-target="c1" onclick="annScrollToElement('c1')">
          <span class="ann-item-badge red">C1</span>
          <div class="ann-item-content">
            <div class="ann-item-header">
              <span class="ann-item-title">{TITLE}</span>
              <span class="ann-severity blocker">{SEVERITY}</span>
            </div>
            <div class="ann-item-desc">{DESCRIPTION}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- GAPS (Blue) -->
    <div class="ann-section" id="annSectionGap">
      <div class="ann-section-head" onclick="annToggleSection('annSectionGap')">
        <span class="ann-section-label">Gaps <span class="ann-section-count blue">{COUNT}</span></span>
        <span class="ann-section-controls">
          <button class="ann-filter-toggle" onclick="event.stopPropagation(); annToggleCategory('gap')" title="Show/hide on page">&#9678;</button>
          <span class="ann-section-chevron">&#9660;</span>
        </span>
      </div>
      <div class="ann-section-body">
        <!-- Repeat .ann-item for each finding. For gaps with no highlight target, omit data-target and onclick -->
        <div class="ann-item" id="ann-G1" data-target="g1" onclick="annScrollToElement('g1')">
          <span class="ann-item-badge blue">G1</span>
          <div class="ann-item-content">
            <div class="ann-item-header">
              <span class="ann-item-title">{TITLE}</span>
              <span class="ann-severity major">{SEVERITY}</span>
            </div>
            <div class="ann-item-desc">{DESCRIPTION}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ACCESSIBILITY (Yellow) -->
    <div class="ann-section" id="annSectionA11y">
      <div class="ann-section-head" onclick="annToggleSection('annSectionA11y')">
        <span class="ann-section-label">Accessibility <span class="ann-section-count yellow">{COUNT}</span></span>
        <span class="ann-section-controls">
          <button class="ann-filter-toggle" onclick="event.stopPropagation(); annToggleCategory('a11y')" title="Show/hide on page">&#9678;</button>
          <span class="ann-section-chevron">&#9660;</span>
        </span>
      </div>
      <div class="ann-section-body">
        <div class="ann-item" id="ann-A1" data-target="a1" onclick="annScrollToElement('a1')">
          <span class="ann-item-badge yellow">A1</span>
          <div class="ann-item-content">
            <div class="ann-item-header">
              <span class="ann-item-title">{TITLE}</span>
              <span class="ann-severity major">{SEVERITY}</span>
            </div>
            <div class="ann-item-desc">{DESCRIPTION}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- DESIGN DECISIONS (Green) -->
    <div class="ann-section" id="annSectionDecision">
      <div class="ann-section-head" onclick="annToggleSection('annSectionDecision')">
        <span class="ann-section-label">Design Decisions <span class="ann-section-count green">{COUNT}</span></span>
        <span class="ann-section-controls">
          <button class="ann-filter-toggle" onclick="event.stopPropagation(); annToggleCategory('decision')" title="Show/hide on page">&#9678;</button>
          <span class="ann-section-chevron">&#9660;</span>
        </span>
      </div>
      <div class="ann-section-body">
        <div class="ann-item" id="ann-D1" data-target="d1" onclick="annScrollToElement('d1')">
          <span class="ann-item-badge green">D1</span>
          <div class="ann-item-content">
            <div class="ann-item-header">
              <span class="ann-item-title">{TITLE}</span>
              <span class="ann-severity minor">{SEVERITY}</span>
            </div>
            <div class="ann-item-desc">{DESCRIPTION}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- SCOPE CREEP (Orange) -->
    <div class="ann-section" id="annSectionScopecreep">
      <div class="ann-section-head" onclick="annToggleSection('annSectionScopecreep')">
        <span class="ann-section-label">Scope Creep <span class="ann-section-count orange">{COUNT}</span></span>
        <span class="ann-section-controls">
          <button class="ann-filter-toggle" onclick="event.stopPropagation(); annToggleCategory('scopecreep')" title="Show/hide on page">&#9678;</button>
          <span class="ann-section-chevron">&#9660;</span>
        </span>
      </div>
      <div class="ann-section-body">
        <div class="ann-item" id="ann-S1" data-target="s1" onclick="annScrollToElement('s1')">
          <span class="ann-item-badge orange">S1</span>
          <div class="ann-item-content">
            <div class="ann-item-header">
              <span class="ann-item-title">{TITLE}</span>
              <span class="ann-severity major">{SEVERITY}</span>
            </div>
            <div class="ann-item-desc">{DESCRIPTION}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- PLACEHOLDERS (Gray) -->
    <div class="ann-section" id="annSectionPlaceholder">
      <div class="ann-section-head" onclick="annToggleSection('annSectionPlaceholder')">
        <span class="ann-section-label">Placeholders <span class="ann-section-count gray">{COUNT}</span></span>
        <span class="ann-section-controls">
          <button class="ann-filter-toggle" onclick="event.stopPropagation(); annToggleCategory('placeholder')" title="Show/hide on page">&#9678;</button>
          <span class="ann-section-chevron">&#9660;</span>
        </span>
      </div>
      <div class="ann-section-body">
        <div class="ann-item" id="ann-P1" data-target="p1" onclick="annScrollToElement('p1')">
          <span class="ann-item-badge gray">P1</span>
          <div class="ann-item-content">
            <div class="ann-item-header">
              <span class="ann-item-title">{TITLE}</span>
              <span class="ann-severity minor">{SEVERITY}</span>
            </div>
            <div class="ann-item-desc">{DESCRIPTION}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- COMPONENT INCONSISTENCIES (Purple) -->
    <div class="ann-section" id="annSectionConsistency">
      <div class="ann-section-head" onclick="annToggleSection('annSectionConsistency')">
        <span class="ann-section-label">Consistency <span class="ann-section-count purple">{COUNT}</span></span>
        <span class="ann-section-controls">
          <button class="ann-filter-toggle" onclick="event.stopPropagation(); annToggleCategory('consistency')" title="Show/hide on page">&#9678;</button>
          <span class="ann-section-chevron">&#9660;</span>
        </span>
      </div>
      <div class="ann-section-body">
        <div class="ann-item" id="ann-X1" data-target="x1" onclick="annScrollToElement('x1')">
          <span class="ann-item-badge purple">X1</span>
          <div class="ann-item-content">
            <div class="ann-item-header">
              <span class="ann-item-title">{TITLE}</span>
              <span class="ann-severity minor">{SEVERITY}</span>
            </div>
            <div class="ann-item-desc">{DESCRIPTION}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- MOCK SELF-VALIDATION (Teal) -->
    <div class="ann-section" id="annSectionCoherence">
      <div class="ann-section-head" onclick="annToggleSection('annSectionCoherence')">
        <span class="ann-section-label">Mock Validation <span class="ann-section-count teal">{COUNT}</span></span>
        <span class="ann-section-controls">
          <button class="ann-filter-toggle" onclick="event.stopPropagation(); annToggleCategory('coherence')" title="Show/hide on page">&#9678;</button>
          <span class="ann-section-chevron">&#9660;</span>
        </span>
      </div>
      <div class="ann-section-body">
        <div class="ann-item" id="ann-M1" data-target="m1" onclick="annScrollToElement('m1')">
          <span class="ann-item-badge teal">M1</span>
          <div class="ann-item-content">
            <div class="ann-item-header">
              <span class="ann-item-title">{TITLE}</span>
              <span class="ann-severity major">{SEVERITY}</span>
            </div>
            <div class="ann-item-desc">{DESCRIPTION}</div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Keyboard Hints -->
  <div class="ann-kbd-hint">
    <span><kbd>Esc</kbd> close</span>
    <span><kbd>[</kbd> <kbd>]</kbd> prev / next</span>
    <span><kbd>/</kbd> search</span>
  </div>
</div>
```

**Notes:**
- Only include `<div class="ann-section">` blocks for categories that have findings.
- Only include legend items for categories that have findings.
- For gap findings where there is no corresponding element on the page (the gap represents something entirely missing), omit `data-target` and `onclick` from the `.ann-item`.
- The `{SEVERITY}` value must be one of: `BLOCKER`, `MAJOR`, `MINOR`. Use the matching CSS class: `blocker`, `major`, `minor`.

---

## JavaScript Template

Place in a `<script>` block before `</body>`, after the panel HTML:

```html
<script>
/* ============================================================
   ANNOTATION PANEL — Interactive behavior
   All functions prefixed with 'ann' to avoid conflicts.
   ============================================================ */

/* --- Category → CSS class mapping --- */
var ANN_CATS = {
  contradiction: { hl: 'annotation-highlight', badge: 'annotation-badge' },
  gap:           { hl: 'gap-highlight',        badge: 'gap-badge' },
  a11y:          { hl: 'a11y-highlight',        badge: 'a11y-badge' },
  decision:      { hl: 'decision-highlight',    badge: 'decision-badge' },
  scopecreep:    { hl: 'scope-creep-highlight', badge: 'scope-creep-badge' },
  placeholder:   { hl: 'placeholder-highlight', badge: 'placeholder-badge' },
  consistency:   { hl: 'consistency-highlight',  badge: 'consistency-badge' },
  coherence:     { hl: 'coherence-highlight',    badge: 'coherence-badge' }
};

/* --- Panel open / close --- */
function annOpenPanel() {
  document.getElementById('annPanel').classList.add('open');
  document.getElementById('annToggle').style.display = 'none';
}
function annClosePanel() {
  document.getElementById('annPanel').classList.remove('open');
  document.getElementById('annToggle').style.display = 'flex';
}

/* --- Section collapse / expand --- */
function annToggleSection(id) {
  document.getElementById(id).classList.toggle('collapsed');
}

/* --- Category visibility toggle (eye button) --- */
function annToggleCategory(cat) {
  var info = ANN_CATS[cat];
  if (!info) return;
  var sectionId = 'annSection' + cat.charAt(0).toUpperCase() + cat.slice(1);
  var section = document.getElementById(sectionId);
  if (!section) return;
  var btn = section.querySelector('.ann-filter-toggle');
  var isOff = btn.classList.contains('off');

  if (isOff) {
    /* Turn ON — show highlights and section */
    btn.classList.remove('off');
    section.classList.remove('cat-hidden');
    document.querySelectorAll('.' + info.hl).forEach(function(el) {
      el.style.outlineColor = '';
    });
    document.querySelectorAll('.' + info.badge).forEach(function(el) {
      el.style.display = '';
    });
  } else {
    /* Turn OFF — hide highlights and section */
    btn.classList.add('off');
    section.classList.add('cat-hidden');
    document.querySelectorAll('.' + info.hl).forEach(function(el) {
      el.style.outlineColor = 'transparent';
    });
    document.querySelectorAll('.' + info.badge).forEach(function(el) {
      el.style.display = 'none';
    });
  }
}

/* --- Bidirectional navigation: panel item → page element --- */
function annScrollToElement(elementId) {
  if (!elementId) return;
  var el = document.getElementById(elementId);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.classList.add('ann-pulse');
  setTimeout(function() { el.classList.remove('ann-pulse'); }, 1200);
}

/* --- Bidirectional navigation: page badge → panel item --- */
function annScrollToPanel(findingId) {
  annOpenPanel();
  var item = document.getElementById('ann-' + findingId);
  if (!item) return;
  /* Expand parent section if collapsed */
  var section = item.closest('.ann-section');
  if (section && section.classList.contains('collapsed')) {
    section.classList.remove('collapsed');
  }
  /* Scroll and highlight */
  setTimeout(function() {
    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.querySelectorAll('.ann-item.active').forEach(function(el) {
      el.classList.remove('active');
    });
    item.classList.add('active');
    setTimeout(function() { item.classList.remove('active'); }, 2500);
  }, 100);
}

/* --- Badge hover tooltip --- */
var annTooltip = null;
var ANN_CAT_COLORS = {
  'annotation-badge': '#ef4444', 'gap-badge': '#3b82f6', 'a11y-badge': '#f59e0b',
  'decision-badge': '#10b981', 'scope-creep-badge': '#f97316',
  'placeholder-badge': '#9ca3af', 'consistency-badge': '#8b5cf6',
  'coherence-badge': '#14b8a6'
};

function annShowTooltip(e) {
  var badge = e.target;
  if (!badge.dataset.annId) return;
  if (!annTooltip) annTooltip = document.getElementById('annTooltip');
  /* Determine category color from badge class */
  var color = '#71717a';
  for (var cls in ANN_CAT_COLORS) {
    if (badge.classList.contains(cls)) { color = ANN_CAT_COLORS[cls]; break; }
  }
  annTooltip.style.setProperty('--ann-tt-color', color);
  annTooltip.querySelector('.ann-tooltip-id').textContent = badge.dataset.annId;
  annTooltip.querySelector('.ann-tooltip-title').textContent = badge.dataset.annTitle || '';
  var sevEl = annTooltip.querySelector('.ann-tooltip-sev');
  var sev = (badge.dataset.annSeverity || '').toLowerCase();
  sevEl.textContent = badge.dataset.annSeverity || '';
  sevEl.className = 'ann-tooltip-sev ' + sev;
  sevEl.style.display = sev ? '' : 'none';
  /* Position near cursor */
  var x = e.clientX + 14;
  var y = e.clientY - 10;
  if (x + 290 > window.innerWidth) x = e.clientX - 290;
  if (y + 80 > window.innerHeight) y = e.clientY - 80;
  annTooltip.style.left = x + 'px';
  annTooltip.style.top = y + 'px';
  annTooltip.style.display = 'block';
}
function annHideTooltip() {
  if (annTooltip) annTooltip.style.display = 'none';
}

/* --- Search / filter findings --- */
function annFilterSearch(term) {
  term = term.toLowerCase();
  document.querySelectorAll('.ann-item').forEach(function(item) {
    var text = item.textContent.toLowerCase();
    item.style.display = (!term || text.indexOf(term) > -1) ? '' : 'none';
  });
  /* Update visible counts per section */
  document.querySelectorAll('.ann-section').forEach(function(section) {
    var visible = section.querySelectorAll('.ann-item').length;
    var hidden = section.querySelectorAll('.ann-item[style*="display: none"]').length;
    var count = section.querySelector('.ann-section-count');
    if (count) count.textContent = visible - hidden;
  });
}

/* --- Keyboard navigation --- */
var annCurrentIdx = -1;
var annAllItems = [];

function annInitKeyboard() {
  annAllItems = Array.from(document.querySelectorAll('.ann-item'));
  document.addEventListener('keydown', function(e) {
    var panel = document.getElementById('annPanel');
    if (!panel.classList.contains('open')) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      if (e.key === 'Escape') { e.target.blur(); }
      return;
    }
    if (e.key === 'Escape') {
      annClosePanel();
    } else if (e.key === ']') {
      annNavigate(1);
    } else if (e.key === '[') {
      annNavigate(-1);
    } else if (e.key === '/') {
      e.preventDefault();
      var s = document.getElementById('annSearch');
      if (s) s.focus();
    }
  });
}

function annNavigate(dir) {
  /* Rebuild list filtering out hidden items */
  var visible = annAllItems.filter(function(item) {
    return item.style.display !== 'none' && !item.closest('.cat-hidden');
  });
  if (visible.length === 0) return;
  /* Clear previous active */
  if (annCurrentIdx >= 0 && annCurrentIdx < visible.length) {
    visible[annCurrentIdx].classList.remove('active');
  }
  annCurrentIdx = (annCurrentIdx + dir + visible.length) % visible.length;
  var item = visible[annCurrentIdx];
  item.classList.add('active');
  item.scrollIntoView({ behavior: 'smooth', block: 'center' });
  /* Also scroll page to the element */
  var targetId = item.dataset.target;
  if (targetId) annScrollToElement(targetId);
}

/* --- Badge click handler (attach to all badges) --- */
function annInitBadgeClicks() {
  var badgeClasses = Object.keys(ANN_CAT_COLORS);
  badgeClasses.forEach(function(cls) {
    document.querySelectorAll('.' + cls).forEach(function(badge) {
      badge.addEventListener('click', function() {
        annScrollToPanel(badge.dataset.annId);
      });
      badge.addEventListener('mouseenter', annShowTooltip);
      badge.addEventListener('mouseleave', annHideTooltip);
    });
  });
}

/* --- Initialize on load --- */
(function() {
  annInitBadgeClicks();
  annInitKeyboard();
})();
</script>
```

---

## Sidebar Navigation Updates

When creating annotated copies, update the sidebar nav links to point to the annotated versions:

```html
<a class="nav-item" href="page-one-annotated.html">Page One</a>
<a class="nav-item" href="page-two-annotated.html">Page Two</a>
```

---

## Markdown Report — Build Requirements Section Template

```markdown
## Page Build Requirements

### Page N: {Page Name} (`/route`)

**PRD Coverage:** FR{X}, FR{Y}, ... (~N sub-requirements)
**Mock Alignment:** N% — N contradictions + N gaps out of ~N total requirements

| Component | PRD Status | Mock Status | Code Status | Notes |
|-----------|-----------|-------------|-------------|-------|
| {Component} | Defined (FR{X}) | Shown / Partial / Missing | Implemented / Scaffold / Not Started | {Detail} |

**Backend APIs Required:**
| Endpoint | Status | Dependencies |
|----------|--------|-------------|
| `GET /api/{resource}` | Not Started | {What's needed} |

**Database Tables Required:**
| Table | Status | Notes |
|-------|--------|-------|
| `{table_name}` | Not Started | {Purpose} |

**Estimated Build Readiness:** N%
```

---

## Agent Prompts for Parallel HTML Generation

When creating annotated files in parallel, launch one Task agent per HTML file with this prompt structure:

```
You need to create an annotated copy of [FILE_PATH].

1. Read the original file
2. Copy all content to [OUTPUT_PATH]
3. Add the full annotation CSS (from reference.md) — only include CSS classes for categories that have findings
4. Add inline highlights on these elements (all badges at top-right with data attributes):
   - [C1] on [element description] — red contradiction — severity: [BLOCKER/MAJOR/MINOR] — title: "[title]"
   - [G1] on [element description] — blue gap — severity: [BLOCKER/MAJOR/MINOR] — title: "[title]"
   - [A1] on [element description] — yellow accessibility — severity: [BLOCKER/MAJOR/MINOR] — title: "[title]"
   - [D1] on [element description] — green design decision — severity: [BLOCKER/MAJOR/MINOR] — title: "[title]"
   - [S1] on [element description] — orange scope creep — severity: [BLOCKER/MAJOR/MINOR] — title: "[title]"
   - [P1] on [element description] — gray placeholder — severity: [BLOCKER/MAJOR/MINOR] — title: "[title]"
   - [X1] on [element description] — purple consistency issue — severity: [BLOCKER/MAJOR/MINOR] — title: "[title]"
   - [M1] on [element description] — teal mock validation issue — severity: [BLOCKER/MAJOR/MINOR] — title: "[title]" (for data: claims/actual/type; for structural: issue/expected/sub-type)
   Each badge span must include: data-ann-id, data-ann-title, data-ann-severity
5. Add the toggle button after <body> (only include dots for categories with findings)
6. Add the tooltip element after the toggle button
7. Add the annotation panel before </body> with:
   - Summary stats bar (total, blocker count, major count, minor count)
   - Search input
   - Legend (only categories with findings)
   - Sections for each category (each item has id="ann-{ID}", data-target="{id}", severity pill):
     - Contradictions (red): [list items with severity]
     - Gaps (blue): [list items with severity]
     - Accessibility (yellow): [list items with severity]
     - Design Decisions (green): [list items with severity]
     - Scope Creep (orange): [list items with severity]
     - Placeholders (gray): [list items with severity]
     - Consistency (purple): [list items with severity]
     - Mock Validation (teal): [list items with severity]
   - Keyboard hints footer
8. Add the JavaScript block (from reference.md) before </body>
9. Update sidebar nav links to point to annotated versions
10. Keep ALL original page content and functionality intact
```

---

## Checklist

Before delivering results, verify:

**Findings quality:**
- [ ] All contradictions (C) have severity + PRD reference + "should be" correction
- [ ] All gaps (G) have severity + PRD reference + what's missing
- [ ] All accessibility findings (A) have severity + element + WCAG criterion
- [ ] All design decisions (D) have element + description + recommendation
- [ ] All scope creep items (S) have element + description + risk assessment
- [ ] All placeholders (P) have element + description + action needed
- [ ] All consistency issues (X) have component + pages affected + discrepancy type
- [ ] All mock validation issues (M) have: for data — element + claims + actual + validation + type; for structural — element + issue + expected + sub-type
- [ ] All PRD issues (R) have type + affected FRs + description + impact on audit
- [ ] R findings are report-only — no R-prefix badges in annotated HTML

**IDs and counts:**
- [ ] Finding IDs are sequential across pages (C1-CN, G1-GN, A1-AN, D1-DN, S1-SN, P1-PN, X1-XN, M1-MN, R1-RN)
- [ ] Executive Summary totals match actual findings listed
- [ ] Toggle button shows correct counts per category
- [ ] Panel stats bar (total, blocker, major, minor) match actual findings

**Annotated HTML — structure:**
- [ ] Each annotated HTML opens correctly in a browser
- [ ] Sidebar links point to annotated versions (not originals)
- [ ] Panel sections are collapsible and only include categories with findings
- [ ] All original page functionality (tabs, filters, scripts) still works

**Annotated HTML — interactivity:**
- [ ] Every inline badge has `data-ann-id`, `data-ann-title`, `data-ann-severity` attributes
- [ ] Clicking a badge on the page opens the panel and scrolls to that finding
- [ ] Clicking a panel item scrolls the page to the highlighted element (with pulse)
- [ ] Hovering a badge shows the tooltip with ID, title, and severity
- [ ] Category filter toggles hide/show inline highlights and panel sections
- [ ] Search filters findings by text content
- [ ] Keyboard shortcuts work: `Esc` close, `[`/`]` navigate, `/` search
- [ ] Badge-to-panel sync: every inline badge has a matching panel entry
- [ ] Panel items without a page target (e.g., purely missing gaps) have no onclick

**Severity pills:**
- [ ] Every panel item has a severity pill (BLOCKER, MAJOR, or MINOR)
- [ ] Severity pill CSS class matches the severity text (blocker, major, minor)

**Report:**
- [ ] Traceability matrix covers every FR sub-requirement
- [ ] Coverage % calculations are arithmetically correct
- [ ] Recommendations section is prioritized (BLOCKER first)
- [ ] Design token sections (color, typography, layout) only present if PRD defines them

**Cross-output consistency (analysis.md ↔ annotated HTML ↔ heatmap):**
- [ ] Every finding ID in analysis.md appears in the corresponding annotated HTML (badge + panel entry)
- [ ] Every finding in annotated HTML panels exists in analysis.md (no orphan findings)
- [ ] Heatmap `HEATMAP_DATA` rows/columns/statuses exactly match the traceability matrix in analysis.md Part 2.2
- [ ] Every heatmap `findingId` corresponds to an actual finding ID in analysis.md
- [ ] Every heatmap `detail` string is copied **verbatim** from the corresponding finding in analysis.md — no paraphrasing, no synonym substitution, no hallucinated specifics
- [ ] Every heatmap `desc` field matches the sub-requirement description in the traceability matrix word-for-word
- [ ] Heatmap per-page coverage %s match analysis.md Part 2.1
- [ ] Finding severities are identical across analysis.md, annotated HTML panels, and annotated HTML `data-ann-severity` attributes
- [ ] Annotated HTML `data-ann-title` attributes match the finding title in analysis.md

**Optional phases:**
- [ ] If delta mode: resolved/new/persistent/regressed counts are correct
- [ ] If heatmap: all cells link to correct finding IDs
- [ ] If build requirements: implementation status is accurate

---

## Interactive Coverage Heatmap — Full Template

Generate this as `docs/audit/prd/{analysis_name}/coverage-heatmap.html`. Replace `{HEATMAP_DATA}` with a JSON array built from the traceability matrix.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PRD Coverage Heatmap</title>
<style>
  :root {
    --bg: #0f0f11;
    --surface: #18181b;
    --border: #27272a;
    --text: #e4e4e7;
    --text-muted: #a1a1aa;
    --covered: #10b981;
    --partial: #f59e0b;
    --contradicted: #ef4444;
    --missing: #6b7280;
    --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: var(--bg); color: var(--text); font-family: var(--font); padding: 24px; }

  .hm-header { margin-bottom: 24px; }
  .hm-title { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
  .hm-subtitle { font-size: 13px; color: var(--text-muted); }

  .hm-controls {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .hm-filter-btn {
    padding: 6px 14px;
    border-radius: 16px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }
  .hm-filter-btn.active { border-color: var(--text); color: var(--text); }
  .hm-filter-btn .hm-dot {
    width: 8px; height: 8px; border-radius: 50%;
  }
  .hm-search {
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    font-size: 13px;
    font-family: var(--font);
    width: 240px;
    outline: none;
    transition: border-color 0.2s;
  }
  .hm-search:focus { border-color: #6366f1; }
  .hm-search::placeholder { color: #52525b; }

  .hm-grid-wrap {
    overflow: auto;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--surface);
  }
  .hm-grid {
    border-collapse: collapse;
    min-width: 100%;
  }
  .hm-grid th, .hm-grid td {
    padding: 10px 14px;
    font-size: 12px;
    border: 1px solid var(--border);
    white-space: nowrap;
  }
  .hm-grid thead th {
    background: #1f1f23;
    color: var(--text);
    font-weight: 700;
    position: sticky;
    top: 0;
    z-index: 2;
  }
  .hm-grid thead th:first-child {
    position: sticky;
    left: 0;
    z-index: 3;
  }
  .hm-grid tbody th {
    background: #1f1f23;
    color: var(--text-muted);
    font-weight: 600;
    text-align: left;
    position: sticky;
    left: 0;
    z-index: 1;
  }
  .hm-grid .hm-summary-row td {
    background: #1f1f23;
    font-weight: 700;
    position: sticky;
    bottom: 0;
  }

  .hm-cell {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    margin: auto;
    cursor: pointer;
    position: relative;
    transition: transform 0.15s;
  }
  .hm-cell:hover { transform: scale(1.2); }
  .hm-cell.covered    { background: var(--covered); }
  .hm-cell.partial    { background: var(--partial); }
  .hm-cell.contradicted { background: var(--contradicted); }
  .hm-cell.missing    { background: var(--missing); }
  .hm-cell.na         { background: transparent; border: 1px dashed #3f3f46; }

  .hm-tooltip {
    display: none;
    position: fixed;
    z-index: 9999;
    background: #27272a;
    color: var(--text);
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 12px;
    line-height: 1.5;
    max-width: 320px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    pointer-events: none;
  }
  .hm-tooltip .hm-tt-id { font-weight: 700; margin-bottom: 4px; }
  .hm-tooltip .hm-tt-desc { color: var(--text-muted); }

  .hm-legend {
    display: flex;
    gap: 20px;
    margin-top: 16px;
    padding: 12px 0;
  }
  .hm-legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-muted);
  }
  .hm-legend-dot {
    width: 12px; height: 12px; border-radius: 4px;
  }

  .hm-detail {
    margin-top: 32px;
    padding: 20px 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    display: none;
  }
  .hm-detail.visible { display: block; }
  .hm-detail-title { font-size: 14px; font-weight: 700; margin-bottom: 8px; }
  .hm-detail-body { font-size: 13px; color: var(--text-muted); line-height: 1.6; }
</style>
</head>
<body>
  <div class="hm-header">
    <div class="hm-title">PRD Coverage Heatmap</div>
    <div class="hm-subtitle">Generated {DATE} — {TOTAL_REQUIREMENTS} requirements across {TOTAL_PAGES} pages</div>
  </div>

  <div class="hm-controls">
    <button class="hm-filter-btn active" data-filter="all">All</button>
    <button class="hm-filter-btn" data-filter="covered"><span class="hm-dot" style="background:#10b981"></span> Covered</button>
    <button class="hm-filter-btn" data-filter="partial"><span class="hm-dot" style="background:#f59e0b"></span> Partial</button>
    <button class="hm-filter-btn" data-filter="missing"><span class="hm-dot" style="background:#6b7280"></span> Missing</button>
    <button class="hm-filter-btn" data-filter="contradicted"><span class="hm-dot" style="background:#ef4444"></span> Contradicted</button>
    <input class="hm-search" type="text" placeholder="Filter by FR number or keyword..." id="hmSearch">
  </div>

  <div class="hm-grid-wrap">
    <table class="hm-grid" id="hmGrid">
      <thead id="hmHead">
        <!-- Generated dynamically by JS from PAGES array -->
      </thead>
      <tbody id="hmBody">
        <!-- Generated dynamically by JS from HEATMAP_DATA -->
      </tbody>
      <tfoot id="hmFoot">
        <!-- Generated dynamically by JS from computed coverage -->
      </tfoot>
    </table>
  </div>

  <div class="hm-legend">
    <span class="hm-legend-item"><span class="hm-legend-dot" style="background:#10b981"></span> Covered</span>
    <span class="hm-legend-item"><span class="hm-legend-dot" style="background:#f59e0b"></span> Partial</span>
    <span class="hm-legend-item"><span class="hm-legend-dot" style="background:#6b7280"></span> Missing</span>
    <span class="hm-legend-item"><span class="hm-legend-dot" style="background:#ef4444"></span> Contradicted</span>
    <span class="hm-legend-item"><span class="hm-legend-dot" style="background:transparent;border:1px dashed #3f3f46"></span> N/A</span>
  </div>

  <div class="hm-detail" id="hmDetail">
    <div class="hm-detail-title" id="hmDetailTitle"></div>
    <div class="hm-detail-body" id="hmDetailBody"></div>
  </div>

  <div class="hm-tooltip" id="hmTooltip">
    <div class="hm-tt-id" id="hmTtId"></div>
    <div class="hm-tt-desc" id="hmTtDesc"></div>
  </div>

<script>
/*
  HEATMAP_DATA format:
  [
    {
      "fr": "FR1.1",
      "desc": "User can register with email",
      "cells": {
        "page-name": { "status": "covered|partial|missing|contradicted|na", "findingId": "C1", "detail": "..." }
      }
    },
    ...
  ]

  IMPORTANT — Anti-Drift Rule:
  Every "detail" value MUST be copied verbatim from the corresponding finding in analysis.md.
  Every "desc" value MUST match the sub-requirement description in analysis.md Part 2.2.
  Do NOT paraphrase, summarize, or rewrite from memory. Re-read analysis.md before populating.
*/
var DATA = {HEATMAP_DATA};
var PAGES = {PAGE_LIST}; // ["Dashboard", "Profile", ...]

(function() {
  var head = document.getElementById('hmHead');
  var body = document.getElementById('hmBody');
  var foot = document.getElementById('hmFoot');
  var tooltip = document.getElementById('hmTooltip');
  var detail = document.getElementById('hmDetail');
  var activeFilter = 'all';

  /* --- Build thead dynamically from PAGES --- */
  function renderHead() {
    var tr = document.createElement('tr');
    var th0 = document.createElement('th');
    th0.textContent = 'Requirement';
    tr.appendChild(th0);
    PAGES.forEach(function(page) {
      var th = document.createElement('th');
      th.textContent = page;
      tr.appendChild(th);
    });
    var thStatus = document.createElement('th');
    thStatus.textContent = 'Status';
    tr.appendChild(thStatus);
    head.innerHTML = '';
    head.appendChild(tr);
  }

  /* --- Build tfoot dynamically from DATA + PAGES --- */
  function renderFoot() {
    var tr = document.createElement('tr');
    tr.className = 'hm-summary-row';
    var th = document.createElement('th');
    th.textContent = 'Coverage %';
    tr.appendChild(th);
    PAGES.forEach(function(page) {
      var total = 0, covered = 0, partial = 0;
      DATA.forEach(function(row) {
        var cell = (row.cells && row.cells[page]) || { status: 'na' };
        if (cell.status === 'na') return;
        total++;
        if (cell.status === 'covered') covered++;
        else if (cell.status === 'partial') partial += 0.5;
      });
      var td = document.createElement('td');
      td.textContent = total > 0 ? Math.round((covered + partial) / total * 100) + '%' : '—';
      tr.appendChild(td);
    });
    var tdEmpty = document.createElement('td');
    tr.appendChild(tdEmpty);
    foot.innerHTML = '';
    foot.appendChild(tr);
  }

  /* --- Render tbody rows --- */
  function render(filter, search) {
    body.innerHTML = '';
    var term = (search || '').toLowerCase();
    DATA.forEach(function(row) {
      if (term && row.fr.toLowerCase().indexOf(term) === -1 && row.desc.toLowerCase().indexOf(term) === -1) return;
      var tr = document.createElement('tr');
      var th = document.createElement('th');
      th.textContent = row.fr + ' — ' + row.desc;
      tr.appendChild(th);
      var hasVisible = false;
      PAGES.forEach(function(page) {
        var td = document.createElement('td');
        td.style.textAlign = 'center';
        var cell = (row.cells && row.cells[page]) || { status: 'na' };
        if (filter !== 'all' && cell.status !== filter) {
          td.innerHTML = '';
          tr.appendChild(td);
          return;
        }
        hasVisible = true;
        var div = document.createElement('div');
        div.className = 'hm-cell ' + cell.status;
        div.setAttribute('data-fr', row.fr);
        div.setAttribute('data-page', page);
        div.setAttribute('data-id', cell.findingId || '');
        div.setAttribute('data-detail', cell.detail || '');
        div.setAttribute('data-status', cell.status);
        div.onmouseenter = showTooltip;
        div.onmouseleave = hideTooltip;
        div.onclick = showDetail;
        td.appendChild(div);
        tr.appendChild(td);
      });
      // Summary status column
      var statusTd = document.createElement('td');
      var statuses = PAGES.map(function(p) { return (row.cells && row.cells[p]) ? row.cells[p].status : 'na'; });
      if (statuses.indexOf('contradicted') > -1) statusTd.style.color = '#ef4444';
      else if (statuses.indexOf('missing') > -1) statusTd.style.color = '#6b7280';
      else if (statuses.indexOf('partial') > -1) statusTd.style.color = '#f59e0b';
      else statusTd.style.color = '#10b981';
      statusTd.textContent = statuses.indexOf('contradicted') > -1 ? 'Issues' : statuses.indexOf('missing') > -1 ? 'Gaps' : statuses.indexOf('partial') > -1 ? 'Partial' : 'OK';
      tr.appendChild(statusTd);
      if (filter === 'all' || hasVisible) body.appendChild(tr);
    });
  }

  function showTooltip(e) {
    var t = e.target;
    tooltip.style.display = 'block';
    document.getElementById('hmTtId').textContent = (t.dataset.id || t.dataset.fr) + ' (' + t.dataset.page + ')';
    document.getElementById('hmTtDesc').textContent = t.dataset.detail || t.dataset.status;
    tooltip.style.left = e.clientX + 12 + 'px';
    tooltip.style.top = e.clientY + 12 + 'px';
  }
  function hideTooltip() { tooltip.style.display = 'none'; }
  function showDetail(e) {
    var t = e.target;
    if (!t.dataset.id) return;
    detail.className = 'hm-detail visible';
    document.getElementById('hmDetailTitle').textContent = t.dataset.id + ' — ' + t.dataset.fr + ' (' + t.dataset.page + ')';
    document.getElementById('hmDetailBody').textContent = t.dataset.detail || 'No additional detail.';
  }

  // Filter buttons
  document.querySelectorAll('.hm-filter-btn').forEach(function(btn) {
    btn.onclick = function() {
      document.querySelectorAll('.hm-filter-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      render(activeFilter, document.getElementById('hmSearch').value);
    };
  });

  // Search
  document.getElementById('hmSearch').addEventListener('input', function(e) {
    render(activeFilter, e.target.value);
  });

  // Initial render — all three sections from the same data source
  renderHead();
  renderFoot();
  render('all', '');
})();
</script>
</body>
</html>
```

### Heatmap Data Format

When generating the heatmap, build the `HEATMAP_DATA` JSON array from the traceability matrix.

**CRITICAL — Anti-Drift Rule:** The heatmap is typically the last artifact generated in a long pass. By this point, the LLM's contextual memory of earlier findings can drift, producing paraphrased or hallucinated descriptions instead of exact copies. To prevent this:

1. **Re-read analysis.md** before writing heatmap data — specifically Part 2.2 (traceability matrix), Part 2.3 (contradictions), and Part 2.4 (gaps)
2. **Copy `desc` verbatim** from the traceability matrix sub-requirement description — do not rephrase
3. **Copy `detail` verbatim** from the corresponding finding row in analysis.md — do not rewrite from memory
4. **Map `findingId`** directly from the Finding ID column in analysis.md

**Source mapping for `detail` field:**

| Heatmap status | Source section in analysis.md | findingId prefix |
|---|---|---|
| `contradicted` | Part 2.3 → "Finding" column of matching C{N} row | C |
| `missing` | Part 2.4 → "Finding" column of matching G{N} row | G |
| `partial` | Part 2.3 or 2.4 → whichever finding ID is referenced | C or G |
| `covered` | No finding — use brief factual note (e.g., "Fully represented in mock") | (none) |
| `na` | Not applicable — leave detail empty | (none) |

```json
[
  {
    "fr": "FR1.1",
    "desc": "User can register with email and password",
    "cells": {
      "Registration": { "status": "covered", "findingId": "", "detail": "Fully represented in mock" },
      "Dashboard": { "status": "na", "findingId": "", "detail": "" },
      "Profile": { "status": "partial", "findingId": "G3", "detail": "Email shown but password change missing" }
    }
  }
]
```

And `PAGE_LIST` as a simple string array:
```json
["Registration", "Dashboard", "Profile", "Settings"]
```

---

**Last updated:** 2026-03-03 (v8 — unified Phase 5B as Mock Self-Validation (M/Teal) combining data consistency + structural/flow; added Phase 5C PRD Internal Consistency (R/Indigo, report-only))
