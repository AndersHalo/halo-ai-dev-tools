#!/usr/bin/env node
/**
 * UX Mock Audit — 5H Dark Mode / Theme Verification
 *
 * Conditional: only runs if UX spec defines dark mode or multiple themes.
 * Toggles prefers-color-scheme, re-verifies tokens, and checks contrast.
 */

const path = require('path');
const fs = require('fs');

/**
 * Execute dark mode audit on a Puppeteer page.
 * @param {import('puppeteer').Page} page
 * @param {string} pageName
 * @param {string} outputDir
 * @param {Array} tokens - uxSpec.tokens array
 * @returns {Promise<Object>}
 */
async function runDarkModeAudit(page, pageName, outputDir, tokens) {
  // Toggle to dark mode
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
  await new Promise(r => setTimeout(r, 300));

  const results = await page.evaluate((expectedTokens) => {
    const tokenDiffs = [];
    const contrastIssues = [];

    // Re-check tokens in dark mode
    const root = document.documentElement;
    const rootStyles = getComputedStyle(root);
    for (const token of expectedTokens) {
      const darkValue = rootStyles.getPropertyValue(token.variable).trim();
      tokenDiffs.push({
        variable: token.variable,
        lightValue: token.expectedValue,
        darkValue,
        changed: darkValue !== token.expectedValue
      });
    }

    // Quick contrast check on key text elements
    function luminance(r, g, b) {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }
    function parseColor(s) {
      const m = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      return m ? [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])] : null;
    }

    document.querySelectorAll('h1, h2, h3, p, a, button, span, label').forEach(el => {
      if (!el.textContent.trim()) return;
      const fg = parseColor(getComputedStyle(el).color);
      const bgEl = el.closest('[style*="background"], body') || document.body;
      const bg = parseColor(getComputedStyle(bgEl).backgroundColor);
      if (!fg || !bg) return;
      const fgL = luminance(...fg);
      const bgL = luminance(...bg);
      const ratio = (Math.max(fgL, bgL) + 0.05) / (Math.min(fgL, bgL) + 0.05);
      if (ratio < 4.5) {
        contrastIssues.push({
          text: el.textContent.trim().substring(0, 40),
          ratio: Math.round(ratio * 100) / 100,
          fg: getComputedStyle(el).color,
          bg: getComputedStyle(bgEl).backgroundColor,
          selector: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '')
        });
      }
    });

    return { tokenDiffs, contrastIssues };
  }, tokens || []);

  // Dark mode screenshot
  const darkDir = path.join(outputDir, 'screenshots', 'dark-mode');
  fs.mkdirSync(darkDir, { recursive: true });
  await page.screenshot({
    path: path.join(darkDir, `${pageName}-dark.png`),
    fullPage: true, type: 'png', captureBeyondViewport: true
  });

  // Reset to light mode
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await new Promise(r => setTimeout(r, 200));

  return results;
}

module.exports = { runDarkModeAudit };
