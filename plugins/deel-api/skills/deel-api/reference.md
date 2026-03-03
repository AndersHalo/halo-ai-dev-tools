# Deel API — Full Reference

## All Verified API Endpoints (17 total)

Every endpoint below has been tested live and confirmed working.

### `people:read` scope — 3 endpoints

| Deel API Endpoint           | Description                               | Params                  |
| --------------------------- | ----------------------------------------- | ----------------------- |
| `GET /people`               | List all people in the org                | `limit`, `after_cursor` |
| `GET /people/:id`           | Get a single person by UUID               | —                       |
| `GET /people/custom_fields` | List all custom fields defined for people | —                       |

**Note:** The person `:id` is the UUID (e.g. `562754d8-...`), not the `worker_id` number. The `hris_organization_user_id` from the response is needed for time-off endpoints.

### `organizations:read` scope — 4 endpoints

| Deel API Endpoint                   | Description                      | Params |
| ----------------------------------- | -------------------------------- | ------ |
| `GET /organizations`                | Get current organization details | —      |
| `GET /hris/organization_structures` | Org hierarchy and structures     | —      |
| `GET /legal-entities`               | List legal entities              | —      |
| `GET /managers`                     | List all managers                | —      |

### `groups:read` scope — 2 endpoints

| Deel API Endpoint  | Description          | Params                  |
| ------------------ | -------------------- | ----------------------- |
| `GET /teams`       | List teams/groups    | `limit`, `after_cursor` |
| `GET /departments` | List all departments | —                       |

### `time-off:read` scope — 3 endpoints

| Deel API Endpoint                                    | Description                                | Params                                     |
| ---------------------------------------------------- | ------------------------------------------ | ------------------------------------------ |
| `GET /time_offs`                                     | List all time-off requests across the org  | —                                          |
| `GET /time_offs/profile/:hrisProfileId`              | Time-off requests for a specific person    | —                                          |
| `GET /time_offs/profile/:hrisProfileId/entitlements` | PTO balances and entitlements for a person | `policy_type_name`, `tracking_period_date` |

**Note:** The `:hrisProfileId` is the `hris_organization_user_id` field from the `GET /people` response. The `/time_offs` endpoint (no profile) does NOT support `limit` — it returns up to 100 items per call.

### Lookups (no scope required) — 5 endpoints

| Deel API Endpoint             | Description                 | Items |
| ----------------------------- | --------------------------- | ----- |
| `GET /lookups/countries`      | Countries supported by Deel | 113   |
| `GET /lookups/currencies`     | Currencies used by Deel     | 159   |
| `GET /lookups/job-titles`     | Pre-defined job titles      | 99    |
| `GET /lookups/seniorities`    | Seniority levels            | 83    |
| `GET /lookups/time-off-types` | Time-off type definitions   | 4     |

### Endpoints that require additional scopes (403 with current token)

| Deel API Endpoint             | Required Scope    |
| ----------------------------- | ----------------- |
| `GET /contracts`              | `contracts:read`  |
| `GET /workers/:id/documents`  | documents scope   |
| `GET /webhooks/events/types`  | webhooks scope    |
| `GET /adjustments/categories` | adjustments scope |
| `GET /contract-templates`     | contracts scope   |

---

## Response Payload Examples

### Person object (from `GET /people`)

This is a sanitized example based on real responses. The exact shape depends on your token's `hide_employment_data` flag.

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "created_at": "2025-05-08T16:01:32.625Z",
  "first_name": "Jane",
  "last_name": "Smith",
  "full_name": "Jane Smith",
  "preferred_first_name": "JJ",
  "preferred_last_name": "Smith",
  "worker_id": "123",
  "external_id": "456",
  "hris_organization_user_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "birth_date": "1990-03-15",
  "start_date": "2024-01-10",
  "seniority": "L4",
  "nationalities": ["US"],
  "state": "CA",
  "termination_last_day": null,
  "completion_date": null,
  "direct_reports_count": 0,
  "client_legal_entity": {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "name": "Acme Corp LLC"
  },
  "emails": [
    { "type": "primary", "value": "jane.personal@gmail.com" },
    { "type": "work", "value": "jane.smith@acme.com" },
    { "type": "personal", "value": "jane.personal@gmail.com" }
  ],
  "direct_manager": {
    "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
    "first_name": "Robert",
    "last_name": "Chen",
    "preferred_first_name": "Bob",
    "preferred_last_name": "Chen",
    "display_name": "Bob Chen",
    "work_email": "bob.chen@acme.com",
    "worker_id": 42,
    "external_id": "7"
  },
  "employments": [
    {
      "id": "abc123",
      "name": "Jane Smith - Senior Engineer",
      "job_title": "Senior Engineer",
      "hiring_type": "contractor",
      "hiring_status": "active",
      "contract_status": "in_progress",
      "country": "US",
      "state": "CA",
      "timezone": "America/Los_Angeles",
      "seniority": "L4",
      "start_date": "2024-01-10",
      "work_email": "jane.smith@acme.com",
      "is_ended": false,
      "termination_last_day": null,
      "completion_date": null,
      "voluntarily_left": false,
      "new_hiring_status": "active",
      "team": {
        "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
        "name": "Platform Team"
      },
      "department": {
        "id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
        "name": "Engineering"
      },
      "client_legal_entity": {
        "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
        "name": "Acme Corp LLC"
      }
    }
  ]
}
```

**Key takeaway:** When `hide_employment_data: true` in the JWT, fields like `job_title`, `hiring_type`, `hiring_status`, `department`, `country`, and `timezone` live inside `employments[0]`, not at the person root. The person root still has `full_name`, `first_name`, `last_name`, `seniority`, `start_date`, `direct_manager`, and `emails`.

### Pagination response wrapper

```json
{
  "data": [
    /* array of person objects */
  ],
  "page": {
    "cursor": "eyJsaW1pdCI6MTAwLCJvZmZzZXQiOjEwMH0",
    "total_rows": 150
  }
}
```

When `page.cursor` is `null`, you've reached the last page.

### Department object (from `GET /departments`)

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Engineering",
  "parent": null
}
```

---

## Known Enum Values

### `hiring_type`

| Value                  | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `contractor`           | Independent contractor                                      |
| `employee`             | Direct employee (less common in Deel)                       |
| `hris_direct_employee` | Employee managed via Deel HRIS (not payrolled through Deel) |
| `peo`                  | Professional Employer Organization (co-employment)          |
| `eor`                  | Employer of Record (Deel is legal employer)                 |

**Note:** `hris_direct_employee` is distinct from `employee`. If you're counting "employees" vs "contractors", decide whether `hris_direct_employee` counts as an employee for your use case.

### `hiring_status`

| Value        | Description                           |
| ------------ | ------------------------------------- |
| `active`     | Currently employed/contracted         |
| `terminated` | Employment ended                      |
| `onboarding` | In onboarding process, not yet active |

### `contract_status` (inside `employments[]`)

| Value         | Description       |
| ------------- | ----------------- |
| `in_progress` | Active contract   |
| `completed`   | Contract finished |

### Email `type`

| Value      | Description                              |
| ---------- | ---------------------------------------- |
| `work`     | Company email address                    |
| `personal` | Personal email address                   |
| `primary`  | Primary contact (often same as personal) |

---

## Implementation Pattern (Any Stack)

Follow this architecture regardless of language or framework:

### Step 1: Environment & Validation

- Store `DEEL_API_KEY` in an environment variable (`.env` file or equivalent)
- At startup, validate the key exists — fail fast with a clear error if missing
- Optionally decode the JWT to log available scopes and check `hide_employment_data`

### Step 2: HTTP Client

- Create a reusable HTTP client preconfigured with:
  - Base URL: `https://api.letsdeel.com/rest/v2`
  - Default header: `Authorization: Bearer ${DEEL_API_KEY}`
  - Default header: `Accept: application/json`

### Step 3: Wrapper Routes

Build thin routes that proxy to Deel. Each route should:

1. Accept query params from the caller (`limit`, `after_cursor`)
2. Forward them to the corresponding Deel endpoint
3. Return the Deel response directly (no transformation in the starter)

### Step 4: Error Handling

Centralize error handling with three tiers:

1. **Deel API error** (HTTP response with error status) — forward the status code and error body
2. **Network error** (Deel unreachable) — return 502 Bad Gateway
3. **App error** (unexpected) — return 500 Internal Server Error

### Step 5: Health Check

Add a `GET /health` endpoint returning `{ "status": "ok" }` for quick verification.

### Step 6: Verify

Test every endpoint with curl before considering the app complete.

---

## Stack-Specific Quick Starts

### Node.js / Express

**Dependencies:** `express`, `dotenv`, `axios`

**File structure:**

```
project/
├── .env                    # DEEL_API_KEY=..., PORT=3000
├── server.js               # Entry point
└── src/
    ├── deelClient.js       # Axios instance
    ├── routes/
    │   ├── people.js       # /api/people routes
    │   ├── organization.js # /api/organization routes (includes teams, departments)
    │   ├── timeoff.js      # /api/time-off routes
    │   └── lookups.js      # /api/lookups routes
    └── middleware/
        └── errorHandler.js # Centralized error handler
```

**deelClient.js:**

```js
const axios = require('axios');
const deelClient = axios.create({
  baseURL: 'https://api.letsdeel.com/rest/v2',
  headers: {
    Authorization: `Bearer ${process.env.DEEL_API_KEY}`,
    Accept: 'application/json',
  },
});
module.exports = deelClient;
```

**Route pattern (e.g. people.js):**

```js
const { Router } = require('express');
const deelClient = require('../deelClient');
const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { limit, after_cursor } = req.query;
    const response = await deelClient.get('/people', {
      params: { limit, after_cursor },
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

router.get('/custom-fields', async (req, res, next) => {
  try {
    const response = await deelClient.get('/people/custom_fields');
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

// IMPORTANT: put /:id AFTER /custom-fields so it doesn't catch "custom-fields" as an ID
router.get('/:id', async (req, res, next) => {
  try {
    const response = await deelClient.get(`/people/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

**Error handler:**

```js
function errorHandler(err, req, res, next) {
  console.error('[Error]', err.message);
  if (err.response) {
    return res.status(err.response.status).json({
      error: 'Deel API Error',
      status: err.response.status,
      details: err.response.data,
    });
  }
  if (err.request) {
    return res
      .status(502)
      .json({ error: 'Bad Gateway', message: 'Could not reach Deel API' });
  }
  res
    .status(500)
    .json({ error: 'Internal Server Error', message: err.message });
}
module.exports = errorHandler;
```

**Run:** `node --watch server.js` (Node 18+ has built-in watch mode, no nodemon needed)

---

### Python / Flask

**Dependencies:** `flask`, `requests`, `python-dotenv`

**deel_client.py:**

```python
import os
import requests

BASE_URL = "https://api.letsdeel.com/rest/v2"
HEADERS = {
    "Authorization": f"Bearer {os.environ['DEEL_API_KEY']}",
    "Accept": "application/json",
}

def get(path, params=None):
    resp = requests.get(f"{BASE_URL}{path}", headers=HEADERS, params=params)
    resp.raise_for_status()
    return resp.json()
```

**app.py** (all 17 endpoints):

```python
import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, jsonify, request
import deel_client

app = Flask(__name__)

# Health
@app.route("/health")
def health():
    return jsonify(status="ok")

# People (people:read)
@app.route("/api/people")
def list_people():
    params = {k: request.args[k] for k in ("limit", "after_cursor") if k in request.args}
    return jsonify(deel_client.get("/people", params))

@app.route("/api/people/custom-fields")
def people_custom_fields():
    return jsonify(deel_client.get("/people/custom_fields"))

@app.route("/api/people/<person_id>")
def get_person(person_id):
    return jsonify(deel_client.get(f"/people/{person_id}"))

# Organization (organizations:read)
@app.route("/api/organization")
def get_org():
    return jsonify(deel_client.get("/organizations"))

@app.route("/api/organization/structures")
def org_structures():
    return jsonify(deel_client.get("/hris/organization_structures"))

@app.route("/api/organization/legal-entities")
def legal_entities():
    return jsonify(deel_client.get("/legal-entities"))

@app.route("/api/organization/managers")
def managers():
    return jsonify(deel_client.get("/managers"))

# Groups (groups:read)
@app.route("/api/organization/teams")
def list_teams():
    params = {k: request.args[k] for k in ("limit", "after_cursor") if k in request.args}
    return jsonify(deel_client.get("/teams", params))

@app.route("/api/organization/departments")
def list_departments():
    return jsonify(deel_client.get("/departments"))

# Time-Off (time-off:read)
@app.route("/api/time-off")
def list_time_offs():
    return jsonify(deel_client.get("/time_offs"))

@app.route("/api/time-off/profile/<hris_id>")
def person_time_offs(hris_id):
    return jsonify(deel_client.get(f"/time_offs/profile/{hris_id}"))

@app.route("/api/time-off/profile/<hris_id>/entitlements")
def person_entitlements(hris_id):
    params = {k: request.args[k] for k in ("policy_type_name", "tracking_period_date") if k in request.args}
    return jsonify(deel_client.get(f"/time_offs/profile/{hris_id}/entitlements", params))

# Lookups (no scope required)
@app.route("/api/lookups/countries")
def countries():
    return jsonify(deel_client.get("/lookups/countries"))

@app.route("/api/lookups/currencies")
def currencies():
    return jsonify(deel_client.get("/lookups/currencies"))

@app.route("/api/lookups/job-titles")
def job_titles():
    return jsonify(deel_client.get("/lookups/job-titles"))

@app.route("/api/lookups/seniorities")
def seniorities():
    return jsonify(deel_client.get("/lookups/seniorities"))

@app.route("/api/lookups/time-off-types")
def time_off_types():
    return jsonify(deel_client.get("/lookups/time-off-types"))

@app.errorhandler(Exception)
def handle_error(err):
    if hasattr(err, "response") and err.response is not None:
        return jsonify(error="Deel API Error", details=err.response.json()), err.response.status_code
    return jsonify(error="Internal Server Error", message=str(err)), 500

if __name__ == "__main__":
    assert os.environ.get("DEEL_API_KEY"), "DEEL_API_KEY is required in .env"
    app.run(port=int(os.environ.get("PORT", 3000)), debug=True)
```

**Run:** `python app.py`

---

### Go / net/http

**main.go** (all 17 endpoints):

```go
package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
)

var (
	baseURL = "https://api.letsdeel.com/rest/v2"
	apiKey  string
)

func deelGet(path string, query map[string]string) ([]byte, int, error) {
	req, _ := http.NewRequest("GET", baseURL+path, nil)
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Accept", "application/json")

	q := req.URL.Query()
	for k, v := range query {
		if v != "" {
			q.Set(k, v)
		}
	}
	req.URL.RawQuery = q.Encode()

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, 502, err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	return body, resp.StatusCode, nil
}

func proxyHandler(deelPath string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		query := map[string]string{
			"limit":        r.URL.Query().Get("limit"),
			"after_cursor": r.URL.Query().Get("after_cursor"),
		}
		body, status, err := deelGet(deelPath, query)
		if err != nil {
			http.Error(w, `{"error":"Bad Gateway"}`, 502)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(status)
		w.Write(body)
	}
}

// proxyWithPathParam handles routes like /api/people/{id}
func proxyWithPathParam(prefix, deelPrefix string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := strings.TrimPrefix(r.URL.Path, prefix)
		body, status, err := deelGet(deelPrefix+id, nil)
		if err != nil {
			http.Error(w, `{"error":"Bad Gateway"}`, 502)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(status)
		w.Write(body)
	}
}

func main() {
	apiKey = os.Getenv("DEEL_API_KEY")
	if apiKey == "" {
		log.Fatal("DEEL_API_KEY is required")
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	// People
	http.HandleFunc("/api/people", proxyHandler("/people"))
	http.HandleFunc("/api/people/custom-fields", proxyHandler("/people/custom_fields"))

	// Organization
	http.HandleFunc("/api/organization", proxyHandler("/organizations"))
	http.HandleFunc("/api/organization/structures", proxyHandler("/hris/organization_structures"))
	http.HandleFunc("/api/organization/legal-entities", proxyHandler("/legal-entities"))
	http.HandleFunc("/api/organization/managers", proxyHandler("/managers"))
	http.HandleFunc("/api/organization/teams", proxyHandler("/teams"))
	http.HandleFunc("/api/organization/departments", proxyHandler("/departments"))

	// Time-off
	http.HandleFunc("/api/time-off", proxyHandler("/time_offs"))

	// Lookups
	http.HandleFunc("/api/lookups/countries", proxyHandler("/lookups/countries"))
	http.HandleFunc("/api/lookups/currencies", proxyHandler("/lookups/currencies"))
	http.HandleFunc("/api/lookups/job-titles", proxyHandler("/lookups/job-titles"))
	http.HandleFunc("/api/lookups/seniorities", proxyHandler("/lookups/seniorities"))
	http.HandleFunc("/api/lookups/time-off-types", proxyHandler("/lookups/time-off-types"))

	fmt.Printf("Deel API starter running on http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
```

**Run:** `DEEL_API_KEY=... go run main.go`

---

## Key Gotchas & Lessons Learned

1. **Decode the JWT first.** The `scope` field tells you exactly which endpoints will work. Building routes for scopes you don't have results in 403 errors. Also check `hide_employment_data` — it changes the response shape (see gotcha #12).

2. **Sandbox vs Production keys are different.** Never mix them. Sandbox is at the same base URL but uses a separate API key generated from the Sandbox tab in Developer Center.

3. **Rate limits apply in sandbox too.** Observed ~100 requests/minute. When paginating through all records (e.g. `getAllPeople()`), you're unlikely to hit this unless you also have concurrent requests.

4. **Pagination is cursor-based, not page-based.** Use `after_cursor` from the previous response's `page.cursor`, not `page=2`. When `page.cursor` is `null`, you've reached the last page.

5. **No official SDK exists.** Use your language's standard HTTP client (axios, requests, net/http, etc.).

6. **Token types matter.** Organization tokens are more durable. Personal tokens die when the person leaves the company.

7. **The response always wraps data in a `data` field.** List endpoints return `{ "data": [...] }`, single-resource endpoints return `{ "data": {...} }`.

8. **Time-off endpoints use `hris_organization_user_id`**, not the person UUID or worker_id. Get it from the `GET /people` response first.

9. **The `/time_offs` list endpoint does NOT support `limit`** — passing it returns 400. It returns up to 100 items per call.

10. **Route order matters for Express.** Put `/custom-fields` before `/:id` so Express doesn't match "custom-fields" as a person ID.

11. **Deel uses underscores in some paths and hyphens in others.** Time-off is `/time_offs` (underscore). Lookups use `/lookups/time-off-types` (hyphens). Legal entities use `/legal-entities` (hyphen).

12. **`hide_employment_data` changes the response shape.** When the JWT has `"hide_employment_data": true`, fields like `job_title`, `hiring_type`, `hiring_status`, `department`, `country`, and `timezone` are NOT at the person root level. They're nested inside an `employments[]` array. You must read them from `person.employments[0]` (the active employment). The person root still has identity fields (`full_name`, `first_name`, `last_name`, `seniority`, `start_date`, `direct_manager`, `emails`).

13. **`hiring_type` has more values than you'd expect.** Don't just handle `employee`, `contractor`, and `eor`. The full set includes: `contractor`, `employee`, `hris_direct_employee`, `peo`, `eor`. The `hris_direct_employee` type is common for companies using Deel HRIS without Deel payroll — decide whether it counts as "employee" in your UI.

14. **Emails are in an array, not a flat field.** There's no `person.email` — use `person.emails.find(e => e.type === 'work')?.value` to get the work email. Email types: `work`, `personal`, `primary`.

15. **`direct_manager` uses `display_name`, not `full_name`.** The manager object has `first_name`, `last_name`, and `display_name` (preferred name). There is no `full_name` on the manager object — construct it yourself or use `display_name`.

16. **`total_rows` from pagination may exceed what you get.** `page.total_rows` counts ALL records (including terminated). If you filter to `hiring_status === 'active'` after fetching, you'll get fewer records than `total_rows` suggests.

---

## Verification

After building, test every endpoint:

```bash
# Health check
curl http://localhost:3000/health

# --- people:read ---
curl "http://localhost:3000/api/people?limit=3"
curl http://localhost:3000/api/people/PERSON_UUID_HERE
curl http://localhost:3000/api/people/custom-fields

# --- organizations:read ---
curl http://localhost:3000/api/organization
curl http://localhost:3000/api/organization/structures
curl http://localhost:3000/api/organization/legal-entities
curl http://localhost:3000/api/organization/managers

# --- groups:read ---
curl http://localhost:3000/api/organization/teams
curl http://localhost:3000/api/organization/departments

# --- time-off:read ---
curl http://localhost:3000/api/time-off
curl http://localhost:3000/api/time-off/profile/HRIS_PROFILE_ID_HERE
curl http://localhost:3000/api/time-off/profile/HRIS_PROFILE_ID_HERE/entitlements

# --- lookups (no scope required) ---
curl http://localhost:3000/api/lookups/countries
curl http://localhost:3000/api/lookups/currencies
curl http://localhost:3000/api/lookups/job-titles
curl http://localhost:3000/api/lookups/seniorities
curl http://localhost:3000/api/lookups/time-off-types
```

All Deel endpoints should return JSON with a `data` field. If you get a 401, the token is invalid or expired. If you get a 403, the token lacks the required scope.
