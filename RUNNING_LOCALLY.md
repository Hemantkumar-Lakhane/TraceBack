# Running TraceBack — Local & Cloud Deployment Guide
### Vishwakarma Institute of Technology, Pune (VIT Pune)
**Course Project: Computer Networks (CNT_CP)**

This document provides complete, verified instructions to run, test, and deploy the TraceBack application locally and on cloud platforms (Render + Vercel).

---

## ⚡ Quickstart: 1-Click Launch (Windows)

You can launch both the **Spring Boot Backend** and the **Vite React Frontend** with a single click:

- **Windows Batch Launcher**: Double-click `run_all.bat` in the project root, or run in terminal:
  ```cmd
  .\run_all.bat
  ```

- **PowerShell Launcher**:
  ```powershell
  .\run_all.ps1
  ```

This script automatically:
1. Verifies/creates `backend/.env` with safe default configurations.
2. Starts the Spring Boot backend on `http://localhost:8080`.
3. Starts the React Vite frontend on `http://localhost:5173`.

---

## 🛠️ Prerequisites

| Dependency | Minimum Version | Notes |
| :--- | :--- | :--- |
| **Java JDK** | 17 LTS | Eclipse Temurin / OpenJDK 17 |
| **Maven** | 3.8+ | Included via wrapper (`mvnw` / `mvnw.cmd`) |
| **Node.js** | v18.0+ | Required for frontend dependencies |
| **npm** | v9.0+ | Bundled with Node.js |
| **Database** | MySQL 8.0+ or PostgreSQL 14+ | Dual-driver support is auto-detected |

---

## 🗄️ Database Configuration (Dual-Engine Support)

TraceBack supports both **PostgreSQL** (production default on Render) and **MySQL** (local development default). The Spring Boot backend dynamically selects the appropriate dialect based on the JDBC connection URL.

### Option A: Local MySQL Setup
1. Ensure your local MySQL service is running.
2. Create the database:
   ```sql
   CREATE DATABASE traceback;
   ```
3. Set your environment variables in `backend/.env`:
   ```env
   DB_URL=jdbc:mysql://localhost:3306/traceback
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   JWT_SECRET=your_256_bit_secret_key_here
   DDL_AUTO=update
   ```

### Option B: Cloud PostgreSQL Setup (Render)
When deploying to Render PostgreSQL, configure:
```env
DB_URL=jdbc:postgresql://<render_hostname>:5432/traceback
DB_USERNAME=traceback_user
DB_PASSWORD=<render_generated_password>
JWT_SECRET=your_256_bit_secret_key_here
DDL_AUTO=update
```

---

## 🖥️ Manual Startup Guide

### 1. Backend (Spring Boot 3 + Java 17)

```bash
cd backend

# On Windows:
.\mvnw.cmd clean test           # Run unit tests
.\mvnw.cmd spring-boot:run      # Launch backend server

# On Linux/macOS:
./mvnw clean test
./mvnw spring-boot:run
```

**Verification**:
- Server starts on: `http://localhost:8080`
- Swagger OpenAPI documentation: `http://localhost:8080/swagger-ui/index.html`
- Health check / Auth check: `http://localhost:8080/api/auth/login` (returns 400 for empty body, proving endpoint is alive)

### 2. Frontend (React 19 + Vite)

```bash
cd frontend

# Install packages
npm install

# Run automated QA test suite (20 tests)
npm test

# Run Vite dev server
npm run dev
```

**Verification**:
- Local frontend URL: `http://localhost:5173`
- The frontend dynamically reads `VITE_API_BASE_URL` from `frontend/.env`. If unset, it safely defaults to `http://localhost:8080`.

---

## ☁️ Cloud Deployment Configuration

### 1. Render (Backend + Database)
- **Runtime**: Docker (Eclipse Temurin 17 JRE multi-stage build via root `Dockerfile` or `backend/Dockerfile`).
- **Memory Guardrail**: Configured with `-Xmx384m` to fit comfortably inside Render's 512MB RAM free tier.
- **Environment Variables on Render**:
  - `DB_URL`: JDBC URL to your Render PostgreSQL database instance (`jdbc:postgresql://<host>:5432/traceback`)
  - `DB_USERNAME`: Database username
  - `DB_PASSWORD`: Database password
  - `JWT_SECRET`: 256-bit signing key
  - `DDL_AUTO`: `update`
- **Live Render URL**: `https://traceback-oh5a.onrender.com`

### 2. Vercel (Frontend)
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables on Vercel**:
  - `VITE_API_BASE_URL`: `https://traceback-oh5a.onrender.com`
- **Live Vercel URL**: `https://trace-back-six.vercel.app`

---

## 👤 Real Student Registration & Auto-Login Flow

TraceBack features a verified real-time registration engine:
1. Navigate to `/register` (`https://trace-back-six.vercel.app/register`).
2. Input **Full Name**, **8-digit PRN** (e.g. `12110450`), **Academic Department**, **VIT Campus Email**, and **Password**.
3. Upon clicking **Submit Registration**:
   - `POST /api/auth/register` provisions the student in PostgreSQL/MySQL with BCrypt password hashing.
   - The client immediately executes an auto-login handshake (`POST /api/auth/login`) without requiring the user to re-type their credentials.
   - The signed JWT token is stored in `localStorage` and attached as `Authorization: Bearer <token>` to all subsequent requests.
   - The user is redirected to `/dashboard` with full access to reporting, chat, claims, and notifications.
4. **Duplicate Prevention**: If the email is already registered, the system returns `409 Conflict` and presents a 1-click **`Sign in with this account →`** button that pre-fills the login screen.

---

## 🧪 Running the Automated QA Test Suite

The frontend contains an automated Node.js test runner covering 20 critical integration test cases:

```bash
cd frontend
npm test
```

### Test Coverage Summary:
- **`TC-ADMIN-01` to `TC-ADMIN-05`**: Staff account provisioning, active/suspended status toggles, self-protection guardrails, CSV audit export formatting, and telemetry zero-division resilience.
- **`TC-01` to `TC-08`**: Notification pipeline, deep-linking to `/chat/:id`, ISO timestamp normalization, backend unwrapping, and unread counter resilience.
- **`TC-09`, `TC-10`, `TC-14`**: Institutional VIT Pune campus identity enforcement, 8-digit PRN auth policy, and department listings.
- **`TC-11` to `TC-15`**: Fallback image URL resolvers and UI copy buzzword sanitization (zero internal jargon like "STOMP Live E2E" in the interface).

---

## 🏛️ Default Test Accounts

| Role | Name | Campus Email | Password | Station / Branch |
| :--- | :--- | :--- | :--- | :--- |
| **Student (Owner)** | Aarav Sharma | `aarav.sharma@vit.edu` | `12110104` | Computer Engineering |
| **Student (Finder)** | Rohan Verma | `rohan.verma@vit.edu` | `12110208` | Mechanical Engineering |
| **Security Officer** | Insp. Rajesh Kumar | `rajesh.kumar@vit.edu` | `SEC-409` | Central Security Desk (Bldg 1) |
| **Administrator** | Prof. Priya Nair | `priya.nair@vit.edu` | `ADM-101` | Dean of Student Affairs |
