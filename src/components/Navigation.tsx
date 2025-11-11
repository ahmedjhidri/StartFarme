import { Link, useLocation } from 'react-router-dom';
import { Home, Cloud, Sprout, ShoppingBag, MessageSquare, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { t } from '../utils/i18n';

const navItems = [
  { path: '/', icon: Home, key: 'home' as const },
  { path: '/weather', icon: Cloud, key: 'weather' as const },
  { path: '/crops', icon: Sprout, key: 'crops' as const },
  { path: '/market', icon: ShoppingBag, key: 'market' as const },
  { path: '/forum', icon: MessageSquare, key: 'forum' as const },
  { path: '/profile', icon: User, key: 'profile' as const },
];

export const Navigation = () => {
  const location = useLocation();
  const { language } = useAuthStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:relative md:border-t-0 md:border-r md:w-64 md:h-screen">
      <div className="flex md:flex-col md:py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex-1 md:flex-none flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 
                px-4 py-3 md:px-6 md:py-3 
                text-sm font-medium
                transition-colors
                ${isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{t(item.key, language)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

