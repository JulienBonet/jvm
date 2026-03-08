export const addRelease = async (payload, connection) => {
  const conn = connection;

  try {
    await conn.beginTransaction();

    const { release, image_filename, thumbnail_url, artists, labels, genres, styles, links } =
      payload;

    // -----------------
    // Insert release
    // -----------------
    const [result] = await conn.query(
      `
        INSERT INTO releases
        (discogs_id, title, year, country, barcode, notes, release_type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
      [
        release.discogs_id || null,
        release.title,
        release.year,
        release.country,
        release.barcode,
        release.notes,
        release.release_type,
      ],
    );

    const releaseId = result.insertId;

    // -----------------
    // image
    // -----------------
    if (image_filename) {
      await conn.query(
        `
        INSERT INTO image
        (entity_type, entity_id, type, url, thumbnail_url)
        VALUES ('release', ?, 'cover', ?, ?)
        `,
        [releaseId, image_filename, thumbnail_url || null],
      );
    }

    // -----------------
    // artist
    // -----------------

    for (const artist of artists || []) {
      let artistId = artist.id;

      if (!artistId) {
        const [existing] = await conn.query(`SELECT id FROM artist WHERE name = ?`, [artist.name]);

        if (existing.length) {
          artistId = existing[0].id;
        } else {
          const [created] = await conn.query(
            `
        INSERT INTO artist (discogs_id, name, sorted_name)
        VALUES (?, ?, ?)
      `,
            [artist.discogs_id || null, artist.name, artist.sorted_name || artist.name],
          );

          artistId = created.insertId;
        }
      }

      await conn.query(
        `
    INSERT INTO release_artist (release_id, artist_id, role)
    VALUES (?, ?, ?)
  `,
        [releaseId, artistId, artist.role || 'Main'],
      );
    }

    // -----------------
    // Label
    // -----------------

    for (const label of labels || []) {
      let labelId = label.id;

      if (!labelId) {
        const [existing] = await conn.query(`SELECT id FROM label WHERE name = ?`, [label.name]);

        if (existing.length) {
          labelId = existing[0].id;
        } else {
          const [created] = await conn.query(
            `
        INSERT INTO label (discogs_id, name, sorted_name)
        VALUES (?, ?, ?)
      `,
            [label.discogs_id || null, label.name, label.sorted_name || label.name],
          );

          labelId = created.insertId;
        }
      }

      await conn.query(
        `
    INSERT INTO release_label (release_id, label_id, catalog_number)
    VALUES (?, ?, ?)
  `,
        [releaseId, labelId, label.catalog_number || null],
      );
    }

    // -----------------
    // genre
    // -----------------

    for (const genre of genres || []) {
      let genreId = genre.id;

      if (!genreId) {
        const [existing] = await conn.query(`SELECT id FROM genre WHERE name = ?`, [genre.name]);

        if (existing.length) genreId = existing[0].id;
        else {
          const [created] = await conn.query(`INSERT INTO genre (name) VALUES (?)`, [genre.name]);
          genreId = created.insertId;
        }
      }

      await conn.query(
        `
    INSERT INTO release_genre (release_id, genre_id)
    VALUES (?, ?)
  `,
        [releaseId, genreId],
      );
    }

    // -----------------
    // style
    // -----------------

    for (const style of styles || []) {
      let styleId = style.id;

      if (!styleId) {
        const [existing] = await conn.query(`SELECT id FROM style WHERE name = ?`, [style.name]);

        if (existing.length) styleId = existing[0].id;
        else {
          const [created] = await conn.query(`INSERT INTO style (name) VALUES (?)`, [style.name]);
          styleId = created.insertId;
        }
      }

      await conn.query(
        `
    INSERT INTO release_style (release_id, style_id)
    VALUES (?, ?)
  `,
        [releaseId, styleId],
      );
    }

    // -----------------
    // link
    // -----------------
    for (const link of links || []) {
      await conn.query(
        `
    INSERT INTO external_link
    (entity_type, entity_id, platform, url)
    VALUES ('release', ?, ?, ?)
  `,
        [releaseId, link.platform, link.url],
      );
    }

    // -----------------
    // Return
    // -----------------

    return { id: releaseId };
  } finally {
    conn.release();
  }
};
