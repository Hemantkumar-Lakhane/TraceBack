# AI Agent Instructions & Context

## Project: TraceBack
A Full-Stack Lost & Found Management System.

## Architecture Decisions
- **Architecture**: Three-tier (React -> Spring Boot -> MySQL).
- **Communication**: HTTP/HTTPS for REST APIs, TCP/WebSocket for real-time messaging.
- **Avoid**: Do not build a generic CRUD app. Focus on the intelligent matching and real-time communication aspects to fulfill the networking/web tech syllabus requirements.
- **Node.js**: Only use optionally as a supporting service for real-time/notifications if it doesn't overly complicate the Spring Boot architecture.

## Coding Conventions (Guidelines)
- **Frontend**: Functional React components, modular CSS/Tailwind (TBD), strictly separated API call layer (Axios).
- **Backend**: Standard Spring Boot layered architecture (Controller, Service, Repository, Entity, DTO).
- **Database**: Relational design using JPA/Hibernate.
- **Documentation**: Keep comments meaningful. Update `PROGRESS.md` and `CHANGELOG.md` when completing significant milestones.

## Development Rules
- Develop strictly phase-by-phase according to the roadmap.
- Adhere to the Product Requirements Document (PRD) and Software Requirements Specification (SRS) defined in Phase 1.
- Ensure syllabus mapping requirements are met (Client-server architecture, TCP, HTTP/HTTPS, REST, React, Spring Boot, MySQL).

## Constraints & Fixed Decisions (LOCKED)
- **Architecture**: STRICT three-tier (React -> Spring Boot + WebSocket/STOMP -> MySQL). DO NOT introduce Node.js or any microservices.
- **UDP**: Do not integrate UDP into TraceBack. It will be a separate experiment.
- **Roles**:
  - Student: reports, searches, matches, chat, claims.
  - Security: manages physical items, verifies claims, confirms returns.
  - Admin: manages the digital platform, users, moderation.
- **Image Storage**: Local/static file storage ONLY. Store relative paths in MySQL. Do not use DB BLOBs or external cloud buckets for MVP.
- **Matching Engine**: Rule-based matching (Category, Location, Date range) triggered synchronously on item creation. Avoid complex background jobs or AI models.
- **Real-Time**: Must use WebSocket/STOMP through Spring Boot.
- **Out of Scope**: No AI image recognition, no mobile application, no payment system.
