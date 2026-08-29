# TraceBack

A Full-Stack Lost & Found Management System with Real-Time Communication.

## Overview

TraceBack is a centralized web platform for educational campuses that allows users to report lost items, discover found items, match items intelligently, communicate in real-time, claim, verify, and close cases.

## Core Features

- **User Roles**: Student, Security, Admin.
- **Lost & Found Reporting**: Detailed forms for lost and found items.
- **Intelligent Matching**: This system matches missing university items using an exact deterministic algorithm based on category, location, and dates.

## 🚀 Getting Started

To run the application locally, test APIs, or view the documentation, please refer to the following guides:

- **[Running Locally](RUNNING_LOCALLY.md)**: Full setup instructions for the database, backend, and frontend.
- **[API Testing Guide](API_TESTING.md)**: How to use Postman, Insomnia, or Swagger to test the REST endpoints.
- **Swagger UI**: Accessible locally at `http://localhost:8080/swagger-ui/index.html` (once the backend is running).
- **Postman Collection**: Import `postman/TraceBack.postman_collection.json` into Postman to test APIs.

## 📦 Project Structure

- **Real-Time Communication**: WebSocket-based chat between users for potential matches.
- **Claim & Verification**: Secure process for claiming found items with verification questions.
- **Admin Dashboard**: Comprehensive management of users, items, claims, and statistics.

## Technology Stack

- **Frontend**: React, JavaScript/TypeScript, HTML5, CSS3, React Router, Axios
- **Backend**: Spring Boot, Spring Security, Spring Data JPA, REST API, WebSocket/STOMP
- **Database**: MySQL
- **Other**: Postman (Testing), Git/GitHub (Version Control)

## Architecture

Three-tier enterprise application architecture:

1. **Presentation Layer**: React SPA
2. **Application Layer**: Spring Boot REST APIs & WebSocket Services
3. **Data Layer**: MySQL Database

## Getting Started

*(Setup instructions will be added in later phases once the codebase is initialized)*

## Project Phases

- **Phase 1**: Planning & Requirements (Current)
- **Phase 2**: System Design
- **Phase 3**: UI/UX Design
- **Phase 4**: Database + API Design
- **Phase 5**: Frontend Development
- **Phase 6**: Backend Development
- **Phase 7**: Real-Time Communication
- **Phase 8**: Integration
- **Phase 9**: Testing
- **Phase 10**: Deployment
- **Phase 11**: Documentation + Demo
