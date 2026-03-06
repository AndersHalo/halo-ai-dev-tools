# Wireframe Data Schema (wireframe-data.json)

This file defines the JSON schema for `wireframe-data.json` — the single source of truth for all visual outputs (dashboard HTML, screenshot gallery HTML).

---

## Complete Schema

```json
{
  "meta": {
    "title": "string — project or analysis name",
    "date": "string — YYYY-MM-DD",
    "mode": "string — 'prd-only' | 'ux-only' | 'full'",
    "documents": {
      "wireframe": {
        "files": ["string — HTML file paths"],
        "name": "string — display name"
      },
      "prd": {
        "name": "string | null — display name",
        "file": "string | null — source file path"
      },
      "ux": {
        "name": "string | null — display name",
        "file": "string | null — source file path"
      }
    },
    "puppeteerAvailable": "boolean — whether Puppeteer was used"
  },

  "scores": {
    "overallCoverage": "number — 0-100, percentage of requirements/specs implemented",
    "perDocument": {
      "prd": "number | null — 0-100, PRD requirement coverage in wireframe",
      "ux": "number | null — 0-100, UX spec coverage in wireframe"
    }
  },

  "stats": {
    "totalRequirements": "number — total items in traceability matrix",
    "totalFindings": "number",
    "byStatus": {
      "implemented": "number",
      "partial": "number",
      "missing": "number",
      "contradicted": "number"
    },
    "byCategory": {
      "contradiction": "number",
      "prd-gap": "number",
      "design-decision": "number",
      "accessibility-gap": "number",
      "token-drift": "number",
      "typography-mismatch": "number",
      "component-fidelity": "number",
      "layout-deviation": "number",
      "state-gap": "number",
      "responsive-mismatch": "number",
      "wireframe-extra": "number",
      "ux-unimplemented": "number",
      "cross-source-conflict": "number",
      "scope-creep": "number",
      "placeholder": "number",
      "cross-page-inconsistency": "number"
    },
    "bySeverity": {
      "blocker": "number",
      "major": "number",
      "minor": "number"
    }
  },

  "requirements": [
    {
      "id": "string — FR-1, UX-TOKEN-1, etc.",
      "title": "string — short name",
      "description": "string — full requirement or spec text",
      "source": "string — 'prd' | 'ux'",
      "sourceSection": "string | null — section reference in source document",
      "group": "string — kebab-case group ID",
      "overallStatus": "string — implemented | partial | missing | contradicted",
      "reason": "string — human-readable explanation of status",
      "wireframePages": [
        {
          "page": "string — wireframe page name",
          "status": "string — implemented | partial | missing | contradicted",
          "findingIds": ["string — finding IDs for this page"]
        }
      ],
      "findingIds": ["string — all finding IDs for this requirement"],
      "keywords": "string — space-separated search terms",
      "deltaStatus": "string | null — 'carried_forward' | 'new' | 'changed' | null"
    }
  ],

  "groups": [
    {
      "id": "string — kebab-case group ID",
      "name": "string — display name",
      "requirementIds": ["string — requirement IDs in this group"]
    }
  ],

  "findings": [
    {
      "id": "string — e.g., contradiction-1, prd-gap-3, token-drift-2",
      "category": "string — full category name (e.g., 'Contradiction', 'PRD Gap', 'Token Drift')",
      "categoryKey": "string — kebab-case key (e.g., 'contradiction', 'prd-gap', 'token-drift')",
      "color": "string — hex color for this category",
      "severity": "string — blocker | major | minor",
      "wireframePage": "string — which wireframe page",
      "requirementId": "string | null — linked requirement ID",
      "description": "string — finding description (MUST be verbatim identical in analysis.md)",
      "quotes": {
        "prd": "string | null — exact quote from PRD",
        "ux": "string | null — exact quote from UX"
      },
      "recommendation": "string — actionable next step",
      "puppeteerEvidence": {
        "selector": "string | null — matched CSS selector",
        "computedValue": "string | null — actual computed value (for token/typography drift)",
        "expectedValue": "string | null — expected value from spec",
        "screenshotPath": "string | null — path to evidence screenshot",
        "boundingBox": {
          "x": "number",
          "y": "number",
          "width": "number",
          "height": "number"
        }
      },
      "deltaStatus": "string | null — 'carried_forward' | 'new' | 'changed' | 'resolved' | null"
    }
  ],

  "elementDetection": {
    "enabled": "boolean — true if Puppeteer detection ran",
    "checklist": [
      {
        "source": "string — 'prd-requirement' | 'prd-component' | 'ux-component'",
        "name": "string — component or requirement name",
        "wireframePage": "string — which HTML file",
        "status": "string — 'found' | 'not_found'",
        "selector": "string | null — CSS selector that matched",
        "visible": "boolean | null",
        "boundingBox": {
          "x": "number",
          "y": "number",
          "width": "number",
          "height": "number"
        },
        "selectorsQueried": ["string — all selectors tried (for not_found items)"],
        "uxComponentMatch": {
          "componentName": "string | null — matched UX component name",
          "uxSection": "string | null — section reference",
          "variants": ["string"]
        }
      }
    ],
    "summary": {
      "total": "number",
      "found": "number",
      "notFound": "number"
    }
  },

  "screenshots": [
    {
      "page": "string — wireframe page name",
      "path": "string — relative path to PNG",
      "viewport": { "width": "number", "height": "number" }
    }
  ],

  "inventories": {
    "prd": {
      "functionalRequirements": "array | null",
      "pageRegistry": "array | null",
      "componentMentions": "array | null",
      "stateRequirements": "array | null",
      "flowDefinitions": "array | null",
      "businessRules": "array | null",
      "pageSections": "array | null"
    },
    "ux": {
      "designTokens": "array | null",
      "typography": "array | null",
      "componentRegistry": "array | null",
      "componentStates": "array | null",
      "pageDefinitions": "array | null",
      "layoutSpecs": "array | null",
      "interactionPatterns": "array | null",
      "responsiveBehavior": "array | null"
    },
    "wireframe": {
      "componentCensus": "array | null",
      "colorPalette": "array | null",
      "typographyMap": "array | null",
      "layoutPatterns": "array | null",
      "interactiveElements": "array | null",
      "mediaAssets": "array | null"
    }
  },

  "delta": {
    "previousRunDate": "string | null",
    "currentRunDate": "string",
    "scoresTrend": {
      "previous": "number",
      "current": "number"
    },
    "carriedForward": "number",
    "reAnalyzed": "number",
    "newRequirements": ["string"],
    "removedRequirements": ["string"],
    "newFindings": ["string"],
    "resolvedFindings": ["string"],
    "changedFindings": ["string"],
    "persistentFindingCount": "number"
  }
}
```

---

## Schema Rules

### Null handling

- If a document is not provided, its fields are `null`
- Inventory arrays are `null` when not extracted
- `elementDetection.enabled` is `false` if Puppeteer did not run
- `delta` is `null` if not in delta mode

### Verbatim consistency

- `findings[].description` must be **character-for-character identical** in `analysis.md`
- `findings[].quotes` must be exact quotes from source documents

### ID rules

- `findings[].id` uses descriptive kebab-case: `contradiction-1`, `prd-gap-2`, `token-drift-3`
- `requirements[].id` preserves original IDs from source docs (FR-1 from PRD, component names from UX)
- `groups[].id` is kebab-case derived from group name
- Sequential numbering per category across the entire report

### Status derivation

Each requirement's `overallStatus` is the worst status across all wireframe pages:

| Condition | overallStatus |
|-----------|---------------|
| All pages show implemented | `implemented` |
| Any page shows contradicted | `contradicted` |
| Any page shows missing (none contradicted) | `missing` |
| Mix of implemented and partial | `partial` |

### Category keys

Category keys in `byCategory` and `findings[].categoryKey` use kebab-case of the full name. These are the canonical identifiers:

| Category Name | Category Key |
|---------------|-------------|
| Contradiction | `contradiction` |
| PRD Gap | `prd-gap` |
| Design Decision | `design-decision` |
| Accessibility Gap | `accessibility-gap` |
| Token Drift | `token-drift` |
| Typography Mismatch | `typography-mismatch` |
| Component Fidelity | `component-fidelity` |
| Layout Deviation | `layout-deviation` |
| State Gap | `state-gap` |
| Responsive Mismatch | `responsive-mismatch` |
| Wireframe Extra | `wireframe-extra` |
| UX Unimplemented | `ux-unimplemented` |
| Cross-Source Conflict | `cross-source-conflict` |
| Scope Creep | `scope-creep` |
| Placeholder | `placeholder` |
| Cross-Page Inconsistency | `cross-page-inconsistency` |

### Inventory compactness

Inventories are compact summaries, not full document text. Example:

```json
{
  "id": "FR-1",
  "title": "User login",
  "page": "Login Page",
  "priority": "must-have"
}
```

---

## Size Estimation

| Audit size | Requirements | Findings | Estimated JSON size |
|------------|-------------|----------|-------------------|
| Small | 10-20 | 5-15 | 10-18 KB |
| Medium | 20-50 | 15-40 | 18-35 KB |
| Large | 50-100 | 40-80 | 35-70 KB |
