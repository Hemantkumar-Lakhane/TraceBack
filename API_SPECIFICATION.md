# TraceBack — REST & WebSocket API Specification
### Vishwakarma Institute of Technology, Pune (VIT Pune)
**Course Project: Computer Networks (CNT_CP)**

All REST endpoints are prefixed with `/api`. Unless explicitly designated as **PUBLIC**, all requests require a signed JWT token provided in the HTTP `Authorization: Bearer <token>` header.

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register` (PUBLIC)
- **Description**: Registers a new verified student account in the campus directory.
- **Request Body**:
  ```json
  {
    "name": "Aarav Sharma",
    "email": "aarav.sharma@vit.edu",
    "password": "password123"
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "message": "User registered successfully"
  }
  ```
- **Errors**: `400 Bad Request` (validation failures), `409 Conflict` (email already exists in database).

### `POST /api/auth/login` (PUBLIC)
- **Description**: Authenticates campus credentials using salted BCrypt hashing and returns a signed HS256 JWT token.
- **Request Body**:
  ```json
  {
    "email": "aarav.sharma@vit.edu",
    "password": "password123"
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "name": "Aarav Sharma",
      "role": "STUDENT"
    }
  }
  ```
- **Errors**: `401 Unauthorized` (invalid credentials or suspended account).

---

## 2. Report Management (`/api/reports`)

### `POST /api/reports/lost` (Role: `STUDENT`)
- **Content-Type**: `multipart/form-data`
- **Fields**: `name`, `category`, `brand`, `color`, `location`, `date_lost`, `description`, optional `image` (PNG/JPEG up to 10MB).
- **Response (`201 Created`)**: The persisted `LostReport` object with nested `Item` and correlation engine triggers.

### `POST /api/reports/found` (Roles: `STUDENT`, `SECURITY`)
- **Content-Type**: `multipart/form-data`
- **Fields**: `name`, `category`, `brand`, `color`, `location`, `date_found`, `description`, optional `image`, optional `storage_location`.
- **Response (`201 Created`)**: The persisted `FoundReport` object.

### `GET /api/reports` (All Authenticated Roles)
- **Parameters**: `?type=LOST|FOUND&category=ELECTRONICS&location=Library`
- **Response (`200 OK`)**: Paginated array of campus report entities.

### `GET /api/reports/my` (Role: `STUDENT`)
- **Parameters**: `?type=LOST|FOUND`
- **Response (`200 OK`)**: Reports created exclusively by the currently authenticated user.

### `GET /api/reports/lost/{id}` & `GET /api/reports/found/{id}` (All Roles)
- **Response (`200 OK`)**: Complete report details, custody notes, and masking metadata.

---

## 3. Correlation Engine (`/api/matches`)

### `GET /api/matches/my-matches` (Role: `STUDENT`)
- **Description**: Retrieves matches computed via the 40/30/30 deterministic algorithm:
  - Category Match: 40%
  - Campus Landmark Proximity: 30%
  - Timestamp Temporal Proximity: 30%
- **Response (`200 OK`)**: Array of `MatchRecord` objects belonging to the student's reports.

### `GET /api/matches/{id}` (Role: `STUDENT`)
- **Response (`200 OK`)**: Deep side-by-side comparison matrix with attribute breakdown.

---

## 4. Custody Claims & Handover (`/api/claims`)

### `POST /api/claims` (Role: `STUDENT`)
- **Content-Type**: `multipart/form-data`
- **Fields**: `match_id`, `verification_data` (secret marks, serial numbers, wallpaper hint), `pickup_date`, `pickup_time`, optional `proof_file`.
- **Response (`201 Created`)**: Created `Claim` voucher; updates found report status to `CLAIM_REQUESTED`.

### `GET /api/claims/pending` (Role: `SECURITY`)
- **Response (`200 OK`)**: List of pending ownership claims awaiting physical verification at Central Security Desk.

### `PUT /api/claims/{id}/status` (Role: `SECURITY`)
- **Request Body**:
  ```json
  {
    "status": "APPROVED"
  }
  ```
- **Response (`200 OK`)**: Executes atomic database transaction: updates `Claim` to `APPROVED`, `FoundReport` to `RETURNED`, `MatchRecord` to `CLOSED`, and issues audit log.

---

## 5. Production Administration (`/api/admin`)

*All admin endpoints strictly require `ROLE_ADMIN`.*

### `GET /api/admin/users`
- **Response (`200 OK`)**: Complete directory of campus users with account status (`ACTIVE` vs `SUSPENDED`).

### `POST /api/admin/users`
- **Description**: Provisions new Security Officers or Staff accounts with BCrypt encrypted passwords.
- **Request Body**:
  ```json
  {
    "name": "Officer Ramesh Patil",
    "email": "ramesh.patil@vit.edu",
    "role": "SECURITY",
    "password": "secure_password"
  }
  ```
- **Response (`201 Created`)**: Created user metadata with auto-generated badge PRN.

### `PUT /api/admin/users/{id}/status`
- **Description**: Instantly toggles account access. Suspended users are locked out of Spring Security (`isAccountNonLocked() = false`).
- **Request Body**:
  ```json
  {
    "status": "SUSPENDED"
  }
  ```
- **Response (`200 OK`)**: Updated user object.

### `DELETE /api/admin/users/{id}`
- **Description**: Permanently purges user account and associated audit tokens.

### `GET /api/admin/moderation`
- **Description**: Content moderation queue scanning submissions against institutional safety policies and spam triggers.
- **Response (`200 OK`)**: Flagged reports with scanner reason and reporter details.

### `GET /api/admin/stats`
- **Description**: University-wide recovery KPIs, department return rates, and institutional telemetry for accreditation.
- **Response (`200 OK`)**: Aggregate metrics and turnover velocity.

---

## 6. Real-Time Communication (WebSocket & STOMP)

TraceBack implements full-duplex WebSocket framing over persistent TCP sockets:

| Channel / Topic | Direction | Purpose |
| :--- | :--- | :--- |
| **`/ws`** | Client ⇄ Server | SockJS transport negotiation endpoint (HTTP `101 Switching Protocols`) |
| **`/app/chat/{convId}`** | Client → Server | Transmit real-time message payload |
| **`/topic/messages/{convId}`** | Server → Subscribed Clients | Broadcast message to authenticated room participants |
| **`/user/queue/notifications`** | Server → Specific Client | Push instantaneous match and claim alerts to active user |
| **Heartbeats (`[10000, 10000]`)** | Bidirectional (10s) | Periodic ping/pong frames preventing campus NAT router timeouts |
