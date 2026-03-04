#!/usr/bin/env node
/**
 * UX Mock Audit — 5G Color Contrast Audit
 *
 * Conditional: only runs if UX spec defines accessibility/contrast requirements.
 * Calculates WCAG AA/AAA contrast ratios between rendered text and effective background.
 *
 * Run inside page.evaluate() context or standalone with Puppeteer.
 */

/**
 * Execute contrast audit on a Puppeteer page.
 * @param {import('puppeteer').Page} page
 * @returns {Promise<{issues: Array, summary: Object}>}
 */
async function runContrastAudit(page) {
  return page.evaluate(() => {
    function luminance(r, g, b) {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    function parseColor(color) {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return { r, g, b };
    }

    function contrastRatio(fg, bg) {
      const l1 = luminance(fg.r, fg.g, fg.b) + 0.05;
      const l2 = luminance(bg.r, bg.g, bg.b) + 0.05;
      return l1 > l2 ? l1 / l2 : l2 / l1;
    }

    function getEffectiveBg(el) {
      let current = el;
      while (current && current !== document.documentElement) {
        const bg = getComputedStyle(current).backgroundColor;
        const parsed = parseColor(bg);
        if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return parsed;
        current = current.parentElement;
      }
      return parseColor('#ffffff');
    }

    const issues = [];
    const textElements = document.querySelectorAll(
      'h1,h2,h3,h4,h5,h6,p,span,a,button,label,th,td,li,dt,dd'
    );

    textElements.forEach(el => {
      const text = el.textContent.trim();
      if (!text || el.children.length > 0) return;

      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return;

      const fg = parseColor(style.color);
      const bg = getEffectiveBg(el);
      const ratio = contrastRatio(fg, bg);
      const fontSize = parseFloat(style.fontSize);
      const fontWeight = parseInt(style.fontWeight);
      const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);

      const aaThreshold = isLargeText ? 3 : 4.5;
      const aaaThreshold = isLargeText ? 4.5 : 7;

      if (ratio < aaThreshold) {
        issues.push({
          type: 'CONTRAST_FAIL_AA',
          element: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''),
          text: text.substring(0, 40),
          fgColor: style.color,
          bgColor: style.backgroundColor,
          effectiveBg: `rgb(${bg.r},${bg.g},${bg.b})`,
          ratio: Math.round(ratio * 100) / 100,
          required: aaThreshold,
          isLargeText,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          wcagLevel: 'AA'
        });
      } else if (ratio < aaaThreshold) {
        issues.push({
          type: 'CONTRAST_FAIL_AAA',
          element: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''),
          text: text.substring(0, 40),
          fgColor: style.color,
          effectiveBg: `rgb(${bg.r},${bg.g},${bg.b})`,
          ratio: Math.round(ratio * 100) / 100,
          required: aaaThreshold,
          isLargeText,
          wcagLevel: 'AAA'
        });
      }
    });

    return {
      issues,
      summary: {
        totalChecked: textElements.length,
        aaFails: issues.filter(i => i.type === 'CONTRAST_FAIL_AA').length,
        aaaFails: issues.filter(i => i.type === 'CONTRAST_FAIL_AAA').length,
        worstRatio: issues.length > 0 ? Math.min(...issues.map(i => i.ratio)) : null
      }
    };
  });
}

module.exports = { runContrastAudit };
