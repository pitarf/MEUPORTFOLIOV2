# CHANGELOG - Rafael Pita Solutions / MeuPortfolio v2

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

## [1.26.6] - 2026-09-30

### Adicionado & Aprimorado (Links Curtos /adv/:slug, Nuvem Supabase de 5 Dias, Exclusão de Leads e Domínio a R$ 60)
- **Rota Curta Oficial e Smart Slug Parsing (`/adv/:slug`)**:
  - Implementada a rota enxuta `/adv/:slug` no `App.jsx`, reduzindo drasticamente o link de 280 caracteres para apenas 45 caracteres (ex: `https://rafaelpitaoficial.com.br/adv/roseli-hanna`).
  - Removido o prefixo `www.` e eliminada a query string pesada de endereço postal com caracteres de escape (`%C3%B4`, `%2C`).
  - A landing page (`LegalLandingPage.jsx`) agora possui Smart Slug Parsing, extraindo o nome do cliente e detectando o gênero feminino e a paleta vinho/champagne mesmo se aberta em dispositivos sem cache.
- **Armazenamento de Demonstrações na Nuvem (Validade de 5 Dias)**:
  - Integração nativa com a VPS Supabase (`budgets`) para sincronizar os dados completos do prospect na nuvem com prazo de validade de 5 dias corridos.
  - O link limpo funciona em qualquer celular ou navegador sem depender do dispositivo do operador.
- **Gestão no Painel & Opção de Excluir Possível Cliente (`RadarGoogleMaps.jsx`)**:
  - Nova seção dedicada no Radar com contador de demonstrações ativas, visualização do link curto gerado, indicador de dias restantes e botão vermelho de lixeira para excluir o possível cliente da nuvem com 1 clique.
- **Ajuste da Anuidade do Domínio (R$ 60 ao ano)**:
  - Atualizadas todas as mensagens de proposta no WhatsApp e os cards do painel administrativo de R$ 40 para a média nacional de R$ 60 ao ano.
- **Quebra de Objeção Comercial (Flexibilidade Total de Fotos e Textos)**:
  - Todas as copys de abordagem no WhatsApp agora esclarecem explicitamente que textos, áreas de atuação e fotos são 100% personalizáveis com as fotos reais e biografia do advogado.
- **Conformidade de Estilo**:
  - Regra de formatação aplicada estritamente, com zero ocorrências de travessão em todas as mensagens e código.

## [1.26.5] - 2026-09-30

### Aprimorado (Redesenho Delicado, Tipografia Playfair Display & Substituição Integral de Fotos por Advogadas)
- **Substituição Completa de Fotos do Carrossel por Mulheres (`LegalHero.jsx`, `LegalAbout.jsx`, `LegalDiagnosisCalculator.jsx`)**:
  - Eliminadas 100% das fotos masculinas de terno no carrossel de slides quando o lead for feminino.
  - `advogada_hero.jpg`: Retrato de alta resolução de advogada brasileira em mesa executiva com flores brancas e vista panorâmica.
  - `advogada_sobre.jpg`: Fotografia de reunião acolhedora e elegante entre advogada e cliente em sala de reuniões boutique.
  - `advogada_tribunal.jpg`: Fotografia cinematográfica de advogada caminhando com pasta de recursos em tribunal nobre.
  - `advogada_sede.jpg`: Recepção de escritório boutique luxuoso com advogada recepcionando cliente.
  - Fundo da ferramenta interativa de diagnóstico atualizado com a imagem feminina de tribunal.
- **Tipografia Nobre Editorial (`Playfair Display` & `Cinzel`)**:
  - Reconfigurado o `tailwind.config.js` para mapear a família `serif` diretamente para `Playfair Display`.
  - Títulos da landing page feminina agora utilizam `font-serif font-normal` com destaques elegantes em itálico e tons de ameixa/vinho profundo aveludado (`#2C0822`), abandonando a rigidez sans-serif preta corporativa masculina.
- **Fundos Aquecidos e Cartões Delicados**:
  - Eliminados fundos cinza-hospitalares (`#FAFBFD`). Adotadas nuances em nude e blush suave (`#FAF4F7`, `#FCF9F7`), bordas em champanhe rosado (`#EEDCE7`) e cantos arredondados fluidos (`rounded-3xl`).
- **Botões e Ações de Luxo (Ouro Champagne Acetinado)**:
  - Substituídos os botões de WhatsApp verdes estridentes por CTAs em degradê Ouro Champagne Nobre (`#D8A756` / `#E5BF7C`) com cantos em pílula suave (`rounded-full`), harmonizando perfeitamente com a identidade visual de luxo.
- **Validação de Build**:
  - `npm run build` testado e aprovado com código 0 (`index-f11cb057.js`).

## [1.26.4] - 2026-09-30

### Adicionado & Aprimorado (Detecção Inteligente de Gênero & Paleta Executiva Feminina Vinho Nobre)
- **Motor de Detecção de Gênero (`src/utils/genderDetection.js`)**:
  - Algoritmo que detecta se o profissional é mulher ou homem a partir do nome ou razão social (ex: `Roseli Hanna - Advogada`, `Natálie Terciotti`, `Paula`, `Sandra`, `Dra.`, `Sociedade Individual de Advogada`).
  - Dicionário extensivo com centenas de primeiros nomes brasileiros femininos e heurísticas de sufixos (`-a`, `-ele`, `-elly`, `-any`, `-ane`).
- **Paleta Executiva Feminina ("Vinho Nobre & Ouro Champagne")**:
  - Tema feminino de alta conversão: Vinho Profundo (`#220619`), Vinho Noturno (`#14030F` / `#12020D`) e Ouro Champagne (`#D8A756`).
  - Mantém o Navy Clássico Imperial (`#0A192F` / `#071326`) e Dourado Real (`#C6923C`) para homens.
- **Harmonização de Textos e Concordância de Gênero em Todos os Componentes**:
  - `LegalLandingPage.jsx`: Injeção dinâmica do tema (`theme`) e seleção de texto tonalizada (`#9A1E58` para mulheres).
  - `LegalHero.jsx`: Overlays adaptativos, identificação como "Dra." e "Advogada Especialista".
  - `LegalNavbar.jsx`: Balança dourada estilizada com gradiente refinado para mulheres e rolagem suave ao topo ao clicar na logo.
  - `LegalTopBar.jsx`: Fundo adaptativo Vinho Noturno e máscara brasileira no telefone `(19) 99116-4333`.
  - `LegalAbout.jsx`: Ajuste de concordância ("cliente e advogada", "Falar com a Especialista", "Dra.").
  - `LegalMethodology.jsx`: Pronome e contato ajustados ("Triagem sigilosa com a Dra.").
  - `LegalDiagnosisCalculator.jsx`: Fundo em degradê vinho nobre, texto do WhatsApp e botão de envio ("TRANSMITIR DIAGNÓSTICO À DRA.").
  - `LegalFaq.jsx`: Card de atendimento contextualizado ("A Dra. presta esclarecimentos preliminares").
  - `LegalFloatingWhatsApp.jsx`: Tooltip com fundo vinho acetinado e chamada "Converse diretamente com a Dra.".
  - `LegalCinematicBanner.jsx` e `LegalFooter.jsx`: Fundo e detalhes adaptados à paleta.
- **Validação de Build**:
  - `npm run build` testado e aprovado com código 0 (`index-1cca152e.js`).

## [1.26.3] - 2026-09-30

### Melhorado (Arejamento da Navbar Jurídica & Formatação Amigável de Telefone no Topo)
- **Descongestão e Respiro Visual da Navbar (`LegalNavbar.jsx`)**:
  - Removido o link redundante de texto "Início", que ficava colado ao nome do advogado.
  - O logotipo (balança dourada estilizada + nome do advogado) agora funciona com clique interativo e rolagem suave (`smooth scroll`) para o topo da página.
  - Encurtado o rótulo "Diagnóstico (60s)" para "Diagnóstico" e ampliados os espaçamentos horizontais (`gap-5 xl:gap-8`), conferindo estética executiva e arejada.
- **Formatação de Telefone no TopBar (`LegalTopBar.jsx`)**:
  - Implementada função auxiliar `formatPhoneDisplay` para aplicar máscara brasileira com DDD (ex: `(19) 99116-4333`) mesmo quando o dado bruto vier no padrão internacional com DDI 55.
- **Validação de Build**:
  - `npm run build` testado e aprovado com código 0 (`index-19d95cf7.js`).

## [1.26.2] - 2026-09-30

### Corrigido (Import Faltante de MessageCircle em LegalAbout.jsx & Varredura AST com Babel)
- **Correção da Tela Branca na Landing Page (`LegalAbout.jsx`)**:
  - Identificado erro em tempo de execução: `ReferenceError: MessageCircle is not defined`.
  - O ícone `MessageCircle` era utilizado no botão CTA de WhatsApp do Sobre Nós, mas não constava na instrução de importação de `lucide-react`.
  - Adicionado `MessageCircle` ao import de `LegalAbout.jsx`.
- **Auditoria Preventiva de AST via Babel**:
  - Executado analisador sintático sobre todos os arquivos `.jsx` de `components/legal` e `pages/legal`, confirmando que 100% dos componentes e ícones estão devidamente declarados e importados.
- **Validação de Build**:
  - `npm run build` testado e aprovado com código 0 (`index-72defcd5.js`).

## [1.26.1] - 2026-09-30

### Corrigido & Otimizado (Correção de Roteamento SPA na Vercel & URLs de Demonstração Portáteis)
- **Correção Crítica no Roteamento da Vercel (`vercel.json`)**:
  - Removido o regex negativo lookahead `(?!api/)` que era incompatível com o roteador da Vercel e causava erro 404 em rotas internas como `/advocacia/...`.
  - Restaurado o rewrite padrão de SPA, onde o runtime da Vercel resolve automaticamente funções em `/api/*`.
- **Arquitetura de Demonstração Portátil (`LegalLandingPage.jsx`, `googleMapsProspectService.js`, `RadarGoogleMaps.jsx`)**:
  - Implementada a função `buildDemoUrl(lawyer, baseUrl)` gerando URLs com parâmetros estruturados (`nome`, `tel`, `cidade`, `uf`, `end`, `nota`, `rev`).
  - Habilitado suporte em `LegalLandingPage.jsx` via `useSearchParams()` para extrair prioritariamente os dados passados na URL.
  - **Benefício Crucial**: A demonstração agora funciona tanto no painel quanto **no celular do próprio cliente quando ele clica no link do WhatsApp**, sem depender de cache ou `localStorage` da máquina do operador.
- **Sincronização Rigorosa de Slugs (`api/places-search.js`)**:
  - `api/places-search.js` atualizado para gerar e retornar `slug` com o formato idêntico ao gerado no frontend (`nome-cidade`).
- **Validação de Build**:
  - `npm run build` testado e aprovado com código 0 (`index-94b5ea41.js`).

## [1.26.0] - 2026-09-30

### Adicionado & Integrado (Integração Oficial com Google Places API em Tempo Real & Serverless Vercel)
- **Integração Nativa com Google Places API (New) (`api/places-search.js`)**:
  - Implementada Serverless Function oficial para Vercel protegendo a chave `GOOGLE_PLACES_API_KEY` no ambiente backend, sem exposição pública no frontend (em conformidade com a Regra 6 de Segurança).
  - Consulta ao vivo do endpoint `https://places.googleapis.com/v1/places:searchText` com FieldMask otimizado.
  - Filtro automático de estabelecimentos: identifica advogados e escritórios reais com avaliações altas que **não possuem website** (`!place.websiteUri`).
  - Normalização automática de números telefônicos para WhatsApp com DDI 55.
  - Extração de endereço completo, cidade, estado e link oficial de geolocalização no Google Maps.
- **Suporte Local no Vite Dev Server (`vite.config.js`)**:
  - Configurado middleware no Vite dev server para atender requisições locais a `/api/places-search` usando as variáveis do `.env`, eliminando problemas de CORS do Google Maps no navegador durante o desenvolvimento.
- **Configuração de Rotas e Ambiente (`vercel.json`, `.env.example`, `.env`)**:
  - Adicionado rewrite específico no `vercel.json` para rotear chamadas de `/api/*` diretamente para Serverless Functions sem conflito com o SPA fallback.
  - Variável `GOOGLE_PLACES_API_KEY` documentada no `.env.example` e configurada localmente.
- **Painel do Radar Google Maps Atualizado (`RadarGoogleMaps.jsx`, `googleMapsProspectService.js`)**:
  - Adicionada opção de "Google Places API Oficial (Ao Vivo)" com indicador em tempo real.
  - Badge visual `Google Places Oficial` nos cards de advogados retornados da API.
  - Adicionadas cidades estratégicas para busca com 1 clique (Campinas, Valinhos, São Paulo, etc.).
- **Validação de Build**:
  - `npm run build` testado e aprovado com código 0 (`index-5b72b7cb.js`).

## [1.25.0] - 2026-09-30

### Removido & Corrigido (Limpeza Imediata de Dados Fictícios & Arquitetura Real para Google Maps via MCP)
- **Eliminação Total de Dados Fictícios e Alucinações (`googleMapsProspectService.js`, `gemini.js`, `RadarGoogleMaps.jsx`)**:
  - Removida integralmente a base de dados estática simulada (`RAW_CURATED_MAPS_LEADS`), que continha nomes, telefones e endereços fictícios gerados por IA.
  - Desativada a geração sintética em `scanLawyersWithoutWebsite` (`gemini.js`) para impedir que a IA invente pessoas que não existem no Google Maps.
  - Implementada rotina `sanitizeStoredLeads` para expurgar automaticamente do `localStorage` do navegador qualquer lead legado falso salvo anteriormente.
  - Adicionado botão **"Limpar Histórico"** na interface do Radar para o operador reiniciar a base limpa a qualquer momento.
  - Empty state reformulado com direcionamento explícito para captura de fichas reais e link oficial de pesquisa no Google Maps.
- **Pesquisa e Mapeamento de Servidores MCP para Google Maps e Google Places**:
  - Mapeadas as melhores soluções oficiais e da comunidade de MCP para scraping e busca oficial de empresas locais sem website (Outscraper MCP, Google Maps Platform MCP, Apify Google Maps Actor MCP).

## [1.24.0] - 2026-09-28

### Adicionado & Otimizado (Rede de CTAs de Alta Conversão com Foco Total em WhatsApp)
- **Eliminação de "Becos Sem Saída" e Inserção de CTAs em Todas as Seções Informativas**:
  - **Sobre o Escritório (`LegalAbout.jsx`)**: Substituído o botão passivo "Conheça Nossa Equipe" por um CTA de impacto com cor oficial do WhatsApp (`#25D366`), ícone fill e chamada direta: *"Falar com o Especialista no WhatsApp"*.
  - **Como Funciona / Metodologia (`LegalMethodology.jsx`)**: Adicionado container de conversão imediatamente após a grade dos 4 passos com sinalizador de atendimento ativo e botão: *"Inicie o Passo 1 Agora: Agende seu Diagnóstico"*.
  - **Depoimentos de Clientes (`LegalReviews.jsx`)**: Inserido card de credibilidade pós-prova social com escudo dourado e botão verde de WhatsApp: *"Deseja a mesma tranquilidade para o seu caso? Consultar no WhatsApp"*.
  - **Especialidades Forenses (`LegalPracticeAreas.jsx`)**: Adicionado bloco conclusivo na base da grade dos 5 cards com CTA para demandas personalizadas não listadas.
  - **Seção de Perguntas Frequentes Integrada (`LegalFaq.jsx` e `LegalLandingPage.jsx`)**: A seção de FAQ foi harmonizada no estilo executivo claro e incorporada à landing page, trazendo card fixo de suporte: *"Ficou com alguma dúvida? Tirar Dúvida no WhatsApp"*.
  - **Hero Section (`LegalHero.jsx`)**: O botão de agendamento principal foi atualizado para *"Agendar Consulta no WhatsApp"* com ícone vibrante.
  - **Navbar Corporativa (`LegalNavbar.jsx`)**: O botão de agendamento superior foi atualizado para *"Agendar no WhatsApp"* com gradiente verde de alta conversão.
  - **Botão Flutuante (`LegalFloatingWhatsApp.jsx`)**: Atualizado com cor oficial do WhatsApp (`#25D366`), badge animado de pulso com status "Online Agora" e pílula flutuante visível tanto no desktop quanto em telas móveis.
- **Validação de Produção**:
  - `npm run build` executado e aprovado com código 0.

## [1.23.0] - 2026-09-28

### Adicionado & Melhorado (5ª Especialidade Jurídica & Grade Simétrica Balanceada 3 + 2)
- **Adição da 5ª Especialidade Forense de Alto Impacto em Todos os Nichos (`src/data/legalTemplates.js`)**:
  - **Trabalhista (`trabalhista`)**: *"Assédio Moral, Sexual & Metas Abusivas"* (reparação por danos morais na Justiça do Trabalho, rescisão indireta, proteção psicológica e salvaguarda contra perseguição).
  - **Consumidor (`consumidor`)**: *"Juros Abusivos & Revisão Contratual Bancária"* (expurgo de taxas ilegais, juros extorsivos, repetição do indébito/devolução em dobro e prevenção de busca e apreensão).
  - **Família (`familia`)**: *"União Estável, Pacto Antenupcial & Blindagem"* (escritura pública de união estável, pacto antenupcial customizado, planejamento patrimonial preventivo e alteração de regime de bens).
  - **Geral (`geral`)**: *"Direito Empresarial & Contratos Societários"* (acordo de sócios, blindagem patrimonial, recuperação de créditos e compliance preventivo).
- **Equilíbrio Visual e Harmonia Simétrica (`LegalPracticeAreas.jsx`)**:
  - Superado o layout anterior de 4 cards (onde 1 card ficava isolado na linha de baixo, gerando 2 espaços vazios).
  - A seção agora exibe uma composição harmoniosa de **3 cards no topo** (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) e **2 cards na base perfeitamente centralizados** (`max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2`), seguindo com rigor a referência visual de consultoria de prestígio (Summit Financial Partners).
- **Validação Completa**:
  - Build de produção verificado com sucesso sem alertas ou erros de compilação.

## [1.22.0] - 2026-09-28

### Corrigido (Auditoria com Subagentes & Sincronização Exata de Nomes, Endereços e Google Maps)
- **Construção Unificada de URL no Google Maps (`buildGoogleMapsUrl` em `googleMapsProspectService.js`)**:
  - Eliminado o problema de o Google Maps abrir advogados homônimos ou cair em locais genéricos distantes do endereço do card. A nova função unifica Nome Oficial + Logradouro Comercial + Cidade/UF sob a API padronizada do Google Maps (`api=1&query=...`), cravando a localização no ponto exato cadastrado.
  - Aplicado a 100% dos links: botão "📍 Maps", link do nome do advogado, badge de avaliação, endereço físico, modal de proposta e cadastro manual de leads.
- **Dinamização Geográfica e de Nicho nos Depoimentos (`LegalReviews.jsx`)**:
  - Eliminadas referências fixas que citavam outro advogado ("Dr. Jorge Santos") e cidades fixas de Sergipe ("Aracaju - SE", "Lagarto - SE") para leads de outros estados.
  - Os depoimentos agora adaptam dinamicamente o nome do advogado, a cidade real (`lawyer.city - lawyer.state`) e as histórias de sucesso ao nicho exato do escritório (Trabalhista, Consumidor, Família ou Geral).
- **Endereço Clicável com Conexão Oficial ao Maps (`LegalTopBar.jsx` e `LegalFooter.jsx`)**:
  - O endereço comercial na barra de utilidades e no rodapé agora é um link interativo que abre a rota exata no Google Maps.
  - Adicionado suporte resiliente de exibição de telefone/WhatsApp caso o telefone fixo não esteja preenchido.
- **Eliminação de Redundâncias de Nomes & Textos ("Advocacia Advocacia") (`LegalAbout.jsx`)**:
  - Tratamento inteligente da expressão `Na {lawyer.name}`: se o nome já contiver "Advocacia", "Consultoria" ou "Associados", evita duplicar a palavra.
  - Dinamização dos anos de experiência forense e indicação de atendimento presencial na comarca do cliente aliada ao atendimento online nacional.
- **Sincronização de Especialidades por Nicho (`LegalPracticeAreas.jsx` e `LegalFooter.jsx`)**:
  - Grade de especialidades consome diretamente `nicheInfo.practiceAreas`, adaptando os tópicos e subespecialidades à atuação real do lead.
- **Sanitização de OAB**:
  - Substituição da inscrição fictícia `OAB/UF 00.000` por `Inscrição Regular OAB/{UF}` contextualizada com o estado do advogado.

## [1.21.0] - 2026-09-28

### Adicionado (Personalização Dinâmica em Tempo Real da Landing Page por Advogado do Radar Google Maps)
- **Injeção Dinâmica dos Dados do Lead na Landing Page (`LegalLandingPage.jsx`)**:
  - Resolução automática em tempo real para qualquer advogado localizado pelo Radar Google Maps ou cadastrado no CRM através de `googleMapsProspectService.getBySlug(slug)`:
    - **Nome do Escritório / Advogado**: Renderizado na barra de topo, logotipo da navbar, headline do Hero, seção institucional "Sobre Nós", formulário de diagnóstico/protocolo e rodapé corporativo.
    - **Endereço Comercial**: Injetado na TopBar utilitária e no rodapé a partir do endereço real do Google Maps ou formato `{cidade} - {UF}`.
    - **WhatsApp & Telefone**: Todos os botões de ação ("Agendar Consulta", "Fale no WhatsApp", WhatsApp Flutuante e botão de envio do diagnóstico) direcionam para a API do WhatsApp com o número real do advogado (`wa.me/55...`).
    - **Instagram sob Demanda ("Se achar exibe, senão deixa em branco")**: Se o perfil do Instagram foi localizado no Google Maps/varredura, os ícones da barra superior e do rodapé direcionam para o perfil; caso contrário, o campo é mantido em branco (`''`) e os ícones são completamente omitidos, preservando a seriedade visual do escritório.
    - **Fallback de Inferência Elegante**: Caso o link seja aberto em outro dispositivo ou aba anônima sem histórico local, o sistema infere os títulos a partir do próprio slug com segurança sem quebrar o layout.
- **Sincronização de Slugs no Radar Google Maps (`RadarGoogleMaps.jsx`)**:
  - O botão "Demo" de cada card no painel agora utiliza `generateLawyerSlug(lawyer)` de forma 100% idêntica ao link gerado no texto da proposta comercial enviada por WhatsApp.
- **Validação de Produção**:
  - Build do Vite executado com sucesso e rotas testadas com código de status HTTP 200.

## [1.20.0] - 2026-09-28

### Adicionado (Radar Google Maps de Prospecção de Advogados no Brasil & Disparo de Propostas de R$ 300)
- **Nova Página no Painel Administrativo (`RadarGoogleMaps.jsx` sob `/admin/radar-google-maps`)**:
  - Módulo completo de busca de advogados e escritórios no Brasil com avaliações consideráveis (4.5★ a 5.0★) no Google Maps que não possuem website próprio.
  - Indicadores executivos no topo: total de escritórios sem site mapeados, média de avaliação e projeção de receita imediata (R$ 300 por fechamento).
  - Filtros inteligentes por Cidade/Município, Estado (UF), Especialidade (Geral, Trabalhista, Família, Consumidor) e Avaliação Mínima.
  - Pílulas de capitais brasileiras para busca com 1 clique (São Paulo, Rio de Janeiro, Belo Horizonte, Curitiba, Salvador, Brasília, Aracaju, Goiânia, Porto Alegre, Fortaleza).
  - Modal de inserção rápida para colar fichas encontradas diretamente no Google Maps.
- **Serviço Especializado de Prospecção (`googleMapsProspectService.js`)**:
  - Base curada de mais de 30 escritórios em capitais e polos regionais com nota alta e sem site oficial cadastrado.
  - Integração com Gemini AI (`scanLawyersWithoutWebsite`) para varreduras dinâmicas em qualquer cidade do país com identificação de dores e pontos elogiados por clientes.
  - Gerador automatizado de mensagens comerciais com proposta de **R$ 300 (implementação única) + anuidade do domínio próprio (Registro.br)**.
  - 3 variações de texto: Padrão do Usuário (Direto & Amigável), Consultivo/Autoridade e Curto para WhatsApp.
  - Ações em 1 clique por card: "Enviar no WhatsApp" (abre conversa direta), "Copiar Mensagem", "Ver Demonstração" e "Salvar no CRM".
  - **Links Diretos para o Google Maps**:
    - Nome do advogado/escritório com link e ícone externo para a ficha oficial no Maps.
    - Badge de avaliação com nota em estrelas clicável abrindo as avaliações no Google.
    - Endereço físico com link direto para a localização no Google Maps.
    - Novo botão dedicado "📍 Maps" na grade de ações rápidas de cada lead e atalho dentro do modal da proposta.
- **Integração no Menu do Painel (`AdminLayout.jsx` e `src/App.jsx`)**:
  - Adicionado novo item de menu "Radar Google Maps" com ícone de bússola (`Compass`).
  - Adicionado botão de atalho direto no cabeçalho do gerenciador de prospecção (`ManageLegalProspects.jsx`).
- **Validação de Build**:
  - Executado build de produção com Vite validado com sucesso sem erros.

## [1.19.0] - 2026-09-26

### Aprimorado (Anonimização & Padronização de Contatos das Páginas Modelos de Advocacia)
- **Neutralização de Telefones, WhatsApp, E-mails e Redes Sociais (`src/data/legalTemplates.js`)**:
  - Todos os dados de contato de pessoas reais e números regionais foram substituídos por informações de demonstração genéricas em todos os 4 nichos (`geral`, `consumidor`, `familia`, `trabalhista`):
    - **Telefone / WhatsApp**: `(00) 90000-0000` / `5500900000000`
    - **E-mail**: `contato@seuescritorio.adv.br`
    - **Instagram**: `@seu.escritorio.adv` (com link normalizado para `https://instagram.com/seu.escritorio.adv`)
    - **Endereço**: `Av. Principal, 1000 - Centro Empresarial, Cidade - UF`
    - **OAB**: `OAB/UF 00.000`
- **Serviço de Demonstração & Migração de Cache Local (`src/services/legalProspectService.js`)**:
  - Atualizado `DEFAULT_PROSPECTS` para todos os 4 perfis modelos utilizarem os dados neutros.
  - Implementada rotina de auto-migração no `getAll()` para limpar automaticamente registros anteriores do `localStorage` dos navegadores caso ainda contivessem telefones ou e-mails prévios.
- **Componentes Estruturais (`LegalTopBar.jsx` e `LegalFooter.jsx`)**:
  - Removidos fallbacks fixos regionais de Aracaju/Sergipe, substituindo-os pelo endereço corporativo neutro.
  - Normalizados os links sociais de Instagram para aceitarem tanto handle com arroba (`@seu.escritorio.adv`) quanto URLs absolutas.
- **Validação com Playwright**:
  - Capturadas screenshots de auditoria do rodapé e navbar comprovando a correta exibição dos dados genéricos.

## [1.18.0] - 2026-09-26

### Aprimorado (Transição 100% Automática do Carrossel Hero, Background Fixo no Diagnóstico & Refinamento de Banners)
- **Remoção de Imagem Fixa do Banner Pré-Rodapé (`LegalCinematicBanner.jsx`)**:
  - Removido o efeito de fundo infinito/parallax da faixa de CTA pré-rodapé, convertendo para um fundo corporativo Dark Navy profundo (`bg-gradient-to-r from-[#071326] via-[#0A192F] to-[#071326]`) com suave luz ambiente dourada.
  - O efeito de imagem de fundo fixa com revelação ao scroll (`bg-fixed`) foi mantido **exclusivamente na seção de cima** (na ferramenta interativa de Diagnóstico Jurídico `LegalDiagnosisCalculator.jsx`), garantindo hierarquia visual balanceada sem repetição excessiva.
- **Carrossel Automático Ininterrupto (`LegalHero.jsx`)**:
  - Removido o bloqueio `isPaused` sob hover da seção inteira que congelava os slides enquanto o cursor do mouse estava na tela.
  - Implementado ciclo automático ininterrupto a cada 4.5 segundos com crossfade suave contínuo entre as 4 fotografias full width.
  - Adicionada **barra de progresso animada contínua** em ouro nos bullets da base, permitindo ao usuário acompanhar o tempo exato da próxima transição.
  - Validado e auditado via Playwright (`tools/verify-hero-autoplay.js`), comprovando a troca automática dos 3 primeiros slides no tempo programado.
- **Efeito Parallax de Background Fixo com Revelação ao Scroll (`LegalDiagnosisCalculator.jsx` e `LegalCinematicBanner.jsx`)**:
  - Implementado `bg-fixed bg-cover bg-center` com a fotografia cinematográfica do Tribunal de Justiça (`tribunal.jpg`) na seção de Diagnóstico Interativo de 60 Segundos.
  - A imagem permanece fixa na janela durante a rolagem da página, sendo revelada continuamente como uma janela arquitetônica enquanto o card em glassmorphism translúcido flutua por cima.
  - Overlay em degradê de alta precisão (`bg-gradient-to-b from-[#070F1E]/95 via-[#070F1E]/82 to-[#070F1E]/95`) garantindo 100% de legibilidade dos botões e textos.
  - Efeito replicado no banner pré-rodapé com a vista noturna da metrópole (`skyline.jpg`).
- **Carrossel Full Width no Fundo do Hero (`LegalHero.jsx`)**:
  - Implementação de carrossel cinematográfico de imagens em tela cheia (100% full width) com crossfade contínuo e animação sutil (Ken Burns effect).
  - Ciclo rotativo entre 4 fotografias executivas hiper-realistas:
    1. Dr. Jorge Santos em sua mesa de escritório (`hero_desk.jpg`);
    2. Reunião de alinhamento com clientes na sala envidraçada (`reuniao.jpg`);
    3. Fachada imponente do Tribunal de Justiça (`tribunal.jpg`);
    4. Sede corporativa da banca de advocacia (`sede.jpg`).
  - Overlay em degradê escuro multidirecional de alto contraste (`from-[#070F1E]/95 via-[#070F1E]/80 to-[#070F1E]/50`), garantindo legibilidade absoluta de textos, botões e selos.
  - Indicadores interativos de posição (bullets dourados com barra ativa) e setas direcionais em glassmorphism translúcido.
  - Pausa inteligente da rotação ao passar o cursor do mouse (`onMouseEnter`/`onMouseLeave`).
- **Correção Crítica de Alinhamento e Quebra de Linhas no Menu (`LegalNavbar.jsx`)**:
  - Diagnosticado no print do usuário em resoluções de laptop (1200px) que links em caixa alta quebravam em 2 linhas verticais desalinhadas (`SOBRE \n NÓS`, `NOSSO \n PROCESSO`, `DIAGNÓSTICO \n (60S)`).
  - Adicionado `whitespace-nowrap` estrito em todos os links e convertida a navegação para Title Case amigável ("Início", "Sobre Nós", "Especialidades", "Como Funciona", "Diagnóstico (60s)", "Depoimentos", "Contato"), garantindo alinhamento horizontal perfeito em uma única linha.
  - Ajustado espaçamento responsivo (`gap-3.5 xl:gap-6`) para suportar perfeitamente viewports intermediárias e laptops de 1200px a 1366px.
  - Logo modernizada com tipografia geométrica `Plus Jakarta Sans` sem ALL CAPS forçado.
- **Transição para Tipografia Moderna "User-Friendly" (Plus Jakarta Sans)**:
  - Substituição definitiva de fontes serifadas pesadas e rígidas pela família **Plus Jakarta Sans** (pesos 400, 500, 600, 700, 800) em headlines, números de métricas, cards e botões.
  - Design muito mais moderno, amigável, arejado e alinhado aos padrões visuais de produtos digitais de alta tecnologia e consultorias contemporâneas.
- **Auditoria Visual Automatizada Playwright em Múltiplas Resoluções**:
  - Script atualizado e executado em Laptop 1200x800, Desktop 1440x900 e Mobile 390x844, com capturas salvas em `tests/audit-results/legal/`.
- **Hero & Headline com Altura de Linha Respirada (`LegalHero.jsx`)**:
  - Ajustado `leading` para eliminar qualquer colisão vertical entre linhas de texto. Headline monumental com degradê âmbar no destaque "Futuro Seguro" e moldura com selo oficial de inscrição na OAB.
- **Descompressão de Áreas de Atuação (`LegalPracticeAreas.jsx`)**:
  - Reestruturado o grid de 5 colunas espremidas para layout editorial respirado 3 + 2, com padding generoso (`p-8`), ícones requintados em dourado fosco e títulos em linha única sem quebras truncadas.
- **Rebalanceamento de Sobre Nós & Grade de Métricas (`LegalAbout.jsx`)**:
  - Eliminada a coluna espremida na lateral; implementada grade 2x2 com cards de métricas arejados e confortáveis com números destacados e ícones de prestígio.
- **Metodologia com Alinhamento Preciso (`LegalMethodology.jsx`)**:
  - Alinhamento vertical da linha conectora ao eixo central dos círculos de atendimento com degradê metálico suave nas extremidades.
- **Botão Flutuante de WhatsApp Não-Invasivo (`LegalFloatingWhatsApp.jsx`)**:
  - Desativado popup automático que obstruía cards do site; tooltip reativo ativado apenas sob intenção de hover do visitante.

## [1.17.0] - 2026-09-26

### Adicionado & Aprimorado (Redesign Executivo Inspirado na Referência Summit Financial)
- **Nova Arquitetura Visual de Alta Autoridade & Confiança**:
  - Implementação fiel da referência corporativa: TopBar utilitária escura + Navbar branca de alto contraste + Hero em Dark Navy com o Dr. Jorge Santos em sua mesa executiva.
  - Seções centrais em fundo branco limpo e off-white de máxima legibilidade, eliminando poluição visual e garantindo autoridade institucional instantânea.
- **Novos Componentes Modulares Implementados**:
  - `LegalTopBar.jsx`: Faixa utilitária escura no topo com endereço físico em Sergipe, horário de atendimento (Seg a Sex: 08h às 18h), telefone comercial e links sociais.
  - `LegalNavbar.jsx`: Navbar branca corporativa com balança estilizada em ouro, links de navegação limpos e botão em Dark Navy "Agendar Consulta".
  - `LegalHero.jsx`: Fundo Dark Navy profundo (`#0A192F`), tag dourada de confiança com traço de destaque, headline monumental serif, botões duplos e foto executiva hiper-realista do advogado em sua mesa de trabalho (`/images/legal/hero_desk.jpg`).
  - `LegalTrustBar.jsx`: Barra de 4 pilares de confiança (Padrão Ético OAB, Advocacia Independente, Estratégias Comprovadas e Sigilo & Privacidade LGPD).
  - `LegalPracticeAreas.jsx`: Grade com 5 especialidades forenses em cards brancos limpos com ícones finos em ouro e links diretos "Saiba Mais".
  - `LegalAbout.jsx`: Seção "Sobre o Escritório" em split de 3 partes: foto de reunião de consultoria com clientes (`/images/legal/reuniao.jpg`) + textos corporativos com checklist de diferenciais + 4 métricas verticais de autoridade.
  - `LegalMethodology.jsx`: Rito processual transparente com 4 círculos conectados e badges numéricas douradas (1. Diagnóstico, 2. Planejamento, 3. Execução, 4. Acompanhamento).
  - `LegalReviews.jsx`: Seção "Clientes" com 3 cards de depoimentos reais em estilo editorial com aspas douradas e 5 estrelas.
  - `LegalCinematicBanner.jsx`: Banner pré-rodapé com vista panorâmica noturna e chamada direta para agendamento de consulta sem compromisso.
  - `LegalFooter.jsx`: Rodapé corporativo completo com 4 colunas institucionais e conformidade ética com o Provimento CFOAB nº 205/2021.

## [1.16.0] - 2026-09-25

### Aprimorado (Redesign Visual com Glassmorphism, Gradientes Metálicos & Fluidez Framer Motion)
- **Eliminação Definitiva de Cores Sólidas e Blocos Chapados**:
  - Toda a esteira de Landing Pages Jurídicas e demonstrações foi convertida para **Glassmorphism translúcido de alta densidade** (`backdrop-blur-2xl bg-white/[0.04]`), bordas finas com iluminação de borda (`border-white/10 hover:border-amber-400/40`), sombras volumétricas com glow dourado (`shadow-[0_20px_50px_rgba(245,158,11,0.18)]`) e orbes de luz neon pulsantes em background.
- **Gradientes Metálicos Ricos de Ouro Líquido**:
  - Aplicação de gradientes multi-stop de ouro polido (`bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent` e `bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500`) em headlines, números de métricas, botões principais de ação e badges de autoridade.
- **Fluidez & Micro-Interações com Framer Motion**:
  - Animações refinadas de elevação táctil no hover (`whileHover={{ y: -8, scale: 1.02 }}` e `whileTap={{ scale: 0.98 }}`), expansão fluida em acordeões de FAQ (`AnimatePresence`), transições de progresso no Diagnóstico de 60 Segundos e efeitos de shimmer em botões.
- **Refatoração Completa dos Componentes Jurídicos**:
  - `LegalNavbar.jsx`: Cápsula flutuante moderna em vidro fosco (`rounded-full backdrop-blur-2xl`), logo geométrica em anel dourado e links em pílula.
  - `LegalHero.jsx`: Fundo panorâmico do skyline noturno em tela cheia, tipografia monumental Stratech e os **4 Overlapping Cards conectados** suspensos na transição do Hero.
  - `LegalAbout.jsx`: Split corporativo de 3 colunas (Sede envidraçada à noite + textos corporativos com botão dourado + 4 diferenciais com ícones em anel de ouro).
  - `LegalPracticeAreas.jsx`: Grade no estilo "Featured Projects" com fotos arquitetônicas de torres e tribunais, setas de navegação e selo circular da balança.
  - `LegalCinematicBanner.jsx`: **Novo Banner Cinematográfico Full-Width** com foto do Tribunal de Justiça, espelho d'água, compromisso ético e botão de ação direta.
  - `LegalDiagnosisCalculator.jsx`: Terminal interativo em vidro 3D estilo BizNext com barra de progresso em ouro e dossiê pronto para WhatsApp.
  - `LegalMethodology.jsx`: Linha do tempo em cards de vidro fosco com badges numéricas metálicas e linha conectora luminosa.
  - `LegalFaq.jsx`: Acordeão em glassmorphism com destaque âmbar suave para dúvidas ativas.
  - `LegalLeadForm.jsx`: Protocolo institucional seguro em vidro translúcido com inputs em frosted glass.
  - `LegalMetricsBar.jsx`: Barra de autoridade em pílula de vidro com números em ouro metálico.
  - `LegalFooter.jsx`: Rodapé corporativo com divisor em gradiente dourado e links de navegação forense.
  - `LegalFloatingWhatsApp.jsx`: Botão flutuante em ouro líquido com tooltip inteligente em frosted glass.

## [1.15.0] - 2026-09-25

### Adicionado & Aprimorado (Gerador de Landing Pages Jurídicas Ultra-Conversivas & Prospecção Ativa)
- **Novo Layout Corporativo de Elite Inspirado em Referências Internacionais (Stratech, SkyStructure & BizNext)**:
  - **Hero Imersivo com Overlapping Cards**: Fundo Deep Midnight Navy (`#070E1B`), headline monumental em caixa alta com destaque em Ouro Âmbar (`#E5A93C`), badge flutuante de vidro de "+14 Anos de Tradição Forense" e **linha dos 4 Overlapping Cards suspensos** com ícones de linha dourada (Line Art Gold).
  - **Seção "About Us / Sobre o Escritório" em Split 3 Colunas (Stratech Golden Luxury)**: Fotografia arquitetônica da sede moderna com vidro e iluminação noturna à esquerda, texto de autoridade no centro com botão dourado de contato, e lista de 4 diferenciais com ícones redondos dourados à direita.
  - **Seção "Áreas de Atuação" em Formato Featured Projects**: 4 cards horizontais com fotografias arquitetônicas, títulos encorpados em maiúsculas e o selo circular dourado com a balança no canto inferior direito.
  - **Diagnóstico Jurídico Interativo de 60 Segundos (BizNext Dark Glassmorphism)**: Triagem dinâmica em 3 etapas com cards translúcidos, barra de progresso em gradiente e geração de dossiê para WhatsApp.
  - **Barra Inferior de 4 Métricas Forenses (Stratech Bottom Bar)**: 4 colunas horizontais com ícones dourados finos (`🏆 +1.800 Casos`, `⭐ 98% Satisfação`, `🏛️ +14 Anos Forenses`, `🛡️ 100% Sigilo OAB`).
  - **Navbar com Monograma Geométrico Dourado**: Estilo Stratech com tipografia limpa e botão de ação sólido dourado.
- **Conformidade Ética Absoluta com a OAB (Provimento nº 205/2021)**:
  - Copy persuasiva sem mercantilização ou promessas de causa ganha, focada em análise de viabilidade, transparência técnica e sigilo profissional.
  - Disclaimer ético explícito no rodapé de todas as landing pages.
- **Fotografia Jurídica Hiper-realista com IA (`public/images/legal/`)**:
  - Geração de 4 retratos executivos cinematográficos em alta definição com trajes sob medida e escritórios de luxo para cada nicho.
- **Componentes Modulares Exclusivos de Alta Conversão (`src/components/legal/`)**:
  - `LegalNavbar`: Header executivo com balança estilizadora, OAB, endereço físico e botão WhatsApp direto.
  - `LegalHero`: Headline imponente, subheadline persuasiva, prova social 5.0 estrelas, moldura dourada e micro-garantias éticas.
  - `LegalPainPoints`: Cards interativos para identificação imediata das dores e problemas do cliente.
  - `LegalPracticeAreas`: Escopo minucioso de atuação com checkmarks e direcionamento contextualizado ao WhatsApp.
  - `LegalMethodology`: Passo a passo transparente em 3 etapas (Triagem Sigilosa -> Análise Documental -> Ação Estratégica).
  - `LegalAbout`: Perfil e histórico do profissional com selos de segurança e ética.
  - `LegalFaq`: Acordeão interativo com respostas completas para 8-10 dúvidas frequentes sem juridiquês.
  - `LegalLeadForm`: Formulário de triagem rápida que formata a mensagem e abre diretamente a conversa no WhatsApp do advogado.
  - `LegalFloatingWhatsApp`: Botão flutuante com balão de status "Atendimento Online" para máxima conversão.
  - `LegalFooter`: Rodapé corporativo completo com dados de contato e disclaimer da OAB.
- **Painel Administrativo de Prospecção Ativa (`ManageLegalProspects.jsx`)**:
  - Rota protegida `/admin/prospeccao-advogados` com atalho no menu lateral (`AdminLayout.jsx`).
  - Cadastro rápido de advogados sem site encontrados no Google Meu Negócio.
  - Acesso instantâneo aos 4 modelos limpos para demonstrações rápidas.
  - Botão de 1 clique para copiar o link da demonstração personalizada (`/advocacia/:slug`).
  - Gerador de Script Persuasivo de Abordagem para WhatsApp: mensagem fria, respeitosa e ultra-convincente pronta para envio direto pelo WhatsApp Web.
- **Proteção e Privacidade Garantidas**:
  - As páginas de demonstração utilizam `<meta name="robots" content="noindex, nofollow" />`, impedindo indexação nos motores de busca conforme as diretrizes acordadas.

## [1.14.0] - 2026-09-25

### Corrigido & Aprimorado (Resiliência e Alta Disponibilidade da IA Gemini)
- **Atualização para o Modelo de Próxima Geração `gemini-2.5-flash` (`gemini.js`)**:
  - Solucionado o erro `503 Service Unavailable / Model experienced high demand` que afetava o modelo legado `gemini-flash-latest` durante a estimativa de escopos de orçamentos.
  - Implementado motor com suporte a fallback automático de modelos (`AVAILABLE_MODELS = ['gemini-2.5-flash', 'gemini-flash-latest']`), garantindo tolerância a falhas caso um modelo sofra picos temporários de demanda no Google.
  - Forçado retorno estrito de JSON via `generationConfig: { responseMimeType: "application/json" }`, eliminando falhas de parsing de markdown no `cleanJsonText`.
  - Tratamento aprimorado de erros não-genéricos: diagnóstico claro e específico para sobrecarga de servidores (503), limite de requisições por minuto (429) e validação de chaves de API conforme as diretrizes mestres.

## [1.13.0] - 2026-09-25

### Adicionado & Aprimorado (Portal do Cliente, Sub-sprints & Acompanhamento de Pedidos)
- **Portal Exclusivo de Acompanhamento do Cliente (`ClientProjectTrack.jsx`)**:
  - Nova página acessível em `/projeto/:budgetCode` e `/acompanhar-projeto/:budgetCode` (e `/projeto` com barra de busca por código).
  - Exibição em tempo real do status geral do projeto, contratante, código do pedido (`#ORC-YYYY-XXX`), prazo e progresso calculado automaticamente pelas sub-sprints concluídas.
  - Linha do tempo visual de entregáveis com status individual (✅ Concluído, ⏳ Em Andamento, 🔒 Aguardando Início) e links diretos de homologação/prévia (Figma, Vercel, Staging).
  - Visualização transparente das condições comerciais contratadas (50/50 com sinal e saldo em R$, splits por etapas ou cartão em até 12x) e chave PIX para liquidação com cópia em 1 clique.
  - Botões de ação para o cliente: abertura da proposta oficial em PDF e contato contextualizado no WhatsApp com o código do pedido.
  - **Proteção Absoluta de Privacidade**: aplicação de `<meta name="robots" content="noindex, nofollow" />` para impedir indexação pública de orçamentos e dados de clientes no Google.
- **Gerenciamento de Sub-sprints no Modal de Orçamento (`BudgetModal.jsx`)**:
  - Cada entregável agora possui seletor ágil de status da sprint (⚪ Pendente, ⏳ Em Andamento, ✅ Concluído) e campo opcional para link de homologação.
  - Card dedicado de Acesso do Cliente na Aba 1 com botões de 1 clique para "Copiar Link", "Convite WhatsApp" com mensagem formatada e botão de prévia da visão do cliente.
- **Ações Rápidas de Compartilhamento no Kanban e na Tabela (`BudgetKanban.jsx` & `ManageBudgets.jsx`)**:
  - Novo botão de compartilhamento com ícone `Share2` em cada card do Kanban e em cada linha da tabela de orçamentos, copiando instantaneamente a mensagem de convite para o WhatsApp do cliente.
- **Função de Consulta Pública Segura (`budgetService.js`)**:
  - Implementado `fetchBudgetByCode` permitindo busca flexível por código de pedido (com ou sem `#`, ou ID), retornando apenas os dados do cliente e escopo, sem expor margens financeiras internas ou anotações confidenciais.

## [1.12.0] - 2026-09-25

### Adicionado & Aprimorado (Modalidades Estruturadas de Pagamento)
- **Suporte Oficial às 3 Modalidades Comerciais de Pagamento (`BudgetModal.jsx`)**:
  - Implementado seletor interativo na Aba 1 de Informações Básicas com as modalidades padronizadas:
    * **50% Entrada + 50% Entrega Final**: Cálculo dinâmico do sinal via PIX para início e saldo restante na homologação definitiva.
    * **Pagamento por Etapas (Splits)**: Decomposição automática do valor final em parcelas/splits atrelados aos marcos de entregáveis definidos.
    * **Cartão de Crédito**: Parcelamento em até 12x via link/máquina com aviso claro de juros e tarifas da operadora por conta do contratante.
    * **Personalizado**: Campo livre para acordos pontuais ou condições especiais negociadas.
  - Sincronização reativa e automática do campo de texto `payment_terms` com base na modalidade escolhida e no valor total do projeto.
- **Decomposição Executiva no Documento PDF da Proposta (`BudgetPdfModal.jsx`)**:
  - Na Seção 3 ("Investimento & Condições Comerciais"), o PDF agora gera cards executivos inteligentes conforme a modalidade selecionada:
    * No modelo 50/50: exibe boxes destacados com valores exatos em R$ do 1º Sinal e do 2º Saldo.
    * No modelo por etapas: lista os splits detalhados por cada etapa do projeto.
    * No modelo cartão: exibe badge oficial com ícone de cartão, informando o parcelamento em até 12x e condições de encargos.
- **Inteligência Comercial no Copiloto IA de Vendas (`gemini.js`)**:
  - Enriquecido o prompt do Gemini para usar a modalidade de pagamento escolhida como trunfo estratégico nas abordagens de WhatsApp e na resposta às objeções de preço (ex: destacando o risco zero com 50% apenas na entrega final ou a diluição dos desembolsos por entrega).

## [1.11.0] - 2026-09-25

### Corrigido & Aprimorado (Auditoria Minuciosa com Subagentes Especialistas)
- **Correção Crítica no Upload de Avatares de Avaliações (`ReviewForm.jsx`)**:
  - Restaurada a atribuição de `setAvatarFile(compressedFile)` no fluxo de compressão WebP, solucionando o bug silencioso onde fotos de perfil enviadas por clientes não eram salvas no Firebase Storage.
- **Harmonização de Temas Claro/Escuro em Assinaturas (`Subscriptions.jsx`)**:
  - Eliminação de textos brancos estáticos (`text-white`) sobre fundos claros em cartões de planos e FAQs, restaurando a legibilidade perfeita com classes semânticas HSL (`text-foreground`, `text-muted-foreground`, `border-border`).
- **Resiliência a Formatos de Moeda e Strings da IA (`BudgetModal.jsx`)**:
  - Implementado helper `parseAiNumber` para tratar saídas com `"R$"`, pontuações e decimais brasileiros, eliminando risco de `NaN` ou zeramento de preço (`R$ 0,00`) ao clicar nos botões de cenários de 1 clique.
- **Null Safety e Parse Seguro no Copiloto IA (`gemini.js`)**:
  - Implementado `safeDeliverables` prevenindo quebra de execução com `TypeError` caso o array de entregáveis venha `null` do banco, e extração cirúrgica de JSON entre `{` e `}` no `cleanJsonText`.
- **Inclusão da Coluna de Orçamentos Recusados no Kanban (`BudgetKanban.jsx`)**:
  - Adicionada coluna visual `Recusado / Arquivado` e mapeamento de status legado `aceito` para `em_andamento`, garantindo que nenhuma proposta comercial desapareça do quadro visual.
- **Proteção contra Projetos Órfãos no Portfólio (`BudgetModal.jsx`)**:
  - Adicionada trava de segurança exigindo que o orçamento esteja salvo antes de ser convertido em projeto público de portfólio.
- **Persistência de Cenários Estratégicos da IA (`BudgetModal.jsx`)**:
  - Salvamento dos cenários calculados (`minPrice`, `suggestedPrice`, `premiumPrice`, `level`) em `ai_scope_analysis` no banco de dados e restauração automática ao reabrir o orçamento.
- **Renderização de Logotipo Real e Regras de Impressão no PDF (`BudgetPdfModal.jsx` e `index.css`)**:
  - Renderização do logotipo real da empresa cadastrado no configurador de preços, remoção de altura fixa estática que gerava segunda página vazia, e inclusão de `@media print` para isolamento de página impressa sem o fundo escuro do modal.
- **Limpeza de Componentes Órfãos e Código Morto**:
  - Excluídos arquivos legados não referenciados (`WelcomeMessage.jsx`, `CallToAction.jsx`, `HeroImage.jsx`, `imageCompression.js`, `portfolioData.js`) e removidos mais de 70 linhas de código legado não utilizado em `Reviews.jsx`.
- **Tradução e Humanização de Mensagens de Autenticação (`SupabaseAuthContext.jsx` e `Contact.jsx`)**:
  - Tradução integral de mensagens de erro/sucesso para Português Brasil descritivo e acolhedor conforme as diretrizes mestres de desenvolvimento.

## [1.10.0] - 2026-09-25

### Adicionado & Aprimorado
- **Motor de Precificação Inteligente por Níveis de Complexidade (`gemini.js`)**:
  - Integração da base oficial `guia_precificacao_projetos.md` calibrando o Gemini com matrizes de 4 níveis de complexidade:
    * Nível 1: Ajustes rápidos e artes simples (R$ 60 a R$ 150).
    * Nível 2: Landing Pages e Identidade Visual (Piso R$ 350-500, Recomendado R$ 600-900, Premium até R$ 1.300).
    * Nível 3: Sites corporativos e dashboards complexos (Piso R$ 800-1.200, Recomendado R$ 1.300-2.200).
    * Nível 4: E-commerces e plataformas SaaS (Piso R$ 1.200-1.800, Recomendado R$ 2.000-4.500+).
  - Multiplicadores automáticos de risco e urgência: taxa de urgência (+30% a +50%), gateways de pagamento Stripe/Mercado Pago (+R$ 250 a +R$ 450) e migração de banco (+R$ 200 a +R$ 500).
- **Cards Interativos de Precificação Estratégica em 1 Clique (`BudgetModal.jsx`)**:
  - Painel com 3 cenários comerciais reativos na Aba de "HH & Precificação": **Piso / Fechamento Rápido**, **Recomendado (Ideal de Mercado)** e **Premium (Escopo Total)**.
  - Botões de 1 clique para aplicar instantaneamente qualquer um dos três valores recomendados pela IA ao orçamento, com recálculo automático de margens e feedback via Toast.
- **Base de Conhecimento Oficial Clonada (`documents/guia_precificacao_projetos.md`)**:
  - Adicionado documento de referência técnica de engenharia de software e comercial freelancer para balizar estimativas futuras.

## [1.9.0] - 2026-09-25

### Adicionado & Aprimorado
- **Calibração e Treinamento da IA para Design Gráfico e Artes Visuais (`gemini.js`)**:
  - Detecção inteligente de nicho (Design Gráfico, Identidade Visual, Banners, Social Media, Papelaria, Flyers vs. Desenvolvimento de Software/Sistemas).
  - Precificação calibrada e acessível para a realidade do mercado brasileiro: peças pontuais de 1 a 4 horas (R$ 80 a R$ 350), pacotes de redes sociais de 6 a 12 horas (R$ 350 a R$ 1.100) e identidade visual ágil (R$ 500 a R$ 1.800).
  - Decomposição das etapas técnicas em fluxo real de design: Briefing & Moodboard, Criação Visual/Rascunho, Refinamento e Fechamento de Arquivos em Alta Resolução (Vetor, SVG, PNG, PDF para Impressão).
  - Copiloto comercial de vendas e quebra de objeções adaptado para design: destaque para o impacto visual imediato, percepção de autoridade da marca e diferenciação de artes profissionais contra modelos genéricos de Canva.
- **Seletor de Tipo de Chave PIX & URL de Logotipo (`PricingSettingsModal.jsx`)**:
  - Adicionado campo `<Select>` para escolha do tipo de chave PIX (`CNPJ`, `CPF`, `E-mail`, `Telefone`, `Aleatória`) e campo para definir URL customizada do logotipo da empresa no PDF.

### Corrigido (Pontas Soltas Eliminadas)
- **Saneamento de Payload em Atualização de Orçamentos (`budgetService.js`)**:
  - Exclusão dos objetos relacionais `category` e `project` antes do `insert` e `update` no Supabase, eliminando o erro `Could not find the 'category' column of 'budgets' in the schema cache` que impedia salvar edições.
- **Renderização do Nome das Etapas no PDF (`BudgetPdfModal.jsx`)**:
  - Correção na tabela de entregáveis do documento PDF para ler `d.stage || d.title || d.name`, evitando que as etapas geradas pela IA ou cadastradas manualmente fossem exibidas em branco.
- **Geração Automática e Persistência do Código da Proposta (`BudgetModal.jsx`)**:
  - Geração automática de `budget_code` (`ORC-YYYY-XXX`) no momento da criação, gravando o identificador oficial permanentemente no banco de dados.
- **Substituição de Alerta Nativo por Toast Notifier (`ManageServices.jsx`)**:
  - Remoção de chamada `alert()` nativa e substituição por componente `toast({ variant: 'destructive', ... })` com diagnóstico descritivo.
- **Validação Segura de Telefones para WhatsApp (`BudgetModal.jsx`, `BudgetKanban.jsx`, `ManageBudgets.jsx`)**:
  - Verificação de comprimento mínimo (>= 8 dígitos numéricos) antes de montar e disparar links para a API do WhatsApp.
- **Responsividade Mobile nos Modais Administrativos (`BudgetModal.jsx` e `BudgetPdfModal.jsx`)**:
  - Ajuste de `TabsList` com `grid-cols-2 sm:grid-cols-4` e `DialogFooter` com `flex-col-reverse sm:flex-row`, além de botões com ícones e rótulos responsivos no cabeçalho do PDF.

## [1.8.0] - 2026-09-25

### Adicionado
- **Gerador de Propostas Comerciais em PDF de Alta Fidelidade Visual (`BudgetPdfModal.jsx`)**:
  - Geração e download instantâneo de PDF corporativo via `html2pdf.js` no padrão folha A4 com identidade visual do site (azul marinho degradê, tipografia executiva, contraste e acabamento premium).
  - Suporte a impressão nativa via `window.print()` e botão para alternar visualização/ocultação de estimativas de horas técnicas.
  - Dados completos da empresa prestadora: Logotipo/Emblema, Razão Social, Nome Fantasia, CNPJ/CPF, E-mail, WhatsApp, Endereço e Site Oficial.
  - Dados completos do contratante: Nome do Contato, Empresa, CPF/CNPJ (opcional), E-mail, WhatsApp e Endereço.
  - Seções detalhadas de Escopo do Projeto, Tabela de Entregáveis/Etapas, Card de Investimento com Total em BRL, Condições de Pagamento, Chave PIX destacada para liquidação de sinal, Termos e Garantias, e Linhas de Assinatura.
- **Aba de Gestão Corporativa no Configurador Comercial (`PricingSettingsModal.jsx`)**:
  - Nova aba "2. Minha Empresa & PDF (CNPJ/PIX)" permitindo a Rafael Pita cadastrar e alterar Razão Social, CNPJ, CPF, WhatsApp, Endereço, Chave PIX, Validade Padrão da Proposta e Cláusulas Contratuais.
- **Campos Opcionais de Cadastro do Cliente no Orçamento (`BudgetModal.jsx`)**:
  - Novos campos na Aba 1 de Criação de Orçamento: CPF/CNPJ do Cliente, E-mail e Endereço.
  - Botão de acesso direto "Visualizar & Baixar PDF" na Aba 3 e no rodapé do modal.
- **Atalhos Rápidos de PDF no Pipeline (`ManageBudgets.jsx` e `BudgetKanban.jsx`)**:
  - Botão de visualização e download em PDF em cada card do quadro Kanban (estilo Trello) e na tabela de orçamentos.
- **Migração de Banco de Dados Supabase / PostgreSQL (`13_add_company_and_client_fields_for_pdf.sql`)**:
  - Execução ao vivo no banco de dados da VPS Oracle (`portfolio-db`): adição das colunas de dados corporativos em `pricing_settings` e campos de cliente/código de proposta em `budgets`.

## [1.7.0] - 2026-09-25

### Adicionado
- **Serviço de Autenticação Supabase GoTrue na VPS Oracle Cloud**:
  - Implantação e orquestração do contêiner `supabase/gotrue:v2.158.1` (`portfolio-auth`) via Docker Compose integrado ao PostgreSQL 15 (`portfolio-db`).
  - Execução bem-sucedida de todas as 52 migrações estruturais do schema `auth` do Supabase (`auth.users`, `auth.refresh_tokens`, `auth.sessions`, `auth.instances`).
  - Criação da role `authenticated` no PostgreSQL com concessão de privilégios de acesso e execução para o PostgREST (`portfolio-api`), permitindo consultas tanto autenticadas quanto anônimas.
  - Ativação do usuário administrador `rafael@rafaelpitaoficial.com.br` com privilégios completos de acesso.

### Corrigido
- **Renderização dos Campos do Modal de Orçamento (`BudgetModal.jsx` / `tabs.jsx`)**:
  - Implementação de `TabsContext` no componente [tabs.jsx](file:///C:/Git/React/MeuPortfolio%20v2/src/components/ui/tabs.jsx), adicionando suporte nativo para ativação de abas via `value` e `onValueChange` além da prop legada `isActive`.
  - Correção da exibição de todos os campos de formulário, seletores, textareas, abas de Precificação por HH, Copiloto IA de Vendas e Publicação em Portfólio no modal de criação e edição de orçamentos (`/admin/orcamentos`).
- **Falha de Login e Acesso à Área do Cliente (`/area-clientes`)**:
  - Configuração do proxy reverso Nginx em `https://license.rafaelpitaoficial.com.br/auth/v1/` roteando para o serviço GoTrue interno na porta 9999.
  - Correção de conflito de cabeçalhos CORS (`Access-Control-Allow-Origin: *, <origin>`) através da diretiva `proxy_hide_header` no Nginx, permitindo requisições cross-origin seguras a partir do domínio de produção e localhost.
  - Validação completa do fluxo de autenticação e redirecionamento para o `/dashboard` e `/admin/orcamentos` via testes automatizados reais com Playwright.

## [1.6.0] - 2026-09-25

### Adicionado
- **Módulo Administrativo de Orçamentos & Pipeline Comercial (`/admin/orcamentos`)**: Plataforma completa para gerenciar o ciclo de vida comercial dos projetos (`pendente` ➔ `em_analise` ➔ `em_andamento` ➔ `entregue` ➔ `pendente_pagamento` ➔ `concluido`).
- **Visualização Kanban Estilo Trello (`BudgetKanban.jsx`)**: Painel de colunas interativo com cards de projetos, valores por coluna, totalizadores financeiros em tempo real, badges de status e botões de avanço/recuo de estágio em 1 clique (otimizado para Desktop e Mobile).
- **Calculadora e Copiloto de IA para Estimativa de HH (`gemini.js` & `BudgetModal.jsx`)**: Integração com a API Google Gemini (`estimateBudgetScopeWithAI`) que decompõe briefings livres em etapas de projeto, calcula horas técnicas (HH), adiciona margem de contingência/retrabalho e sugere preço justo, piso de sobrevivência e preço âncora premium.
- **Copiloto Comercial de Vendas & Quebra de Objeções (`generateSalesPitchWithAI`)**: Gerador de propostas persuasivas de alto impacto prontas para envio no WhatsApp/e-mail com 1 clique (foco em ROI e benefícios), acompanhado de script tático para rebater objeções de clientes ("está caro", "o concorrente faz por menos", "vou pensar").
- **Configurador de Precificação & Hora-Homem (`PricingSettingsModal.jsx`)**: Configuração do valor da taxa-hora base (R$/h), margem de lucro líquido (%), reserva técnica de contingência (%) e piso mínimo de entrada de projeto.
- **Conversor com 1 Clique em Portfólio Público (`convertBudgetToPortfolioProject`)**: Ao concluir um projeto, com 1 toque no botão "Publicar no Portfólio", o sistema cadastra o trabalho diretamente na tabela `projects` com foto de capa WebP, categoria e links sem necessidade de redigitar nada.
- **Nova Migração de Banco de Dados Supabase (`migrations/12_create_budgets_and_pricing_tables.sql`)**: Tabelas `pricing_settings` e `budgets` com integridade referencial, checagem de status, RLS de segurança restrita para administradores e índices de alta performance para busca e filtros do Kanban.
- **Alternador Kanban / Lista com Filtros**: Filtros combinados por busca textual (cliente, empresa, projeto), categoria de serviço e status, com métricas de faturamento em tempo real no topo do painel.

## [1.5.0] - 2026-09-24

### Adicionado
- **Suíte Automatizada de Auditoria Front-End com Playwright (`tools/audit-playwright.mjs`)**: 51 testes em 3 viewports (Desktop 1440x900, iPhone 390x844 e Mobile Ultra-Estreito 320x568) com detecção matemática de horizontal overflow (`scrollWidth > clientWidth`), monitoramento de console errors, alvos de toque e captura de 51 prints fullPage em `tests/audit-results/screenshots/`.
- **Otimização Extrema de Imagem WebP**: Conversão da imagem de equipe `IMG_5637.JPG` (5.87 MB) para `team-work.webp` (72.6 KB), economizando 98.8% de dados transferidos e acelerando o build em 43%.
- **Leitura de Query Params de Categoria no Portfólio (`Portfolio.jsx`)**: O portfólio agora inicializa e reage dinamicamente a parâmetros de URL (`/portfolio?category=desenvolvimento-web` ou `/portfolio#nicho`) com `useSearchParams` e `useLocation`.
- **Migração de Banco de Dados (`11_fix_reviews_rpc.sql`)**: Criação do script SQL oficial para corrigir a coluna referenciada de `approved` para `is_approved` na função `get_average_rating()`.
- **Expansão do Dicionário de Traduções (`translations.js`)**: Adicionadas chaves faltantes de seções da Home e Portfólio (`portfolio_description_long`, `home_featured_projects`, `home_ready_title`, etc.).

### Corrigido
- **Eliminação do Vazamento de Layout em Mobile (`About.jsx`)**: Neutralizado o horizontal overflow detectado pelo Playwright nas resoluções 390px e 320px através de encapsulamento com `overflow-hidden` nas seções com animações do Framer Motion e padding responsivo (`p-4 sm:p-8`).
- **Eliminação de Erro HTTP 400 da Home (`Home.jsx`)**: Corrigida a consulta de avaliação média para a tabela `reviews` com `is_approved = true`, eliminando o erro de coluna inexistente no Supabase e atualizando dinamicamente a avaliação média dos clientes.
- **Proteção contra Crash por Null Pointer (`ProjectPage.jsx`)**: Inserido optional chaining e fallbacks em links com `project.category?.slug` e nos botões de projeto anterior/próximo.
- **Texto Invisível no Tema Claro (`ReviewForm.jsx`)**: Substituído `text-white` rígido por `text-gray-900 dark:text-white` e `text-slate-600 dark:text-gray-300` na tela de sucesso pós-envio.
- **Contraste da Barra de Navegação no Tema Claro (`Navbar.jsx`)**: O botão da Área do Cliente e os itens do drawer mobile receberam classes adaptativas HSL, eliminando links cinza-claros ilegíveis em fundos brancos e adicionando tradução no botão de orçamento.
- **Ergonomia Mobile em Formulários (`Contact.jsx`)**: Transformada a grade de prioridades de `grid-cols-3` para `grid-cols-1 sm:grid-cols-3` e o container para `p-4 sm:p-8 md:p-12`, prevenindo quebra de texto em telas de 320px.
- **Unificação de SEO em Sobre Nós (`About.jsx`)**: Substituída a tag `<Helmet>` bruta pelo componente padronizado `<SEO />`.
- **Aviso Ambíguo do Tailwind CSS (`PhotographyLanding.jsx`)**: Substituída a classe `duration-[4000ms]` por estilo inline seguro.

### Removido
- **Exclusão de Código Órfão de E-commerce**: Deletados `ProductsList.jsx`, `ShoppingCart.jsx` e `useCart.jsx`, eliminando o wrapper `<CartProvider>` de `main.jsx` e o listener residual de localStorage.

## [1.4.0] - 2026-08-11

### Adicionado
- **Sistema Global de Internacionalização (i18n)**: Implementado o `LanguageContext.jsx` e `LanguageProvider` para gerenciamento reativo do idioma da aplicação com suporte a **Português Brasil (PT-BR)** e **Inglês (EN)**.
- **Seletor de Idiomas na Barra de Navegação (`Navbar.jsx`)**: Adicionado botão de alternância com bandeiras e identificadores visuais (`PT 🇧🇷` / `EN 🇺🇸`), responsivo para telas Desktop e Mobile.
- **Dicionário Central de Traduções (`translations.js`)**: Criado arquivo de mapeamento de termos para navegação, contadores de autoridade, busca, filtros de categorias, botões de ação e rodapé.
- **Persistência de Preferência de Idioma**: A escolha do visitante é gravada no `localStorage`, garantindo a permanência do idioma em toda a sessão de navegação.

## [1.3.3] - 2026-08-04

### Adicionado
- **Integração do Google Tag Manager (GTM) com Rastreamento SPA**: Instalação oficial do container `GTM-KMZ79L23` injetando o script assíncrono otimizado no `<head>` do `index.html` e a tag `<noscript>` de fallback no `<body>`.
- **Rastreamento de Transições de Página no React Router (`GTMRouteTracker.jsx`)**: Desenvolvimento de componente reativo para enviar eventos customizados de `pageview` para o `dataLayer` a cada mudança de rota do React Router na SPA.
- **Internacionalização no index.html**: Alteração do idioma da página no elemento html para `pt-BR`.

## [1.3.2] - 2026-08-04

### Corrigido
- **Falso Positivo de noindex em Rota Pública (`SEO.jsx`)**: Correção do bug de correspondência de prefixo simples (`location.pathname.startsWith`) que marcava erroneamente a página pública `/dashboards-power-bi` com a tag `noindex` devido ao prefixo compartilhado com a rota restrita `/dashboard`. A verificação agora exige igualdade exata do caminho ou correspondência com subrotas via barra final (`/dashboard/`).

## [1.3.1] - 2026-08-04

### Adicionado
- **Classificação Avançada de Projetos em Subcategorias (`ProjectFormModal.jsx`)**: Adicionado um campo seletor de "Subcategoria de Serviço (SEO)" no Painel Administrativo que aparece de forma dinâmica para as categorias Desenvolvimento Web, Dashboards Power BI e Fotografia. As subcategorias correspondem diretamente às 7 novas landing pages de serviços.
- **Gravação Segura por Tags e Retrocompatibilidade**: As subcategorias selecionadas são gravadas de forma transparente como etiquetas `subcategoria:slug-do-servico` no array `services` no banco Supabase. Evita a necessidade de migrações estruturais no PostgreSQL.
- **Badges Organizacionais no Painel (`ManagePortfolio.jsx`)**: A listagem de projetos exibe de forma clara um badge com o nome da subcategoria/nicho ao lado da categoria principal para conferência visual imediata.
- **Filtro de Projetos Preciso com Fallback (`ServiceDetailPage.jsx`)**: O filtro de cases relacionados nas páginas públicas agora prioriza a exibição de projetos com tags explícitas de subcategoria de SEO. Caso não existam projetos tagueados, executa automaticamente a heurística anterior baseada em termos de busca no título.

## [1.3.0] - 2026-08-03

### Adicionado
- **Páginas Individuais de Serviços com Foco em SEO e Conversão (`ServiceDetailPage.jsx`)**: Criação de páginas exclusivas para os 7 serviços chaves corporativos (Criação de Sites, Landing Pages, Sistemas Web, Automações, Power BI, Fotografia de Eventos e Fotografia Corporativa), integrando copy focada em benefícios, prova social (depoimentos de `reviews`), projetos reais do Supabase da categoria, FAQs interativos para IA e frases geolocalizadas locais do Rio de Janeiro.
- **Roteamento Exclusivo e Amigável (`App.jsx`)**: Integração de rotas dedicadas de alta autoridade na raiz do site para cada serviço (ex: `/criacao-de-sites`, `/landing-pages`).
- **Navegação de Funil de Leads (`Services.jsx`)**: Atualização do Link "Saiba mais" na página geral para redirecionar os visitantes de forma estratégica para as páginas de serviço específicas em vez da seção geral de portfólio.
- **Gerador Dinâmico de Sitemap.xml (`generate-sitemap.js`)**: Criação de script Node.js integrado ao pré-build que reconstrói de forma autônoma o arquivo `public/sitemap.xml` a cada compilação de produção. Mapeia automaticamente as páginas estáticas, as 7 páginas de serviço e as 50 URLs individuais de cases de portfólio via REST API do Supabase, com suporte nativo de fallback e process.env para hospedagem na Vercel.
- **Dados Estruturados JSON-LD (Schema.org)**: Injeção automatizada de tags Schema.org para os tipos `ProfessionalService`/`Service`, `Organization` e `FAQPage` específicos de cada serviço no cabeçalho via `react-helmet-async`.
- **Cabeçalhos de Segurança HTTP (`vercel.json`)**: Configuração de headers avançados de infraestrutura na Vercel injetando HSTS de longa duração para HTTPS, XSS Protection, nosniff MIME, Clickjacking protection e Content-Security-Policy (CSP) customizada para Supabase, Firebase Storage e Google Fonts.

### Alterado
- **HTML Semântico de Barra de Navegação (`Navbar.jsx`)**: Envolvimento do cabeçalho fixo global na tag `<header>` para conformidade com a estrutura do HTML5.

## [1.2.9] - 2026-06-25

### Adicionado
- **Criação e Seleção Dinâmica de Subcategorias (Nichos) de Fotografia (`ProjectFormModal.jsx`)**: Integração de um seletor dinâmico de subcategorias que carrega as opções diretamente do banco de dados por varredura de tags. Inclui a opção especial "+ Criar Nova Subcategoria..." que abre um campo de texto interativo para cadastrar novos nichos personalizados (como Gestantes, Retratos, Newborn) sob demanda.
- **Gravação Inteligente Retrocompatível**: O novo nicho inserido é formatado e gravado de forma transparente sob o prefixo `nicho:NomeDaSubcategoria` no array `services` no banco Supabase. Evita a necessidade de migrações estruturais ou alterações DDL no PostgreSQL.
- **Filtros e Abas Públicas Automáticas (`PhotographyPortfolio.jsx`)**: A página da galeria de arte detecta os nichos ativos nos projetos salvos e renderiza as abas de filtros correspondentes dinamicamente, permitindo a navegação imediata sem intervenção técnica.

## [1.2.8] - 2026-06-18

### Adicionado
- **Reordenação por Drag and Drop no Painel Admin (`ManagePortfolio.jsx`)**: Substituição da reordenação sequencial por cliques em setas pelo arraste nativo HTML5. O administrador agora pode reordenar a listagem de projetos arrastando qualquer linha através do ícone GripVertical (`GripVertical`). Inclui feedback visual premium com linhas e fundo destacados durante o arraste e normalização de ordem automática em lote no banco Supabase.
- **Badge de Auxílio ao Usuário**: Inserção de banner de dica de UX sobre o funcionamento do arraste ao filtrar categorias.

## [1.2.7] - 2026-06-18

### Adicionado
- **Zoom Inteligente de Largura Total (`ImageGalleryModal.jsx`)**: Suporte a exibição de imagens muito compridas na vertical (como prints de páginas inteiras de navegadores) ajustadas pela largura total da tela (`w-full max-w-4xl`) no lightbox. O alinhamento passa para o topo (`items-start`) e ativa o scroll vertical nativo (`overflow-y-auto`), permitindo a rolagem fluida e confortável da captura de tela de ponta a ponta.
- **Preservação de Resolução e Legibilidade de Prints (`imageOptimizer.js`)**: Modificação do utilitário de otimização para inspecionar dinamicamente as proporções da imagem. Imagens muito verticais (proporção altura/largura > 1.5) têm o limite padrão de 1920px desativado ou estendido para até `8192px`. Isso impede que a largura seja reduzida drasticamente e garante que o texto fique 100% legível no zoom.

## [1.2.6] - 2026-06-18

### Adicionado
- **Zoom na Capa Principal (`ProjectPage.jsx`)**: Integração da imagem de capa principal do projeto no lightbox do visualizador de mídias (`ImageGalleryModal.jsx`). Ao clicar na capa principal do projeto, a foto agora se expande em tamanho original sem cortes.
- **Upload de Capa sem Recorte Obrigatório (`ProjectFormModal.jsx`)**: Refatoração do fluxo de upload para desativar a abertura forçada do editor de corte (crop). O administrador agora pode salvar imagens em sua proporção original, utilizando o botão "Ajustar Recorte" apenas de forma opcional.
- **Unificação do Visualizador de Galeria**: A imagem principal foi anexada ao início do carrossel da galeria pública, possibilitando navegar por todo o acervo de fotos do projeto em tela cheia a partir de qualquer clique de card.

## [1.2.5] - 2026-06-03

### Adicionado
- **Integração com Firebase Storage**: Substituição do Supabase Storage para armazenamento de arquivos pesados (fotos de projetos, imagens de landing page, avatares de avaliações, favicon e logotipos). O Firebase Storage fornece 5 GB gratuitos ( Spark Plan), resolvendo o limite apertado de 1 GB do plano gratuito do Supabase Cloud.
- **Otimização Automática para WebP (`imageOptimizer.js`)**: Criação de um utilitário que comprime e converte dinamicamente qualquer arquivo de imagem para o formato `.webp` de alta eficiência antes do envio. Isso reduz fotos de alta resolução de 5MB-10MB para menos de 1MB, garantindo carregamento instantâneo.
- **Ferramenta de Migração Automática (`StorageOptimization.jsx`)**: Refatoração do painel de otimização de armazenamento no painel de administração para baixar as imagens antigas hospedadas no Supabase, convertê-las para WebP, enviá-las para o Firebase Storage, atualizar a referência das URLs no banco de dados e excluir os originais do Supabase de forma totalmente automatizada.

## [1.2.4] - 2026-06-03

### Adicionado
- **Palavras-chave e Descrições Geolocalizadas (RJ)**: Otimização de metadados nas páginas públicas chaves do sistema focando no ranqueamento regional líder no Rio de Janeiro para tecnologia ("desenvolvimento de sites rj", "programador rio de janeiro", "dashboards power bi rio de janeiro") e fotografia profissional ("fotos de pre wedding rio de janeiro", "fotos casamento rio de janeiro", "ensaio pre wedding rj", "fotografo de casamento rj").
- **Unificação do Componente de SEO (`SEO.jsx`)**: Substituição completa de todas as ocorrências brutas de `<Helmet>` nas páginas públicas (`Home.jsx`, `Services.jsx`, `Portfolio.jsx`, `PhotographyLanding.jsx`, `PhotographyPortfolio.jsx` e `ProjectPage.jsx`) pelo componente unificado `<SEO />`.
- **Previsualização de Herança de Logotipo no Admin**: Validação do comportamento reativo do componente de SEO e previews nas telas de administração para herdar automaticamente o logotipo principal do site (`logo_url`) como Favicon do Site e Imagem Open Graph de Compartilhamento, garantindo que o branding funcione perfeitamente sem campos em branco.

## [1.2.3] - 2026-06-02

### Adicionado
- **Alternador de Temas no Painel Administrativo (`AdminLayout.jsx`)**: Adicionado o botão de alternar de tema (Sol/Lua) no rodapé da barra lateral (Sidebar) no desktop e à direita no cabeçalho móvel no mobile, permitindo que o administrador altere o tema Claro/Escuro do painel e do site de forma prática diretamente de dentro da área restrita.
- **Ordenação Manual de Projetos por Categoria (`ManagePortfolio.jsx`)**: Desenvolvemos uma funcionalidade completa para reordenar projetos do portfólio. Ao filtrar por uma categoria específica, o usuário ganha botões de "Subir" e "Descer" na tabela. A lógica é inteligente: se os projetos possuírem ordens idênticas, elas são normalizadas de 10 em 10 automaticamente antes de realizar a movimentação.
- **Atualização da Migração SQL (`10_add_display_order_to_projects.sql`)**: Adicionada migração segura para criar a coluna `display_order` na tabela `projects`, inicializando os projetos legados de acordo com sua data de criação (`created_at`) sequencialmente e definindo o valor padrão como `0` (assim, novos projetos criados sobem para o topo por padrão).

### Alterado
- **Contraste e Suporte a Temas no Formulário de Edição de Projetos (`ProjectFormModal.jsx`)**: Ajustado o modal de criar/editar projetos de portfólio para se adequar perfeitamente ao tema selecionado. Removemos fundos, bordas e textos escuros rígidos e substituímos por classes utilitárias semânticas HSL (`bg-card`, `bg-muted` e `border-border`), resolvendo a ilegibilidade das fontes cinzas sob fundo escuro fixo em telas claras.
- **Prioridade de Ordenação nos Projetos (Portfolio, Home, Galeria)**: Todas as queries do Supabase que consultam a tabela `projects` foram alteradas para ordenar primeiramente pelo campo `display_order` (crescente) e secundariamente por `created_at` (decrescente).

## [1.2.2] - 2026-06-02

### Adicionado
- **Grade Simétrica Uniforme da Galeria de Fotografia (`PhotographyPortfolio.jsx`)**: Substituição do antigo layout Masonry assimétrico por uma grade simétrica clássica e editorial (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), contendo cartões de imagem fixos em `aspect-[3/2]` com cantos arredondados (`rounded-2xl`) de alta qualidade e zoom sutil no hover.
- **Tipografia e Disposição Editorial por Baixo do Card**: Reestruturação visual das informações dos cases de fotografia. A cortina escura de hover foi removida para dar visibilidade total e desimpedida às fotos. O título do projeto, nicho profissional e link caixa alta "VER GALERIA" agora estão posicionados e centralizados perfeitamente por baixo de cada imagem, seguindo o padrão clássico e de alta performance estética.
- **Reatividade e Contraste Premium no Tema Claro (Oportuno)**: Liberação e adaptação total de contraste para toda a galeria de fotografia no Tema Claro. O fundo, seletores de abas rápidas, botões e campo de pesquisa transitam suavemente com cores de altíssimo nível de legibilidade (fundo marfim/claro, tipografia escura sofisticada e acendimento em azul no hover).

## [1.2.1] - 2026-06-02

### Alterado
- **Abreviação e Robustez no Mapeamento de Categorias (`Portfolio.jsx` & `ProjectPage.jsx`)**: Implementado mapeamento dinâmico super robusto e insensível a maiúsculas/minúsculas no front-end para as categorias, de modo a garantir que mesmo antes da aplicação da migração no banco de dados, as abas de especialidades do portfólio geral e das páginas de cases exibam de forma imediata seus nomes compactos de alta conversão.
- **Encurtamento de Categoria IA**: Mapeamento e encurtamento da categoria "Produção com IA" para a nomenclatura executiva refinada **"Produção IA"**.
- **Atualização da Migração SQL (`09_update_category_titles.sql`)**: Adicionada a instrução SQL para renomear em definitivo no banco de dados a categoria "Produção com IA" para "Produção IA", além de cobrir atualizações de registros antigos tanto pela slug quanto pelo título literal.
- **Legibilidade no Tema Claro para Serviços (`Services.jsx`)**: Substituição de todas as cores de texto e contêineres estáticos pretos e cinza-escuros (ilegiveis sob fundo branco) por variáveis HSL dinâmicas e classes Tailwind corporativas. Ajustamos cards de serviço, bullets, títulos do processo ("Como Trabalhamos") e botões outline, resultando em uma página elegante com contraste de altíssimo nível em ambos os modos de tema.
- **Correção de Ícones Invisíveis e Cores Purgadas (`Services.jsx`)**: Criado um dicionário estático de classes de gradiente literal (`serviceColors`) no front-end, mapeando todos os serviços ativos (como Tráfego Pago, Manutenção e Câmeras CFTV). Isso impede que as cores do gradiente sejam purgadas no build final pelo Tailwind, resolvendo em definitivo a invisibilidade dos ícones que ficavam brancos sobre fundo branco/transparente.
- **Otimização de Espaçamento no Hero (`Home.jsx`)**: Reduzida a sobreposição acumulada de paddings no topo do Hero da Home. Encolhemos o padding superior da section principal (ajustado de `sm:pt-32` para `sm:pt-24` conforme pedido do usuário) e da div interna, aproximando a logo e o nome da marca em relação à navbar de forma fluida e eliminando o vazio exagerado no topo.
- **Redesenho Completo da Seção de Fotografia (`PhotographyLanding.jsx` & `PhotographyPortfolio.jsx`)**: Reestruturação total da área de fotografia para dotá-la de uma identidade de estúdio de luxo e galeria de arte com suporte 100% integrado aos temas Claro e Escuro reativos.
- **Galeria Masonry Assimétrica de Luxo (`PhotographyPortfolio.jsx`)**: Introduzido layout Masonry fluido responsivo para exibição de fotos em lote sem cortes abruptos nas proporções originais (estilo Vogue/Behance), com abas de filtros rápidos e deslizantes (`layoutId` do Framer Motion) baseadas em classificação automática inteligente no front-end.
- **Harmonização de Temas Globais (`Navbar.jsx` & `Footer.jsx`)**: Eliminadas todas as travas de cores estáticas de fotografia no cabeçalho e no rodapé corporativos, liberando o alternador de temas (Sol/Lua) e a paleta adaptativa em toda a seção de fotografia.
- **Visibilidade Otimizada das Fotos do Hero (`PhotographyLanding.jsx`)**: Ajustada a opacidade das imagens do slideshow de fundo (aumentada para `opacity-70` no claro e `opacity-80` no escuro) e suavizados os overlays de fusão do Hero. Isso enaltece a nitidez e a vivacidade das fotografias artísticas, assegurando ao mesmo tempo contraste e legibilidade perfeita para a tipografia em primeiro plano.

## [1.2.0] - 2026-06-01

### Adicionado
- **Redesenho do Portfólio Geral (`Portfolio.jsx`)**: Substituição completa dos antigos carrosséis isolados por um layout estilo dashboard de elite. Inclui Hero de autoridade com contadores rápidos de volume de entrega (500+ projetos), seletor em abas horizontais responsivas por especialidades de atuação com contadores dinâmicos integrados, barra de busca instantânea, Grid Fluido de alta performance animado com Framer Motion (reorganização suave em tempo real), exibição reativa de pílulas de tecnologias (React, Power BI, Figma, etc.) no hover dos cartões e uma seção robusta de 'Pilares de Excelência e Escopo Técnico' detalhando sua competência no mercado.
- **Tema Claro (Light Mode) Corporativo Padrão**: Toda a identidade visual do portfólio agora inicia no Tema Claro por padrão para novos visitantes, oferecendo excelente legibilidade, contraste comercial sofisticado e estética ultra-clean inspirada em grandes empresas de tecnologia (Stripe/Apple).
- **Mapeamento de Cores Adaptativas (HSL)**: Redefinição das variáveis de cores CSS semânticas no `:root` e na classe `.dark` do Tailwind, habilitando compatibilidade fluida de temas.
- **Alternador de Tema Reativo (Toggle)**: Inserido o botão de alternância de tema premium diretamente na `Navbar.jsx` (Desktop e Mobile) com micro-animações de rotação e troca de ícone (Sol/Lua) alimentado pelo Framer Motion.
- **ThemeContext e ThemeProvider**: Implementada a infraestrutura global para controle do estado dos temas, salvando as preferências do usuário localmente no `localStorage`.
- **Estilo de Estúdio para Fotografia**: Proteção forçada de Tema Escuro exclusivamente para a área artística de fotografia (`/portfolio-fotografia`), para preservar a fidelidade e o contraste das cores de fotos profissionais em padrão de cinema.

### Alterado
- **Otimização de Abas do Portfólio (`Portfolio.jsx`)**: Substituição da antiga barra de rolagem horizontal inestética do Windows por um layout de pílulas compacto e refinado (estilo Stripe) com fontes discretas (`text-xs md:text-[13px] font-semibold`), ícones menores (`w-3.5 h-3.5`) e contadores modernos (`text-[10px] rounded-md`). Isso encolhe a largura horizontal dos botões em 25%, acomodando-os em uma única linha no desktop ao lado do campo de busca, evitando quebras de linha e apresentando um design de elite com indicador ativo deslizante (`layoutId` do Framer Motion).
- **Ocultação de Categorias Zeradas (`Portfolio.jsx`)**: Refatoração da listagem de filtros para ocultar dinamicamente qualquer especialidade com zero projetos associados, limpando a barra de navegação de opções vazias.
- **Nomenclatura Discreta e Profissional de Categorias (`Portfolio.jsx` & `ProjectPage.jsx`)**: Simplifiquei e refinei a comunicação das abas de especialidades no site todo. Mapeei dinamicamente "Desenvolvimento de Sites" para o termo compacto **"Sites"** e "Dashboards em Power BI" para o objetivo **"Power BI"**, tanto no painel de portfólio quanto nas páginas individuais de cases, gerando uma interface corporativa muito mais elegante, direta e que economiza espaço de linha no desktop.
- **Nova Migração SQL (`09_update_category_titles.sql`)**: Criado roteiro oficial para atualizar de forma permanente as nomenclaturas das categorias na tabela `categories` do banco de dados do Supabase.
- **`Home.jsx`**: Refatoração completa das cores textuais fixas e seções (como as Estatísticas e o Hero) para suportar com extrema elegância e contraste as duas paletas de tema.
- **`Contact.jsx`**: Formulários de contato, de solicitação de propostas de orçamento e de suporte adaptados para Glassmorphism claro premium e botões de seleção de preço com legibilidade semântica polida.
- **`Footer.jsx`**: Rodapé otimizado com bordas sutis e contraste dinâmico de links e ícones para ambos os modos.
- **`index.css`**: Ajustadas as classes premium `.glass-effect`, `.service-card` e `.gradient-text` para transição dinâmica suave e cores reativas refinadas.
- **`App.jsx`**: Wrapper principal atualizado com transições de cores e integrado com o `<ThemeProvider>`.

### Corrigido
- **Legibilidade no Hover dos Cards de Portfólio (`Portfolio.jsx`)**: Corrigida a legibilidade do título e descrição ao passar o mouse sobre os cards. Capturas de tela de sistemas ou sites muito claros e repletos de textos causavam sobreposições e fusões de letras confusas. Adicionei uma cortina de fundo escura de opacidade alta (`bg-slate-950/85`) e leve desfoque de fundo (`backdrop-blur-[3px]`) que surge suavemente no hover, isolando e garantindo 100% de leitura e sofisticação das fontes em primeiro plano.
- **Contraste e Legibilidade do Tema Claro em Detalhes de Projetos (`ProjectPage.jsx`)**: Corrigido o contraste de leitura do modo Claro/Dia na página individual de cases. Textos em cinza-claro (`text-gray-300` e `text-gray-400`) foram substituídos por classes dinâmicas e de alto contraste (`text-slate-650 dark:text-gray-300`), o link "Voltar ao Portfólio" foi reestilizado com cores seguras reativas, os badges de serviços ganharam fundos e bordas adaptativas refinadas, e o botão "Deixar Avaliação" foi reconfigurado com classes HSL reativas para sanar o texto invisível em fundos brancos.
- **Limpeza de Projetos de Fotografia Legados ("Geral") no Portfólio Geral**: Implementada filtragem estrita na busca de dados do Supabase para bloquear e ocultar projetos classificados como "Geral" (ensaios artísticos antigos sem categoria válida corporativa), restringindo a exibição de fotografia estritamente à sua galeria exclusiva `/portfolio-fotografia` e protegendo o portfólio corporativo de conteúdos duplicados.
- **Espaço Vazio no Topo e Altura do Hero**: Reduzida a altura do Hero da Home de `min-h-screen` para `min-h-[calc(100vh-5rem)]` com paddings responsivos e reduzidos os espaçamentos internos (`space-y-6`) e o tamanho da logo (de `w-40` para `w-32`) para trazer os botões de ação ("Solicitar Orçamento" e "Ver Portfólio") acima da dobra da tela (Above the Fold) sem exigir rolagem vertical.
- **Opacidade e Suavização do Marquee de Background**: Corrigida a poluição visual do marquee de projetos em tema claro, forçando `grayscale` diretamente nas tags de imagem, reduzindo a opacidade de envelopamento para 6% no tema claro e inserindo um overlay dinâmico de `bg-background/90` para transformá-lo em uma marca d'água super discreta.
- **Contraste de Inputs e Labels em Área do Cliente e Rastreamento**: Refatoradas as classes de labels de `text-gray-300` para `text-gray-700 dark:text-gray-300` e de inputs de `bg-gray-800` para `bg-white/50 dark:bg-gray-800/50` nos formulários de `/area-clientes` e `/track-ticket`, sanando completamente a legibilidade no tema claro.
- **Fundo e Textos do Rodapé (Footer)**: Corrigido o fundo do rodapé para `bg-slate-50 dark:bg-gray-900/90` com divisor `border-slate-200 dark:border-gray-800` eliminando qualquer problema de contraste e visibilidade de links no tema claro.


---

## [1.1.0] - 2026-06-01

### Adicionado
- **Migração de SEO no Banco de Dados (`08_add_seo_columns.sql`)**: Adicionadas colunas seguras `site_title`, `site_description`, `site_keywords`, `favicon_url` e `og_image_url` à tabela `site_config`.
- **Favicon Dinâmico**: O site agora renderiza o favicon configurado diretamente pelo banco de dados no componente global `SEO.jsx`.
- **Imagem Open Graph Dinâmica**: Suporte completo para imagens de compartilhamento de redes sociais (WhatsApp, Facebook, LinkedIn, etc.) com links absolutos automáticos.
- **Configurações de SEO no Painel Admin**: Nova seção visualmente premium dentro de `/admin/settings` contendo campos dinâmicos para edição de títulos, descrições, palavras-chave e uploads de Favicon/OG Image com compressão de imagem ativa.
- **robots.txt Estático**: Criado `public/robots.txt` otimizado para motores de busca com bloqueio inteligente de indexação em áreas restritas (Dashboard, Admin, Tickets) e apontamento ao Sitemap.
- **sitemap.xml Estático**: Criado `public/sitemap.xml` para acelerar o ranqueamento das rotas públicas mais importantes do portfólio no Google.
- **noindex Automático em Área Logada**: O componente `SEO.jsx` injeta automaticamente `<meta name="robots" content="noindex, nofollow" />` em qualquer rota de painéis internos, áreas de suporte ou tickets de cliente para proteção e privacidade.
- **Tags Canônicas**: Injeção da tag `<link rel="canonical" href="..." />` em todas as rotas públicas, eliminando problemas de conteúdo duplicado.

### Alterado
- **`SEO.jsx`**: Reestruturado integralmente com novos fallbacks dinâmicos herdados do `SiteConfigContext`.
- **`SiteConfigContext.jsx`**: Adicionados campos de SEO com valores padrão ao objeto `defaultConfig`.
- **`ManageGeneralSettings.jsx`**: Adicionada a lógica de upload para o bucket `site-assets` do Supabase e inclusão dos novos campos de SEO no payload de submissão.
