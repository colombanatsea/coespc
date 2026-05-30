# REFERENCE.md — Note de référence exhaustive

> **Document maître** pour comprendre, maintenir et reprendre le projet **coespc.org** sans rien perdre.
>
> Si tu lis ce fichier pour la première fois ou si tu reprends après une longue absence, tout ce qu'il faut savoir est ici. Les fichiers `CLAUDE.md`, `TODO.md` et `BACKLOG-CREATIF.md` restent les sources opérationnelles ; ce REFERENCE.md les agrège et explique le « pourquoi » des décisions.
>
> *Dernière mise à jour : 7 mai 2026*

---

## 1. Vue d'ensemble

### 1.1 Le projet

**Site web officiel de la Fête Villageoise d'Annecy-le-Vieux**, organisé par le **CŒSPC** (Comité des Œuvres Sociales Paroissiales et Communales).

- **Production** : https://coespc.org
- **Repo Git** : https://github.com/colombanatsea/coespc
- **Hébergement** : Cloudflare Pages (déploiement auto sur push `main`)
- **Édition à venir** : 13 septembre 2026 (74e édition, 76 ans depuis 1950)
- **Siège social** : Mairie déléguée d'Annecy-le-Vieux, Chef-lieu, 74940 Annecy-le-Vieux

### 1.2 Mission de l'association

Association loi 1901 entièrement bénévole. Organise une fête villageoise annuelle à vocation **caritative** : les bénéfices sont **intégralement reversés** aux plus démunis :
- **2/3** à la Paroisse Christ Ressuscité (œuvres sociales paroissiales)
- **1/3** au CCAS d'Annecy (Centre Communal d'Action Sociale)

### 1.3 Objectif du site

Servir de **vitrine pérenne** pour la Fête Villageoise : informer le grand public, mobiliser les bénévoles et les partenaires, archiver l'histoire (76 ans, 74 éditions), permettre une mise à jour autonome par les bénévoles non techniques (via le CMS Decap).

---

## 2. Stack technique

| Couche | Technologie | Pourquoi ce choix |
|---|---|---|
| **Front** | HTML/CSS/JS vanilla (zéro framework) | Léger, lisible par bénévoles, zéro build step, longévité |
| **Hébergement** | Cloudflare Pages | Gratuit, edge global, déploiement Git natif, Pages Functions serverless |
| **CMS** | [Decap CMS](https://decapcms.org) (ex-Netlify CMS) | Standard Jamstack, équivalent WordPress sur statique, drop-in possible vers Sveltia plus tard |
| **Auth CMS** | OAuth GitHub via Cloudflare Pages Functions | Pas de backend à maintenir, pas de DB |
| **Stockage contenu** | Fichiers YAML versionnés dans Git | Historique complet, rollback en 1 clic, diff en clair |
| **Polices** | Fraunces + DM Sans + Instrument Serif (auto-hébergées WOFF2) | Zéro appel réseau, rendu identique partout, pas de dépendance externe |
| **Workers serverless** | Cloudflare Pages Functions | Agrégation RSS partenaires (AVOC, Ancilevienne) en edge |

**Aucun build step** : on édite le HTML/CSS/JS directement, push sur `main`, Cloudflare déploie automatiquement.

---

## 3. Architecture du repo

```
coespc/
├── REFERENCE.md               # CE FICHIER - point d'entrée exhaustif
├── CLAUDE.md                  # État actuel + conventions (snapshot opérationnel)
├── TODO.md                    # Roadmap actionnable (3 horizons)
├── HANDOFF.md                 # Spec technique détaillée
├── BACKLOG-CREATIF.md         # Idées long terme + historique design + dette
├── docs/
│   └── CMS-ACTIVATION.md      # 5 étapes activation Decap CMS (action prioritaire)
├── src/
│   ├── index.html             # Accueil
│   ├── histoire.html          # 76 ans d'histoire (avec coupures presse 1953)
│   ├── association.html       # Le CŒSPC, ses missions
│   ├── edition-2026.html      # Programme jour J
│   ├── partenaires.html       # 48 partenaires + portraits
│   ├── benevoles.html         # Devenir bénévole
│   ├── contact.html           # Contact (email, téléphone, réseaux, adresse)
│   ├── presse.html            # Espace presse + kit média
│   ├── foire-aux-questions.html
│   ├── mentions-legales.html  # noindex, dédié RGPD
│   ├── archives/              # 13 années d'archives (2011-2025)
│   │   ├── index.html         # Index chronologique
│   │   └── YYYY.html          # 1 page par année (tombola, retrait, partenaires, galerie, solidarité)
│   ├── admin/                 # Decap CMS
│   │   ├── index.html         # Loader + thème CŒSPC
│   │   └── config.yml         # 6 collections : Archives, Pages, Partenaires, Programme, FAQ, Config
│   ├── _content/              # Contenu YAML édité par le CMS (90 fichiers)
│   │   ├── pages/*.yml        # 8 pages éditables
│   │   ├── archives/*.yml     # 13 années
│   │   ├── partenaires/*.yml  # 48 partenaires
│   │   ├── programme/*.yml    # 7 moments du jour J
│   │   ├── faq/*.yml          # 12 questions
│   │   └── config/*.yml       # site.yml + reseaux.yml
│   ├── css/style.css          # Design system « Kermesse Éternelle »
│   ├── js/main.js             # initFanions, countdown, météo, gallery, CMS reader, ballons hero
│   ├── _headers               # Sécurité + stratégie cache
│   ├── _redirects             # Redirections WordPress legacy
│   ├── robots.txt + sitemap.xml + llms.txt
│   └── assets/
│       ├── fonts/             # 10 WOFF2 self-hosted
│       └── images/
│           ├── logo-coespc.png             # Logo complet (avec wordmark) — usage presse
│           ├── logo-coespc-mark.png        # Logo sans wordmark, fond bleu opaque
│           ├── logo-coespc-mark-transparent.png # Logo sans wordmark, fond TRANSPARENT (utilisé sur ballons hero)
│           ├── favicon-coq.svg             # Favicon : coq emoji 🐓 sur fond bleu
│           ├── affiche-YYYY.{jpg,png}      # Affiches 2011-2025 + slot 2026 à venir
│           ├── archives/                   # Coupures presse 1953
│           ├── galerie/YYYY/               # 81 photos (auto-galerie via JSON manifest)
│           ├── partenaires-portraits/      # Portraits carrés des partenaires
│           └── uploads/                    # Médias CMS Decap
└── functions/
    ├── api/
    │   └── partners-feed.js   # Worker RSS (AVOC + Ancilevienne)
    └── oauth/
        ├── index.js           # Redirige vers GitHub OAuth
        └── callback.js        # Échange code → token, postMessage à Decap
```

---

## 4. Design system « Kermesse Éternelle »

### 4.1 Couleurs (tokens en `:root` dans `style.css`)

```css
--bleu-logo:       #071584;  /* Bleu Clocher — primaire, fond dark (bleu exact du fond du logo) */
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

### 4.2 Typographie

- **Display** : Fraunces (400-900 + italic) — titres, hero, acronyme CŒSPC
- **Body** : DM Sans (400-700) — corps, UI, navigation
- **Accent italique** : Instrument Serif (400 + italic) — citations, exergues

Échelle Major Third (1.25) : `--text-xs` 12px → `--text-5xl` 49px.
Toutes les fonts en local `src/assets/fonts/*.woff2` (zéro Google Fonts en runtime).

### 4.3 Spacing (grille 8px)

```css
--space-1:  0.25rem;  /*  4px */
--space-2:  0.5rem;   /*  8px */
--space-3:  0.75rem;  /* 12px */
--space-4:  1rem;     /* 16px */
--space-6:  1.5rem;   /* 24px */
--space-8:  2rem;     /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-24: 6rem;     /* 96px */
```

**Utility classes** (pour les ajustements ponctuels) :
- `.mt-4` `.mt-6` `.mt-8` `.mt-12` (margin-top)
- `.mb-4` `.mb-6` `.mb-8` `.mb-12` (margin-bottom)

### 4.4 Border-radius

```css
--radius-sm:   4px;
--radius-md:   8px;
--radius-lg:   12px;
--radius-xl:   16px;
--radius-full: 100px;  /* pilules, boutons */
```

### 4.5 Règles strictes (charte non négociable)

1. **Or Logo** (`#F4B365`) sur Bleu Logo, **jamais** Or Girouette pour le texte
2. **Fraunces** = titres uniquement, **DM Sans** = tout le reste
3. **Italique signature** : `<h1>La <em>Fête Villageoise</em>...</h1>`
4. **Fond** = Bleu Logo, Crème Lin ou blanc (jamais aplats secondaires)
5. **Max 3 éléments de marque par page** (fanions + 2 décos)
6. **Motion** : gentle, rooted (`cubic-bezier(.2,.8,.2,1)`, 150-400ms)
7. **Shadows** : bleu-tinted (`rgba(5,22,130,.04 → .12)`), jamais gris froid
8. **8px grid** : tous les espacements multiples de 8 (4, 8, 12, 16, 24, 32, 48, 64, 96)

### 4.6 Éléments signature

| Élément | Description | Implémentation |
|---|---|---|
| 🎀 **Fanions** | Triangles colorés en bandeau, sticky en haut, overlay sur header bleu | `initFanions()` dans `main.js` |
| 🐓 **Coq** | Sur favicon (emoji SVG fond bleu), animation rooster bob après Insta | `favicon-coq.svg` + CSS keyframe `cocoricoFade` |
| 🥂 **Verres qui trinquent** | Séparateur entre blocs sur la home | CSS `.clink` + sparkles |
| 🎈 **Ballons pastel** | Montent dans le hero, chacun porte le **vrai logo CŒSPC** en blanc transparent (clocher + cœur sans wordmark, sans fond bleu) | `initBalloonsHero()` dans `main.js`, `logo-coespc-mark-transparent.png` + CSS `filter: brightness(0) invert(1)` |
| ⛪ **Silhouette montagne** | SVG en bas du hero/footer | Inline SVG dans HTML |
| 📜 **Archive press** | Style papier vieilli (rotation -0.3°, sépia léger) pour les coupures de presse | CSS `.archive-press` |
| 🎨 **Section affiche 2026** | Sur la home, entre countdown et météo | Placeholder rayures papier vieilli si fichier absent, swap auto via `<img onload>` quand le fichier est uploadé |

### 4.7 Identité C Œ S P C

L'acronyme CŒSPC est rendu en **CSS** (police Fraunces 800, letter-spacing 0.32em) et non plus gravé dans le PNG du logo. Cela permet de modifier l'espacement, la couleur ou la taille sans toucher au PNG.

- **Header** desktop (>1024px) : logo (sans wordmark) à gauche + texte complet « Comité des Œuvres Sociales / Paroissiales et Communales » à droite
- **Header** tablette (768-1024px) : logo + acronyme `C Œ S P C`
- **Header** mobile (<768px) : logo réduit + acronyme compact
- **Footer** : logo grand format (96×96) + h3 `CŒSPC` + adresse postale + email + téléphone Prune

---

## 5. Conventions

### 5.1 Langue

- **Français** pour le contenu visible (entités HTML : `&eacute;`, `&agrave;`, `&OElig;` pour Œ)
- **Anglais** pour le code, les commentaires JS/CSS, les noms de variables
- **`CŒSPC`** s'écrit toujours `C&OElig;SPC` en HTML (entité, pas Unicode `Œ`) pour compatibilité legacy

### 5.2 Commits Git

Conventionnels : `feat:`, `fix:`, `content:`, `archive:`, `docs:`, `refactor:`, `chore:`.
Messages en français pour le contenu, peuvent être en anglais pour le code pur.
Body avec contexte : pourquoi, pas seulement quoi.

### 5.3 Branches

- `main` = production (auto-deploy CF Pages sur push)
- Pas de branche dev (le site est petit et stable, commits directs sur main)
- Branches feature ponctuelles pour gros chantiers (ex. `claude/resume-coespc-project-rpzS1` pour les 5 lots du 27 avril)

### 5.4 Nommage fichiers

- Images affiches : `affiche-YYYY.{jpg,png,webp}`
- Galerie année : `galerie/YYYY/NN-slug.jpg` (NN = 01, 02, ...)
- Partenaires YAML : slug kebab-case sans accent (`maison-benoit-vidal.yml`)
- Archives YAML : `archives/YYYY.yml`

### 5.5 Stratégie cache (`src/_headers`)

| Type | Browser | CDN | Pourquoi |
|---|---|---|---|
| HTML | 5 min | 1 min | Modifs visibles vite |
| YAML CMS | 1 min | 30 s | Modifs CMS quasi-instantanées |
| CSS/JS | 1 h | 5 min | Équilibre perf/fraîcheur |
| Fonts | 1 an immutable | — | URLs stables |
| Images affiches/archives | 1 jour + SWR | — | Peuvent être remplacées |
| Admin/OAuth | no-store | — | Sessions fraîches |

---

## 6. JavaScript — fonctions principales (`main.js`)

| Fonction | Rôle |
|---|---|
| `initFanions()` | Génère les triangles colorés sticky en haut |
| `initStickyHeader()` | Header sticky avec classe `scrolled` au scroll |
| `initBalloonsHero()` | Ballons pastel par hero avec **vrai logo CŒSPC en blanc** dessus (cf. § 4.6) |
| `initCountdown()` | J-N jours avant le 13 sept 2026 |
| `initMeteo()` | API Open-Meteo (gratuit, sans clé), fallback à 14 jours |
| `initBalloonsOnDayJ()` | Pluie de ballons UNIQUEMENT le 13/09/2026 |
| `initGallery()` | Lit `galerie/YYYY/galerie.json` + lightbox |
| `initPartnersFeed()` | Consomme `/api/partners-feed` (worker RSS) |
| `initCmsContent()` | Lit `_content/pages/{slug}.yml` + `config/site.yml` (js-yaml CDN, lazy) |
| `applyCmsContent(data)` | Remplace les éléments `data-cms`, `data-cms-html`, `data-cms-href`, `data-cms-src`, `data-cms-list` |

**Pas de JS dédié pour l'affiche 2026** : swap basé sur `<img onload>` / `onerror` inline (placeholder CSS si fichier absent).

---

## 7. CMS Decap

### 7.1 Activation

Voir `docs/CMS-ACTIVATION.md` (5 étapes manuelles, ~10 min, **action Colomban prioritaire**).

### 7.2 Six collections éditables

1. **Archives** (`_content/archives/YYYY.yml`) — édition par année avec tombola, retrait, partenaires, galerie, solidarité
2. **Pages** (`_content/pages/*.yml`) — 8 pages : accueil, édition-2026, histoire, partenaires, bénévoles, contact, presse, foire-aux-questions
3. **Paramètres** (`_content/config/{site,reseaux}.yml`) — date prochaine édition, chiffres-clés, URLs réseaux
4. **Partenaires** (`_content/partenaires/*.yml`) — 48 partenaires
5. **Programme** (`_content/programme/*.yml`) — 7 moments du jour J
6. **FAQ** (`_content/faq/*.yml`) — 12 questions

Workflow éditorial : draft → review → publish via Pull Request GitHub.

### 7.3 URLs admin

- Interface : `/admin/`
- Config : `/admin/config.yml`
- OAuth proxy : `/oauth` + `/oauth/callback`

### 7.4 Partenaires institutionnels (6)

1. **Mairie déléguée d'Annecy-le-Vieux** (siège social du CŒSPC) — ajout 27 avril 2026
2. Mairie d'Annecy (commune nouvelle issue de la fusion 2017)
3. Mairie de Veyrier
4. Paroisse Christ Ressuscité (URL : page diocese-annecy.fr/paroisse-le-christ-ressuscite-entre-lac-et-colline)
5. AVOC (« Annecy-le-Vieux Of Course », pas « Anciens d'Annecy-le-Vieux »)
6. L'Ancilevienne (« Un relais solidaire »)

---

## 8. Coordonnées affichées sur le site

### 8.1 Email contact (en clair, partout)

`fetevillageoise@pcr74.fr` — adresse officielle de l'association, redirigée vers la boîte Gmail `coespc74940@gmail.com` pour un suivi quotidien (décision bureau 27/04/2026).

Affiché en clair sur :
- Page Contact (section « Nous écrire »)
- Footer (24 pages)
- Mentions légales (bloc Contact + RGPD)
- Schema.org Organization (`email` + `contactPoint.email`)
- llms.txt
- Page Bénévoles (CTA inscription)
- Page Partenaires (CTA finale + section devenir partenaire)
- FAQ (Q. devenir bénévole, Q. proposer un lot)

### 8.2 Téléphone Prune (07 mai 2026, accord obtenu)

`06 46 74 53 38` cliquable via `tel:+33646745338`, format affiché « Prune · 06 46 74 53 38 » ou « contactez Prune au 06... » selon le contexte.

Affiché sur :
- Page Contact (section dédiée « Nous appeler », équivalente à « Nous écrire »)
- Footer (24 pages, sous l'email)
- Mentions légales (bloc Contact)
- Schema.org Organization (`telephone` + `contactPoint.telephone` + `contactPoint.name: "Prune"`)
- Page Partenaires (CTA finale « Rejoignez la 74e édition »)

### 8.3 Adresse postale officielle

```
Comité des Œuvres Sociales
Paroissiales et Communales
Mairie déléguée d'Annecy-le-Vieux
Chef-lieu
74940 Annecy-le-Vieux
```

Affichée sur footer (24 pages), page Contact (section Adresse postale), mentions légales, Schema.org `address`.

### 8.4 Réseaux sociaux (« suivez-nous », pas « contactez-nous »)

- Instagram : @fetevillageoise
- Page Facebook : Fête Villageoise
- Groupe Facebook : Communauté CŒSPC
- HelloAsso : seul lien officiel pour billetterie/tombola/dons

---

## 9. Décisions du bureau (chronologie)

### 9.1 Bureau du 27 avril 2026 (décisions structurantes)

- **Aucune mention Covid** sur le site (« c'est du passé »). Pas d'archives 2020/2021, pas de « post-COVID ».
- **Email en clair** partout (`fetevillageoise@pcr74.fr`), réseaux sociaux relégués en « suivez-nous ».
- **Adresse postale complète** affichée partout (Mairie déléguée + Chef-lieu + 74940 Annecy-le-Vieux).
- **Pas de plaquette programme** : support arrêté. Remplacé par « offre partenaires premium » (banderole, sacs, gilets perso).
- **Tirets em-dash (—) interdits dans la prose** : tic IA. Remplacer par virgule, deux-points, point ou bullet (`·`). Em-dash autorisés UNIQUEMENT comme placeholder de donnée vide (`<td>—</td>`).
- **Letter-spacing 0.18em → 0.32em** sur l'acronyme C Œ S P C (préférence « petit espace »).
- **Charte d'authenticité** : règle non négociable (cf. § 10).

### 9.2 Bureau du 6-7 mai 2026 (itérations design)

- **Logo sans wordmark** partout : nouveau fichier `logo-coespc-mark.png`. L'acronyme `C Œ S P C` est rendu en CSS, plus gravé dans l'image.
- **Favicon** : SVG coq seul, suppression des fallbacks PNG.
- **Marquee « Visages de la fête » mobile** : 60s → 30s + scroll swipe.
- **Ballons hero** : pipeline final avec le **vrai** logo CŒSPC en blanc transparent dessiné sur la pastel (création `logo-coespc-mark-transparent.png` via PIL, + filter CSS).
- **Téléphone Prune** : accord obtenu, affichage activé partout (contact, footer, Schema.org, mentions légales, CTA partenaires).
- **Audit espacements UX** : utility classes `.mt-6` / `.mb-6` / `.mt-12` / `.mb-12` ajoutées, `.hero-actions` reçoit margin-top par défaut, cleanup de 12 styles inline vers tokens.

---

## 10. Charte d'authenticité (règle non négociable)

Décrétée le 27 avril 2026.

### 10.1 Règle

**Aucune citation, nom propre, statistique ou anecdote sans source vérifiable et nommée.**

Sources acceptées :
- Presse identifiée + date (ex. *Le Dauphiné Libéré*, 16 janvier 2019)
- Personne nommée + fonction + année (ex. « Christian Balmain, président, en 2017 »)
- Archive papier identifiée (ex. *Le Vieux Clocher*, 1953)

Si la source manque, on écrit des **faits neutres et observables** (qui, où, quoi, quand, combien) ou on supprime.

### 10.2 Tics IA bannis dans la prose éditoriale

- « véritable » / « véritablement »
- « incontournable » / « rendez-vous incontournable »
- « emblématique »
- « cœur de l'événement »
- « mobilisation exceptionnelle »
- « témoigne de l'attachement »
- « tradition ancestrale »
- « au cœur de »
- Tout em-dash (—) en prose

### 10.3 Audit régulier

```bash
grep -rn "véritable\|incontournable\|emblématique\|cœur de l'événement\|mobilisation exceptionnelle" \
  src/_content/ src/*.html src/archives/*.html
```

Si des hits → reformuler factuellement ou supprimer.

### 10.4 Suppressions effectuées le 27 avril 2026 (commit `4f7f12d`)

- Phrase « chacun veut jouer les Bobet, selon la presse de l'époque » (référence non sourcée et invérifiable)
- « M. Rollier, alors préfet de Haute-Savoie, confirme le rayonnement de la fête » (titre non vérifié + commentaire éditorial fabriqué). La mention de Rollier reste dans la légende de la photo (visible au second plan).
- Reformulation factuelle de l'archive 2025 (retrait « record historique avec pas moins de », « mobilisation exceptionnelle qui témoigne de l'attachement »)
- Citation Balmain 2017 raccourcie (retrait « tradition de 50 ans » qui ne correspondait pas arithmétiquement à 1950→2017)
- Retrait de la citation invérifiable « l'importance de cette fête au cœur du village » + jargon « mission de responsabilité sociale » dans archive 2011

---

## 11. Pièges connus / dette technique surveillée

### 11.1 `data-cms-html` peut écraser un sous-arbre entier

Si la valeur YAML englobe trop d'éléments, le contenu YAML écrase tout dans le `<div data-cms-html="...">` au moment où `initCmsContent()` exécute `el.innerHTML = ...`. Cas vécu : 2e coupure presse `histoire.html`, corrigé en avril 2026.

→ Si tu rajoutes un attribut `data-cms-html`, vérifier que le YAML ne contient que ce qui est dans la balise.

### 11.2 `data-cms` (textContent) vs `data-cms-html` (innerHTML)

Si la valeur YAML contient des balises HTML (`<sup>`, `<em>`, `<br>`, `<strong>`), il **faut** `data-cms-html` ; sinon, le HTML s'affiche en brut.

→ Bug typique : YAML `editionLieu: "...<br>..."` lié à `data-cms="editionLieu"` → `<br>` apparaît en texte. Fix : `data-cms-html`.

### 11.3 Parsers RSS partenaires fragiles

Le parser RSS dans `functions/api/partners-feed.js` est tolérant aux changements mineurs de format WordPress AVOC/Ancilevienne, mais cassera si un partenaire migre vers Squarespace/Webflow/autre.

→ Garder le parser tolérant (try/catch + `Promise.allSettled` déjà en place). Si un flux casse, on retombe sur l'autre. Bumper `CACHE_VERSION` dans le worker invalide le cache Edge.

### 11.4 Mapping URL→YAML codé en dur

Dans `initCmsContent()` (`src/js/main.js`), le mapping est hardcodé. Acceptable à 8 pages, à refondre vers 30+ (peu probable).

### 11.5 Authenticité éditoriale

Voir § 10. À ne **pas** ré-introduire les tics IA. Audit par grep régulier.

---

## 12. Roadmap actuelle

### 12.1 🔴 Action immédiate prioritaire

**Activation OAuth bénévoles** (~10 min, action **Colomban**)
- Procédure : `docs/CMS-ACTIVATION.md`
- Bloque l'usage du CMS Decap par les bénévoles
- Tout est prêt côté code (`/oauth`, `/oauth/callback`, `/admin/`)

### 12.2 🟡 Court terme (mai 2026)

- **Affiche 2026** : en attente de l'artiste local. Côté code tout est prêt — la section placeholder de la home swap automatiquement dès que `/assets/images/affiche-2026.jpg` est déposé.
- **Search Console** : soumettre sitemap + valider DNS Cloudflare (~30 min).
- **Photos foule + remise de chèque** : sélection à faire dans l'album Samsung Cloud partagé.

### 12.3 🟢 Moyen terme (été 2026)

- **Communication réseaux sociaux pré-fête** : calendrier J-30 → J+7 dans `BACKLOG-CREATIF.md`.
- **Décision migration `fetevillageoise.com`** : bureau à arbitrer entre extinction (301 vers coespc.org) ou conservation comme archive.

### 12.4 ⏳ Post-événement (après 13 septembre 2026)

Refactoring vague 2 :
- Audit images : `affiche-YYYY.png` → WebP partout, `<picture>` avec fallback JPG
- Modules JS dynamiques : `import()` à la demande (météo, gallery, ballons)
- PurgeCSS : traquer les utility classes orphelines
- Tests Playwright : smoke tests
- Lighthouse CI sur chaque PR via GitHub Actions
- Sitemap dynamique : générer depuis YAML
- PWA : manifest + service worker (faible priorité)

Détail dans `TODO.md` § horizon 3.

---

## 13. Changelog complet (chronologique)

### 13.1 Avril 2026 — refactoring qualité (avant le bureau du 27)

| Lot | Bénéfice | Commit |
|---|---|---|
| Suppression `.page-decorations` + 11 `@keyframes` orphelines | -212 lignes CSS | `76529c7` |
| Suppression `_initPageDecorationsDisabled` JS | -68 lignes JS mortes | `76529c7` |
| Guard `data-cms` early-return dans `initCmsContent` | -45 KB sur pages statiques | `76529c7` |
| Décodeur HTML entities dans `partners-feed.js` | Plus de `&#8211;` brut affiché | `e067051` |
| Cache versionné Worker partners-feed (`CACHE_VERSION`) | Invalidation Edge sans purge manuelle | `e067051` |
| `X-XSS-Protection` obsolète retiré | Conforme OWASP modern | `76529c7` |
| Lien footer `/devenir-partenaire.html` (404) → ancre | -1 lien cassé | `76529c7` |

### 13.2 27 avril 2026 — feedback bureau (5 lots + audit)

| Lot | Bénéfice | Commit | Fichiers |
|---|---|---|---|
| Lot 1 — bugs encoding + corrections factuelles + em-dash + tics IA | Crédibilité du contenu | `d3412e8` | 40 |
| Lot 2 — email + adresse postale + retrait push Insta/FB | Contact direct possible | `f074d38` | 30 |
| Lot 3 — header logo agrandi + texte complet + acronyme `C Œ S P C` | Identité forte | `f94565d` | 25 |
| Lot 4 — galerie 76 ans (2014 Brésil) + swipe mobile portraits | UX mobile + diversité affiches | `1b3c475` | 2 |
| Lot 5 — lettres `C Œ S P C` blanches sur ballons + section affiche 2026 placeholder | Identité ludique + slot pour artiste | `212611a` | 3 |
| Audit authenticité — retrait des contenus invérifiables / prose IA + Mairie déléguée | Crédibilité / tout sourcé + 48e partenaire institutionnel | `4f7f12d` | 15 |

### 13.3 6-7 mai 2026 — itérations design

| Sujet | Bénéfice | Commit |
|---|---|---|
| Letter-spacing élargi `C Œ S P C` (0.18em → 0.32em) | « Petit espace » bien visible | `ef106f8` |
| Logo sans wordmark partout (header + footer + Schema.org) — création `logo-coespc-mark.png` | Identité plus propre, acronyme rendu en CSS | `56e1cea` |
| Marquee « Visages de la fête » sur mobile : 60s → 30s + scroll swipe | UX mobile défilement rapide | `2040a8d` |
| Lien email ajouté sous boutons CTA partenaires | Contact direct sur la page partenaires | `c00ccce` |
| Ballons hero : vrai logo CŒSPC en blanc transparent (création `logo-coespc-mark-transparent.png` via script Python qui supprime les pixels bleus, puis `filter: brightness(0) invert(1)`) | Identité forte sur les ballons sans masquer la couleur pastel | `70b2449` + `4db3edd` |
| Édition 2026 : « Stand de tir » → « Stand de tir & concours pour les grands et les petits » | Précision factuelle | `70b2449` |
| Téléphone Prune sur CTA partenaires + retrait Insta/FB à cet endroit | Canal de contact direct possible | `92d29ac` |
| Z-index : texte au-dessus des ballons sur `.page-hero` | Lisibilité titres sur toutes les pages secondaires | `703da60` |
| Audit espacements UX (charte 8px) : utility classes manquantes + `.hero-actions` margin-top + cleanup 12 inline styles | Cohérence visuelle, boutons CTA aérés | `440cb4b` |
| **Téléphone Prune — extension complète** : page contact (section dédiée « Nous appeler »), footer global (24 pages), Schema.org (`telephone` + `contactPoint.name: "Prune"`), mentions légales | Canal de contact direct partout sur le site | (ce commit) |

---

## 14. Procédures opérationnelles

### 14.1 Déployer une modif

1. Git push sur `main`
2. Cloudflare Pages détecte le commit, lance le build, déploie
3. Le site est à jour en 1-2 min sur https://coespc.org
4. Le browser cache CSS/JS (1h) peut nécessiter un hard refresh (`Ctrl+Shift+R`) côté visiteur

### 14.2 Activer le CMS Decap (1ère fois)

Suivre `docs/CMS-ACTIVATION.md` : 5 étapes manuelles, ~10 min.

### 14.3 Ajouter une archive d'année (post-événement)

1. Créer `src/_content/archives/YYYY.yml` (modèle : copier la structure de `2025.yml`)
2. Créer `src/archives/YYYY.html` (modèle : copier la structure de `2025.html`)
3. Ajouter l'affiche : `src/assets/images/affiche-YYYY.jpg`
4. Créer le dossier galerie : `src/assets/images/galerie/YYYY/` + `galerie.json` manifest
5. Mettre à jour `src/archives/index.html` (ajouter la card)
6. Mettre à jour `src/sitemap.xml` (ajouter l'URL)
7. Push

### 14.4 Ajouter un partenaire

1. Créer `src/_content/partenaires/slug.yml` (modèle existant)
2. Si partenaire institutionnel : aussi mettre à jour `src/partenaires.html` (tuile en dur dans la grille institutionnels)
3. Mettre à jour le marquee dans `src/index.html` et `src/partenaires.html` (deux fois : liste + duplicate pour boucle infinie)
4. Push

### 14.5 Recevoir et publier l'affiche 2026

1. Optimiser l'affiche reçue de l'artiste en JPG (~1200×1697 pour le hero)
2. Déposer dans `src/assets/images/affiche-2026.jpg`
3. Optionnel : créer `affiche-2026.webp` 1200×630 pour OG/Twitter
4. Remplacer toutes les références `affiche-2025.{png,webp}` dans les `<meta property="og:image">` (24 pages) par `affiche-2026.{jpg,webp}`
5. Mettre à jour `_content/pages/accueil.yml` et `_content/pages/edition-2026.yml` si visuel intégré ailleurs
6. Push → CF Pages redéploie auto, le placeholder disparait, l'affiche réelle apparait sans flash (handler `onload`)

### 14.6 Bumper le cache Edge des flux RSS partenaires

Éditer `functions/api/partners-feed.js`, incrémenter la constante `CACHE_VERSION` (ex. `'v2'` → `'v3'`), push.

### 14.7 Restaurer un état antérieur

```bash
git log --oneline                  # Trouver le hash souhaité
git revert <hash>                  # Crée un commit qui annule
git push origin main
```

---

## 15. Documentation associée

- **`REFERENCE.md`** (ce fichier) — Note de référence exhaustive (specs + design + décisions + changelog)
- **`CLAUDE.md`** — État opérationnel actuel + conventions (snapshot court)
- **`TODO.md`** — Roadmap actionnable par horizon (court / moyen / long terme)
- **`HANDOFF.md`** — Spécification technique détaillée
- **`BACKLOG-CREATIF.md`** — Idées créatives long terme + historique design + dette technique
- **`docs/CMS-ACTIVATION.md`** — Procédure activation OAuth GitHub (5 étapes)
- **`src/assets/images/{galerie,archives,partenaires-portraits}/README.md`** — Comment ajouter des médias

---

## 16. URLs utiles

- Production : https://coespc.org
- Repo : https://github.com/colombanatsea/coespc
- Admin (en attente OAuth) : https://coespc.org/admin/
- Cloudflare Pages dashboard : Workers & Pages → `coespc`
- Email contact : fetevillageoise@pcr74.fr
- Téléphone Prune : 06 46 74 53 38

---

*Note : ce REFERENCE.md est volontairement long et exhaustif. Pour la lecture rapide au quotidien, préférer `CLAUDE.md` (snapshot d'état) et `TODO.md` (roadmap actionnable). Ce document est la source de vérité pour reprendre le projet sans rien perdre.*
