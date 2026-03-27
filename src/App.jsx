import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Login/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import LibraryPage from './pages/Library/LibraryPage';
import ProfilePage from './pages/Profile/ProfilePage';
import PlaylistsPage from './pages/Playlists/PlaylistsPage';
import SettingsPage from './pages/Settings/SettingsPage';
import SpotifyCallback from './pages/SpotifyCallback';
import PrivateRoute from './routes/PrivateRoute';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import { AudioProvider } from './context/AudioContext';
import { ThemeProvider } from './context/ThemeContext';
import { ImportProvider } from './context/ImportContext';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import { authService } from './services/authService';

const AppContent = () => {
    const location = useLocation();
    const [isValidating, setIsValidating] = React.useState(true);
  
    useEffect(() => {
      const checkAuth = async () => {
        // Só validamos se houver um token
        if (localStorage.getItem('token') && localStorage.getItem('isGuest') !== 'true') {
          await authService.validateToken();
        }
        setIsValidating(false);
      };
      
      checkAuth();
    }, [location.pathname]);
  
    if (isValidating && localStorage.getItem('token')) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-black">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      );
    }
  
    return (
      <Routes>
        {/* Grupo de Autenticação com Layout Persistente (Morphing) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        
        {/* Spotify Callback */}
        <Route path="/callback" element={<SpotifyCallback />} />
  
        {/* Rotas Protegidas */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
  
        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  };
  
  function App() {
    return (
      <BrowserRouter>
        <ThemeProvider>
          <AudioProvider>
            <ImportProvider>
              <AppContent />
              <AudioPlayer />
            </ImportProvider>
          </AudioProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  }
  
  export default App;
