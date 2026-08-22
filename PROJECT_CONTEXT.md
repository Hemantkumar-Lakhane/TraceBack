# Project Context

## Project Name: TraceBack
**Tagline**: A Full-Stack Lost & Found Management System with Real-Time Communication.

## Problem
Decentralized, inefficient lost & found processes in campus environments (WhatsApp groups, security desks, etc.).

## Solution
A centralized web platform for students and security/admins to report, match, communicate, claim, and verify lost/found items.

## Key Modules
1. **Authentication & Users** (Roles: Student, Admin, Security)
2. **Lost Item Management**
3. **Found Item Management**
4. **Intelligent Matching** (Rule-based scoring: Category, Location, Date, Color, Brand, Description)
5. **Real-Time Communication** (WebSocket chat for potential matches)
6. **Claim & Verification**
7. **Admin Dashboard**

## Architecture & Tech Stack
- **Client**: React SPA (HTML5, CSS3, JS/TS)
- **Server**: Spring Boot (REST API & WebSockets/STOMP, Spring Security, JPA)
- **Database**: MySQL
- **Note**: Strict three-tier architecture. No Node.js backend. UDP will be demonstrated separately, not integrated here.

## MVP Scope & Constraints
- **Image Storage**: Local/static file storage only, relative paths in MySQL.
- **Matching**: Rule-based (Category, Location, Date), triggered synchronously on report creation.
- **Roles**:
  - *Student*: reports, searches, matches, chat, claims.
  - *Security*: manages physical items, verifies claims, confirms returns.
  - *Admin*: manages digital platform, users, moderation.
- **Out of Scope**: AI image recognition, mobile apps, payment systems.

## Initial Data Entities
- `USER`
- `ITEM`
- `LOST_REPORT`
- `FOUND_REPORT`
- `MATCH`
- `CLAIM`
- `CONVERSATION` / `MESSAGE`
- `NOTIFICATION`

## Syllabus Mapping Highlights
- Demonstrates 3-tier enterprise architecture.
- Heavy focus on client-server networking (HTTP/REST, TCP/WebSockets).
- Maps directly to Computer Networks and Web Technology course outcomes.
