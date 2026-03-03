# NetSuite RESTlet — Full Reference

## Environment Variables Required

```
NETSUITE_ACCOUNT_ID=6513437_SB1
NETSUITE_CONSUMER_KEY=<consumer_key>
NETSUITE_CONSUMER_SECRET=<consumer_secret>
NETSUITE_TOKEN_ID=<token_id>
NETSUITE_TOKEN_SECRET=<token_secret>
NETSUITE_BASE_URL=https://6513437-sb1.restlets.api.netsuite.com

NETSUITE_EMPLOYEE_SCRIPT_ID=2015
NETSUITE_EMPLOYEE_DEPLOY_ID=1
NETSUITE_PROJECT_SCRIPT_ID=2016
NETSUITE_PROJECT_DEPLOY_ID=1
NETSUITE_TIMESHEET_SCRIPT_ID=2017
NETSUITE_TIMESHEET_DEPLOY_ID=1

PORT=3000
```

---

## Endpoint 1: Employees (script=2015, deploy=1)

**Local routes:** `GET /api/employees` and `GET /api/employees/:id`

### Query Parameters

| Param        | Type    | Default | Max | Description                                  |
| ------------ | ------- | ------- | --- | -------------------------------------------- |
| `internalId` | string  | —       | —   | Optional. If set, returns a single employee. |
| `page`       | integer | 1       | —   | Page number (1-based)                        |
| `pageSize`   | integer | 25      | 100 | Results per page                             |
| `inactive`   | string  | —       | —   | `"F"` = active only, `"T"` = inactive only   |

### Response: Single Employee (when `internalId` is provided)

```json
{
  "ok": true,
  "single": true,
  "employee": {
    "internalId": "6577",
    "entityId": "Aaron Williams",
    "externalId": "EMP718",
    "firstName": "Aaron",
    "lastName": "Williams",
    "title": "AI Integration Engineer",
    "email": "aaron.williams@halopowered.com",
    "isInactive": false,
    "employeeTypeId": "3",
    "employeeType": "Employee",
    "employeeStatusId": "2",
    "employeeStatus": "Active",
    "subsidiaryId": "2",
    "subsidiary": "Halo",
    "departmentId": "13",
    "department": "Services and Enablement : Service Lines : Engineering",
    "locationId": null,
    "location": null,
    "classId": null,
    "class": null,
    "supervisorId": "412",
    "supervisor": "Stephen Cotton",
    "workCalendarId": "1",
    "workCalendar": "Default Work Calendar",
    "targetUtilization": 100,
    "laborCost": 67,
    "yearsOfExperience": ""
  }
}
```

### Response: Paginated List

```json
{
  "ok": true,
  "page": 1,
  "pageSize": 25,
  "totalResults": 750,
  "hasMore": true,
  "nextPage": 2,
  "employees": [
    /* array of employee objects */
  ]
}
```

### Employee Fields

| Field               | Type           | Notes                                       |
| ------------------- | -------------- | ------------------------------------------- |
| `internalId`        | string         | NetSuite internal ID                        |
| `entityId`          | string \| null | Display name (usually "FirstName LastName") |
| `externalId`        | string \| null | External reference ID (e.g. "EMP718")       |
| `firstName`         | string \| null |                                             |
| `lastName`          | string \| null |                                             |
| `title`             | string \| null | Job title                                   |
| `email`             | string \| null |                                             |
| `isInactive`        | boolean        |                                             |
| `employeeTypeId`    | string \| null | ID of employee type                         |
| `employeeType`      | string \| null | "Employee", "Contractor", etc.              |
| `employeeStatusId`  | string \| null | ID of employee status                       |
| `employeeStatus`    | string \| null | "Active", "Inactive", etc.                  |
| `subsidiaryId`      | string \| null |                                             |
| `subsidiary`        | string \| null |                                             |
| `departmentId`      | string \| null |                                             |
| `department`        | string \| null | Colon-separated hierarchy                   |
| `locationId`        | string \| null |                                             |
| `location`          | string \| null |                                             |
| `classId`           | string \| null |                                             |
| `class`             | string \| null |                                             |
| `supervisorId`      | string \| null |                                             |
| `supervisor`        | string \| null | Supervisor display name                     |
| `workCalendarId`    | string \| null |                                             |
| `workCalendar`      | string \| null |                                             |
| `targetUtilization` | number \| null | Percentage (e.g. 100)                       |
| `laborCost`         | number         | **Randomized 1-100 in non-production envs** |
| `yearsOfExperience` | string         | Custom field; may be empty string           |

---

## Endpoint 2: Projects (script=2016, deploy=1)

**Local routes:** `GET /api/projects` and `GET /api/projects/:id`

### Query Parameters

| Param            | Type    | Default | Max | Description                                   |
| ---------------- | ------- | ------- | --- | --------------------------------------------- |
| `internalId`     | string  | —       | —   | Optional. If set, returns a single project.   |
| `page`           | integer | 1       | —   | Page number (1-based)                         |
| `pageSize`       | integer | 25      | 100 | Results per page                              |
| `inactive`       | string  | —       | —   | `"F"` = active only, `"T"` = inactive only    |
| `resourcesLimit` | integer | 200     | 500 | Max resource allocations returned per project |

### Response: Single Project (when `internalId` is provided)

```json
{
  "ok": true,
  "single": true,
  "project": {
    "internalId": "6880",
    "projectName": "111",
    "externalId": "AC_AG_Raelynn Inc - Retainer",
    "isInactive": false,
    "customerId": "564",
    "customer": "RaeLynn Inc",
    "projectManagerId": "162",
    "projectManager": "Jatara Pickering",
    "subsidiaryId": "2",
    "subsidiary": "Halo",
    "startDate": "2024-02-27T08:00:00.000Z",
    "endDate": null,
    "estimatedCost": 96,
    "projectedTotalCost": 82,
    "estimatedRevenue": 89,
    "projectedTotalRevenue": 62,
    "resources": []
  }
}
```

### Response: Paginated List

```json
{
  "ok": true,
  "page": 1,
  "pageSize": 25,
  "totalResults": 269,
  "hasMore": true,
  "nextPage": 2,
  "projects": [
    /* array of project objects */
  ]
}
```

### Project Fields

| Field                   | Type           | Notes                                       |
| ----------------------- | -------------- | ------------------------------------------- |
| `internalId`            | string         | NetSuite internal ID                        |
| `projectName`           | string \| null | Project entity ID / display name            |
| `externalId`            | string \| null | External reference ID                       |
| `isInactive`            | boolean        |                                             |
| `customerId`            | string \| null | Parent customer internal ID                 |
| `customer`              | string \| null | Parent customer name                        |
| `projectManagerId`      | string \| null |                                             |
| `projectManager`        | string \| null |                                             |
| `subsidiaryId`          | string \| null |                                             |
| `subsidiary`            | string \| null |                                             |
| `startDate`             | string \| null | ISO 8601 date string                        |
| `endDate`               | string \| null | ISO 8601 date string                        |
| `estimatedCost`         | number \| null | **Randomized 1-100 in non-production envs** |
| `projectedTotalCost`    | number \| null | **Randomized 1-100 in non-production envs** |
| `estimatedRevenue`      | number \| null | **Randomized 1-100 in non-production envs** |
| `projectedTotalRevenue` | number \| null | **Randomized 1-100 in non-production envs** |
| `resources`             | array          | Resource allocation objects (see below)     |

### Resource Allocation Fields (nested in `resources[]`)

| Field                | Type           | Notes                         |
| -------------------- | -------------- | ----------------------------- |
| `employeeInternalId` | string \| null |                               |
| `resource`           | string \| null | Employee display name         |
| `customer`           | string \| null |                               |
| `project`            | string \| null |                               |
| `startDate`          | string \| null | Date string (NetSuite format) |
| `endDate`            | string \| null | Date string (NetSuite format) |
| `numberOfHours`      | number \| null |                               |
| `percentageOfTime`   | number \| null |                               |
| `allocateBy`         | string \| null | "Hours", "Percent", etc.      |
| `allocationType`     | string \| null |                               |
| `requestedBy`        | string \| null |                               |

---

## Endpoint 3: Timesheets (script=2017, deploy=1)

**Local route:** `GET /api/timesheets`

Uses a NetSuite saved search: `customsearch_pa_time_search`

### Query Parameters

| Param                | Type    | Default | Max | Description                              |
| -------------------- | ------- | ------- | --- | ---------------------------------------- |
| `page`               | integer | 1       | —   | Page number (1-based)                    |
| `pageSize`           | integer | 50      | 100 | Results per page                         |
| `employeeInternalId` | string  | —       | —   | Optional. Filter by employee internal ID |
| `projectInternalId`  | string  | —       | —   | Optional. Filter by project internal ID  |

### Response: Paginated List

```json
{
  "ok": true,
  "searchId": "customsearch_pa_time_search",
  "page": 1,
  "pageSize": 50,
  "totalResults": 133111,
  "hasMore": true,
  "nextPage": 2,
  "employeeInternalId": null,
  "projectInternalId": null,
  "timeEntries": [
    /* array of time entry objects */
  ]
}
```

### Time Entry Fields

| Field                | Type            | Notes                                  |
| -------------------- | --------------- | -------------------------------------- |
| `timeEntryId`        | string \| null  | NetSuite internal ID of the time entry |
| `date`               | string \| null  | Date string (e.g. "12/31/2026")        |
| `employeeInternalId` | string \| null  |                                        |
| `employee`           | string \| null  | Employee display name                  |
| `customer`           | string \| null  | Colon-separated hierarchy              |
| `item`               | string \| null  | Service item                           |
| `note`               | string          | Memo/notes (empty string if none)      |
| `rejectionNote`      | string          | Rejection notes (empty string if none) |
| `duration`           | string \| null  | Time string (e.g. "8:00")             |
| `type`               | string \| null  | "Allocated Time", "Actual Time", etc.  |
| `approvalStatus`     | string \| null  |                                        |
| `approved`           | boolean \| null | Converted from T/F                     |
| `caseTaskEvent`      | string \| null  | Task description                       |
| `department`         | string \| null  | Colon-separated hierarchy              |
| `class`              | string \| null  |                                        |
| `office`             | string \| null  | Location/office                        |
| `lastModified`       | string \| null  | Date string (e.g. "10/29/2025")        |
| `projectInternalId`  | string \| null  |                                        |
| `projectName`        | string \| null  |                                        |
| `subsidiary`         | string \| null  | Colon-separated hierarchy              |

---

## Error Response (all endpoints)

```json
{
  "ok": false,
  "errorName": "UNEXPECTED_ERROR",
  "errorMessage": "Detailed error message from NetSuite"
}
```

---

## Implementation Checklist (any tech stack)

1. **Environment config** — Load the variables listed above from `.env` or equivalent secret store. Create a `.env.example` without secrets.

2. **OAuth 1.0 module** — Implement or import an OAuth 1.0a library that supports HMAC-SHA256. Key requirements:
   - Realm = account ID (included in Authorization header, NOT in base string)
   - Sign the **full URL** (including query params)
   - Use consumer key/secret + token ID/secret

3. **NetSuite HTTP client** — A single reusable function that:
   - Builds the RESTlet URL from base URL + script/deploy IDs + query params
   - Generates the OAuth Authorization header
   - Makes a GET request with `Content-Type: application/json`
   - Returns parsed JSON
   - Handles HTTP errors

4. **Route handlers** — Expose local API routes:
   - `GET /api/employees?page=&pageSize=&inactive=`
   - `GET /api/employees/:id`
   - `GET /api/projects?page=&pageSize=&inactive=&resourcesLimit=`
   - `GET /api/projects/:id?resourcesLimit=`
   - `GET /api/timesheets?page=&pageSize=&employeeInternalId=&projectInternalId=`

5. **Entry point** — HTTP server that mounts routes and starts listening.

6. **Git safety** — `.gitignore` must exclude `.env` and dependency directories.

---

## Tech-Stack-Specific Guidance

### Node.js (JavaScript/TypeScript)

- Use `oauth-1.0a` npm package + native `crypto` for HMAC-SHA256
- Use native `fetch` (Node 18+) — no extra HTTP client needed
- Use `express` for routing, `dotenv` for env vars
- ESM (`"type": "module"` in package.json) is recommended

### Python (Flask / FastAPI)

- Use `requests-oauthlib` or `oauthlib` for OAuth 1.0 signing
- Signature method: `HMAC-SHA256` (set explicitly — many libraries default to HMAC-SHA1)
- Use `python-dotenv` for env vars
- Flask example: `@app.route("/api/employees")` with `requests.get(url, auth=oauth)`

### Go

- Use `github.com/dghubble/oauth1` — supports HMAC-SHA256 via custom signer
- Standard `net/http` for both server and client
- Use `godotenv` for env vars

### Ruby (Sinatra / Rails)

- Use the `oauth` gem — configure `signature_method` to `HMAC-SHA256`
- Use `dotenv` gem for env vars

### Common Gotchas (all stacks)

- **HMAC-SHA256, not SHA1**: NetSuite TBA uses SHA256. Many OAuth libraries default to SHA1 — you must override.
- **Realm in header only**: The realm (account ID) goes in the `Authorization` header but is NOT included in the OAuth base string for signature computation.
- **Sign the full URL**: The URL used for signature computation must include all query params (`script`, `deploy`, `page`, etc.).
- **Account ID format**: Use the account ID exactly as given (e.g. `6513437_SB1` with underscore), not a hyphenated version.
- **Financial data is randomized**: In sandbox/non-production, `laborCost`, `estimatedCost`, `estimatedRevenue`, `projectedTotalCost`, and `projectedTotalRevenue` return random values (1-100) for data security.
- **pageSize max is 100**: Requesting more than 100 is silently capped.
- **Empty vs null**: `note` and `rejectionNote` on timesheets return empty string `""` (not null) when absent. Most other nullable fields return `null`.
