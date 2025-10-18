#!/bin/bash

echo "🚀 Friend Gifting MVP - Automated Setup Script"
echo "================================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker Desktop first."
  exit 1
fi

echo "✓ Docker is running"
echo ""

# Start PostgreSQL container
echo "📦 Starting PostgreSQL container..."
docker run --name friend-gifting-db \
  -e POSTGRES_PASSWORD=friendgifting2024 \
  -e POSTGRES_DB=friend_gifting \
  -p 5432:5432 \
  -d postgres:15 2>/dev/null

if [ $? -eq 0 ]; then
  echo "✓ PostgreSQL container started"
else
  echo "⚠️  Container already exists, starting it..."
  docker start friend-gifting-db
  echo "✓ PostgreSQL container started"
fi

echo ""
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Create .env file in server
echo "📝 Creating .env file..."
cat > packages/server/.env << EOF
DATABASE_URL="postgresql://postgres:friendgifting2024@localhost:5432/friend_gifting?schema=public"
JWT_SECRET="super-secret-jwt-key-for-friend-gifting-app-2024"
PORT=3000
EOF

echo "✓ .env file created"
echo ""

# Run Prisma migrations
echo "🗄️  Running database migrations..."
cd packages/server
pnpm prisma migrate dev --name init

echo ""
echo "🌱 Seeding database with test users..."
pnpm prisma db seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "================================================"
echo "📋 Next Steps:"
echo "================================================"
echo ""
echo "1. Start the backend:"
echo "   cd packages/server"
echo "   pnpm dev"
echo ""
echo "2. In a NEW terminal, start the frontend:"
echo "   cd packages/web"
echo "   pnpm dev"
echo ""
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "================================================"
echo "🔑 Test Users (all passwords: Password123)"
echo "================================================"
echo "   • emma@example.com"
echo "   • marcus@example.com"
echo "   • aisha@example.com"
echo ""
echo "================================================"
echo "🛑 To stop everything later:"
echo "================================================"
echo "   docker stop friend-gifting-db"
echo ""
