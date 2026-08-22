# TraceBack

## Phase 2 — Final System Design

This hybrid document combines exact technical definitions and fixed decisions with visual architecture diagrams for clarity.

### 1. System Architecture

TraceBack follows a strict three-tier enterprise architecture. WebSocket/STOMP remains inside the Spring Boot application tier and is not treated as an independent architectural tier.

```mermaid
graph TD
    subgraph "Presentation Tier (Client)"
        React["React SPA<br/>(React Router / Forms / UI)"]
    end

    subgraph "Application Tier (Server: Spring Boot)"
        REST["REST APIs"]
        STOMP["WebSocket / STOMP"]
        Auth["Security<br/>(JWT + RBAC)"]
        MatchEngine["Matching Engine<br/>(Rule-Based)"]
        
        REST ~~~ STOMP
        Auth ~~~ MatchEngine
    end

    subgraph "Data Tier (MySQL & FS)"
        MySQL[("MySQL Database<br/>(Users, Items, Reports, Matches,<br/>Claims, Messages, Notifications)")]
        FileSys["Local File System<br/>(uploads/ directory)"]
    end

    React -- "HTTPS / REST" --> REST
    React -- "WebSocket / STOMP (TCP)" --> STOMP
    
    REST -- "JPA/JDBC" --> MySQL
    MatchEngine -- "JPA/JDBC" --> MySQL
    REST -- "File I/O" --> FileSys
```

---

# 2. Actors

### Student
Can:
* Register/login
* Report lost item
* Report found item
* Search reports
* View possible matches
* Accept/reject matches
* Chat with the other party
* Submit claim
* View notification/status updates

### Security
Can:
* View found items
* Review pending claims
* Verify ownership
* Approve/reject claims
* Mark physical item as returned

### Administrator
Can:
* Manage users
* Moderate inappropriate reports
* View system statistics
* Manage platform-level records
* Manage system configuration

Administrator does not perform physical ownership verification.

---

# 3. Core Modules
* Authentication & Authorization
* Lost Report Management
* Found Report Management
* Search & Filtering
* Matching Engine
* Notification Management
* Real-Time Chat
* Claim Management
* Security Verification
* Administration

---

# 4. Database Design (Entity-Relationship)

An `ITEM` is the common descriptive object, while the report gives it context.
* `USER` 1 ──── N `LOST_REPORT`
* `USER` 1 ──── N `FOUND_REPORT`
* `ITEM` 1 ──── 1 `LOST_REPORT`
* `ITEM` 1 ──── 1 `FOUND_REPORT`

```mermaid
erDiagram
    USER {
        BIGINT id PK
        VARCHAR name
        VARCHAR email
        VARCHAR password
        ENUM role "STUDENT, SECURITY, ADMIN"
        DATETIME created_at
    }
    ITEM {
        BIGINT id PK
        VARCHAR category
        VARCHAR name
        TEXT description
        VARCHAR color
        VARCHAR brand
        VARCHAR image_url
        DATETIME created_at
    }
    LOST_REPORT {
        BIGINT id PK
        BIGINT item_id FK
        BIGINT user_id FK
        VARCHAR location
        DATE date_lost
        ENUM status "OPEN, MATCHED, CLOSED"
        DATETIME created_at
    }
    FOUND_REPORT {
        BIGINT id PK
        BIGINT item_id FK
        BIGINT user_id FK
        VARCHAR location
        DATE date_found
        ENUM status "OPEN, MATCHED, CLAIM_REQUESTED, VERIFYING, RETURNED, CLOSED"
        DATETIME created_at
    }
    MATCH_RECORD {
        BIGINT id PK
        BIGINT lost_id FK
        BIGINT found_id FK
        INT score
        ENUM status "PENDING, ACCEPTED, REJECTED"
        DATETIME created_at
    }
    CLAIM {
        BIGINT id PK
        BIGINT match_id FK
        BIGINT claimant_id FK
        TEXT verification_data
        ENUM status "PENDING, APPROVED, REJECTED"
        DATETIME created_at
        DATETIME reviewed_at
    }
    CONVERSATION {
        BIGINT id PK
        BIGINT match_id FK
        DATETIME created_at
    }
    MESSAGE {
        BIGINT id PK
        BIGINT conversation_id FK
        BIGINT sender_id FK
        TEXT content
        DATETIME timestamp
    }
    NOTIFICATION {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR type
        VARCHAR message
        BIGINT reference_id
        BOOLEAN is_read
        DATETIME created_at
    }
    
    USER ||--o{ LOST_REPORT : "submits"
    USER ||--o{ FOUND_REPORT : "submits"
    USER ||--o{ CLAIM : "makes"
    USER ||--o{ MESSAGE : "sends"
    USER ||--o{ NOTIFICATION : "receives"
    ITEM ||--|| LOST_REPORT : "described_in"
    ITEM ||--|| FOUND_REPORT : "described_in"
    LOST_REPORT ||--o{ MATCH_RECORD : "has"
    FOUND_REPORT ||--o{ MATCH_RECORD : "has"
    MATCH_RECORD ||--o| CLAIM : "triggers"
    MATCH_RECORD ||--o| CONVERSATION : "enables"
    CONVERSATION ||--o{ MESSAGE : "contains"
```

*Note: A unique constraint should prevent the same lost/found pair from being inserted into `MATCH_RECORD` repeatedly. Each match has at most one active `CONVERSATION`, with participants derived dynamically from the matched reports.*

---

# 5. Core System Flow (End-to-End Sequence)

```mermaid
sequenceDiagram
    actor StudentA as Student A (Loser)
    actor StudentB as Student B (Finder)
    participant React as React Frontend
    participant Server as Spring Boot API
    participant WS as WebSocket Broker
    participant DB as MySQL Database
    actor Security as Security Guard

    StudentA->>React: Submit Lost Report (Wallet)
    React->>Server: POST /api/reports/lost
    Server->>DB: Save Item & LostReport
    
    Note over Server,DB: Synchronous Match Check
    Server->>DB: Find matching FoundReports (Score >= 70)
    
    StudentB->>React: Submit Found Report (Wallet)
    React->>Server: POST /api/reports/found
    Server->>DB: Save Item & FoundReport
    Server->>DB: Find matching LostReports (Category, Location, Date)
    
    alt Match Found (Score >= 70)
        Server->>DB: Create MATCH_RECORD
        Server->>DB: Create NOTIFICATIONs (Persistent)
        Server->>WS: Broadcast Match Alert
        WS->>React: WebSocket Alert "Match Found!"
        
        StudentA->>React: Open Chat
        React->>WS: Subscribe to /topic/chat/{conversationId}
        StudentA->>React: "Is the wallet black?"
        React->>WS: SEND /app/chat/{conversationId}
        WS-->>StudentB: "Is the wallet black?"
        Server->>DB: Save MESSAGE
        
        StudentA->>React: Submit Claim Form
        React->>Server: POST /api/claims (matchId, answers)
        Server->>DB: Save CLAIM (PENDING), Update FoundReport
        
        Security->>React: Review Claim Dashboard
        React->>Server: GET /api/claims/pending
        Security->>React: Approve & Mark Returned
        React->>Server: PUT /api/claims/{id}/status
        Server->>DB: Update CLAIM, Report Status -> RETURNED
    end
```

---

# 6. Matching Algorithm

Matching is performed synchronously whenever a new lost or found report is created. No machine learning is required for the MVP.

### Matching criteria
* Category    = 40 points
* Location    = 30 points
* Date        = 30 points

### Date rule
A report matches when: `absolute(date_lost - date_found) <= 2 days`

### Match rule
`score >= 70` creates a `MATCH_RECORD`.

Example:
```text
Category     Match       +40
Location     Match       +30
Date         +1 day      +30
----------------------------
Score                     100
```

---

# 7. State and Workflow Lifecycles

### Lost Report Lifecycle
```mermaid
stateDiagram-v2
    direction LR
    [*] --> OPEN
    OPEN --> MATCHED : Score >= 70
    MATCHED --> CLOSED : Claim Approved
    OPEN --> CLOSED : Manually Closed
```

### Found Report Lifecycle
```mermaid
stateDiagram-v2
    direction LR
    [*] --> OPEN
    OPEN --> MATCHED : Score >= 70
    MATCHED --> CLAIM_REQUESTED : Claim Submitted
    CLAIM_REQUESTED --> VERIFYING : Security Review
    VERIFYING --> RETURNED : Approved
    VERIFYING --> MATCHED : Rejected
    RETURNED --> CLOSED
```

### Claim Lifecycle
```mermaid
stateDiagram-v2
    direction LR
    [*] --> PENDING
    PENDING --> VERIFYING : Security Review
    VERIFYING --> APPROVED
    VERIFYING --> REJECTED
    APPROVED --> [*]
    REJECTED --> [*]
```

### Match Record Lifecycle
```mermaid
stateDiagram-v2
    direction LR
    [*] --> PENDING
    PENDING --> ACCEPTED
    PENDING --> REJECTED
    ACCEPTED --> CLOSED : Claim Approved
```

---

# 8. Real-Time Communication

## WebSocket Endpoint
* `/ws`
* Protocol: `STOMP over WebSocket`

## Client → Server
* `/app/chat/{conversationId}`
* Payload:
  ```json
  {
    "content": "Is the wallet black?"
  }
  ```

## Server → Clients
* `/topic/chat/{conversationId}`
* The server persists the message before broadcasting it.

---

# 9. REST API

## Authentication
* `POST /api/auth/register`
* `POST /api/auth/login`

## Reports
* `GET    /api/reports`
* `GET    /api/reports/{id}`
* `POST   /api/reports/lost`
* `POST   /api/reports/found`
* `PUT    /api/reports/{id}`
* `DELETE /api/reports/{id}`
* Supported filters: `type`, `category`, `location`, `status`, `date`

## Matches
* `GET  /api/matches/my-matches`
* `GET  /api/matches/{id}`
* `PUT  /api/matches/{id}/status`

## Claims
* `POST /api/claims`
* `GET  /api/claims/pending`
* `GET  /api/claims/{id}`
* `PUT  /api/claims/{id}/status`
* Access:
  * `/api/claims/pending` → `SECURITY`
  * `/api/claims/{id}/status` → `SECURITY`

## Notifications
* `GET  /api/notifications`
* `PUT  /api/notifications/{id}/read`

## Conversations
* `GET /api/conversations`
* `GET /api/conversations/{id}/messages`

---

# 10. Security Design

* Authentication: `JWT`
* Request: `Authorization: Bearer <token>`
* Password hashing: `BCryptPasswordEncoder`
* Authorization: `Spring Security`, `Role-Based Access Control`

Example:
* **STUDENT**: own reports, own claims, matched conversations
* **SECURITY**: found items, claim verification, physical return
* **ADMIN**: users, moderation, system management

---

# 11. Image Upload Design

* Client: `multipart/form-data`
* Spring Boot Directory:
  ```text
  uploads/
     ├── item_001.jpg
     ├── item_002.jpg
     └── item_003.png
  ```
* Database: `/uploads/item_001.jpg`
* The application must validate: File type, File size, Filename/path safety

---

# 12. Network Architecture

```mermaid
graph TD
    Browser["Web Browser (Client)"]
    
    subgraph "Application Server"
        Spring["Spring Boot Backend"]
        REST["REST Endpoints (Port 8080)"]
        WS["WebSocket/STOMP Endpoint (/ws)"]
        
        Spring --- REST
        Spring --- WS
    end
    
    MySQL[("MySQL Database (Port 3306)")]

    Browser -- "HTTPS/HTTP (TCP)" --> REST
    Browser -- "WebSocket (TCP)" --> WS
    
    REST -- "JDBC (TCP)" --> MySQL
```

For the project presentation:
* **Application Layer**: HTTP, HTTPS, REST, WebSocket, STOMP, DNS
* **Transport Layer**: TCP
* The separate UDP practical/experiment remains outside the TraceBack application, as decided in Phase 1.

---

# 13. Important Design Rules (LOCKED)

1. Keep the application as a single Spring Boot backend.
2. Do not introduce Node.js.
3. Do not introduce microservices.
4. Do not introduce an external message broker for the MVP.
5. Keep matching deterministic and rule-based.
6. Keep notifications persistent.
7. Keep Security responsible for physical verification.
8. Keep Admin responsible for platform administration.
9. Keep the database relational and normalized.
10. Keep WebSocket/STOMP inside the Spring Boot application tier.

---

# 14. Phase 2 Completion Criteria

Phase 2 is complete when the following are finalized:
* High-level architecture
* Three-tier architecture
* ER diagram
* Entity relationships
* State transitions
* Matching algorithm
* REST API specification
* WebSocket/STOMP specification
* Authentication/authorization design
* Image-storage design
* Network architecture
* Main sequence diagrams
* Component responsibilities

Only after these are approved should development begin.
