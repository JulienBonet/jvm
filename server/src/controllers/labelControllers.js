import * as labelModels from '../models/labelModels.js';

export const getAllLabels = async (req, res) => {
  try {
    const artists = await labelModels.findAllLabels();
    res.json(artists);
  } catch (error) {
    console.error('Erreur getAllLabels:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getAllReleasesByLabelId = async (req, res) => {
  const { id } = req.params;

  try {
    const releases = await labelModels.findAllReleasesByLabelId(id);
    res.json(releases);
  } catch (error) {
    console.error('getAllReleasesByLabelId:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
