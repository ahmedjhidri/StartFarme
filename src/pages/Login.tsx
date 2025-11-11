import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { t } from '../utils/i18n';
import { Phone, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const { setUser, language } = useAuthStore();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!phone || phone.length < 8) {
      alert('يرجى إدخال رقم هاتف صحيح / Veuillez entrer un numéro de téléphone valide');
      return;
    }
    
    setLoading(true);
    // TODO: Implement actual OTP sending via API
    // For now, simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      alert('يرجى إدخال رمز التحقق / Veuillez entrer le code de vérification');
      return;
    }
    
    setLoading(true);
    // TODO: Implement actual OTP verification via API
    // For now, simulate API call and create mock user
    setTimeout(() => {
      setLoading(false);
      setUser({
        id: '1',
        role: 'farmer',
        phone,
        name: 'مزارع تجريبي / Fermier Test',
        language: language,
        subscriptionTier: 'free',
      });
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">StartFarme</h1>
          <p className="text-gray-600">
            {language === 'ar' 
              ? 'منصة التكنولوجيا الزراعية للمزارعين التونسيين'
              : 'Plateforme AgriTech pour les agriculteurs tunisiens'
            }
          </p>
        </div>

        {step === 'phone' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('phoneNumber', language)}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={language === 'ar' ? 'رقم الهاتف' : 'Numéro de téléphone'}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  dir="ltr"
                />
              </div>
            </div>
            
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>{t('loading', language)}</span>
              ) : (
                <>
                  <span>{t('sendOtp', language)}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('otpCode', language)}
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder={language === 'ar' ? 'رمز التحقق (6 أرقام)' : 'Code de vérification (6 chiffres)'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center text-2xl tracking-widest"
                dir="ltr"
                maxLength={6}
              />
            </div>
            
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>{t('loading', language)}</span>
              ) : (
                <>
                  <span>{t('verifyOtp', language)}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            
            <button
              onClick={() => setStep('phone')}
              className="w-full text-sm text-gray-600 hover:text-primary"
            >
              {language === 'ar' ? 'تغيير رقم الهاتف' : 'Changer le numéro de téléphone'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

