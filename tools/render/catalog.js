import * as THREE from 'three';
import { M, box, mesh, tree, shrub, plant, skyTexture, sunLight, setSeed, rr, rnd, fbm, worldUV } from './lib.js';

// ======================================================================
// CASA HORIZONTE — volume de concreto em balanço sobre caixa de vidro
// ======================================================================
function casaHorizonte(scene, { dusk = false, model = false } = {}) {
  setSeed(11);
  const concrete = M('concrete'), wood = M('wood'), glass = M('glass'), stone = M('stone', { base: [200, 192, 178], tile: 2, key: 'deck' });
  const metal = M('metal');
  // terreno
  if (!model) { const g = new THREE.PlaneGeometry(400, 400); g.rotateX(-Math.PI / 2); mesh(scene, g, M('grass'), [0, 0, 0], [0, 0, 0], 4).castShadow = false; }
  // deck de pedra
  box(scene, [-16, 0, -7], [18, .3, 11], stone, 2.4);
  // piscina (espelho d'água) + borda
  box(scene, [3, .3, 5.2], [17, .31, 9.6], M('water'), 4, false);
  box(scene, [2.6, .3, 4.8], [17.4, .36, 5.2], stone, 2); box(scene, [2.6, .3, 9.6], [17.4, .36, 10], stone, 2);
  box(scene, [2.6, .3, 5.2], [3, .36, 9.6], stone, 2); box(scene, [17, .3, 5.2], [17.4, .36, 9.6], stone, 2);
  // volume de madeira (térreo, lado esquerdo)
  box(scene, [-13, .3, -5], [-7, 3.6, 3], wood, 2.2);
  // caixa de vidro térrea
  box(scene, [-7, .3, -4.5], [7, 3.6, -4.2], concrete, 3); // parede de fundo
  box(scene, [-7, .3, 2.2], [7, 3.6, 2.3], glass, 3, false);
  box(scene, [6.9, .3, -4.2], [7, 3.6, 2.2], glass, 3, false);
  for (let x = -7; x <= 7.01; x += 2.33) box(scene, [x - .04, .3, 2.2], [x + .04, 3.6, 2.36], metal, 1);
  // interior visível
  const inner = dusk ? M('emissive', { color: 0xffb877, i: 1.1 }) : M('wood', { tone: .8, slat: false });
  box(scene, [-6.9, .3, -4.19], [6.8, 3.55, -4.1], inner, 2);
  box(scene, [-4, .3, -2], [-.5, .75, -.6], M('linen'), 1); box(scene, [1.5, .3, -1.5], [4.5, 1.05, -.6], M('stone', { base: [228, 222, 210], key: 'island', tile: 1 }), 2);
  // volume superior em concreto, balanço de 5 m
  const y0 = 3.6, y1 = 7;
  box(scene, [-10, y0, -5.4], [12, y0 + .9, 4.6], concrete, 3);
  box(scene, [-10, y1 - .8, -5.4], [12, y1, 4.6], concrete, 3);
  box(scene, [-10, y0 + .9, -5.4], [-6, y1 - .8, 4.6], concrete, 3);
  box(scene, [10.2, y0 + .9, -5.4], [12, y1 - .8, 4.6], concrete, 3);
  box(scene, [-6, y0 + .9, -5.4], [10.2, y1 - .8, -4.6], concrete, 3);
  // fita de vidro recuada
  const upGlass = dusk ? M('emissive', { color: 0xffc58a, i: .9 }) : glass;
  box(scene, [-6, y0 + .9, 3.6], [10.2, y1 - .8, 3.7], upGlass, 3, false);
  for (let x = -6; x <= 10.2; x += 1.62) box(scene, [x - .03, y0 + .9, 3.65], [x + .03, y1 - .8, 3.8], metal, 1);
  box(scene, [-6, y0 + .9, -4.6], [10.2, y0 + .92, 3.6], concrete, 3);
  // brises de madeira verticais na fachada lateral
  for (let z = -4.6; z < 3.3; z += .45) box(scene, [11.98, y0 + .9, z], [12.1, y1 - .8, z + .12], wood, 1);
  // paisagismo
  const trees = [[-22, -14, 1.5], [-15, -16, 1.8], [-6, -18, 1.6], [4, -17, 1.9], [14, -16, 1.5], [24, -12, 1.7], [-26, 4, 1.4], [30, -2, 1.6], [-19, 9, 1.2], [36, -18, 2], [-34, -20, 2]];
  trees.forEach(([x, z, s]) => tree(scene, x, 0, z, s));
  for (let i = 0; i < 26; i++) shrub(scene, rr(-16, 18), .3, rr(-7.5, -6.2), rr(.8, 1.3));
  for (let i = 0; i < 12; i++) shrub(scene, rr(-24, -17), 0, rr(-6, 10), rr(.9, 1.5));
  for (let i = 0; i < 8; i++) shrub(scene, rr(19, 26), 0, rr(-4, 12), rr(.9, 1.5));
  if (dusk) {
    // balizadores de piso
    for (let x = -14; x < 2; x += 3) { const l = new THREE.PointLight(0xffb070, 4, 6, 2); l.position.set(x, .6, 4); scene.add(l); box(scene, [x - .08, .3, 4.3], [x + .08, .5, 4.46], M('emissive', { color: 0xffc080, i: 3 }), 1, false); }
    const il = new THREE.PointLight(0xffb070, 40, 18, 2); il.position.set(0, 2.8, -1); scene.add(il);
    const il2 = new THREE.PointLight(0xffb070, 25, 14, 2); il2.position.set(2, 5.6, 0); scene.add(il2);
    // uplights rasantes na fachada de concreto
    for (const x of [-8, -2, 4, 10]) { const sp = new THREE.SpotLight(0xffc690, 160, 14, .5, .8, 2); sp.position.set(x, .4, 5.6); sp.target.position.set(x, 6.5, 4.6); scene.add(sp, sp.target); }
    for (const x of [-12, -9]) { const sp = new THREE.SpotLight(0xffc690, 60, 8, .5, .8, 2); sp.position.set(x, .4, 4.2); sp.target.position.set(x, 3.2, 3); scene.add(sp, sp.target); }
  }
}

// ======================================================================
// REFÚGIO SERRA — volume de madeira sobre embasamento de pedra em encosta
// ======================================================================
const serraH = (x, z) => -z * .2 + (fbm(x / 25 + 50, z / 25 + 50, 4, 77) - .5) * 4 * Math.min(1, Math.hypot(x, z) / 16);
function serraTerrain(scene) {
  const g = new THREE.PlaneGeometry(500, 500, 160, 160); g.rotateX(-Math.PI / 2);
  const p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setY(i, serraH(p.getX(i), p.getZ(i)));
  g.computeVertexNormals(); const m = mesh(scene, g, M('grass'), [0, 0, 0], [0, 0, 0], 5); m.castShadow = false;
  // montanhas distantes
  const mm = new THREE.MeshStandardMaterial({ color: 0x55605a, roughness: 1, flatShading: true });
  for (let i = 0; i < 9; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(rr(60, 110), rr(40, 75), 7), mm); c.position.set(rr(-260, 260), -10, rr(-280, -200) + (i % 2) * 300 * (rnd() > .5 ? 1 : 0) * 0 ); scene.add(c); }
  for (let i = 0; i < 7; i++) { const c = new THREE.Mesh(new THREE.ConeGeometry(rr(60, 110), rr(40, 70), 7), mm); c.position.set(rr(-300, 300), -30, rr(150, 260)); scene.add(c); }
}
function casaSerra(scene) {
  setSeed(23);
  serraTerrain(scene);
  const wood = M('wood', { tone: .82 }), stone = M('stone', { base: [150, 146, 136], tile: 6, veins: false, key: 'rubble' }), concrete = M('concrete', { tone: .92 }), glass = M('glass'), metal = M('metal');
  box(scene, [-7, -3, -3.5], [7, 1.2, 3.5], stone, 3);
  box(scene, [-11, 1.2, -4.5], [6, 4.4, 4], wood, 2.4);
  box(scene, [-11.6, 4.4, -5], [6.6, 4.75, 4.6], concrete, 3);
  // grande pano de vidro
  box(scene, [-9.5, 1.5, 3.98], [4.5, 4.1, 4.06], glass, 3, false);
  for (let x = -9.5; x <= 4.51; x += 2) box(scene, [x - .04, 1.5, 4], [x + .04, 4.1, 4.12], metal, 1);
  box(scene, [-9.5, 1.42, 4], [4.5, 1.5, 4.14], metal, 1); box(scene, [-9.5, 4.1, 4], [4.5, 4.18, 4.14], metal, 1);
  // deck suspenso
  box(scene, [-2, 1.05, 4], [8, 1.2, 7.5], M('wood', { tone: .7, slat: false }), 1.5);
  for (const [x, z] of [[-1.7, 7.2], [3, 7.2], [7.7, 7.2], [7.7, 4.3]]) box(scene, [x - .06, -3, z - .06], [x + .06, 1.05, z + .06], metal, 1);
  box(scene, [-2, 1.2, 7.46], [8, 2.2, 7.5], M('glass', { opacity: .25 }), 1, false);
  // chaminé
  box(scene, [-8.5, 4.4, -3], [-7.3, 6.2, -1.8], concrete, 2);
  // pinheiros
  for (let i = 0; i < 140; i++) { const x = rr(-120, 120), z = rr(-120, 60); if (Math.abs(x) < 16 && z > -12 && z < 22) continue; if (Math.hypot(x - 20, z - 22) < 16) continue; tree(scene, x, serraH(x, z) - .3, z, rr(1.1, 2.1), rnd() > .25 ? 'pine' : 'round'); }
  
}

// ======================================================================
// APARTAMENTO ORLA — interiores com vista para o mar
// ======================================================================
function aptoOrla(scene) {
  setSeed(5);
  const trav = M('stone', { base: [221, 208, 186], tile: 3, key: 'trav' }), plaster = M('plaster'), wood = M('wood', { tone: .95 }), woodP = M('wood', { tone: .9, slat: false }), metal = M('metal'), linen = M('linen'), linen2 = M('linen', { base: [158, 150, 132], key: 'l2' });
  // sala 12 x 3.1 x 9 (z -9..0), janela em z = 0
  box(scene, [-6, -.2, -9], [6, 0, 0], trav, 2.4);
  box(scene, [-6, 3.1, -9], [6, 3.3, 0], plaster, 3);
  box(scene, [-6.2, 0, -9.2], [6.2, 3.1, -9], plaster, 3);
  box(scene, [-6.2, 0, -9], [-6, 3.1, 0], wood, 2);           // painel ripado
  box(scene, [6, 0, -9], [6.2, 3.1, 0], plaster, 3);
  // caixilho (vidro + montantes)
  box(scene, [-6, 0, -.02], [6, 3.1, .02], M('glass', { opacity: .12, color: 0xdfe8e8 }), 3, false);
  for (let x = -6; x <= 6.01; x += 2) box(scene, [x - .035, 0, -.06], [x + .035, 3.1, .06], metal, 1, true);
  box(scene, [-6, 2.95, -.08], [6, 3.1, .08], metal, 1);
  // varanda, mar, céu
  box(scene, [-6, -.3, 0], [6, -.05, 2.6], trav, 2.4);
  box(scene, [-6, -.05, 2.5], [6, 1.05, 2.55], M('glass', { opacity: .2, color: 0xcfe0e0 }), 2, false);
  const sea = new THREE.PlaneGeometry(4000, 4000); sea.rotateX(-Math.PI / 2); const s = mesh(scene, sea, M('sea'), [0, -40, 0]); s.castShadow = false;
  const sand = new THREE.PlaneGeometry(4000, 200); sand.rotateX(-Math.PI / 2); mesh(scene, sand, M('stone', { base: [214, 200, 170], tile: 1, veins: false, key: 'sand' }), [0, -39.5, 60]);
  // mobiliário
  box(scene, [-3.8, 0, -4.2], [.4, .42, -3.1], linen, 1); box(scene, [-3.8, .42, -4.2], [.4, .85, -3.95], linen, 1); box(scene, [-3.8, .42, -4.2], [-3.55, .65, -3.1], linen, 1); box(scene, [.15, .42, -4.2], [.4, .65, -3.1], linen, 1);
  box(scene, [-3, 0, -1.8], [-.6, .015, -.1], M('linen', { base: [196, 188, 170], key: 'rug' }), 1, false);
  mesh(scene, new THREE.CylinderGeometry(.55, .55, .36, 48), trav, [-1.8, .18, -2.1]);
  mesh(scene, new THREE.CylinderGeometry(.35, .35, .26, 48), trav, [-.9, .13, -1.5]);
  box(scene, [1.4, 0, -2.4], [2.3, .4, -1.5], linen2, 1); box(scene, [1.4, .4, -2.4], [2.3, .8, -2.2], linen2, 1);
  box(scene, [-5.95, 0, -7.5], [-5.4, .55, -3.6], woodP, 1.5);
  plant(scene, 4.8, 0, -1, 1.3);
  mesh(scene, new THREE.SphereGeometry(.12, 24, 16), M('white'), [-5.65, .67, -5.2]);
  mesh(scene, new THREE.CylinderGeometry(.07, .1, .3, 24), M('stone', { base: [120, 112, 100], key: 'vase', tile: 1 }), [-5.65, .7, -6.4]);
  // cozinha ao fundo
  box(scene, [2, 0, -8.95], [6, 2.6, -8.3], woodP, 1.5); box(scene, [2.8, 0, -6.6], [5.6, .92, -5.7], woodP, 1.5); box(scene, [2.75, .92, -6.65], [5.65, .96, -5.65], trav, 1.5);
  box(scene, [-2.6, 0, -7.6], [.2, .75, -6.6], woodP, 1.5);
  for (const x of [-2.2, -1.2, -.2]) for (const z of [-7.85, -6.35]) box(scene, [x, 0, z - .2], [x + .4, .45, z + .2], M('metal', { color: 0x2b2b29 }), 1);
  mesh(scene, new THREE.SphereGeometry(.25, 32, 16), M('emissive', { color: 0xffe2b8, i: 1.4 }), [-1.2, 2.1, -7.1]); box(scene, [-1.21, 2.3, -7.11], [-1.19, 3.1, -7.09], metal, 1, false);
}

// ======================================================================
// ESSENZA STUDIO — arquitetura comercial
// ======================================================================
function archWall(w, h, aw, ah, depth) {
  const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(-w / 2, h); s.lineTo(-w / 2, 0);
  const hole = new THREE.Path(); const r = aw / 2; hole.moveTo(-r, 0); hole.lineTo(-r, ah - r); hole.absarc(0, ah - r, r, Math.PI, 0, true); hole.lineTo(r, 0); hole.lineTo(-r, 0); s.holes.push(hole);
  return new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 48 });
}
function essenza(scene) {
  setSeed(9);
  const sandP = M('plaster', { base: [205, 186, 160], key: 'sand' }), micro = M('stone', { base: [190, 184, 174], tile: 1, veins: false, key: 'micro' }), trav = M('stone', { base: [221, 208, 186], tile: 2, key: 'trav' }), wood = M('wood', { tone: .85, slat: false }), metal = M('metal');
  box(scene, [-8, -.2, -10], [8, 0, 2], micro, 3);
  box(scene, [-8, 3.6, -10], [8, 3.8, 2], sandP, 3);
  box(scene, [-8.2, 0, -10], [-8, 3.6, 2], sandP, 3); box(scene, [8, 0, -10], [8.2, 3.6, 2], sandP, 3);
  // parede de fundo com arco
  const aw = mesh(scene, archWall(16, 3.6, 2.6, 3, .4), sandP, [0, 0, -6], [0, 0, 0], 3);
  box(scene, [-8, 0, -10.2], [8, 3.6, -10], M('plaster', { base: [226, 214, 196], key: 'sand2' }), 3);
  // nichos (estante)
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const x0 = -7.2 + i * 1.15; box(scene, [x0, .5 + j * .95, -5.95], [x0 + 1.05, .54 + j * .95, -5.55], wood, 1); }
  for (let i = 0; i < 9; i++) mesh(scene, new THREE.CylinderGeometry(.07, .09, rr(.18, .32), 24), M('white', { color: [0xe9e2d6, 0x8e7c66, 0x3f3a33][i % 3] }), [-7 + (i % 4) * 1.15 + rr(0, .5), .54 + Math.floor(i / 4) * .95 + .14, -5.75]);
  // balcão curvo
  const shape = new THREE.Shape(); shape.absarc(0, 0, 2.2, Math.PI * .1, Math.PI * .9, false); shape.absarc(0, 0, 1.6, Math.PI * .9, Math.PI * .1, true);
  const counter = new THREE.ExtrudeGeometry(shape, { depth: 1.05, bevelEnabled: false, curveSegments: 64 }); counter.rotateX(-Math.PI / 2);
  mesh(scene, counter, trav, [2.4, 0, -1.8], [0, Math.PI, 0], 1.5);
  const top = new THREE.Shape(); top.absarc(0, 0, 2.28, Math.PI * .08, Math.PI * .92, false); top.absarc(0, 0, 1.5, Math.PI * .92, Math.PI * .08, true);
  const tg = new THREE.ExtrudeGeometry(top, { depth: .05, bevelEnabled: false, curveSegments: 64 }); tg.rotateX(-Math.PI / 2);
  mesh(scene, tg, M('stone', { base: [92, 88, 80], tile: 1, key: 'dark' }), [2.4, 1.05, -1.8], [0, Math.PI, 0], 1.5);
  // pendentes
  for (const x of [1.4, 2.4, 3.4]) { mesh(scene, new THREE.SphereGeometry(.18, 32, 16), M('emissive', { color: 0xffd6a0, i: 2 }), [x, 2.4, -2.6]); box(scene, [x - .005, 2.55, -2.605], [x + .005, 3.6, -2.595], metal, 1, false); const l = new THREE.PointLight(0xffc890, 6, 7, 2); l.position.set(x, 2.2, -2.6); scene.add(l); }
  // bancos de espera em pedra + planta + espelho
  box(scene, [-6.5, 0, -3.4], [-3.2, .45, -2.6], trav, 1.5); box(scene, [-7.95, 0, -2], [-7.2, .45, 1.2], trav, 1.5);
  plant(scene, -5.4, 0, -.2, 1.5);
  mesh(scene, new THREE.CircleGeometry(.75, 64), M('glass', { color: 0x9a9890 }), [-7.97, 1.7, -.4], [0, Math.PI / 2, 0]);
  // luz pelo arco
  const back = new THREE.PointLight(0xfff0d8, 30, 12, 2); back.position.set(0, 2.2, -8.5); scene.add(back);
}

// ======================================================================
// OUTRAS CENAS
// ======================================================================
function interiorStudio(scene) {
  setSeed(31);
  const concrete = M('concrete', { tone: 1.04 }), wood = M('wood', { tone: 1, slat: false }), white = M('white'), metal = M('metal');
  box(scene, [-8, -.2, -8], [8, 0, 4], M('stone', { base: [178, 172, 162], tile: 1, veins: false, key: 'floorS' }), 3);
  box(scene, [-8, 3.8, -8], [8, 4, 4], concrete, 3);
  box(scene, [-8, 0, -8.2], [8, 3.8, -8], concrete, 3);
  box(scene, [8, 0, -8], [8.2, 3.8, 4], M('plaster'), 3);
  // janela grande à esquerda (montantes)
  for (let z = -8; z <= 4; z += 1.5) box(scene, [-8.05, 0, z - .04], [-7.95, 3.8, z + .04], metal, 1);
  // estante ao fundo com maquetes
  for (let j = 0; j < 4; j++) box(scene, [-4, .2 + j * .85, -7.98], [6, .25 + j * .85, -7.5], wood, 1);
  for (let i = 0; i < 14; i++) { const x = rr(-3.7, 5.5), j = Math.floor(rnd() * 4), y = .25 + j * .85; box(scene, [x, y, -7.9], [x + rr(.2, .5), y + rr(.12, .45), -7.6], white, 1); }
  // mesa longa
  box(scene, [-3.5, .74, -3.2], [3.5, .8, -1.6], wood, 2);
  for (const x of [-3.2, 3.1]) box(scene, [x, 0, -3], [x + .1, .74, -1.8], metal, 1);
  // maquetes sobre a mesa
  box(scene, [-2.6, .8, -2.9], [-.9, .83, -1.9], wood, 1);
  box(scene, [-2.4, .83, -2.7], [-1.4, 1.03, -2.2], white, 1); box(scene, [-2.5, 1.03, -2.75], [-1.1, 1.13, -2.15], white, 1);
  box(scene, [.2, .8, -2.95], [1.7, .81, -1.85], M('plan'), 1.2, false);
  box(scene, [2, .8, -2.7], [2.8, 1.25, -2.1], white, 1); box(scene, [2.1, 1.25, -2.6], [3.1, 1.32, -2.2], white, 1);
  mesh(scene, new THREE.CylinderGeometry(.04, .04, .9, 16), white, [-.3, .84, -2.9], [0, 0, Math.PI / 2]);
  mesh(scene, new THREE.CylinderGeometry(.05, .05, .9, 16), M('white', { color: 0xe7dfcf }), [-.3, .85, -1.75], [0, .1, Math.PI / 2]);
  // pendentes
  for (const x of [-2, 0, 2]) { mesh(scene, new THREE.CylinderGeometry(.18, .3, .22, 32, 1, true), metal, [x, 2.2, -2.4]); mesh(scene, new THREE.CircleGeometry(.28, 32), M('emissive', { color: 0xffe0b0, i: 2.5 }), [x, 2.09, -2.4], [Math.PI / 2, 0, 0]); box(scene, [x - .005, 2.31, -2.405], [x + .005, 3.8, -2.395], metal, 1, false); const l = new THREE.PointLight(0xffd6a0, 4, 5, 2); l.position.set(x, 1.9, -2.4); scene.add(l); }
  // banquetas
  for (const x of [-2.5, -1, .5, 2]) mesh(scene, new THREE.CylinderGeometry(.2, .2, .62, 24), wood, [x, .31, -.9]);
  plant(scene, 6.5, 0, -6.6, 1.6);
  // exterior verde visível pela janela
  for (let i = 0; i < 14; i++) tree(scene, rr(-40, -14), -1, rr(-30, 20), rr(1.4, 2.2));
  const g = new THREE.PlaneGeometry(200, 200); g.rotateX(-Math.PI / 2); mesh(scene, g, M('grass'), [-60, -1, 0], [0, 0, 0], 4);
}

function maquete(scene) {
  setSeed(41);
  const grp = new THREE.Group(); casaHorizonte(grp, { model: true });
  const wm = M('white', { color: 0xf2f0ea }), gm = M('glass', { opacity: .55, color: 0xbac6c6 });
  grp.traverse(o => { if (o.isMesh) { o.material = (o.material.isMeshPhysicalMaterial) ? gm : wm; } if (o.isLight) o.visible = false; });
  grp.scale.setScalar(.045); grp.position.set(0, .02, 0); scene.add(grp);
  const table = M('wood', { tone: 1.05, slat: false });
  box(scene, [-4, -.05, -3], [4, 0, 3], M('mat'), 2.2, false);
  box(scene, [-1, 0, -.75], [1.05, .02, .62], table, .6);
  box(scene, [1.5, 0, -1], [1.62, .02, 1], M('white', { color: 0xdcd6c8 }), 1);
  mesh(scene, new THREE.CylinderGeometry(.012, .012, 1, 8), M('metal', { color: 0x2c2c2a }), [-1.5, .012, .9], [Math.PI / 2, 0, .6]);
  box(scene, [-2.6, 0, -1.6], [-1.6, .004, -.9], M('plan'), 1, false);
}
function maqueteOld(scene) {
  const white = M('white', { color: 0xf3f1ec }), wood = M('wood', { tone: 1.05, slat: false });
  box(scene, [-3, -.05, -2], [3, 0, 2], M('mat'), 2.2, false);
  box(scene, [-1.2, 0, -.8], [1.2, .02, .8], wood, .6);
  // casa em miniatura (escala 1:100)
  const s = .1;
  box(scene, [-1.0, .02, -.45], [.4, .055, .2], white, 1);
  box(scene, [-.9, .055, -.4], [-.55, .38 * s * 10 * .1 + .055, .15], white, 1);
  box(scene, [-.55, .055, -.38], [.35, .09, .12], M('glass', { opacity: .5, color: 0xbfc9c9 }), 1, false);
  box(scene, [-.8, .09, -.42], [.75, .125, .18], white, 1);
  box(scene, [.1, .022, .25], [.95, .028, .5], M('glass', { color: 0x9fb7b6 }), 1, false);
  for (let i = 0; i < 9; i++) { const x = rr(-1.1, 1.1), z = rr(-.75, -.5); mesh(scene, new THREE.CylinderGeometry(.004, .004, .06, 6), M('white', { color: 0x8f7a60 }), [x, .05, z]); mesh(scene, new THREE.IcosahedronGeometry(rr(.035, .06), 1), white, [x, .1, z]); }
  // régua de escala e lápis
  box(scene, [1.4, 0, -.9], [1.5, .025, .9], M('white', { color: 0xdcd6c8 }), 1);
  mesh(scene, new THREE.CylinderGeometry(.012, .012, .9, 6), M('metal', { color: 0x2c2c2a }), [-1.6, .012, .6], [Math.PI / 2, 0, .5]);
}

function materiais(scene) {
  setSeed(51);
  const table = M('wood', { tone: .55, slat: false });
  box(scene, [-3, -.1, -2], [3, 0, 2], table, 1.4, false);
  box(scene, [-1.3, 0, -.9], [-.2, .35, .1], M('concrete'), .8);
  box(scene, [-.1, 0, -1.0], [1.4, .06, -.2], M('stone', { base: [221, 208, 186], tile: 1, key: 'travS' }), .8);
  box(scene, [.1, .06, -.95], [1.25, .1, -.55], M('wood', { tone: 1, slat: false }), .6);
  box(scene, [-.9, 0, .25], [.6, .03, .85], M('linen', { base: [198, 187, 169], key: 'linS' }), .5);
  box(scene, [.7, 0, .1], [1.5, .2, .55], M('stone', { base: [96, 98, 92], tile: 1, veins: false, key: 'basalt' }), .6);
  box(scene, [-1.7, 0, .1], [-1.0, .015, .8], M('metal', { color: 0x3a3b37 }), 1);
  mesh(scene, new THREE.CylinderGeometry(.16, .16, .28, 40), M('plaster', { base: [198, 187, 169], key: 'sandM' }), [1.8, .14, -.6]);
  box(scene, [-2.3, 0, -1.2], [-1.6, .18, -.5], M('wood', { tone: .75 }), .5);
}

function detalhe(scene) {
  setSeed(61);
  box(scene, [-6, -1, -.4], [6, 8, 0], M('concrete'), 2.2);
  box(scene, [-6, -1, 0], [6, -.9, 6], M('stone', { base: [200, 192, 178], tile: 1, key: 'deckD' }), 2);
  const wood = M('wood', { tone: .9, slat: false });
  for (let x = -6; x < .5; x += .42) box(scene, [x, -.9, 1.4], [x + .12, 8, 1.52], wood, 1);
}

function obra(scene) {
  setSeed(71);
  const conc = M('concrete', { tone: .97 }), metal = M('metal', { color: 0x3a3a36 }), steel = new THREE.MeshStandardMaterial({ color: 0x7a5a40, roughness: .7, metalness: .4 });
  const g = new THREE.PlaneGeometry(300, 300); g.rotateX(-Math.PI / 2); mesh(scene, g, M('dirt'), [0, 0, 0], [0, 0, 0], 4).castShadow = false;
  const cols = [-9, -3, 3, 9], rows = [-5, 0, 5];
  for (let f = 0; f < 3; f++) {
    const y = f * 3.2;
    box(scene, [-10, y + 3, -6], [10, y + 3.25, 6], conc, 3);
    cols.forEach(x => rows.forEach(z => box(scene, [x - .2, y, z - .2], [x + .2, y + 3, z + .2], conc, 2)));
  }
  // arranques com vergalhões
  cols.forEach(x => rows.forEach(z => { for (let k = 0; k < 4; k++) box(scene, [x - .12 + (k % 2) * .22, 9.85, z - .12 + Math.floor(k / 2) * .22], [x - .1 + (k % 2) * .22, 11, z - .1 + Math.floor(k / 2) * .22], steel, 1); }));
  // andaime
  for (let x = -10; x <= 10; x += 2) for (let y = 0; y <= 9; y += 2) { box(scene, [x - .03, 0, 6.6], [x + .03, 10, 6.66], metal, 1); box(scene, [x, y, 6.6], [x + 2, y + .05, 6.66], metal, 1); box(scene, [x, y, 6.2], [x + 2, y + .05, 6.9], M('wood', { tone: .7, slat: false }), 1); }
  for (let x = -10; x <= 10; x += 2) box(scene, [x - .03, 0, 7.4], [x + .03, 10, 7.46], metal, 1);
  // pilhas de material
  box(scene, [13, 0, 2], [16, .8, 4], M('wood', { tone: .7, slat: false }), 1); box(scene, [13, 0, -3], [15, 1.2, -1], M('concrete', { tone: .8 }), 1);
  for (let i = 0; i < 9; i++) tree(scene, rr(-40, 40), 0, rr(-40, -22), rr(1.3, 2));
}

function retrofit(scene) {
  setSeed(81);
  const brick = M('brick'), metal = M('metal'), glass = M('glass'), conc = M('concrete');
  box(scene, [-30, -.2, -2], [30, 0, 14], M('stone', { base: [170, 166, 158], tile: 6, veins: false, key: 'calc' }), 3);
  box(scene, [-30, -.4, 14], [30, -.2, 30], M('stone', { base: [70, 70, 68], tile: 1, veins: false, key: 'asph' }), 3);
  // edifício existente em tijolo
  box(scene, [-9, 0, -12], [9, 9, -2], brick, 2.4);
  // janelas originais
  for (let x = -7; x < 7; x += 3.5) { box(scene, [x, 5, -2.02], [x + 1.6, 7.6, -1.98], glass, 1, false); box(scene, [x - .1, 4.9, -2.1], [x + 1.7, 5, -1.9], conc, 1); }
  // nova inserção: grande caixilho de aço no térreo
  box(scene, [-7.5, 0, -2.05], [7.5, 3.8, -1.95], glass, 2, false);
  for (let x = -7.5; x <= 7.51; x += 1.5) box(scene, [x - .06, 0, -2.15], [x + .06, 3.8, -1.9], metal, 1);
  box(scene, [-7.6, 3.8, -2.2], [7.6, 4.0, -1.85], metal, 1);
  // ampliação contemporânea na cobertura
  box(scene, [-8, 9, -11], [6, 12, -3.5], conc, 3);
  box(scene, [-6, 9.4, -3.52], [5, 11.6, -3.48], glass, 2, false);
  box(scene, [-8.5, 12, -11.5], [6.5, 12.3, -2.6], conc, 3);
  // vizinhos
  box(scene, [-24, 0, -12], [-10, 14, -2], M('plaster', { base: [196, 190, 180], key: 'n1' }), 3);
  box(scene, [10, 0, -12], [22, 7, -2], M('plaster', { base: [170, 164, 152], key: 'n2' }), 3);
  for (let i = 0; i < 4; i++) tree(scene, -12 + i * 8, 0, 9, 1.3);
  const il = new THREE.PointLight(0xffc890, 20, 12, 2); il.position.set(0, 2.4, -5); scene.add(il);
}

function interiorSerra(scene) {
  setSeed(91);
  serraTerrain(scene);
  for (let i = 0; i < 80; i++) { const x = rr(-60, 60), z = rr(14, 120); tree(scene, x, serraH(x, z) - .3, z, rr(1.2, 2), 'pine'); }
  const wood = M('wood', { tone: .78 }), woodF = M('wood', { tone: .9, slat: false }), conc = M('concrete', { tone: .95 }), metal = M('metal'), stone = M('stone', { base: [140, 136, 128], tile: 5, veins: false, key: 'rubble2' });
  box(scene, [-10, 1, -5], [6, 1.2, 4], woodF, 2);
  box(scene, [-10, 4.4, -5], [6, 4.6, 4], conc, 3);
  box(scene, [-10.2, 1.2, -5], [-10, 4.4, 4], wood, 2);
  box(scene, [6, 1.2, -5], [6.2, 4.4, 4], wood, 2);
  box(scene, [-10, 1.2, -5.2], [6, 4.4, -5], stone, 2);
  for (let x = -9.5; x <= 4.51; x += 2) box(scene, [x - .04, 1.2, 3.96], [x + .04, 4.4, 4.06], metal, 1);
  box(scene, [-9.5, 1.2, 4], [4.5, 4.4, 4.02], M('glass', { opacity: .1, color: 0xe0e6e6 }), 2, false);
  // lareira suspensa e mobiliário
  box(scene, [-8.6, 1.2, -4.9], [-6.8, 4.4, -3.8], conc, 2); box(scene, [-8.4, 1.6, -3.81], [-7, 2.3, -3.79], M('emissive', { color: 0xff9a50, i: 1.6 }), 1, false);
  const ln = M('linen', { base: [176, 165, 148], key: 'ls' });
  box(scene, [-4.5, 1.2, -1.2], [-.5, 1.62, -.2], ln, 1); box(scene, [-4.5, 1.62, -1.2], [-.5, 2.05, -.95], ln, 1);
  mesh(scene, new THREE.CylinderGeometry(.6, .6, .35, 48), M('stone', { base: [96, 98, 92], tile: 1, veins: false, key: 'basalt' }), [-2.5, 1.375, .9]);
  box(scene, [-5, 1.2, -.6], [-.1, 1.21, 2.6], M('linen', { base: [200, 192, 176], key: 'rug2' }), 1, false);
  box(scene, [1.2, 1.2, 1], [2.1, 1.6, 1.9], ln, 1); box(scene, [1.2, 1.6, 1.7], [2.1, 2, 1.9], ln, 1);
}

// ======================================================================
// CATÁLOGO DE ENQUADRAMENTOS
// ======================================================================
const look = (cam, p, t) => { cam.position.set(...p); cam.lookAt(...t); };
const fogged = (scene, color, d) => { scene.fog = new THREE.FogExp2(color, d); };

export const SCENES = {
  'horizonte-hero': {
    fov: 34, build(scene, cam) {
      casaHorizonte(scene); scene.background = skyTexture('#8ea3ad', '#d9d3c4', '#e8dfcc'); fogged(scene, 0xddd5c3, .0065);
      sunLight(scene, [38, 15, 12], 0xffd2a0, 4.2, 45); scene.add(new THREE.HemisphereLight(0xc9d6dc, 0x6a6150, 0.35));
      look(cam, [27, 1.7, 25], [1, 3.4, -.5]); return { exposure: .95, envI: .4 };
    }
  },
  'horizonte-crepusculo': {
    fov: 30, build(scene, cam) {
      casaHorizonte(scene, { dusk: true }); scene.background = skyTexture('#1f2a35', '#5b5a63', '#c08a66'); fogged(scene, 0x4c4a4d, .009);
      sunLight(scene, [40, 6, -20], 0xff9e6a, .6, 45); scene.add(new THREE.HemisphereLight(0x4b5b72, 0x2a241e, 0.3));
      look(cam, [16, 1.7, 31], [0, 3.7, 0]); return { exposure: 1.15, envI: .15 };
    }
  },
  'horizonte-balanco': {
    fov: 42, build(scene, cam) {
      casaHorizonte(scene); scene.background = skyTexture('#7f97a3', '#cfd2ca', '#e5dccb'); fogged(scene, 0xdcd6c6, .006);
      sunLight(scene, [-24, 30, 20], 0xfff0d8, 3.2, 40); scene.add(new THREE.HemisphereLight(0xc4d2da, 0x6a6150, 0.55));
      look(cam, [17.5, 1.3, 10.5], [7, 5.2, 0]); return { exposure: .95, envI: .45 };
    }
  },
  'serra-encosta': {
    fov: 34, build(scene, cam) {
      casaSerra(scene); scene.background = skyTexture('#9aa6a8', '#c9cdc6', '#d5d5cd'); fogged(scene, 0xc8ccc5, .009);
      sunLight(scene, [30, 22, 28], 0xffe9cc, 2.6, 45); scene.add(new THREE.HemisphereLight(0xcdd8dc, 0x4a4b3a, 0.55));
      look(cam, [19, 4.2, 19], [-2.5, 2.2, 0]); return { exposure: .95, envI: .4 };
    }
  },
  'serra-fachada': {
    fov: 38, build(scene, cam) {
      casaSerra(scene); scene.background = skyTexture('#9aa6a8', '#c9cdc6', '#d5d5cd'); fogged(scene, 0xc8ccc5, .013);
      sunLight(scene, [30, 22, 28], 0xffe9cc, 2.6, 40); scene.add(new THREE.HemisphereLight(0xcdd8dc, 0x4a4b3a, 0.55));
      look(cam, [9, 2.4, 15], [-3, 2.6, 2]); return { exposure: .92, envI: .4 };
    }
  },
  'serra-interior': {
    fov: 50, build(scene, cam) {
      interiorSerra(scene); scene.background = skyTexture('#a8b1b2', '#cfd2cc', '#d8d8d0'); fogged(scene, 0xcfd2cb, .02);
      sunLight(scene, [18, 20, 30], 0xffe6c4, 2.8, 30); scene.add(new THREE.HemisphereLight(0xd6dde0, 0x5a4a3a, 0.72));
      look(cam, [3.5, 2.6, -4.3], [-3, 2.2, 4]); return { exposure: 1.05, envI: .5 };
    }
  },
  'orla-estar': {
    fov: 52, build(scene, cam) {
      aptoOrla(scene); scene.background = skyTexture('#86a4b6', '#c9d5d6', '#e6e2d6'); fogged(scene, 0xd8dcd6, .0016);
      sunLight(scene, [30, 22, 26], 0xffe3bc, 3.2, 14, [0, 0, -4]); scene.add(new THREE.HemisphereLight(0xdbe4e6, 0x8a7a64, 0.66));
      look(cam, [5.3, 1.45, -4.4], [-2.2, 1.0, -1.0]); return { exposure: 1.05, envI: .55 };
    }
  },
  'orla-cozinha': {
    fov: 50, build(scene, cam) {
      aptoOrla(scene); scene.background = skyTexture('#86a4b6', '#c9d5d6', '#e6e2d6'); fogged(scene, 0xd8dcd6, .0016);
      sunLight(scene, [-26, 20, 30], 0xffe3bc, 3.2, 14, [0, 0, -4]); scene.add(new THREE.HemisphereLight(0xdbe4e6, 0x8a7a64, 0.66));
      look(cam, [.2, 1.55, -4.4], [4.2, 1.0, -8.6]); return { exposure: 1.05, envI: .55 };
    }
  },
  'orla-detalhe': {
    fov: 40, build(scene, cam) {
      aptoOrla(scene); scene.background = skyTexture('#86a4b6', '#c9d5d6', '#e6e2d6');
      sunLight(scene, [30, 14, 12], 0xffd9a8, 3.4, 12, [-5, 0, -5]); scene.add(new THREE.HemisphereLight(0xdbe4e6, 0x8a7a64, 0.61));
      look(cam, [2.6, 1.35, -.9], [-5, .9, -5.4]); return { exposure: 1, envI: .5 };
    }
  },
  'essenza-fachada': {
    fov: 40, build(scene, cam) {
      essenza(scene);
      // frente da loja (z = 2) — pórtico de concreto e vidro
      const conc = M('concrete', { tone: .95 }), metal = M('metal');
      box(scene, [-8.4, 0, 2], [8.4, 4.6, 2.2], M('glass', { opacity: .18, color: 0xd8e0e0 }), 3, false);
      box(scene, [-9.2, 0, 1.9], [-8.2, 5.4, 2.8], conc, 3); box(scene, [8.2, 0, 1.9], [9.2, 5.4, 2.8], conc, 3); box(scene, [-9.2, 4.6, 1.9], [9.2, 5.4, 2.8], conc, 3);
      box(scene, [-8.2, 3.6, 2], [8.2, 4.6, 2.3], conc, 3);
      for (const x of [-4, 0, 4]) box(scene, [x - .04, 0, 2.15], [x + .04, 3.6, 2.3], metal, 1);
      box(scene, [-24, 0, -10], [-9.2, 11, 2.4], M('plaster', { base: [190, 186, 178], key: 'n3' }), 3);
      box(scene, [9.2, 0, -10], [26, 8, 2.4], M('plaster', { base: [214, 208, 198], key: 'n4' }), 3);
      box(scene, [-9.2, 5.4, -10], [9.2, 9, 2.8], M('plaster', { base: [206, 198, 186], key: 'n5' }), 3);
      box(scene, [-40, -.3, 2], [40, 0, 9], M('stone', { base: [178, 174, 166], tile: 8, veins: false, key: 'calc2' }), 3);
      box(scene, [-40, -.5, 9], [40, -.3, 30], M('stone', { base: [70, 70, 68], tile: 1, veins: false, key: 'asph' }), 3);
      tree(scene, -12, 0, 6.5, 1.25); tree(scene, 14, 0, 6.5, 1.25);
      scene.background = skyTexture('#9fb0b8', '#d8d4ca', '#e6decd'); fogged(scene, 0xddd6c8, .006);
      sunLight(scene, [-20, 26, 30], 0xfff0d8, 2.4, 30); scene.add(new THREE.HemisphereLight(0xd0d9de, 0x6a6150, 0.55));
      look(cam, [7, 1.7, 17], [0, 2.5, 0]); return { exposure: 1, envI: .45 };
    }
  },
  'essenza-balcao': {
    fov: 50, build(scene, cam) {
      essenza(scene); scene.background = skyTexture('#cfc8bb', '#d8d0c2', '#ded6c8');
      const front = new THREE.DirectionalLight(0xfff2de, 1.2); front.position.set(4, 6, 12); scene.add(front);
      sunLight(scene, [6, 9, 14], 0xfff0dc, 1.2, 14, [0, 0, -4]); scene.add(new THREE.HemisphereLight(0xf2e8da, 0x8a7a64, 0.72));
      look(cam, [6.4, 1.65, 1.6], [-1, 1.25, -5]); return { exposure: 1, envI: .6 };
    }
  },
  'essenza-espera': {
    fov: 46, build(scene, cam) {
      essenza(scene); scene.background = skyTexture('#cfc8bb', '#d8d0c2', '#ded6c8');
      sunLight(scene, [6, 9, 14], 0xfff0dc, 1.5, 14, [0, 0, -4]); scene.add(new THREE.HemisphereLight(0xf2e8da, 0x8a7a64, 0.77));
      look(cam, [-1.2, 1.4, 2.4], [-7, 1.1, -2.4]); return { exposure: 1, envI: .6 };
    }
  },
  'materiais': {
    fov: 30, build(scene, cam) {
      materiais(scene); scene.background = new THREE.Color(0x2a2b28);
      sunLight(scene, [-8, 5, 2], 0xffe3c0, 3.2, 4); scene.add(new THREE.HemisphereLight(0xcfd6d8, 0x3a332a, 0.28));
      look(cam, [1.2, 3.6, 3.6], [0, 0, -.1]); return { exposure: 1, envI: .3 };
    }
  },
  'detalhe-brise': {
    fov: 34, build(scene, cam) {
      detalhe(scene); scene.background = new THREE.Color(0x9a978f);
      sunLight(scene, [-16, 12, 9], 0xffdcb0, 3.8, 12); scene.add(new THREE.HemisphereLight(0xcfd6d8, 0x5a5040, 0.33));
      look(cam, [4.6, 1.1, 8.4], [-.6, 2.9, 0]); return { exposure: 1, envI: .3 };
    }
  },
  'estudio': {
    fov: 48, build(scene, cam) {
      interiorStudio(scene); scene.background = skyTexture('#b8c3c6', '#dcdcd4', '#e6e2d8');
      sunLight(scene, [-30, 18, 8], 0xffe8c8, 3, 14, [0, 0, -2]); scene.add(new THREE.HemisphereLight(0xe3e6e2, 0x6a5e4e, 0.66));
      look(cam, [5.6, 1.7, 2.6], [-1.6, 1.1, -3.8]); return { exposure: 1, envI: .5 };
    }
  },
  'maquete': {
    fov: 30, build(scene, cam) {
      maquete(scene); scene.background = new THREE.Color(0x32362f);
      sunLight(scene, [-5, 4, 2], 0xfff0dc, 3.2, 3); scene.add(new THREE.HemisphereLight(0xdfe4e2, 0x403a30, 0.39));
      look(cam, [1.25, .55, 1.25], [0, .1, -.05]); return { exposure: 1, envI: .4, aoRadius: .05 };
    }
  },
  'obra': {
    fov: 38, build(scene, cam) {
      obra(scene); scene.background = skyTexture('#a9b2b4', '#d2d1c9', '#dcd8cc'); fogged(scene, 0xd4d2c9, .008);
      sunLight(scene, [-20, 26, 24], 0xfff0dc, 2.4, 30); scene.add(new THREE.HemisphereLight(0xd0d7d9, 0x6a6150, 0.61));
      look(cam, [21, 3.2, 24], [0, 4.6, 0]); return { exposure: .95, envI: .4 };
    }
  },
  'retrofit': {
    fov: 40, build(scene, cam) {
      retrofit(scene); scene.background = skyTexture('#97aab4', '#d4d2ca', '#e2dccd'); fogged(scene, 0xd8d4c8, .006);
      sunLight(scene, [24, 26, 26], 0xffe8c8, 2.8, 30); scene.add(new THREE.HemisphereLight(0xd0d9de, 0x6a6150, 0.55));
      look(cam, [-10, 1.7, 20], [0, 5.4, -4]); return { exposure: .95, envI: .45 };
    }
  },
};
