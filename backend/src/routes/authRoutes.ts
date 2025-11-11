import { Router } from 'express';
import {
  sendOTPHandler,
  verifyOTPHandler,
  getMeHandler,
  updateProfileHandler,
} from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/send-otp', sendOTPHandler);
router.post('/verify-otp', verifyOTPHandler);
router.get('/me', authenticate, getMeHandler);
router.put('/me', authenticate, updateProfileHandler);

export default router;

