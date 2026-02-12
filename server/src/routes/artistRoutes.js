import { Router } from 'express';
import * as artistControllers from '../controllers/artistControllers.js';

const router = Router();

router.get('/', artistControllers.getAllArtists);
router.get('/:id/releases', artistControllers.getAllReleasesByArtistId);

export default router;
