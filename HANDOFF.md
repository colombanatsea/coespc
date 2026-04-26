# HANDOFF — Spécification technique & fonctionnelle
## Fête Villageoise d'Annecy-le-Vieux — coespc.org

> **État** : production active sur https://coespc.org
> **Dernière mise à jour** : 26 avril 2026

---

## 1. Contexte

Le **CŒSPC** (Comité des Œuvres Sociales Paroissiales et Communales) organise la Fête Villageoise d'Annecy-le-Vieux depuis **1950** (76 ans, 74 éditions, 2 annulations COVID en 2020-2021).

**Mission** : journée festive familiale (jeux, restauration savoyarde, tombola, animations musicales) dont **100 % des bénéfices** sont reversés :
- **1/3** au CCAS d'Annecy
- **2/3** aux œuvres sociales de la paroisse Christ Ressuscité

**Site précédent** : WordPress 6.0.11 sur OVH (fetevillageoise.com), non maintenu techniquement, contenu hétérogène (2011-2025).

**Site actuel** : statique sur **https://coespc.org**, refonte 2026 par Colomban Monnier (https://colombanatsea.com), propulsé et protégé par VAIATA Cyber.

---

## 2. Stack technique

| Composant | Choix | Justification |
|---|---|---|
| **Hébergement** | Cloudflare Pages | Gratuit, CDN mondial, HTTPS auto, preview branches |
| **Repo** | GitHub `colombanatsea/coespc` | Versioning, déploiement auto sur push `main` |
| **Front** | HTML/CSS/JS vanilla | Léger, lisible bénévoles, zéro build step |
| **CSS** | Custom design system « Kermesse Éternelle » | Léger, pas de framework |
| **Polices** | Auto-hébergées WOFF2 (Fraunces + DM Sans + Instrument Serif) | Zéro appel Google, OFL |
| **CMS** | [Decap CMS](https://decapcms.org) (ex-Netlify CMS) | Standard Jamstack, équivalent WordPress sur statique |
| **Auth CMS** | OAuth GitHub via Cloudflare Pages Functions | Pas de backend à maintenir |
| **Stockage contenu** | Fichiers YAML dans Git (`src/_content/`) | Versionné, rollback, transparent |
| **Workers** | Cloudflare Pages Functions | RSS partenaires, OAuth proxy |
| **Domaine** | coespc.org (Cloudflare DNS) | SSL Full strict, mode DNS proxy |
| **Billetterie** | HelloAsso externe | Déjà utilisé par le CŒSPC |
| **Réseaux sociaux** | Widget Elfsight (Instagram) + liens Facebook | Anti-spam (emails masqués) |
| **Analytics** | Cloudflare Web Analytics | RGPD-friendly, sans cookie |

---

## 3. Architecture du site

### 3.1 Arborescence des pages publiques

```
/                          Accueil (hero + stats + édition + solidarité + partenaires + archives)
├── /histoire              76 ans d'histoire (1948 → 2026, coupures presse 1953)
├── /association           Le CŒSPC, missions, gouvernance (à enrichir)
├── /edition-2026          Programme jour J + tartiflette + tombola + infos pratiques
├── /partenaires           47 partenaires en 6 catégories + portraits + plaquette
├── /benevoles             Devenir bénévole (Instagram/Facebook prioritaires)
├── /archives/             Index chronologique des 13 éditions archivées
│   ├── /archives/2025     73e édition (record 55 lots)
│   ├── /archives/2024     72e édition (tartiflette, gonflables)
│   ├── ...
│   └── /archives/2011     59e édition (Sonneurs de Savoye, Country Club)
├── /presse                Kit média téléchargeable + boilerplate copiable
├── /foire-aux-questions   FAQ (12 Q/R éditables via CMS)
├── /contact               Contact (Instagram + Facebook + adresse postale)
├── /mentions-legales      noindex, dédié (RGPD, hébergeur, crédits)
└── /admin/                Decap CMS (login GitHub OAuth)
```

### 3.2 Sources de contenu

```
src/_content/
├── pages/                  # Contenu textuel des pages publiques
│   ├── accueil.yml         # hero, stats, blocs édition/solidarité/partenaires
│   ├── edition-2026.yml    # programme + restauration + animations
│   ├── histoire.yml        # 5 sections chronologiques
│   ├── partenaires.yml     # textes de page (catégories, plaquette)
│   ├── benevoles.yml       # appel + postes + inscription
│   ├── contact.yml         # adresse, liens utiles
│   ├── presse.yml          # boilerplate, kit média
│   └── foire-aux-questions.yml
├── archives/               # 1 fichier par année 2011-2025 (sauf COVID)
│   └── YYYY.yml            # année, n° édition, titre, thème, affiche, résumé,
│                           # tombola { lots[] }, retrait_lots, partenaires[], solidarité
├── partenaires/            # 1 fichier par partenaire (~47)
│   └── slug.yml            # nom, catégorie, description, url, ordre, actif
├── programme/              # 7 moments du jour J
│   └── XX-HHhMM-slug.yml   # heure, titre, description, catégorie
├── faq/                    # 12 questions
│   └── XX-slug.yml         # question, réponse (Markdown), catégorie, ordre
└── config/
    ├── site.yml            # date prochaine édition, chiffres-clés, horaires
    └── reseaux.yml         # URLs Instagram, Facebook, HelloAsso
```

### 3.3 Architecture YAML ↔ HTML

Chaque page HTML contient le contenu **initial** (SEO + fallback) sur les éléments marqués :
- `data-cms="cle"` → remplacé par `textContent` (texte brut)
- `data-cms-html="cle"` → remplacé par `innerHTML` (HTML interprété)
- `data-cms-href="cle"` → remplace `<a href>`
- `data-cms-src="cle"` → remplace `<img src>`
- `data-cms-list="cle"` → génère une liste depuis un array YAML

Au chargement, `initCmsContent()` (`src/js/main.js`) :
1. Détecte la page courante via `window.location.pathname`
2. Fetch le YAML correspondant (mapping URL → fichier)
3. Charge `js-yaml` depuis CDN si pas encore chargé
4. Remplace tous les éléments marqués

**Règle critique** : le contenu HTML par défaut doit rester valide pour SEO/no-JS. Le YAML est une couche de superposition.

### 3.4 Galerie photos

Pour chaque année dans `src/assets/images/galerie/YYYY/`, un fichier `galerie.json` liste les photos :

```json
[
  { "file": "01-cor-des-alpes.jpg",     "alt": "Les Sonneurs de Savoye" },
  { "file": "02-remise-cheque-2011.jpg","alt": "Remise chèque mairie 12 dec 2011" }
]
```

Le JS `initGallery()` lit ce manifest et génère le grid + lightbox automatiquement. **81 photos** importées depuis l'ancien WordPress (2011-2025).

---

## 4. Design system « Kermesse Éternelle »

Conçu par Anthropic pour le projet (avril 2026), basé sur l'affiche 2025 de F. Garreau.

### 4.1 Palette

**Primaires** (5 piliers identitaires) :
- `--bleu-logo` `#142477` — Bleu Clocher (logos, headers, fond dark)
- `--or-logo` `#F4B365` — Or chaud (texte sur fond bleu, **uniquement**)
- `--ambre-fete` `#D4760A` — CTA, liens, accents chauds
- `--or-girouette` `#D4AF37` — Cocardes, badges (jamais texte sur bleu)
- `--rouge-guirlande` `#C0392B` — Fanions, drapeau Savoie

**Secondaires** (touches du peintre) : Vert Tilleul, Jaune Ballon, Bleu Lac, Corail Fleur

**Neutres papier** : Crème Lin `#FDF6E8` (fond), Papier Vieilli, Bois Chaud, Encre

### 4.2 Typographie

- **Display** : Fraunces (400-900 + italic) — titres uniquement
- **Body** : DM Sans (400/500/700) — corps, UI
- **Accent** : Instrument Serif (italic) — citations, exergues

Échelle Major Third (1.25), `--text-xs` 12px → `--text-5xl` 49px.

### 4.3 Règles d'usage

1. **Italique signature** : `<h1>La <em>Fête Villageoise</em>...</h1>`
2. **8px grid** : tous espacements multiples de 8 (`--space-1` à `--space-24`)
3. **Radii** : 4/8/12/16, **`--radius-full` 100px** pour boutons/pills
4. **Shadows bleu-tinted** : `rgba(5,22,130,0.04 → 0.12)`, jamais gris froid
5. **Motion gentle** : `cubic-bezier(.2,.8,.2,1)`, durées 150/200/400ms
6. **Max 3 éléments décoratifs par page** (fanions + 2 décos)

### 4.4 Éléments signature

- **Fanions** triangulaires sticky transparents en haut (overlay header)
- **Coq emoji** 🐓 — favicon (emoji officiel, pas de SVG custom) + animation cocoricoFade après Instagram
- **Verres qui trinquent** 🥂 — séparateur entre blocs avec sparkles
- **Ballons pastel** — pluie continue dans les hero (8 desktop, 4 mobile)
- **Silhouette montagne** SVG dans hero/footer (parallax léger sur home)
- **Archive press** : papier vieilli + rotation -0.3°, sépia 15%

---

## 5. Workflow éditorial CMS

### 5.1 Activation (à faire une fois)

Voir `docs/CMS-ACTIVATION.md` (5 étapes, ~10 min) :
1. Créer GitHub OAuth App (callback `/oauth/callback`)
2. Ajouter `OAUTH_GITHUB_CLIENT_ID` + `_SECRET` aux secrets Cloudflare Pages
3. Inviter bénévoles comme collaborators GitHub (Write)
4. Tester sur `/admin/`
5. Première modification de test

### 5.2 Workflow

1. Bénévole → `coespc.org/admin/` → « Login with GitHub »
2. Sélectionne une collection (Archives, Partenaires, Programme, FAQ...)
3. Modifie via formulaire web (champs typés : string, markdown, image, list, datetime, select)
4. Clique « Save » (draft) ou « Publish »
5. Decap commit automatiquement sur GitHub (mode `editorial_workflow` = via PR)
6. Cloudflare Pages redéploie en ~1 min
7. Site à jour en moins de 5 min sans purge cache (grâce aux nouveaux headers)

### 5.3 Limites du CMS

- Le CMS n'édite que les fichiers `_content/*.yml` (pas le HTML brut)
- Pour ajouter une nouvelle **structure** (nouveau bloc, nouvelle page), édition manuelle du HTML + création/modif de la collection dans `/admin/config.yml`
- Les images uploadées via le CMS vont dans `src/assets/images/uploads/`

---

## 6. Stratégie SEO

### 6.1 On-page

- **Title + meta description** spécifiques par page
- **Canonical** systématique
- **OG tags** + **Twitter Card** (image affiche-2025.png, 1200×630)
- **JSON-LD** : Organization (CŒSPC) + Event (74e édition) + FAQPage

### 6.2 Performance

- HTML 5 min cache + s-maxage 60s + SWR (modifs visibles vite)
- Fonts 1 an immutable (URLs stables)
- Images : WebP pour affiche 2025, JPEG progressive ailleurs
- `loading="lazy"` sur toutes les images sous le fold
- `js-yaml` chargé dynamiquement, pas pour le first paint

### 6.3 Migration WordPress

Le fichier `src/_redirects` contient les redirections 301 des anciennes URLs WP vers les nouvelles. Tout le contenu archives est conservé (13 éditions enrichies depuis le scrape WP).

### 6.4 Search Console

- Sitemap : `src/sitemap.xml` (24 URLs, changefreq + priority)
- robots.txt : Allow all + sitemap
- À faire : soumettre à Google Search Console + monitoring 404

---

## 7. Cache Cloudflare

Stratégie dans `src/_headers` :

```
/*.html          → max-age=300, s-maxage=60, SWR=60
/_content/*      → max-age=60, s-maxage=30, SWR=30
/css/*, /js/*    → max-age=3600, s-maxage=300, SWR=60
/assets/fonts/*  → max-age=31536000, immutable
/assets/images/{archives,galerie,partenaires-portraits,uploads}/* → max-age=86400, SWR=3600
/assets/images/* → max-age=31536000, immutable (affiches stables)
/admin/*         → no-store, no-cache
/oauth*          → no-store, no-cache
```

**Conséquence** : aucune purge manuelle nécessaire après push. Les modifs apparaissent en <5 min côté visiteur.

---

## 8. Accessibilité

- Skip link `Aller au contenu principal`
- Contraste WCAG AA validé (Bois Chaud sur Crème Lin = 7.8:1)
- Min font-size 16px (corps)
- Touch targets ≥ 44px (mobile)
- `aria-label`, `aria-hidden`, `role` adaptés
- `prefers-reduced-motion` désactive toutes les animations
- Logo CŒSPC : zone de protection = largeur lettre C, taille min 48px

---

## 9. Sécurité

`src/_headers` :
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

> **Note avril 2026** : `X-XSS-Protection` retiré car obsolète (ignoré par tous les navigateurs modernes depuis Chrome 78, peut créer des XS-leaks). Les protections XSS modernes reposent sur le sandboxing du navigateur et la non-injection de HTML brut côté JS (cf. `escapeHtml()` dans `main.js` + `decodeEntities()` dans le Worker partners-feed).

OAuth GitHub : secrets stockés en variables Cloudflare Pages chiffrées, jamais commitées.

---

## 10. Maintenance

### Mise à jour annuelle (chaque septembre)

Avant l'édition N+1 :
1. Créer `src/_content/archives/YYYY.yml` pour l'édition N qui vient de passer
2. Ajouter affiche `src/assets/images/affiche-YYYY.png` (ou jpg)
3. Ajouter dossier `src/assets/images/galerie/YYYY/` + photos + `galerie.json`
4. Mettre à jour `src/_content/config/site.yml` :
   - `edition_prochaine_date`
   - `edition_prochaine_numero`
   - `annees_depuis_creation`
   - `total_editions`
5. Ajouter une carte dans `src/archives/index.html` pour la nouvelle année
6. Créer la page `src/archives/YYYY.html` (copier le template d'une année précédente)

Le CMS Decap simplifie tout ça via l'interface web (sauf création de la page HTML qui reste en code).

### Dépendances externes

- Polices : OFL, copies locales ne dépendent de rien
- js-yaml : CDN jsDelivr (versionné `@4.1.0`) — chargé **uniquement** si la page contient `[data-cms*]` (guard early-return dans `initCmsContent`)
- Decap CMS : CDN unpkg (versionné `@^3.3.3`)
- Open-Meteo : API publique gratuite
- Elfsight : widget Instagram (à activer après création compte)
- RSS partenaires : flux WordPress AVOC (`avoc.fr/feed/`) + Ancilevienne (`ancilevienne.fr/feed/`), agrégés et décodés (entités HTML) par le Worker `partners-feed.js`, mis en cache 1 h via Cache API Cloudflare (clé versionnée pour invalidation explicite)

---

## 11. Documentation associée

- `CLAUDE.md` — Vue d'ensemble + état d'avancement
- `BACKLOG-CREATIF.md` — Roadmap idées non-prioritaires
- `docs/CMS-ACTIVATION.md` — Procédure activation CMS
- `src/assets/images/{galerie,archives,partenaires-portraits}/README.md` — Comment ajouter des médias

---

*Dernière révision : 26 avril 2026 — par Colomban + Claude*
