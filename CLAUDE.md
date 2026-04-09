# CLAUDE.md — Fête Villageoise d'Annecy-le-Vieux

## Projet
Refonte du site web fetevillageoise.com pour le CŒSPC (Comité des Œuvres Sociales Paroissiales et Communales).
Migration WordPress → site statique sur **GitHub + Cloudflare Pages**.

## Stack technique
- **Hébergement** : Cloudflare Pages (deploy depuis GitHub)
- **Repo** : GitHub (à créer, propriétaire : Colomban)
- **Générateur** : Site statique (HTML/CSS/JS) — pas de framework lourd
- **Domaine** : fetevillageoise.com (migration DNS vers Cloudflare)
- **Ancien site** : WordPress 6.0.11 sur OVH

## Structure du repo
```
fete-villageoise-site/
├── CLAUDE.md                  # Ce fichier — contexte projet
├── HANDOFF.md                 # Spécification technique complète
├── BACKLOG-CREATIF.md         # Idées créatives historisées
├── docs/                      # Documentation interne
│   ├── site-web-reference.md  # Fichier de référence complet
│   └── archive-site-actuel.md # Archive exhaustive du site WordPress
├── src/
│   ├── index.html             # Page d'accueil
│   ├── histoire.html          # Notre histoire (1950→aujourd'hui)
│   ├── association.html       # Le CŒSPC, bénéficiaires, bénévoles
│   ├── edition-2026.html      # Édition 2026 (→ coespc.org pour tombola/repas)
│   ├── partenaires.html       # Tous les partenaires
│   ├── benevoles.html         # Devenir bénévole
│   ├── archives/              # Archive complète par année (photos intégrées)
│   │   ├── index.html         # Index chronologique
│   │   ├── 2025.html
│   │   ├── 2024.html
│   │   ├── ...
│   │   └── 2011.html
│   ├── presse.html            # Espace presse
│   ├── contact.html           # Contact + mentions légales
│   ├── css/
│   │   └── style.css          # Design system
│   ├── js/
│   │   └── main.js            # Interactions
│   └── assets/
│       ├── images/            # Images du site
│       ├── archives/          # Médias archivés (affiches, photos)
│       └── documents/         # PDFs (résultats tombola, PV AG)
├── _redirects                 # Redirections Cloudflare (anciennes URLs)
└── .github/
    └── workflows/
        └── deploy.yml         # CI/CD Cloudflare Pages
```

## Fichiers de référence (LIRE EN PRIORITÉ)
1. `G:\Mon Drive\COESPC\site-web-reference.md` — Tout le contenu structuré
2. `G:\Mon Drive\COESPC\archive-fetevillageoise-complete.md` — Archive du site actuel
3. `HANDOFF.md` — Spécification technique et fonctionnelle

## Conventions
- **Langue** : Français (contenu), anglais (code/commits)
- **Commits** : conventionnels (`feat:`, `fix:`, `content:`, `archive:`)
- **Branches** : `main` (production), `dev` (développement)
- **Nommage images** : `{année}-{description}.{ext}` (ex: `2025-affiche.jpg`)
- **Redirections** : toutes les anciennes URLs WordPress doivent être redirigées

## Points d'attention
- Le site doit rester **accessible aux personnes âgées** (contraste, taille de police)
- Section **Archives** = priorité (traçabilité, mémoire collective)
- Les **partenaires** doivent être mis en avant (ils financent la fête)
- Intégrer les **publications réseaux sociaux** (Facebook, potentiellement Instagram)
- La fête existe depuis **1950** (76 ans), 74 éditions réalisées (2 annulées)
- **coespc.org** = portail HelloAsso (tombola, repas, adhésions) — renvois depuis le site vitrine
- Galerie photos **intégrée dans les archives** (pas de page séparée)
- Design system à appliquer : décision créative en attente (voir BACKLOG-CREATIF.md)

## État d'avancement
- [x] Collecte des données (fichier de référence)
- [x] Scan du site actuel (archive complète)
- [x] Récupération archives presse 1950s
- [x] Spécification + CLAUDE.md + Handoff
- [x] Architecture du site définie (voir HANDOFF.md §3)
- [x] Backlog créatif historisé (BACKLOG-CREATIF.md)
- [x] Contenu éditorial rédigé (23 fichiers dans /contenu/)
- [x] Pages d'archives individuelles 2011-2024 (12 fichiers rédigés)
- [ ] Direction créative tranchée
- [ ] Maquette HTML/CSS
- [ ] Repo GitHub initialisé
- [ ] Migration DNS Cloudflare
- [ ] Redirections anciennes URLs
- [ ] Mise en production
