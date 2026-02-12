import { Router } from 'express';
import releaseRoutes from './routes/releaseRoutes.js';
import releaseMobileRoutes from './routes/releaseMobileRoutes.js';
import artistRoutes from './routes/artistRoutes.js';
import labelRoutes from './routes/labelRoutes.js';

const router = Router();

router.use('/release', releaseRoutes);
router.use('/mobile', releaseMobileRoutes);
router.use('/artist', artistRoutes);
router.use('/label', labelRoutes);

export default router;
