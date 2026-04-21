# Galerie photos — mode d'emploi

## Où déposer les photos

Un dossier par édition, ex. `2025/`, `2024/`, etc.

Le site lit automatiquement le manifest `galerie.json` présent dans chaque dossier année.

## Format recommandé

- **Type** : JPG ou WebP
- **Largeur max** : 1920 px
- **Poids** : < 500 Ko par photo (compression web)
- **Orientation** : paysage privilégié (portrait fonctionne aussi)
- **Nommage** : `NN-slug-court.jpg` (ex. `01-ouverture.jpg`, `02-tartiflette.jpg`, `03-concert.jpg`)

## Comment ajouter une photo

1. Déposer le fichier dans le dossier de l'année (ex. `src/assets/images/galerie/2025/`)
2. Éditer le fichier `galerie.json` correspondant et ajouter une entrée :

```json
[
  { "file": "01-ouverture.jpg",   "alt": "Ouverture des stands place Gabriel-Fauré" },
  { "file": "02-tartiflette.jpg", "alt": "La tartiflette géante — 300 parts servies" },
  { "file": "03-concert.jpg",     "alt": "Concert en plein air à 15 h" }
]
```

3. Commit + push (ou via CMS d'admin une fois branché).

## Volume conseillé

10-20 photos par édition suffisent largement. Au-delà, la galerie devient trop longue à parcourir.
