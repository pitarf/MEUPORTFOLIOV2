/**
 * Base de Dados Demonstrativa de Psicologia Clínica e Saúde Mental
 * Dados modelados de acordo com as normas éticas do Conselho Federal de Psicologia (CFP).
 * Permite customização dinâmica para prospecção ativa e demonstrações sob medida.
 */

export const defaultPsychologistData = {
  id: 'dra-juliana-mendes',
  slug: 'dra-juliana-mendes',
  name: 'Dra. Juliana Mendes',
  title: 'Psicóloga Clínica e Terapeuta Cognitivo-Comportamental',
  crp: 'CRP 05/67890',
  gender: 'female',
  phone: '21987654321',
  phoneFormatted: '(21) 98765-4321',
  whatsappMessage: 'Olá, Dra. Juliana! Gostaria de saber como funciona o atendimento e verificar os horários disponíveis para psicoterapia.',
  email: 'contato@drajulianamendes.com.br',
  
  // Localização e Atendimento
  city: 'Rio de Janeiro',
  state: 'RJ',
  neighborhood: 'Ipanema',
  address: 'Rua Visconde de Pirajá, 550, Sala 804',
  addressComplement: 'Edifício Quartier Ipanema (a 100m do Metrô Nossa Senhora da Paz)',
  modalities: [
    {
      id: 'presencial',
      title: 'Atendimento Presencial',
      subtitle: 'Consultório em Ipanema - RJ',
      description: 'Ambiente planejado com isolamento acústico, luz natural suave e poltrona ergonômica de alto conforto para uma experiência acolhedora e segura.',
      badge: 'Espaço Terapêutico Físico'
    },
    {
      id: 'online',
      title: 'Atendimento Online',
      subtitle: 'Brasil e Exterior',
      description: 'Sessões com a mesma eficácia clínica via plataforma criptografada de ponta a ponta. No conforto e privacidade do seu próprio espaço.',
      badge: 'Autorizado CFP / E-Psi'
    }
  ],
  workingHours: 'Segunda a Sexta: 08h às 20h | Sábado: 08h às 13h',
  
  // Imagens de Alta Resolução Humanizadas
  avatarUrl: 'https://images.unsplash.com/photo-1594824813588-e9f029a8a72b?auto=format&fit=crop&w=800&q=80',
  spaceImages: [
    {
      url: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=1000&q=80',
      title: 'Sala de Acolhimento Individual',
      description: 'Iluminação neutra e quente, difusão aromática sutil e poltronas ergonômicas para máximo conforto emocional.'
    },
    {
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
      title: 'Recepção Tranquila e Discreta',
      description: 'Área de espera intimista com som ambiente de baixa frequência e total privacidade entre horários.'
    },
    {
      url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1000&q=80',
      title: 'Atendimento Online Protegido',
      description: 'Estrutura técnica com internet cabeada de alta estabilidade e microfone direcional garantindo sigilo absoluto.'
    }
  ],

  // Avaliação Google Reviews
  rating: 5.0,
  reviewCount: 48,
  yearsOfExperience: 11,
  completedSessions: '+3.500',

  // Proposta de Valor e Hero
  hero: {
    badge: 'Atendimento Humanizado & Baseado em Evidências',
    headline: 'Um Espaço Seguro, Acolhedor e Livre de Julgamentos para Cuidar de Você',
    subheadline: 'Psicoterapia individual para adultos e jovens. Auxílio clínico especializado para desatar nós emocionais, superar a ansiedade e construir uma vida com significado real.',
    ctaText: 'Agendar Primeira Sessão',
    secondaryCta: 'Conhecer a Abordagem',
    confidentialityBadge: 'Sigilo Profissional Absoluto (CFP 05/67890)'
  },

  // Pilares de Confiança e Rigor Ético
  trustPillars: [
    {
      icon: 'ShieldCheck',
      title: 'Sigilo Profissional Total',
      description: 'Proteção irrestrita de dados e confidencialidade respaldada pelo Código de Ética Profissional do Psicólogo.'
    },
    {
      icon: 'Award',
      title: 'Prática Baseada em Evidências',
      description: 'Protocolos validados cientificamente da Terapia Cognitivo-Comportamental (TCC) e Terapia de Aceitação e Compromisso.'
    },
    {
      icon: 'HeartHandshake',
      title: 'Acolhimento Empático',
      description: 'Um espaço de escuta ativa e profunda, onde todas as suas dores, sentimentos e histórias são validados sem julgamentos.'
    },
    {
      icon: 'Globe',
      title: 'Atendimento Global',
      description: 'Plataforma segura para pacientes brasileiros residentes em qualquer estado do Brasil, Europa, EUA e demais países.'
    }
  ],

  // Especialidades e Áreas de Atuação Clínica
  specialties: [
    {
      id: 'ansiedade',
      title: 'Ansiedade e Síndrome do Pânico',
      shortDescription: 'Manejo de pensamentos acelerados, sintomas somáticos e crises de ansiedade com técnicas cognitivas comprovadas.',
      fullDescription: 'Se você convive com aquela sensação constante de aperto no peito, medo do futuro ou crises repentinas de pânico, a psicoterapia oferece ferramentas práticas para regular o sistema nervoso e desarmar os gatilhos ansiosos.',
      symptoms: ['Preocupação excessiva e ruminação', 'Aceleração cardíaca e falta de ar súbita', 'Sensação de perda de controle ou perigo iminente'],
      color: 'emerald'
    },
    {
      id: 'burnout',
      title: 'Depressão e Esgotamento (Burnout)',
      shortDescription: 'Recuperação gradual da vitalidade, reestruturação da rotina e tratamento do cansaço crônico profissional e emocional.',
      fullDescription: 'A perda gradual do prazer nas atividades diárias e a exaustão que não passa mesmo após dormir são sinais de que seu corpo e mente pedem socorro. Trabalhamos juntos na reconstrução dos seus limites e fontes de prazer.',
      symptoms: ['Sensação de desânimo persistente', 'Cansaço mental extremo e despersonalização', 'Falta de motivação para o trabalho e lazer'],
      color: 'purple'
    },
    {
      id: 'relacionamentos',
      title: 'Conflitos Afetivos e Relacionamento',
      shortDescription: 'Desenvolvimento de comunicação não-violenta, superação de dependência emocional e clareza nos vínculos.',
      fullDescription: 'Relações interpessoais muitas vezes despertam medos de abandono, inseguranças antigas e padrões repetitivos. A terapia amplia sua autopercepção para construir vínculos seguros e respeitosos.',
      symptoms: ['Medo constante de rejeição ou abandono', 'Dificuldade para impor limites saudáveis', 'Padrões repetitivos de relacionamentos desgastantes'],
      color: 'emerald'
    },
    {
      id: 'autoestima',
      title: 'Autoestima e Autossabotagem',
      shortDescription: 'Desconstrução da autocrítica feroz e desenvolvimento de uma relação compassiva e leal consigo mesmo.',
      fullDescription: 'A cobrança constante pela perfeição e a sensação de nunca ser o suficiente geram exaustão silenciosa. Ajudamos você a reconhecer seu valor real e quebrar os ciclos de procrastinação defensiva.',
      symptoms: ['Síndrome do impostor persistente', 'Procrastinação originada do perfeccionismo', 'Necessidade constante de validação externa'],
      color: 'purple'
    },
    {
      id: 'luto-transicoes',
      title: 'Luto e Grandes Transições de Vida',
      shortDescription: 'Suporte no processamento de perdas significativas, separações, mudanças de carreira ou de país.',
      fullDescription: 'Momentos de ruptura exigem acolhimento compassivo. Criamos um porto seguro para você processar o sofrimento no seu tempo, ressignificar memórias e restabelecer um novo senso de direção.',
      symptoms: ['Dor intensa pela perda de alguém querido', 'Desorientação em momentos de mudança radical', 'Sensação de vazio ou perda de propósito'],
      color: 'emerald'
    },
    {
      id: 'regulacao-emocional',
      title: 'Regulação Emocional e Autoconhecimento',
      shortDescription: 'Identificação consciente de padrões emocionais e desenvolvimento de inteligência psicológica.',
      fullDescription: 'Compreender por que você sente o que sente é o primeiro passo para agir com liberdade. Desenvolva repertório emocional para enfrentar os desafios cotidianos com equilíbrio e sobriedade.',
      symptoms: ['Explosões de raiva ou sensibilidade extrema', 'Dificuldade de nomear e compreender emoções', 'Comportamentos reativos dos quais se arrepende depois'],
      color: 'purple'
    }
  ],

  // Como Funciona a Psicoterapia (Passo a Passo Descomplicado)
  howItWorks: [
    {
      step: '01',
      title: 'Primeiro Contato Seguro',
      description: 'Envie uma mensagem pelo WhatsApp ou formulário. Conversaremos brevemente sobre suas necessidades principais e alinharemos o melhor dia e horário.'
    },
    {
      step: '02',
      title: 'A Primeira Sessão de Escuta',
      description: 'Um encontro inicial dedicado a acolher sua história com calma. Sem questionários invasivos, respeitando o seu ritmo e com total sigilo profissional.'
    },
    {
      step: '03',
      title: 'Construção do Plano Terapêutico',
      description: 'Definimos em conjunto os objetivos da terapia, alinhando técnicas e frequência dos encontros para promover transformações sólidas e duradouras.'
    }
  ],

  // Sobre a Profissional
  about: {
    badge: 'Sobre a Profissional',
    greeting: 'Olá, sou a Juliana.',
    lead: 'Acredito que a terapia não é sobre consertar quem você é, mas sobre criar um espaço seguro para que você possa se reencontrar.',
    bio: [
      'Sou Psicóloga Clínica graduada pela Universidade Federal do Rio de Janeiro (UFRJ), com especialização em Terapia Cognitivo-Comportamental (TCC) e formação em Terapia Focada na Compaixão.',
      'Ao longo de mais de uma década de prática clínica, já acompanhei centenas de pessoas que se sentiam soterradas por cobranças internas, ansiedade e angústias silenciosas. Meu papel é ser sua aliada técnica e empática nessa travessia.',
      'Minha postura clínica une o rigor da ciência psicológica ao calor do acolhimento humano: sem jaleco de distanciamento, sem julgamentos morais, com respeito absoluto à sua individualidade e ao seu tempo.'
    ],
    credentials: [
      'Graduação em Psicologia (UFRJ)',
      'Especialização em TCC pelo Instituto de Psiquiatria (IPUB/UFRJ)',
      'Membro Ativo da Associação Brasileira de Psicoterapia Cognitiva (FBTC)',
      'Cadastro Ativo no Conselho Regional de Psicologia (CRP 05/67890)',
      'Registro E-Psi para Atendimentos Psicológicos Online no Exterior e Brasil'
    ]
  },

  // Depoimentos Humanizados Anonimizados (Em estrita conformidade com o CFP)
  testimonials: [
    {
      quote: 'Eu vivia em um estado de alerta permanente, sem conseguir dormir direito há meses. Encontrar um lugar onde pude falar tudo sem medo de ser julgada mudou a forma como eu me enxergo e como lido com as cobranças do trabalho.',
      patientInitials: 'M. C.',
      context: 'Paciente em atendimento para Ansiedade e Burnout',
      sessionType: 'Atendimento Online (São Paulo - SP)',
      rating: 5
    },
    {
      quote: 'A Dra. Juliana tem uma escuta muito precisa e afetuosa. Não foram soluções mágicas, mas ferramentas reais que me ensinaram a respirar no meio do caos e a impor limites sem me sentir culpado.',
      patientInitials: 'R. S.',
      context: 'Paciente em acompanhamento clínico',
      sessionType: 'Atendimento Presencial (Ipanema - RJ)',
      rating: 5
    },
    {
      quote: 'Moro fora do Brasil há 4 anos e a solidão da expatriação estava pesando muito. Fazer terapia na minha língua materna com alguém tão sensível me devolveu o chão que eu achava que tinha perdido.',
      patientInitials: 'L. F.',
      context: 'Brasileira residente no exterior',
      sessionType: 'Atendimento Online (Lisboa, Portugal)',
      rating: 5
    }
  ],

  // Perguntas Frequentes (FAQ)
  faq: [
    {
      question: 'Como funciona a primeira consulta de psicoterapia?',
      answer: 'A primeira sessão é um momento de acolhimento e reconhecimento mútuo. Você terá liberdade total para trazer os motivos que o levaram a buscar ajuda, suas angústias e expectativas. Não há necessidade de saber exatamente por onde começar: nós conduzimos a conversa de forma suave e confortável para que você se sinta seguro.'
    },
    {
      question: 'O atendimento psicológico online tem a mesma eficácia do presencial?',
      answer: 'Sim, absolutamente. Diversos estudos científicos internacionais demonstram que a psicoterapia online possui eficácia equivalente ao modelo presencial. Utilizamos salas virtuais criptografadas, garantindo qualidade de áudio, vídeo e total privacidade. Tudo o que você precisa é de um ambiente privativo e conexão estável à internet.'
    },
    {
      question: 'O que eu falar na sessão é realmente confidencial?',
      answer: 'Sim. O sigilo profissional é um dever ético e legal inegociável, previsto no artigo 9º do Código de Ética Profissional do Psicólogo. Absolutamente nada do que é compartilhado durante as consultas é divulgado a terceiros, empregadores ou familiares, garantindo um ambiente de total proteção e respeito.'
    },
    {
      question: 'Qual é a duração e a frequência das sessões?',
      answer: 'As sessões duram 50 minutos e ocorrem habitualmente uma vez por semana, com dia e horário fixos pré-agendados. Em fases de manutenção ou desmame terapêutico, a frequência pode ser ajustada quinzenalmente conforme a evolução clínica acordada entre nós.'
    },
    {
      question: 'Você atende por convênio médico ou emite nota/recibo para reembolso?',
      answer: 'Os atendimentos são particulares, o que garante tempo estendido, atenção personalizada e dedicação exclusiva a cada caso. No entanto, forneço recibos e notas fiscais detalhadas com meu número de CRP para que você possa solicitar reembolso integral ou parcial junto ao seu plano de saúde (a depender da cobertura contratada), além de dedução no Imposto de Renda.'
    },
    {
      question: 'Como sei que está na hora de procurar um psicólogo?',
      answer: 'Você não precisa esperar chegar ao seu limite ou vivenciar uma crise insuportável para buscar psicoterapia. Se você sente que suas emoções estão difíceis de digerir, se há angústias recorrentes, dúvidas sobre decisões de vida ou simplesmente o desejo de se conhecer melhor, o acompanhamento psicológico é indicado para você.'
    }
  ],

  // Mensagem Final & Aviso de Saúde Mental
  finalCta: {
    title: 'Você não precisa carregar o peso do mundo sozinho.',
    subtitle: 'Dar o primeiro passo pode parecer difícil, mas cuidar da sua saúde mental é o maior ato de gentileza que você pode ter consigo mesmo.',
    buttonText: 'Conversar com a Psicóloga no WhatsApp',
    helpNote: 'Atendimento humanizado, ético e em conformidade estrita com o Conselho Federal de Psicologia.'
  },

  // Informações de Apoio e Emergência (Obrigatório em Saúde Mental)
  emergencySupport: {
    title: 'Em caso de emergência ou sofrimento agudo imediato:',
    phone: '188',
    entity: 'Centro de Valorização da Vida (CVV)',
    description: 'Atendimento telefônico gratuito, confidencial e disponível 24 horas por dia em todo o território nacional.',
    link: 'https://www.cvv.org.br'
  }
};

/**
 * Retorna os dados padrão do profissional de psicologia
 */
export function getDefaultPsychologist() {
  return defaultPsychologistData;
}

/**
 * Busca profissional por slug ou id
 */
export function getPsychologistBySlug(slug) {
  if (!slug) return defaultPsychologistData;
  const normalized = slug.toLowerCase().trim();
  if (normalized === defaultPsychologistData.slug || normalized === defaultPsychologistData.id) {
    return defaultPsychologistData;
  }
  return defaultPsychologistData;
}
