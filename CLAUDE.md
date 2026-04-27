# CLAUDE.md — Fête Villageoise d'Annecy-le-Vieux

## Projet

Site web officiel de la **Fête Villageoise d'Annecy-le-Vieux** organisée par le CŒSPC (Comité des Œuvres Sociales Paroissiales et Communales). 1950-2026, 74 éditions, 76 ans d'histoire. Siège social : Mairie déléguée d'Annecy-le-Vieux, Chef-lieu, 74940 Annecy-le-Vieux.

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
│   ├── partenaires.html       # 48 partenaires + portraits
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
│   │   ├── partenaires/*.yml  # 48 partenaires
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
- 🎈 **Ballons pastel** qui montent dans hero, chacun portant une **lettre blanche** du cycle `C Œ S P C` (mesure dynamique hauteur via JS)
- ⛪ **Silhouette montagne** SVG dans hero/footer
- 📜 **Archive press** style papier vieilli (rotation -0.3°, sépia léger)
- 🎨 **Section affiche 2026** sur la home (placeholder rayures papier vieilli quand l'image officielle n'est pas encore livrée par l'artiste)

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
- `initBalloonsHero()` — ballons pastel par hero avec lettres blanches `C Œ S P C` (cycle de 5), hauteur mesurée dynamiquement
- `initCountdown()` — J-N jours avant 13 sept 2026
- `initMeteo()` — Open-Meteo API (gratuit, sans clé) — fallback à 14 jours
- `initBalloonsOnDayJ()` — pluie de ballons UNIQUEMENT le 13/09/2026
- `initGallery()` — lit `galerie/YYYY/galerie.json` + lightbox
- `initPartnersFeed()` — consomme `/api/partners-feed`
- `initCmsContent()` — lit `_content/pages/{slug}.yml` + `config/site.yml` (js-yaml CDN)
- `applyCmsContent(data)` — remplace les éléments `data-cms`, `data-cms-html`, `data-cms-href`, `data-cms-src`, `data-cms-list`
- *Pas de JS dédié pour l'affiche 2026* : swap basé sur `<img onload>` / `onerror` inline (placeholder CSS si fichier absent)

## CMS Decap

**Activation** : voir `docs/CMS-ACTIVATION.md` (5 étapes, ~10 min).

### 6 collections éditables

1. **Archives** (`_content/archives/YYYY.yml`) — édition par année avec tombola, retrait, partenaires, galerie, solidarité
2. **Pages** (`_content/pages/*.yml`) — 8 pages : accueil, édition-2026, histoire, partenaires, etc.
3. **Paramètres** (`_content/config/{site,reseaux}.yml`) — date prochaine édition, chiffres-clés, URLs réseaux
4. **Partenaires** (`_content/partenaires/*.yml`) — 48 partenaires (institutionnels, gastronomie, commerces, distribution, entreprises, services). Institutionnels : Mairie déléguée d'Annecy-le-Vieux (siège social), Mairie d'Annecy, Mairie de Veyrier, Paroisse Christ Ressuscité, AVOC, L'Ancilevienne.
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
- **Aucune mention Covid** sur le site (décision bureau 27/04/2026 : « c'est du passé »). Pas d'archive 2020/2021, pas de « post-COVID ».
- **Email contact** : `fetevillageoise@pcr74.fr` **affiché en clair** sur la page Contact + footer global (décision 27/04/2026, l'adresse est redirigée vers Gmail). Réseaux sociaux relégués en « suivez-nous » (pas en canal de contact principal).
- **Téléphone** : pas affiché tant que Prune n'a pas donné son accord pour exposer le sien.
- **Adresse postale officielle** affichée partout (footer + contact + mentions légales) :
  ```
  Comité des Œuvres Sociales Paroissiales et Communales
  Mairie déléguée d'Annecy-le-Vieux
  Chef-lieu
  74940 Annecy-le-Vieux
  ```
- **HelloAsso** : seul lien de billetterie/tombola (PAS de form interne)
- **`data-cms-html`** vs `data-cms` : si la valeur YAML contient des balises HTML (`<sup>`, `<em>`, `<br>`, `<strong>`), utiliser `data-cms-html` ; sinon `data-cms` (textContent). Bug typique si on oublie : `<br>` ou `<sup>` apparaissent en texte brut.
- **Architecture YAML/HTML** : le HTML contient le contenu initial (SEO + fallback). Le JS `initCmsContent` remplace seulement si le YAML existe. Si un div `data-cms-html` englobe trop d'éléments, le contenu YAML écrasera tout (cas du bug 2e coupure presse `histoire.html` corrigé en avril 2026)
- **Tirets em-dash (—) interdits dans la prose** : décision 27/04/2026 (« tic IA »). Remplacer par virgule, deux-points ou point. Em-dash autorisés uniquement comme placeholder de donnée vide (ex. `<td>—</td>`).
- **Pas de plaquette programme** : support arrêté (décision bureau 27/04/2026). Remplacer toute mention par « offre partenaires premium » (banderole, sacs, gilets perso, etc.).
- **Header / footer / acronyme C Œ S P C** : letter-spacing 0.18em pour l'acronyme (préférence bureau 27/04/2026 : « petit espace »).
- **Authenticité du contenu** (décision 27/04/2026, règle non négociable) :
  - **Aucune citation, nom propre, statistique ou anecdote sans source vérifiable et nommée** (presse + date, personne nommée + fonction + année, archives papier identifiées). Si la source manque, on écrit des faits neutres et observables, ou on supprime.
  - **Tics IA bannis dans la prose éditoriale** : « véritable », « incontournable », « emblématique », « rendez-vous incontournable », « cœur de l'événement », « mobilisation exceptionnelle », « témoigne de l'attachement », « tradition ancestrale », « au cœur de ».
  - **Audit régulier** : `grep -rn "véritable\|incontournable\|emblématique"` sur `src/_content/` et `src/*.html` pour détecter les ré-introductions.
  - Détail des suppressions effectuées le 27/04/2026 : voir commit `4f7f12d`.

## État d'avancement (avril 2026)

### ✅ Fait

#### Fondations (jusqu'à avril 2026)
- [x] Site complet 26 pages HTML + CSS + JS
- [x] Design system Kermesse Éternelle officiel (fourni par Anthropic)
- [x] Fonts locales WOFF2 (Fraunces, DM Sans, Instrument Serif)
- [x] 13 archives années avec contenu enrichi (tombola, partenaires, retrait, solidarité)
- [x] 81 photos d'événements importées depuis fetevillageoise.com (galerie auto)
- [x] 47 partenaires (6 catégories) avec descriptions courtes + URLs vérifiées
- [x] 5 portraits partenaires en marquee (Le Binôme, AVOC, Bora Bora, Maison Vidal, Bistrot Green)
- [x] Coupures presse 1953 dans Histoire (bulletin paroissial + article)
- [x] CMS Decap installé + OAuth GitHub fonctionnel
- [x] 6 collections CMS définies + 90 fichiers YAML migrés (48 partenaires, 13 archives, 12 FAQ, 8 pages, 7 programme, 2 config)
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

#### Feedback bureau du 27 avril 2026 (5 lots — `claude/resume-coespc-project-rpzS1`)

**Lot 1 — Bugs & corrections factuelles** *(commit `d3412e8`, 40 fichiers)*
- [x] Bug encoding `encoreétéeacute;t…` corrigé sur `/archives/`
- [x] Bug `<br>` brut accueil corrigé (`data-cms` → `data-cms-html` sur `editionLieu` + `editionTexte`)
- [x] AVOC : « Anciens d'Annecy-le-Vieux » → « Annecy-le-Vieux Of Course » (5 fichiers)
- [x] L'Ancilevienne : « Course piédestre fédératrice » → « Un relais solidaire »
- [x] BlackSheep Van : catégorie `gastronomie` → `entreprises`
- [x] Agglomération → région (histoire, edition-2026)
- [x] Tir 22LR / tir à la carabine → « concours de tir pour grands et petits » (8 fichiers)
- [x] Messe 15h : ajout du célébrant Mgr Yves Le Saux
- [x] Tirage tombola « 2 000 personnes » → « 100 personnes » + reformulation « chaque partenaire est remercié au micro »
- [x] Citation IA partenaire « depuis 15 ans » : supprimée (en attendant un vrai témoignage)
- [x] Plaquette programme : section supprimée + remplacée par « Devenir partenaire premium » (banderole, sacs, gilets perso)
- [x] Mention Covid retirée des archives (2019 résumé, 2020-2021 card supprimée, 2022 « post-COVID » → « rentrée familiale », chronologie histoire)
- [x] Lien paroisse → page Christ Ressuscité sur `diocese-annecy.fr` + ajout lien CCAS Annecy
- [x] ~90 em-dashes (—) et en-dashes (–) prose → virgule / deux-points / point / `·`
- [x] ~25 accents rétablis (grâce, à, salariés, solidarité, intégralement, gérée, démontage, matériel, fidèle, préparer, véritable, changé, âgées, précarité, reversée, fraîches, activités, etc.)

**Lot 2 — Email + adresse postale** *(commit `f074d38`, 30 fichiers)*
- [x] Page contact restructurée : email en hero, réseaux sociaux relégués en « Suivez-nous »
- [x] Email `fetevillageoise@pcr74.fr` affiché en clair (cliquable `mailto:`) sur 24 pages
- [x] Adresse postale complète (Mairie déléguée + Chef-lieu + 74940 Annecy-le-Vieux) sur 24 pages footer + page contact
- [x] FAQ + bénévoles : email primaire pour s'inscrire, Insta/FB en secondaire
- [x] Mentions légales : RGPD via email, contact = email
- [x] Schema.org Organization : ajout `email` + `contactPoint` + `streetAddress`
- [x] Liens utiles contact : ajout CCAS Annecy + paroisse Christ Ressuscité (page fete-villageoise du diocèse)
- [x] Nouvelles classes CSS : `.contact-email`, `.postal-address`, `.footer-address`, `.footer-email`
- ⏳ Téléphone Prune : non affiché (en attente d'accord)

**Lot 3 — Identité visuelle (header + footer + acronyme)** *(commit `f94565d`, 25 fichiers)*
- [x] Header (24 pages) : logo 48×48 → 64×64
- [x] Header desktop : ajout texte complet 2 lignes « Comité des Œuvres Sociales / Paroissiales et Communales » à droite du logo
- [x] Header tablette/mobile : acronyme `CŒSPC` avec letter-spacing
- [x] Footer logo 60×60 → 96×96
- [x] Footer h3 « CŒSPC » : font-weight 700 → 800, font-size xl → 2xl, letter-spacing 0.18em
- [x] Acronyme `C Œ S P C` letter-spacing 0.18em (préférence bureau « petit espace »)
- [x] Hauteur header augmentée → guirlande haute moins devant le logo
- [x] Breakpoints : `>1024px` texte complet, `768-1024px` acronyme lg, `<768px` logo réduit + acronyme base
- [x] aria-label sur lien logo pour l'accessibilité

**Lot 4 — Galerie + UX mobile** *(commit `1b3c475`, 2 fichiers)*
- [x] Galerie « 76 ans de fête au village » (accueil) : remplacement affiche 2023 par 2014 « Viva Brasil » (6 affiches diversifiées)
- [x] « Visages de la fête » sur mobile : marquee animée → scroll horizontal swipable (overflow-x + scroll-snap), animation conservée sur desktop
- [x] Correction accent : « decennies » → « décennies »

**Lot 5 — Identité ballons + affiche 2026** *(commit `212611a`, 3 fichiers)*
- [x] Lettres blanches `C Œ S P C` sur les ballons hero (cycle de 5 lettres, Fraunces 800, opacity 0.85, text-shadow subtil)
- [x] Section « Affiche 2026 » entre countdown et météo de la home
- [x] Placeholder élégant tant que `/assets/images/affiche-2026.jpg` n'existe pas (rayures papier vieilli + emoji palette + texte WIP)
- [x] Onload swap : dès que le fichier est ajouté, l'affiche apparait sans flash (visibility:hidden initial)

**Audit authenticité + Mairie déléguée** *(commit `4f7f12d`, 15 fichiers)*
- [x] Ajout de **Mairie déléguée d'Annecy-le-Vieux** comme partenaire institutionnel (siège social du CŒSPC) — 48 partenaires au total
- [x] Retrait de la phrase « chacun veut jouer les Bobet, selon la presse de l'époque » (référence non sourcée et invérifiable)
- [x] Retrait de « M. Rollier, alors préfet de Haute-Savoie, confirme le rayonnement de la fête » (titre non vérifié + commentaire éditorial fabriqué). La mention de Rollier reste dans la légende de la photo (visible au second plan).
- [x] Retrait des tics IA : « véritable événement communal », « rendez-vous incontournable » (Ancilevienne), « véritable cœur de l'événement » (2023), « deux concours emblématiques » (2024), « attraction incontournable » (1950s)
- [x] Reformulation factuelle de l'archive 2025 (retrait « record historique avec pas moins de », « mobilisation exceptionnelle qui témoigne de l'attachement », « événement incontournable »)
- [x] Citation Balmain 2017 raccourcie (retrait « tradition de 50 ans » qui ne correspondait pas arithmétiquement à 1950→2017)
- [x] Retrait de la citation invérifiable « l'importance de cette fête au cœur du village » + jargon « mission de responsabilité sociale » dans archive 2011

**Règle d'authenticité** : aucune citation/nom/statistique sans source vérifiable et nommée. Voir section « Points d'attention » plus haut pour la liste des tics IA bannis.

### 🚧 À faire — voir `TODO.md` pour le détail actionnable

Roadmap par horizon (résumé — détail dans `TODO.md`) :

| Horizon | Items | Priorité |
|---|---|---|
| **Court terme (mai 2026)** | Activation OAuth bénévoles · Téléphone Prune (accord) · Affiche 2026 (artiste) · Search Console · Photos foule/remise chèque (album partagé) | 🔴 Action sur OAuth |
| **Moyen terme (été 2026)** | Comm réseaux sociaux pré-fête · Décision migration `fetevillageoise.com` | 🟢 Non bloquant |
| **Refactoring vague 2 (post-13 sept 2026)** | WebP images · Modules JS dynamiques · PurgeCSS · Tests Playwright · Lighthouse CI · Sitemap dynamique · PWA | ⏳ Attendre fin événement |

Dette technique surveillée (3 points) : voir `TODO.md` § « Dette technique surveillée ».

## Documentation associée

- **`TODO.md`** — Roadmap actionnable (3 horizons, owner, effort, statut) — **point d'entrée pour reprendre le projet**
- `HANDOFF.md` — Spécification technique complète (architecture, choix de stack, sécurité, cache)
- `BACKLOG-CREATIF.md` — Idées créatives long terme + historique design + dette technique
- `docs/CMS-ACTIVATION.md` — Procédure activation OAuth GitHub (5 étapes)
- `src/assets/images/galerie/README.md` — Comment ajouter des photos
- `src/assets/images/archives/README.md` — Comment ajouter des coupures presse
- `src/assets/images/partenaires-portraits/README.md` — Comment ajouter des portraits

> **Reprendre le projet plus tard ?** Lis `CLAUDE.md` (3 min) puis `TODO.md` (2 min). Tout est là.

---

*Dernière mise à jour : 27 avril 2026 (5 lots feedback bureau + audit authenticité + Mairie déléguée)*
