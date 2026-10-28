import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { SCENES } from './catalog.js';
import * as L from './lib.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const W = 1920, H = 1200, SS = 1.5;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W * SS, H * SS);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const pmrem = new THREE.PMREMGenerator(renderer);
const envTex = pmrem.fromScene(new RoomEnvironment(), .04).texture;
function skyEnv(top, mid, bottom) {
  const es = new THREE.Scene();
  const mat = new THREE.ShaderMaterial({ side: THREE.BackSide, uniforms: { t: { value: new THREE.Color(top) }, m: { value: new THREE.Color(mid) }, b: { value: new THREE.Color(bottom) }, g: { value: new THREE.Color(0x6b6656) } },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: 'uniform vec3 t,m,b,g; varying vec3 vP; void main(){ float y = vP.y; vec3 c = y > 0. ? mix(b, mix(m, t, smoothstep(.1,.8,y)), smoothstep(0.,.1,y)) : mix(b*.8, g, smoothstep(0.,-.2,y)); gl_FragColor = vec4(c*1.15,1.); }' });
  es.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), mat));
  return pmrem.fromScene(es, 0).texture;
}

// Pós-processamento: grão de filme, vinheta e gradação suave (quente nas luzes, fria nas sombras)
function post(src, w, h, opts = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const ctx = c.getContext('2d');
  ctx.imageSmoothingQuality = 'high'; ctx.drawImage(src, 0, 0, w, h);
  const img = ctx.getImageData(0, 0, w, h); const d = img.data; const cx = w / 2, cy = h / 2, md = Math.hypot(cx, cy);
  const grain = opts.grain ?? 7, vig = opts.vignette ?? .32;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4; let r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255;
    const l = .2126 * r + .7152 * g + .0722 * b;
    // split-tone
    r += (l - .5) * .035; b -= (l - .5) * .03;
    // curva S suave
    const s = (v) => v + (v - .5) * (1 - Math.abs(v - .5) * 2) * .12; r = s(r); g = s(g); b = s(b);
    const dist = Math.hypot(x - cx, y - cy) / md; const v = 1 - vig * Math.pow(dist, 2.2);
    const n = (Math.random() - .5) * grain / 255;
    d[i] = Math.max(0, Math.min(255, (r * v + n) * 255)); d[i + 1] = Math.max(0, Math.min(255, (g * v + n) * 255)); d[i + 2] = Math.max(0, Math.min(255, (b * v + n) * 255));
  }
  ctx.putImageData(img, 0, 0); return c;
}

window.SCENE_NAMES = Object.keys(SCENES);
window.renderScene = async (name) => {
  const def = SCENES[name]; const scene = new THREE.Scene(); scene.environment = envTex;
  const camera = new THREE.PerspectiveCamera(def.fov || 35, W / H, .1, 2000);
  L.setLastSkyNull?.();
  const meta = def.build(scene, camera, renderer) || {};
  if (L.lastSky) scene.environment = skyEnv(...L.lastSky);
  renderer.toneMappingExposure = meta.exposure ?? 1;
  if (scene.environment) scene.environmentIntensity = meta.envI ?? .5;
  const composer = new EffectComposer(renderer); composer.setPixelRatio(1); composer.setSize(W * SS, H * SS);
  composer.addPass(new RenderPass(scene, camera));
  const ao = new GTAOPass(scene, camera, W * SS, H * SS); ao.updateGtaoMaterial({ radius: meta.aoRadius ?? .6, distanceExponent: 1.6, thickness: 1.5, scale: 1.2, samples: 16 }); ao.blendIntensity = meta.ao ?? 1; composer.addPass(ao);
  composer.addPass(new OutputPass());
  composer.render();
  const big = post(renderer.domElement, W, H, meta.post);
  const half = document.createElement('canvas'); half.width = W / 2; half.height = H / 2; const hc = half.getContext('2d'); hc.imageSmoothingQuality = 'high'; hc.drawImage(big, 0, 0, W / 2, H / 2);
  scene.traverse(o => { if (o.geometry) o.geometry.dispose(); });
  return { full: big.toDataURL('image/webp', .84), half: half.toDataURL('image/webp', .8) };
};
window.READY = true;
