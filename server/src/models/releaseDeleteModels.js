import { db } from '../../db/connection.js';
import { deleteFromCloudinary } from '../utils/cloudinary.js';
import { CLOUDINARY_FOLDERS } from '../config/cloudinaryFolders.js';

import { eraseArtist } from './artistModels.js';
import { eraseLabel } from './labelModels.js';
import { eraseGenreById } from './genreModels.js';
import { eraseStyleById } from './styleModels.js';

export const eraseRelease = async (releaseId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    /* =========================
       CHECK COLLECTION
    ========================= */

    const [collectionRows] = await connection.query(
      `SELECT id FROM collection WHERE release_id = ?`,
      [releaseId],
    );

    if (collectionRows.length > 0) {
      throw new Error('Release présente dans collection');
    }

    /* =========================
       RECUP RELATIONS
    ========================= */

    const [artists] = await connection.query(
      `SELECT artist_id FROM release_artist WHERE release_id = ?`,
      [releaseId],
    );

    const [genres] = await connection.query(
      `SELECT genre_id FROM release_genre WHERE release_id = ?`,
      [releaseId],
    );

    const [styles] = await connection.query(
      `SELECT style_id FROM release_style WHERE release_id = ?`,
      [releaseId],
    );

    const [labels] = await connection.query(
      `SELECT label_id FROM release_label WHERE release_id = ?`,
      [releaseId],
    );

    /* =========================
       IMAGE RELEASE
    ========================= */

    const [images] = await connection.query(
      `SELECT url FROM image 
       WHERE entity_type='release'
       AND entity_id=?`,
      [releaseId],
    );

    if (images.length > 0) {
      const filename = images[0].url;

      await deleteFromCloudinary({
        folder: CLOUDINARY_FOLDERS.RELEASE,
        filename,
      });

      await connection.query(
        `DELETE FROM image
         WHERE entity_type='release'
         AND entity_id=?`,
        [releaseId],
      );
    }

    /* =========================
       EXTERNAL LINKS
    ========================= */

    await connection.query(
      `DELETE FROM external_link
       WHERE entity_type='release'
       AND entity_id=?`,
      [releaseId],
    );

    /* =========================
       DELETE RELEASE
    ========================= */

    await connection.query(`DELETE FROM releases WHERE id=?`, [releaseId]);

    /* =========================
       CLEAN GENRES
    ========================= */

    for (const g of genres) {
      const [[count]] = await connection.query(
        `SELECT COUNT(*) as total
         FROM release_genre
         WHERE genre_id=?`,
        [g.genre_id],
      );

      if (count.total === 0) {
        await eraseGenreById(g.genre_id, connection);
      }
    }

    /* =========================
       CLEAN STYLES
    ========================= */

    for (const s of styles) {
      const [[count]] = await connection.query(
        `SELECT COUNT(*) as total
         FROM release_style
         WHERE style_id=?`,
        [s.style_id],
      );

      if (count.total === 0) {
        await eraseStyleById(s.style_id, connection);
      }
    }

    /* =========================
       CLEAN ARTISTS
    ========================= */

    for (const a of artists) {
      const [[count]] = await connection.query(
        `SELECT COUNT(*) as total
         FROM release_artist
         WHERE artist_id=?`,
        [a.artist_id],
      );

      if (count.total === 0) {
        await eraseArtist(a.artist_id, connection);
      }
    }

    /* =========================
       CLEAN LABELS
    ========================= */

    for (const l of labels) {
      const [[count]] = await connection.query(
        `SELECT COUNT(*) as total
         FROM release_label
         WHERE label_id=?`,
        [l.label_id],
      );

      if (count.total === 0) {
        await eraseLabel(l.label_id, connection);
      }
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
