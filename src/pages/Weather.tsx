import React, { useState, useEffect } from 'react';
import { Cloud, Droplet, Wind, AlertTriangle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../stores/authStore';
import { weatherAPI } from '../services/api';
import type { WeatherData, WeatherAlert } from '../types';

export const Weather: React.FC = () => {
  const { user, language } = useAuthStore();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  
  const isArabic = language === 'ar';
  
  useEffect(() => {
    const loadWeather = async () => {
      if (!user?.farmLocation?.coordinates) {
        setLoading(false);
        return;
      }
      
      try {
        const { lat, lng } = user.farmLocation.coordinates;
        const data = await weatherAPI.getCurrent(lat, lng);
        setWeather(data);
        
        // Load alerts
        if (user.farmLocation.governorate) {
          const alertData = await weatherAPI.getAlerts(user.farmLocation.governorate);
          setAlerts(alertData);
        }
      } catch (error) {
        console.error('Failed to load weather:', error);
        // Mock data for development
        setWeather({
          location: user.farmLocation.governorate || 'Tunis',
          current: {
            temp: 22,
            humidity: 65,
            rainfall: 0,
            windSpeed: 15,
            condition: 'Sunny',
            conditionAr: 'مشمس',
          },
          forecast: [],
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadWeather();
  }, [user]);
  
  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <p className="text-gray-600">{isArabic ? 'جاري تحميل بيانات الطقس...' : 'Chargement des données météo...'}</p>
        </div>
      </div>
    );
  }
  
  if (!weather) {
    return (
      <div className="p-4">
        <Card>
          <p className="text-gray-600 text-center">
            {isArabic
              ? 'يرجى إضافة موقع المزرعة في الملف الشخصي لعرض بيانات الطقس'
              : 'Veuillez ajouter l\'emplacement de la ferme dans le profil pour afficher les données météo'}
          </p>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-4 pb-20 md:pb-4">
      <h1 className="text-2xl font-bold mb-4">
        {isArabic ? 'الطقس' : 'Météo'}
      </h1>
      
      {alerts.length > 0 && (
        <div className="mb-4 space-y-2">
          {alerts.map((alert, index) => (
            <Card key={index} className="border-l-4 border-warning bg-warning bg-opacity-10">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <h3 className="font-semibold text-warning mb-1">
                    {isArabic ? alert.messageAr : alert.message}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {alert.actionRequired}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <Card title={isArabic ? 'الحالة الحالية' : 'Conditions actuelles'}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Cloud className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{weather.current.temp}°C</p>
              <p className="text-sm text-gray-600">
                {isArabic ? weather.current.conditionAr : weather.current.condition}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Droplet className="w-8 h-8 text-info" />
            <div>
              <p className="text-lg font-semibold">{weather.current.humidity}%</p>
              <p className="text-sm text-gray-600">
                {isArabic ? 'رطوبة' : 'Humidité'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Droplet className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-lg font-semibold">{weather.current.rainfall}mm</p>
              <p className="text-sm text-gray-600">
                {isArabic ? 'أمطار' : 'Pluie'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Wind className="w-8 h-8 text-gray-500" />
            <div>
              <p className="text-lg font-semibold">{weather.current.windSpeed} km/h</p>
              <p className="text-sm text-gray-600">
                {isArabic ? 'رياح' : 'Vent'}
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      <Card 
        title={isArabic ? 'الموقع' : 'Localisation'} 
        className="mt-4"
      >
        <p className="text-gray-700">
          {user?.farmLocation?.governorate}, {user?.farmLocation?.delegation}
        </p>
      </Card>
    </div>
  );
};
