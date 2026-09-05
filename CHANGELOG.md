# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Lab Session Update (September 5, 2026):
  - Completed Milestone 3 (Matching Engine & Action Dashboard).
  - Implemented `MatchingService` with deterministic 40/30/30 scoring matrix for Category, Location, and Date.
  - Implemented automatic generation of `MatchRecord` and `Conversation` when a Lost/Found Report is created.
  - Handled strict database constraints (unique `lost_id`, `found_id`) to prevent duplicate match records safely.
  - Created backend `MatchController` to expose `GET /api/matches/my-matches` and `GET /api/matches/{id}`.
  - Verified backend logic using unit tests and integration tests with live database schema.
  - Implemented React frontend components `Matches.jsx` and `MatchDetails.jsx` to list and view matches.
  - Completed manual E2E integration verification via API and live DB testing.
- Lab Session Update (September 5, 2026 - Earlier):
  - Fixed a CORS issue preventing React frontend from accessing the Spring Boot backend.
  - Fixed an issue in `GET /api/reports/my` where omitting the `type` parameter failed to return both lost and found reports.
  - Completed and officially passed manual API verification for all Milestone 2 endpoints.
  - Verified physical image uploads (`backend/uploads/`) and database persistence (`ITEM.image_url`).
  - Milestone 2 is officially COMPLETED.
  - Milestone 3 is PENDING.
- Lab Session Update (August 29, 2026):
  - Live MySQL environment verified.
  - Registration manually verified.
  - Login manually verified.
  - JWT authorization manually verified.
  - `GET /api/reports/my` manually verified.
  - Swagger multipart file chooser verified.
  - Fixed Vite frontend routing to properly render the TraceBack React app instead of the default Vite starter template.
  - Fixed a Swagger OpenAPI configuration issue to correctly document multipart endpoints and query filters.
  - Remaining report/image API tests intentionally left pending for the next lab session.
  - No Milestone 3 implementation started.
- Added `RUNNING_LOCALLY.md`, `API_TESTING.md`, Postman collection, and configured Swagger UI for API documentation and manual local testing.
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
