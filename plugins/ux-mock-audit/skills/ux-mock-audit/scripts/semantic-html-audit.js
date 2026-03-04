#!/usr/bin/env node
/**
 * UX Mock Audit — Phase 7 Part C: Semantic HTML Validation
 *
 * Conditional: only if UX spec implies specific HTML elements or mentions accessibility.
 * Checks interactive element semantics, heading hierarchy, landmarks, form labels, alt text.
 */

/**
 * Execute semantic HTML audit on a Puppeteer page.
 * @param {import('puppeteer').Page} page
 * @returns {Promise<{issues: Array, summary: Object}>}
 */
async function runSemanticHtmlAudit(page) {
  return page.evaluate(() => {
    const issues = [];

    // 1. Interactive element semantics
    document.querySelectorAll('[onclick], [ng-click], [\\@click], [v-on\\:click]').forEach(el => {
      const tag = el.tagName.toLowerCase();
      if (tag !== 'button' && tag !== 'a' && tag !== 'input' && tag !== 'select' && tag !== 'summary') {
        issues.push({
          type: 'SEMANTIC_INTERACTIVE', severity: 'high',
          description: `<${tag}> with click handler should be <button> or <a>`,
          element: tag + (el.className ? '.' + String(el.className).split(' ')[0] : ''),
          text: el.textContent.trim().substring(0, 50),
          fix: el.getAttribute('href') || el.querySelector('a') ? 'Use <a>' : 'Use <button>'
        });
      }
    });

    document.querySelectorAll('[role="button"]').forEach(el => {
      const tag = el.tagName.toLowerCase();
      if (tag !== 'button') {
        const hasTabindex = el.hasAttribute('tabindex');
        const hasKeyHandler = el.hasAttribute('onkeydown') || el.hasAttribute('onkeyup') || el.hasAttribute('onkeypress');
        if (!hasTabindex || !hasKeyHandler) {
          issues.push({
            type: 'SEMANTIC_ROLE_INCOMPLETE', severity: 'medium',
            description: `<${tag} role="button"> missing ${!hasTabindex ? 'tabindex' : ''}${!hasTabindex && !hasKeyHandler ? ' and ' : ''}${!hasKeyHandler ? 'keyboard handler' : ''}`,
            element: tag + (el.className ? '.' + String(el.className).split(' ')[0] : ''),
            fix: 'Use native <button> or add tabindex="0" + keydown handler'
          });
        }
      }
    });

    // 2. Heading hierarchy
    const headings = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')];
    const levels = headings.map(h => parseInt(h.tagName[1]));

    const h1Count = levels.filter(l => l === 1).length;
    if (h1Count > 1) {
      issues.push({
        type: 'HEADING_MULTIPLE_H1', severity: 'medium',
        description: `Page has ${h1Count} <h1> elements — should have exactly one`,
        elements: headings.filter(h => h.tagName === 'H1').map(h => h.textContent.trim().substring(0, 40))
      });
    }
    if (h1Count === 0 && headings.length > 0) {
      issues.push({
        type: 'HEADING_MISSING_H1', severity: 'medium',
        description: 'Page has headings but no <h1>',
        firstHeading: headings[0] ? headings[0].tagName + ': ' + headings[0].textContent.trim().substring(0, 40) : 'none'
      });
    }
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] > levels[i - 1] + 1) {
        issues.push({
          type: 'HEADING_SKIP', severity: 'low',
          description: `Heading skips from <h${levels[i - 1]}> to <h${levels[i]}>`,
          context: `"${headings[i - 1].textContent.trim().substring(0, 30)}" → "${headings[i].textContent.trim().substring(0, 30)}"`
        });
      }
    }

    // 3. Landmark regions
    const landmarks = {
      main: document.querySelectorAll('main, [role="main"]').length,
      nav: document.querySelectorAll('nav, [role="navigation"]').length,
      header: document.querySelectorAll('header, [role="banner"]').length,
      footer: document.querySelectorAll('footer, [role="contentinfo"]').length,
      aside: document.querySelectorAll('aside, [role="complementary"]').length
    };

    if (landmarks.main === 0) {
      issues.push({ type: 'LANDMARK_MISSING_MAIN', severity: 'medium', description: 'No <main> landmark', fix: 'Wrap primary content in <main>' });
    }
    if (landmarks.main > 1) {
      issues.push({ type: 'LANDMARK_MULTIPLE_MAIN', severity: 'medium', description: `${landmarks.main} <main> landmarks — should be one` });
    }
    if (landmarks.nav === 0 && document.querySelectorAll('a[href]').length > 5) {
      issues.push({ type: 'LANDMARK_MISSING_NAV', severity: 'low', description: 'Navigation links but no <nav> landmark' });
    }

    // 4. Form element semantics
    document.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.type === 'hidden') return;
      const id = el.id;
      const hasLabel = id && document.querySelector(`label[for="${id}"]`);
      const hasAriaLabel = el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby');
      const wrappedInLabel = el.closest('label');
      if (!hasLabel && !hasAriaLabel && !wrappedInLabel) {
        issues.push({
          type: 'SEMANTIC_UNLABELED_INPUT', severity: 'high',
          description: `<${el.tagName.toLowerCase()}${el.type ? ' type="' + el.type + '"' : ''}> has no label`,
          element: el.name || el.id || el.className || 'unknown',
          fix: 'Add <label for="id">, aria-label, or wrap in <label>'
        });
      }
    });

    // 5. Image alt text
    document.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('alt')) {
        issues.push({
          type: 'SEMANTIC_IMG_NO_ALT', severity: 'high',
          description: `<img> missing alt: ${img.src ? img.src.split('/').pop().substring(0, 40) : 'no src'}`,
          fix: 'Add alt="" for decorative or descriptive alt for informative'
        });
      }
    });

    return {
      issues,
      summary: {
        totalIssues: issues.length,
        byType: issues.reduce((acc, i) => { acc[i.type] = (acc[i.type] || 0) + 1; return acc; }, {}),
        bySeverity: issues.reduce((acc, i) => { acc[i.severity] = (acc[i.severity] || 0) + 1; return acc; }, {}),
        landmarks
      }
    };
  });
}

module.exports = { runSemanticHtmlAudit };
