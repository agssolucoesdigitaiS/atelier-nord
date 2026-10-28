import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '../../lib/gsap';
import { experienceStages, hotspots } from '../../data/content';
import { useReducedMotion } from '../../hooks/useMedia';
import { Img } from '../ui/Img';
import { SplitLines } from '../motion/SplitLines';

const HouseScene = lazy(() => import('../three/HouseScene'));
export const EXPERIENCE_FALLBACK = 'casa-3d';

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}

function HotspotChips({ active, setActive }: { active: string | null; setActive: (id: string | null) => void }) {
  const cur = hotspots.find((h) => h.id === active);
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {hotspots.map((h, i) => (
          <button key={h.id} type="button" aria-pressed={active === h.id} onClick={() => setActive(active === h.id ? null : h.id)} className={`flex min-h-[40px] items-center gap-2 rounded-full border px-3 text-xs ${active === h.id ? 'border-paper bg-paper text-ink' : 'border-paper/40 bg-ink/50'}`}>
            <span className="font-semibold">{i + 1}</span>{h.title}
          </button>
        ))}
      </div>
      {cur && <p className="bg-ink/70 p-3 text-sm text-paper/80">{cur.text}</p>}
    </div>
  );
}

function HotspotList({ active, setActive }: { active: string | null; setActive: (id: string | null) => void }) {
  return (
    <div className="grid gap-px">
      <p className="label mb-3 text-paper/50">Pontos de interesse</p>
      {hotspots.map((h, i) => {
        const on = active === h.id;
        return (
          <div key={h.id} className="border-t border-paper/15">
            <button type="button" aria-expanded={on} aria-controls={`hs-${h.id}`} onClick={() => setActive(on ? null : h.id)} className="flex w-full items-center gap-4 py-3 text-left">
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] font-semibold transition-colors ${on ? 'border-paper bg-paper text-ink' : 'border-paper/50'}`}>{i + 1}</span>
              <span className="font-serif text-xl">{h.title}</span>
            </button>
            <p id={`hs-${h.id}`} hidden={!on} className="pb-4 pl-11 text-sm text-paper/70">{h.text}</p>
          </div>
        );
      })}
    </div>
  );
}

export function Experience3D() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => { setWebgl(hasWebGL()); }, []);
  const interactive = webgl === true && !reduced;

  // carregamento tardio: o chunk 3D só é baixado quando a seção se aproxima
  useEffect(() => {
    if (!interactive || !track.current) return;
    const el = track.current;
    const ioNear = new IntersectionObserver(([e]) => { if (e.isIntersecting) setNear(true); }, { rootMargin: '900px 0px' });
    const ioVis = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px 0px' });
    ioNear.observe(el); ioVis.observe(el);
    return () => { ioNear.disconnect(); ioVis.disconnect(); };
  }, [interactive]);

  useGSAP(() => {
    if (!interactive) return;
    const st = ScrollTrigger.create({
      trigger: track.current, start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
        const s = self.progress < 0.3 ? 0 : self.progress < 0.62 ? 1 : 2;
        setStage((prev) => (prev === s ? prev : s));
      },
    });
    gsap.fromTo(ref.current!.querySelector('[data-x-bar]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: track.current, start: 'top top', end: 'bottom bottom', scrub: true } });
    return () => st.kill();
  }, { scope: ref, dependencies: [interactive] });

  return (
    <section ref={ref} id="experiencia" tabIndex={-1} data-tone="dark" className="relative bg-[#1f211e] text-paper outline-none" aria-labelledby="exp-title">
      <div className="px-site grid grid-cols-12 gap-x-6 gap-y-8 pb-12 pt-[clamp(96px,14vh,180px)]">
        <p className="label col-span-12 flex gap-4 text-sand md:col-span-3"><span className="num">(04)</span> Experiência 3D</p>
        <SplitLines id="exp-title" text={'Uma casa,\ntrês leituras.'} className="display h-lg col-span-12 md:col-span-6" />
        <p className="col-span-12 self-end text-sm text-paper/60 md:col-span-3">Modelo conceitual da Casa Horizonte. Role para mudar o ponto de vista; use os pontos numerados para ver cada decisão de projeto.</p>
      </div>

      {interactive ? (
        <div ref={track} className="relative" style={{ height: '340vh' }}>
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            <div className="absolute inset-0">
              {/* pôster enquanto a cena carrega */}
              <div className={`absolute inset-0 transition-opacity duration-1000 ${sceneReady ? 'opacity-0' : 'opacity-100'}`}>
                <Img name={EXPERIENCE_FALLBACK} alt="" reveal="none" className="h-full w-full" />
              </div>
              {near && (
                <Suspense fallback={null}>
                  <HouseScene progress={progress} active={active} onSelect={(id) => setActive(id)} running={visible} onReady={() => setSceneReady(true)} />
                </Suspense>
              )}
            </div>

            <div className="px-site pointer-events-none relative flex h-full flex-col justify-between" style={{ paddingTop: 'calc(100px + env(safe-area-inset-top, 0px))', paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))' }}>
              <div className="flex items-start justify-between gap-6">
                <ol className="flex gap-6" aria-label="Etapas da leitura">
                  {experienceStages.map((s, i) => (
                    <li key={s.index} className={`label transition-opacity duration-500 ${stage === i ? 'opacity-100' : 'opacity-40'}`} aria-current={stage === i ? 'step' : undefined}>{s.index} · {s.title}</li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-12 items-end gap-6">
                <div className="col-span-12 md:col-span-6" aria-live="polite">
                  {experienceStages.map((s, i) => (
                    <div key={s.index} hidden={stage !== i} className="max-w-[44ch]">
                      <p className="display h-md">{s.title}</p>
                      <p className="mt-3 text-sm text-paper/75 md:text-base">{s.text}</p>
                    </div>
                  ))}
                </div>
                <div className="pointer-events-auto col-span-12 hidden bg-ink/55 p-5 backdrop-blur-sm md:col-span-4 md:col-start-9 md:block">
                  <HotspotList active={active} setActive={setActive} />
                </div>
                <div className="pointer-events-auto col-span-12 md:hidden">
                  <HotspotChips active={active} setActive={setActive} />
                </div>
                <div className="col-span-12 h-px bg-paper/15"><div data-x-bar className="h-full origin-left bg-paper/80" /></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-site grid grid-cols-12 gap-6 pb-[clamp(96px,14vh,180px)]">
          <div className="col-span-12 lg:col-span-8">
            <Img name={EXPERIENCE_FALLBACK} alt="Modelo conceitual da Casa Horizonte: volume de concreto em balanço sobre térreo envidraçado e volume de madeira." className="aspect-[16/10] w-full" sizes="(min-width: 1024px) 66vw, 100vw" />
            {webgl === false && <p className="mt-3 text-xs text-paper/50">Seu navegador não oferece WebGL; exibimos uma imagem do modelo.</p>}
          </div>
          <div className="col-span-12 grid content-start gap-8 lg:col-span-4">
            <ol className="grid gap-6">
              {experienceStages.map((s) => (
                <li key={s.index} className="border-t border-paper/15 pt-4"><p className="label text-sand">{s.index} · {s.title}</p><p className="mt-2 text-sm text-paper/75">{s.text}</p></li>
              ))}
            </ol>
            <HotspotList active={active} setActive={setActive} />
          </div>
        </div>
      )}
    </section>
  );
}
