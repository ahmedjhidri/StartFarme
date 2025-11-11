import { useAuthStore } from '../store/authStore';
import { t } from '../utils/i18n';
import { Cloud, Droplets, Wind, Thermometer, AlertTriangle } from 'lucide-react';
import type { WeatherData } from '../types';

// Mock weather data
const mockWeatherData: WeatherData = {
  location: 'Tunis',
  current: {
    temp: 24,
    humidity: 65,
    rainfall: 0,
    windSpeed: 15,
  },
  forecast: [
    { date: '2024-11-11', tempMin: 18, tempMax: 25, rainfall: 0, alerts: [] },
    { date: '2024-11-12', tempMin: 19, tempMax: 26, rainfall: 2, alerts: [] },
    { date: '2024-11-13', tempMin: 17, tempMax: 24, rainfall: 0, alerts: [] },
    { date: '2024-11-14', tempMin: 16, tempMax: 23, rainfall: 0, alerts: [] },
    { date: '2024-11-15', tempMin: 15, tempMax: 22, rainfall: 0, alerts: [] },
    { date: '2024-11-16', tempMin: 14, tempMax: 21, rainfall: 0, alerts: [] },
    { date: '2024-11-17', tempMin: 13, tempMax: 20, rainfall: 0, alerts: [] },
  ],
};

export const Weather = () => {
  const { language } = useAuthStore();
  const weather = mockWeatherData;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {t('weather', language)}
        </h1>

        {/* Current Weather Card */}
        <div className="card mb-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {weather.location}
              </h2>
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'الطقس الحالي' : 'Conditions actuelles'}
              </p>
            </div>
            <Cloud className="w-16 h-16 text-blue-500" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <Thermometer className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">{t('temperature', language)}</p>
                <p className="text-2xl font-bold">{weather.current.temp}°C</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Droplets className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">{t('humidity', language)}</p>
                <p className="text-2xl font-bold">{weather.current.humidity}%</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Droplets className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">{t('rainfall', language)}</p>
                <p className="text-2xl font-bold">{weather.current.rainfall}mm</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Wind className="w-8 h-8 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">{t('windSpeed', language)}</p>
                <p className="text-2xl font-bold">{weather.current.windSpeed} km/h</p>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {language === 'ar' ? 'التنبؤ لـ 7 أيام' : 'Prévisions 7 jours'}
          </h2>
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4">
              {weather.forecast.map((day, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-32 text-center p-4 bg-gray-50 rounded-lg"
                >
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(day.date).toLocaleDateString(language === 'ar' ? 'ar-TN' : 'fr-FR', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                  <div className="flex items-center justify-center mb-2">
                    <Cloud className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold">{day.tempMax}°</p>
                    <p className="text-sm text-gray-500">{day.tempMin}°</p>
                    {day.rainfall > 0 && (
                      <p className="text-xs text-blue-600 flex items-center justify-center gap-1">
                        <Droplets className="w-3 h-3" />
                        {day.rainfall}mm
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weather Alerts */}
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">
                {language === 'ar' ? 'التنبيهات' : 'Alertes'}
              </h3>
              <p className="text-sm text-yellow-800">
                {language === 'ar'
                  ? 'لا توجد تنبيهات طقس نشطة حالياً'
                  : 'Aucune alerte météo active pour le moment'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

