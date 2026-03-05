# Excalidraw Diagram Templates

This file defines the JSON structure templates for the Excalidraw diagrams generated in Phase 9.

All `.excalidraw` files use the Excalidraw v2 JSON schema. They can be opened in:
- VS Code (Excalidraw extension)
- excalidraw.com (drag & drop)
- Obsidian (Excalidraw plugin)

---

## Excalidraw JSON Base Structure

Every `.excalidraw` file follows this base structure:

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "docs-reconciliation-skill",
  "elements": [],
  "appState": {
    "gridSize": null,
    "viewBackgroundColor": "#ffffff"
  },
  "files": {}
}
```

---

## Element Types Reference

### Rectangle

```json
{
  "id": "unique-id",
  "type": "rectangle",
  "x": 0,
  "y": 0,
  "width": 200,
  "height": 40,
  "angle": 0,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "#a5d8ff",
  "fillStyle": "solid",
  "strokeWidth": 1,
  "strokeStyle": "solid",
  "roughness": 0,
  "opacity": 100,
  "groupIds": [],
  "frameId": null,
  "roundness": { "type": 3 },
  "seed": 1,
  "version": 1,
  "versionNonce": 1,
  "isDeleted": false,
  "boundElements": null,
  "updated": 1,
  "link": null,
  "locked": false
}
```

### Text

```json
{
  "id": "unique-id",
  "type": "text",
  "x": 10,
  "y": 10,
  "width": 180,
  "height": 20,
  "angle": 0,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "transparent",
  "fillStyle": "solid",
  "strokeWidth": 1,
  "strokeStyle": "solid",
  "roughness": 0,
  "opacity": 100,
  "groupIds": [],
  "frameId": null,
  "roundness": null,
  "seed": 2,
  "version": 1,
  "versionNonce": 2,
  "isDeleted": false,
  "boundElements": null,
  "updated": 1,
  "link": null,
  "locked": false,
  "text": "Label text here",
  "fontSize": 14,
  "fontFamily": 1,
  "textAlign": "center",
  "verticalAlign": "middle",
  "containerId": null,
  "originalText": "Label text here",
  "autoResize": true,
  "lineHeight": 1.25
}
```

### Ellipse

```json
{
  "id": "unique-id",
  "type": "ellipse",
  "x": 0,
  "y": 0,
  "width": 300,
  "height": 300,
  "angle": 0,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "#a5d8ff",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 0,
  "opacity": 40,
  "groupIds": [],
  "frameId": null,
  "roundness": { "type": 2 },
  "seed": 3,
  "version": 1,
  "versionNonce": 3,
  "isDeleted": false,
  "boundElements": null,
  "updated": 1,
  "link": null,
  "locked": false
}
```

### Arrow

```json
{
  "id": "unique-id",
  "type": "arrow",
  "x": 200,
  "y": 20,
  "width": 100,
  "height": 0,
  "angle": 0,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "transparent",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 0,
  "opacity": 100,
  "groupIds": [],
  "frameId": null,
  "roundness": { "type": 2 },
  "seed": 4,
  "version": 1,
  "versionNonce": 4,
  "isDeleted": false,
  "boundElements": null,
  "updated": 1,
  "link": null,
  "locked": false,
  "points": [[0, 0], [100, 0]],
  "lastCommittedPoint": null,
  "startBinding": null,
  "endBinding": null,
  "startArrowhead": null,
  "endArrowhead": "arrow"
}
```

### Line (no arrowhead)

Same as arrow but with `"type": "line"` and `"endArrowhead": null`.

---

## Color Palette

Use these exact colors to match the finding categories and statuses across all outputs.

### Finding Category Colors

| Code | Name | Fill (light) | Stroke | Text |
|------|------|-------------|--------|------|
| V | Conflict | `#fee2e2` | `#ef4444` | `#dc2626` |
| N | Naming Drift | `#ede9fe` | `#7c3aed` | `#7c3aed` |
| W | Coverage Gap | `#dbeafe` | `#3b82f6` | `#2563eb` |
| Q | Scope Addition | `#fff7ed` | `#f97316` | `#ea580c` |
| C | Cascade | `#fce7f3` | `#ec4899` | `#db2777` |
| S | Specificity Gap | `#fef3c7` | `#f59e0b` | `#b45309` |
| D | PRD Issue | `#e0e7ff` | `#6366f1` | `#6366f1` |
| E | UX Issue | `#ccfbf1` | `#14b8a6` | `#0d9488` |
| M | Mock Issue | `#f1f5f9` | `#64748b` | `#64748b` |

### Status Colors

| Status | Fill | Stroke |
|--------|------|--------|
| Aligned | `#dcfce7` | `#22c55e` |
| Partial | `#fef3c7` | `#f59e0b` |
| Conflict | `#fee2e2` | `#ef4444` |
| Gap | `#dbeafe` | `#3b82f6` |
| Addition | `#fff7ed` | `#f97316` |
| N/A | `#f1f5f9` | `#94a3b8` |

### Document Colors

| Document | Fill (light) | Stroke | Background |
|----------|-------------|--------|------------|
| PRD | `#fef3c7` | `#eab308` | `#fffbeb` |
| UX | `#dbeafe` | `#3b82f6` | `#eff6ff` |
| Mock | `#dcfce7` | `#22c55e` | `#f0fdf4` |

---

## 1. Coverage Heatmap (coverage-heatmap.excalidraw)

### Layout

```
[Title: "Coverage Heatmap - {PRD Title}"]

[Header Row]
  [Corner: "Requirement"]  [Col: "PRD"]  [Col: "UX"]  [Col: "Mock"]

[Group Divider: "Authentication"]
  [Label: "FR-1 User login"]  [Cell: PRD]  [Cell: OK]  [Cell: OK]
  [Label: "FR-2 Password reset"] [Cell: PRD] [Cell: W1]  [Cell: OK]

[Group Divider: "Data Management"]
  [Label: "FR-12 Pagination"]  [Cell: PRD]  [Cell: V3]  [Cell: V8]
  ...

[Legend Row at bottom]
```

### Generation Rules

1. **Title**: Rectangle at top, full width, dark background (`#0f172a`), white text, 24px font
2. **Header row**: Dark rectangles (`#0f172a`) with white text for each column
3. **Group dividers**: Full-width gray rectangles (`#f1f5f9`) with uppercase text
4. **Requirement labels**: White rectangles with left-aligned text showing `FR-ID Title`
5. **Cells**: Colored rectangles using status colors, centered text showing:
   - PRD column: always `PRD` with amber background
   - Other columns: `OK` for aligned, finding ID for issues, `N/A` for not applicable, `--` for gap
6. **Cell dimensions**: 140px wide, 36px tall, 2px gap between cells
7. **Label column**: 220px wide
8. **Legend**: Row of small colored rectangles (20x20) with text labels, positioned below the grid with 24px margin

### Element Generation

For each requirement:
- Create a label rectangle + text element (grouped)
- Create N cell rectangles + text elements (one per document, grouped)
- Position: `y = header_height + (group_count * group_height) + (row_index * cell_height)`

For each group divider:
- Create a full-width rectangle with uppercase text

Total elements = title(2) + headers(N*2) + groups(G*2) + rows(R * (1+N) * 2) + legend(S*3)
where N=doc count, G=group count, R=requirement count, S=status count

---

## 2. Venn Overlap Diagram (venn-overlap.excalidraw)

### Layout — Bilateral (2 circles)

```
        [Title: "Document Overlap"]

    ┌─────────┐     ┌─────────┐
   │  PRD     │     │  UX/Mock │
   │  Only    │ Both│  Only    │
   │  {count} │{cnt}│  {count} │
    └─────────┘     └─────────┘

        [Legend at bottom]
```

### Layout — Trilateral (3 circles)

```
           [Title: "Document Overlap"]

              ┌─────────┐
             │   PRD    │
             │  Only    │
             │  {count} │
              └─────────┘
         PRD∩UX    PRD∩Mock
          {cnt}     {cnt}
       ┌────────┐ ┌────────┐
      │  UX    │ │  Mock  │
      │  Only  │ │  Only  │
      │ {count}│ │{count} │
       └────────┘ └────────┘
          UX∩Mock   All Three
           {cnt}     {cnt}

        [Legend at bottom]
```

### Generation Rules

1. **Circles**: Use ellipse elements with `opacity: 40` for transparency overlap
   - PRD: amber fill (`#fef3c7`), stroke `#eab308`
   - UX: blue fill (`#dbeafe`), stroke `#3b82f6`
   - Mock: green fill (`#dcfce7`), stroke `#22c55e`

2. **Circle sizing**:
   - Bilateral: 2 circles, each 300x300, overlapping by 100px horizontally
   - Trilateral: 3 circles, each 280x280, arranged in triangle formation with ~90px overlap

3. **Zone labels**: Text elements positioned at the center of each zone
   - Exclusive zones: document name + count of items unique to that document
   - Intersection zones: count of shared items
   - Center (all three): count of items in all documents

4. **Title**: Text at top, 20px font, bold
5. **Legend**: Below circles, showing circle colors with document names

### Intersection Calculation

- **PRD only**: Items in PRD not found in any satellite doc
- **UX only**: Items in UX not found in PRD (scope additions)
- **Mock only**: Items in Mock not found in PRD (scope additions)
- **PRD intersect UX**: Items defined in both PRD and UX (aligned + conflicts)
- **PRD intersect Mock**: Items defined in both PRD and Mock
- **UX intersect Mock**: Items defined in both UX and Mock
- **All three**: Items defined in all three documents

---

## 3. Traceability Flow (traceability-flow.excalidraw)

### Layout

```
[Title: "Requirement Traceability Flow"]

  PRD                    UX                    Mock
  ─────                  ────                  ─────
┌──────────┐          ┌──────────┐          ┌──────────┐
│ FR-1     │ ──green──│ LoginForm │ ──green──│ Login    │
│ User     │          │ Component │          │ Screen   │
│ Login    │          │          │          │          │
└──────────┘          └──────────┘          └──────────┘

┌──────────┐          ┌──────────┐          ┌──────────┐
│ FR-12    │ ──red────│ Infinite  │ ──red────│ Paginated│
│ Paginate │          │ Scroll    │          │ Table    │
└──────────┘          └──────────┘          └──────────┘

┌──────────┐     - - - - - - - - ┐
│ FR-15    │ ──dashed gray──     │ (gap)
│ Filter   │          ┌──────────┐──green──┌──────────┐
└──────────┘          │          │          │ Filter   │
                                           │ Screen   │
                                           └──────────┘

[Legend at bottom]
```

### Generation Rules

1. **Column headers**: Dark rectangles at top of each column
   - PRD column at x=0
   - UX column at x=400 (only if UX provided)
   - Mock column at x=800 (only if Mock provided; x=400 if no UX)

2. **Requirement boxes**: Rectangles with document-colored backgrounds
   - PRD: amber (`#fef3c7`), 180px wide
   - UX: blue (`#dbeafe`), 180px wide
   - Mock: green (`#dcfce7`), 180px wide
   - Height: auto based on text content, minimum 50px

3. **Connection arrows**: Arrow elements between related boxes
   - Green arrows (`#22c55e`): aligned connections
   - Red arrows (`#ef4444`): conflict connections
   - Orange arrows (`#f97316`): drift/partial connections
   - Pink arrows (`#ec4899`): cascade violations (span all columns)
   - Dashed gray arrows (`#94a3b8`, `strokeStyle: "dashed"`): gaps (arrow points to empty space)

4. **Gap indicators**: Dashed gray rectangle outline (no fill) where a box would be if the item existed

5. **Group dividers**: Horizontal lines with feature area labels (same as heatmap groups)

6. **Row spacing**: 80px between requirement rows, 40px padding within groups

7. **Arrow routing**:
   - Arrows start from right edge of source box, end at left edge of target box
   - Use `points` array for horizontal arrows: `[[0, 0], [gap_width, 0]]`
   - For cascade arrows spanning all columns, use a single pink arrow from PRD to Mock

8. **Legend**: Row at bottom showing arrow colors and their meanings

### Flow Generation Logic

For each PRD requirement:
1. Create PRD box
2. If UX match exists: create UX box + arrow (color by status)
3. If UX match missing: create dashed gray gap indicator at UX column
4. If Mock match exists: create Mock box + arrow from UX (or PRD if no UX)
5. If Mock match missing: create dashed gray gap indicator at Mock column
6. If cascade violation: add pink overlay arrow from PRD through UX to Mock

---

## 4. Gap Treemap (gap-treemap.excalidraw)

### Layout

```
[Title: "Findings Distribution"]

┌─────────────────────────────────────────────────┐
│ Authentication                                   │
│ ┌──────────┐ ┌──────────┐ ┌────┐               │
│ │ V1       │ │ W3       │ │ N1 │               │
│ │ BLOCKER  │ │ MAJOR    │ │MIN │               │
│ │ Login    │ │ 2FA      │ │term│               │
│ │ conflict │ │ gap      │ │    │               │
│ └──────────┘ └──────────┘ └────┘               │
├─────────────────────────────────────────────────┤
│ Data Management                                  │
│ ┌──────────────┐ ┌──────────┐ ┌──────┐ ┌────┐ │
│ │ C1           │ │ V3       │ │ S2   │ │ Q1 │ │
│ │ MAJOR        │ │ BLOCKER  │ │ MAJ  │ │MIN │ │
│ │ Filter       │ │ Paginate │ │ spec │ │add │ │
│ │ cascade      │ │ conflict │ │      │ │    │ │
│ └──────────────┘ └──────────┘ └──────┘ └────┘ │
└─────────────────────────────────────────────────┘

[Legend at bottom]
```

### Generation Rules

1. **Outer rectangles**: Feature area containers
   - White fill, 1px gray stroke
   - Full width (e.g., 800px), height proportional to finding count in that area
   - Label text at top-left inside the rectangle

2. **Inner rectangles**: Individual findings
   - Colored by finding category (V=red, W=blue, Q=orange, C=pink, S=amber, N=violet)
   - Sized by severity:
     - BLOCKER: 140x80px
     - MAJOR: 110x70px
     - MINOR: 80x50px
   - Text inside: finding ID (bold), severity, short description (3 lines max)

3. **Inner rectangle layout**: Flow layout within each outer rectangle
   - Left to right, wrapping to next row
   - 8px gap between findings
   - 12px padding inside outer rectangle

4. **Title**: Text at top, 20px font
5. **Legend**: Row at bottom with colored rectangles (20x20) for each finding category + size legend for severity

### Treemap Sizing

- Total width: 800px
- Outer rectangle height: `max(100, finding_count * 90)`
- Sort outer rectangles by total finding severity weight (BLOCKER=3, MAJOR=2, MINOR=1), descending
- Sort inner rectangles within each group by severity descending, then by finding code alphabetically

---

## ID Generation

All Excalidraw element IDs must be unique strings. Use this pattern:

- `hm-title` — heatmap title
- `hm-hdr-{col}` — heatmap header cells
- `hm-grp-{index}` — heatmap group dividers
- `hm-lbl-{fr-id}` — heatmap row labels
- `hm-cell-{fr-id}-{doc}` — heatmap cells
- `hm-leg-{status}` — heatmap legend items
- `vn-circle-{doc}` — venn circles
- `vn-label-{zone}` — venn zone labels
- `vn-title` — venn title
- `tf-hdr-{doc}` — traceability flow headers
- `tf-box-{fr-id}-{doc}` — traceability boxes
- `tf-arrow-{fr-id}-{source}-{target}` — traceability arrows
- `tf-gap-{fr-id}-{doc}` — traceability gap indicators
- `tm-outer-{group}` — treemap outer rectangles
- `tm-inner-{finding-id}` — treemap inner rectangles
- `tm-leg-{code}` — treemap legend items

Use incrementing integers for `seed` and `versionNonce` fields, starting from 1.

---

## Grouped Elements

Use `groupIds` to group related elements so they move together when edited:

- Heatmap: group each row (label + all cells) under `["hm-row-{fr-id}"]`
- Venn: group each circle + its label under `["vn-{doc}"]`
- Traceability: group each box + its text under `["tf-{fr-id}-{doc}"]`
- Treemap: group each inner rectangle + its text under `["tm-{finding-id}"]`

---

## Font Settings

| Context | fontSize | fontFamily |
|---------|----------|------------|
| Diagram title | 24 | 1 (Virgil/hand-drawn) |
| Column/section headers | 16 | 1 |
| Cell content, labels | 14 | 1 |
| Small labels, IDs | 12 | 3 (Cascadia/monospace) |
| Legend text | 12 | 1 |

Set `roughness: 0` for clean lines (non-hand-drawn look) on all elements. This keeps diagrams professional while remaining editable in Excalidraw.
