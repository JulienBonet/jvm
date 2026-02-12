import { Router } from 'express';
import * as releaseMobileControllers from '../controllers/releaseMobileControllers.js';

const router = Router();

router.get('/', releaseMobileControllers.getMobileReleasesBySize);

export default router;
