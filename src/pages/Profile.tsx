import React from 'react';
import { User, LogOut, MapPin, Crop } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, language, logout } = useAuthStore();
  const navigate = useNavigate();
  const isArabic = language === 'ar';
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="p-4 pb-20 md:pb-4">
      <h1 className="text-2xl font-bold mb-4">
        {isArabic ? 'الملف الشخصي' : 'Profil'}
      </h1>
      
      <Card className="mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.phone}</p>
          </div>
        </div>
        
        {user.role === 'farmer' && user.farmLocation && (
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">
                  {isArabic ? 'الموقع' : 'Localisation'}
                </p>
                <p className="font-medium">
                  {user.farmLocation.governorate}, {user.farmLocation.delegation}
                </p>
              </div>
            </div>
            
            {user.farmSize && (
              <div className="flex items-center gap-3">
                <Crop className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">
                    {isArabic ? 'حجم المزرعة' : 'Taille de la ferme'}
                  </p>
                  <p className="font-medium">{user.farmSize} {isArabic ? 'هكتار' : 'hectares'}</p>
                </div>
              </div>
            )}
            
            {user.crops && user.crops.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  {isArabic ? 'المحاصيل' : 'Cultures'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.crops.map((crop, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
      
      <Button
        variant="outline"
        className="w-full"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        {isArabic ? 'تسجيل الخروج' : 'Déconnexion'}
      </Button>
    </div>
  );
};



