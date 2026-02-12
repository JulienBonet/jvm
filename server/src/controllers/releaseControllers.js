import * as releaseModels from '../models/releaseModels.js';

export const getAllReleases = async (req, res, next) => {
  try {
    const releases = await releaseModels.findAllReleases();
    res.json(releases);
  } catch (err) {
    next(err);
  }
};

export const getReleaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const release = await releaseModels.findReleaseById(id);

    if (!release) return res.status(404).json({ message: 'Release not found' });

    res.json(release);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
