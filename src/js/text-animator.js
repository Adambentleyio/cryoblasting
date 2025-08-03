// Text Animation Script for Astro
// Place this in your public/js/ folder or in a <script> tag

class TextAnimator {
    constructor(options = {}) {
      this.options = {
        threshold: 0.2, // How much of the element needs to be visible
        rootMargin: '0px 0px -50px 0px', // Trigger animation slightly before element is fully visible
        animationDelay: 100, // Delay between animating each text element (ms)
        animationDuration: 600, // Duration of each animation (ms)
        ...options
      };
      
      this.observer = null;
      this.init();
    }
  
    init() {
      // Create intersection observer
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          threshold: this.options.threshold,
          rootMargin: this.options.rootMargin
        }
      );
  
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupElements());
      } else {
        this.setupElements();
      }
    }
  
    setupElements() {
      // Find all elements with animation classes
      const animatedElements = document.querySelectorAll([
        '.animate-fade-in',
        '.animate-slide-up',
        '.animate-slide-down',
        '.animate-slide-left',
        '.animate-slide-right',
        '.animate-scale-up',
        '.animate-typewriter',
        '.animate-word-reveal'
      ].join(', '));
  
      animatedElements.forEach(element => {
        // Add initial styles
        this.prepareElement(element);
        // Start observing
        this.observer.observe(element);
      });
    }
  
    prepareElement(element) {
      const animationType = this.getAnimationType(element);
      
      // Set initial state based on animation type
      switch (animationType) {
        case 'fade-in':
          element.style.opacity = '0';
          element.style.transition = `opacity ${this.options.animationDuration}ms ease-out`;
          break;
          
        case 'slide-up':
          element.style.opacity = '0';
          element.style.transform = 'translateY(30px)';
          element.style.transition = `opacity ${this.options.animationDuration}ms ease-out, transform ${this.options.animationDuration}ms ease-out`;
          break;
          
        case 'slide-down':
          element.style.opacity = '0';
          element.style.transform = 'translateY(-30px)';
          element.style.transition = `opacity ${this.options.animationDuration}ms ease-out, transform ${this.options.animationDuration}ms ease-out`;
          break;
          
        case 'slide-left':
          element.style.opacity = '0';
          element.style.transform = 'translateX(30px)';
          element.style.transition = `opacity ${this.options.animationDuration}ms ease-out, transform ${this.options.animationDuration}ms ease-out`;
          break;
          
        case 'slide-right':
          element.style.opacity = '0';
          element.style.transform = 'translateX(-30px)';
          element.style.transition = `opacity ${this.options.animationDuration}ms ease-out, transform ${this.options.animationDuration}ms ease-out`;
          break;
          
        case 'scale-up':
          element.style.opacity = '0';
          element.style.transform = 'scale(0.8)';
          element.style.transition = `opacity ${this.options.animationDuration}ms ease-out, transform ${this.options.animationDuration}ms ease-out`;
          break;
          
        case 'typewriter':
          this.prepareTypewriter(element);
          break;
          
        case 'word-reveal':
          this.prepareWordReveal(element);
          break;
      }
    }
  
    prepareTypewriter(element) {
      const text = element.textContent;
      element.textContent = '';
      element.dataset.originalText = text;
      element.style.borderRight = '2px solid currentColor';
      element.style.animation = 'blink 1s infinite';
    }
  
    prepareWordReveal(element) {
      const text = element.textContent;
      const words = text.split(' ');
      
      element.innerHTML = words.map(word => 
        `<span class="word-reveal-item" style="opacity: 0; transform: translateY(20px); display: inline-block; transition: opacity 0.4s ease-out, transform 0.4s ease-out;">${word}</span>`
      ).join(' ');
    }
  
    getAnimationType(element) {
      const classList = Array.from(element.classList);
      for (const className of classList) {
        if (className.startsWith('animate-')) {
          return className.replace('animate-', '');
        }
      }
      return 'fade-in'; // default
    }
  
    handleIntersection(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          this.observer.unobserve(entry.target); // Only animate once
        }
      });
    }
  
    animateElement(element) {
      const animationType = this.getAnimationType(element);
  
      switch (animationType) {
        case 'fade-in':
          element.style.opacity = '1';
          break;
          
        case 'slide-up':
        case 'slide-down':
        case 'slide-left':
        case 'slide-right':
        case 'scale-up':
          element.style.opacity = '1';
          element.style.transform = 'translateY(0) translateX(0) scale(1)';
          break;
          
        case 'typewriter':
          this.animateTypewriter(element);
          break;
          
        case 'word-reveal':
          this.animateWordReveal(element);
          break;
      }
    }
  
    animateTypewriter(element) {
      const text = element.dataset.originalText;
      let i = 0;
      
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(typeInterval);
          // Remove cursor after typing is complete
          setTimeout(() => {
            element.style.borderRight = 'none';
            element.style.animation = 'none';
          }, 1000);
        }
      }, 50);
    }
  
    animateWordReveal(element) {
      const words = element.querySelectorAll('.word-reveal-item');
      
      words.forEach((word, index) => {
        setTimeout(() => {
          word.style.opacity = '1';
          word.style.transform = 'translateY(0)';
        }, index * this.options.animationDelay);
      });
    }
  }
  
  // CSS for blinking cursor animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes blink {
      0%, 50% { border-color: currentColor; }
      51%, 100% { border-color: transparent; }
    }
    
    /* Optional: Add some easing curves for smoother animations */
    .animate-fade-in,
    .animate-slide-up,
    .animate-slide-down,
    .animate-slide-left,
    .animate-slide-right,
    .animate-scale-up {
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;
  document.head.appendChild(style);
  
  // Initialize the animator when the script loads
  let textAnimator;
  
  // For Astro, we need to reinitialize on navigation
  document.addEventListener('astro:page-load', () => {
    textAnimator = new TextAnimator({
      threshold: 0.1,
      animationDelay: 150,
      animationDuration: 800
    });
  });
  
  // Fallback for non-Astro sites
  if (!window.astro) {
    textAnimator = new TextAnimator();
  }
  
  // Export for manual initialization if needed
  window.TextAnimator = TextAnimator;