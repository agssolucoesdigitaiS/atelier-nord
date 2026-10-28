import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap';
import { processSteps } from '../../data/content';
import { SplitLines } from '../motion/SplitLines';
import { Reveal } from '../motion/Reveal';
import { ConceptDrawing } from '../ui/ConceptDrawing';
import { Img } from '../ui/Img';

export function Process() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const list = ref.current!.querySelector('[data-p-list]');
      gsap.fromTo(ref.current!.querySelector('[data-p-progress]'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 65%', end: 'bottom 65%', scrub: true } });
      ref.current!.querySelectorAll<HTMLElement>('[data-p-dot]').forEach((dot) => {
        gsap.fromTo(dot, { scale: 0.4, backgroundColor: 'rgba(23,24,22,0)' }, { scale: 1, backgroundColor: 'rgba(23,24,22,1)', duration: 0.5, scrollTrigger: { trigger: dot, start: 'top 65%', toggleActions: 'play none none reverse' } });
      });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <section ref={ref} id="processo" tabIndex={-1} data-tone="light" className="relative bg-paper py-[clamp(96px,14vh,180px)] outline-none" aria-labelledby="processo-title">
      <div className="px-site grid grid-cols-12 gap-x-6 gap-y-16">
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-[16vh]">
            <p className="label mb-8 flex gap-4 text-concrete"><span className="num">(05)</span> Processo de trabalho</p>
            <SplitLines id="processo-title" text={'Do primeiro encontro\nao espaço imaginado.'} className="display h-lg" />
            <p className="mt-8 max-w-[38ch] text-ink/70">Quatro etapas, cada uma com entregas claras e aprovação antes de seguir. O ritmo é definido em contrato, de acordo com o escopo.</p>
          </div>
        </div>

        <ol data-p-list className="relative col-span-12 grid gap-[clamp(64px,12vh,140px)] pl-10 md:pl-16 lg:col-span-7 lg:col-start-6">
          <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-2 w-px bg-ink/15 md:left-[11px]"><span data-p-progress className="absolute inset-0 origin-top bg-ink" /></span>
          {processSteps.map((s, i) => (
            <li key={s.index} className="relative">
              <span data-p-dot aria-hidden="true" className="absolute -left-10 top-3 h-[15px] w-[15px] rounded-full border border-ink md:-left-16 md:h-[23px] md:w-[23px]" />
              <Reveal className={`grid gap-6 ${i % 2 ? 'md:pl-[12%]' : 'md:pr-[12%]'}`}>
                <div data-reveal className="flex items-baseline gap-5">
                  <span className="display num text-[clamp(3rem,6vw,6rem)] italic text-sand">{s.index}</span>
                  <h3 className="display text-[clamp(1.9rem,3vw,3rem)] leading-none">{s.title}</h3>
                </div>
                <p data-reveal className="lead max-w-[46ch]">{s.text}</p>
                <p data-reveal className="max-w-[52ch] text-sm text-ink/65">{s.detail}</p>
                <figure data-reveal className="mt-2 border border-line bg-mineral/60 p-5 text-ink/80">
                  <div className="aspect-[400/260] w-full">
                    {s.drawing === 'photo'
                      ? <Img name="obra" alt="Estrutura de concreto em execução com andaimes: fase de materialização." className="h-full w-full" parallax={6} sizes="(min-width: 1024px) 50vw, 100vw" />
                      : <ConceptDrawing kind={s.drawing} title={`Desenho conceitual da etapa ${s.title}`} />}
                  </div>
                </figure>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
