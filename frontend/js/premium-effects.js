/**
 * Premium Effects Engine
 * Advanced animations, confetti, particle systems, and interactive elements
 */

// ============================================
// CONFETTI EXPLOSION SYSTEM
// ============================================

class ConfettiExplosion {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.confetti = [];
    this.animationId = null;
  }

  createCanvas() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '9999';
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  launch(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 100) {
    this.createCanvas();
    
    const colors = ['#ff0080', '#ff8c00', '#40e0d0', '#8a2be2', '#00ff00', '#ff69b4', '#ffd700'];
    
    for (let i = 0; i < count; i++) {
      this.confetti.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 5,
        gravity: 0.2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        opacity: 1,
        shape: Math.random() > 0.5 ? 'square' : 'circle'
      });
    }
    
    if (!this.animationId) {
      this.animate();
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.confetti = this.confetti.filter(particle => {
      particle.vy += particle.gravity;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.rotationSpeed;
      particle.opacity -= 0.01;
      
      if (particle.opacity <= 0 || particle.y > this.canvas.height) {
        return false;
      }
      
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.translate(particle.x, particle.y);
      this.ctx.rotate((particle.rotation * Math.PI) / 180);
      this.ctx.fillStyle = particle.color;
      
      if (particle.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      }
      
      this.ctx.restore();
      return true;
    });
    
    if (this.confetti.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.animationId = null;
      if (this.canvas) {
        this.canvas.remove();
        this.canvas = null;
      }
    }
  }
}

// ============================================
// FIREWORKS DISPLAY
// ============================================

class Fireworks {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.fireworks = [];
    this.particles = [];
    this.animationId = null;
  }

  createCanvas() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '9998';
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  launch(count = 5) {
    this.createCanvas();
    
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const x = Math.random() * this.canvas.width;
        const targetY = Math.random() * this.canvas.height * 0.5;
        this.fireworks.push({
          x: x,
          y: this.canvas.height,
          targetY: targetY,
          speed: 5,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
      }, i * 200);
    }
    
    if (!this.animationId) {
      this.animate();
    }
  }

  animate() {
    this.ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update fireworks
    this.fireworks = this.fireworks.filter(fw => {
      fw.y -= fw.speed;
      
      this.ctx.beginPath();
      this.ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = fw.color;
      this.ctx.fill();
      
      if (fw.y <= fw.targetY) {
        this.explode(fw.x, fw.y, fw.color);
        return false;
      }
      return true;
    });
    
    // Update particles
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravity
      p.opacity -= 0.01;
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
      
      return p.opacity > 0;
    });
    
    if (this.fireworks.length > 0 || this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.animationId = null;
      if (this.canvas) {
        this.canvas.remove();
        this.canvas = null;
      }
    }
  }

  explode(x, y, color) {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = Math.random() * 3 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1,
        color: color,
        opacity: 1
      });
    }
  }
}

// ============================================
// TEXT SCRAMBLE EFFECT
// ============================================

class TextScramble {
  constructor(element) {
    this.element = element;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.element.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => (this.resolve = resolve));
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span style="color: var(--neon-cyan);">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.element.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// ============================================
// MAGNETIC CURSOR FOLLOW
// ============================================

class MagneticCursor {
  constructor(selector, strength = 0.3) {
    this.elements = document.querySelectorAll(selector);
    this.strength = strength;
    this.init();
  }

  init() {
    this.elements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        element.style.transform = `translate(${x * this.strength}px, ${y * this.strength}px)`;
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0, 0)';
      });
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
      const scrollY = window.pageYOffset;
      
      this.layers.forEach((layer, index) => {
        const speed = (index + 1) * 0.2;
        layer.style.transform = `translateY(${scrollY * speed}px)`;
      });
    });
  }
}

// ============================================
// MORPHING BACKGROUND BLOBS
// ============================================

class MorphingBlobs {
  constructor(containerId = 'morphing-blobs') {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = containerId;
      this.container.style.position = 'fixed';
      this.container.style.top = '0';
      this.container.style.left = '0';
      this.container.style.width = '100%';
      this.container.style.height = '100%';
      this.container.style.overflow = 'hidden';
      this.container.style.zIndex = '-1';
      this.container.style.pointerEvents = 'none';
      document.body.insertBefore(this.container, document.body.firstChild);
    }
    this.createBlobs(3);
  }

  createBlobs(count) {
    for (let i = 0; i < count; i++) {
      const blob = document.createElement('div');
      blob.className = `blob blob-${i + 1}`;
      this.container.appendChild(blob);
    }
  }
}

// ============================================
// INTERACTIVE PARTICLE SYSTEM
// ============================================

class InteractiveParticles {
  constructor(canvasId = 'particle-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = canvasId;
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '1';
      document.body.insertBefore(this.canvas, document.body.firstChild);
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null };
    this.resize();
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    const particleCount = Math.min(100, Math.floor((this.canvas.width * this.canvas.height) / 10000));
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: `hsl(${Math.random() * 60 + 180}, 100%, 60%)`
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle, i) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off walls
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
      
      // Mouse interaction
      if (this.mouse.x && this.mouse.y) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const force = (100 - distance) / 100;
          particle.vx -= Math.cos(angle) * force * 0.2;
          particle.vy -= Math.sin(angle) * force * 0.2;
        }
      }
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
      
      // Connect nearby particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const other = this.particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(100, 200, 255, ${1 - distance / 100})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.stroke();
        }
      }
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// ============================================
// COUNTDOWN TIMER WITH CIRCULAR PROGRESS
// ============================================

class CountdownTimer {
  constructor(element, endTime) {
    this.element = element;
    this.endTime = new Date(endTime).getTime();
    this.init();
  }

  init() {
    this.element.innerHTML = `
      <div class="circular-progress">
        <svg viewBox="0 0 160 160">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#00f5ff;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8338ec;stop-opacity:1" />
            </linearGradient>
          </defs>
          <circle class="circle-bg" cx="80" cy="80" r="70"></circle>
          <circle class="circle-progress" cx="80" cy="80" r="70"></circle>
        </svg>
        <div class="progress-text">
          <div class="countdown-time"></div>
          <div class="countdown-label" style="font-size: 0.8rem; color: var(--text-secondary);">remaining</div>
        </div>
      </div>
    `;
    
    this.progressCircle = this.element.querySelector('.circle-progress');
    this.timeDisplay = this.element.querySelector('.countdown-time');
    
    this.update();
    this.interval = setInterval(() => this.update(), 1000);
  }

  update() {
    const now = new Date().getTime();
    const distance = this.endTime - now;
    
    if (distance < 0) {
      clearInterval(this.interval);
      this.timeDisplay.textContent = 'ENDED';
      this.progressCircle.style.strokeDashoffset = '440';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    if (days > 0) {
      this.timeDisplay.textContent = `${days}d ${hours}h`;
    } else if (hours > 0) {
      this.timeDisplay.textContent = `${hours}h ${minutes}m`;
    } else {
      this.timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Update progress circle
    const totalTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const progress = 1 - (distance / totalTime);
    const offset = 440 - (440 * Math.min(progress, 1));
    this.progressCircle.style.strokeDashoffset = offset;
  }
}

// ============================================
// TILT EFFECT ON CARDS
// ============================================

class TiltEffect {
  constructor(selector, maxTilt = 15) {
    this.elements = document.querySelectorAll(selector);
    this.maxTilt = maxTilt;
    this.init();
  }

  init() {
    this.elements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * this.maxTilt;
        const rotateY = ((centerX - x) / centerX) * this.maxTilt;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      });
    });
  }
}

// ============================================
// SMOOTH SCROLL WITH EASING
// ============================================

function smoothScrollTo(target, duration = 1000) {
  const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
  if (!targetElement) return;
  
  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;
  
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
  
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);
    
    window.scrollTo(0, startPosition + distance * ease);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }
  
  requestAnimationFrame(animation);
}

// ============================================
// EXPORT INSTANCES
// ============================================

window.PremiumEffects = {
  ConfettiExplosion,
  Fireworks,
  TextScramble,
  MagneticCursor,
  ParallaxScroll,
  MorphingBlobs,
  InteractiveParticles,
  CountdownTimer,
  TiltEffect,
  smoothScrollTo
};

// ============================================
// AUTO-INITIALIZE ON DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize confetti explosion singleton
  window.confetti = new ConfettiExplosion();
  
  // Initialize fireworks singleton
  window.fireworks = new Fireworks();
  
  // Add magnetic effect to buttons
  if (document.querySelectorAll('.btn').length > 0) {
    new MagneticCursor('.btn', 0.2);
  }
  
  // Add tilt effect to cards
  if (document.querySelectorAll('.lottery-card, .stat-card').length > 0) {
    new TiltEffect('.lottery-card, .stat-card', 10);
  }
  
  console.log('🎨 Premium Effects Engine Loaded');
});
