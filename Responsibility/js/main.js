// ============================================================
// FASHION COMFORT GROUP — MASTER JAVASCRIPT
// High-End Luxury Interactions, i18n Engine & Navigation
// ============================================================

// === i18n Engine ===
const i18n = {
  currentLang: localStorage.getItem('fc-lang') || 'en',
  translations: {},
  basePath: '',

  async init(basePath = '') {
    this.basePath = basePath;
    await this.loadLanguage(this.currentLang);
    this.applyTranslations();
    this.updateToggle();
    this.reorderContacts();
  },

  async loadLanguage(lang) {
    try {
      const response = await fetch(`${this.basePath}locales/${lang}.json`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      this.translations = await response.json();
      this.currentLang = lang;
      localStorage.setItem('fc-lang', lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.warn(`Failed to load language: ${lang}`, e);
    }
  },

  async switchLanguage(lang) {
    if (lang === this.currentLang && Object.keys(this.translations).length > 0) return;
    await this.loadLanguage(lang);
    this.applyTranslations();
    this.updateToggle();
    this.reorderContacts();
    if (typeof portfolio !== 'undefined' && portfolio.products && portfolio.products.length > 0) {
      portfolio.render();
    }
    if (typeof renderFeed === 'function' && typeof allProducts !== 'undefined') {
      renderFeed(allProducts);
    }
  },

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const value = this.getNestedValue(el.getAttribute('data-i18n'));
      if (value) el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const value = this.getNestedValue(el.getAttribute('data-i18n-placeholder'));
      if (value) el.placeholder = value;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const value = this.getNestedValue(el.getAttribute('data-i18n-html'));
      if (value) el.innerHTML = value;
    });
  },

  getNestedValue(key) {
    return key.split('.').reduce((obj, k) => obj?.[k], this.translations);
  },

  updateToggle() {
    document.querySelectorAll('.lang-btn, .ds-lang-btn, .ds-mobile-lang-btn').forEach(btn => {
      const isActive = btn.dataset.lang === this.currentLang;
      btn.classList.toggle('active', isActive);
    });
  },

  reorderContacts() {
    const container = document.querySelector('[data-contact="bcn"]')?.parentElement;
    if (!container) return;
    const cards = Array.from(container.querySelectorAll('[data-contact]'));
    const order = this.currentLang === 'ja'
      ? ['tokyo', 'dhaka', 'bcn', 'shanghai']
      : ['bcn', 'dhaka', 'tokyo', 'shanghai'];
    order.forEach(id => {
      const card = cards.find(c => c.dataset.contact === id);
      if (card) container.appendChild(card);
    });
  }
};

// === Universal Sticky Nav ===
function initNavbar() {
  const navbar = document.querySelector('.ds-nav') || document.getElementById('navbar');
  if (!navbar) return;

  function handleScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// === Scroll Reveal Animations ===
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal], .reveal, .ds-card, .timeline-item, .ds-stat-card, .cert-card');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed', 'visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach((el, idx) => {
    if (!el.style.transitionDelay && (el.classList.contains('ds-card') || el.classList.contains('cert-card'))) {
      el.style.transitionDelay = `${(idx % 4) * 0.08}s`;
    }
    observer.observe(el);
  });
}

// === Active Nav Item Highlight ===
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.ds-nav-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  if (sections.length > 0 && (currentPath === 'index.html' || currentPath === '')) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 140) {
          current = section.id;
        }
      });
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes('#')) {
          const hash = href.split('#')[1];
          link.classList.toggle('active', hash === current);
        }
      });
    }, { passive: true });
  }
}

// === Contact Form Handler ===
function initContactForm() {
  const form = document.getElementById('contact-form') || document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn ? btn.innerHTML : 'Send Message';
    if (btn) {
      btn.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite;">↻</span> Sending...';
      btn.disabled = true;
    }

    try {
      const existingMsg = form.querySelector('.ds-form-status');
      if (existingMsg) existingMsg.remove();

      const msg = document.createElement('div');
      msg.className = 'ds-form-status';
      msg.style.cssText = 'margin-top:16px;padding:14px 18px;border-radius:8px;background:rgba(201,169,97,0.15);border:1px solid #C9A961;color:#152217;font-size:14px;font-weight:500;text-align:center;';
      msg.textContent = i18n.getNestedValue('contact.form_success') || 'Thank you! Your message has been received. Our team will contact you within 24 hours.';
      form.appendChild(msg);
      form.reset();
      setTimeout(() => {
        msg.style.transition = 'opacity 0.5s ease';
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 500);
      }, 6000);
    } catch (err) {
      const msg = document.createElement('div');
      msg.className = 'ds-form-status';
      msg.style.cssText = 'margin-top:16px;padding:14px 18px;border-radius:8px;background:rgba(220,53,69,0.1);border:1px solid #dc3545;color:#dc3545;font-size:14px;font-weight:500;text-align:center;';
      msg.textContent = i18n.getNestedValue('contact.form_error') || 'Something went wrong. Please reach out to us at info@fashioncomfort.com';
      form.appendChild(msg);
    } finally {
      if (btn) {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    }
  });
}

// === Smooth Scroll Anchor Links ===
function initSmoothScroll() {
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      const path = href.substring(0, hashIndex);
      const hash = href.substring(hashIndex);

      const currentFile = window.location.pathname.split('/').pop() || 'index.html';
      const isHome = currentFile === 'index.html' || currentFile === '';
      const targetIsHome = path === '' || path === 'index.html' || path.endsWith('index.html');

      if (isHome && targetIsHome) {
        const target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
          if (typeof window.closeMobileMenu === 'function') window.closeMobileMenu();
          if (history.pushState) history.pushState(null, null, hash);
        }
      }
    });
  });

  // Back to top
  const backToTop = document.querySelector('.ds-back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// === Chronological Milestones Timeline Interactive Animation ===
function initTimeline() {
  const wrap = document.querySelector('.timeline-wrap');
  if (!wrap) return;

  const progressBar = wrap.querySelector('.timeline-progress-bar');
  const items = wrap.querySelectorAll('.timeline-item');
  if (!items.length) return;

  // Staggered intersection observer for milestone entry animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view', 'revealed');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  items.forEach((item, index) => {
    item.style.transitionDelay = `${(index % 2) * 0.1}s`;
    observer.observe(item);
  });

  // Dynamic scroll-driven progress fill beam
  if (progressBar) {
    let ticking = false;
    function updateProgress() {
      const rect = wrap.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const start = rect.top + window.scrollY - (windowHeight * 0.65);
      const end = rect.bottom + window.scrollY - (windowHeight * 0.5);
      const totalDist = end - start;

      if (totalDist > 0) {
        const scrollPos = window.scrollY;
        let pct = ((scrollPos - start) / totalDist) * 100;
        pct = Math.max(0, Math.min(100, pct));
        progressBar.style.height = `${pct}%`;
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });

    updateProgress();
  }

  // Interactive 3D micro-tilt on desktop hover
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    items.forEach(item => {
      const card = item.querySelector('.timeline-card');
      if (!card) return;

      item.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / rect.height) * -5;
        const tiltY = (x / rect.width) * 5;
        card.style.transform = `perspective(800px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-6px)`;
      });

      item.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
}

// === Initialize Everything ===
function initAll() {
  const isSubfolder = window.location.pathname.includes('/Main/') ||
                      window.location.pathname.includes('/Manufacturing/') ||
                      window.location.pathname.includes('/Our%20History/') ||
                      window.location.pathname.includes('/Our History/') ||
                      window.location.pathname.includes('/Products/') ||
                      window.location.pathname.includes('/Responsibility/') ||
                      window.location.pathname.includes('/LYK%20Project/') ||
                      window.location.pathname.includes('/LYK Project/');
  const basePath = isSubfolder ? '../' : (document.body.dataset.basePath || '');

  i18n.init(basePath);
  initNavbar();
  initScrollReveal();
  initTimeline();
  initActiveNavHighlight();
  initContactForm();
  initSmoothScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
