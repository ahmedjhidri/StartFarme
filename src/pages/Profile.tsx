import React, { useState } from 'react';
import { User, LogOut, MapPin, Crop, Edit, Save, X } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { GOVERNORATES, GOVERNORATES_AR } from '../utils/constants';

export const Profile: React.FC = () => {
  const { user, language, logout, setUser } = useAuthStore();
  const navigate = useNavigate();
  const isArabic = language === 'ar';
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    governorate: user?.farmLocation?.governorate || '',
    delegation: user?.farmLocation?.delegation || '',
    farmSize: user?.farmSize?.toString() || '',
    latitude: user?.farmLocation?.coordinates?.lat?.toString() || '',
    longitude: user?.farmLocation?.coordinates?.lng?.toString() || '',
  });
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: user?.name || '',
      governorate: user?.farmLocation?.governorate || '',
      delegation: user?.farmLocation?.delegation || '',
      farmSize: user?.farmSize?.toString() || '',
      latitude: user?.farmLocation?.coordinates?.lat?.toString() || '',
      longitude: user?.farmLocation?.coordinates?.lng?.toString() || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      governorate: user?.farmLocation?.governorate || '',
      delegation: user?.farmLocation?.delegation || '',
      farmSize: user?.farmSize?.toString() || '',
      latitude: user?.farmLocation?.coordinates?.lat?.toString() || '',
      longitude: user?.farmLocation?.coordinates?.lng?.toString() || '',
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedUser = await authAPI.updateProfile({
        name: formData.name,
        farmLocation: {
          governorate: formData.governorate,
          delegation: formData.delegation,
          coordinates: formData.latitude && formData.longitude ? {
            lat: parseFloat(formData.latitude),
            lng: parseFloat(formData.longitude),
          } : undefined,
        },
        farmSize: formData.farmSize ? parseFloat(formData.farmSize) : undefined,
      });
      
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(isArabic ? 'فشل تحديث الملف الشخصي' : 'Échec de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          {isArabic ? 'الملف الشخصي' : 'Profil'}
        </h1>
        {!isEditing && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleEdit}
          >
            <Edit className="w-4 h-4 mr-2" />
            {isArabic ? 'تعديل' : 'Modifier'}
          </Button>
        )}
      </div>
      
      <Card className="mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <Input
                type="text"
                label={isArabic ? 'الاسم' : 'Nom'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            ) : (
              <>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.phone}</p>
              </>
            )}
          </div>
        </div>
        
        {user.role === 'farmer' && (
          <div className="space-y-4 border-t pt-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isArabic ? 'المحافظة' : 'Gouvernorat'}
                  </label>
                  <select
                    value={formData.governorate}
                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    required
                  >
                    <option value="">
                      {isArabic ? 'اختر المحافظة' : 'Sélectionner un gouvernorat'}
                    </option>
                    {GOVERNORATES.map((gov, index) => (
                      <option key={gov} value={gov}>
                        {isArabic ? GOVERNORATES_AR[index] : gov}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  type="text"
                  label={isArabic ? 'ال delegación' : 'Délégation'}
                  value={formData.delegation}
                  onChange={(e) => setFormData({ ...formData, delegation: e.target.value })}
                  placeholder={isArabic ? 'مثال: Tunis Centre' : 'Ex: Tunis Centre'}
                />

                <Input
                  type="number"
                  label={isArabic ? 'حجم المزرعة (هكتار)' : 'Taille de la ferme (hectares)'}
                  value={formData.farmSize}
                  onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                  placeholder="5"
                  min="0.1"
                  step="0.1"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    label={isArabic ? 'خط العرض (Latitude)' : 'Latitude'}
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="36.8065"
                    step="0.0001"
                  />
                  <Input
                    type="number"
                    label={isArabic ? 'خط الطول (Longitude)' : 'Longitude'}
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="10.1815"
                    step="0.0001"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    {isArabic
                      ? '💡 Pour trouver vos coordonnées GPS, utilisez Google Maps ou Maps.app. Cliquez sur votre ferme et copiez les coordonnées.'
                      : '💡 To find your GPS coordinates, use Google Maps or Maps.app. Click on your farm and copy the coordinates.'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <X className="w-4 h-4 mr-2" />
                    {isArabic ? 'إلغاء' : 'Annuler'}
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleSave}
                    disabled={loading || !formData.name || !formData.governorate}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading
                      ? isArabic
                        ? 'جاري الحفظ...'
                        : 'Enregistrement...'
                      : isArabic
                      ? 'حفظ'
                      : 'Enregistrer'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                {user.farmLocation ? (
                  <>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {isArabic ? 'الموقع' : 'Localisation'}
                        </p>
                        <p className="font-medium">
                          {user.farmLocation.governorate}
                          {user.farmLocation.delegation && `, ${user.farmLocation.delegation}`}
                        </p>
                      </div>
                    </div>
                    
                    {user.farmLocation.coordinates && (
                      <div className="text-xs text-gray-500">
                        GPS: {user.farmLocation.coordinates.lat.toFixed(4)}, {user.farmLocation.coordinates.lng.toFixed(4)}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      {isArabic
                        ? '⚠️ Ajoutez votre localisation pour voir les données météo'
                        : '⚠️ Add your location to see weather data'}
                    </p>
                  </div>
                )}

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
              </>
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



