# Testing Guide

This document describes the automated testing setup for the Friend Gifting application.

## Overview

The project uses **Vitest** as the test runner with **Supertest** for API endpoint testing. Tests are organized into:

- **Integration Tests**: Test complete API endpoints with database interactions
- **Unit Tests**: Test individual services and utilities (via integration tests)

## Test Stack

- **Vitest**: Fast unit test framework with native TypeScript support
- **Supertest**: HTTP assertion library for testing Express endpoints
- **Prisma**: Database ORM with test database isolation

## Setup

### Prerequisites

1. PostgreSQL running (via Docker or local)
2. Test database created:

```bash
# Using Docker
docker exec -it postgres-friend-gifting psql -U postgres -c "CREATE DATABASE friend_gifting_test;"

# Or using local PostgreSQL
psql -U postgres -c "CREATE DATABASE friend_gifting_test;"
```

### Environment Configuration

Tests use `.env.test` file in `packages/server/`:

```env
NODE_ENV=test
DATABASE_URL="postgresql://postgres:friendgifting2024@localhost:5432/friend_gifting_test?schema=public"
JWT_SECRET=test-secret-key-for-testing-only
```

### Running Migrations

Before running tests, apply Prisma migrations to the test database:

```bash
cd packages/server
DATABASE_URL="postgresql://postgres:friendgifting2024@localhost:5432/friend_gifting_test?schema=public" pnpm prisma migrate deploy
```

## Running Tests

### All Tests

```bash
cd packages/server
pnpm test
```

### Watch Mode (Re-run on Changes)

```bash
pnpm test:watch
```

### Coverage Report

```bash
pnpm test:coverage
```

Coverage reports are generated in `packages/server/coverage/`.

## Test Structure

### Directory Layout

```
packages/server/src/tests/
├── setup.ts              # Test environment setup
├── helpers.ts            # Test utilities and factories
├── auth.test.ts          # Authentication API tests
├── items.test.ts         # Items API tests
├── friends.test.ts       # Friends API tests
└── wishes.test.ts        # Wishes API tests (to be added)
```

### Test Helpers

The `helpers.ts` file provides utilities for creating test data:

```typescript
import { createTestUser, createFriendship, createTestItem } from './helpers';

// Create users
const user1 = await createTestUser({ username: 'alice' });
const user2 = await createTestUser({ username: 'bob' });

// Create friendship
await createFriendship(user1.id, user2.id);

// Create test item
const item = await createTestItem(user1.id, { title: 'Test Book' });
```

## Writing Tests

### Example Integration Test

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index';
import { createTestUser, getAuthHeader } from './helpers';
import { generateToken } from '../utils/jwt';

describe('Items API', () => {
  let userToken: string;
  let userId: string;

  beforeEach(async () => {
    const user = await createTestUser({ username: 'testuser' });
    userId = user.id;
    userToken = generateToken({ userId: user.id });
  });

  describe('POST /api/v1/items', () => {
    it('should create a new item', async () => {
      const response = await request(app)
        .post('/api/v1/items')
        .set(getAuthHeader(userToken))
        .send({
          title: 'Test Book',
          category: 'Books',
          condition: 'GOOD',
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: 'Test Book',
        userId,
      });
    });
  });
});
```

## Test Coverage

### Current Coverage (Phase 9)

- ✅ **Auth API**: Registration, Login
- ✅ **Items API**: CRUD operations, friend-gating, photo upload
- ✅ **Friends API**: Search, requests, accept/decline, remove
- ⏳ **Wishes API**: CRUD operations (similar to items)
- ⏳ **Upload Service**: Image processing
- ⏳ **Error Handling**: Custom errors, middleware

### Tested Features

1. **Authentication**
   - User registration with validation
   - Login with credentials
   - Duplicate username/email rejection
   - Invalid credentials rejection

2. **Items**
   - Create, read, update, delete operations
   - Friend-gating (only friends can view)
   - My items listing
   - Mark as gifted
   - Owner-only modifications

3. **Friends**
   - User search
   - Friend request workflow
   - Accept/decline requests
   - View friends list
   - Remove friends

## Database Cleanup

Tests automatically clean up the database after each test using `afterEach` hooks in `setup.ts`:

```typescript
afterEach(async () => {
  await prisma.itemPhoto.deleteMany();
  await prisma.wishPhoto.deleteMany();
  await prisma.item.deleteMany();
  await prisma.wish.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.user.deleteMany();
});
```

This ensures test isolation and prevents data leakage between tests.

## Troubleshooting

### Tests Fail to Connect to Database

- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env.test`
- Ensure test database exists

```bash
docker exec -it postgres-friend-gifting psql -U postgres -l
```

### Prisma Client Errors

Regenerate Prisma client:

```bash
cd packages/server
pnpm prisma generate
```

### Rate Limiting Issues

The `.env.test` file has higher rate limits for testing. If you still hit limits, increase them further.

### Port Conflicts

If the test server can't start, ensure port 3001 is available or change `PORT` in `.env.test`.

## Best Practices

1. **Test Isolation**: Each test should be independent and not rely on other tests
2. **Cleanup**: Use `afterEach` to clean up test data
3. **Factories**: Use helper functions to create test data consistently
4. **Descriptive Names**: Test names should clearly describe what they test
5. **Arrange-Act-Assert**: Structure tests with setup, action, and verification
6. **Edge Cases**: Test both happy paths and error cases

## CI/CD Integration

To run tests in CI pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: |
    docker-compose up -d postgres
    cd packages/server
    DATABASE_URL="postgresql://postgres:friendgifting2024@localhost:5432/friend_gifting_test" pnpm prisma migrate deploy
    pnpm test
```

## Next Steps

- Add wishes API tests (similar pattern to items)
- Add upload service unit tests
- Add frontend component tests with React Testing Library
- Add E2E tests with Playwright
- Set up CI/CD test automation
