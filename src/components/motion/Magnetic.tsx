import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';

/** Atração magnética sutil, apenas em ponteiros finos e sem movimento reduzido. */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const target = el.firstElementChild as HTMLElement;
      if (!target) return;
      const xTo = gsap.quickTo(target, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(target, 'y', { duration: 0.6, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => { xTo(0); yTo(0); };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); gsap.set(target, { x: 0, y: 0 }); };
    });
    return () => mm.revert();
  }, { scope: ref });
  return <span ref={ref} className={`inline-block ${className ?? ''}`}>{children}</span>;
}
