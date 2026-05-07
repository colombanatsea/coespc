# TODO — Fête Villageoise / coespc.org

> **Source unique de vérité** pour ce qui reste à faire.
> Pour le « pourquoi » : voir `CLAUDE.md` (vision + état) et `BACKLOG-CREATIF.md` (idées long terme + dette technique surveillée).
> Pour le « comment » technique : voir `HANDOFF.md`.
>
> *Dernière mise à jour : 7 mai 2026 (itérations design + activation tél Prune partielle)*

---

## ⚡ Si tu reprends maintenant — par où commencer

1. **Lis `CLAUDE.md`** (3 min) → vision, stack, design system, état actuel
2. **Lis ce fichier `TODO.md`** (2 min) → ce qui est en attente, par horizon
3. **Action immédiate prioritaire** : 🔴 [Activation OAuth bénévoles](#-activation-oauth-benevoles) (~10 min, action **Colomban**)

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

### 🟠 Téléphone Prune — étendre l'affichage
- **Owner** : Colomban
- **Effort** : ~15 min
- **Statut actuel** : numéro affiché uniquement sur la CTA finale de `partenaires.html` (« Rejoignez la 74e édition ») — commit `92d29ac`. Format : `06 46 74 53 38` cliquable via `tel:+33646745338`.
- **Extension possible** (si le bureau valide l'affichage généralisé) :
  1. Page `contact.html` : nouvelle section « Nous appeler » sous l'email, avec classe CSS dédiée `.contact-phone` (équivalente à `.contact-email`)
  2. Footer global (24 pages) sous l'adresse postale, classe `.footer-phone`
  3. `src/index.html` Schema.org Organization → `contactPoint.telephone: "+33646745338"`
  4. Mentions légales : ajout du tél au bloc « Contact »
  5. Push → CF Pages redéploie auto

### 🟡 Affiche 2026 (dès réception de l'artiste)
- **Owner** : artiste local (à recruter, cf. `BACKLOG-CREATIF.md` § « Collection d'affiches »)
- **Côté site** : section déjà en place dans la home (entre countdown et météo) avec placeholder élégant. Dès qu'on dépose le fichier, l'image apparait automatiquement.
- **Action une fois l'affiche reçue** :
  1. Optimiser l'affiche en `affiche-2026.jpg` (~1200×1697 pour le hero, ratio A4 / format affiche)
  2. Déposer le fichier dans `src/assets/images/affiche-2026.jpg`
  3. Optionnellement : créer une `affiche-2026.webp` 1200×630 pour les balises OG/Twitter (meilleur poids)
  4. Remplacer toutes les références `affiche-2025.{png,webp}` dans les `<meta property="og:image">` (24 pages) par `affiche-2026.{jpg,webp}`
  5. Mettre à jour `_content/pages/accueil.yml` et `_content/pages/edition-2026.yml` si visuel intégré ailleurs
  6. Push → CF Pages redéploie auto, le placeholder rayé disparait, l'affiche réelle apparait sans flash (grâce au handler `onload`)

### 🟡 Search Console
- **Owner** : Colomban
- **Effort** : 30 min
- **Actions** :
  - Soumettre `https://coespc.org/sitemap.xml` à Google Search Console
  - Ajouter property + valider via DNS (Cloudflare)
  - Configurer alertes 404 + erreurs d'indexation
  - Idem Bing Webmaster Tools (5 min de plus, gratuit)

### 🟡 Photos foule + remise de chèque
- **Owner** : Colomban (sélection) + bureau (validation)
- **Source** : album partagé Samsung Cloud fourni par Colomban (vidéos + photos foule, ambiance, musique, tartiflette, billets tombola, rassemblement bénévoles)
- **Effort** : 1-2 h pour curation + intégration
- **Actions** :
  1. Sélectionner ~10 photos représentatives : foule sur la place, tartiflette servie, tirage tombola, remise de chèque mairie/paroisse, rassemblement bénévoles au Clocher
  2. Optimiser en JPG ~1200px de large
  3. Ajouter dans `/src/assets/images/galerie/2025/` ou un nouveau dossier dédié
  4. Mettre à jour `_content/archives/2025.yml` (champ `galerie` si nécessaire)
  5. Pour la page Bénévoles : utiliser une photo du rassemblement comme hero ou illustration

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

### Lots feedback bureau du 27 avril 2026 (pour mémoire — déjà déployés)
| Lot | Bénéfice | Commit | Fichiers |
|---|---|---|---|
| Lot 1 — bugs encoding + corrections factuelles + em-dash + tics IA | Crédibilité du contenu | `d3412e8` | 40 |
| Lot 2 — email + adresse postale + retrait push Insta/FB | Contact direct possible | `f074d38` | 30 |
| Lot 3 — header logo agrandi + texte complet + acronyme `C Œ S P C` | Identité forte | `f94565d` | 25 |
| Lot 4 — galerie 76 ans (2014 Brésil) + swipe mobile portraits | UX mobile + diversité affiches | `1b3c475` | 2 |
| Lot 5 — lettres `C Œ S P C` blanches sur ballons + section affiche 2026 placeholder | Identité ludique + slot pour artiste | `212611a` | 3 |
| Audit authenticité — retrait des contenus invérifiables / prose IA | Crédibilité / tout sourcé | `4f7f12d` | 15 |

### Itérations design 6-7 mai 2026 (pour mémoire — déjà déployées)
| Sujet | Bénéfice | Commit | Fichiers |
|---|---|---|---|
| Letter-spacing élargi `C Œ S P C` (0.18em → 0.32em) | « Petit espace » bien visible | `ef106f8` | 1 |
| Logo sans wordmark partout (header + footer + Schema.org) — création `logo-coespc-mark.png` | Identité plus propre, acronyme rendu en CSS | `56e1cea` | 25 |
| Marquee « Visages de la fête » sur mobile : 60s → 30s + scroll swipe | UX mobile défilement rapide | `2040a8d` | 2 |
| Lien email ajouté sous boutons CTA partenaires | Contact direct sur la page partenaires | `c00ccce` | 2 |
| Ballons hero : itération technique pour avoir le **vrai** logo CŒSPC blanc transparent dessiné sur la pastel (création `logo-coespc-mark-transparent.png` via script Python qui supprime les pixels bleus du PNG, puis `filter: brightness(0) invert(1)` pour passer en blanc) | Identité forte sur les ballons sans masquer la couleur pastel | `70b2449` + `4db3edd` | 4 |
| Édition 2026 : « Stand de tir pour les grands et les petits » → « Stand de tir & concours pour les grands et les petits » | Précision factuelle | `70b2449` | 1 |
| Téléphone Prune — affichage activé sur la CTA finale partenaires (`tel:+33646745338`), retrait des boutons Insta/FB à cet endroit | Canal de contact direct possible (Prune a confirmé l'accord) | `92d29ac` | 1 |
| Z-index : texte au-dessus des ballons sur `.page-hero` | Lisibilité titres sur toutes les pages secondaires | `703da60` | 1 |
| Audit espacements UX (charte 8px) : utility classes manquantes `.mt-6` / `.mb-6` / `.mt-12` / `.mb-12`, `.hero-actions { margin-top: var(--space-6) }`, cleanup de 12 inline `style="margin-top: 1.5rem"` → classes utility | Cohérence visuelle, boutons CTA plus aérés du texte | `440cb4b` | 15 |

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

À garder en tête lors des prochaines évolutions, **pas urgent** mais à ne pas aggraver :

1. **`data-cms-html` peut écraser un sous-arbre entier** si la valeur YAML englobe trop d'éléments.
   *Exemple corrigé en avril 2026 : 2e coupure presse `histoire.html`.*
   → Si tu rajoutes un attribut `data-cms-html`, vérifier que le YAML ne contient que ce qui est dans la balise.

2. **Parsers RSS partenaires fragiles** à un changement de format WordPress AVOC/Ancilevienne.
   → Garder le parser tolérant (try/catch déjà en place) ; si un flux casse, on retombe juste sur l'autre.

3. **Mapping URL→YAML codé en dur** dans `initCmsContent` (`src/js/main.js` ~ligne 130).
   → Acceptable à 8 pages, à refondre vers 30+ (peu probable).

4. **Authenticité du contenu rédigé** : règle décrétée le 27 avril 2026.
   → Ne **jamais** rédiger une citation, un nom ou une statistique sans source vérifiable. Si pas de source, écrire des faits neutres et observables. Les tics IA à éviter : « véritable », « incontournable », « emblématique », « rendez-vous incontournable », « cœur de l'événement », « mobilisation exceptionnelle », « témoigne de l'attachement ». Ces termes sont à bannir de la prose éditoriale.
   → Toute citation doit être attribuée à une source publique nommée (presse + date, ou personne nommée + fonction + année). Sans source explicite, paraphraser sans guillemets ou supprimer.

---

## 📚 Documentation associée

- **`CLAUDE.md`** — Vision, stack, design system, état d'avancement (snapshot)
- **`HANDOFF.md`** — Spécification technique détaillée (architecture, choix, sécurité)
- **`BACKLOG-CREATIF.md`** — Idées créatives long terme + historique design + dette technique
- **`docs/CMS-ACTIVATION.md`** — Procédure activation OAuth GitHub (5 étapes)
- **`src/assets/images/{galerie,archives,partenaires-portraits}/README.md`** — Comment ajouter des médias
