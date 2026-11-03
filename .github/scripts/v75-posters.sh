#!/usr/bin/env bash
set -euo pipefail
for label in 01-arcade 02-gameplay 03-technologie 04-esport; do
  input="apercu-v75/media/${label}.mp4"
  output="apercu-v75/media/poster-${label}.jpg"
  test -s "$input"
  ffmpeg -hide_banner -nostdin -loglevel error -ss 2 -i "$input" -frames:v 1 -q:v 3 -y "$output"
  test -s "$output"
done
