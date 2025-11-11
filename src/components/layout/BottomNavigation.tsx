import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Cloud, Sprout, ShoppingCart, User, Droplet } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../stores/authStore';

const navItems = [
  { path: '/weather', icon: Cloud, label: 'الطقس', labelFr: 'Météo' },
  { path: '/crops', icon: Sprout, label: 'المحاصيل', labelFr: 'Cultures' },
  { path: '/irrigation', icon: Droplet, label: 'الري', labelFr: 'Irrigation' },
  { path: '/market', icon: ShoppingCart, label: 'السوق', labelFr: 'Marché' },
  { path: '/profile', icon: User, label: 'الملف', labelFr: 'Profil' },
];

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useAuthStore();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1 z-50 md:hidden">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const label = language === 'ar' ? item.label : item.labelFr;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className={cn('w-5 h-5 mb-1', isActive && 'stroke-2')} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

