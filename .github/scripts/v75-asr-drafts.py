from pathlib import Path
import json, math
from faster_whisper import WhisperModel

ids = ["123933","141648","145141","150527"]
labels = ["01-arcade","02-gameplay","03-technologie","04-esport"]
out=Path("visual-proof-v75/caption-drafts")
out.mkdir(parents=True,exist_ok=True)
model=WhisperModel("base",device="cpu",compute_type="int8")
report=[]
def mark(t):
    t=max(0.,float(t))
    hr=int(t//3600);mn=int((t%3600)//60);sec=t%60
    return f"{hr:02}:{mn:02}:{sec:06.3f}"
for ident,label in zip(ids,labels):
    video=Path("videos")/f"VID_20261023_{ident}.mp4"
    segments,info=model.transcribe(str(video),beam_size=3,vad_filter=True,condition_on_previous_text=False,word_timestamps=False)
    lines=["WEBVTT","",f"NOTE BROUILLON AUTOMATIQUE NON VERIFIE - NE PAS PUBLIER",""]
    data=[]
    for seg in segments:
        item={'start':round(seg.start,3),'end':round(seg.end,3),'text':seg.text.strip(),'avg_logprob':round(seg.avg_logprob,3),'no_speech_prob':round(seg.no_speech_prob,3)}
        data.append(item)
        if not item['text'] or item['end']<=item['start']:continue
        lines += [f"{mark(seg.start)} --> {mark(seg.end)}",item['text'],""]
    (out/f'{label}.vtt').write_text("\n".join(lines),encoding="utf-8")
    (out/f'{label}.json').write_text(json.dumps({'video':str(video),'language':info.language,'language_probability':info.language_probability,'segments':data},indent=2,ensure_ascii=False),encoding="utf-8")
    report.append({'video':str(video),'label':label,'detected_language':info.language,'segments':len(data),'requires_manual_audio_review':True})
(out/'SUMMARY.json').write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding="utf-8")
print(json.dumps(report,ensure_ascii=False,indent=2))
