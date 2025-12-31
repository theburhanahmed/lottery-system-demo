// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// API Module
const API = {
  // Get authorization header
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  // Generic fetch with error handling
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.hash = '#/login';
        throw new Error('Session expired. Please login again.');
      }

      const data = response.status === 204 ? null : await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.error || data.detail || 'Request failed',
          data
        };
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Users API
  users: {
    register(username, email, password, passwordConfirm) {
      return API.request('/users/register/', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, password_confirm: passwordConfirm })
      });
    },

    login(username, password) {
      return API.request('/users/login/', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
    },

    getProfile() {
      return API.request('/users/profile/');
    },

    updateProfile(data) {
      return API.request('/users/update_profile/', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },

    getWallet() {
      return API.request('/users/wallet/');
    },

    addFunds(amount) {
      return API.request('/users/add_funds/', {
        method: 'POST',
        body: JSON.stringify({ amount })
      });
    },

    getTransactions() {
      return API.request('/users/transactions/');
    },

    logout() {
      return API.request('/users/logout/', { method: 'POST' });
    }
  },

  // Lotteries API
  lotteries: {
    list(status = '', ordering = '-created_at') {
      let url = '/lotteries/';
      const params = [];
      if (status) params.push(`status=${status}`);
      if (ordering) params.push(`ordering=${ordering}`);
      if (params.length) url += `?${params.join('&')}`;
      return API.request(url);
    },

    get(id) {
      return API.request(`/lotteries/${id}/`);
    },

    create(data) {
      return API.request('/lotteries/', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    update(id, data) {
      return API.request(`/lotteries/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },

    delete(id) {
      return API.request(`/lotteries/${id}/`, { method: 'DELETE' });
    },

    buyTicket(id, quantity = 1) {
      return API.request(`/lotteries/${id}/buy_ticket/`, {
        method: 'POST',
        body: JSON.stringify({ quantity })
      });
    },

    getResults(id) {
      return API.request(`/lotteries/${id}/results/`);
    },

    getWinner(id) {
      return API.request(`/lotteries/${id}/winner/`);
    },

    conductDraw(id) {
      return API.request(`/lotteries/${id}/draw/`, { method: 'POST' });
    },

    getMyTickets(id) {
      return API.request(`/lotteries/${id}/my_tickets/`);
    },

    getParticipants(id) {
      return API.request(`/lotteries/${id}/participants/`);
    },

    getStats(id) {
      return API.request(`/lotteries/${id}/stats/`);
    }
  },

  // Tickets API
  tickets: {
    list() {
      return API.request('/tickets/');
    },

    get(id) {
      return API.request(`/tickets/${id}/`);
    }
  },

  // Transactions API
  transactions: {
    list(type = '', status = '') {
      let url = '/transactions/';
      const params = [];
      if (type) params.push(`type=${type}`);
      if (status) params.push(`status=${status}`);
      if (params.length) url += `?${params.join('&')}`;
      return API.request(url);
    },

    getSummary() {
      return API.request('/transactions/summary/');
    }
  },

  // Payment Methods API
  paymentMethods: {
    list() {
      return API.request('/payment-methods/');
    },

    get(id) {
      return API.request(`/payment-methods/${id}/`);
    },

    create(data) {
      return API.request('/payment-methods/', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    update(id, data) {
      return API.request(`/payment-methods/${id}/`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },

    delete(id) {
      return API.request(`/payment-methods/${id}/`, { method: 'DELETE' });
    },

    setPrimary(id) {
      return API.request(`/payment-methods/${id}/set_primary/`, { method: 'POST' });
    }
  },

  // Withdrawals API
  withdrawals: {
    list() {
      return API.request('/withdrawals/');
    },

    get(id) {
      return API.request(`/withdrawals/${id}/`);
    },

    request(amount, paymentMethodId) {
      return API.request('/withdrawals/', {
        method: 'POST',
        body: JSON.stringify({
          amount,
          payment_method: paymentMethodId
        })
      });
    },

    approve(id) {
      return API.request(`/withdrawals/${id}/approve/`, { method: 'POST' });
    },

    reject(id) {
      return API.request(`/withdrawals/${id}/reject/`, { method: 'POST' });
    }
  }
};
