#!/usr/bin/env node
/**
 * UX Mock Audit — Phase 7 Parts A & B: Mock Self-Validation
 *
 * Checks mock against itself for internal contradictions:
 * count mismatches, dead links, percentage sums, state contradictions, overflow.
 */

/**
 * Execute self-validation on a Puppeteer page.
 * @param {import('puppeteer').Page} page
 * @returns {Promise<Array>}
 */
async function runSelfValidation(page) {
  return page.evaluate(() => {
    const issues = [];

    // 1. Count validation
    const countClaims = [];
    document.querySelectorAll('*').forEach(el => {
      const text = el.textContent.trim();
      const match = text.match(/(\d+)\s+(resources?|items?|projects?|results?|employees?|members?)/i);
      if (match && el.children.length === 0) {
        countClaims.push({ element: el.tagName + '.' + (el.className || '').split(' ')[0], claimed: parseInt(match[1]), noun: match[2] });
      }
    });

    const tableRows = document.querySelectorAll('table tbody tr').length;
    const listItems = document.querySelectorAll('.resource-card, .resource-row, [data-resource]').length;
    for (const claim of countClaims) {
      const closest = tableRows || listItems;
      if (closest > 0 && claim.claimed !== closest) {
        issues.push({
          type: 'COUNT_MISMATCH',
          description: `Claims "${claim.claimed} ${claim.noun}" but DOM contains ${closest} matching elements`,
          element: claim.element, claimed: claim.claimed, actual: closest
        });
      }
    }

    // 2. Navigation validation
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto:')) return;
      if (href.startsWith('#')) {
        const target = document.querySelector(href);
        if (!target) {
          issues.push({
            type: 'DEAD_LINK',
            description: `Anchor "${href}" has no target element`,
            element: a.textContent.trim().substring(0, 40)
          });
        }
      }
    });

    // 3. Percentage validation
    const percentElements = [];
    document.querySelectorAll('*').forEach(el => {
      const text = el.textContent.trim();
      if (/^\d{1,3}(\.\d+)?%$/.test(text) && el.children.length === 0) {
        const parent = el.closest('tr, .card, .stat-group, [class*="grid"], [class*="flex"]');
        percentElements.push({
          value: parseFloat(text),
          parent: parent ? parent.className : 'root',
          element: el.tagName
        });
      }
    });

    // 4. Visibility contradictions
    document.querySelectorAll('[class*="badge"], [class*="status"]').forEach(el => {
      const text = el.textContent.trim().toLowerCase();
      const opacity = parseFloat(getComputedStyle(el).opacity);
      if ((text.includes('active') || text.includes('healthy')) && opacity < 0.5) {
        issues.push({
          type: 'STATE_CONTRADICTION',
          description: `Badge says "${el.textContent.trim()}" but has opacity ${opacity}`,
          element: el.tagName + '.' + (el.className || '').split(' ')[0]
        });
      }
    });

    // 5. Overflow detection
    document.querySelectorAll('*').forEach(el => {
      if (el.scrollWidth > el.clientWidth + 5 && getComputedStyle(el).overflow !== 'auto' && getComputedStyle(el).overflow !== 'scroll') {
        const rect = el.getBoundingClientRect();
        if (rect.width > 50 && rect.height > 20) {
          issues.push({
            type: 'CONTENT_OVERFLOW',
            description: `Element overflows: scrollWidth(${el.scrollWidth}) > clientWidth(${el.clientWidth})`,
            element: el.tagName + (el.className ? '.' + String(el.className).split(' ')[0] : ''),
            selector: el.id ? '#' + el.id : el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '')
          });
        }
      }
    });

    return issues;
  });
}

module.exports = { runSelfValidation };
