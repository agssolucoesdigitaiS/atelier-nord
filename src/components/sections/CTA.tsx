import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap';
import { useUI } from '../../lib/ui';
import { SplitLines } from '../motion/SplitLines';
import { Magnetic } from '../motion/Magnetic';
import { Reveal } from '../motion/Reveal';

export function CTA() {
  const ref = useRef<HTMLElement>(null);
  const { openContact, goToSection } = useUI();
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(ref.current!.querySelectorAll('[data-grid-h]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'top 10%', scrub: true } });
      gsap.fromTo(ref.current!.querySelectorAll('[data-grid-v]'), { scaleY: 0 }, { scaleY: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'top 10%', scrub: true } });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <section ref={ref} id="contato" tabIndex={-1} data-tone="dark" className="relative overflow-hidden bg-[#121311] py-[clamp(120px,20vh,240px)] text-paper outline-none" aria-labelledby="cta-title">
      {/* linhas de construção do grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {[18, 50, 82].map((t) => <span key={t} data-grid-h className="absolute left-0 right-0 h-px origin-left bg-paper/[0.07]" style={{ top: `${t}%` }} />)}
        {[8.33, 41.66, 75].map((l) => <span key={l} data-grid-v className="absolute bottom-0 top-0 w-px origin-top bg-paper/[0.07]" style={{ left: `${l}%` }} />)}
      </div>
      <div className="px-site relative grid grid-cols-12 gap-x-6 gap-y-12">
        <p className="label col-span-12 flex gap-4 text-sand"><span className="num">(08)</span> Vamos conversar</p>
        <SplitLines id="cta-title" text={'Todo grande espaço\ncomeça com uma\nconversa.'} className="display h-xl col-span-12 uppercase" lineClassName="[&:nth-child(3)]:italic [&:nth-child(3)]:normal-case [&:nth-child(3)]:text-sand [&:nth-child(2)]:md:pl-[10vw]" stagger={0.12} />
        <Reveal className="col-span-12 grid gap-10 md:col-span-6 md:col-start-7">
          <p data-reveal className="lead text-paper/80">Conte sobre o que você deseja construir, reformar ou transformar. Vamos entender as possibilidades do seu projeto.</p>
          <div data-reveal className="flex flex-wrap gap-4">
            <Magnetic><button type="button" onClick={openContact} className="btn btn-solid"><span>Iniciar meu projeto</span><ArrowRight size={16} strokeWidth={1.5} /></button></Magnetic>
            <Magnetic><button type="button" onClick={() => goToSection('servicos')} className="btn btn-light"><span>Conhecer nossos serviços</span></button></Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
