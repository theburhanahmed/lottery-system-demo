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
  async register(username, email, password, passwordConfirm, firstName, lastName, dateOfBirth, ageVerificationConsent) {
    try {
      await API.users.register(username, email, password, passwordConfirm, firstName, lastName, dateOfBirth, ageVerificationConsent);
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
      // Check if we're on a separate HTML file or on the main SPA
      if (!(window.location.pathname.endsWith('index.html') || window.location.pathname === '/')) {
        // For separate HTML files, navigate to login.html
        navigateTo('./login.html');
      } else {
        // For SPA, use hash navigation
        navigateTo('#/login');
      }
      UI.showToast('Please login first', 'warning');
      return false;
    }
    return true;
  },

  // Require admin
  requireAdmin() {
    if (!this.isAdmin()) {
      // Check if we're on a separate HTML file or on the main SPA
      if (!(window.location.pathname.endsWith('index.html') || window.location.pathname === '/')) {
        // For separate HTML files, navigate to index.html
        navigateTo('../index.html');
      } else {
        // For SPA, use hash navigation
        navigateTo('#/');
      }
      UI.showToast('Admin access required', 'error');
      return false;
    }
    return true;
  }
};
