import { useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, EASE } from '../lib/gsap';
import { getProject, projects } from '../data/projects';
import { Img } from '../components/ui/Img';
import { Reveal } from '../components/motion/Reveal';
import { SplitLines } from '../components/motion/SplitLines';
import { usePageMeta } from '../hooks/usePageMeta';
import { useReducedMotion } from '../hooks/useMedia';
import { expandToProject } from '../components/motion/expand';
import { useUI } from '../lib/ui';
import NotFound from './NotFound';

export default function ProjectPage() {
  const { slug = '' } = useParams();
  const p = getProject(slug);
  const ref = useRef<HTMLElement>(null);
  const nextFrame = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const { openContact } = useUI();
  usePageMeta(p ? p.name : 'Projeto não encontrado', p ? `${p.name}: ${p.category} em ${p.city}. ${p.summary}` : undefined);

  useGSAP(() => {
    if (!p) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const q = gsap.utils.selector(ref);
      gsap.fromTo(q('[data-ph-line]'), { yPercent: 115 }, { yPercent: 0, duration: 1.4, ease: EASE.out, stagger: 0.08, delay: 0.45 });
      gsap.fromTo(q('[data-ph-fade]'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1, ease: EASE.soft, stagger: 0.06, delay: 0.8 });
      gsap.to(q('[data-ph-img]'), { yPercent: 16, scale: 1.06, ease: 'none', scrollTrigger: { trigger: q('[data-ph]')[0], start: 'top top', end: 'bottom top', scrub: true } });
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [slug] });

  if (!p) return <NotFound />;
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <main ref={ref} id="conteudo" className="bg-mineral">
      <section data-ph data-tone="dark" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink text-paper" aria-labelledby="ph-title">
        <div data-ph-img className="absolute inset-0">
          <Img name={p.cover.name} alt={p.cover.alt} reveal="none" priority className="h-full w-full" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,24,22,.5)_0%,rgba(23,24,22,.1)_40%,rgba(23,24,22,.78)_100%)]" />
        <div className="px-site relative flex h-full flex-col justify-end" style={{ paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 0px))' }}>
          <Link to="/" state={{ scrollTo: 'projetos' }} data-ph-fade className="label mb-auto inline-flex w-fit items-center gap-2 text-paper/80 hover:text-paper" style={{ marginTop: 'calc(110px + env(safe-area-inset-top, 0px))' }}>
            <ArrowLeft size={14} strokeWidth={1.5} /> Todos os projetos
          </Link>
          <p data-ph-fade className="label mb-4 text-sand"><span className="num">{p.index}</span> · {p.category}</p>
          <h1 id="ph-title" className="display h-mega">
            <span className="sr-only">{p.name}</span>
            <span aria-hidden="true">{p.name.split(' ').map((w, i) => <span key={w} className={`line-mask ${i ? 'italic' : ''}`}><span data-ph-line>{w}</span></span>)}</span>
          </h1>
          <dl data-ph-fade className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-paper/20 pt-5 text-sm md:grid-cols-4">
            <div><dt className="label text-paper/50">Local</dt><dd className="mt-1">{p.city}</dd></div>
            <div><dt className="label text-paper/50">Ano</dt><dd className="num mt-1">{p.year}</dd></div>
            <div><dt className="label text-paper/50">Área de projeto</dt><dd className="num mt-1">{p.area} m² <span className="text-paper/50">(demonstrativa)</span></dd></div>
            <div><dt className="label text-paper/50">Status</dt><dd className="mt-1">Case conceitual · fictício</dd></div>
          </dl>
        </div>
      </section>

      <section data-tone="light" className="px-site grid grid-cols-12 gap-x-6 gap-y-12 py-[clamp(96px,14vh,170px)]">
        <p className="label col-span-12 text-concrete md:col-span-3">Conceito</p>
        <Reveal className="col-span-12 md:col-span-8">
          <p data-reveal className="display text-[clamp(1.8rem,3.2vw,3.2rem)] leading-[1.12]">{p.concept}</p>
        </Reveal>
      </section>

      <section data-tone="light" aria-label="Galeria" className="grid gap-[clamp(24px,4vw,64px)]">
        <Img name={p.gallery[0].name} alt={p.gallery[0].alt} className="aspect-[4/5] w-full sm:aspect-[16/9]" parallax={9} sizes="100vw" />
        <div className="px-site grid grid-cols-12 gap-x-6 gap-y-10">
          <figure className="col-span-12 md:col-span-7">
            <Img name={p.gallery[1].name} alt={p.gallery[1].alt} className="aspect-[4/3] w-full" parallax={6} sizes="(min-width: 768px) 58vw, 100vw" />
          </figure>
          <figure className="col-span-10 col-start-3 md:col-span-4 md:col-start-9 md:mt-[22vh]">
            <Img name={p.gallery[2].name} alt={p.gallery[2].alt} className="aspect-[3/4] w-full" parallax={12} reveal="clip-side" sizes="(min-width: 768px) 33vw, 80vw" />
          </figure>
        </div>
      </section>

      <section data-tone="light" className="px-site grid grid-cols-12 gap-x-6 gap-y-16 py-[clamp(96px,14vh,170px)]">
        <div className="col-span-12 md:col-span-5">
          <SplitLines text={'Partido\narquitetônico'} className="display h-md" />
          <Reveal className="mt-6"><p data-reveal className="max-w-[48ch] text-ink/75">{p.partido}</p></Reveal>
        </div>
        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <h2 className="label mb-6 text-concrete">Organização espacial</h2>
          <Reveal as="ol" className="border-t border-line">
            {p.organizacao.map((o, i) => (
              <li key={o} data-reveal className="grid grid-cols-[3rem_1fr] border-b border-line py-4"><span className="num text-concrete">{String(i + 1).padStart(2, '0')}</span><span>{o}</span></li>
            ))}
          </Reveal>
          <h2 className="label mb-6 mt-16 text-concrete">Materiais</h2>
          <Reveal as="dl" className="grid gap-px sm:grid-cols-2">
            {p.materiais.map((m) => (
              <div key={m.name} data-reveal className="border-t border-ink/25 pb-4 pt-4 sm:pr-6"><dt className="font-serif text-2xl">{m.name}</dt><dd className="mt-1 text-sm text-ink/65">{m.note}</dd></div>
            ))}
          </Reveal>
          <p className="mt-10 text-xs text-ink/50">Dados, imagens e área são demonstrativos e não representam uma obra construída.</p>
        </div>
      </section>

      <section data-tone="dark" className="bg-ink text-paper" aria-label="Próximo projeto">
        <button
          type="button"
          data-cursor="Próximo projeto"
          onClick={() => nextFrame.current && expandToProject(nextFrame.current, next.cover.name, () => navigate(`/projetos/${next.slug}`, { state: { expanded: true } }), reduced)}
          className="group px-site grid w-full grid-cols-12 items-end gap-6 py-[clamp(72px,12vh,140px)] text-left"
        >
          <span className="col-span-12 md:col-span-5">
            <span className="label text-sand">Próximo projeto · {next.index}</span>
            <span className="display h-lg mt-4 flex items-center gap-4">{next.name}<ArrowUpRight className="shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" size={36} strokeWidth={1} /></span>
            <span className="mt-3 block text-sm text-paper/60">{next.category} · {next.city}</span>
          </span>
          <span className="col-span-12 md:col-span-7">
            <Img frameRef={(el) => { nextFrame.current = el; }} name={next.cover.name} alt={next.cover.alt} className="aspect-[16/9] w-full" imgClassName="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]" sizes="(min-width: 768px) 58vw, 100vw" />
          </span>
        </button>
        <div className="px-site flex flex-wrap items-center justify-between gap-6 border-t border-paper/10 py-10">
          <p className="max-w-[44ch] text-paper/70">Tem um projeto com escala ou programa parecido?</p>
          <button type="button" onClick={openContact} className="btn btn-light"><span>Iniciar meu projeto</span></button>
        </div>
      </section>
    </main>
  );
}
