// Fête Villageoise — main.js
document.addEventListener('DOMContentLoaded', () => {
  initFanions();
  initMobileMenu();
  initStickyHeader();
  initScrollAnimations();
  initSmoothScroll();
  initActiveNav();
  initCmsContent();
});

// Generate fanion pennants dynamically
function initFanions() {
  const track = document.getElementById('fanionsTrack');
  if (!track) return;
  const colors = ['var(--bleu-logo)', 'var(--or-girouette)', 'var(--rouge-guirlande)', 'var(--ambre-fete)'];
  const count = Math.ceil(window.innerWidth / 20) + 4;
  for (let i = 0; i < count; i++) {
    const f = document.createElement('div');
    f.className = 'fanion';
    f.style.background = colors[i % 4];
    f.style.animationDelay = `${(i % 5) * 0.15}s`;
    track.appendChild(f);
  }
}

// Mobile hamburger menu
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!links.contains(e.target) && !toggle.contains(e.target)) {
      links.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Sticky header background on scroll
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Scroll reveal animations
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// Load CMS content from KV (if edited via admin)
function initCmsContent() {
  var page = window.location.pathname.replace(/^\//, '').replace(/\.html$/, '').replace(/\/$/, '') || 'accueil';
  if (page === 'archives') page = 'archives';
  else if (page.startsWith('archives/')) page = page.replace('archives/', 'archive-');

  fetch('/api/content/' + page)
    .then(function(res) { return res.ok ? res.json() : null; })
    .then(function(data) {
      if (!data) return;
      applyCmsContent(data);
    })
    .catch(function() { /* fallback to static HTML */ });
}

function applyCmsContent(data) {
  // Text content: data-cms="key" → el.textContent = data[key]
  document.querySelectorAll('[data-cms]').forEach(function(el) {
    var val = resolvePath(data, el.getAttribute('data-cms'));
    if (val !== null && val !== '') el.textContent = val;
  });

  // HTML content: data-cms-html="key" → el.innerHTML = data[key]
  document.querySelectorAll('[data-cms-html]').forEach(function(el) {
    var val = resolvePath(data, el.getAttribute('data-cms-html'));
    if (val !== null && val !== '') el.innerHTML = val;
  });

  // Links: data-cms-href="key" → el.href = data[key]
  document.querySelectorAll('[data-cms-href]').forEach(function(el) {
    var val = resolvePath(data, el.getAttribute('data-cms-href'));
    if (val !== null && val !== '') el.href = val;
  });

  // Images: data-cms-src="key" → el.src = data[key]
  document.querySelectorAll('[data-cms-src]').forEach(function(el) {
    var val = resolvePath(data, el.getAttribute('data-cms-src'));
    if (val !== null && val !== '') el.src = val;
  });

  // Lists: data-cms-list="key" with template inside
  document.querySelectorAll('[data-cms-list]').forEach(function(container) {
    var key = container.getAttribute('data-cms-list');
    var items = resolvePath(data, key);
    if (!items || !Array.isArray(items) || items.length === 0) return;
    var template = container.querySelector('[data-cms-template]');
    if (!template) return;
    // Clear existing items (keep template)
    var existing = container.querySelectorAll('[data-cms-item]');
    existing.forEach(function(el) { el.remove(); });
    // Generate items from data
    items.forEach(function(item) {
      var clone = template.cloneNode(true);
      clone.removeAttribute('data-cms-template');
      clone.setAttribute('data-cms-item', '');
      clone.style.display = '';
      // Fill fields
      clone.querySelectorAll('[data-field]').forEach(function(field) {
        var fieldKey = field.getAttribute('data-field');
        if (item[fieldKey] !== undefined) field.textContent = item[fieldKey];
      });
      container.appendChild(clone);
    });
    template.style.display = 'none';
  });
}

function resolvePath(obj, path) {
  var keys = path.split('.');
  var val = obj;
  for (var i = 0; i < keys.length; i++) {
    if (val && val[keys[i]] !== undefined) val = val[keys[i]];
    else return null;
  }
  return val;
}

// Highlight active nav link based on current URL
function initActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (path === href || (href !== '/' && path.startsWith(href))) {
      link.classList.add('active');
    }
    if (path === '/' && href === '/') {
      link.classList.add('active');
    }
  });
}
