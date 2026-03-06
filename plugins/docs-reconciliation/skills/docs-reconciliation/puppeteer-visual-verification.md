# Puppeteer Visual Verification — Script Template

This document provides the Node.js script template used by Phase 3B to verify that components from PRD and UX inventories exist in rendered HTML mocks.

## Prerequisites

- Node.js installed
- Puppeteer available via `npx puppeteer` or installed locally (`npm install puppeteer`)

## Script: `visual-verify.mjs`

The skill generates this script in the output directory and executes it via Bash. The script reads the search checklist from stdin (JSON) and outputs results to stdout (JSON).

```javascript
import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Input: JSON from stdin
// {
//   "mockFiles": ["path/to/mock.html"],
//   "checklist": [
//     { "source": "P3", "name": "search input", "heuristics": { ... } }
//   ]
// }

const input = JSON.parse(readFileSync('/dev/stdin', 'utf-8'));
const results = [];

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

for (const mockFile of input.mockFiles) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const fileUrl = `file://${resolve(mockFile)}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

  // Take full-page screenshot
  const screenshotPath = mockFile.replace(/\.html$/, '.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });

  for (const item of input.checklist) {
    const result = await verifyElement(page, item, mockFile);
    results.push(result);
  }

  await page.close();
}

await browser.close();

// Output results as JSON
console.log(JSON.stringify({ results, screenshots: input.mockFiles.map(f => f.replace(/\.html$/, '.png')) }));

// --- Verification logic ---

async function verifyElement(page, item, mockFile) {
  const entry = {
    source: item.source,
    name: item.name,
    mockFile,
    status: 'not_found',
    heuristicsTriied: [],
    selector: null,
    boundingBox: null,
    computedStyles: null,
    visibility: null,
    interactive: null,
    textContent: null
  };

  // Build query strategies from the component name
  const name = item.name;
  const nameLower = name.toLowerCase();
  const nameSlug = nameLower.replace(/\s+/g, '-');
  const nameCamel = nameLower.replace(/\s+(\w)/g, (_, c) => c.toUpperCase());
  const namePascal = nameCamel.charAt(0).toUpperCase() + nameCamel.slice(1);

  const strategies = [
    // 1. ARIA role match
    ...getAriaRoleSelectors(nameLower),
    // 2. Semantic HTML tag match
    ...getSemanticSelectors(nameLower),
    // 3. aria-label match
    `[aria-label*="${nameLower}" i]`,
    // 4. data-testid match
    `[data-testid*="${nameSlug}"]`,
    `[data-testid*="${nameCamel}"]`,
    // 5. placeholder match (for inputs)
    `[placeholder*="${nameLower}" i]`,
    // 6. Class/ID partial match
    `[class*="${nameSlug}"]`,
    `[class*="${nameCamel}"]`,
    `[class*="${namePascal}"]`,
    `[id*="${nameSlug}"]`,
    `[id*="${nameCamel}"]`,
    // 7. Text content match (handled separately)
  ];

  // Also include any custom heuristics from the checklist item
  if (item.heuristics?.selectors) {
    strategies.push(...item.heuristics.selectors);
  }

  // Try each strategy
  for (const selector of strategies) {
    entry.heuristicsTriied.push(selector);
    try {
      const el = await page.$(selector);
      if (el) {
        entry.status = 'found';
        entry.selector = selector;
        await extractElementData(page, el, entry);
        return entry;
      }
    } catch {
      // Invalid selector, skip
    }
  }

  // 7. Text content search (fallback)
  entry.heuristicsTriied.push(`text:${nameLower}`);
  const textMatch = await page.evaluate((searchText) => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.textContent.toLowerCase().includes(searchText)) {
        const el = node.parentElement;
        if (el) {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          return {
            found: true,
            tag: el.tagName.toLowerCase(),
            textContent: el.textContent.trim().slice(0, 200),
            boundingBox: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            visibility: style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0,
            interactive: ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName),
            computedStyles: {
              'background-color': style.backgroundColor,
              'color': style.color,
              'font-family': style.fontFamily,
              'font-size': style.fontSize,
              'font-weight': style.fontWeight,
              'padding': style.padding,
              'margin': style.margin,
              'border-radius': style.borderRadius
            }
          };
        }
      }
    }
    return { found: false };
  }, nameLower);

  if (textMatch.found) {
    entry.status = 'found';
    entry.selector = `text:${nameLower}`;
    entry.boundingBox = textMatch.boundingBox;
    entry.computedStyles = textMatch.computedStyles;
    entry.visibility = textMatch.visibility;
    entry.interactive = textMatch.interactive;
    entry.textContent = textMatch.textContent;
  }

  return entry;
}

async function extractElementData(page, elementHandle, entry) {
  const data = await page.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return {
      textContent: el.textContent.trim().slice(0, 200),
      boundingBox: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      visibility: style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0,
      interactive: ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName),
      computedStyles: {
        'background-color': style.backgroundColor,
        'color': style.color,
        'font-family': style.fontFamily,
        'font-size': style.fontSize,
        'font-weight': style.fontWeight,
        'padding': style.padding,
        'margin': style.margin,
        'border-radius': style.borderRadius
      }
    };
  }, elementHandle);

  Object.assign(entry, data);
}

// Map common component names to ARIA role selectors
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
    'banner': ['[role="banner"]', 'header'],
    'header': ['[role="banner"]', 'header'],
    'footer': ['[role="contentinfo"]', 'footer'],
    'tooltip': ['[role="tooltip"]'],
    'progress': ['[role="progressbar"]', 'progress'],
    'slider': ['[role="slider"]', 'input[type="range"]'],
    'checkbox': ['[role="checkbox"]', 'input[type="checkbox"]'],
    'radio': ['[role="radio"]', 'input[type="radio"]'],
    'switch': ['[role="switch"]'],
    'tree': ['[role="tree"]', '[role="treeitem"]'],
    'accordion': ['[role="region"][aria-expanded]'],
    'breadcrumb': ['[role="navigation"][aria-label*="breadcrumb" i]', 'nav[aria-label*="breadcrumb" i]'],
  };

  for (const [key, selectors] of Object.entries(roleMap)) {
    if (name.includes(key)) return selectors;
  }
  return [];
}

// Map common component names to semantic HTML selectors
function getSemanticSelectors(name) {
  const tagMap = {
    'search': ['search', 'input[type="search"]'],
    'table': ['table'],
    'image': ['img', 'picture', 'svg'],
    'video': ['video'],
    'audio': ['audio'],
    'list': ['ul', 'ol'],
    'link': ['a[href]'],
    'input': ['input', 'textarea'],
    'form': ['form'],
    'chart': ['canvas', 'svg'],
    'graph': ['canvas', 'svg'],
    'card': ['article', '[class*="card"]'],
    'badge': ['[class*="badge"]'],
    'avatar': ['[class*="avatar"]'],
    'icon': ['svg', '[class*="icon"]'],
    'pagination': ['nav[aria-label*="pagination" i]', '[class*="pagination"]'],
    'toast': ['[class*="toast"]', '[role="status"]'],
    'spinner': ['[class*="spinner"]', '[class*="loading"]', '[role="status"]'],
  };

  for (const [key, selectors] of Object.entries(tagMap)) {
    if (name.includes(key)) return selectors;
  }
  return [];
}
```

## Execution

The skill generates and runs the script like this:

```bash
# 1. Write the script to the output directory
# 2. Write the checklist JSON to a temp file
# 3. Execute
node visual-verify.mjs < checklist.json > verification-results.json
```

## Output Schema

The script outputs JSON to stdout:

```json
{
  "results": [
    {
      "source": "P3",
      "name": "search input",
      "mockFile": "mocks/dashboard.html",
      "status": "found",
      "selector": "input[type='search']",
      "boundingBox": { "x": 120, "y": 80, "width": 320, "height": 40 },
      "computedStyles": {
        "background-color": "rgb(255, 255, 255)",
        "color": "rgb(0, 0, 0)",
        "font-family": "Inter, sans-serif",
        "font-size": "14px",
        "font-weight": "400",
        "padding": "8px 12px",
        "margin": "0px",
        "border-radius": "8px"
      },
      "visibility": true,
      "interactive": true,
      "textContent": ""
    },
    {
      "source": "U3",
      "name": "DataTable",
      "mockFile": "mocks/dashboard.html",
      "status": "not_found",
      "heuristicsTriied": ["[role=\"table\"]", "[role=\"grid\"]", "table", "[aria-label*=\"datatable\" i]", "[data-testid*=\"data-table\"]", "[class*=\"data-table\"]", "[class*=\"dataTable\"]", "[class*=\"DataTable\"]", "text:datatable"],
      "selector": null,
      "boundingBox": null,
      "computedStyles": null,
      "visibility": null,
      "interactive": null,
      "textContent": null
    }
  ],
  "screenshots": ["mocks/dashboard.png"]
}
```

## Status Definitions

| Status | Meaning |
|--------|---------|
| `found` | Element matched at least one heuristic query, is visible, and occupies space on the page |
| `not_found` | No heuristic query matched any visible element on the page |

## How Phase 4 Uses Results

- **Phase 4C (PRD -> Mock)**: A `not_found` status for a P3 component strengthens a **W** (Coverage Gap) finding with DOM-level evidence. The finding description includes: "Puppeteer verification: element not found in rendered HTML after querying [N] selectors."
- **Phase 4E (UX <-> Mock)**: A `found` status with `computedStyles` that conflict with UX design tokens (U1, U2) provides evidence for a **V** (Conflict) finding. Example: UX specifies `border-radius: 12px` but Puppeteer extracted `border-radius: 8px`.
- **Phase 4D (Mock -> PRD)**: Elements visible in Puppeteer screenshots but not matching any PRD component may indicate **Q** (Scope Addition) findings.

## Error Handling

- If Puppeteer fails to launch (not installed), log a warning and skip Phase 3B gracefully. Do not fail the entire reconciliation.
- If a specific HTML file fails to load (404, parse error), skip that file and continue with others. Record the error in the verification results.
- Timeout per page: 30 seconds. If a page takes longer, skip it with an error note.
