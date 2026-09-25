import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicialização da API Gemini via variável de ambiente Vite
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Auxiliar para limpar blocos markdown ```json ... ``` retornados pelo Gemini
 * @param {string} text 
 * @returns {string}
 */
const cleanJsonText = (text) => {
  return text
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
      Atue como um Engenheiro de Software Sênior e Gerente de Projetos de Tecnologia & Produção Audiovisual com mais de 15 anos de experiência em estimativas de escopo e precificação.
      
      Você recebeu o seguinte briefing de um cliente:
      - Categoria do Serviço: ${categoryTitle}
      - Briefing / Necessidade do Cliente: "${description}"
      - Taxa Hora-Homem (HH) base do profissional: R$ ${hourlyRate}/hora
      - Margem de Contingência esperada: ${contingencyMargin}%
      - Margem de Lucro pretendida: ${profitMargin}%

      Sua tarefa é estimar com realismo técnico o escopo do projeto, decompondo em etapas executáveis para evitar retrabalho ou prejuízo ao profissional.

      Retorne APENAS um objeto JSON válido (sem markdown, sem formatação extra) no formato exato:
      {
        "complexity": "Baixa" | "Média" | "Alta" | "Muito Alta",
        "recommendedDeadlineDays": 15,
        "deliverables": [
          {
            "stage": "Nome da Etapa (ex: Planejamento & Arquitetura / UI UX)",
            "hours": 8,
            "description": "O que será executado e entregue nesta etapa específica."
          },
          {
            "stage": "Nome da Etapa (ex: Desenvolvimento Frontend Responsivo)",
            "hours": 16,
            "description": "O que será executado e entregue nesta etapa específica."
          }
        ],
        "estimatedHours": 24,
        "contingencyHours": 4,
        "totalHours": 28,
        "suggestedPrice": 3950.00,
        "minPrice": 3100.00,
        "premiumPrice": 4800.00,
        "scopeRisks": [
          "Risco de demora no envio de conteúdos/textos pelo cliente.",
          "Alterações de layout fora das rodadas de aprovação combinadas."
        ],
        "technicalNotes": "Resumo de recomendações técnicas e premissas para proteger o escopo do profissional."
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

    const deliverablesSummary = deliverables
      .map(d => `- ${d.stage || d.title}: ${d.hours || ''}h (${d.description || ''})`)
      .join('\n');

    const prompt = `
      Atue como um Consultor Comercial de Elite e Especialista em Fechamento de Vendas B2B e Soluções Digitais de Alto Valor (High Ticket).
      O profissional Rafael Pita precisa de apoio comercial para negociar e fechar este projeto:

      - Título do Projeto: ${title}
      - Cliente: ${clientName} ${clientCompany ? `(${clientCompany})` : ''}
      - Entregáveis Principais:
      ${deliverablesSummary || 'Solução personalizada sob medida'}
      - Investimento Final Proposto: R$ ${Number(finalPrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      - Prazo de Execução: ${deadlineDays} dias corridos
      - Condições de Pagamento: ${paymentTerms}

      Você deve produzir:
      1. Uma mensagem comercial pronta para WhatsApp com copywriting persuasivo (foco em ROI, segurança, autoridade e profissionalismo, sem soar desesperado por venda).
      2. Guia de resposta para as 3 maiores objeções de clientes ("Está caro / achei concorrente mais barato", "Preciso pensar / falar com sócio", "Tem desconto à vista?").

      Retorne APENAS um objeto JSON válido (sem markdown):
      {
        "whatsappMessage": "Texto formatado para WhatsApp com quebras de linha e emojis corporativos sutis.",
        "emailSubject": "Proposta Comercial: [Título do Projeto] - Rafael Pita Solutions",
        "valueProposition": "1 ou 2 frases sintetizando o grande benefício e retorno que esse projeto gerará ao cliente.",
        "objections": [
          {
            "objection": "Achei caro / Está fora do meu orçamento",
            "strategy": "Mude o foco de custo para investimento e segurança técnica.",
            "responseScript": "Mensagem exata e cordial para enviar ao cliente."
          },
          {
            "objection": "O concorrente faz pela metade do preço",
            "strategy": "Diferencie entregabilidade real, código limpo, suporte pós-entrega e ausência de dores de cabeça.",
            "responseScript": "Mensagem exata e cordial para enviar ao cliente."
          },
          {
            "objection": "Preciso pensar / avaliar com meu sócio",
            "strategy": "Facilite a tomada de decisão com um resumo executivo e crie senso de agenda/compromisso.",
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
