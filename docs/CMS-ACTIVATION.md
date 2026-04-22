# Activation du CMS Decap

Ce document explique les 5 étapes manuelles pour activer le CMS en ligne (~10 min).

## Architecture en place

- **Interface d'administration** : `https://coespc.org/admin/`
- **CMS** : Decap CMS (ex-Netlify CMS, équivalent WordPress pour sites statiques)
- **Stockage du contenu** : fichiers YAML/Markdown dans le dépôt GitHub (`src/_content/`)
- **Authentification** : OAuth GitHub (chaque bénévole invité se connecte avec son compte GitHub)
- **Workflow** : draft → review → publish (contenu vu avant mise en ligne)
- **Historique** : chaque modification est un commit Git → rollback en 1 clic

## Étape 1 — Créer l'application OAuth GitHub

1. Aller sur https://github.com/settings/applications/new
2. Remplir :
   - **Application name** : `COESPC – Admin Site`
   - **Homepage URL** : `https://coespc.org`
   - **Authorization callback URL** : `https://coespc.org/oauth/callback`
3. Cliquer **Register application**
4. Noter le **Client ID** (visible)
5. Générer un **Client Secret** (bouton « Generate a new client secret ») et le copier

## Étape 2 — Ajouter les secrets à Cloudflare Pages

1. Dashboard Cloudflare → Workers & Pages → `coespc` → Settings → Variables and Secrets
2. Environnement **Production** — ajouter deux secrets (type « Encrypted ») :
   - `OAUTH_GITHUB_CLIENT_ID` = le Client ID de l'étape 1
   - `OAUTH_GITHUB_CLIENT_SECRET` = le Client Secret de l'étape 1
3. Sauvegarder et **redéployer** la production (menu Deployments → Retry deployment)

## Étape 3 — Inviter les bénévoles comme collaborateurs GitHub

Pour que les bénévoles puissent éditer le site sans droits admin complets :

1. GitHub → `colombanatsea/coespc` → Settings → Collaborators → Add people
2. Saisir leur nom d'utilisateur GitHub (ou email d'invitation)
3. Rôle recommandé : **Write** (peut commit mais pas changer les settings du repo)

Note : chaque bénévole doit avoir un compte GitHub gratuit. Création : https://github.com/signup

## Étape 4 — Tester la connexion

1. Aller sur `https://coespc.org/admin/`
2. Cliquer « Login with GitHub »
3. Autoriser l'application
4. L'interface Decap s'ouvre avec les collections : Archives, Partenaires, Programme, etc.

## Étape 5 — Première modification de test

Pour vérifier que tout fonctionne :

1. Dans Decap → **Paramètres du site** → **Informations générales**
2. Modifier un champ (ex. `total_benevoles` de `50+` à `51+`)
3. Cliquer **Publier** (ou **Save** pour brouillon)
4. Aller sur GitHub → vérifier qu'un commit automatique est apparu sur la branche `main`
5. Attendre ~1 min que Cloudflare Pages redéploie
6. Vérifier que le changement est visible sur coespc.org

## Guides utilisateurs pour les bénévoles

Une fois l'admin activée, créer un guide simple pour les bénévoles :

- **Comment modifier un texte** : aller sur `/admin/` → cliquer la collection → cliquer l'entrée → éditer → Publier
- **Comment ajouter une photo à la galerie 2025** : Archives → 2025 → scroller vers « Galerie photos » → « Ajouter » → téléverser image → renseigner légende → Publier
- **Comment créer une nouvelle édition** : Archives → « New Archive » → remplir les champs → Publier

## Collections disponibles

Le CMS gère actuellement :

| Collection | Fichier(s) source | Description |
|---|---|---|
| **Archives** | `src/_content/archives/YYYY.yml` | Une entrée par année avec tombola, partenaires, galerie, solidarité |
| **Pages** | `src/_content/pages/*.md` | Contenu long-form (histoire, association...) |
| **Paramètres du site** | `src/_content/config/site.yml` | Date prochaine édition, chiffres-clés, horaires |
| **Réseaux sociaux** | `src/_content/config/reseaux.yml` | URLs Instagram, Facebook, HelloAsso |
| **Partenaires** | `src/_content/partenaires/*.yml` | Un fichier par partenaire avec nom, catégorie, URL, logo |
| **Programme** | `src/_content/programme/*.yml` | Moments de la journée avec heure + description |
| **FAQ** | `src/_content/faq/*.yml` | Questions fréquentes |

## Prochaines étapes

Pour une intégration complète, il faudra :

1. **Migrer le contenu HTML vers YAML** — script à lancer une fois pour extraire les textes des pages statiques et créer les fichiers correspondants
2. **Adapter les templates** — les pages HTML lisent leur contenu depuis les YAML via JavaScript ou via génération build-time
3. **Ajouter plus de collections** — témoignages, actualités, mini-blog

## Dépannage

### « Login with GitHub » échoue

- Vérifier que `OAUTH_GITHUB_CLIENT_ID` et `OAUTH_GITHUB_CLIENT_SECRET` sont bien définis dans Cloudflare Pages (type « Encrypted »)
- Vérifier que l'URL de callback dans GitHub est **exactement** `https://coespc.org/oauth/callback` (pas de slash final, pas de `www.`)
- Vérifier que le déploiement Cloudflare Pages a bien été retriggé après l'ajout des secrets

### Les modifications ne se reflètent pas sur le site

- Cloudflare Pages prend ~1-2 min pour redéployer après un commit
- Vérifier dans Cloudflare Pages → Deployments que le dernier build est « Success »
- Purger le cache Cloudflare si nécessaire

### Un bénévole ne voit pas l'interface

- Vérifier qu'il a bien été invité comme collaborator sur GitHub
- Vérifier qu'il a accepté l'invitation (email ou https://github.com/notifications)
- Lui demander de se déconnecter/reconnecter sur `/admin/`
