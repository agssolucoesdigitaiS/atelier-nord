import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, EASE } from '../../lib/gsap';
import { useUI } from '../../lib/ui';
import { Img } from '../ui/Img';
import { site } from '../../data/site';

export const HERO_IMAGE = 'horizonte-crepusculo';
const TITLE = ['Espaços que', 'contam', 'histórias.'];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);
  const { ready, goToSection } = useUI();

  // estado inicial + timeline de abertura (pausado até o preloader terminar)
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.out } });
      tl.fromTo(q('[data-hero-scale]'), { scale: 1.12 }, { scale: 1, duration: 2.6, ease: 'expo.out' })
        .fromTo(q('[data-hero-line]'), { yPercent: 118 }, { yPercent: 0, duration: 1.5, stagger: 0.11 }, 0.15)
        .fromTo(q('[data-hero-fade]'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.09 }, 0.75)
        .fromTo(q('[data-hero-rule]'), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: EASE.inOut }, 0.5);
      intro.current = tl;

      // saída cinematográfica: a imagem recua e é recortada; o título sobe
      gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
        .to(q('[data-hero-media]'), { clipPath: 'inset(0% 0% 14% 0%)', ease: 'none' }, 0)
        .to(q('[data-hero-img]'), { yPercent: 18, scale: 1.08, ease: 'none' }, 0)
        .to(q('[data-hero-content]'), { yPercent: -22, autoAlpha: 0.15, ease: 'none' }, 0);
      return () => { intro.current = null; };
    });
    return () => mm.revert();
  }, { scope: ref });

  useGSAP(() => { if (ready) intro.current?.play(); }, { dependencies: [ready] });

  return (
    <section ref={ref} id="inicio" tabIndex={-1} data-tone="dark" className="relative h-[100svh] min-h-[580px] overflow-hidden bg-ink text-paper outline-none" aria-labelledby="hero-title">
      <div data-hero-media className="absolute inset-0" style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
        <div data-hero-img className="absolute inset-0">
          <div data-hero-scale className="absolute inset-0">
            <Img name={HERO_IMAGE} alt="Render demonstrativo de residência contemporânea ao entardecer: volume de concreto em balanço, térreo de vidro, madeira e jardim." reveal="none" priority className="h-full w-full" />
          </div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,24,22,.55)_0%,rgba(23,24,22,.15)_38%,rgba(23,24,22,.35)_62%,rgba(23,24,22,.82)_100%)]" aria-hidden="true" />
      </div>

      <div data-hero-content className="px-site relative flex h-full flex-col justify-end" style={{ paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))' }}>
        <div className="mb-auto grid grid-cols-12 gap-x-6" style={{ paddingTop: 'calc(118px + env(safe-area-inset-top, 0px))' }}>
          <p data-hero-fade className="label col-span-12 text-paper/70 md:col-span-4">Residências · Interiores · Comercial</p>
          <p data-hero-fade className="label col-span-12 mt-2 text-paper/70 md:col-span-4 md:col-start-9 md:mt-0 md:text-right">{site.city} — 23°33′S 46°38′O</p>
        </div>

        <h1 id="hero-title" className="display h-mega uppercase">
          <span className="sr-only">Espaços que contam histórias.</span>
          <span aria-hidden="true">
            {TITLE.map((l, i) => (
              <span key={l} className={`line-mask ${i === 1 ? 'pl-[12vw] italic normal-case text-sand' : ''}`}>
                <span data-hero-line>{l}</span>
              </span>
            ))}
          </span>
        </h1>

        <div data-hero-rule className="rule mt-8 origin-left opacity-30" />
        <div className="mt-6 grid grid-cols-12 items-end gap-x-6 gap-y-5">
          <p data-hero-fade className="lead col-span-12 max-w-[34ch] text-paper/90 md:col-span-5">Arquitetura autoral para uma vida com mais significado.</p>
          <p data-hero-fade className="col-span-12 text-sm text-paper/65 md:col-span-4">Projetos residenciais, interiores e espaços comerciais.</p>
          <div data-hero-fade className="col-span-12 flex items-center justify-between gap-4 md:col-span-3 md:justify-end">
            {site.demoMode && <span className="demo-tag text-paper/70">Estúdio fictício · demo</span>}
            <button type="button" onClick={() => goToSection('manifesto')} className="group flex items-center gap-3" aria-label="Rolar para o manifesto">
              <span className="label hidden text-paper/70 sm:inline">Role</span>
              <span className="relative block h-12 w-px overflow-hidden bg-paper/20"><span className="scroll-cue absolute inset-0 bg-paper" /></span>
              <ArrowDown size={14} strokeWidth={1.25} className="text-paper/70 transition-transform group-hover:translate-y-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
