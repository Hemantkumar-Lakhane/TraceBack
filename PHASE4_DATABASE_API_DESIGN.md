# Phase 4: Database & API Design

This phase locks in the exact data structures and communication contracts that will be implemented in Spring Boot and consumed by React.

## 1. Final Database Design
The finalized relational design includes 9 core tables.
All primary keys are `BIGINT AUTO_INCREMENT`.
Foreign keys enforce `ON DELETE CASCADE`. **Warning**: Admin user deletion is highly destructive. Deleting a user will cascade and permanently delete all their reports, matches, claims, and messages. Do not silently change the cascade strategy unless absolutely necessary.
* See `DATABASE_SCHEMA.sql` for the exact DDL including constraints, nullable fields, and enum values.

## 2. SQL Schema Design
Implemented fully in `DATABASE_SCHEMA.sql`.

## 3. Seed Data Plan
To facilitate testing and demonstrations, the database will be seeded with development/demo data only (not for production):
* **Users**: 2 Students (e.g., Alice, Bob), 1 Security Guard, 1 Admin.
* **Reports**: Alice has a Lost Report (Blue Wallet at SJT). Bob has a Found Report (Blue Wallet at SJT).
* **Matches**: 1 Match Record linking Alice and Bob's reports (Score: 100).
* **Conversations**: 1 Active conversation for the match.
* **Claims**: 1 Pending claim submitted by Alice to Security.

## 4. REST API Contract
The full interface for HTTP communication is specified in `API_SPECIFICATION.md`.
It includes endpoint definitions, authorization restrictions, and request/response shapes.

### Claim & Match Lifecycle Consistency
* **Claim Lifecycle**: Claim submitted → CLAIM = PENDING → FOUND_REPORT = CLAIM_REQUESTED → Security review → FOUND_REPORT = VERIFYING → Claim approved/rejected.
* **Approval Transaction**: Claim approval executes as one atomic backend transaction: `CLAIM` → `APPROVED`, `FOUND_REPORT` → `RETURNED`, `MATCH_RECORD` → `CLOSED`, `reviewed_at` updated, and a notification is created. If any operation fails, the transaction rolls back.

## 5. Error Response Standard
All backend REST controllers will utilize a `@ControllerAdvice` global exception handler to output a strictly formatted error JSON.
* See `API_ERROR_STANDARD.md` for the exact schema.

## 6. Authentication
* **Flow**: User registers (always strictly defaults to `STUDENT` role; Security/Admin must be provisioned via seed/admin mechanisms) → Logs in → Receives JWT token → Attaches token to `Authorization: Bearer <token>` for subsequent requests.
* **JWT Payload**: Will contain `sub` (email) and `role` (STUDENT/SECURITY/ADMIN).
* **Protection**: Spring Security `SecurityFilterChain` will reject `401 Unauthorized` for missing tokens, and `403 Forbidden` if a Student tries to hit `/api/claims/pending` (which requires `SECURITY` role).

## 7. Image Upload Contract
* **Mechanism**: Spring Boot `MultipartFile` processing via `multipart/form-data`.
* **Storage**: Local filesystem inside an `/uploads/` directory relative to the Spring Boot running context.
* **File Type by Purpose**:
  * **Report Item Image**: Allowed `image/jpeg`, `image/png`. Maximum 10MB. Stored as relative path in `ITEM.image_url`. PDF is strictly NOT allowed.
  * **Ownership Proof**: Allowed `image/jpeg`, `image/png`, `application/pdf`. Maximum 10MB. Stored as relative path in `CLAIM.proof_file_url`.
* **Database**: Only the relative URI string (e.g., `/uploads/uuid.jpg`) is stored in the database.

## 8. Matching Service Contract
The rule-based algorithm is locked and strictly deterministic (NO AI/ML):
* **Trigger**: Executes synchronously when `createLostReport` or `createFoundReport` is called.
* **Criteria Weights**:
  * Category Match = 40 Points
  * Location Match = 30 Points
  * Date/Timeline Difference (<= 2 days) = 30 Points
* **Threshold**: If Score >= 70, a `MATCH_RECORD` is inserted.
* **Duplicate Prevention**: A unique constraint on `(lost_id, found_id)` in the DB prevents duplicate match rows.
* **Automatic Lifecycle**: Matches are system-generated records initialized as `ACTIVE`. Their lifecycle is handled automatically by claim/return processing (they transition to `CLOSED` when a claim is approved). There is no manual status mutation or "Accept Match" workflow.

## 9. WebSocket / STOMP Contract
* **Endpoint**: `ws://localhost:8080/ws`
* **Conversation Creation**: There is no manual conversation creation endpoint. A `CONVERSATION` is automatically created by the backend when a valid `MATCH_RECORD` is created.
* **Publishing**: React sends JSON to `/app/chat/{conversationId}`.
* **Subscribing**: React listens to `/topic/chat/{conversationId}`.
* **Persistence**: The backend STOMP controller will save the message to the `MESSAGE` table *before* broadcasting it to the topic to guarantee history.

## 10. UI → API Traceability
* **Report Lost/Found** → `POST /api/reports/lost` (or `found`)
* **Report Details** → `GET /api/reports/lost/{id}` or `GET /api/reports/found/{id}`
* **Student Dashboard Matches** → `GET /api/matches/my-matches`
* **Match Details** → `GET /api/matches/{id}`
* **Chat Screen** → `GET /api/conversations/{id}/messages` + WebSocket connection
* **Submit Claim** → `POST /api/claims` (using `multipart/form-data` for ownership proof)
* **Security Dashboard** → `GET /api/claims/pending`
* **Approve Claim** → `PUT /api/claims/{id}/status` with `{ "status": "APPROVED" }`
* **Admin User Management** → `GET /api/admin/users`

## 11. API Testing Plan
A Postman collection will be utilized during backend development to test:
1. Auth (Acquiring Tokens).
2. Report Creation (Testing image uploads).
3. The Matching Engine (Testing exact matches vs non-matches).
4. Security restrictions (Ensuring a Student token gets a 403 on Admin routes).

## 12. Phase 4 Completion Criteria
Before any React or Spring Boot code is written, Phase 4 must be approved. The contract represented by these documents (`DATABASE_SCHEMA.sql`, `API_SPECIFICATION.md`, `API_ERROR_STANDARD.md`, and this master document) must be locked in. Any deviations during implementation will require updating these documents first.
