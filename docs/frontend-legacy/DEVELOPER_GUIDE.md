# 🛠️ Developer Guide - 49FlashMoney UI System

## Quick Start

### Including Stylesheets
```html
<link rel="stylesheet" href="./css/modern-styles.css">
<link rel="stylesheet" href="./css/animations.css">
<link rel="stylesheet" href="./css/advanced-effects.css">
<link rel="stylesheet" href="./css/lottery-cards.css">
```

### Including Scripts
```html
<script src="./js/modern-ui.js"></script>
<script src="./js/interactive-effects.js"></script>
```

## CSS Classes Reference

### Button Styles
```html
<!-- Primary gradient button -->
<button class="btn btn--primary">Click Me</button>

<!-- Gold gradient button (for CTAs) -->
<button class="btn btn--gold">Buy Now</button>

<!-- Success gradient button -->
<button class="btn btn--success">Confirm</button>

<!-- Secondary gradient button -->
<button class="btn btn--secondary">Cancel</button>

<!-- Outline button -->
<button class="btn btn--outline">Learn More</button>

<!-- With shine effect -->
<button class="btn btn--gold shine-effect">Premium</button>

<!-- Morphing effect -->
<button class="btn-morphing">Hover Me</button>

<!-- Liquid effect -->
<button class="btn-liquid">Interactive</button>
```

### Text Styles
```html
<!-- Gradient text -->
<h1 class="text-gradient">Beautiful Heading</h1>

<!-- Animated gradient text -->
<h1 class="gradient-text-animated">Moving Colors</h1>

<!-- Neon pulse -->
<h1 class="neon-pulse">Glowing Text</h1>

<!-- Glitch effect -->
<h1 class="glitch-text" data-text="GLITCH">GLITCH</h1>
```

### Card Styles
```html
<!-- Basic card -->
<div class="card">Content here</div>

<!-- Neon border card -->
<div class="card neon-border">Content here</div>

<!-- Magnetic card (follows cursor) -->
<div class="magnetic-card">Content here</div>

<!-- Holographic card -->
<div class="holographic">Content here</div>
```

### Lottery Cards
```html
<!-- Premium lottery card -->
<div class="lottery-card-premium">
  <div class="lottery-card-header">
    <div class="lottery-prize-badge">$1,000,000</div>
    <div class="lottery-status-badge active">LIVE</div>
  </div>
  <h3 class="lottery-card-title">Lottery Name</h3>
  <p class="lottery-card-description">Description text</p>
  <div class="lottery-card-footer">
    <button class="btn btn--gold">Buy Tickets</button>
  </div>
</div>

<!-- Jackpot variant -->
<div class="lottery-card-premium lottery-card-jackpot">
  <!-- Same structure -->
</div>

<!-- Hot variant -->
<div class="lottery-card-premium lottery-card-hot">
  <!-- Same structure -->
</div>
```

### Animation Classes
```html
<!-- Float animation -->
<div class="float-animation">🎈</div>

<!-- Bounce attention -->
<div class="bounce-attention">👀</div>

<!-- Pulse animation -->
<div class="pulse">♥️</div>

<!-- Spin animation -->
<div class="spin">⚙️</div>

<!-- Shake animation -->
<div class="animate-shake">📳</div>
```

### Loading States
```html
<!-- Spinner -->
<div class="spinner"></div>

<!-- Skeleton loader -->
<div class="skeleton" style="height: 20px;"></div>
```

## JavaScript API

### Initialization
```javascript
document.addEventListener('DOMContentLoaded', () => {
  // Auto-initialized effects
  // Cursor trail, magnetic buttons, ripples are already active
});
```

### Particles & Effects

#### Cursor Trail
```javascript
// Already initialized automatically
// Creates colorful particles following cursor
```

#### Magnetic Effect
```javascript
// Make specific elements magnetic
new MagneticEffect('.my-buttons');
```

#### Ripple Effect
```javascript
// Add ripple to specific elements
new RippleEffect('.my-cards');
```

### Lottery Components

#### Ball Draw
```javascript
const ballDraw = new LotteryBallDraw('#ball-container');
ballDraw.draw([7, 14, 21, 28, 35, 42]);
```

#### Countdown Timer
```javascript
const drawDate = new Date('2024-12-31T20:00:00');
const countdown = new CountdownTimer(drawDate, '#countdown-container');

// Stop countdown
countdown.stop();
```

#### Slot Machine
```javascript
const slot = new SlotMachine('#slot-container');
slot.spin([7, 7, 7]); // Final numbers

// The animation takes ~3 seconds
```

#### Jackpot Ticker
```javascript
// Animate from start to target amount
const ticker = new JackpotTicker(
  '#ticker-container',
  50000,    // start amount
  150000    // target amount
);
```

#### Lucky Wheel
```javascript
const prizes = ['$100', '$500', '$1000', '$5000', 'JACKPOT'];
const wheel = new LuckyWheel('#wheel-container', prizes);

// User clicks the spin button on the wheel
// Result is shown via toast notification
```

#### Scratch Card
```javascript
const scratchCard = new ScratchCard(
  '#scratch-container',
  '<h2>🎉 YOU WON!</h2><p>$5,000</p>'
);

// User scratches with mouse/touch
// Auto-reveals at 60% scratched
```

### Celebration Effects

#### Fireworks
```javascript
const fireworks = new Fireworks();
fireworks.show(5000); // Duration in ms

// Or single burst
fireworks.launch(x, y); // At specific coordinates
```

#### Confetti
```javascript
const confetti = new ConfettiEffect();
confetti.create(3000); // Duration in ms
```

#### Winner Announcement
```javascript
// From modern-ui.js
showWinnerAnnouncement(prize, userName);

// Example:
showWinnerAnnouncement(100000, 'JohnDoe');
```

### Notifications

#### Toast Messages
```javascript
// Success toast
showToast('Payment successful!', 'success');

// Error toast
showToast('Something went wrong', 'error');

// Warning toast
showToast('Please verify your email', 'warning');

// Info toast (default)
showToast('New features available!');
```

## CSS Variables

### Customizing Colors
```css
:root {
  /* Gradients */
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gold-gradient: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
  
  /* Neon Colors */
  --neon-cyan: #00f5ff;
  --neon-pink: #ff006e;
  --neon-purple: #8338ec;
  --neon-blue: #3a86ff;
  --neon-green: #06ffa5;
  --neon-orange: #fb5607;
  
  /* Background */
  --bg-dark: #0a0e27;
  --bg-card: rgba(255, 255, 255, 0.05);
  
  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #b8b9d1;
  
  /* Spacing */
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  
  /* Border Radius */
  --border-radius-sm: 8px;
  --border-radius-md: 16px;
  --border-radius-lg: 24px;
}
```

### Using Variables
```css
.my-element {
  background: var(--bg-card);
  color: var(--text-primary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-lg);
}
```

## Common Patterns

### Creating a Premium Card
```html
<div class="card neon-border magnetic-card">
  <h3 class="text-gradient">Card Title</h3>
  <p class="text-secondary">Card content here</p>
  <button class="btn btn--gold shine-effect">Action</button>
</div>
```

### Hero Section
```html
<section class="hero">
  <h1 class="glitch-text" data-text="TITLE">TITLE</h1>
  <p class="gradient-text-animated">Subtitle</p>
  <div class="btn-group">
    <button class="btn btn--gold btn--large">Primary CTA</button>
    <button class="btn btn--outline btn--large">Secondary</button>
  </div>
</section>
```

### Stats Grid
```html
<div class="stats-grid">
  <div class="stat-card neon-border">
    <h3>Label</h3>
    <div class="value pulse">1,234</div>
    <p>Description</p>
  </div>
  <!-- More stat cards... -->
</div>
```

### Lottery Grid
```html
<div class="lottery-grid">
  <div class="lottery-card-premium">
    <!-- Lottery card content -->
  </div>
  <!-- More lottery cards... -->
</div>
```

## Responsive Breakpoints

```css
/* Mobile First */
.element {
  /* Mobile styles (< 768px) */
}

@media (min-width: 768px) {
  /* Tablet */
  .element {
    /* Tablet styles */
  }
}

@media (min-width: 1024px) {
  /* Desktop */
  .element {
    /* Desktop styles */
  }
}

@media (min-width: 1440px) {
  /* Large Desktop */
  .element {
    /* Large desktop styles */
  }
}
```

## Performance Tips

1. **Limit Animations**: Don't animate too many elements simultaneously
2. **Use Transform**: Prefer `transform` over `left/top` for animations
3. **Will-change**: Use sparingly on elements that will animate
4. **Debounce Events**: Debounce scroll/resize listeners
5. **Lazy Load**: Initialize heavy components only when needed

```javascript
// Debounce example
let timeout;
window.addEventListener('scroll', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    // Your scroll handler
  }, 100);
});
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note**: Some effects may have reduced functionality on older browsers but will gracefully degrade.

## Accessibility

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Keyboard Navigation
All interactive elements support keyboard navigation:
- Tab to focus
- Enter/Space to activate
- Escape to close modals

### Screen Readers
Use semantic HTML and ARIA labels:
```html
<button aria-label="Close modal" class="btn">
  ✕
</button>
```

## Testing

### Manual Testing Checklist
- [ ] Test on mobile devices
- [ ] Test with touch events
- [ ] Test with keyboard only
- [ ] Test with screen reader
- [ ] Test on slow network
- [ ] Test on low-end devices

### Performance Testing
```javascript
// Measure animation performance
performance.mark('animation-start');
// ... animation code ...
performance.mark('animation-end');
performance.measure('animation', 'animation-start', 'animation-end');
console.log(performance.getEntriesByName('animation'));
```

## Troubleshooting

### Animations Not Working
1. Check if CSS files are loaded
2. Verify browser supports CSS animations
3. Check for JavaScript errors in console
4. Ensure elements have proper classes

### Performance Issues
1. Reduce particle count
2. Limit simultaneous animations
3. Use simpler effects on mobile
4. Check for memory leaks

### Styling Issues
1. Check CSS specificity
2. Verify CSS variables are defined
3. Check for conflicting styles
4. Inspect element in DevTools

## Examples

See these files for complete examples:
- `index.html` - Main application
- `showcase.html` - All effects demo
- `demo-cards.html` - Lottery cards showcase
- `landing.html` - Marketing landing page

## Support

For questions or issues:
1. Check `UI_ENHANCEMENTS.md` for detailed documentation
2. Review example files
3. Inspect browser console for errors
4. Test in different browsers

---

**Happy Coding! 🚀**
