/**
 * Interactive Effects & Advanced Animations
 * Premium visual feedback for lottery platform
 */

// ============================================
// CURSOR TRAIL EFFECT
// ============================================

class CursorTrail {
  constructor() {
    this.particles = [];
    this.colors = ['#667eea', '#764ba2', '#f7971e', '#ffd200', '#00f5ff'];
    
    document.addEventListener('mousemove', (e) => {
      if (Math.random() > 0.7) {
        this.createParticle(e.clientX, e.clientY);
      }
    });
    
    this.animate();
  }
  
  createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.borderRadius = '50%';
    particle.style.background = this.colors[Math.floor(Math.random() * this.colors.length)];
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.opacity = '1';
    particle.style.transition = 'opacity 1s, transform 1s';
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.style.opacity = '0';
      particle.style.transform = 'translateY(20px) scale(0)';
    }, 10);
    
    setTimeout(() => particle.remove(), 1100);
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
  }
}

// ============================================
// MAGNETIC BUTTON EFFECT
// ============================================

class MagneticEffect {
  constructor(selector) {
    this.elements = document.querySelectorAll(selector);
    this.init();
  }
  
  init() {
    this.elements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        element.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0, 0)';
      });
    });
  }
}

// ============================================
// RIPPLE EFFECT ON CLICK
// ============================================

class RippleEffect {
  constructor(selector) {
    this.init(selector);
  }
  
  init(selector) {
    document.addEventListener('click', (e) => {
      const target = e.target.closest(selector);
      if (!target) return;
      
      const ripple = document.createElement('div');
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.className = 'ripple';
      
      if (!target.classList.contains('ripple-container')) {
        target.classList.add('ripple-container');
      }
      
      target.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  }
}

// ============================================
// PARALLAX SCROLL EFFECT
// ============================================

class ParallaxScroll {
  constructor() {
    this.layers = document.querySelectorAll('.parallax-layer');
    this.init();
  }
  
  init() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      this.layers.forEach((layer, index) => {
        const speed = (index + 1) * 0.3;
        const yPos = -(scrolled * speed);
        layer.style.transform = `translateY(${yPos}px)`;
      });
    });
  }
}

// ============================================
// LOTTERY BALL ANIMATION
// ============================================

class LotteryBallDraw {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.balls = [];
  }
  
  createBall(number, color) {
    const ball = document.createElement('div');
    ball.className = 'lottery-ball';
    ball.style.cssText = `
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${color} 0%, ${this.darken(color)} 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 900;
      color: white;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      animation: ballBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      margin: 0.5rem;
    `;
    ball.textContent = number;
    return ball;
  }
  
  darken(color) {
    // Simple color darkening
    return color.replace(/[\d.]+/g, (match) => Math.max(0, parseFloat(match) * 0.7));
  }
  
  draw(numbers) {
    const colors = ['#667eea', '#764ba2', '#f7971e', '#ffd200', '#00f5ff', '#ff006e'];
    
    numbers.forEach((number, index) => {
      setTimeout(() => {
        const ball = this.createBall(number, colors[index % colors.length]);
        this.container.appendChild(ball);
        
        // Play sound effect (if available)
        this.playSound('ball-drop');
      }, index * 500);
    });
  }
  
  playSound(sound) {
    // Placeholder for sound effect
    console.log(`Playing sound: ${sound}`);
  }
}

// ============================================
// COUNTDOWN TIMER
// ============================================

class CountdownTimer {
  constructor(endDate, containerSelector) {
    this.endDate = new Date(endDate).getTime();
    this.container = document.querySelector(containerSelector);
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
      this.container.innerHTML = '<div class="neon-pulse">DRAW LIVE NOW!</div>';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    this.container.innerHTML = `
      <div class="countdown-timer">
        <div class="countdown-unit">
          <div class="countdown-value">${days}</div>
          <div class="countdown-label">Days</div>
        </div>
        <div class="countdown-unit">
          <div class="countdown-value">${hours}</div>
          <div class="countdown-label">Hours</div>
        </div>
        <div class="countdown-unit">
          <div class="countdown-value">${minutes}</div>
          <div class="countdown-label">Mins</div>
        </div>
        <div class="countdown-unit">
          <div class="countdown-value">${seconds}</div>
          <div class="countdown-label">Secs</div>
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
// SLOT MACHINE ANIMATION
// ============================================

class SlotMachine {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.reels = [];
  }
  
  createReel() {
    const reel = document.createElement('div');
    reel.className = 'slot-reel';
    return reel;
  }
  
  spin(finalNumbers) {
    this.container.innerHTML = '';
    this.reels = [];
    
    finalNumbers.forEach((number, index) => {
      const reel = this.createReel();
      this.container.appendChild(reel);
      this.reels.push(reel);
      
      // Spin animation
      reel.classList.add('spinning');
      reel.textContent = '?';
      
      setTimeout(() => {
        reel.classList.remove('spinning');
        reel.textContent = number;
        
        // Play reveal sound
        this.playRevealSound();
      }, 2000 + (index * 300));
    });
  }
  
  playRevealSound() {
    // Placeholder for sound
    console.log('Reveal sound');
  }
}

// ============================================
// JACKPOT TICKER
// ============================================

class JackpotTicker {
  constructor(containerSelector, startAmount, targetAmount) {
    this.container = document.querySelector(containerSelector);
    this.current = startAmount;
    this.target = targetAmount;
    this.increment = (targetAmount - startAmount) / 100;
    this.start();
  }
  
  start() {
    const interval = setInterval(() => {
      this.current += this.increment;
      
      if (this.current >= this.target) {
        this.current = this.target;
        clearInterval(interval);
      }
      
      this.container.innerHTML = `
        <div class="jackpot-ticker">
          <div style="font-size: 1.2rem; margin-bottom: 0.5rem; color: rgba(0, 0, 0, 0.7);">
            💰 CURRENT JACKPOT 💰
          </div>
          <div class="jackpot-amount">
            $${this.formatNumber(Math.floor(this.current))}
          </div>
        </div>
      `;
    }, 50);
  }
  
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

// ============================================
// FIREWORKS EFFECT
// ============================================

class Fireworks {
  constructor() {
    this.colors = ['#667eea', '#764ba2', '#f7971e', '#ffd200', '#00f5ff', '#ff006e'];
  }
  
  launch(x, y) {
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'firework-particle';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.background = this.colors[Math.floor(Math.random() * this.colors.length)];
      
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 100 + Math.random() * 100;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      
      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');
      
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 1000);
    }
  }
  
  show(duration = 5000) {
    const interval = setInterval(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight * 0.5;
      this.launch(x, y);
    }, 500);
    
    setTimeout(() => clearInterval(interval), duration);
  }
}

// ============================================
// LUCKY SPIN WHEEL
// ============================================

class LuckyWheel {
  constructor(containerSelector, segments) {
    this.container = document.querySelector(containerSelector);
    this.segments = segments;
    this.rotation = 0;
    this.spinning = false;
    this.createWheel();
  }
  
  createWheel() {
    const wheel = document.createElement('div');
    wheel.style.cssText = `
      width: 300px;
      height: 300px;
      border-radius: 50%;
      position: relative;
      border: 10px solid var(--neon-cyan);
      box-shadow: 0 0 30px var(--neon-cyan);
      transition: transform 3s cubic-bezier(0.25, 0.1, 0.25, 1);
      background: conic-gradient(
        from 0deg,
        #667eea 0deg 60deg,
        #764ba2 60deg 120deg,
        #f7971e 120deg 180deg,
        #ffd200 180deg 240deg,
        #00f5ff 240deg 300deg,
        #ff006e 300deg 360deg
      );
    `;
    
    this.wheelElement = wheel;
    this.container.appendChild(wheel);
    
    // Add center button
    const centerBtn = document.createElement('button');
    centerBtn.className = 'btn btn--gold';
    centerBtn.textContent = 'SPIN!';
    centerBtn.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
      border-radius: 50%;
      width: 80px;
      height: 80px;
      font-weight: 900;
    `;
    
    centerBtn.addEventListener('click', () => this.spin());
    this.container.appendChild(centerBtn);
  }
  
  spin() {
    if (this.spinning) return;
    
    this.spinning = true;
    this.rotation += 360 * 5 + Math.random() * 360;
    this.wheelElement.style.transform = `rotate(${this.rotation}deg)`;
    
    setTimeout(() => {
      this.spinning = false;
      const segmentIndex = Math.floor(((this.rotation % 360) / 360) * this.segments.length);
      const prize = this.segments[segmentIndex];
      
      if (window.showToast) {
        window.showToast(`You won: ${prize}!`, 'success');
      }
      
      // Trigger confetti
      if (window.ConfettiEffect) {
        const confetti = new ConfettiEffect();
        confetti.create();
      }
    }, 3000);
  }
}

// ============================================
// SCRATCH CARD
// ============================================

class ScratchCard {
  constructor(containerSelector, revealContent) {
    this.container = document.querySelector(containerSelector);
    this.revealContent = revealContent;
    this.isScratching = false;
    this.scratchPercentage = 0;
    this.createCard();
  }
  
  createCard() {
    const card = document.createElement('div');
    card.className = 'scratch-card';
    card.style.cssText = `
      width: 300px;
      height: 200px;
      position: relative;
      border-radius: var(--border-radius-md);
      background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: crosshair;
      overflow: hidden;
    `;
    
    const content = document.createElement('div');
    content.innerHTML = this.revealContent;
    content.style.cssText = `
      font-size: 2rem;
      font-weight: 900;
      color: white;
      text-align: center;
    `;
    card.appendChild(content);
    
    const overlay = document.createElement('canvas');
    overlay.className = 'scratch-overlay-canvas';
    overlay.width = 300;
    overlay.height = 200;
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      cursor: crosshair;
    `;
    
    const ctx = overlay.getContext('2d');
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(0, 0, 300, 200);
    
    card.appendChild(overlay);
    this.container.appendChild(card);
    
    this.setupScratch(overlay, ctx);
  }
  
  setupScratch(canvas, ctx) {
    let isDrawing = false;
    
    const scratch = (e) => {
      if (!isDrawing) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
      
      this.checkReveal(ctx);
    };
    
    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseleave', () => isDrawing = false);
    
    // Touch support
    canvas.addEventListener('touchstart', (e) => {
      isDrawing = true;
      e.preventDefault();
    });
    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', (e) => {
      if (!isDrawing) return;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
      
      this.checkReveal(ctx);
      e.preventDefault();
    });
  }
  
  checkReveal(ctx) {
    const imageData = ctx.getImageData(0, 0, 300, 200);
    const pixels = imageData.data;
    let transparent = 0;
    
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }
    
    this.scratchPercentage = (transparent / (pixels.length / 4)) * 100;
    
    if (this.scratchPercentage > 60) {
      // Fully reveal
      ctx.clearRect(0, 0, 300, 200);
      
      if (window.showToast) {
        window.showToast('Prize revealed!', 'success');
      }
    }
  }
}

// ============================================
// INITIALIZE EFFECTS
// ============================================

function initializeInteractiveEffects() {
  // Cursor trail
  new CursorTrail();
  
  // Magnetic buttons
  new MagneticEffect('.btn--gold, .btn--primary');
  
  // Ripple effect
  new RippleEffect('.btn, .card');
  
  // Parallax scroll (if elements exist)
  if (document.querySelector('.parallax-layer')) {
    new ParallaxScroll();
  }
  
  console.log('Interactive effects initialized');
}

// Auto-initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeInteractiveEffects);
} else {
  initializeInteractiveEffects();
}

// Export classes for global use
window.LotteryBallDraw = LotteryBallDraw;
window.CountdownTimer = CountdownTimer;
window.SlotMachine = SlotMachine;
window.JackpotTicker = JackpotTicker;
window.Fireworks = Fireworks;
window.LuckyWheel = LuckyWheel;
window.ScratchCard = ScratchCard;
window.MagneticEffect = MagneticEffect;
window.RippleEffect = RippleEffect;
