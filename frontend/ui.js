// UI Utilities
const UI = {
  // Show toast notification
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; font-size: 20px;">&times;</button>
    `;
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // Show modal
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  },

  // Close modal
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  },

  // Set loading state
  setLoading(elementId, isLoading) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    if (isLoading) {
      el.innerHTML = '<div class="loading">Loading...</div>';
    }
  },

  // Format currency
  formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
  },

  // Format date
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Create lottery card HTML
  createLotteryCard(lottery) {
    const statusClass = lottery.status.toLowerCase();
    const availablePercent = ((lottery.total_tickets - lottery.available_tickets) / lottery.total_tickets * 100).toFixed(0);
    
    return `
      <div class="lottery-card" onclick="navigateTo('#/lottery/${lottery.id}')">
        <h3>${lottery.name}</h3>
        <span class="status ${statusClass}">${lottery.status}</span>
        <p>${lottery.description}</p>
        
        <div style="margin: 15px 0; position: relative; height: 8px; background: #eee; border-radius: 4px;">
          <div style="position: absolute; height: 100%; background: linear-gradient(90deg, #2180 8d, #3498db); width: ${availablePercent}%; border-radius: 4px;"></div>
        </div>
        <p style="font-size: 12px; color: #666;">${availablePercent}% Sold</p>
        
        <div class="lottery-info">
          <div class="lottery-info-item">
            <span class="lottery-info-label">Ticket Price</span>
            <span class="lottery-info-value">${UI.formatCurrency(lottery.ticket_price)}</span>
          </div>
          <div class="lottery-info-item">
            <span class="lottery-info-label">Prize</span>
            <span class="lottery-info-value">${UI.formatCurrency(lottery.prize_amount)}</span>
          </div>
          <div class="lottery-info-item">
            <span class="lottery-info-label">Available</span>
            <span class="lottery-info-value">${lottery.available_tickets}</span>
          </div>
          <div class="lottery-info-item">
            <span class="lottery-info-label">Draw Date</span>
            <span class="lottery-info-value">${UI.formatDate(lottery.draw_date)}</span>
          </div>
        </div>
      </div>
    `;
  },

  // Create ticket card HTML
  createTicketCard(ticket) {
    const winnerClass = ticket.is_winner ? 'winner' : '';
    return `
      <div class="ticket-card ${winnerClass}">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div>
            <p>Lottery: <strong>${ticket.lottery.name}</strong></p>
            <p class="ticket-number">Ticket #${ticket.ticket_number}</p>
          </div>
          ${ticket.is_winner ? '<span style="background: #27ae60; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold;">🎉 WINNER</span>' : ''}
        </div>
        <div class="ticket-meta">
          <span>Purchased: ${UI.formatDate(ticket.purchased_at)}</span>
          <span>Status: ${ticket.is_winner ? 'Won' : 'Pending'}</span>
        </div>
      </div>
    `;
  },

  // Create transaction item HTML
  createTransactionItem(transaction) {
    let typeClass = '';
    let icon = '';
    
    if (transaction.type === 'DEPOSIT') {
      typeClass = 'deposit';
      icon = '⬇️';
    } else if (transaction.type === 'TICKET_PURCHASE') {
      typeClass = 'purchase';
      icon = '🎫';
    } else if (transaction.type === 'WITHDRAWAL') {
      typeClass = 'withdrawal';
      icon = '⬆️';
    } else if (transaction.type === 'PRIZE_CLAIM') {
      typeClass = 'success';
      icon = '🎁';
    }
    
    return `
      <div class="transaction-item">
        <div style="flex: 1;">
          <span class="transaction-type ${typeClass}">${transaction.type}</span>
          <p>${transaction.description}</p>
        </div>
        <div style="text-align: right;">
          <p style="font-weight: bold;">${UI.formatCurrency(transaction.amount)}</p>
          <p style="font-size: 12px; color: #666;">${UI.formatDate(transaction.created_at)}</p>
        </div>
      </div>
    `;
  },

  // Update wallet display
  updateWalletDisplay(balance) {
    const display = document.getElementById('walletDisplay');
    if (display) {
      display.textContent = UI.formatCurrency(balance);
    }
    const dashboardBalance = document.getElementById('dashboardBalance');
    if (dashboardBalance) {
      dashboardBalance.textContent = UI.formatCurrency(balance);
    }
  },

  // Update user name display
  updateUserDisplay(user) {
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
      userNameEl.textContent = user.username;
    }
  }
};

// Global functions for HTML onclick handlers
function showToast(message, type = 'info') {
  UI.showToast(message, type);
}

function showModal(modalId) {
  UI.showModal(modalId);
}

function closeModal(modalId) {
  UI.closeModal(modalId);
}
