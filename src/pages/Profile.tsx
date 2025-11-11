import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { t } from '../utils/i18n';
import { User, LogOut, Phone, MapPin, Settings } from 'lucide-react';
import { LanguageToggle } from '../components/LanguageToggle';

export const Profile = () => {
  const { user, logout, language } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {t('profile', language)}
        </h1>

        {/* Profile Card */}
        <div className="card mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {user?.name || 'User'}
              </h2>
              <p className="text-gray-600 capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'رقم الهاتف' : 'Numéro de téléphone'}
                </p>
                <p className="font-medium">{user?.phone}</p>
              </div>
            </div>

            {user?.farmLocation && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'الموقع' : 'Emplacement'}
                  </p>
                  <p className="font-medium">
                    {user.farmLocation.governorate}, {user.farmLocation.delegation}
                  </p>
                </div>
              </div>
            )}

            {user?.farmSize && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'حجم المزرعة' : 'Taille de la ferme'}
                  </p>
                  <p className="font-medium">{user.farmSize} {language === 'ar' ? 'هكتار' : 'hectares'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {language === 'ar' ? 'الإعدادات' : 'Paramètres'}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>{language === 'ar' ? 'اللغة' : 'Langue'}</span>
              <LanguageToggle />
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full card hover:bg-red-50 border-red-200 flex items-center justify-center gap-2 text-red-600 font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>{t('logout', language)}</span>
        </button>
      </div>
    </div>
  );
};

