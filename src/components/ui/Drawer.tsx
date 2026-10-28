import { useEffect, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { gsap, EASE } from '../../lib/gsap';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useReducedMotion } from '../../hooks/useMedia';
import { useScroll } from '../motion/SmoothScroll';

type Props = { open: boolean; onClose: () => void; title: string; labelledBy?: string; children: ReactNode; tone?: 'dark' | 'light'; width?: string };

/** Painel lateral modal (diálogo) com entrada/saída animadas, foco preso e fechamento por Esc. */
export function Drawer({ open, onClose, title, children, tone = 'dark', width = 'min(760px, 100vw)' }: Props) {
  const [mounted, setMounted] = useState(open);
  const panel = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { lock } = useScroll();
  useFocusTrap(panel, open && mounted, onClose);

  useEffect(() => { if (open) setMounted(true); }, [open]);
  useEffect(() => { if (mounted) lock(open); }, [open, mounted, lock]);
  useEffect(() => () => lock(false), [lock]);

  useEffect(() => {
    if (!mounted || !panel.current) return;
    const p = panel.current, s = shade.current;
    const ctx = gsap.context(() => {
      if (open) {
        if (reduced) return;
        gsap.timeline()
          .fromTo(s, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 })
          .fromTo(p, { xPercent: 100 }, { xPercent: 0, duration: 0.9, ease: EASE.inOut }, 0)
          .fromTo(p.querySelectorAll('[data-d-item]'), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: EASE.soft, stagger: 0.05 }, 0.45);
      } else {
        if (reduced) { setMounted(false); return; }
        gsap.timeline({ onComplete: () => setMounted(false) })
          .to(p, { xPercent: 100, duration: 0.7, ease: EASE.inOut })
          .to(s, { autoAlpha: 0, duration: 0.4 }, 0.3);
      }
    });
    return () => ctx.kill();
  }, [open, mounted, reduced]);

  if (!mounted) return null;
  const dark = tone === 'dark';
  return (
    <div className="fixed inset-0 z-[80]">
      <div ref={shade} className="absolute inset-0 bg-ink/60" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-lenis-prevent
        className={`absolute right-0 top-0 h-full overflow-y-auto overscroll-contain ${dark ? 'bg-ink text-paper' : 'bg-mineral text-ink'}`}
        style={{ width }}
      >
        <div className="sticky top-0 z-10 flex justify-end px-5 md:px-10" style={{ paddingTop: 'calc(18px + env(safe-area-inset-top, 0px))' }}>
          <button type="button" onClick={onClose} className="grid h-12 w-12 place-items-center rounded-full border border-current/30 backdrop-blur-sm" aria-label="Fechar painel">
            <X size={18} strokeWidth={1.25} />
          </button>
        </div>
        <div className="px-5 pb-16 md:px-12" style={{ paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}>{children}</div>
      </div>
    </div>
  );
}
