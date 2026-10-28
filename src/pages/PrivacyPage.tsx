import { AlertTriangle } from 'lucide-react';
import { site } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';

const sections = [
  { t: 'Quem somos', p: `Este é o site demonstrativo do ${site.fullName}, estúdio fictício localizado em ${site.city}. Antes da publicação, este texto deve identificar o controlador real dos dados e seu canal de contato.` },
  { t: 'Quais dados coletamos', p: 'Somente os dados que você informa no formulário de contato: nome, e-mail, telefone, tipo de projeto, cidade, área aproximada, previsão de início e mensagem. Não usamos cookies de rastreamento nem ferramentas de publicidade nesta versão.' },
  { t: 'Para que usamos', p: 'Para responder ao seu contato e conversar sobre o projeto descrito. Os dados não são vendidos nem compartilhados para fins de marketing de terceiros.' },
  { t: 'Por quanto tempo guardamos', p: 'Pelo tempo necessário para tratar o seu contato e cumprir obrigações legais aplicáveis. O prazo exato deve ser definido pelo responsável antes da publicação.' },
  { t: 'Seus direitos', p: 'Você pode pedir acesso, correção ou exclusão dos seus dados e revogar o consentimento, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).' },
  { t: 'Situação atual do formulário', p: 'Nesta versão demonstrativa, o formulário não envia nem armazena nenhuma informação. Ao conectar um serviço de envio, atualize esta política com o nome do operador e o local de armazenamento.' },
];

export default function PrivacyPage() {
  usePageMeta('Política de privacidade', 'Política de privacidade demonstrativa do ATELIER NÓRD Arquitetura.');
  return (
    <main id="conteudo" data-tone="light" className="bg-mineral">
      <section className="px-site grid grid-cols-12 gap-x-6 gap-y-12 pb-24" style={{ paddingTop: 'calc(160px + env(safe-area-inset-top, 0px))' }}>
        <div className="col-span-12 md:col-span-4">
          <p className="label text-concrete">Documento</p>
          <h1 className="display h-lg mt-6">Política de privacidade</h1>
        </div>
        <div className="col-span-12 grid gap-10 md:col-span-7 md:col-start-6">
          <p role="note" className="flex gap-3 border border-ink/30 p-5 text-sm">
            <AlertTriangle size={18} strokeWidth={1.5} className="mt-0.5 shrink-0" />
            <span><strong className="font-semibold">Conteúdo demonstrativo.</strong> Este texto é um modelo de referência e não substitui orientação jurídica. Revise e adapte com um profissional antes de publicar o site.</span>
          </p>
          {sections.map((s, i) => (
            <article key={s.t} className="grid gap-3 border-t border-line pt-6">
              <h2 className="flex gap-4 font-serif text-3xl"><span className="num label pt-3 text-concrete">{String(i + 1).padStart(2, '0')}</span>{s.t}</h2>
              <p className="max-w-[62ch] text-ink/75">{s.p}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
