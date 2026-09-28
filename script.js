/**
 * Shaza Mosad - Personal Portfolio Script
 * Modular JavaScript for theme toggle, mobile navigation, scrollspy,
 * interactive contact form, copy to clipboard, and toast notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initScrollSpy();
  initSkillsFilter();
  initContactForm();
  initCopyButtons();
  initBackToTop();
  initProfileFallback();
});

/* ==========================================================================
   Theme Management (Light / Dark Mode, Default: Dark)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Retrieve saved theme or default to 'dark'
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

/* ==========================================================================
   Navigation & Mobile Drawer
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky header background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile drawer when link clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target) && mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* ==========================================================================
   ScrollSpy: Highlight Active Nav Link
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-links .nav-link');

  if (!sections.length || !desktopLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   Skills Category Filter
   ========================================================================== */
function initSkillsFilter() {
  const tabButtons = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  if (!tabButtons.length || !skillCards.length) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   Contact Form Validation & Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = form.querySelector('button[type="submit"]');

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      markInvalid(nameInput, 'Please enter your name');
      isValid = false;
    } else {
      markValid(nameInput);
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      markInvalid(emailInput, 'Please enter a valid email address');
      isValid = false;
    } else {
      markValid(emailInput);
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      markInvalid(messageInput, 'Please write a message with at least 10 characters');
      isValid = false;
    } else {
      markValid(messageInput);
    }

    if (!isValid) return;

    // Simulated Form Submission State
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Sending Message...
    `;

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
      showToast('Thank you! Your message has been sent successfully.', 'success');
    }, 900);
  });

  // Real-time input cleaning
  ['contact-name', 'contact-email', 'contact-message'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => markValid(input));
    }
  });
}

function markInvalid(element, msg) {
  element.classList.add('invalid');
  const feedback = element.nextElementSibling;
  if (feedback && feedback.classList.contains('form-feedback')) {
    feedback.textContent = msg;
  }
}

function markValid(element) {
  element.classList.remove('invalid');
}

/* ==========================================================================
   Copy to Clipboard Helpers (Email & Phone)
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Text';

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalHTML = btn.innerHTML;
        
        // Show checkmark icon
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-emerald);">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        `;

        showToast(`${label} copied to clipboard!`, 'success');

        setTimeout(() => {
          btn.innerHTML = originalHTML;
        }, 2000);
      } catch (err) {
        showToast(`Failed to copy ${label}`, 'error');
      }
    });
  });
}

/* ==========================================================================
   Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.pointerEvents = 'auto';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.pointerEvents = 'none';
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   Profile Image Fallback Handler
   ========================================================================== */
function initProfileFallback() {
  const profileImg = document.getElementById('hero-profile-img');
  if (!profileImg) return;

  profileImg.addEventListener('error', () => {
    // Generate an elegant SVG avatar with initials "SM" and violet gradient background
    const svgAvatar = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#7C3AED" />
            <stop offset="50%" stop-color="#4F46E5" />
            <stop offset="100%" stop-color="#06B6D4" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#A78BFA" stop-opacity="0.3" />
            <stop offset="100%" stop-color="transparent" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="400" fill="url(#grad)" rx="24"/>
        <circle cx="200" cy="200" r="170" fill="url(#glow)"/>
        <circle cx="200" cy="155" r="55" fill="#FFFFFF" fill-opacity="0.92"/>
        <path d="M110 320 C110 240, 290 240, 290 320 Z" fill="#FFFFFF" fill-opacity="0.92"/>
      </svg>
    `;
    const blob = new Blob([svgAvatar], { type: 'image/svg+xml;charset=utf-8' });
    profileImg.src = URL.createObjectURL(blob);
    profileImg.alt = "Shaza Mosad - Profile Avatar";
  });
}

/* ==========================================================================
   Toast Notification Toast Handler
   ========================================================================== */
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `
      <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-emerald);">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    `;
  } else if (type === 'error') {
    iconSvg = `
      <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #EF4444;">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    `;
  } else {
    iconSvg = `
      <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    `;
  }

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove after 3.5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}
