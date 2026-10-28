// Biblioteca de materiais e primitivas para os renders demonstrativos do ATELIER NÓRD.
// Tudo é procedural: nenhuma fotografia ou textura de terceiros.
import * as THREE from 'three';

// ---------- aleatoriedade determinística ----------
let seed = 7;
export function setSeed(s) { seed = s; }
export function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
export const rr = (a, b) => a + (b - a) * rnd();

// ---------- ruído de valor ----------
function hash(x, y, s) { let h = x * 374761393 + y * 668265263 + s * 2147483647; h = (h ^ (h >> 13)) * 1274126177; return ((h ^ (h >> 16)) >>> 0) / 4294967295; }
function smooth(t) { return t * t * (3 - 2 * t); }
function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = smooth(x - xi), yf = smooth(y - yi);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}
export function fbm(x, y, oct = 5, s = 1) { let v = 0, amp = .5, f = 1; for (let i = 0; i < oct; i++) { v += amp * vnoise(x * f, y * f, s + i); f *= 2; amp *= .5; } return v; }

// ---------- canvas helpers ----------
function cnv(w, h = w) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function pixelFill(c, fn) {
  const ctx = c.getContext('2d'); const img = ctx.createImageData(c.width, c.height); const d = img.data;
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) { const [r, g, b] = fn(x, y); const i = (y * c.width + x) * 4; d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255; }
  ctx.putImageData(img, 0, 0); return c;
}
function tex(c, srgb = true) { const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; }
function heightToNormal(c, strength = 2) {
  const w = c.width, h = c.height; const src = c.getContext('2d').getImageData(0, 0, w, h).data;
  const out = cnv(w, h); const ctx = out.getContext('2d'); const img = ctx.createImageData(w, h); const d = img.data;
  const H = (x, y) => src[(((y + h) % h) * w + ((x + w) % w)) * 4] / 255;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = (H(x + 1, y) - H(x - 1, y)) * strength, dy = (H(x, y + 1) - H(x, y - 1)) * strength;
    const nz = 1 / Math.sqrt(dx * dx + dy * dy + 1); const i = (y * w + x) * 4;
    d[i] = (-dx * nz * .5 + .5) * 255; d[i + 1] = (dy * nz * .5 + .5) * 255; d[i + 2] = nz * 255; d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0); return tex(out, false);
}
const clamp = (v) => Math.max(0, Math.min(255, v));

// ---------- texturas ----------
const cache = {};
function once(k, f) { return cache[k] || (cache[k] = f()); }

export function concreteTex(tone = 1) {
  return once('concrete' + tone, () => {
    const S = 512; const hc = cnv(S);
    pixelFill(hc, (x, y) => { const n = fbm(x / 60, y / 60, 5, 3) * .7 + fbm(x / 6, y / 6, 2, 9) * .3; const v = n * 255; return [v, v, v]; });
    const c = cnv(S); const ctx = c.getContext('2d');
    pixelFill(c, (x, y) => {
      const n = fbm(x / 70, y / 70, 5, 3), f = fbm(x / 5, y / 5, 2, 11), st = fbm(x / 200, y / 30, 3, 5);
      let v = 150 + (n - .5) * 60 + (f - .5) * 18 + (st - .5) * 25; v *= tone;
      return [clamp(v * 1.0), clamp(v * .985), clamp(v * .95)];
    });
    // juntas de fôrma e furos de tirante
    ctx.strokeStyle = 'rgba(60,58,54,.35)'; ctx.lineWidth = 1.2;
    for (let y = 0; y <= S; y += S / 2) { ctx.beginPath(); ctx.moveTo(0, y + .5); ctx.lineTo(S, y + .5); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(S * .5, 0); ctx.lineTo(S * .5, S); ctx.stroke();
    ctx.fillStyle = 'rgba(55,52,48,.55)';
    for (let y = S / 8; y < S; y += S / 4) for (let x = S / 8; x < S; x += S / 4) { ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill(); }
    return { map: tex(c), normal: heightToNormal(hc, 1.2) };
  });
}
export function woodTex(tone = 1, slat = true) {
  return once('wood' + tone + slat, () => {
    const W = 512, H = 512; const c = cnv(W, H); const n = slat ? 8 : 4;
    pixelFill(c, (x, y) => {
      const plank = Math.floor(x / (W / n)); const px = (x % (W / n)) / (W / n);
      const g = fbm(x / 3 + plank * 40, y / 90, 4, plank + 2); const ring = Math.sin((x / 2.2 + g * 30) + plank) * .5 + .5;
      let v = .55 + (g - .5) * .5 + ring * .12 + (hash(plank, 1, 4) - .5) * .18;
      if (slat && (px < .06 || px > .94)) v *= .35;
      v *= tone; return [clamp(150 * v + 30), clamp(105 * v + 18), clamp(70 * v + 10)];
    });
    const hc = cnv(W, H); pixelFill(hc, (x, y) => { const px = (x % (W / n)) / (W / n); const v = slat && (px < .06 || px > .94) ? 0 : 200 + fbm(x / 3, y / 60, 3, 2) * 55; return [v, v, v]; });
    return { map: tex(c), normal: heightToNormal(hc, slat ? 2.5 : .8) };
  });
}
export function stoneTex(base = [196, 188, 172], tile = 2, veins = true, key = 's') {
  return once('stone' + key, () => {
    const S = 512; const c = cnv(S); const ctx = c.getContext('2d');
    pixelFill(c, (x, y) => {
      const n = fbm(x / 40, y / 40, 5, 21), v2 = veins ? Math.pow(Math.abs(Math.sin(y / 14 + fbm(x / 60, y / 40, 4, 4) * 6)), 30) * .5 : 0;
      const pores = fbm(x / 2.5, y / 2.5, 1, 7) > .82 ? -22 : 0;
      const k = 1 + (n - .5) * .16 - v2 * .1;
      return [clamp(base[0] * k + pores), clamp(base[1] * k + pores), clamp(base[2] * k + pores)];
    });
    ctx.strokeStyle = 'rgba(70,64,56,.45)'; ctx.lineWidth = 1.5;
    for (let i = 0; i <= tile; i++) { const p = i * S / tile; ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, S); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(S, p); ctx.stroke(); }
    return { map: tex(c) };
  });
}
export function grassTex() {
  return once('grass', () => {
    const S = 512; const c = cnv(S);
    pixelFill(c, (x, y) => { const n = fbm(x / 30, y / 30, 5, 31), f = fbm(x / 2, y / 2, 2, 8), stripe = Math.sin(x / 40) * .04; const k = .75 + (n - .5) * .6 + (f - .5) * .3 + stripe; return [clamp(104 * k), clamp(118 * k), clamp(70 * k)]; });
    return { map: tex(c) };
  });
}
export function plasterTex(base = [236, 232, 224], key = 'p') {
  return once('plaster' + key, () => {
    const S = 256; const c = cnv(S);
    pixelFill(c, (x, y) => { const n = fbm(x / 25, y / 25, 4, 41); const k = 1 + (n - .5) * .07; return [clamp(base[0] * k), clamp(base[1] * k), clamp(base[2] * k)]; });
    return { map: tex(c) };
  });
}
export function brickTex() {
  return once('brick', () => {
    const W = 512, H = 512; const c = cnv(W, H); const bh = 32, bw = 96;
    pixelFill(c, (x, y) => {
      const row = Math.floor(y / bh); const off = row % 2 ? bw / 2 : 0; const bx = Math.floor((x + off) / bw);
      const mx = (x + off) % bw, my = y % bh; const mortar = mx < 5 || my < 5;
      if (mortar) { const v = 175 + fbm(x / 4, y / 4, 2, 3) * 30; return [v, v * .96, v * .9]; }
      const t = hash(bx, row, 9); const n = fbm(x / 8, y / 8, 3, 5);
      const k = .75 + t * .35 + (n - .5) * .3; return [clamp(150 * k), clamp(84 * k), clamp(62 * k)];
    });
    return { map: tex(c) };
  });
}
export function paperPlanTex() {
  return once('plan', () => {
    const S = 1024; const c = cnv(S); const ctx = c.getContext('2d');
    ctx.fillStyle = '#f2efe8'; ctx.fillRect(0, 0, S, S);
    ctx.strokeStyle = '#2b2b2a'; ctx.lineWidth = 3;
    const rooms = [[120, 140, 420, 300], [540, 140, 360, 300], [120, 440, 260, 380], [380, 440, 520, 380]];
    rooms.forEach(([x, y, w, h]) => ctx.strokeRect(x, y, w, h));
    ctx.lineWidth = 1; for (let i = 0; i < 40; i++) { ctx.beginPath(); const x = 120 + rnd() * 780, y = 140 + rnd() * 680; ctx.moveTo(x, y); ctx.lineTo(x + rr(-80, 80), y + rr(-4, 4)); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(540, 440, 80, 0, Math.PI / 2); ctx.stroke();
    ctx.font = '22px serif'; ctx.fillStyle = '#555'; ctx.fillText('PLANTA — NÍVEL 01   1:50', 120, 900);
    return { map: tex(c) };
  });
}
export function matTex() {
  return once('mat', () => {
    const S = 512; const c = cnv(S); const ctx = c.getContext('2d');
    ctx.fillStyle = '#3f5148'; ctx.fillRect(0, 0, S, S); ctx.strokeStyle = 'rgba(230,230,220,.35)'; ctx.lineWidth = 1;
    for (let i = 0; i <= S; i += 32) { ctx.beginPath(); ctx.moveTo(i + .5, 0); ctx.lineTo(i + .5, S); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i + .5); ctx.lineTo(S, i + .5); ctx.stroke(); }
    return { map: tex(c) };
  });
}
export function linenTex(base = [214, 204, 186], key = 'l') {
  return once('linen' + key, () => {
    const S = 256; const c = cnv(S);
    pixelFill(c, (x, y) => { const w = (Math.sin(x * 1.7) + Math.sin(y * 1.9)) * .03; const n = fbm(x / 20, y / 20, 3, 51); const k = .94 + w + (n - .5) * .1; return [clamp(base[0] * k), clamp(base[1] * k), clamp(base[2] * k)]; });
    return { map: tex(c) };
  });
}

// ---------- materiais ----------
function rep(t, sx, sy) { const c = t.clone(); c.needsUpdate = true; c.repeat.set(sx, sy); return c; }
export function M(kind, o = {}) {
  const std = (p) => new THREE.MeshStandardMaterial(p);
  switch (kind) {
    case 'concrete': { const t = concreteTex(o.tone || 1); return std({ map: t.map, normalMap: t.normal, normalScale: new THREE.Vector2(.5, .5), roughness: .92, color: o.color || 0xffffff }); }
    case 'wood': { const t = woodTex(o.tone || 1, o.slat !== false); return std({ map: t.map, normalMap: t.normal, normalScale: new THREE.Vector2(.8, .8), roughness: .72 }); }
    case 'stone': { const t = stoneTex(o.base, o.tile, o.veins, o.key); return std({ map: t.map, roughness: o.rough ?? .6 }); }
    case 'grass': return std({ map: grassTex().map, roughness: 1 });
    case 'plaster': return std({ map: plasterTex(o.base, o.key).map, roughness: .95 });
    case 'brick': return std({ map: brickTex().map, roughness: .95 });
    case 'linen': return std({ map: linenTex(o.base, o.key).map, roughness: 1 });
    case 'plan': return std({ map: paperPlanTex().map, roughness: .9 });
    case 'mat': return std({ map: matTex().map, roughness: .9 });
    case 'glass': return new THREE.MeshPhysicalMaterial({ color: o.color || 0x2e3a3c, roughness: .03, metalness: .35, envMapIntensity: 1.8, transparent: !!o.opacity, opacity: o.opacity ?? 1, clearcoat: 1 });
    case 'water': return new THREE.MeshPhysicalMaterial({ color: 0x2f5f63, roughness: .06, metalness: .1, envMapIntensity: 1.2, clearcoat: 1 });
    case 'metal': return std({ color: o.color || 0x1b1c1b, roughness: .45, metalness: .6 });
    case 'white': return std({ color: o.color || 0xf1eee8, roughness: .85 });
    case 'emissive': return std({ color: 0x000000, emissive: o.color || 0xffc98a, emissiveIntensity: o.i ?? 2.2 });
    case 'leaf': return std({ color: o.color || 0x3d4a33, roughness: .9, flatShading: true });
    case 'sea': return new THREE.MeshPhysicalMaterial({ color: 0x3d6b7a, roughness: .18, metalness: .1, clearcoat: .6 });
    case 'dirt': { const t = stoneTex([168, 150, 122], 1, false, 'dirt'); return std({ map: t.map, roughness: 1 }); }
    default: return std({ color: o.color || 0x888888, roughness: .8 });
  }
}

// mapeamento UV em "box mapping" pelo tamanho real (m)
export function worldUV(g, scale = 3) {
  g = g.index ? g.toNonIndexed() : g; g.computeVertexNormals();
  const p = g.attributes.position, n = g.attributes.normal, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let u, v; if (ax >= ay && ax >= az) { u = p.getZ(i); v = p.getY(i); } else if (ay >= az) { u = p.getX(i); v = p.getZ(i); } else { u = p.getX(i); v = p.getY(i); }
    uv[i * 2] = u / scale; uv[i * 2 + 1] = v / scale;
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return g;
}

export function box(scene, [x0, y0, z0], [x1, y1, z1], mat, uvScale = 3, shadow = true) {
  const w = x1 - x0, h = y1 - y0, d = z1 - z0;
  const g = new THREE.BoxGeometry(w, h, d); g.translate(x0 + w / 2, y0 + h / 2, z0 + d / 2);
  const m = new THREE.Mesh(worldUV(g, uvScale), mat); m.castShadow = shadow; m.receiveShadow = true; scene.add(m); return m;
}
export function mesh(scene, geo, mat, pos = [0, 0, 0], rot = [0, 0, 0], uvScale = null) {
  const m = new THREE.Mesh(uvScale ? worldUV(geo, uvScale) : geo, mat); m.position.set(...pos); m.rotation.set(...rot); m.castShadow = true; m.receiveShadow = true; scene.add(m); return m;
}

// ---------- vegetação (estilo maquete refinada) ----------
const leafMats = [0x4a5a3a, 0x56653f, 0x3f4d33, 0x667148].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: .95 }));
const pineMat = new THREE.MeshStandardMaterial({ color: 0x34402f, roughness: .95 });
const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3c30, roughness: 1 });
export function tree(scene, x, y, z, s = 1, kind = 'round') {
  const g = new THREE.Group(); g.position.set(x, y, z); scene.add(g);
  const th = 2.2 * s; const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.08 * s, .14 * s, th, 6), trunkMat); trunk.position.y = th / 2; trunk.castShadow = true; g.add(trunk);
  if (kind === 'pine') {
    for (let i = 0; i < 4; i++) { const r = (1.6 - i * .32) * s, h = 2.4 * s; const c = new THREE.Mesh(new THREE.ConeGeometry(r, h, 18), pineMat); c.position.y = th * .6 + i * 1.15 * s + h / 2; c.castShadow = true; c.receiveShadow = true; g.add(c); }
  } else {
    const n = 14 + Math.floor(rnd() * 8);
    for (let i = 0; i < n; i++) { const r = rr(.45, .95) * s; const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 3), leafMats[Math.floor(rnd() * leafMats.length)]); m.position.set(rr(-1.4, 1.4) * s, th + rr(.1, 2) * s, rr(-1.4, 1.4) * s); m.castShadow = true; m.receiveShadow = true; g.add(m); }
  }
  return g;
}
export function shrub(scene, x, y, z, s = 1) {
  const n = 3 + Math.floor(rnd() * 3);
  for (let i = 0; i < n; i++) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(rr(.35, .6) * s, 3), leafMats[Math.floor(rnd() * 4)]); m.position.set(x + rr(-.5, .5) * s, y + rr(.2, .5) * s, z + rr(-.5, .5) * s); m.castShadow = true; m.receiveShadow = true; scene.add(m); }
}
export function plant(scene, x, y, z, s = 1) {
  mesh(scene, new THREE.CylinderGeometry(.22 * s, .17 * s, .5 * s, 20), M('white', { color: 0xd9d2c4 }), [x, y + .25 * s, z]);
  for (let i = 0; i < 9; i++) { const l = new THREE.Mesh(new THREE.ConeGeometry(.09 * s, rr(.9, 1.5) * s, 4), leafMats[i % 4]); l.position.set(x + rr(-.15, .15) * s, y + .9 * s, z + rr(-.15, .15) * s); l.rotation.set(rr(-.5, .5), rnd() * 3, rr(-.5, .5)); l.castShadow = true; scene.add(l); }
}

// ---------- céu, luz, render ----------
export let lastSky = null;
export function setLastSkyNull() { lastSky = null; }
export function skyTexture(top, mid, bottom, sun = null) {
  lastSky = [top, mid, bottom];
  const c = cnv(64, 512); const ctx = c.getContext('2d'); const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, top); g.addColorStop(.62, mid); g.addColorStop(1, bottom); ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 512);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function sunLight(scene, pos, color = 0xfff1dc, intensity = 3, extent = 40, target = [0, 0, 0]) {
  const s = new THREE.DirectionalLight(color, intensity); s.position.set(...pos); s.target.position.set(...target); scene.add(s.target);
  s.castShadow = true; s.shadow.mapSize.set(4096, 4096); const c = s.shadow.camera; c.left = c.bottom = -extent; c.right = c.top = extent; c.near = 1; c.far = 300; s.shadow.bias = -.0004; s.shadow.normalBias = .03; s.shadow.radius = 3;
  scene.add(s); return s;
}
