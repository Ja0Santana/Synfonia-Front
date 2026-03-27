import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});


// Interceptor para adicionar o token JWT em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para lidar com respostas e erros globais (ex: token expirado)
api.interceptors.response.use(
  (response) => {
    // Renovação Sliding Session: Se o servidor enviou um novo token, atualiza o localStorage
    const newToken = response.headers['new-token'];
    if (newToken) {
      localStorage.setItem('token', newToken);
    }
    return response;
  },
  (error) => {
    // Se for 401 e NÃO for uma tentativa de login, limpa o token e redireciona
    // Isso evita o 'refresh' infinito quando a senha está incorreta
    if (error.response && error.response.status === 401) {
      const isAuthRequest = error.config.url.includes('/auth/');
      
      if (!isAuthRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?session_expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
