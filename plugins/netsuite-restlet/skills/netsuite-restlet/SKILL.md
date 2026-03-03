---
name: netsuite-restlet
description: NetSuite RESTlet integration reference. Use when building features that sync data from NetSuite, working on the NetSuite integration module, or troubleshooting NetSuite RESTlet calls (employees, projects, timesheets, OAuth 1.0 TBA).
---

# NetSuite RESTlet Integration Skill

Build an application in any tech stack that integrates with a NetSuite sandbox via 3 read-only RESTlet endpoints. The app authenticates using OAuth 1.0 Token-Based Authentication (TBA) and exposes a local API that proxies the NetSuite RESTlets.

## Authentication: OAuth 1.0 TBA (HMAC-SHA256)

Every request to NetSuite must include an OAuth 1.0 `Authorization` header:

| Parameter                | Value                                          |
| ------------------------ | ---------------------------------------------- |
| `oauth_consumer_key`     | from env `NETSUITE_CONSUMER_KEY`               |
| `oauth_token`            | from env `NETSUITE_TOKEN_ID`                   |
| `oauth_signature_method` | `HMAC-SHA256`                                  |
| `oauth_version`          | `1.0`                                          |
| `oauth_timestamp`        | current unix timestamp (seconds)               |
| `oauth_nonce`            | unique random string per request               |
| `oauth_signature`        | HMAC-SHA256 signature of the base string       |
| `realm`                  | env `NETSUITE_ACCOUNT_ID` (e.g. `6513437_SB1`) |

**Signing key:** `{consumer_secret}&{token_secret}` (percent-encoded, joined by `&`)
**Base string:** `{METHOD}&{percent_encoded_url}&{percent_encoded_params}` (standard OAuth 1.0)
**Realm** is in the Authorization header only, NOT in the base string.

## RESTlet URL Pattern

```
{NETSUITE_BASE_URL}/app/site/hosting/restlet.nl?script={SCRIPT_ID}&deploy={DEPLOY_ID}&{params}
```

All endpoints are **GET only**. Parameters are passed as query string params.

## Endpoint Summary (3 endpoints)

| Endpoint   | Script/Deploy | Local Routes                                   | Key Params                                                     |
| ---------- | ------------- | ---------------------------------------------- | -------------------------------------------------------------- |
| Employees  | 2015 / 1      | `GET /api/employees`, `GET /api/employees/:id` | `page`, `pageSize`, `inactive`, `internalId`                   |
| Projects   | 2016 / 1      | `GET /api/projects`, `GET /api/projects/:id`   | `page`, `pageSize`, `inactive`, `resourcesLimit`, `internalId` |
| Timesheets | 2017 / 1      | `GET /api/timesheets`                          | `page`, `pageSize`, `employeeInternalId`, `projectInternalId`  |

## Shared Pagination Contract

All endpoints return:

```json
{
  "ok": true,
  "page": 1,
  "pageSize": 25,
  "totalResults": 750,
  "hasMore": true,
  "nextPage": 2
}
```

- `page` is 1-based, `pageSize` max is 100
- `hasMore` / `nextPage` (`null` when no more pages)

## Top Gotchas

1. **HMAC-SHA256, not SHA1** — NetSuite TBA uses SHA256; many OAuth libraries default to SHA1
2. **Realm in header only** — NOT included in the OAuth base string
3. **Sign the full URL** — including all query params (`script`, `deploy`, `page`, etc.)
4. **Account ID format** — use exactly as given (`6513437_SB1` with underscore)
5. **Financial data is randomized** — `laborCost`, `estimatedCost`, `estimatedRevenue` return random 1-100 in non-production
6. **Empty vs null** — `note` and `rejectionNote` on timesheets return `""` not `null`
7. **`pageSize` max is 100** — requesting more is silently capped

## Additional resources

- For complete field tables, response payloads, environment variables, implementation checklist, and stack-specific guidance, see [reference.md](reference.md)
