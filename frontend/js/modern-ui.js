/**
 * Modern UI Enhancements
 * Interactive effects, animations, and visual feedback
 */

// ============================================
// PARTICLE SYSTEM
// ============================================

class ParticleSystem {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.particles = [];
  }

  createParticle(x, y, color) {
    const particle = document.createElement('div');
    particle.className = 'particle-burst';
    particle.style.background = color;
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 100;
    particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
    particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
    
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 1000);
  }

  burst(x, y, count = 20, colors = ['#667eea', '#764ba2', '#f7971e', '#ffd200']) {
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      setTimeout(() => this.createParticle(x, y, color), i * 20);
    }
  }
}

// ============================================
// CONFETTI ANIMATION
// ============================================

class ConfettiEffect {
  constructor() {
    this.colors = ['#f7971e', '#ffd200', '#667eea', '#764ba2', '#f5576c', '#00f5ff'];
  }

  create(duration = 3000) {
    const confettiCount = 100;
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '10000';
    document.body.appendChild(container);

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.background = this.colors[Math.floor(Math.random() * this.colors.length)];
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
      container.appendChild(confetti);
    }

    setTimeout(() => container.remove(), duration + 3000);
  }
}

// ============================================
// WINNER ANNOUNCEMENT
// ============================================

function showWinnerAnnouncement(prize, userName = 'You') {
  const banner = document.createElement('div');
  banner.className = 'winner-banner';
  banner.innerHTML = `
    <h1 class="text-glitch" data-text="🎉 WINNER! 🎉">🎉 WINNER! 🎉</h1>
    <p style="font-size: 2rem; margin-bottom: 1rem; color: white;">
      Congratulations, ${userName}!
    </p>
    <div class="prize-amount" style="margin-bottom: 1.5rem;">
      $${prize.toLocaleString()}
    </div>
    <button class="btn btn--gold" onclick="this.parentElement.remove()">
      Claim Your Prize! 🎁
    </button>
  `;
  
  document.body.appendChild(banner);
  
  // Create confetti
  const confetti = new ConfettiEffect();
  confetti.create();
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (banner.parentElement) {
      banner.style.animation = 'winnerBurst 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) reverse';
      setTimeout(() => banner.remove(), 500);
    }
  }, 10000);
}

// ============================================
// COUNTDOWN TIMER
// ============================================

class CountdownTimer {
  constructor(endDate, elementId) {
    this.endDate = new Date(endDate).getTime();
    this.element = document.getElementById(elementId);
    this.start();
  }

  start() {
    this.update();
    this.interval = setInterval(() => this.update(), 1000);
  }

  update() {
    const now = new Date().getTime();
    const distance = this.endDate - now;

    if (distance < 0) {
      clearInterval(this.interval);
      this.element.innerHTML = '<div style="color: var(--neon-pink); font-size: 1.5rem;">Draw Completed!</div>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.element.innerHTML = `
      <div class="countdown-timer">
        <div class="countdown-item">
          <span class="countdown-number">${days}</span>
          <span class="countdown-label">Days</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">${hours}</span>
          <span class="countdown-label">Hours</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">${minutes}</span>
          <span class="countdown-label">Minutes</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">${seconds}</span>
          <span class="countdown-label">Seconds</span>
        </div>
      </div>
    `;
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

// ============================================
// NUMBER COUNTER ANIMATION
// ============================================

function animateCounter(element, start, end, duration = 2000) {
  const range = end - start;
  const increment = range / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      current = end;
      clearInterval(timer);
    }
    
    const isPrice = element.textContent.includes('$');
    element.textContent = isPrice 
      ? '$' + Math.floor(current).toLocaleString() 
      : Math.floor(current).toLocaleString();
  }, 16);
}

// ============================================
// RIPPLE EFFECT
// ============================================

function addRippleEffect(button) {
  button.classList.add('btn-ripple');
  
  button.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
    ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
    ripple.className = 'ripple';
    
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

// ============================================
// MAGNETIC BUTTON EFFECT
// ============================================

function addMagneticEffect(element, strength = 20) {
  element.classList.add('btn-magnetic');
  
  element.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const moveX = (x / rect.width) * strength;
    const moveY = (y / rect.height) * strength;
    
    this.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
  
  element.addEventListener('mouseleave', function() {
    this.style.transform = 'translate(0, 0)';
  });
}

// ============================================
// SKELETON LOADER
// ============================================

function createSkeletonLoader(type = 'card') {
  const skeletons = {
    card: `
      <div class="card" style="padding: 20px;">
        <div class="skeleton" style="height: 200px; margin-bottom: 15px;"></div>
        <div class="skeleton" style="height: 30px; width: 60%; margin-bottom: 10px;"></div>
        <div class="skeleton" style="height: 20px; width: 40%; margin-bottom: 10px;"></div>
        <div class="skeleton" style="height: 50px; margin-top: 20px;"></div>
      </div>
    `,
    list: `
      <div class="card" style="padding: 20px; margin-bottom: 10px;">
        <div style="display: flex; align-items: center; gap: 15px;">
          <div class="skeleton" style="width: 60px; height: 60px; border-radius: 50%;"></div>
          <div style="flex: 1;">
            <div class="skeleton" style="height: 20px; width: 70%; margin-bottom: 8px;"></div>
            <div class="skeleton" style="height: 16px; width: 50%;"></div>
          </div>
        </div>
      </div>
    `,
    grid: `
      <div class="lottery-grid">
        ${Array(6).fill(skeletons.card).join('')}
      </div>
    `
  };
  
  return skeletons[type] || skeletons.card;
}

// ============================================
// TOAST NOTIFICATIONS WITH ANIMATIONS
// ============================================

class ToastManager {
  constructor() {
    this.container = document.getElementById('toastContainer');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toastContainer';
      document.body.appendChild(this.container);
    }
  }

  show(message, type = 'info', duration = 3000) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <span style="font-size: 1.5rem;">${icons[type]}</span>
      <span>${message}</span>
      <button style="background: none; border: none; color: var(--text-secondary); cursor: pointer; margin-left: auto; font-size: 1.2rem;" onclick="this.parentElement.remove()">✕</button>
    `;
    
    this.container.appendChild(toast);
    
    // Create particle burst
    const particles = new ParticleSystem('particles');
    const rect = toast.getBoundingClientRect();
    particles.burst(rect.left, rect.top, 10);
    
    setTimeout(() => {
      toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  success(message, duration) {
    this.show(message, 'success', duration);
  }

  error(message, duration) {
    this.show(message, 'error', duration);
  }

  warning(message, duration) {
    this.show(message, 'warning', duration);
  }

  info(message, duration) {
    this.show(message, 'info', duration);
  }
}

// ============================================
// LOTTERY CARD BUILDER
// ============================================

function createLotteryCard(lottery) {
  const statusBadges = {
    'ACTIVE': 'badge--active',
    'COMPLETED': 'badge--completed',
    'UPCOMING': 'badge--upcoming'
  };

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)'
  ];

  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

  return `
    <div class="lottery-card interactive-card" data-lottery-id="${lottery.id}">
      <div class="lottery-card__image" style="background: ${randomGradient};">
        <div style="font-size: 5rem; animation: spin 3s linear infinite;">🎰</div>
      </div>
      <div class="lottery-card__content">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
          <h3 class="lottery-card__title">${lottery.name || 'Mega Jackpot'}</h3>
          <span class="lottery-card__badge ${statusBadges[lottery.status] || 'badge--active'}">
            ${lottery.status || 'ACTIVE'}
          </span>
        </div>
        
        <div class="lottery-card__prize">
          💰 $${(lottery.prize_amount || 0).toLocaleString()}
        </div>
        
        <div class="lottery-card__info">
          <div>
            <div style="color: var(--text-secondary); font-size: 0.85rem;">Ticket Price</div>
            <div style="color: var(--neon-green); font-weight: 600;">$${lottery.ticket_price || 0}</div>
          </div>
          <div style="text-align: right;">
            <div style="color: var(--text-secondary); font-size: 0.85rem;">Available</div>
            <div style="color: var(--neon-cyan); font-weight: 600;">${lottery.available_tickets || 0}/${lottery.total_tickets || 0}</div>
          </div>
        </div>
        
        ${lottery.draw_date ? `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);">
            <div style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 5px;">Draw Date</div>
            <div style="color: var(--text-primary); font-weight: 600;">
              🗓️ ${new Date(lottery.draw_date).toLocaleDateString()}
            </div>
          </div>
        ` : ''}
        
        <div style="margin-top: 20px;">
          <button class="btn btn--gold shine-effect" style="width: 100%;" onclick="buyTicket(${lottery.id})">
            🎫 Buy Ticket Now
          </button>
        </div>
      </div>
    </div>
  `;
}

// ============================================
// PROGRESS BAR ANIMATION
// ============================================

function animateProgressBar(elementId, percent, duration = 1000) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  let current = 0;
  const increment = percent / (duration / 16);
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= percent) {
      current = percent;
      clearInterval(timer);
    }
    element.style.width = current + '%';
  }, 16);
}

// ============================================
// 3D CARD TILT EFFECT
// ============================================

function add3DTiltEffect(element) {
  element.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });
  
  element.addEventListener('mouseleave', function() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  });
}

// ============================================
// INITIALIZE EFFECTS
// ============================================

function initializeModernUI() {
  // Add ripple effect to all buttons
  document.querySelectorAll('.btn').forEach(btn => {
    addRippleEffect(btn);
  });
  
  // Add magnetic effect to primary buttons
  document.querySelectorAll('.btn--gold, .btn--primary').forEach(btn => {
    addMagneticEffect(btn);
  });
  
  // Add 3D tilt to cards
  document.querySelectorAll('.lottery-card, .stat-card').forEach(card => {
    add3DTiltEffect(card);
  });
  
  // Animate counters on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.classList.contains('value')) {
        const text = entry.target.textContent;
        const number = parseInt(text.replace(/[^0-9]/g, ''));
        if (number > 0) {
          animateCounter(entry.target, 0, number);
          observer.unobserve(entry.target);
        }
      }
    });
  });
  
  document.querySelectorAll('.value').forEach(el => observer.observe(el));
}

// ============================================
// EXPORT GLOBALS
// ============================================

window.ParticleSystem = ParticleSystem;
window.ConfettiEffect = ConfettiEffect;
window.CountdownTimer = CountdownTimer;
window.ToastManager = ToastManager;
window.showWinnerAnnouncement = showWinnerAnnouncement;
window.animateCounter = animateCounter;
window.createLotteryCard = createLotteryCard;
window.createSkeletonLoader = createSkeletonLoader;
window.animateProgressBar = animateProgressBar;
window.initializeModernUI = initializeModernUI;

// Auto-initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeModernUI);
} else {
  initializeModernUI();
}
