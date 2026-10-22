/**
 * Repositório Central de Dados Parametrizados de Nutricionistas
 * Projeto: Plataforma de Landing Pages para Nutricionistas
 * 
 * Permite que diferentes profissionais de saúde possuam páginas personalizadas
 * e exclusivas mantendo uma arquitetura técnica unificada, acessível e otimizada para SEO local.
 * 
 * Regra Ética: Todos os dados padrão são estritamente demonstrativos para apresentação
 * de layout, em conformidade com o Conselho Federal de Nutricionistas (CFN).
 */

export const nutritionistsDatabase = {
    // 1. Nutricionista Demonstrativa Modelo : Rio de Janeiro (Ipanema & Online)
    'dra-camila-rocha-rio-de-janeiro': {
        id: 'dra-camila-rocha-rio-de-janeiro',
        slug: 'dra-camila-rocha-rio-de-janeiro',
        isDemonstrative: true,
        niche: 'clinica-comportamental',
        professional: {
            name: 'Dra. Camila Rocha',
            displayName: 'Camila Rocha',
            title: 'Nutricionista Clínica & Comportamental',
            crn: 'CRN-4 12345 (Demonstrativo)',
            avatarInitials: 'CR',
            shortBio: 'Especialista em Nutrição Clínica e Comportamento Alimentar pela UFRJ, com mais de 8 anos dedicados a promover saúde duradoura sem dietas restritivas ou culpa à mesa.',
            fullBio: 'Acredito que a verdadeira nutrição não impõe proibições radicais, mas constrói autonomia e equilíbrio. Meu método alia fundamentação científica atualizada a uma escuta empática e acolhedora, respeitando a sua rotina profissional, suas preferências gastronômicas e sua história com a comida. Cada orientação é formulada de maneira estritamente personalizada, promovendo exames laboratoriais otimizados, disposição física e uma relação pacífica com o próprio corpo.',
            photo: 'https://images.unsplash.com/photo-1594824813572-8869b0e271eb?auto=format&fit=crop&w=800&q=80',
            secondaryPhoto: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
            logo: null,
            academicBackground: [
                'Graduação em Nutrição pela Universidade Federal do Rio de Janeiro (UFRJ)',
                'Pós-Graduação em Nutrição Clínica Funcional e Fitoterapia (VP/Unicsul)',
                'Formação em Nutrição Comportamental e Abordagem Não Prescritiva',
                'Membro da Associação Brasileira de Nutrição (ASBRAN)'
            ]
        },
        location: {
            city: 'Rio de Janeiro',
            state: 'RJ',
            neighborhood: 'Ipanema',
            address: 'Rua Visconde de Pirajá, 550, Sala 804',
            zipCode: '22410-002',
            reference: 'A 2 minutos da Estação de Metrô Nossa Senhora da Paz',
            serviceMode: ['presencial', 'online'],
            onlineScope: 'Atendimento online para todo o Brasil e brasileiros no exterior via videoconferência segura.',
            hours: 'Segunda a Sexta: 08h00 às 19h00 | Sábados: 08h00 às 13h00',
            mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.1166348625943!2d-43.20845342378942!3d-22.98270104085444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9b10707797b5e5%3A0xa193d5fbf9303d2b!2sR.%20Visc.%20de%20Piraj%C3%A1%2C%20550%20-%20Ipanema%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2022410-002!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr'
        },
        contact: {
            phone: '(21) 96614-9077',
            whatsapp: '5521966149077',
            email: 'contato@camilarochanutri.com.br',
            bookingUrl: 'https://wa.me/5521966149077?text=Ola%2C%20Dra.%20Camila!%20Gostaria%20de%20agendar%20uma%20consulta%20nutricional.',
            initialWhatsappMessage: 'Olá! Encontrei seu site pelo Google e gostaria de conhecer as opções de consulta nutricional com a Dra. Camila Rocha.'
        },
        seo: {
            title: 'Dra. Camila Rocha : Nutricionista em Ipanema e Online : Rio de Janeiro',
            description: 'Acompanhamento nutricional individualizado no Rio de Janeiro (Ipanema) e consultas online. Reeducação alimentar sem dietas restritivas e saúde duradoura. Agende sua consulta.',
            keywords: 'nutricionista rio de janeiro, nutricionista ipanema, nutricionista clinica rj, nutricionista comportamental rj, consulta nutricionista rj, nutricionista online brasil',
            canonicalUrl: 'https://rafaelpitaoficial.com.br/nutricionista/dra-camila-rocha-rio-de-janeiro',
            indexable: true,
            ogImage: 'https://images.unsplash.com/photo-1594824813572-8869b0e271eb?auto=format&fit=crop&w=1200&h=630&q=85'
        },
        theme: {
            primary: '#244B3B', // Verde-escuro sofisticado
            secondary: '#557A61', // Verde secundário elegante
            background: '#F8F7F2', // Off-white acolhedor
            surface: '#FFFFFF',
            text: '#252925', // Grafite mineral
            accent: '#2e634e'
        },
        hero: {
            badge: 'Atendimento Presencial em Ipanema & Online em Todo o Brasil',
            title: 'Nutrição personalizada para transformar sua relação com a alimentação.',
            subtitle: 'Um acompanhamento nutricional pensado para a sua rotina, suas preferências e seus objetivos de saúde, com orientação individualizada e foco em hábitos sustentáveis para a vida inteira.',
            primaryCtaText: 'Agendar minha consulta',
            secondaryCtaText: 'Conversar pelo WhatsApp'
        },
        trustElements: [
            { label: 'Registro Profissional', value: 'CRN-4 Ativo' },
            { label: 'Modalidade', value: 'Presencial e Online' },
            { label: 'Localização', value: 'Ipanema, Rio de Janeiro' },
            { label: 'Abordagem', value: 'Individualizada e Sem Restrições' }
        ],
        services: [
            {
                id: 'clinica',
                name: 'Nutrição Clínica & Saúde Preventiva',
                description: 'Manejo nutricional focado no equilíbrio metabólico, controle glicêmico, saúde cardiovascular, digestiva e melhora de parâmetros laboratoriais com planos alimentares práticos.',
                target: 'Para quem busca prevenir doenças crônicas, tratar alterações de exames ou melhorar sua disposição diária.',
                mode: 'Presencial ou Online',
                ctaText: 'Consultar Disponibilidade'
            },
            {
                id: 'reeducacao',
                name: 'Reeducação Alimentar & Hábitos Sustentáveis',
                description: 'Construção de hábitos alimentares saudáveis e prazerosos, desmistificando mitos e eliminando o ciclo vicioso de dietas extremas que geram efeito sanfona.',
                target: 'Adultos que desejam emagrecer com saúde e manter o peso ideal com tranquilidade.',
                mode: 'Presencial ou Online',
                ctaText: 'Quero Mudar Meus Hábitos'
            },
            {
                id: 'comportamental',
                name: 'Comportamento Alimentar & Mindful Eating',
                description: 'Trabalho focado na relação emocional com a comida, identificando sinais de fome e saciedade, gatilhos de ansiedade e compulsão alimentar leve a moderada.',
                target: 'Pessoas que sentem culpa ao comer ou usam a alimentação como principal válvula de escape para o estresse.',
                mode: 'Presencial ou Online',
                ctaText: 'Agendar Avaliação'
            },
            {
                id: 'esportiva',
                name: 'Nutrição Esportiva & Performance',
                description: 'Planejamento energético e de macronutrientes para praticantes de atividade física que buscam ganho de massa magra, perda de gordura e melhor rendimento nos treinos.',
                target: 'Praticantes de musculação, corrida, crossfit e esportes amadores.',
                mode: 'Presencial ou Online',
                ctaText: 'Otimizar Meus Treinos'
            }
        ],
        howItWorks: [
            {
                step: '01',
                title: 'Primeiro Contato & Agendamento',
                description: 'Você entra em contato direto pelo WhatsApp, tira suas dúvidas iniciais sobre valores e horários e escolhe o formato presencial ou online.'
            },
            {
                step: '02',
                title: 'Consulta Detalhada & Anamnese',
                description: 'Realizamos uma consulta aprofundada de 60 a 80 minutos para entender sua rotina, histórico clínico, exames de sangue, horários e preferências alimentares.'
            },
            {
                step: '03',
                title: 'Plano Alimentar & Suporte Contínuo',
                description: 'Você recebe um planejamento alimentar sob medida em até 48 horas úteis, com receitas práticas, orientações de compras e canal direto no WhatsApp para tirar dúvidas entre as consultas.'
            }
        ],
        differentials: [
            {
                title: 'Planejamento 100% Individualizado',
                description: 'Seu plano não é uma folha pré-impressa retirada da gaveta. Cada refeição respeita o que você gosta de comer e o seu tempo real disponível no dia a dia.'
            },
            {
                title: 'Sem Proibições Radicais',
                description: 'Aprenda a comer com prazer social e equilíbrio. Nenhuma comida comum é demonizada, priorizando sempre a consistência em vez da perfeição inatingível.'
            },
            {
                title: 'Canal de Dúvidas Direto no WhatsApp',
                description: 'Você não fica desamparado entre uma consulta e outra. Pode enviar fotos de rótulos no mercado, tirar dúvidas sobre substituições e receber apoio contínuo.'
            },
            {
                title: 'Atendimento Humanizado e Sem Julgamentos',
                description: 'Um espaço seguro para você falar abertamente sobre suas dificuldades na alimentação, sem sermões, cobranças irreais ou pesagens constrangedoras.'
            }
        ],
        testimonials: [], // Deixado vazio conforme critério ético: não gerar depoimentos fictícios
        faq: [
            {
                q: 'Como funciona a primeira consulta nutricional?',
                a: 'A primeira consulta é uma conversa detalhada de cerca de uma hora e meia. Avaliamos sua rotina de horários, hábitos atuais, preferências, aversões, histórico de saúde e exames recentes. Definimos metas claras juntos e montamos as bases do seu planejamento.'
            },
            {
                q: 'O atendimento online tem a mesma eficácia da consulta presencial?',
                a: 'Sim! O atendimento online é regulamentado pelo Conselho Federal de Nutricionistas (CFN) e possui a mesma profundidade técnica. As consultas ocorrem por videochamada privada e você recebe todo o material no seu celular.'
            },
            {
                q: 'O plano alimentar é entregue na hora ou depois?',
                a: 'O planejamento detalhado é entregue em até 48 horas úteis após a consulta. Esse tempo é fundamental para que o cardápio, as quantidades de nutrientes e as substituições sejam calculados com rigor exclusivamente para você.'
            },
            {
                q: 'Como funciona o acompanhamento e retorno?',
                a: 'Dependendo do seu objetivo, os acompanhamentos costumam ser mensais ou quinzenais. Além das consultas de reavaliação, você tem canal aberto via WhatsApp para sanar dúvidas rotineiras sobre preparações e substituições.'
            },
            {
                q: 'Eu preciso cortar carboidratos ou doces para ter resultados?',
                a: 'Não! Dietas que cortam grupos alimentares inteiros geram frustração e rebote de peso. Nosso foco é ensinar proporções adequadas, saciedade e flexibilidade, para que você alcance saúde sem abdicar da sua vida social.'
            },
            {
                q: 'Como faço para agendar uma consulta?',
                a: 'Basta clicar em qualquer um dos botões de agendamento desta página para ser direcionado diretamente ao WhatsApp. Nossa equipe verificará os horários disponíveis e reservará a sua vaga.'
            }
        ],
        finalCta: {
            title: 'Vamos conversar sobre seus objetivos nutricionais?',
            description: 'Entre em contato para conhecer as opções de atendimento presencial em Ipanema ou teleconsulta e verificar a disponibilidade de horários.',
            primaryText: 'Agendar consulta',
            secondaryText: 'Falar pelo WhatsApp'
        }
    },

    // 2. Nutricionista Modelo : Nutrição Esportiva & Performance
    'dr-lucas-mendes-nutricao-esportiva': {
        id: 'dr-lucas-mendes-nutricao-esportiva',
        slug: 'dr-lucas-mendes-nutricao-esportiva',
        isDemonstrative: true,
        niche: 'esportiva',
        professional: {
            name: 'Dr. Lucas Mendes',
            displayName: 'Lucas Mendes',
            title: 'Nutricionista Esportivo & Fisiologia do Exercício',
            crn: 'CRN-4 67890 (Demonstrativo)',
            avatarInitials: 'LM',
            shortBio: 'Mestre em Ciências do Exercício, atuando há mais de 7 anos no acompanhamento de atletas amadores e profissionais com foco em hipertrofia, força e composição corporal.',
            fullBio: 'A nutrição esportiva deve ser estratégica, precisa e ajustada à periodização dos seus treinos. Meu foco é estruturar a ingestão de macro e micronutrientes, hidratação e suplementação com embasamento científico, maximizando seus resultados no esporte sem comprometer a sua saúde a longo prazo.',
            photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
            secondaryPhoto: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
            logo: null,
            academicBackground: [
                'Graduação em Nutrição pela Universidade do Estado do Rio de Janeiro (UERJ)',
                'Mestrado em Ciências do Exercício e Fisiologia Humana (UFRJ)',
                'Especialista em Nutrição Esportiva pela ASBRAN',
                'Certificação Internacional em Cineantropometria (ISAK Nível 2)'
            ]
        },
        location: {
            city: 'Rio de Janeiro',
            state: 'RJ',
            neighborhood: 'Barra da Tijuca',
            address: 'Av. das Américas, 3500, Bloco 4, Sala 210',
            zipCode: '22640-102',
            reference: 'Condomínio Le Monde Office, próximo ao Barra Shopping',
            serviceMode: ['presencial', 'online'],
            onlineScope: 'Consultoria esportiva online com análise de diário alimentar e periodização de treinos.',
            hours: 'Segunda a Sexta: 07h00 às 20h00',
            mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.583321526487!2d-43.3512345!3d-22.9998765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9bda2c8b8b8b8b%3A0x1234567890!2sAv.+das+Am%C3%A9ricas%2C+3500+-+Barra+da+Tijuca%2C+Rio+de+Janeiro+-+RJ!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr'
        },
        contact: {
            phone: '(21) 96614-9077',
            whatsapp: '5521966149077',
            email: 'contato@lucasmendesnutri.com.br',
            bookingUrl: 'https://wa.me/5521966149077?text=Ola%2C%20Dr.%20Lucas!%20Gostaria%20de%20agendar%20uma%20consulta%20de%20nutricao%20esportiva.',
            initialWhatsappMessage: 'Olá! Encontrei seu site pelo Google e gostaria de agendar uma consulta de nutrição esportiva com o Dr. Lucas Mendes.'
        },
        seo: {
            title: 'Dr. Lucas Mendes : Nutricionista Esportivo na Barra da Tijuca : Rio de Janeiro',
            description: 'Nutrição esportiva de alta performance na Barra da Tijuca e online. Ganho de massa muscular, definição corporal e periodização para treinos. Agende sua consulta.',
            keywords: 'nutricionista esportivo barra da tijuca, nutricionista esportivo rj, hipertrofia rio de janeiro, dieta para treino rj',
            canonicalUrl: 'https://rafaelpitaoficial.com.br/nutricionista/dr-lucas-mendes-nutricao-esportiva',
            indexable: true,
            ogImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1200&h=630&q=85'
        },
        theme: {
            primary: '#1B3B2B',
            secondary: '#416650',
            background: '#F7F8F5',
            surface: '#FFFFFF',
            text: '#202621',
            accent: '#26533c'
        },
        hero: {
            badge: 'Nutrição Esportiva Baseada em Fisiologia e Evidências',
            title: 'Maximize seu rendimento, hipertrofia e composição corporal.',
            subtitle: 'Planejamento nutricional periodizado para esportistas e atletas que buscam evolução real nos treinos com estratégia de macronutrientes e suplementação calculada.',
            primaryCtaText: 'Agendar consulta esportiva',
            secondaryCtaText: 'Tirar dúvidas no WhatsApp'
        },
        trustElements: [
            { label: 'Registro Profissional', value: 'CRN-4 Ativo' },
            { label: 'Formação', value: 'Mestre em Fisiologia' },
            { label: 'Localização', value: 'Barra da Tijuca, RJ' },
            { label: 'Atendimento', value: 'Presencial e Online' }
        ],
        services: [
            {
                id: 'hipertrofia',
                name: 'Hipertrofia & Ganho de Massa Magra',
                description: 'Superávit calórico controlado e fracionamento proteico específico para estímulo máximo de síntese proteica muscular sem acúmulo excessivo de gordura.',
                target: 'Praticantes de musculação e fisiculturismo que estagnaram nos ganhos.',
                mode: 'Presencial ou Online',
                ctaText: 'Ver Disponibilidade'
            },
            {
                id: 'definicao',
                name: 'Definição Muscular & Redução de Gordura',
                description: 'Déficit calórico inteligente preservando massa magra, força e saúde hormonal através de estratégias nutricionais sustentáveis.',
                target: 'Atletas e amadores que desejam redução do percentual de gordura.',
                mode: 'Presencial ou Online',
                ctaText: 'Quero Definir'
            },
            {
                id: 'periodizacao',
                name: 'Periodização para Corridas & Endurance',
                description: 'Aporte estratégico de carboidratos, sais minerais e reposição hídrica para treinos longos, meias maratonas, maratonas e triatlos.',
                target: 'Corredores, ciclistas e atletas de esportes aeróbicos.',
                mode: 'Presencial ou Online',
                ctaText: 'Periodizar Treinos'
            }
        ],
        howItWorks: [
            {
                step: '01',
                title: 'Alinhamento de Treinos & Metas',
                description: 'Analisamos sua rotina de exercícios, cargas, horários e objetivos de competição ou estética.'
            },
            {
                step: '02',
                title: 'Avaliação Antropométrica ou Fotos Guiadas',
                description: 'Medição detalhada de pregas cutâneas e circunferências no presencial ou protocolo fotográfico no online.'
            },
            {
                step: '03',
                title: 'Periodização Nutricional Personalizada',
                description: 'Cardápio sincronizado com os dias de treino pesado, descanso e estratégia específica de pré e pós-treino.'
            }
        ],
        differentials: [
            {
                title: 'Alinhamento com sua Planilha de Treino',
                description: 'A alimentação muda de acordo com o dia de treino leve ou intenso, otimizando recuperação e glicogênio muscular.'
            },
            {
                title: 'Prescrição Científica de Suplementos',
                description: 'Somente suplementos com eficácia comprovada por literatura internacional (como creatina, cafeína e whey), sem gastos inúteis.'
            },
            {
                title: 'Monitoramento Contínuo',
                description: 'Ajustes regulares de calorias e macros conforme a evolução da sua taxa metabólica basal e rendimento.'
            }
        ],
        testimonials: [],
        faq: [
            {
                q: 'Preciso tomar suplementos para ter resultados?',
                a: 'Não necessariamente. A base dos seus resultados virá da comida de verdade. Os suplementos entram apenas de maneira pontual para facilitar a praticidade na rotina ou complementar necessidades específicas comprovadas.'
            },
            {
                q: 'Como funciona a avaliação corporal no atendimento online?',
                a: 'No atendimento online utilizamos um protocolo guiado de pesagem padronizada, circunferências corporais simples e fotos de controle em ambiente seguro e confidencial.'
            },
            {
                q: 'A consulta inclui indicação de manipulados ou fitoterápicos?',
                a: 'Quando clinicamente indicado e necessário, podemos prescrever formulações fitoterápicas e nutrientes específicos com dosagens individualizadas respaldadas por evidências científicas.'
            }
        ],
        finalCta: {
            title: 'Pronto para levar seu rendimento ao próximo nível?',
            description: 'Agende sua consulta e tenha uma estratégia nutricional alinhada aos seus treinos e metas corporais.',
            primaryText: 'Agendar consulta esportiva',
            secondaryText: 'Falar no WhatsApp'
        }
    }
};

/**
 * Recupera os dados de um nutricionista a partir do slug
 * @param {string} slug - Identificador amigável da URL
 * @returns {object} Dados completos do profissional ou o profissional padrão
 */
export function getNutritionistBySlug(slug) {
    if (!slug) return nutritionistsDatabase['dra-camila-rocha-rio-de-janeiro'];
    return nutritionistsDatabase[slug] || nutritionistsDatabase['dra-camila-rocha-rio-de-janeiro'];
}

/**
 * Retorna todos os nutricionistas cadastrados na plataforma
 * @returns {Array<object>} Lista de perfis
 */
export function getAllNutritionists() {
    return Object.values(nutritionistsDatabase);
}

/**
 * Retorna o perfil demonstrativo padrão
 * @returns {object} Perfil padrão
 */
export function getDefaultNutritionist() {
    return nutritionistsDatabase['dra-camila-rocha-rio-de-janeiro'];
}
