# Friend Gifting App

A sharing economy platform that enables friends to easily share unused items and coordinate exchanges within a trusted network.

## Features

- 🎁 **List Items**: Share items you're willing to give away
- 🔍 **Browse**: Discover what your friends have available
- ✨ **Wish Lists**: Let friends know what you need
- 👥 **Friend Network**: Connect with trusted friends only
- 📱 **Progressive Web App**: Works on any device
- 🔒 **Privacy First**: Friend-only visibility, no public exposure

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Architecture**: Monorepo with pnpm workspaces

## Prerequisites

- Node.js 20.x or higher
- pnpm 8.x or higher
- PostgreSQL 15.x or higher

## Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up PostgreSQL

```bash
# macOS
brew install postgresql@15
brew services start postgresql@15
createdb friend_gifting_dev

# Linux
sudo apt-get install postgresql-15
sudo systemctl start postgresql
sudo -u postgres createdb friend_gifting_dev
```

### 3. Configure environment variables

Create `packages/server/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/friend_gifting_dev"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
CLIENT_URL="http://localhost:5173"
MAX_FILE_SIZE=5242880
```

Create `packages/client/.env`:

```env
VITE_API_URL="http://localhost:3000/api/v1"
```

### 4. Run database migrations

```bash
cd packages/server
pnpm prisma migrate dev
```

### 5. Start development servers

```bash
# From root directory
pnpm dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/v1

## Project Structure

```
friend-gifting/
├── packages/
│   ├── client/          # React frontend (PWA)
│   ├── server/          # Express backend (API)
│   └── shared/          # Shared TypeScript types
├── .vibe/               # Project documentation
│   ├── idea.md
│   ├── design-spec.md
│   └── technical-spec.md
└── pnpm-workspace.yaml  # Monorepo configuration
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Start all dev servers
pnpm dev

# Run linters
pnpm lint

# Format code
pnpm format

# Run tests
pnpm test

# Build for production
pnpm build

# Clean build artifacts
pnpm clean
```

## Backend Commands

```bash
cd packages/server

# Start dev server
pnpm dev

# Run Prisma Studio (DB GUI)
pnpm prisma studio

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Seed database
pnpm prisma db seed
```

## Frontend Commands

```bash
cd packages/client

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Documentation

- [Idea Document](.vibe/idea.md) - Project concept and vision
- [Design Specification](.vibe/design-spec.md) - MVP features and user flows
- [Technical Specification](.vibe/technical-spec.md) - Architecture and implementation details

## Support

For questions or issues, please open a GitHub issue.

---

Made with ❤️ for sustainable sharing and community building
