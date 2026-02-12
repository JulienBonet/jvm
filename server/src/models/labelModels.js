import { db } from '../../db/connection.js';

export const findAllLabels = async () => {
  const [rows] = await db.query(`
    SELECT
      l.id,
      l.name,
      i.url AS image_url
    FROM label l
    LEFT JOIN image i
      ON i.entity_type = 'label'
     AND i.entity_id = l.id
    GROUP BY l.id, l.name, i.url
    ORDER BY l.name;
  `);

  return rows;
};

export const findAllReleasesByLabelId = async (labelId) => {
  const [rows] = await db.query(
    `
    SELECT
      r.id,
      r.title,
      r.year,
      r.release_type,
      GROUP_CONCAT(DISTINCT a_all.name SEPARATOR ', ') AS artists,
      GROUP_CONCAT(DISTINCT l.name SEPARATOR ', ') AS labels,
      d.size AS disc_size,
      d.speed AS disc_speed,
      img.url AS image_url
    FROM release_label rl_filter
    JOIN releases r
      ON r.id = rl_filter.release_id
    LEFT JOIN release_artist ra_all
      ON ra_all.release_id = r.id
    LEFT JOIN artist a_all
      ON a_all.id = ra_all.artist_id
    LEFT JOIN release_label rl
      ON rl.release_id = r.id
    LEFT JOIN label l
      ON l.id = rl.label_id
    LEFT JOIN disc d
      ON d.release_id = r.id
      AND d.disc_number = 1
    LEFT JOIN image img
      ON img.entity_type = 'release'
      AND img.entity_id = r.id
      AND img.type = 'cover'
    WHERE rl_filter.label_id = ?
    GROUP BY
      r.id, r.title, r.year, r.release_type, d.size, d.speed, img.url
      ORDER BY r.year DESC, r.title;
    `,
    [labelId],
  );

  return rows;
};
