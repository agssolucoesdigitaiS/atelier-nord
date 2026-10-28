import { Hero } from '../components/sections/Hero';
import { Manifesto } from '../components/sections/Manifesto';
import { Projects } from '../components/sections/Projects';
import { Services } from '../components/sections/Services';
import { Experience3D } from '../components/sections/Experience3D';
import { Process } from '../components/sections/Process';
import { About } from '../components/sections/About';
import { Testimonials } from '../components/sections/Testimonials';
import { CTA } from '../components/sections/CTA';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Home() {
  usePageMeta(null, 'Estúdio conceitual de arquitetura contemporânea em São Paulo: residências autorais, interiores e projetos comerciais. Site demonstrativo.');
  return (
    <main id="conteudo">
      <Hero />
      <Manifesto />
      <Projects />
      <Services />
      <Experience3D />
      <Process />
      <About />
      <Testimonials />
      <CTA />
    </main>
  );
}
