// Conteúdo editorial: processo, depoimentos, estúdio e experiência 3D.

export const processSteps = [
  {
    index: '01',
    title: 'Imersão e briefing',
    text: 'Compreender necessidades, rotina, orçamento de referência e expectativas.',
    detail: 'Conversas, visita ao terreno ou imóvel e levantamento de informações. O resultado é um programa escrito, validado com o cliente.',
    drawing: 'program' as const,
  },
  {
    index: '02',
    title: 'Conceito e estudos',
    text: 'Testar soluções de implantação, layout, volumetria e linguagem.',
    detail: 'Desenhos, maquetes e modelos 3D para comparar alternativas antes de fixar uma direção.',
    drawing: 'volume' as const,
  },
  {
    index: '03',
    title: 'Desenvolvimento técnico',
    text: 'Detalhar o projeto, coordenar interfaces técnicas contratadas e estruturar a documentação.',
    detail: 'Plantas, cortes e detalhes, compatibilizados com os projetos complementares contratados.',
    drawing: 'section' as const,
  },
  {
    index: '04',
    title: 'Materialização',
    text: 'Orientar a interpretação do projeto e realizar acompanhamento técnico quando contratado.',
    detail: 'Esclarecimento de dúvidas da obra e visitas técnicas na frequência definida em contrato.',
    drawing: 'photo' as const,
  },
];

export const testimonials = [
  {
    quote:
      'Chegamos com uma lista de ambientes e saímos com uma forma de morar. Cada etapa foi explicada com desenhos simples, e as decisões difíceis foram tomadas com calma.',
    name: 'Cliente residencial',
    context: 'Residência unifamiliar · depoimento ilustrativo',
  },
  {
    quote:
      'O projeto da loja partiu da forma como atendemos, e não de uma referência de revista. O balcão, a espera e a sala reservada funcionam como imaginávamos.',
    name: 'Cliente comercial',
    context: 'Espaço de atendimento · depoimento ilustrativo',
  },
  {
    quote:
      'Na reforma, o mais valioso foi o diagnóstico inicial. Entendemos o que valia manter e onde valia investir antes de começar a obra.',
    name: 'Cliente de retrofit',
    context: 'Reforma de apartamento · depoimento ilustrativo',
  },
];

export const principles = [
  { title: 'Proporção', text: 'A medida certa entre cheios e vazios, altura e largura, dentro e fora.' },
  { title: 'Luz', text: 'A orientação do sol decide aberturas, beirais e a posição de cada ambiente.' },
  { title: 'Materialidade', text: 'Poucos materiais, usados com honestidade e pensados para envelhecer bem.' },
  { title: 'Escuta', text: 'O projeto nasce da rotina de quem vai usar o espaço.' },
];

export const experienceStages = [
  { index: 'A', title: 'Fachada', text: 'O volume superior avança sobre o jardim e protege o térreo envidraçado do sol da tarde.' },
  { index: 'B', title: 'Organização volumétrica', text: 'Três volumes, três usos: vidro para a vida social, madeira para o apoio e concreto para o descanso.' },
  { index: 'C', title: 'Materialidade', text: 'Concreto aparente, madeira e vidro. Cada material tem uma função clara na composição.' },
];

export const hotspots = [
  { id: 'luz', title: 'Luz natural', text: 'A janela em fita ilumina os quartos de forma uniforme, e o balanço sombreia o térreo nas horas mais quentes.' },
  { id: 'integracao', title: 'Integração', text: 'Os caixilhos de piso a teto se abrem por completo e unem o estar ao deck e ao espelho d’água.' },
  { id: 'materialidade', title: 'Materialidade', text: 'O concreto bruto encontra a madeira em um único ponto, marcando a transição entre os volumes.' },
];
