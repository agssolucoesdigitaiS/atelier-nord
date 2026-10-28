import { useCallback } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SmoothScroll } from './components/motion/SmoothScroll';
import { PageTransition } from './components/motion/PageTransition';
import { Preloader } from './components/motion/Preloader';
import { Cursor } from './components/motion/Cursor';
import { Header } from './components/layout/Header';
import { MenuOverlay } from './components/layout/MenuOverlay';
import { Footer } from './components/layout/Footer';
import { ContactDrawer } from './components/ui/ContactDrawer';
import { UIProvider, useUI } from './lib/ui';
import { AppRouter } from './lib/router';
import { HERO_IMAGE } from './components/sections/Hero';
import { scheduleRefresh } from './lib/gsap';
import Home from './pages/Home';
import ProjectPage from './pages/ProjectPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFound from './pages/NotFound';

function Shell() {
  const { setReady } = useUI();
  const done = useCallback(() => { setReady(true); scheduleRefresh(50); }, [setReady]);
  return (
    <>
      <a href="#conteudo" onClick={(e) => { e.preventDefault(); document.getElementById('conteudo')?.focus(); }} className="sr-only-focusable fixed left-4 top-4 z-[300] bg-paper px-4 py-3 text-sm text-ink">Pular para o conteúdo</a>
      <Preloader onDone={done} heroImage={HERO_IMAGE} />
      <Cursor />
      <Header />
      <MenuOverlay />
      <PageTransition
        render={(loc) => (
          <>
            <Routes location={loc}>
              <Route path="/" element={<Home />} />
              <Route path="/projetos/:slug" element={<ProjectPage />} />
              <Route path="/privacidade" element={<PrivacyPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </>
        )}
      />
      <ContactDrawer />
    </>
  );
}

export default function App() {
  return (
    <AppRouter>
      <SmoothScroll>
        <UIProvider>
          <Shell />
        </UIProvider>
      </SmoothScroll>
    </AppRouter>
  );
}
