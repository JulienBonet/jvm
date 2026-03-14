// server\src\utils\getOrCreateArtist.js
import * as artistModels from '../models/artistModels.js';
import { uploadBufferToCloudinary } from './cloudinary.js';
import { CLOUDINARY_FOLDERS } from '../config/cloudinaryFolders.js';

const DEFAULT_ARTIST_IMAGE = '00_artist_default';

export async function getOrCreateArtist(connection, artist) {
  // 1️⃣ si id déjà présent
  if (artist.id) return artist.id;

  // 2️⃣ chercher par nom
  const existing = await artistModels.findArtistByName(connection, artist.name);
  if (existing) return existing.id;

  // 3️⃣ création avec image Discogs si dispo, sinon image par default
  let imageFilename = DEFAULT_ARTIST_IMAGE;

  if (artist.thumbnail_url) {
    const response = await fetch(artist.thumbnail_url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    imageFilename = await uploadBufferToCloudinary({
      buffer,
      folder: CLOUDINARY_FOLDERS.ARTIST,
      prefix: 'artist',
    });
  }

  const artistId = await artistModels.addArtistWithImage({
    connection,
    name: artist.name,
    sorted_name: artist.sorted_name || artist.name,
    discogs_id: artist.discogs_id || null,
    image_filename: imageFilename,
  });

  return artistId;
}
