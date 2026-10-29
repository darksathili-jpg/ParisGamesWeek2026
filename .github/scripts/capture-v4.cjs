const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({ headless: true });
  fs.mkdirSync('visual-proof', { recursive: true });
  const report = [];
  for (const [label, width, height] of [['desktop',1440,900],['mobile',390,844],['projector',1280,720]]) {
    const page = await browser.newPage({ viewport:{width,height}, deviceScaleFactor:1 });
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    await page.goto('http://127.0.0.1:8765/v4-preview.html', { waitUntil:'networkidle' });
    await page.screenshot({path:'visual-proof/'+label+'.png',fullPage:true});
    const broken = await page.locator('img').evaluateAll(imgs => imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.getAttribute('src')));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    report.push({label,width,height,brokenImages:broken,horizontalOverflow:overflow,errors});
    await page.close();
  }
  fs.writeFileSync('visual-proof/report.json', JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  await browser.close();
  if (report.some(x => x.brokenImages.length || x.horizontalOverflow || x.errors.length)) process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
