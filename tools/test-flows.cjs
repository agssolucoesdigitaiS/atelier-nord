const { chromium } = require('playwright');
const S = './test-output/shots/';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const logs = [];
  const mk = async (opts) => { const c = await b.newContext(opts); const p = await c.newPage(); p.on('console', m => { if (['error', 'warning'].includes(m.type())) logs.push(m.type() + ': ' + m.text().slice(0, 200)); }); p.on('pageerror', e => logs.push('PAGEERROR: ' + e.message)); return p; };
  // ---- desktop flows
  const p = await mk({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:4173/'); await p.waitForTimeout(3500);
  // menu
  await p.getByRole('button', { name: 'Menu' }).click(); await p.waitForTimeout(1600);
  await p.screenshot({ path: S + 'f01-menu.jpg', quality: 70 });
  await p.keyboard.press('Escape'); await p.waitForTimeout(1200);
  console.log('menu closed:', await p.locator('#menu-overlay').count() === 0);
  // menu -> serviços
  await p.getByRole('button', { name: 'Menu' }).click(); await p.waitForTimeout(1400);
  await p.locator('#menu-overlay button', { hasText: 'Serviços' }).click(); await p.waitForTimeout(2500);
  console.log('after menu nav scrollY', await p.evaluate(() => scrollY), 'servicos top', await p.evaluate(() => Math.round(document.getElementById('servicos').getBoundingClientRect().top)));
  // 3D section capture
  await p.evaluate(() => document.getElementById('experiencia').scrollIntoView()); await p.waitForTimeout(500);
  for (const f of [0.05, 0.45, 0.95]) {
    await p.evaluate((f) => { const t = document.querySelector('#experiencia > div.relative'); const top = t.getBoundingClientRect().top + scrollY; window.scrollTo(0, top + (t.offsetHeight - innerHeight) * f); }, f);
    await p.waitForTimeout(3500);
    await p.screenshot({ path: S + `f02-3d-${f}.jpg`, quality: 70 });
  }
  // contact drawer, invalid submit
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(800);
  await p.getByRole('button', { name: 'Iniciar projeto' }).first().click(); await p.waitForTimeout(1500);
  await p.getByRole('button', { name: 'Enviar mensagem' }).click(); await p.waitForTimeout(400);
  console.log('errors shown:', await p.locator('.err').count(), 'focused:', await p.evaluate(() => document.activeElement?.id));
  await p.screenshot({ path: S + 'f03-form-errors.jpg', quality: 70 });
  await p.fill('#cf-nome', 'Ana Souza'); await p.fill('#cf-email', 'ana@exemplo.com'); await p.fill('#cf-telefone', '11912345678');
  await p.fill('#cf-cidade', 'São Paulo'); await p.selectOption('#cf-tipo', 'Residência'); await p.selectOption('#cf-inicio', 'Entre 3 e 6 meses');
  await p.fill('#cf-mensagem', 'Gostaria de projetar uma casa térrea com jardim em um terreno de 600 m².'); await p.check('#cf-consentimento');
  await p.getByRole('button', { name: 'Enviar mensagem' }).click(); await p.waitForTimeout(900);
  await p.screenshot({ path: S + 'f04-form-demo.jpg', quality: 70 });
  console.log('demo status text:', await p.locator('[role=status] h3').first().textContent());
  await p.keyboard.press('Escape'); await p.waitForTimeout(1200);
  // project click -> expand -> page
  await p.evaluate(() => document.getElementById('projetos').scrollIntoView()); await p.waitForTimeout(1500);
  await p.mouse.wheel(0, 300); await p.waitForTimeout(1200);
  await p.getByRole('button', { name: 'Explorar projeto Casa Horizonte' }).click(); await p.waitForTimeout(500);
  await p.screenshot({ path: S + 'f05-expanding.jpg', quality: 70 });
  await p.waitForTimeout(2500);
  console.log('url hash:', await p.evaluate(() => location.hash), 'title:', await p.title(), 'overlay gone:', await p.evaluate(() => !document.getElementById('expand-overlay')));
  await p.screenshot({ path: S + 'f06-project.jpg', quality: 70 });
  await p.mouse.wheel(0, 1600); await p.waitForTimeout(1800);
  await p.screenshot({ path: S + 'f07-project-2.jpg', quality: 70 });
  // back button (browser history)
  await p.goBack(); await p.waitForTimeout(2500);
  console.log('after back hash:', JSON.stringify(await p.evaluate(() => location.hash)), 'title:', await p.title());
  // privacy via footer
  await p.goto('http://localhost:4173/#privacidade'); await p.waitForTimeout(3500);
  console.log('privacy h1:', await p.locator('h1').first().textContent());
  await p.goto('http://localhost:4173/#xyz'); await p.waitForTimeout(3000);
  console.log('404 h1:', await p.locator('h1').first().innerText());
  // testimonials keyboard
  await p.goto('http://localhost:4173/'); await p.waitForTimeout(3500);
  await p.evaluate(() => document.getElementById('depoimentos').scrollIntoView()); await p.waitForTimeout(800);
  await p.focus('[aria-roledescription=carrossel]'); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(1200);
  console.log('slide:', await p.locator('[aria-roledescription=slide]').getAttribute('aria-label'));
  // resize robustness
  await p.setViewportSize({ width: 900, height: 900 }); await p.waitForTimeout(800); await p.setViewportSize({ width: 1440, height: 900 }); await p.waitForTimeout(800);
  await p.evaluate(() => document.getElementById('projetos').scrollIntoView()); await p.waitForTimeout(600); await p.mouse.wheel(0, 1500); await p.waitForTimeout(1500);
  await p.screenshot({ path: S + 'f08-after-resize.jpg', quality: 70 });
  console.log(logs.join('\n') || 'no console errors/warnings');
  await b.close();
})();
