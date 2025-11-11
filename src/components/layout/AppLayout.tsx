import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { BottomNavigation } from './BottomNavigation';
import { Sidebar } from './Sidebar';
import { LanguageToggle } from './LanguageToggle';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { language } = useAuthStore();
  const isRTL = language === 'ar';
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className={`hidden md:block md:fixed md:inset-y-0 md:w-64 ${isRTL ? 'md:right-0' : 'md:left-0'}`}>
        <Sidebar isOpen={true} onClose={() => {}} />
      </div>
      
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main Content */}
      <div className={isRTL ? 'md:mr-64' : 'md:ml-64'}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-primary">StartFarme</h1>
            </div>
            <LanguageToggle />
          </div>
        </header>
        
        {/* Page Content */}
        <main>
          <Outlet />
        </main>
      </div>
      
      {/* Bottom Navigation (Mobile only) */}
      <BottomNavigation />
    </div>
  );
};

