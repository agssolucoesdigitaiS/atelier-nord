import { useEffect, useRef, useState } from 'react';
import { gsap, EASE } from '../../lib/gsap';
import { img, preloadImage } from '../../lib/assets';
import { useReducedMotion } from '../../hooks/useMedia';

/**
 * Preloader editorial com progresso real: conta somente assets críticos já carregados
 * (fontes de exibição + imagem do hero). Nunca bloqueia: limite máximo de 6 s.
 */
export function Preloader({ onDone, heroImage }: { onDone: () => void; heroImage: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    const heroSrc = window.innerWidth > 1100 ? img(heroImage).src : img(heroImage).small;
    const tasks: Promise<unknown>[] = [
      preloadImage(heroSrc),
      document.fonts?.load('300 64px "Cormorant Garamond"') ?? Promise.resolve(),
      document.fonts?.load('500 16px "Manrope Variable"') ?? Promise.resolve(),
      document.fonts?.ready ?? Promise.resolve(),
    ];
    let done = 0;
    tasks.forEach((t) => t.catch(() => null).finally(() => { done++; if (!cancelled) setProgress(done / tasks.length); }));
    const all = Promise.all(tasks.map((t) => t.catch(() => null)));
    const timeout = new Promise((r) => setTimeout(r, 6000));
    const minimum = new Promise((r) => setTimeout(r, reduced ? 0 : 900));

    Promise.all([Promise.race([all, timeout]), minimum]).then(() => {
      if (cancelled) return;
      setProgress(1);
      const el = root.current!;
      if (reduced) { setGone(true); onDone(); return; }
      const tl = gsap.timeline({ delay: 0.25, onComplete: () => { setGone(true); } });
      tl.to(el.querySelectorAll('[data-pl-line]'), { yPercent: -110, duration: 0.8, ease: EASE.inOut, stagger: 0.05 })
        .to(el.querySelector('[data-pl-bar]'), { scaleX: 0, transformOrigin: 'right center', duration: 0.6, ease: EASE.inOut }, 0)
        .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: EASE.inOut }, 0.45)
        .add(() => onDone(), 0.75);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;
  const pct = Math.round(progress * 100);
  return (
    <div ref={root} className="fixed inset-0 z-[200] flex flex-col justify-between bg-ink px-site text-paper" style={{ clipPath: 'inset(0% 0% 0% 0%)', paddingTop: 'calc(28px + env(safe-area-inset-top, 0px))', paddingBottom: 'calc(28px + env(safe-area-inset-bottom, 0px))' }} role="status" aria-live="polite" aria-label={`Carregando ${pct}%`}>
      <div className="flex items-start justify-between">
        <span className="line-mask label text-sand"><span data-pl-line>Arquitetura contemporânea · São Paulo</span></span>
        <span className="line-mask label text-sand"><span data-pl-line>Carregando</span></span>
      </div>
      <div>
        <p className="display h-xl">
          <span className="line-mask"><span data-pl-line>Atelier</span></span>
          <span className="line-mask italic text-sand"><span data-pl-line>Nórd</span></span>
        </p>
        <div className="mt-8 flex items-end justify-between gap-6">
          <div className="relative h-px flex-1 bg-paper/15">
            <div data-pl-bar className="absolute inset-0 origin-left bg-paper" style={{ transform: `scaleX(${progress})`, transition: 'transform .6s cubic-bezier(.16,1,.3,1)' }} />
          </div>
          <span className="line-mask num font-serif text-4xl font-light"><span data-pl-line>{String(pct).padStart(3, '0')}</span></span>
        </div>
      </div>
    </div>
  );
}
