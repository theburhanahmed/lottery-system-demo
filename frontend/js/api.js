// API Communication Module
const api = {
    baseUrl: 'http://localhost:8000/api',

    async request(method, endpoint, data = null, token = null) {
        const url = `${this.baseUrl}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.detail || result.error || 'API Error');
            }

            return result;
        } catch (error) {
            throw error;
        }
    },

    // Authentication
    async register(username, email, password) {
        return this.request('POST', '/users/register/', {
            username,
            email,
            password,
        });
    },

    async login(username, password) {
        return this.request('POST', '/users/login/', {
            username,
            password,
        });
    },

    // Users
    async getUserProfile(token) {
        return this.request('GET', '/users/profile/', null, token);
    },

    async updateProfile(data, token) {
        return this.request('PUT', '/users/profile/', data, token);
    },

    async getWalletBalance(token) {
        return this.request('GET', '/users/wallet/', null, token);
    },

    // Lotteries
    async getLotteries(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return this.request('GET', `/lotteries/?${queryString}`);
    },

    async getLotteryDetail(id) {
        return this.request('GET', `/lotteries/${id}/`);
    },

    async createLottery(data, token) {
        return this.request('POST', '/lotteries/', data, token);
    },

    async updateLottery(id, data, token) {
        return this.request('PUT', `/lotteries/${id}/`, data, token);
    },

    async deleteLottery(id, token) {
        return this.request('DELETE', `/lotteries/${id}/`, null, token);
    },

    // Tickets
    async buyTicket(lotteryId, token) {
        return this.request('POST', `/lotteries/${lotteryId}/buy-ticket/`, {}, token);
    },

    async getMyTickets(token) {
        return this.request('GET', '/tickets/', null, token);
    },

    async getLotteryTickets(lotteryId, token) {
        return this.request('GET', `/lotteries/${lotteryId}/my-tickets/`, null, token);
    },

    // Draw
    async conductDraw(lotteryId, token) {
        return this.request('POST', `/lotteries/${lotteryId}/draw/`, {}, token);
    },

    async getLotteryResults(lotteryId) {
        return this.request('GET', `/lotteries/${lotteryId}/results/`);
    },

    async getLotteryWinner(lotteryId) {
        return this.request('GET', `/lotteries/${lotteryId}/winner/`);
    },

    // Transactions
    async getTransactions(token) {
        return this.request('GET', '/transactions/', null, token);
    },

    async getTransactionDetail(id, token) {
        return this.request('GET', `/transactions/${id}/`, null, token);
    },

    // Admin
    async getParticipants(lotteryId, token) {
        return this.request('GET', `/lotteries/${lotteryId}/participants/`, null, token);
    },

    async getLotteryStats(lotteryId, token) {
        return this.request('GET', `/lotteries/${lotteryId}/stats/`, null, token);
    },
};
