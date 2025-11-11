import React, { useState } from 'react';
import { Bug, AlertTriangle, CheckCircle, Loader, Camera, Info } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ImageUpload } from '../components/features/ImageUpload';
import { useAuthStore } from '../stores/authStore';
import { getMockPestDetection } from '../utils/pestDetectionMock';
import type { PestDetection as PestDetectionType } from '../types';

export const PestDetection: React.FC = () => {
  const { user, language } = useAuthStore();
  const isArabic = language === 'ar';
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [detectionResult, setDetectionResult] = useState<PestDetectionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [cropAffected, setCropAffected] = useState('');
  
  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setDetectionResult(null);
  };
  
  const handleDetect = async () => {
    if (!selectedImage || !cropAffected) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate AI detection (replace with actual API call)
      // In production, this would send the image to an AI/ML model
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get mock detection result based on crop type
      // Different crops will return different pests
      const mockData = getMockPestDetection(cropAffected, selectedImage);
      
      const mockResult: PestDetectionType = {
        id: Date.now().toString(),
        farmerId: user?.id || '1',
        cropAffected: cropAffected,
        image: URL.createObjectURL(selectedImage),
        detectionResult: mockData.detectionResult,
        expertVerified: false,
        timestamp: new Date(),
      };
      
      setDetectionResult(mockResult);
    } catch (error) {
      console.error('Detection failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const severityColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    critical: 'bg-red-100 text-red-800 border-red-300',
  };
  
  const severityLabels = {
    low: { ar: 'منخفض', fr: 'Faible' },
    medium: { ar: 'متوسط', fr: 'Moyen' },
    high: { ar: 'عالٍ', fr: 'Élevé' },
    critical: { ar: 'حرج', fr: 'Critique' },
  };
  
  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="flex items-center gap-3 mb-4">
        <Bug className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">
          {isArabic ? 'كشف الآفات والأمراض' : 'Détection des ravageurs et maladies'}
        </h1>
      </div>
      
      <Card className="mb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">
                {isArabic ? '⚠️ وضع التجربة' : '⚠️ Demo Mode'}
              </p>
              <p>
                {isArabic
                  ? 'النتائج الحالية هي محاكاة. في الإنتاج الفعلي، سيتم تحليل الصورة بواسطة نموذج ذكاء اصطناعي حقيقي لإعطاء نتائج دقيقة بناءً على الصورة الفعلية.'
                  : 'Current results are simulated. In production, the image will be analyzed by a real AI model to provide accurate results based on the actual image.'}
              </p>
            </div>
          </div>
        </div>
        
        <h2 className="text-lg font-semibold mb-4">
          {isArabic ? 'التعرف على الآفة' : 'Identifier le ravageur'}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isArabic ? 'المحصول المتأثر' : 'Culture affectée'}
            </label>
            <select
              value={cropAffected}
              onChange={(e) => {
                setCropAffected(e.target.value);
                setDetectionResult(null); // Reset result when crop changes
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required
            >
              <option value="">
                {isArabic ? 'اختر المحصول' : 'Sélectionner une culture'}
              </option>
              <option value="olives">{isArabic ? 'زيتون' : 'Olives'}</option>
              <option value="dates">{isArabic ? 'تمر' : 'Dates'}</option>
              <option value="tomatoes">{isArabic ? 'طماطم' : 'Tomatoes'}</option>
              <option value="wheat">{isArabic ? 'قمح' : 'Wheat'}</option>
              <option value="citrus">{isArabic ? 'حمضيات' : 'Citrus'}</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {isArabic
                ? '💡 سيتم اختيار الآفة بناءً على نوع المحصول المحدد'
                : '💡 Pest will be selected based on the chosen crop type'}
            </p>
          </div>
          
          <ImageUpload
            onImageSelect={handleImageSelect}
            label={isArabic ? 'رفع صورة للآفة أو المرض' : 'Télécharger une photo du ravageur ou de la maladie'}
          />
          
          <Button
            variant="primary"
            className="w-full"
            onClick={handleDetect}
            disabled={loading || !selectedImage || !cropAffected}
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                {isArabic ? 'جاري التحليل...' : 'Analyse en cours...'}
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                {isArabic ? 'كشف الآفة' : 'Détecter le ravageur'}
              </>
            )}
          </Button>
        </div>
      </Card>
      
      {detectionResult && (
        <Card className="border-2 border-primary">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary">
              {isArabic ? 'نتيجة الكشف' : 'Résultat de la détection'}
            </h2>
            <div
              className={`px-3 py-1 rounded-full border text-sm font-medium ${
                severityColors[detectionResult.detectionResult.severity]
              }`}
            >
              {isArabic
                ? severityLabels[detectionResult.detectionResult.severity].ar
                : severityLabels[detectionResult.detectionResult.severity].fr}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {isArabic
                  ? detectionResult.detectionResult.pestNameAr
                  : detectionResult.detectionResult.pestName}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {isArabic
                  ? detectionResult.detectionResult.descriptionAr
                  : detectionResult.detectionResult.description}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">
                  {isArabic ? 'مستوى الثقة:' : 'Niveau de confiance:'}
                </span>
                <span className="font-semibold">
                  {(detectionResult.detectionResult.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900 mb-1">
                    {isArabic ? 'الخسائر المتوقعة' : 'Pertes estimées'}
                  </p>
                  <p className="text-sm text-yellow-800">
                    {detectionResult.detectionResult.estimatedLoss}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">
                {isArabic ? 'العلاجات الموصى بها' : 'Traitements recommandés'}
              </h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {isArabic ? 'عضوي' : 'Biologique'}
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {detectionResult.detectionResult.treatment.organic.map((treatment, index) => (
                      <li key={index}>{treatment}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-blue-700 mb-2">
                    {isArabic ? 'كيميائي' : 'Chimique'}
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {detectionResult.detectionResult.treatment.chemical.map((treatment, index) => (
                      <li key={index}>{treatment}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">
                    {isArabic ? 'وقائي' : 'Préventif'}
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {detectionResult.detectionResult.treatment.preventive.map((treatment, index) => (
                      <li key={index}>{treatment}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" className="flex-1">
                {isArabic ? 'طلب رأي خبير' : 'Demander l\'avis d\'un expert'}
              </Button>
              <Button variant="primary" className="flex-1">
                {isArabic ? 'حفظ النتيجة' : 'Enregistrer le résultat'}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

