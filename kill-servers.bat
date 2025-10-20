@echo off
echo.
echo 🛑 Killing development servers...
echo.

REM Kill processes on port 3000 (backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing backend process on port 3000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

REM Kill processes on port 5173 (frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    echo Killing frontend process on port 5173 (PID: %%a)
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ✅ Servers killed
echo.
pause
