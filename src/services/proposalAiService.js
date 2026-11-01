import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Carrega variáveis de ambiente se não estiverem definidas (útil em dev ou Node puro)
function getGeminiApiKey() {
    if (process.env.VITE_GEMINI_API_KEY) return process.env.VITE_GEMINI_API_KEY;
    if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;

    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            for (const line of envContent.split('\n')) {
                const trimmed = line.trim();
                if (trimmed.startsWith('VITE_GEMINI_API_KEY=')) {
                    return trimmed.split('=')[1].trim();
                }
                if (trimmed.startsWith('GEMINI_API_KEY=')) {
                    return trimmed.split('=')[1].trim();
                }
            }
        }
    } catch {
        // Silencioso em caso de restrição de I/O
    }
    return '';
}

/**
 * Carrega a base consolidada de cases do arquivo repertorio_cases.md (55 avaliações 5 estrelas + 60 projetos de portfólio).
 * @returns {string} Texto formatado dos cases para injeção de contexto na IA.
 */
function getCasesKnowledgeBase() {
    try {
        const mdPath = path.resolve(process.cwd(), 'src/data/motor-ia/repertorio_cases.md');
        if (fs.existsSync(mdPath)) {
            const content = fs.readFileSync(mdPath, 'utf8');
            return content.replace(/^#\s+[^\n]+/i, '').trim();
        }
    } catch {
        // Fallback silencioso em ambientes sem leitura direta
    }

    return `
HISTÓRICO REAL DE CASOS DO FREELANCER (55 AVALIAÇÕES 5.0 ESTRELAS E 60 PROJETOS):
1. Aplicações Web Full Stack (React, Next.js, Node.js, TypeScript, Tailwind CSS, Supabase, PostgreSQL):
   - Vantage App: Plataforma SaaS de Fidelidade Gastronômica com PWA, QR Code dinâmico com rotação diária e cartões de fidelidade estilo Apple Wallet.
   - SMS Fácil: Plataforma SaaS de números virtuais com Docker, PostgreSQL e pagamentos Pix instantâneos.
   - Sistema de Escalas: Plataforma de gerenciamento de escalas, eventos, funções e usuários (React, Supabase, Node.js).
   - DetetiveBuscas: Sistema web de pesquisas e cruzamento de informações.
   - Sistemas de gestão, cálculos e orçamentos automáticos em PDF para marcenaria, drywall e serviços sob medida.
2. Web Scraping e Automações (Python, Puppeteer, Cheerio, Crawlers):
   - Robôs de extração de dados públicos (Google Maps / Places API, e-commerces, cotações).
   - Automações de planilhas e bots de notificações via Telegram/WhatsApp.
3. Integração de APIs e Pagamentos:
   - Pagamentos transparentes via Pix, Cartão e Boleto (Mercado Pago, Asaas, Stripe) com webhooks.
   - Integrações de frete e rotinas de background com cache em banco de dados.
4. WordPress, WooCommerce e Landing Pages:
   - Lojas virtuais completas no WooCommerce com cálculo de frete e painel simples em 1 clique.
   - Landing pages de alta performance em conversão e Core Web Vitals verdes (CBJJO, Moy Seguros, Contabilidade Walter Muniz, THD Engenharia).
5. Planilhas Avançadas, Excel e Power BI:
   - Dashboards financeiros e operacionais integrados com Power Query e modelagem executiva.
6. Design Gráfico, Branding e Produção com IA:
   - Criação de mascotes, embalagens, identidades visuais e vídeos promocionais cinematográficos gerados com IA.
`;
}

/**
 * Detecta se o primeiro nome é predominantemente feminino no Brasil para saudação.
 * @param {string} name - Primeiro nome do cliente.
 * @returns {'feminino' | 'masculino'}
 */
export function detectGenderByName(name = '') {
    const cleanName = (name || '')
        .trim()
        .split(' ')[0]
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    if (!cleanName) return 'masculino';

    // Nomes femininos mais comuns no Brasil
    const femaleNames = new Set([
        'cintia', 'mariana', 'marina', 'ana', 'maria', 'juliana', 'fernanda', 'camila',
        'patricia', 'aline', 'amanda', 'beatriz', 'carolina', 'claudia', 'daniela',
        'debora', 'eliane', 'fabiana', 'gabriela', 'helena', 'isabela', 'isabella',
        'jessica', 'larissa', 'leticia', 'luana', 'luciana', 'marcela', 'natalia',
        'paula', 'renata', 'sabrina', 'tatiana', 'vanessa', 'thais', 'flavia',
        'katia', 'bruna', 'bianca', 'roberta', 'priscila', 'monica', 'simone',
        'andressa', 'carla', 'cristina', 'elizabeth', 'adriana', 'regina', 'viviane',
        'silvia', 'sandra', 'valeria', 'rosana', 'denise', 'michele', 'paloma', 'suelen'
    ]);

    if (femaleNames.has(cleanName)) return 'feminino';

    // Terminações comuns femininas em português (ex: Gabriela, Mariana, Luiza, etc.)
    if (cleanName.endsWith('a') && !['lucas', 'elias', 'jonas', 'matias', 'alexandre'].includes(cleanName)) {
        return 'feminino';
    }

    return 'masculino';
}

/**
 * Sanitiza e aplica regras de ouro no texto gerado pela IA.
 * Remove Markdown indevido, substitui travessões e garante conformidade com o 99Freelas.
 * @param {string} text - Texto gerado pela IA.
 * @param {Object} context - Metadados da proposta.
 * @returns {string} Texto perfeitamente formatado.
 */
export function sanitizeProposalText(text = '', context = {}) {
    if (!text) return '';

    let clean = text.trim();

    // 1. Remove qualquer marcação de bloco de código json (caso a IA insira)
    clean = clean.replace(/```json/gi, '').replace(/```/g, '').trim();

    // 2. Converte negritos markdown residuais para {b}...{/b}
    clean = clean.replace(/\*\*([^*]+)\*\*/g, '{b}$1{/b}');

    // 3. Converte itálicos markdown residuais para {i}...{/i}
    clean = clean.replace(/_([^_]+)_/g, '{i}$1{/i}');

    // 4. ELIMINAÇÃO TOTAL DE TRAVESSÕES (—, –, --)
    // Conforme regra de ouro: "PROIBIDO USAR QUALQUER MARKDOWN OU TRAVESSÕES (—, –, --)"
    clean = clean.replace(/\s*[\u2014\u2013]\s*/g, ', ');
    clean = clean.replace(/\s*--\s*/g, ', ');

    // 5. Normaliza formatação de links {u}...{/u}
    const isPhoto = (context.categoria || '').toLowerCase().includes('foto') ||
                    (context.titulo || '').toLowerCase().includes('foto') ||
                    (context.descricao || '').toLowerCase().includes('ensaio') ||
                    (context.descricao || '').toLowerCase().includes('fotograf');

    const expectedPhotoUrl = 'https://www.rafaelpitaoficial.com.br/portfolio-fotografia-v2/galeria';
    const expectedDevUrl = 'https://www.rafaelpitaoficial.com.br/portfolio-v2';
    const rawOfficialUrl = isPhoto ? expectedPhotoUrl : expectedDevUrl;

    // Remove wrappers {u} residuais para evitar repetição {u}{u}...{/u}{/u}
    clean = clean.replace(/\{u\}(https?:\/\/[^}]+)\{\/u\}/gi, '$1');

    // Remove URLs externas e fictícias geradas acidentalmente
    clean = clean.replace(/https?:\/\/(?!www\.rafaelpitaoficial\.com\.br)[^\s)]+/gi, '');

    // Se o domínio oficial não estiver no texto, insere
    if (!clean.includes('rafaelpitaoficial.com.br')) {
        clean += `\n\nMeu portfólio oficial: {u}${rawOfficialUrl}{/u}`;
    } else {
        // Envolve a URL oficial uma única vez em {u}...{/u}
        clean = clean.replace(new RegExp(`(https?:\\/\\/www\\.rafaelpitaoficial\\.com\\.br[^\\s{<]+)`, 'g'), '{u}$1{/u}');
    }

    // 6. Garante quebras de parágrafo naturais caso venham coladas
    clean = clean.replace(/(?<=[.!?])\s*(Com este|Com esse|Com esta|Com essa)/g, '\n\n$1');
    clean = clean.replace(/(?<=[.!?])\s*(Minha metodologia|Escrevo código|Desenvolvo código)/g, '\n\n$1');
    clean = clean.replace(/(?<=[.!?])\s*(Meu portfólio|Confira meu|Veja meu)/g, '\n\n$1');
    clean = clean.replace(/(?<=[.!?])\s*(Investimento:)/g, '\n\n$1');
    clean = clean.replace(/(?<=[.!?])\s*(Consigo começar|Fico à disposição|Me chama no chat)/g, '\n\n$1');

    // 7. Garante o Gatilho de Confiança obrigatório com bloco destacado
    const trustTrigger = '> Minha meta é obter 5 estrelas, então você tem meu total comprometimento.';
    if (clean.includes('Minha meta é obter 5 estrelas')) {
        clean = clean.replace(/(?:^|\n|>)?\s*Minha meta é obter 5 estrelas[^\n.]*\.?/gi, `\n\n${trustTrigger}\n\n`);
    } else {
        // Insere antes de "Investimento:" se existir, ou no final
        if (clean.includes('Investimento:')) {
            clean = clean.replace('Investimento:', `${trustTrigger}\n\nInvestimento:`);
        } else {
            clean += `\n\n${trustTrigger}`;
        }
    }

    // 8. Normaliza espaçamentos e quebras de linha duplas
    clean = clean.replace(/\n{3,}/g, '\n\n').trim();

    return clean;
}

/**
 * Gera proposta comercial de alta conversão para o 99Freelas via Google Gemini.
 * @param {Object} payload - Dados recebidos da extensão.
 * @returns {Promise<Object>} Resposta com valorFinal, prazoDias e textoDetalhes.
 */
export async function generateProposal(payload = {}) {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        throw new Error('Chave de API do Gemini não configurada no ambiente (VITE_GEMINI_API_KEY).');
    }

    const {
        titulo = '',
        descricao = '',
        clienteNome = '',
        categoria = '',
        habilidades = [],
        orcamento = '',
        valorMedio = 0,
        duracaoMedia = 0,
        modo = 'padrao', // 'padrao', 'emergencia', 'falsa_emergencia'
        horaEnvio = new Date().getHours(),
        instrucoesExtras = '',
        valorManualNativo = '',
        prazoManualNativo = ''
    } = payload;

    // Detecta saudação personalizada por gênero
    const gender = detectGenderByName(clienteNome);
    const greeting = clienteNome
        ? (gender === 'feminino' ? `Olá, ${clienteNome}! Tudo bem? Espero que sim.` : `Fala, ${clienteNome}! Tudo bem? Espero que sim.`)
        : 'Olá! Tudo bem? Espero que sim.';

    // URL do portfólio oficial
    const isPhotoCategory = (categoria || '').toLowerCase().includes('foto') ||
        (titulo || '').toLowerCase().includes('foto') ||
        (descricao || '').toLowerCase().includes('ensaio') ||
        (descricao || '').toLowerCase().includes('fotograf');

    const portfolioUrl = isPhotoCategory
        ? '{u}https://www.rafaelpitaoficial.com.br/portfolio-fotografia-v2/galeria{/u}'
        : '{u}https://www.rafaelpitaoficial.com.br/portfolio-v2{/u}';

    // Regra de horário de envio
    let closureTiming = 'Consigo começar hoje mesmo. Me chama no chat!';
    if (horaEnvio >= 19 || horaEnvio < 6) {
        closureTiming = 'Consigo iniciar logo pela manhã. Me chama no chat!';
    } else if (horaEnvio >= 16) {
        closureTiming = 'Consigo iniciar ainda hoje ou logo cedo. Me chama no chat!';
    }

    // Repertório e prova técnica (55 avaliações 5 estrelas + 60 projetos de portfólio)
    const casesSummary = getCasesKnowledgeBase();

    // Monta o prompt do sistema ultra-calibrado
    const systemPrompt = `Você é um Engenheiro de Software Sênior e Copywriter de Vendas de elite de Rafael Pita na plataforma 99Freelas.
Seu objetivo é gerar uma proposta comercial irresistível, personalizada, técnica e de altíssima conversão.

DIRETRIZES FUNDAMENTAIS DO FREELANCER (RAFAEL PITA):
- Formação: Técnico em Informática formado pelo CEFET-RJ.
- Metodologia de Engenharia: Utiliza IA avançada na programação para leitura rápida de documentações e aceleração de escrita de código limpo, sem abrir mão das boas práticas de engenharia de software.
- Compromisso Oficial: 30 dias de suporte pós-entrega e dedicação para nota máxima 5.0 estrelas.
- Modelo de Trabalho: 100% REMOTO (via chat da plataforma e chamadas de vídeo, sem trabalho ou reuniões presenciais).
- Piso mínimo obrigatório: R$ 56,00. Nunca proponha valor inferior a 56.

REGRAS DE FORMATAÇÃO E ESTILO (RIGOROSO):
1. PROIBIDO USAR QUALQUER MARKDOWN TRADICIONAL OU TRAVESSÕES (—, –, --). Separe orações estritamente com vírgulas ou pontos.
2. USE ESTREITAMENTE AS TAGS CUSTOMIZADAS:
   - {b}texto{/b} : Exclusivo para valores monetários e prazos de entrega (ex: {b}R$ 3.000,00{/b}, {b}20 dias{/b}).
   - {i}texto{/i} : Para termos técnicos em inglês, linguagens e ferramentas (ex: {i}React{/i}, {i}Next.js{/i}, {i}WooCommerce{/i}).
   - {u}URL{/u} : Estritamente sobre o link do portfólio.
3. SAUDAÇÃO OBRIGATÓRIA: "${greeting}"
4. LINK ÚNICO DE PORTFÓLIO: "${portfolioUrl}". Proibido inventar links de clientes ou repositórios fictícios.
5. GATILHO DE CONFIANÇA OBRIGATÓRIO (em linha e parágrafo próprio isolado com quebra dupla):
> Minha meta é obter 5 estrelas, então você tem meu total comprometimento.
6. FECHAMENTO DINÂMICO CONFORME O HORÁRIO: "${closureTiming}"
7. FORMATAÇÃO EM PARÁGRAFOS: Use quebras de linha duplas (\\n\\n) separando cada bloco.

PRIORIDADE MÁXIMA PARA INSTRUÇÕES EXTRAS E INPUT DO FREELANCER:
${instrucoesExtras ? `ATENÇÃO - O FREELANCER INFORMOU ESTE CONTEXTO ADICIONAL:
"${instrucoesExtras}"

COMO TRATAR ESTE INPUT:
- Se houver história real ou contexto pessoal (ex: app de drywall, armário de casa, projeto anterior), PRESERVE esses detalhes autênticos. Histórias reais criam conexão humana e geram altíssima conversão! NÃO higienize com jargões burocráticos.
- Se mencionou que já tem algo pronto ou similar que serve de base ("copiar e ajustar"), posicione isso como o maior benefício de velocidade e segurança para o cliente.
- Se sugeriu marcar call para mostrar na tela, incorpore um convite entusiasmado para chamada de vídeo 100% remota no CTA final.` : 'Nenhuma instrução extra foi fornecida. Siga a estrutura padrão analítica.'}

DADOS DO PROJETO AVALIADO:
- Título: ${titulo}
- Briefing do Cliente: ${descricao}
- Nome do Cliente: ${clienteNome}
- Categoria: ${categoria}
- Habilidades Solicitadas: ${Array.isArray(habilidades) ? habilidades.join(', ') : habilidades}
- Orçamento Declarado: ${orcamento || 'Não informado'}
- Valor Médio dos Concorrentes: ${valorMedio ? `R$ ${valorMedio}` : 'Desconhecido'}
- Prazo Médio dos Concorrentes: ${duracaoMedia ? `${duracaoMedia} dias` : 'Desconhecido'}
- Modo de Envio: ${modo}
- Valor Manual Fornecido pelo Freelancer: ${valorManualNativo || 'Não definido (calcule)'}
- Prazo Manual Fornecido pelo Freelancer: ${prazoManualNativo || 'Não definido (calcule)'}

${casesSummary}

ESTRUTURA DA PROPOSTA (140 a 200 palavras, One-Page Style, separado por \\n\\n):
Bloco 1: Saudação (${greeting})
Bloco 2: Gancho com Prazo: Solução direta com prazo em negrito {b}...{/b}. Se houver base pronta ou história citada no input extra, introduza aqui.
Bloco 3: Escopo Comercial:
- Item 1
- Item 2
- Item 3
Bloco 4: Metodologia e Suporte: Código limpo, velocidade e {b}30 dias{/b} de suporte pós-entrega.
Bloco 5: Portfólio com Autoridade: ${portfolioUrl}
Bloco 6: Gatilho de Confiança:
> Minha meta é obter 5 estrelas, então você tem meu total comprometimento.
Bloco 7: Investimento e Prazo: Investimento: {b}R$ X{/b} | Prazo: {b}Y dias{/b}.
Bloco 8: CTA Consultivo com chamada remota (se aplicável) e "${closureTiming}".

Retorne EXCLUSIVAMENTE um objeto JSON válido (sem markdown de bloco):
{
  "sucesso": true,
  "valorFinal": "apenas_digitos_do_valor_proposto",
  "prazoDias": "apenas_digitos_do_prazo_proposto",
  "textoDetalhes": "texto_completo_da_proposta_com_quebras_duplas_e_tags"
}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const AVAILABLE_MODELS = ['gemini-2.5-flash', 'gemini-flash-latest'];
    let rawResult = null;
    let lastError = null;

    for (const modelName of AVAILABLE_MODELS) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    responseMimeType: 'application/json',
                    temperature: 0.35
                }
            });

            const result = await model.generateContent(systemPrompt);
            const responseText = await result.response.text();
            rawResult = JSON.parse(responseText.trim().replace(/^```json/i, '').replace(/```$/i, '').trim());
            break;
        } catch (err) {
            console.warn(`[proposalAiService] Modelo ${modelName} falhou:`, err?.message || err);
            lastError = err;
        }
    }

    if (!rawResult) {
        throw new Error(`Falha ao gerar proposta via IA: ${lastError?.message || 'instabilidade no serviço do Gemini'}`);
    }

    // Prioridade absoluta para valores e prazos manuais se informados pelo usuário
    let finalValue = valorManualNativo
        ? String(valorManualNativo).replace(/\D/g, '')
        : String(rawResult.valorFinal || '').replace(/\D/g, '');

    let finalDeadline = prazoManualNativo
        ? String(prazoManualNativo).replace(/\D/g, '')
        : String(rawResult.prazoDias || '').replace(/\D/g, '');

    // Se ainda vazio, busca no texto das instrucoesExtras (ex: "3mil" ou "R$ 3000")
    if (!finalValue && instrucoesExtras) {
        const valueMatch = instrucoesExtras.match(/(?:R\$\s*|valor\s*:?\s*)?(\d+(?:\.\d+)?)\s*(?:mil|k)?/i);
        if (valueMatch) {
            let num = parseFloat(valueMatch[1]);
            if (instrucoesExtras.toLowerCase().includes('mil') || instrucoesExtras.toLowerCase().includes('k')) {
                num = num * 1000;
            }
            if (num >= 56) finalValue = String(Math.round(num));
        }
    }

    // Piso mínimo do 99Freelas: R$ 56,00
    if (!finalValue || Number(finalValue) < 56) {
        finalValue = '60';
    }

    if (!finalDeadline || Number(finalDeadline) <= 0) {
        finalDeadline = duracaoMedia ? String(duracaoMedia) : '5';
    }

    // Sanitiza o texto gerado
    const sanitizedText = sanitizeProposalText(rawResult.textoDetalhes, {
        categoria,
        titulo,
        descricao,
        finalValue,
        finalDeadline
    });

    return {
        sucesso: true,
        valorFinal: finalValue,
        prazoDias: finalDeadline,
        textoDetalhes: sanitizedText
    };
}
