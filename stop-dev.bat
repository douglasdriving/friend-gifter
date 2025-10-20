@echo off
echo.
echo 🛑 Stopping Friend Gifting Development Servers...
echo.

REM Stop database
echo 📦 Stopping PostgreSQL database...
docker-compose down
echo.

echo ✅ Database stopped
echo.
echo Note: Backend and Frontend processes need to be closed manually in their terminal windows
echo.
pause
