# TraceBack Application Launcher (PowerShell)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "         Starting TraceBack Backend & Frontend         " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Spring Boot Backend..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/k cd /d ""$ScriptDir\backend"" && mvnw.cmd spring-boot:run" -WorkingDirectory "$ScriptDir\backend"

Write-Host "Starting React Frontend (Vite)..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/k cd /d ""$ScriptDir\frontend"" && npm run dev" -WorkingDirectory "$ScriptDir\frontend"

Write-Host ""
Write-Host "Both servers are starting up in separate windows!" -ForegroundColor Yellow
Write-Host ""
Write-Host "  App & Dev Endpoints:" -ForegroundColor Cyan
Write-Host "   - Frontend UI:        http://localhost:5173" -ForegroundColor White
Write-Host "   - Backend Base:       http://localhost:8080" -ForegroundColor White
Write-Host "   - API Base URL:       http://localhost:8080/api" -ForegroundColor White
Write-Host ""
Write-Host "  API Documentation & Testing:" -ForegroundColor Cyan
Write-Host "   - Swagger UI:         http://localhost:8080/swagger-ui/index.html" -ForegroundColor White
Write-Host "   - OpenAPI Docs JSON:  http://localhost:8080/v3/api-docs" -ForegroundColor White
Write-Host "   - Uploaded Files:     http://localhost:8080/uploads/" -ForegroundColor White
Write-Host ""
