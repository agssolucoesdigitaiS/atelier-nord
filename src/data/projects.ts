// Cases conceituais e fictícios. Áreas e anos são demonstrativos.

export type ProjectImage = { name: string; alt: string };

export type Project = {
  slug: string;
  index: string;
  name: string;
  category: string;
  city: string;
  year: number;
  area: number;
  summary: string;
  concept: string;
  partido: string;
  organizacao: string[];
  materiais: { name: string; note: string }[];
  cover: ProjectImage;
  gallery: ProjectImage[];
};

export const projects: Project[] = [
  {
    slug: 'casa-horizonte',
    index: '01',
    name: 'Casa Horizonte',
    category: 'Residência unifamiliar',
    city: 'São Paulo',
    year: 2025,
    area: 320,
    summary: 'Um volume de concreto apoiado sobre uma caixa de vidro, aberto para o jardim e protegido do sol da tarde.',
    concept:
      'A casa se organiza em duas camadas. No térreo, a vida social acontece em um pavimento transparente, contínuo com o deck e o espelho d’água. No pavimento superior, os quartos ficam recolhidos em um volume de concreto que avança cinco metros em balanço e faz sombra sobre a área externa.',
    partido:
      'Separar o que é público do que é íntimo com uma única decisão estrutural. O balanço cria uma varanda sem pilares, controla a insolação da fachada oeste e enquadra a paisagem a partir do interior.',
    organizacao: [
      'Térreo: estar, jantar e cozinha integrados em planta livre, com fechamentos de vidro piso-teto.',
      'Volume de madeira lateral: escritório, lavabo e apoio de serviço.',
      'Pavimento superior: três suítes voltadas para o jardim por uma janela em fita contínua.',
      'Área externa: deck de pedra, espelho d’água de 14 metros e paisagismo com espécies de sombra.',
    ],
    materiais: [
      { name: 'Concreto aparente', note: 'Fôrmas de compensado com junta marcada, sem revestimento.' },
      { name: 'Madeira freijó', note: 'Brises verticais e fechamento do volume de apoio.' },
      { name: 'Vidro laminado', note: 'Caixilhos de perfil mínimo no térreo.' },
      { name: 'Pedra natural', note: 'Piso contínuo entre interior e deck.' },
    ],
    cover: { name: 'horizonte-crepusculo', alt: 'Render demonstrativo da Casa Horizonte ao entardecer, com volume de concreto em balanço iluminado e térreo envidraçado.' },
    gallery: [
      { name: 'horizonte-balanco', alt: 'Vista inferior do balanço de concreto contra o céu, com brises de madeira na fachada lateral.' },
      { name: 'horizonte-hero', alt: 'Vista diurna da residência com deck de pedra, espelho d’água e jardim arborizado.' },
      { name: 'detalhe-brise', alt: 'Detalhe de brises de madeira projetando sombras listradas sobre parede de concreto aparente.' },
    ],
  },
  {
    slug: 'refugio-serra',
    index: '02',
    name: 'Refúgio Serra',
    category: 'Residência de campo',
    city: 'Campos do Jordão',
    year: 2024,
    area: 245,
    summary: 'Uma caixa de madeira pousada sobre um embasamento de pedra, voltada para o vale e para a neblina da manhã.',
    concept:
      'A topografia em declive definiu a casa. Um embasamento de pedra resolve o desnível e abriga os ambientes técnicos. Sobre ele, um volume de madeira se estende em direção ao vale, com uma única grande janela que transforma a paisagem em parte do interior.',
    partido:
      'Tocar o terreno o mínimo possível. A pedra ancora a casa na encosta, e a madeira, mais leve, avança sobre o vazio. A cobertura de concreto se projeta para proteger o vidro da chuva e do sol baixo de inverno.',
    organizacao: [
      'Embasamento: adega, depósito e casa de máquinas, semienterrados na encosta.',
      'Pavimento principal: estar com lareira suspensa, cozinha e duas suítes.',
      'Deck suspenso em balanço sobre o terreno, com guarda-corpo de vidro.',
    ],
    materiais: [
      { name: 'Pedra local', note: 'Assentamento em junta seca no embasamento.' },
      { name: 'Madeira termotratada', note: 'Revestimento externo em réguas verticais.' },
      { name: 'Concreto', note: 'Laje de cobertura com beiral contínuo.' },
      { name: 'Aço', note: 'Esquadrias e pilares esbeltos do deck.' },
    ],
    cover: { name: 'serra-encosta', alt: 'Render demonstrativo do Refúgio Serra: volume de madeira sobre embasamento de pedra em encosta com pinheiros e neblina.' },
    gallery: [
      { name: 'serra-fachada', alt: 'Fachada principal com grande pano de vidro e deck suspenso sobre a encosta.' },
      { name: 'serra-interior', alt: 'Estar interno com piso de madeira, lareira suspensa de concreto e vista para a mata de pinheiros.' },
      { name: 'materiais', alt: 'Amostras de materiais sobre mesa: concreto, madeira, travertino, basalto e linho.' },
    ],
  },
  {
    slug: 'apartamento-orla',
    index: '03',
    name: 'Apartamento Orla',
    category: 'Interiores residenciais',
    city: 'Santos',
    year: 2025,
    area: 180,
    summary: 'Interiores em travertino, linho e madeira, organizados para que o mar seja visto de todos os ambientes sociais.',
    concept:
      'O projeto retirou paredes para liberar a fachada envidraçada e concentrou as funções de apoio em um painel ripado contínuo. A paleta parte da areia e da luz da orla: tons claros, texturas naturais e pouco contraste.',
    partido:
      'Uma única parede equipada resolve armazenamento, televisão e acesso aos quartos. Com isso, a sala, a cozinha e o jantar formam um só espaço diante da paisagem.',
    organizacao: [
      'Estar voltado para a varanda, com mobiliário baixo para não interromper a vista.',
      'Cozinha com ilha em travertino e marcenaria até o teto.',
      'Painel ripado de madeira que esconde portas e armários.',
    ],
    materiais: [
      { name: 'Travertino', note: 'Piso em grandes formatos e tampos.' },
      { name: 'Madeira natural', note: 'Painel ripado e marcenaria.' },
      { name: 'Linho', note: 'Estofados e cortinas.' },
      { name: 'Pintura mineral', note: 'Paredes e teto em tom quente.' },
    ],
    cover: { name: 'orla-estar', alt: 'Render demonstrativo do Apartamento Orla: sala com piso de travertino, painel de madeira ripada e vista para o mar.' },
    gallery: [
      { name: 'orla-detalhe', alt: 'Sofá em linho e mesas cilíndricas de travertino com faixas de sol entrando pelos caixilhos.' },
      { name: 'orla-cozinha', alt: 'Cozinha com marcenaria de madeira até o teto e ilha com tampo de pedra clara.' },
      { name: 'materiais', alt: 'Amostras de materiais naturais usados no projeto de interiores.' },
    ],
  },
  {
    slug: 'essenza-studio',
    index: '04',
    name: 'Essenza Studio',
    category: 'Arquitetura comercial',
    city: 'São Paulo',
    year: 2026,
    area: 210,
    summary: 'Um espaço de atendimento em tons de areia, com balcão curvo em travertino e um arco que conduz à área reservada.',
    concept:
      'O estúdio recebe clientes para atendimentos individuais. O projeto organiza o percurso da rua até a sala reservada em três momentos: a fachada aberta, a recepção curva e a passagem pelo arco.',
    partido:
      'Usar a geometria para orientar o fluxo. O balcão curvo recebe e distribui, os nichos expõem produtos sem poluir as paredes e o arco marca a transição entre o público e o privado.',
    organizacao: [
      'Fachada com pórtico de concreto e vitrine contínua.',
      'Recepção com balcão curvo e iluminação pendente.',
      'Espera com bancos de pedra e vegetação.',
      'Salas de atendimento além do arco, com acesso controlado.',
    ],
    materiais: [
      { name: 'Reboco mineral', note: 'Paredes em tom areia com textura suave.' },
      { name: 'Travertino', note: 'Balcão e bancos.' },
      { name: 'Microcimento', note: 'Piso contínuo, de fácil manutenção.' },
      { name: 'Madeira', note: 'Prateleiras dos nichos.' },
    ],
    cover: { name: 'essenza-balcao', alt: 'Render demonstrativo do Essenza Studio: recepção com balcão curvo de travertino, pendentes e arco ao fundo.' },
    gallery: [
      { name: 'essenza-fachada', alt: 'Fachada comercial com pórtico de concreto e vitrine, vista da calçada.' },
      { name: 'essenza-espera', alt: 'Área de espera com bancos de pedra, planta e espelho redondo.' },
      { name: 'estudio', alt: 'Ambiente de trabalho com mesa longa, maquetes brancas e pendentes.' },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
