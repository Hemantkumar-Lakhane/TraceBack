# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Completed Milestone 2 (Reporting & Image Uploads).
- Configured Spring Boot multipart file upload limits (`max-file-size=10MB`).
- Built backend entities (`Item`, `LostReport`, `FoundReport`) matching SQL schema without modifying `DATABASE_SCHEMA.sql`.
- Added image upload handling restricting to JPG/PNG, stored locally in `backend/uploads/` (with orphaned file cleanup on DB failure).
- Configured `/uploads/**` static resource routing via `WebMvcConfig`.
- Added `GET /api/reports/my` to isolate student-specific reports.
- Created `ReportController` to handle `POST /api/reports/lost` and `POST /api/reports/found`.
- Created `ReportLost.jsx` and `ReportFound.jsx` frontend components linked via `DashboardShell.jsx`.
- Verified file size, authorization restrictions, and duplicate file handling via Integration Tests.


### Added
- Completed Milestone 1 implementation including Spring Boot security layer, global exception handling, and Auth Controller.
- Scaffolded Vite + React frontend with Axios, AuthContext, and basic routing shell.
- Passed backend authentication and registration integration tests.
- Initial project documentation setup (`README.md`, `AGENTS.md`, `PROGRESS.md`, `CHANGELOG.md`, `PROJECT_CONTEXT.md`).
- Integrated Phase 1 planning requirements (PRD, SRS, architecture, entities, roadmap) into documentation.
- Finalized and approved Phase 2 System Design (Hybrid visual/technical architecture document), and locked in WebSocket topic convention using `conversationId`.
- Updated Phase 2 Design: Included `pickup_date` (DATE) and `pickup_time` (TIME) in the `CLAIM` entity to support MVP pickup scheduling.
- Completed Phase 3 Security and Admin UI/UX text specifications, defining role-based dashboards, verification workflows, and moderation queues.
- Phase 3 Sign-off: Officially finalized all UI/UX designs, workflows, and specifications.
- Commenced Phase 4 Database and API Design, drafting the SQL schema, REST specification, and error standard contracts.
- Phase 4 Sign-off: Officially finalized all Database schemas, API specifications, Error standards, and architecture contracts.
