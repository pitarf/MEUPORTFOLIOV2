import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicialização da API Gemini via variável de ambiente Vite
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Auxiliar para limpar blocos markdown ```json ... ``` retornados pelo Gemini
 * @param {string} text 
 * @returns {string}
 */
const cleanJsonText = (text) => {
  const trimmed = text.trim();
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }
  return trimmed
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
};

/**
 * Gera conteúdo persuasivo para exibição de projetos no portfólio público
 * @param {string} title 
 * @param {string} category 
 * @param {string} client 
 * @param {string} services 
 * @returns {Promise<Object>}
 */
export const generateProjectContent = async (title, category, client, services) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      Atue como um especialista em copywriting para portfólios de tecnologia, design e fotografia.
      Crie um conteúdo curto, profissional e persuasivo para um novo projeto de portfólio.
      O texto deve ser focado em atrair novos clientes corporativos, mostrando valor e qualidade.

      Detalhes do Projeto:
      - Título: ${title}
      - Categoria: ${category}
      - Cliente: ${client || 'Confidencial'}
      - Serviços: ${services || 'Desenvolvimento e Soluções Digitais'}

      Retorne APENAS um objeto JSON (sem markdown, sem explicações adicionais) com as seguintes chaves:
      {
        "description": "Uma descrição breve e cativante do projeto (máx 2 frases).",
        "challenge": "Qual era o desafio principal (máx 1 frase).",
        "solution": "Como foi resolvido criativamente (máx 1 frase).",
        "results": "O impacto ou resultado final (máx 1 frase)."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return JSON.parse(cleanJsonText(text));
  } catch (error) {
    console.error("Erro ao gerar conteúdo com IA:", error);
    if (error.message && (error.message.includes('429') || error.message.includes('Quota exceeded'))) {
      throw new Error("Limite de requisições da IA atingido. Tente novamente em alguns segundos.");
    }
    throw new Error("Falha ao gerar conteúdo com IA. Verifique sua chave de API.");
  }
};

/**
 * Decompõe o escopo do projeto, calcula as horas (HH) por etapa e sugere a precificação ideal
 * @param {Object} params
 * @param {string} params.description Descritivo livre do que o cliente solicitou
 * @param {string} params.categoryTitle Categoria do serviço (Sites, Sistemas, Power BI, Fotografia, etc)
 * @param {number} params.hourlyRate Valor da hora-homem base (HH)
 * @param {number} params.profitMargin Margem de lucro desejada (%)
 * @param {number} params.contingencyMargin Margem de contingência/retrabalho (%)
 * @returns {Promise<Object>}
 */
export const estimateBudgetScopeWithAI = async ({
  description,
  categoryTitle = 'Geral',
  hourlyRate = 120,
  profitMargin = 20,
  contingencyMargin = 15
}) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      Atue como um Especialista Sênior em Estimativas de Projetos, Engenharia de Software e Precificação Comercial Freelancer.
      Você deve analisar o briefing do cliente e precificar com base nas diretrizes reais do mercado brasileiro e na BASE DE CONHECIMENTO oficial:

      DADOS DE ENTRADA DO PROJETO:
      - Categoria do Serviço: ${categoryTitle}
      - Briefing / Necessidade do Cliente: "${description}"
      - Taxa Hora-Homem (HH) de Referência: R$ ${hourlyRate}/hora
      - Margem de Contingência esperada: ${contingencyMargin}%
      - Margem de Lucro pretendida: ${profitMargin}%

      MATRIZ OFICIAL DE CALIBRAÇÃO E NÍVEIS DE PREÇO (MERCADO BRASILEIRO):
      
      🟢 NÍVEL 1: Projetos Simples & Ajustes Rápidos (1 a 2 dias úteis)
      - Escopos: Vetorização de logo, 1 a 2 banners/artes para redes sociais, correções pontuais de CSS/responsividade em site existente, instalação de SSL, migração de hospedagem simples, troca de DNS/e-mail.
      - Faixa de Preço: R$ 60,00 a R$ 150,00. Horas estimadas: 1 a 3h.

      🟡 NÍVEL 2: Projetos Médios (Landing Pages & Identidade Visual) (3 a 6 dias úteis)
      - Escopos: Landing Page de Alta Conversão em React/Next.js ou WordPress, Site Institucional Simples (até 4-5 seções), Pacote de artes para mídias sociais (8 a 15 posts/stories), Identidade Visual Básica (Logo + Paleta + Tipografia + Mockups).
      - Faixa de Preço:
        * Piso / Fechamento Rápido: R$ 350,00 a R$ 500,00
        * Recomendado de Mercado: R$ 600,00 a R$ 900,00
        * Premium (com adicionais ou SEO): R$ 950,00 a R$ 1.300,00
      - Horas estimadas: 4 a 10h.

      🟠 NÍVEL 3: Projetos Complexos & Corporativos (6 a 12 dias úteis)
      - Escopos: Site Institucional Completo (com blog, painel admin, SEO avançado, múltiplos formulários), Painel/Dashboard analítico (Power BI ou React consumindo API REST com autenticação), Automações & Webhooks (Stripe, Mercado Pago, CRM, n8n).
      - Faixa de Preço:
        * Piso / Fechamento Rápido: R$ 800,00 a R$ 1.200,00
        * Recomendado de Mercado: R$ 1.300,00 a R$ 2.200,00
        * Premium (com suporte estendido e alta disponibilidade): R$ 2.300,00 a R$ 3.200,00
      - Horas estimadas: 12 a 25h.

      🔴 NÍVEL 4: E-commerce, Lojas Virtuais & Plataformas SaaS (10 a 20 dias úteis)
      - Escopos: Loja Virtual Completa (WooCommerce/Shopify/Custom com catálogo, frete Correios/Melhor Envio, gateways, cupons), Plataformas Web / Micro-SaaS multi-usuário com RBAC, banco relacional PostgreSQL, assinaturas recorrentes e painel.
      - Faixa de Preço:
        * Piso Mínimo / Entrada: R$ 1.200,00 a R$ 1.800,00 (NUNCA orçar e-commerce/SaaS completo abaixo de R$ 900,00)
        * Recomendado de Mercado: R$ 2.000,00 a R$ 4.500,00+
        * Premium: R$ 4.800,00 a R$ 7.500,00
      - Horas estimadas: 20 a 45h.

      MODIFICADORES DE PREÇO E RISCO:
      - Entrega com Urgência solicitada: Adicione +30% a +50% ao preço e reduza prazo sugerido.
      - Integração de Gateways de Pagamento (Stripe, Mercado Pago, Pix): Adicione + R$ 250,00 a R$ 450,00 e + 2 dias ao prazo.
      - Migração de Dados / Banco Existente: Adicione + R$ 200,00 a R$ 500,00 e + 2 a 3 dias ao prazo.
      - Stack React / Next.js com IA: Mantenha preço de mercado competitivo com prazo ultra-ágil de entrega.
      - Se for Design Gráfico ou Arte pura: Mantenha sempre valores ágeis e acessíveis (Nível 1 ou Nível 2), evitando superestimar horas de trabalho.

      Retorne APENAS um objeto JSON válido (sem blocos markdown, sem texto fora do JSON):
      {
        "complexity": "Baixa" | "Média" | "Alta" | "Muito Alta",
        "level": 1 | 2 | 3 | 4,
        "recommendedDeadlineDays": 5,
        "deliverables": [
          {
            "stage": "Nome da Etapa",
            "hours": 3,
            "description": "O que será executado e entregue nesta etapa específica."
          }
        ],
        "estimatedHours": 6,
        "contingencyHours": 1,
        "totalHours": 7,
        "minPrice": 450.00,
        "suggestedPrice": 750.00,
        "premiumPrice": 1100.00,
        "scopeRisks": [
          "Risco de demora do cliente no envio de acessos ou materiais.",
          "Solicitação de alterações fora do escopo aprovado no briefing."
        ],
        "technicalNotes": "Resumo de justificativa técnica e comercial para o cliente."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return JSON.parse(cleanJsonText(text));
  } catch (error) {
    console.error("Erro ao estimar escopo com IA:", error);
    if (error.message && (error.message.includes('429') || error.message.includes('Quota exceeded'))) {
      throw new Error("Limite da API Gemini atingido. Tente novamente em instantes.");
    }
    throw new Error("Não foi possível gerar a estimativa com IA. Verifique os dados ou preencha manualmente.");
  }
};

/**
 * Gera proposta comercial de alto impacto para WhatsApp/E-mail e guia tático de contorno de objeções
 * @param {Object} params
 * @param {string} params.title Título do projeto
 * @param {string} params.clientName Nome do cliente
 * @param {string} params.clientCompany Nome da empresa do cliente
 * @param {Array} params.deliverables Lista de etapas/entregáveis
 * @param {number} params.finalPrice Valor final da proposta
 * @param {number} params.deadlineDays Prazo estimado em dias
 * @param {string} params.paymentTerms Condições de pagamento
 * @returns {Promise<Object>}
 */
export const generateSalesPitchWithAI = async ({
  title,
  clientName,
  clientCompany,
  deliverables = [],
  finalPrice,
  deadlineDays = 15,
  paymentTerms = '50% de entrada + 50% na entrega'
}) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Garante que deliverables seja um array válido mesmo se vier null do banco
    const safeDeliverables = Array.isArray(deliverables)
      ? deliverables
      : (typeof deliverables === 'string' ? (() => { try { return JSON.parse(deliverables); } catch { return []; } })() : []);

    const isDesignOrVisual = 
      /design|gr[aá]fic|logo|marca|identidade\s*visual|banner|post|social\s*media|flyer|panfleto|artes|card[aá]pio|embalagem|cart[aã]o|layout|figma|vetor/i.test(`${title} ${safeDeliverables.map(d => d.stage || d.title || '').join(' ')}`);

    const deliverablesSummary = safeDeliverables
      .map(d => `- ${d.stage || d.title}: ${d.hours ? `${d.hours}h ` : ''}(${d.description || ''})`)
      .join('\n');

    const prompt = `
      Atue como um Consultor Comercial de Elite e Especialista em Fechamento de Vendas B2B (Soluções Digitais, Design e Tecnologia).
      O profissional Rafael Pita precisa de apoio comercial para negociar e fechar este projeto:

      - Título do Projeto: ${title}
      - Cliente: ${clientName} ${clientCompany ? `(${clientCompany})` : ''}
      - Nicho Detectado: ${isDesignOrVisual ? 'Design Gráfico / Identidade Visual / Artes' : 'Tecnologia / Desenvolvimento / Software'}
      - Entregáveis Principais:
      ${deliverablesSummary || 'Solução personalizada sob medida'}
      - Investimento Final Proposto: R$ ${Number(finalPrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      - Prazo de Execução: ${deadlineDays} dias corridos
      - Condições de Pagamento: ${paymentTerms}

      DIRETRIZES DE COMUNICAÇÃO:
      ${isDesignOrVisual ? `
      - Tom para Design: Destaque o impacto visual imediato, a transmissão de autoridade que atrai clientes mais qualificados e a rapidez na entrega com arquivos de alta resolução prontos para gráfica e mídias digitais.
      - Para objeção de preço em Design: Mostre que o design é a 'vitrine' da empresa; peças amadoras afastam clientes, enquanto uma identidade profissional se paga na primeira impressão. Enfatize que não são modelos genéricos de Canva, mas criação sob medida.
      ` : `
      - Tom para Tecnologia: Foco em retorno sobre investimento (ROI), economia de tempo da equipe, estabilidade, código moderno e segurança.
      - Para objeção de preço em Tecnologia: Diferencie o custo de um retrabalho e a segurança de contar com código limpo e arquitetura escalável.
      `}
      - Condições de Pagamento como Trunfo Comercial:
        Incorpore sutilmente na mensagem e nos scripts de objeção a segurança da modalidade escolhida (${paymentTerms}):
        * Se for 50/50: enfatize o sinal para reserva de agenda e início imediato, e o saldo somente após aprovação final (risco zero para o cliente).
        * Se for por etapas / splits: enfatize que o pagamento acompanha cada entrega validada.
        * Se for cartão de crédito: enfatize a facilidade de parcelar em até 12x viabilizando o fluxo de caixa.

      Você deve produzir:
      1. Uma mensagem comercial pronta para WhatsApp com copywriting persuasivo, elegante e cordial.
      2. Guia de resposta para as 3 maiores objeções de clientes ("Achei caro / Está fora do meu orçamento", "O concorrente faz mais barato", "Preciso pensar / avaliar").

      Retorne APENAS um objeto JSON válido (sem markdown, sem texto fora do JSON):
      {
        "whatsappMessage": "Texto formatado para WhatsApp com quebras de linha e emojis corporativos sutis.",
        "emailSubject": "Proposta Comercial: [Título do Projeto] - Rafael Pita Solutions",
        "valueProposition": "1 ou 2 frases sintetizando o grande benefício e retorno que esse projeto gerará ao cliente.",
        "objections": [
          {
            "objection": "Achei caro / Está fora do meu orçamento",
            "strategy": "Mude o foco de custo para investimento e autoridade de marca.",
            "responseScript": "Mensagem exata e cordial para enviar ao cliente."
          },
          {
            "objection": "O concorrente faz pela metade do preço",
            "strategy": "Diferencie entregabilidade real, exclusividade autoral e arquivos definitivos.",
            "responseScript": "Mensagem exata e cordial para enviar ao cliente."
          },
          {
            "objection": "Preciso pensar / avaliar com calma",
            "strategy": "Crie senso de oportunidade e agenda sem pressionar desnecessariamente.",
            "responseScript": "Mensagem exata e cordial para enviar ao cliente."
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return JSON.parse(cleanJsonText(text));
  } catch (error) {
    console.error("Erro ao gerar proposta com IA:", error);
    if (error.message && (error.message.includes('429') || error.message.includes('Quota exceeded'))) {
      throw new Error("Limite de requisições da IA atingido. Tente novamente em instantes.");
    }
    throw new Error("Falha ao gerar proposta comercial com IA.");
  }
};
