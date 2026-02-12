import { Router } from 'express';
import * as labelControllers from '../controllers/labelControllers.js';

const router = Router();

router.get('/', labelControllers.getAllLabels);
router.get('/:id/releases', labelControllers.getAllReleasesByLabelId);

export default router;
