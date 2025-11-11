import { Router } from 'express';
import {
  detectPest,
  getPestDetections,
} from '../controllers/pestDetectionController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate); // All routes require authentication

router.post('/', detectPest);
router.get('/', getPestDetections);

export default router;

