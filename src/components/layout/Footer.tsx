import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { gsap, useGSAP, MOTION_OK } from '../../lib/gsap';
import { nav, site } from '../../data/site';
import { useUI } from '../../lib/ui';
import { useScroll } from '../motion/SmoothScroll';
import { Credits } from './Credits';

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { goToSection, openContact } = useUI();
  const { scrollTo } = useScroll();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(ref.current!.querySelectorAll('[data-wm]'), {
        yPercent: 100, ease: 'none', stagger: 0.04,
        scrollTrigger: { trigger: ref.current!.querySelector('[data-wordmark]'), start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
      });
    });
    return () => mm.revert();
  }, { scope: ref });

  const { contact } = site;
  return (
    <footer ref={ref} data-tone="dark" className="relative overflow-hidden bg-ink text-paper">
      <div className="px-site grid grid-cols-12 gap-x-6 gap-y-12 border-t border-paper/10 pt-20 md:pt-28">
        <div className="col-span-12 md:col-span-5">
          <p className="display h-md max-w-[16ch] text-paper/90">Arquitetura que transforma a forma de viver.</p>
          <button type="button" onClick={openContact} className="link-u mt-8 label text-sand">Iniciar um projeto</button>
        </div>
        <nav aria-label="Rodapé" className="col-span-6 md:col-span-2 md:col-start-7">
          <p className="label mb-5 text-paper/45">Navegação</p>
          <ul className="grid gap-2 text-sm">
            {nav.filter((n) => n.id !== 'contato').map((n) => (
              <li key={n.id}><button type="button" onClick={() => goToSection(n.id)} className="link-u text-paper/80 hover:text-paper">{n.label}</button></li>
            ))}
            <li><Link to="/privacidade" className="link-u text-paper/80 hover:text-paper">Política de privacidade</Link></li>
          </ul>
        </nav>
        <div className="col-span-6 md:col-span-3">
          <p className="label mb-5 text-paper/45">Contato</p>
          <ul className="grid gap-2 text-sm text-paper/80">
            <li className="select-all break-all">{contact.email}</li>
            {contact.emailIsDemo && <li className="text-xs text-sand">E-mail demonstrativo · não recebe mensagens</li>}
            <li className="select-all">{contact.phone}</li>
            {contact.phoneIsDemo && <li className="text-xs text-sand">Telefone demonstrativo</li>}
            <li>{site.city}</li>
            <li>{contact.instagram ? <a href={contact.instagram} target="_blank" rel="noreferrer" className="link-u">Instagram</a> : <span className="text-paper/45">Instagram: a configurar</span>}</li>
          </ul>
        </div>
        <div className="col-span-12 flex items-end justify-end md:col-span-1">
          <button type="button" onClick={() => scrollTo(0, { duration: 2 })} className="group grid h-14 w-14 place-items-center rounded-full border border-paper/25 transition-colors hover:bg-paper hover:text-ink" aria-label="Voltar ao topo">
            <ArrowUp size={18} strokeWidth={1.25} className="transition-transform duration-500 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>

      <div data-wordmark aria-hidden="true" className="px-site mt-16 flex select-none justify-between overflow-hidden font-serif font-light leading-[0.78] text-paper" style={{ fontSize: 'clamp(4rem, 17.5vw, 22rem)' }}>
        {'ATELIER'.split('').map((c, i) => <span key={i} data-wm className="inline-block">{c}</span>)}
      </div>
      <div aria-hidden="true" className="px-site flex select-none justify-end overflow-hidden font-serif font-light italic leading-[0.9] text-sand" style={{ fontSize: 'clamp(4rem, 17.5vw, 22rem)' }}>
        {'Nórd'.split('').map((c, i) => <span key={i} data-wm className="inline-block">{c}</span>)}
      </div>

      <div className="px-site flex flex-col gap-4 border-t border-paper/10 py-8 text-xs text-paper/50 md:flex-row md:items-center md:justify-between" style={{ paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 0px))' }}>
        <p>© {new Date().getFullYear()} {site.fullName}. Marca, projetos e depoimentos fictícios, para fins demonstrativos.</p>
        <p>{site.imageNote}</p>
        <Credits />
      </div>
    </footer>
  );
}
