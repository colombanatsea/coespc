# CLAUDE.md — Fête Villageoise d'Annecy-le-Vieux

## Projet

Site web officiel de la **Fête Villageoise d'Annecy-le-Vieux** organisée par le CŒSPC (Comité des Œuvres Sociales Paroissiales et Communales) — 1950-2026, 74 éditions.

**Production** : https://coespc.org
**Repo** : https://github.com/colombanatsea/coespc
**Hébergement** : Cloudflare Pages (déploiement auto sur push `main`)

## Stack technique

| Couche | Technologie | Pourquoi |
|---|---|---|
| **Front** | HTML/CSS/JS vanilla (zero framework) | Léger, lisible par bénévoles, zéro build step |
| **Hébergement** | Cloudflare Pages | Gratuit, edge global, déploiement Git natif |
| **CMS** | [Decap CMS](https://decapcms.org) (ex-Netlify CMS) | Standard Jamstack, équivalent WordPress sur statique |
| **Auth CMS** | OAuth GitHub via Cloudflare Pages Functions | Pas de backend à maintenir |
| **Stockage contenu** | Fichiers YAML versionnés dans Git | Historique complet, rollback en 1 clic |
| **Polices** | Fraunces + DM Sans + Instrument Serif (auto-hébergées WOFF2) | Zero appel réseau, rendu identique |
| **Workers serverless** | Cloudflare Pages Functions | RSS partenaires (AVOC, Ancilevienne) |

## Structure du repo

```
coespc/
├── CLAUDE.md                  # Ce fichier (état actuel + conventions)
├── HANDOFF.md                 # Spec technique détaillée
├── BACKLOG-CREATIF.md         # Idées + roadmap
├── docs/
│   └── CMS-ACTIVATION.md      # 5 étapes activation Decap CMS
├── src/
│   ├── index.html             # Accueil
│   ├── histoire.html          # 76 ans d'histoire (avec coupures presse 1953)
│   ├── association.html       # Le CŒSPC, ses missions
│   ├── edition-2026.html      # Programme jour J
│   ├── partenaires.html       # 47 partenaires + portraits + plaquette
│   ├── benevoles.html         # Devenir bénévole
│   ├── contact.html           # Contact
│   ├── presse.html            # Espace presse + kit média
│   ├── foire-aux-questions.html
│   ├── mentions-legales.html  # noindex, dédié
│   ├── archives/              # 13 années d'archives (2011-2025)
│   │   ├── index.html         # Index chronologique
│   │   └── YYYY.html          # 1 page par année avec tombola, partenaires, galerie
│   ├── admin/                 # Decap CMS
│   │   ├── index.html         # Loader + thème CŒSPC
│   │   └── config.yml         # 6 collections : Archives, Pages, Partenaires...
│   ├── _content/              # Contenu YAML édité par le CMS
│   │   ├── pages/*.yml        # 8 pages éditables
│   │   ├── archives/*.yml     # 13 années (tombola, retrait, partenaires...)
│   │   ├── partenaires/*.yml  # 47 partenaires
│   │   ├── programme/*.yml    # 7 moments du jour J
│   │   ├── faq/*.yml          # 12 questions
│   │   └── config/*.yml       # site.yml + reseaux.yml
│   ├── css/style.css          # Design system Kermesse Éternelle
│   ├── js/main.js             # initFanions, countdown, météo, gallery, CMS reader, etc.
│   ├── _headers               # Sécurité + stratégie cache (HTML 5min, fonts 1an)
│   ├── _redirects             # Redirections WordPress legacy
│   ├── robots.txt + sitemap.xml
│   └── assets/
│       ├── fonts/             # 10 WOFF2 self-hosted (Fraunces, DM Sans, Instrument Serif)
│       └── images/
│           ├── affiche-YYYY.jpg          # Affiches 2011-2025
│           ├── archives/                 # Coupures presse 1953
│           ├── galerie/YYYY/             # 81 photos d'événements (auto-galerie via JSON)
│           ├── partenaires-portraits/    # Portraits carrés des partenaires
│           └── uploads/                  # Médias CMS Decap
└── functions/
    ├── api/
    │   └── partners-feed.js   # Worker RSS (AVOC + Ancilevienne)
    └── oauth/
        ├── index.js           # Redirige vers GitHub OAuth
        └── callback.js        # Échange code → token, postMessage à Decap
```

## Design system « Kermesse Éternelle »

Tokens définis en `:root` dans `src/css/style.css` :

### Couleurs

```css
--bleu-logo:       #142477;  /* Bleu Clocher — primaire, fond dark */
--or-logo:         #F4B365;  /* Or chaud — TOUS les textes sur fond bleu */
--ambre-fete:      #D4760A;  /* CTA, liens, accents chauds */
--or-girouette:    #D4AF37;  /* Détails, cocardes (jamais texte sur bleu) */
--rouge-guirlande: #C0392B;  /* Fanions, drapeau Savoie */
--vert-tilleul:    #4A8C4F;  /* Touche secondaire */
--jaune-ballon:    #E8B960;
--bleu-lac:        #5BA3C9;
--corail-fleur:    #E07A5F;
--creme-lin:       #FDF6E8;  /* Fond principal — papier crème */
--papier-vieilli:  #F0E6D0;  /* Borders, archive press */
--bois-chaud:      #5C4A3A;  /* Texte secondaire */
--encre:           #2C1F14;  /* Texte principal */
```

### Typographie

- **Display** : Fraunces (400-900 + italic) — titres, hero
- **Body** : DM Sans (400-700) — corps, UI
- **Accent italic** : Instrument Serif (400 + italic) — citations, exergues

Échelle Major Third (1.25) : `--text-xs` 12px → `--text-5xl` 49px.
Toutes les fonts en local `src/assets/fonts/*.woff2` (zéro Google Fonts).

### Règles strictes

1. **Or Logo** (`#F4B365`) sur Bleu Logo, **jamais** Or Girouette pour le texte
2. **Fraunces** = titres uniquement, **DM Sans** = tout le reste
3. **Italique signature** : `<h1>La <em>Fête Villageoise</em>...</h1>`
4. **Fond** = Bleu Logo, Crème Lin ou blanc (jamais aplats secondaires)
5. **Max 3 éléments de marque par page** (fanions + 2 décos)
6. **Motion** : gentle, rooted (`cubic-bezier(.2,.8,.2,1)`, 150-400ms)
7. **Shadows** : bleu-tinted (`rgba(5,22,130,.04 → .12)`), jamais gris froid
8. **8px grid** : tous les espacements multiples de 8

### Éléments signature

- 🎀 **Fanions** sticky transparents en haut (overlay header bleu)
- 🐓 **Coq emoji** sur favicon + animation roosterBob/cocoricoFade après Instagram
- 🥂 **Verres qui trinquent** séparateur entre blocs (clink + sparkles)
- 🎈 **Ballons pastel** qui montent dans hero (mesure dynamique hauteur via JS)
- ⛪ **Silhouette montagne** SVG dans hero/footer
- 📜 **Archive press** style papier vieilli (rotation -0.3°, sépia léger)

## Conventions

### Langue
- **Français** pour le contenu visible (entités HTML : `&eacute;`, `&agrave;`, etc.)
- **Anglais** pour le code, les commentaires, les noms de variables
- **Commits** : conventionnels (`feat:`, `fix:`, `content:`, `archive:`, `docs:`)

### Branches
- `main` = production (auto-deploy CF Pages)
- Pas de branche dev (commits directs sur main, le site est petit et stable)

### Nommage fichiers
- Images affiches : `affiche-YYYY.{jpg,png}`
- Galerie année : `galerie/YYYY/NN-slug.jpg` (NN = 01, 02...)
- Partenaires : slug kebab-case sans accent (`maison-benoit-vidal.yml`)
- Archives YAML : `archives/YYYY.yml`

### Stratégie cache (`src/_headers`)

| Type | Browser | CDN | Pourquoi |
|---|---|---|---|
| HTML | 5 min | 1 min | Modifs visibles vite |
| YAML CMS | 1 min | 30 s | Modifs CMS quasi-instantanées |
| CSS/JS | 1 h | 5 min | Équilibre perf/fraîcheur |
| Fonts | 1 an immutable | — | URLs stables |
| Images affiches/archives | 1 jour + SWR | — | Peuvent être remplacées |
| Admin/OAuth | no-store | — | Sessions fraîches |

## Fonctions JS principales (main.js)

- `initFanions()` — génère les triangles colorés
- `initStickyHeader()` — header sticky + classe scrolled
- `initBalloonsHero()` — ballons pastel par hero, hauteur mesurée dynamiquement
- `initCountdown()` — J-N jours avant 13 sept 2026
- `initMeteo()` — Open-Meteo API (gratuit, sans clé) — fallback à 14 jours
- `initBalloonsOnDayJ()` — pluie de ballons UNIQUEMENT le 13/09/2026
- `initGallery()` — lit `galerie/YYYY/galerie.json` + lightbox
- `initPartnersFeed()` — consomme `/api/partners-feed`
- `initCmsContent()` — lit `_content/pages/{slug}.yml` + `config/site.yml` (js-yaml CDN)
- `applyCmsContent(data)` — remplace les éléments `data-cms`, `data-cms-html`, `data-cms-href`, `data-cms-src`, `data-cms-list`

## CMS Decap

**Activation** : voir `docs/CMS-ACTIVATION.md` (5 étapes, ~10 min).

### 6 collections éditables

1. **Archives** (`_content/archives/YYYY.yml`) — édition par année avec tombola, retrait, partenaires, galerie, solidarité
2. **Pages** (`_content/pages/*.yml`) — 8 pages : accueil, édition-2026, histoire, partenaires, etc.
3. **Paramètres** (`_content/config/{site,reseaux}.yml`) — date prochaine édition, chiffres-clés, URLs réseaux
4. **Partenaires** (`_content/partenaires/*.yml`) — 47 partenaires (institutionnels, gastronomie, commerces, distribution, entreprises, services)
5. **Programme** (`_content/programme/*.yml`) — 7 moments du jour J
6. **FAQ** (`_content/faq/*.yml`) — 12 questions

Workflow éditorial : draft → review → publish via Pull Request GitHub.

### URLs admin

- Interface : `/admin/`
- Config : `/admin/config.yml`
- OAuth proxy : `/oauth` + `/oauth/callback`

## Points d'attention

- **CŒSPC** s'écrit toujours `C&OElig;SPC` en HTML (entité, pas Unicode `Œ`)
- **Date 2026** : 13 septembre 2026 (dimanche). 74e édition. 76 ans depuis 1950.
- **2 annulations** COVID (2020 + 2021) → 76 ans, 74 éditions
- **Email contact** : masqué partout (anti-spam) → Instagram + Facebook prioritaires
- **HelloAsso** : seul lien de billetterie/tombola (PAS de form interne)
- **`data-cms-html`** vs `data-cms` : si la valeur YAML contient des balises HTML (`<sup>`, `<em>`, `<br>`, `<strong>`), utiliser `data-cms-html` ; sinon `data-cms` (textContent)
- **Architecture YAML/HTML** : le HTML contient le contenu initial (SEO + fallback). Le JS `initCmsContent` remplace seulement si le YAML existe. Si un div `data-cms-html` englobe trop d'éléments, le contenu YAML écrasera tout (cas du bug 2e coupure presse `histoire.html` corrigé en avril 2026)

## État d'avancement (avril 2026)

### ✅ Fait

- [x] Site complet 26 pages HTML + CSS + JS
- [x] Design system Kermesse Éternelle officiel (fourni par Anthropic)
- [x] Fonts locales WOFF2 (Fraunces, DM Sans, Instrument Serif)
- [x] 13 archives années avec contenu enrichi (tombola, partenaires, retrait, solidarité)
- [x] 81 photos d'événements importées depuis fetevillageoise.com (galerie auto)
- [x] 47 partenaires (6 catégories) avec descriptions courtes + URLs vérifiées
- [x] 5 portraits partenaires en marquee (Le Binôme, AVOC, Bora Bora, Maison Vidal, Bistrot Green)
- [x] Coupures presse 1953 dans Histoire (bulletin paroissial + article)
- [x] CMS Decap installé + OAuth GitHub fonctionnel
- [x] 6 collections CMS définies + 89 fichiers YAML migrés (47 partenaires, 13 archives, 12 FAQ, 8 pages, 7 programme, 2 config)
- [x] PPTX partenaires 2026 corrigé (date, 76 ans, 74 éditions)
- [x] Sitemap.xml + robots.txt + JSON-LD (Organization + Event + FAQPage)
- [x] _redirects WordPress legacy
- [x] _headers cache intelligent (HTML 5 min, fonts 1 an)
- [x] Domaine coespc.org actif
- [x] SSL Cloudflare Full strict
- [x] Galerie auto par année (manifest JSON)
- [x] Worker RSS partenaires (AVOC + Ancilevienne)
- [x] FAQ 12 questions/réponses (Markdown via CMS)
- [x] Programme jour J 7 moments
- [x] Footer credits Colomban + VAIATA Cyber
- [x] Lien Admin discret dans footer
- [x] ~500 corrections d'accents français (3 passes)
- [x] Bug data-cms-html (HTML brut affiché) corrigé
- [x] **Refactoring qualité (avril 2026)** : -278 lignes de dead code (CSS décorations orphelines, JS `_initPageDecorationsDisabled`), guard `data-cms` early-return dans `initCmsContent` (-45 KB sur pages statiques), `X-XSS-Protection` obsolète retiré, lien footer cassé `/devenir-partenaire.html` (404) corrigé
- [x] **Fix RSS entities partenaires** : décodeur d'entités HTML (`&#8211;`, `&#8217;`, etc.) dans `partners-feed.js` + invalidation cache Edge via `CACHE_VERSION`
- [x] Merge branche externe `claude/fix-preview-content-quality` (Unicode brut OG/Twitter, 74e plat, 40+ accents, unification domaine coespc.org, Schema.org cleanup, llms.txt)

### 🚧 À faire / surveillance

**Court terme (mai 2026)**
- [ ] **Activation OAuth bénévoles** : créer comptes GitHub partagés ou inviter individuellement (voir `docs/CMS-ACTIVATION.md`)
- [ ] **Validation contenu** par bureau CŒSPC sur coespc.org
- [ ] **Affiche 2026** : décliner dès réception de l'artiste, remplacer `affiche-2025.webp` partout en image OG

**Référencement / monitoring**
- [ ] **Search Console** : soumission sitemap + indexation
- [ ] **Search Console** : monitoring erreurs 404 (anciennes URLs WP)
- [ ] **Plan migration WP fetevillageoise.com** : redirect 301 permanent vers coespc.org dès que le WP est arrêté

**Refactoring / qualité (post-événement 13 sept 2026)**
- [ ] **Audit images** : convertir `affiche-YYYY.png` (953 KB) en WebP, référencer `.webp` partout au lieu de `.png` ; `<picture>` avec fallback JPG pour vieux Safari
- [ ] **Audit JS** : extraire les fonctions optionnelles (météo, gallery lightbox) en modules dynamiques (`import()` à la demande)
- [ ] **Audit CSS** : passe PurgeCSS pour traquer les utility classes orphelines (probable : <5 % du fichier)
- [ ] **Tests** : ajouter Playwright smoke tests (homepage charge, CMS reader applique YAML, partners-feed parse OK)
- [ ] **Lighthouse** : valider tous critères ≥ 95 (perf/a11y/SEO/best-practices)
- [ ] **PWA** : manifest + service worker pour install mobile (faible priorité)

## Documentation associée

- `HANDOFF.md` — Spécification technique complète (architecture, choix de stack, contenu)
- `BACKLOG-CREATIF.md` — Roadmap créative + idées non-prioritaires
- `docs/CMS-ACTIVATION.md` — Procédure activation OAuth + invitation bénévoles
- `src/assets/images/galerie/README.md` — Comment ajouter des photos
- `src/assets/images/archives/README.md` — Comment ajouter des coupures presse
- `src/assets/images/partenaires-portraits/README.md` — Comment ajouter des portraits

---

*Dernière mise à jour : 26 avril 2026*
