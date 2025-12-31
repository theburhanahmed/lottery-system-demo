// Application State
const APP = {
  currentPage: 'home',
  currentLotteryId: null,

  init() {
    this.setupEventListeners();
    this.updateAuthUI();
    this.routeToPage();
    window.addEventListener('hashchange', () => this.routeToPage());
  },

  setupEventListeners() {
    // Navigation
    document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));
    document.getElementById('logoutBtn')?.addEventListener('click', () => this.handleLogout());
    document.getElementById('hamburger')?.addEventListener('click', () => this.toggleMobileMenu());
    document.getElementById('addFundsBtn')?.addEventListener('click', () => UI.showModal('addFundsModal'));
    document.getElementById('addFundsForm')?.addEventListener('submit', (e) => this.handleAddFunds(e));
    document.getElementById('addPaymentBtn')?.addEventListener('click', () => UI.showModal('addPaymentModal'));
    document.getElementById('addPaymentForm')?.addEventListener('submit', (e) => this.handleAddPayment(e));
    document.getElementById('ticketPurchaseForm')?.addEventListener('submit', (e) => this.handleTicketPurchase(e));
    document.getElementById('createLotteryForm')?.addEventListener('submit', (e) => this.handleCreateLottery(e));
    document.getElementById('statusFilter')?.addEventListener('change', () => this.loadLotteries());
    document.getElementById('transactionTypeFilter')?.addEventListener('change', () => this.loadTransactions());

    // Close modals on outside click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) UI.closeModal(modal.id);
      });
    });
  },

  routeToPage() {
    const route = UTILS.parseRoute();
    const page = route.base || 'home';
    const id = route.id;

    // Close all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-page') === page);
    });

    // Route to correct page
    switch (page) {
      case 'login':
        this.showPage('page-login');
        break;
      case 'register':
        this.showPage('page-register');
        break;
      case 'lotteries':
        this.showPage('page-lotteries');
        this.loadLotteries();
        break;
      case 'lottery':
        this.currentLotteryId = id;
        this.showPage('page-lottery-detail');
        this.loadLotteryDetail(id);
        break;
      case 'tickets':
        if (!AUTH.requireAuth()) return;
        this.showPage('page-tickets');
        this.loadTickets();
        break;
      case 'dashboard':
        if (!AUTH.requireAuth()) return;
        this.showPage('page-dashboard');
        this.loadDashboard();
        break;
      case 'transactions':
        if (!AUTH.requireAuth()) return;
        this.showPage('page-transactions');
        this.loadTransactions();
        break;
      case 'admin-dashboard':
        if (!AUTH.requireAdmin()) return;
        this.showPage('page-admin-dashboard');
        this.loadAdminDashboard();
        break;
      case 'admin-create-lottery':
        if (!AUTH.requireAdmin()) return;
        this.showPage('page-admin-create-lottery');
        break;
      default:
        this.showPage('page-home');
        this.loadHome();
    }
  },

  showPage(pageId) {
    const page = document.getElementById(pageId);
    if (page) page.classList.add('active');
  },

  toggleMobileMenu() {
    const menu = document.getElementById('navbarMenu');
    menu.classList.toggle('active');
  },

  updateAuthUI() {
    const navAuth = document.getElementById('navAuth');
    const navUser = document.getElementById('navUser');
    const heroAuth = document.getElementById('heroAuth');
    const heroUser = document.getElementById('heroUser');

    if (AUTH.isAuthenticated()) {
      const user = AUTH.getUser();
      if (navAuth) navAuth.style.display = 'none';
      if (navUser) navUser.style.display = 'flex';
      if (heroAuth) heroAuth.style.display = 'none';
      if (heroUser) heroUser.style.display = 'flex';
      UI.updateUserDisplay(user);
      UI.updateWalletDisplay(user.wallet_balance);
    } else {
      if (navAuth) navAuth.style.display = 'block';
      if (navUser) navUser.style.display = 'none';
      if (heroAuth) heroAuth.style.display = 'flex';
      if (heroUser) heroUser.style.display = 'none';
    }
  },

  // Authentication Handlers
  async handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
      await AUTH.login(username, password);
      UI.showToast('Login successful!', 'success');
      this.updateAuthUI();
      navigateTo('#/dashboard');
      document.getElementById('loginForm').reset();
    } catch (error) {
      UI.showToast(error.message || 'Login failed', 'error');
    }
  },

  async handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

    if (password !== passwordConfirm) {
      UI.showToast('Passwords do not match', 'error');
      return;
    }

    try {
      await AUTH.register(username, email, password, passwordConfirm);
      UI.showToast('Registration successful!', 'success');
      this.updateAuthUI();
      navigateTo('#/dashboard');
      document.getElementById('registerForm').reset();
    } catch (error) {
      UI.showToast(error.message || 'Registration failed', 'error');
    }
  },

  handleLogout() {
    AUTH.logout();
    this.updateAuthUI();
    navigateTo('#/');
    UI.showToast('Logged out successfully', 'success');
  },

  // Page Loaders
  async loadHome() {
    try {
      // Load statistics
      const lotteries = await API.lotteries.list();
      const activeLotteries = lotteries.filter(l => l.status === 'ACTIVE').length;
      
      let totalPlayers = 0;
      let totalTickets = 0;
      let totalPrizes = 0;

      for (const lottery of lotteries) {
        totalPlayers += lottery.total_participants || 0;
        totalTickets += lottery.total_tickets_sold || 0;
        totalPrizes += parseFloat(lottery.prize_amount || 0);
      }

      document.getElementById('activeLotteries').textContent = activeLotteries;
      document.getElementById('totalPlayers').textContent = totalPlayers;
      document.getElementById('totalTickets').textContent = totalTickets;
      document.getElementById('totalPrizes').textContent = UI.formatCurrency(totalPrizes);
    } catch (error) {
      console.error('Error loading home:', error);
    }
  },

  async loadLotteries() {
    const status = document.getElementById('statusFilter')?.value || '';
    const grid = document.getElementById('lotteriesGrid');
    
    UI.setLoading('lotteriesGrid', true);
    try {
      const lotteries = await API.lotteries.list(status);
      
      if (lotteries.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 40px;">No lotteries found</div>';
      } else {
        grid.innerHTML = lotteries.map(lottery => UI.createLotteryCard(lottery)).join('');
      }
    } catch (error) {
      grid.innerHTML = '<div style="text-align: center; color: red; padding: 40px;">Error loading lotteries</div>';
      UI.showToast('Error loading lotteries', 'error');
    }
  },

  async loadLotteryDetail(id) {
    const container = document.getElementById('lotteryDetail');
    UI.setLoading('lotteryDetail', true);

    try {
      const lottery = await API.lotteries.get(id);
      const daysUntilDraw = UTILS.daysDifference(lottery.draw_date, new Date());
      const soldPercent = ((lottery.total_tickets - lottery.available_tickets) / lottery.total_tickets * 100).toFixed(0);

      const html = `
        <div class="card">
          <div class="card__header">${lottery.name}</div>
          <div class="card__body">
            <div style="margin-bottom: 20px;">
              <p><strong>Status:</strong> <span class="status ${lottery.status.toLowerCase()}">${lottery.status}</span></p>
              <p><strong>Description:</strong> ${lottery.description}</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
              <div>
                <p style="color: #666; font-size: 12px; text-transform: uppercase;">Ticket Price</p>
                <p style="font-size: 24px; font-weight: bold; color: #2180 8d;">${UI.formatCurrency(lottery.ticket_price)}</p>
              </div>
              <div>
                <p style="color: #666; font-size: 12px; text-transform: uppercase;">Prize Amount</p>
                <p style="font-size: 24px; font-weight: bold; color: #2180 8d;">${UI.formatCurrency(lottery.prize_amount)}</p>
              </div>
              <div>
                <p style="color: #666; font-size: 12px; text-transform: uppercase;">Tickets Sold</p>
                <p style="font-size: 24px; font-weight: bold;">${lottery.total_tickets - lottery.available_tickets}/${lottery.total_tickets}</p>
              </div>
              <div>
                <p style="color: #666; font-size: 12px; text-transform: uppercase;">Days to Draw</p>
                <p style="font-size: 24px; font-weight: bold;">${daysUntilDraw}</p>
              </div>
            </div>

            <div style="margin: 20px 0; position: relative; height: 12px; background: #eee; border-radius: 6px;">
              <div style="position: absolute; height: 100%; background: linear-gradient(90deg, #2180 8d, #3498db); width: ${soldPercent}%; border-radius: 6px;"></div>
            </div>
            <p style="text-align: center; color: #666;">${soldPercent}% of tickets sold</p>

            ${AUTH.isAuthenticated() && lottery.status === 'ACTIVE' ? `
              <button class="btn btn--primary btn--full-width" style="margin-top: 20px;" onclick="APP.openTicketPurchaseModal(${lottery.id}, '${lottery.name}', ${lottery.ticket_price})">
                🎫 Buy Ticket Now
              </button>
            ` : ''}

            ${lottery.status === 'DRAWN' ? `
              <button class="btn btn--success btn--full-width" style="margin-top: 20px;" onclick="APP.loadLotteryResults(${lottery.id})">
                🎁 View Results
              </button>
            ` : ''}
          </div>
        </div>
      `;

      container.innerHTML = html;
    } catch (error) {
      container.innerHTML = '<div style="color: red; padding: 20px;">Error loading lottery details</div>';
    }
  },

  openTicketPurchaseModal(lotteryId, lotteryName, price) {
    document.getElementById('purchaseInfo').innerHTML = `
      <p><strong>${lotteryName}</strong></p>
      <p>Ticket Price: <strong>${UI.formatCurrency(price)}</strong></p>
    `;
    document.getElementById('ticketPurchaseForm').dataset.lotteryId = lotteryId;
    document.getElementById('ticketPurchaseForm').dataset.price = price;
    document.getElementById('ticketQuantity').value = 1;
    this.updatePurchaseTotal();
    UI.showModal('ticketPurchaseModal');
  },

  updatePurchaseTotal() {
    const quantity = parseInt(document.getElementById('ticketQuantity').value) || 1;
    const price = parseFloat(document.getElementById('ticketPurchaseForm').dataset.price);
    const total = quantity * price;
    document.getElementById('purchaseTotal').innerHTML = `
      <p style="margin-top: 20px; font-size: 16px;">
        Total: <strong style="color: #2180 8d; font-size: 20px;">${UI.formatCurrency(total)}</strong>
      </p>
    `;
  },

  async loadTickets() {
    const grid = document.getElementById('ticketsGrid');
    UI.setLoading('ticketsGrid', true);

    try {
      const tickets = await API.tickets.list();
      if (tickets.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 40px;">No tickets purchased yet</div>';
      } else {
        grid.innerHTML = tickets.map(ticket => UI.createTicketCard(ticket)).join('');
      }
    } catch (error) {
      grid.innerHTML = '<div style="text-align: center; color: red; padding: 40px;">Error loading tickets</div>';
    }
  },

  async loadDashboard() {
    try {
      const user = AUTH.getUser();
      const profile = user.profile;

      document.getElementById('dashboardBalance').textContent = UI.formatCurrency(user.wallet_balance);
      document.getElementById('statTickets').textContent = profile.total_tickets_bought || 0;
      document.getElementById('statSpent').textContent = UI.formatCurrency(profile.total_spent || 0);
      document.getElementById('statWon').textContent = UI.formatCurrency(profile.total_won || 0);
      document.getElementById('statWins').textContent = profile.total_wins || 0;

      // Load payment methods
      const paymentMethods = await API.paymentMethods.list();
      const paymentList = document.getElementById('paymentMethodsList');
      if (paymentMethods.length === 0) {
        paymentList.innerHTML = '<p style="color: #666;">No payment methods added yet</p>';
      } else {
        paymentList.innerHTML = paymentMethods.map(method => `
          <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
            <p><strong>${method.name}</strong> ${method.is_primary ? '<span style="color: #27ae60; font-weight: bold;">✓ Primary</span>' : ''}</p>
            <p style="color: #666; font-size: 12px;">${method.type}</p>
          </div>
        `).join('');
      }
    } catch (error) {
      UI.showToast('Error loading dashboard', 'error');
    }
  },

  async loadTransactions() {
    const typeFilter = document.getElementById('transactionTypeFilter')?.value || '';
    const list = document.getElementById('transactionsList');
    UI.setLoading('transactionsList', true);

    try {
      const transactions = await API.transactions.list(typeFilter);
      if (transactions.length === 0) {
        list.innerHTML = '<div style="text-align: center; padding: 40px;">No transactions</div>';
      } else {
        list.innerHTML = transactions.map(tx => UI.createTransactionItem(tx)).join('');
      }
    } catch (error) {
      list.innerHTML = '<div style="text-align: center; color: red; padding: 40px;">Error loading transactions</div>';
    }
  },

  // Handlers
  async handleAddFunds(e) {
    e.preventDefault();
    const amount = document.getElementById('fundsAmount').value;

    if (!UTILS.isValidNumber(amount)) {
      UI.showToast('Please enter a valid amount', 'error');
      return;
    }

    try {
      await API.users.addFunds(amount);
      const user = AUTH.getUser();
      user.wallet_balance = parseFloat(user.wallet_balance) + parseFloat(amount);
      AUTH.updateUser(user);
      UI.updateWalletDisplay(user.wallet_balance);
      UI.closeModal('addFundsModal');
      UI.showToast(`${UI.formatCurrency(amount)} added to wallet!`, 'success');
      document.getElementById('addFundsForm').reset();
    } catch (error) {
      UI.showToast(error.message || 'Error adding funds', 'error');
    }
  },

  async handleAddPayment(e) {
    e.preventDefault();
    const name = document.getElementById('paymentName').value;
    const type = document.getElementById('paymentType').value;
    const accountNumber = document.getElementById('accountNumber').value;

    try {
      await API.paymentMethods.create({ name, type, account_number: accountNumber });
      UI.closeModal('addPaymentModal');
      UI.showToast('Payment method added!', 'success');
      document.getElementById('addPaymentForm').reset();
      this.loadDashboard();
    } catch (error) {
      UI.showToast(error.message || 'Error adding payment method', 'error');
    }
  },

  async handleTicketPurchase(e) {
    e.preventDefault();
    const lotteryId = document.getElementById('ticketPurchaseForm').dataset.lotteryId;
    const quantity = parseInt(document.getElementById('ticketQuantity').value);

    try {
      await API.lotteries.buyTicket(lotteryId, quantity);
      
      // Reload user data
      const user = AUTH.getUser();
      const updatedUser = await API.users.getProfile();
      AUTH.updateUser(updatedUser);
      UI.updateWalletDisplay(updatedUser.wallet_balance);
      
      UI.closeModal('ticketPurchaseModal');
      UI.showToast(`${quantity} ticket(s) purchased!`, 'success');
      this.loadTickets();
      this.loadLotteryDetail(lotteryId);
    } catch (error) {
      UI.showToast(error.message || 'Error purchasing ticket', 'error');
    }
  },

  async handleCreateLottery(e) {
    e.preventDefault();
    if (!AUTH.requireAdmin()) return;

    const data = {
      name: document.getElementById('lotteryName').value,
      description: document.getElementById('lotteryDescription').value,
      ticket_price: parseFloat(document.getElementById('ticketPrice').value),
      prize_amount: parseFloat(document.getElementById('prizeAmount').value),
      total_tickets: parseInt(document.getElementById('totalTickets').value),
      draw_date: new Date(document.getElementById('drawDate').value).toISOString(),
      status: 'ACTIVE'
    };

    try {
      await API.lotteries.create(data);
      UI.showToast('Lottery created successfully!', 'success');
      document.getElementById('createLotteryForm').reset();
      navigateTo('#/lotteries');
    } catch (error) {
      UI.showToast(error.message || 'Error creating lottery', 'error');
    }
  },

  async loadAdminDashboard() {
    // Admin dashboard logic
  },

  async loadLotteryResults(id) {
    try {
      const results = await API.lotteries.getResults(id);
      if (results.winners && results.winners.length > 0) {
        const winner = results.winners[0];
        UI.showToast(`Congratulations! ${winner.user.username} won ${UI.formatCurrency(winner.prize_amount)}!`, 'success');
      } else {
        UI.showToast('No winners yet', 'info');
      }
    } catch (error) {
      UI.showToast('Error loading results', 'error');
    }
  }
};

// Global navigation function
function navigateTo(hash) {
  window.location.hash = hash;
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => APP.init());
} else {
  APP.init();
}
