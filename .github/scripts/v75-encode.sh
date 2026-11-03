#!/usr/bin/env bash
set -euo pipefail
mkdir -p apercu-v75/media visual-proof-v75
if ! command -v ffmpeg >/dev/null || ! command -v ffprobe >/dev/null; then
  echo "FFmpeg and ffprobe are required" >&2
  exit 2
fi
sources=(
  "123933:01-arcade"
  "141648:02-gameplay"
  "145141:03-technologie"
  "150527:04-esport"
)
printf 'label,source,optimized,source_bytes,optimized_bytes,ratio_percent,duration_seconds,dimensions,audio_streams\n' > visual-proof-v75/compression.csv
for item in "${sources[@]}"; do
  ident="${item%%:*}"
  label="${item##*:}"
  input="videos/VID_20261023_${ident}.mp4"
  target="apercu-v75/media/${label}.mp4"
  test -s "$input"
  ffmpeg -hide_banner -nostdin -loglevel error -y -i "$input" \
    -map 0:v:0 -map '0:a:0?' \
    -vf "scale=1280:720:force_original_aspect_ratio=decrease:force_divisible_by=2" \
    -c:v libx264 -preset fast -crf 28 -pix_fmt yuv420p -r 30 \
    -c:a aac -b:a 96k -ac 2 -movflags +faststart "$target"
  ffmpeg -hide_banner -nostdin -loglevel error -y -ss 2 -i "$target" -frames:v 1 -q:v 3 "visual-proof-v75/${label}.jpg" || true
  source_bytes=$(stat -c '%s' "$input")
  output_bytes=$(stat -c '%s' "$target")
  duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$target")
  dims=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$target")
  audio=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$target" | wc -l)
  ratio=$((100*output_bytes/source_bytes))
  printf '%s,%s,%s,%s,%s,%s,%s,%s,%s\n' "$label" "$input" "$target" "$source_bytes" "$output_bytes" "$ratio" "$duration" "$dims" "$audio" >> visual-proof-v75/compression.csv
  test "$output_bytes" -lt "$source_bytes" || { echo "Output is not smaller: $target" >&2; exit 3; }
  test "$output_bytes" -gt 100000 || { echo "Output too small: $target" >&2; exit 4; }
done
python3 - <<'PY'
import csv,json,pathlib
f=pathlib.Path('visual-proof-v75/compression.csv')
a=list(csv.DictReader(f.open()))
original=sum(int(x['source_bytes']) for x in a)
compressed=sum(int(x['optimized_bytes']) for x in a)
summary={'clips':a,'original_bytes':original,'optimized_bytes':compressed,'reduction_percent':round((1-compressed/original)*100,1),'quality_note':'CRF 28, H.264/AAC, at most 1280x720, 30 fps; visual inspection still required.'}
pathlib.Path('visual-proof-v75/report.json').write_text(json.dumps(summary,indent=2),encoding='utf-8')
print(json.dumps({'original_MB':round(original/1e6,1),'optimized_MB':round(compressed/1e6,1),'reduction_pct':summary['reduction_percent']},indent=2))
PY
