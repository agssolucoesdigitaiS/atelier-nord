import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { gsap, EASE } from '../../lib/gsap';
import { testimonials } from '../../data/content';
import { useReducedMotion } from '../../hooks/useMedia';
import { Magnetic } from '../motion/Magnetic';

/** Slider editorial acessível: botões, teclado (setas), indicadores e região viva educada. */
export function Testimonials() {
  const [i, setI] = useState(0);
  const quote = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const reduced = useReducedMotion();
  const n = testimonials.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (reduced || !quote.current) return;
    const el = quote.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelectorAll('[data-q-line]'), { yPercent: 105 }, { yPercent: 0, duration: 1.1, ease: EASE.out, stagger: 0.012 });
      gsap.fromTo(el.querySelectorAll('[data-q-meta]'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.3, ease: EASE.soft });
    }, el);
    return () => ctx.revert();
  }, [i, reduced]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  };
  const t = testimonials[i];
  const words = t.quote.split(' ');

  return (
    <section id="depoimentos" data-tone="light" className="relative bg-[#ddd6ca] py-[clamp(96px,14vh,180px)]" aria-labelledby="depo-title">
      <div className="px-site grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-12 md:col-span-3">
          <p className="label flex gap-4 text-ink/60"><span className="num">(07)</span> Depoimentos</p>
          <h2 id="depo-title" className="display mt-6 text-[2rem] leading-tight">Palavras de quem projeta conosco</h2>
          <p className="demo-tag mt-6 text-ink/70">Ilustrativos · fictícios</p>
        </div>

        <div
          className="col-span-12 md:col-span-9"
          role="region"
          aria-roledescription="carrossel"
          aria-label="Depoimentos ilustrativos"
          tabIndex={0}
          onKeyDown={onKey}
        >
          <div ref={quote} aria-live="polite" aria-atomic="true" role="group" aria-roledescription="slide" aria-label={`${i + 1} de ${n}`} className="min-h-[clamp(260px,34vh,380px)]">
            <blockquote>
              <p className="display text-[clamp(1.7rem,3.6vw,3.6rem)] leading-[1.08]">
                <span aria-hidden="true">“</span>
                {words.map((w, k) => (
                  <span key={`${i}-${k}`}><span className="inline-block overflow-hidden pb-[0.12em] align-bottom"><span data-q-line className="inline-block">{w}</span></span>{' '}</span>
                ))}
                <span aria-hidden="true">”</span>
              </p>
              <footer data-q-meta className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <cite className="not-italic font-medium">{t.name}</cite>
                <span className="text-sm text-ink/60">{t.context}</span>
              </footer>
            </blockquote>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-ink/20 pt-6">
            <div className="flex items-center gap-3" role="group" aria-label="Escolher depoimento">
              {testimonials.map((_, k) => (
                <button key={k} type="button" onClick={() => setI(k)} aria-label={`Mostrar depoimento ${k + 1}`} aria-current={k === i} className="group flex h-11 items-center">
                  <span className={`block h-px transition-all duration-700 ease-nord ${k === i ? 'w-16 bg-ink' : 'w-8 bg-ink/30 group-hover:bg-ink/60'}`} />
                </button>
              ))}
              <span className="label num ml-3 text-ink/60">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
            </div>
            <div className="flex gap-3">
              <Magnetic><button type="button" onClick={() => go(-1)} aria-label="Depoimento anterior" className="grid h-14 w-14 place-items-center rounded-full border border-ink/30 transition-colors hover:bg-ink hover:text-paper"><ArrowLeft size={18} strokeWidth={1.25} /></button></Magnetic>
              <Magnetic><button type="button" onClick={() => go(1)} aria-label="Próximo depoimento" className="grid h-14 w-14 place-items-center rounded-full border border-ink/30 transition-colors hover:bg-ink hover:text-paper"><ArrowRight size={18} strokeWidth={1.25} /></button></Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
