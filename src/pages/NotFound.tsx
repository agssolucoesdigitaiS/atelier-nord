import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta('Página não encontrada');
  return (
    <main id="conteudo" data-tone="light" className="px-site grid min-h-[100svh] content-center gap-8 bg-mineral py-32">
      <p className="label text-concrete">Erro 404</p>
      <h1 className="display h-xl">Esta página<br /><em>não existe.</em></h1>
      <p className="max-w-[44ch] text-ink/70">O endereço pode ter mudado ou o projeto não faz parte deste portfólio demonstrativo.</p>
      <div><Link to="/" className="btn btn-dark"><span>Voltar ao início</span></Link></div>
    </main>
  );
}
