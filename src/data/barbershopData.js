/**
 * Repositório Central de Dados Parametrizados de Barbearia Ultra-Premium
 * Projeto: MeuPortfolio v2 / Barbearia Dom Rafael
 * Estética: Dark Luxury Vintage / Modern Classic Barber
 * 
 * Estrutura 100% maleável para prospecção ativa via Google Maps Scraper e CRM.
 */

export const defaultBarbershopData = {
  id: 'barbearia-dom-rafael',
  slug: 'barbearia-dom-rafael',
  name: 'Barbearia Dom Rafael',
  tagline: 'Tradição, Precisão e Estilo Clássico',
  headline: 'Estilo, Precisão e Tradição para o Homem Moderno',
  subheadline: 'Mais do que um corte, um ritual de cuidado masculino. Ambiente exclusivo com toalha quente, navalha afiada, atendimento pontual e chopp artesanal gelado como cortesia.',
  
  // Informações de Contato e Localização
  contact: {
    phone: '(21) 98844-3210',
    whatsapp: '5521988443210',
    instagram: '@barbeariadomrafael',
    instagramUrl: 'https://instagram.com',
    email: 'contato@barbeariadomrafael.com.br',
    bookingMessage: 'Olá! Gostaria de agendar um horário na Barbearia Dom Rafael.',
  },

  location: {
    address: 'Av. das Américas, 3500 - Bloco 4, Loja 112',
    neighborhood: 'Barra da Tijuca',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zipCode: '22640-102',
    reference: 'Próximo ao Shopping Barra Garden • Em frente à estação BRT',
    parking: 'Estacionamento privativo gratuito para clientes',
    googleMapsLink: 'https://maps.google.com',
  },

  // Horários de Atendimento
  hours: {
    display: 'Segunda a Sábado das 09h às 20h',
    badge: 'Aberto Hoje até 20h',
    schedule: [
      { day: 'Segunda-feira', time: '09:00 - 20:00' },
      { day: 'Terça-feira', time: '09:00 - 20:00' },
      { day: 'Quarta-feira', time: '09:00 - 20:00' },
      { day: 'Quinta-feira', time: '09:00 - 20:30' },
      { day: 'Sexta-feira', time: '09:00 - 21:00' },
      { day: 'Sábado', time: '08:30 - 20:00' },
      { day: 'Domingo', time: 'Fechado' }
    ]
  },

  // Indicadores de Confiança (Trust Bar)
  stats: {
    rating: 4.9,
    reviewsCount: 487,
    clientsServed: '+3.800',
    yearsInBusiness: '8 Anos',
    highlights: [
      {
        title: '4.9 no Google',
        description: 'Mais de 480 avaliações 5 estrelas de clientes recorrentes'
      },
      {
        title: '+3.800 Clientes Atendidos',
        description: 'Fidelidade comprovada e padrão consistente em cada cadeira'
      },
      {
        title: '8 Anos de Tradição',
        description: 'Mestres barbeiros formados nas melhores academias clássicas'
      },
      {
        title: 'Chopp & Garagem Cortesia',
        description: 'Cerveja artesanal gelada na sua chegada e vaga reservada'
      }
    ]
  },

  // Pilares de Experiência do Cliente
  pillars: [
    {
      title: 'Navalha e Toalha Quente',
      description: 'Massagem facial com vapor de ozônio, óleos essenciais e toalha aquecida para abrir os poros e relaxar a pele.'
    },
    {
      title: 'Chopp Artesanal Cortesia',
      description: 'Tire um momento para relaxar. Uma tulipa de chopp gelado ou café espresso gourmet acompanha o seu atendimento.'
    },
    {
      title: 'Pontualidade Britânica',
      description: 'Respeitamos seu tempo. Agendamento digital sem filas e cadeira pronta no minuto marcado.'
    },
    {
      title: 'Ambiente Clássico e Climatizado',
      description: 'Poltronas de couro vintage, música selecionada, lounge exclusivo e climatização impecável.'
    }
  ],

  // Menu de Serviços Completo
  services: [
    {
      id: 'corte-tradicional',
      category: 'cortes',
      name: 'Corte Tradicional & Moderno',
      duration: '40 min',
      price: 'R$ 70',
      description: 'Consultoria de visagismo facial, corte com tesoura e máquina, lavagem refrescante com massagem capilar e finalização com pomada matte.',
      popular: true,
      badge: 'Mais Pedido'
    },
    {
      id: 'barba-terapia',
      category: 'barba',
      name: 'Barboterapia com Toalha Quente',
      duration: '45 min',
      price: 'R$ 65',
      description: 'Esfoliação suave, hidratação da pele, duas toalhas quentes com óleos essenciais, desenho preciso na navalha e bálsamo pós-barba calmante.',
      popular: true,
      badge: 'Experiência VIP'
    },
    {
      id: 'combo-dom-rafael',
      category: 'combos',
      name: 'Combo Dom Rafael (Corte + Barba + Chopp)',
      duration: '1h 20min',
      price: 'R$ 120',
      description: 'A experiência completa: corte de cabelo personalizado, barboterapia relaxante, acabamento de sobrancelhas e chopp artesanal cortesia.',
      popular: true,
      badge: 'Melhor Custo-Benefício'
    },
    {
      id: 'alinhamento-camuflagem',
      category: 'tratamentos',
      name: 'Camuflagem de Fios Brancos & Alinhamento',
      duration: '35 min',
      price: 'R$ 60',
      description: 'Tonalização sutil e 100% natural para barba ou cabelo, reduzindo os fios brancos sem aspecto artificial de tinta.',
      popular: false
    },
    {
      id: 'corte-infantil',
      category: 'cortes',
      name: 'Corte Infantil (Pai & Filho)',
      duration: '35 min',
      price: 'R$ 60',
      description: 'Atendimento paciente, atencioso e descontraído para os pequenos saírem alinhados como os pais.',
      popular: false
    },
    {
      id: 'dia-do-noivo',
      category: 'combos',
      name: 'Dia do Noivo & Padrinhos',
      duration: '2h 30min',
      price: 'Sob Consulta',
      description: 'Espaço reservado para o noivo e seus amigos. Corte, barba, massagem, brindes com whisky e fotos inesquecíveis.',
      popular: false,
      badge: 'Exclusivo'
    }
  ],

  // Equipe de Mestres Barbeiros
  specialists: [
    {
      id: 'rafael-silva',
      name: 'Mestre Rafael Silva',
      role: 'Fundador & Master Barber',
      experience: '12 anos de experiência',
      specialty: 'Especialista em Navalhete Clássico e Cortes Tradicionais Europeus',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80',
      instagram: '@mestre.rafaelsilva'
    },
    {
      id: 'marcos-vinicius',
      name: 'Marcos Vinícius',
      role: 'Especialista em Degradê & Fade',
      experience: '7 anos de experiência',
      specialty: 'Skin Fade, Taper Fade e Técnicas Avançadas de Texturização',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
      instagram: '@marcosv.barber'
    },
    {
      id: 'diego-alcantara',
      name: 'Diego Alcântara',
      role: 'Terapeuta de Barba & Visagista',
      experience: '9 anos de experiência',
      specialty: 'Harmonização de Linhas de Barba, Toalha Quente e Tratamentos Faciais',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
      instagram: '@diegoalcantara.terapia'
    }
  ],

  // Galeria de Fotos em Alta Resolução (Dark Luxury Vintage)
  gallery: [
    {
      id: 'amb-1',
      title: 'Poltronas Clássicas de Couro',
      category: 'Ambiente',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'amb-2',
      title: 'Precisão na Navalha e Tesoura',
      category: 'Procedimentos',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'amb-3',
      title: 'Toalha Quente e Relaxamento',
      category: 'Barboterapia',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'amb-4',
      title: 'Lounge com Chopp Artesanal',
      category: 'Lounge VIP',
      image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'amb-5',
      title: 'Acabamento de Linha Impecável',
      category: 'Cortes',
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=80'
    },
    {
      id: 'amb-6',
      title: 'Produtos Premium para Barba',
      category: 'Produtos',
      image: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=900&q=80'
    }
  ],

  // Avaliações Reais do Google Maps
  testimonials: [
    {
      id: 'rev-1',
      author: 'Carlos Eduardo Mendes',
      role: 'Cliente há 3 anos',
      rating: 5,
      date: 'Há 1 semana',
      comment: 'Lugar sem comparação! O atendimento é impecável desde a recepção com o chopp artesanal gelado até a toalha quente na barba. O corte com o Rafael é uma obra de arte.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'rev-2',
      author: 'Rodrigo Fontoura',
      role: 'Executivo de Negócios',
      rating: 5,
      date: 'Há 3 semanas',
      comment: 'Para quem preza por pontualidade e sofisticação, não existe opção melhor na região. Chego, estaciono com tranquilidade, sento no horário combinado e saio com a barba alinhada perfeitamente.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'rev-3',
      author: 'Felipe Albuquerque',
      role: 'Cliente Mensal',
      rating: 5,
      date: 'Há 1 mês',
      comment: 'A barboterapia é o melhor investimento que faço no mês. Sensação de alívio e pele hidratada sem foliculite. Além disso, a playlist e o ambiente com couro vintage são muito agradáveis.',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80'
    }
  ],

  // Perguntas Frequentes (FAQ)
  faq: [
    {
      question: 'Preciso agendar com antecedência ou posso ir direto?',
      answer: 'Recomendamos fortemente o agendamento prévio via WhatsApp para garantir que a sua poltrona esteja disponível sem tempo de espera. Também atendemos clientes por ordem de chegada mediante disponibilidade na escala.'
    },
    {
      question: 'O chopp artesanal e o café são realmente cortesia?',
      answer: 'Sim! Todos os nossos clientes são recebidos com uma tulipa de chopp artesanal gelado cortesia, água mineral ou café espresso gourmet moído na hora para tornar o momento ainda mais agradável.'
    },
    {
      question: 'Como funciona a Barboterapia com Toalha Quente?',
      answer: 'É um procedimento terapêutico completo: iniciamos com esfoliação e óleos botânicos pré-shave, aplicamos a toalha quente a vapor para abrir os poros e amaciar os fios, realizamos o barbear preciso com navalha descartável nova e finalizamos com toalha fria e bálsamo pós-barba refrescante.'
    },
    {
      question: 'Vocês realizam atendimento infantil?',
      answer: 'Sim, nossos barbeiros são experientes e muito pacientes no atendimento a crianças de todas as idades. É um momento de conexão muito legal entre pais e filhos.'
    },
    {
      question: 'Quais são as formas de pagamento aceitas?',
      answer: 'Aceitamos Pix, cartões de crédito e débito de todas as bandeiras (Visa, Mastercard, Elo, Amex) e dinheiro em espécie.'
    },
    {
      question: 'O local possui estacionamento para clientes?',
      answer: 'Sim! Possuímos estacionamento privativo e gratuito com manobrista no próprio centro comercial para a sua total comodidade e segurança.'
    }
  ],

  // Metadados de SEO padrão
  seo: {
    title: 'Barbearia Dom Rafael | Tradição, Estilo e Barboterapia',
    description: 'A melhor barbearia com chopp artesanal cortesia, toalha quente e mestres da navalha. Agende seu horário no WhatsApp e renove seu estilo.',
    keywords: 'barbearia, corte masculino, barboterapia, navalha, chopp artesanal, toalha quente, fade, barba alinhada',
  }
};
