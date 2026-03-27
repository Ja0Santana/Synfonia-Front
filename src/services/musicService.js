import api from './api';

export const musicService = {
  search: async (nome, tipo = 'all') => {
    const response = await api.get('/musicas/search', {
      params: { nome, tipo }
    });
    return response.data;
  },

  saveToCollection: async (userId, musicData) => {
    const response = await api.post(`/users/${userId}/songs`, musicData);
    return response.data;
  },

  getCollection: async (userId) => {
    const response = await api.get(`/users/${userId}/songs`);
    return response.data;
  },

  removeFromCollection: async (userId, trackId) => {
    await api.delete(`/users/${userId}/songs/${trackId}`);
  },

  getById: async (id) => {
    const response = await api.get(`/musicas/${id}`);
    return response.data;
  },

  addToHistory: async (trackId, musicData) => {
    await api.post(`/historico/${trackId}`, musicData || {});
  },

  getHistory: async () => {
    const response = await api.get('/historico');
    return response.data;
  },

  // Remover músicas por fonte (Ex: SPOTIFY)
  deleteBySource: async (userId, source) => {
    const response = await api.delete(`/users/${userId}/songs/source/${source}`);
    return response.data;
  }

};

