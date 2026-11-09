/**
 * Pipeline Integrado de Prospecção de Nutricionistas via Google Maps Scraper Kit
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Executa scraping em tempo real no Google Maps de profissionais sem website,
 * gera automaticamente o link demonstrativo da landing page no portfólio
 * e formata a mensagem persuasiva de WhatsApp pronta para envio.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configurações padrão
const SCRAPER_KIT_DIR = path.resolve(__dirname, 'google-maps-scraper-kit');
const SCRAPE_SCRIPT = path.join(SCRAPER_KIT_DIR, 'scripts', 'scrape.py');
const OUTPUT_DIR = path.resolve(__dirname, 'output');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Limpa o título do Google Maps para extrair um nome profissional humanizado
 * Ex: "Nutricionista Thiara Amorim" -> "Dra. Thiara Amorim"
 * Ex: "Nutricionista Clínica Funcional - Katherine Raffaele" -> "Dra. Katherine Raffaele"
 * Ex: "Flavia Ramos - Nutricionista Barra da Tijuca" -> "Dra. Flavia Ramos"
 * @param {string} rawTitle - Título bruto vindo do Google Maps
 * @returns {string} Nome formatado com pronome de tratamento
 */
function cleanProfessionalName(rawTitle) {
    if (!rawTitle) return 'Nutricionista';

    let name = rawTitle;
    
    // Lista de palavras que caracterizam descrição e não nome próprio
    const isDescriptive = (str) => /\b(Nutricionista|Nutrição|Clínica|Consultório|Espaço|Saúde|Integrada|Funcional|Materno|Infantil|Esportiva|Barra|Tijuca|Ipanema|Copacabana|Leblon|Botafogo|São Paulo|Rio de Janeiro)\b/i.test(str);

    // Se tiver traço ou separador
    if (name.includes('-') || name.includes('—') || name.includes('|')) {
        const separator = name.includes('-') ? '-' : (name.includes('—') ? '—' : '|');
        const parts = name.split(separator).map(p => p.trim());
        
        // Se a primeira parte parecer nome próprio e a segunda descritiva (ex: "Flavia Ramos - Nutricionista...")
        if (!isDescriptive(parts[0]) && isDescriptive(parts[1])) {
            name = parts[0];
        } else if (isDescriptive(parts[0]) && parts.length > 1) {
            // Caso contrário, pega a parte que não é descritiva
            name = parts[1];
        } else {
            name = parts[0];
        }
    }

    // Remove termos redundantes residuais
    name = name.replace(/\b(Nutricionista|Nutrição|Clínica|Consultório|Espaço|Saúde|Integrada|Funcional|Materno|Infantil|Esportiva)\b/gi, '').trim();
    
    // Remove pontuação residual
    name = name.replace(/^[,\s.-]+|[,\s.-]+$/g, '').trim();

    if (!name) return 'Nutricionista';

    // Se for nome masculino conhecido (ex: Lucas, Rafael, Rodrigo, Carlos, Marcelo)
    const isMale = /^(Lucas|Rafael|Rodrigo|Carlos|Marcelo|Dr\.\s*Lucas|Dr\.\s*Rafael)/i.test(name);
    const prefix = isMale ? 'Dr.' : 'Dra.';

    // Prefixa com Dra./Dr. se ainda não tiver
    if (!name.toLowerCase().startsWith('dra.') && !name.toLowerCase().startsWith('dr.')) {
        name = `${prefix} ${name}`;
    }

    return name;
}

/**
 * Sanitiza o telefone para o formato padrão do WhatsApp (55 + DDD + número)
 * @param {string} phone - Telefone em formato livre (ex: "(21) 99891-3342")
 * @returns {string} Telefone limpo somente dígitos
 */
function cleanWhatsappNumber(phone) {
    if (!phone) return '';
    let digits = phone.replace(/\D/g, '');
    if (digits.length === 10 || digits.length === 11) {
        digits = `55${digits}`;
    }
    return digits;
}

/**
 * Extrai o bairro a partir do endereço completo retornado pelo Google Maps
 * @param {string} address - Endereço completo
 * @param {string} defaultNeighborhood - Fallback caso não identifique
 * @returns {string} Bairro identificado
 */
function extractNeighborhood(address, defaultNeighborhood = 'Centro') {
    if (!address) return defaultNeighborhood;

    // Procura padrão ", Cidade - RJ" ou ", Cidade - SP" e pega o segmento imediatamente anterior
    const cityMatch = address.match(/-\s*([^,-]+),\s*([^,-]+)\s*-\s*[A-Z]{2}/i);
    if (cityMatch && cityMatch[1]) {
        const candidate = cityMatch[1].trim();
        // Se não for complemento de sala/bloco
        if (!/^(bl|bloco|sala|sl|andar|apto|cj|conjunto)/i.test(candidate)) {
            return candidate;
        }
    }

    // Se o próprio nome do bairro constar no endereço
    const knownNeighborhoods = ['Ipanema', 'Leblon', 'Copacabana', 'Barra da Tijuca', 'Botafogo', 'Flamengo', 'Tijuca', 'Moema', 'Jardins', 'Pinheiros', 'Itaim Bibi', 'Vila Olímpia'];
    for (const b of knownNeighborhoods) {
        if (address.toLowerCase().includes(b.toLowerCase())) {
            return b;
        }
    }

    return defaultNeighborhood;
}

/**
 * Executa o fluxo completo de busca e enriquecimento de leads de nutrição
 * @param {object} options - Parâmetros da busca
 * @param {string} options.query - Termo de busca (ex: "nutricionista")
 * @param {string} options.city - Cidade/Bairro (ex: "Ipanema, Rio de Janeiro")
 * @param {number} [options.depth=1] - Profundidade de busca (1 ~20 resultados)
 * @param {string} [options.baseUrl='https://meuportfolio.rafaelpita.com'] - Domínio base para links
 */
function runProspectPipeline({
    query = 'nutricionista',
    city = 'Ipanema, Rio de Janeiro',
    depth = 1,
    baseUrl = 'http://localhost:3001'
}) {
    console.log(`\n========================================================`);
    console.log(`🚀 INICIANDO RADAR DE PROSPECÇÃO: ${query.toUpperCase()}`);
    console.log(`📍 Região Alvo: ${city}`);
    console.log(`========================================================\n`);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeCitySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const rawOutputFile = path.join(OUTPUT_DIR, `raw_${safeCitySlug}_${timestamp}.json`);
    const enrichedOutputFile = path.join(OUTPUT_DIR, `leads_prontos_${safeCitySlug}_${timestamp}.json`);
    const markdownReportFile = path.join(OUTPUT_DIR, `relatorio_prospeccao_${safeCitySlug}.md`);

    // 1. Executa o Scraper nativo do Google Maps Scraper Kit
    const scrapeCmd = `python "${SCRAPE_SCRIPT}" "${query}" --city "${city}" --lang pt --country br --has-phone --no-website --depth ${depth} --out "${rawOutputFile}" --json`;
    
    console.log(`Executando scraper no Google Maps...`);
    try {
        execSync(scrapeCmd, { stdio: 'inherit', cwd: SCRAPER_KIT_DIR });
    } catch (err) {
        console.error(`❌ Erro ao executar o scraper:`, err.message);
        return;
    }

    if (!fs.existsSync(rawOutputFile)) {
        console.error(`❌ O arquivo de saída bruto não foi gerado: ${rawOutputFile}`);
        return;
    }

    // 2. Lê e enriquece os dados dos profissionais
    const rawData = JSON.parse(fs.readFileSync(rawOutputFile, 'utf-8'));
    console.log(`\n📊 Processando ${rawData.length} leads qualificados sem website...`);

    const enrichedLeads = rawData.map((place, idx) => {
        const cleanName = cleanProfessionalName(place.title);
        const cleanPhone = cleanWhatsappNumber(place.phone);
        const neighborhood = extractNeighborhood(place.address, city.split(',')[0].trim());
        const rating = parseFloat(place.review_rating) || 5.0;
        const reviewCount = parseInt(place.review_count, 10) || 10;

        // Gera a URL da Landing Page Demonstrativa (Modelo Clínico)
        const clinicDemoParams = new URLSearchParams({
            nome: cleanName,
            whatsapp: cleanPhone,
            cidade: city.split(',')[1]?.trim() || 'Rio de Janeiro',
            bairro: neighborhood,
            endereco: place.address.split('-')[0]?.trim() || place.address
        });
        const demoUrlClinico = `${baseUrl}/nutricionista?${clinicDemoParams.toString()}`;
        const demoUrlNutrivida = `${baseUrl}/nutrivida?${clinicDemoParams.toString()}`;

        // Mensagem de Abordagem Altamente Conectiva para WhatsApp
        const pitchMessage = `Olá, ${cleanName}! Tudo bem? Espero que sim! 👋\n\n` +
            `Estava pesquisando nutricionistas de destaque em ${neighborhood} e notei que seu consultório tem uma excelente reputação no Google (${rating} estrelas com ${reviewCount} avaliações reais de pacientes), mas vocês ainda não possuem um site próprio indexado.\n\n` +
            `Como trabalho criando páginas modernas de alta conversão para a área de saúde, tomei a liberdade de montar uma demonstração interativa exclusiva com o seu nome e consultório para você ver como ficaria:\n` +
            `👉 ${demoUrlClinico}\n\n` +
            `O projeto já conta com agendamento direto no seu WhatsApp, suporte a teleconsulta e SEO para o Google. O que achou dessa prévia?`;

        const directWhatsappPitchUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(pitchMessage)}`;

        return {
            id: idx + 1,
            nomeOriginal: place.title,
            nomeTratado: cleanName,
            telefoneOriginal: place.phone,
            whatsappNumerico: cleanPhone,
            enderecoCompleto: place.address,
            bairro: neighborhood,
            notaGoogle: rating,
            avaliacoesGoogle: reviewCount,
            possuiSite: false,
            linkDemoClinico: demoUrlClinico,
            linkDemoNutrivida: demoUrlNutrivida,
            mensagemAbordagem: pitchMessage,
            linkDisparoWhatsapp: directWhatsappPitchUrl
        };
    });

    // 3. Salva JSON estruturado final
    fs.writeFileSync(enrichedOutputFile, JSON.stringify(enrichedLeads, null, 2), 'utf-8');

    // 4. Gera Relatório Executivo em Markdown
    let md = `# Relatório de Prospecção Ativa : Nutricionistas\n\n`;
    md += `* **Região:** ${city}\n`;
    md += `* **Critério:** Profissionais com WhatsApp e SEM WEBSITE próprio no Google Maps\n`;
    md += `* **Total Encontrado:** ${enrichedLeads.length} leads qualificados\n`;
    md += `* **Data da Varredura:** ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    md += `---\n\n`;

    enrichedLeads.forEach((lead) => {
        md += `### ${lead.id}. ${lead.nomeTratado}\n`;
        md += `- **Nome no Google:** ${lead.nomeOriginal}\n`;
        md += `- **WhatsApp:** \`${lead.telefoneOriginal}\` (${lead.whatsappNumerico})\n`;
        md += `- **Avaliação Google:** ⭐ **${lead.notaGoogle}** (${lead.avaliacoesGoogle} avaliações)\n`;
        md += `- **Localização:** ${lead.bairro} (${lead.enderecoCompleto})\n`;
        md += `- **Página Demonstrativa (Clínico):** [Ver Demonstração Ao Vivo](${lead.linkDemoClinico})\n`;
        md += `- **Página Demonstrativa (NutriVida):** [Ver Demonstração NutriVida](${lead.linkDemoNutrivida})\n`;
        md += `- **Ação Rápida:** [📲 Abrir WhatsApp com Pitch Pré-preenchido](${lead.linkDisparoWhatsapp})\n\n`;
        md += `> **Mensagem do Pitch:**\n`;
        md += `> \n`;
        lead.mensagemAbordagem.split('\n').forEach(line => {
            md += `> ${line}\n`;
        });
        md += `\n---\n\n`;
    });

    fs.writeFileSync(markdownReportFile, md, 'utf-8');

    console.log(`\n✅ PIPELINE CONCLUÍDO COM SUCESSO!`);
    console.log(`📁 JSON Enriquecido: ${enrichedOutputFile}`);
    console.log(`📝 Relatório Markdown: ${markdownReportFile}`);
    console.log(`\n🎯 Exemplo do 1º Lead Qualificado:`);
    if (enrichedLeads[0]) {
        console.log(`   - Profissional: ${enrichedLeads[0].nomeTratado}`);
        console.log(`   - WhatsApp: ${enrichedLeads[0].telefoneOriginal}`);
        console.log(`   - Nota: ${enrichedLeads[0].notaGoogle} (${enrichedLeads[0].avaliacoesGoogle} avaliações)`);
        console.log(`   - Demo: ${enrichedLeads[0].linkDemoClinico}`);
    }
    console.log(`========================================================\n`);
}

// Execução direta via CLI: node tools/scrapers/prospect_pipeline.cjs "nutricionista" "Barra da Tijuca, Rio de Janeiro"
const args = process.argv.slice(2);
const queryArg = args[0] || 'nutricionista';
const cityArg = args[1] || 'Ipanema, Rio de Janeiro';

runProspectPipeline({
    query: queryArg,
    city: cityArg,
    depth: 1,
    baseUrl: 'http://localhost:3001'
});
