import { useEffect, useRef, useState } from 'react';
import { gsap, EASE } from '../../lib/gsap';
import { useUI } from '../../lib/ui';
import { nav, site } from '../../data/site';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useReducedMotion } from '../../hooks/useMedia';
import { Img } from '../ui/Img';

const previews: Record<string, string> = {
  inicio: 'horizonte-crepusculo', projetos: 'serra-encosta', servicos: 'orla-estar', experiencia: 'maquete',
  processo: 'estudio', estudio: 'materiais', contato: 'essenza-balcao',
};

/** Menu fullscreen com entradas em stagger, números de seção e gestão de foco. */
export function MenuOverlay() {
  const { menuOpen, setMenuOpen, goToSection, openContact } = useUI();
  const root = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [hover, setHover] = useState('inicio');
  const reduced = useReducedMotion();
  const close = () => setMenuOpen(false);
  useFocusTrap(root, menuOpen && mounted, close);

  useEffect(() => {
    if (menuOpen) setMounted(true);
  }, [menuOpen]);

  useEffect(() => {
    const el = root.current;
    if (!el || !mounted) return;
    const items = el.querySelectorAll('[data-m-item]');
    const ctx = gsap.context(() => {
      if (menuOpen) {
        if (reduced) { gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)' }); return; }
        gsap.timeline()
          .fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: EASE.inOut })
          .fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 1, ease: EASE.out, stagger: 0.05 }, 0.35)
          .fromTo(el.querySelectorAll('[data-m-fade]'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE.soft, stagger: 0.06 }, 0.55);
      } else {
        if (reduced) { setMounted(false); return; }
        gsap.timeline({ onComplete: () => setMounted(false) })
          .to(items, { yPercent: -110, duration: 0.5, ease: 'power3.in', stagger: 0.025 })
          .to(el, { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.8, ease: EASE.inOut }, 0.2);
      }
    }, el);
    return () => ctx.kill();
  }, [menuOpen, mounted, reduced]);

  if (!mounted) return null;
  return (
    <div
      ref={root}
      id="menu-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
      data-lenis-prevent
      className="fixed inset-0 z-[55] overflow-y-auto bg-ink text-paper"
      style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
    >
      <div className="px-site grid min-h-full grid-cols-12 gap-x-6 pb-10" style={{ paddingTop: 'calc(110px + env(safe-area-inset-top, 0px))' }}>
        <nav aria-label="Seções" className="col-span-12 lg:col-span-7">
          <ul className="border-t border-paper/15">
            {nav.map((n) => (
              <li key={n.id} className="border-b border-paper/15">
                <button
                  type="button"
                  onClick={() => (n.id === 'contato' ? (close(), window.setTimeout(openContact, 450)) : goToSection(n.id))}
                  onMouseEnter={() => setHover(n.id)}
                  onFocus={() => setHover(n.id)}
                  className="group flex w-full items-baseline gap-5 py-2 text-left md:py-3"
                >
                  <span className="line-mask label num w-8 shrink-0 text-sand"><span data-m-item>{n.index}</span></span>
                  <span className="line-mask display text-[clamp(2.1rem,min(5.6vw,8.2vh),5.2rem)] leading-[1]">
                    <span data-m-item className="transition-[transform,color] duration-700 ease-out group-hover:translate-x-4 group-hover:italic group-hover:text-sand group-focus-visible:translate-x-4 group-focus-visible:text-sand">{n.label}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <aside className="col-span-12 mt-10 flex flex-col gap-8 lg:col-span-4 lg:col-start-9 lg:mt-0">
          <div data-m-fade className="hidden aspect-[4/5] w-full lg:block">
            <Img key={hover} name={previews[hover]} alt="" reveal="none" sizes="30vw" className="h-full w-full" />
          </div>
          <div data-m-fade className="grid gap-2 text-sm text-paper/70">
            <span className="label text-sand">Estúdio</span>
            <span>{site.city}</span>
            <span>{site.contact.email}{site.contact.emailIsDemo ? ' · demonstrativo' : ''}</span>
          </div>
          <p data-m-fade className="text-xs leading-relaxed text-paper/50">Projeto conceitual. Marca, cases e depoimentos são fictícios.</p>
        </aside>
      </div>
    </div>
  );
}
