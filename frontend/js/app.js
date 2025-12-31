// Application State
const app = {
    currentPage: 'home',
    user: null,
    token: null,
    apiUrl: 'http://localhost:8000/api',

    async init() {
        console.log('Initializing Lottery System...');
        this.setupEventListeners();
        this.checkAuth();
        this.loadPage('home');
    },

    setupEventListeners() {
        // Page navigation
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.loadPage(page);
            });
        });

        // Mobile menu toggle
        const hamburger = document.getElementById('hamburger');
        const navbarMenu = document.getElementById('navbarMenu');
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                navbarMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navbarMenu) {
                    navbarMenu.classList.remove('active');
                }
            });
        });

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Modal close button
        const closeModal = document.querySelector('.close-modal');
        const modal = document.getElementById('modal');
        if (closeModal && modal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    },

    checkAuth() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            this.token = token;
            this.user = JSON.parse(user);
            this.updateNavbar();
        } else {
            this.updateNavbar();
        }
    },

    updateNavbar() {
        const authMenu = document.getElementById('authMenuNav');
        const userMenu = document.getElementById('userMenuNav');
        const adminMenu = document.getElementById('adminMenuNav');

        if (this.user) {
            if (authMenu) authMenu.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            if (adminMenu && this.user.is_admin) {
                adminMenu.style.display = 'block';
            }
        } else {
            if (authMenu) authMenu.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
            if (adminMenu) adminMenu.style.display = 'none';
        }
    },

    loadPage(page) {
        // Update active nav link
        document.querySelectorAll('[data-page]').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });

        this.currentPage = page;
        const container = document.getElementById('pageContainer');
        
        // Check authentication for protected pages
        const protectedPages = ['dashboard', 'mytickets', 'profile', 'wallet', 'history', 
                               'admin-dashboard', 'admin-create', 'admin-manage', 'admin-users', 'admin-analytics'];
        
        if (protectedPages.includes(page) && !this.user) {
            this.showToast('Please login to access this page', 'warning');
            this.loadPage('login');
            return;
        }

        // Check admin access
        const adminPages = ['admin-dashboard', 'admin-create', 'admin-manage', 'admin-users', 'admin-analytics'];
        if (adminPages.includes(page) && (!this.user || !this.user.is_admin)) {
            this.showToast('Admin access required', 'error');
            this.loadPage('home');
            return;
        }

        container.innerHTML = '<div class="text-center"><div class="spinner mt-20"></div></div>';
        
        // Load page content
        switch(page) {
            case 'home':
                this.loadHome(container);
                break;
            case 'login':
                this.loadLogin(container);
                break;
            case 'register':
                this.loadRegister(container);
                break;
            case 'lotteries':
                this.loadLotteries(container);
                break;
            case 'dashboard':
                this.loadDashboard(container);
                break;
            case 'mytickets':
                this.loadMyTickets(container);
                break;
            case 'profile':
                this.loadProfile(container);
                break;
            case 'wallet':
                this.loadWallet(container);
                break;
            case 'history':
                this.loadHistory(container);
                break;
            case 'admin-dashboard':
                this.loadAdminDashboard(container);
                break;
            case 'admin-create':
                this.loadAdminCreate(container);
                break;
            case 'admin-manage':
                this.loadAdminManage(container);
                break;
            case 'admin-users':
                this.loadAdminUsers(container);
                break;
            case 'admin-analytics':
                this.loadAdminAnalytics(container);
                break;
            default:
                this.loadHome(container);
        }
    },

    async logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.token = null;
        this.user = null;
        this.updateNavbar();
        this.showToast('Logged out successfully', 'success');
        this.loadPage('home');
    },

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    },

    // Page loading methods
    loadHome(container) {
        container.innerHTML = `
            <div class="page-header">
                <h1>Welcome to Lottery System</h1>
                <p>Buy tickets, win prizes, and test your luck!</p>
            </div>
            
            <div class="grid grid--2 mt-20">
                <div class="card">
                    <div class="card-header">
                        <h3>🎰 How It Works</h3>
                    </div>
                    <div class="card-body">
                        <ol style="margin-left: 20px; line-height: 2;">
                            <li>Create an account or login</li>
                            <li>Browse available lotteries</li>
                            <li>Purchase lottery tickets</li>
                            <li>Wait for draw date</li>
                            <li>Check if you won!</li>
                            <li>Claim your prize</li>
                        </ol>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h3>📊 Active Lotteries</h3>
                    </div>
                    <div class="card-body" id="activeLotteriesHome">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
            
            ${!this.user ? `
                <div class="card mt-20">
                    <div class="card-header">
                        <h3>Get Started</h3>
                    </div>
                    <div class="card-body">
                        <p>Don't have an account? Join us now!</p>
                    </div>
                    <div class="card-footer">
                        <a href="#" data-page="register" class="btn btn--primary">Register Now</a>
                        <a href="#" data-page="login" class="btn btn--outline">Login</a>
                    </div>
                </div>
            ` : ''}
        `;
        
        // Rebind event listeners
        this.setupEventListeners();
        
        // Load active lotteries
        this.loadActiveLotteries('activeLotteriesHome');
    },

    async loadActiveLotteries(elementId) {
        try {
            const response = await fetch(`${this.apiUrl}/lotteries/?status=ACTIVE`);
            const data = await response.json();
            const element = document.getElementById(elementId);
            
            if (data.results && data.results.length > 0) {
                element.innerHTML = data.results.slice(0, 3).map(lottery => `
                    <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid var(--border-color);">
                        <h4>${lottery.name}</h4>
                        <p style="font-size: 0.875rem; color: var(--text-light);">
                            Price: $${lottery.ticket_price} | Remaining: ${lottery.available_tickets}
                        </p>
                    </div>
                `).join('');
            } else {
                element.innerHTML = '<p>No active lotteries at the moment.</p>';
            }
        } catch (error) {
            console.error('Error loading active lotteries:', error);
        }
    },

    loadLogin(container) {
        container.innerHTML = `
            <div style="max-width: 500px; margin: 40px auto;">
                <div class="card">
                    <div class="card-header">
                        <h2>Login</h2>
                    </div>
                    <form id="loginForm" class="card-body">
                        <div class="form-group">
                            <label class="form-label">Username</label>
                            <input type="text" id="loginUsername" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input type="password" id="loginPassword" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn--primary btn--full-width">Login</button>
                    </form>
                    <div class="card-footer" style="gap: 10px;">
                        <p style="margin: 0; flex: 1;">Don't have an account? <a href="#" data-page="register">Register here</a></p>
                    </div>
                </div>
            </div>
        `;
        
        this.setupEventListeners();
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
    },

    async handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const response = await api.login(username, password);
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                this.token = response.token;
                this.user = response.user;
                this.updateNavbar();
                this.showToast('Login successful!', 'success');
                this.loadPage('dashboard');
            }
        } catch (error) {
            this.showToast(error.message || 'Login failed', 'error');
        }
    },

    loadRegister(container) {
        container.innerHTML = `
            <div style="max-width: 500px; margin: 40px auto;">
                <div class="card">
                    <div class="card-header">
                        <h2>Register</h2>
                    </div>
                    <form id="registerForm" class="card-body">
                        <div class="form-group">
                            <label class="form-label">Username</label>
                            <input type="text" id="regUsername" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" id="regEmail" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input type="password" id="regPassword" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Confirm Password</label>
                            <input type="password" id="regConfirmPassword" class="form-control" required>
                        </div>
                        <button type="submit" class="btn btn--primary btn--full-width">Register</button>
                    </form>
                    <div class="card-footer">
                        <p style="margin: 0; flex: 1;">Already have an account? <a href="#" data-page="login">Login here</a></p>
                    </div>
                </div>
            </div>
        `;
        
        this.setupEventListeners();
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
    },

    async handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        
        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }
        
        try {
            const response = await api.register(username, email, password);
            this.showToast('Registration successful! Please login.', 'success');
            this.loadPage('login');
        } catch (error) {
            this.showToast(error.message || 'Registration failed', 'error');
        }
    },

    async loadLotteries(container) {
        container.innerHTML = `
            <div class="page-header">
                <h2>Available Lotteries</h2>
            </div>
            <div class="grid grid--3" id="lotteriesGrid">
                <div class="text-center"><div class="spinner"></div></div>
            </div>
        `;
        
        try {
            const response = await fetch(`${this.apiUrl}/lotteries/?status=ACTIVE`);
            const data = await response.json();
            const grid = document.getElementById('lotteriesGrid');
            
            if (data.results && data.results.length > 0) {
                grid.innerHTML = data.results.map(lottery => `
                    <div class="card">
                        <div class="card-header">
                            <h4>${lottery.name}</h4>
                        </div>
                        <div class="card-body">
                            <p>${lottery.description}</p>
                            <p><strong>Ticket Price:</strong> $${lottery.ticket_price}</p>
                            <p><strong>Available Tickets:</strong> ${lottery.available_tickets}</p>
                            <p><strong>Prize:</strong> $${lottery.prize_amount}</p>
                            <p><strong>Draw Date:</strong> ${new Date(lottery.draw_date).toLocaleDateString()}</p>
                        </div>
                        <div class="card-footer">
                            ${this.user ? `
                                <button class="btn btn--primary btn--full-width" onclick="app.buyTicket('${lottery.id}')">Buy Ticket</button>
                            ` : `
                                <a href="#" data-page="login" class="btn btn--primary btn--full-width">Login to Buy</a>
                            `}
                        </div>
                    </div>
                `).join('');
            } else {
                grid.innerHTML = '<div class="col-span-3 text-center"><p>No active lotteries available.</p></div>';
            }
        } catch (error) {
            document.getElementById('lotteriesGrid').innerHTML = '<p>Error loading lotteries</p>';
        }
    },

    async buyTicket(lotteryId) {
        if (!this.user) {
            this.loadPage('login');
            return;
        }
        
        try {
            const response = await api.buyTicket(lotteryId, this.token);
            if (response.success) {
                this.showToast('Ticket purchased successfully!', 'success');
                this.loadPage('mytickets');
            }
        } catch (error) {
            this.showToast(error.message || 'Failed to buy ticket', 'error');
        }
    },

    async loadDashboard(container) {
        container.innerHTML = `
            <div class="page-header">
                <h2>My Dashboard</h2>
            </div>
            <div id="dashboardContent"><div class="spinner"></div></div>
        `;
        
        try {
            const response = await api.getUserProfile(this.token);
            const dashboardContent = document.getElementById('dashboardContent');
            
            dashboardContent.innerHTML = `
                <div class="grid grid--3">
                    <div class="card">
                        <div class="card-body">
                            <h4>💰 Wallet Balance</h4>
                            <p style="font-size: 2rem; color: var(--primary-color); margin: 10px 0;">$${response.wallet_balance}</p>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h4>🎫 Total Tickets</h4>
                            <p style="font-size: 2rem; color: var(--warning-color); margin: 10px 0;">${response.total_tickets_bought || 0}</p>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h4>🏆 Wins</h4>
                            <p style="font-size: 2rem; color: var(--success-color); margin: 10px 0;">${response.total_wins || 0}</p>
                        </div>
                    </div>
                </div>
                
                <div class="card mt-20">
                    <div class="card-header">
                        <h3>Recent Activity</h3>
                    </div>
                    <div class="card-body">
                        <p>Your recent activity will appear here.</p>
                    </div>
                </div>
            `;
        } catch (error) {
            document.getElementById('dashboardContent').innerHTML = '<p>Error loading dashboard</p>';
        }
    },

    loadMyTickets(container) {
        container.innerHTML = `
            <div class="page-header">
                <h2>My Tickets</h2>
            </div>
            <div id="ticketsContent"><div class="spinner"></div></div>
        `;
        
        this.loadTickets();
    },

    async loadTickets() {
        try {
            const response = await api.getMyTickets(this.token);
            const ticketsContent = document.getElementById('ticketsContent');
            
            if (response.results && response.results.length > 0) {
                ticketsContent.innerHTML = `
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Lottery</th>
                                <th>Ticket #</th>
                                <th>Purchase Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${response.results.map(ticket => `
                                <tr>
                                    <td>${ticket.lottery.name}</td>
                                    <td>#${ticket.ticket_number}</td>
                                    <td>${new Date(ticket.purchased_at).toLocaleDateString()}</td>
                                    <td><span class="status ${ticket.is_winner ? 'winner' : ''}">${ticket.is_winner ? '🏆 Winner' : 'Waiting'}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            } else {
                ticketsContent.innerHTML = '<p>You haven\'t purchased any tickets yet.</p>';
            }
        } catch (error) {
            document.getElementById('ticketsContent').innerHTML = '<p>Error loading tickets</p>';
        }
    },

    loadProfile(container) {
        container.innerHTML = `
            <div style="max-width: 500px; margin: 20px auto;">
                <div class="card">
                    <div class="card-header">
                        <h2>My Profile</h2>
                    </div>
                    <div class="card-body" id="profileContent">
                        <div class="spinner"></div>
                    </div>
                </div>
            </div>
        `;
        
        this.loadProfileContent();
    },

    async loadProfileContent() {
        try {
            const response = await api.getUserProfile(this.token);
            const profileContent = document.getElementById('profileContent');
            
            profileContent.innerHTML = `
                <div class="form-group">
                    <label class="form-label">Username</label>
                    <input type="text" class="form-control" value="${response.username}" disabled>
                </div>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" value="${response.email}" disabled>
                </div>
                <div class="form-group">
                    <label class="form-label">First Name</label>
                    <input type="text" class="form-control" value="${response.first_name || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Last Name</label>
                    <input type="text" class="form-control" value="${response.last_name || ''}">
                </div>
            `;
        } catch (error) {
            document.getElementById('profileContent').innerHTML = '<p>Error loading profile</p>';
        }
    },

    loadWallet(container) {
        container.innerHTML = `
            <div style="max-width: 600px; margin: 20px auto;">
                <div class="card">
                    <div class="card-header">
                        <h2>💰 My Wallet</h2>
                    </div>
                    <div class="card-body" id="walletContent">
                        <div class="spinner"></div>
                    </div>
                </div>
            </div>
        `;
        
        this.loadWalletContent();
    },

    async loadWalletContent() {
        try {
            const response = await api.getWalletBalance(this.token);
            const walletContent = document.getElementById('walletContent');
            
            walletContent.innerHTML = `
                <div style="text-align: center; margin-bottom: 30px;">
                    <p style="font-size: 1.2rem; color: var(--text-light);">Current Balance</p>
                    <p style="font-size: 3rem; color: var(--success-color); font-weight: bold; margin: 10px 0;">$${response.wallet_balance}</p>
                </div>
                
                <form class="form-group">
                    <div class="form-group">
                        <label class="form-label">Deposit Amount</label>
                        <input type="number" class="form-control" step="0.01" min="0" placeholder="Enter amount">
                    </div>
                    <button type="submit" class="btn btn--success btn--full-width">Add Funds</button>
                </form>
            `;
        } catch (error) {
            document.getElementById('walletContent').innerHTML = '<p>Error loading wallet</p>';
        }
    },

    loadHistory(container) {
        container.innerHTML = `
            <div class="page-header">
                <h2>Transaction History</h2>
            </div>
            <div id="historyContent"><div class="spinner"></div></div>
        `;
        
        this.loadHistoryContent();
    },

    async loadHistoryContent() {
        try {
            const response = await api.getTransactions(this.token);
            const historyContent = document.getElementById('historyContent');
            
            if (response.results && response.results.length > 0) {
                historyContent.innerHTML = `
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${response.results.map(transaction => `
                                <tr>
                                    <td>${transaction.type}</td>
                                    <td>$${transaction.amount}</td>
                                    <td>${transaction.status}</td>
                                    <td>${new Date(transaction.created_at).toLocaleDateString()}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            } else {
                historyContent.innerHTML = '<p>No transactions found.</p>';
            }
        } catch (error) {
            document.getElementById('historyContent').innerHTML = '<p>Error loading history</p>';
        }
    },

    loadAdminDashboard(container) {
        container.innerHTML = `
            <div class="page-header">
                <h2>Admin Dashboard</h2>
            </div>
            <div class="grid grid--4" id="adminStatsGrid">
                <div class="card">
                    <div class="card-body">
                        <h4>Total Lotteries</h4>
                        <p style="font-size: 2rem; color: var(--primary-color);">-</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h4>Total Users</h4>
                        <p style="font-size: 2rem; color: var(--warning-color);">-</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h4>Total Revenue</h4>
                        <p style="font-size: 2rem; color: var(--success-color);">-</p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h4>Completed Draws</h4>
                        <p style="font-size: 2rem; color: var(--danger-color);">-</p>
                    </div>
                </div>
            </div>
        `;
    },

    loadAdminCreate(container) {
        container.innerHTML = `
            <div style="max-width: 700px; margin: 20px auto;">
                <div class="card">
                    <div class="card-header">
                        <h2>Create New Lottery</h2>
                    </div>
                    <form id="createLotteryForm" class="card-body">
                        <div class="form-group">
                            <label class="form-label">Lottery Name</label>
                            <input type="text" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" rows="4" required></textarea>
                        </div>
                        <div class="grid grid--2">
                            <div class="form-group">
                                <label class="form-label">Ticket Price ($)</label>
                                <input type="number" class="form-control" step="0.01" min="0" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Total Tickets</label>
                                <input type="number" class="form-control" min="1" required>
                            </div>
                        </div>
                        <div class="grid grid--2">
                            <div class="form-group">
                                <label class="form-label">Prize Amount ($)</label>
                                <input type="number" class="form-control" step="0.01" min="0" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Draw Date</label>
                                <input type="datetime-local" class="form-control" required>
                            </div>
                        </div>
                        <button type="submit" class="btn btn--primary btn--full-width">Create Lottery</button>
                    </form>
                </div>
            </div>
        `;
        
        this.setupEventListeners();
        document.getElementById('createLotteryForm').addEventListener('submit', (e) => this.handleCreateLottery(e));
    },

    async handleCreateLottery(e) {
        e.preventDefault();
        // Implementation for creating lottery
        this.showToast('Lottery creation feature coming soon', 'info');
    },

    loadAdminManage(container) {
        container.innerHTML = `
            <div class="page-header">
                <h2>Manage Lotteries</h2>
            </div>
            <div id="manageLotteriesContent"><div class="spinner"></div></div>
        `;
    },

    loadAdminUsers(container) {
        container.innerHTML = `
            <div class="page-header">
                <h2>Manage Users</h2>
            </div>
            <div id="manageUsersContent"><div class="spinner"></div></div>
        `;
    },

    loadAdminAnalytics(container) {
        container.innerHTML = `
            <div class="page-header">
                <h2>Analytics</h2>
            </div>
            <div id="analyticsContent"><div class="spinner"></div></div>
        `;
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
