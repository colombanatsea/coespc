# BACKLOG CRÉATIF — Idées long terme + historique design

> Historique des pistes créatives + idées non-prioritaires + dette technique surveillée.
> Sert de **mémoire** pour ne rien perdre des décisions passées.
>
> **⚠️ Pour la roadmap actionnable (court/moyen/long terme avec owner et effort), voir `TODO.md`.** Ce fichier-ci ne fait qu'archiver le « pourquoi » et les pistes long terme.

---

## 📊 Statut (27 avril 2026)

- ✅ **Direction A « Kermesse Éternelle »** retenue + design system officiel Anthropic appliqué
- ✅ **Site complet déployé** sur https://coespc.org (24 pages HTML + admin Decap)
- ✅ **Architecture CMS Decap** branchée (config, OAuth proxy, 6 collections, 90 YAML)
- ✅ **13 archives** + **48 partenaires** (ajout Mairie déléguée d'Annecy-le-Vieux) + **81 photos** + **12 FAQ** + **7 moments programme** migrés
- ✅ **Refactoring qualité avril 2026** : -278 lignes dead code, perf guard data-cms, fix RSS entities, headers cleanup
- ✅ **Feedback bureau du 27/04/2026** intégré : 5 lots livrés + audit authenticité (commits `d3412e8`, `f074d38`, `f94565d`, `1b3c475`, `212611a`, `4f7f12d`)
- ✅ **Charte d'authenticité** : aucune citation/nom/statistique sans source vérifiable (règle 27/04/2026)
- 🚧 **Activation OAuth bénévoles** = prochaine étape opérationnelle (voir `docs/CMS-ACTIVATION.md`)

Idées non-prioritaires conservées ci-dessous (historique + roadmap).

---

## 🛠 Roadmap refactoring

> Détail actionnable avec effort/impact/owner : voir `TODO.md` § « Horizon 3 — Refactoring vague 2 ».
>
> Résumé :
> - **Fait avril 2026** (7 lots, ~280 lignes de dead code purgées, fix RSS entities, perf guard) — détail dans le tableau de `TODO.md`.
> - **Prochaine vague (post-13 sept 2026)** : WebP, modules JS dynamiques, PurgeCSS, tests Playwright, Lighthouse CI, sitemap dynamique, PWA.
> - **Pourquoi attendre l'événement ?** Le site est stable/performant ; refactorer avant l'événement principal = risque de régression évitable. 3 mois d'attente = zéro coût utilisateur.

---

## 🧹 Dette technique + éditoriale surveillée (long terme)

À garder en tête, **pas urgent** mais à pas aggraver :

- **`data-cms-html` peut écraser un sous-arbre entier** si la valeur YAML englobe trop d'éléments (cas du bug 2e coupure presse `histoire.html` corrigé en avril 2026). Documenter par un commentaire HTML `<!-- DON'T WRAP -->` autour des zones sensibles si tu ajoutes des `data-cms-html`.
- **Parsers RSS partenaires fragiles** à un changement de format WordPress → garder le parser tolérant et logger les erreurs en `console.warn`. Si un flux casse, on retombe juste sur l'autre via `Promise.allSettled`.
- **Mapping URL→YAML codé en dur** dans `initCmsContent`. À 30+ pages ce sera lourd ; pour l'instant 8 pages, OK.
- **Authenticité éditoriale** (règle décrétée 27/04/2026) : ne **jamais** ajouter de citation, nom propre, statistique ou anecdote sans source vérifiable et nommée. Tics IA bannis : « véritable », « incontournable », « emblématique », « rendez-vous incontournable », « cœur de l'événement », « mobilisation exceptionnelle », « témoigne de l'attachement », « tradition ancestrale », « au cœur de ». Si on n'a pas la source, on écrit des faits neutres et observables (qui, où, quoi, quand, combien) plutôt que de la prose éditoriale puffy. Toute édition future doit respecter cette règle ; un audit régulier (`grep -r "véritable\|incontournable\|emblématique"`) permet de détecter les ré-introductions.

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
- Timeline verticale avec photos d'époque (sourcées et datées)
- Les coupures de presse de 1953 en scan haute résolution
- Témoignages **réels** d'anciens bénévoles ou habitants (audio + transcription, accord signé)
- Section « Le saviez-vous ? » avec anecdotes **uniquement si elles sont sourcées** (Le Vieux Clocher, La Fête au Village, archives papier)
- ⚠️ **Pas de fabrication** : ne pas inventer de citations, de noms ou d'anecdotes pour étoffer la narration. Si la source manque, l'anecdote attend la prochaine trouvaille d'archives.

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
