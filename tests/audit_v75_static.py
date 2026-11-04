#!/usr/bin/env python3
"""Audit structurel V7.5 : vérifications reproductibles sans dépendance externe.

Exécuter à la racine : python tests/audit_v75_static.py
Ne remplace pas une écoute audio, un test clavier Chromium ou un audit RGAA.
"""
from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "apercu-v75" / "index.html"

class Inspector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.videos = []
        self.descriptions = set()
        self.ids = set()
        self.tracks = []
        self.sources = []
        self.current_video = None
        self.dialogs = []
        self.filter_buttons = []
        self.raw_media = []
    def handle_starttag(self, tag, attributes):
        d = dict(attributes)
        if d.get("id"): self.ids.add(d["id"])
        if tag == "video":
            self.current_video = d
            self.videos.append(d)
        elif tag == "source" and self.current_video is not None:
            self.sources.append(d)
        elif tag == "track":
            self.tracks.append(d)
        elif tag == "dialog":
            self.dialogs.append(d)
        elif tag == "button" and "data-filter" in d:
            self.filter_buttons.append(d)
        elif tag == "a" and "original-video" in d.get("class", ""):
            self.raw_media.append(d.get("href", ""))

def main():
    failures = []
    def check(label, condition):
        print(("OK  " if condition else "FAIL") + " " + label)
        if not condition: failures.append(label)
    html = PAGE.read_text(encoding="utf-8")
    parser = Inspector()
    parser.feed(html)
    check("Quatre lecteurs vidéo", len(parser.videos) == 4)
    check("Contrôles natifs + lecture sur demande",
          len(parser.videos) == 4 and all("controls" in v and v.get("preload") == "none" for v in parser.videos))
    check("Descriptions aria-describedby existantes",
          len(parser.videos) == 4 and all(
              v.get("aria-describedby") in parser.ids for v in parser.videos))
    check("Étiquettes explicites",
          len(parser.videos) == 4 and all(v.get("aria-label") for v in parser.videos))
    check("Quatre sources MP4",
          len(parser.sources) == 4 and all(
              s.get("type") == "video/mp4" and s.get("src", "").endswith(".mp4") for s in parser.sources))
    check("Quatre liens vers les originaux",len(parser.raw_media)==4)
    check("Modale sémantique", len(parser.dialogs) == 1)
    check("Boutons filtres avec état accessible",
          len(parser.filter_buttons) >= 2 and all("aria-pressed" in b for b in parser.filter_buttons))
    check("Respect des préférences mouvement réduit", "prefers-reduced-motion:reduce" in html)
    check("Mention transparente du statut des sous-titres",
          "sous-titres synchronisés" in html and "pas encore validés" in html)
    # Une piste non vérifiée ne doit pas être publiée : test de prudence, non de conformité.
    check("Aucune piste WebVTT présentée comme validée", not parser.tracks)
    for i, source in enumerate(parser.sources, 1):
        relative = source["src"]
        resolved = (PAGE.parent / relative).resolve()
        check(f"MP4 local {i} disponible ({relative})",
              resolved.is_relative_to(ROOT) and resolved.is_file())
    print("\nBILAN : " + ("ÉCHEC ("+str(len(failures))+")" if failures else "AUDIT STATIQUE OK"))
    print("Contrôles hors portée : audio, synchronisation WebVTT, navigation clavier, consentements.")
    return int(bool(failures))

if __name__ == "__main__":
    sys.exit(main())
