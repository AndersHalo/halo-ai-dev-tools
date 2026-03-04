#!/usr/bin/env node
/**
 * UX Mock Audit — 5I Component Runtime Validation
 *
 * Conditional: only if UX spec defines component specs (C1-C4).
 * Validates sub-component presence, order, state rendering, and visual behaviors.
 */

/**
 * Execute component validation on a Puppeteer page.
 * @param {import('puppeteer').Page} page
 * @param {Array} componentSpecs - uxSpec.componentSpecs array
 * @returns {Promise<Array>}
 */
async function runComponentValidation(page, componentSpecs) {
  return page.evaluate((specs) => {
    const findings = [];

    for (const spec of specs) {
      const instances = document.querySelectorAll(spec.selector);
      if (instances.length === 0) {
        findings.push({
          type: 'COMPONENT_MISSING', severity: 'blocker',
          component: spec.name, selector: spec.selector,
          description: `Component "${spec.name}" not found in DOM`
        });
        continue;
      }

      instances.forEach((instance, idx) => {
        const instanceId = `${spec.name}[${idx}]`;

        // --- Sub-component completeness ---
        if (spec.subComponents) {
          for (const sub of spec.subComponents) {
            const found = instance.querySelector(sub.selector);
            if (!found && sub.required) {
              findings.push({
                type: 'SUBCOMPONENT_MISSING', severity: 'major',
                component: instanceId, subComponent: sub.name,
                description: `Required sub-component "${sub.name}" (${sub.selector}) not found inside ${spec.name}`
              });
            }
            if (found && sub.expectedPosition) {
              const children = [...instance.children];
              const actualIndex = children.indexOf(found.closest(instance.tagName + ' > *') || found);
              if (sub.expectedPosition === 'first' && actualIndex !== 0) {
                findings.push({
                  type: 'SUBCOMPONENT_ORDER', severity: 'minor',
                  component: instanceId, subComponent: sub.name,
                  description: `"${sub.name}" expected at position first but found at index ${actualIndex}`
                });
              }
              if (sub.expectedPosition === 'last' && actualIndex !== children.length - 1) {
                findings.push({
                  type: 'SUBCOMPONENT_ORDER', severity: 'minor',
                  component: instanceId, subComponent: sub.name,
                  description: `"${sub.name}" expected at position last but found at index ${actualIndex}`
                });
              }
            }
          }
        }

        // --- State rendering verification ---
        if (spec.states) {
          for (const state of spec.states) {
            if (state.visibleInDOM) {
              const stateEl = instance.querySelector(state.visibleInDOM);
              if (!stateEl) {
                findings.push({
                  type: 'STATE_NOT_RENDERED',
                  severity: state.required ? 'major' : 'minor',
                  component: instanceId, state: state.name,
                  description: `State "${state.name}" indicator (${state.visibleInDOM}) not found`
                });
              }
            }
          }
        }

        // --- Visual behavior verification ---
        if (spec.behaviors) {
          for (const behavior of spec.behaviors) {
            const target = instance.querySelector(behavior.selector) || instance;
            const s = getComputedStyle(target);

            if (behavior.type === 'truncation') {
              const hasEllipsis = s.textOverflow === 'ellipsis' || s.webkitLineClamp;
              const hasOverflow = s.overflow === 'hidden' || s.overflowX === 'hidden' || s.overflowY === 'hidden';
              if (!hasEllipsis || !hasOverflow) {
                findings.push({
                  type: 'BEHAVIOR_MISSING', severity: 'major',
                  component: instanceId, behavior: behavior.name,
                  description: `Text truncation expected but missing: textOverflow=${s.textOverflow}, overflow=${s.overflow}`
                });
              }
            }

            if (behavior.type === 'scroll') {
              const scrollable = s.overflowY === 'auto' || s.overflowY === 'scroll' || s.overflowX === 'auto' || s.overflowX === 'scroll';
              if (!scrollable) {
                findings.push({
                  type: 'BEHAVIOR_MISSING', severity: 'major',
                  component: instanceId, behavior: behavior.name,
                  description: `Scroll behavior expected but overflow is "${s.overflow}"`
                });
              }
            }

            if (behavior.type === 'maxSize') {
              const rect = target.getBoundingClientRect();
              if (behavior.maxWidth && rect.width > behavior.maxWidth) {
                findings.push({
                  type: 'BEHAVIOR_EXCEEDED', severity: 'minor',
                  component: instanceId, behavior: behavior.name,
                  description: `Width ${Math.round(rect.width)}px exceeds max ${behavior.maxWidth}px`
                });
              }
              if (behavior.maxHeight && rect.height > behavior.maxHeight) {
                findings.push({
                  type: 'BEHAVIOR_EXCEEDED', severity: 'minor',
                  component: instanceId, behavior: behavior.name,
                  description: `Height ${Math.round(rect.height)}px exceeds max ${behavior.maxHeight}px`
                });
              }
            }

            if (behavior.type === 'skeleton') {
              const hasSkeleton = instance.querySelector('.skeleton, .animate-pulse, [class*="shimmer"], [class*="placeholder"], [class*="loading"]');
              if (behavior.expected && !hasSkeleton) {
                findings.push({
                  type: 'BEHAVIOR_MISSING', severity: 'minor',
                  component: instanceId, behavior: behavior.name,
                  description: 'Loading/skeleton pattern expected but no skeleton elements found'
                });
              }
            }
          }
        }
      });
    }

    return findings;
  }, componentSpecs || []);
}

module.exports = { runComponentValidation };
