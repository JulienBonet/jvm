// server\src\utils\getOrCreateLabel.js

import * as labelModels from '../models/labelModels.js';
import { uploadBufferToCloudinary } from './cloudinary.js';
import { CLOUDINARY_FOLDERS } from '../config/cloudinaryFolders.js';

const DEFAULT_LABEL_IMAGE = '00_label_default';

export async function getOrCreateLabel(connection, label) {
  // 1️⃣ si id déjà présent
  if (label.id) {
    return label.id;
  }

  // 2️⃣ chercher par nom
  const existing = await labelModels.findLabelByName(connection, label.name);

  if (existing) {
    return existing.id;
  }

  // 3️⃣ création avec image Discogs si dispo, sinon image par default
  let imageFilename = DEFAULT_LABEL_IMAGE;

  if (label.thumbnail_url) {
    const response = await fetch(label.thumbnail_url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    imageFilename = await uploadBufferToCloudinary({
      buffer,
      folder: CLOUDINARY_FOLDERS.LABEL,
      prefix: 'label',
    });
  }

  const labelId = await labelModels.addLabelWithImage({
    connection,
    name: label.name,
    sorted_name: label.sorted_name || label.name,
    discogs_id: label.discogs_id || null,
    image_filename: imageFilename,
  });

  return labelId;
}
