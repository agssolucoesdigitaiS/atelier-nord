import { useRef } from 'react';
import { principles } from '../../data/content';
import { SplitLines } from '../motion/SplitLines';
import { Reveal } from '../motion/Reveal';
import { Img } from '../ui/Img';

export function About() {
  const ref = useRef<HTMLElement>(null);
  return (
    <section ref={ref} id="estudio" tabIndex={-1} data-tone="light" className="relative overflow-hidden bg-mineral py-[clamp(96px,14vh,180px)] outline-none" aria-labelledby="estudio-title">
      <div className="px-site grid grid-cols-12 gap-x-6 gap-y-10">
        <p className="label col-span-12 flex gap-4 text-concrete md:col-span-3"><span className="num">(06)</span> Sobre o estúdio</p>
        <SplitLines id="estudio-title" text={'Menos excessos.\nMais essência.'} className="display h-xl col-span-12 md:col-span-9" lineClassName="[&:nth-child(2)]:italic" />
      </div>

      <div className="px-site mt-[clamp(56px,10vh,120px)] grid grid-cols-12 gap-x-6 gap-y-14">
        <figure className="col-span-12 md:col-span-7">
          <Img name="estudio" alt="Ambiente demonstrativo de estúdio de arquitetura: mesa longa de madeira com maquetes brancas, desenhos e pendentes, janela para o jardim." className="aspect-[4/3] w-full" parallax={6} sizes="(min-width: 768px) 58vw, 100vw" />
          <figcaption className="label mt-4 flex justify-between text-concrete"><span>Fig. 03</span><span>Ambiente de estúdio · render demonstrativo</span></figcaption>
        </figure>
        <div className="col-span-12 flex flex-col justify-between gap-12 md:col-span-4 md:col-start-9">
          <Reveal className="grid gap-6">
            <p data-reveal className="lead">
              O ATELIER NÓRD é um estúdio conceitual de arquitetura contemporânea dedicado ao encontro entre forma, função e experiência.
            </p>
            <p data-reveal className="text-ink/70">
              Nosso processo valoriza proporções, luz, materialidade e a relação de cada ambiente com as pessoas que o habitam.
            </p>
          </Reveal>
          <figure className="w-[82%] self-end md:-mb-24">
            <Img name="maquete" alt="Maquete branca da Casa Horizonte em escala, sobre base de madeira e prancheta de corte." className="aspect-square w-full" parallax={12} reveal="clip-side" sizes="(min-width: 768px) 28vw, 80vw" />
            <figcaption className="label mt-4 text-concrete">Fig. 04 · Maquete de estudo</figcaption>
          </figure>
        </div>
      </div>

      <Reveal as="ul" className="px-site mt-[clamp(80px,14vh,180px)] grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
        {principles.map((p, i) => (
          <li key={p.title} data-reveal className="border-t border-ink/20 pb-4 pt-6 lg:pr-8">
            <span className="label num text-concrete">0{i + 1}</span>
            <h3 className="display mt-4 text-[2rem]">{p.title}</h3>
            <p className="mt-3 max-w-[32ch] text-sm text-ink/70">{p.text}</p>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
