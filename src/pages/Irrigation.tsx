import React, { useState, useEffect } from 'react';
import { Droplet, Calculator, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import { calculateIrrigation, type IrrigationInputs } from '../utils/irrigationCalculator';
import { CROPS } from '../utils/constants';
import { weatherAPI } from '../services/api';

export const Irrigation: React.FC = () => {
  const { user, language } = useAuthStore();
  const isArabic = language === 'ar';
  
  const [crop, setCrop] = useState('');
  const [fieldSize, setFieldSize] = useState('');
  const [soilType, setSoilType] = useState<'sandy' | 'clay' | 'loam' | 'mixed'>('loam');
  const [lastIrrigation, setLastIrrigation] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calculateIrrigation> | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Get weather data for calculation
  useEffect(() => {
    if (user?.farmLocation?.coordinates && crop && fieldSize) {
      loadWeatherData();
    }
  }, [user, crop, fieldSize]);
  
  const loadWeatherData = async () => {
    if (!user?.farmLocation?.coordinates) return;
    
    try {
      await weatherAPI.getCurrent(
        user.farmLocation.coordinates.lat,
        user.farmLocation.coordinates.lng
      );
      // Weather data will be used in calculation
    } catch (error) {
      console.error('Failed to load weather:', error);
    }
  };
  
  const handleCalculate = () => {
    if (!crop || !fieldSize || !lastIrrigation) {
      return;
    }
    
    setLoading(true);
    
    // Mock weather data (in production, use real weather API)
    const mockWeather = {
      temperature: 25,
      humidity: 60,
      recentRainfall: 5, // mm in last 7 days
    };
    
    const inputs: IrrigationInputs = {
      crop,
      fieldSize: parseFloat(fieldSize),
      soilType,
      lastIrrigation: new Date(lastIrrigation),
      temperature: mockWeather.temperature,
      humidity: mockWeather.humidity,
      recentRainfall: mockWeather.recentRainfall,
    };
    
    const calculationResult = calculateIrrigation(inputs);
    setResult(calculationResult);
    setLoading(false);
  };
  
  const urgencyColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300',
  };
  
  const urgencyLabels = {
    low: { ar: 'منخفض', fr: 'Faible' },
    medium: { ar: 'متوسط', fr: 'Moyen' },
    high: { ar: 'عالٍ', fr: 'Élevé' },
  };
  
  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="flex items-center gap-3 mb-4">
        <Droplet className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">
          {isArabic ? 'حاسبة الري' : 'Calculateur d\'irrigation'}
        </h1>
      </div>
      
      <Card className="mb-4">
        <h2 className="text-lg font-semibold mb-4">
          {isArabic ? 'معلومات المحصول والحقل' : 'Informations sur la culture et le champ'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isArabic ? 'المحصول' : 'Culture'}
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">
                {isArabic ? 'اختر المحصول' : 'Sélectionner une culture'}
              </option>
              {CROPS.map((c) => (
                <option key={c.name} value={c.name}>
                  {isArabic ? c.nameAr : c.name}
                </option>
              ))}
            </select>
          </div>
          
          <Input
            type="number"
            label={isArabic ? 'حجم الحقل (هكتار)' : 'Taille du champ (hectares)'}
            placeholder="5"
            value={fieldSize}
            onChange={(e) => setFieldSize(e.target.value)}
            min="0.1"
            step="0.1"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isArabic ? 'نوع التربة' : 'Type de sol'}
            </label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="sandy">{isArabic ? 'رملية' : 'Sableuse'}</option>
              <option value="loam">{isArabic ? 'طميية' : 'Limoneuse'}</option>
              <option value="clay">{isArabic ? 'طينية' : 'Argileuse'}</option>
              <option value="mixed">{isArabic ? 'مختلطة' : 'Mixte'}</option>
            </select>
          </div>
          
          <Input
            type="date"
            label={isArabic ? 'تاريخ آخر ري' : 'Date de la dernière irrigation'}
            value={lastIrrigation}
            onChange={(e) => setLastIrrigation(e.target.value)}
          />
          
          <Button
            variant="primary"
            className="w-full"
            onClick={handleCalculate}
            disabled={loading || !crop || !fieldSize || !lastIrrigation}
          >
            <Calculator className="w-4 h-4 mr-2" />
            {loading
              ? isArabic
                ? 'جاري الحساب...'
                : 'Calcul en cours...'
              : isArabic
              ? 'احسب كمية الماء المطلوبة'
              : 'Calculer les besoins en eau'}
          </Button>
        </div>
      </Card>
      
      {result && (
        <Card className="border-2 border-primary">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary">
              {isArabic ? 'النتيجة' : 'Résultat'}
            </h2>
            <div
              className={`px-3 py-1 rounded-full border text-sm font-medium ${
                urgencyColors[result.urgency]
              }`}
            >
              {isArabic
                ? urgencyLabels[result.urgency].ar
                : urgencyLabels[result.urgency].fr}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Droplet className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-900">
                    {result.waterNeededCubicMeters} m³
                  </p>
                  <p className="text-sm text-blue-700">
                    {isArabic
                      ? `أو ${result.waterNeeded.toLocaleString()} لتر`
                      : `ou ${result.waterNeeded.toLocaleString()} litres`}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-1">
                  {isArabic ? 'وقت الري الموصى به' : 'Heure recommandée'}
                </p>
                <p className="font-semibold">
                  {isArabic
                    ? result.timing === 'morning'
                      ? 'الصباح'
                      : 'المساء'
                    : result.timing === 'morning'
                    ? 'Matin'
                    : 'Soir'}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-1">
                  {isArabic ? 'التبخر المرجعي' : 'Évapotranspiration'}
                </p>
                <p className="font-semibold">{result.evapotranspiration} mm/jour</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                {isArabic ? 'التفاصيل' : 'Détails'}
              </p>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {isArabic ? result.reasoningAr : result.reasoning}
              </p>
            </div>
          </div>
        </Card>
      )}
      
      {!user?.farmLocation && (
        <Card className="mt-4 border-yellow-200 bg-yellow-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <p className="text-sm text-yellow-800">
              {isArabic
                ? 'لحساب أكثر دقة، يرجى إضافة موقع المزرعة في الملف الشخصي.'
                : 'Pour un calcul plus précis, veuillez ajouter l\'emplacement de la ferme dans le profil.'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

