const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async()=>{
 fs.mkdirSync('visual-proof-v7',{recursive:true});
 const browser=await chromium.launch({headless:true});
 const report=[];
 for(const [name,width,height] of [['reference',1536,1024],['user-desktop',1207,846],['projector',1280,720],['mobile',390,844]]){
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto('http://127.0.0.1:8788/apercu-v7/',{waitUntil:'domcontentloaded',timeout:30000});
   await page.locator('.hero-photo').waitFor({state:'visible'});
   await page.evaluate(async()=>{const imgs=Array.from(document.querySelectorAll('img'));for(const i of imgs)i.loading='eager';await Promise.all(imgs.map(i=>i.decode().catch(()=>null)))});
   await page.screenshot({path:'visual-proof-v7/'+name+'.png',fullPage:name==='mobile'});
   const metrics=await page.evaluate(()=>{
      const r=(x)=>{const el=document.querySelector(x);if(!el)return null;const b=el.getBoundingClientRect();return {x:Math.round(b.x),y:Math.round(b.y),width:Math.round(b.width),height:Math.round(b.height),right:Math.round(b.right),bottom:Math.round(b.bottom)}};
      return {title:r('.title-lockup'),hero:r('.hero-photo'),cards:r('.levels'),nav:r('.site-nav'),cardCount:document.querySelectorAll('.level').length,brokenImmediate:Array.from(document.querySelectorAll('img')).filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src')),overflow:document.documentElement.scrollWidth>innerWidth+3,viewport:{w:innerWidth,h:innerHeight}};
   });
   const cards=metrics.cards;
   const clipped=width>900 && (!cards || cards.bottom>height+2 || cards.x<0 || cards.right>width+2);
   const result={name,width,height,http:response.status(),...metrics,clippedCards:clipped,pageErrors:errors};
   report.push(result);console.log(JSON.stringify(result));
   await page.close();
 }
 await browser.close();
 const required=['apercu-v7/art/paint.svg','apercu-v7/art/orbit.svg','apercu-v7/art/title-streaks.svg','assets/logo/pwg-watteau.png','photos/IMG_20261023_111417.jpg','photos/IMG_20261023_111919.jpg','photos/IMG_20261023_120024.jpg','photos/IMG_20261023_111415.jpg','photos/IMG_20261023_120827.jpg','photos/IMG_20261023_121010.jpg'];
 const missing=required.filter(p=>!fs.existsSync(p));
 fs.writeFileSync('visual-proof-v7/report.json',JSON.stringify({report,missing},null,2));
 if(missing.length||report.some(r=>r.http!==200||r.brokenImmediate.length||r.overflow||r.clippedCards||r.pageErrors.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
