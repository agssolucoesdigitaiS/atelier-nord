import Lenis from 'lenis';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap';
import { useReducedMotion } from '../../hooks/useMedia';

type ScrollTarget = number | string | HTMLElement;
type Ctx = {
  scrollTo: (t: ScrollTarget, o?: { immediate?: boolean; offset?: number; duration?: number }) => void;
  lock: (v: boolean) => void;
  lenis: Lenis | null;
};
const ScrollCtx = createContext<Ctx>({ scrollTo: () => {}, lock: () => {}, lenis: null });
export const useScroll = () => useContext(ScrollCtx);

/**
 * Um único controlador de scroll (Lenis) integrado ao ScrollTrigger pelo ticker do GSAP.
 * Desligado com prefers-reduced-motion: o scroll nativo assume.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const ref = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (reduced) return;
    const l = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 0.95 });
    ref.current = l; setLenis(l);
    l.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(raf); l.destroy(); ref.current = null; setLenis(null); };
  }, [reduced]);

  const scrollTo = useCallback<Ctx['scrollTo']>((t, o = {}) => {
    const l = ref.current;
    if (l) { l.scrollTo(t as never, { immediate: o.immediate, offset: o.offset ?? 0, duration: o.duration ?? 1.6, force: true }); return; }
    let y = 0;
    if (typeof t === 'number') y = t;
    else { const el = typeof t === 'string' ? document.querySelector(t) : t; if (!el) return; y = el.getBoundingClientRect().top + window.scrollY + (o.offset ?? 0); }
    window.scrollTo({ top: y, behavior: o.immediate || reduced ? 'auto' : 'smooth' });
  }, [reduced]);

  const lock = useCallback((v: boolean) => {
    const l = ref.current;
    if (v) { l?.stop(); document.documentElement.style.overflow = 'hidden'; }
    else { document.documentElement.style.overflow = ''; l?.start(); }
  }, []);

  const value = useMemo(() => ({ scrollTo, lock, lenis }), [scrollTo, lock, lenis]);
  return <ScrollCtx.Provider value={value}>{children}</ScrollCtx.Provider>;
}
