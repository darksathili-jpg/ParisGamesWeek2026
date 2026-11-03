# WATTEAU GAME ON — Sélection vidéo V7.4

## Méthode et limites

Inventaire de **20 vidéos MP4 originales** (`videos/`, environ 601 Mo cumulés). Une image a été extraite à la **deuxième seconde** de 19 vidéos avec FFmpeg, puis les aperçus ont été regroupés dans `videos-contact.jpg`, archive du workflow GitHub Actions **41675824731**. Le fichier `VID_20261023_151333.mp4` n'a pas fourni d'image à 2 s ; il peut notamment être très court. Aucune conclusion de corruption n'est tirée de cet échec.

La sélection repose sur ces images réelles, l'intérêt pédagogique et la diversité des scènes. **Il ne s'agit pas d'une revue de chaque vidéo dans son intégralité**, ni d'une transcription.

## Les quatre vidéos retenues

| Rubrique | Source | Taille approximative | Image de présentation originale | Raison |
|---|---|---:|---|---|
| 01 · Arcade | `VID_20261023_123933.mp4` | 17,8 Mo | `IMG_20261023_123906.jpg` | Les flippers et leurs éclairages spectaculaires |
| 02 · Gameplay | `VID_20261023_141648.mp4` | 43,4 Mo | `IMG_20261023_120042.jpg` | Un jeu vidéo projeté sur un grand écran |
| 03 · Tech & NSI | `VID_20261023_145141.mp4` | 13,7 Mo | `IMG_20261023_145123.jpg` | Matériel graphique informatique |
| 04 · E-sport | `VID_20261023_150527.mp4` | 30,9 Mo | `IMG_20261023_150540.jpg` | La scène e-sport, les écrans et le public |

**Poids cumulé : environ 105,8 Mo**, contre environ **171,0 Mo** pour la sélection V7.3.

Les affiches de vidéos sont des photographies authentiques du même événement ; ce ne sont **pas des images extraites des vidéos**. Elles représentent des sujets compatibles avec les rubriques, pas nécessairement la même image exacte.

## Principes d'intégration

- `preload="none"`, aucune lecture automatique, `playsinline` pour mobile
- Quatre cartes avec légende descriptive et taille de fichier affichée
- Fichiers MP4 d'origine inchangés
- L'optimisation vidéo ultérieure demanderait des exports MP4 allégés, vérifiés et publiés séparément
- Les vidéos ne disposent pas encore de sous-titres validés : **écart d'accessibilité restant à résoudre**
- Le site reste en prévisualisation ; diffusion publique des images d'élèves conditionnée aux autorisations nécessaires

## Preuve

Les planches d'images sont générées par `.github/scripts/v73-contact-sheet.py`. Rapport de l'exécution : `https://github.com/darksathili-jpg/ParisGamesWeek2026/actions/runs/41675824731`.

La validation technique et visuelle de la page V7.4 est effectuée par `.github/scripts/visual-audit-v74.cjs` via Chromium.
