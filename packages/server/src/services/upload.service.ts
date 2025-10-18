import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import config from '../config';
import { cloudinaryService } from './cloudinary.service';
import logger from '../utils/logger';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Image sizes
const SIZES = {
  thumbnail: { width: 200, height: 200 },
  medium: { width: 800, height: 800 },
  large: { width: 1200, height: 1200 },
};

export const uploadService = {
  /**
   * Initialize upload directory
   */
  async init() {
    try {
      await fs.access(UPLOAD_DIR);
    } catch {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
  },

  /**
   * Validate uploaded file
   */
  validateFile(file: Express.Multer.File): void {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File too large. Maximum size is 5MB.');
    }
  },

  /**
   * Process and save image (Cloudinary or local based on config)
   */
  async processImage(file: Express.Multer.File): Promise<string> {
    this.validateFile(file);

    if (config.useCloudinary) {
      // Upload to Cloudinary
      logger.info('Uploading image to Cloudinary...');
      const result = await cloudinaryService.uploadImage(file.buffer, 'items');
      return result.url; // Return full URL for Cloudinary
    } else {
      // Local storage
      const filename = `${uuidv4()}.webp`;
      const filepath = path.join(UPLOAD_DIR, filename);

      // Process image with Sharp
      // Convert to WebP and resize
      await sharp(file.buffer)
        .resize(SIZES.large.width, SIZES.large.height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toFile(filepath);

      // Create thumbnail
      const thumbnailFilename = `thumb_${filename}`;
      const thumbnailPath = path.join(UPLOAD_DIR, thumbnailFilename);

      await sharp(file.buffer)
        .resize(SIZES.thumbnail.width, SIZES.thumbnail.height, {
          fit: 'cover',
        })
        .webp({ quality: 80 })
        .toFile(thumbnailPath);

      return filename; // Return filename only for local storage
    }
  },

  /**
   * Delete image (Cloudinary or local based on filename format)
   */
  async deleteImage(filename: string): Promise<void> {
    try {
      if (config.useCloudinary || filename.startsWith('http')) {
        // Cloudinary: extract public_id from URL
        // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123456/folder/filename.webp
        const matches = filename.match(/friend-gifting\/[^/]+\/[^.]+/);
        if (matches) {
          const publicId = matches[0];
          await cloudinaryService.deleteImage(publicId);
          logger.info(`Deleted image from Cloudinary: ${publicId}`);
        } else {
          logger.warn(`Could not extract public_id from Cloudinary URL: ${filename}`);
        }
      } else {
        // Local storage
        const filepath = path.join(UPLOAD_DIR, filename);
        await fs.unlink(filepath);

        // Also delete thumbnail
        const thumbnailPath = path.join(UPLOAD_DIR, `thumb_${filename}`);
        try {
          await fs.unlink(thumbnailPath);
        } catch {
          // Thumbnail might not exist, ignore error
        }
        logger.info(`Deleted local image: ${filename}`);
      }
    } catch (error) {
      logger.error('Error deleting image:', error);
      // Don't throw error, just log it
    }
  },

  /**
   * Get image path
   */
  getImagePath(filename: string): string {
    return path.join(UPLOAD_DIR, filename);
  },

  /**
   * Get thumbnail path
   */
  getThumbnailPath(filename: string): string {
    return path.join(UPLOAD_DIR, `thumb_${filename}`);
  },
};
