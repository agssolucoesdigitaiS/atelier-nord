export type Service = {
  id: string;
  index: string;
  title: string;
  short: string;
  description: string;
  deliverables: string[];
  scopeNote: string;
  image: { name: string; alt: string };
};

export const services: Service[] = [
  {
    id: 'residencial',
    index: '01',
    title: 'Projetos arquitetônicos residenciais',
    short: 'Do briefing ao projeto executivo, conforme o escopo contratado.',
    description:
      'Desenvolvimento de residências a partir da rotina e das expectativas de quem vai morar. O trabalho começa pelo entendimento do terreno e do programa e avança em etapas, cada uma aprovada antes da seguinte.',
    deliverables: [
      'Briefing e levantamento de dados do terreno',
      'Estudos de viabilidade',
      'Estudo preliminar',
      'Anteprojeto',
      'Projeto legal, quando contratado',
      'Projeto executivo, conforme escopo',
    ],
    scopeNote:
      'Aprovações em órgãos públicos dependem de análise de terceiros. Prazos são definidos em contrato para cada etapa.',
    image: { name: 'horizonte-hero', alt: 'Residência contemporânea com volume de concreto e deck de pedra.' },
  },
  {
    id: 'interiores',
    index: '02',
    title: 'Arquitetura de interiores',
    short: 'Layout, materiais, iluminação e marcenaria pensados em conjunto.',
    description:
      'Projetos de interiores que tratam o espaço como um todo: a distribuição dos ambientes, a escolha dos materiais, a luz natural e artificial e os detalhes de marcenaria que organizam o dia a dia.',
    deliverables: [
      'Layout e estudo de fluxos',
      'Especificação de materiais e acabamentos',
      'Projeto de iluminação',
      'Detalhamento de marcenaria',
      'Soluções espaciais para armazenamento e integração',
    ],
    scopeNote: 'A compra de mobiliário e a contratação de fornecedores são feitas pelo cliente, salvo acordo diferente em contrato.',
    image: { name: 'orla-estar', alt: 'Sala com piso de travertino, painel ripado e vista para o mar.' },
  },
  {
    id: 'comerciais',
    index: '03',
    title: 'Projetos comerciais',
    short: 'Lojas, clínicas, escritórios e espaços de atendimento.',
    description:
      'Ambientes comerciais pensados a partir da operação: como o cliente chega, espera, é atendido e sai, e como a equipe trabalha nos bastidores. A identidade do negócio aparece no espaço sem prejudicar a rotina.',
    deliverables: [
      'Leitura da operação e dos fluxos de clientes e equipe',
      'Conceito espacial alinhado à marca',
      'Layout, materiais e iluminação',
      'Detalhamento de balcões, expositores e mobiliário fixo',
    ],
    scopeNote: 'Exigências sanitárias, de acessibilidade e do condomínio são consideradas conforme a documentação fornecida.',
    image: { name: 'essenza-balcao', alt: 'Recepção comercial com balcão curvo em travertino.' },
  },
  {
    id: 'retrofit',
    index: '04',
    title: 'Reformas e retrofit',
    short: 'Diagnóstico do imóvel e proposta de intervenção documentada.',
    description:
      'Intervenções em imóveis existentes, com respeito ao que tem valor e atualização do que não atende mais. O ponto de partida é um diagnóstico do estado atual e das possibilidades da edificação.',
    deliverables: [
      'Diagnóstico do imóvel existente',
      'Proposta de intervenção',
      'Compatibilização com projetos complementares, quando aplicável',
      'Documentação do projeto de reforma',
    ],
    scopeNote: 'Laudos estruturais e de instalações são elaborados por profissionais das respectivas áreas.',
    image: { name: 'retrofit', alt: 'Edifício de tijolos com novo caixilho de aço e ampliação contemporânea na cobertura.' },
  },
  {
    id: 'consultoria',
    index: '05',
    title: 'Consultoria arquitetônica',
    short: 'Análise e recomendações pontuais, com entregáveis definidos.',
    description:
      'Para quem precisa de orientação especializada sem contratar um projeto completo: análise de ambientes, recomendações de layout e materiais e avaliação conceitual de viabilidade.',
    deliverables: [
      'Análise dos ambientes',
      'Recomendações de layout',
      'Orientação sobre materiais',
      'Avaliação conceitual de viabilidade',
    ],
    scopeNote: 'Os entregáveis de cada consultoria são definidos em contrato antes do início.',
    image: { name: 'maquete', alt: 'Maquete branca de residência sobre base de madeira.' },
  },
  {
    id: 'acompanhamento',
    index: '06',
    title: 'Acompanhamento técnico de obra',
    short: 'Visitas técnicas e verificação de conformidade ao projeto.',
    description:
      'Visitas periódicas para verificar se a execução segue o projeto, esclarecer dúvidas da equipe de obra e registrar não conformidades. É um serviço de acompanhamento, diferente do gerenciamento integral da obra.',
    deliverables: [
      'Visitas técnicas na frequência contratada',
      'Verificação de conformidade ao projeto',
      'Registro e comunicação de não conformidades',
      'Esclarecimento de dúvidas de interpretação do projeto',
    ],
    scopeNote:
      'Não inclui gerenciamento de equipes, compras, cronograma ou responsabilidade pela execução, salvo contratação específica.',
    image: { name: 'obra', alt: 'Estrutura de concreto em execução com andaimes e arranques de pilares.' },
  },
];
