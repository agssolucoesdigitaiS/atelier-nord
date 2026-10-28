import { useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, Check, Copy } from 'lucide-react';
import { site } from '../../data/site';
import { formatPayload, submitContact, type ContactPayload } from '../../lib/contact';

const tipos = ['Residência', 'Interiores', 'Projeto comercial', 'Reforma ou retrofit', 'Consultoria', 'Acompanhamento de obra', 'Outro'];
const prazos = ['Nos próximos 3 meses', 'Entre 3 e 6 meses', 'Entre 6 e 12 meses', 'Ainda sem previsão'];
const areas = ['Até 80 m²', '80 a 150 m²', '150 a 300 m²', '300 a 500 m²', 'Acima de 500 m²'];

type Errors = Partial<Record<keyof ContactPayload, string>>;
const empty: ContactPayload = { nome: '', email: '', telefone: '', tipo: '', cidade: '', area: '', inicio: '', mensagem: '', consentimento: false };

function validate(d: ContactPayload): Errors {
  const e: Errors = {};
  if (d.nome.trim().length < 3) e.nome = 'Informe seu nome completo.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = 'Informe um e-mail válido, como nome@dominio.com.';
  const digits = d.telefone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 13) e.telefone = 'Informe o telefone com DDD, por exemplo (11) 91234-5678.';
  if (!d.tipo) e.tipo = 'Escolha o tipo de projeto.';
  if (d.cidade.trim().length < 2) e.cidade = 'Informe a cidade do projeto.';
  if (!d.inicio) e.inicio = 'Escolha uma previsão de início.';
  if (d.mensagem.trim().length < 20) e.mensagem = 'Conte um pouco mais sobre o projeto (mínimo de 20 caracteres).';
  if (!d.consentimento) e.consentimento = 'É preciso concordar com a política de privacidade para continuar.';
  return e;
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/**
 * Formulário completo com validação. Sem endpoint configurado, NÃO simula envio:
 * informa o modo demonstrativo e oferece copiar os dados.
 */
export function ContactForm({ onOpenPrivacy }: { onOpenPrivacy: () => void }) {
  const [data, setData] = useState<ContactPayload>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'demo' | 'error'>('idle');
  const [serverMsg, setServerMsg] = useState('');
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');
  const honey = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLPreElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const text = useMemo(() => formatPayload(data), [data]);

  const set = <K extends keyof ContactPayload>(k: K, v: ContactPayload[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate(data);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) { formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(); return; }
    setStatus('sending');
    const r = await submitContact(data, honey.current?.value ?? '');
    if (r.status === 'error') { setStatus('error'); setServerMsg(r.message); return; }
    setStatus(r.status);
  }

  async function copy() {
    try { await navigator.clipboard.writeText(text); setCopied('ok'); }
    catch {
      setCopied('fail');
      const el = summaryRef.current; if (el) { const range = document.createRange(); range.selectNodeContents(el); const s = window.getSelection(); s?.removeAllRanges(); s?.addRange(range); }
    }
  }

  if (status === 'demo') {
    return (
      <div role="status" className="grid gap-6">
        <span className="demo-tag w-fit text-sand">Modo demonstrativo</span>
        <h3 className="display h-md">Seus dados não foram enviados.</h3>
        <p className="text-paper/75">
          Este site é uma demonstração e ainda não tem um destino configurado para mensagens. Nada foi transmitido ou armazenado.
          Se quiser guardar o que escreveu, copie o resumo abaixo.
        </p>
        <pre ref={summaryRef} className="max-h-72 overflow-auto whitespace-pre-wrap border border-paper/15 p-5 font-sans text-sm text-paper/85">{text}</pre>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={copy} className="btn btn-light">
            {copied === 'ok' ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied === 'ok' ? 'Resumo copiado' : 'Copiar resumo'}</span>
          </button>
          <button type="button" onClick={() => setStatus('idle')} className="btn btn-light"><span>Voltar ao formulário</span></button>
        </div>
        {copied === 'fail' && <p className="text-sm text-sand">Não foi possível copiar automaticamente. O texto foi selecionado: use Ctrl+C ou Cmd+C.</p>}
        <p className="text-xs text-paper/50">Para ativar o envio real, configure <code>contactEndpoint</code> em src/data/site.ts e valide os dados no servidor.</p>
      </div>
    );
  }

  if (status === 'sent') {
    return (
      <div role="status" className="grid gap-5">
        <h3 className="display h-md">Mensagem enviada.</h3>
        <p className="text-paper/75">Recebemos seus dados. A resposta chega pelo e-mail informado.</p>
      </div>
    );
  }

  const field = (k: keyof ContactPayload) => ({ id: `cf-${k}`, name: k, 'aria-invalid': errors[k] ? true : undefined, 'aria-describedby': errors[k] ? `cf-${k}-err` : undefined });
  const Err = ({ k }: { k: keyof ContactPayload }) => (errors[k] ? <span id={`cf-${k}-err`} className="err">{errors[k]}</span> : null);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-7">
      {site.contactEndpoint === null && (
        <p data-d-item className="flex gap-3 border border-paper/15 p-4 text-sm text-paper/70">
          <span className="demo-tag h-fit shrink-0 text-sand">Demo</span>
          Formulário em modo demonstrativo: a validação funciona, mas nenhuma mensagem é enviada.
        </p>
      )}
      <div className="grid gap-7 md:grid-cols-2">
        <div data-d-item className="field"><label htmlFor="cf-nome">Nome</label><input {...field('nome')} autoComplete="name" value={data.nome} onChange={(e) => set('nome', e.target.value)} data-autofocus /><Err k="nome" /></div>
        <div data-d-item className="field"><label htmlFor="cf-email">E-mail</label><input {...field('email')} type="email" autoComplete="email" inputMode="email" value={data.email} onChange={(e) => set('email', e.target.value)} /><Err k="email" /></div>
        <div data-d-item className="field"><label htmlFor="cf-telefone">Telefone / WhatsApp</label><input {...field('telefone')} type="tel" autoComplete="tel" inputMode="tel" value={data.telefone} onChange={(e) => set('telefone', maskPhone(e.target.value))} /><Err k="telefone" /></div>
        <div data-d-item className="field"><label htmlFor="cf-cidade">Cidade do projeto</label><input {...field('cidade')} autoComplete="address-level2" value={data.cidade} onChange={(e) => set('cidade', e.target.value)} /><Err k="cidade" /></div>
        <div data-d-item className="field"><label htmlFor="cf-tipo">Tipo de projeto</label>
          <select {...field('tipo')} value={data.tipo} onChange={(e) => set('tipo', e.target.value)}><option value="">Selecione</option>{tipos.map((t) => <option key={t}>{t}</option>)}</select><Err k="tipo" /></div>
        <div data-d-item className="field"><label htmlFor="cf-area">Área aproximada (opcional)</label>
          <select {...field('area')} value={data.area} onChange={(e) => set('area', e.target.value)}><option value="">Não sei informar</option>{areas.map((t) => <option key={t}>{t}</option>)}</select></div>
        <div data-d-item className="field md:col-span-2"><label htmlFor="cf-inicio">Previsão de início</label>
          <select {...field('inicio')} value={data.inicio} onChange={(e) => set('inicio', e.target.value)}><option value="">Selecione</option>{prazos.map((t) => <option key={t}>{t}</option>)}</select><Err k="inicio" /></div>
        <div data-d-item className="field md:col-span-2"><label htmlFor="cf-mensagem">Mensagem</label><textarea {...field('mensagem')} rows={4} value={data.mensagem} onChange={(e) => set('mensagem', e.target.value)} placeholder="O que você deseja construir, reformar ou transformar?" className="resize-y placeholder:text-paper/35" /><Err k="mensagem" /></div>
      </div>
      {/* honeypot antispam: invisível para pessoas */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden"><label htmlFor="cf-site">Não preencha</label><input id="cf-site" ref={honey} tabIndex={-1} autoComplete="off" /></div>
      <div data-d-item className="grid gap-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-paper/80">
          <input {...field('consentimento')} type="checkbox" checked={data.consentimento} onChange={(e) => set('consentimento', e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#c6bba9]" />
          <span>Concordo com o uso destes dados para retorno sobre o projeto, conforme a{' '}
            <button type="button" onClick={onOpenPrivacy} className="link-u text-paper">política de privacidade</button>.</span>
        </label>
        <Err k="consentimento" />
      </div>
      {status === 'error' && <p role="alert" className="border border-[#e3a28f]/50 p-4 text-sm text-[#f0b6a6]">{serverMsg}</p>}
      <div data-d-item>
        <button type="submit" disabled={status === 'sending'} className="btn btn-solid disabled:opacity-60">
          <span>{status === 'sending' ? 'Validando…' : 'Enviar mensagem'}</span><ArrowRight size={16} strokeWidth={1.5} />
        </button>
      </div>
    </form>
  );
}
