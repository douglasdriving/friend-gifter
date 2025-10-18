import { beforeAll, afterAll, afterEach } from 'vitest';
import prisma from '../utils/prisma';

// Setup test environment
beforeAll(async () => {
  // Ensure we're using the test database
  if (process.env.NODE_ENV !== 'test') {
    process.env.NODE_ENV = 'test';
    console.warn('Setting NODE_ENV to test');
  }
});

// Clean up after each test
afterEach(async () => {
  // Clear all tables in reverse order of dependencies
  await prisma.itemPhoto.deleteMany();
  await prisma.wishPhoto.deleteMany();
  await prisma.item.deleteMany();
  await prisma.wish.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.user.deleteMany();
});

// Cleanup after all tests
afterAll(async () => {
  await prisma.$disconnect();
});
