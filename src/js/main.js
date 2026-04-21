// Fête Villageoise — main.js
document.addEventListener('DOMContentLoaded', () => {
  initFanions();
  initMobileMenu();
  initStickyHeader();
  initScrollAnimations();
  initSmoothScroll();
  initActiveNav();
  initCmsContent();
  initCountdown();
  initMeteo();
  initBalloonsOnDayJ();
});

// ═══ COUNTDOWN JOUR J ═══
function initCountdown() {
  var el = document.getElementById('countdown');
  if (!el) return;
  var target = new Date('2026-09-13T09:00:00+02:00').getTime();

  function render() {
    var now = Date.now();
    var diff = target - now;
    if (diff <= 0) {
      var afterMs = now - target;
      var afterDays = Math.floor(afterMs / (1000*60*60*24));
      if (afterDays < 1) {
        el.innerHTML = '<div class="countdown-jourJ">C\'est aujourd\'hui ! 🎉 Rendez-vous sur la place.</div>';
      } else {
        el.innerHTML = '<div class="countdown-label">Rendez-vous pour la 75e édition en septembre 2027.</div>';
      }
      return;
    }
    var days = Math.floor(diff / (1000*60*60*24));
    var hours = Math.floor((diff / (1000*60*60)) % 24);
    var minutes = Math.floor((diff / (1000*60)) % 60);
    var seconds = Math.floor((diff / 1000) % 60);
    var pad = function(n){ return n < 10 ? '0'+n : ''+n; };
    el.innerHTML =
      '<div class="countdown-label">Plus que ' + days + ' jour' + (days>1?'s':'') + ' avant la 74<sup>e</sup> Fête Villageoise</div>' +
      '<div class="countdown-box"><div class="countdown-num">' + days + '</div><div class="countdown-unit">jour' + (days>1?'s':'') + '</div></div>' +
      '<div class="countdown-box"><div class="countdown-num">' + pad(hours) + '</div><div class="countdown-unit">heures</div></div>' +
      '<div class="countdown-box"><div class="countdown-num">' + pad(minutes) + '</div><div class="countdown-unit">minutes</div></div>' +
      '<div class="countdown-box"><div class="countdown-num">' + pad(seconds) + '</div><div class="countdown-unit">secondes</div></div>';
  }
  render();
  setInterval(render, 1000);
}

// ═══ METEO JOUR J (Open-Meteo, gratuit, sans cle) ═══
function initMeteo() {
  var el = document.getElementById('meteo');
  if (!el) return;
  var target = new Date('2026-09-13');
  var now = new Date();
  var daysLeft = Math.floor((target - now) / (1000*60*60*24));

  if (daysLeft > 16) {
    el.innerHTML = '<div class="meteo-box"><div class="meteo-icon">📅</div><div class="meteo-info"><div class="meteo-title">Météo le jour J</div><div class="meteo-desc">Prévisions disponibles à partir de fin août 2026.</div></div></div>';
    return;
  }

  var url = 'https://api.open-meteo.com/v1/forecast?latitude=45.9125&longitude=6.1534'
    + '&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max'
    + '&timezone=Europe%2FParis&start_date=2026-09-13&end_date=2026-09-13';

  fetch(url).then(function(r){ return r.json(); }).then(function(data){
    if (!data || !data.daily) throw new Error('no data');
    var code = data.daily.weathercode[0];
    var tmin = Math.round(data.daily.temperature_2m_min[0]);
    var tmax = Math.round(data.daily.temperature_2m_max[0]);
    var pluie = data.daily.precipitation_probability_max[0];
    var icon = meteoIcon(code);
    var desc = meteoDesc(code);
    el.innerHTML =
      '<div class="meteo-box">' +
        '<div class="meteo-icon">' + icon + '</div>' +
        '<div class="meteo-info">' +
          '<div class="meteo-title">Météo prévue le 13 septembre 2026</div>' +
          '<div class="meteo-temp">' + tmin + '° / ' + tmax + '°</div>' +
          '<div class="meteo-desc">' + desc + ' · Pluie ' + pluie + '%</div>' +
        '</div>' +
      '</div>' +
      '<p class="meteo-hint">Prévisions Open-Meteo.</p>';
  }).catch(function(){
    el.innerHTML = '<div class="meteo-box"><div class="meteo-icon">🌤️</div><div class="meteo-info"><div class="meteo-title">Météo du jour J</div><div class="meteo-desc">Prévisions indisponibles pour l\'instant.</div></div></div>';
  });
}

function meteoIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '🌨️';
  if (code <= 82) return '🌦️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}
function meteoDesc(code) {
  if (code === 0) return 'Ciel dégagé';
  if (code <= 3) return 'Partiellement nuageux';
  if (code <= 48) return 'Brouillard';
  if (code <= 57) return 'Bruine';
  if (code <= 67) return 'Pluie';
  if (code <= 77) return 'Neige';
  if (code <= 82) return 'Averses';
  if (code <= 86) return 'Averses de neige';
  return 'Orages';
}

// ═══ BALLONS COLORES LE JOUR J ═══
function initBalloonsOnDayJ() {
  var target = new Date('2026-09-13');
  var targetEnd = new Date('2026-09-13T23:59:59');
  var now = new Date();
  if (now < target || now > targetEnd) return;

  var container = document.createElement('div');
  container.className = 'balloons-container';
  document.body.appendChild(container);

  var colors = ['#F4B365', '#D4760A', '#D4AF37', '#C0392B', '#4A8C4F', '#5BA3C9', '#E07A5F', '#E8B960'];
  for (var i = 0; i < 20; i++) {
    var b = document.createElement('div');
    b.className = 'balloon';
    b.style.background = colors[i % colors.length];
    b.style.left = (Math.random() * 90 + 5) + '%';
    b.style.setProperty('--delay', (Math.random() * 15) + 's');
    b.style.setProperty('--duration', (8 + Math.random() * 6) + 's');
    b.style.animationIterationCount = 'infinite';
    container.appendChild(b);
  }
}

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
