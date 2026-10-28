import { useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap';
import { Img } from '../ui/Img';
import { Reveal } from '../motion/Reveal';

const LINES = ['A arquitetura', 'começa muito antes', 'da primeira linha.'];

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(ref);
      // frase revelada por linhas, controlada pelo scroll
      gsap.fromTo(q('[data-m-line]'), { yPercent: 100, opacity: 0.15 }, {
        yPercent: 0, opacity: 1, ease: 'none', stagger: 0.25,
        scrollTrigger: { trigger: q('[data-m-phrase]')[0], start: 'top 85%', end: 'bottom 45%', scrub: 0.8 },
      });
      // linha fina que atravessa o grid
      gsap.fromTo(q('[data-m-rule]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 70%', end: 'center 40%', scrub: true } });
      gsap.fromTo(q('[data-m-vrule]'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: q('[data-m-vrule]')[0], start: 'top 85%', end: 'bottom 50%', scrub: true } });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <section ref={ref} id="manifesto" tabIndex={-1} data-tone="light" className="relative overflow-hidden bg-mineral py-[clamp(96px,16vh,200px)] outline-none" aria-labelledby="manifesto-title">
      <div className="px-site grid grid-cols-12 gap-x-6">
        <p className="label col-span-12 mb-10 flex gap-4 text-concrete md:col-span-3 md:mb-0 md:pt-4"><span className="num">(01)</span> Manifesto</p>
        <h2 id="manifesto-title" data-m-phrase className="display h-xl col-span-12 md:col-span-9">
          <span className="sr-only">A arquitetura começa muito antes da primeira linha.</span>
          <span aria-hidden="true">
            {LINES.map((l, i) => (
              <span key={l} className={`line-mask ${i === 1 ? 'italic md:pl-[8vw]' : ''}`}><span data-m-line>{l}</span></span>
            ))}
          </span>
        </h2>
      </div>

      <div data-m-rule className="rule my-[clamp(64px,10vh,128px)] opacity-25" aria-hidden="true" />

      <div className="px-site grid grid-cols-12 gap-x-6 gap-y-14">
        <figure className="col-span-12 md:col-span-5">
          <Img name="detalhe-brise" alt="Brises de madeira projetando sombras sobre concreto aparente com marcas de fôrma." className="aspect-[4/5] w-full" parallax={8} sizes="(min-width: 768px) 40vw, 100vw" />
          <figcaption className="label mt-4 flex justify-between text-concrete"><span>Fig. 01</span><span>Brise e concreto aparente</span></figcaption>
        </figure>

        <div className="col-span-12 flex flex-col md:col-span-6 md:col-start-7">
          <Reveal className="relative grid gap-8 md:pt-[14vh]">
            <span data-m-vrule aria-hidden="true" className="absolute -left-6 top-0 hidden h-full w-px origin-top bg-ink/20 md:block" />
            <p data-reveal className="lead max-w-[46ch]">
              Acreditamos que cada espaço deve responder a uma maneira única de viver. Por isso, unimos escuta, técnica e sensibilidade para desenvolver projetos que equilibram estética, conforto e funcionalidade.
            </p>
            <dl data-reveal className="grid grid-cols-3 gap-4 border-t border-line pt-6 text-sm">
              <div><dt className="label text-concrete">Escuta</dt><dd className="mt-2">Programa escrito antes do primeiro traço</dd></div>
              <div><dt className="label text-concrete">Técnica</dt><dd className="mt-2">Detalhe resolvido no projeto</dd></div>
              <div><dt className="label text-concrete">Sensibilidade</dt><dd className="mt-2">Luz, proporção e matéria</dd></div>
            </dl>
          </Reveal>
          <figure className="mt-16 w-[78%] self-end md:mt-auto">
            <Img name="materiais" alt="Amostras de concreto, madeira, travertino, basalto, metal e linho sobre mesa escura." className="aspect-[5/4] w-full" parallax={5} reveal="clip-side" sizes="(min-width: 768px) 35vw, 80vw" />
            <figcaption className="label mt-4 flex justify-between text-concrete"><span>Fig. 02</span><span>Paleta de materiais</span></figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
