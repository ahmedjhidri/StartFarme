import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Weather } from './pages/Weather';
import { Crops } from './pages/Crops';
import { Irrigation } from './pages/Irrigation';
import { Market } from './pages/Market';
import { Community } from './pages/Community';
import { PestDetection } from './pages/PestDetection';
import { Profile } from './pages/Profile';

function App() {
  const { isAuthenticated, language, setLanguage } = useAuthStore();

  // Initialize language on mount
  useEffect(() => {
    const storedLang = localStorage.getItem('language') as 'ar' | 'fr' | null;
    if (storedLang && (storedLang === 'ar' || storedLang === 'fr')) {
      setLanguage(storedLang);
    } else {
      setLanguage('ar');
    }
  }, [setLanguage]);

  // Update document direction and language
  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        useAuthStore.getState().setUser(user);
      } catch (error) {
        console.error('Failed to load user from storage:', error);
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/weather" replace />}
        />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/weather" replace />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/crops" element={<Crops />} />
          <Route path="/irrigation" element={<Irrigation />} />
          <Route path="/market" element={<Market />} />
          <Route path="/community" element={<Community />} />
          <Route path="/pest-detection" element={<PestDetection />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/weather" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
