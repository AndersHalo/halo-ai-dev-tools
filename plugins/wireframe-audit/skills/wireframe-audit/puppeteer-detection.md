# Puppeteer Detection & Runtime Analysis

This document provides the script templates and detailed instructions for Puppeteer-powered phases in wireframe-audit. Puppeteer is used throughout the workflow, not as a final step.

## Prerequisites

- Node.js installed
- Puppeteer available via `npx puppeteer` or installed locally

---

## Element Detection Script: `wireframe-detect.mjs`

The skill generates this script in the output directory and executes it. Detects whether requirements and components exist as visible elements in rendered wireframe HTML.

```javascript
import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const input = JSON.parse(readFileSync('/dev/stdin', 'utf-8'));
const results = [];

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

for (const wireframeFile of input.wireframeFiles) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const fileUrl = `file://${resolve(wireframeFile)}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

  // Full-page screenshot
  const screenshotPath = wireframeFile.replace(/\.html$/, '.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });

  for (const item of input.checklist) {
    const result = await detectElement(page, item, wireframeFile);
    results.push(result);
  }

  await page.close();
}

await browser.close();
console.log(JSON.stringify({ results, screenshots: input.wireframeFiles.map(f => f.replace(/\.html$/, '.png')) }));

async function detectElement(page, item, wireframeFile) {
  const entry = {
    source: item.source,
    name: item.name,
    wireframePage: wireframeFile,
    status: 'not_found',
    selectorsQueried: [],
    selector: null,
    visible: null,
    boundingBox: null
  };

  const name = item.name;
  const nameLower = name.toLowerCase();
  const nameSlug = nameLower.replace(/\s+/g, '-');
  const nameCamel = nameLower.replace(/\s+(\w)/g, (_, c) => c.toUpperCase());
  const namePascal = nameCamel.charAt(0).toUpperCase() + nameCamel.slice(1);

  const strategies = [
    ...getAriaRoleSelectors(nameLower),
    ...getSemanticSelectors(nameLower),
    `[aria-label*="${nameLower}" i]`,
    `[data-testid*="${nameSlug}"]`,
    `[data-testid*="${nameCamel}"]`,
    `[placeholder*="${nameLower}" i]`,
    `[class*="${nameSlug}"]`,
    `[class*="${nameCamel}"]`,
    `[class*="${namePascal}"]`,
    `[id*="${nameSlug}"]`,
    `[id*="${nameCamel}"]`,
  ];

  if (item.heuristics?.selectors) {
    strategies.push(...item.heuristics.selectors);
  }

  for (const selector of strategies) {
    entry.selectorsQueried.push(selector);
    try {
      const el = await page.$(selector);
      if (el) {
        const visible = await isVisible(page, el);
        const box = await el.boundingBox();
        entry.status = 'found';
        entry.selector = selector;
        entry.visible = visible;
        entry.boundingBox = box ? { x: box.x, y: box.y, width: box.width, height: box.height } : null;
        return entry;
      }
    } catch { /* invalid selector */ }
  }

  // Text content fallback
  entry.selectorsQueried.push(`text:${nameLower}`);
  const textMatch = await page.evaluate((searchText) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.textContent.toLowerCase().includes(searchText)) {
        const el = node.parentElement;
        if (el) {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          const visible = style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0;
          return {
            found: true,
            visible,
            boundingBox: rect.width > 0 ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null
          };
        }
      }
    }
    return { found: false };
  }, nameLower);

  if (textMatch.found) {
    entry.status = 'found';
    entry.selector = `text:${nameLower}`;
    entry.visible = textMatch.visible;
    entry.boundingBox = textMatch.boundingBox;
  }

  return entry;
}

async function isVisible(page, elementHandle) {
  return page.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0;
  }, elementHandle);
}

function getAriaRoleSelectors(name) {
  const roleMap = {
    'search': ['[role="search"]', 'input[type="search"]'],
    'table': ['[role="table"]', '[role="grid"]', 'table'],
    'data table': ['[role="table"]', '[role="grid"]', 'table'],
    'navigation': ['[role="navigation"]', 'nav'],
    'nav': ['[role="navigation"]', 'nav'],
    'sidebar': ['[role="complementary"]', 'aside'],
    'modal': ['[role="dialog"]', 'dialog'],
    'dialog': ['[role="dialog"]', 'dialog'],
    'dropdown': ['[role="listbox"]', '[role="combobox"]', 'select'],
    'select': ['[role="listbox"]', '[role="combobox"]', 'select'],
    'menu': ['[role="menu"]', '[role="menubar"]'],
    'tab': ['[role="tab"]', '[role="tablist"]'],
    'tabs': ['[role="tablist"]'],
    'button': ['[role="button"]', 'button'],
    'form': ['[role="form"]', 'form'],
    'alert': ['[role="alert"]'],
    'header': ['[role="banner"]', 'header'],
    'footer': ['[role="contentinfo"]', 'footer'],
    'tooltip': ['[role="tooltip"]'],
    'progress': ['[role="progressbar"]', 'progress'],
    'slider': ['[role="slider"]', 'input[type="range"]'],
    'checkbox': ['[role="checkbox"]', 'input[type="checkbox"]'],
    'radio': ['[role="radio"]', 'input[type="radio"]'],
    'switch': ['[role="switch"]'],
    'accordion': ['[role="region"][aria-expanded]'],
    'breadcrumb': ['nav[aria-label*="breadcrumb" i]'],
  };
  for (const [key, selectors] of Object.entries(roleMap)) {
    if (name.includes(key)) return selectors;
  }
  return [];
}

function getSemanticSelectors(name) {
  const tagMap = {
    'search': ['search', 'input[type="search"]'],
    'table': ['table'],
    'image': ['img', 'picture', 'svg'],
    'video': ['video'],
    'list': ['ul', 'ol'],
    'link': ['a[href]'],
    'input': ['input', 'textarea'],
    'form': ['form'],
    'chart': ['canvas', 'svg'],
    'card': ['article', '[class*="card"]'],
    'badge': ['[class*="badge"]'],
    'avatar': ['[class*="avatar"]'],
    'icon': ['svg', '[class*="icon"]'],
    'pagination': ['nav[aria-label*="pagination" i]', '[class*="pagination"]'],
    'spinner': ['[class*="spinner"]', '[class*="loading"]'],
  };
  for (const [key, selectors] of Object.entries(tagMap)) {
    if (name.includes(key)) return selectors;
  }
  return [];
}
```

## Execution

```bash
node wireframe-detect.mjs < checklist.json > detection-results.json
```

---

## Runtime Analysis (integrated into Phase 2 and Phase 4)

These are NOT separate scripts — they run as part of the main Puppeteer session during extraction and comparison phases.

### Computed Style Extraction (Phase 2 / Phase 4 Token Drift)

```javascript
// Inside page.evaluate() during Phase 2 inventory or Phase 4 comparison
const computedStyles = await page.evaluate((selectors) => {
  const results = {};
  for (const [name, selector] of Object.entries(selectors)) {
    const el = document.querySelector(selector);
    if (el) {
      const cs = getComputedStyle(el);
      results[name] = {
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        padding: cs.padding,
        margin: cs.margin,
        borderRadius: cs.borderRadius,
        boxShadow: cs.boxShadow,
        gap: cs.gap,
        gridTemplateColumns: cs.gridTemplateColumns,
        width: cs.width,
        height: cs.height
      };
    }
  }
  return results;
}, selectorMap);
```

### Layout Measurement (Phase 2 / Phase 4 Layout Deviation)

```javascript
const measurements = await page.evaluate((selectors) => {
  return selectors.map(sel => {
    const el = document.querySelector(sel);
    if (!el) return { selector: sel, found: false };
    const rect = el.getBoundingClientRect();
    return {
      selector: sel,
      found: true,
      x: rect.x, y: rect.y,
      width: rect.width, height: rect.height
    };
  });
}, layoutSelectors);
```

### Interactive State Capture (Phase 4 State Gap)

```javascript
// Capture resting state
const restingStyles = await getComputedStyles(page, selector);

// Trigger hover
await page.hover(selector);
await page.waitForTimeout(300); // wait for transitions
const hoverStyles = await getComputedStyles(page, selector);

// Trigger focus
await page.focus(selector);
const focusStyles = await getComputedStyles(page, selector);

// Compare resting vs hover vs focus
// If no difference when UX spec defines a state change → State Gap finding
```

### Font Loading Verification (Phase 4 Typography Mismatch)

```javascript
const fontCheck = await page.evaluate(() => {
  const fonts = [];
  document.fonts.forEach(f => {
    fonts.push({ family: f.family, weight: f.weight, style: f.style, status: f.status });
  });
  return fonts;
});
```

### Responsive Testing (Phase 4 Responsive Mismatch)

```javascript
// For each breakpoint defined in UX spec
for (const bp of breakpoints) {
  await page.setViewport({ width: bp.width, height: bp.height });
  await page.waitForTimeout(500); // wait for reflow

  // Re-measure target elements
  const measurements = await measureElements(page, targetSelectors);

  // Take breakpoint screenshot if needed
  await page.screenshot({ path: `screenshots/${pageName}-${bp.name}.png`, fullPage: true });
}
```

### Cross-Page Consistency (Phase 6)

```javascript
// Extract computed styles of same selector across different pages
const crossPageData = {};
for (const wireframeFile of wireframeFiles) {
  await page.goto(`file://${resolve(wireframeFile)}`, { waitUntil: 'networkidle0' });
  crossPageData[wireframeFile] = await getComputedStyles(page, sharedSelectors);
}
// Diff properties across pages — flag inconsistencies
```

---

## Error Handling

- If Puppeteer fails to launch: log warning, skip all Puppeteer phases, continue with HTML source analysis only
- If a specific HTML file fails to load: skip that file, continue with others, record error
- Timeout per page: 30 seconds
- Invalid selectors: catch and skip silently
