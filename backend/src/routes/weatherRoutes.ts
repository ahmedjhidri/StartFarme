import { Router } from 'express';
import {
  getCurrentWeather,
  getWeatherForecast,
  getWeatherAlerts,
} from '../controllers/weatherController';

const router = Router();

router.get('/current', getCurrentWeather);
router.get('/forecast', getWeatherForecast);
router.get('/alerts', getWeatherAlerts);

export default router;

