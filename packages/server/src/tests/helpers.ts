import prisma from '../utils/prisma';
import { hashPassword } from '../utils/password';
import type { User } from '@prisma/client';

/**
 * Create a test user
 */
export async function createTestUser(
  data: Partial<User> & { password?: string } = {}
): Promise<User> {
  const hashedPassword = await hashPassword(data.password || 'password123');

  return prisma.user.create({
    data: {
      username: data.username || `testuser_${Date.now()}`,
      email: data.email || `test_${Date.now()}@example.com`,
      name: data.name || 'Test User',
      password: hashedPassword,
    },
  });
}

/**
 * Create a friendship between two users
 */
export async function createFriendship(userId1: string, userId2: string) {
  return prisma.friendship.create({
    data: {
      requesterId: userId1,
      addresseeId: userId2,
      status: 'ACCEPTED',
    },
  });
}

/**
 * Create a test item
 */
export async function createTestItem(
  userId: string,
  data: {
    title?: string;
    description?: string;
    category?: string;
    condition?: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';
    isGifted?: boolean;
  } = {}
) {
  return prisma.item.create({
    data: {
      userId,
      title: data.title || 'Test Item',
      description: data.description || 'Test description',
      category: data.category || 'Books',
      condition: data.condition || 'GOOD',
      isGifted: data.isGifted || false,
    },
  });
}

/**
 * Create a test wish
 */
export async function createTestWish(
  userId: string,
  data: {
    title?: string;
    description?: string;
    category?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    isFulfilled?: boolean;
  } = {}
) {
  return prisma.wish.create({
    data: {
      userId,
      title: data.title || 'Test Wish',
      description: data.description || 'Test description',
      category: data.category || 'Books',
      priority: data.priority || 'MEDIUM',
      isFulfilled: data.isFulfilled || false,
    },
  });
}

/**
 * Get auth token for a user
 */
export function getAuthHeader(token: string): { Authorization: string } {
  return {
    Authorization: `Bearer ${token}`,
  };
}
