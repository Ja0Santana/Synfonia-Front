import api from './api';

export const userService = {
  updateFavoriteMusic: async (musicData) => {
    // musicData: { favoriteTrackId, favoriteTrackPreviewUrl, favoriteTrackName, favoriteTrackArtist, favoriteTrackCapaUrl }
    const response = await api.put('/users/me/favorite-music', musicData);
    return response.data;
  },

  getProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  
  removeFavoriteMusic: async () => {
    const response = await api.delete('/users/me/favorite-music');
    return response.data;
  },

  updateProfilePicture: async (fotoPerfil) => {
    const response = await api.put('/users/photo', { fotoPerfil });
    return response.data;
  }
};
