/**
 * Repositório Central de Dados Parametrizados para Dentistas e Clínicas Odontológicas
 * Projeto: Plataforma de Landing Pages Ultra-Premium de Odontologia
 * 
 * Permite que cirurgiões-dentistas e clínicas possuam páginas personalizadas,
 * responsivas, acessíveis e altamente conversivas, integradas a campanhas de tráfego,
 * Google Maps Scraper e CRM.
 * 
 * Regra Ética: Todo o conteúdo segue as diretrizes éticas do Conselho Federal de Odontologia (CFO)
 * e Conselhos Regionais (CRO), priorizando esclarecimento técnico, biossegurança e respeito ao paciente.
 */

export const dentalClinicsDatabase = {
  // 1. Perfil Demonstrativo Principal: Dr. Lucas Rocha & Instituto Odontológico (Barra da Tijuca, RJ)
  'instituto-dr-lucas-rocha-rio-de-janeiro': {
    id: 'instituto-dr-lucas-rocha-rio-de-janeiro',
    slug: 'instituto-dr-lucas-rocha-rio-de-janeiro',
    isDemonstrative: true,
    clinicName: 'Instituto Odontológico Dr. Lucas Rocha',
    slogan: 'Odontologia Digital de Alta Precisão & Estética do Sorriso',
    professional: {
      name: 'Dr. Lucas Rocha',
      displayName: 'Lucas Rocha',
      title: 'Cirurgião-Dentista | Especialista em Implantodontia e Prótese Dentária',
      cro: 'CRO-RJ 34.821 | EPAO 6.290',
      croState: 'RJ',
      avatarInitials: 'LR',
      shortBio: 'Especialista e Mestre em Implantodontia e Reabilitação Oral com mais de 12 anos de experiência clínica, pioneiro em fluxo 100% digital e anestesia sem agulhas.',
      fullBio: 'Acreditamos que ir ao dentista deve ser uma experiência de acolhimento, tranquilidade e tecnologia de ponta. No Instituto Odontológico Dr. Lucas Rocha, unimos escaneamento 3D em tempo real, anestesia computadorizada indolor e planejamento virtual do sorriso para devolver a mastigação, a saúde bucal e a confiança que você merece — tudo em um ambiente confortável e humanizado.',
      photo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      secondaryPhoto: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
      academicBackground: [
        'Graduação em Odontologia pela Universidade Federal do Rio de Janeiro (UFRJ)',
        'Especialização em Implantodontia e Cirurgia Guiada (ABO-RJ)',
        'Mestre em Prótese Dentária e Reabilitação Oral Estética (SLMandic)',
        'Certificação Internacional em Alinhadores Invisíveis e Escaneamento Intraoral 3D',
        'Membro Ativo da Sociedade Brasileira de Odontologia Estética (SBOE)'
      ]
    },
    location: {
      city: 'Rio de Janeiro',
      state: 'RJ',
      neighborhood: 'Barra da Tijuca',
      address: 'Avenida das Américas, 3.500, Bloco Hong Kong, Sala 420 (Le Monde)',
      zipCode: '22640-102',
      reference: 'No Le Monde Office, em frente ao BarraShopping, com facilidade de Metrô Jardim Oceânico + BRT.',
      hours: 'Segunda a Sexta: 08h00 às 20h00 | Sábados: 08h30 às 13h30',
      parking: 'Estacionamento privativo com serviço de manobrista no local.',
      accessibility: 'Acesso 100% adaptado com elevadores amplos, rampas e sanitários acessíveis.',
      mapEmbedUrl: 'https://maps.google.com/maps?q=Avenida+das+Americas+3500+Barra+da+Tijuca+Rio+de+Janeiro&t=&z=15&ie=UTF8&iwloc=&output=embed'
    },
    contact: {
      phone: '(21) 96614-9077',
      whatsapp: '5521966149077',
      email: 'atendimento@institutolucasrocha.com.br',
      bookingUrl: 'https://wa.me/5521966149077?text=Ol%C3%A1%2C%20Dr.%20Lucas!%20Gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20odontol%C3%B3gica.',
      initialWhatsappMessage: 'Olá! Encontrei o Instituto Dr. Lucas Rocha pelo site e gostaria de agendar uma consulta de avaliação odontológica.'
    },
    seo: {
      title: 'Dr. Lucas Rocha | Clínica Odontológica na Barra da Tijuca - RJ | Implantes e Alinhadores',
      description: 'Clínica odontológica de alta precisão na Barra da Tijuca, RJ. Implantes dentários, alinhadores invisíveis, lentes em porcelana e escaneamento 3D sem dor. Agende sua avaliação!',
      keywords: 'dentista barra da tijuca, clinica odontologica rj, implantes dentarios barra, alinhador invisivel rio de janeiro, lentes de contato dental rj, clareamento dental barra da tijuca',
      canonicalUrl: 'https://rafaelpitaoficial.com.br/dentista/instituto-dr-lucas-rocha-rio-de-janeiro',
      indexable: true,
      ogImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80'
    },
    hero: {
      badge: 'Odontologia Digital de Alta Precisão & Biossegurança Hospitalar',
      title: 'Seu Sorriso Perfeito com Conforto, Tecnologia 3D e Sem Dor.',
      subtitle: 'Transformamos vidas através de sorrisos saudáveis. Unimos tecnologia de escaneamento 3D, anestesia computadorizada sem picada e tratamentos planejados para devolver sua autoestima com conforto inigualável.',
      primaryCtaText: 'Agendar Avaliação pelo WhatsApp',
      secondaryCtaText: 'Conhecer Nossos Tratamentos',
      rating: 5.0,
      reviewsCount: 384
    },
    trustElements: [
      {
        id: 'cro',
        title: 'Registro CRO Ativo',
        subtitle: 'CRO-RJ 34.821 | EPAO 6.290',
        badge: 'CFO / CRO',
        desc: 'Atuação clínica rigorosamente certificada e ética.'
      },
      {
        id: 'scanner',
        title: 'Scanner Intraoral 3D',
        subtitle: 'Sem moldes desconfortáveis de massa',
        badge: 'Tecnologia 3D',
        desc: 'Precisão milimétrica e prévia digital do seu sorriso.'
      },
      {
        id: 'anestesia',
        title: 'Anestesia Computadorizada',
        subtitle: 'Aplicação indolor e sem sensação de agulha',
        badge: 'Zero Trauma',
        desc: 'Conforto total mesmo para quem tem fobia de dentista.'
      },
      {
        id: 'pacientes',
        title: '+5.000 Sorrisos Cuidados',
        subtitle: 'Índice de 99.4% de satisfação verificada',
        badge: 'Avaliações 5.0 ★',
        desc: 'Mais de 12 anos de referência em odontologia no RJ.'
      }
    ],
    treatments: [
      {
        id: 'alinhadores',
        title: 'Alinhadores Invisíveis',
        tag: 'Ortodontia Digital',
        shortDesc: 'Dentes alinhados com placas transparentes e confortáveis, sem braquetes metálicos e com planejamento 3D.',
        fullDesc: 'O tratamento com alinhadores transparentes permite corrigir o posicionamento dos dentes de forma quase invisível, confortável e removível para comer e escovar os dentes. Você já vê na primeira consulta a simulação exata de como ficará o seu sorriso final.',
        badge: 'Mais Procurado',
        iconName: 'Smile',
        highlights: [
          'Praticamente imperceptíveis no dia a dia',
          'Removíveis para alimentação e higienização',
          'Resultados visíveis a partir dos primeiros meses',
          'Sem feridas na bochecha causadas por fios'
        ]
      },
      {
        id: 'implantes',
        title: 'Implantes & Carga Imediata',
        tag: 'Reabilitação Oral',
        shortDesc: 'Recupere dentes perdidos com fixação segura em titânio ou cerâmica pura, conforto mastigatório e estética natural.',
        fullDesc: 'Através de cirurgia guiada por computador e tomografia 3D, instalamos os implantes com incisões mínimas, sem necessidade de cortes extensos ou pontos desconfortáveis. Em casos elegíveis, o novo dente fixo é instalado no mesmo dia.',
        badge: 'Carga Rápida',
        iconName: 'ShieldCheck',
        highlights: [
          'Cirurgia guiada 3D minimamente invasiva',
          'Mastigação firme e segurança total ao falar e sorrir',
          'Materiais biocompatíveis suíços de altíssima durabilidade',
          'Opção de sedação consciente para total tranquilidade'
        ]
      },
      {
        id: 'lentes',
        title: 'Lentes de Contato em Porcelana',
        tag: 'Estética Dental',
        shortDesc: 'Lâminas ultrafinas de cerâmica que corrigem cor, formato, espaçamentos (diastemas) e desgaste dental.',
        fullDesc: 'As facetas e lentes de porcelana são personalizadas individualmente de acordo com a proporção áurea do seu rosto. Preservam a estrutura dental natural com desgaste mínimo ou nulo, resistindo a manchas de café e vinho por muitos anos.',
        badge: 'Sorriso Natural',
        iconName: 'Sparkles',
        highlights: [
          'Planejamento digital do sorriso (Digital Smile Design)',
          'Porcelana de alta resistência mecânica e brilho perene',
          'Harmonização de cor, proporção e simetria',
          'Test-drive do sorriso (Mock-up) antes de iniciar'
        ]
      },
      {
        id: 'clareamento',
        title: 'Clareamento a Laser & Guiado',
        tag: 'Estética Express',
        shortDesc: 'Dentes até 5 tons mais claros com tecnologia que minimiza drasticamente a sensibilidade pós-procedimento.',
        fullDesc: 'Combinamos o protocolo em consultório com luz fotoativada de última geração ao clareamento caseiro supervisionado com moldeiras personalizadas a vácuo, garantindo brilho uniforme e segurança para o esmalte dental.',
        badge: 'Sem Sensibilidade',
        iconName: 'Sun',
        highlights: [
          'Agentes clareadores com nanopartículas dessensibilizantes',
          'Dentes visivelmente mais brancos em poucas sessões',
          'Proteção gengival avançada durante a aplicação',
          'Segurança absoluta para a estrutura do dente'
        ]
      },
      {
        id: 'harmonizacao',
        title: 'Harmonização Orofacial',
        tag: 'Estética Facial',
        shortDesc: 'Integração estética e funcional entre lábios, dentes e contornos faciais com bioestimuladores e preenchimento labial sutil.',
        fullDesc: 'Procedimentos seguros que valorizam a beleza natural do seu rosto, corrigem sorriso gengival, afinam linhas de expressão e devolvem o suporte labial perdido com o passar do tempo, sempre com naturalidade e moderação médica.',
        badge: 'Naturalidade',
        iconName: 'HeartHandshake',
        highlights: [
          'Controle ético do sorriso gengival',
          'Hidratação e volumização labial anatômica',
          'Aplicação de toxina botulínica para alívio de bruxismo',
          'Bioestimuladores de colágeno de alta absorção'
        ]
      },
      {
        id: 'checkup',
        title: 'Check-up Preventivo 3D & Profilaxia',
        tag: 'Prevenção & Saúde',
        shortDesc: 'Limpeza ultrassônica indolor, remoção de biofilme dental, aplicação de flúor e diagnóstico precoce com câmera intraoral.',
        fullDesc: 'A prevenção é a chave para nunca ter dor de dente. Com nossa câmera intraoral de alta ampliação, você acompanha na tela cada detalhe da sua saúde bucal, identificando pequenas cáries e problemas gengivais muito antes de causarem dor.',
        badge: 'Cuidado Contínuo',
        iconName: 'Eye',
        highlights: [
          'Câmera intraoral que mostra os dentes na tela em tempo real',
          'Jato de bicarbonato ultramicronizado para manchas de café/chá',
          'Remoção de tártaro sem agressão ao esmalte',
          'Plano preventivo sem surpresas'
        ]
      }
    ],
    technologies: [
      {
        id: 'scanner-3d',
        title: 'Scanner Intraoral Digital 3D',
        badge: 'Adeus às Moldagens',
        description: 'Substitui a incômoda pasta de moldagem por uma câmera óptica de alta precisão que gera o mapa tridimensional exato da sua boca em menos de 2 minutos.',
        icon: 'Cpu',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=700&q=80'
      },
      {
        id: 'anestesia-computadorizada',
        title: 'Sistema de Anestesia Morpheus',
        badge: 'Zero Sensação de Agulha',
        description: 'Fluxo controlado gota a gota por computador em velocidade abaixo do limiar de dor do tecido humano. Adormece apenas o dente a ser tratado, sem aquela dormência incômoda no rosto todo.',
        icon: 'Feather',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80'
      },
      {
        id: 'radiografia-digital',
        title: 'Raio-X Digital de Baixa Radiação',
        badge: 'Diagnóstico Instantâneo',
        description: 'Sensores digitais que emitem até 80% menos radiação que aparelhos convencionais, com imagem de altíssima definição disponível na tela em poucos segundos.',
        icon: 'Activity',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=700&q=80'
      },
      {
        id: 'biosseguranca-hospitalar',
        title: 'Central de Esterilização Hospitalar',
        badge: 'Biossegurança Rígida',
        description: 'Ciclos de autoclave monitorados por indicadores biológicos, desinfecção de ar e superfícies, além de instrumentais 100% envelopados e abertos exclusivamente na sua presença.',
        icon: 'Shield',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80'
      }
    ],
    smileCases: [
      {
        id: 1,
        title: 'Alinhamento Invisível sem Braquetes',
        tag: 'Ortodontia Digital',
        description: 'Correção de apinhamento severo e mordida cruzada em 11 meses de tratamento totalmente discreto.',
        duration: '11 meses',
        image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 2,
        title: 'Reabilitação com Implante & Cerâmica Pura',
        tag: 'Carga Imediata',
        description: 'Recuperação estética e funcional de dente anterior fraturado com provisional imediato no mesmo dia.',
        duration: 'Sessão Única + Finalização',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 3,
        title: 'Lentes de Contato Dental em Porcelana',
        tag: 'Estética & Harmonia',
        description: 'Harmonização de cor, fechamento de diastemas e simetria facial com preservação máxima do esmalte.',
        duration: '3 sessões',
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 4,
        title: 'Clareamento a Laser + Protocolo Noturno',
        tag: 'Clareamento Dental',
        description: 'Remoção de manchas amareladas causadas por café com 4 tons de clareamento e zero desconforto térmico.',
        duration: '2 semanas',
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
      }
    ],
    testimonials: [
      {
        id: 1,
        author: 'Mariana Guimarães',
        role: 'Advogada, 34 anos',
        rating: 5,
        date: 'Há 2 semanas',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        comment: 'Eu tinha pavor de dentista por traumas de infância. Quando o Dr. Lucas me explicou sobre a anestesia computadorizada e fez o escaneamento 3D sem aquela massa horrível na boca, me senti totalmente respeitada e segura. Não senti absolutamente nada de dor. Hoje sorrio com orgulho!'
      },
      {
        id: 2,
        author: 'Rodrigo Paiva',
        role: 'Empresário, 42 anos',
        rating: 5,
        date: 'Há 1 mês',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        comment: 'Fiz meus implantes guiados no Instituto. A precisão é impressionante! Entrei com medo do pós-operatório e no dia seguinte já estava trabalhando sem inchaço. A clínica na Barra tem um padrão impecável, pontualidade britânica e estacionamento fácil.'
      },
      {
        id: 3,
        author: 'Dra. Vanessa Meireles',
        role: 'Médica Dermatologista, 38 anos',
        rating: 5,
        date: 'Há 1 mês',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
        comment: 'Como médica, sou extremamente criteriosa com biossegurança e esterilização. Fiquei encantada com os protocolos do Dr. Lucas. Minhas lentes de contato ficaram tão naturais que ninguém diz que fiz procedimento, apenas que meu sorriso está iluminado!'
      },
      {
        id: 4,
        author: 'Carlos Eduardo Nogueira',
        role: 'Arquiteto, 29 anos',
        rating: 5,
        date: 'Há 2 meses',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        comment: 'Optei pelos alinhadores transparentes porque não queria braquetes metálicos no meu trabalho. Foi a melhor decisão! A equipe acompanha cada etapa pelo app e o Dr. Lucas é super atencioso. Recomendo de olhos fechados.'
      }
    ],
    faq: [
      {
        question: 'O procedimento de implante dentário dói?',
        answer: 'Não. Utilizamos anestesia computadorizada de alta precisão e técnicas cirúrgicas guiadas por computador com incisões milimétricas. Além disso, disponibilizamos sedação consciente para que você fique profundamente relaxado durante todo o procedimento. O pós-operatório é tranquilo e medicado.'
      },
      {
        question: 'Quanto tempo dura o tratamento com Alinhadores Invisíveis?',
        answer: 'Em média, entre 6 e 14 meses, dependendo do grau de complexidade do seu caso. Já na primeira consulta, após o escaneamento intraoral 3D, mostramos na tela a previsão exata da quantidade de placas e o tempo estimado para o seu sorriso final.'
      },
      {
        question: 'As lentes de contato de porcelana desgastam muito o dente natural?',
        answer: 'Não. Trabalhamos com a filosofia de desgaste minimamente invasivo ou até mesmo sem desgaste dental (lentes ultrafinas de 0.2 a 0.3 mm). O objetivo é preservar ao máximo a integridade biológica do esmalte natural dos seus dentes.'
      },
      {
        question: 'A clínica aceita convênios odontológicos ou planos de saúde?',
        answer: 'Nosso atendimento é estritamente particular e personalizado, o que nos permite dedicar o tempo necessário a cada paciente e utilizar os melhores materiais do mercado mundial. No entanto, emitimos toda a documentação comprobatória, relatórios e recibos para que você solicite o reembolso diretamente junto ao seu plano de saúde.'
      },
      {
        question: 'Quais são as formas e facilidades de pagamento?',
        answer: 'Facilitamos o investimento na sua saúde bucal através de parcelamento no cartão de crédito em até 12x ou 18x, condições especiais para pagamentos à vista via PIX/transferência, e opções de financiamento odontológico.'
      },
      {
        question: 'Como funciona a primeira consulta de avaliação?',
        answer: 'É uma consulta detalhada de acolhimento. Realizamos o escaneamento 3D ou fotos diagnósticas, avaliamos toda a saúde da gengiva, dentes e mordida, ouvimos seus desejos estéticos e construímos juntos um plano de tratamento claro, transparente e sem compromisso.'
      }
    ]
  }
};

/**
 * Recupera clínica odontológica por slug
 * @param {string} slug 
 * @returns {object|null}
 */
export function getDentalClinicBySlug(slug) {
  if (!slug) return null;
  return dentalClinicsDatabase[slug] || null;
}

/**
 * Retorna o perfil demonstrativo padrão
 * @returns {object}
 */
export function getDefaultDentalClinic() {
  return dentalClinicsDatabase['instituto-dr-lucas-rocha-rio-de-janeiro'];
}
