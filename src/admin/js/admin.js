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

// Section schemas
const SCHEMAS = {
  accueil: [
    { key: 'titre', label: 'Titre principal', type: 'text', placeholder: 'La Fete Villageoise...' },
    { key: 'sousTitre', label: 'Sous-titre', type: 'text', placeholder: 'Depuis 1950...' },
    { key: 'date', label: 'Date prochaine edition', type: 'text', placeholder: 'Septembre 2026' },
    { key: 'edition', label: 'Numero edition', type: 'text', placeholder: '74e edition' },
    { key: 'accroche', label: 'Texte accroche edition', type: 'textarea', placeholder: 'La 74e edition se prepare...' },
  ],
  'edition-2026': [
    { key: 'titre', label: 'Titre de la page', type: 'text' },
    { key: 'sousTitre', label: 'Sous-titre', type: 'text' },
    { key: 'programme', label: 'Programme (un horaire par ligne)', type: 'list', fields: ['horaire', 'animation'] },
    { key: 'restauration', label: 'Texte restauration', type: 'textarea' },
    { key: 'infos', label: 'Infos pratiques', type: 'textarea' },
  ],
  tombola: [
    { key: 'texteIntro', label: 'Texte introduction tombola', type: 'textarea' },
    { key: 'prixBillet', label: 'Prix du billet', type: 'text', placeholder: '2 euros' },
    { key: 'lots', label: 'Liste des lots', type: 'list', fields: ['numero', 'lot', 'donateur'] },
    { key: 'resultats', label: 'Resultats (apres tirage)', type: 'list', fields: ['lot', 'ticket_gagnant'] },
  ],
  partenaires: [
    { key: 'texteIntro', label: 'Texte introduction', type: 'textarea' },
    { key: 'partenaires', label: 'Liste des partenaires', type: 'list', fields: ['nom', 'categorie', 'lien'] },
  ],
  benevoles: [
    { key: 'texteAppel', label: 'Texte appel benevoles', type: 'textarea' },
    { key: 'email', label: 'Email contact', type: 'text' },
    { key: 'telephone', label: 'Telephone', type: 'text' },
  ],
  contact: [
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'telephone', label: 'Telephone', type: 'text' },
    { key: 'adresse', label: 'Adresse postale', type: 'textarea' },
    { key: 'facebook', label: 'Lien Facebook', type: 'text' },
  ],
  archives: [
    { key: 'info', label: 'Info', type: 'readonly', value: 'Pour ajouter une nouvelle annee aux archives, contactez l\'administrateur technique.' },
  ],
};

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
  const schema = SCHEMAS[section];
  if (!schema) {
    document.getElementById('adminContent').innerHTML = '<p>Section inconnue</p>';
    return;
  }

  const container = document.getElementById('adminContent');
  container.innerHTML = '';

  schema.forEach(field => {
    const group = document.createElement('div');
    group.className = 'form-group';

    if (field.type === 'readonly') {
      group.innerHTML = `<div class="form-info">${field.value}</div>`;
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
    } else if (field.type === 'textarea') {
      const ta = document.createElement('textarea');
      ta.className = 'form-textarea';
      ta.name = field.key;
      ta.rows = 4;
      ta.value = data[field.key] || '';
      ta.placeholder = field.placeholder || '';
      group.appendChild(ta);
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

  const schema = SCHEMAS[currentSection];
  if (!schema) return;

  const formData = {};
  schema.forEach(field => {
    if (field.type === 'readonly') return;

    if (field.type === 'text' || field.type === 'textarea') {
      const el = document.querySelector(`[name="${field.key}"]`);
      if (el) formData[field.key] = el.value;
    } else if (field.type === 'list') {
      const editor = document.querySelector(`.list-editor[data-key="${field.key}"]`);
      if (editor) {
        const rows = editor.querySelectorAll('.list-row');
        formData[field.key] = Array.from(rows).map(row => {
          const obj = {};
          field.fields.forEach(f => {
            const input = row.querySelector(`[name="${f}"]`);
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
