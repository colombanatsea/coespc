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
  initGallery();
  initPartnersFeed();
  initBalloonsHero();
});

// ═══ DECORATIONS DE PAGE (desactivees) ═══
// Ancien systeme qui injectait des elements flottants position:fixed
// (tartiflette, verres, coq suivant le scroll). Retire car polluait
// la lecture. Les decorations visuelles se font maintenant dans les
// separateurs entre blocs (.cheers-divider, .rooster-scene) ou dans
// le contenu statique, pas en overlay.
function _initPageDecorationsDisabled() {
  // Mapping url path -> liste de décorations à injecter
  // Clés possibles : tartiflette, verres, lac, montagne, coq, coeur, ballon,
  // clocher, journal, panier, tombola
  var path = window.location.pathname.replace(/\/$/, '') || '/';
  var DECORATIONS_BY_PAGE = {
    '/':                          ['coq', 'verres'],               // home (ballons déjà pour day J)
    '/histoire':                  ['montagne', 'clocher'],
    '/histoire.html':             ['montagne', 'clocher'],
    '/association':               ['coeur', 'clocher'],
    '/association.html':          ['coeur', 'clocher'],
    '/edition-2026':              ['tartiflette', 'tombola'],
    '/edition-2026.html':         ['tartiflette', 'tombola'],
    '/partenaires':               ['verres', 'panier'],
    '/partenaires.html':          ['verres', 'panier'],
    '/benevoles':                 ['coeur', 'coq'],
    '/benevoles.html':            ['coeur', 'coq'],
    '/contact':                   ['coq', 'clocher'],
    '/contact.html':              ['coq', 'clocher'],
    '/archives':                  ['montagne', 'clocher'],
    '/foire-aux-questions':       ['coq'],
    '/foire-aux-questions.html':  ['coq'],
    '/presse':                    ['journal', 'montagne'],
    '/presse.html':               ['journal', 'montagne'],
  };
  // Pages archives individuelles
  if (/^\/archives\/\d{4}/.test(path)) {
    DECORATIONS_BY_PAGE[path] = ['montagne', 'clocher'];
  }

  var decos = DECORATIONS_BY_PAGE[path];
  if (!decos || !decos.length) return;

  // Container
  var container = document.createElement('div');
  container.className = 'page-decorations';
  container.setAttribute('aria-hidden', 'true');

  // Définitions HTML de chaque type de décoration
  var DEFINITIONS = {
    tartiflette: '<span class="page-decoration decor-tartiflette" title="Tartiflette">&#129472;</span>',
    verres:      '<span class="page-decoration decor-verres"><span>&#127863;</span><span>&#127863;</span></span>',
    lac:         '<span class="page-decoration decor-lac" title="Lac d&apos;Annecy">&#127754;</span>',
    montagne:    '<span class="page-decoration decor-montagne" title="La Tournette">&#127956;&#65039;</span>',
    coq:         '<div class="page-decoration decor-coq-wrap"><span class="decor-coq">&#128019;</span><span class="decor-coq-cry">Cocorico&nbsp;!</span></div>',
    coeur:       '<span class="page-decoration decor-coeur" title="Solidarité">&#128153;</span>',
    ballon:      '<span class="page-decoration decor-ballon" title="Ballon">&#127880;</span>',
    clocher:     '<span class="page-decoration decor-clocher" title="Clocher d&apos;Annecy-le-Vieux">&#9962;&#65039;</span>',
    journal:     '<span class="page-decoration decor-journal" title="Presse">&#128240;</span>',
    panier:      '<span class="page-decoration decor-panier" title="Panier">&#129730;</span>',
    tombola:     '<span class="page-decoration decor-tombola" title="Tombola">&#127903;&#65039;</span>',
  };

  decos.forEach(function(key) {
    var html = DEFINITIONS[key];
    if (!html) return;
    var tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    container.appendChild(tpl.content.firstChild);
  });

  document.body.appendChild(container);
}

// ═══ GALERIE PHOTOS (auto depuis /assets/images/galerie/<annee>/galerie.json) ═══
function initGallery() {
  var grids = document.querySelectorAll('[data-gallery]');
  if (!grids.length) return;
  // Lightbox
  var lb = document.createElement('div');
  lb.className = 'gallery-lightbox';
  lb.innerHTML = '<button class="gallery-lightbox-close" aria-label="Fermer">&times;</button><img alt="">';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector('img');
  var closeLb = function() { lb.classList.remove('open'); };
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeLb(); });

  grids.forEach(function(grid) {
    var annee = grid.getAttribute('data-gallery');
    fetch('/assets/images/galerie/' + annee + '/galerie.json', { cache: 'no-cache' })
      .then(function(r) { return r.ok ? r.json() : []; })
      .then(function(list) {
        if (!Array.isArray(list) || !list.length) {
          grid.innerHTML = '<p class="gallery-empty">Aucune photo disponible pour l\'instant. Les photos seront ajout&eacute;es apr&egrave;s la f&ecirc;te.</p>';
          return;
        }
        list.forEach(function(item) {
          var src = '/assets/images/galerie/' + annee + '/' + item.file;
          var alt = item.alt || 'Photo F&ecirc;te Villageoise ' + annee;
          var a = document.createElement('a');
          a.className = 'gallery-item';
          a.href = src;
          a.setAttribute('aria-label', alt);
          a.innerHTML = '<img src="' + src + '" alt="' + alt.replace(/"/g, '&quot;') + '" loading="lazy">';
          a.addEventListener('click', function(e) {
            e.preventDefault();
            lbImg.src = src;
            lbImg.alt = alt;
            lb.classList.add('open');
          });
          grid.appendChild(a);
        });
      })
      .catch(function() {
        grid.innerHTML = '<p class="gallery-empty">Aucune photo disponible pour l\'instant.</p>';
      });
  });
}

// ═══ FLUX ACTUS PARTENAIRES (via Worker /api/partners-feed) ═══
function initPartnersFeed() {
  var el = document.getElementById('partners-feed');
  if (!el) return;
  fetch('/api/partners-feed', { cache: 'no-cache' })
    .then(function(r) { return r.ok ? r.json() : null; })
    .then(function(data) {
      if (!data || !data.items || !data.items.length) {
        el.innerHTML = '<p class="partners-feed-empty">Flux indisponibles pour l\'instant.</p>';
        return;
      }
      var html = data.items.slice(0, 6).map(function(it) {
        var d = new Date(it.pubDate);
        var dateStr = isNaN(d.getTime()) ? '' : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
        return '<a class="partners-feed-item" href="' + it.link + '" target="_blank" rel="noopener">' +
               '<span class="partners-feed-source">' + it.source + '</span>' +
               '<strong class="partners-feed-title">' + escapeHtml(it.title) + '</strong>' +
               (dateStr ? '<span class="partners-feed-date">' + dateStr + '</span>' : '') +
               '</a>';
      }).join('');
      el.innerHTML = html;
    })
    .catch(function() { el.innerHTML = '<p class="partners-feed-empty">Flux indisponibles pour l\'instant.</p>'; });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function(c) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
  });
}

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

// ═══ BALLONS PASTEL PERMANENTS DANS LES HEROS ═══
// Anime un courant permanent de ballons pastel qui montent doucement
// dans le fond du hero (index) et des page-hero (autres pages).
// Inspire du design system Kermesse Eternelle.
function initBalloonsHero() {
  // Palette pastel (tirees des secondaires Kermesse Eternelle, adoucies)
  var COLORS = [
    '#F7DCA0', // jaune ballon pastel
    '#F0C29A', // ambre pastel
    '#F0B5A3', // corail pastel
    '#B0D5E5', // bleu lac pastel
    '#B2D8B5', // vert tilleul pastel
    '#EBD58F', // or girouette pastel
    '#F0D4D4', // rose pastel
    '#D1C4E0'  // lavande pastel
  ];
  var NB_BALLOONS = 8;
  var heroes = document.querySelectorAll('.hero, .page-hero');
  heroes.forEach(function(hero) {
    var container = document.createElement('div');
    container.className = 'balloons-hero';
    container.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < NB_BALLOONS; i++) {
      var b = document.createElement('span');
      b.className = 'balloon-hero';
      b.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
      b.style.left = (Math.random() * 90 + 5) + '%';
      // Taille legerement variable (28-44px) pour un effet naturel
      var size = 28 + Math.random() * 16;
      b.style.width = size + 'px';
      b.style.height = (size * 1.3) + 'px';
      b.style.setProperty('--dur', (14 + Math.random() * 10) + 's');
      b.style.setProperty('--delay', (-Math.random() * 20) + 's'); // delai negatif = certains commencent deja haut
      container.appendChild(b);
    }
    hero.insertBefore(container, hero.firstChild);
  });
}

// ═══ BALLONS COLORES LE JOUR J (plus intense, fullscreen) ═══
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

// Load CMS content from YAML files in /_content/ (Decap CMS writes these)
// Approche : le HTML contient le contenu initial (SEO, fallback). Si un YAML
// existe pour la page courante, on le lit et on remplace les elements
// marques data-cms="cle" par le contenu du YAML.
function initCmsContent() {
  var path = window.location.pathname.replace(/^\//, '').replace(/\.html$/, '').replace(/\/$/, '');
  var yamlUrl;
  // Mapping url -> fichier YAML
  if (!path || path === 'index') {
    yamlUrl = '/_content/pages/accueil.yml';
  } else if (path === 'archives') {
    yamlUrl = '/_content/pages/archives-index.yml';
  } else if (path.startsWith('archives/')) {
    var year = path.replace('archives/', '');
    yamlUrl = '/_content/archives/' + year + '.yml';
  } else {
    yamlUrl = '/_content/pages/' + path + '.yml';
  }

  // Charger js-yaml dynamiquement (CDN, lazy, pas pour le premier paint)
  var loadYamlLib = function() {
    if (window.jsyaml) return Promise.resolve();
    return new Promise(function(resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  };

  fetch(yamlUrl, { cache: 'default' })
    .then(function(res) { return res.ok ? res.text() : null; })
    .then(function(text) {
      if (!text) return null;
      return loadYamlLib().then(function() {
        try { return window.jsyaml.load(text); } catch (e) { return null; }
      });
    })
    .then(function(data) {
      if (!data) return;
      applyCmsContent(data);
    })
    .catch(function() { /* fallback silencieux sur HTML statique */ });

  // Parametres site (horaires, dates, chiffres-cles) : charges en parallele pour
  // toutes les pages afin d'etre disponibles partout
  fetch('/_content/config/site.yml', { cache: 'default' })
    .then(function(res) { return res.ok ? res.text() : null; })
    .then(function(text) {
      if (!text) return null;
      return loadYamlLib().then(function() {
        try { return { site: window.jsyaml.load(text) }; } catch (e) { return null; }
      });
    })
    .then(function(data) { if (data) applyCmsContent(data); })
    .catch(function() {});
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
