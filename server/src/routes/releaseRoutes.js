import { Router } from 'express';
import * as releaseControllers from '../controllers/releaseControllers.js';

const router = Router();

router.get('/', releaseControllers.getAllReleases);
router.get('/:id', releaseControllers.getReleaseById);

export default router;
