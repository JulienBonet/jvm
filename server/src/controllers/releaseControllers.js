import { db } from '../../db/connection.js';
import * as releaseModels from '../models/releaseModels.js';
import * as releaseCreateModels from '../models/releaseCreateModels.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { CLOUDINARY_FOLDERS } from '../config/cloudinaryFolders.js';

export const getAllReleases = async (req, res, next) => {
  try {
    const releases = await releaseModels.findAllReleases();
    res.json(releases);
  } catch (err) {
    next(err);
  }
};

export const getReleaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const release = await releaseModels.findReleaseById(id);

    if (!release) return res.status(404).json({ message: 'Release not found' });

    res.json(release);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =========================
   CREATE
========================= */

export const createRelease = async (req, res) => {
  const connection = await db.getConnection();

  let uploadedFilename = null;

  try {
    const file = req.file;
    const payload = req.body;

    await connection.beginTransaction();

    let finalImage = '00_release_default';

    // 1️⃣ Upload image locale
    if (file) {
      uploadedFilename = await uploadBufferToCloudinary({
        buffer: file.buffer,
        folder: CLOUDINARY_FOLDERS.RELEASE,
        prefix: 'release',
      });

      finalImage = uploadedFilename;
    }

    // 2️⃣ Upload image Discogs
    else if (payload.discogs_image_url) {
      const response = await fetch(payload.discogs_image_url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      uploadedFilename = await uploadBufferToCloudinary({
        buffer,
        folder: CLOUDINARY_FOLDERS.RELEASE,
        prefix: 'release',
      });

      finalImage = uploadedFilename;
    }

    // inject image dans payload
    payload.image_filename = finalImage;
    payload.thumbnail_url = payload.discogs_image_url || null;

    const newRelease = await releaseCreateModels.addRelease(payload, connection);

    await connection.commit();

    res.status(201).json(newRelease);
  } catch (error) {
    await connection.rollback();

    // rollback cloudinary
    if (uploadedFilename) {
      await deleteFromCloudinary({
        folder: CLOUDINARY_FOLDERS.RELEASE,
        filename: uploadedFilename,
      });
    }

    console.error(error);
    res.status(500).json({ message: 'Error creating release' });
  } finally {
    connection.release();
  }
};
