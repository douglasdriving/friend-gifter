import prisma from '../utils/prisma';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors';

export const friendsService = {
  /**
   * Search for users by username or name
   */
  async searchUsers(query: string, currentUserId: string) {
    // Get existing friendships (both accepted and pending)
    const existingFriendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: currentUserId },
          { addresseeId: currentUserId },
        ],
      },
      select: {
        requesterId: true,
        addresseeId: true,
      },
    });

    // Extract IDs of users who are already friends or have pending requests
    const excludedUserIds = existingFriendships.map((f) =>
      f.requesterId === currentUserId ? f.addresseeId : f.requesterId
    );

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUserId } }, // Exclude current user
          { id: { notIn: excludedUserIds } }, // Exclude existing friends and pending requests
          {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { name: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: {
        id: true,
        username: true,
        name: true,
        createdAt: true,
      },
      take: 20,
    });

    return users;
  },

  /**
   * Get all friends (accepted friendships)
   */
  async getFriends(userId: string) {
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId, status: 'ACCEPTED' },
          { addresseeId: userId, status: 'ACCEPTED' },
        ],
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        addressee: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    // Map to return friend data
    return friendships.map((f) => ({
      ...f,
      friend: f.requesterId === userId ? f.addressee : f.requester,
    }));
  },

  /**
   * Get pending friend requests (received)
   */
  async getPendingRequests(userId: string) {
    const requests = await prisma.friendship.findMany({
      where: {
        addresseeId: userId,
        status: 'PENDING',
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    return requests;
  },

  /**
   * Get sent friend requests
   */
  async getSentRequests(userId: string) {
    const requests = await prisma.friendship.findMany({
      where: {
        requesterId: userId,
        status: 'PENDING',
      },
      include: {
        addressee: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    return requests;
  },

  /**
   * Send friend request
   */
  async sendRequest(requesterId: string, addresseeId: string) {
    if (requesterId === addresseeId) {
      throw new BadRequestError('You cannot send a friend request to yourself');
    }

    // Check if addressee exists
    const addressee = await prisma.user.findUnique({
      where: { id: addresseeId },
    });

    if (!addressee) {
      throw new NotFoundError('User not found');
    }

    // Check if friendship already exists
    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId },
          { requesterId: addresseeId, addresseeId: requesterId },
        ],
      },
    });

    if (existing) {
      if (existing.status === 'ACCEPTED') {
        throw new BadRequestError('You are already friends');
      }
      if (existing.status === 'PENDING') {
        throw new BadRequestError('Friend request already sent');
      }
    }

    const friendship = await prisma.friendship.create({
      data: {
        requesterId,
        addresseeId,
        status: 'PENDING',
      },
      include: {
        addressee: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    return friendship;
  },

  /**
   * Accept friend request
   */
  async acceptRequest(friendshipId: string, userId: string) {
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new NotFoundError('Friend request not found');
    }

    if (friendship.addresseeId !== userId) {
      throw new ForbiddenError('You can only accept requests sent to you');
    }

    if (friendship.status !== 'PENDING') {
      throw new BadRequestError('This request is not pending');
    }

    const updated = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: 'ACCEPTED' },
      include: {
        requester: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    return updated;
  },

  /**
   * Decline/remove friend request
   */
  async declineRequest(friendshipId: string, userId: string) {
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new NotFoundError('Friend request not found');
    }

    // Can decline if you're the addressee or the requester
    if (friendship.addresseeId !== userId && friendship.requesterId !== userId) {
      throw new ForbiddenError('You can only decline your own requests');
    }

    await prisma.friendship.delete({
      where: { id: friendshipId },
    });

    return { message: 'Friend request declined' };
  },

  /**
   * Remove friend
   */
  async removeFriend(friendshipId: string, userId: string) {
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new NotFoundError('Friendship not found');
    }

    // Can remove if you're part of the friendship
    if (friendship.addresseeId !== userId && friendship.requesterId !== userId) {
      throw new ForbiddenError('You can only remove your own friendships');
    }

    await prisma.friendship.delete({
      where: { id: friendshipId },
    });

    return { message: 'Friend removed successfully' };
  },
};
