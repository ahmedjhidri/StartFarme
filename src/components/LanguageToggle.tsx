import { useAuthStore } from '../store/authStore';
import { Languages } from 'lucide-react';

export const LanguageToggle = () => {
  const { language, setLanguage } = useAuthStore();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'fr' : 'ar');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Toggle language"
    >
      <Languages className="w-5 h-5" />
      <span className="font-medium">{language.toUpperCase()}</span>
    </button>
  );
};

