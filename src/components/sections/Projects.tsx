import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, EASE } from '../../lib/gsap';
import { projects, type Project } from '../../data/projects';
import { Img } from '../ui/Img';
import { SplitLines } from '../motion/SplitLines';
import { useUI } from '../../lib/ui';
import { expandToProject } from '../motion/expand';
import { useReducedMotion } from '../../hooks/useMedia';
import { useScroll } from '../motion/SmoothScroll';

function Card({ p, onOpen }: { p: Project; onOpen: (p: Project, frame: HTMLElement) => void }) {
  const frame = useRef<HTMLDivElement | null>(null);
  return (
    <article data-card className="group relative w-full shrink-0 lg:w-[min(62vw,1180px)]" aria-labelledby={`pj-${p.slug}`}>
      <button
        type="button"
        data-cursor="Explorar projeto"
        onClick={() => frame.current && onOpen(p, frame.current)}
        className="block w-full text-left"
        aria-label={`Explorar projeto ${p.name}`}
      >
        <div data-card-clip className="relative" style={{ clipPath: 'inset(0% 0% 0% 0%)' }}>
          <Img
            frameRef={(el) => { frame.current = el; }}
            name={p.cover.name}
            alt={p.cover.alt}
            reveal="none"
            parallax={7}
            parallaxAxis="x"
            className="aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-auto lg:h-[min(60vh,720px)]"
            imgClassName="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.045]"
            sizes="(min-width: 1024px) 62vw, 100vw"
          />
          <span className="label pointer-events-none absolute bottom-5 left-5 flex items-center gap-2 bg-mineral px-3 py-2 text-ink opacity-100 transition-all duration-500 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
            Explorar projeto <ArrowUpRight size={14} strokeWidth={1.5} />
          </span>
        </div>
      </button>
      <div className="mt-6 grid grid-cols-12 gap-x-4 gap-y-3 border-t border-paper/15 pt-5">
        <span className="label num col-span-2 text-sand">{p.index}</span>
        <h3 id={`pj-${p.slug}`} className="display col-span-10 text-[clamp(2rem,3.4vw,3.6rem)] leading-none md:col-span-5">{p.name}</h3>
        <dl className="col-span-12 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-paper/70 md:col-span-5 md:grid-cols-2">
          <dt className="sr-only">Categoria</dt><dd>{p.category}</dd>
          <dt className="sr-only">Local e ano</dt><dd className="num">{p.city}, {p.year}</dd>
          <dt className="sr-only">Área</dt><dd className="num">{p.area} m² <span className="text-paper/45">· demonstrativo</span></dd>
        </dl>
        <p className="col-span-12 max-w-[60ch] text-paper/70 md:col-span-10 md:col-start-3">{p.summary}</p>
      </div>
    </article>
  );
}

export function Projects() {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { openContact } = useUI();
  const reduced = useReducedMotion();
  const hTween = useRef<gsap.core.Tween | null>(null);
  const { scrollTo } = useScroll();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const q = gsap.utils.selector(ref);

    // desktop: galeria horizontal fixada, vinculada ao scroll
    mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
      const pin = q('[data-pin]')[0] as HTMLElement;
      const track = q('[data-track]')[0] as HTMLElement;
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: pin, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.9, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      hTween.current = tween;
      q('[data-card]').forEach((card) => {
        const clip = card.querySelector('[data-card-clip]');
        const inner = card.querySelector('[data-pz]');
        gsap.fromTo(clip, { clipPath: 'inset(0% 0% 0% 22%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 100%', end: 'left 45%', scrub: true } });
        if (inner) gsap.fromTo(inner, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      });
      // foco por teclado: leva o scroll até o card focado dentro da galeria fixada
      const onFocus = (e: FocusEvent) => {
        const card = (e.target as HTMLElement).closest('[data-card], [data-end]') as HTMLElement | null;
        const st = tween.scrollTrigger; if (!card || !st || !dist()) return;
        const x = Math.min(dist(), Math.max(0, card.offsetLeft - window.innerWidth * 0.08));
        scrollTo(st.start + (x / dist()) * (st.end - st.start), { immediate: true });
      };
      track.addEventListener('focusin', onFocus);
      gsap.fromTo(q('[data-progress]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: pin, start: 'top top', end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true } });
      return () => { track.removeEventListener('focusin', onFocus); hTween.current = null; };
    });

    // mobile e tablet: lista vertical nativa com revelação por máscara
    mm.add(`(max-width: 1023px) and ${MOTION_OK}`, () => {
      q('[data-card-clip]').forEach((clip) => {
        gsap.fromTo(clip, { clipPath: 'inset(18% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: EASE.inOut, scrollTrigger: { trigger: clip, start: 'top 88%', once: true } });
        const inner = clip.querySelector('[data-pz]');
        if (inner) gsap.from(inner, { scale: 1.2, duration: 1.8, ease: EASE.out, scrollTrigger: { trigger: clip, start: 'top 88%', once: true } });
      });
    });
    return () => mm.revert();
  }, { scope: ref });

  const open = (p: Project, frame: HTMLElement) => expandToProject(frame, p.cover.name, () => navigate(`/projetos/${p.slug}`, { state: { expanded: true } }), reduced);

  return (
    <section ref={ref} id="projetos" tabIndex={-1} data-tone="dark" className="relative bg-ink text-paper outline-none" aria-labelledby="projetos-title">
      <div className="px-site grid grid-cols-12 gap-x-6 gap-y-8 pb-16 pt-[clamp(96px,14vh,180px)] lg:pb-4">
        <p className="label col-span-12 flex gap-4 text-sand md:col-span-3"><span className="num">(02)</span> Projetos em destaque</p>
        <SplitLines id="projetos-title" text={'Quatro projetos,\nquatro escalas.'} className="display h-lg col-span-12 md:col-span-6" />
        <p className="col-span-12 self-end text-sm text-paper/60 md:col-span-3">Residências, interiores e comercial. Cases conceituais, com dados demonstrativos.</p>
      </div>

      <div data-pin className="relative lg:flex lg:h-[100svh] lg:items-center lg:overflow-hidden motion-reduce:lg:h-auto motion-reduce:lg:overflow-x-auto motion-reduce:lg:py-12">
        <div data-track className="px-site flex flex-col gap-24 pb-24 lg:w-max lg:flex-row lg:items-start lg:gap-[7vw] lg:pb-0 lg:pr-[12vw]">
          {projects.map((p) => <Card key={p.slug} p={p} onOpen={open} />)}
          <div data-end className="flex w-full shrink-0 flex-col justify-center gap-8 border-t border-paper/15 pt-10 lg:h-[min(60vh,720px)] lg:w-[34vw] lg:border-l lg:border-t-0 lg:pl-[4vw] lg:pt-0">
            <p className="display h-md max-w-[16ch]">O próximo projeto pode ser o seu.</p>
            <p className="max-w-[40ch] text-sm text-paper/60">Todos os cases desta página são conceituais e foram criados para demonstrar a linguagem do estúdio.</p>
            <div><button type="button" onClick={openContact} className="btn btn-light"><span>Iniciar meu projeto</span></button></div>
          </div>
        </div>
        <div className="px-site pointer-events-none absolute inset-x-0 bottom-8 hidden items-center gap-6 lg:flex motion-reduce:lg:hidden" aria-hidden="true">
          <span className="label text-paper/50">Role para avançar</span>
          <div className="relative h-px flex-1 bg-paper/15"><div data-progress className="absolute inset-0 origin-left bg-paper/80" /></div>
          <span className="label num text-paper/50">04 cases</span>
        </div>
      </div>
    </section>
  );
}
