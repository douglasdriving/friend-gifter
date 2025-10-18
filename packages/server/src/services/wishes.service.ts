import prisma from '../utils/prisma';
import { NotFoundError, ForbiddenError } from '../utils/errors';
import type { CreateWishDto, UpdateWishDto } from '@friend-gifting/shared';

export const wishesService = {
  /**
   * Get all wishes from friends (feed)
   */
  async getFeed(userId: string) {
    // Get user's friends
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId, status: 'ACCEPTED' },
          { addresseeId: userId, status: 'ACCEPTED' },
        ],
      },
    });

    const friendIds = friendships.map((f) =>
      f.requesterId === userId ? f.addresseeId : f.requesterId
    );

    // Get wishes from friends
    const wishes = await prisma.wish.findMany({
      where: {
        userId: { in: friendIds },
        isFulfilled: false,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return wishes;
  },

  /**
   * Get user's own wishes
   */
  async getMyWishes(userId: string) {
    const wishes = await prisma.wish.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return wishes;
  },

  /**
   * Get wish by ID
   */
  async getById(wishId: string, requesterId: string) {
    const wish = await prisma.wish.findUnique({
      where: { id: wishId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    if (!wish) {
      throw new NotFoundError('Wish not found');
    }

    // Check if requester can view this wish
    if (wish.userId !== requesterId) {
      // Check if they are friends
      const areFriends = await prisma.friendship.findFirst({
        where: {
          OR: [
            {
              requesterId: requesterId,
              addresseeId: wish.userId,
              status: 'ACCEPTED',
            },
            {
              requesterId: wish.userId,
              addresseeId: requesterId,
              status: 'ACCEPTED',
            },
          ],
        },
      });

      if (!areFriends) {
        throw new ForbiddenError('You can only view wishes from friends');
      }
    }

    return wish;
  },

  /**
   * Create new wish
   */
  async create(userId: string, data: CreateWishDto) {
    const wish = await prisma.wish.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
      },
    });

    return wish;
  },

  /**
   * Update wish
   */
  async update(wishId: string, userId: string, data: UpdateWishDto) {
    // Check if wish exists and belongs to user
    const wish = await prisma.wish.findUnique({
      where: { id: wishId },
    });

    if (!wish) {
      throw new NotFoundError('Wish not found');
    }

    if (wish.userId !== userId) {
      throw new ForbiddenError('You can only update your own wishes');
    }

    const updatedWish = await prisma.wish.update({
      where: { id: wishId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category && { category: data.category }),
        ...(data.priority && { priority: data.priority }),
        ...(data.isFulfilled !== undefined && { isFulfilled: data.isFulfilled }),
      },
    });

    return updatedWish;
  },

  /**
   * Mark wish as fulfilled
   */
  async markAsFulfilled(wishId: string, userId: string) {
    return this.update(wishId, userId, { isFulfilled: true });
  },

  /**
   * Delete wish
   */
  async delete(wishId: string, userId: string) {
    // Check if wish exists and belongs to user
    const wish = await prisma.wish.findUnique({
      where: { id: wishId },
    });

    if (!wish) {
      throw new NotFoundError('Wish not found');
    }

    if (wish.userId !== userId) {
      throw new ForbiddenError('You can only delete your own wishes');
    }

    await prisma.wish.delete({
      where: { id: wishId },
    });

    return { message: 'Wish deleted successfully' };
  },
};
