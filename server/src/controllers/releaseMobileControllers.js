import * as releaseMobileModels from '../models/releaseMobileModels.js';

export const getMobileReleasesBySize = async (req, res, next) => {
  try {
    const { size } = req.query;

    if (!size) {
      return res.status(400).json({ message: 'Missing disc size' });
    }

    const releases = await releaseMobileModels.findMobileReleasesBySize(size);
    res.json(releases);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
