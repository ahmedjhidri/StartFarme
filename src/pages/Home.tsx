import { useAuthStore } from '../store/authStore';
import { t } from '../utils/i18n';
import { Cloud, Sprout, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  const { user, language } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'ar' 
              ? `مرحباً ${user?.name || 'مزارع'}`
              : `Bienvenue ${user?.name || 'Agriculteur'}`
            }
          </h1>
          <p className="text-gray-600">
            {language === 'ar'
              ? 'نظرة عامة سريعة على مزرعتك'
              : 'Aperçu rapide de votre ferme'
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Cloud className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'الطقس' : 'Météo'}
                </p>
                <p className="text-xl font-bold">24°C</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Sprout className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'المحاصيل' : 'Cultures'}
                </p>
                <p className="text-xl font-bold">3</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'الأسعار' : 'Prix'}
                </p>
                <p className="text-xl font-bold">--</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'التنبيهات' : 'Alertes'}
                </p>
                <p className="text-xl font-bold">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Link to="/weather" className="card hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-600" />
              {t('weather', language)}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'ar'
                ? 'تحقق من الطقس الحالي والتنبؤات'
                : 'Vérifiez la météo actuelle et les prévisions'
              }
            </p>
          </Link>

          <Link to="/crops" className="card hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-green-600" />
              {t('crops', language)}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'ar'
                ? 'إدارة محاصيلك ومتابعة نموها'
                : 'Gérez vos cultures et suivez leur croissance'
              }
            </p>
          </Link>
        </div>

        {/* Weather Alert Banner */}
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">
                {language === 'ar' ? 'تنبيه الطقس' : 'Alerte météo'}
              </h4>
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

