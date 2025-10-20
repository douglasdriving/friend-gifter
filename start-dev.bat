@echo off
echo.
echo 🚀 Starting Friend Gifting Development Servers...
echo.

REM Kill any existing servers on ports 3000 and 5173
echo 🧹 Cleaning up old processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo.

REM Start backend in new window
start "Friend Gifting - Backend" cmd /k "cd packages\server && pnpm dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
start "Friend Gifting - Frontend" cmd /k "cd packages\web && pnpm dev"

echo.
echo ✅ Servers starting in new windows...
echo.
echo Database: PostgreSQL on localhost:5432 (runs as Windows service)
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window (servers will keep running)
pause >nul
