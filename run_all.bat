@echo off
title TraceBack Application Launcher
echo ========================================================
echo          Starting TraceBack Backend & Frontend         
echo ========================================================
echo.

set SCRIPT_DIR=%~dp0

echo Starting Spring Boot Backend...
start "TraceBack Backend (Spring Boot)" cmd /k "cd /d %SCRIPT_DIR%backend && mvnw.cmd spring-boot:run"

echo Starting React Frontend (Vite)...
start "TraceBack Frontend (Vite)" cmd /k "cd /d %SCRIPT_DIR%frontend && npm run dev"

echo.
echo Both servers are starting up in separate windows!
echo.
echo   App ^& Dev Endpoints:
echo    - Frontend UI:        http://localhost:5173
echo    - Backend Base:       http://localhost:8080
echo    - API Base URL:       http://localhost:8080/api
echo.
echo   API Documentation ^& Testing:
echo    - Swagger UI:         http://localhost:8080/swagger-ui/index.html
echo    - OpenAPI Docs JSON:  http://localhost:8080/v3/api-docs
echo    - Uploaded Files:     http://localhost:8080/uploads/
echo.
echo Press any key to close this launcher window...
pause >nul
