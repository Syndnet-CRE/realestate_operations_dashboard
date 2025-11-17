import api from './api';

const authService = {
  // Get GitHub OAuth URL
  async getGitHubAuthUrl() {
    const response = await api.get('/auth/github');
    return response.data.authUrl;
  },

  // Get current user
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  // Logout
  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  // Set auth token
  setToken(token) {
    localStorage.setItem('auth_token', token);
  },

  // Get auth token
  getToken() {
    return localStorage.getItem('auth_token');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  // Get user from local storage
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Set user in local storage
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },
};

export default authService;
