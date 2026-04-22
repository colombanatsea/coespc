# Portraits partenaires (marquee page Partenaires)

Portraits carrés des partenaires tenant l'affiche de la Fête Villageoise. Affichés dans un marquee défilant sur `/partenaires.html`.

## Fichiers attendus

| Fichier | Partenaire | Image source |
|---|---|---|
| `01-le-binome.jpg` | Le Binôme | Couple devant l'enseigne du restaurant |
| `02-avoc-place.jpg` | Place du chef-lieu | 2 hommes place, jour de la fête (avec affiche) |
| `03-bora-bora.jpg` | Bora Bora | Homme en t-shirt blanc, fresque restaurant |
| `04-caviste.jpg` | Caviste | Homme en tablier marron devant cellier |
| `05-bistrot-green.jpg` | Bistrot Green | Femme devant l'enseigne du restaurant |

## Format uniforme recommandé

- **Orientation** : **CARRÉ 1:1** (recadré à 1200×1200 px min)
  - Le CSS applique `object-fit: cover` : un portrait vertical sera recadré au centre, mais perd des détails. Le carré est idéal.
- **Type** : JPG
- **Poids** : < 400 Ko
- **Cadrage** : le sujet (partenaire + affiche) doit tenir dans les 2/3 centraux

## Comment ajouter / remplacer un portrait

1. Dépose le fichier dans ce dossier avec le nom exact ci-dessus
2. `git commit + push`
3. Le site rafraîchit le marquee en <5 min

Pour changer le nom ou le rôle affiché sous la photo, éditer `src/partenaires.html` (bloc `<section class="partners-portraits-section">`) ou via le CMS (futur : collection dédiée).
