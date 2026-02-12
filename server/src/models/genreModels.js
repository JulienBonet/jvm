import { db } from '../../db/connection.js';

export const findAllGenres = async () => {
  const [rows] = await db.query(`
    SELECT id, name
    FROM genre
    ORDER BY name ASC
  `);
  return rows;
};
