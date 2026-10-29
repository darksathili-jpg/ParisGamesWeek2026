# V4.4 — Direction artistique ++ (29 octobre 2026)

## Constat
La V4.3 a rapproché la structure de la maquette, mais reste insuffisante en direction artistique : éléments trop génériques, faible hiérarchie, photographie encore peu intégrée à l'univers visuel, cartes trop ordinaires.

## Références techniques vérifiées
- MDN CSS Masking : https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Masking/Introduction
- GSAP ScrollTrigger : https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- web.dev performance des images : https://web.dev/learn/images/performance-issues

## Contrat de réalisation
1. Conserver l'original IMG_20261023_111417.jpg, ne jamais régénérer ou modifier les visages.
2. Composition 16:9 d'abord : photo de groupe centrale, panneaux latéraux, cinq cartes de niveau visibles, navigation haute.
3. Éléments graphiques en ressources raster transparentes (WebP/PNG) : couronne PGW, brosses et éclats cyan/magenta, coins HUD, ornements des cartes. Ne pas utiliser la maquette générée comme fond aplati.
4. Typographie : maximum deux familles ; titres condensés et massifs ; texte secondaire lisible en projection.
5. Palette maîtrisée : bleu nuit dominant, cyan fonctionnel, magenta d'accent ; orange/vert réservés aux niveaux.
6. Chaque carte possède une image véritable issue du dépôt, vérifiée visuellement ; pas de sélection uniquement chronologique.
7. Animations : une seule séquence d'entrée courte, micro-interactions au survol, aucun mouvement permanent obligatoire, reduced-motion respecté.
8. Performance : photo héros prioritaire ; autres images responsives et chargées à la demande ; vidéos preload=none.
9. Recette visuelle sur Chromium 1440x900, 390x844, 1280x720 ; capture et comparaison côte à côte avec la maquette.
10. Ne pas publier dans la page d'accueil principale avant recette et autorisations de diffusion.

## Critères de refus
- Un seul visage occulté par un titre ou un panneau.
- Un écran 1440x900 où les cinq cartes sont hors du premier écran alors qu'elles figurent dans la maquette.
- Logo ou photos réinventés.
- Cartes sans vraies destinations ou faux chiffres.
- Captures de navigateur absentes.
- Résultat présenté comme « fidèle » sans comparaison.

## Ordre d'exécution
A. Produire et valider la bibliothèque d'assets raster.
B. Composer le héros et les panneaux.
C. Composer les cinq cartes.
D. Intégrer transitions.
E. Recette comparative et performance.
