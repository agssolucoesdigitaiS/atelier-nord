import { site } from '../data/site';

export type ContactPayload = {
  nome: string;
  email: string;
  telefone: string;
  tipo: string;
  cidade: string;
  area: string;
  inicio: string;
  mensagem: string;
  consentimento: boolean;
};

export type SubmitResult =
  | { status: 'sent' }
  | { status: 'demo' }
  | { status: 'error'; message: string };

/**
 * Interface desacoplada de envio. Para conectar um backend, defina site.contactEndpoint
 * (ou substitua esta função). O servidor deve revalidar os dados, aplicar antispam e rate limit.
 */
export async function submitContact(data: ContactPayload, honeypot: string): Promise<SubmitResult> {
  if (honeypot) return { status: 'error', message: 'Não foi possível validar o envio. Recarregue a página e tente de novo.' };
  if (!site.contactEndpoint) return { status: 'demo' };
  try {
    const res = await fetch(site.contactEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return { status: 'error', message: `O servidor recusou a mensagem (código ${res.status}). Tente novamente em alguns minutos.` };
    return { status: 'sent' };
  } catch {
    return { status: 'error', message: 'Sem conexão com o servidor. Verifique sua internet e tente de novo.' };
  }
}

export function formatPayload(d: ContactPayload) {
  return [
    `Nome: ${d.nome}`,
    `E-mail: ${d.email}`,
    `Telefone/WhatsApp: ${d.telefone}`,
    `Tipo de projeto: ${d.tipo}`,
    `Cidade: ${d.cidade}`,
    `Área aproximada: ${d.area || 'não informada'}`,
    `Previsão de início: ${d.inicio}`,
    '',
    d.mensagem,
  ].join('\n');
}
