---
name: deel-api
description: Deel REST API integration reference. Use when building features that sync data from Deel, working on the Deel integration module, or troubleshooting Deel API calls (people, organizations, teams, departments, time-off, lookups).
---

# Deel API Integration Skill

Use this guide when building an app that integrates with the Deel REST API, in any tech stack.

## Quick Reference

| Property       | Value                                                             |
| -------------- | ----------------------------------------------------------------- |
| Base URL       | `https://api.letsdeel.com/rest/v2`                                |
| Auth           | `Authorization: Bearer <DEEL_API_KEY>` header                     |
| Content Type   | `application/json`                                                |
| Protocol       | HTTPS only (HTTP will fail)                                       |
| Pagination     | Cursor-based: pass `?limit=N&after_cursor=CURSOR`                 |
| Response shape | `{ "data": [...], "page": { "cursor": "...", "total_rows": N } }` |
| Rate limits    | ~100 requests/minute observed (applies to sandbox too)            |

## Token Details

The `DEEL_API_KEY` is a **JWT**. Before building any routes, decode the JWT payload to check the `scope` field. Only build routes for scopes the token has.

Token types:

- **Organization tokens** — tied to the org, survive employee departures
- **Personal tokens** — tied to an individual user, expire when they leave

**Critical JWT flags that affect response shape:**

| JWT Field              | Effect                                                                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scope`                | Determines which endpoints return 200 vs 403                                                                                                                |
| `hide_pii_data`        | If `true`, personal emails and birth dates may be redacted                                                                                                  |
| `hide_employment_data` | If `true`, employment fields (`job_title`, `hiring_type`, `hiring_status`, `department`, `country`, `start_date`, `timezone`) are nested in `employments[]` |

**Important:** Always check `hide_employment_data` in your token. When `true`, you must read employment fields from `person.employments[0]` (the active employment), not from the person root object.

## Endpoint Summary (17 total verified)

| Scope                | Endpoints                                                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `people:read`        | `/people`, `/people/:id`, `/people/custom_fields`                                                                     |
| `organizations:read` | `/organizations`, `/hris/organization_structures`, `/legal-entities`, `/managers`                                     |
| `groups:read`        | `/teams`, `/departments`                                                                                              |
| `time-off:read`      | `/time_offs`, `/time_offs/profile/:id`, `/time_offs/profile/:id/entitlements`                                         |
| _(none)_             | `/lookups/countries`, `/lookups/currencies`, `/lookups/job-titles`, `/lookups/seniorities`, `/lookups/time-off-types` |

## Top Gotchas

1. **Decode the JWT first** — `scope` tells you which endpoints return 200 vs 403
2. **`hide_employment_data` changes response shape** — fields like `job_title`, `department` move into `employments[0]`
3. **Pagination is cursor-based** — use `after_cursor` from `page.cursor`, not page numbers
4. **Time-off uses `hris_organization_user_id`** — not the person UUID or worker_id
5. **`/time_offs` list does NOT support `limit`** — passing it returns 400
6. **Emails are an array** — use `person.emails.find(e => e.type === 'work')?.value`
7. **Route order matters (Express)** — put `/custom-fields` before `/:id`
8. **Deel mixes underscores and hyphens** — `/time_offs` vs `/lookups/time-off-types`

## Additional resources

- For complete endpoint details, response payloads, enum values, implementation patterns, and stack-specific quick starts, see [reference.md](reference.md)
