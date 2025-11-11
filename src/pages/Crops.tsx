import React, { useState, useEffect } from 'react';
import { Plus, Sprout, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import { cropsAPI } from '../services/api';
import { CROPS } from '../utils/constants';
import type { Crop } from '../types';

interface CropFormData {
  name: string;
  variety?: string;
  plantingDate: string;
  harvestDate: string;
  fieldSize: string;
  status: Crop['status'];
}

export const Crops: React.FC = () => {
  const { language } = useAuthStore();
  const isArabic = language === 'ar';
  
  const [crops, setCrops] = useState<Crop[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CropFormData>({
    name: '',
    variety: '',
    plantingDate: '',
    harvestDate: '',
    fieldSize: '',
    status: 'planning',
  });
  
  useEffect(() => {
    loadCrops();
  }, []);
  
  const loadCrops = async () => {
    try {
      setLoading(true);
      const data = await cropsAPI.getAll();
      setCrops(data);
    } catch (error: any) {
      console.error('Failed to load crops:', error);
      // Show error message to user
      if (error.response?.status === 401) {
        // User not authenticated, redirect to login
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingCrop) {
        // Update existing crop
        await cropsAPI.update(editingCrop.id, {
          cropName: formData.name,
          cropNameAr: CROPS.find(c => c.name === formData.name)?.nameAr || formData.name,
          variety: formData.variety,
          plantingDate: new Date(formData.plantingDate),
          harvestDate: new Date(formData.harvestDate),
          fieldSize: parseFloat(formData.fieldSize),
          status: formData.status.toUpperCase() as any,
        });
      } else {
        // Create new crop
        await cropsAPI.create({
          cropName: formData.name,
          cropNameAr: CROPS.find(c => c.name === formData.name)?.nameAr || formData.name,
          variety: formData.variety,
          plantingDate: new Date(formData.plantingDate),
          harvestDate: new Date(formData.harvestDate),
          fieldSize: parseFloat(formData.fieldSize),
          status: formData.status.toUpperCase() as any,
        });
      }
      
      // Reset form
      setFormData({
        name: '',
        variety: '',
        plantingDate: '',
        harvestDate: '',
        fieldSize: '',
        status: 'planning',
      });
      setShowForm(false);
      setEditingCrop(null);
      await loadCrops();
    } catch (error) {
      console.error('Failed to save crop:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setFormData({
      name: crop.name || (crop as any).cropName || '',
      variety: crop.variety || '',
      plantingDate: new Date(crop.plantingDate).toISOString().split('T')[0],
      harvestDate: new Date(crop.harvestDate).toISOString().split('T')[0],
      fieldSize: crop.fieldSize.toString(),
      status: (crop.status?.toLowerCase() || 'planning') as Crop['status'],
    });
    setShowForm(true);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm(isArabic ? 'هل أنت متأكد من الحذف؟' : 'Êtes-vous sûr de vouloir supprimer ?')) {
      try {
        await cropsAPI.delete(id);
        await loadCrops();
      } catch (error) {
        console.error('Failed to delete crop:', error);
      }
    }
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setEditingCrop(null);
    setFormData({
      name: '',
      variety: '',
      plantingDate: '',
      harvestDate: '',
      fieldSize: '',
      status: 'planning',
    });
  };
  
  const getStatusColor = (status: Crop['status']) => {
    const colors = {
      planning: 'bg-gray-100 text-gray-800',
      planted: 'bg-blue-100 text-blue-800',
      growing: 'bg-green-100 text-green-800',
      harvesting: 'bg-yellow-100 text-yellow-800',
      harvested: 'bg-purple-100 text-purple-800',
    };
    return colors[status];
  };
  
  const getStatusLabel = (status: Crop['status']) => {
    const labels = {
      planning: { ar: 'تخطيط', fr: 'Planification' },
      planted: { ar: 'مزروع', fr: 'Planté' },
      growing: { ar: 'ينمو', fr: 'En croissance' },
      harvesting: { ar: 'حصاد', fr: 'Récolte' },
      harvested: { ar: 'محصود', fr: 'Récolté' },
    };
    return isArabic ? labels[status].ar : labels[status].fr;
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(isArabic ? 'ar-TN' : 'fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
  
  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          {isArabic ? 'المحاصيل' : 'Cultures'}
        </h1>
        {!showForm && (
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {isArabic ? 'إضافة محصول' : 'Ajouter une culture'}
          </Button>
        )}
      </div>
      
      {showForm ? (
        <Card className="mb-4">
          <h2 className="text-lg font-semibold mb-4">
            {editingCrop
              ? isArabic
                ? 'تعديل المحصول'
                : 'Modifier la culture'
              : isArabic
              ? 'إضافة محصول جديد'
              : 'Ajouter une nouvelle culture'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isArabic ? 'نوع المحصول' : 'Type de culture'}
              </label>
              <select
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                required
              >
                <option value="">
                  {isArabic ? 'اختر المحصول' : 'Sélectionner une culture'}
                </option>
                {CROPS.map((crop) => (
                  <option key={crop.name} value={crop.name}>
                    {isArabic ? crop.nameAr : crop.name}
                  </option>
                ))}
              </select>
            </div>
            
            <Input
              type="text"
              label={isArabic ? 'النوع/الصنف (اختياري)' : 'Variété (optionnel)'}
              value={formData.variety}
              onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                label={isArabic ? 'تاريخ الزراعة' : 'Date de plantation'}
                value={formData.plantingDate}
                onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                required
              />
              
              <Input
                type="date"
                label={isArabic ? 'تاريخ الحصاد المتوقع' : 'Date de récolte prévue'}
                value={formData.harvestDate}
                onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                required
              />
            </div>
            
            <Input
              type="number"
              label={isArabic ? 'حجم الحقل (هكتار)' : 'Taille du champ (hectares)'}
              value={formData.fieldSize}
              onChange={(e) => setFormData({ ...formData, fieldSize: e.target.value })}
              min="0.1"
              step="0.1"
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isArabic ? 'الحالة' : 'Statut'}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Crop['status'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="planning">{isArabic ? 'تخطيط' : 'Planification'}</option>
                <option value="planted">{isArabic ? 'مزروع' : 'Planté'}</option>
                <option value="growing">{isArabic ? 'ينمو' : 'En croissance'}</option>
                <option value="harvesting">{isArabic ? 'حصاد' : 'Récolte'}</option>
                <option value="harvested">{isArabic ? 'محصود' : 'Récolté'}</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={handleCancel}
                disabled={loading}
              >
                {isArabic ? 'إلغاء' : 'Annuler'}
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                {loading
                  ? isArabic
                    ? 'جاري الحفظ...'
                    : 'Enregistrement...'
                  : editingCrop
                  ? isArabic
                    ? 'حفظ التغييرات'
                    : 'Enregistrer les modifications'
                  : isArabic
                  ? 'إضافة'
                  : 'Ajouter'}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}
      
      {crops.length === 0 && !showForm ? (
        <Card>
          <div className="text-center py-8">
            <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {isArabic
                ? 'لا توجد محاصيل مسجلة. ابدأ بإضافة محصول جديد.'
                : 'Aucune culture enregistrée. Commencez par ajouter une nouvelle culture.'}
            </p>
            <Button variant="primary" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {isArabic ? 'إضافة محصول' : 'Ajouter une culture'}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {crops.map((crop) => (
            <Card key={crop.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Sprout className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">
                      {isArabic ? crop.nameAr : crop.name}
                    </h3>
                    {crop.variety && (
                      <span className="text-sm text-gray-600">({crop.variety})</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {isArabic ? 'زراعة:' : 'Plantation:'} {formatDate(crop.plantingDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {isArabic ? 'حصاد:' : 'Récolte:'} {formatDate(crop.harvestDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {crop.fieldSize} {isArabic ? 'هكتار' : 'hectares'}
                      </span>
                    </div>
                  </div>
                  
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      crop.status
                    )}`}
                  >
                    {getStatusLabel(crop.status)}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(crop)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(crop.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
