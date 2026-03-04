#!/usr/bin/env node
/**
 * UX Mock Audit — Phase 6: Cross-Page Consistency
 *
 * Extracts computed styles of shared component selectors across pages
 * and diffs them to find inconsistencies.
 */

/**
 * Extract computed style snapshot for shared components on a page.
 * @param {import('puppeteer').Page} page
 * @param {Array<string>} selectors - shared component selectors
 * @returns {Promise<Object>} map of selector → computed style snapshot
 */
async function extractComponentSnapshot(page, selectors) {
  return page.evaluate((sels) => {
    const snapshot = {};
    for (const sel of sels) {
      const el = document.querySelector(sel);
      if (!el) { snapshot[sel] = null; continue; }
      const s = getComputedStyle(el);
      snapshot[sel] = {
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height,
        backgroundColor: s.backgroundColor,
        color: s.color,
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        padding: s.padding,
        margin: s.margin,
        borderRadius: s.borderRadius,
        boxShadow: s.boxShadow,
        gap: s.gap,
        gridTemplateColumns: s.gridTemplateColumns
      };
    }
    return snapshot;
  }, selectors);
}

/**
 * Diff snapshots across pages, return inconsistencies.
 * @param {Object} snapshots - { pageName: { selector: styles } }
 * @returns {Array} list of inconsistency findings
 */
function diffSnapshots(snapshots) {
  const findings = [];
  const pages = Object.keys(snapshots);
  if (pages.length < 2) return findings;

  const allSelectors = new Set();
  for (const page of pages) {
    for (const sel of Object.keys(snapshots[page])) {
      if (snapshots[page][sel]) allSelectors.add(sel);
    }
  }

  for (const sel of allSelectors) {
    const pagesWithComponent = pages.filter(p => snapshots[p][sel]);
    if (pagesWithComponent.length < 2) continue;

    const baseline = snapshots[pagesWithComponent[0]][sel];
    for (let i = 1; i < pagesWithComponent.length; i++) {
      const current = snapshots[pagesWithComponent[i]][sel];
      for (const prop of Object.keys(baseline)) {
        if (String(baseline[prop]) !== String(current[prop])) {
          findings.push({
            type: 'CROSS_PAGE_INCONSISTENCY',
            selector: sel,
            property: prop,
            pageA: pagesWithComponent[0],
            valueA: baseline[prop],
            pageB: pagesWithComponent[i],
            valueB: current[prop]
          });
        }
      }
    }
  }

  return findings;
}

module.exports = { extractComponentSnapshot, diffSnapshots };
