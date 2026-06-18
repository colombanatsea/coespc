# Connecteur Instagram maison — Activation

Le site affiche les dernières publications de **@fete_villageoise** via notre
propre Function Cloudflare (`functions/api/instagram-feed.js`), sans script
tiers (fini Elfsight et les pages blanches). Tout le code est en place. Il
reste une configuration **à faire une seule fois** côté Meta + Cloudflare,
détaillée ci-dessous (~10 à 15 min).

Voie utilisée : **Instagram API with Instagram Login** (la Basic Display API a
été coupée en septembre 2025). Le compte expose ses **propres** médias via un
jeton longue durée (60 jours), que la Function renouvelle automatiquement.

---

## Étape 1 — Compte professionnel

Dans l'app Instagram de @fete_villageoise : Paramètres → Type de compte →
passer en **compte professionnel** (Business ou Créateur). Gratuit, réversible.

## Étape 2 — App Meta

1. Aller sur https://developers.facebook.com → Mes apps → **Créer une app**.
2. Type : **Business**. Donner un nom (ex. « COESPC Site »).
3. Dans l'app, ajouter le produit **Instagram** → **Instagram API setup with
   Instagram business login** (ou « Configuration de l'API avec connexion
   Instagram »).
4. Dans **Génération de jetons**, connecter le compte @fete_villageoise et
   **générer un jeton d'accès**. Copier ce jeton.

> Ce jeton est déjà un **jeton longue durée (60 jours)**. Pas besoin de
> validation publique de l'app : il appartient à l'admin (toi).

## Étape 3 — Namespace KV Cloudflare

Tableau de bord Cloudflare → **Workers & Pages** → **KV** → **Create namespace**.
Nom suggéré : `coespc-instagram`.

Y déposer le jeton : ouvrir le namespace → **Add entry** :
- Clé : `token`
- Valeur : *(coller le jeton de l'étape 2)*

(Inutile de créer `token_ts` : la Function l'écrit toute seule au 1er appel.)

## Étape 4 — Binding sur le projet Pages

Tableau de bord → **Workers & Pages** → projet **coespc** (fete-villageoise) →
**Settings** → **Functions** → **KV namespace bindings** → **Add binding** :
- Variable name : `IG`
- KV namespace : `coespc-instagram`

Pour les deux environnements (Production + Preview). Puis **redéployer** (un
push suffit, ou « Retry deployment »).

## Étape 5 — Vérifier

Ouvrir `https://coespc.org/api/instagram-feed` : tu dois voir un JSON
`{"items":[ ... ]}` avec tes posts. Sur la page d'accueil, la section
« Les coulisses de la fête » affiche la grille.

En cas de souci, le JSON renvoie un champ `error` :
- `kv-absent` : le binding `IG` n'est pas posé (étape 4).
- `token-absent` : la clé `token` manque dans le KV (étape 3).
- `api-190` / `api-400` : jeton invalide ou expiré, en regénérer un (étape 2).

---

## Fonctionnement et entretien

- **Cache** : 30 min en edge (constante `CACHE_TTL_SECONDS`). Bump
  `CACHE_VERSION` dans la Function pour purger le cache edge si besoin.
- **Renouvellement du jeton** : automatique. La Function rafraîchit le jeton
  après 45 jours (`REFRESH_AFTER_MS`) et réécrit `token` + `token_ts` dans le
  KV. Tant que le site reçoit du trafic au moins une fois tous les ~60 jours
  (toujours le cas), le flux ne tombe jamais. Aucun cron à maintenir.
- **Si le flux reste vide > 60 jours sans visite** (improbable) : le jeton
  expire, il suffit de regénérer un jeton (étape 2) et de le redéposer dans le
  KV (étape 3).
- **Vidéos / reels** : affichés via leur miniature (`thumbnail_url`).
- **Maintenance** : comme tout connecteur d'API Meta, une mise à jour
  occasionnelle peut être nécessaire si Meta change de version (même logique
  que le parser RSS partenaires).

## Affichage

- Front : `initInstagramFeed()` dans `src/js/main.js` consomme
  `/api/instagram-feed` et rend une grille `.insta-grid` (lightbox via lien
  vers le post). Styles dans `src/css/style.css` (section « FLUX INSTAGRAM »).
- Tant que le jeton n'est pas déposé, la section affiche une invite discrète
  + le bouton « Suivre @fete_villageoise », jamais de bloc blanc cassé.
