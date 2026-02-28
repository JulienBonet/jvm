import * as artistModels from '../models/artistModels.js';
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { CLOUDINARY_FOLDERS } from '../config/cloudinaryFolders.js';
import { db } from '../../db/connection.js';

/* =========================
   GET
========================= */
export const getAllArtists = async (req, res) => {
  try {
    const artists = await artistModels.findAllArtists();
    res.json(artists);
  } catch (error) {
    console.error('Erreur getAllArtists:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getAllReleasesByArtistId = async (req, res) => {
  const { id } = req.params;

  try {
    const releases = await artistModels.findAllReleasesByArtistId(id);
    res.json(releases);
  } catch (error) {
    console.error('getAllReleasesByArtistid:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getArtistById = async (req, res) => {
  const { id } = req.params;

  try {
    const artist = await artistModels.findArtistById(id);
    res.json(artist);
  } catch (error) {
    console.error('getArtistById:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getAllArtistsAdmin = async (req, res) => {
  try {
    const artists = await artistModels.findAllArtistsForAdmin();
    res.json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

/* =========================
   CREATE
========================= */
export const createArtist = async (req, res) => {
  const connection = await db.getConnection();

  let uploadedFilename = null;

  try {
    const { name, sorted_name, discogs_id, discogs_image_url } = req.body;
    const file = req.file;

    await connection.beginTransaction();

    // 1️⃣ Vérifier doublon
    const existing = await artistModels.findArtistByName(connection, name);

    if (existing) {
      await connection.rollback();
      return res.status(409).json({ error: 'Artiste déjà existant' });
    }

    let finalImage = '00_artist_default';

    // 2️⃣ Upload image locale
    if (file) {
      uploadedFilename = await uploadBufferToCloudinary({
        buffer: file.buffer,
        folder: CLOUDINARY_FOLDERS.ARTIST,
        prefix: 'artist',
      });

      finalImage = uploadedFilename;
    }

    // 3️⃣ Upload image Discogs
    else if (discogs_image_url) {
      const response = await fetch(discogs_image_url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      uploadedFilename = await uploadBufferToCloudinary({
        buffer,
        folder: CLOUDINARY_FOLDERS.ARTIST,
        prefix: 'artist',
      });

      finalImage = uploadedFilename;
    }

    // 4️⃣ Insert DB
    const artistId = await artistModels.createArtistWithImage({
      connection,
      name,
      sorted_name,
      discogs_id,
      image_filename: finalImage,
    });

    await connection.commit();

    res.status(201).json({ id: artistId });
  } catch (error) {
    await connection.rollback();

    // 🔥 Rollback Cloudinary si upload effectué
    if (uploadedFilename) {
      await deleteFromCloudinary({
        folder: CLOUDINARY_FOLDERS.ARTIST,
        filename: uploadedFilename,
      });
    }

    console.error(error);
    res.status(500).json({ error: 'Erreur création' });
  } finally {
    connection.release();
  }
};

/* =========================
   UPDATE
========================= */
export const updateArtist = async (req, res) => {
  const connection = await db.getConnection();

  let uploadedFilename = null;

  try {
    const { name, sorted_name, discogs_id, discogs_image_url } = req.body;
    const file = req.file;
    const artistId = req.params.id;

    await connection.beginTransaction();

    // 1️⃣ Récupérer image actuelle
    const currentImage = await artistModels.getArtistImage(connection, artistId);

    let finalImage = currentImage;

    // 2️⃣ Upload image locale
    if (file) {
      uploadedFilename = await uploadBufferToCloudinary({
        buffer: file.buffer,
        folder: CLOUDINARY_FOLDERS.ARTIST,
        prefix: 'artist',
      });

      finalImage = uploadedFilename;
    }

    // 3️⃣ Upload image Discogs
    else if (discogs_image_url) {
      const response = await fetch(discogs_image_url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      uploadedFilename = await uploadBufferToCloudinary({
        buffer,
        folder: CLOUDINARY_FOLDERS.ARTIST,
        prefix: 'artist',
      });

      finalImage = uploadedFilename;
    }

    // 4️⃣ Update DB
    await artistModels.updateArtistTransactional({
      connection,
      artistId,
      name,
      sorted_name,
      discogs_id,
      image_filename: finalImage,
    });

    await connection.commit();

    // 5️⃣ Supprimer ancienne image si remplacée
    if (uploadedFilename && currentImage && currentImage !== '00_artist_default') {
      await deleteFromCloudinary({
        folder: CLOUDINARY_FOLDERS.ARTIST,
        filename: currentImage,
      });
    }

    res.json({
      message: 'Artist updated',
      image_filename: finalImage,
    });
  } catch (error) {
    await connection.rollback();

    // rollback Cloudinary si upload fait
    if (uploadedFilename) {
      await deleteFromCloudinary({
        folder: CLOUDINARY_FOLDERS.ARTIST,
        filename: uploadedFilename,
      });
    }

    console.error(error);
    res.status(500).json({ error: 'Erreur update' });
  } finally {
    connection.release();
  }
};

/* =========================
   DELETE
========================= */
export const deleteArtist = async (req, res) => {
  try {
    await artistModels.deleteArtist(req.params.id);
    res.json({ message: 'Artist deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur suppression' });
  }
};

/* ===============================
  DISCOGS
================================= */
export const previewFromDiscogs = async (req, res) => {
  try {
    const { discogsId } = req.params;

    if (!discogsId) {
      return res.status(400).json({ error: 'discogsId manquant' });
    }

    console.log('Preview Discogs ID:', discogsId);

    const response = await fetch(`https://api.discogs.com/artists/${discogsId}`, {
      headers: {
        Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
      },
    });

    if (!response.ok) {
      console.log('Discogs non trouvé');
      return res.status(404).json({ error: 'Artiste introuvable sur Discogs' });
    }

    const data = await response.json();

    res.json({
      name: data.name || '',
      sorted_name: data.name || '',
      image_url: data.images?.[0]?.uri || null,
    });
  } catch (error) {
    console.error('Erreur preview Discogs:', error);
    res.status(500).json({ error: 'Erreur preview Discogs' });
  }
};
