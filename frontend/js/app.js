// Application State
const APP = {
  currentPage: 'home',
  currentLotteryId: null,

  init() {
    try {
      // Set up event listeners for all pages
      this.setupEventListeners();
      this.updateAuthUI();
      
      // For the main index.html page, we still need to handle initial page routing
      if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        // Use setTimeout to ensure DOM is fully loaded before routing
        setTimeout(() => {
          this.routeToPage();
          window.addEventListener('hashchange', () => this.routeToPage());
          
          // Also handle the case where someone directly navigates to a hash URL
          if (window.location.hash) {
            // Wait a bit more to ensure everything is ready
            setTimeout(() => this.routeToPage(), 10);
          }
        }, 0);
      }
    } catch (error) {
      console.error('Error in APP.init:', error);
    }
  },
  
  setupEventListeners() {
    // Set up a mechanism to handle dynamic elements
    this.setupDynamicEventListeners();
    
    // Close modals on outside click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal') && e.target.classList.contains('active')) {
        UI.closeModal(e.target.id);
      }
    });
  },
  
  setupDynamicEventListeners() {
    // Use event delegation for forms that may be added dynamically
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'loginForm') {
        e.preventDefault();
        this.handleLogin(e);
      } else if (e.target.id === 'registerForm') {
        e.preventDefault();
        this.handleRegister(e);
      } else if (e.target.id === 'addFundsForm') {
        e.preventDefault();
        this.handleAddFunds(e);
      } else if (e.target.id === 'addPaymentForm') {
        e.preventDefault();
        this.handleAddPayment(e);
      } else if (e.target.id === 'ticketPurchaseForm') {
        e.preventDefault();
        this.handleTicketPurchase(e);
      } else if (e.target.id === 'createLotteryForm') {
        e.preventDefault();
        this.handleCreateLottery(e);
      } else if (e.target.id === 'passwordResetRequestForm') {
        e.preventDefault();
        this.handlePasswordResetRequest(e);
      } else if (e.target.id === 'passwordResetForm') {
        e.preventDefault();
        this.handlePasswordReset(e);
      } else if (e.target.id === 'profileForm') {
        e.preventDefault();
        this.handleProfileUpdate(e);
      } else if (e.target.id === 'changePasswordForm') {
        e.preventDefault();
        this.handleChangePassword(e);
      } else if (e.target.id === 'withdrawalRequestForm') {
        e.preventDefault();
        this.handleWithdrawalRequest(e);
      }
    });
    
    // Use event delegation for clicks
    document.addEventListener('click', (e) => {
      // Handle navigation links with hash routes FIRST to prevent default behavior
      const navLink = e.target.closest('.nav-link, .btn[href^="#"]');
      if (navLink) {
        e.preventDefault();
        e.stopPropagation(); // Stop propagation to ensure no other handlers interfere
        const href = navLink.getAttribute('href') || navLink.getAttribute('data-href');
        if (href && href.startsWith('#')) {
          navigateTo(href);
          
          // Close mobile menu after navigation
          if (window.innerWidth <= 768) {
            document.getElementById('navbarMenu').classList.remove('active');
          }
          return; // Exit early after handling navigation
        }
      }
      
      // Logout button
      if (e.target.id === 'logoutBtn') {
        e.preventDefault();
        this.handleLogout();
      }
      
      // Hamburger menu
      if (e.target.id === 'hamburger') {
        e.preventDefault();
        this.toggleMobileMenu();
      }
      
      // Handle nav links click on mobile to close menu
      if (e.target.classList.contains('nav-link') && window.innerWidth <= 768) {
        document.getElementById('navbarMenu').classList.remove('active');
      }
      
      // Add funds button
      if (e.target.id === 'addFundsBtn') {
        e.preventDefault();
        UI.showModal('addFundsModal');
      }
      
      // Add payment button
      if (e.target.id === 'addPaymentBtn') {
        e.preventDefault();
        UI.showModal('addPaymentModal');
      }
      
      // Handle lottery card clicks (only on SPA pages)
      if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        const lotteryCard = e.target.closest('.lottery-card');
        if (lotteryCard) {
          e.preventDefault();
          // Extract lottery ID from the onclick attribute
          const onclickAttr = lotteryCard.getAttribute('onclick');
          if (onclickAttr) {
            const match = onclickAttr.match(/navigateTo\(\s*['"]#\/lottery\/(\d+)['"]\s*\)/);
            if (match && match[1]) {
              navigateTo(`#/lottery/${match[1]}`);
            }
          }
        }
      }
    });
    
    // Event delegation for input changes
    document.addEventListener('change', (e) => {
      if (e.target.id === 'statusFilter') {
        this.loadLotteriesDebounced();
      } else if (e.target.id === 'transactionTypeFilter') {
        this.loadTransactionsDebounced();
      }
    });
  },

  routeToPage() {
    try {
      // Only run SPA routing on the main index.html page
      if (!(window.location.pathname.endsWith('index.html') || window.location.pathname === '/')) {
        return;
      }
      
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
        case 'password-reset-request':
          this.showPage('page-password-reset-request');
          break;
        case 'password-reset':
          // Get token from URL
          const resetToken = route.id;
          if (resetToken) {
            document.getElementById('passwordResetForm').dataset.token = resetToken;
          }
          this.showPage('page-password-reset');
          break;
        case 'verify-email':
          // Get token from URL
          const verifyToken = route.id;
          if (verifyToken) {
            this.handleEmailVerification(verifyToken);
          }
          this.showPage('page-email-verification');
          break;
        case 'profile':
          if (!AUTH.requireAuth()) return;
          this.showPage('page-profile');
          this.loadProfile();
          break;
        default:
          this.showPage('page-home');
          this.loadHome();
      }
    } catch (error) {
      console.error('Error in routeToPage:', error);
      // Fallback to home page if there's an error
      this.showPage('page-home');
    }
  },

  showPage(pageId) {
    // Only run page switching on the main index.html page
    if (!(window.location.pathname.endsWith('index.html') || window.location.pathname === '/')) {
      return;
    }
    
    // First remove active class from all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Then add active class to the target page
    const page = document.getElementById(pageId);
    if (page) {
      page.classList.add('active');
    } else {
      console.warn(`Page element with ID '${pageId}' not found`);
      // Fallback to home page if page not found
      const homePage = document.getElementById('page-home');
      if (homePage) {
        homePage.classList.add('active');
      }
    }
  },

  toggleMobileMenu() {
    const menu = document.getElementById('navbarMenu');
    menu.classList.toggle('active');
  },

  updateAuthUI() {
    try {
      const navAuth = document.getElementById('navAuth');
      const navUser = document.getElementById('navUser');
      const heroAuth = document.getElementById('heroAuth');
      const heroUser = document.getElementById('heroUser');

      if (AUTH.isAuthenticated()) {
        const user = AUTH.getUser();
        if (user) {
          if (navAuth) navAuth.style.display = 'none';
          if (navUser) navUser.style.display = 'flex';
          // For separate HTML files, hero sections may not exist, so check if they exist
          if (heroAuth) heroAuth.style.display = 'none';
          if (heroUser) heroUser.style.display = 'flex';
          UI.updateUserDisplay(user);
          UI.updateWalletDisplay(user.wallet_balance);
        }
      } else {
        if (navAuth) navAuth.style.display = 'flex';
        if (navUser) navUser.style.display = 'none';
        if (heroAuth) heroAuth.style.display = 'flex';
        if (heroUser) heroUser.style.display = 'none';
      }
    } catch (error) {
      console.error('Error in updateAuthUI:', error);
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
      // Navigate to dashboard.html for successful login
      navigateTo('./dashboard.html');
      document.getElementById('loginForm').reset();
    } catch (error) {
      UI.showToast(error.message || 'Login failed', 'error');
    }
  },

  async handleRegister(e) {
    e.preventDefault();
    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const dateOfBirth = document.getElementById('registerDateOfBirth').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const ageVerificationConsent = document.getElementById('ageVerificationConsent').checked;

    if (password !== passwordConfirm) {
      UI.showToast('Passwords do not match', 'error');
      return;
    }

    if (!ageVerificationConsent) {
      UI.showToast('You must confirm that you are at least 18 years old', 'error');
      return;
    }

    if (!dateOfBirth) {
      UI.showToast('Date of birth is required', 'error');
      return;
    }

    // Check age
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      UI.showToast('You must be at least 18 years old to register', 'error');
      return;
    }

    try {
      await API.users.register(username, email, password, passwordConfirm, firstName, lastName, dateOfBirth, ageVerificationConsent);
      UI.showToast('Registration successful!', 'success');
      this.updateAuthUI();
      // Navigate to dashboard.html for successful registration
      navigateTo('./dashboard.html');
      document.getElementById('registerForm').reset();
    } catch (error) {
      UI.showToast(error.message || 'Registration failed', 'error');
    }
  },

  handleLogout() {
    AUTH.logout();
    this.updateAuthUI();
    // Navigate to home page after logout
    navigateTo('../index.html');
    UI.showToast('Logged out successfully', 'success');
  },

  // Page Loaders
  async loadHome() {
    try {
      // Only run on main index.html page
      if (!(window.location.pathname.endsWith('index.html') || window.location.pathname === '/')) {
        return;
      }
      
      // Load statistics
      const response = await API.lotteries.list();
      // Handle both paginated and non-paginated responses
      const lotteries = Array.isArray(response) ? response : (response.results || []);
      
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

  // Debounced version of loadLotteries for search/filter
  loadLotteriesDebounced: UTILS.debounce(function() {
    APP.loadLotteries();
  }, 300),

  async loadLotteries() {
    // Only run on main index.html page or lotteries page
    if (!(window.location.pathname.endsWith('index.html') || 
          window.location.pathname.endsWith('lotteries.html') || 
          window.location.pathname === '/')) {
      return;
    }
    
    // Prevent duplicate requests
    if (this._loadingLotteries) {
      return;
    }
    this._loadingLotteries = true;
    
    const status = document.getElementById('statusFilter')?.value || '';
    const grid = document.getElementById('lotteriesGrid');
    
    UI.setLoading('lotteriesGrid', true);
    try {
      const response = await API.lotteries.list(status);
      // Handle both paginated and non-paginated responses
      const lotteries = Array.isArray(response) ? response : (response.results || []);
      
      if (lotteries.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 40px;">No lotteries found</div>';
      } else {
        grid.innerHTML = lotteries.map(lottery => UI.createLotteryCard(lottery)).join('');
      }
    } catch (error) {
      grid.innerHTML = '<div style="text-align: center; color: red; padding: 40px;">Error loading lotteries</div>';
      UI.showToast('Error loading lotteries', 'error');
    } finally {
      this._loadingLotteries = false;
      UI.setLoading('lotteriesGrid', false);
    }
  },

  async loadLotteryDetail(id) {
    // Only run on main index.html page or lottery detail page
    if (!(window.location.pathname.endsWith('index.html') || 
          window.location.pathname.includes('lottery') || 
          window.location.pathname === '/')) {
      return;
    }
    
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
    // Only run on main index.html page or tickets page
    if (!(window.location.pathname.endsWith('index.html') || 
          window.location.pathname.includes('tickets') || 
          window.location.pathname === '/')) {
      return;
    }
    
    const grid = document.getElementById('ticketsGrid');
    UI.setLoading('ticketsGrid', true);

    try {
      const response = await API.tickets.list();
      // Handle both paginated and non-paginated responses
      const tickets = Array.isArray(response) ? response : (response.results || []);
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
    // Only run on main index.html page or dashboard page
    if (!(window.location.pathname.endsWith('index.html') || 
          window.location.pathname.includes('dashboard') || 
          window.location.pathname === '/')) {
      return;
    }
    
    try {
      const user = AUTH.getUser();
      const profile = user.profile;

      document.getElementById('dashboardBalance').textContent = UI.formatCurrency(user.wallet_balance);
      document.getElementById('statTickets').textContent = profile.total_tickets_bought || 0;
      document.getElementById('statSpent').textContent = UI.formatCurrency(profile.total_spent || 0);
      document.getElementById('statWon').textContent = UI.formatCurrency(profile.total_won || 0);

      // Load payment methods
      const response = await API.paymentMethods.list();
      // Handle both paginated and non-paginated responses
      const paymentMethods = Array.isArray(response) ? response : (response.results || []);
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
    // Only run on main index.html page or transactions page
    if (!(window.location.pathname.endsWith('index.html') || 
          window.location.pathname.includes('transactions') || 
          window.location.pathname === '/')) {
      return;
    }
    
    const typeFilter = document.getElementById('transactionTypeFilter')?.value || '';
    const list = document.getElementById('transactionsList');
    UI.setLoading('transactionsList', true);

    try {
      const response = await API.transactions.list(typeFilter);
      // Handle both paginated and non-paginated responses
      const transactions = Array.isArray(response) ? response : (response.results || []);
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
      // Navigate to lotteries.html after creating lottery
      navigateTo('./lotteries.html');
    } catch (error) {
      UI.showToast(error.message || 'Error creating lottery', 'error');
    }
  },

  async loadAdminDashboard() {
    // Only run on main index.html page or admin dashboard page
    if (!(window.location.pathname.endsWith('index.html') || 
          window.location.pathname.includes('admin-dashboard') || 
          window.location.pathname === '/')) {
      return;
    }
    
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
  },
  
  // Password Reset Functions
  async handlePasswordResetRequest(e) {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    
    try {
      await API.auth.passwordResetRequest(email);
      UI.showToast('Password reset link sent to your email!', 'success');
      document.getElementById('passwordResetRequestForm').reset();
      // Navigate to login.html after password reset request
      navigateTo('./login.html');
    } catch (error) {
      UI.showToast(error.message || 'Error sending reset link', 'error');
    }
  },
  
  async handlePasswordReset(e) {
    e.preventDefault();
    const token = document.getElementById('passwordResetForm').dataset.token;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword !== confirmNewPassword) {
      UI.showToast('Passwords do not match', 'error');
      return;
    }
    
    try {
      await API.auth.passwordReset(token, newPassword);
      UI.showToast('Password reset successfully! You can now login with your new password.', 'success');
      // Navigate to login.html after password reset
      navigateTo('./login.html');
    } catch (error) {
      UI.showToast(error.message || 'Error resetting password', 'error');
    }
  },
  
  async handleEmailVerification(token) {
    try {
      await API.auth.verifyEmail(token);
      document.getElementById('verificationMessage').textContent = 'Email verified successfully!';
      document.getElementById('verificationMessage').style.color = '#27ae60';
      document.getElementById('verificationContent').style.display = 'none';
      document.getElementById('verificationResult').style.display = 'block';
    } catch (error) {
      document.getElementById('verificationMessage').textContent = error.message || 'Verification failed';
      document.getElementById('verificationMessage').style.color = '#e74c3c';
      document.getElementById('verificationContent').style.display = 'none';
      document.getElementById('verificationResult').style.display = 'block';
    }
  },
  
  // Profile Management Functions
  async loadProfile() {
    // Only run on main index.html page or profile page
    if (!(window.location.pathname.endsWith('index.html') || 
          window.location.pathname.includes('profile') || 
          window.location.pathname === '/')) {
      return;
    }
    
    if (!AUTH.requireAuth()) return;
    
    try {
      const user = AUTH.getUser();
      document.getElementById('profileFirstName').value = user.first_name || '';
      document.getElementById('profileLastName').value = user.last_name || '';
      document.getElementById('profileEmail').value = user.email || '';
      document.getElementById('profilePhone').value = user.phone_number || '';
    } catch (error) {
      UI.showToast('Error loading profile', 'error');
    }
  },
  
  async handleProfileUpdate(e) {
    e.preventDefault();
    if (!AUTH.requireAuth()) return;
    
    const data = {
      first_name: document.getElementById('profileFirstName').value,
      last_name: document.getElementById('profileLastName').value,
      phone_number: document.getElementById('profilePhone').value
    };
    
    try {
      const updatedUser = await API.users.updateProfile(data);
      AUTH.updateUser(updatedUser);
      UI.showToast('Profile updated successfully!', 'success');
      this.updateAuthUI();
    } catch (error) {
      UI.showToast(error.message || 'Error updating profile', 'error');
    }
  },
  
  async handleChangePassword(e) {
    e.preventDefault();
    if (!AUTH.requireAuth()) return;
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('changePassword').value;
    const confirmNewPassword = document.getElementById('confirmChangePassword').value;
    
    if (newPassword !== confirmNewPassword) {
      UI.showToast('New passwords do not match', 'error');
      return;
    }
    
    try {
      await API.auth.changePassword(currentPassword, newPassword);
      UI.showToast('Password changed successfully!', 'success');
      document.getElementById('changePasswordForm').reset();
    } catch (error) {
      UI.showToast(error.message || 'Error changing password', 'error');
    }
  },

  async handleWithdrawalRequest(e) {
    e.preventDefault();
    if (!AUTH.requireAuth()) return;
    
    const amount = parseFloat(document.getElementById('withdrawalAmount').value);
    const paymentMethodId = document.getElementById('withdrawalPaymentMethod').value;
    const bankDetailsStr = document.getElementById('bankDetails').value;
    const remarks = document.getElementById('withdrawalRemarks').value;
    
    let bankDetails = {};
    if (bankDetailsStr) {
      try {
        bankDetails = JSON.parse(bankDetailsStr);
      } catch {
        UI.showToast('Invalid bank details JSON format', 'error');
        return;
      }
    }
    
    try {
      await API.withdrawals.request(amount, paymentMethodId || undefined, bankDetails, remarks);
      UI.showToast('Withdrawal request submitted successfully', 'success');
      UI.closeModal('withdrawalRequestModal');
      document.getElementById('withdrawalRequestForm').reset();
      this.loadDashboard();
    } catch (error) {
      UI.showToast(error.message || 'Error submitting withdrawal request', 'error');
    }
  }
};

// Global navigation function
function navigateTo(path) {
  // For separate HTML pages, navigate directly
  // If it's a hash route in the main index.html, convert to appropriate HTML file
  if (path.startsWith('#')) {
    // Convert hash routes to corresponding HTML files
    let newPath = path;
    switch(path) {
      case '#/':
      case '#':
        newPath = '../index.html';
        break;
      case '#/login':
        newPath = './login.html';
        break;
      case '#/register':
        newPath = './register.html';
        break;
      case '#/lotteries':
        newPath = './lotteries.html';
        break;
      case '#/dashboard':
        newPath = './dashboard.html';
        break;
      case '#/admin-dashboard':
        newPath = './admin-dashboard.html';
        break;
      case '#/admin-create-lottery':
        newPath = './admin-create.html';
        break;
      default:
        // If it's a specific lottery route, go to lotteries page
        if (path.startsWith('#/lottery/')) {
          newPath = './lotteries.html';
        } else {
          // For other paths, remove hash and use as is
          newPath = path.substring(1);
        }
    }
    window.location.href = newPath;
  } else {
    // For separate HTML files or absolute paths, navigate directly
    window.location.href = path;
  }
}

// Initialize app when DOM is ready with error handling
try {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      try {
        APP.init();
      } catch (error) {
        console.error('Error during app initialization:', error);
        // Show a fallback message if initialization fails
        document.body.innerHTML = `
          <div style="padding: 50px; text-align: center; font-family: Arial, sans-serif;">
            <h1>Lottery System</h1>
            <p>Application failed to load. Please check console for errors.</p>
            <p><a href="." style="color: #21808d; text-decoration: none;">Refresh Page</a></p>
          </div>
        `;
      }
    });
  } else {
    try {
      APP.init();
    } catch (error) {
      console.error('Error during app initialization:', error);
      // Show a fallback message if initialization fails
      document.body.innerHTML = `
        <div style="padding: 50px; text-align: center; font-family: Arial, sans-serif;">
          <h1>Lottery System</h1>
          <p>Application failed to load. Please check console for errors.</p>
          <p><a href="." style="color: #21808d; text-decoration: none;">Refresh Page</a></p>
        </div>
      `;
    }
  }
} catch (error) {
  console.error('Critical error during initialization setup:', error);
}
