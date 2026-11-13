# TraceBack — Campus Lost & Found Recovery Network
### Vishwakarma Institute of Technology, Pune (VIT Pune)
**Course Project: Computer Networks (CNT_CP) • Academic Year 2026**

[![CI/CD Pipeline](https://github.com/Hemantkumar-Lakhane/TraceBack/actions/workflows/deploy.yml/badge.svg)](https://github.com/Hemantkumar-Lakhane/TraceBack/actions)
[![Frontend](https://img.shields.io/badge/Frontend-Vercel%20Live-black?logo=vercel)](https://vercel.com)
[![Backend](https://img.shields.io/badge/Backend-Render%20Live-46E3B7?logo=render)](https://traceback-oh5a.onrender.com)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20MySQL-blue?logo=postgresql)](https://render.com)
[![Security](https://img.shields.io/badge/Auth-JWT%20%2B%208--Digit%20PRN-success)](https://vit.edu)

---

## 📌 Executive Overview

**TraceBack** is an enterprise-grade, real-time campus recovery network developed specifically for **Vishwakarma Institute of Technology (VIT Pune)**. It replaces disorganized social media lost-and-found groups with a deterministic, cryptographic, and role-based custody platform.

The system connects students across all engineering branches (including Computer, AIML, AIDS, IT, Mechanical, and Electronics) directly with **Building 1 Central Security Desk (Ground Floor, Main Gate 1)**.

### 🌐 Live Production Deployments

- **Live Backend API**: [https://traceback-oh5a.onrender.com](https://traceback-oh5a.onrender.com)
- **Interactive Swagger OpenAPI Docs**: [https://traceback-oh5a.onrender.com/swagger-ui/index.html](https://traceback-oh5a.onrender.com/swagger-ui/index.html)
- **Live Frontend (Vercel)**: Configured via `TraceBack/frontend` on Vercel
- **Local Dev Server**: `http://localhost:5173` (Frontend) & `http://localhost:8080` (Backend)

---

## 📡 Computer Networks (CNT Course Project) Architecture Mapping

TraceBack is architected specifically around the **OSI / TCP-IP 5-Layer Model**:

```
+-----------------------------------------------------------------------------------------------+
|  Application Layer (Layer 7)                                                                  |
|  * RESTful APIs over HTTP/1.1 & HTTP/2 with gzip payload compression                          |
|  * Bidirectional WebSocket (RFC 6455) & STOMP Framing (CONNECT, SUBSCRIBE, SEND)              |
|  * Stateless Authentication: JWT Bearer Tokens in HTTP 'Authorization' Headers                |
|  * CORS Preflight Negotiation (OPTIONS handshake with trusted origin matching)                |
+-----------------------------------------------------------------------------------------------+
|  Transport Layer (Layer 4)                                                                    |
|  * Reliable, ordered byte-stream delivery over persistent TCP Sockets                         |
|  * Transport Fallback Engine: SockJS (WebSocket -> XHR-Streaming -> XHR-Polling)              |
|  * Dual-directional 10s Heartbeats ([10000ms, 10000ms]) preventing NAT timeout drops          |
|  * Port Multiplexing: 8080 (REST / WS Broker), 5432 (PostgreSQL), 3306 (MySQL), 443 (TLS)     |
+-----------------------------------------------------------------------------------------------+
|  Network & Internet Layer (Layer 3)                                                           |
|  * IPv4 & IPv6 Packet Routing across Campus Subnet CIDR blocks (e.g. 10.20.0.0/16)            |
|  * Campus NAT (Network Address Translation) Traversal maintained via TCP keep-alives          |
|  * Domain Name System (DNS) resolution mapping custom domains to cloud edge IPs               |
+-----------------------------------------------------------------------------------------------+
|  Data Link & Physical Layers (Layer 2 & 1)                                                    |
|  * IEEE 802.11ax/ac Wi-Fi frame encapsulation, MAC address filtering, CSMA/CA collision mgmt   |
+-----------------------------------------------------------------------------------------------+
|  Network Security & Cryptography                                                              |
|  * Transport Layer Security (TLS 1.3) encrypting all transit data (HTTPS & WSS)               |
|  * Salted BCrypt Key Derivation Function (KDF) hashing 8-digit PRN credentials at Layer 7     |
+-----------------------------------------------------------------------------------------------+
```

### Key Technical Concepts for Viva Defense:
1. **Full-Duplex Framing (RFC 6455)**: Replaces polling overhead with a persistent WebSocket socket upgraded via HTTP `101 Switching Protocols`.
2. **NAT Session Survival**: College firewalls silently drop inactive TCP state mappings after 30–60 seconds. TraceBack negotiates dual 10-second STOMP heartbeats (`heartbeat: [10000, 10000]`) to keep NAT router state tables active.
3. **CORS Security Filter**: Spring Security enforces strict `Access-Control-Allow-Origin`, `Access-Control-Allow-Credentials: true`, and `Access-Control-Allow-Headers` validating Vercel, Render, and campus origins.

---

## 🏛️ Campus User Personas & Default Test Credentials

The system provides 4 complete campus roles for testing and viva demonstration:

| Campus Role | Name / Title | Campus Email | Password (PRN) | Assigned Station / Department |
| :--- | :--- | :--- | :--- | :--- |
| **Student (Owner)** | Aarav Sharma | `aarav.sharma@vit.edu` | `12110104` | Computer Engineering (B-Building) |
| **Student (Finder)** | Rohan Verma | `rohan.verma@vit.edu` | `12110208` | Mechanical Engineering |
| **Student (Claimant)** | Ananya Iyer | `ananya.iyer@vit.edu` | `12110305` | Information Technology |
| **Security Officer** | Insp. Rajesh Kumar | `rajesh.kumar@vit.edu` | `SEC-409` | Central Security Desk (Bldg 1, Gate 1) |
| **Administrator** | Prof. Priya Nair | `priya.nair@vit.edu` | `ADM-101` | Dean of Student Affairs |

---

## ✨ Production Capabilities

1. **Lost & Found Incident Logging**:
   - Multi-step reporting pipeline capturing item classification, campus location hotspots, distinguishing marks, and photos.
2. **Deterministic Correlation Engine**:
   - Correlates category, location proximity, timestamps, and brand attributes.
3. **Real-Time Verification Chat**:
   - Secure private chat channel between finder and owner to verify unique identifiers before physical handover.
4. **Digital Claim Voucher & Verification Pass**:
   - Generates digital QR custody vouchers presented at the Central Security Desk.
5. **Production Admin Operations Console**:
   - **Staff Provisioning**: Provision Security Officers and Staff with auto-generated badge PRNs and BCrypt password encryption.
   - **Spring Security Lockouts**: Toggle account status (`ACTIVE` vs `SUSPENDED`) with instant login prevention.
   - **Self-Protection Guardrails**: Active admins cannot suspend or delete their own accounts.
   - **Content Moderation Queue**: Automated keyword scanner detecting commercial spam or policy violations.
   - **Operational Analytics & CSV Export**: One-click download of institutional audit datasets for NAAC / NBA reviews.
   - **Campus System Config (`/admin/config`)**: Real-time tuning of security desk parameters and matching sensitivity.
6. **Mobile PWA & Custom Palette**:
   - Responsive design with PWA manifest (`manifest.json`) and 3-color palette (`#3B2418`, `#F2E8DA`, `#8EC5FF`).

---

## 🧪 Automated QA Regression Test Suite

TraceBack includes an automated test suite executed on every Git commit via GitHub Actions (`deploy.yml`):

```bash
cd TraceBack/frontend
npm test
```

```text
TAP version 13
# Subtest: QA Test Suite: Admin Panel Production Grade Capabilities
  ok 1 - TC-ADMIN-01: Provision staff account creates valid object with badge PRN and active status
  ok 2 - TC-ADMIN-02: Status update returns updated status safely without corrupting array
  ok 3 - TC-ADMIN-03: Self-protection guardrail logic prevents admin self-suspension
  ok 4 - TC-ADMIN-04: CSV audit export correctly formats headers and escapes quoted strings
  ok 5 - TC-ADMIN-05: Telemetry stats calculation avoids zero-division and returns valid percentage
# Subtest: QA Test Suite: Notification Pipeline & Edge Cases
  ok 6 - TC-01: normalizeNotification handles empty object safely
  ok 7 - TC-02: Deep-links CHAT notifications to /chat/:id
  ok 8 - TC-03: Deep-links MATCH and CLAIM notifications
  ok 9 - TC-04: Timestamp format normalization
  ok 10 - TC-05: Normalized read boolean state
  ok 11 - TC-06: Backend { message: "All notifications marked as read" } unwrap
  ok 12 - TC-07: Spring Pageable content extraction
  ok 13 - TC-08: Navbar unread count resilience
# Subtest: QA Test Suite: Campus Configuration & Identity Integrity
  ok 14 - TC-09: Campus identity is strictly VIT Pune
  ok 15 - TC-10: Student login policy enforces 8-digit PRN authentication
  ok 16 - TC-14: Department list configuration includes AIML and core branches
# Subtest: QA Test Suite: Image Fallback & UI Buzzword Sanitization
  ok 17 - TC-11: Fallback image normalization
  ok 18 - TC-12: Upload path normalization
  ok 19 - TC-13: UI copy integrity (no raw STOMP labels in UI)
  ok 20 - TC-15: Zero buzzword badge sanitization

# tests 20 | pass 20 | fail 0 (Execution: 238ms)
```

---

## 🚀 Running Locally

### Quickstart (Windows 1-Click Launcher):
Double-click [`run_all.bat`](run_all.bat) in the project root. It will:
1. Verify `backend/.env` exists (creating from template if missing).
2. Launch the Spring Boot backend on `http://localhost:8080`.
3. Launch the Vite React frontend on `http://localhost:5173`.

### Manual Setup:

#### 1. Backend (Spring Boot 3 + Maven)
```bash
cd backend
# Edit .env with your MySQL or PostgreSQL credentials
./mvnw clean spring-boot:run
```

#### 2. Frontend (React 19 + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 👥 Contributors & Academic Credits
- **Project**: TraceBack — Campus Recovery Network
- **Department**: Computer Engineering / Information Technology
- **Institute**: Vishwakarma Institute of Technology, Pune (VIT Pune)
- **Course**: Computer Networks (Course Project)
