// Authentication Module
const AUTH = {
  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Get current user
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get token
  getToken() {
    return localStorage.getItem('token');
  },

  // Check if user is admin
  isAdmin() {
    const user = this.getUser();
    return user && user.is_admin;
  },

  // Login
  async login(username, password) {
    try {
      const response = await API.users.login(username, password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response.user;
    } catch (error) {
      throw error;
    }
  },

  // Register
  async register(username, email, password, passwordConfirm) {
    try {
      await API.users.register(username, email, password, passwordConfirm);
      // Auto login after registration
      return await this.login(username, password);
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    API.users.logout().catch(() => {}); // Fire and forget
  },

  // Update user in storage
  updateUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Require authentication
  requireAuth() {
    if (!this.isAuthenticated()) {
      navigateTo('#/login');
      showToast('Please login first', 'warning');
      return false;
    }
    return true;
  },

  // Require admin
  requireAdmin() {
    if (!this.isAdmin()) {
      navigateTo('#/');
      showToast('Admin access required', 'error');
      return false;
    }
    return true;
  }
};
