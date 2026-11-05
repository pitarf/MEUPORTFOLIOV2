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
 * Extrai de forma inteligente e precisa valores monetários e prazos informados
 * em textos livres de anotações ou rascunhos do freelancer.
 * @param {string} text - Texto do input opcional.
 * @returns {{ valor: number|null, prazo: number|null }}
 */
export function extractCustomPriceAndDeadline(text = '') {
    if (!text || typeof text !== 'string') return { valor: null, prazo: null };

    let valor = null;
    let prazo = null;

    // 1. Extração de Valor Monetário:
    // Padrão A: "3mil", "2.5 mil", "1.5k" com multiplicador
    const matchMil = text.match(/(?:valor|preço|preco|cobrar|faço por|faco por|orçamento|orcamento|investimento)?\s*(?:R\$\s*)?(\d+(?:[.,]\d+)?)\s*(mil|k)\b/i);
    if (matchMil) {
        const base = parseFloat(matchMil[1].replace(',', '.'));
        if (!isNaN(base)) valor = Math.round(base * 1000);
    }

    // Padrão B: R$ 3.000,00 ou R$ 1500
    if (!valor) {
        const matchReal = text.match(/R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d+)?|\d+)/i);
        if (matchReal) {
            const limpo = matchReal[1].replace(/\./g, '').replace(',', '.');
            const n = parseFloat(limpo);
            if (!isNaN(n) && n >= 50) valor = Math.round(n);
        }
    }

    // Padrão C: "valor de 3000", "cobrar 1500", "preço 800", "o valor seria de 3000"
    if (!valor) {
        const matchPalavra = text.match(/(?:valor|preço|preco|cobrar|faço por|faco por|investimento|orçamento|orcamento)\s*(?:seria)?\s*(?:de|em|é|e|:)?\s*(?:R\$\s*)?(\d+(?:\.\d+)?)/i);
        if (matchPalavra) {
            const n = parseFloat(matchPalavra[1]);
            if (!isNaN(n) && n >= 50) valor = Math.round(n);
        }
    }

    // Padrão D: "1500 reais", "800 conto"
    if (!valor) {
        const matchReais = text.match(/(\d+(?:\.\d+)?)\s*(?:reais|pila|conto)\b/i);
        if (matchReais) {
            const n = parseFloat(matchReais[1]);
            if (!isNaN(n) && n >= 50) valor = Math.round(n);
        }
    }

    // 2. Extração de Prazo:
    // Padrão A: "em até 20 dias", "prazo de 10 dias", "em 5 dias", "pronto em 15 dias"
    const matchPrazo = text.match(/(?:em\s+at[ée]|at[ée]|prazo|dura[çc][ãa]o|tempo|pronto\s+em|entrega\s+em)\s*(?:de|em|:)?\s*(\d+)\s*(?:dias|dia|d)\b/i);
    if (matchPrazo) {
        prazo = parseInt(matchPrazo[1], 10);
    }

    // Padrão B: "20 dias", "5 dias"
    if (!prazo) {
        const matchDias = text.match(/(\d+)\s*(?:dias|dia)\b/i);
        if (matchDias) {
            prazo = parseInt(matchDias[1], 10);
        }
    }

    return { valor, prazo };
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
        modo = 'padrao', // 'padrao', 'emergencia', 'falsa_emergencia', 'humanizado'
        humanizadoPrecoEmergencia = false,
        precoEmergencia = false,
        horaEnvio = new Date().getHours(),
        instrucoesExtras = '',
        valorManualNativo = '',
        prazoManualNativo = ''
    } = payload;

    // Detecta se a condição de preço de emergência (30% OFF) deve ser aplicada
    const isPrecoEmergencia = modo === 'emergencia' || humanizadoPrecoEmergencia === true || precoEmergencia === true || payload.isPrecoEmergencia === true || modo === 'humanizado_emergencia';

    // Detecta saudação personalizada por gênero ou horário
    const gender = detectGenderByName(clienteNome);
    
    // Saudação dependendo da hora do dia para o modo humanizado
    let saudacaoHorario = 'Olá';
    if (horaEnvio >= 5 && horaEnvio < 12) {
        saudacaoHorario = 'Bom dia';
    } else if (horaEnvio >= 12 && horaEnvio < 18) {
        saudacaoHorario = 'Boa tarde';
    } else {
        saudacaoHorario = 'Boa noite';
    }

    const greetingHumanizado = clienteNome
        ? `${saudacaoHorario}, ${clienteNome}! Tudo bem? Espero que sim!`
        : `${saudacaoHorario}! Tudo bem? Espero que sim!`;

    const greetingPadrao = clienteNome
        ? (gender === 'feminino' ? `Olá, ${clienteNome}! Tudo bem? Espero que sim.` : `Fala, ${clienteNome}! Tudo bem? Espero que sim.`)
        : 'Olá! Tudo bem? Espero que sim.';

    const greeting = modo === 'humanizado' ? greetingHumanizado : greetingPadrao;

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

    // 1. Extração inteligente de valor e prazo do input manual ou anotações do freelancer
    const customParsed = extractCustomPriceAndDeadline(instrucoesExtras);
    const valorManualDefinido = valorManualNativo ? String(valorManualNativo).replace(/\D/g, '') : (customParsed.valor ? String(customParsed.valor) : '');
    const prazoManualDefinido = prazoManualNativo ? String(prazoManualNativo).replace(/\D/g, '') : (customParsed.prazo ? String(customParsed.prazo) : '');

    // 2. Análise e Ponderação do Valor Médio dos Concorrentes
    const valorMedioNum = Number(payload.valorMedio || payload.valorMedioNum || 0);
    const duracaoMediaNum = Number(payload.duracaoMedia || 0);

    // MALÍCIA E ANÁLISE DE COMPLEXIDADE DO PROJETO E DEMANDA SOLICITADA
    const fullTextSearch = `${titulo} ${descricao} ${categoria} ${(Array.isArray(habilidades) ? habilidades.join(' ') : habilidades)}`.toLowerCase();

    const isVideoOrMotion = fullTextSearch.includes('vídeo') || fullTextSearch.includes('video') ||
                           fullTextSearch.includes('animação') || fullTextSearch.includes('animacao') ||
                           fullTextSearch.includes('quadro branco') || fullTextSearch.includes('whiteboard') ||
                           fullTextSearch.includes('motion') || fullTextSearch.includes('audiovisual') ||
                           fullTextSearch.includes('locução') || fullTextSearch.includes('locucao') ||
                           fullTextSearch.includes('reels') || fullTextSearch.includes('tiktok') ||
                           fullTextSearch.includes('youtube') || fullTextSearch.includes('edição de vídeo') ||
                           fullTextSearch.includes('edicao de video') || fullTextSearch.includes('after effects') ||
                           fullTextSearch.includes('premiere');

    const isSimpleDesign = (fullTextSearch.includes('vetoriza') || fullTextSearch.includes('vetor') || fullTextSearch.includes('recortar foto') || fullTextSearch.includes('ajuste de banner')) &&
                           !fullTextSearch.includes('site') && !fullTextSearch.includes('landing') && !fullTextSearch.includes('sistema') && !isVideoOrMotion;

    const isDesignGeneral = isSimpleDesign || ((fullTextSearch.includes('design') || fullTextSearch.includes('logo') || fullTextSearch.includes('logotipo') || fullTextSearch.includes('identidade visual') || fullTextSearch.includes('banner') || fullTextSearch.includes('flyer') || fullTextSearch.includes('arte') || fullTextSearch.includes('photoshop') || fullTextSearch.includes('illustrator') || fullTextSearch.includes('canva')) &&
                            !fullTextSearch.includes('site') && !fullTextSearch.includes('landing') && !fullTextSearch.includes('sistema') && !isVideoOrMotion);

    const isEcommerce = fullTextSearch.includes('loja') || fullTextSearch.includes('woocommerce') || fullTextSearch.includes('shopify') || fullTextSearch.includes('e-commerce') || fullTextSearch.includes('ecommerce');
    const isBigSystem = fullTextSearch.includes('sistema') || fullTextSearch.includes('saas') || fullTextSearch.includes('erp') || fullTextSearch.includes('crm') || fullTextSearch.includes('full stack') || fullTextSearch.includes('fullstack') || fullTextSearch.includes('banco de dados') || fullTextSearch.includes('aplicativo e site');
    const isLandingOrSite = (fullTextSearch.includes('landing page') || fullTextSearch.includes('landing') || fullTextSearch.includes('site') || fullTextSearch.includes('institucional') || fullTextSearch.includes('wordpress') || fullTextSearch.includes('elementor') || fullTextSearch.includes('página de vendas') || fullTextSearch.includes('pagina de vendas') || fullTextSearch.includes('página de captura') || fullTextSearch.includes('pagina de captura')) && !isVideoOrMotion;

    // Definição flexível de referência de precificação e prazo
    let precoReferenciaBase = 350;
    let prazoReferenciaBase = 4;

    if (valorMedioNum > 0) {
        // REGRA PRIMÁRIA: Se a plataforma tem valor médio dos concorrentes, baseie-se na média como sempre foi!
        if (isPrecoEmergencia) {
            precoReferenciaBase = Math.max(56, Math.round(valorMedioNum * 0.70));
        } else {
            precoReferenciaBase = Math.max(56, Math.round(valorMedioNum * 0.90));
        }

        if (duracaoMediaNum > 0) {
            if (isLandingOrSite && duracaoMediaNum <= 5) {
                prazoReferenciaBase = Math.max(1, duracaoMediaNum);
            } else if (isPrecoEmergencia) {
                prazoReferenciaBase = Math.max(1, Math.round(duracaoMediaNum * 0.50));
            } else {
                prazoReferenciaBase = Math.max(1, Math.round(duracaoMediaNum * 0.70));
            }
        }
    } else {
        // REGRA SECUNDÁRIA: Quando NÃO houver valor médio dos concorrentes, a IA avalia a demanda solicitada
        if (isSimpleDesign) {
            precoReferenciaBase = 70;
            prazoReferenciaBase = 1;
        } else if (isVideoOrMotion) {
            precoReferenciaBase = isPrecoEmergencia ? 220 : 350;
            prazoReferenciaBase = 3;
        } else if (isDesignGeneral) {
            precoReferenciaBase = isPrecoEmergencia ? 150 : 250;
            prazoReferenciaBase = 2;
        } else if (isBigSystem) {
            precoReferenciaBase = isPrecoEmergencia ? 1800 : 2800;
            prazoReferenciaBase = 12;
        } else if (isEcommerce) {
            precoReferenciaBase = isPrecoEmergencia ? 950 : 1400;
            prazoReferenciaBase = 10;
        } else if (isLandingOrSite) {
            precoReferenciaBase = isPrecoEmergencia ? 320 : 500;
            prazoReferenciaBase = 4;
        }
    }

    // Monta o prompt do sistema ultra-calibrado
    const systemPrompt = `Você é um Engenheiro de Software Sênior e Copywriter de Vendas de elite de Rafael Pita na plataforma 99Freelas.
Seu objetivo é gerar uma proposta comercial irresistível, personalizada, técnica e de altíssima conversão.

DIRETRIZES FUNDAMENTAIS DO FREELANCER (RAFAEL PITA):
- Formação: Técnico em Informática formado pelo CEFET-RJ.
- Metodologia de Engenharia: Utiliza IA avançada na programação para leitura rápida de documentações e aceleração de escrita de código limpo, sem abrir mão das boas práticas de engenharia de software.
- Compromisso Oficial: 30 dias de suporte pós-entrega e dedicação para nota máxima 5.0 estrelas.
- Modelo de Trabalho: 100% REMOTO (via chat da plataforma e chamadas de vídeo, sem trabalho ou reuniões presenciais).

${valorManualDefinido ? `🚨 VALOR FIXADO PELO FREELANCER (PRIORIDADE ABSOLUTA):
O freelancer determinou o valor exato de R$ ${valorManualDefinido},00.
Você DEVE utilizar exatamente esse valor ({b}R$ ${Number(valorManualDefinido).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}{/b}) no JSON ('valorFinal') e no corpo da proposta. NÃO calcule nem altere este valor!` : `🚨 REGRA DE PRECIFICAÇÃO FLEXÍVEL (MÉDIA DOS CONCORRENTES + DEMANDA SOLICITADA):
- REFERÊNCIA PRIMÁRIA: Se o projeto tiver 'Valor Médio dos Concorrentes' (${valorMedioNum > 0 ? `R$ ${valorMedioNum},00` : 'Desconhecido na página'}), você DEVE se basear prioritariamente nessa média dos concorrentes como sempre foi!
  * ${isPrecoEmergencia ? 'CONDIÇÃO DE PREÇO DE EMERGÊNCIA ATIVA (30% OFF): Aplique cerca de 30% de desconto sobre a média dos concorrentes (faixa em torno de 70% da média).' : 'CONDIÇÃO DE PREÇO PADRÃO / COMPETITIVO: Proponha um valor competitivo em torno da média dos concorrentes (geralmente entre 85% e 100% da média), ajustando conforme a demanda solicitada.'}
- SENSIBILIDADE À DEMANDA SOLICITADA: Analise criticamente o briefing do cliente!
  * Se a demanda solicitada for complexa, com muitos entregáveis, telas, integrações ou exigências especiais, ajuste o valor para cima em relação à base.
  * Se a demanda solicitada for enxuta, pontual ou rápida de fazer com suas ferramentas e IA, proponha um valor mais agressivo e competitivo para fechar rápido.
- QUANDO A MÉDIA FOR DESCONHECIDA (projeto novo sem lances de concorrentes): Estime o valor com base na demanda solicitada (referência base sugerida: R$ ${precoReferenciaBase},00 | prazo base: ${prazoReferenciaBase} dias), mantendo sempre coerência de mercado sem alucinar valores irreais.
- REGRA DE OURO DE PRAZO: Se for Landing Page ou Site Institucional e a duração média dos concorrentes já for curta (até 5 dias), MANTENHA exatamente a duração média (${duracaoMediaNum > 0 ? duracaoMediaNum : prazoReferenciaBase} dias).
- PISO LEGAL ABSOLUTO DA PLATAFORMA: R$ 56,00. NUNCA proponha menos de R$ 56,00 em nenhum caso.`}

${prazoManualDefinido ? `🚨 PRAZO FIXADO PELO FREELANCER (PRIORIDADE ABSOLUTA):
O freelancer determinou o prazo exato de ${prazoManualDefinido} dias.
Você DEVE utilizar exatamente esse prazo ({b}${prazoManualDefinido} dias{/b}) no JSON ('prazoDias') e no gancho da proposta!` : ''}

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

${modo === 'humanizado' ? `🚨 MODO HUMANIZADO CONVERSACIONAL (FOCO TOTAL EM AUTENTICIDADE E CALOR HUMANO):
Neste modo, esqueça estruturas burocráticas ou listas frias de escopo técnico com traços ou bullets. O objetivo é soar como uma pessoa real, atenciosa e acessível conversando diretamente com o cliente!
ESTRUTURA OBRIGATÓRIA DO MODO HUMANIZADO:
1. Saudação: "${greeting}"
2. Apresentação Pessoal:
   ${isVideoOrMotion
       ? '- Diga com naturalidade e segurança: "Eu sou Rafael Pita, trabalho com criação audiovisual, edição de vídeo e animações com inteligência artificial há muitos anos e tenho diversos projetos reais entregues no meu portfólio."'
       : isDesignGeneral
           ? '- Diga com naturalidade e simpatia: "Eu sou Rafael Pita, trabalho com design gráfico, criação visual e branding há muitos anos e tenho diversos projetos reais entregues no meu portfólio."'
           : '- Diga com naturalidade e autoridade: "Eu sou Rafael Pita, sou técnico em informática voltado para programação e desenvolvimento de sistemas. Já atuo nessa área há muitos anos e tenho diversos projetos reais entregues no meu portfólio."'}
3. Conexão com o Projeto e Portfólio:
   - Diga que acredita muito que pode ajudar nessa demanda (cite brevemente o cerne do pedido do cliente com simpatia e clareza, em 1 ou 2 frases curtas).
   - Indique o portfólio com humildade e autoridade: "Caso queira conferir alguns dos meus trabalhos anteriores, o link está aqui: ${portfolioUrl}"
4. Abertura para Conversar e Estimativa Prévia:
   - "Se tiver interesse, estou super à disposição para conversarmos mais sobre os detalhes do projeto no chat ou em uma chamada rápida."
   - Apresente a estimativa prévia de forma fluida e direta: "Segue uma estimativa prévia de investimento de {b}R$ X,00{/b}, para ser entregue com calma e dedicação em cerca de {b}Y dias{/b}." (Onde X é o mesmo 'valorFinal' e Y é o mesmo 'prazoDias' que você definiu para o projeto).
   - Se houver média de concorrência, o valor deve se basear nela como sempre foi, ${isPrecoEmergencia ? 'aplicando a condição especial de preço de emergência (cerca de 30% de desconto sobre a média)' : 'ajustando conforme a complexidade da demanda solicitada no briefing'}.
5. Gatilho de Confiança:
> Minha meta é obter 5 estrelas, então você tem meu total comprometimento.
6. Fechamento Acolhedor:
   - Diga que está à disposição para começar o quanto antes/o mais breve possível caso aceite a proposta, e convide com simpatia para trocar uma ideia no chat.` : `ESTRUTURA DA PROPOSTA (140 a 200 palavras, One-Page Style, separado por \\n\\n):
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
Bloco 8: CTA Consultivo com chamada remota (se aplicável) e "${closureTiming}".`}

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

    // Prioridade máxima: valor e prazo manuais definidos pelo freelancer (campo nativo ou anotações extras)
    let finalValue = valorManualDefinido || String(rawResult.valorFinal || '').replace(/\D/g, '');
    let finalDeadline = prazoManualDefinido || String(rawResult.prazoDias || '').replace(/\D/g, '');

    const isManualValor = Boolean(valorManualDefinido);
    const valorNumerico = Number(finalValue || 0);

    // Se NÃO for valor manual do freelancer, valida sem engessar a IA:
    if (!isManualValor) {
        // 1. Piso legal obrigatório do 99Freelas: R$ 56,00
        if (valorNumerico < 56) {
            finalValue = isSimpleDesign ? '60' : '56';
        }

        // 2. Proteção contra anomalia de concatenação residual (ex: 5556):
        if (finalValue.includes('5556')) {
            console.warn('[proposalAiService] Anomalia 5556 detectada. Ajustando para o valor de referência base:', precoReferenciaBase);
            finalValue = String(precoReferenciaBase);
        }

        // 3. Se for micro-design simples (1 vetorização / 1 banner):
        if (isSimpleDesign && valorNumerico > 150) {
            finalValue = '70';
        }

        // 4. Se a média for desconhecida e não for sistema grande ou e-commerce:
        if (valorMedioNum === 0 && !isBigSystem && !isEcommerce && valorNumerico > 1200) {
            console.warn(`[proposalAiService] Valor gerado (R$ ${valorNumerico}) sem média de concorrentes. Ajustando para referência base: ${precoReferenciaBase}`);
            finalValue = String(precoReferenciaBase);
        }
    }

    // Piso mínimo legal do 99Freelas: R$ 56,00
    if (!finalValue || Number(finalValue) < 56) {
        finalValue = isSimpleDesign ? '60' : '56';
    }

    if (!finalDeadline || Number(finalDeadline) <= 0) {
        finalDeadline = duracaoMediaNum > 0 ? String(duracaoMediaNum) : String(prazoReferenciaBase);
    }

    // Sanitiza o texto gerado e garante que o valorFinal e o prazoDias batam 100% com o texto
    let sanitizedText = sanitizeProposalText(rawResult.textoDetalhes, {
        categoria,
        titulo,
        descricao,
        finalValue,
        finalDeadline
    });

    // RECONCILIAÇÃO OBRIGATÓRIA DE VALOR E PRAZO NO TEXTO (BLINDAGEM CONTRA ALUCINAÇÃO DA IA):
    // Garante que o valor exibido na descrição seja rigorosamente idêntico ao finalValue preenchido no campo
    const valorFormatadoPtBr = Number(finalValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    
    // Substitui qualquer valor dentro de tags {b}R$ ...{/b} na estimativa ou proposta pelo valor real
    sanitizedText = sanitizedText.replace(/\{b\}R\$\s*[\d.,]+\{\/b\}/gi, `{b}R$ ${valorFormatadoPtBr}{/b}`);

    // Expurgador explícito de anomalias residuais como R$ 5.556,00 ou R$ 5556
    sanitizedText = sanitizedText.replace(/(?:R\$\s*)?5\.?556(?:,00)?/gi, `R$ ${valorFormatadoPtBr}`);

    // Se houver menção solta de prazo em dias diferente do prazoFinal no gancho ou fechamento:
    sanitizedText = sanitizedText.replace(/\{b\}\d+\s*dias?\{\/b\}/gi, `{b}${finalDeadline} dias{/b}`);

    return {
        sucesso: true,
        valorFinal: finalValue,
        prazoDias: finalDeadline,
        textoDetalhes: sanitizedText
    };
}
