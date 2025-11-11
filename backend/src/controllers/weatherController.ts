import { Request, Response } from 'express';
import axios from 'axios';
import { config } from '../config/env';
import prisma from '../config/database';
import { cache } from '../config/redis';

// Get current weather
export const getCurrentWeather = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, governorate } = req.query;

    // Default to Tunis coordinates if not provided
    const lat = latitude || 36.8065;
    const lng = longitude || 10.1815;

    // Check cache
    const cacheKey = `weather:current:${lat}:${lng}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // In production, use actual weather API
    // For now, return mock data
    if (config.nodeEnv === 'development' || !config.weatherApiKey) {
      const mockData = {
        location: {
          name: governorate || 'Tunis',
          latitude: parseFloat(lat as string),
          longitude: parseFloat(lng as string),
        },
        current: {
          temperature: 25,
          humidity: 65,
          windSpeed: 10,
          windDirection: 'NE',
          pressure: 1013,
          uvIndex: 6,
          visibility: 10,
          condition: 'Sunny',
          conditionAr: 'مشمس',
          icon: '☀️',
        },
        forecast: [
          {
            date: new Date(),
            high: 28,
            low: 18,
            condition: 'Sunny',
            conditionAr: 'مشمس',
            precipitation: 0,
          },
        ],
      };

      // Cache for 10 minutes
      await cache.set(cacheKey, JSON.stringify(mockData), 600);
      return res.json(mockData);
    }

    // Production: Use OpenWeatherMap or INM API
    const response = await axios.get(`${config.weatherApiUrl}/weather`, {
      params: {
        lat,
        lon: lng,
        appid: config.weatherApiKey,
        units: 'metric',
      },
    });

    const weatherData = {
      location: {
        name: response.data.name,
        latitude: parseFloat(lat as string),
        longitude: parseFloat(lng as string),
      },
      current: {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        windDirection: response.data.wind.deg,
        pressure: response.data.main.pressure,
        uvIndex: 0, // Not available in free tier
        visibility: response.data.visibility / 1000, // Convert to km
        condition: response.data.weather[0].main,
        conditionAr: translateCondition(response.data.weather[0].main),
        icon: getWeatherIcon(response.data.weather[0].main),
      },
    };

    // Cache for 10 minutes
    await cache.set(cacheKey, JSON.stringify(weatherData), 600);
    res.json(weatherData);
  } catch (error: any) {
    console.error('Get weather error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};

// Get weather forecast
export const getWeatherForecast = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, days = 7 } = req.query;

    const lat = latitude || 36.8065;
    const lng = longitude || 10.1815;

    // Check cache
    const cacheKey = `weather:forecast:${lat}:${lng}:${days}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Mock forecast data
    if (config.nodeEnv === 'development' || !config.weatherApiKey) {
      const forecast = Array.from({ length: parseInt(days as string) }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
        high: 25 + Math.floor(Math.random() * 5),
        low: 15 + Math.floor(Math.random() * 5),
        condition: ['Sunny', 'Cloudy', 'Partly Cloudy'][Math.floor(Math.random() * 3)],
        conditionAr: ['مشمس', 'غائم', 'غائم جزئياً'][Math.floor(Math.random() * 3)],
        precipitation: Math.floor(Math.random() * 5),
        windSpeed: 8 + Math.floor(Math.random() * 5),
      }));

      const forecastData = { forecast };

      // Cache for 1 hour
      await cache.set(cacheKey, JSON.stringify(forecastData), 3600);
      return res.json(forecastData);
    }

    // Production: Use weather API
    const response = await axios.get(`${config.weatherApiUrl}/forecast`, {
      params: {
        lat,
        lon: lng,
        appid: config.weatherApiKey,
        units: 'metric',
        cnt: parseInt(days as string) * 8, // 3-hour intervals
      },
    });

    const forecast = response.data.list
      .filter((_: any, index: number) => index % 8 === 0) // Daily forecast
      .map((item: any) => ({
        date: new Date(item.dt * 1000),
        high: item.main.temp_max,
        low: item.main.temp_min,
        condition: item.weather[0].main,
        conditionAr: translateCondition(item.weather[0].main),
        precipitation: item.rain ? item.rain['3h'] || 0 : 0,
        windSpeed: item.wind.speed,
      }));

    const forecastData = { forecast };

    // Cache for 1 hour
    await cache.set(cacheKey, JSON.stringify(forecastData), 3600);
    res.json(forecastData);
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

    res.json({ alerts });
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

