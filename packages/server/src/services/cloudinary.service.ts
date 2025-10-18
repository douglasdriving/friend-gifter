import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import config from '../config';
import logger from '../utils/logger';

// Configure Cloudinary
if (config.useCloudinary) {
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  });

  logger.info('Cloudinary configured for image storage');
}

export const cloudinaryService = {
  /**
   * Upload image to Cloudinary
   */
  async uploadImage(
    fileBuffer: Buffer,
    folder: string = 'items'
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `friend-gifting/${folder}`,
          resource_type: 'image',
          format: 'webp',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto:good' },
          ],
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            logger.error('Cloudinary upload error:', error);
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          } else {
            reject(new Error('Upload failed: no result returned'));
          }
        }
      );

      uploadStream.end(fileBuffer);
    });
  },

  /**
   * Upload thumbnail image to Cloudinary
   */
  async uploadThumbnail(
    fileBuffer: Buffer,
    folder: string = 'items'
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `friend-gifting/${folder}/thumbnails`,
          resource_type: 'image',
          format: 'webp',
          transformation: [
            { width: 200, height: 200, crop: 'fill', gravity: 'auto' },
            { quality: 'auto:good' },
          ],
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error) {
            logger.error('Cloudinary thumbnail upload error:', error);
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          } else {
            reject(new Error('Thumbnail upload failed: no result returned'));
          }
        }
      );

      uploadStream.end(fileBuffer);
    });
  },

  /**
   * Delete image from Cloudinary
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
      logger.info(`Deleted image from Cloudinary: ${publicId}`);
    } catch (error) {
      logger.error('Cloudinary delete error:', error);
      throw error;
    }
  },

  /**
   * Delete multiple images from Cloudinary
   */
  async deleteImages(publicIds: string[]): Promise<void> {
    try {
      await cloudinary.api.delete_resources(publicIds);
      logger.info(`Deleted ${publicIds.length} images from Cloudinary`);
    } catch (error) {
      logger.error('Cloudinary bulk delete error:', error);
      throw error;
    }
  },
};
