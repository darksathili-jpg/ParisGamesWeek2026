# V4.1 — Recette de fidélité (29 octobre 2026)

## Décision
**NON RECEVABLE EN L'ÉTAT — ne pas fusionner dans main.**

## Contrôles effectués
Inspection statique du fichier `v4-preview.html` sur la branche `design/v4-fidelite-maquette`. Aucun navigateur graphique n'a été exécuté : les résultats visuels et les performances restent **non vérifiés**.

| Critère | Constat | Verdict |
| --- | --- | --- |
| Photo de groupe originale | `IMG_20261023_111417.jpg` utilisée | Conforme au niveau source |
| Préservation des visages | Titre `hero-title` superposé à la photographie | **Bloquant** |
| Maquette choisie | Composition codée, mais pas de comparaison pixel à pixel | **Non vérifié** |
| Images des cinq cartes | Images existantes, pertinence éditoriale non contrôlée | À revoir |
| Barre de progression | Compte les clics mais ne persiste pas après rechargement | À corriger |
| Accessibilité de la visionneuse | Fermeture Échap, flèches ; confinement du focus absent | À corriger |
| Mobile | Media queries présentes, rendu réel non inspecté | **Non vérifié** |
| Vidéos | Préchargement désactivé | Conforme au niveau source |
| Optimisation des photos | Originaux utilisés, sans variantes WebP/responsive | **À corriger** |
| Missions NSI | Lien de l'application non intégré | À compléter |
| Autorisations de diffusion | Non vérifiées | **Prérequis publication** |

## Plan correctif V4.2
1. Recomposer l'accueil pour **ne pas couvrir les élèves** : titre sous ou en dehors de la photo.
2. Produire de vrais assets raster d'interface (sans recréer les élèves) puis les intégrer.
3. Tester une capture 1440 × 900, une capture 390 × 844 et un écran de projection.
4. Mesurer LCP, CLS et poids transféré ; créer des variantes optimisées.
5. Corriger la visionneuse, persister la progression et vérifier la navigation clavier.
6. Faire le tri éditorial à partir d'un contact sheet des 96 photos et d'un visionnage des 20 vidéos.
7. Confirmer l'URL des missions et les autorisations de diffusion avant publication.

## Gate
Pas de merge sur `main` tant que les captures et tests n'ont pas été examinés et que les blocages ne sont pas levés.
