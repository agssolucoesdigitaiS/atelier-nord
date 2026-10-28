const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1200 } });
  await p.goto('http://localhost:4173/'); await p.waitForTimeout(3500);
  await p.evaluate(() => { const t = document.querySelector('#experiencia > div.relative'); const top = t.getBoundingClientRect().top + scrollY; window.scrollTo(0, top + (t.offsetHeight - innerHeight) * 0.93); });
  await p.waitForTimeout(6000);
  // esconde a interface sobre o canvas e captura só a cena
  await p.evaluate(() => { document.querySelectorAll('#experiencia .px-site.pointer-events-none, header').forEach(e => e.style.visibility = 'hidden'); document.querySelectorAll('#experiencia [class*="zIndexRange"], #experiencia canvas ~ div').forEach(e => e.style.visibility = 'hidden'); });
  await p.waitForTimeout(500);
  const canvas = p.locator('#experiencia canvas');
  await canvas.screenshot({ path: './test-output/casa3d.png' });
  await b.close();
})();
