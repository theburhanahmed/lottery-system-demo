// API Configuration
// Use relative path so it works through nginx proxy in Docker
const API_BASE_URL = '/api';

// Request cache for GET requests
const API_CACHE = {
  cache: new Map(),
  maxAge: 60000, // 1 minute default

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() - item.timestamp > item.maxAge) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  },

  set(key, data, maxAge = this.maxAge) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      maxAge
    });
  },

  clear() {
    this.cache.clear();
  },

  clearPattern(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
};

// API Module
const API = {
  // Get authorization header
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  // Generic fetch with error handling and caching
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const method = options.method || 'GET';
    const useCache = options.useCache !== false && method === 'GET';
    const cacheKey = `${method}:${url}`;

    // Check cache for GET requests
    if (useCache) {
      const cached = API_CACHE.get(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }

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

      let data;
      if (response.status === 204) {
        data = null;
      } else {
        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // For non-JSON responses, try to get text
          const text = await response.text();
          try {
            data = JSON.parse(text);
          } catch {
            data = { message: text };
          }
        }
      }

      if (!response.ok) {
        throw {
          status: response.status,
          message: data?.error || data?.detail || 'Request failed',
          data
        };
      }

      // Cache successful GET responses
      if (useCache && response.ok) {
        const cacheMaxAge = options.cacheMaxAge || API_CACHE.maxAge;
        API_CACHE.set(cacheKey, data, cacheMaxAge);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      // If it's a network error or similar (no response object), handle it appropriately
      if (error.name === 'TypeError' || !error.status) {
        throw new Error('Network error or server unavailable. Please check your connection and try again.');
      }
      throw error;
    }
  },

  // Users API
  users: {
    register(username, email, password, passwordConfirm, firstName, lastName, dateOfBirth, ageVerificationConsent) {
      return API.request('/users/register/', {
        method: 'POST',
        body: JSON.stringify({
          username,
          email,
          password,
          password_confirm: passwordConfirm,
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth,
          age_verification_consent: ageVerificationConsent
        })
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

    addFunds(amount, paymentMethodId = null, savePaymentMethod = false) {
      return API.request('/users/add_funds/', {
        method: 'POST',
        body: JSON.stringify({ 
          amount,
          payment_method_id: paymentMethodId,
          save_payment_method: savePaymentMethod
        })
      });
    },

    // Payment methods
    payments: {
      createIntent(amount, paymentMethodId = null, savePaymentMethod = false) {
        return API.request('/payments/create-intent/', {
          method: 'POST',
          body: JSON.stringify({
            amount: parseFloat(amount),
            payment_method_id: paymentMethodId,
            save_payment_method: savePaymentMethod
          })
        });
      },

      confirm(paymentIntentId, paymentMethodId = null) {
        return API.request('/payments/confirm-intent/', {
          method: 'POST',
          body: JSON.stringify({
            payment_intent_id: paymentIntentId,
            payment_method_id: paymentMethodId
          })
        });
      },

      getIntent(paymentIntentId) {
        return API.request(`/payments/intent/${paymentIntentId}/`);
      },

      saveMethod(paymentMethodId, setAsPrimary = false) {
        return API.request('/payments/save-method/', {
          method: 'POST',
          body: JSON.stringify({
            payment_method_id: paymentMethodId,
            set_as_primary: setAsPrimary
          })
        });
      },

      listMethods() {
        return API.request('/payments/methods/');
      },

      deleteMethod(paymentMethodId) {
        return API.request(`/payments/methods/${paymentMethodId}/`, {
          method: 'DELETE'
        });
      },

      getCustomer() {
        return API.request('/payments/customer/');
      }
    },

    getTransactions() {
      return API.request('/users/transactions/');
    },

    getDashboardSummary() {
      return API.request('/users/dashboard_summary/');
    },

    logout() {
      return API.request('/users/logout/', { method: 'POST' });
    },

    verifyAge(dateOfBirth) {
      return API.request('/users/verify_age/', {
        method: 'POST',
        body: JSON.stringify({ date_of_birth: dateOfBirth })
      });
    },

    selfExclude(days) {
      return API.request('/users/self_exclude/', {
        method: 'POST',
        body: JSON.stringify({ days })
      });
    },

    setDepositLimits(limits) {
      return API.request('/users/set_deposit_limits/', {
        method: 'POST',
        body: JSON.stringify(limits)
      });
    },

    getResponsibleGamingStatus() {
      return API.request('/users/responsible_gaming_status/');
    },

    submitKYC(formData) {
      return API.request('/users/submit_kyc/', {
        method: 'POST',
        headers: {},
        body: formData
      });
    },

    getKYCStatus() {
      return API.request('/users/kyc_status/');
    },

    exportData(format = 'json') {
      return API.request(`/users/data_export/?format=${format}`);
    },

    deleteAccount() {
      return API.request('/users/delete_account/', {
        method: 'POST',
        body: JSON.stringify({ confirmation: 'DELETE' })
      });
    }
  },

  // Authentication API (for password reset and email verification)
  auth: {
    passwordResetRequest(email) {
      return API.request('/users/password-reset-request/', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    },

    passwordReset(token, newPassword) {
      return API.request('/users/password-reset/', {
        method: 'POST',
        body: JSON.stringify({ token, new_password: newPassword, confirm_password: newPassword })
      });
    },

    verifyEmail(token) {
      return API.request('/users/verify-email/', {
        method: 'POST',
        body: JSON.stringify({ token })
      });
    },

    changePassword(currentPassword, newPassword) {
      return API.request('/users/change-password/', {
        method: 'POST',
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword,
          confirm_new_password: newPassword
        })
      });
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
    },

    getAll(filters = {}) {
      let url = '/tickets/all/?';
      const params = [];
      if (filters.lottery_status) params.push(`lottery_status=${filters.lottery_status}`);
      if (filters.is_winner !== undefined) params.push(`is_winner=${filters.is_winner}`);
      if (filters.search) params.push(`search=${filters.search}`);
      return API.request(url + params.join('&'));
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
    },

    getReceipt(id) {
      return `${API_BASE_URL}/transactions/${id}/receipt/`;
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

    request(amount, paymentMethodId, bankDetails = {}, remarks = '') {
      const body = { amount };
      if (paymentMethodId) body.payment_method_id = paymentMethodId;
      if (Object.keys(bankDetails).length > 0) body.bank_details = bankDetails;
      if (remarks) body.remarks = remarks;
      
      return API.request('/withdrawals/', {
        method: 'POST',
        body: JSON.stringify(body)
      });
    },

    approve(id) {
      return API.request(`/withdrawals/${id}/approve/`, { method: 'POST' });
    },

    reject(id, reason) {
      return API.request(`/withdrawals/${id}/reject/`, {
        method: 'POST',
        body: JSON.stringify({ rejection_reason: reason })
      });
    },

    approve(id, adminNotes) {
      return API.request(`/withdrawals/${id}/approve/`, {
        method: 'POST',
        body: JSON.stringify({ admin_notes: adminNotes || '' })
      });
    },

    adminList(filters = {}) {
      let url = '/withdrawals/admin_list/?';
      const params = [];
      if (filters.status) params.push(`status=${filters.status}`);
      if (filters.start_date) params.push(`start_date=${filters.start_date}`);
      if (filters.end_date) params.push(`end_date=${filters.end_date}`);
      if (filters.search) params.push(`search=${filters.search}`);
      return API.request(url + params.join('&'));
    },

    getLimits() {
      return API.request('/withdrawals/limits/');
    }
  },

  // Analytics API (admin)
  analytics: {
    getDashboard(days = 30) {
      return API.request(`/admin/analytics/dashboard/?days=${days}`);
    },

    getFinancial(startDate, endDate) {
      let url = '/admin/analytics/financial/?';
      if (startDate) url += `start_date=${startDate}&`;
      if (endDate) url += `end_date=${endDate}&`;
      return API.request(url);
    },

    getUsers(startDate, endDate) {
      let url = '/admin/analytics/users/?';
      if (startDate) url += `start_date=${startDate}&`;
      if (endDate) url += `end_date=${endDate}&`;
      return API.request(url);
    },

    getLotteries(startDate, endDate) {
      let url = '/admin/analytics/lotteries/?';
      if (startDate) url += `start_date=${startDate}&`;
      if (endDate) url += `end_date=${endDate}&`;
      return API.request(url);
    },

    getCharts(type = 'revenue', days = 30) {
      return API.request(`/admin/analytics/charts/?type=${type}&days=${days}`);
    },

    downloadFinancialReport(startDate, endDate) {
      let url = `/admin/analytics/reports_financial/?format=csv`;
      if (startDate) url += `&start_date=${startDate}`;
      if (endDate) url += `&end_date=${endDate}`;
      window.open(`${API_BASE_URL}${url}`, '_blank');
    },

    downloadUserReport(startDate, endDate) {
      let url = `/admin/analytics/reports_users/?format=csv`;
      if (startDate) url += `&start_date=${startDate}`;
      if (endDate) url += `&end_date=${endDate}`;
      window.open(`${API_BASE_URL}${url}`, '_blank');
    },

    downloadTransactions(startDate, endDate, filters = {}) {
      let url = `/admin/analytics/reports_transactions/?`;
      if (startDate) url += `start_date=${startDate}&`;
      if (endDate) url += `end_date=${endDate}&`;
      if (filters.type) url += `type=${filters.type}&`;
      if (filters.status) url += `status=${filters.status}&`;
      window.open(`${API_BASE_URL}${url}`, '_blank');
    }
  },

  // Admin API
  admin: {
    users: {
      list(filters = {}) {
        let url = '/admin/users/?';
        const params = [];
        if (filters.role) params.push(`role=${filters.role}`);
        if (filters.is_active !== undefined) params.push(`is_active=${filters.is_active}`);
        if (filters.search) params.push(`search=${filters.search}`);
        return API.request(url + params.join('&'));
      },

      get(id) {
        return API.request(`/admin/users/${id}/`);
      },

      suspend(id) {
        return API.request(`/admin/users/${id}/suspend/`, { method: 'POST' });
      },

      activate(id) {
        return API.request(`/admin/users/${id}/activate/`, { method: 'POST' });
      },

      adjustWallet(id, amount, reason) {
        return API.request(`/admin/users/${id}/adjust_wallet/`, {
          method: 'POST',
          body: JSON.stringify({ amount, reason })
        });
      }
    },

    transactions: {
      list(filters = {}) {
        let url = '/admin/transactions/?';
        const params = [];
        if (filters.type) params.push(`type=${filters.type}`);
        if (filters.status) params.push(`status=${filters.status}`);
        if (filters.user_id) params.push(`user_id=${filters.user_id}`);
        if (filters.start_date) params.push(`start_date=${filters.start_date}`);
        if (filters.end_date) params.push(`end_date=${filters.end_date}`);
        return API.request(url + params.join('&'));
      },

      refund(id, reason) {
        return API.request(`/admin/transactions/${id}/refund/`, {
          method: 'POST',
          body: JSON.stringify({ reason })
        });
      }
    }
  }
};