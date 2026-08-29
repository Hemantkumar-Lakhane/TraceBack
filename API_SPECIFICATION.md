# TraceBack - API Specification

All endpoints are prefixed with `/api`. Unless marked as PUBLIC, all endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

## 1. Authentication
### `POST /api/auth/register` (PUBLIC)
* **Request**: `{ "name": "...", "email": "...", "password": "..." }`
* **Note**: Registration always creates a `STUDENT` account. Security/Admin accounts must be provisioned separately.
* **Response (200 OK)**: `{ "message": "User registered successfully" }`
* **Errors**: `400` (Validation), `409` (Email exists)

### `POST /api/auth/login` (PUBLIC)
* **Request**: `{ "email": "...", "password": "..." }`
* **Response (200 OK)**: `{ "token": "jwt.string.here", "user": { "id": 1, "name": "...", "role": "STUDENT" } }`
* **Errors**: `401` (Invalid credentials)

---

## 2. Reports
### `POST /api/reports/lost` (STUDENT)
* **Content-Type**: `multipart/form-data`
* **Parameters**: `category`, `name`, `description`, `color`, `brand`, `location`, `date_lost` (Strings/Dates) + `image` (File - JPG/PNG only. No PDF).
* **Response (201 Created)**: The created `LostReport` object with nested `Item`.

### `POST /api/reports/found` (STUDENT, SECURITY)
* **Content-Type**: `multipart/form-data`
* **Parameters**: Same as lost, but with `date_found`.
* **Response (201 Created)**: The created `FoundReport` object with nested `Item`.

### `GET /api/reports` (ALL ROLES)
* **Parameters**: `?type=LOST|FOUND&category=...&location=...`
* **Response (200 OK)**: Pagination array of report objects.

### `GET /api/reports/lost/{id}` (ALL ROLES)
* **Response (200 OK)**: Full lost report details.

### `GET /api/reports/found/{id}` (ALL ROLES)
* **Response (200 OK)**: Full found report details.

---

## 3. Matches
### `GET /api/matches/my-matches` (STUDENT)
* **Response (200 OK)**: List of `MatchRecord` objects belonging to the current user's reports.

### `GET /api/matches/{id}` (STUDENT - if involved)
* **Response (200 OK)**: Detailed MatchRecord including nested `lost_report` and `found_report`.

---

## 4. Claims
### `POST /api/claims` (STUDENT)
* **Content-Type**: `multipart/form-data`
* **Parameters**: `match_id`, `verification_data`, `pickup_date`, `pickup_time`, and optional `proof_file` (File - JPG/PNG/PDF).
* **Response (201 Created)**: Created `Claim` object. FoundReport status becomes `CLAIM_REQUESTED`.

### `GET /api/claims/pending` (SECURITY)
* **Response (200 OK)**: List of claims with status `PENDING`.

### `PUT /api/claims/{id}/status` (SECURITY)
* **Request**: `{ "status": "APPROVED" | "REJECTED" }`
* **Response (200 OK)**: Updated claim. 
* **Note (Approval Transaction)**: If APPROVED, the backend executes an atomic transaction where: CLAIM becomes APPROVED, FOUND_REPORT becomes RETURNED, MATCH_RECORD becomes CLOSED, reviewed_at is updated, and a notification is created. If any step fails, the transaction rolls back.

---

## 5. Conversations & Messages
### `GET /api/conversations/{id}/messages` (STUDENT - if involved)
* **Response (200 OK)**: List of historical `Message` objects for the given conversation.

---

## 6. Notifications
### `GET /api/notifications` (ALL ROLES)
* **Response (200 OK)**: List of user's notifications.

### `PUT /api/notifications/{id}/read` (ALL ROLES)
* **Response (200 OK)**: Updated notification status.

---

## 7. Admin Operations
### `GET /api/admin/users` (ADMIN)
* **Response (200 OK)**: List of all users.

### `DELETE /api/admin/reports/{id}` (ADMIN)
* **Response (204 No Content)**: Moderation removal of a report.
