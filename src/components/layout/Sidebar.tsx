import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Cloud, Sprout, ShoppingCart, Users, User, X, Droplet, Bug } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';

const navItems = [
  { path: '/weather', icon: Cloud, label: 'الطقس', labelFr: 'Météo' },
  { path: '/crops', icon: Sprout, label: 'المحاصيل', labelFr: 'Cultures' },
  { path: '/irrigation', icon: Droplet, label: 'الري', labelFr: 'Irrigation' },
  { path: '/market', icon: ShoppingCart, label: 'السوق', labelFr: 'Marché' },
  { path: '/pest-detection', icon: Bug, label: 'كشف الآفات', labelFr: 'Détection' },
  { path: '/community', icon: Users, label: 'المجتمع', labelFr: 'Communauté' },
  { path: '/profile', icon: User, label: 'الملف الشخصي', labelFr: 'Profil' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useAuthStore();
  
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'h-full w-64 bg-white border-gray-200 z-50',
          language === 'ar' ? 'border-l' : 'border-r',
          'md:block',
          'fixed top-0 transform transition-transform duration-300 md:transform-none',
          language === 'ar' ? 'right-0' : 'left-0',
          !isOpen 
            ? language === 'ar' 
              ? 'translate-x-full md:translate-x-0' 
              : '-translate-x-full md:translate-x-0'
            : 'translate-x-0'
        )}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between md:hidden">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const label = language === 'ar' ? item.label : item.labelFr;
            
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-right',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

