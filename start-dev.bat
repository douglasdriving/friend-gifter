@echo off
echo.
echo 🚀 Starting Friend Gifting Development Servers...
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
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window (servers will keep running)
pause >nul
