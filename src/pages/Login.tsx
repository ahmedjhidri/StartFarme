import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LanguageToggle } from '../components/layout/LanguageToggle';
import { useAuthStore } from '../stores/authStore';
import { authAPI } from '../services/api';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { language, setUser } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Mock API call - replace with actual API
      await authAPI.sendOTP(phone);
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Verify OTP with backend
      const response = await authAPI.verifyOTP(phone, code);
      
      // Save token to localStorage
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        if (response.refreshToken) {
          localStorage.setItem('refresh_token', response.refreshToken);
        }
      }
      
      // Set user data from API response
      if (response.user) {
        setUser(response.user);
        navigate('/weather');
      } else {
        // Fallback: fetch user profile
        try {
          const userProfile = await authAPI.getProfile();
          setUser(userProfile);
          navigate('/weather');
        } catch (profileError) {
          setError('Failed to load user profile');
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || err.message || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };
  
  const isArabic = language === 'ar';
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <LanguageToggle />
      </div>
      
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isArabic ? 'مرحباً بك في StartFarme' : 'Bienvenue sur StartFarme'}
          </h1>
          <p className="text-gray-600 mb-3">
            {isArabic
              ? 'منصة التكنولوجيا الزراعية للمزارعين التونسيين'
              : 'Plateforme AgriTech pour les agriculteurs tunisiens'}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              {isArabic
                ? '⚠️ وضع التجربة: يمكنك استخدام أي رقم هاتف وأي رمز من 6 أرقام'
                : '⚠️ Demo Mode: You can use any phone number and any 6-digit code'}
            </p>
          </div>
        </div>
        
        {step === 'phone' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <Input
              type="tel"
              label={isArabic ? 'رقم الهاتف' : 'Numéro de téléphone'}
              placeholder={isArabic ? 'مثال: +216 12 345 678' : 'Example: +216 12 345 678'}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {isArabic
                ? '💡 يمكنك استخدام أي رقم للاختبار'
                : '💡 You can use any number for testing'}
            </p>
            
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading || !phone}
            >
              {loading
                ? isArabic
                  ? 'جاري الإرسال...'
                  : 'Envoi en cours...'
                : isArabic
                ? 'إرسال رمز التحقق'
                : 'Envoyer le code'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                {isArabic
                  ? `تم إرسال رمز التحقق إلى ${phone}`
                  : `Code de vérification envoyé à ${phone}`}
              </p>
            </div>
            
            <Input
              type="text"
              label={isArabic ? 'رمز التحقق' : 'Code de vérification'}
              placeholder={isArabic ? 'أدخل أي 6 أرقام' : 'Enter any 6 digits'}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">
              {isArabic
                ? '💡 أي رمز من 6 أرقام سيعمل (مثال: 123456)'
                : '💡 Any 6-digit code will work (e.g., 123456)'}
            </p>
            
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setStep('phone')}
              >
                {isArabic ? 'رجوع' : 'Retour'}
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={loading || !code}
              >
                {loading
                  ? isArabic
                    ? 'جاري التحقق...'
                    : 'Vérification...'
                  : isArabic
                  ? 'تحقق'
                  : 'Vérifier'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
