# Phase 1 Review: Validation and Consistency

## 1. Phase 1 Completion Status
**Status:** 100% Complete (Approved and Finalized)
The foundational documents (PRD, SRS, Context, Architecture) have been reviewed and approved. All constraints and decisions are locked in for the MVP.

## 2. Issues Found
*   **Image Storage Ambiguity:** The PRD mentions "Image" in Lost/Found reports, but the storage mechanism (Database BLOB vs. File System vs. Cloud Storage) is not defined.
*   **Node.js Ambiguity:** The syllabus mapping mentions Node.js as an "optional supporting service," but the architecture defines a strict three-tier setup. Including Node.js would unnecessarily complicate the architecture to a four-tier or microservice setup.
*   **Role Overlap:** The "Security" and "Admin" roles have overlapping responsibilities in the PRD (both can review claims and manage items). The boundary needs strict definition.
*   **Matching Algorithm Complexity:** A "rule-based weighted matching algorithm" is proposed. If implemented synchronously on every search, this could severely impact database performance and complicate the backend.
*   **Syllabus Gap (UDP):** The syllabus requires demonstrating UDP, but TraceBack's architecture (HTTP, REST, WebSockets) is entirely TCP-based.

## 3. Recommended Corrections
*   **Define Image Storage:** Use the local file system (or a static resource directory in Spring Boot) to store uploaded images for the MVP. Store only the relative file path/URL in the MySQL database. Do not use DB BLOBs.
*   **Drop Node.js:** Fully commit to Spring Boot for WebSockets (using STOMP) to handle real-time chat. This perfectly fulfills the TCP/Application layer networking requirement while keeping the architecture strictly three-tier (React -> Spring Boot -> MySQL).
*   **Clarify Roles:** 
    *   **Admin:** Manages the *platform* (user accounts, system logs, removing inappropriate posts).
    *   **Security:** Manages the *physical items* (verifying claims, marking physical items as returned/handed over).
*   **Simplify Matching for MVP:** Calculate matches asynchronously or during the creation of a new report. Start with exact matches on `Category` and `Location`, and a simple date range.
*   **Address the UDP Requirement:** Accept that TraceBack is a TCP-based enterprise app. To satisfy the UDP syllabus requirement, plan to create a separate, small standalone script (e.g., a simple UDP Echo server/client) as an auxiliary experiment, rather than forcing it into the TraceBack web application.

## 4. Finalized Scope for the MVP
*   **Roles:** Student, Security, Admin (with strictly separated concerns).
*   **Item Management:** CRUD for Lost and Found items, including basic local image uploads.
*   **Matching Engine:** Automated basic matching based on Category, Location, and Date.
*   **Communication:** WebSocket-based 1-on-1 real-time chat for matched users.
*   **Claim Workflow:** Claim submission by Students, review and closure by Security.
*   **Tech Stack:** React (Client) -> Spring Boot + WebSockets (Server) -> MySQL (Database).

## 5. Requirements Carried into Phase 2 (System Design)
*   **Database Design:** Precise ER diagrams, specifically focusing on how `MATCH`, `CLAIM`, and `CONVERSATION` entities interact.
*   **API Architecture:** Definition of REST API endpoints (including multipart/form-data for image uploads) and WebSocket event topics.
*   **Component Architecture:** React component hierarchy and Spring Boot layer structure (Controllers, Services, Repositories).
*   **UI/UX Flow:** Detailed state diagrams mapping the status lifecycle of an item (`OPEN` -> `MATCHED` -> `UNDER_VERIFICATION` -> `CLOSED`).

## 6. Fixed Decisions (Do not change unless explicitly requested)
*   The architecture is strictly a three-tier design (React, Spring Boot, MySQL).
*   No mobile apps, payment gateways, or AI image recognition will be built for the MVP.
*   WebSockets will be used for real-time messaging to satisfy the TCP application-layer requirement.
*   No Node.js backend services will be integrated.
