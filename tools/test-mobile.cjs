const { chromium, devices } = require('playwright');
const S = './test-output/shots/';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const logs = [];
  const run = async (name, opts, n) => {
    const c = await b.newContext(opts); const p = await c.newPage();
    p.on('console', m => { if (['error', 'warning'].includes(m.type())) logs.push(name + ' ' + m.type() + ': ' + m.text().slice(0, 200)); });
    p.on('pageerror', e => logs.push(name + ' PAGEERROR: ' + e.message));
    await p.goto('http://localhost:4173/'); await p.waitForTimeout(3500);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    const vh = opts.viewport.height; let i = 0; let over = 0;
    for (let y = 0; y < H && i < n; y += vh * 1.6, i++) {
      await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(1300);
      const ow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (ow > 0) over = Math.max(over, ow);
      await p.screenshot({ path: `${S}${name}-${String(i).padStart(2, '0')}.jpg`, quality: 60 });
    }
    // find overflow culprits
    const culprits = await p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed'; }).slice(0, 5).map(e => e.tagName + '.' + (e.className?.toString?.() || '').slice(0, 60)));
    console.log(name, 'height', H, 'max overflow', over, culprits.join(' | '));
    if (name === 'm') {
      await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(600);
      await p.getByRole('button', { name: 'Menu' }).click(); await p.waitForTimeout(1500);
      await p.screenshot({ path: `${S}m-menu.jpg`, quality: 60 });
    }
    await c.close();
  };
  await run('m', { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } }, 30);
  await run('t', { viewport: { width: 820, height: 1180 }, hasTouch: true }, 4);
  await run('r', { viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' }, 30);
  await run('u', { viewport: { width: 2560, height: 1080 } }, 2);
  console.log(logs.join('\n') || 'no console errors/warnings');
  await b.close();
})();
