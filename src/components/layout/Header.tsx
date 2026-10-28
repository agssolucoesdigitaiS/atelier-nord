import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap, useGSAP, MOTION_OK, EASE } from '../../lib/gsap';
import { useUI } from '../../lib/ui';
import { Magnetic } from '../motion/Magnetic';

/** Navegação fixa minimalista. O contraste acompanha o tom da seção sob o cabeçalho (data-tone). */
export function Header() {
  const ref = useRef<HTMLElement>(null);
  const { menuOpen, setMenuOpen, openContact, ready, goToSection } = useUI();
  const [tone, setTone] = useState<'light' | 'dark'>('dark');
  const [hidden, setHidden] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();

  // tom da seção sob o header
  useEffect(() => {
    const pick = () => {
      const y = 36;
      const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-tone]'));
      let t: 'light' | 'dark' = 'light';
      for (const s of sections) { const r = s.getBoundingClientRect(); if (r.top <= y && r.bottom > y) t = (s.dataset.tone as 'light' | 'dark') || 'light'; }
      setTone(t);
    };
    let last = window.scrollY, raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        pick();
        const y = window.scrollY;
        if (Math.abs(y - last) > 6) { setHidden(y > last && y > 240); last = y; }
      });
    };
    pick();
    const t = window.setTimeout(pick, 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); window.clearTimeout(t); cancelAnimationFrame(raf); };
  }, [loc.pathname]);

  useGSAP(() => {
    if (!ready) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(ref.current!.querySelectorAll('[data-h-item]'), { yPercent: -120, autoAlpha: 0, duration: 1.1, ease: EASE.out, stagger: 0.07, delay: loc.pathname === '/' ? 1.35 : 0.2 });
    });
    return () => mm.revert();
  }, { dependencies: [ready], scope: ref });

  const dark = tone === 'dark' && !menuOpen;
  const color = menuOpen ? 'text-paper' : dark ? 'text-paper' : 'text-ink';

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-[60] px-site transition-[color,transform] duration-700 ease-out ${color}`}
      style={{ paddingTop: 'calc(18px + env(safe-area-inset-top, 0px))', transform: hidden && !menuOpen ? 'translateY(-110%)' : 'none', visibility: ready ? 'visible' : 'hidden' }}
    >
      <div className="flex h-[52px] items-center justify-between gap-4">
        <a
          href="#"
          data-h-item
          onClick={(e) => { e.preventDefault(); if (loc.pathname === '/') goToSection('inicio'); else navigate('/'); }}
          className="group flex items-baseline gap-3"
          aria-label="ATELIER NÓRD Arquitetura, voltar ao início"
        >
          <span className="font-serif text-[1.6rem] font-normal leading-none tracking-[0.02em]">ATELIER&nbsp;<em className="font-light">Nórd</em></span>
          <span className="label hidden opacity-60 md:inline">Arquitetura</span>
        </a>
        <div className="flex items-center gap-3 md:gap-6">
          <span data-h-item className="hidden md:inline-block">
            <Magnetic>
              <button type="button" onClick={openContact} className={`btn min-h-[44px] px-5 text-[0.72rem] ${dark || menuOpen ? 'btn-light' : 'btn-dark'}`}>
                <span>Iniciar projeto</span>
              </button>
            </Magnetic>
          </span>
          <span data-h-item>
            <Magnetic>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-controls="menu-overlay"
                className="flex min-h-[44px] items-center gap-3 px-1"
              >
                <span className="label">{menuOpen ? 'Fechar' : 'Menu'}</span>
                <span aria-hidden="true" className="relative block h-[10px] w-7">
                  <span className="absolute left-0 right-0 top-0 h-px bg-current transition-transform duration-500 ease-nord" style={{ transform: menuOpen ? 'translateY(4.5px) rotate(45deg)' : 'none' }} />
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-current transition-transform duration-500 ease-nord" style={{ transform: menuOpen ? 'translateY(-4.5px) rotate(-45deg)' : 'none' }} />
                </span>
              </button>
            </Magnetic>
          </span>
        </div>
      </div>
    </header>
  );
}
