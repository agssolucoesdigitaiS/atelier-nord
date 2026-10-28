// Configuração central do site. Edite aqui antes de publicar.
// Tudo que estiver marcado como demonstrativo deve ser substituído por dados reais e verificados.

export const site = {
  name: 'ATELIER NÓRD',
  fullName: 'ATELIER NÓRD Arquitetura',
  tagline: 'Arquitetura que transforma a forma de viver.',
  city: 'São Paulo, SP',

  /** Enquanto true, o site exibe avisos de conteúdo fictício/demonstrativo. */
  demoMode: true,

  contact: {
    /** E-mail exibido no rodapé. Domínio .exemplo é reservado e não recebe mensagens. */
    email: 'contato@ateliernord.exemplo',
    emailIsDemo: true,
    phone: '+55 (11) 0000-0000',
    phoneIsDemo: true,
    /** URL completa do Instagram. null = não exibe link. */
    instagram: null as string | null,
  },

  /**
   * Endpoint do formulário de contato (POST JSON).
   * null = modo demonstrativo: nada é enviado e o usuário é avisado.
   * Ao conectar um backend, aplique validação, antispam e rate limit no servidor.
   */
  contactEndpoint: null as string | null,

  credits: {
    label: 'Site conceitual desenvolvido por',
    author: 'AGS Soluções Digitais',
    url: null as string | null,
  },

  imageNote:
    'Imagens: renders digitais conceituais criados para esta demonstração. Não representam obras construídas.',
};

export type NavItem = { id: string; label: string; index: string };

export const nav: NavItem[] = [
  { id: 'inicio', label: 'Início', index: '00' },
  { id: 'projetos', label: 'Projetos', index: '01' },
  { id: 'servicos', label: 'Serviços', index: '02' },
  { id: 'experiencia', label: 'Experiência 3D', index: '03' },
  { id: 'processo', label: 'Processo', index: '04' },
  { id: 'estudio', label: 'Estúdio', index: '05' },
  { id: 'contato', label: 'Contato', index: '06' },
];
