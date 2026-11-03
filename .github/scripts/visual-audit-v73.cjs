const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async()=>{
 fs.mkdirSync('visual-proof-v7/v73',{recursive:true});
 const browser=await chromium.launch({headless:true});
 const report=[];
 for(const [name,width,height] of [['reference',1536,1024],['user-desktop',1207,846],['projector',1280,720],['compact-desktop',1024,768],['tablet',768,1024],['user-mobile',575,896],['mobile',390,844],['small-mobile',320,700]]){
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto('http://127.0.0.1:8788/apercu-v73/',{waitUntil:'domcontentloaded',timeout:30000});
   await page.locator('.hero-photo').waitFor({state:'visible'});
   await page.evaluate(async()=>{const imgs=Array.from(document.querySelectorAll('img'));for(const i of imgs)i.loading='eager';await Promise.all(imgs.map(i=>i.decode().catch(()=>null)))});
   await page.screenshot({path:'visual-proof-v7/v73/'+name+'.png',fullPage:name==='mobile'});
   const metrics=await page.evaluate(()=>{
      const r=(x)=>{const el=document.querySelector(x);if(!el)return null;const b=el.getBoundingClientRect();return {x:Math.round(b.x),y:Math.round(b.y),width:Math.round(b.width),height:Math.round(b.height),right:Math.round(b.right),bottom:Math.round(b.bottom)}};
      return {title:r('.title-lockup'),hero:r('.hero-photo'),cards:r('.levels'),nav:r('.site-nav'),cardCount:document.querySelectorAll('.level').length,brokenImmediate:Array.from(document.querySelectorAll('img[src]')).filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src')),overflow:document.documentElement.scrollWidth>innerWidth+3,viewport:{w:innerWidth,h:innerHeight}};
   });
   const cards=metrics.cards;
   const clipped=width>900 && (!cards || cards.bottom>height+2 || cards.x<0 || cards.right>width+2);
   const mobileGate=width<=900 && (!cards || cards.y>height+80 || metrics.title.y<0 || metrics.hero.bottom>height);
   const brokenCardImages=metrics.brokenImmediate;
   const cardCountFail=metrics.cardCount!==5;
   const result={name,width,height,http:response.status(),...metrics,clippedCards:clipped,mobileFirstCardsTooLow:mobileGate,cardCountFail,pageErrors:errors};
   report.push(result);console.log(JSON.stringify(result));
   await page.close();
 }

 const page2=await browser.newPage({viewport:{width:1440,height:900}});
 await page2.goto('http://127.0.0.1:8788/apercu-v73/');
 const checks={};
 checks.gallery26=(await page2.locator('#gallery button').count())===26;
 await page2.locator('[data-filter="tech"]').click();
 checks.filterTech=(await page2.locator('#gallery button').count())===5;
 await page2.locator('#gallery button').first().click();
 checks.dialog=await page2.locator('#viewer').evaluate(el=>el.open);
 await page2.locator('#next-photo').click();
 checks.nextPhoto=(await page2.locator('#photo-title').textContent()).startsWith('2 /');
 await page2.locator('#close-viewer').click();
 checks.closeDialog=await page2.locator('#viewer').evaluate(el=>!el.open);
 await page2.locator('.level[data-level="replay"]').click();
 checks.progress=(await page2.locator('#percent').textContent()).includes('20');
 await page2.reload();
 checks.persist=(await page2.locator('#percent').textContent()).includes('20');
 await page2.locator('#grade').click();
 checks.quizIncomplete=(await page2.locator('#grade-result').textContent()).includes('trois questions');
 for(const [q,v] of [['q1','b'],['q2','a'],['q3','c']])await page2.locator('input[name="'+q+'"][value="'+v+'"]').check();
 await page2.locator('#grade').click();
 checks.quizCorrect=(await page2.locator('#grade-result').textContent()).includes('3 / 3');
 fs.writeFileSync('visual-proof-v7/v73/interactions.json',JSON.stringify(checks,null,2));
 await page2.close();
 if(Object.values(checks).some(v=>!v))process.exitCode=1;

 await browser.close();
 const required=['apercu-v7/art/paint.svg','apercu-v7/art/orbit.svg','apercu-v7/art/title-streaks.svg','assets/logo/pwg-watteau.png','photos/IMG_20261023_111417.jpg','photos/IMG_20261023_111919.jpg','photos/IMG_20261023_120024.jpg','photos/IMG_20261023_111415.jpg','photos/IMG_20261023_120827.jpg','photos/IMG_20261023_121010.jpg'];
 const missing=required.filter(p=>!fs.existsSync(p));
 fs.writeFileSync('visual-proof-v7/v73/report.json',JSON.stringify({report,missing},null,2));
 if(missing.length||report.some(r=>r.http!==200||r.brokenImmediate.length||r.overflow||r.clippedCards||r.mobileFirstCardsTooLow||r.cardCountFail||r.pageErrors.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
