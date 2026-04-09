// Admin CMS — Fete Villageoise
const API = '/api';
let currentSection = 'accueil';
let currentData = {};

// Auth
function getToken() { return localStorage.getItem('admin_token'); }
function checkAuth() {
  const token = getToken();
  const exp = parseInt(localStorage.getItem('admin_expires') || '0');
  if (!token || exp < Date.now()) {
    window.location.href = '/admin/';
    return false;
  }
  return true;
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  if (!checkAuth()) return;
  initSidebar();
  initPublish();
  initLogout();
  loadSection('accueil');
});

function initSidebar() {
  document.querySelectorAll('.sidebar-link').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-link').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const section = btn.dataset.section;
      document.getElementById('pageTitle').textContent = btn.textContent;
      loadSection(section);
    });
  });
}

function initLogout() {
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_expires');
    window.location.href = '/admin/';
  });
}

function initPublish() {
  document.getElementById('publishBtn').addEventListener('click', saveSection);
}

// Section schemas — TOUTES les pages du site
const SCHEMAS = {

  // ═══ ACCUEIL ═══
  accueil: [
    { key: '_heading', label: 'Hero', type: 'heading' },
    { key: 'heroEdition', label: 'Badge edition (ex: 74e edition)', type: 'text', placeholder: '74e edition' },
    { key: 'heroTitre', label: 'Titre principal', type: 'text', placeholder: 'La Fete Villageoise d\'Annecy-le-Vieux' },
    { key: 'heroSousTitre', label: 'Sous-titre', type: 'text', placeholder: 'Depuis 1950, la fete qui reunit...' },
    { key: 'heroDate', label: 'Date affichee', type: 'text', placeholder: 'Septembre 2026' },
    { key: 'heroCta1Texte', label: 'Bouton principal (texte)', type: 'text', placeholder: 'Decouvrir le programme' },
    { key: 'heroCta1Lien', label: 'Bouton principal (lien)', type: 'link', placeholder: '/edition-2026.html' },
    { key: 'heroCta2Texte', label: 'Bouton secondaire (texte)', type: 'text', placeholder: 'Devenir benevole' },
    { key: 'heroCta2Lien', label: 'Bouton secondaire (lien)', type: 'link', placeholder: '/benevoles.html' },

    { key: '_heading2', label: 'Chiffres cles', type: 'heading' },
    { key: 'stat1Nombre', label: 'Chiffre 1 (nombre)', type: 'text', placeholder: '76' },
    { key: 'stat1Label', label: 'Chiffre 1 (legende)', type: 'text', placeholder: 'annees d\'existence' },
    { key: 'stat2Nombre', label: 'Chiffre 2 (nombre)', type: 'text', placeholder: '74' },
    { key: 'stat2Label', label: 'Chiffre 2 (legende)', type: 'text', placeholder: 'editions realisees' },
    { key: 'stat3Nombre', label: 'Chiffre 3 (nombre)', type: 'text', placeholder: '50+' },
    { key: 'stat3Label', label: 'Chiffre 3 (legende)', type: 'text', placeholder: 'benevoles chaque annee' },
    { key: 'stat4Nombre', label: 'Chiffre 4 (nombre)', type: 'text', placeholder: '43+' },
    { key: 'stat4Label', label: 'Chiffre 4 (legende)', type: 'text', placeholder: 'partenaires locaux' },

    { key: '_heading3', label: 'Bloc prochaine edition', type: 'heading' },
    { key: 'editionTitre', label: 'Titre', type: 'text', placeholder: 'Rendez-vous en septembre 2026' },
    { key: 'editionTexte', label: 'Texte', type: 'textarea', placeholder: 'La 74e edition se prepare...' },
    { key: 'editionLieu', label: 'Texte lieu', type: 'text' },
    { key: 'editionAnimations', label: 'Texte animations', type: 'text' },
    { key: 'editionSolidarite', label: 'Texte solidarite', type: 'text' },

    { key: '_heading4', label: 'Bloc solidarite', type: 'heading' },
    { key: 'solidariteTitre', label: 'Titre solidarite', type: 'text' },
    { key: 'solidarite23Titre', label: 'Bloc 2/3 — titre', type: 'text' },
    { key: 'solidarite23Texte', label: 'Bloc 2/3 — texte', type: 'textarea' },
    { key: 'solidarite13Titre', label: 'Bloc 1/3 — titre', type: 'text' },
    { key: 'solidarite13Texte', label: 'Bloc 1/3 — texte', type: 'textarea' },
    { key: 'solidariteConclusion', label: 'Phrase de conclusion', type: 'textarea' },

    { key: '_heading5', label: 'Bloc partenaires', type: 'heading' },
    { key: 'partenairesTitre', label: 'Titre partenaires', type: 'text' },
    { key: 'partenairesTexte', label: 'Texte partenaires', type: 'text' },

    { key: '_heading6', label: 'Bloc archives', type: 'heading' },
    { key: 'archivesTitre', label: 'Titre archives', type: 'text' },
    { key: 'archivesTexte', label: 'Texte archives', type: 'text' },
  ],

  // ═══ EDITION 2026 ═══
  'edition-2026': [
    { key: '_heading', label: 'Hero', type: 'heading' },
    { key: 'heroEdition', label: 'Badge', type: 'text', placeholder: '74e edition' },
    { key: 'heroTitre', label: 'Titre', type: 'text', placeholder: 'Fete Villageoise 2026' },
    { key: 'heroSousTitre', label: 'Sous-titre (lieu + date)', type: 'text' },

    { key: '_heading2', label: 'Programme', type: 'heading' },
    { key: 'programmeTitre', label: 'Titre section programme', type: 'text' },
    { key: 'programmeIntro', label: 'Texte intro programme', type: 'textarea' },
    { key: 'programme', label: 'Horaires (une ligne par creneau)', type: 'list', fields: ['horaire', 'animation', 'detail'] },

    { key: '_heading3', label: 'Restauration', type: 'heading' },
    { key: 'restaurationTitre', label: 'Titre restauration', type: 'text' },
    { key: 'restaurationTexte', label: 'Texte restauration', type: 'textarea' },
    { key: 'restaurationPrix', label: 'Prix tartiflette', type: 'text', placeholder: '12,50 EUR' },
    { key: 'restaurationCtaTexte', label: 'Texte bouton reservation', type: 'text' },
    { key: 'restaurationCtaLien', label: 'Lien reservation', type: 'link', placeholder: 'https://coespc.org/' },

    { key: '_heading4', label: 'Animations', type: 'heading' },
    { key: 'animations', label: 'Liste des animations', type: 'list', fields: ['animation', 'public', 'description'] },

    { key: '_heading5', label: 'Tombola', type: 'heading' },
    { key: 'tombolaTitre', label: 'Titre tombola', type: 'text' },
    { key: 'tombolaTexte', label: 'Texte tombola', type: 'textarea' },
    { key: 'tombolaPrix', label: 'Prix du billet', type: 'text', placeholder: '2 EUR' },
    { key: 'tombolaCtaTexte', label: 'Texte bouton achat', type: 'text' },
    { key: 'tombolaCtaLien', label: 'Lien achat', type: 'link', placeholder: 'https://coespc.org/' },
    { key: 'tombolaLots', label: 'Lots principaux', type: 'list', fields: ['lot', 'donateur', 'valeur'] },
    { key: 'tombolaResultats', label: 'Resultats (apres tirage)', type: 'list', fields: ['lot', 'ticket_gagnant', 'donateur'] },

    { key: '_heading6', label: 'Infos pratiques', type: 'heading' },
    { key: 'lieu', label: 'Lieu', type: 'textarea' },
    { key: 'parking', label: 'Parking', type: 'text' },
    { key: 'tarifs', label: 'Tarifs', type: 'text' },
    { key: 'contactEmail', label: 'Email contact', type: 'text' },
  ],

  // ═══ HISTOIRE ═══
  histoire: [
    { key: '_heading', label: 'Hero', type: 'heading' },
    { key: 'heroTitre', label: 'Titre page', type: 'text', placeholder: '76 ans de fete au village' },
    { key: 'heroSousTitre', label: 'Sous-titre', type: 'text' },

    { key: '_heading2', label: 'Section : Les origines (1948-1953)', type: 'heading' },
    { key: 'originesTitre', label: 'Titre', type: 'text' },
    { key: 'originesTexte', label: 'Texte', type: 'textarea' },
    { key: 'originesCitation', label: 'Citation du Vieux Clocher', type: 'textarea' },

    { key: '_heading3', label: 'Section : Annees 1950', type: 'heading' },
    { key: 'annees50Titre', label: 'Titre', type: 'text' },
    { key: 'annees50Texte', label: 'Texte', type: 'textarea' },

    { key: '_heading4', label: 'Section : Evolution 1960-1980', type: 'heading' },
    { key: 'evolutionTitre', label: 'Titre', type: 'text' },
    { key: 'evolutionTexte', label: 'Texte', type: 'textarea' },

    { key: '_heading5', label: 'Section : L\'Ancilevienne (1985-86)', type: 'heading' },
    { key: 'ancilevienneTitre', label: 'Titre', type: 'text' },
    { key: 'ancilevienneTexte', label: 'Texte', type: 'textarea' },

    { key: '_heading6', label: 'Section : Aujourd\'hui', type: 'heading' },
    { key: 'aujourdhuiTitre', label: 'Titre', type: 'text' },
    { key: 'aujourdhuiTexte', label: 'Texte', type: 'textarea' },

    { key: '_heading7', label: 'Chronologie', type: 'heading' },
    { key: 'chronologie', label: 'Dates cles', type: 'list', fields: ['annee', 'evenement'] },
  ],

  // ═══ ASSOCIATION ═══
  association: [
    { key: 'heroTitre', label: 'Titre page', type: 'text' },
    { key: 'heroSousTitre', label: 'Sous-titre', type: 'text' },
    { key: 'quiTitre', label: 'Section "Qui sommes-nous" — titre', type: 'text' },
    { key: 'quiTexte', label: 'Texte', type: 'textarea' },
    { key: 'beneficesTitre', label: 'Section benefices — titre', type: 'text' },
    { key: 'beneficesTexte', label: 'Texte', type: 'textarea' },
    { key: 'equipeTitre', label: 'Section equipe — titre', type: 'text' },
    { key: 'equipeTexte', label: 'Texte', type: 'textarea' },
  ],

  // ═══ PARTENAIRES ═══
  partenaires: [
    { key: 'heroTitre', label: 'Titre page', type: 'text', placeholder: 'Ils rendent la fete possible' },
    { key: 'heroSousTitre', label: 'Sous-titre', type: 'text' },

    { key: '_heading2', label: 'Partenaires institutionnels', type: 'heading' },
    { key: 'institutionnels', label: 'Partenaires institutionnels', type: 'list', fields: ['nom', 'role', 'lien'] },

    { key: '_heading3', label: 'Restaurants', type: 'heading' },
    { key: 'restaurants', label: 'Restaurants', type: 'list', fields: ['nom', 'specialite'] },

    { key: '_heading4', label: 'Commerces et artisans', type: 'heading' },
    { key: 'commerces', label: 'Commerces', type: 'list', fields: ['nom', 'type'] },

    { key: '_heading5', label: 'Grande distribution', type: 'heading' },
    { key: 'grandeDistribution', label: 'Enseignes', type: 'list', fields: ['nom', 'localisation'] },

    { key: '_heading6', label: 'Entreprises', type: 'heading' },
    { key: 'entreprises', label: 'Entreprises', type: 'list', fields: ['nom', 'secteur'] },

    { key: '_heading7', label: 'Devenir partenaire', type: 'heading' },
    { key: 'devenirTexte', label: 'Texte appel partenaires', type: 'textarea' },
    { key: 'devenirEmail', label: 'Email contact', type: 'text' },
  ],

  // ═══ BENEVOLES ═══
  benevoles: [
    { key: 'heroTitre', label: 'Titre page', type: 'text', placeholder: 'La fete a besoin de vous' },
    { key: 'heroSousTitre', label: 'Sous-titre', type: 'text' },
    { key: 'pourquoiTitre', label: 'Pourquoi etre benevole — titre', type: 'text' },
    { key: 'pourquoiTexte', label: 'Texte', type: 'textarea' },
    { key: 'postes', label: 'Postes benevoles', type: 'list', fields: ['poste', 'description', 'horaires'] },
    { key: 'inscriptionTitre', label: 'Comment s\'inscrire — titre', type: 'text' },
    { key: 'inscriptionTexte', label: 'Texte', type: 'textarea' },
    { key: 'email', label: 'Email contact', type: 'text' },
    { key: 'telephone', label: 'Telephone', type: 'text' },
  ],

  // ═══ PRESSE ═══
  presse: [
    { key: 'titre', label: 'Titre page', type: 'text' },
    { key: 'texteIntro', label: 'Texte introduction', type: 'textarea' },
    { key: 'chiffres', label: 'Chiffres cles pour journalistes', type: 'list', fields: ['chiffre', 'description'] },
    { key: 'contactPresse', label: 'Email contact presse', type: 'text' },
  ],

  // ═══ CONTACT ═══
  contact: [
    { key: 'email', label: 'Email principal', type: 'text' },
    { key: 'telephone', label: 'Telephone', type: 'text' },
    { key: 'adresse', label: 'Adresse postale', type: 'textarea' },
    { key: 'facebook', label: 'Lien Facebook', type: 'link' },
    { key: 'coespcOrg', label: 'Lien coespc.org', type: 'link' },
    { key: 'archivesTexte', label: 'Texte "Enrichissez notre histoire"', type: 'textarea' },
    { key: 'liensUtiles', label: 'Liens utiles', type: 'list', fields: ['nom', 'url', 'description'] },
  ],

  // ═══ ARCHIVES (gestion par annee) ═══
  archives: [
    { key: '_heading', label: 'Gestion des archives', type: 'heading' },
    { key: 'info', label: '', type: 'readonly', value: 'Choisissez une annee dans la liste ci-dessous pour modifier son contenu.' },
    { key: 'annees', label: 'Annees archivees', type: 'archive-selector' },
  ],
};

// Schema generique pour une page d'archive individuelle
const ARCHIVE_SCHEMA = [
  { key: 'heroEdition', label: 'Badge edition (ex: 73e edition)', type: 'text' },
  { key: 'heroTitre', label: 'Titre', type: 'text', placeholder: 'Fete Villageoise 20XX' },
  { key: 'heroTheme', label: 'Theme / sous-titre', type: 'text' },
  { key: 'resumeTitre', label: 'Titre resume', type: 'text' },
  { key: 'resumeTexte', label: 'Texte resume', type: 'textarea' },
  { key: 'president', label: 'President', type: 'text' },
  { key: 'musique', label: 'Groupe(s) de musique', type: 'text' },
  { key: 'tombolaTexte', label: 'Texte tombola', type: 'textarea' },
  { key: 'tombolaLots', label: 'Lots principaux', type: 'list', fields: ['lot', 'donateur', 'ticket_gagnant'] },
  { key: 'solidariteTexte', label: 'Texte solidarite', type: 'textarea' },
  { key: 'partenairesTexte', label: 'Texte partenaires', type: 'textarea' },
  { key: 'imageAffiche', label: 'Affiche (image)', type: 'image' },
  { key: 'photos', label: 'Photos de l\'edition', type: 'image-list' },
];

// Annees disponibles
const ARCHIVE_YEARS = [2025, 2024, 2023, 2022, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011];

async function loadSection(section) {
  currentSection = section;
  const content = document.getElementById('adminContent');
  content.innerHTML = '<p class="admin-loading">Chargement...</p>';

  try {
    const res = await fetch(`${API}/content/${section}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    currentData = res.ok ? await res.json() || {} : {};
  } catch { currentData = {}; }

  renderForm(section, currentData);

  if (currentData._lastModified) {
    document.getElementById('lastModified').textContent =
      'Derniere modification : ' + new Date(currentData._lastModified).toLocaleString('fr-FR');
  } else {
    document.getElementById('lastModified').textContent = '';
  }
}

function renderForm(section, data) {
  let schema = SCHEMAS[section];

  // Si c'est une archive individuelle (archive-2025, etc.)
  if (!schema && section.startsWith('archive-')) {
    schema = ARCHIVE_SCHEMA;
  }

  if (!schema) {
    document.getElementById('adminContent').innerHTML = '<p>Section inconnue</p>';
    return;
  }

  const container = document.getElementById('adminContent');
  container.innerHTML = '';

  schema.forEach(field => {
    const group = document.createElement('div');
    group.className = 'form-group';

    // Heading (separateur visuel)
    if (field.type === 'heading') {
      group.className = 'form-heading';
      group.innerHTML = '<h3 class="form-heading-title">' + field.label + '</h3>';
      container.appendChild(group);
      return;
    }

    // Readonly
    if (field.type === 'readonly') {
      group.innerHTML = '<div class="form-info">' + field.value + '</div>';
      container.appendChild(group);
      return;
    }

    // Archive selector (liste d'annees cliquables)
    if (field.type === 'archive-selector') {
      const grid = document.createElement('div');
      grid.className = 'archive-year-grid';
      ARCHIVE_YEARS.forEach(year => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'archive-year-btn';
        btn.textContent = year;
        btn.addEventListener('click', () => {
          document.getElementById('pageTitle').textContent = 'Archive ' + year;
          loadSection('archive-' + year);
        });
        grid.appendChild(btn);
      });
      group.appendChild(grid);
      container.appendChild(group);
      return;
    }

    const label = document.createElement('label');
    label.className = 'form-label';
    label.textContent = field.label;
    group.appendChild(label);

    if (field.type === 'text') {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'form-input';
      input.name = field.key;
      input.value = data[field.key] || '';
      input.placeholder = field.placeholder || '';
      group.appendChild(input);

    } else if (field.type === 'link') {
      const wrap = document.createElement('div');
      wrap.className = 'link-editor';
      const input = document.createElement('input');
      input.type = 'url';
      input.className = 'form-input';
      input.name = field.key;
      input.value = data[field.key] || '';
      input.placeholder = field.placeholder || 'https://...';
      wrap.appendChild(input);
      const hint = document.createElement('small');
      hint.className = 'form-hint';
      hint.textContent = 'Lien complet (https://...) ou chemin relatif (/page.html)';
      wrap.appendChild(hint);
      group.appendChild(wrap);

    } else if (field.type === 'textarea') {
      const ta = document.createElement('textarea');
      ta.className = 'form-textarea';
      ta.name = field.key;
      ta.rows = 4;
      ta.value = data[field.key] || '';
      ta.placeholder = field.placeholder || '';
      group.appendChild(ta);

    } else if (field.type === 'image') {
      const wrap = document.createElement('div');
      wrap.className = 'image-editor';
      // Preview
      if (data[field.key]) {
        const img = document.createElement('img');
        img.src = data[field.key];
        img.className = 'image-preview';
        img.alt = 'Apercu';
        wrap.appendChild(img);
      }
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/jpeg,image/png,image/webp';
      fileInput.className = 'form-file';
      fileInput.dataset.key = field.key;
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = await uploadImage(file);
        if (url) {
          data[field.key] = url;
          // Refresh preview
          let prev = wrap.querySelector('.image-preview');
          if (!prev) { prev = document.createElement('img'); prev.className = 'image-preview'; prev.alt = 'Apercu'; wrap.insertBefore(prev, fileInput); }
          prev.src = url;
          showToast('Image envoyee');
        }
      });
      wrap.appendChild(fileInput);
      const urlInput = document.createElement('input');
      urlInput.type = 'text';
      urlInput.className = 'form-input';
      urlInput.name = field.key;
      urlInput.value = data[field.key] || '';
      urlInput.placeholder = 'URL de l\'image (ou uploader ci-dessus)';
      wrap.appendChild(urlInput);
      group.appendChild(wrap);

    } else if (field.type === 'image-list') {
      const wrap = document.createElement('div');
      wrap.className = 'image-list-editor';
      wrap.dataset.key = field.key;
      const images = data[field.key] || [];
      images.forEach((url, i) => {
        wrap.appendChild(createImageItem(url, i));
      });
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'btn-add-row';
      addBtn.textContent = '+ Ajouter une photo';
      addBtn.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/jpeg,image/png,image/webp';
        fileInput.click();
        fileInput.addEventListener('change', async (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const url = await uploadImage(file);
          if (url) {
            wrap.insertBefore(createImageItem(url, wrap.querySelectorAll('.image-item').length), addBtn);
            showToast('Photo ajoutee');
          }
        });
      });
      wrap.appendChild(addBtn);
      group.appendChild(wrap);

    } else if (field.type === 'list') {
      const listData = data[field.key] || [];
      const table = document.createElement('div');
      table.className = 'list-editor';
      table.dataset.key = field.key;
      table.dataset.fields = JSON.stringify(field.fields);

      listData.forEach((row, i) => {
        table.appendChild(createListRow(field.fields, row, i));
      });

      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'btn-add-row';
      addBtn.textContent = '+ Ajouter une ligne';
      addBtn.addEventListener('click', () => {
        const newRow = {};
        field.fields.forEach(f => newRow[f] = '');
        table.insertBefore(createListRow(field.fields, newRow, table.querySelectorAll('.list-row').length), addBtn);
      });
      table.appendChild(addBtn);
      group.appendChild(table);
    }

    container.appendChild(group);
  });
}

function createImageItem(url, index) {
  const item = document.createElement('div');
  item.className = 'image-item';
  const img = document.createElement('img');
  img.src = url;
  img.className = 'image-thumb';
  img.alt = 'Photo ' + (index + 1);
  item.appendChild(img);
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'photo';
  input.value = url;
  item.appendChild(input);
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn-remove-row';
  removeBtn.textContent = 'X';
  removeBtn.addEventListener('click', () => item.remove());
  item.appendChild(removeBtn);
  return item;
}

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await fetch(API + '/upload', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + getToken() },
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      return data.url;
    } else {
      const err = await res.json();
      showToast(err.error || 'Erreur upload', true);
      return null;
    }
  } catch (e) {
    showToast('Erreur connexion upload', true);
    return null;
  }
}

function createListRow(fields, rowData, index) {
  const row = document.createElement('div');
  row.className = 'list-row';

  fields.forEach(f => {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-input list-input';
    input.name = f;
    input.value = rowData[f] || '';
    input.placeholder = f;
    row.appendChild(input);
  });

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn-remove-row';
  removeBtn.textContent = 'X';
  removeBtn.addEventListener('click', () => row.remove());
  row.appendChild(removeBtn);

  return row;
}

async function saveSection() {
  const btn = document.getElementById('publishBtn');
  btn.disabled = true;
  btn.textContent = 'Publication...';

  let schema = SCHEMAS[currentSection];
  if (!schema && currentSection.startsWith('archive-')) schema = ARCHIVE_SCHEMA;
  if (!schema) return;

  const formData = {};
  schema.forEach(field => {
    if (field.type === 'readonly' || field.type === 'heading' || field.type === 'archive-selector') return;

    if (field.type === 'text' || field.type === 'textarea' || field.type === 'link') {
      const el = document.querySelector('[name="' + field.key + '"]');
      if (el) formData[field.key] = el.value;
    } else if (field.type === 'image') {
      const el = document.querySelector('[name="' + field.key + '"]');
      if (el) formData[field.key] = el.value;
    } else if (field.type === 'image-list') {
      const editor = document.querySelector('.image-list-editor[data-key="' + field.key + '"]');
      if (editor) {
        formData[field.key] = Array.from(editor.querySelectorAll('.image-item input[name="photo"]')).map(i => i.value);
      }
    } else if (field.type === 'list') {
      const editor = document.querySelector('.list-editor[data-key="' + field.key + '"]');
      if (editor) {
        const rows = editor.querySelectorAll('.list-row');
        formData[field.key] = Array.from(rows).map(row => {
          const obj = {};
          field.fields.forEach(f => {
            const input = row.querySelector('[name="' + f + '"]');
            if (input) obj[f] = input.value;
          });
          return obj;
        });
      }
    }
  });

  try {
    const res = await fetch(`${API}/content/${currentSection}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      const result = await res.json();
      showToast('Modifications publiees !');
      if (result.lastModified) {
        document.getElementById('lastModified').textContent =
          'Derniere modification : ' + new Date(result.lastModified).toLocaleString('fr-FR');
      }
    } else {
      showToast('Erreur lors de la publication', true);
    }
  } catch {
    showToast('Erreur de connexion', true);
  }

  btn.disabled = false;
  btn.textContent = 'Publier les modifications';
}

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast' + (isError ? ' toast-error' : '');
  toast.hidden = false;
  setTimeout(() => { toast.hidden = true; }, 3000);
}
