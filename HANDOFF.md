# HANDOFF — Spécification Technique & Fonctionnelle
## Fête Villageoise d'Annecy-le-Vieux — coespc.org

---

## 1. Contexte

Le CŒSPC (Comité des Œuvres Sociales Paroissiales et Communales) organise la Fête Villageoise d'Annecy-le-Vieux depuis 1950 (76 ans). L'événement annuel rassemble la communauté autour de jeux, restauration, tombola et animations, en lien avec la course l'Ancilevienne. Les bénéfices sont reversés aux œuvres sociales de la paroisse (2/3) et au CCAS de la ville d'Annecy (1/3).

**Site actuel** : WordPress 6.0.11 sur OVH, non maintenu techniquement, contenu riche mais désorganisé (2011→2025).

**Objectif** : site statique moderne, rapide, accessible, archivant TOUTE l'histoire de la fête.

---

## 2. Stack technique

| Composant | Choix | Justification |
|---|---|---|
| Hébergement | Cloudflare Pages | Gratuit, CDN mondial, HTTPS auto, preview branches |
| Repo | GitHub | Versioning, collaboration, CI/CD natif |
| Build | HTML/CSS/JS statique | Pas de dépendance, maintenable par non-dev |
| CSS | Custom (design system) | Léger, pas de framework |
| Domaine | coespc.org | Nouveau domaine, bascule DNS vers Cloudflare Pages en attente |
| Formulaires | HelloAsso (tombola, adhésion) | Déjà utilisé par le CŒSPC |
| Réseaux sociaux | Embed Facebook + lien Instagram | Intégration native |
| Analytics | Cloudflare Web Analytics | Gratuit, RGPD-friendly, pas de cookie |

---

## 3. Architecture du site

### 3.1 Arborescence des pages

```
/ (Accueil)
├── /histoire              Notre histoire (1950 → aujourd'hui)
├── /association            Le CŒSPC — qui sommes-nous
├── /edition-2026           Programme de la 74ᵉ édition
│   └── → Renvois vers coespc.org (tombola, repas, adhésions)
├── /partenaires            Nos partenaires (avec logos)
├── /benevoles              Devenir bénévole (formulaire/contact)
├── /archives               Toutes les éditions + galerie photos intégrée
│   ├── /archives/2025      (résumé, tombola, photos, partenaires)
│   ├── /archives/2024
│   ├── ...
│   └── /archives/2011
├── /presse                 Dossier de presse (PDF téléchargeable)
└── /contact                Contact + mentions légales
```

> **Note** : La galerie photos/vidéos n'a pas de page dédiée. Les photos sont intégrées directement dans chaque page d'archive annuelle, ce qui simplifie la navigation et donne du contexte aux images.

> **Note** : `coespc.org` est à la fois le nouveau domaine du site vitrine et le nom utilisé pour référer au portail HelloAsso du CŒSPC. Tous les liens transactionnels (tombola en ligne, réservation tartiflette, adhésion/don) pointent vers `https://www.helloasso.com/associations/comite-des-oeuvres-sociales-paroissiales-et-commun`. `fetevillageoise.com` est l'ancien WordPress en cours de désactivation (redirections 301 pour préserver les URLs indexées).

### 3.2 Navigation

**Header** : Logo CŒSPC + nav principale (Accueil | Histoire | Édition 2026 | Partenaires | Archives | Contact) + **bouton CTA « Tombola & Billetterie → coespc.org »**
**Footer** : Logos partenaires institutionnels (Mairie, Paroisse, AVOC, Ancilevienne) + réseaux sociaux + mentions légales + lien coespc.org

### 3.3 Pages spéciales

**Page d'accueil** :
- Hero : affiche 2026 (quand disponible) ou photo emblématique + date + « 74ᵉ édition »
- Bloc « Depuis 1950 » : chiffre clé (76 ans, 74 éditions, 50+ bénévoles)
- Bloc « Prochaine édition » : date, lieu, CTA programme
- Bloc « Partenaires » : carrousel logos
- Bloc « Réseaux sociaux » : embed Facebook + liens
- Bloc « Solidarité » : explication du reversement CCAS/paroisse

**Page Archives (index)** :
- Timeline visuelle verticale (année, affiche miniature, titre/thème, lien)
- Chaque année cliquable vers sa page dédiée
- De 2025 (haut) à 2011 (bas), avec section « Avant 2011 » pour les coupures de presse

**Page Archive (par année)** :
- Affiche de l'année
- Résumé de l'édition
- Résultats tombola complets
- Galerie photos
- Liste partenaires de l'année
- Résultats concours de tir (quand disponible)
- Liens vers articles originaux (si conservés)

---

## 4. Redirections (anciennes URLs → nouvelles)

Fichier `_redirects` (format Cloudflare Pages) :

```
# Pages principales
/dimanche-14-septembre-2025-73eme-edition-de-la-fete-villageoise.html /archives/2025 301
/resultats-de-la-tombola-de-la-fete-villageoise-2025.html /archives/2025 301
/fete-villageoise-2024.html /archives/2024 301
/fete-villageoise-2023.html /archives/2023 301
/fete-villageoise-2022.html /archives/2022 301
/fete-villageoise-2019.html /archives/2019 301
/fete-villageoise-2019-2.html /archives/2019 301
/un-bilan-mitige.html /archives/2019 301
/solidarite.html /archives/2019 301
/2018-entre-danses-et-chants-mon-coeur-balance.html /archives/2018 301
/1772.html /archives/2018 301
/la-fete-en-2018.html /archives/2018 301
/un-geste-de-solidarite.html /archives/2018 301
/un-bon-cru-savoyard.html /archives/2017 301
/resultats-de-la-tombola-2017.html /archives/2017 301
/soleil-soleil.html /archives/2016 301
/la-fete-au-chef-lieu-dannecy-le-vieux.html /archives/2016 301
/un-voyage-de-reve.html /archives/2016 301
/la-fete-cest-aussi-la-solidarite.html /archives/2016 301
/tout-un-programme.html /archives/2016 301
/une-association-en-assemblee.html /archives/2016 301
/saga-africa.html /archives/2015 301
/fete-villageoise-2015-lafrique-sinvite.html /archives/2015 301
/fete-villageoise-2015.html /archives/2015 301
/1445.html /archives/2015 301
/fete-villageoise-2014-du-soleil-bresilien.html /archives/2014 301
/fete-villageoise-2014.html /archives/2014 301
/fete-villageoise-2014-dimanche-14-septembre.html /archives/2014 301
/entre-les-averses.html /archives/2013 301
/fete-villageoise-2013-2.html /archives/2013 301
/fete-villageoise-2013.html /archives/2013 301
/sous-le-soleil.html /archives/2012 301
/fete-villageoise-2012-2.html /archives/2012 301
/dimanche-9-septembre-2012-cest-la-fete.html /archives/2012 301
/9-septembre-2012-prenez-date.html /archives/2012 301
/fete-villageoise-2012.html /archives/2012 301
/12-decembre-2011-remise-cheque-en-mairie.html /archives/2011 301
/actualites.html /archives/2011 301
/animations-2011.html /archives/2011 301
/ils-nous-aident-reservez-leur-vos-achats.html /partenaires 301

# Pages structurelles
/programme-de-la-fete /edition-2026 301
/tombola /edition-2026/tombola 301
/category/* /archives 301
/tag/* /archives 301
/photo-videotheque/* /galerie 301

# Archives par année
/2025/* /archives/2025 301
/2024/* /archives/2024 301
/2023/* /archives/2023 301
/2022/* /archives/2022 301
/2019/* /archives/2019 301
/2018/* /archives/2018 301
/2017/* /archives/2017 301
/2016/* /archives/2016 301
/2015/* /archives/2015 301
/2014/* /archives/2014 301
/2013/* /archives/2013 301
/2012/* /archives/2012 301
/2011/* /archives/2011 301

# WordPress artefacts
/wp-login.php / 301
/wp-admin/* / 301
/feed/* / 301
/xmlrpc.php / 301
```

---

## 5. Exigences non fonctionnelles

### Performance
- Lighthouse score > 90 sur les 4 métriques
- Poids total page d'accueil < 500 Ko (hors images lazy-loaded)
- Toutes les images en WebP/AVIF avec fallback
- Lazy loading pour images sous le fold

### Accessibilité (WCAG 2.1 AA)
- Contraste minimum 4.5:1 (corps de texte)
- Navigation clavier complète
- Taille de police minimum 16px pour le corps
- Boutons minimum 44x44px de zone cliquable
- Structure sémantique HTML5 (header, nav, main, article, aside, footer)
- Skip link vers le contenu principal
- Alt text sur toutes les images

### SEO
- Balises meta (title, description) uniques par page
- Schema.org Event pour l'édition 2026
- Schema.org Organization pour le CŒSPC
- Open Graph / Twitter Cards pour le partage social
- Sitemap.xml
- robots.txt

### Sécurité
- HTTPS (auto via Cloudflare)
- Headers de sécurité (CSP, X-Frame-Options, etc.)
- Pas de JavaScript tiers non contrôlé
- Pas de cookies (analytics Cloudflare = cookieless)

### RGPD
- Pas de cookie tiers → pas de bandeau cookies nécessaire
- Mentions légales avec identité du CŒSPC
- Contact : voir `src/contact.html` (mail CŒSPC + formulaire)

---

## 6. Médias à migrer depuis WordPress

### Priorité 1 — Essentiels (à télécharger et optimiser)
- Logo CŒSPC : `wp-content/uploads/2025/08/Comite_des_OEuvres_..._Logo.png`
- Affiches : une par année (2011→2025)
- Bannière du site : `wp-content/uploads/2011/07/cropped-Bandeau-ecran-accueil1.jpg`
- Photos des remises de chèques (solidarité)

### Priorité 2 — Archives enrichies
- Photos d'événement (sélection des meilleures par année)
- PDFs résultats tombola
- Vidéo 2018 (22 Mo — héberger sur YouTube puis embed)
- PV d'AG (2005→2016)

### Priorité 3 — Historique
- Coupures de presse 1950s (à numériser — Colomban les a récupérées)
- Affiches historiques (2000→2010 dans wp-content/uploads/2011/06/)
- Photo historique du village : `Annecy-le-Vx-1920-R`

---

## 7. Intégrations externes

| Service | Usage | Méthode |
|---|---|---|
| HelloAsso | Tombola en ligne, dons, adhésions | Lien externe + bouton CTA |
| Facebook | Page/groupe CŒSPC | Embed plugin Facebook |
| Instagram | Futur compte | Lien icône (pas d'embed pour l'instant) |
| YouTube | Vidéo 2018 (à uploader) | Embed iframe |
| SwissTransfer | Dossier de presse | Lien externe (temporaire) |

---

## 8. Workflow de mise à jour annuel

Chaque année, le responsable site (Colomban) doit :
1. Créer la page `/archives/{année}` avec le contenu de l'édition
2. Mettre à jour `/edition-{année+1}` avec le nouveau programme
3. Mettre à jour `/partenaires` avec la nouvelle liste
4. Mettre à jour `/tombola` avec les nouveaux lots
5. Ajouter l'affiche de l'année dans `/assets/archives/`
6. Commit + push → déploiement automatique via Cloudflare Pages

---

## 9. Timeline projet

| Phase | Contenu | Statut |
|---|---|---|
| 1. Collecte | Données, archives, scan site | ✅ Terminé |
| 2. Spécification | CLAUDE.md, HANDOFF.md, architecture | ✅ Terminé |
| 3. Contenu | Rédaction de toutes les pages | ✅ Terminé |
| 4. Design | Direction créative Kermesse Éternelle → CSS | ✅ Terminé |
| 5. Développement | HTML/CSS/JS, CMS Decap, Workers Cloudflare | ✅ Terminé |
| 6. Migration | GitHub, Cloudflare Pages, redirections WP | ✅ Terminé (hors DNS) |
| 7. Qualité | Accents, entités OG/Twitter, Schema.org, llms.txt | ✅ Terminé (04-2026) |
| 8. Lancement | Bascule DNS coespc.org → Cloudflare Pages | 🔜 En attente |
| 9. SEO | Search Console, soumission sitemap, indexation | 🔜 Après bascule |

---

## 10. Conventions de qualité SEO / preview

- **URLs canoniques** : toujours `https://coespc.org/...` (pas de `fetevillageoise.com`).
- **Meta OG / Twitter / title / alt** : Unicode brut (é, œ, Œ, à, ê…), **pas** d'entités HTML (`&OElig;`, `&eacute;`), **pas** de superscripts Unicode (`74ᵉ` se rend mal dans les cartes de partage).
- **Numérotation ordinale** dans le corps HTML : `74<sup>e</sup> édition`. Dans les meta/OG/title : `74e édition` (plat).
- **Schema.org** (index.html) : un seul `sameAs` consolidé, `Organization` + `Event` + `FAQPage` valides.
- **`src/llms.txt`** : index pour crawlers LLM (format llmstxt.org), mis à jour quand on ajoute une page.
- **`sitemap.xml`** + **`robots.txt`** : domaine aligné sur `coespc.org`, sitemap référencé dans robots.txt.
- **`_headers`** : HTML cache court (5 min), assets figés (affiches) cache immutable 1 an.
