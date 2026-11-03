const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async()=>{
 fs.mkdirSync('visual-proof-v7/v75',{recursive:true});
 const browser=await chromium.launch({headless:true});
 const report=[];
 for(const [name,width,height] of [['reference',1536,1024],['user-desktop',1207,846],['projector',1280,720],['compact-desktop',1024,768],['tablet',768,1024],['user-mobile',575,896],['mobile',390,844],['small-mobile',320,700]]){
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto('http://127.0.0.1:8788/apercu-v75/',{waitUntil:'domcontentloaded',timeout:30000});
   await page.locator('.hero-photo').waitFor({state:'visible'});
   await page.evaluate(async()=>{const imgs=Array.from(document.querySelectorAll('img'));for(const i of imgs)i.loading='eager';await Promise.all(imgs.map(i=>i.decode().catch(()=>null)))});
   await page.waitForFunction(()=>Array.from(document.querySelectorAll('.hero-photo,.level img')).every(i=>i.complete&&i.naturalWidth>0),{timeout:30000});
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   await page.screenshot({path:'visual-proof-v7/v75/'+name+'.png',fullPage:name==='mobile'});
   const metrics=await page.evaluate(()=>{
      const r=(x)=>{const el=document.querySelector(x);if(!el)return null;const b=el.getBoundingClientRect();return {x:Math.round(b.x),y:Math.round(b.y),width:Math.round(b.width),height:Math.round(b.height),right:Math.round(b.right),bottom:Math.round(b.bottom)}};
      return {title:r('.title-lockup'),hero:r('.hero-photo'),cards:r('.levels'),nav:r('.site-nav'),cardCount:document.querySelectorAll('.level').length,brokenImmediate:Array.from(document.querySelectorAll('img[src]')).filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src')),overflow:document.documentElement.scrollWidth>innerWidth+3,viewport:{w:innerWidth,h:innerHeight}};
   });
   const cards=metrics.cards;
   const clipped=width>900 && (!cards || cards.bottom>height+2 || cards.x<0 || cards.right>width+2);
   const mobileGate=width<=900 && (!cards || cards.y>height+80 || metrics.title.y<0 || metrics.hero.bottom>height);
   const brokenCardImages=metrics.brokenImmediate;
   const cardCountFail=metrics.cardCount!==5;
   const cardOverflow=await page.locator('.levels').evaluate(container=>{const b=container.getBoundingClientRect();return [...container.querySelectorAll('.level')].some(c=>c.getBoundingClientRect().bottom>b.bottom+2)});
   const badCard=await page.locator('.level').evaluateAll(cards=>cards.some(card=>{
      const r=card.getBoundingClientRect(),img=card.querySelector('img').getBoundingClientRect(),cap=card.querySelector('.level-desc').getBoundingClientRect();
      return img.height<23 || cap.height<21 || img.top<r.top-2 || img.bottom>r.bottom+2 || cap.bottom>r.bottom+2;
   }));
   const result={name,width,height,http:response.status(),...metrics,clippedCards:clipped,mobileFirstCardsTooLow:mobileGate,cardCountFail,cardOverflow,badCard,pageErrors:errors};
   report.push(result);console.log(JSON.stringify(result));
   await page.close();
 }

 const page2=await browser.newPage({viewport:{width:1440,height:900}});
 await page2.goto('http://127.0.0.1:8788/apercu-v75/');
 const checks={};
 checks.videoCount=(await page2.locator('#replay video').count())===4;
 checks.videosNoAutoplay=await page2.locator('#replay video').evaluateAll(v=>v.every(x=>!x.autoplay&&x.preload==='none'&&x.hasAttribute('playsinline')));
 const videoSources=await page2.locator('#replay video source').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('src')));
 checks.optimizedSources=videoSources.length===4&&videoSources.every(p=>p.startsWith('./media/'));
 checks.posterFiles=await page2.locator('#replay video').evaluateAll(v=>v.map(x=>x.getAttribute('poster')).every(p=>p.startsWith('./media/poster-')));
 checks.accessibleDescriptions=(await page2.locator('#replay .video-scene').count())===4 && (await page2.locator('.replay-access-note').count())===1;
 checks.skipLink=await page2.locator('body > .skip-link').count()===1;
 checks.videoSourceFiles=videoSources.length===4 && videoSources.every(p=>fs.existsSync('apercu-v75/'+p.replace(/^\.\.\//,''))||fs.existsSync(p.replace(/^\.\.\//,'')));
 await page2.locator('#replay').scrollIntoViewIfNeeded();
 await page2.locator('#replay').screenshot({path:'visual-proof-v7/v75/replay-desktop.png'});
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
 fs.writeFileSync('visual-proof-v7/v75/interactions.json',JSON.stringify(checks,null,2));
 const geometry=await page2.locator('.level').evaluateAll(cards=>cards.map(c=>{const rect=el=>{const r=el.getBoundingClientRect();return [Math.round(r.top),Math.round(r.bottom),Math.round(r.height)]};return {card:rect(c),heading:rect(c.querySelector('.level-top')),image:rect(c.querySelector('img')),caption:rect(c.querySelector('.level-desc')),style:getComputedStyle(c.querySelector('.level-body')).gridTemplateRows}}));fs.writeFileSync('visual-proof-v7/v75/card-geometry.json',JSON.stringify(geometry,null,2));
 const playback=await page2.locator('#replay video').evaluateAll(async videos=>{
    const outcomes=[];
    for(const video of videos){
      video.muted=true;
      try{
        await video.play();
        const start=video.currentTime;
        await new Promise((resolve,reject)=>{
          const t=setTimeout(()=>reject(new Error('playback-timeout')),6000);
          function done(){if(video.currentTime>start+0.12){clearTimeout(t);video.removeEventListener('timeupdate',done);resolve();}}
          video.addEventListener('timeupdate',done);done();
        });
        outcomes.push({ok:true,time:video.currentTime});
      }catch(e){outcomes.push({ok:false,error:String(e)});}
      video.pause();
    }
    return outcomes;
   });
 checks.videoPlayback=playback.every(x=>x.ok);
 fs.writeFileSync('visual-proof-v7/v75/video-playback.json',JSON.stringify(playback,null,2));
 await page2.locator('#replay video').evaluateAll(v=>v.forEach(x=>x.pause()));
 await page2.close();
 if(Object.values(checks).some(v=>!v))process.exitCode=1;

 await browser.close();
 const required=['apercu-v7/art/paint.svg','apercu-v7/art/orbit.svg','apercu-v7/art/title-streaks.svg','assets/logo/pwg-watteau.png','photos/IMG_20261023_111417.jpg','photos/IMG_20261023_111919.jpg','photos/IMG_20261023_120024.jpg','photos/IMG_20261023_111415.jpg','photos/IMG_20261023_120827.jpg','photos/IMG_20261023_121010.jpg'];
 const missing=required.filter(p=>!fs.existsSync(p));
 fs.writeFileSync('visual-proof-v7/v75/report.json',JSON.stringify({report,missing},null,2));
 if(missing.length||report.some(r=>r.http!==200||r.brokenImmediate.length||r.overflow||r.clippedCards||r.mobileFirstCardsTooLow||r.cardCountFail||r.cardOverflow||r.badCard||r.pageErrors.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
