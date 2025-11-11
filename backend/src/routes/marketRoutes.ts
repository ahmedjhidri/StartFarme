import { Router } from 'express';
import {
  getMarketPrices,
  getPriceHistory,
  getListings,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/marketController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Public routes
router.get('/prices', getMarketPrices);
router.get('/prices/history', getPriceHistory);
router.get('/listings', getListings);

// Protected routes
router.post('/listings', authenticate, createListing);
router.put('/listings/:id', authenticate, updateListing);
router.delete('/listings/:id', authenticate, deleteListing);

export default router;

