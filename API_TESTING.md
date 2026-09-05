# API Testing Guide

This document describes how to test the APIs built in Milestone 1 and Milestone 2. 
You can test these using Swagger UI, Postman, or Insomnia.

## 1. Authentication Endpoints

### Register
`POST /api/auth/register`
Creates a new STUDENT account.
- **Body** (JSON):
  ```json
  {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "securepassword"
  }
  ```
- **Expected Status**: `201 Created`
- **Error Cases**: `409 Conflict` (if email exists)

### Login
`POST /api/auth/login`
Logs in a user and returns a JWT token.
- **Body** (JSON):
  ```json
  {
      "email": "jane@example.com",
      "password": "securepassword"
  }
  ```
- **Expected Status**: `200 OK`
- **Response**: Contains the `token`. You must use this token in the `Authorization` header for all protected requests as `Bearer <token>`.

## 2. Report Endpoints (Milestone 2)

All of these endpoints require the `Authorization: Bearer <token>` header.

### Create Lost Report
`POST /api/reports/lost`
- **Role Required**: STUDENT
- **Type**: `multipart/form-data`
- **Fields**:
  - `category` (text)
  - `name` (text)
  - `description` (text, optional)
  - `color` (text, optional)
  - `brand` (text, optional)
  - `location` (text, optional)
  - `dateLost` (date string, e.g., "2024-03-15", optional)
  - `image` (file, JPG/PNG, max 10MB)
- **Expected Status**: `201 Created`
- **Invalid PDF Test**: Try uploading a PDF file for `image`. Expect `400 Bad Request`.
- **Size Limit Test**: Try uploading a >10MB file for `image`. Expect `400 Bad Request` or `413 Payload Too Large`.

### Create Found Report
`POST /api/reports/found`
- **Role Required**: STUDENT or SECURITY
- **Type**: `multipart/form-data`
- **Fields**: Same as above, but uses `dateFound` instead of `dateLost`.
- **Expected Status**: `201 Created`

### Get My Reports
`GET /api/reports/my?type=LOST` (or `type=FOUND`)
- **Role Required**: STUDENT
- Returns reports belonging only to the authenticated user.
- **Expected Status**: `200 OK`

### Get All Reports
`GET /api/reports?type=LOST` (or `type=FOUND`)
- **Expected Status**: `200 OK`

### Get Report Details
`GET /api/reports/lost/{id}`
`GET /api/reports/found/{id}`
- **Expected Status**: `200 OK`

## 3. Insomnia Setup
All REST endpoints mentioned above can be easily imported or tested manually in Insomnia.
1. Create a new HTTP Request in Insomnia.
2. Use the base URL: `http://localhost:8080`.
3. After logging in, go to the **Auth** tab in Insomnia for protected requests, select **Bearer Token**, and paste your JWT token.
4. For report creation, set the Body type to **Multipart Form**, and ensure the file field is named `image` and configured as a File.

## 4. Manual Testing Progress

### Passed Tests (Verified via Swagger UI)
- [x] `POST /api/auth/register`: Successful 200 response; Student account created in live MySQL.
- [x] `POST /api/auth/login`: Successful 200 response; JWT successfully returned.
- [x] Swagger Bearer Authorization: JWT successfully accepted by Swagger.
- [x] `GET /api/reports/my`: Successful 200 response (Returned an empty list before any reports existed, now correctly returns unified list of both).
- [x] MySQL connectivity: Spring Boot successfully connected to live MySQL; Hikari connection established; Registration caused a real INSERT into MySQL.
- [x] Swagger Documentation: Multipart upload UI correctly visible with a real "Choose File" control for report images.
- [x] Successful Lost Report upload with a real JPG/PNG through Swagger (`POST /api/reports/lost`)
- [x] Successful Found Report upload with a real JPG/PNG through Swagger (`POST /api/reports/found`)
- [x] Verification of physical files inside `backend/uploads/`
- [x] Verification of `ITEM.image_url` in MySQL
- [x] `GET /api/reports` after creating reports (`GET /api/reports?type=LOST` and `GET /api/reports?type=FOUND`)
- [x] `GET /api/reports/lost/{id}`
- [x] `GET /api/reports/found/{id}`
- [x] `GET /api/reports/my` with LOST filter, FOUND filter, and no filter after creating reports
- [x] Invalid PDF upload rejection (`400 Bad Request`)
- [x] Oversized image rejection (`413 Payload Too Large`)
- [x] Unauthorized endpoint testing (`401 Unauthorized`)
- [x] Frontend end-to-end report submission (Student Dashboard correctly displays reports)

### Pending Tests (Not yet verified)
*(All Milestone 2 tests have been successfully verified manually)*
