import * as artistModels from '../models/artistModels.js';

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
