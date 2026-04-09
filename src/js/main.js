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
  var page = window.location.pathname.replace(/^\//, '').replace(/\.html$/, '') || 'accueil';
  if (page.startsWith('archives/')) page = page.replace('archives/', 'archive-');

  fetch('/api/content/' + page)
    .then(function(res) { return res.ok ? res.json() : null; })
    .then(function(data) {
      if (!data) return;
      // Apply CMS overrides to elements with data-cms attributes
      document.querySelectorAll('[data-cms]').forEach(function(el) {
        var key = el.getAttribute('data-cms');
        var keys = key.split('.');
        var val = data;
        for (var i = 0; i < keys.length; i++) {
          if (val && val[keys[i]] !== undefined) val = val[keys[i]];
          else { val = null; break; }
        }
        if (val !== null && val !== '') el.textContent = val;
      });
    })
    .catch(function() { /* fallback to static HTML */ });
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
