import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { t } from '../utils/i18n';
import { Sprout, Plus, Calendar, MapPin } from 'lucide-react';
import type { Crop } from '../types';

// Mock crops data
const mockCrops: Crop[] = [
  {
    id: '1',
    name: 'Olives',
    nameAr: 'الزيتون',
    plantingDate: new Date('2024-03-15'),
    harvestDate: new Date('2024-11-20'),
    farmerId: '1',
    fieldSize: 5,
    status: 'growing',
  },
  {
    id: '2',
    name: 'Wheat',
    nameAr: 'القمح',
    plantingDate: new Date('2024-11-01'),
    harvestDate: new Date('2025-05-15'),
    farmerId: '1',
    fieldSize: 3,
    status: 'planted',
  },
];

export const Crops = () => {
  const { language } = useAuthStore();
  const [crops] = useState<Crop[]>(mockCrops);

  const getStatusColor = (status: Crop['status']) => {
    const colors = {
      planning: 'bg-gray-100 text-gray-700',
      planted: 'bg-blue-100 text-blue-700',
      growing: 'bg-green-100 text-green-700',
      harvesting: 'bg-orange-100 text-orange-700',
      harvested: 'bg-purple-100 text-purple-700',
    };
    return colors[status];
  };

  const getStatusText = (status: Crop['status']) => {
    const texts = {
      planning: language === 'ar' ? 'مخطط' : 'Planifié',
      planted: language === 'ar' ? 'مزروع' : 'Planté',
      growing: language === 'ar' ? 'ينمو' : 'En croissance',
      harvesting: language === 'ar' ? 'حصاد' : 'Récolte',
      harvested: language === 'ar' ? 'محصود' : 'Récolté',
    };
    return texts[status];
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('crops', language)}
          </h1>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>{t('addCrop', language)}</span>
          </button>
        </div>

        {crops.length === 0 ? (
          <div className="card text-center py-12">
            <Sprout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {language === 'ar'
                ? 'لا توجد محاصيل مسجلة حتى الآن'
                : 'Aucune culture enregistrée pour le moment'
              }
            </p>
            <button className="btn-primary">
              {t('addCrop', language)}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crops.map((crop) => (
              <div key={crop.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {language === 'ar' ? crop.nameAr : crop.name}
                    </h3>
                    {crop.variety && (
                      <p className="text-sm text-gray-600">{crop.variety}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(crop.status)}`}>
                    {getStatusText(crop.status)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{crop.fieldSize} {language === 'ar' ? 'هكتار' : 'hectares'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {language === 'ar' ? 'زراعة:' : 'Plantation:'} {' '}
                      {crop.plantingDate.toLocaleDateString(language === 'ar' ? 'ar-TN' : 'fr-FR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {language === 'ar' ? 'حصاد متوقع:' : 'Récolte prévue:'} {' '}
                      {crop.harvestDate.toLocaleDateString(language === 'ar' ? 'ar-TN' : 'fr-FR')}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="text-sm text-primary hover:underline">
                    {language === 'ar' ? 'عرض التفاصيل' : 'Voir les détails'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

