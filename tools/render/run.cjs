const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const only = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage();
  p.on('console', m => { if (m.type() === 'error') console.log('ERR', m.text()); });
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('http://localhost:5055/tools/render/index.html');
  await p.waitForFunction('window.READY === true', null, { timeout: 120000 });
  const names = only.length ? only : await p.evaluate('window.SCENE_NAMES');
  const out = path.resolve(__dirname, '../../public/assets/img');
  for (const n of names) {
    const t = Date.now();
    const r = await p.evaluate(n => window.renderScene(n), n);
    fs.writeFileSync(path.join(out, n + '-1920.webp'), Buffer.from(r.full.split(',')[1], 'base64'));
    fs.writeFileSync(path.join(out, n + '-960.webp'), Buffer.from(r.half.split(',')[1], 'base64'));
    console.log(n, ((Date.now() - t) / 1000).toFixed(1) + 's');
  }
  await b.close();
})();
