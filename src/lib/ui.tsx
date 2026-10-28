import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useScroll } from '../components/motion/SmoothScroll';

type UI = {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  contactOpen: boolean;
  openContact: () => void;
  closeContact: () => void;
  goToSection: (id: string) => void;
  ready: boolean;
  setReady: (v: boolean) => void;
};
const UICtx = createContext<UI | null>(null);
export const useUI = () => {
  const c = useContext(UICtx);
  if (!c) throw new Error('useUI fora do provider');
  return c;
};

export function UIProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const { scrollTo, lock } = useScroll();
  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => { lock(menuOpen || contactOpen); }, [menuOpen, contactOpen, lock]);

  const goToSection = useCallback((id: string) => {
    setMenuOpen(false);
    if (loc.pathname !== '/') { navigate('/', { state: { scrollTo: id } }); return; }
    // aguarda o fechamento do menu antes de rolar
    window.setTimeout(() => {
      if (id === 'inicio') scrollTo(0);
      else scrollTo(`#${id}`);
      const el = document.getElementById(id);
      el?.focus?.({ preventScroll: true });
    }, 80);
  }, [loc.pathname, navigate, scrollTo]);

  const value = useMemo<UI>(() => ({
    menuOpen, setMenuOpen,
    contactOpen, openContact: () => { setMenuOpen(false); setContactOpen(true); }, closeContact: () => setContactOpen(false),
    goToSection, ready, setReady,
  }), [menuOpen, contactOpen, goToSection, ready]);

  return <UICtx.Provider value={value}>{children}</UICtx.Provider>;
}
