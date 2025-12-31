// Authentication Module
const auth = {
    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    // Get current user
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Get auth token
    getToken() {
        return localStorage.getItem('token');
    },

    // Check if user is admin
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.is_admin;
    },

    // Store authentication
    setAuth(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Clear authentication
    clearAuth() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get auth headers
    getHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        };
    },
};
