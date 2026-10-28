import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK, EASE } from '../../lib/gsap';
import { services, type Service } from '../../data/services';
import { Img } from '../ui/Img';
import { Drawer } from '../ui/Drawer';
import { SplitLines } from '../motion/SplitLines';
import { useFinePointer, useReducedMotion } from '../../hooks/useMedia';
import { useUI } from '../../lib/ui';

export function Services() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [detail, setDetail] = useState<Service | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const { openContact } = useUI();

  // linhas divisórias desenhadas ao entrar
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(gsap.utils.toArray<HTMLElement>('[data-s-rule]', ref.current), { scaleX: 0 }, {
        scaleX: 1, duration: 1.4, ease: EASE.inOut, stagger: 0.08,
        scrollTrigger: { trigger: ref.current!.querySelector('[data-s-list]'), start: 'top 80%', once: true },
      });
    });
    return () => mm.revert();
  }, { scope: ref });

  // abre o item ativo (altura auto) e troca a imagem de apoio
  useEffect(() => {
    const root = ref.current; if (!root) return;
    const panels = root.querySelectorAll<HTMLElement>('[data-s-panel]');
    const imgs = root.querySelectorAll<HTMLElement>('[data-s-img]');
    panels.forEach((p, i) => {
      const on = i === active;
      if (reduced) { p.style.height = on ? 'auto' : '0px'; return; }
      gsap.to(p, { height: on ? 'auto' : 0, duration: 0.8, ease: EASE.inOut, overwrite: true });
      gsap.to(p.children, { autoAlpha: on ? 1 : 0, y: on ? 0 : 12, duration: on ? 0.7 : 0.3, delay: on ? 0.2 : 0, overwrite: true });
    });
    imgs.forEach((im, i) => {
      const on = i === active;
      if (reduced) { im.style.opacity = on ? '1' : '0'; return; }
      gsap.to(im, { clipPath: on ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)', zIndex: on ? 2 : 1, duration: on ? 1.1 : 0.9, ease: EASE.inOut, overwrite: true });
      gsap.to(im.querySelector('img'), { scale: on ? 1 : 1.15, duration: 1.4, ease: EASE.out, overwrite: true });
    });
  }, [active, reduced]);

  const openDetail = (s: Service) => { setDetail(s); setDrawerOpen(true); };

  return (
    <section ref={ref} id="servicos" tabIndex={-1} data-tone="light" className="relative bg-mineral py-[clamp(96px,14vh,180px)] outline-none" aria-labelledby="servicos-title">
      <div className="px-site grid grid-cols-12 gap-x-6 gap-y-8">
        <p className="label col-span-12 flex gap-4 text-concrete md:col-span-3"><span className="num">(03)</span> Serviços</p>
        <SplitLines id="servicos-title" text={'Seis formas de\ntrabalhar juntos.'} className="display h-lg col-span-12 md:col-span-6" />
        <p className="col-span-12 self-end text-sm text-concrete md:col-span-3">O escopo de cada serviço é definido em contrato. Passe o cursor ou toque para ver os detalhes.</p>
      </div>

      <div className="px-site mt-[clamp(48px,8vh,96px)] grid grid-cols-12 gap-x-6">
        {/* imagem de apoio fixa (desktop) */}
        <div className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-[14vh]">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#cfc9bd]">
              {services.map((s, i) => (
                <div key={s.id} data-s-img className="absolute inset-0" style={{ clipPath: i === 0 ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)', zIndex: i === 0 ? 2 : 1 }}>
                  <Img name={s.image.name} alt={i === active ? s.image.alt : ''} reveal="none" className="h-full w-full" sizes="30vw" />
                </div>
              ))}
            </div>
            <p className="label mt-4 flex justify-between text-concrete" aria-live="polite"><span className="num">{services[Math.max(0, active)].index} / 06</span><span>{services[Math.max(0, active)].title.split(' ').slice(0, 2).join(' ')}</span></p>
          </div>
        </div>

        <ol data-s-list className="col-span-12 lg:col-span-8 lg:col-start-5">
          {services.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.id} className="relative">
                <div data-s-rule className="rule origin-left opacity-30" aria-hidden="true" />
                <h3>
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`svc-${s.id}`}
                    onMouseEnter={() => fine && setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => (fine ? openDetail(s) : setActive(on ? -1 : i))}
                    data-cursor={fine ? 'Ver escopo' : undefined}
                    className="group grid w-full grid-cols-[3.2rem_1fr_auto] items-baseline gap-x-3 py-6 text-left md:grid-cols-[5rem_1fr_auto] md:py-8"
                  >
                    <span className={`label num transition-colors duration-500 ${on ? 'text-ink' : 'text-concrete'}`}>{s.index}</span>
                    <span className={`display text-[clamp(1.75rem,3.5vw,3.6rem)] leading-[1.02] transition-[transform,color] duration-700 ease-out ${on ? 'translate-x-2 italic text-ink' : 'text-ink/55 group-hover:text-ink'}`}>{s.title}</span>
                    <Plus aria-hidden="true" size={20} strokeWidth={1.25} className={`transition-transform duration-700 ease-nord ${on ? 'rotate-45' : ''}`} />
                  </button>
                </h3>
                <div id={`svc-${s.id}`} data-s-panel className="overflow-hidden" style={{ height: i === 0 ? 'auto' : 0 }}>
                  <div className="grid gap-6 pb-10 md:grid-cols-[5rem_1fr] md:gap-x-3">
                    <div className="hidden md:block" />
                    <div className="grid gap-6">
                      <div className="img-frame aspect-[16/10] w-full lg:hidden"><Img name={s.image.name} alt={s.image.alt} reveal="none" className="h-full w-full" sizes="100vw" /></div>
                      <p className="lead max-w-[52ch]">{s.short}</p>
                      <ul className="grid gap-x-8 gap-y-2 text-sm text-ink/75 sm:grid-cols-2">
                        {s.deliverables.slice(0, 4).map((d) => <li key={d} className="flex gap-3"><span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-ink/40" />{d}</li>)}
                      </ul>
                      <div>
                        <button type="button" onClick={() => openDetail(s)} className="link-u label inline-flex items-center gap-2">
                          Ver escopo completo <ArrowUpRight size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          <li aria-hidden="true"><div data-s-rule className="rule origin-left opacity-30" /></li>
        </ol>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={detail?.title ?? 'Serviço'} tone="light">
        {detail && (
          <article className="grid gap-8 pt-4">
            <span data-d-item className="label num text-concrete">Serviço {detail.index} / 06</span>
            <h2 data-d-item className="display h-lg">{detail.title}</h2>
            <div data-d-item className="img-frame aspect-[16/9] w-full"><Img name={detail.image.name} alt={detail.image.alt} reveal="none" className="h-full w-full" sizes="(min-width: 768px) 700px, 100vw" /></div>
            <p data-d-item className="lead">{detail.description}</p>
            <div data-d-item>
              <h3 className="label mb-4 text-concrete">O que pode fazer parte do escopo</h3>
              <ol className="border-t border-line">
                {detail.deliverables.map((d, i) => (
                  <li key={d} className="grid grid-cols-[3rem_1fr] border-b border-line py-3"><span className="num text-concrete">{String(i + 1).padStart(2, '0')}</span>{d}</li>
                ))}
              </ol>
            </div>
            <p data-d-item className="border-l border-ink/30 pl-4 text-sm text-ink/70">{detail.scopeNote}</p>
            <div data-d-item>
              <button type="button" onClick={() => { setDrawerOpen(false); window.setTimeout(openContact, 650); }} className="btn btn-dark"><span>Conversar sobre este serviço</span></button>
            </div>
          </article>
        )}
      </Drawer>
    </section>
  );
}
