import prisma from '../utils/prisma';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import type { CreateItemDto, UpdateItemDto } from '@friend-gifting/shared';
import { uploadService } from './upload.service';

export const itemsService = {
  /**
   * Get all items from friends (feed)
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

    // Get items from friends
    const items = await prisma.item.findMany({
      where: {
        userId: { in: friendIds },
        isGifted: false,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        photos: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return items;
  },

  /**
   * Get user's own items
   */
  async getMyItems(userId: string) {
    const items = await prisma.item.findMany({
      where: { userId },
      include: {
        photos: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return items;
  },

  /**
   * Get item by ID
   */
  async getById(itemId: string, requesterId: string) {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        photos: true,
      },
    });

    if (!item) {
      throw new NotFoundError('Item not found');
    }

    // Check if requester can view this item
    if (item.userId !== requesterId) {
      // Check if they are friends
      const areFriends = await prisma.friendship.findFirst({
        where: {
          OR: [
            {
              requesterId: requesterId,
              addresseeId: item.userId,
              status: 'ACCEPTED',
            },
            {
              requesterId: item.userId,
              addresseeId: requesterId,
              status: 'ACCEPTED',
            },
          ],
        },
      });

      if (!areFriends) {
        throw new ForbiddenError('You can only view items from friends');
      }
    }

    return item;
  },

  /**
   * Create new item
   */
  async create(userId: string, data: CreateItemDto) {
    const item = await prisma.item.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        category: data.category,
        condition: data.condition,
      },
      include: {
        photos: true,
      },
    });

    return item;
  },

  /**
   * Update item
   */
  async update(itemId: string, userId: string, data: UpdateItemDto) {
    // Check if item exists and belongs to user
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundError('Item not found');
    }

    if (item.userId !== userId) {
      throw new ForbiddenError('You can only update your own items');
    }

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.category && { category: data.category }),
        ...(data.condition && { condition: data.condition }),
        ...(data.isGifted !== undefined && { isGifted: data.isGifted }),
      },
      include: {
        photos: true,
      },
    });

    return updatedItem;
  },

  /**
   * Mark item as gifted
   */
  async markAsGifted(itemId: string, userId: string) {
    return this.update(itemId, userId, { isGifted: true });
  },

  /**
   * Delete item
   */
  async delete(itemId: string, userId: string) {
    // Check if item exists and belongs to user
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundError('Item not found');
    }

    if (item.userId !== userId) {
      throw new ForbiddenError('You can only delete your own items');
    }

    // Delete associated photos
    const photos = await prisma.itemPhoto.findMany({
      where: { itemId },
    });

    for (const photo of photos) {
      await uploadService.deleteImage(photo.filename);
    }

    await prisma.item.delete({
      where: { id: itemId },
    });

    return { message: 'Item deleted successfully' };
  },

  /**
   * Upload photos for an item
   */
  async uploadPhotos(itemId: string, userId: string, files: Express.Multer.File[]) {
    // Check if item exists and belongs to user
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { photos: true },
    });

    if (!item) {
      throw new NotFoundError('Item not found');
    }

    if (item.userId !== userId) {
      throw new ForbiddenError('You can only upload photos for your own items');
    }

    // Limit total photos to 5
    if (item.photos.length + files.length > 5) {
      throw new BadRequestError('Maximum 5 photos per item');
    }

    // Process and save each photo
    const photoPromises = files.map(async (file, index) => {
      const filename = await uploadService.processImage(file);
      return prisma.itemPhoto.create({
        data: {
          itemId,
          filename,
          order: item.photos.length + index,
        },
      });
    });

    const photos = await Promise.all(photoPromises);
    return photos;
  },

  /**
   * Delete a photo
   */
  async deletePhoto(photoId: string, userId: string) {
    const photo = await prisma.itemPhoto.findUnique({
      where: { id: photoId },
      include: { item: true },
    });

    if (!photo) {
      throw new NotFoundError('Photo not found');
    }

    if (photo.item.userId !== userId) {
      throw new ForbiddenError('You can only delete photos from your own items');
    }

    // Delete file from filesystem
    await uploadService.deleteImage(photo.filename);

    // Delete from database
    await prisma.itemPhoto.delete({
      where: { id: photoId },
    });

    return { message: 'Photo deleted successfully' };
  },
};
