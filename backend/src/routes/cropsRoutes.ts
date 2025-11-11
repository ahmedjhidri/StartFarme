import { Router } from 'express';
import {
  getCrops,
  getCrop,
  createCrop,
  updateCrop,
  deleteCrop,
  getCropCalendar,
} from '../controllers/cropsController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate); // All routes require authentication

router.get('/', getCrops);
router.get('/calendar', getCropCalendar);
router.get('/:id', getCrop);
router.post('/', createCrop);
router.put('/:id', updateCrop);
router.delete('/:id', deleteCrop);

export default router;

