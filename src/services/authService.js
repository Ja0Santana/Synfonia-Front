import api from './api';
import { spotifyService } from './spotifyService';

export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    spotifyService.logout();

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isGuest');
    
    // Theme and Appearance
    localStorage.removeItem('synfonia-theme');
    localStorage.removeItem('synfonia-accent');
    localStorage.removeItem('synfonia-song-color');
    localStorage.removeItem('synfonia-font-size');
    localStorage.removeItem('synfonia-reduce-motion');

    // Autoplay preferences
    localStorage.removeItem('synfonia-autoplay');
    localStorage.removeItem('synfonia-favorite-autoplay');
    localStorage.removeItem('synfonia-favorite-volume');
    localStorage.removeItem('synfonia-volume');

    localStorage.removeItem('synfonia_local_history');

    window.location.href = '/login';
  },

  enterAsGuest: () => {
    localStorage.setItem('isGuest', 'true');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isGuest: () => {
    return localStorage.getItem('isGuest') === 'true';
  },

  getCurrentUser: () => {
    if (localStorage.getItem('isGuest') === 'true') {
      return { nomeCompleto: 'Convidado', guest: true };
    }
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token') || localStorage.getItem('isGuest') === 'true';
  },

  validateToken: async () => {
    const token = localStorage.getItem('token');
    const isGuest = localStorage.getItem('isGuest') === 'true';
    
    if (!token || isGuest) return;

    try {
      await api.get('/users/me');
    } catch (err) {
      // O interceptor em api.js já cuida do logout em caso de 401
      console.error('Token validation failed:', err);
    }
  }
};
