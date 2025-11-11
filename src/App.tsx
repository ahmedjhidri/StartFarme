import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Navigation } from './components/Navigation';
import { LanguageToggle } from './components/LanguageToggle';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Weather } from './pages/Weather';
import { Crops } from './pages/Crops';
import { Market } from './pages/Market';
import { Forum } from './pages/Forum';
import { Profile } from './pages/Profile';
import { useEffect } from 'react';

function App() {
  const { isAuthenticated, language } = useAuthStore();

  // Update document direction and language based on user preference
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Protected Route Component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                  <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-primary">StartFarme</h1>
                    <LanguageToggle />
                  </div>
                </header>

                {/* Main Content */}
                <div className="flex">
                  {/* Navigation - Sidebar on desktop, bottom bar on mobile */}
                  <Navigation />

                  {/* Page Content */}
                  <main className="flex-1 md:ml-64">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/weather" element={<Weather />} />
                      <Route path="/crops" element={<Crops />} />
                      <Route path="/market" element={<Market />} />
                      <Route path="/forum" element={<Forum />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
