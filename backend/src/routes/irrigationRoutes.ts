import { Router } from 'express';
import {
  calculateIrrigation,
  getIrrigationHistory,
} from '../controllers/irrigationController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate); // All routes require authentication

router.post('/calculate', calculateIrrigation);
router.get('/history', getIrrigationHistory);

export default router;

