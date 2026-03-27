import api from './api';

export const playlistService = {
  create: async (playlistData) => {
    const response = await api.post('/playlists', playlistData);
    return response.data;
  },

  update: async (id, playlistData) => {
    const response = await api.put(`/playlists/${id}`, playlistData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/playlists');
    return response.data;
  },

  getPublicByUserId: async (userId) => {
    const response = await api.get(`/playlists/public/${userId}`);
    return response.data;
  },

  addTrack: async (playlistId, musicData) => {
    const response = await api.post(`/playlists/${playlistId}/tracks`, musicData);
    return response.data;
  },

  removeTrack: async (playlistId, trackId) => {
    const response = await api.delete(`/playlists/${playlistId}/tracks/${trackId}`);
    return response.data;
  },

  addTracks: async (playlistId, tracks) => {
    // Usando o novo endpoint de lote no backend para evitar condições de corrida
    const response = await api.post(`/playlists/${playlistId}/tracks/batch`, tracks);
    return response.data; // Retorna a playlist completa e atualizada
  },

  importFromSpotify: async (playlistId, spotifyPlaylistId, accessToken) => {
    // Delegamos a busca e o salvamento das faixas para o backend (Proxy)
    const response = await api.post(`/playlists/${playlistId}/import-spotify`, {
      spotifyPlaylistId,
      accessToken
    });
    return response.data; // Retorna a playlist já com todas as músicas importadas
  },

  importData: async (importData) => {
    // Envia dados coletados no frontend diretamente para o backend (Bypass 403)
    const response = await api.post('/playlists/import-data', importData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/playlists/${id}`);
    return response.data;
  }
};
