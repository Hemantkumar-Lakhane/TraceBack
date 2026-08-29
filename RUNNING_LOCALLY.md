# Running TraceBack Locally

This document describes how to set up, run, and verify the TraceBack application locally from a clean workspace.

## Prerequisites

- **Java/JDK**: Java 17
- **Maven**: Included via Maven Wrapper (`mvnw`)
- **Node.js**: v18 or newer
- **npm**: v9 or newer
- **MySQL**: 8.0+
- **Git**

## 1. Database Setup

1. Start your local MySQL 8 instance.
2. Create a database named `traceback`:
   ```sql
   CREATE DATABASE traceback;
   ```
3. The database schema is already the source of truth and has been applied via `DATABASE_SCHEMA.sql`. No further manual schema updates are needed for now as Hibernate will validate it.

### Environment Variables
You must set the following environment variables (e.g. in your system, IDE, or a `.env` file):
- `DB_URL`: `jdbc:mysql://localhost:3306/traceback`
- `DB_USERNAME`: Your MySQL username (e.g. `root`)
- `DB_PASSWORD`: Your MySQL password
- `JWT_SECRET`: A 256-bit secure secret key string used to sign JWTs.

*(Never commit real passwords or secrets to source control. They are `.gitignore`d.)*

To verify the database, you can connect using a MySQL client and run `SHOW TABLES;` after starting the backend once to ensure JPA connects successfully.

## 2. Backend Setup & Running

The backend is a Spring Boot application running on Java 17.

### Enter Backend Directory
```bash
cd backend
```

### Run Tests
```bash
./mvnw clean test
# OR on Windows:
.\mvnw.cmd clean test
```

### Start Spring Boot
```bash
./mvnw spring-boot:run
# OR on Windows:
.\mvnw.cmd spring-boot:run
```

### Verify Backend Startup
Look for the following log lines in the terminal:
- `Tomcat started on port 8080 (http)`
- `Started TraceBackApplication in ... seconds`

**Backend URL/Port**: `http://localhost:8080`

## 3. Frontend Setup & Running

The frontend is a React application built with Vite.

### Enter Frontend Directory
```bash
cd frontend
```

### Install Dependencies
```bash
npm install
```

### Start Vite
```bash
npm run dev
```

### Identify Frontend URL
Look for the following log line in the terminal:
- `➜  Local:   http://localhost:5173/`

**Frontend URL**: `http://localhost:5173`

## 4. File Uploads

When an item is reported as lost or found, its image is saved to:
`backend/uploads/`

- Allowed Formats: JPG/JPEG and PNG
- Maximum Size limit: 10MB per file
- This `uploads/` directory is explicitly ignored by Git, meaning uploads won't be pushed to the repository. 
- You can access uploaded files dynamically via `http://localhost:8080/uploads/<filename>`.
