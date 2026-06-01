import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API
// Note: In a real production app, you might want to proxy this through a backend to hide the key.
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateProjectContent = async (title, category, client, services) => {
  try {
    // 'gemini-flash-latest' displayed in the user's available list.
    // This usually points to the latest stable Flash model (1.5) eligible for free tier.
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest"

    });

    const prompt = `
      Atue como um especialista em copywriting para portfólios de fotografia e design.
      Crie um conteúdo curto, profissional e persuasivo para um novo projeto de portfólio.
      O texto deve ser focado em atrair novos clientes, mostrando valor e qualidade.

      Detalhes do Projeto:
      - Título: ${title}
      - Categoria: ${category}
      - Cliente: ${client || 'Confidencial'}
      - Serviços: ${services || 'Fotografia e Direção de Arte'}

      Retorne APENAS um objeto JSON (sem markdown) com as seguintes chaves:
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

    // Clean up potential markdown code blocks if the model ignores the "no markdown" instruction
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Erro ao gerar conteúdo com IA:", error);

    // Handle Rate Limits (429)
    if (error.message.includes('429') || error.message.includes('Quota exceeded')) {
      throw new Error("Limite de requisições da IA atingido. Tente novamente em alguns segundos.");
    }

    throw new Error("Falha ao gerar conteúdo. Verifique sua chave de API.");
  }
};
