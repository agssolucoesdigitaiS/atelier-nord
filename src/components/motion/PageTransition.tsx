import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation, type Location } from 'react-router-dom';
import { gsap, ScrollTrigger, EASE, scheduleRefresh } from '../../lib/gsap';
import { useScroll } from './SmoothScroll';
import { useReducedMotion } from '../../hooks/useMedia';
import { releaseExpand } from './expand';

type State = { expanded?: boolean; scrollTo?: string } | null;

/**
 * Transições de página reais:
 * 1. cobre a tela (cortina) — ou mantém o overlay da imagem expandida;
 * 2. troca a rota (a página antiga desmonta e o useGSAP limpa timelines e ScrollTriggers);
 * 3. restaura o scroll (topo ou seção pedida), recalcula os triggers e revela.
 */
export function PageTransition({ render }: { render: (loc: Location) => ReactNode }) {
  const location = useLocation();
  const [shown, setShown] = useState<Location>(location);
  const curtain = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const { scrollTo } = useScroll();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (location.key === shown.key) return;
    const st = location.state as State;
    if (location.pathname === shown.pathname && st?.scrollTo) { setShown(location); return; }
    if (st?.expanded || reduced) { setShown(location); return; }
    busy.current = true;
    const c = curtain.current!;
    gsap.timeline({ onComplete: () => setShown(location) })
      .set(c, { display: 'block', clipPath: 'inset(100% 0% 0% 0%)' })
      .to(c, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: EASE.inOut })
      .fromTo(c.querySelector('[data-c-label]'), { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: EASE.out }, 0.3);
  }, [location, shown.key, shown.pathname, reduced]);

  useLayoutEffect(() => {
    const st = shown.state as State;
    const target = st?.scrollTo;
    if (target) {
      scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
      window.setTimeout(() => { if (target === 'inicio') scrollTo(0); else scrollTo(`#${target}`, { immediate: !!busy.current }); }, busy.current ? 60 : 300);
    } else {
      scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    }
    scheduleRefresh(400);
    window.dispatchEvent(new Event('cursor:reset'));
    if (st?.expanded) releaseExpand(reduced);
    if (busy.current) {
      busy.current = false;
      const c = curtain.current!;
      gsap.timeline({ delay: 0.12 })
        .to(c.querySelector('[data-c-label]'), { yPercent: -110, duration: 0.45, ease: 'power3.in' })
        .to(c, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: EASE.inOut }, 0.1)
        .set(c, { display: 'none' });
    }
    // move o foco para o conteúdo novo (acessibilidade em SPAs)
    if (!st?.scrollTo) document.getElementById('conteudo')?.focus?.({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown.key]);

  return (
    <>
      <div key={shown.key}>{render(shown)}</div>
      <div ref={curtain} aria-hidden="true" className="fixed inset-0 z-[70] hidden bg-olive text-paper">
        <div className="px-site flex h-full items-end pb-10">
          <span className="line-mask display h-lg italic"><span data-c-label>Atelier Nórd</span></span>
        </div>
      </div>
    </>
  );
}
