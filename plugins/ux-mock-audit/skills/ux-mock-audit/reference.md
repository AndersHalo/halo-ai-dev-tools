# UX vs. Mock Audit — Reference Guide

Complete templates and patterns for generating annotated HTML, visual audit pages, and coverage heatmap.

---

## 1. Annotation CSS (Annotated HTML Files)

Add this entire block to the `<style>` of each annotated HTML file.

```css
/* ============================================================
   UX AUDIT ANNOTATION SYSTEM — Panel, Highlights, Tooltips
   ============================================================ */

/* --- Toggle Button (fixed pill, top-right) --- */
.ux-ann-toggle-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10001;
  background: linear-gradient(135deg, #0f172a, #1e293b);
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
.ux-ann-toggle-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(0,0,0,0.4);
}
.ux-ann-toggle-btn .ux-ann-count {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.ux-ann-toggle-btn .dot-t  { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; }
.ux-ann-toggle-btn .dot-y  { width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; }
.ux-ann-toggle-btn .dot-k  { width: 8px; height: 8px; border-radius: 50%; background: #f97316; }
.ux-ann-toggle-btn .dot-l  { width: 8px; height: 8px; border-radius: 50%; background: #8b5cf6; }
.ux-ann-toggle-btn .dot-i  { width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; }
.ux-ann-toggle-btn .dot-r  { width: 8px; height: 8px; border-radius: 50%; background: #14b8a6; }
.ux-ann-toggle-btn .dot-u  { width: 8px; height: 8px; border-radius: 50%; background: #10b981; }
.ux-ann-toggle-btn .dot-s  { width: 8px; height: 8px; border-radius: 50%; background: #f43f5e; }
.ux-ann-toggle-btn .dot-p  { width: 8px; height: 8px; border-radius: 50%; background: #9ca3af; }
.ux-ann-toggle-btn .dot-x  { width: 8px; height: 8px; border-radius: 50%; background: #7c3aed; }
.ux-ann-toggle-btn .dot-m  { width: 8px; height: 8px; border-radius: 50%; background: #06b6d4; }

/* --- Annotation Panel Container --- */
.ux-ann-panel {
  position: fixed;
  top: 0;
  right: -420px;
  width: 400px;
  height: 100vh;
  background: #0f172a;
  color: #e2e8f0;
  z-index: 10000;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
  font-family: var(--font-body, 'Inter', -apple-system, sans-serif);
  box-shadow: -4px 0 30px rgba(0,0,0,0.4);
}
.ux-ann-panel.open {
  right: 0;
}

/* Panel Header */
.ux-ann-panel-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.ux-ann-panel-header h2 {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
.ux-ann-panel-header .ux-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: rgba(99,102,241,0.2);
  color: #a5b4fc;
  padding: 3px 8px;
  border-radius: 4px;
}
.ux-ann-panel-close {
  background: rgba(255,255,255,0.1);
  border: none;
  color: #94a3b8;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}
.ux-ann-panel-close:hover {
  background: rgba(255,255,255,0.15);
  color: #fff;
}

/* Stats Bar */
.ux-ann-stats {
  display: flex;
  gap: 8px;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}
.ux-ann-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
}
.ux-ann-stat.total { background: rgba(255,255,255,0.08); color: #e2e8f0; }
.ux-ann-stat.blocker { background: rgba(239,68,68,0.15); color: #fca5a5; }
.ux-ann-stat.major { background: rgba(245,158,11,0.15); color: #fcd34d; }
.ux-ann-stat.minor { background: rgba(59,130,246,0.15); color: #93c5fd; }

/* Search */
.ux-ann-search {
  padding: 10px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}
.ux-ann-search input {
  width: 100%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 8px 12px;
  color: #e2e8f0;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border 0.15s ease;
  box-sizing: border-box;
}
.ux-ann-search input::placeholder { color: #64748b; }
.ux-ann-search input:focus { border-color: rgba(99,102,241,0.5); }

/* Legend */
.ux-ann-legend {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 10px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}
.ux-ann-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #94a3b8;
  padding: 3px 0;
}
.ux-ann-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Scrollable Body */
.ux-ann-body {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
}
.ux-ann-body::-webkit-scrollbar { width: 6px; }
.ux-ann-body::-webkit-scrollbar-track { background: transparent; }
.ux-ann-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }

/* Sections */
.ux-ann-section {
  margin-bottom: 4px;
}
.ux-ann-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.1s ease;
  user-select: none;
}
.ux-ann-section-header:hover {
  background: rgba(255,255,255,0.03);
}
.ux-ann-section-header .ux-section-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ux-ann-section-header .ux-section-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.ux-ann-section-header .ux-section-label {
  font-size: 12px;
  font-weight: 600;
  color: #e2e8f0;
}
.ux-ann-section-header .ux-section-count {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  background: rgba(255,255,255,0.06);
  padding: 2px 8px;
  border-radius: 10px;
}
.ux-ann-section-header .ux-section-right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ux-ann-section-header .ux-eye-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 2px;
  font-size: 14px;
  transition: color 0.15s;
}
.ux-ann-section-header .ux-eye-btn:hover { color: #e2e8f0; }
.ux-ann-section-header .ux-eye-btn.hidden-cat { color: #334155; }
.ux-ann-section-header .ux-chevron {
  font-size: 12px;
  color: #64748b;
  transition: transform 0.2s ease;
}
.ux-ann-section.collapsed .ux-chevron {
  transform: rotate(-90deg);
}

/* Section description */
.ux-ann-section-desc {
  padding: 0 20px 6px 38px;
  font-size: 11px;
  color: #64748b;
  font-style: italic;
  line-height: 1.4;
}
.ux-ann-section.collapsed .ux-ann-section-desc {
  display: none;
}

/* Section items container */
.ux-ann-section-items {
  padding: 0 12px;
}
.ux-ann-section.collapsed .ux-ann-section-items {
  display: none;
}

/* Finding item */
.ux-ann-item {
  padding: 10px 12px;
  margin: 2px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.1s ease;
}
.ux-ann-item:hover {
  background: rgba(255,255,255,0.04);
}
.ux-ann-item.active {
  background: rgba(99,102,241,0.1);
  outline: 1px solid rgba(99,102,241,0.3);
}
.ux-ann-item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.ux-ann-item-badge {
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  padding: 2px 7px;
  border-radius: 4px;
  flex-shrink: 0;
}
.ux-ann-item-title {
  font-size: 13px;
  font-weight: 500;
  color: #e2e8f0;
  flex: 1;
}
.ux-ann-severity {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 6px;
  border-radius: 3px;
  flex-shrink: 0;
}
.ux-ann-severity.blocker { background: rgba(239,68,68,0.2); color: #fca5a5; }
.ux-ann-severity.major { background: rgba(245,158,11,0.2); color: #fcd34d; }
.ux-ann-severity.minor { background: rgba(59,130,246,0.2); color: #93c5fd; }
.ux-ann-item-desc {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
  padding-left: 35px;
}

/* Keyboard hints */
.ux-ann-kbd-hints {
  padding: 10px 20px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}
.ux-ann-kbd-hint {
  font-size: 10px;
  color: #475569;
}
.ux-ann-kbd-hint kbd {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 3px;
  padding: 1px 5px;
  font-size: 10px;
  font-family: inherit;
  color: #94a3b8;
  margin-right: 3px;
}

/* --- Inline Highlights (11 categories on page elements) --- */

/* Token Drift — Red */
.ux-hl-token { outline: 3px dashed #ef4444 !important; outline-offset: 2px; position: relative; }
/* Typography — Blue */
.ux-hl-typo { outline: 3px dashed #3b82f6 !important; outline-offset: 2px; position: relative; }
/* Component Fidelity — Orange */
.ux-hl-comp { outline: 3px dashed #f97316 !important; outline-offset: 2px; position: relative; }
/* Layout — Purple */
.ux-hl-layout { outline: 3px dashed #8b5cf6 !important; outline-offset: 2px; position: relative; }
/* State/Interaction — Amber */
.ux-hl-state { outline: 3px dashed #f59e0b !important; outline-offset: 2px; position: relative; }
/* Responsive — Teal */
.ux-hl-resp { outline: 3px dashed #14b8a6 !important; outline-offset: 2px; position: relative; }
/* Undocumented — Green */
.ux-hl-undoc { outline: 3px dashed #10b981 !important; outline-offset: 2px; position: relative; }
/* Scope Creep — Rose */
.ux-hl-scope { outline: 3px dashed #f43f5e !important; outline-offset: 2px; position: relative; }
/* Placeholder — Gray */
.ux-hl-placeholder { outline: 3px dashed #9ca3af !important; outline-offset: 2px; position: relative; }
/* Cross-Page — Violet */
.ux-hl-xpage { outline: 3px dashed #7c3aed !important; outline-offset: 2px; position: relative; }
/* Self-Validation — Cyan */
.ux-hl-selfval { outline: 3px dashed #06b6d4 !important; outline-offset: 2px; position: relative; }

/* Badge on highlighted elements */
.ux-ann-badge {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  z-index: 9999;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  transition: transform 0.15s ease;
  font-family: var(--font-body, 'Inter', -apple-system, sans-serif);
}
.ux-ann-badge:hover {
  transform: scale(1.15);
}

/* Badge colors by category */
.ux-ann-badge.cat-token { background: #ef4444; }
.ux-ann-badge.cat-typo { background: #3b82f6; }
.ux-ann-badge.cat-comp { background: #f97316; }
.ux-ann-badge.cat-layout { background: #8b5cf6; }
.ux-ann-badge.cat-state { background: #f59e0b; }
.ux-ann-badge.cat-resp { background: #14b8a6; }
.ux-ann-badge.cat-undoc { background: #10b981; }
.ux-ann-badge.cat-scope { background: #f43f5e; }
.ux-ann-badge.cat-placeholder { background: #9ca3af; }
.ux-ann-badge.cat-xpage { background: #7c3aed; }
.ux-ann-badge.cat-selfval { background: #06b6d4; }

/* --- Hover Tooltip (shared single element) --- */
.ux-ann-tooltip {
  position: fixed;
  z-index: 10002;
  background: #1e293b;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 10px 14px;
  max-width: 280px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
  font-family: var(--font-body, 'Inter', -apple-system, sans-serif);
  box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}
.ux-ann-tooltip.visible { opacity: 1; }
.ux-ann-tooltip-id {
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 4px;
}
.ux-ann-tooltip-title {
  font-size: 12px;
  font-weight: 500;
  color: #e2e8f0;
  margin-bottom: 4px;
}
.ux-ann-tooltip-sev {
  display: inline-block;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 6px;
  border-radius: 3px;
}
.ux-ann-tooltip-sev.blocker { background: rgba(239,68,68,0.2); color: #fca5a5; }
.ux-ann-tooltip-sev.major { background: rgba(245,158,11,0.2); color: #fcd34d; }
.ux-ann-tooltip-sev.minor { background: rgba(59,130,246,0.2); color: #93c5fd; }
.ux-ann-tooltip .ux-cat-border { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; border-radius: 8px 0 0 8px; }

/* Pulse animation for scroll-to-element */
@keyframes ux-ann-pulse {
  0% { outline-offset: 2px; }
  50% { outline-offset: 6px; }
  100% { outline-offset: 2px; }
}
.ux-ann-pulse {
  animation: ux-ann-pulse 0.6s ease 2;
}
```

---

## 2. How to Apply Highlights

### Standard elements (div, section, table, etc.)

```html
<!-- Token Drift example -->
<div class="metric-card ux-hl-token" style="position: relative;">
  <span class="ux-ann-badge cat-token"
    data-ann-id="T1"
    data-ann-title="Primary color uses hardcoded hex instead of CSS variable"
    data-ann-severity="MINOR">T1</span>
  <!-- original content unchanged -->
</div>

<!-- Typography Mismatch example -->
<h2 class="section-title ux-hl-typo" style="position: relative;">
  <span class="ux-ann-badge cat-typo"
    data-ann-id="Y3"
    data-ann-title="Section title uses Inter instead of Playfair Display"
    data-ann-severity="MAJOR">Y3</span>
  Section Title
</h2>

<!-- Component Fidelity example -->
<div class="status-badge ux-hl-comp" style="position: relative;">
  <span class="ux-ann-badge cat-comp"
    data-ann-id="K2"
    data-ann-title="Badge missing colored dot prefix per UX spec"
    data-ann-severity="MAJOR">K2</span>
  Active
</div>

<!-- Layout Deviation example -->
<div class="sidebar ux-hl-layout" style="position: relative;">
  <span class="ux-ann-badge cat-layout"
    data-ann-id="L1"
    data-ann-title="Sidebar width is 240px, UX spec requires 220px"
    data-ann-severity="BLOCKER">L1</span>
  <!-- sidebar content -->
</div>

<!-- State/Interaction Gap example -->
<button class="filter-pill ux-hl-state" style="position: relative;">
  <span class="ux-ann-badge cat-state"
    data-ann-id="I5"
    data-ann-title="Missing hover state defined in UX interaction spec"
    data-ann-severity="MINOR">I5</span>
  All Resources
</button>

<!-- Responsive Mismatch example -->
<div class="metrics-grid ux-hl-resp" style="position: relative;">
  <span class="ux-ann-badge cat-resp"
    data-ann-id="R1"
    data-ann-title="Grid does not collapse to 2-col at ≤1280px breakpoint"
    data-ann-severity="MAJOR">R1</span>
  <!-- grid content -->
</div>

<!-- Undocumented Pattern example -->
<div class="custom-tooltip ux-hl-undoc" style="position: relative;">
  <span class="ux-ann-badge cat-undoc"
    data-ann-id="U1"
    data-ann-title="Custom tooltip pattern not in UX design system"
    data-ann-severity="MINOR">U1</span>
  <!-- content -->
</div>

<!-- Scope Creep example -->
<div class="animated-banner ux-hl-scope" style="position: relative;">
  <span class="ux-ann-badge cat-scope"
    data-ann-id="S2"
    data-ann-title="Animated banner not defined in UX spec"
    data-ann-severity="MAJOR">S2</span>
  <!-- content -->
</div>

<!-- Placeholder example -->
<img class="ux-hl-placeholder" style="position: relative;"
  src="https://placeholder.com/300">
  <span class="ux-ann-badge cat-placeholder"
    data-ann-id="P1"
    data-ann-title="Stock placeholder image"
    data-ann-severity="MINOR">P1</span>
</img>

<!-- Cross-Page Inconsistency example -->
<nav class="sidebar-nav ux-hl-xpage" style="position: relative;">
  <span class="ux-ann-badge cat-xpage"
    data-ann-id="X1"
    data-ann-title="Sidebar nav active border is 2px here but 3px on Directory page"
    data-ann-severity="MAJOR">X1</span>
  <!-- content -->
</nav>

<!-- Mock Self-Validation example -->
<span class="resource-count ux-hl-selfval" style="position: relative;">
  <span class="ux-ann-badge cat-selfval"
    data-ann-id="M1"
    data-ann-title="Header says 47 resources but table shows 45 rows"
    data-ann-severity="MAJOR">M1</span>
  47 resources
</span>
```

### Void elements (img, input, hr, br)

Wrap in a `<span>` with `display:inline-block; position:relative`:

```html
<span class="ux-hl-token" style="display:inline-block; position:relative;">
  <span class="ux-ann-badge cat-token"
    data-ann-id="T5"
    data-ann-title="Image border-radius should be rounded-xl (12px)"
    data-ann-severity="MINOR">T5</span>
  <img src="avatar.png" alt="User" />
</span>
```

---

## 3. Toggle Button HTML Template

```html
<button class="ux-ann-toggle-btn" onclick="uxAnnTogglePanel()">
  <span>UX Audit</span>
  <span class="ux-ann-count">
    <!-- Only include dots for categories that have findings -->
    <span class="dot-t"></span><span>N</span>
    <span class="dot-y"></span><span>N</span>
    <span class="dot-k"></span><span>N</span>
    <span class="dot-l"></span><span>N</span>
    <span class="dot-i"></span><span>N</span>
    <span class="dot-r"></span><span>N</span>
    <span class="dot-u"></span><span>N</span>
    <span class="dot-s"></span><span>N</span>
    <span class="dot-p"></span><span>N</span>
    <span class="dot-x"></span><span>N</span>
    <span class="dot-m"></span><span>N</span>
  </span>
</button>
```

---

## 4. Tooltip HTML Template

Single shared tooltip element — positioned dynamically by JS:

```html
<div class="ux-ann-tooltip" id="uxAnnTooltip">
  <div class="ux-cat-border" id="uxAnnTooltipBorder"></div>
  <div class="ux-ann-tooltip-id" id="uxAnnTooltipId"></div>
  <div class="ux-ann-tooltip-title" id="uxAnnTooltipTitle"></div>
  <span class="ux-ann-tooltip-sev" id="uxAnnTooltipSev"></span>
</div>
```

---

## 5. Annotation Panel HTML Template

```html
<div class="ux-ann-panel" id="uxAnnPanel">

  <!-- Header -->
  <div class="ux-ann-panel-header">
    <h2>
      UX Audit
      <span class="ux-label">Design System</span>
    </h2>
    <button class="ux-ann-panel-close" onclick="uxAnnTogglePanel()">&times;</button>
  </div>

  <!-- Stats -->
  <div class="ux-ann-stats">
    <span class="ux-ann-stat total">Total: <strong>N</strong></span>
    <span class="ux-ann-stat blocker">Blocker: <strong>N</strong></span>
    <span class="ux-ann-stat major">Major: <strong>N</strong></span>
    <span class="ux-ann-stat minor">Minor: <strong>N</strong></span>
  </div>

  <!-- Search -->
  <div class="ux-ann-search">
    <input type="text" id="uxAnnSearchInput" placeholder="Search by ID, keyword, or spec section..." oninput="uxAnnFilterFindings(this.value)" />
  </div>

  <!-- Legend (only categories with findings) -->
  <div class="ux-ann-legend">
    <!-- Include only categories that have findings on this page -->
    <div class="ux-ann-legend-item"><span class="ux-ann-legend-dot" style="background:#ef4444"></span>Token Drift</div>
    <div class="ux-ann-legend-item"><span class="ux-ann-legend-dot" style="background:#3b82f6"></span>Typography</div>
    <div class="ux-ann-legend-item"><span class="ux-ann-legend-dot" style="background:#f97316"></span>Component</div>
    <div class="ux-ann-legend-item"><span class="ux-ann-legend-dot" style="background:#8b5cf6"></span>Layout</div>
    <div class="ux-ann-legend-item"><span class="ux-ann-legend-dot" style="background:#f59e0b"></span>State/Interaction</div>
    <div class="ux-ann-legend-item"><span class="ux-ann-legend-dot" style="background:#14b8a6"></span>Responsive</div>
    <div class="ux-ann-legend-item"><span class="ux-ann-legend-dot" style="background:#10b981"></span>Undocumented</div>
    <div class="ux-ann-legend-item"><span class="ux-ann-legend-dot" style="background:#f43f5e"></span>Scope Creep</div>
    <div class="ux-ann-legend-item"><span class="ux-ann-legend-dot" style="background:#9ca3af"></span>Placeholder</div>
    <div class="ux-ann-legend-item"><span class="ux-ann-legend-dot" style="background:#7c3aed"></span>Cross-Page</div>
    <div class="ux-ann-legend-item"><span class="ux-ann-legend-dot" style="background:#06b6d4"></span>Self-Validation</div>
  </div>

  <!-- Scrollable Body with Sections -->
  <div class="ux-ann-body" id="uxAnnBody">

    <!-- === SECTION: Token Drift (only if findings exist) === -->
    <div class="ux-ann-section" data-cat="token" id="uxSec-token">
      <div class="ux-ann-section-header" onclick="uxAnnToggleSection('token')">
        <span class="ux-section-left">
          <span class="ux-section-dot" style="background:#ef4444"></span>
          <span class="ux-section-label">Token Drift</span>
          <span class="ux-section-count">N</span>
        </span>
        <span class="ux-section-right">
          <button class="ux-eye-btn" onclick="event.stopPropagation(); uxAnnToggleCat('token')" title="Toggle visibility">👁</button>
          <span class="ux-chevron">▼</span>
        </span>
      </div>
      <div class="ux-ann-section-desc">T — Design token value in mock does not match UX spec</div>
      <div class="ux-ann-section-items">
        <!-- Finding items go here -->
        <div class="ux-ann-item" data-id="T1" onclick="uxAnnScrollTo('T1')">
          <div class="ux-ann-item-header">
            <span class="ux-ann-item-badge" style="background:#ef4444">T1</span>
            <span class="ux-ann-item-title">Finding title here</span>
            <span class="ux-ann-severity blocker">BLOCKER</span>
          </div>
          <div class="ux-ann-item-desc">Finding description here.</div>
        </div>
        <!-- More T findings... -->
      </div>
    </div>

    <!-- === SECTION: Typography Mismatch === -->
    <div class="ux-ann-section" data-cat="typo" id="uxSec-typo">
      <div class="ux-ann-section-header" onclick="uxAnnToggleSection('typo')">
        <span class="ux-section-left">
          <span class="ux-section-dot" style="background:#3b82f6"></span>
          <span class="ux-section-label">Typography Mismatch</span>
          <span class="ux-section-count">N</span>
        </span>
        <span class="ux-section-right">
          <button class="ux-eye-btn" onclick="event.stopPropagation(); uxAnnToggleCat('typo')" title="Toggle visibility">👁</button>
          <span class="ux-chevron">▼</span>
        </span>
      </div>
      <div class="ux-ann-section-desc">Y — Font family, size, weight, or text treatment deviates from UX type scale</div>
      <div class="ux-ann-section-items">
        <!-- Y findings -->
      </div>
    </div>

    <!-- === SECTION: Component Fidelity === -->
    <div class="ux-ann-section" data-cat="comp" id="uxSec-comp">
      <div class="ux-ann-section-header" onclick="uxAnnToggleSection('comp')">
        <span class="ux-section-left">
          <span class="ux-section-dot" style="background:#f97316"></span>
          <span class="ux-section-label">Component Fidelity</span>
          <span class="ux-section-count">N</span>
        </span>
        <span class="ux-section-right">
          <button class="ux-eye-btn" onclick="event.stopPropagation(); uxAnnToggleCat('comp')" title="Toggle visibility">👁</button>
          <span class="ux-chevron">▼</span>
        </span>
      </div>
      <div class="ux-ann-section-desc">K — Component markup, anatomy, or variant deviates from UX component spec</div>
      <div class="ux-ann-section-items">
        <!-- K findings -->
      </div>
    </div>

    <!-- === SECTION: Layout Deviation === -->
    <div class="ux-ann-section" data-cat="layout" id="uxSec-layout">
      <div class="ux-ann-section-header" onclick="uxAnnToggleSection('layout')">
        <span class="ux-section-left">
          <span class="ux-section-dot" style="background:#8b5cf6"></span>
          <span class="ux-section-label">Layout Deviation</span>
          <span class="ux-section-count">N</span>
        </span>
        <span class="ux-section-right">
          <button class="ux-eye-btn" onclick="event.stopPropagation(); uxAnnToggleCat('layout')" title="Toggle visibility">👁</button>
          <span class="ux-chevron">▼</span>
        </span>
      </div>
      <div class="ux-ann-section-desc">L — Grid, dimensions, padding, or page structure does not match UX layout system</div>
      <div class="ux-ann-section-items">
        <!-- L findings -->
      </div>
    </div>

    <!-- === SECTION: State & Interaction Gap === -->
    <div class="ux-ann-section" data-cat="state" id="uxSec-state">
      <div class="ux-ann-section-header" onclick="uxAnnToggleSection('state')">
        <span class="ux-section-left">
          <span class="ux-section-dot" style="background:#f59e0b"></span>
          <span class="ux-section-label">State & Interaction Gap</span>
          <span class="ux-section-count">N</span>
        </span>
        <span class="ux-section-right">
          <button class="ux-eye-btn" onclick="event.stopPropagation(); uxAnnToggleCat('state')" title="Toggle visibility">👁</button>
          <span class="ux-chevron">▼</span>
        </span>
      </div>
      <div class="ux-ann-section-desc">I — Interactive state or animation defined in UX but absent or wrong in mock</div>
      <div class="ux-ann-section-items">
        <!-- I findings -->
      </div>
    </div>

    <!-- === SECTION: Responsive Mismatch === -->
    <div class="ux-ann-section" data-cat="resp" id="uxSec-resp">
      <div class="ux-ann-section-header" onclick="uxAnnToggleSection('resp')">
        <span class="ux-section-left">
          <span class="ux-section-dot" style="background:#14b8a6"></span>
          <span class="ux-section-label">Responsive Mismatch</span>
          <span class="ux-section-count">N</span>
        </span>
        <span class="ux-section-right">
          <button class="ux-eye-btn" onclick="event.stopPropagation(); uxAnnToggleCat('resp')" title="Toggle visibility">👁</button>
          <span class="ux-chevron">▼</span>
        </span>
      </div>
      <div class="ux-ann-section-desc">R — Breakpoint behavior defined in UX not reflected in mock</div>
      <div class="ux-ann-section-items">
        <!-- R findings -->
      </div>
    </div>

    <!-- === SECTION: Undocumented Pattern === -->
    <div class="ux-ann-section" data-cat="undoc" id="uxSec-undoc">
      <div class="ux-ann-section-header" onclick="uxAnnToggleSection('undoc')">
        <span class="ux-section-left">
          <span class="ux-section-dot" style="background:#10b981"></span>
          <span class="ux-section-label">Undocumented Pattern</span>
          <span class="ux-section-count">N</span>
        </span>
        <span class="ux-section-right">
          <button class="ux-eye-btn" onclick="event.stopPropagation(); uxAnnToggleCat('undoc')" title="Toggle visibility">👁</button>
          <span class="ux-chevron">▼</span>
        </span>
      </div>
      <div class="ux-ann-section-desc">U — Mock implements tokens, components, or patterns not documented in UX spec</div>
      <div class="ux-ann-section-items">
        <!-- U findings -->
      </div>
    </div>

    <!-- === SECTION: Visual Scope Creep === -->
    <div class="ux-ann-section" data-cat="scope" id="uxSec-scope">
      <div class="ux-ann-section-header" onclick="uxAnnToggleSection('scope')">
        <span class="ux-section-left">
          <span class="ux-section-dot" style="background:#f43f5e"></span>
          <span class="ux-section-label">Visual Scope Creep</span>
          <span class="ux-section-count">N</span>
        </span>
        <span class="ux-section-right">
          <button class="ux-eye-btn" onclick="event.stopPropagation(); uxAnnToggleCat('scope')" title="Toggle visibility">👁</button>
          <span class="ux-chevron">▼</span>
        </span>
      </div>
      <div class="ux-ann-section-desc">S — Mock introduces visual elements or interactions beyond UX scope</div>
      <div class="ux-ann-section-items">
        <!-- S findings -->
      </div>
    </div>

    <!-- === SECTION: Placeholder Content === -->
    <div class="ux-ann-section" data-cat="placeholder" id="uxSec-placeholder">
      <div class="ux-ann-section-header" onclick="uxAnnToggleSection('placeholder')">
        <span class="ux-section-left">
          <span class="ux-section-dot" style="background:#9ca3af"></span>
          <span class="ux-section-label">Placeholder Content</span>
          <span class="ux-section-count">N</span>
        </span>
        <span class="ux-section-right">
          <button class="ux-eye-btn" onclick="event.stopPropagation(); uxAnnToggleCat('placeholder')" title="Toggle visibility">👁</button>
          <span class="ux-chevron">▼</span>
        </span>
      </div>
      <div class="ux-ann-section-desc">P — Temporary content: stock images, lorem ipsum, hardcoded data</div>
      <div class="ux-ann-section-items">
        <!-- P findings -->
      </div>
    </div>

    <!-- === SECTION: Cross-Page Inconsistency === -->
    <div class="ux-ann-section" data-cat="xpage" id="uxSec-xpage">
      <div class="ux-ann-section-header" onclick="uxAnnToggleSection('xpage')">
        <span class="ux-section-left">
          <span class="ux-section-dot" style="background:#7c3aed"></span>
          <span class="ux-section-label">Cross-Page Inconsistency</span>
          <span class="ux-section-count">N</span>
        </span>
        <span class="ux-section-right">
          <button class="ux-eye-btn" onclick="event.stopPropagation(); uxAnnToggleCat('xpage')" title="Toggle visibility">👁</button>
          <span class="ux-chevron">▼</span>
        </span>
      </div>
      <div class="ux-ann-section-desc">X — Same component renders differently across mock pages</div>
      <div class="ux-ann-section-items">
        <!-- X findings -->
      </div>
    </div>

    <!-- === SECTION: Mock Self-Validation === -->
    <div class="ux-ann-section" data-cat="selfval" id="uxSec-selfval">
      <div class="ux-ann-section-header" onclick="uxAnnToggleSection('selfval')">
        <span class="ux-section-left">
          <span class="ux-section-dot" style="background:#06b6d4"></span>
          <span class="ux-section-label">Mock Self-Validation</span>
          <span class="ux-section-count">N</span>
        </span>
        <span class="ux-section-right">
          <button class="ux-eye-btn" onclick="event.stopPropagation(); uxAnnToggleCat('selfval')" title="Toggle visibility">👁</button>
          <span class="ux-chevron">▼</span>
        </span>
      </div>
      <div class="ux-ann-section-desc">M — Mock contradicts itself: data mismatches, dead-end flows, alignment breaks</div>
      <div class="ux-ann-section-items">
        <!-- M findings -->
      </div>
    </div>

  </div><!-- /ux-ann-body -->

  <!-- Keyboard hints -->
  <div class="ux-ann-kbd-hints">
    <span class="ux-ann-kbd-hint"><kbd>Esc</kbd> close</span>
    <span class="ux-ann-kbd-hint"><kbd>[</kbd><kbd>]</kbd> prev/next</span>
    <span class="ux-ann-kbd-hint"><kbd>/</kbd> search</span>
  </div>

</div><!-- /ux-ann-panel -->
```

---

## 6. Annotation Panel JavaScript

```javascript
/* ============================================================
   UX AUDIT — Annotation Panel Interactivity
   ============================================================ */
(function() {
  'use strict';

  /* --- Category map: data-cat → highlight CSS class --- */
  const CAT_MAP = {
    token:       'ux-hl-token',
    typo:        'ux-hl-typo',
    comp:        'ux-hl-comp',
    layout:      'ux-hl-layout',
    state:       'ux-hl-state',
    resp:        'ux-hl-resp',
    undoc:       'ux-hl-undoc',
    scope:       'ux-hl-scope',
    placeholder: 'ux-hl-placeholder',
    xpage:       'ux-hl-xpage',
    selfval:     'ux-hl-selfval'
  };

  const panel = document.getElementById('uxAnnPanel');
  const tooltip = document.getElementById('uxAnnTooltip');
  let currentFindingIndex = -1;
  let allFindings = [];

  /* --- Build flat finding list for keyboard nav --- */
  function buildFindingList() {
    allFindings = Array.from(document.querySelectorAll('.ux-ann-item[data-id]'));
  }

  /* --- Panel open / close --- */
  window.uxAnnTogglePanel = function() {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      buildFindingList();
    }
  };

  /* --- Section collapse / expand --- */
  window.uxAnnToggleSection = function(cat) {
    const sec = document.getElementById('uxSec-' + cat);
    if (sec) sec.classList.toggle('collapsed');
  };

  /* --- Category visibility toggle (eye button) --- */
  window.uxAnnToggleCat = function(cat) {
    const hlClass = CAT_MAP[cat];
    if (!hlClass) return;
    const eyeBtn = document.querySelector('#uxSec-' + cat + ' .ux-eye-btn');
    const els = document.querySelectorAll('.' + hlClass);
    const isHidden = eyeBtn && eyeBtn.classList.contains('hidden-cat');
    els.forEach(el => {
      const badge = el.querySelector('.ux-ann-badge');
      if (isHidden) {
        el.style.outlineColor = '';
        if (badge) badge.style.display = '';
      } else {
        el.style.outlineColor = 'transparent';
        if (badge) badge.style.display = 'none';
      }
    });
    if (eyeBtn) eyeBtn.classList.toggle('hidden-cat');
  };

  /* --- Scroll page to element (panel → page) --- */
  window.uxAnnScrollTo = function(id) {
    const badge = document.querySelector('.ux-ann-badge[data-ann-id="' + id + '"]');
    if (!badge) return;
    const el = badge.parentElement;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('ux-ann-pulse');
    setTimeout(() => el.classList.remove('ux-ann-pulse'), 1500);
    /* Highlight item in panel */
    document.querySelectorAll('.ux-ann-item.active').forEach(i => i.classList.remove('active'));
    const item = document.querySelector('.ux-ann-item[data-id="' + id + '"]');
    if (item) {
      item.classList.add('active');
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    currentFindingIndex = allFindings.indexOf(item);
  };

  /* --- Badge click → open panel + scroll to finding --- */
  document.addEventListener('click', function(e) {
    const badge = e.target.closest('.ux-ann-badge');
    if (!badge) return;
    e.stopPropagation();
    const id = badge.getAttribute('data-ann-id');
    if (!panel.classList.contains('open')) {
      panel.classList.add('open');
      buildFindingList();
    }
    /* Find and expand section */
    const item = document.querySelector('.ux-ann-item[data-id="' + id + '"]');
    if (item) {
      const section = item.closest('.ux-ann-section');
      if (section && section.classList.contains('collapsed')) {
        section.classList.remove('collapsed');
      }
      document.querySelectorAll('.ux-ann-item.active').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
      currentFindingIndex = allFindings.indexOf(item);
    }
  });

  /* --- Badge hover → show tooltip --- */
  document.addEventListener('mouseover', function(e) {
    const badge = e.target.closest('.ux-ann-badge');
    if (!badge || !tooltip) return;
    const id = badge.getAttribute('data-ann-id');
    const title = badge.getAttribute('data-ann-title');
    const sev = badge.getAttribute('data-ann-severity');
    document.getElementById('uxAnnTooltipId').textContent = id;
    document.getElementById('uxAnnTooltipTitle').textContent = title;
    const sevEl = document.getElementById('uxAnnTooltipSev');
    sevEl.textContent = sev;
    sevEl.className = 'ux-ann-tooltip-sev ' + sev.toLowerCase();
    /* Position tooltip */
    const rect = badge.getBoundingClientRect();
    tooltip.style.top = (rect.bottom + 8) + 'px';
    tooltip.style.left = Math.min(rect.left, window.innerWidth - 300) + 'px';
    /* Category border color */
    const catBorder = document.getElementById('uxAnnTooltipBorder');
    const catClass = Array.from(badge.classList).find(c => c.startsWith('cat-'));
    const colorMap = {
      'cat-token': '#ef4444', 'cat-typo': '#3b82f6', 'cat-comp': '#f97316',
      'cat-layout': '#8b5cf6', 'cat-state': '#f59e0b', 'cat-resp': '#14b8a6',
      'cat-undoc': '#10b981', 'cat-scope': '#f43f5e', 'cat-placeholder': '#9ca3af',
      'cat-xpage': '#7c3aed', 'cat-selfval': '#06b6d4'
    };
    catBorder.style.background = colorMap[catClass] || '#6366f1';
    tooltip.classList.add('visible');
  });
  document.addEventListener('mouseout', function(e) {
    if (e.target.closest('.ux-ann-badge') && tooltip) {
      tooltip.classList.remove('visible');
    }
  });

  /* --- Keyboard navigation --- */
  document.addEventListener('keydown', function(e) {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') {
      panel.classList.remove('open');
      return;
    }
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      document.getElementById('uxAnnSearchInput').focus();
      return;
    }
    if (e.key === ']' || e.key === '[') {
      e.preventDefault();
      if (allFindings.length === 0) return;
      if (e.key === ']') {
        currentFindingIndex = (currentFindingIndex + 1) % allFindings.length;
      } else {
        currentFindingIndex = (currentFindingIndex - 1 + allFindings.length) % allFindings.length;
      }
      const item = allFindings[currentFindingIndex];
      const id = item.getAttribute('data-id');
      uxAnnScrollTo(id);
    }
  });

  /* --- Search / Filter --- */
  window.uxAnnFilterFindings = function(query) {
    const q = query.toLowerCase().trim();
    document.querySelectorAll('.ux-ann-item').forEach(item => {
      const id = (item.getAttribute('data-id') || '').toLowerCase();
      const title = (item.querySelector('.ux-ann-item-title') || {}).textContent || '';
      const desc = (item.querySelector('.ux-ann-item-desc') || {}).textContent || '';
      const match = !q || id.includes(q) || title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
      item.style.display = match ? '' : 'none';
    });
    /* Auto-expand sections with visible items, collapse empty ones */
    document.querySelectorAll('.ux-ann-section').forEach(sec => {
      const visibleItems = sec.querySelectorAll('.ux-ann-item:not([style*="display: none"])');
      if (q && visibleItems.length > 0) {
        sec.classList.remove('collapsed');
      }
    });
    buildFindingList();
  };

  /* Init */
  buildFindingList();
})();
```

---

## 7. Visual Audit Page Template (Screenshot Overlays)

This is the **new deliverable** — an HTML page that displays the full-page screenshot with finding annotations overlaid as positioned colored boxes.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Visual Audit — PAGE_NAME</title>
<style>
  /* ============================================================
     VISUAL AUDIT — Screenshot Overlay System
     ============================================================ */
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #0a0a0f;
    color: #e2e8f0;
    min-height: 100vh;
  }

  /* --- Top Bar --- */
  .va-topbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 14px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    backdrop-filter: blur(12px);
  }
  .va-topbar h1 {
    font-size: 15px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .va-topbar h1 .va-label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: rgba(99,102,241,0.2);
    color: #a5b4fc;
    padding: 3px 8px;
    border-radius: 4px;
  }
  .va-topbar-stats {
    display: flex;
    gap: 8px;
  }
  .va-topbar-stat {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 6px;
  }
  .va-topbar-stat.total { background: rgba(255,255,255,0.08); }
  .va-topbar-stat.blocker { background: rgba(239,68,68,0.15); color: #fca5a5; }
  .va-topbar-stat.major { background: rgba(245,158,11,0.15); color: #fcd34d; }
  .va-topbar-stat.minor { background: rgba(59,130,246,0.15); color: #93c5fd; }

  /* --- Viewport Tabs --- */
  .va-viewport-tabs {
    display: flex;
    gap: 0;
    padding: 0 24px;
    background: #0f172a;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .va-viewport-tab {
    padding: 10px 20px;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.15s ease;
  }
  .va-viewport-tab:hover { color: #94a3b8; }
  .va-viewport-tab.active {
    color: #a5b4fc;
    border-bottom-color: #6366f1;
  }

  /* --- Main Layout: Screenshot + Panel --- */
  .va-main {
    display: flex;
    min-height: calc(100vh - 100px);
  }

  /* --- Screenshot Container --- */
  .va-screenshot-area {
    flex: 1;
    padding: 24px;
    overflow: auto;
    display: flex;
    justify-content: center;
  }
  .va-screenshot-wrapper {
    position: relative;
    display: inline-block;
    box-shadow: 0 8px 40px rgba(0,0,0,0.5);
    border-radius: 8px;
    overflow: hidden;
  }
  .va-screenshot-wrapper img {
    display: block;
    max-width: 100%;
    height: auto;
  }

  /* --- Overlay Annotations on Screenshot --- */
  .va-overlay {
    position: absolute;
    border: 2px solid;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .va-overlay:hover {
    z-index: 10;
    transform: scale(1.01);
  }
  .va-overlay-badge {
    position: absolute;
    top: -10px;
    left: -10px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 700;
    color: #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  }

  /* Overlay category colors */
  .va-overlay.cat-token       { border-color: #ef4444; background: rgba(239,68,68,0.12); }
  .va-overlay.cat-typo        { border-color: #3b82f6; background: rgba(59,130,246,0.12); }
  .va-overlay.cat-comp        { border-color: #f97316; background: rgba(249,115,22,0.12); }
  .va-overlay.cat-layout      { border-color: #8b5cf6; background: rgba(139,92,246,0.12); }
  .va-overlay.cat-state       { border-color: #f59e0b; background: rgba(245,158,11,0.12); }
  .va-overlay.cat-resp        { border-color: #14b8a6; background: rgba(20,184,166,0.12); }
  .va-overlay.cat-undoc       { border-color: #10b981; background: rgba(16,185,129,0.12); }
  .va-overlay.cat-scope       { border-color: #f43f5e; background: rgba(244,63,94,0.12); }
  .va-overlay.cat-placeholder { border-color: #9ca3af; background: rgba(156,163,175,0.12); }
  .va-overlay.cat-xpage       { border-color: #7c3aed; background: rgba(124,58,237,0.12); }
  .va-overlay.cat-selfval     { border-color: #06b6d4; background: rgba(6,182,212,0.12); }

  .va-overlay-badge.cat-token       { background: #ef4444; }
  .va-overlay-badge.cat-typo        { background: #3b82f6; }
  .va-overlay-badge.cat-comp        { background: #f97316; }
  .va-overlay-badge.cat-layout      { background: #8b5cf6; }
  .va-overlay-badge.cat-state       { background: #f59e0b; }
  .va-overlay-badge.cat-resp        { background: #14b8a6; }
  .va-overlay-badge.cat-undoc       { background: #10b981; }
  .va-overlay-badge.cat-scope       { background: #f43f5e; }
  .va-overlay-badge.cat-placeholder { background: #9ca3af; }
  .va-overlay-badge.cat-xpage       { background: #7c3aed; }
  .va-overlay-badge.cat-selfval     { background: #06b6d4; }

  /* --- Right Detail Panel --- */
  .va-panel {
    width: 380px;
    background: #0f172a;
    border-left: 1px solid rgba(255,255,255,0.08);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow-y: auto;
  }
  .va-panel-header {
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    font-size: 13px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* Legend in panel */
  .va-panel-legend {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    padding: 12px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .va-panel-legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    color: #64748b;
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 4px;
    transition: background 0.1s;
  }
  .va-panel-legend-item:hover { background: rgba(255,255,255,0.04); }
  .va-panel-legend-item.active { color: #e2e8f0; }
  .va-panel-legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* Finding list in panel */
  .va-panel-findings {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
  }
  .va-finding {
    padding: 12px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    cursor: pointer;
    transition: background 0.1s;
  }
  .va-finding:hover { background: rgba(255,255,255,0.03); }
  .va-finding.active { background: rgba(99,102,241,0.1); border-left: 3px solid #6366f1; }
  .va-finding-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }
  .va-finding-badge {
    font-size: 10px;
    font-weight: 700;
    color: #fff;
    padding: 2px 6px;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .va-finding-title {
    font-size: 12px;
    font-weight: 500;
    color: #e2e8f0;
    flex: 1;
  }
  .va-finding-sev {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    padding: 2px 5px;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .va-finding-sev.blocker { background: rgba(239,68,68,0.2); color: #fca5a5; }
  .va-finding-sev.major { background: rgba(245,158,11,0.2); color: #fcd34d; }
  .va-finding-sev.minor { background: rgba(59,130,246,0.2); color: #93c5fd; }
  .va-finding-desc {
    font-size: 11px;
    color: #94a3b8;
    line-height: 1.5;
    padding-left: 32px;
  }
  .va-finding-screenshot-ref {
    font-size: 10px;
    color: #6366f1;
    padding-left: 32px;
    margin-top: 4px;
    font-style: italic;
  }

  /* Pulse on overlay when finding is clicked */
  @keyframes va-pulse {
    0%, 100% { opacity: 0.12; }
    50% { opacity: 0.35; }
  }
  .va-overlay.pulse {
    animation: va-pulse 0.5s ease 3;
  }

  /* --- Responsive Comparison Mode --- */
  .va-compare-container {
    display: flex;
    gap: 16px;
    padding: 24px;
    overflow-x: auto;
  }
  .va-compare-frame {
    flex-shrink: 0;
    text-align: center;
  }
  .va-compare-frame .va-compare-label {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }
  .va-compare-frame img {
    border-radius: 6px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
</style>
</head>
<body>

  <!-- Top Bar -->
  <div class="va-topbar">
    <h1>
      PAGE_NAME
      <span class="va-label">Visual Audit</span>
    </h1>
    <div class="va-topbar-stats">
      <span class="va-topbar-stat total">Total: N</span>
      <span class="va-topbar-stat blocker">Blocker: N</span>
      <span class="va-topbar-stat major">Major: N</span>
      <span class="va-topbar-stat minor">Minor: N</span>
    </div>
  </div>

  <!-- Viewport Tabs (if multiple viewports) -->
  <div class="va-viewport-tabs" id="vaViewportTabs">
    <div class="va-viewport-tab active" data-viewport="desktop" onclick="vaSwitch('desktop')">Desktop (1440×900)</div>
    <!-- Add these only if responsive screenshots exist -->
    <div class="va-viewport-tab" data-viewport="tablet" onclick="vaSwitch('tablet')">Tablet (768×1024)</div>
    <div class="va-viewport-tab" data-viewport="mobile" onclick="vaSwitch('mobile')">Mobile (375×812)</div>
  </div>

  <!-- Main: Screenshot + Panel -->
  <div class="va-main">

    <!-- Screenshot with Overlays -->
    <div class="va-screenshot-area">
      <div class="va-screenshot-wrapper" id="vaScreenshotWrapper">
        <img id="vaScreenshot" src="../screenshots/desktop/PAGE_NAME-full.png" alt="PAGE_NAME screenshot" />

        <!-- Overlay annotations — positioned absolutely over screenshot -->
        <!-- Each overlay corresponds to a finding with a visual location -->
        <!--
        <div class="va-overlay cat-token"
          style="top: 120px; left: 240px; width: 200px; height: 60px;"
          data-id="T1" onclick="vaSelectFinding('T1')">
          <span class="va-overlay-badge cat-token">T1</span>
        </div>
        -->

      </div>
    </div>

    <!-- Detail Panel -->
    <div class="va-panel">
      <div class="va-panel-header">Findings</div>

      <!-- Legend -->
      <div class="va-panel-legend">
        <!-- Only include categories with findings -->
        <div class="va-panel-legend-item active" data-cat="token" onclick="vaFilterCat('token')">
          <span class="va-panel-legend-dot" style="background:#ef4444"></span>Token Drift
        </div>
        <div class="va-panel-legend-item active" data-cat="typo" onclick="vaFilterCat('typo')">
          <span class="va-panel-legend-dot" style="background:#3b82f6"></span>Typography
        </div>
        <div class="va-panel-legend-item active" data-cat="comp" onclick="vaFilterCat('comp')">
          <span class="va-panel-legend-dot" style="background:#f97316"></span>Component
        </div>
        <div class="va-panel-legend-item active" data-cat="layout" onclick="vaFilterCat('layout')">
          <span class="va-panel-legend-dot" style="background:#8b5cf6"></span>Layout
        </div>
        <div class="va-panel-legend-item active" data-cat="state" onclick="vaFilterCat('state')">
          <span class="va-panel-legend-dot" style="background:#f59e0b"></span>State
        </div>
        <div class="va-panel-legend-item active" data-cat="resp" onclick="vaFilterCat('resp')">
          <span class="va-panel-legend-dot" style="background:#14b8a6"></span>Responsive
        </div>
        <div class="va-panel-legend-item active" data-cat="undoc" onclick="vaFilterCat('undoc')">
          <span class="va-panel-legend-dot" style="background:#10b981"></span>Undocumented
        </div>
        <div class="va-panel-legend-item active" data-cat="scope" onclick="vaFilterCat('scope')">
          <span class="va-panel-legend-dot" style="background:#f43f5e"></span>Scope Creep
        </div>
        <div class="va-panel-legend-item active" data-cat="placeholder" onclick="vaFilterCat('placeholder')">
          <span class="va-panel-legend-dot" style="background:#9ca3af"></span>Placeholder
        </div>
        <div class="va-panel-legend-item active" data-cat="xpage" onclick="vaFilterCat('xpage')">
          <span class="va-panel-legend-dot" style="background:#7c3aed"></span>Cross-Page
        </div>
        <div class="va-panel-legend-item active" data-cat="selfval" onclick="vaFilterCat('selfval')">
          <span class="va-panel-legend-dot" style="background:#06b6d4"></span>Self-Validation
        </div>
      </div>

      <!-- Findings list -->
      <div class="va-panel-findings" id="vaFindings">
        <!--
        <div class="va-finding" data-id="T1" data-cat="token" onclick="vaSelectFinding('T1')">
          <div class="va-finding-header">
            <span class="va-finding-badge" style="background:#ef4444">T1</span>
            <span class="va-finding-title">Finding title</span>
            <span class="va-finding-sev blocker">BLOCKER</span>
          </div>
          <div class="va-finding-desc">Description text.</div>
          <div class="va-finding-screenshot-ref">See: screenshots/desktop/page-full.png @ 120,240</div>
        </div>
        -->
      </div>
    </div>

  </div>

<script>
/* ============================================================
   VISUAL AUDIT — Screenshot Overlay Interactivity
   ============================================================ */
(function() {
  'use strict';

  const activeCats = new Set([
    'token','typo','comp','layout','state','resp',
    'undoc','scope','placeholder','xpage','selfval'
  ]);

  /* --- Viewport switching --- */
  window.vaSwitch = function(viewport) {
    document.querySelectorAll('.va-viewport-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('[data-viewport="' + viewport + '"]').classList.add('active');
    const img = document.getElementById('vaScreenshot');
    img.src = '../screenshots/' + viewport + '/PAGE_NAME-full.png';
    /* Overlays may need repositioning for different viewport screenshots */
    /* Re-map overlay positions based on viewport data attributes */
    document.querySelectorAll('.va-overlay').forEach(o => {
      const pos = o.getAttribute('data-pos-' + viewport);
      if (pos) {
        const [t, l, w, h] = pos.split(',');
        o.style.top = t + 'px';
        o.style.left = l + 'px';
        o.style.width = w + 'px';
        o.style.height = h + 'px';
        o.style.display = '';
      } else {
        o.style.display = 'none';
      }
    });
  };

  /* --- Finding selection (bidirectional) --- */
  window.vaSelectFinding = function(id) {
    /* Highlight overlay */
    document.querySelectorAll('.va-overlay.pulse').forEach(o => o.classList.remove('pulse'));
    const overlay = document.querySelector('.va-overlay[data-id="' + id + '"]');
    if (overlay) {
      overlay.classList.add('pulse');
      overlay.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    /* Highlight panel item */
    document.querySelectorAll('.va-finding.active').forEach(f => f.classList.remove('active'));
    const finding = document.querySelector('.va-finding[data-id="' + id + '"]');
    if (finding) {
      finding.classList.add('active');
      finding.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  /* --- Category filter toggle --- */
  window.vaFilterCat = function(cat) {
    const item = document.querySelector('.va-panel-legend-item[data-cat="' + cat + '"]');
    if (activeCats.has(cat)) {
      activeCats.delete(cat);
      item.classList.remove('active');
    } else {
      activeCats.add(cat);
      item.classList.add('active');
    }
    /* Show/hide overlays */
    document.querySelectorAll('.va-overlay').forEach(o => {
      const oCat = Array.from(o.classList).find(c => c.startsWith('cat-'));
      const catKey = oCat ? oCat.replace('cat-', '') : '';
      o.style.display = activeCats.has(catKey) ? '' : 'none';
    });
    /* Show/hide panel findings */
    document.querySelectorAll('.va-finding').forEach(f => {
      const fCat = f.getAttribute('data-cat');
      f.style.display = activeCats.has(fCat) ? '' : 'none';
    });
  };

})();
</script>

</body>
</html>
```

---

## 8. Responsive Comparison Section Template

When the UX spec defines responsive breakpoints and screenshots are captured at multiple viewports, add a comparison section to the visual audit page or as a standalone section in analysis.md:

```html
<!-- Insert inside va-screenshot-area when comparison mode is active -->
<div class="va-compare-container" id="vaCompare" style="display:none;">
  <div class="va-compare-frame">
    <div class="va-compare-label">Desktop — 1440×900</div>
    <img src="../screenshots/desktop/PAGE_NAME-full.png" style="max-height:600px;" />
  </div>
  <div class="va-compare-frame">
    <div class="va-compare-label">Tablet — 768×1024</div>
    <img src="../screenshots/tablet/PAGE_NAME-full.png" style="max-height:600px;" />
  </div>
  <div class="va-compare-frame">
    <div class="va-compare-label">Mobile — 375×812</div>
    <img src="../screenshots/mobile/PAGE_NAME-full.png" style="max-height:600px;" />
  </div>
</div>
```

---

## 9. Puppeteer Runtime Analysis Scripts

The Puppeteer runtime analysis engine has been extracted to executable script files in the `scripts/` directory. For detailed phase instructions, see [puppeteer-phases.md](puppeteer-phases.md).

| Script | Phase | Purpose |
|--------|-------|---------|
| `scripts/runtime-audit.js` | 5A–5F | Main engine: tokens, fonts, states, layout, responsive, transitions |
| `scripts/contrast-audit.js` | 5G | WCAG AA/AAA color contrast (conditional) |
| `scripts/dark-mode-audit.js` | 5H | Dark mode / theme verification (conditional) |
| `scripts/component-validation.js` | 5I | Sub-component, state, behavior validation (conditional) |
| `scripts/self-validation.js` | 7A–B | Mock self-validation: counts, links, contradictions |
| `scripts/semantic-html-audit.js` | 7C | Semantic HTML checks (conditional) |
| `scripts/cross-page-consistency.js` | 6 | Cross-page computed style diffs |

### 9A. Interpreting Results

The skill reads `runtime-audit-results.json` and classifies findings:

| Result Field | Condition | Finding Category | Severity Guide |
|-------------|-----------|-----------------|----------------|
| `tokens[].match === false` | CSS variable resolves to wrong value | T (Token Drift) | BLOCKER if brand color, MINOR if subtle |
| `tokens[].missingVariable` | CSS variable not defined at all | T (Token Drift) | BLOCKER |
| `tokens[].usageMismatches[]` | Element uses wrong value for a token | T (Token Drift) | MAJOR if visible, MINOR if hardcoded but correct value |
| `fonts.fontChecks[].loaded === false` | Font family failed to load | Y (Typography) | BLOCKER — renders fallback font |
| `fonts.fontChecks[].elementChecks[].familyMatch === false` | Element renders wrong font family | Y (Typography) | MAJOR |
| `states[].issues` contains `HOVER_STATE_MISSING` | No visual change on hover | I (State/Interaction) | MAJOR if UX defines hover |
| `states[].issues` contains `FOCUS_STATE_MISSING` | No visible focus indicator | I (State/Interaction) | BLOCKER (accessibility) |
| `states[].issues` contains `CURSOR_WRONG` | Wrong cursor on interactive element | I (State/Interaction) | MINOR |
| `layout[].hasDiffs` | Dimension, grid, padding, or spacing mismatch | L (Layout) | BLOCKER if structural, MINOR if small |
| `layout[].isOverflowingX/Y` | Content overflows container | L (Layout) | MAJOR |
| `responsive[].diffs[]` | Breakpoint behavior wrong | R (Responsive) | MAJOR |
| `transitions[].durationMatch === false` | Transition timing wrong | I (State/Interaction) | MINOR |
| `fonts.allLoadedFonts` contains undocumented font | Font loaded but not in UX spec | U (Undocumented) | MINOR |

---

## 10. Interactive Coverage Heatmap Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>UX Design System — Coverage Heatmap</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: #0a0a0f;
    color: #e2e8f0;
    padding: 24px;
  }

  /* Header */
  .hm-header {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .hm-header h1 {
    font-size: 20px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .hm-header .hm-label {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: rgba(99,102,241,0.2);
    color: #a5b4fc;
    padding: 3px 8px;
    border-radius: 4px;
  }

  /* Controls */
  .hm-controls {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    align-items: center;
    flex-wrap: wrap;
  }
  .hm-filter-btn {
    padding: 6px 14px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    background: transparent;
    color: #94a3b8;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
    font-family: inherit;
  }
  .hm-filter-btn:hover { background: rgba(255,255,255,0.05); color: #e2e8f0; }
  .hm-filter-btn.active { background: rgba(99,102,241,0.15); color: #a5b4fc; border-color: rgba(99,102,241,0.3); }
  .hm-search {
    margin-left: auto;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 6px 12px;
    color: #e2e8f0;
    font-size: 12px;
    width: 220px;
    outline: none;
    font-family: inherit;
  }
  .hm-search::placeholder { color: #475569; }
  .hm-search:focus { border-color: rgba(99,102,241,0.4); }

  /* Grid */
  .hm-grid-wrapper {
    overflow-x: auto;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .hm-grid {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
  }
  .hm-grid th {
    padding: 10px 14px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #64748b;
    background: #0f172a;
    position: sticky;
    top: 0;
    z-index: 2;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    text-align: center;
    white-space: nowrap;
  }
  .hm-grid th:first-child {
    text-align: left;
    position: sticky;
    left: 0;
    z-index: 3;
    min-width: 200px;
  }
  .hm-grid td {
    padding: 8px 14px;
    font-size: 12px;
    text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .hm-grid td:first-child {
    text-align: left;
    position: sticky;
    left: 0;
    background: #0a0a0f;
    z-index: 1;
    font-weight: 500;
  }
  .hm-grid tr:hover td { background: rgba(255,255,255,0.02); }
  .hm-grid tr:hover td:first-child { background: rgba(255,255,255,0.04); }

  /* Cells */
  .hm-cell {
    display: inline-block;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s ease;
    position: relative;
  }
  .hm-cell:hover { transform: scale(1.2); z-index: 5; }
  .hm-cell.implemented { background: rgba(16,185,129,0.6); }
  .hm-cell.partial     { background: rgba(245,158,11,0.6); }
  .hm-cell.drifted     { background: rgba(239,68,68,0.6); }
  .hm-cell.missing     { background: rgba(107,114,128,0.4); }

  /* Group headers */
  .hm-group-row td {
    padding: 8px 14px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #a5b4fc;
    background: rgba(99,102,241,0.05) !important;
    border-bottom: 1px solid rgba(99,102,241,0.15);
  }

  /* Summary row */
  .hm-summary-row td {
    font-weight: 700;
    font-size: 13px;
    color: #e2e8f0;
    background: #0f172a !important;
    border-top: 2px solid rgba(255,255,255,0.1);
  }

  /* Status column */
  .hm-status {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 6px;
    vertical-align: middle;
  }

  /* Tooltip */
  .hm-tooltip {
    position: fixed;
    z-index: 100;
    background: #1e293b;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 12px 16px;
    max-width: 320px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .hm-tooltip.visible { opacity: 1; }
  .hm-tooltip-item { font-size: 12px; font-weight: 600; color: #e2e8f0; margin-bottom: 2px; }
  .hm-tooltip-page { font-size: 11px; color: #94a3b8; margin-bottom: 4px; }
  .hm-tooltip-status { font-size: 11px; margin-bottom: 4px; }
  .hm-tooltip-desc { font-size: 11px; color: #94a3b8; line-height: 1.4; }
  .hm-tooltip-finding { font-size: 11px; color: #a5b4fc; margin-top: 4px; }

  /* Detail below grid */
  .hm-detail {
    margin-top: 16px;
    background: #0f172a;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 20px;
    display: none;
  }
  .hm-detail.visible { display: block; }
  .hm-detail-title { font-size: 14px; font-weight: 700; margin-bottom: 8px; }
  .hm-detail-meta { font-size: 12px; color: #94a3b8; margin-bottom: 12px; }
  .hm-detail-desc { font-size: 13px; line-height: 1.6; }

  /* Legend */
  .hm-legend {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }
  .hm-legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #94a3b8;
  }
  .hm-legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 4px;
  }
  .hm-legend-dot.implemented { background: rgba(16,185,129,0.6); }
  .hm-legend-dot.partial     { background: rgba(245,158,11,0.6); }
  .hm-legend-dot.drifted     { background: rgba(239,68,68,0.6); }
  .hm-legend-dot.missing     { background: rgba(107,114,128,0.4); }

  /* Empty state — shown when UX spec has no design system data */
  .hm-empty-state {
    display: none;
    text-align: center;
    padding: 80px 40px;
    border: 2px dashed rgba(255,255,255,0.1);
    border-radius: 16px;
    background: rgba(15,23,42,0.5);
    margin-top: 8px;
  }
  .hm-empty-state.visible { display: block; }
  .hm-empty-state-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 20px;
    border-radius: 50%;
    background: rgba(99,102,241,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: #6366f1;
  }
  .hm-empty-state-title {
    font-size: 18px;
    font-weight: 700;
    color: #e2e8f0;
    margin-bottom: 8px;
  }
  .hm-empty-state-desc {
    font-size: 14px;
    color: #94a3b8;
    line-height: 1.6;
    max-width: 520px;
    margin: 0 auto 24px;
  }
  .hm-empty-state-categories {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
  }
  .hm-empty-state-tag {
    font-size: 11px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 20px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    color: #94a3b8;
  }
  .hm-empty-state-hint {
    font-size: 12px;
    color: #64748b;
    margin-top: 20px;
    font-style: italic;
  }
</style>
</head>
<body>

  <div class="hm-header">
    <h1>UX Coverage Heatmap <span class="hm-label">Design System</span></h1>
  </div>

  <div class="hm-legend">
    <div class="hm-legend-item"><span class="hm-legend-dot implemented"></span>Implemented</div>
    <div class="hm-legend-item"><span class="hm-legend-dot partial"></span>Partial</div>
    <div class="hm-legend-item"><span class="hm-legend-dot drifted"></span>Drifted</div>
    <div class="hm-legend-item"><span class="hm-legend-dot missing"></span>Missing</div>
  </div>

  <div class="hm-controls">
    <button class="hm-filter-btn active" data-filter="all" onclick="hmFilter('all')">All</button>
    <button class="hm-filter-btn" data-filter="implemented" onclick="hmFilter('implemented')">Implemented</button>
    <button class="hm-filter-btn" data-filter="partial" onclick="hmFilter('partial')">Partial</button>
    <button class="hm-filter-btn" data-filter="drifted" onclick="hmFilter('drifted')">Drifted</button>
    <button class="hm-filter-btn" data-filter="missing" onclick="hmFilter('missing')">Missing</button>
    <input type="text" class="hm-search" placeholder="Search spec items..." oninput="hmSearch(this.value)" />
  </div>

  <div class="hm-grid-wrapper">
    <table class="hm-grid" id="hmGrid">
      <thead>
        <tr>
          <th>UX Spec Item</th>
          <!-- One <th> per mock page -->
          <th>PAGE_1</th>
          <th>PAGE_2</th>
          <th>PAGE_3</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody id="hmBody">
        <!-- === Group: Tokens === -->
        <tr class="hm-group-row"><td colspan="99">Design Tokens</td></tr>
        <!--
        <tr data-item="--primary" data-group="tokens">
          <td>--primary (#E84D26)</td>
          <td><span class="hm-cell implemented" data-item="--primary" data-page="PAGE_1" data-status="implemented" data-finding="" data-desc="Color matches spec value"></span></td>
          <td><span class="hm-cell drifted" data-item="--primary" data-page="PAGE_2" data-status="drifted" data-finding="T3" data-desc="Uses hardcoded #e84d26 instead of var(--primary)"></span></td>
          <td><span class="hm-cell implemented" data-item="--primary" data-page="PAGE_3" data-status="implemented" data-finding="" data-desc="Color matches spec value"></span></td>
          <td><span class="hm-status" style="background:#f59e0b"></span>Partial</td>
        </tr>
        -->

        <!-- === Group: Typography === -->
        <tr class="hm-group-row"><td colspan="99">Typography</td></tr>

        <!-- === Group: Components === -->
        <tr class="hm-group-row"><td colspan="99">Components</td></tr>

        <!-- === Group: Layout === -->
        <tr class="hm-group-row"><td colspan="99">Layout</td></tr>

        <!-- === Group: States & Interactions === -->
        <tr class="hm-group-row"><td colspan="99">States & Interactions</td></tr>

        <!-- === Group: Responsive === -->
        <tr class="hm-group-row"><td colspan="99">Responsive</td></tr>

        <!-- === Summary Row === -->
        <tr class="hm-summary-row">
          <td>Overall Coverage</td>
          <td>N%</td>
          <td>N%</td>
          <td>N%</td>
          <td><strong>N%</strong></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Empty state — shown when no design system data was found in UX spec -->
  <div class="hm-empty-state" id="hmEmptyState">
    <div class="hm-empty-state-icon">&#x1f50d;</div>
    <div class="hm-empty-state-title">No Design System Data Available</div>
    <div class="hm-empty-state-desc">
      The analyzed UX document does not contain explicit design system specifications.
      The heatmap requires structured data such as design tokens, typography scales,
      component definitions, or layout specifications to generate a coverage grid.
    </div>
    <div class="hm-empty-state-categories">
      <span class="hm-empty-state-tag">Color Tokens</span>
      <span class="hm-empty-state-tag">Typography Scale</span>
      <span class="hm-empty-state-tag">Spacing / Sizing</span>
      <span class="hm-empty-state-tag">Component Specs</span>
      <span class="hm-empty-state-tag">Layout Rules</span>
      <span class="hm-empty-state-tag">State Definitions</span>
      <span class="hm-empty-state-tag">Responsive Breakpoints</span>
    </div>
    <div class="hm-empty-state-hint">
      Add any of the above categories to the UX document to enable coverage tracking.
    </div>
  </div>

  <!-- Tooltip -->
  <div class="hm-tooltip" id="hmTooltip">
    <div class="hm-tooltip-item" id="hmTtItem"></div>
    <div class="hm-tooltip-page" id="hmTtPage"></div>
    <div class="hm-tooltip-status" id="hmTtStatus"></div>
    <div class="hm-tooltip-desc" id="hmTtDesc"></div>
    <div class="hm-tooltip-finding" id="hmTtFinding"></div>
  </div>

  <!-- Detail panel -->
  <div class="hm-detail" id="hmDetail">
    <div class="hm-detail-title" id="hmDetailTitle"></div>
    <div class="hm-detail-meta" id="hmDetailMeta"></div>
    <div class="hm-detail-desc" id="hmDetailDesc"></div>
  </div>

<script>
(function() {
  'use strict';

  const tooltip = document.getElementById('hmTooltip');
  const detail = document.getElementById('hmDetail');
  const emptyState = document.getElementById('hmEmptyState');
  const gridWrapper = document.querySelector('.hm-grid-wrapper');
  const controls = document.querySelector('.hm-controls');
  const legend = document.querySelector('.hm-legend');
  let activeFilter = 'all';

  const statusColors = {
    implemented: '#10b981',
    partial: '#f59e0b',
    drifted: '#ef4444',
    missing: '#6b7280'
  };

  /* --- Empty state detection --- */
  const dataCells = document.querySelectorAll('.hm-cell');
  if (dataCells.length === 0) {
    // No heatmap data — show empty state, hide grid and controls
    emptyState.classList.add('visible');
    gridWrapper.style.display = 'none';
    controls.style.display = 'none';
    legend.style.display = 'none';
  }

  /* --- Cell hover tooltip --- */
  document.querySelectorAll('.hm-cell').forEach(cell => {
    cell.addEventListener('mouseenter', function(e) {
      const rect = cell.getBoundingClientRect();
      document.getElementById('hmTtItem').textContent = cell.getAttribute('data-item');
      document.getElementById('hmTtPage').textContent = 'Page: ' + cell.getAttribute('data-page');
      const st = cell.getAttribute('data-status');
      const stEl = document.getElementById('hmTtStatus');
      stEl.innerHTML = '<span style="color:' + statusColors[st] + '">' + st.charAt(0).toUpperCase() + st.slice(1) + '</span>';
      document.getElementById('hmTtDesc').textContent = cell.getAttribute('data-desc');
      const findingId = cell.getAttribute('data-finding');
      document.getElementById('hmTtFinding').textContent = findingId ? 'Finding: ' + findingId : '';
      tooltip.style.top = (rect.bottom + 8) + 'px';
      tooltip.style.left = Math.min(rect.left, window.innerWidth - 340) + 'px';
      tooltip.classList.add('visible');
    });
    cell.addEventListener('mouseleave', function() {
      tooltip.classList.remove('visible');
    });

    /* Cell click → show detail */
    cell.addEventListener('click', function() {
      const item = cell.getAttribute('data-item');
      const page = cell.getAttribute('data-page');
      const status = cell.getAttribute('data-status');
      const desc = cell.getAttribute('data-desc');
      const finding = cell.getAttribute('data-finding');
      document.getElementById('hmDetailTitle').textContent = item;
      document.getElementById('hmDetailMeta').textContent = 'Page: ' + page + ' · Status: ' + status + (finding ? ' · Finding: ' + finding : '');
      document.getElementById('hmDetailDesc').textContent = desc;
      detail.classList.add('visible');
    });
  });

  /* --- Filter by status --- */
  window.hmFilter = function(filter) {
    activeFilter = filter;
    document.querySelectorAll('.hm-filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-filter="' + filter + '"]').classList.add('active');
    document.querySelectorAll('.hm-grid tbody tr:not(.hm-group-row):not(.hm-summary-row)').forEach(row => {
      if (filter === 'all') {
        row.style.display = '';
        return;
      }
      const cells = row.querySelectorAll('.hm-cell');
      const hasMatch = Array.from(cells).some(c => c.getAttribute('data-status') === filter);
      row.style.display = hasMatch ? '' : 'none';
    });
  };

  /* --- Search --- */
  window.hmSearch = function(query) {
    const q = query.toLowerCase().trim();
    document.querySelectorAll('.hm-grid tbody tr:not(.hm-group-row):not(.hm-summary-row)').forEach(row => {
      if (!q) { row.style.display = ''; return; }
      const text = row.textContent.toLowerCase();
      const item = (row.getAttribute('data-item') || '').toLowerCase();
      row.style.display = (text.includes(q) || item.includes(q)) ? '' : 'none';
    });
  };
})();
</script>

</body>
</html>
```

---

## 11. Heatmap Data Format

**IMPORTANT:** Data for the heatmap must be derived directly from Phase 9 coverage results and Phase 4 finding IDs. Descriptions must be copied **verbatim** from analysis.md.

```javascript
const heatmapData = {
  pages: ["page-one", "page-two", "page-three"],
  groups: [
    {
      name: "Design Tokens",
      items: [
        {
          id: "--primary",
          label: "--primary (#E84D26)",
          cells: {
            "page-one":  { status: "implemented", findingId: null, description: "Color matches spec value" },
            "page-two":  { status: "drifted",     findingId: "T3", description: "VERBATIM from analysis.md" },
            "page-three": { status: "implemented", findingId: null, description: "Color matches spec value" }
          }
        }
      ]
    },
    {
      name: "Typography",
      items: [/* ... */]
    },
    {
      name: "Components",
      items: [/* ... */]
    },
    {
      name: "Layout",
      items: [/* ... */]
    },
    {
      name: "States & Interactions",
      items: [/* ... */]
    },
    {
      name: "Responsive",
      items: [/* ... */]
    }
  ]
};
```

**Anti-Drift Rule:**
1. **Copy, don't rewrite** — descriptions must be verbatim from analysis.md.
2. **Source mapping** — findingId must match an actual finding in the report.
3. **Re-read before writing** — refresh context from analysis.md before generating heatmap data.
4. **No paraphrasing** — avoid synonym substitution, generalization, or specifics changes.

---

## 12. Comprehensive Checklist

### Finding Quality
- [ ] Every finding has: ID, title, severity, description, category
- [ ] No finding appears in two categories
- [ ] Severity is appropriate (BLOCKER/MAJOR/MINOR per guidelines)
- [ ] Visual findings reference screenshot path
- [ ] Project-specific rule findings are tagged `[PSR-{id}]`

### IDs & Counts
- [ ] IDs are sequential within each prefix (T1, T2, ..., TN)
- [ ] No gaps in numbering
- [ ] Executive summary counts match body counts
- [ ] Toggle button counts match page badges

### Annotated HTML
- [ ] Original mock functionality preserved
- [ ] All CSS added to `<style>` block
- [ ] Toggle button positioned and functional
- [ ] Panel slides open/close
- [ ] All 11 sections present (only those with findings)
- [ ] Section descriptions match category definitions
- [ ] Badge hover shows tooltip
- [ ] Badge click opens panel + scrolls to finding
- [ ] Panel item click scrolls page to element + pulses
- [ ] Keyboard shortcuts work (Esc, [, ], /)
- [ ] Search filters findings
- [ ] Eye toggle hides/shows category highlights
- [ ] Stats bar shows correct counts
- [ ] `data-ann-id`, `data-ann-title`, `data-ann-severity` on every badge

### Visual Audit Pages
- [ ] Screenshot image loads correctly
- [ ] Overlay boxes positioned within screenshot bounds
- [ ] Overlay colors match category colors
- [ ] Overlay click highlights finding in panel
- [ ] Panel finding click pulses overlay
- [ ] Viewport tabs switch screenshots (if multi-viewport)
- [ ] Legend filter toggles overlay/finding visibility
- [ ] Finding descriptions are verbatim from analysis.md

### Coverage Heatmap
- [ ] All UX spec items present as rows
- [ ] All mock pages present as columns
- [ ] Cell colors match status
- [ ] Tooltip shows item, page, status, description, findingId
- [ ] Click shows detail below grid
- [ ] Filter buttons work
- [ ] Search works
- [ ] Summary row shows correct percentages
- [ ] Descriptions are **verbatim** from analysis.md
- [ ] Finding IDs are valid and match report

### Cross-Output Consistency
- [ ] Finding ID in analysis.md = annotated HTML = visual audit = heatmap
- [ ] Severity consistent across all outputs
- [ ] Description verbatim across all outputs
- [ ] Screenshot paths resolve to actual files
- [ ] Coverage percentages match across report and heatmap
- [ ] E findings appear ONLY in analysis.md (not annotated/visual)

---

## 13. Agent Prompt for Parallel HTML Generation

When generating multiple annotated HTML files, use this prompt structure for parallel agents:

```
Generate the annotated HTML file for {PAGE_NAME}.

INPUTS:
- Original HTML: {path}
- Findings for this page: [list of finding objects with id, category, severity, title, description, element selector]
- Screenshot path: {path}

CHECKLIST:
1. Copy original HTML unchanged
2. Add full annotation CSS from reference.md §1 to <style>
3. Add highlight class + badge to each finding's target element
4. Add toggle button HTML from reference.md §3 (with correct counts)
5. Add tooltip HTML from reference.md §4
6. Add panel HTML from reference.md §5 (only sections with findings, correct counts, descriptions verbatim)
7. Add JavaScript from reference.md §6
8. Update sidebar nav links to point to -annotated.html versions
9. Verify: every badge has panel entry, every panel entry has badge
10. Verify: stats bar counts match
11. Verify: toggle button dot counts match
12. Verify: original page still renders correctly
```
