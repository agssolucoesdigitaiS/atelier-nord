const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const logs = [];
  p.on('console', m => { if (['error', 'warning'].includes(m.type())) logs.push(m.type() + ': ' + m.text()); });
  p.on('pageerror', e => logs.push('PAGEERROR: ' + e.message));
  await p.goto('http://localhost:4173/');
  await p.waitForTimeout(800);
  await p.screenshot({ path: './test-output/shots/d00-preloader.jpg', quality: 70 });
  await p.waitForTimeout(3500);
  await p.screenshot({ path: './test-output/shots/d01-hero.jpg', quality: 70 });
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  console.log('scrollHeight', H);
  let i = 2;
  for (let y = 700; y < H; y += 900) {
    await p.mouse.wheel(0, 900); await p.waitForTimeout(1300);
    const info = await p.evaluate(() => ({ y: Math.round(scrollY), ow: document.documentElement.scrollWidth > innerWidth }));
    await p.screenshot({ path: `./test-output/shots/d${String(i).padStart(2, '0')}-${info.y}.jpg`, quality: 60 });
    if (info.ow) logs.push('OVERFLOW at ' + info.y);
    i++;
  }
  console.log('shots', i);
  console.log(logs.slice(0, 40).join('\n'));
  await b.close();
})();
