# TODO — Fête Villageoise / coespc.org

> **Source unique de vérité** pour ce qui reste à faire.
> Pour le « pourquoi » : voir `CLAUDE.md` (vision + état) et `BACKLOG-CREATIF.md` (idées long terme + dette technique surveillée).
> Pour le « comment » technique : voir `HANDOFF.md`.
>
> *Dernière mise à jour : 26 avril 2026*

---

## ⚡ Si tu reprends maintenant — par où commencer

1. **Lis `CLAUDE.md`** (3 min) → vision, stack, design system, état actuel
2. **Lis ce fichier `TODO.md`** (2 min) → ce qui est en attente, par horizon
3. **Action immédiate prioritaire** : 🔴 [Activation OAuth bénévoles](#activation-oauth-benevoles) (~10 min, action **Colomban**)

URLs utiles :
- Production : https://coespc.org
- Repo : https://github.com/colombanatsea/coespc
- Admin (en attente OAuth) : https://coespc.org/admin/
- Cloudflare Pages : dashboard → Workers & Pages → `coespc`

---

## 🎯 Horizon 1 — Court terme opérationnel (mai 2026)

### 🔴 Activation OAuth bénévoles
- **Owner** : Colomban
- **Effort** : ~10 min (5 étapes manuelles)
- **Dépendance** : aucune, tout est en place côté code (`/oauth`, `/oauth/callback`, `/admin/`)
- **Procédure** : `docs/CMS-ACTIVATION.md`
- **Critère de succès** : un bénévole peut se connecter sur `/admin/`, modifier une FAQ, publier, voir le changement live en <5 min

### 🟠 Validation contenu par le bureau CŒSPC
- **Owner** : Colomban (envoi) + bureau (relecture)
- **Effort** : 1 réunion de bureau (1 h)
- **Livrable attendu** : feedback qualifié sur les 24 pages publiques (typos, infos obsolètes, formulations à modifier)
- **Process** : capture d'écran + commentaire → ticket GitHub ou note Notion

### 🟡 Affiche 2026 (dès réception de l'artiste)
- **Owner** : artiste local (à recruter, cf. `BACKLOG-CREATIF.md` § « Collection d'affiches »)
- **Action une fois reçue** :
  1. Optimiser en `affiche-2026.{webp,jpg}` (1200×630 pour OG/Twitter, plus grand pour hero)
  2. Remplacer `affiche-2025.webp` partout dans les balises OG/Twitter (`<meta property="og:image">`)
  3. Mettre à jour `_content/pages/accueil.yml` et `_content/pages/edition-2026.yml` si visuel intégré
  4. Push → CF Pages redéploie auto

### 🟡 Search Console
- **Owner** : Colomban
- **Effort** : 30 min
- **Actions** :
  - Soumettre `https://coespc.org/sitemap.xml` à Google Search Console
  - Ajouter property + valider via DNS (Cloudflare)
  - Configurer alertes 404 + erreurs d'indexation
  - Idem Bing Webmaster Tools (5 min de plus, gratuit)

---

## 📅 Horizon 2 — Moyen terme avant l'événement (été 2026)

### 🟢 Communications réseaux sociaux pré-fête
- **Owner** : à désigner (community manager bénévole ?)
- **Plan détaillé** : `BACKLOG-CREATIF.md` § « Calendrier de contenu pré-fête »
- **Calendrier** : J-30 → J+7 (8 publications minimum)

### 🟢 Migration WP fetevillageoise.com
- **Owner** : Colomban (technique) + bureau (décision)
- **Décision attendue** : éteindre le WordPress historique ou le garder en archive ?
- **Si extinction** : 301 permanent du domaine `fetevillageoise.com` vers `coespc.org` (config Cloudflare)
- **Si conservation** : ajouter banner « Site archivé, actualités sur coespc.org »

---

## 🛠 Horizon 3 — Refactoring vague 2 (post-événement, après 13 sept 2026)

> ⚠️ **Pourquoi attendre ?** Le site est stable, performant et fonctionnel. Refactorer avant l'événement principal = risque de régression sur le rendez-vous annuel le plus important. Toute optimisation peut attendre 3 mois sans coût utilisateur perceptible.

### Refactoring déjà fait (avril 2026, pour mémoire)
| Lot | Bénéfice | Commit |
|---|---|---|
| Suppression `.page-decorations` + 11 `@keyframes` orphelines | -212 lignes CSS | `76529c7` |
| Suppression `_initPageDecorationsDisabled` JS | -68 lignes JS mortes | `76529c7` |
| Guard `data-cms` early-return dans `initCmsContent` | -45 KB sur pages statiques | `76529c7` |
| Décodeur HTML entities dans `partners-feed.js` | Plus de `&#8211;` brut affiché | `e067051` |
| Cache versionné Worker partners-feed (`CACHE_VERSION`) | Invalidation Edge sans purge manuelle | `e067051` |
| `X-XSS-Protection` obsolète retiré | Conforme OWASP modern | `76529c7` |
| Lien footer `/devenir-partenaire.html` (404) → ancre | -1 lien cassé | `76529c7` |

### Prochaine vague
| # | Lot | Effort | Impact | Owner |
|---|---|---|---|---|
| 1 | **Audit images** : `affiche-YYYY.png` (953 KB) → WebP partout, `<picture>` avec fallback JPG pour vieux Safari | M | -70 % poids hero | Claude |
| 2 | **Modules JS dynamiques** : `import()` à la demande (météo, gallery lightbox, ballons) — chargés seulement quand besoin | M | -10 KB JS first paint | Claude |
| 3 | **PurgeCSS** : passe pour traquer utility classes orphelines | S | <5 % du fichier (hygiène) | Claude |
| 4 | **Tests Playwright** : smoke tests (homepage charge, CMS reader applique YAML, partners-feed parse OK) | L | Filet de sécurité avant maintenance bénévoles | Claude |
| 5 | **Lighthouse CI** sur chaque PR via GitHub Actions | M | Garantit perf/a11y/SEO ≥ 95 dans la durée | Claude |
| 6 | **Sitemap dynamique** : générer `sitemap.xml` depuis YAML (script Node) | S | Plus d'oublis quand on ajoute une archive | Claude |
| 7 | **PWA** : manifest + service worker pour install mobile | M | Faible priorité, nice-to-have | Claude |

Légende effort : S = <1 h · M = 2-4 h · L = 1 jour

---

## 🧹 Dette technique surveillée

À garder en tête lors des prochaines évolutions, **pas urgent** mais à pas aggraver :

1. **`data-cms-html` peut écraser un sous-arbre entier** si la valeur YAML englobe trop d'éléments.
   *Exemple corrigé en avril 2026 : 2e coupure presse `histoire.html`.*
   → Si tu rajoutes un attribut `data-cms-html`, vérifier que le YAML ne contient que ce qui est dans la balise.

2. **Parsers RSS partenaires fragiles** à un changement de format WordPress AVOC/Ancilevienne.
   → Garder le parser tolérant (try/catch déjà en place) ; si un flux casse, on retombe juste sur l'autre.

3. **Mapping URL→YAML codé en dur** dans `initCmsContent` (`src/js/main.js` ~ligne 130).
   → Acceptable à 8 pages, à refondre vers 30+ (peu probable).

---

## 📚 Documentation associée

- **`CLAUDE.md`** — Vision, stack, design system, état d'avancement (snapshot)
- **`HANDOFF.md`** — Spécification technique détaillée (architecture, choix, sécurité)
- **`BACKLOG-CREATIF.md`** — Idées créatives long terme + historique design + dette technique
- **`docs/CMS-ACTIVATION.md`** — Procédure activation OAuth GitHub (5 étapes)
- **`src/assets/images/{galerie,archives,partenaires-portraits}/README.md`** — Comment ajouter des médias
