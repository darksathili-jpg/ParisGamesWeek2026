# WATTEAU GAME ON — V7.5 : média et accessibilité

## Objectif et emplacement
Prévisualisation isolée `apercu-v75/index.html`. Ne pas remplacer l'accueil public d'origine sans validation humaine. Le dépôt conserve les quatre MP4 source dans `videos/`.

## Vidéos H.264/AAC vérifiées
Transcodage reproductible via `.github/scripts/v75-encode.sh` avec FFmpeg : H.264, AAC, largeur/hauteur maximales 1280 × 720, 30 ips, `+faststart`. Les quatre séquences optimisées font ensemble **14,59 Mo**, contre **105,83 Mo**, soit **86,2 % de réduction**. Mesures extraites des fichiers effectifs (rapport CSV et JSON dans l'artefact du workflow V7.5).

| Séquence | Orientation | Taille | Durée |
| --- | --- | ---: | ---: |
| Flippers | Verticale · 406 × 720 | 1,33 Mo | 15,20 s |
| Gameplay | Horizontale · 1280 × 720 | 8,03 Mo | 20,13 s |
| Carte graphique | Verticale · 406 × 720 | 1,01 Mo | 13,57 s |
| E-sport | Horizontale · 1280 × 720 | 4,22 Mo | 14,97 s |

Les images d'aperçu `poster-*.jpg` sont extraites à 2 secondes de chaque fichier optimisé. Elles ne sont pas des illustrations inventées.

## Accessibilité implémentée
- Navigation au clavier et lien d'évitement du menu
- Commandes natives `<video controls playsinline preload="none">`
- Pas de lecture automatique, pas de téléchargement préventif des gros MP4
- Quatre descriptions textuelles vérifiées sur image, liées à chaque lecteur par `aria-describedby`
- Information visible sur l'état réel du sous-titrage
- Respect de `prefers-reduced-motion` déjà présent sur la page
- Originaux téléchargeables séparément

## Écart d'accessibilité encore ouvert : sous-titres
Une description des images n'est pas un sous-titrage. Les quatre vidéos contiennent des pistes AAC. Les paroles, musiques et sons importants doivent être identifiés et synchronisés avec la bande sonore pour être réellement accessibles aux personnes sourdes et malentendantes.

Le workflow `v75-asr-candidates.yml` est destiné à générer des **brouillons automatiques non vérifiés**, stockés exclusivement dans un artefact privé de travail. **Ces fichiers ne sont pas publiés comme sous-titres** : les éventuelles hallucinations de reconnaissance vocale ou pertes de sons importants ne doivent pas être présentées comme des transcriptions exactes. Une écoute humaine et une correction des fichiers VTT restent nécessaires avant de les intégrer avec `<track kind="captions" srclang="fr">`.

Voir MDN : https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video

## Validation
Contrôles Chromium V7.5 prévus sur huit formats, intégrité des 4 sources, lecture des vidéos, absence de débordement, galerie photographique, progression et évaluation NSI.

La diffusion des photographies et vidéos d'élèves demeure soumise aux autorisations applicables.
