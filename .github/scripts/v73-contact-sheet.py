from PIL import Image, ImageOps, ImageDraw, ImageFont
from pathlib import Path
import json, math

photos=sorted(Path('photos').glob('*.jpg'))
out=Path('visual-proof-v73/media');out.mkdir(parents=True,exist_ok=True)
try:font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',15)
except:font=ImageFont.load_default()
meta=[]
TW,TH=315,232
for num in range(math.ceil(len(photos)/24)):
  sheet=Image.new('RGB',(4*TW,6*TH),(9,17,35)); d=ImageDraw.Draw(sheet)
  subset=photos[num*24:(num+1)*24]
  for index,p in enumerate(subset):
    x=index%4*TW;y=index//4*TH
    try:
      with Image.open(p) as im:
        im=ImageOps.exif_transpose(im)
        w,h=im.size
        thumb=ImageOps.fit(im.convert('RGB'),(TW-10,TH-42),method=Image.Resampling.LANCZOS,centering=(.5,.46))
        sheet.paste(thumb,(x+5,y+4))
      d.text((x+6,y+TH-34),f'{num*24+index+1:02d} · {p.stem.replace("IMG_20261023_","")}',fill=(223,242,250),font=font)
      meta.append({'name':p.name,'number':num*24+index+1,'width':w,'height':h,'ratio':round(w/h,3)})
    except Exception as e:
      d.text((x+6,y+30),'ERROR '+str(e)[:28],font=font,fill=(255,100,100))
  sheet.save(out/f'photos-contact-{num+1:02d}.jpg',quality=90,subsampling=0)
(out/'media-index.json').write_text(json.dumps(meta,indent=2),encoding='utf-8')
print('Processed',len(meta),'photos across',math.ceil(len(photos)/24),'sheets')
