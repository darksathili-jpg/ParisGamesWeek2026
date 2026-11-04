# V7.5 — Contrôle d’accessibilité vidéo (04/11/2026)

**Périmètre** : `apercu-v75/index.html` de ParisGamesWeek2026.  
**Nature du contrôle** : inspection statique du code source sur GitHub ; **pas** un test utilisateur Chromium, une écoute de l’audio ni un audit RGAA complet.  
**Publication** : aucun changement à `main` ni aux médias. Rapport conservé sur la branche d’audit.

## Observations vérifiées dans le code

- Quatre éléments `<video controls playsinline preload="none">` associés à des sources MP4.
- Chaque lecteur possède un `aria-label` et un `aria-describedby` pointant vers une description textuelle visible de la scène.
- Les vidéos disposent d’une image d’affiche (poster) et la page conserve des liens vers les versions originales.
- Un encadré précise sans ambiguïté que transcriptions et sous-titres synchronisés ne sont pas validés.
- Aucun élément `<track kind="captions">` n’apparaît dans les quatre lecteurs. Il serait donc trompeur de déclarer les sous-titres terminés.
- Une règle `prefers-reduced-motion: reduce` désactive transitions et défilement animé.
- La galerie et la boîte de dialogue utilisent plusieurs libellés ARIA ; cela ne constitue pas à lui seul une preuve d’accessibilité clavier.

## Points encore à vérifier

| Vérification | Critère de validation | Statut |
|---|---|---|
| Écoute des 4 pistes audio | Relever exactement les paroles et sons utiles, ou établir leur absence | À faire |
| Fichiers WebVTT | Transcription fidèle, synchronisation contrôlée, langue fr, noms de locuteurs si nécessaires | Bloqué par écoute |
| Lecteur | Affichage/activation/désactivation des sous-titres, commandes clavier, plein écran | À tester |
| Galerie / modale | Parcours Tab/Shift+Tab, Échap, focus rendu à l’élément ouvrant | À tester |
| Zoom et écrans étroits | 200 %/400 %, aucun contenu indispensable masqué | À tester |
| Contraste | Vérifier texte, éléments actifs et indication du focus | À tester |
| Respect du mouvement réduit | Inspection de toutes les animations JavaScript éventuelles | À tester |
| Données personnelles | Autorisation effective de diffusion des élèves / personnes identifiables | Vérification humaine |
| Site réellement servi | Charger `apercu-v75/` sur GitHub Pages et vérifier les chemins des quatre MP4 et posters | Non contrôlé en navigateur ici |

## Procédure de sous-titrage

1. Écouter chaque fichier original sans déduire les paroles des seuls visuels.
2. Noter avec minutage les paroles exactes, la langue et les sons indispensables à la compréhension.
3. Préparer un `.vtt` distinct par vidéo et le faire relire par une personne ayant écouté la bande son.
4. Quand les fichiers sont validés, ajouter dans le bon `<video>` un élément `<track kind="captions" src="./media/xx.vtt" srclang="fr" label="Français">`.
5. Vérifier en Chromium et Firefox l’affichage et la synchronisation avec sous-titres activés. Si une vidéo ne porte pas de contenu audio significatif, documenter ce constat plutôt que fabriquer des dialogues.
6. Conserver l’encadré d’avertissement jusqu’à la clôture de la validation.

## Décision

**EN VÉRIFICATION** — Les descriptions visuelles et la structure des quatre lecteurs sont présentes, mais aucune conformité complète n’est proclamée. **Ne pas fusionner** ni remplacer l’accueil principal avant vérification de l’audio, du clavier, des conditions de diffusion et de la version servie.
