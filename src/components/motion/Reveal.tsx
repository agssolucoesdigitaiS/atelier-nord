import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, useGSAP, MOTION_OK, EASE } from '../../lib/gsap';

/** Entrada suave (opacidade + deslocamento) para blocos de texto. Filhos com [data-reveal] entram em stagger. */
export function Reveal({ children, as: Tag = 'div', className, y = 28, stagger = 0.08, start = 'top 88%' }: { children: ReactNode; as?: ElementType; className?: string; y?: number; stagger?: number; start?: string }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const kids = ref.current!.querySelectorAll('[data-reveal]');
      gsap.from(kids.length ? kids : ref.current, {
        y, autoAlpha: 0, duration: 1.1, ease: EASE.soft, stagger,
        scrollTrigger: { trigger: ref.current, start, once: true },
      });
    });
    return () => mm.revert();
  }, { scope: ref });
  return <Tag ref={ref} className={className}>{children}</Tag>;
}
