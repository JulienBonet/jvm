import { db } from '../../db/connection.js';

export const findMobileReleasesBySize = async (discSize) => {
  const [rows] = await db.query(
    `
    SELECT
      r.id,
      r.title,
      r.year,
      r.release_type,
      GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') AS artists,
      GROUP_CONCAT(DISTINCT l.name SEPARATOR ', ') AS labels,
      d.size AS disc_size,
      d.speed AS disc_speed
    FROM releases r
    JOIN disc d 
      ON d.release_id = r.id
      AND d.disc_number = 1
    LEFT JOIN release_artist ra 
      ON ra.release_id = r.id
      AND ra.role = 'Main'
    LEFT JOIN artist a 
      ON a.id = ra.artist_id
    LEFT JOIN release_label rl 
      ON rl.release_id = r.id
    LEFT JOIN label l 
      ON l.id = rl.label_id
    WHERE d.size = ?
    GROUP BY
      r.id,
      r.title,
      r.year,
      r.release_type,
      d.size,
      d.speed
    ORDER BY r.title ASC;
  `,
    [discSize],
  );

  return rows;
};
