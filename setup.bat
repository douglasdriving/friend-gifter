@echo off
echo.
echo 🚀 Friend Gifting MVP - Automated Setup Script
echo ================================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo ✓ Docker is running
echo.

REM Start PostgreSQL container
echo 📦 Starting PostgreSQL container...
docker run --name friend-gifting-db -e POSTGRES_PASSWORD=friendgifting2024 -e POSTGRES_DB=friend_gifting -p 5432:5432 -d postgres:15 >nul 2>&1

if errorlevel 1 (
    echo ⚠️  Container already exists, starting it...
    docker start friend-gifting-db >nul 2>&1
    echo ✓ PostgreSQL container started
) else (
    echo ✓ PostgreSQL container started
)

echo.
echo ⏳ Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak >nul

REM Create .env file
echo 📝 Creating .env file...
(
echo DATABASE_URL="postgresql://postgres:friendgifting2024@localhost:5432/friend_gifting?schema=public"
echo JWT_SECRET="super-secret-jwt-key-for-friend-gifting-app-2024"
echo PORT=3000
) > packages\server\.env

echo ✓ .env file created
echo.

REM Run Prisma migrations
echo 🗄️  Running database migrations...
cd packages\server
call pnpm prisma migrate dev --name init

echo.
echo 🌱 Seeding database with test users...
call pnpm prisma db seed

cd ..\..

echo.
echo ✅ Setup complete!
echo.
echo ================================================
echo 📋 Next Steps:
echo ================================================
echo.
echo 1. Start the backend:
echo    cd packages\server
echo    pnpm dev
echo.
echo 2. In a NEW terminal, start the frontend:
echo    cd packages\web
echo    pnpm dev
echo.
echo 3. Open http://localhost:5173 in your browser
echo.
echo ================================================
echo 🔑 Test Users (all passwords: Password123^)
echo ================================================
echo    • emma@example.com
echo    • marcus@example.com
echo    • aisha@example.com
echo.
echo ================================================
echo 🛑 To stop everything later:
echo ================================================
echo    docker stop friend-gifting-db
echo.
pause
