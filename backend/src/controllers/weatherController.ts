import { Request, Response } from 'express';
import axios from 'axios';
import { config } from '../config/env';
import prisma from '../config/database';
import { cache } from '../config/redis';

// Get current weather
export const getCurrentWeather = async (req: Request, res: Response) => {
  try {
    // Support both lat/lng and latitude/longitude
    const lat = req.query.lat || req.query.latitude || 36.8065;
    const lng = req.query.lng || req.query.longitude || 10.1815;
    const governorate = req.query.governorate || 'Tunis';

    // Check cache
    const cacheKey = `weather:current:${lat}:${lng}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Try to use real weather API if key is provided
    if (config.weatherApiKey && config.weatherApiKey !== '') {
      try {
        // Use OpenWeatherMap API
        const response = await axios.get(`${config.weatherApiUrl}/weather`, {
          params: {
            lat: parseFloat(lat as string),
            lon: parseFloat(lng as string),
            appid: config.weatherApiKey,
            units: 'metric',
            lang: 'ar,fr',
          },
        });

        const weatherData = {
          location: governorate || response.data.name || 'Tunis',
          current: {
            temp: Math.round(response.data.main.temp),
            humidity: response.data.main.humidity,
            rainfall: response.data.rain ? (response.data.rain['1h'] || response.data.rain['3h'] || 0) : 0,
            windSpeed: Math.round(response.data.wind.speed * 3.6), // Convert m/s to km/h
            condition: response.data.weather[0].main,
            conditionAr: translateCondition(response.data.weather[0].main),
          },
          forecast: [],
        };

        // Cache for 10 minutes
        await cache.set(cacheKey, JSON.stringify(weatherData), 600);
        return res.json(weatherData);
      } catch (apiError: any) {
        console.error('Weather API error:', apiError.response?.data || apiError.message);
        // Fall back to mock data if API fails
      }
    }

    // Mock data for development or if API fails
    // Generate more realistic mock data based on coordinates
    const latNum = parseFloat(lat as string);
    const lngNum = parseFloat(lng as string);
    
    // Simple variation based on location (Tunis is warmer, northern regions are cooler)
    const baseTemp = latNum > 35 ? 25 : 22; // Warmer in south
    const tempVariation = Math.sin(Date.now() / 1000000) * 3; // Small variation
    const currentTemp = Math.round(baseTemp + tempVariation);
    
    // Rainfall based on season (simulate winter = more rain)
    const month = new Date().getMonth();
    const isWinter = month >= 11 || month <= 2;
    const rainfall = isWinter ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 2);
    
    // Wind speed variation
    const windSpeed = 8 + Math.floor(Math.random() * 10);
    
    // Conditions based on rainfall
    const conditions = rainfall > 2 ? ['Rainy', 'Cloudy'] : ['Sunny', 'Partly Cloudy'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    const mockData = {
      location: governorate || 'Tunis',
      current: {
        temp: currentTemp,
        humidity: 50 + Math.floor(Math.random() * 30),
        rainfall: rainfall,
        windSpeed: windSpeed,
        condition: condition,
        conditionAr: translateCondition(condition),
      },
      forecast: [],
    };

    // Cache for 10 minutes
    await cache.set(cacheKey, JSON.stringify(mockData), 600);
    return res.json(mockData);
  } catch (error: any) {
    console.error('Get weather error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};

// Get weather forecast
export const getWeatherForecast = async (req: Request, res: Response) => {
  try {
    // Support both lat/lng and latitude/longitude
    const lat = req.query.lat || req.query.latitude || 36.8065;
    const lng = req.query.lng || req.query.longitude || 10.1815;
    const days = parseInt(req.query.days as string) || 7;

    // Check cache
    const cacheKey = `weather:forecast:${lat}:${lng}:${days}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Try to use real weather API if key is provided
    if (config.weatherApiKey && config.weatherApiKey !== '') {
      try {
        // Use OpenWeatherMap API
        const response = await axios.get(`${config.weatherApiUrl}/forecast`, {
          params: {
            lat: parseFloat(lat as string),
            lon: parseFloat(lng as string),
            appid: config.weatherApiKey,
            units: 'metric',
            lang: 'ar,fr',
            cnt: days * 8, // 3-hour intervals
          },
        });

        const forecast = response.data.list
          .filter((_: any, index: number) => index % 8 === 0) // Daily forecast
          .map((item: any) => ({
            date: new Date(item.dt * 1000).toISOString(),
            tempMin: Math.round(item.main.temp_min),
            tempMax: Math.round(item.main.temp_max),
            rainfall: item.rain ? (item.rain['3h'] || 0) : 0,
            alerts: [],
          }));

        const forecastData = {
          location: response.data.city.name || 'Tunis',
          current: {
            temp: Math.round(response.data.list[0].main.temp),
            humidity: response.data.list[0].main.humidity,
            rainfall: response.data.list[0].rain ? (response.data.list[0].rain['3h'] || 0) : 0,
            windSpeed: Math.round(response.data.list[0].wind.speed * 3.6),
            condition: response.data.list[0].weather[0].main,
            conditionAr: translateCondition(response.data.list[0].weather[0].main),
          },
          forecast,
        };

        // Cache for 1 hour
        await cache.set(cacheKey, JSON.stringify(forecastData), 3600);
        return res.json(forecastData);
      } catch (apiError: any) {
        console.error('Weather API error:', apiError.response?.data || apiError.message);
        // Fall back to mock data if API fails
      }
    }

    // Mock forecast data
    const month = new Date().getMonth();
    const isWinter = month >= 11 || month <= 2;
    const baseTemp = parseFloat(lat as string) > 35 ? 25 : 22;

    const forecast = Array.from({ length: days }, (_, i) => {
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      const tempVariation = Math.sin(i) * 3;
      const rainfall = isWinter ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 2);
      const conditions = rainfall > 2 ? ['Rainy', 'Cloudy'] : ['Sunny', 'Partly Cloudy'];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];

      return {
        date: date.toISOString(),
        tempMin: Math.round(baseTemp - 5 + tempVariation),
        tempMax: Math.round(baseTemp + 5 + tempVariation),
        rainfall: rainfall,
        alerts: [],
      };
    });

    const forecastData = {
      location: 'Tunis',
      current: {
        temp: Math.round(baseTemp),
        humidity: 50 + Math.floor(Math.random() * 30),
        rainfall: isWinter ? Math.floor(Math.random() * 3) : 0,
        windSpeed: 8 + Math.floor(Math.random() * 10),
        condition: 'Sunny',
        conditionAr: 'مشمس',
      },
      forecast,
    };

    // Cache for 1 hour
    await cache.set(cacheKey, JSON.stringify(forecastData), 3600);
    return res.json(forecastData);
  } catch (error: any) {
    console.error('Get forecast error:', error);
    res.status(500).json({ error: 'Failed to fetch forecast' });
  }
};

// Get weather alerts
export const getWeatherAlerts = async (req: Request, res: Response) => {
  try {
    const { governorate } = req.query;

    // Get alerts from database
    const alerts = await prisma.weatherAlert.findMany({
      where: {
        ...(governorate && { governorate: governorate as string }),
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Transform alerts to match frontend format
    const formattedAlerts = alerts.map(alert => ({
      type: alert.alertType.toLowerCase(),
      severity: alert.severity.toLowerCase(),
      message: alert.message,
      messageAr: alert.messageAr,
      actionRequired: alert.actionRequired,
    }));

    res.json(formattedAlerts);
  } catch (error: any) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

// Helper functions
const translateCondition = (condition: string): string => {
  const translations: Record<string, string> = {
    Clear: 'صافي',
    Clouds: 'غائم',
    Rain: 'ممطر',
    Drizzle: 'رذاذ',
    Thunderstorm: 'عاصفة رعدية',
    Snow: 'ثلج',
    Mist: 'ضباب',
    Fog: 'ضباب',
    Haze: 'ضباب خفيف',
  };
  return translations[condition] || condition;
};

const getWeatherIcon = (condition: string): string => {
  const icons: Record<string, string> = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️',
  };
  return icons[condition] || '☀️';
};

