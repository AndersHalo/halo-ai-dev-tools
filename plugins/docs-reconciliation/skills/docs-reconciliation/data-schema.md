# Reconciliation Data Schema (reconciliation-data.json)

This file defines the JSON schema for `reconciliation-data.json` — the single source of truth for all visual outputs (HTML dashboard, Excalidraw diagrams).

---

## Complete Schema

```json
{
  "meta": {
    "title": "string — PRD title or analysis name",
    "date": "string — YYYY-MM-DD",
    "mode": "string — 'bilateral-prd-ux' | 'bilateral-prd-mock' | 'trilateral'",
    "documents": {
      "prd": {
        "name": "string — display name",
        "file": "string — source file path",
        "color": "#eab308",
        "bgColor": "#fffbeb"
      },
      "ux": {
        "name": "string — display name (or null if not provided)",
        "file": "string | null",
        "color": "#3b82f6",
        "bgColor": "#eff6ff"
      },
      "mock": {
        "name": "string — display name (or null if not provided)",
        "file": "string | null",
        "color": "#22c55e",
        "bgColor": "#f0fdf4"
      }
    }
  },

  "scores": {
    "overallAlignment": "number — 0-100, percentage of requirements fully aligned",
    "perDocument": {
      "ux": "number | null — 0-100, UX coverage percentage",
      "mock": "number | null — 0-100, Mock coverage percentage"
    },
    "maturity": {
      "prd": {
        "overall": "string — 'High' | 'Medium' | 'Low'",
        "dimensions": {
          "requirementsClarity": "string",
          "pageDefinitions": "string",
          "stateSpecifications": "string",
          "flowDefinitions": "string",
          "businessRules": "string"
        }
      },
      "ux": {
        "overall": "string | null",
        "dimensions": {
          "componentCoverage": "string",
          "stateDefinitions": "string",
          "layoutSpecs": "string",
          "responsiveBehavior": "string",
          "designTokens": "string"
        }
      },
      "mock": {
        "overall": "string | null",
        "dimensions": {
          "screenCoverage": "string",
          "stateRepresentation": "string",
          "dataCompleteness": "string",
          "flowCoverage": "string",
          "visualConsistency": "string"
        }
      }
    }
  },

  "stats": {
    "totalRequirements": "number",
    "totalFindings": "number",
    "byStatus": {
      "aligned": "number",
      "partial": "number",
      "conflict": "number",
      "gap": "number",
      "addition": "number",
      "cascade": "number",
      "na": "number"
    },
    "byCategory": {
      "V": "number — conflicts",
      "N": "number — naming drift",
      "W": "number — coverage gaps",
      "Q": "number — scope additions",
      "C": "number — cascade violations",
      "S": "number — specificity gaps",
      "D": "number — PRD internal issues",
      "E": "number — UX internal issues",
      "M": "number — Mock internal issues"
    },
    "bySeverity": {
      "blocker": "number",
      "major": "number",
      "minor": "number"
    }
  },

  "groups": [
    {
      "id": "string — kebab-case group ID (e.g., 'authentication')",
      "name": "string — display name (e.g., 'Authentication')",
      "requirementIds": ["string — FR IDs in this group"]
    }
  ],

  "requirements": [
    {
      "id": "string — FR-1, REQ-1, etc.",
      "title": "string — short name",
      "description": "string — full requirement text",
      "group": "string — group ID from groups[]",
      "priority": "string | null — must-have / should-have / nice-to-have",
      "overallStatus": "string — aligned | partial | conflict | gap | na",
      "reason": "string — human-readable explanation of why this requirement has its status. References specific documents and finding IDs. E.g., 'Defined in PRD (FR-3), UX (SearchInput component), and Mock (Dashboard screen)' for aligned, or 'PRD requires export to CSV (FR-15); not defined in UX or Mock (W8, W9)' for gap.",
      "perDocument": {
        "prd": {
          "status": "source",
          "summary": "string — what PRD says"
        },
        "ux": {
          "status": "string — aligned | partial | conflict | gap | addition | na | null",
          "summary": "string | null — what UX says, or null if not provided",
          "findingIds": ["string — finding IDs related to this requirement + UX"]
        },
        "mock": {
          "status": "string | null",
          "summary": "string | null — what Mock shows, or null if not provided",
          "findingIds": ["string"]
        }
      },
      "findingIds": ["string — all finding IDs for this requirement"],
      "keywords": "string — space-separated search terms"
    }
  ],

  "findings": [
    {
      "id": "string — V1, W2, Q3, etc.",
      "code": "string — V | N | W | Q | C | S | D | E | M",
      "name": "string — category name (Conflict, Coverage Gap, etc.)",
      "severity": "string — blocker | major | minor",
      "docsTag": "string — [PRD<>UX] | [PRD<>Mock] | [UX<>Mock] | [PRD>UX>Mock]",
      "requirementId": "string | null — FR ID this finding relates to",
      "description": "string — finding description (MUST be verbatim identical in reconciliation.md)",
      "quotes": {
        "prd": "string | null — exact quote from PRD",
        "ux": "string | null — exact quote from UX",
        "mock": "string | null — exact quote from Mock"
      },
      "recommendation": "string — actionable next step"
    }
  ],

  "namingDrift": [
    {
      "findingId": "string — N1, N2, etc.",
      "severity": "string — blocker | major | minor",
      "docsTag": "string",
      "terms": {
        "prd": "string — term used in PRD",
        "ux": "string | null — term used in UX",
        "mock": "string | null — term used in Mock"
      },
      "context": "string — what the concept refers to",
      "description": "string — verbatim finding description"
    }
  ],

  "cascades": [
    {
      "findingId": "string — C1, C2, etc.",
      "severity": "string",
      "requirementId": "string — FR ID",
      "chain": {
        "prd": "string — what PRD originally said",
        "ux": "string — how UX interpreted it",
        "mock": "string — how Mock built it"
      },
      "driftDescription": "string — verbatim finding description",
      "recommendation": "string"
    }
  ],

  "venn": {
    "prdOnly": "number — items unique to PRD (not covered in any satellite)",
    "uxOnly": "number — UX scope additions (null if UX not provided)",
    "mockOnly": "number — Mock scope additions (null if Mock not provided)",
    "prdUx": "number — shared between PRD and UX only (null if UX not provided)",
    "prdMock": "number — shared between PRD and Mock only (null if Mock not provided)",
    "uxMock": "number — shared between UX and Mock only (null if not trilateral)",
    "allThree": "number — shared across all three (null if not trilateral)",
    "totalPrd": "number — total PRD items",
    "totalUx": "number | null",
    "totalMock": "number | null"
  },

  "inventories": {
    "prd": {
      "P1": "array | null — functional requirements (compact summaries)",
      "P2": "array | null — page/view registry",
      "P3": "array | null — component mentions",
      "P4": "array | null — state requirements",
      "P5": "array | null — flow definitions",
      "P6": "array | null — business rules",
      "P7": "array | null — page sections (conditional)"
    },
    "ux": {
      "U1": "array | null — design tokens",
      "U3": "array | null — component registry",
      "U4": "array | null — component states",
      "U5": "array | null — page/view definitions",
      "U9": "array | null — page composition (conditional)",
      "U10": "array | null — component-page matrix (conditional)",
      "U11": "array | null — navigation map (conditional)"
    },
    "mock": {
      "K1": "array | null — screen registry",
      "K2": "array | null — visual component inventory",
      "K3": "array | null — screen layout",
      "K4": "array | null — state representations",
      "K5": "array | null — navigation/flow shown",
      "K6": "array | null — data & content shown"
    }
  }
}
```

---

## Schema Rules

### Null handling

- If a document is not provided, its fields are `null` (not omitted, not empty string)
- `ux` and `mock` fields are `null` when those documents are not in the input
- Inventory arrays are `null` when not extracted (document not provided or inventory not present in document)
- `venn` counts are `null` for document combinations not applicable to the input mode

### Verbatim consistency

- `findings[].description` must be **character-for-character identical** to the description in `reconciliation.md`
- `namingDrift[].description` must match
- `cascades[].driftDescription` must match
- `findings[].quotes.prd/ux/mock` must be exact quotes from source documents

### ID rules

- `findings[].id` uses globally sequential prefixes: V1, V2, N1, W1, Q1, C1, S1, D1, E1, M1
- `requirements[].id` preserves the original FR ID from the PRD (or auto-assigned if PRD doesn't use IDs)
- `groups[].id` is kebab-case derived from the group name

### Status derivation

Each requirement's `overallStatus` is derived from its `perDocument` statuses:

| Condition | overallStatus |
|-----------|---------------|
| All provided docs are `aligned` | `aligned` |
| Any doc is `conflict` | `conflict` |
| Any doc is `gap` and none is `conflict` | `gap` |
| Mix of `aligned` and `gap`/`partial` | `partial` |
| Requirement is backend/infrastructure | `na` |

### Inventory compactness

Inventories in the JSON should be **compact summaries**, not full document text. Each inventory item is a small object with key fields only. For example, a P1 functional requirement:

```json
{
  "id": "FR-1",
  "title": "User login",
  "page": "Login Page",
  "priority": "must-have"
}
```

Not the full description text — that lives in `requirements[].description`.

---

## Size Estimation

| Audit size | Requirements | Findings | Estimated JSON size |
|------------|-------------|----------|-------------------|
| Small | 10-20 | 5-15 | 8-15 KB |
| Medium | 20-50 | 15-40 | 15-30 KB |
| Large | 50-100 | 40-80 | 30-60 KB |

This is 3-5x smaller than equivalent inline HTML, and unlike HTML, it never includes CSS/JS boilerplate.
