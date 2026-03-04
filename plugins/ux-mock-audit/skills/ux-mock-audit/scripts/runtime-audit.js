#!/usr/bin/env node
/**
 * UX Mock Audit — Puppeteer Runtime Analysis Engine
 *
 * Main orchestrator for Phase 5 sub-phases (5A–5F).
 * Captures computed styles, font loading, interactive states,
 * layout measurements, responsive behavior, and transitions.
 *
 * Usage: node runtime-audit.js (config is populated by the skill at runtime)
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function runRuntimeAudit(config) {
  const { mockFiles, viewports, outputDir, uxSpec } = config;
  const allResults = {};

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
  });

  for (const mockFile of mockFiles) {
    const pageName = path.basename(mockFile, '.html');
    const pageResults = {};

    const page = await browser.newPage();
    await page.setViewport({ width: viewports[0].width, height: viewports[0].height, deviceScaleFactor: viewports[0].scale || 1 });
    await page.goto(`file://${path.resolve(mockFile)}`, { waitUntil: 'networkidle0', timeout: 30000 });

    /* =============================================================
       5A — COMPUTED TOKEN EXTRACTION
       ============================================================= */
    pageResults.tokens = await page.evaluate((expectedTokens) => {
      function normalizeColor(c) {
        if (!c) return '';
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = c;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return `rgb(${r},${g},${b})`;
      }

      const root = document.documentElement;
      const rootStyles = getComputedStyle(root);

      return expectedTokens.map(token => {
        const computedValue = rootStyles.getPropertyValue(token.variable).trim();
        const usageMismatches = [];

        for (const usage of (token.selectors || [])) {
          const el = document.querySelector(usage.selector);
          if (!el) continue;
          const actual = getComputedStyle(el)[usage.cssProp];
          if (normalizeColor(actual) !== normalizeColor(token.expectedValue)) {
            usageMismatches.push({
              selector: usage.selector,
              cssProp: usage.cssProp,
              actual,
              expected: token.expectedValue
            });
          }
        }

        return {
          variable: token.variable,
          expected: token.expectedValue,
          computed: computedValue,
          match: normalizeColor(computedValue) === normalizeColor(token.expectedValue),
          usageMismatches
        };
      });
    }, uxSpec.tokens || []);

    /* =============================================================
       5B — FONT LOADING VERIFICATION
       ============================================================= */
    pageResults.fonts = await page.evaluate((expectedFonts) => {
      const fontChecks = expectedFonts.map(font => {
        const loaded = document.fonts.check(`${font.expectedWeights?.[0] || '400'} 16px "${font.family}"`);
        const elements = [];
        (font.selectors || []).forEach(sel => {
          document.querySelectorAll(sel).forEach(el => {
            const s = getComputedStyle(el);
            elements.push({
              selector: sel,
              renderedFamily: s.fontFamily.split(',')[0].trim().replace(/['"]/g, ''),
              fontSize: s.fontSize,
              fontWeight: s.fontWeight
            });
          });
        });
        return { family: font.family, loaded, expectedWeights: font.expectedWeights, elements };
      });

      const allLoaded = [];
      document.fonts.forEach(f => {
        if (f.status === 'loaded') allLoaded.push({ family: f.family, weight: f.weight, style: f.style });
      });

      return { fontChecks, allLoadedFonts: allLoaded };
    }, uxSpec.fonts || []);

    /* =============================================================
       5C — INTERACTIVE STATE CAPTURE
       ============================================================= */
    pageResults.states = [];
    for (const stateCheck of (uxSpec.interactiveStates || [])) {
      const el = await page.$(stateCheck.selector);
      if (!el) { pageResults.states.push({ selector: stateCheck.selector, status: 'NOT_FOUND' }); continue; }

      const resting = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        const s = getComputedStyle(el);
        return {
          background: s.backgroundColor, color: s.color, border: s.border,
          boxShadow: s.boxShadow, outline: s.outline, transform: s.transform,
          cursor: s.cursor, opacity: s.opacity, transition: s.transition
        };
      }, stateCheck.selector);

      await page.hover(stateCheck.selector);
      await new Promise(r => setTimeout(r, 200));
      const hover = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        const s = getComputedStyle(el);
        return {
          background: s.backgroundColor, color: s.color, border: s.border,
          boxShadow: s.boxShadow, outline: s.outline, transform: s.transform,
          cursor: s.cursor, opacity: s.opacity
        };
      }, stateCheck.selector);

      await page.focus(stateCheck.selector);
      await new Promise(r => setTimeout(r, 200));
      const focus = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        const s = getComputedStyle(el);
        return {
          outline: s.outline, outlineColor: s.outlineColor,
          outlineOffset: s.outlineOffset, boxShadow: s.boxShadow, border: s.border
        };
      }, stateCheck.selector);

      // Evidence screenshot of hover state
      if (stateCheck.expectedHover) {
        const box = await el.boundingBox();
        if (box) {
          const stateDir = path.join(outputDir, 'screenshots', 'states');
          fs.mkdirSync(stateDir, { recursive: true });
          await page.hover(stateCheck.selector);
          await page.screenshot({
            path: path.join(stateDir, `${pageName}-${stateCheck.name}-hover.png`),
            clip: { x: box.x - 4, y: box.y - 4, width: box.width + 8, height: box.height + 8 }
          });
        }
      }

      const hoverChanged = JSON.stringify(resting) !== JSON.stringify({ ...resting, ...hover });
      const focusChanged = resting.outline !== focus.outline || resting.boxShadow !== focus.boxShadow;

      pageResults.states.push({
        selector: stateCheck.selector, name: stateCheck.name,
        resting, hover, focus,
        hoverChanged, focusChanged,
        expectedHover: stateCheck.expectedHover,
        expectedFocus: stateCheck.expectedFocus,
        cursorCorrect: resting.cursor === (stateCheck.expectedCursor || 'pointer'),
        issues: [
          ...(!hoverChanged && stateCheck.expectedHover ? [{ type: 'HOVER_MISSING', detail: 'No visual change on hover' }] : []),
          ...(!focusChanged && stateCheck.expectedFocus ? [{ type: 'FOCUS_MISSING', detail: 'No visible focus indicator' }] : [])
        ]
      });
    }

    /* =============================================================
       5D — LAYOUT MEASUREMENT
       ============================================================= */
    pageResults.layout = await page.evaluate((expectedLayout) => {
      return expectedLayout.map(spec => {
        const el = document.querySelector(spec.selector);
        if (!el) return { selector: spec.selector, status: 'NOT_FOUND' };

        const rect = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        const measured = {
          selector: spec.selector,
          width: rect.width, height: rect.height,
          padding: s.padding, margin: s.margin, gap: s.gap,
          gridTemplateColumns: s.gridTemplateColumns,
          position: s.position, zIndex: s.zIndex,
          overflowX: s.overflowX, overflowY: s.overflowY,
          isOverflowingX: el.scrollWidth > el.clientWidth,
          isOverflowingY: el.scrollHeight > el.clientHeight
        };

        const diffs = [];
        if (spec.expectedWidth && Math.abs(measured.width - spec.expectedWidth) > 1)
          diffs.push({ prop: 'width', expected: spec.expectedWidth, actual: measured.width });
        if (spec.expectedHeight && Math.abs(measured.height - spec.expectedHeight) > 1)
          diffs.push({ prop: 'height', expected: spec.expectedHeight, actual: measured.height });
        if (spec.expectedGrid && measured.gridTemplateColumns !== spec.expectedGrid)
          diffs.push({ prop: 'gridTemplateColumns', expected: spec.expectedGrid, actual: measured.gridTemplateColumns });
        if (spec.expectedGap && measured.gap !== spec.expectedGap)
          diffs.push({ prop: 'gap', expected: spec.expectedGap, actual: measured.gap });

        return { ...measured, diffs, hasDiffs: diffs.length > 0 };
      });
    }, uxSpec.layout || []);

    /* =============================================================
       5E — RESPONSIVE BEHAVIOR TESTING
       ============================================================= */
    pageResults.responsive = [];
    for (const vp of viewports.slice(1)) { // Skip first (desktop, already measured)
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.scale || 1 });
      await new Promise(r => setTimeout(r, 300));

      const measurements = await page.evaluate((checks) => {
        return checks.map(check => {
          const el = document.querySelector(check.selector);
          if (!el) return { selector: check.selector, visible: false };
          const rect = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          return {
            selector: check.selector,
            visible: s.display !== 'none' && s.visibility !== 'hidden' && rect.width > 0,
            width: rect.width, height: rect.height,
            gridColumns: s.gridTemplateColumns, flexDirection: s.flexDirection,
            display: s.display, fontSize: s.fontSize
          };
        });
      }, uxSpec.responsiveChecks || []);

      // Compare with desktop measurements for diffs
      const diffs = [];
      for (let i = 0; i < measurements.length; i++) {
        const desktop = (pageResults.layout || [])[i];
        const current = measurements[i];
        if (desktop && current && desktop.gridTemplateColumns !== current.gridColumns) {
          diffs.push({
            selector: current.selector,
            prop: 'gridTemplateColumns',
            desktop: desktop.gridTemplateColumns,
            atBreakpoint: current.gridColumns,
            viewport: vp.name
          });
        }
      }

      // Take screenshot at this viewport
      const vpDir = path.join(outputDir, 'screenshots', vp.name);
      fs.mkdirSync(vpDir, { recursive: true });
      await page.screenshot({
        path: path.join(vpDir, `${pageName}-full.png`),
        fullPage: true, type: 'png', captureBeyondViewport: true
      });

      pageResults.responsive.push({
        viewport: vp.name, width: vp.width, height: vp.height,
        measurements, diffs,
        screenshotPath: `screenshots/${vp.name}/${pageName}-full.png`
      });
    }

    // Reset to desktop viewport
    await page.setViewport({ width: viewports[0].width, height: viewports[0].height });

    /* =============================================================
       5F — TRANSITION & ANIMATION VERIFICATION
       ============================================================= */
    pageResults.transitions = await page.evaluate((expectedTransitions) => {
      return expectedTransitions.map(spec => {
        const el = document.querySelector(spec.selector);
        if (!el) return { selector: spec.selector, status: 'NOT_FOUND' };

        const s = getComputedStyle(el);
        return {
          selector: spec.selector,
          actual: {
            transitionProperty: s.transitionProperty,
            transitionDuration: s.transitionDuration,
            transitionTimingFunction: s.transitionTimingFunction,
            transitionDelay: s.transitionDelay
          },
          expected: spec.expected,
          durationMatch: s.transitionDuration === spec.expected.duration,
          easingMatch: s.transitionTimingFunction.includes(spec.expected.easing || 'ease'),
          propertyMatch: !spec.expected.property || s.transitionProperty.includes(spec.expected.property)
        };
      });
    }, uxSpec.transitions || []);

    /* =============================================================
       FULL-PAGE SCREENSHOT (desktop, for visual audit page)
       ============================================================= */
    await page.setViewport({ width: viewports[0].width, height: viewports[0].height });
    const desktopDir = path.join(outputDir, 'screenshots', 'desktop');
    fs.mkdirSync(desktopDir, { recursive: true });
    await page.screenshot({
      path: path.join(desktopDir, `${pageName}-full.png`),
      fullPage: true, type: 'png', captureBeyondViewport: true
    });

    /* =============================================================
       ELEMENT BOUNDING BOXES (for visual audit overlay positioning)
       ============================================================= */
    pageResults.elementPositions = await page.evaluate((selectors) => {
      return selectors.map(sel => {
        const el = document.querySelector(sel);
        if (!el) return { selector: sel, found: false };
        const rect = el.getBoundingClientRect();
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        return {
          selector: sel, found: true,
          x: Math.round(rect.left + scrollX), y: Math.round(rect.top + scrollY),
          width: Math.round(rect.width), height: Math.round(rect.height)
        };
      });
    }, (uxSpec.allSelectors || []));

    await page.close();
    allResults[pageName] = pageResults;
  }

  await browser.close();

  // Write results JSON for analysis
  const resultsPath = path.join(outputDir, 'runtime-audit-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(allResults, null, 2));

  return allResults;
}

/* --- Entry point --- */
const config = {
  mockFiles: [/* MOCK_FILE_PATHS */],
  viewports: [
    { name: 'desktop', width: 1440, height: 900, scale: 1 },
    // { name: 'breakpoint-1280', width: 1280, height: 900, scale: 1 },
    // { name: 'tablet', width: 768, height: 1024, scale: 1 },
    // { name: 'mobile', width: 375, height: 812, scale: 2 },
  ],
  outputDir: '/* OUTPUT_DIR */',
  uxSpec: {
    tokens: [
      // { variable: '--primary', expectedValue: '#E84D26', category: 'color',
      //   selectors: [{ selector: '.btn-primary', cssProp: 'background-color' }] }
    ],
    fonts: [
      // { family: 'Playfair Display', expectedWeights: ['400','700'],
      //   selectors: ['.page-title', '.section-title', '.metric-value'] }
    ],
    interactiveStates: [
      // { name: 'metric-card', selector: '.metric-card',
      //   expectedHover: { boxShadow: '0 2px 8px rgba(26,26,26,0.08)' },
      //   expectedFocus: null, expectedCursor: 'default' }
    ],
    layout: [
      // { selector: '.sidebar', expectedWidth: 220 },
      // { selector: '.metrics-grid', expectedGrid: 'repeat(4, 1fr)', expectedGap: '12px' }
    ],
    responsiveChecks: [
      // { selector: '.metrics-grid' },
      // { selector: '.dept-grid' }
    ],
    transitions: [
      // { selector: '.metric-card', expected: { duration: '0.15s', easing: 'ease', property: 'box-shadow' } }
    ],
    allSelectors: [
      // Every selector that findings might reference — used for overlay positioning
    ]
  }
};

runRuntimeAudit(config)
  .then(results => {
    console.log('Runtime audit complete.');
    console.log('Results written to: ' + path.join(config.outputDir, 'runtime-audit-results.json'));
    for (const [page, r] of Object.entries(results)) {
      const tokenIssues = (r.tokens || []).filter(t => !t.match || t.usageMismatches.length > 0).length;
      const fontIssues = (r.fonts?.fontChecks || []).filter(f => !f.loaded).length;
      const stateIssues = (r.states || []).filter(s => s.issues && s.issues.length > 0).length;
      const layoutIssues = (r.layout || []).filter(l => l.hasDiffs).length;
      const respIssues = (r.responsive || []).reduce((sum, vp) => sum + vp.diffs.length, 0);
      const transIssues = (r.transitions || []).filter(t => !t.durationMatch || !t.easingMatch).length;
      console.log(`  ${page}: T=${tokenIssues} Y=${fontIssues} I=${stateIssues} L=${layoutIssues} R=${respIssues} transitions=${transIssues}`);
    }
  })
  .catch(err => { console.error('Runtime audit error:', err); process.exit(1); });
