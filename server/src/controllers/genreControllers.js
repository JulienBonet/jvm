import * as genreModels from '../models/genreModels.js';

export const getAllGenres = async (req, res, next) => {
  try {
    const genres = await genreModels.findAllGenres();
    res.json(genres);
  } catch (err) {
    next(err);
  }
};
