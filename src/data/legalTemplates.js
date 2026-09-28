/**
 * Modelos de Conteúdo e Copywriting de Alta Conversão para Escritórios de Advocacia
 * Rigorosamente alinhados ao Provimento 205/2021 da OAB (sem mercantilização, foco em esclarecimento, autoridade e contato seguro).
 */

export const LEGAL_NICHES = {
  geral: {
    id: 'geral',
    name: 'Geral & Full-Service',
    badge: 'Advocacia Especializada & Consultiva',
    heroImage: '/images/legal/geral.jpg',
    defaultLawyer: {
      name: 'Dr. Jorge Santos',
      oab: 'OAB/UF 00.000',
      role: 'Advogado & Consultor Jurídico Sênior',
      city: 'Sua Cidade',
      state: 'UF',
      address: 'Av. Principal, 1000 - Centro Empresarial, Cidade - UF',
      phone: '(00) 90000-0000',
      whatsapp: '5500900000000',
      email: 'contato@seuescritorio.adv.br',
      instagram: '@seu.escritorio.adv',
      experienceYears: '14'
    },
    hero: {
      headline: 'Soluções Jurídicas Estratégicas para Proteger Seus Direitos e Seu Patrimônio',
      subheadline: 'Atendimento humanizado, sigiloso e direto ao ponto. Análise minuciosa de cada caso com foco em prevenção, defesa assertiva e segurança jurídica.',
      ctaPrimary: 'Falar Diretamente com o Advogado',
      ctaSecondary: 'Conhecer Áreas de Atuação',
      stats: [
        { label: 'Anos de Atuação Jurídica', value: '+14' },
        { label: 'Processos Conduzidos', value: '+1.800' },
        { label: 'Atendimento Sigiloso', value: '100%' },
        { label: 'Avaliação dos Clientes', value: '5.0 ★' }
      ]
    },
    painPoints: {
      title: 'Você Está Enfrentando Alguma Destas Situações?',
      subtitle: 'Problemas jurídicos não resolvidos tendem a se agravar. Veja como nossa assessoria técnica pode restabelecer sua tranquilidade.',
      items: [
        {
          title: 'Conflitos Contratuais ou Imobiliários',
          description: 'Descumprimento de prazos, distratos imobiliários, cláusulas abusivas ou necessidade de cobrança de valores devidos.',
          icon: 'FileText'
        },
        {
          title: 'Insegurança em Relações Trabalhistas',
          description: 'Dúvidas sobre verbas rescisórias, rescisão indireta, horas extras não quitadas ou passivos trabalhistas empresariais.',
          icon: 'Briefcase'
        },
        {
          title: 'Decisões Delicadas de Família e Herança',
          description: 'Processos de divórcio, partilha de bens, fixação de pensão alimentícia ou inventários que exigem mediação célere.',
          icon: 'HeartHandshake'
        },
        {
          title: 'Danos e Práticas Abusivas no Consumo',
          description: 'Cobranças indevidas, negativação injusta do nome, fraudes bancárias ou recusa de cobertura de planos de saúde.',
          icon: 'ShieldAlert'
        }
      ]
    },
    practiceAreas: [
      {
        title: 'Direito Civil & Contratos',
        summary: 'Elaboração e revisão minuciosa de instrumentos contratuais, recuperação de créditos, indenizações por perdas e danos e consultoria preventiva.',
        items: ['Elaboração e revisão contratual', 'Ações de cobrança e execução', 'Indenizações por danos morais e materiais', 'Defesa em litígios cíveis']
      },
      {
        title: 'Direito Imobiliário & Sucessões',
        summary: 'Segurança absoluta para aquisição, locação e regularização de imóveis, além de inventários ágeis e planejamento sucessório.',
        items: ['Distrato de lotes e imóveis na planta', 'Inventário judicial e extrajudicial em cartório', 'Usucapião e regularização fundiária', 'Ações locatícias e possessórias']
      },
      {
        title: 'Direito Trabalhista Estratégico',
        summary: 'Atuação incisiva na defesa de direitos do trabalhador e assessoria preventiva de compliance para empresas evitarem litígios.',
        items: ['Rescisão indireta do contrato', 'Cálculo e cobrança de horas extras', 'Acidentes de trabalho e doenças ocupacionais', 'Reconhecimento de vínculo empregatício']
      },
      {
        title: 'Direito do Consumidor Especializado',
        summary: 'Combate rigoroso a práticas abusivas cometidas por grandes corporações, concessionárias, bancos e companhias aéreas.',
        items: ['Remoção de negativação indevida (SPC/Serasa)', 'Golpes bancários e fraudes Pix', 'Problemas com voos e extravio de bagagem', 'Reajustes abusivos de planos de saúde']
      },
      {
        title: 'Direito Empresarial & Contratos Societários',
        summary: 'Assessoria jurídica estratégica para empresas, blindagem do patrimônio dos sócios, elaboração de acordos societários e mitigação de riscos contratuais.',
        items: ['Acordos de sócios e reestruturação societária', 'Blindagem e planejamento patrimonial', 'Cobrança empresarial e recuperação de créditos', 'Compliance e consultoria preventiva']
      }
    ],
    methodology: [
      {
        step: '01',
        title: 'Primeiro Contato e Triagem Sigilosa',
        description: 'Você entra em contato via WhatsApp com sigilo profissional resguardado. Compreendemos seu cenário em detalhes.'
      },
      {
        step: '02',
        title: 'Auditoria Documental & Viabilidade',
        description: 'Examinamos contratos, comprovantes e fatos à luz da lei e jurisprudência para traçar a melhor estratégia.'
      },
      {
        step: '03',
        title: 'Ação Estratégica & Acompanhamento',
        description: 'Ingressamos com a medida adequada (amigável ou judicial) mantendo você informado a cada nova movimentação.'
      }
    ],
    about: {
      title: 'Sobre Nossa Filosofia de Trabalho',
      subtitle: 'Ética rigorosa, clareza na comunicação e foco incansável na defesa legítima de quem confia em nós.',
      paragraphs: [
        'Acreditamos que o acesso à justiça e a uma orientação jurídica de excelência não deve ser complicado por jargões excessivos ou distâncias burocráticas.',
        'Com mais de uma década de dedicação exclusiva à prática forense, unimos profundo conhecimento técnico à agilidade que a era digital exige. Cada cliente recebe atendimento personalizado e transparente do início ao fim.',
        'Atuamos em estrita observância ao Código de Ética e Disciplina da OAB, assegurando total sigilo, lealdade e transparência em todas as etapas.'
      ],
      badges: ['Atendimento em Todo o Brasil', 'Conformidade OAB Provimento 205/2021', 'Assinatura Digital Segura']
    },
    faq: [
      {
        question: 'Como funciona a primeira conversa?',
        answer: 'O primeiro contato é realizado diretamente pelo WhatsApp ou chamada de vídeo. Nele, você expõe brevemente o ocorrido e indicamos os documentos necessários para a análise preliminar de viabilidade.'
      },
      {
        question: 'Preciso comparecer presencialmente ao escritório?',
        answer: 'Não obrigatoriamente. Hoje os processos judiciais no Brasil são 100% eletrônicos (PJe, Projudi, e-SAJ). Todo o envio de documentos e assinaturas pode ser feito pelo celular com validade jurídica oficial, embora nosso escritório físico esteja de portas abertas caso prefira uma reunião presencial.'
      },
      {
        question: 'Quais documentos geralmente são necessários para iniciar?',
        answer: 'Normalmente solicitamos documento de identificação com foto (RG/CNH), comprovante de residência atualizado e os documentos específicos do caso (como contratos, extratos bancários, conversas de WhatsApp, e-mails ou notificações).'
      },
      {
        question: 'O escritório atende apenas na cidade sede ou em outros estados?',
        answer: 'Realizamos atendimento em todo o território nacional. Como a advocacia moderna opera digitalmente em todos os tribunais do país, defendemos clientes com a mesma proximidade e eficiência em qualquer região.'
      },
      {
        question: 'Como fico sabendo do andamento do meu processo?',
        answer: 'Mantemos comunicação periódica e direta pelo WhatsApp. Sempre que ocorre uma decisão, despacho ou audiência relevante, nossa equipe informa você de forma clara, sem juridiquês.'
      },
      {
        question: 'Qual é o prazo médio de resolução de um caso?',
        answer: 'O tempo varia conforme a complexidade da matéria e o rito processual (acordo extrajudicial, Juizado Especial Cível ou Vara Comum). Durante a análise inicial, fornecemos uma estimativa realista fundamentada no histórico dos tribunais competentes.'
      }
    ]
  },

  consumidor: {
    id: 'consumidor',
    name: 'Direito do Consumidor',
    badge: 'Especialista em Defesa do Consumidor',
    heroImage: '/images/legal/consumidor.jpg',
    defaultLawyer: {
      name: 'Dra. Camila Nogueira',
      oab: 'OAB/UF 00.000',
      role: 'Advogada Especialista em Relações de Consumo',
      city: 'Sua Cidade',
      state: 'UF',
      address: 'Av. Principal, 1000 - Centro Empresarial, Cidade - UF',
      phone: '(00) 90000-0000',
      whatsapp: '5500900000000',
      email: 'contato@seuescritorio.adv.br',
      instagram: '@seu.escritorio.adv',
      experienceYears: '11'
    },
    hero: {
      headline: 'Foi Lesado por Bancos, Concessionárias ou Grandes Empresas? Nós Fazemos Valer Seus Direitos',
      subheadline: 'Nome negativado injustamente, golpes bancários, cobranças abusivas ou voos cancelados. Defesa firme com base no Código de Defesa do Consumidor.',
      ctaPrimary: 'Analisar Violação dos Meus Direitos',
      ctaSecondary: 'Ver Casos Atendidos',
      stats: [
        { label: 'Casos Solucionados', value: '+1.400' },
        { label: 'Tempo Médio 1ª Resposta', value: '< 2h' },
        { label: 'Defesa Especializada', value: '100%' },
        { label: 'Avaliação Positiva', value: '4.9 ★' }
      ]
    },
    painPoints: {
      title: 'Você Sofreu com Alguma Dessas Práticas Abusivas?',
      subtitle: 'O Código de Defesa do Consumidor existe para equilibrar a balança entre você e as grandes empresas. Identifique sua situação:',
      items: [
        {
          title: 'Nome Sujo / Negativação Indevida',
          description: 'Seu CPF foi inscrito no SPC/Serasa por conta já paga, serviço nunca contratado ou sem aviso prévio obrigatório.',
          icon: 'ShieldAlert'
        },
        {
          title: 'Golpes do Pix, Boletos Falsos e Cartão',
          description: 'Fraudes financeiras em sua conta, empréstimos consignados não solicitados e transferências não autorizadas sem suporte do banco.',
          icon: 'AlertTriangle'
        },
        {
          title: 'Voo Cancelado, Atrasado ou Bagagem Perdida',
          description: 'Prejuízos em viagens aéreas, perda de compromissos importantes ou desamparo da companhia em solo nacional e internacional.',
          icon: 'Plane'
        },
        {
          title: 'Negativa de Cobertura de Plano de Saúde',
          description: 'Recusa injustificada de cirurgias, medicamentos de alto custo, próteses ou procedimentos de urgência recomendados pelo médico.',
          icon: 'Activity'
        }
      ]
    },
    practiceAreas: [
      {
        title: 'Limpeza de Nome & Reparação de Danos',
        summary: 'Medidas judiciais com pedido de tutela de urgência (liminar) para exclusão imediata do apontamento nos cadastros restritivos e reparação moral.',
        items: ['Liminares de baixa de negativação em até 48h', 'Indenização por danos morais comprovados', 'Inexistência de débito indevido', 'Cobrança vexatória ou ameaçadora']
      },
      {
        title: 'Fraudes Financeiras e Falha Bancária',
        summary: 'Responsabilização das instituições financeiras pela falta de segurança nos sistemas de autenticação e proteção de dados do correntista.',
        items: ['Golpe do Pix e engenharia social', 'Fraude do boleto falso', 'Empréstimos não autorizados (RMC/RCC)', 'Compras fraudulentas no cartão de crédito']
      },
      {
        title: 'Direito Aeronáutico do Passageiro',
        summary: 'Garantia das compensações materiais e morais previstas nas resoluções da ANAC e tratados internacionais para passageiros aéreos.',
        items: ['Atrasos de voo superiores a 4 horas', 'Cancelamentos e overbooking (preterição)', 'Extravio temporário ou definitivo de bagagem', 'Perda de conexões e diárias de hotel']
      },
      {
        title: 'Planos de Saúde & Medicamentos',
        summary: 'Ações ágeis com pedido de liminar para garantir tratamentos essenciais prescritos por médicos e suspender reajustes por faixa etária.',
        items: ['Cobertura de cirurgias e internações', 'Fornecimento de remédios de alto custo', 'Home care e tratamentos contínuos', 'Revisão de aumento abusivo de mensalidade']
      },
      {
        title: 'Juros Abusivos & Revisão Contratual Bancária',
        summary: 'Ações revisionais para expurgar tarifas ilegais, juros extorsivos em financiamentos de veículos, empréstimos consignados (RMC) e cláusulas abusivas.',
        items: ['Recálculo pericial de contratos de financiamento', 'Eliminação da taxa de abertura de crédito (TAC) indevida', 'Repetição de indébito (devolução em dobro)', 'Suspensão de busca e apreensão de veículos']
      }
    ],
    methodology: [
      {
        step: '01',
        title: 'Envio dos Comprovantes',
        description: 'Você envia prints, extratos ou protocolos de atendimento via WhatsApp para que nossa equipe examine a ilicitude cometida.'
      },
      {
        step: '02',
        title: 'Cálculo e Notificação Estratégica',
        description: 'Apuramos a extensão dos danos materiais e morais e emitimos notificação formal ou ingressamos direto com a ação cabível.'
      },
      {
        step: '03',
        title: 'Liminar e Restituição',
        description: 'Buscamos primeiro a cessação imediata do abuso (ex: liminar para limpar nome) e depois a devida indenização financeira.'
      }
    ],
    about: {
      title: 'Compromisso com o Equilíbrio e a Justiça',
      subtitle: 'Lutando de forma técnica contra o descaso e a negligência das grandes corporações.',
      paragraphs: [
        'Sabemos o quanto é desgastante passar horas ao telefone com centrais de atendimento ineficientes sem obter solução para uma cobrança injusta ou falha grave de serviço.',
        'Nosso escritório nasceu com o propósito de empoderar o cidadão comum, traduzindo o Código de Defesa do Consumidor em medidas concretas, liminares rápidas e compensações justas.',
        'Trabalhamos com absoluta transparência contratual e foco total na reparação integral dos prejuízos suportados.'
      ],
      badges: ['Atendimento Ágil via WhatsApp', 'Petição Inicial Personalizada', 'Atuação em Todo o Brasil']
    },
    faq: [
      {
        question: 'Tive meu nome negativado por uma conta que não reconheço. O que fazer?',
        answer: 'O primeiro passo é obter o comprovante de inscrição do SPC/Serasa com o valor e a empresa credora. Com esses dados, podemos ingressar com uma ação declaratória de inexistência de débito com pedido de liminar para exclusão do seu nome em poucos dias, além de pleitear indenização por danos morais.'
      },
      {
        question: 'Fui vítima do golpe do Pix. O banco é responsável?',
        answer: 'Segundo entendimento do Superior Tribunal de Justiça (Súmula 479 do STJ), as instituições financeiras respondem objetivamente pelos danos gerados por fortuito interno relativo a fraudes e delitos praticados por terceiros no âmbito de operações bancárias. Se houve falha de monitoramento dos padrões de movimentação, cabe responsabilização.'
      },
      {
        question: 'Quanto tempo tenho para reclamar de um voo cancelado?',
        answer: 'Para voos nacionais, o prazo prescricional para buscar indenização é de até 5 anos (CDC). Em voos internacionais regidos pela Convenção de Montreal, o prazo é de 2 anos. É fundamental guardar cartões de embarque e comprovantes de despesas adicionais.'
      },
      {
        question: 'O plano de saúde negou meu medicamento de alto custo. A liminar sai rápido?',
        answer: 'Sim. Em matérias de saúde com laudo médico indicando urgência e risco de agravamento clínico, os juízes costumam analisar os pedidos de liminar (tutela de urgência) em prazos que variam de 24 a 72 horas úteis.'
      }
    ]
  },

  familia: {
    id: 'familia',
    name: 'Direito de Família & Sucessões',
    badge: 'Direito de Família Humanizado & Discreto',
    heroImage: '/images/legal/familia.jpg',
    defaultLawyer: {
      name: 'Dra. Beatriz Albuquerque',
      oab: 'OAB/UF 00.000',
      role: 'Advogada de Família, Sucessões e Mediação de Conflitos',
      city: 'Sua Cidade',
      state: 'UF',
      address: 'Av. Principal, 1000 - Centro Empresarial, Cidade - UF',
      phone: '(00) 90000-0000',
      whatsapp: '5500900000000',
      email: 'contato@seuescritorio.adv.br',
      instagram: '@seu.escritorio.adv',
      experienceYears: '16'
    },
    hero: {
      headline: 'Proteja Quem Você Ama e Seu Patrimônio com Sensibilidade, Firmeza e Discrição',
      subheadline: 'Divórcios consensuais e litigiosos, guarda e bem-estar dos filhos, pensão alimentícia justa e inventários descomplicados.',
      ctaPrimary: 'Conversar com a Advogada em Sigilo',
      ctaSecondary: 'Entender Nossos Serviços',
      stats: [
        { label: 'Anos em Direito Familiar', value: '+16' },
        { label: 'Famílias Orientadas', value: '+950' },
        { label: 'Acordos Amigáveis', value: '78%' },
        { label: 'Sigilo e Discrição', value: '100%' }
      ]
    },
    painPoints: {
      title: 'Momentos Delicados Exigem Apoio Jurídico Acolhedor e Preciso',
      subtitle: 'Decisões tomadas no calor da emoção podem causar prejuízos emocionais e financeiros irreparáveis. Encontre a clareza necessária:',
      items: [
        {
          title: 'Decisão de Divórcio ou Dissolução de União',
          description: 'Como proteger seu patrimônio construído durante a união e formalizar a separação de forma rápida e segura para ambos.',
          icon: 'HeartHandshake'
        },
        {
          title: 'Guarda dos Filhos e Convivência Familiar',
          description: 'Garantir que a rotina, o bem-estar e o desenvolvimento saudável das crianças sejam a prioridade absoluta.',
          icon: 'Users'
        },
        {
          title: 'Fixação, Revisão ou Cobrança de Alimentos',
          description: 'Cálculo equilibrado do valor da pensão alimentícia que respeite o binômio necessidade do filho x possibilidade do alimentante.',
          icon: 'Scale'
        },
        {
          title: 'Inventário de Bens e Herança sem Conflitos',
          description: 'Organização célere da partilha de bens entre herdeiros, preferencialmente por via extrajudicial em cartório.',
          icon: 'FolderCheck'
        }
      ]
    },
    practiceAreas: [
      {
        title: 'Divórcio & Partilha Patrimonial',
        summary: 'Condução serena de divórcios consensuais em cartório (em até poucos dias) e atuação estratégica e protetiva em divórcios litigiosos complexos.',
        items: ['Divórcio extrajudicial em cartório', 'Divórcio litigioso com blindagem patrimonial', 'Reconhecimento e dissolução de união estável', 'Pacto antenupcial e alteração de regime de bens']
      },
      {
        title: 'Guarda, Convivência e Alienação Parental',
        summary: 'Defesa incansável do melhor interesse da criança e do adolescente, estruturando planos de convivência equilibrados e prevenção de abusos.',
        items: ['Definição de guarda compartilhada ou unilateral', 'Regulamentação de visitas e convivência', 'Medidas contra alienação parental', 'Autorização de viagens internacionais']
      },
      {
        title: 'Pensão Alimentícia (Fixação, Revisão e Execução)',
        summary: 'Atuação na determinação de valores condizentes com a realidade das partes, reajuste por alteração financeira e cobrança com rigor legal.',
        items: ['Ação de alimentos para menores e gestantes', 'Ação revisional (redução ou majoração)', 'Execução de pensão em atraso sob pena de prisão', 'Exoneração de alimentos na maioridade']
      },
      {
        title: 'Inventário, Testamentos & Sucessões',
        summary: 'Transmissão segura de patrimônio aos herdeiros, evitando bloqueios desnecessários e reduzindo o impacto tributário do ITCMD.',
        items: ['Inventário extrajudicial rápido em cartório', 'Inventário judicial e arrolamento de bens', 'Planejamento sucessório familiar', 'Elaboração e validação de testamentos']
      },
      {
        title: 'União Estável, Pacto Antenupcial & Blindagem',
        summary: 'Estruturação jurídica preventiva para formalização de união estável, escolha segura de regime de bens, contratos de namoro e proteção patrimonial da família.',
        items: ['Escritura pública de união estável', 'Pacto antenupcial customizado', 'Planejamento de proteção patrimonial familiar', 'Alteração judicial de regime de bens']
      }
    ],
    methodology: [
      {
        step: '01',
        title: 'Acolhimento & Escuta Humanizada',
        description: 'Uma conversa tranquila e sem julgamentos para entender sua dinâmica familiar, seus objetivos e prioridades.'
      },
      {
        step: '02',
        title: 'Mapeamento Patrimonial e Familiar',
        description: 'Levantamento de bens, despesas reais e documentação essencial para desenhar uma proposta equilibrada.'
      },
      {
        step: '03',
        title: 'Mediação Consensual ou Defesa Judicial',
        description: 'Priorizamos sempre o acordo pacífico para poupar desgaste emocional. Caso inviável, atuamos com rigor técnico em juízo.'
      }
    ],
    about: {
      title: 'Advocacia Familiar com Respeito e Sensibilidade',
      subtitle: 'O fim de uma etapa não precisa significar a destruição de relações ou perdas financeiras injustas.',
      paragraphs: [
        'O Direito de Família trata das relações mais íntimas e preciosas da vida de qualquer pessoa. Por isso, nossa postura nunca é combativa por vaidade, mas firme na defesa da dignidade dos nossos clientes.',
        'Com mais de 16 anos de prática dedicada exclusivamente às varas de família e cartórios, acumulamos a sensibilidade necessária para conduzir negociações difíceis com serenidade.',
        'Nosso objetivo primordial é que você e seus filhos possam reconstruir suas vidas com segurança jurídica e paz de espírito.'
      ],
      badges: ['Mediação Restaurativa', 'Absoluto Sigilo Ético', 'Atendimento Online ou Presencial']
    },
    faq: [
      {
        question: 'É possível fazer divórcio em cartório sem ir ao fórum?',
        answer: 'Sim! Desde que haja consenso mútuo entre o casal e que não haja filhos menores ou incapazes (salvo em alguns estados onde já se admite havendo questões de guarda previamente resolvidas) ou que a mulher não esteja grávida. O divórcio extrajudicial em cartório é concluído em poucos dias.'
      },
      {
        question: 'Como é calculado o valor da pensão alimentícia? Existe porcentagem fixa?',
        answer: 'Não existe porcentagem fixa em lei (o mito dos "30%"). A legislação determina que a pensão seja fixada com base no binômio necessidade de quem recebe x possibilidade financeira de quem paga. Analisamos detalhadamente todos os custos do menor para fundamentar o valor correto.'
      },
      {
        question: 'Como funciona a guarda compartilhada na prática?',
        answer: 'Na guarda compartilhada, ambos os pais tomam em conjunto todas as decisões importantes sobre a vida dos filhos (escola, saúde, religião, viagens), mesmo que a residência principal da criança seja com um dos genitores. É a regra geral do direito brasileiro, salvo casos excepcionais.'
      },
      {
        question: 'Qual o prazo para abrir o inventário após o falecimento?',
        answer: 'O Código de Processo Civil estipula o prazo de 60 dias a contar da abertura da sucessão para instauração do processo de inventário. Caso ultrapassado o prazo, os herdeiros podem sofrer multa sobre o imposto de transmissão (ITCMD).'
      }
    ]
  },

  trabalhista: {
    id: 'trabalhista',
    name: 'Direito do Trabalho',
    badge: 'Advocacia Trabalhista Especializada',
    heroImage: '/images/legal/trabalhista.jpg',
    defaultLawyer: {
      name: 'Dr. Roberto Silveira',
      oab: 'OAB/UF 00.000',
      role: 'Advogado Especialista em Direito e Processo do Trabalho',
      city: 'Sua Cidade',
      state: 'UF',
      address: 'Av. Principal, 1000 - Centro Empresarial, Cidade - UF',
      phone: '(00) 90000-0000',
      whatsapp: '5500900000000',
      email: 'contato@seuescritorio.adv.br',
      instagram: '@seu.escritorio.adv',
      experienceYears: '15'
    },
    hero: {
      headline: 'Seus Direitos Trabalhistas Foram Desrespeitados? Recupere o que é Seu por Lei',
      subheadline: 'Análise minuciosa de rescisões contratuais, cálculo de horas extras, equiparação salarial, assédio moral e rescisão indireta.',
      ctaPrimary: 'Calcular Meus Direitos com o Advogado',
      ctaSecondary: 'Conhecer Direitos Frequentes',
      stats: [
        { label: 'Anos de Prática Forense', value: '+15' },
        { label: 'Cálculos Trabalhistas', value: '+3.200' },
        { label: 'Atendimento Sigiloso', value: '100%' },
        { label: 'Satisfação dos Clientes', value: '4.9 ★' }
      ]
    },
    painPoints: {
      title: 'Você Reconhece Algum Desses Problemas no Seu Trabalho?',
      subtitle: 'Muitas empresas contam com a falta de informação do trabalhador para deixar de pagar valores fundamentais:',
      items: [
        {
          title: 'Horas Extras e Banco de Horas Não Pagos',
          description: 'Jornadas exaustivas além do contrato sem remuneração adequada, intervalos de almoço suprimidos ou sobreaviso não remunerado.',
          icon: 'Clock'
        },
        {
          title: 'Salário por Fora e Falta de Depósito do FGTS',
          description: 'Valores pagos em dinheiro ou transferências não declaradas para diminuir encargos, prejudicando 13º, férias e aposentadoria.',
          icon: 'Banknote'
        },
        {
          title: 'Ambiente Hostil e Assédio Moral',
          description: 'Cobranças desmedidas, humilhações públicas, isolamento proposital ou pressão psicológica que adoece o colaborador.',
          icon: 'AlertOctagon'
        },
        {
          title: 'Demitido sem Receber Verbas Rescisórias',
          description: 'Atraso de mais de 10 dias para pagamento da rescisão, aplicação indevida de justa causa ou recusa de entrega de guias de seguro-desemprego.',
          icon: 'FileWarning'
        }
      ]
    },
    practiceAreas: [
      {
        title: 'Rescisão Indireta do Contrato de Trabalho',
        summary: 'Quando a empresa comete falta grave (atraso de salário, falta de FGTS, assédio), o trabalhador pode "demitir a empresa" e receber todas as verbas como se dispensado sem justa causa.',
        items: ['Saída imediata com recebimento de aviso prévio', 'Liberação das guias de seguro-desemprego', 'Multa rescisória de 40% do FGTS integral', 'Indenização por danos morais vinculados']
      },
      {
        title: 'Horas Extras, Noturnas & Intervalos',
        summary: 'Recálculo pericial de toda a jornada laborada nos últimos 5 anos, incluindo domingos, feriados, intervalos intrajornada e adicionais cabíveis.',
        items: ['Horas extras habituais e seus reflexos legais', 'Supressão total ou parcial de intervalo para almoço', 'Adicional noturno e hora noturna reduzida', 'Horas em regime de prontidão ou sobreaviso']
      },
      {
        title: 'Reconhecimento de Vínculo (PJ / MEI Falso)',
        summary: 'Descaracterização de fraudes contratuais onde o trabalhador é obrigado a emitir nota fiscal (PJ) mas cumpre horários, subordinação e exclusividade.',
        items: ['Cobrança retroativa de todos os direitos CLT', 'Depósitos integrais de FGTS + multa rescisória', 'Férias acrescidas de 1/3 e 13º salários atrasados', 'Aviso prévio proporcional ao tempo trabalhado']
      },
      {
        title: 'Acidentes de Trabalho & Doenças Ocupacionais',
        summary: 'Proteção e reparação para colaboradores que sofreram lesões ou desenvolveram patologias físicas ou psicológicas em decorrência das funções exercidas.',
        items: ['Estabilidade provisória de 12 meses no emprego', 'Indenização por danos materiais (pensionamento vitalício)', 'Danos morais e estéticos decorrentes da lesão', 'Restabelecimento de benefício junto ao INSS']
      },
      {
        title: 'Assédio Moral, Sexual & Metas Abusivas',
        summary: 'Reparação jurídica rigorosa para trabalhadores submetidos a humilhações públicas, cobranças desmedidas de metas, isolamento, constrangimentos ou retaliações.',
        items: ['Indenização por danos morais na Justiça do Trabalho', 'Rescisão indireta por quebra da dignidade humana', 'Proteção e reparação da integridade psicológica', 'Salvaguarda contra perseguição no ambiente de trabalho']
      }
    ],
    methodology: [
      {
        step: '01',
        title: 'Envio da Carteira e Holerites',
        description: 'Você nos encaminha fotos dos holerites, extrato do FGTS e termos de rescisão para fazermos a conferência contábil preliminar.'
      },
      {
        step: '02',
        title: 'Cálculo Líquido Estimado',
        description: 'Nossa equipe jurídica calcula os valores exatos sonegados nos últimos 5 anos, demonstrando o que é seu direito receber.'
      },
      {
        step: '03',
        title: 'Tentativa de Acordo ou Ação na Justiça',
        description: 'Conduzimos a negociação perante os órgãos de conciliação ou ajuizamos a Reclamatória Trabalhista com total transparência.'
      }
    ],
    about: {
      title: 'Advocacia Trabalhista com Rigor Técnico e Coragem',
      subtitle: 'Dedicados a equilibrar as relações de trabalho e garantir que cada hora dedicada seja justamente remunerada.',
      paragraphs: [
        'O trabalho é a fonte de sustento e dignidade de qualquer família brasileira. Não podemos aceitar que direitos consolidados na Constituição e na CLT sejam ignorados por conveniência empresarial.',
        'Nossa equipe conta com calculistas experientes e advogados com mais de 15 anos de presença nas varas do trabalho de Minas Gerais e do Brasil.',
        'Atendemos com total discrição, orientando o trabalhador sobre os riscos, possibilidades e a melhor forma de reunir provas materiais sem expor sua integridade.'
      ],
      badges: ['Conferência de Cálculos Forenses', 'Atendimento Online sem Deslocamento', 'Sigilo Profissional Absoluto']
    },
    faq: [
      {
        question: 'Qual o prazo máximo que tenho para entrar com ação trabalhista?',
        answer: 'Pela Constituição Federal, o trabalhador tem até 2 anos após o término do contrato de trabalho para ajuizar a ação, podendo cobrar os direitos e verbas dos últimos 5 anos contados da data da distribuição do processo.'
      },
      {
        question: 'A empresa pode me demitir se eu cobrar meus direitos?',
        answer: 'Se a empresa comete faltas graves cotidianas (ex: não depositar FGTS, atrasar salários recorrentemente ou assediar o funcionário), é possível pedir a Rescisão Indireta do Contrato de Trabalho, que permite que o colaborador se afaste legalmente do trabalho sem pedir demissão e cobre tudo judicialmente.'
      },
      {
        question: 'Fui contratado como MEI/PJ mas tinha chefe, horário e cumpria metas. Tenho direitos CLT?',
        answer: 'Sim! No Direito do Trabalho vigora o "Princípio da Primazia da Realidade", que diz que o que realmente acontece no dia a dia vale mais do que o papel assinado. Se havia pessoalidade, subordinação, habitualidade e onerosidade, a Justiça do Trabalho reconhece o vínculo empregatício CLT com pagamento de todos os direitos retroativos.'
      },
      {
        question: 'Não tenho testemunhas. Consigo provar horas extras e abusos?',
        answer: 'Sim. Conversas de WhatsApp, e-mails enviados fora do horário comercial, relatórios de login em sistemas corporativos, extratos de geolocalização e comprovantes bancários servem como robustas provas materiais em juízo.'
      }
    ]
  }
};
