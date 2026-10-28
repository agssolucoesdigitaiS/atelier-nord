import { useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

/*
 * Cena WebGL autoral: residência conceitual de volumes simples.
 * Orçamento: ~40 draw calls, sem texturas externas, DPR limitado a 1.5, uma luz com sombra 1024².
 * O progresso (0–1) vem do scroll da seção; a câmera percorre fachada → volumetria → materialidade.
 */

type Props = {
  progress: MutableRefObject<number>;
  active: string | null;
  onSelect: (id: string) => void;
  running: boolean;
  onReady?: () => void;
};

const CLAY = new THREE.Color('#dedad1');
const C = {
  concrete: new THREE.Color('#9d9a92'),
  wood: new THREE.Color('#8a603f'),
  glass: new THREE.Color('#33403f'),
  deck: new THREE.Color('#cdc4b4'),
  water: new THREE.Color('#4f7372'),
  ground: new THREE.Color('#6f7a5c'),
  leaf: new THREE.Color('#55613f'),
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const band = (p: number, a: number, b: number) => THREE.MathUtils.clamp((p - a) / (b - a), 0, 1);

function useMat(color: THREE.Color, opts: THREE.MeshStandardMaterialParameters = {}) {
  return useMemo(() => new THREE.MeshStandardMaterial({ color: CLAY.clone(), roughness: 0.85, ...opts, userData: { target: color } }), []); // eslint-disable-line react-hooks/exhaustive-deps
}

function Box({ p, s, m, cast = true }: { p: [number, number, number]; s: [number, number, number]; m: THREE.Material; cast?: boolean }) {
  return (
    <mesh position={p} castShadow={cast} receiveShadow material={m}>
      <boxGeometry args={s} />
    </mesh>
  );
}

function House({ progress }: { progress: MutableRefObject<number> }) {
  const upper = useRef<THREE.Group>(null);
  const woodVol = useRef<THREE.Group>(null);
  const smooth = useRef(0);
  const concrete = useMat(C.concrete);
  const wood = useMat(C.wood, { roughness: 0.7 });
  const glass = useMemo(() => new THREE.MeshStandardMaterial({ color: CLAY.clone(), roughness: 0.08, metalness: 0.4, transparent: true, opacity: 0.55, userData: { target: C.glass } }), []);
  const deck = useMat(C.deck);
  const water = useMemo(() => new THREE.MeshStandardMaterial({ color: CLAY.clone(), roughness: 0.1, metalness: 0.2, userData: { target: C.water } }), []);
  const leaf = useMat(C.leaf, { roughness: 0.95 });
  const mats = [concrete, wood, glass, deck, water, leaf];

  useFrame((_, dt) => {
    smooth.current = THREE.MathUtils.damp(smooth.current, progress.current, 4, dt);
    const p = smooth.current;
    // B — volumetria: os volumes se separam e voltam
    const v = Math.sin(band(p, 0.28, 0.66) * Math.PI);
    if (upper.current) upper.current.position.y = ease(v) * 3.2;
    if (woodVol.current) woodVol.current.position.x = -ease(v) * 3.4;
    // C — materialidade: do branco de maquete para os materiais
    const m = ease(band(p, 0.62, 0.86));
    mats.forEach((mat) => (mat as THREE.MeshStandardMaterial).color.copy(CLAY).lerp(mat.userData.target, m));
  });

  const trees: [number, number, number][] = [[-20, -12, 1.4], [-12, -15, 1.7], [-2, -16, 1.5], [9, -15, 1.8], [19, -12, 1.4], [-24, 6, 1.3], [26, 2, 1.5]];
  return (
    <group>
      {/* deck e espelho d'água */}
      <Box p={[1, 0.15, 2]} s={[34, 0.3, 18]} m={deck} />
      <Box p={[10, 0.32, 7.4]} s={[14, 0.06, 4.4]} m={water} cast={false} />
      {/* volume de madeira (apoio) */}
      <group ref={woodVol}>
        <Box p={[-10, 1.95, -1]} s={[6, 3.3, 8]} m={wood} />
      </group>
      {/* caixa de vidro térrea */}
      <Box p={[0, 1.95, -4.35]} s={[14, 3.3, 0.3]} m={concrete} />
      <Box p={[0, 1.95, 2.25]} s={[14, 3.3, 0.08]} m={glass} cast={false} />
      <Box p={[6.95, 1.95, -1]} s={[0.08, 3.3, 6.5]} m={glass} cast={false} />
      <Box p={[-2.2, 0.75, -1.4]} s={[3.5, 0.6, 1.2]} m={wood} />
      {/* volume superior em concreto, balanço de 5 m */}
      <group ref={upper}>
        <Box p={[1, 3.6 + 0.45, -0.4]} s={[22, 0.9, 10]} m={concrete} />
        <Box p={[1, 7 - 0.4, -0.4]} s={[22, 0.8, 10]} m={concrete} />
        <Box p={[-8, 5.3, -0.4]} s={[4, 1.6, 10]} m={concrete} />
        <Box p={[11.1, 5.3, -0.4]} s={[1.8, 1.6, 10]} m={concrete} />
        <Box p={[2.1, 5.3, -5]} s={[16.2, 1.6, 0.8]} m={concrete} />
        <Box p={[2.1, 5.3, 3.65]} s={[16.2, 1.6, 0.1]} m={glass} cast={false} />
      </group>
      {trees.map(([x, z, s], i) => (
        <group key={i} position={[x, 0, z]} scale={s}>
          <mesh position={[0, 1.2, 0]} castShadow material={concrete}><cylinderGeometry args={[0.08, 0.12, 2.4, 6]} /></mesh>
          <mesh position={[0, 3, 0]} castShadow receiveShadow material={leaf}><icosahedronGeometry args={[1.5, 2]} /></mesh>
        </group>
      ))}
    </group>
  );
}

function Ground() {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2a2c27', roughness: 1 }), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={mat}>
      <circleGeometry args={[90, 48]} />
    </mesh>
  );
}

const PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(40, 4.5, 48),   // A — fachada, nível do olhar
  new THREE.Vector3(48, 20, 36),
  new THREE.Vector3(22, 40, 46),    // B — vista aérea da volumetria
  new THREE.Vector3(-22, 18, 40),
  new THREE.Vector3(-34, 7, 28),    // C — materiais e encontro dos volumes
]);
const LOOK = [new THREE.Vector3(2, 2.6, 0), new THREE.Vector3(1, 2.4, 0), new THREE.Vector3(-3, 3, 0)];

function Rig({ progress }: { progress: MutableRefObject<number> }) {
  const { camera } = useThree();
  const s = useRef(0);
  const look = useRef(new THREE.Vector3(1, 3.6, 0));
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const { size } = useThree();
  useFrame((state, dt) => {
    // em telas verticais a câmera abre o campo de visão para manter a casa inteira no quadro
    const cam = camera as THREE.PerspectiveCamera;
    const fov = size.width / size.height < 1 ? 58 : size.width / size.height < 1.4 ? 42 : 32;
    if (Math.abs(cam.fov - fov) > 0.01) { cam.fov = fov; cam.updateProjectionMatrix(); }
    s.current = THREE.MathUtils.damp(s.current, progress.current, 3, dt);
    const p = s.current;
    PATH.getPointAt(THREE.MathUtils.clamp(p, 0, 1), tmp);
    // leve paralaxe do ponteiro
    tmp.x += state.pointer.x * 0.8; tmp.y += state.pointer.y * 0.4;
    camera.position.lerp(tmp, 0.2);
    const seg = p < 0.5 ? 0 : 1; const k = p < 0.5 ? p * 2 : (p - 0.5) * 2;
    look.current.copy(LOOK[seg]).lerp(LOOK[seg + 1], k);
    if (size.width / size.height < 1) look.current.y -= 7; // retrato: sobe a casa no quadro, abrindo espaço para o texto
    camera.lookAt(look.current);
  });
  return null;
}

const HOTSPOTS: { id: string; label: string; pos: [number, number, number] }[] = [
  { id: 'luz', label: '1', pos: [4, 5.4, 3.9] },
  { id: 'integracao', label: '2', pos: [3, 1.6, 2.6] },
  { id: 'materialidade', label: '3', pos: [-7, 3.5, 3.1] },
];

function Hotspots({ active, onSelect }: { active: string | null; onSelect: (id: string) => void }) {
  return (
    <>
      {HOTSPOTS.map((h) => (
        <Html key={h.id} position={h.pos} center zIndexRange={[20, 0]}>
          {/* Os controles acessíveis ficam no DOM da seção; estes marcadores são atalhos visuais. */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => onSelect(h.id)}
            data-cursor="Ver detalhe"
            className={`grid h-9 w-9 place-items-center rounded-full border text-[11px] font-semibold backdrop-blur-sm transition-all duration-500 ${active === h.id ? 'scale-110 border-paper bg-paper text-ink' : 'border-paper/70 bg-ink/40 text-paper hover:bg-paper hover:text-ink'}`}
          >
            {h.label}
          </button>
        </Html>
      ))}
    </>
  );
}

export default function HouseScene({ progress, active, onSelect, running, onReady }: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      frameloop={running ? 'always' : 'never'}
      camera={{ fov: 32, near: 0.5, far: 260, position: [40, 4.5, 48] }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; onReady?.(); }}
      aria-hidden="true"
    >
      <color attach="background" args={['#1f211e']} />
      <fog attach="fog" args={['#1f211e', 70, 150]} />
      <hemisphereLight args={['#d8dcd6', '#2a2620', 0.9]} />
      <directionalLight
        position={[30, 26, 18]}
        intensity={2.6}
        color="#ffe6c4"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
        shadow-bias={-0.0005}
      />
      <House progress={progress} />
      <Ground />
      <Hotspots active={active} onSelect={onSelect} />
      <Rig progress={progress} />
    </Canvas>
  );
}
