# CLAUDE.md — Fête Villageoise d'Annecy-le-Vieux

## Projet
Refonte du site web fetevillageoise.com pour le CŒSPC (Comité des Œuvres Sociales Paroissiales et Communales).
Migration WordPress → site statique sur **GitHub + Cloudflare Pages**.

## Stack technique
- **Hébergement** : Cloudflare Pages (deploy depuis GitHub)
- **Repo** : GitHub (à créer, propriétaire : Colomban)
- **Générateur** : Site statique (HTML/CSS/JS) — pas de framework lourd
- **Domaine cible** : coespc.org (migration DNS vers Cloudflare Pages)
- **Preview** : coespc.pages.dev
- **Ancien site** : WordPress 6.0.11 sur OVH (fetevillageoise.com, à désactiver après bascule)

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
- Design system **Kermesse Éternelle** appliqué : Bleu Clocher `#142477`, Or Girouette `#D4AF37`, Ambre Fête `#D4760A`, Rouge Guirlande `#C0392B`, Crème Lin `#FDF6E8`
- Fraunces (display, 700-900) + DM Sans (body, 400/500/700)
- Images optimisées : affiche-2025 (5.9 MB → 931 KB + WebP 371 KB), logo (448 KB → 22 KB), solidarité (5 MB → 108 KB)
- Accents français corrigés en 2 passes (~500 corrections sur 26 pages)
- Mobile first : min-height 48px pour la nav, zoom iOS prévenu (font-size 16px sur inputs), animations réduites
- Domaine cible : **coespc.org** (pas fetevillageoise.com)
- Meta previews (OG/Twitter) : Unicode brut, pas d'entités HTML ni de superscripts Unicode (ᵉ, ᴱ) — ils cassent les cartes de partage
- SEO/LLM : `src/llms.txt` à la racine (https://coespc.org/llms.txt), `sitemap.xml` et `robots.txt` alignés sur coespc.org

## État d'avancement
- [x] Collecte des données (fichier de référence)
- [x] Scan du site actuel (archive complète)
- [x] Récupération archives presse 1950s
- [x] Spécification + CLAUDE.md + Handoff
- [x] Architecture du site définie (voir HANDOFF.md §3)
- [x] Backlog créatif historisé (BACKLOG-CREATIF.md)
- [x] Direction créative : Kermesse Éternelle (design-systems-v2.html)
- [x] Site complet : 26 pages HTML, CSS design system, JS, CMS admin
- [x] 15 images récupérées du site WordPress originel
- [x] CMS admin : 10 sections éditables, types image/link/list, archives par année
- [x] SEO : canonical, OG, Twitter Card, favicon, JSON-LD (Organization + Event + FAQPage)
- [x] 2 nouvelles pages SEO : foire-aux-questions.html, devenir-partenaire.html
- [x] _redirects : 40+ règles migration WordPress
- [x] _headers : sécurité + cache
- [x] Sitemap : 24 URLs avec changefreq/priority
- [x] Déployé sur Cloudflare Pages (coespc.pages.dev)
- [x] Repo GitHub : github.com/colombanatsea/coespc
- [x] Passe qualité complète : accents, footer, JSON-LD enrichi, CLS prévu
- [x] Images optimisées (13 MB économisés), WebP généré pour affiche 2025
- [x] Nouveau design system appliqué (Bleu Clocher #142477, Or Girouette #D4AF37)
- [x] Optimisations mobiles : touch targets, zoom iOS prévenu, animations allégées
- [ ] Validation contenu par le bureau du CŒSPC sur coespc.pages.dev
- [ ] Migration DNS coespc.org → Cloudflare Pages (custom domain)
- [ ] Configuration KV + R2 pour le CMS admin
- [x] Bindings Cloudflare configurés (KV CONTENT + secrets ADMIN_PASSWORD, JWT_SECRET)
- [ ] Binding R2 ASSETS (a refaire avec bonne jurisdiction)
- [x] Design system : --or-logo restaure a #F4B365 (corail chaud) pour textes sur fond bleu
- [x] Liens billetterie migres vers HelloAsso direct (58 occurrences)
- [x] Passe qualité preview 2026-04 : 74ᵉ Unicode → `74<sup>e</sup>`, entités HTML décodées en Unicode brut dans tous les meta OG/Twitter/title/alt, accents corrigés sur ~30 pages et YAML CMS, canonical+og:url+Schema.org unifiés sur https://coespc.org, sitemap aligné, `llms.txt` publié à la racine
- [ ] Custom domain coespc.org actif
- [ ] Search Console + demande indexation après bascule DNS
- [ ] Soumission Search Console + demande indexation
