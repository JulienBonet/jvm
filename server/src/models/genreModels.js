import { db } from '../../db/connection.js';

/* =========================
   GET
========================= */
export const findAllGenres = async () => {
  const [rows] = await db.query(`
    SELECT id, name
    FROM genre
    ORDER BY name ASC
  `);
  return rows;
};

export const findAllGenresOrderById = async () => {
  const [rows] = await db.query(`
    SELECT id, name
    FROM genre
    ORDER BY id DESC
  `);
  return rows;
};

export const findGenreById = async (id) => {
  const [result] = await db.query(
    `SELECT *
    FROM genre
    WHERE id = ?
    `,
    [id],
  );
  return result;
};

export const findGenreByName = async (name) => {
  const [rows] = await db.query(
    `SELECT *
     FROM genre
     WHERE name = ?`,
    [name],
  );
  return rows.length > 0 ? rows[0] : null;
};

/* =========================
   CREATE
========================= */
export const insertGenre = async (name) => {
  const [result] = await db.query('INSERT INTO genre (name) VALUES (?)', [name]);
  return result.insertId;
};

/* =========================
   UPDATE
========================= */
export const editGenreById = async (id, name) => {
  const [result] = await db.query('UPDATE genre SET name = ? WHERE id = ?', [name, id]);
  return result.affectedRows;
};

/* =========================
   DELETE
========================= */
export const eraseGenreById = async (id) => {
  const [result] = await db.query('DELETE FROM genre WHERE id = ?', [id]);
  return result.affectedRows;
};
