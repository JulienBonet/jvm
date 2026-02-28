import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload un buffer vers Cloudinary
 * @param {Buffer} buffer
 * @param {string} folder - ex: jvm/artists
 * @param {string} prefix - ex: artist | label | release
 */
export const uploadBufferToCloudinary = ({ buffer, folder, prefix }) => {
  return new Promise((resolve, reject) => {
    const randomString = Math.random().toString(36).substring(2, 8);
    const publicId = `${prefix}_${randomString}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        transformation: [
          {
            width: 500,
            height: 500,
            crop: 'fill',
            gravity: 'auto',
          },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.public_id.split('/').pop());
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * Supprime une image Cloudinary
 */
export const deleteFromCloudinary = async ({ folder, filename }) => {
  if (!filename || filename.startsWith('00_')) return;

  const publicId = `${folder}/${filename}`;
  await cloudinary.uploader.destroy(publicId);
};
