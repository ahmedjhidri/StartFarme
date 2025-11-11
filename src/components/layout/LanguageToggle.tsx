import React from 'react';
import { Globe } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useAuthStore();
  
  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'fr' : 'ar';
    setLanguage(newLang);
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      <Globe className="w-4 h-4" />
      <span>{language === 'ar' ? 'FR' : 'AR'}</span>
    </Button>
  );
};

