# BACKLOG CRÉATIF — Idées et roadmap
> Historique des pistes créatives + roadmap des évolutions futures.
> Sert de mémoire pour ne rien perdre des décisions passées.

---

## 📊 Statut (26 avril 2026)

- ✅ **Direction A « Kermesse Éternelle »** retenue + design system officiel Anthropic appliqué
- ✅ **Site complet déployé** sur https://coespc.org (24 pages HTML + admin Decap)
- ✅ **Architecture CMS Decap** branchée (config, OAuth proxy, 6 collections, 89 YAML)
- ✅ **13 archives** + **47 partenaires** + **81 photos** + **12 FAQ** + **7 moments programme** migrés
- ✅ **Refactoring qualité avril 2026** : -278 lignes dead code, perf guard data-cms, fix RSS entities, headers cleanup
- 🚧 **Activation OAuth bénévoles** = prochaine étape opérationnelle (voir `docs/CMS-ACTIVATION.md`)

Idées non-prioritaires conservées ci-dessous (historique + roadmap).

---

## 🛠 Roadmap refactoring & dette technique

### ✅ Refactoring fait (avril 2026)

| Lot | Bénéfice |
|---|---|
| Suppression `.page-decorations` + 11 `@keyframes` orphelines | -212 lignes CSS, élimine du CSS jamais utilisé depuis le commit 624a86a |
| Suppression `_initPageDecorationsDisabled` JS | -68 lignes JS mortes |
| Guard `data-cms` early-return dans `initCmsContent` | -45 KB sur les pages statiques (pas de fetch js-yaml inutile) |
| Décodeur HTML entities dans `partners-feed.js` | Plus de `&#8211;` brut affiché ; cache versionné pour invalidation |
| `X-XSS-Protection` obsolète retiré | Conforme aux recos OWASP/CSP modernes |
| Lien footer `/devenir-partenaire.html` (404) → ancre | -1 lien cassé |

### 🔜 Prochaine vague (post-événement 13 sept 2026)

| Lot | Effort | Impact |
|---|---|---|
| **Audit images** : convertir tous les `affiche-YYYY.png` (953 KB) en WebP, référencer `.webp` partout, `<picture>` avec fallback JPG | M | -70 % poids hero |
| **Modules JS dynamiques** : `import()` à la demande pour météo, gallery lightbox, ballons (chargés seulement quand besoin) | M | -10 KB JS first paint |
| **Audit CSS** : passe PurgeCSS pour traquer utility classes orphelines | S | <5 % du fichier (faible mais bon hygiène) |
| **Tests Playwright** : smoke tests (homepage, CMS reader applique YAML, partners-feed parse) | L | Filet de sécurité avant maintenance bénévoles |
| **Lighthouse CI** : audit auto sur chaque PR via GitHub Actions | M | Garantit perf/a11y/SEO ≥ 95 dans la durée |
| **Sitemap dynamique** : générer `sitemap.xml` depuis YAML (script Node) au lieu de l'éditer à la main | S | Moins d'oublis quand on ajoute une archive |
| **PWA** : manifest + service worker pour install mobile | M | Faible priorité, nice-to-have |

### 🧹 Dette technique surveillée

- `data-cms-html` peut écraser des sous-arbres entiers si la valeur YAML englobe trop d'éléments (cas du bug 2e coupure presse `histoire.html` corrigé). À documenter en HTML par un commentaire `<!-- DON'T WRAP -->` autour des zones sensibles.
- Les flux RSS partenaires sont fragiles à un changement de format WordPress → garder le parser tolérant et logger les erreurs en `console.warn`.
- Le mapping URL→YAML dans `initCmsContent` est codé en dur. À 30+ pages ce sera lourd ; pour l'instant 8 pages, OK.

---

## 1. Directions de design system (3 propositions)

### Direction A — « Kermesse Éternelle » ⭐ (RETENUE et déployée)
- **Esprit** : énergie joyeuse et artisanale, peinte à la main
- **Palette** : Bleu Clocher (#142477), Ambre Fête (#D4760A), Or Girouette (#D4AF37), Rouge Guirlande (#C0392B)
- **Typo titrage** : Fraunces (variable serif, expressif, chaud)
- **Typo corps** : DM Sans (humanist sans-serif)
- **Signatures visuelles** :
  - Texture peinte / aquarelle
  - Silhouette du clocher d'Annecy-le-Vieux en filigrane
  - Guirlandes à fanions en élément décoratif
  - Badge rond pour le numéro d'édition
  - Palette du peintre comme motif récurrent
- **Ambiance** : fête populaire, tradition vivante, artisanat

### Direction B — « Bleu Royal »
- **Esprit** : solennité chaleureuse, bleu et or du logo CŒSPC
- **Palette** : Bleu royal (#0D1B6F → #E8EAF6) + Or (#B8860B → #F5E6A3)
- **Plus institutionnel**, sobre, élégant
- **Convient pour** : communication officielle, remises de chèques, AG

### Direction C — « Place Vive »
- **Esprit** : contemporain, énergique, coloré
- **Pour toucher un public jeune**
- Détails complets dans le fichier HTML de référence (`fete-villageoise-design-systems.html`)

### Recommandation
Mixer A + B : « Kermesse Éternelle » pour le site grand public et les affiches, « Bleu Royal » pour les documents institutionnels (PV, courriers, remises de chèques).

---

## 2. Concept « Collection d'affiches »

**Idée** : chaque année, un artiste local réalise une affiche peinte à la main.
- Le design system fournit le **cadre fixe** :
  - Bandeau titre en Fraunces or
  - Bandeau bas en bleu
  - Cartouche avec le numéro d'édition
  - Logo CŒSPC + QR code
- **L'artiste est libre sur 70% de la surface** (la zone centrale)
- Cela crée une collection qui s'enrichit chaque année
- Visuellement cohérente mais unique à chaque édition
- Valorise les artistes locaux d'Annecy-le-Vieux

**Action** : trouver un artiste pour l'affiche 2026 (tout le comité cherche)

---

## 3. Pistes de contenu enrichi

### Page « Histoire » — Frise chronologique interactive
- Timeline verticale avec photos d'époque
- Les coupures de presse de 1953 en scan haute résolution
- Témoignages vidéo de personnes âgées qui se souviennent des premières éditions
- Section « Le saviez-vous ? » avec anecdotes (le petit goret, Louison Bobet, etc.)

### Section « Solidarité en action »
- Interview de Véronique Joly (Présidente du CCAS)
- Photos des remises de chèques par année
- Chiffres cumulés : combien reversé depuis 1950 ?
- Témoignages de bénéficiaires (anonymisés)

### Galerie « Mémoire vivante »
- Comparaisons avant/après (même lieu, 70 ans d'écart)
- Photos des fondateurs (si disponibles via la fille de M. Barat)
- Reproduction des bulletins « Le Vieux Clocher »

### Widget météo nostalgie
- Pour chaque édition archivée, afficher la météo qu'il faisait ce jour-là
- Source : données historiques Météo France

---

## 4. Pistes réseaux sociaux

### Calendrier de contenu pré-fête
- J-30 : annonce programme
- J-21 : présentation des partenaires (1 par jour)
- J-14 : « Le saviez-vous ? » historique
- J-7 : présentation des bénévoles
- J-1 : rappel programme + météo
- Jour J : live stories
- J+1 : remerciements + résultats tombola
- J+7 : bilan + photos

### Séries récurrentes
- « Un partenaire, une histoire » (portrait restaurateur/commerce)
- « Vu aux archives » (photo vintage + contexte)
- « Derrière les stands » (coulisses bénévoles)

---

## 5. Fonctionnalités avancées (futur)

### Tombola en ligne améliorée
- Intégration plus poussée avec HelloAsso
- QR code sur les billets physiques pour vérifier les résultats

### Espace adhérents
- Anciennement protégé par mot de passe sur WordPress
- À évaluer si nécessaire sur le nouveau site

### Newsletter
- Alerte annuelle « La fête arrive ! »
- Via Brevo ou Mailchimp (gratuit jusqu'à 300 contacts)

### Carte interactive
- Plan du chef-lieu avec les stands positionnés
- Leaflet.js + OpenStreetMap

---

## 6. Merchandising

### Produits en cours de devis
- **Gilet sans manches brodé** : logo CŒSPC devant, « Fête Villageoise » derrière
- **Casquette brodée** : logo CŒSPC
- Pas d'écocups (décision 2026)

### Piste future
- Vente en ligne de produits dérivés (si volume suffisant)
- Affiches signées par l'artiste en édition limitée

---

*Ce backlog sera enrichi à chaque réunion du comité. Toute idée mérite d'être notée ici, même si elle n'est pas réalisable immédiatement.*
