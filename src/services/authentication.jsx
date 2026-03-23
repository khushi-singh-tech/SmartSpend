import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/authentication/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        email: userData.email,
        name: userData.name,
        role: userData.role
      }));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/authentication/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        email: credentials.email,
        name: credentials.email,
        role: 'USER'
      }));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};