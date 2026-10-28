import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap';
import { useFinePointer, useReducedMotion } from '../../hooks/useMedia';

/**
 * Cursor editorial: ponto + anel. Só existe com ponteiro fino e sem movimento reduzido.
 * Elementos com data-cursor="Texto" mostram um rótulo; links e botões expandem o anel.
 * O foco por teclado continua com o contorno nativo.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    html.classList.add('has-cursor');
    const d = dot.current!, r = ring.current!;
    gsap.set([d, r], { xPercent: -50, yPercent: -50, x: innerWidth / 2, y: innerHeight / 2, autoAlpha: 0 });
    const dx = gsap.quickTo(d, 'x', { duration: 0.12, ease: 'power3' }), dy = gsap.quickTo(d, 'y', { duration: 0.12, ease: 'power3' });
    const rx = gsap.quickTo(r, 'x', { duration: 0.55, ease: 'power3' }), ry = gsap.quickTo(r, 'y', { duration: 0.55, ease: 'power3' });
    let visible = false, mode = '';
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!visible) { visible = true; gsap.to([d, r], { autoAlpha: 1, duration: 0.3 }); }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      const t = (e.target as HTMLElement)?.closest?.('[data-cursor], a, button, [role="button"], input, textarea, select, label') as HTMLElement | null;
      let next = '';
      let text = '';
      if (t?.dataset.cursor) { next = 'label'; text = t.dataset.cursor; }
      else if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) next = 'text';
      else if (t) next = 'link';
      if (next !== mode || (next === 'label' && text !== r.dataset.text)) {
        mode = next; r.dataset.text = text; setLabel(text);
        gsap.to(r, { width: next === 'label' ? 112 : next === 'link' ? 56 : next === 'text' ? 4 : 34, height: next === 'label' ? 112 : next === 'link' ? 56 : next === 'text' ? 28 : 34, backgroundColor: next === 'label' ? 'rgba(198,187,169,0.96)' : 'rgba(0,0,0,0)', borderColor: next === 'label' ? 'rgba(198,187,169,0)' : 'rgba(119,118,112,0.85)', duration: 0.45, ease: 'expo.out' });
        gsap.to(d, { scale: next ? 0 : 1, duration: 0.3 });
      }
    };
    const reset = () => { mode = ''; r.dataset.text = ''; setLabel(''); gsap.to(r, { width: 34, height: 34, backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgba(119,118,112,0.85)', duration: 0.4 }); gsap.to(d, { scale: 1, duration: 0.3 }); };
    window.addEventListener('cursor:reset', reset);
    const leave = () => { visible = false; gsap.to([d, r], { autoAlpha: 0, duration: 0.3 }); };
    const down = () => gsap.to(r, { scale: 0.85, duration: 0.2 });
    const up = () => gsap.to(r, { scale: 1, duration: 0.4, ease: 'expo.out' });
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      html.classList.remove('has-cursor');
      window.removeEventListener('cursor:reset', reset);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]">
      <div ref={ring} className="fixed left-0 top-0 grid place-items-center rounded-full border border-[rgba(119,118,112,0.85)]" style={{ width: 34, height: 34 }}>
        <span className="label whitespace-nowrap text-[0.6rem] text-ink" style={{ opacity: label ? 1 : 0, transition: 'opacity .3s' }}>{label}</span>
      </div>
      <div ref={dot} className="fixed left-0 top-0 h-[6px] w-[6px] rounded-full bg-concrete" />
    </div>
  );
}
