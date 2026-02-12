import { Router } from 'express';
import * as genreControllers from '../controllers/genreControllers.js';

const router = Router();

router.get('/', genreControllers.getAllGenres);

export default router;
