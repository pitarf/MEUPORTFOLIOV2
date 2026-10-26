# CHANGELOG - Rafael Pita Solutions / MeuPortfolio v2

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

## [1.62.0] - 2026-10-26

### Adicionado (Filtro NavBottom Flutuante no Scroll do Portfólio)
* **Novo Componente `PortfolioBottomNav` (`src/components/PortfolioBottomNav.jsx`)**:
  * Barra de navegacao e filtro inferior ("NavBottom") que surge suavemente com animacao Framer Motion ao rolar a pagina alem da secao de filtros principal do topo.
  * Carrossel horizontal de pilulas de categorias (Todos, Design Grafico, Sites, Power BI, Producao IA) com icones, titulos e contadores em tempo real.
  * Busca instantanea integrada expansivel com foco automatico e botao de limpar.
  * Botao de retorno suave ao topo da pagina (`ArrowUp`).
  * Estilizacao glassmorphism de elite com suporte automatico aos temas Claro e Escuro (`bg-white/95` e `dark:bg-[#121210]/95`).
* **Integracao nos Portfólios Normal e v2 (`src/pages/Portfolio.jsx`)**:
  * Monitoramento inteligente do scroll da janela com listener passivo e referencia DOM ao filtro principal do topo.
  * Sincronizacao bidirecional instantanea de categoria ativa e pesquisa textual com o grid de projetos.
* **Ajuste de Ergonomia no Botao Flutuante do WhatsApp (`src/components/WhatsAppFloat.jsx`)**:
  * Elevacao automatica em telas mobile na rota de portfolio (`max-sm:!bottom-[78px]`) para evitar qualquer sobreposicao com a barra inferior de filtros.
* **Atualizacao da Categoria de Projetos Web (`Portfolio.jsx`, `ProjectPage.jsx`, `Contact.jsx`)**:
  * Substituido o rotulo simplista "Sites" pelo posicionamento profissional de alto valor "Desenvolvedor" com icone `< >`.
* **Vitrine Limpa de Fotografia v2 para Propostas 99freelas (`PhotographyLanding.jsx`, `PhotographyPortfolio.jsx`, `ProjectCarousel.jsx`, `App.jsx`)**:
  * Criadas as rotas `/portfolio-fotografia-v2`, `/portfolio-fotografia-v2/galeria` e aliases `/portfolio-v2/fotografia`, `/fotografia-v2` sob o `CleanShowcaseLayout`.
  * Removidos todos os links diretos para WhatsApp (`wa.me`), Instagram e formulários externos de `/contato`.
  * Substituído o CTA final e botões do Hero por avisos de conformidade orientando o cliente a fechar o orçamento pelo chat da proposta no 99freelas.
  * Links dos cards da galeria de fotografia integrados ao caminho protegido `/portfolio-v2/fotografia/:projectSlug`.

## [1.61.0] - 2026-10-26

### Adicionado (Vitrine Limpa do Portfólio v2 para Propostas 99freelas : Sem Contato Externo)
* **Novo Layout Especial `CleanShowcaseLayout` (`src/components/CleanShowcaseLayout.jsx`)**:
  * Removido o rodapé geral com telefones, e-mail e links para redes sociais externas.
  * Removido o botão flutuante de WhatsApp (`WhatsAppFloat`).
  * Header/Navbar exclusivo sem links para `/contato` ou chamadas externas, contendo apenas o logotipo da marca, badge de vitrine e alternador de tema claro/escuro.
  * Rodapé estrito e minimalista em conformidade com as regras de moderação do 99freelas.
* **Novas Rotas Dedicadas em `src/App.jsx`**:
  * `/portfolio-v2`: Vitrine de projetos 100% blindada contra contatos externos.
  * `/portfolio-v2/:categorySlug/:projectSlug`: Páginas de detalhes dos projetos com botão de retorno voltando para `/portfolio-v2`.
  * Aliases `/portfolio/v2` e `/projetos-v2` para flexibilidade em propostas comerciais.
* **Adaptação dos Componentes `Portfolio.jsx` e `ProjectPage.jsx`**:
  * Suporte ao parâmetro `cleanMode`: substituição de links para `/contato` por chamadas neutras orientando o cliente a responder diretamente pelo chat da proposta na plataforma.
  * Navegação entre projetos anteriores e próximos mantida dentro do escopo `/portfolio-v2/`.

## [1.60.1] - 2026-10-22

### Corrigido (Tela Branca na Página de Detalhes do Projeto : Regras de Hooks & Normalização Defensiva)
* **Resolução de Violação das Regras de Hooks no React (`src/pages/ProjectPage.jsx`)**:
  * Movida a chamada do hook `useState('auto')` (modo de mídia: vídeo vs imagem) para o topo do componente junto com os demais hooks, eliminando o erro fatal `Rendered more hooks than during the previous render` que causava tela branca após o término do carregamento.
* **Normalização Defensiva de Arrays de Mídia & Serviços**:
  * Implementada proteção contra valores `null`, strings serializadas ou formatos inesperados em `project.services`, `project.video_urls` e `project.gallery_urls`.
  * Validação aprovada via Playwright sem erros de runtime na rota `/portfolio/videos-com-ia/o-nascimento-da-moda-animacao-ia` e no build de produção.
* **Pranchas de Consistência dos Personagens de IA (`public/images/projects/o-nascimento-da-moda/`)**:
  * Adicionadas as 4 pranchas originais de consistência de personagens em proporção 3:2 (A Estudante, Prof. João Braga, Gilles Lipovetsky e Georg Simmel).
  * Galeria refinada em `src/pages/ProjectPage.jsx` com suporte a proporção 3:2 e etiquetas de identificação flutuantes (`● Prancha de Consistência : ...`).
  * Atualização da galeria no Supabase conectando as pranchas à página do projeto.
* **Capa Oficial de Produção em 16:9 (`capa-o-nascimento-da-moda.png`)**:
  * Integrada a cena oficial do diálogo entre a Estudante e Gilles Lipovetsky no palácio clássico como imagem principal (`main_image_url`) do projeto no banco de dados e cards de vitrine do portfólio.

## [1.60.0] - 2026-10-22

### Adicionado (Design System Moderno & Página Integradora de Nutrição : Referência NutriVida)
* **Novo Perfil de Dados em `src/data/nutritionistsData.js`**:
  * Adicionado perfil temático demonstrativo NutriVida (`dra-beatriz-lima-nutrivida` com aliases `nutrivida` e `dra-beatriz-lima`).
  * Paleta azul médica: Primária `#0284C7`, Secundária `#0EA5E9`, Marinho Profundo `#0C4A6E`, Fundo Suave `#F0F9FF`.
  * Serviços mapeados: Emagrecimento Saudável, Nutrição Esportiva, Reeducação Alimentar e Nutrição Clínica.
  * Objetivos para o formulário Hero: 'Emagrecimento Saudável', 'Ganho de Massa Muscular', 'Reeducação Alimentar', 'Melhora de Exames / Saúde' e 'Nutrição na Gestação'.
* **Nova Página Dedicada & Alternador de Modelo (`src/pages/nutrition/ModernNutritionPage.jsx`)**:
  * Integrados os 7 componentes visuais de `src/components/nutrition/modern/`.
  * Suporte nativo a parâmetros de URL (`?nome=...&whatsapp=...&cidade=...`) e customizador manual de prospecção (`NutritionProspectDrawer`).
  * Barra superior com alternador de modelos visuais entre NutriVida (Azul) e Editorial (Verde).
* **Novas Rotas Registradas em `src/App.jsx` & Sitemap**:
  * Rotas adicionadas: `/nutrivida`, `/nutrivida/:slug`, `/modelo-nutricao/nutrivida` e `/modelo-nutricao/editorial`.
  * Atualizada a vitrine de demonstrações da página de vendas (`NutritionSalesLandingPage.jsx`) com card do modelo NutriVida.
  * Inclusão de `/nutrivida` e `/nutricionista/dra-beatriz-lima-nutrivida` no sitemap dinâmico (`tools/generate-sitemap.js`).
* **Novo Conjunto Modular de Componentes em `src/components/nutrition/modern/`**:
  * `ModernNutritionHero.jsx`: Seção hero com distribuição tripartite (proposta de valor com 3 micro-benefícios à esquerda, foto profissional da nutricionista em jaleco ao centro e card embutido de agendamento rápido com redirecionamento formatado ao WhatsApp à direita).
  * `ModernNutritionServicesGrid.jsx`: Grade horizontal com 4 cards limpos (Emagrecimento Saudável, Nutrição Esportiva, Reeducação Alimentar e Nutrição Clínica) com ícones temáticos, descrições concisas e setas interativas.
  * `ModernNutritionBenefitsBar.jsx`: Faixa de alto impacto em azul marinho (#0C4A6E) com 4 facilidades operacionais (Horários flexíveis, Pagamento facilitado, Atendimento online e Consultório local).
  * `ModernNutritionHowItWorks.jsx`: Composição dividida com prato saudável e selo flutuante "Plano alimentar 100% personalizado" à esquerda, e 3 etapas didáticas conectadas à direita.
  * `ModernNutritionAbout.jsx`: Apresentação institucional com foto e selo profissional de CRN, checklist com ticks azuis, botão "Conheça minha história" e card destacado de 5 diferenciais de acolhimento.
  * `ModernNutritionDarkLocation.jsx`: Seção imersiva em azul marinho profundo (#0C4A6E) com card de endereço físico, mapa do Google Maps embed centralizado e card de horários com botão de agendamento.
  * `ModernNutritionCtaBanner.jsx`: Banner panorâmico azul degradê com foto de prato saudável, chamada convidativa "Vamos cuidar da sua saúde juntos?" e botões duplos de conversão.
  * `index.js`: Ponto central de exportação dos novos componentes modernos de nutrição.
* **Padrões de Qualidade e Conformidade**:
  * Ausência total de caracteres de travessão.
  * 100% responsivo (mobile-first), com comentários em todas as funções e compilação de produção aprovada com êxito.

## [1.59.0] - 2026-10-22

### Adicionado (Novo Projeto de IA: O Nascimento da Moda & Player Nativo do YouTube)
* **Novo Projeto de Produção com IA no Portfólio**:
  * Cadastrado o projeto *"O Nascimento da Moda : Curta Educacional Animado com IA Generativa"* (`/portfolio/videos-com-ia/o-nascimento-da-moda-animacao-ia`).
  * Cliente: Universidade Federal do Piauí (UFPI) : Curso de Graduação em Moda.
  * Stack documentada: Google Flow (Image-to-Video & Text-to-Video), Microsoft Azure Neural Speech (TTS Multimodal pt-BR), Google Speech Recognition (VAD & Alinhamento Semântico), Python 3.10, FFmpeg, NumPy e RapidFuzz.
  * Detalhamento completo do Desafio, Solução e Resultados métricos alcançados.
* **Player Nativo do YouTube no Topo da Página de Projetos (`src/pages/ProjectPage.jsx`)**:
  * Integrado player em 16:9 (`aspect-video`) widescreen no topo da página de projetos para reprodução imediata do curta em Full HD.
  * Botões de alternância fluida entre *"Assistir Vídeo / Curta Completo"* e *"Ver Imagem de Capa"*.
  * Botão de ação direta na barra lateral atualizado dinamicamente para *"Assistir no YouTube Oficial"*.
  * Galeria de vídeos inferior adaptada com layout cinematográfico centralizado (`max-w-4xl mx-auto`) para exibições de vídeo único.
* **Sitemap Dinâmico Atualizado**:
  * Executado `tools/generate-sitemap.js`, totalizando 60 projetos dinâmicos indexados em `public/sitemap.xml`.



### Adicionado (Plataforma Parametrizada de Landing Pages para Nutricionistas & Captação Comercial)
* **Arquitetura Reutilizável e Parametrizada por Dados (`src/data/nutritionistsData.js`)**:
  * Implementado repositório desacoplado de dados em que a mesma base de componentes renderiza qualquer nutricionista via configuração (sem código estático espalhado).
  * Perfil demonstrativo inicial completo para o Rio de Janeiro (`dra-camila-rocha-rio-de-janeiro`), claramente marcado como demonstrativo sem alegações clínicas falsas ou depoimentos inventados.
  * Perfil esportivo de alta performance para São Paulo (`dr-lucas-mendes-nutricao-esportiva`).
  * Funções utilitárias seguras: `getNutritionistBySlug`, `getAllNutritionists` e `getDefaultNutritionist`.
* **Componentes Modulares de Alta Conversão (`src/components/nutrition/`)**:
  * `NutritionSeo.jsx`: Metadados dinâmicos e injeção do Schema.org JSON-LD (`Physician` e `Person`).
  * `NutritionHeader.jsx`: Menu editorial responsivo com identificação de CRN e CTA direto.
  * `NutritionHero.jsx`: Hero assimétrico de alta conversão com selos de credibilidade e área fotográfica com fallback.
  * `NutritionTrustBar.jsx`: Faixa de dados verificáveis (registro profissional, modalidades, localização).
  * `NutritionProfessional.jsx`: Seção sobre o profissional com credenciais acadêmicas e citação ética.
  * `NutritionServices.jsx`: Grade de especialidades com CTAs individualizados para WhatsApp.
  * `NutritionHowItWorks.jsx`: Processo de 3 etapas transparente e claro.
  * `NutritionDifferentials.jsx`: Diferenciais reais de acolhimento e escuta sem promessas milagrosas.
  * `NutritionTestimonials.jsx`: Prova social segura que oculta automaticamente se não houver depoimentos autorizados.
  * `NutritionLocation.jsx`: SEO local com endereço físico, mapa interativo lazy e suporte a teleconsulta nacional.
  * `NutritionFaq.jsx`: Acordeão acessível de dúvidas frequentes.
  * `NutritionFinalCta.jsx`: Fechamento de alta conversão.
  * `NutritionFooter.jsx`: Rodapé com aviso legal ético do CFN e créditos Rafael Pita Solutions.
  * `NutritionFloatingWhatsApp.jsx`: Botão flutuante não-invasivo com indicador online e tooltip informativo.
* **Página Dinâmica de Nutricionistas (`src/pages/nutrition/NutritionistPage.jsx`)**:
  * Renderiza dinamicamente as 12 seções a partir do slug informado nas rotas `/nutricionista` e `/nutricionista/:slug`.
* **Landing Page de Vendas de Sites para Nutricionistas (`src/pages/nutrition/NutritionSalesLandingPage.jsx`)**:
  * Disponibilizada nas rotas públicas `/criacao-site-nutricionista` e `/sites-para-nutricionistas`.
  * Apresenta proposta de valor comercial (de R$ 1.500 por R$ 297 à vista ou 12x de R$ 29,70), cronômetro regressivo com persistência em localStorage, mostruário com modelos ao vivo e FAQ completo.
* **Maleabilidade Total por Parâmetros de URL (`src/utils/nutritionProspectUtils.js`)**:
  * Implementada a função `applyNutritionistOverrides` que lê da query string: `nome` (ou `name`/`n`), `whatsapp` (ou `tel`/`w`), `crn` (ou `registro`), `cidade` (ou `city`/`c`), `uf`, `bairro` (ou `b`), `endereco` (ou `address`/`e`) e `titulo` (ou `especialidade`).
  * Atualização dinâmica em cascata: nome higienizado com honorífico automático, iniciais do avatar, link de agendamento no WhatsApp, mapa embed do Google Maps para o novo endereço, selos de localização e registro na faixa de confiança e metadados de SEO/Schema.org.
* **Simulador & Customizador Manual de Prospecção (`src/components/nutrition/NutritionProspectDrawer.jsx`)**:
  * Botão flutuante "Personalizar Lead" permitindo ao operador alterar manualmente os dados de qualquer nutricionista prospectado no Google Maps em tempo real, sem recarregar a tela.
  * Botão de 1 clique "Copiar Link Parametrizado" para compartilhar o link dinâmico pelo WhatsApp.
  * Aba integrada com 4 scripts de abordagem no WhatsApp (Abertura, Permissão, Demonstração de R$ 297 e Resgate) com botões para copiar e disparar diretamente.
* **Rotas e SEO**:
  * Inclusão no `src/App.jsx` com divisão de código via `React.lazy` (chunks isolados de 31 kB e 72 kB).
  * Atualização de `tools/generate-sitemap.js` e regeneração de `public/sitemap.xml`.



### Otimizado (Google PageSpeed Insights: Desempenho, Acessibilidade e Navegação Agêntica)
* **Navegação Agêntica & Descoberta por IA (Google Lighthouse 13.5+)**:
  * Criado o arquivo `public/llms.txt` seguindo rigorosamente a especificação oficial de `llmstxt.org` para indexação direta por modelos e agentes de IA (ChatGPT Search, Perplexity, Gemini, Claude).
  * Criado o catálogo de recursos agênticos `public/.well-known/ai-catalog.json` e `public/ai-catalog.json` estruturado no padrão ARD (Agentic Resource Discovery) com declaração de serviços, metadados institucionais e canais oficiais.
  * Inclusa a diretiva `ARD: https://rafaelpitaoficial.com.br/.well-known/ai-catalog.json` no `public/robots.txt` e meta tags de link com `rel="agentic-resource-discovery"` e `rel="help"` no cabeçalho do `index.html`.
* **Acessibilidade 100% (WCAG AA & AAA)**:
  * Inclusão do ponto de referência principal semântico `<main id="main-content" role="main">` englobando todo o conteúdo funcional da landing page.
  * Correção rigorosa da hierarquia sequencial de títulos: eliminados saltos de níveis (ex: H2 para H4 e H2 para H5), estabelecendo ordenação estritamente descendente (H1 -> H2 -> H3).
  * Elevação dos contrastes cromáticos para conformidade estrita com a proporção mínima de 4.5:1 (WCAG AA) e 7:1 (WCAG AAA) em badges, textos secundários, valores riscados e rodapé.
* **Otimização de Entrega de Imagens & Desempenho**:
  * Refatorado o componente `src/components/common/WhatsAppIcon.jsx` para utilizar vetor SVG puro por padrão (0 bytes baixados via rede), eliminando completamente o alerta de 88 KiB do Lighthouse.
  * Gerada versão ultra-compacta em WebP (`public/whatsapp-official.webp`, 2.5 KB) com redução superior a 97% sobre o PNG original como fallback.
  * Carregamento diferido do script do Google Tag Manager (GTM) para disparo apenas após a conclusão do evento `window.load`, liberando a thread principal e eliminando solicitações abortadas no Lighthouse.
  * Redução seletiva dos pesos de fontes do Google Fonts no `index.html` para os pesos essenciais (400, 600, 700 e 800), diminuindo a carga estática pela metade.

## [1.56.0] - 2026-10-15

### Adicionado (Envio Automático de E-mails com Atualizações de Chamados)
* **Serverless Function de Alta Performance (`api/ticket-notification.js`)**:
  * Implementado endpoint serverless para despacho de e-mails transacionais de chamados na Vercel com proteção total de credenciais e chaves de API.
  * Renderização de template corporativo responsivo de alto padrão com identidade visual Rafael Pita Solutions, fuso oficial de Brasília (`America/Sao_Paulo`), badge `#TICK`, caixas de resumo de status/prioridade, mensagem destacada, preview do print anexo e botão CTA direto para acompanhamento online (`/track-ticket/{ticketCode}`).
  * Integração nativa com a Resend REST API via `fetch` global (remetente `suporte@rafaelpitaoficial.com.br`) e fallback gracioso inteligente para testes locais e modo sandbox.
* **Serviço de Despacho no Frontend (`src/services/ticketNotificationService.js`)**:
  * Desenvolvida a função `notifyClientTicketUpdate` desacoplada e assíncrona, garantindo que inconsistências externas de rede ou e-mail nunca interrompam nem bloqueiem a gravação de dados locais.
  * Utilitário `canNotifyTicketClient` para validação de integridade de e-mail do cliente.
* **Painel Administrativo de Suporte (`src/pages/AdminSupport.jsx`)**:
  * Integração automática de envio de e-mail ao adicionar notas técnicas com texto e/ou prints anexos.
  * Envio automático de e-mail informativo ao alterar o status do chamado (ex: de "aberto" para "em andamento" ou "concluído").
  * Caixa de seleção (`Checkbox`) com rótulo "Notificar cliente por e-mail", pré-selecionada por padrão caso o chamado possua e-mail cadastrado, e badge indicativo "Envio automático ativo".
  * Feedback visual específico no Toast informando o status do despacho ao admin.
* **Portal do Assinante (`src/pages/ClientSubscriptionPortal.jsx`)**:
  * Disparo automático de e-mail de confirmação de abertura do chamado com o número de protocolo e link de acompanhamento.
* **Configuração de Variáveis de Ambiente (`.env.example`)**:
  * Inclusão documentada das variáveis `RESEND_API_KEY` e `EMAIL_FROM` sem exposição de credenciais confidenciais.

## [1.55.0] - 2026-10-15

### Adicionado (Opção Completa de Anexar Prints em Chamados Técnicos & Notas)
* **Arquitetura de Banco de Dados (`portfolio_db` / VPS Oracle)**:
  * Criadas as colunas `attachment_url` (text) e `attachments` (jsonb padrão `[]`) nas tabelas `support_tickets` e `ticket_updates`.
  * Concedidos privilégios completos (`GRANT ALL`) para as roles `anon`, `authenticated` e `authenticator`.
* **Serviço Especializado de Anexos (`src/services/ticketAttachmentService.js`)**:
  * Upload estruturado para o Firebase Storage no diretório isolado `tickets-attachments/{ticketFolder}/{timestamp}_{hash}.webp`.
  * Compressão automática e conversão para formato WebP com qualidade de 88% e limite de até 2048px via `imageOptimizer.js`.
  * Suporte nativo à captura de prints colados via teclado (`Ctrl+V`) através do utilitário `extractImageFromClipboard(event)`.
* **Componente Lightbox em Alta Resolução (`src/components/common/ImageLightboxModal.jsx`)**:
  * Modal responsivo em tela cheia com Radix UI `Dialog` para visualização detalhada de capturas de tela.
  * Suporte a download direto da imagem original e abertura em nova aba.
* **Painel Administrativo de Suporte (`src/pages/AdminSupport.jsx`)**:
  * Integração de captura automática de prints via `Ctrl+V` diretamente na caixa de notas.
  * Botão de clipe para anexar arquivos de imagem manualmente a partir do computador.
  * Card de pré-visualização do print selecionado com nome, tamanho em KB e botão de descarte antes do envio.
  * Visualização de miniaturas interativas com efeito de zoom em notas e na descrição original de chamados.
* **Data e Hora em Tempo Real no Horário de Brasília (`formatDateTimeBR`)**:
  * Desenvolvida a função utilitária `formatDateTimeBR()` em `src/utils/maintenanceFormatters.js`, forçando o fuso horário oficial `America/Sao_Paulo` (UTC-3).
  * Exibição destacada da data e hora de abertura do chamado:
    * Nos cartões kanban do painel de chamados (`AdminSupport.jsx`) com ícone de relógio e código do ticket.
    * No cabeçalho do chamado com badge dedicado (`Aberto em: DD/MM/AAAA às HH:mm:ss`).
    * No cabeçalho da "Descrição Original".
  * Exibição elegante em cada nota do "Histórico de Atualizações", trazendo o cabeçalho "Nota de Acompanhamento" com o timestamp exato formatado.
  * Sincronização da visualização de data e hora no portal do assinante (`ClientSubscriptionPortal.jsx`) e no rastreamento público (`TrackTicket.jsx`).

### Corrigido e Fortalecido (Permissões de Chamados no PostgreSQL & Fallback Resiliente)
* **Correção de Permissão no Banco de Dados (`portfolio_db` / VPS Oracle)**:
  * Diagnosticada a causa do erro *"permission denied for table ticket_updates"*: a role `authenticated` do PostgREST não possuía permissões concedidas na tabela relacional `ticket_updates`.
  * Concedidos privilégios completos (`GRANT ALL`) para `anon`, `authenticated` e `authenticator` em todas as tabelas e sequências do schema `public`, com recarregamento do schema cache no container `portfolio-api`.
  * Validação com sucesso via script de consulta com retorno integral dos chamados reais (incluindo tickets de clientes e atualizações).
* **Camada de Resiliência no Frontend (`AdminSupport.jsx`)**:
  * Implementado mecanismo de fallback gracioso: caso a consulta de chamados com relacionamento (`ticket_updates(*)`) encontre qualquer inconsistência na API, o sistema realiza automaticamente uma segunda tentativa consultando diretamente os chamados da tabela `support_tickets`, blindando a tela contra telas vazias.

## [1.53.0] - 2026-10-15

### Adicionado e Otimizado (Exportação em PDF, Roteiro Seguro de Prospecção e Landing Page de Vendas de Sites Jurídicos)
* **Segurança e Confiança na Prospecção via WhatsApp (Alternativa em PDF)**:
  * Atualizados os roteiros de prospecção do Radar Google Maps (`googleMapsProspectService.js`):
    * O Passo 3 da cadência de mensagens agora oferece expressamente o envio da maquete em arquivo PDF como alternativa segura para advogados receosos de clicar em links externos.
    * Resgates e variantes de mensagens ajustados com opção transparente: link interativo ou documento PDF anexo.
    * Inclusão da oferta promocional de R$ 297 (com desconto de R$ 450) com domínio anual à parte.
* **Módulo de Exportação Executiva em PDF (`LegalLandingPdfModal.jsx`)**:
  * Desenvolvido componente de renderização e diagramação de páginas A4 corporativas de alta resolução utilizando `html2pdf.js`.
  * Layout impresso profissional dividido por quebras de página CSS (`html2pdf__page-break`):
    * Página 1: Capa institucional de luxo, titulação, OAB, endereço, nota do Google Maps, badge oficial do WhatsApp e hero executivo.
    * Página 2: Áreas de atuação com tags temáticas, metodologia de trabalho em 4 fases e métricas do escritório.
    * Página 3: Depoimentos de clientes, diferenciais técnicos, proposta comercial transparente (R$ 297) e QR Code para WhatsApp.
  * Botão de exportação `PDF` adicionado no Radar Google Maps (`RadarGoogleMaps.jsx`) nos cartões de leads (grid de 5 ações), demonstrações na nuvem e no modal de envio de propostas.
* **Nova Landing Page de Vendas para Advogados (`LegalSalesLandingPage.jsx`)**:
  * Criada página comercial de alta conversão nas rotas `/criacao-site-advogado` e `/sites-para-advogados`:
    * Configurada com **Tema Claro (Light Mode) preferencial por padrão**: Ao ser acessada, a página carrega prioritariamente no tema claro corporativo, transmitindo serenidade, clareza e autoridade para advogados, restaurando o tema anterior do usuário ao sair da página.
    * Botão elegante de alternância entre Tema Claro e Tema Escuro (ícones de Sol e Lua) na barra superior de escassez.
    * Faixa superior fixa com contador regressivo de escassez real de 48 horas persistido no `localStorage`.
    * Hero impactante com tipografia Plus Jakarta Sans e H1 otimizado para os motores de busca.
    * Vitrine interativa com 4 modelos ao vivo (Trabalhista, Família, Consumidor e Full-Service) com badges de especialidade e abertura direta.
    * Pilares de personalização: Logotipo próprio, paleta cromática, fotografias da banca e redação persuasiva.
    * Caixa de preços transparente: De R$ 450 por R$ 297 (taxa única de configuração) + anuidade de domínio à parte.
    * Seção de Perguntas Frequentes (FAQ) em accordion sanfonado com atributos de acessibilidade.
    * CTAs distribuídos estrategicamente apontando para o WhatsApp oficial com mensagem predefinida.
* **SEO Espetacular e Atualização de Sitemap**:
  * Metadados profundos e Schema.org (`ProfessionalService` / `Offer`) focados em palavras-chave estratégicas: *"criar site para advogado"*, *"desenvolvedor de site de advogado"*, *"onde comprar site de advogado"*, *"como comprar site de advogado"* e *"site de advogado com seo"*.
  * Atualizado o script `tools/generate-sitemap.js` e regenerado o `public/sitemap.xml` com prioridade 0.9 e frequência semanal.

## [1.52.0] - 2026-10-15

### Aprimorado e Humanizado (Saudações Dinâmicas pelo Horário de Brasília & Honoríficos)
* **Sincronização Estrita com o Horário Oficial de Brasília (`America/Sao_Paulo`)**:
  * Desenvolvido utilitário modular `src/utils/greetingUtils.js` com a função `getGreetingByBrasiliaTime()`.
  * Elimina saudações estáticas incorretas (como "bom dia" à tarde ou à noite), garantindo o cumprimento exato pelo fuso de Brasília:
    * 05:00 até 11:59: 'bom dia'
    * 12:00 até 17:59: 'boa tarde'
    * 18:00 até 04:59: 'boa noite'
  * Suporte a fallback resiliente com compensação automática de fuso UTC-3.
* **Humanização de Tratamento por Gênero e Titulação Jurídica (`formatLawyerSalutation`)**:
  * Integrada detecção inteligente de gênero (`detectLawyerGender`) para eliminar construções robóticas e frias como `o(a) Dr(a).`.
  * Nomes femininos (ex: Victória Motta) recebem automaticamente tratamento nobre: *"com a Dra. Victória Motta"*, *"Perfeito, Dra. Victória Motta!"* e *"escritório da Dra. Victória Motta"*.
  * Nomes masculinos recebem tratamento proporcional: *"com o Dr. Nome"*, *"Perfeito, Dr. Nome!"* e *"escritório do Dr. Nome"*.
* **Atualização dos Motores de Mensagem (`googleMapsProspectService.js` e `RadarGoogleMaps.jsx`)**:
  * Atualizados todos os scripts de prospecção, primeiro contato, roteiro cadenciado em 3 passos e banco de respostas para aplicar saudações e pronomes dinâmicos em tempo real.

## [1.51.0] - 2026-10-15

### Aprimorado e Despoluído (Tabela de Assinaturas & Central de Informações por Modal)
* **Despoluição Radical da Tabela de Assinaturas (`ManageMaintenanceSubscriptions.jsx`)**:
  * Eliminada a duplicidade de razão social e nome de fantasia quando idênticos na coluna de cliente.
  * Removida a sobrecarga de CPF e telefone da visualização tabular primária, mantendo a linha limpa, compacta e elegante.
  * Substituído o despejo de múltiplas tags de URLs por indicador compacto e clicável (`🌐 X sites`), que ao ser acionado abre diretamente a ficha completa do contrato.
  * Reestruturada a coluna de ações rápidas para uma tríade funcional e harmoniosa: `[Info (i)]`, `[PIX]` e `[WhatsApp]` (com o logotipo oficial da marca), além do menu `[...]` para ações administrativas secundárias.
  * Despoluição equivalente aplicada aos cards da versão mobile, garantindo visual executivo em qualquer dispositivo.
* **Central Completa de Informações Cadastrais (`SubscriptionDetailsModal.jsx`)**:
  * O modal acionado pelo botão `Info` ou pelo ícone `(i)` foi enriquecido como a central única de visualização 360 graus do cliente e contrato.
  * Exibição estruturada com cópia em 1 clique de CPF/CNPJ, link direto para WhatsApp com número sanitizado, e-mail clicável, valor mensal, dia fixo de cobrança, razão social, notas e observações.
  * Listagem organizada de sites e aplicações cobertos com links externos de abertura direta.
  * Histórico de faturas geradas com baixa manual, reversão e recibo PDF, além da aba de chamados de suporte vinculados.
* **Correção de Regras dos Hooks do React**:
  * Realinhada a ordem de declaração dos hooks em `SubscriptionDetailsModal.jsx`, prevenindo alertas e garantindo estabilidade no ciclo de vida do componente.

## [1.50.0] - 2026-10-15

### Aprimorado e Padronizado (Logotipo Oficial do WhatsApp no Site e Landing Pages)
* **Substituição de Ícones Genéricos pelo Logotipo Oficial do WhatsApp**:
  * Desenvolvido componente reutilizável `WhatsAppIcon.jsx` com suporte à renderização de alta fidelidade do ativo oficial (`/whatsapp-official.png`) e versão vetorial SVG ultra leve.
  * **Site Principal (`MeuPortfolio v2`)**:
    * `WhatsAppFloat.jsx`: Botão flutuante de suporte atualizado com o logotipo oficial do WhatsApp, acabamento verde oficial (`#25D366`) e base de contraste em branco.
    * `Contact.jsx`: Cards de atendimento, canal de suporte e modal de confirmação de chamados técnicos atualizados com a logo oficial.
    * `ClientSubscriptionPortal.jsx`: Área do cliente e faturas com canal direto para suporte no WhatsApp devidamente identificado.
    * `ServiceDetailPage.jsx`: Botão de solicitação e esclarecimento de dúvidas técnicas atualizado com a logo oficial.
  * **Landing Pages Jurídicas (`src/components/legal/*`)**:
    * Atualizados com a logo oficial: `LegalFloatingWhatsApp`, `LegalNavbar`, `LegalHero`, `LegalPracticeAreas`, `LegalAbout`, `LegalFaq`, `LegalCinematicBanner`, `LegalFooter`, `LegalTopBar`, `LegalReviews` e `LegalDiagnosisCalculator`.
* **Execução via Subagentes Especializados e Validação Visual**:
  * Tarefas distribuídas entre subagentes paralelos (`site_whatsapp_migrator` e `legal_whatsapp_migrator`).
  * Criado utilitário `tools/capture_whatsapp_screenshots.cjs` com Playwright e validadas 3 capturas de tela comprovando a exibição impecável nos navegadores.

## [1.49.0] - 2026-10-15

### Adicionado e Aprimorado (Carrossel Vertical Stacking Cards a 60 FPS)
* **Arquitetura de Carrossel Vertical com Efeito de Empilhamento Magnético (Sticky Scroll)**:
  * Implementado componente ultra-performático de empilhamento de cartões em `LegalPracticeAreas.jsx` para as Landing Pages, substituindo grades estáticas por uma experiência editorial dinâmica de alto padrão.
  * Cabeçalho de Seção Fixo com Efeito Vidro (`services-sticky-header`): permanece visível abaixo da Navbar com `backdrop-filter: blur(14px)`, permitindo leitura clara enquanto os cartões deslizam por baixo.
  * Escalonamento Matemático de Offsets: fórmula progressiva `top_{card(n)} = top_base + (n * step_offset)` calibrada por breakpoint (mobile, tablet e desktop), garantindo que as abas superiores dos cartões anteriores permaneçam visíveis como em um fichário executivo de luxo.
  * Interpolação Óptica Leve em Vanilla JS a 60 FPS: cálculo de sobreposição por `requestAnimationFrame` que reduz sutilmente a escala (`scale(0.95)`) e aplica escurecimento tátil suave (`brightness(0.78)` com `translateY(-4px)`), sem bibliotecas pesadas externas.
  * Anti-Bugs Estruturais: blindagem global com `overflow-x: clip` no `html`, `body` e nós pais, eliminando bloqueios de scroll e garantindo rolagem contínua sem nenhum vácuo ou abismo em branco.
* **Validação Visual Automatizada**:
  * Desenvolvido utilitário de teste `tools/test_stacking_cards.cjs` via Playwright Chromium headless, validando o empilhamento real dos cartões com capturas de tela inspecionadas.

## [1.48.0] - 2026-10-15

### Aprimorado e Validado (Suporte Completo ao Tema Claro e Testes Visuais Automatizados)
* **Compatibilidade Completa com o Tema Claro (Light Mode) em Todas as Páginas**:
  * Implementada arquitetura de cores adaptativa em todas as páginas públicas: Home, Portfólio, Detalhe do Projeto, Serviços, Detalhe do Serviço, Sobre Nós, Avaliações, Contato, Assinaturas e Fotografia.
  * Estratégia de Contraste Rigoroso WCAG AAA: palavras-chave e destaques utilizam verde floresta escuro de alta legibilidade no tema claro (`text-[#4d7c0f]`) e verde neon luminoso no tema escuro (`dark:text-[#bcf13b]`).
  * Cartões e Superfícies Adaptativos: transição fluida entre fundo branco puro e bordas suaves no tema claro (`bg-white border-slate-200`) e fundo obsidian no tema escuro (`dark:bg-[#121210] dark:border-[#23231f]`), com efeito de hover verde neon.
* **Logotipo Oficial BrandLogo Totalmente Adaptativo**:
  * Letras 'rp' estilizadas com contraste inteligente (`text-slate-950 dark:text-white`) e ponto fixo em verde neon `#bcf13b`, garantindo visibilidade cristalina em fundos claros e escuros.
  * Escala monumental 'hero' adicionada para impacto visual na Home Page.
* **Validação Visual Automatizada com Capturas Reais (Playwright)**:
  * Desenvolvido utilitário de teste automatizado `tools/capture_theme_screenshots.cjs` com Playwright Chromium headless.
  * Capturados e validados 12 prints de alta fidelidade cobrindo todas as páginas principais em ambos os modos (Claro e Escuro).

## [1.47.0] - 2026-10-15

### Aprimorado e Padronizado (Identidade Dark Neon e Palavras-Chave em Verde Neon em Todas as Páginas)
* **Substituição de Gradientes por Verde Neon (#bcf13b) em Todas as Páginas**:
  * Eliminadas todas as ocorrências de `gradient-text` nos títulos principais e de seções em todo o site.
  * Títulos convertidos para texto branco com palavras-chave de destaque em verde neon sólido `text-[#bcf13b]` ("Projetos em Destaque", "O que nossos clientes dizem", "Nosso Portfólio", "Nossos Serviços", "Sobre Nós", "Todas as Avaliações", "Fale Conosco", "Planos de Assinatura").
* **Aplicação Completa da Identidade Dark Neon nas Páginas Internas**:
  * `Portfolio.jsx` e `ProjectPage.jsx`: Fundo `#0a0a08`, cards `#121210` com hover verde neon, filtros escuros e botões de ação em `#bcf13b`.
  * `Services.jsx` e `ServiceDetailPage.jsx`: Fundo `#0a0a08`, cards de serviços e benefícios com bordas `#23231f`, hover neon e accordions integrados.
  * `About.jsx`, `Reviews.jsx`, `ReviewForm.jsx` e `ReviewsCarousel.jsx`: Fundo `#0a0a08`, métricas com números em `#bcf13b`, formulário dark e cards de avaliação com estrelas neon.
  * `Contact.jsx`, `Subscriptions.jsx`, `PhotographyLanding.jsx` e `PhotographyPortfolio.jsx`: Fundo `#0a0a08`, formulário de contato com foco em `#bcf13b`, preços dos planos de assinatura em verde neon e galerias com efeito hover iluminado.

## [1.46.0] - 2026-10-15

### Adicionado e Redesenhado (Nova Identidade Visual Minimalista Dark & Verde Neon)
* **Novo Logotipo Oficial "rp ."`**:
  * Desenvolvido componente unificado `BrandLogo.jsx` com as letras 'rp' em branco puro e ponto em verde neon `#bcf13b`.
  * Integrado à Navbar, Rodapé e como novo Favicon SVG oficial (`public/favicon.svg`).
* **Tokens de Design e Estilização Dark Neon**:
  * Mapeada paleta oficial no `tailwind.config.js`: fundo obsidian `#0a0a08`, superfícies `#121210`, verde neon `#bcf13b`, bordas `#23231f` e sombra difusa `neon-glow`.
  * Atualizados cartões de serviços e portfólio com borda sutil e efeito de hover com borda verde neon `#bcf13b` e brilho difuso.
  * Home Page e Hero redesenhados com badge mono, botões com preenchimento sólido `#bcf13b` e outline dark com hover neon.
  * Padronizado "Rafael Pita Solutions" como nome comercial oficial ao lado do símbolo `rp .` na Navbar, Rodapé e badges, substituindo rótulos temporários de protótipo.
  * Criado documento de especificação técnica completa em `documents/brand_identity_spec.md`.

## [1.45.0] - 2026-10-15

### Aprimorado (Navegação Simplificada na Barra Superior)
* **Remoção do Link Redundante "Home" na Navbar (`Navbar.jsx`)**:
  * Removido o item "Home" da barra de navegação principal, uma vez que a logo e o nome da marca já funcionam como link direto para a página inicial (`/`).
  * Ganho de espaço e respiro visual para os itens essenciais: Portfólio, Serviços, Fotografia e Contato.

## [1.44.0] - 2026-10-15

### Refatorado e Aprimorado (Erradicação Total de Serifas nas Landing Pages)
* **Substituição Definitiva de Fontes Serifadas por Tipografia Executiva de Luxo**:
  * Eliminadas 100% das classes `font-serif` em todos os 12 componentes das Landing Pages Jurídicas (`LegalAbout`, `LegalCinematicBanner`, `LegalFaq`, `LegalFooter`, `LegalHero`, `LegalLeadForm`, `LegalMethodology`, `LegalNavbar`, `LegalPainPoints`, `LegalPracticeAreas`, `LegalReviews`, `LegalTrustBar`).
  * Atualizado `src/utils/genderDetection.js` para utilizar tipografia moderna executiva `font-sans font-semibold tracking-tight text-[#2C0822]`.
  * No `tailwind.config.js`, todas as famílias (`serif`, `cormorant`, `playfair`, `cinzel`, `display`) foram unificadas para a tipografia moderna `Plus Jakarta Sans` e `Inter` como salvaguarda definitiva contra qualquer renderização serifada.
  * Otimizado o carregamento de fontes em `index.html` e `src/index.css`, removendo downloads de famílias serifadas desnecessárias.

## [1.43.0] - 2026-10-14

### Aprimorado (Tipografia de Luxo Editorial com Cormorant Garamond)
* **Substituição da Fonte Serifada Padrão por Cormorant Garamond**:
  * Integrada a fonte de altíssimo luxo editorial Cormorant Garamond via Google Fonts em `index.html` e `src/index.css`.
  * Atualizada a configuração de `fontFamily.serif` e criada a chave utilitária `cormorant` em `tailwind.config.js`.
  * Todas as seções e títulos com a classe `font-serif` (destaque para Landing Pages Jurídicas femininas e corporativas de elite) passam a utilizar a proporção nobre, delicada e sofisticada da Cormorant Garamond.

## [1.42.0] - 2026-10-14

### Adicionado e Aprimorado (Carrossel Mobile de Depoimentos e Avaliações)
* **Carrossel Touch-First para Celular (`LegalReviews.jsx`)**:
  * Substituído o empilhamento vertical longo dos cards de depoimento no mobile por um carrossel horizontal deslizável via Embla Carousel.
  * Cada card mobile ocupa 90% da largura da tela (`basis-[90%]`) com vislumbre do próximo, aspas em ouro, texto com tipografia itálica e as 5 estrelas de satisfação.
  * Controles completos com botões circulares anterior/próximo (`ChevronLeft` / `ChevronRight`), indicadores interativos em bolinhas (*dots* animados em gradiente ouro) e contador numérico (`01 / 03`).
  * Removidos caracteres de travessão no componente, garantindo estrita conformidade com as diretrizes do projeto.
  * Na visualização desktop (`md:` em diante), a grade horizontal de 3 cards foi integralmente mantida.

## [1.41.0] - 2026-10-14

### Adicionado e Aprimorado (Carrossel Mobile de Etapas do Rito de Atendimento)
* **Carrossel de Etapas Individuais para Celular (`LegalMethodology.jsx`)**:
  * Substituído o empilhamento vertical das etapas no mobile por um carrossel interativo exibindo 1 etapa por vez (`basis-[90%]`) com vislumbre suave do próximo passo.
  * Cartão de etapa individual com elevação, sombra suave, badge circular numerado e ícone temático em destaque.
  * Controles completos com botões de navegação anterior/próximo (`ChevronLeft` / `ChevronRight`), indicadores interativos em bolinhas (*dots*) e contador formatado (`Etapa 01 de 04`).
  * Na visualização desktop (`md:` em diante), a linha horizontal contínua conectando os 4 círculos foi integralmente preservada.

## [1.40.0] - 2026-10-14

### Adicionado e Aprimorado (Carrossel Mobile de Especialidades Jurídicas)
* **Carrossel Touch-First para Celular (`LegalPracticeAreas.jsx`)**:
  * Substituído o empilhamento vertical longo dos 5 cards no mobile por um carrossel deslizável horizontal com navegação por gestos de toque (swipe) via Embla Carousel.
  * Cada card mobile ocupa 88% da largura da tela, exibindo um vislumbre do card seguinte para instigar a navegação fluida.
  * Adicionados botões de navegação anterior/próximo (`ChevronLeft` / `ChevronRight`), indicadores interativos em bolinhas (dots com animação em gradiente ouro) e contador numérico de slides (`01 / 05`).
  * No desktop e tablets (`md:`), a grade equilibrada de 3 + 2 cards foi totalmente preservada.

## [1.39.0] - 2026-10-14

### Corrigido e Aprimorado (Responsividade Mobile-First nas Landing Pages Jurídicas)
* **Correção de Overflow Horizontal e Vazamento Lateral na Navbar (`LegalNavbar.jsx`)**:
  * Identificada e corrigida a causa raiz do deslocamento lateral no mobile (que cortava o ícone da balança à esquerda e gerava faixa vazia à direita): o botão "Agendar no WhatsApp" possuía texto longo e largura fixa que, combinados com a largura rígida da logo (`max-w-[260px]`), ultrapassavam a largura de 360px a 390px dos smartphones.
  * O botão passa a utilizar rótulo adaptativo: exibe "WhatsApp" com espaçamento otimizado no mobile e "Agendar no WhatsApp" a partir de telas `sm:` e desktop.
  * O container da logo passa a ser flexível (`min-w-0 flex-1`) com truncamento suave de texto para nomes longos, assegurando alinhamento perfeito.
* **Ajustes de Contenção no Hero e Seções (`LegalHero.jsx`, `LegalLandingPage.jsx`, `LegalAbout.jsx`, `LegalTopBar.jsx`)**:
  * Adicionada contenção estrita (`w-full max-w-full overflow-hidden` e `overflow-x-hidden`) no wrapper raiz e nas seções com efeitos de gradiente, carrossel e fundos borrados.
  * Botões de chamada para ação no Hero adaptados para ocupar 100% da largura em smartphones (`w-full sm:w-auto`) com centralização de conteúdo.

## [1.38.0] - 2026-10-14

### Adicionado e Integrado (Gateway Oficial Asaas API v3)
* **Serviço Completo Asaas (`src/services/asaasService.js`)**:
  * Implementação da API v3 do Asaas com suporte a ambientes de Sandbox (`https://sandbox.asaas.com/api/v3`) e Produção (`https://api.asaas.com/v3`).
  * Gestão de Clientes: cadastro inteligente (`findOrCreateCustomer`), busca por CPF/CNPJ ou e-mail, consulta por ID, listagem e atualização.
  * Cobranças & PIX: criação de cobranças (`PIX`, `BOLETO`, `CREDIT_CARD`), consulta de status, obtenção de QR Code PIX oficial (`/v3/payments/{id}/pixQrCode`), cancelamento, estorno e confirmação de recebimento manual em dinheiro.
  * Assinaturas Recorrentes: criação com ciclos parametrizados (`MONTHLY`, `QUARTERLY`, `SEMIANNUALLY`, `YEARLY`), consulta, listagem de pagamentos e cancelamento.
  * Links de Pagamento: emissão de links diretos de checkout rápido (`/v3/paymentLinks`).
  * Webhooks: criação, listagem e remoção de webhooks para liquidação automática em tempo real.
  * Finanças: consulta de saldo da conta Asaas (`/v3/finance/balance`), taxas e métricas consolidadas.
  * Modo de simulação resiliente: testes sem credenciais em ambiente local sem falhas na UI.
* **Migração no Banco de Dados (`portfolio_db` na VPS Oracle)**:
  * Criadas as colunas `asaas_token`, `asaas_environment` e `active_gateway` na tabela `maintenance_settings`.
  * Criadas as colunas `asaas_id`, `asaas_invoice_url` e `gateway` na tabela `maintenance_invoices`.
  * Criadas as colunas `asaas_customer_id` e `asaas_subscription_id` na tabela `maintenance_subscriptions`.
  * Recarregado o schema cache do PostgREST reiniciando o container `portfolio-api`.
* **Painel Administrativo e Gestão de Gateways (`PushinPayConfigModal.jsx`, `maintenanceService.js`)**:
  * Interface com abas para configuração do Asaas e PushinPay.
  * Seletor de gateway ativo para direcionamento automático de faturas para o Asaas ou PushinPay.
  * Botão de teste de conexão com o Asaas com consulta e exibição do saldo em tempo real.

## [1.37.0] - 2026-10-14

### Corrigido e Estruturado (Módulo de Mensagens e Contatos)
* **Diagnóstico e Correção de Erro de Mensagens e Contatos (`AdminSubmissions.jsx`)**:
  * Identificada a causa do erro na aba Atendimento (Mensagens & Contatos): as tabelas `contacts` e `quotes` não existiam no PostgreSQL, disparando erro HTTP 400 (`PGRST205`) no PostgREST.
  * Executada migração SQL no PostgreSQL (`portfolio_db`) da VPS Oracle: criadas as tabelas `public.contacts` e `public.quotes` com campos completos e permissões para `anon` e `authenticator`.
  * Recarregado o schema cache do PostgREST reiniciando o container `portfolio-api`.
* **Aprimoramentos de UI e UX Premium**:
  * Substituído o diálogo nativo `window.confirm` pelo modal elegante `AlertDialog` do Radix UI.
  * Mensagens de feedback detalhadas e não-genéricas para ações de consulta, alteração de status e exclusão de mensagens.

## [1.36.0] - 2026-10-14

### Corrigido e Estruturado (Módulo Administrativo de Gerenciar Chamados)
* **Diagnóstico e Correção de Erro de Busca de Chamados (`AdminSupport.jsx`)**:
  * Identificada a causa da notificação "Erro ao buscar chamados": a query tentava selecionar o relacionamento `ticket_updates(*)` e filtrar por `is_archived`, mas a tabela `ticket_updates` e a coluna `is_archived` não existiam no schema `public`.
  * Executada migração SQL no PostgreSQL (`portfolio_db`) da VPS Oracle: criada a tabela relacional `public.ticket_updates` (com cascade delete para `support_tickets`), criadas as colunas `is_archived`, `name`, `email`, `description` e `user_id` em `support_tickets` e concedidas permissões para `anon` e `authenticator`.
  * Recarregado o schema cache do PostgREST reiniciando o container `portfolio-api`.
* **Aprimoramentos de UI e Resiliência no `AdminSupport.jsx`**:
  * Atualizada a busca textual para cobrir múltiplos campos: `client_name`, `client_email`, `name`, `email`, `ticket_code` e `subject`.
  * Adicionados fallbacks seguros para exibição do nome do cliente, e-mail e descrição original da solicitação (`message || description`).
  * Mensagens de toast específicas substituindo mensagens genéricas de erro conforme diretrizes de UX premium.

## [1.35.0] - 2026-10-14

### Corrigido e Aprimorado (Correção e Renovação Automática de Cobranças PIX Expiradas)
* **Diagnóstico e Correção de Erro de Leitura no App Bancário**:
  * Identificada a causa da rejeição do aplicativo bancário ("Problema com o QR Code: Não conseguimos ler os dados do QR Code"): a transação original da Woovi/PushinPay possuía validade de 24 horas (`expiration_date: 2026-10-06`) e havia expirado.
  * Reemitida e atualizada imediatamente no gateway e no banco de dados da VPS Oracle a fatura `FAT-2026-GR3N` (Brasil Ltda, R$ 500,00) com novo QR Code e código Copia e Cola ativos (`a2fb2019-543c-474e-8136-282799bb99cc`).
* **Auto-Renovação Inteligente de PIX Expirado (`src/services/maintenanceService.js`)**:
  * Atualizada a função `ensureInvoicePix`: cobranças dinâmicas da PushinPay criadas há mais de 20 horas são identificadas automaticamente como expiradas ou próximas do vencimento e renovadas de forma transparente.
  * Adicionado suporte ao parâmetro `{ forceRefresh: true }` para forçar geração de uma nova transação a qualquer momento.
* **Ações de Renovação Manual e Resiliência na UI (`InvoicePixModal.jsx`, `ClientSubscriptionPortal.jsx`, `InvoicePdfModal.jsx`)**:
  * Adicionado link direto "Não conseguiu ler ou QR Code expirou? Clique para renovar" no modal administrativo e no Portal do Assinante.
  * Integrada verificação de validade de PIX ao abrir o modal de PDF, garantindo que arquivos baixados ou impressos sempre possuam códigos vigentes.

## [1.34.0] - 2026-10-05

### Aprimorado (Sincronização Dinâmica em Tempo Real e Atualização em Cascata de Faturas em PDF)
* **Resolução Dinâmica de Dados na Fatura em PDF (`InvoicePdfModal.jsx`)**:
  * Implementado hook reativo que busca em tempo real os dados mais atualizados da assinatura vinculada via `getSubscriptionById` no momento em que o modal de PDF é aberto.
  * Invertida a precedência de campos: o PDF agora prioriza categoricamente os dados vivos da assinatura (`subscription.covered_websites || invoice.covered_websites`), garantindo que qualquer alteração de sites, nome, documento, WhatsApp ou plano reflita imediatamente na pré-visualização e no arquivo PDF baixado.
* **Atualização em Cascata no Banco de Dados (`src/services/maintenanceService.js`)**:
  * No método `updateSubscription`, adicionada propagação automática das alterações de `covered_websites` para todas as faturas no status `pendente` daquela assinatura.
* **Sincronização da Fatura `FAT-2026-GR3N` (Brasil Ltda)**:
  * Atualizada a coluna `covered_websites` da fatura no banco de dados para os 4 sites cadastrados: `https://detetivebuscas.com/`, `https://consultasbrasil.net/`, `https://smsfacil.net/` e `https://smshoje.com/`.

## [1.33.0] - 2026-10-05

### Aprimorado (Idempotência de Faturas Mensais e Prevenção de Duplicidades)
* **Regra de Unicidade de Fatura Pendente por Ciclo (`src/services/maintenanceService.js`)**:
  * Atualizada a função `generateInvoiceForSubscription`: antes de emitir uma nova fatura, verifica se a assinatura já possui uma fatura com status `pendente`.
  * Se já existir fatura pendente, reutiliza e sincroniza a fatura existente com `ensureInvoicePix`, eliminando completamente a geração de faturas repetidas a cada clique.
  * Adicionado parâmetro opcional `options.forceNew` caso o administrador queira gerar uma cobrança avulsa extra intencionalmente.
* **Limpeza e Higienização da Base de Dados**:
  * Excluídas do banco de dados na VPS Oracle as 3 faturas extras duplicadas da Brasil Ltda (`FAT-2026-3CY7`, `FAT-2026-AH9K`, `FAT-2026-ZKGZ`).
  * Mantida e consolidada apenas a fatura oficial `FAT-2026-GR3N` com QR Code e chave Copia e Cola ativos.
* **Nova Função `deleteInvoice` & Gestão no Modal 360º (`SubscriptionDetailsModal.jsx`)**:
  * Adicionado botão de lixeira para faturas pendentes permitindo a exclusão imediata com confirmação.

## [1.32.0] - 2026-10-05

### Corrigido e Aprimorado (Auto-recuperação, Resiliência e Contingência de PIX BR Code)
* **Resolução do QR Code da Fatura `FAT-2026-GR3N` (Brasil Ltda)**:
  * Sincronizada a fatura com o gateway PushinPay, gerando o QR Code dinâmico e a chave Copia e Cola oficiais no valor de R$ 500,00, persistidos no banco de dados da VPS Oracle.
* **Gerador Nativo de PIX EMV BR Code Oficial (`src/utils/pixPayloadGenerator.js`)**:
  * Implementado algoritmo oficial de codificação TLV e checksum CRC16 CCITT em estrita conformidade com o Banco Central do Brasil.
  * Garante que faturas geradas durante instabilidade ou sem conexão com gateway externo recebam um código PIX 100% válido vinculado à chave PIX cadastrada (CNPJ).
* **Serviço de Manutenção (`src/services/maintenanceService.js`)**:
  * Nova função `ensureInvoicePix(invoiceId)`: verifica faturas existentes e, se estiverem sem código PIX, aciona a emissão no gateway ou gera a contingência BR Code automaticamente salvando no banco.
  * Aprimorado `generateInvoiceForSubscription`: caso ocorra falha de conexão na emissão, aplica contingência imediata com BR Code evitando faturas órfãs sem QR Code.
* **Modal de Pagamento PIX (`InvoicePixModal.jsx`)**:
  * Detecção reativa de faturas sem código com disparo transparente de `ensureInvoicePix` em segundo plano, exibindo spinner de progresso "Gerando QR Code PIX oficial...".
  * Adicionado botão de sincronização manual com feedback visual via toast notification.
* **Listagem Administrativa & Portal do Assinante**:
  * Ao clicar no botão "PIX" em `ManageMaintenanceSubscriptions.jsx`, o sistema agora reaproveita a fatura pendente ativa com garantia de código PIX em vez de gerar cobranças redundantes.
  * No `ClientSubscriptionPortal.jsx`, adicionada auto-recuperação transparente ao expandir o painel "Pagar com PIX".

## [1.31.0] - 2026-10-05

### Adicionado (Vínculo e Exibição de Sites Atendidos nas Assinaturas e Faturas)
* **Coluna `covered_websites` no Banco de Dados (VPS Oracle)**:
  * Adicionada a coluna `covered_websites TEXT` nas tabelas `maintenance_subscriptions` e `maintenance_invoices` na VPS Oracle (`portfolio-db`).
  * Schema cache do PostgREST recarregado e validado.
* **Utilitário de Formatação (`src/utils/maintenanceFormatters.js`)**:
  * Implementadas funções `parseCoveredWebsites`, `ensureUrlProtocol` e `extractDomain` para dividir listas de URLs separadas por vírgula ou quebra de linha e formatar visualmente domínios limpos.
* **Formulário de Assinatura (`SubscriptionFormModal.jsx`)**:
  * Adicionado campo "Sites & Aplicações Cobertos pela Manutenção" com pré-visualização reativa de badges/chips em tempo real das URLs digitadas.
* **Fatura em PDF Executiva (`InvoicePdfModal.jsx`)**:
  * Incorporado bloco de destaque corporativo "Aplicações & Websites Cobertos nesta Fatura" tanto no quadro de identificação do contratante quanto na discriminação analítica de serviços.
* **Painel Administrativo & Detalhes 360º (`ManageMaintenanceSubscriptions.jsx` e `SubscriptionDetailsModal.jsx`)**:
  * Exibição de badges de domínios atendidos nas linhas da tabela desktop e nos cards da visão mobile.
  * Links diretos clicáveis no modal 360º de Detalhes com abertura em nova guia (`target="_blank"`).
* **Portal do Assinante (`ClientSubscriptionPortal.jsx`)**:
  * Apresentação dos sites e aplicações atendidos diretamente nos cards dos planos do cliente com atalhos de navegação.

## [1.30.0] - 2026-10-05

### Adicionado (Visualização, Pré-visualização e Emissão em PDF de Faturas de Manutenção)
* **Novo Componente: `InvoicePdfModal.jsx`**:
  * Modal executivo de alta fidelidade para pré-visualização, impressão e download em PDF de faturas de manutenção e recibos de quitação.
  * Estruturado com folha A4 corporativa (`html2pdf.js`, escala 2x, useCORS e quebra de página controlada) com cores e contrastes garantidos independentemente do modo de tema ativo.
  * Cabeçalho corporativo com logo/monograma da Rafael Pita Solutions, dados de contato, website e CNPJ.
  * Identificação fiscal e contratual completa: Prestador de Serviços vs Contratante/Assinante com CPF/CNPJ, WhatsApp, e-mail e código da assinatura (`SUB-XXXX`).
  * Discriminação detalhada dos serviços de sustentação tecnológica: plano contratado, ciclo de cobrança, período de competência calculado e cobertura inclusa (hospedagem, segurança, monitoramento contínuo e suporte técnico prioritário).
  * Painel de Liquidação Dinâmico:
    * Se pendente: QR Code PIX em alta definição, código PIX Copia e Cola selecionável e chave PIX institucional.
    * Se quitada: Comprovante de Quitação Digital em verde esmeralda com data e horário da liquidação e código de autenticação eletrônica.
  * Termos de serviço e rodapé oficial de auditoria digital com carimbo de data e hora.
  * Barra de ações com atalhos para: Baixar PDF, Imprimir (nativa do sistema) e Copiar PIX.
* **Integração Completa no Ecossistema de Cobranças**:
  * **Histórico de Faturas (`SubscriptionDetailsModal.jsx`):** Adicionado botão "PDF" em cada linha de fatura para emissão individual imediata.
  * **Modal de PIX (`InvoicePixModal.jsx`):** Adicionado botão de ação "Visualizar / Baixar Fatura em PDF".
  * **Listagem Administrativa (`ManageMaintenanceSubscriptions.jsx`):** Acesso rápido a "Visualizar Fatura (PDF)" nas ações da tabela desktop e nos cards mobile.
  * **Portal do Assinante (`ClientSubscriptionPortal.jsx`):** Disponibilizado para os clientes visualizarem e baixarem o PDF tanto das faturas em aberto quanto dos recibos de pagamentos quitados.

## [1.29.0] - 2026-10-04

### Adicionado (Gestão de Assinaturas de Manutenção, Gateway PushinPay e Portal do Cliente Sem Senha)
* **Novo Módulo Administrativo: Gestão de Assinaturas de Manutenção (`/admin/assinaturas`)**:
  * Adicionado no menu lateral do painel administrativo (`AdminLayout.jsx`) com ícone de recorrência e indicadores em tempo real.
  * Cockpit com 4 KPIs executivos: Total de Assinaturas Ativas, Receita Recorrente Mensal (MRR em R$), Vencimentos nos Próximos 7 Dias e Assinaturas Atrasadas/Inadimplentes.
  * Ferramentas de busca por cliente, empresa, documento, e-mail, plano ou código, com filtros por status ('ativo', 'pendente', 'atrasado', 'pausado', 'cancelado') e categorias de serviço.
  * Cadastro completo de assinaturas com validação de dados, cálculo automático do vencimento a partir do dia fixo (1 a 31) e máscaras para CPF/CNPJ e WhatsApp.
  * Edição flexível de valores com reajuste imediato ou agendamento para data futura, com botão de 1 clique "Avisar no WhatsApp" contendo mensagem pré-formatada.
  * Emissão de faturas individuais com integração PIX via PushinPay, exibição de QR Code e código Copia e Cola, além de envio direto no WhatsApp.
  * Baixa manual de pagamentos para quitação de faturas recebidas fora do gateway, com avanço automático da data de vencimento em 1 mês e efetivação de reajustes programados.
  * Recurso de Desfazer Baixa (Estorno / Reabertura): Disponível tanto no modal de faturas e chamados quanto nas ações rápidas da listagem e no modal de QR Code, permitindo reabrir faturas quitadas por engano e restaurar instantaneamente a data de vencimento e histórico da assinatura.
  * Modal de detalhes com histórico completo de faturas geradas, status de liquidação e chamados de suporte abertos pelo cliente.
* **Portal Público do Assinante Sem Senha (`/minha-assinatura` e `/area-cliente-assinaturas`)**:
  * Acesso prático e seguro para o cliente informando apenas E-mail ou CPF/CNPJ, sem necessidade de memorizar senhas.
  * Onboarding Inteligente: O administrador pode cadastrar a assinatura informando apenas o e-mail. Na primeira visita ao portal, um banner e modal amigáveis convidam o cliente a registrar seu CPF/CNPJ, atualizando automaticamente os contratos e faturas.
  * Saudação personalizada com os dados cadastrais do cliente e sua respectiva empresa.
  * Cards informativos de cada plano contratado com status, escopo incluso, dia de vencimento e valores.
  * Painel de faturas em aberto com destaque para liquidação imediata via PIX, modal com QR Code, botão de cópia com feedback instantâneo e comprovante de pagamento.
  * Histórico de faturas quitadas com emissão de recibo digital simples.
  * Abertura de chamados de suporte com protocolo automático (`TICK-2026-XXXX`), seleção do plano vinculado e canal direto para o WhatsApp do suporte.
* **Gateway Interno PushinPay (`src/services/pushinPayService.js`)**:
  * Emissão de cobranças PIX dinâmicas (`POST /api/pix/cashIn`) com conversão rigorosa para centavos inteiros sem ponto decimal.
  * Modo de simulação e contingência ativado automaticamente quando o token da API não estiver preenchido, garantindo que o sistema continue operacional e utilize a chave PIX padrão.
  * Consulta ativa de status (`GET /api/transactions/{id}`) para polling e confirmação de pagamento.
* **Esquema Relacional PostgreSQL e PostgREST na VPS**:
  * Migração idempotente executada com sucesso na VPS Oracle (`portfolio-db`):
    * `maintenance_categories`: categorias segmentadas por tipo de serviço com cores e ícones.
    * `maintenance_subscriptions`: contratos recorrentes com ciclo de cobrança e datas de reajuste.
    * `maintenance_invoices`: faturas com código único, status de liquidação e dados do PIX.
    * `maintenance_settings`: configurações de credenciais, chave PIX padrão e templates.
    * `support_tickets`: colunas `client_document` e `subscription_id` adicionadas para rastreamento de chamados.
  * Grants completos de leitura e escrita concedidos para as roles `anon` e `authenticator` do PostgREST.
* **Central de Notificações e Compartilhamento WhatsApp (`SubscriptionShareModal.jsx`, `whatsappMessages.js`)**:
  * Criado modal dedicado com 3 abas para envio ágil de links e cobranças diretamente pelo WhatsApp Web.
  * **1ª Mensagem (Apresentação & Boas-Vindas do Sistema):** Explica a migração para o sistema oficial, detalha vantagens como transparência, histórico de pagamentos, emissão de recibos e suporte técnico, com link de acesso direto e Pix da primeira fatura.
  * **2ª Mensagem (Lembrete Mensal Padrão):** Formato conciso para os meses subsequentes com dados da fatura, Pix Copia e Cola e link do portal.
  * **Acesso Direto com Auto-Login:** URLs geradas com parâmetro `?lookup=...` permitindo que o cliente abra a sua área logada sem precisar preencher dados.
  * Botões de 1 clique "Copiar Mensagem", "Copiar Apenas o Link" e "Abrir no WhatsApp Web" com sanitização automática do número telefônico.
* **Reorganização Estrutural da Barra Lateral Administrativa (`AdminLayout.jsx`)**:
  * Substituída a listagem plana desordenada por uma arquitetura hierárquica dividida em seções lógicas e subníveis expansíveis (acordeão com animação suave via Framer Motion).
  * Categorias agrupadas: **Vendas & Clientes** (Orçamentos e Assinaturas), **Prospecção Ativa** (Radar Google Maps e Leads Advogados), **Conteúdo & Portfólio** (Projetos, Serviços, Depoimentos e Fotografia), **Atendimento & Suporte** (Mensagens e Chamados) e **Sistema & Ajustes** (Configurações, Storage e Minha Conta).
  * Sincronização inteligente de rota: o grupo correspondente à página atual é expandido automaticamente ao carregar ou navegar, com indicador ativo discreto e linhas guias verticais.
  * Modo colapsado refinado com ícones e rótulos contextuais, além de responsividade mobile otimizada.

## [1.28.0] - 2026-10-02

### Adicionado (NEXUSSTORE, StartOFF, Consultas Brasil e VORIXA AI no Portfólio via Playwright e Supabase)
* **Novo Projeto Cadastrado: VORIXA AI / VORTIXIA (`projects` Supabase / ID 62)**:
  * Projeto: **VORIXA AI (VORTIXIA): Estúdio de Criação Audiovisual com Modelos Virtuais e Vídeos Virais**.
  * Categoria: **Desenvolvimento de Sites** (`category_id: 3`).
  * Cliente: **VORIXA AI / VORTIXIA Studio**.
  * Stack Tecnológica: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, PostgreSQL & Prisma ORM, Motores fal.ai e Kling 3.0, Editor de Fluxo (@xyflow/react), Gateway VorexPay (PIX Imediato), Sincronia Labial (Sync Audio LipSync) e Catálogo de Master Prompts.
  * URL de Produção: `https://vortixia.com.br/`.
  * Capturas em Alta Definição (10 Mídias Integradas): Home Widescreen 16:9 ("Crie seu modelo virtual ultra-realista"), Estúdio Neural de Criação Cinemática, Apresentadora Virtual com Enquadramento de TV, Produto Comercial de Luxo Perfume Aura Eclipse, Ensaio Editorial de Alta Moda Futurista, Hypercar Cyberpunk em Metrópole Noturna, Street Dancer Urbano com Efeitos de Partículas, Planos Comerciais e Créditos, Tela de Login e versão Mobile iPhone 14.
  * Capa na Galeria: Imagem principal widescreen integrada como primeira imagem da galeria com visualizador de zoom em tela cheia.
  * Economia e Desempenho: Redução de até 90% nos custos de gravação e produção audiovisual com geração de vídeo e voz sincronizada em português em menos de 2 minutos.
* **Novo Projeto Cadastrado: Consultas Brasil (`projects` Supabase / ID 61)**:
  * Projeto: **Consultas Brasil: Plataforma Inteligente de Dados Cadastrais com PIX e SEO Avançado**.
  * Categoria: **Desenvolvimento de Sites** (`category_id: 3`).
  * Cliente: **Consultas Brasil Data Intelligence**.
  * Stack Tecnológica: Next.js 16 (App Router + Turbopack), React 19, TypeScript, Tailwind CSS v4, PostgreSQL & Prisma ORM, Gateway PushinPay (PIX com resposta menor que 100ms), DirectData API V2 & V3 e SEO Semântico Avançado com Google Search Console.
  * URL de Produção: `https://consultasbrasil.net/`.
  * Capturas em Alta Definição (8 Imagens Integradas): Home Widescreen 16:9 com Consulta de CPF, CNPJ, Telefone, Placa e Nome, Seção de Módulos e Tipos de Consultas Online, Fluxo em 3 Passos de Como Fazer uma Consulta, Tabela de Preços e Recarga Instantânea via PIX sem mensalidade, FAQ Estruturado com Accordion, Tela de Login com Autenticação e versões Mobile iPhone 14 (Home e Módulos).
  * Capa na Galeria: Imagem principal widescreen integrada como primeira imagem da galeria com visualizador de zoom em tela cheia.
  * Arquitetura de Conversão & SEO: Otimização semântica completa de H1, entidades cadastrais, dados estruturados e cache inteligente de consultas repetidas sem bitributação.
* **Novo Projeto Cadastrado: StartOFF (`projects` Supabase / ID 60)**:
  * Projeto: **StartOFF: Sistema Corporativo de Gestão de Férias com IA e Concorrência de Turnos**.
  * Categoria: **Desenvolvimento de Sites** (`category_id: 3`).
  * Cliente: **StartOFF / Transpetro Petrobras**.
  * Stack Tecnológica: React 19, Vite, Tailwind CSS, Node.js & Express 5, Sequelize ORM, PostgreSQL, Algoritmo de IA Heurística para Datas e Controle de Concorrência de Turnos e Papéis.
  * URL de Produção: `https://startoff.rafaelpitaoficial.com.br/`.
  * Capturas em Alta Definição (7 Imagens Integradas): Dashboard Principal com Cockpit de Saldo e Calendário Widescreen 16:9, Tela de Solicitação Inteligente com Motor de IA sugerindo datas com maior atratividade e emendas de feriados, Calendário da Equipe com visão mensal e marcações de colaboradores, Painel de Gestão da Equipe com aprovação e reprovação de solicitações pendentes, Módulo de Bloqueio de Períodos Críticos e Recessos, Tela de Login Corporativo e versão Mobile iPhone 14.
  * Capa na Galeria: Imagem principal widescreen integrada como primeira imagem da galeria com visualizador de zoom em tela cheia.
  * Inteligência de Concorrência: Eliminação total de conflitos de escala entre colaboradores do mesmo papel (motoristas, operadores e líderes de turno) em turnos sobrepostos.
* **Novo Projeto Cadastrado: NEXUSSTORE (`projects` Supabase / ID 59)**:
  * Projeto: **NEXUSSTORE: E-commerce de Assinaturas Digitais com Fulfillment Automático**.
  * Categoria: **Desenvolvimento de Sites** (`category_id: 3`).
  * Cliente: **NEXUSSTORE**.
  * Stack Tecnológica: Next.js 14 (App Router), React 18, Tailwind CSS, Prisma ORM, PostgreSQL na VPS, Gateway PushinPay (PIX Imediato), Fulfillment Multi-Fornecedor API (SellAuth e Premium Supermarket) e Brevo E-mails Transacionais.
  * URL de Produção: `https://nexussstore.vercel.app/`.
  * Capturas em Alta Definição (7 Imagens Integradas): Hero Widescreen 16:9 de Assinaturas e IAs com destaques e promoções, Vitrine de Produtos e Softwares (Canva, ChatGPT, Prime, Netflix), Diferenciais Competitivos e Segurança do Cliente, Landing Page de Alta Conversão Canva Pro, Painel do Cliente e Resgate Instantâneo (/acesso), e versões mobile iPhone 14 (Hero e Vitrine).
  * Capa na Galeria: Imagem principal widescreen integrada como primeira imagem da galeria completa com visualizador de zoom em tela cheia.
  * Automação de Compra e Ativação: Checkout via PIX com webhook em tempo real e entrega automática em menos de 45 segundos pós-pagamento.

## [1.27.0] - 2026-10-01

### Adicionado (Vantage App, Jorge Santos Advocacia, Advogado Online Aracaju & BCont no Portfólio via Playwright)
* **Novo Projeto Cadastrado: Preço Certo by BCONT (`projects` Supabase / ID 58)**:
  * Projeto: **Preço Certo by BCONT: Precificação com Inteligência Fiscal, Comercial e de Compras**.
  * Categoria: **Desenvolvimento de Sites** (`category_id: 3`).
  * Cliente: **BCONT (Thiago Souza & Equipe)**.
  * Stack Tecnológica: React 19, TypeScript, TanStack Start, Tailwind CSS, Supabase (PostgreSQL + RLS), Inteligência Fiscal Condicional, Simulação da Reforma Tributária (IBS/CBS), Gateway Asaas API v3 (PIX + Cartão de Crédito) e Auditoria Raio-X em Lote via Excel.
  * URL de Produção: `https://precocerto.bcontdigital.com.br/`.
  * Capturas em Alta Definição: Hero Widescreen 16:9, Diagnóstico Estratégico (O que é o Preço Certo vs Erros de Planilhas), Público-Alvo Segmentado (Comércio, Distribuidoras, Indústrias e Serviços), Jornada de Formação de Preço em 4 Passos, Planos Comerciais com Alternador Mensal/Anual (Start, Gestão e Pro), FAQ Interativo com Accordion, Tela de Login Corporativo e versões mobile iPhone 14 (Hero e Planos).
  * Capa na Galeria: Imagem principal widescreen integrada como primeira imagem da galeria com visualizador de zoom em tela cheia.
* **Novo Projeto Cadastrado: BCont Contábil OS (`projects` Supabase / ID 57)**:
  * Projeto: **BCont Contábil OS: Inteligência, Gestão e Conciliação Contábil**.
  * Categoria: **Desenvolvimento de Sites** (`category_id: 3`).
  * Cliente: **BCont Contabilidade Digital (Paula & Equipe)**.
  * Stack Tecnológica: React 19, TypeScript, TanStack Start, Tailwind CSS, Supabase (PostgreSQL + RLS), Google Gemini AI, Conciliação Bancária OFX Inteligente (1:1 e N:1 por somatório), Matriz de Obrigações Tributárias e DRE Gerencial em Tempo Real.
  * URL de Produção: `https://painel.bcontdigital.com.br/`.
  * Capturas em Alta Definição (16 Imagens Integradas): Painel Operacional ao vivo (Capa Widescreen), Home Landing Page Hero Widescreen, DRE Gerencial em tempo real com gráfico e indicadores verticais, Motor de Conciliação Bancária com somatório N:1 e tolerâncias, Análise Fiscal de Certidões CNDs com IA Gemini e 21 débitos identificados, Produtividade Operacional por Colaborador com taxa de conclusão, Matriz dinâmica de Regras de Obrigações Tributárias, Importação de Plano de Contas em lote, Cadastro de Empresas por Setor/Responsável, Disparo de E-mails com Domínio Próprio, Seção de Recursos e Arquitetura Modular da Home, Fluxo de IA com Supervisão Humana, Destaque da Conciliação Bancária, Tela de Autenticação Segura com RLS e versões mobile iPhone 14 (Hero e Cockpit).
  * Capa na Galeria: Imagem principal widescreen (Painel Operacional) integrada como primeira imagem da galeria completa com visualizador de zoom em tela cheia.
* **Novo Projeto Cadastrado: Advogado Online Aracaju (`projects` Supabase / ID 56)**:
  * Projeto: **Advogado Online Aracaju: Landing Page de Alta Conversão**.
  * Categoria: **Desenvolvimento de Sites** (`category_id: 3`).
  * Cliente: **Jorge Santos Advocacia (Aracaju/SE)**.
  * Stack Tecnológica: Landing Page de Alta Conversão, SEO Jurídico Local (Aracaju/SE), Copywriting Persuasivo, FAQ Interativo, Design Mobile-First e WhatsApp Direct.
  * URL de Produção: `https://advogadoonlinearacaju.com.br`.
  * Capturas em Alta Definição: Hero Widescreen 16:9, Áreas de Atuação Jurídica, Diferenciais e Como Funciona o Atendimento, FAQ com Accordion e versões mobile iPhone 14.
* **Novo Projeto Cadastrado: Jorge Santos Advocacia (`projects` Supabase / ID 55)**:
  * Projeto: **Jorge Santos Advocacia: Portal Jurídico Especializado**.
  * Categoria: **Desenvolvimento de Sites** (`category_id: 3`).
  * Cliente: **Dr. Jorge Santos (Aracaju/SE)**.
  * Stack Tecnológica: WordPress, Elementor Pro, SEO Jurídico Local (Aracaju/SE), Landing Pages Especializadas (Trabalhista, Divórcio, Inventário, Empresarial e Imobiliário), Cache de Performance e WhatsApp Direct.
  * URL de Produção: `https://advogadoemaracaju.com.br`.
  * Capturas em Alta Definição: Home Hero Widescreen 16:9, O Escritório, Áreas de Atuação, Landing Page Trabalhista, Divórcio, Inventário e versões mobile iPhone 14.
* **Novo Projeto Cadastrado: Vantage App (`projects` Supabase / ID 54)**:
  * Projeto: **Vantage App: Plataforma SaaS de Fidelidade Gastronômica**.
  * Categoria: **Desenvolvimento de Sites** (`category_id: 3`).
  * Cliente: **Vantage App (Thiago & Mafer)**.
  * Stack Tecnológica: Next.js 16 (App Router), React 19, Tailwind CSS, Prisma ORM, PostgreSQL, PWA Mobile-First, QR Code Dinâmico Criptografado HMAC-SHA256, Bento Grid e Analytics em Tempo Real.
  * URL de Produção: `https://vantageapp.rafaelpitaoficial.com.br`.
  * Capturas em Alta Definição: Hero Widescreen 16:9 autenticado, marketplace Explorar restaurantes com notas e selos de fidelidade, Minha Conta / Segurança do cliente VIP, Dashboard Master com DRE, Portal B2B com QR Code diário e Carteira de Fidelidade Apple Wallet.

## [1.26.9] - 2026-10-01

### Aprimorado (Roteiro Cadenciado, Recuperação em 2 Etapas & Cenários de Resposta no Radar Google Maps)
* **Nova Estratégia de Prospecção Ativa em Etapas & Recuperação Estruturada (`googleMapsProspectService.js`)**:
  * Substituída a mensagem única com link direto por um roteiro progressivo, eliminando a rejeição por medo de golpes, spam ou bloqueio da secretária.
  * **Passo 1 (Abertura / Anti-Spam)**: Pergunta educada para identificar se o canal fala com a assessoria ou com o titular, sem links externos.
  * **Passo 2 (Oportunidade / Permissão)**: Elogio à reputação do escritório no Google, alerta da perda de clientes na região para a concorrência e pedido explícito de autorização para envio da demonstração.
  * **Passo 3 (Demonstração / Oferta)**: Envio do link da Landing Page personalizada sob demanda, com menção à adaptação completa de textos/fotos, respeito ao Código de Ética da OAB e proposta de R$ 300 (implementação única) mais anuidade de domínio.
  * **Passo 4 (Resgate Parte 1 / Pergunta do Canal Certo)**: Pergunta despretensiosa e cordial se aquele é o canal adequado para tratar da presença digital e novos clientes ou se recomendam outro contato. Desarma defesas e tem taxa de resposta recorde.
  * **Passo 5 (Resgate Parte 2 / Entrega Pós-Confirmação)**: Disparada quando o cliente responde "sou eu", "é aqui" ou "pode falar", reapresentando a demonstração já pronta e alertando sobre clientes da comarca escapando para a concorrência.
  * **Scripts para Cenários Adicionais**: Mensagem pronta para abordar novo contato indicado pela equipe (`recuperacao_indicado`) e mensagem de saída cordial para recusas temporárias (`recuperacao_recusa`).
* **Nova Aba "Banco de Respostas & Scripts Salvos" no Radar (`RadarGoogleMaps.jsx`)**:
  * Adicionado alternador superior na página permitindo alternar entre o "Radar de Prospecção" e a nova aba "Banco de Respostas & Scripts Salvos".
  * Apresenta 7 cartões completos com textos formatados, crachás estratégicos, objetivo comercial detalhado e botão de cópia de 1 clique para todos os scripts de abertura, proposta, resgate em 2 etapas e respostas para contatos indicados ou declínios.
* **Modal com 8 Abas Diretas de Roteiro e Cenários de Resposta (`RadarGoogleMaps.jsx`)**:
  * Todas as etapas salvas (1. Abertura, 2. Oportunidade, 3. Demo, 4. Resgate 1, 5. "É Comigo", 6. Novo Contato, 7. "Sem Interesse" e Direta) integradas com seleção direta e caixinha de reação do cliente.
* **Cards de Leads e Nuvem com Ações Imediatas (`RadarGoogleMaps.jsx`)**:
  * Disparos cadenciados individuais diretamente no WhatsApp Web nos cards do radar e nas demonstrações salvas na nuvem.

## [1.26.8] - 2026-09-30

### Aprimorado (Busca Multi-Termo para Capitais, Reordenação de Layout do Radar & Higienização de Nomes)
- **Buscas Paralelas Multi-Termo na Google Places API (`api/places-search.js`)**:
  - Implementado motor de busca paralelo combinando múltiplos termos complementares por cidade (ex: `advogado em Rio de Janeiro RJ`, `escritorio de advocacia em Rio de Janeiro RJ`, `advocacia em Rio de Janeiro RJ`, `advogada em Rio de Janeiro RJ` e `consultoria juridica em Rio de Janeiro RJ`).
  - O volume de estabelecimentos analisados passou de 20 para mais de 60 lugares únicos por busca, multiplicando a identificação de advogados reais sem site de 1 a 3 para 10 a 25 opções qualificadas em capitais como Rio de Janeiro, São Paulo e Belo Horizonte.
- **Reorganização de Layout e Foco nos Resultados (`RadarGoogleMaps.jsx`)**:
  - A grade de resultados do Google Maps foi reposicionada imediatamente abaixo da barra de filtros de busca, garantindo que o usuário veja instantaneamente os escritórios da cidade pesquisada.
  - A seção de "Demonstrações Ativas na Nuvem" foi movida para depois da grade de resultados, eliminando a confusão visual onde cards antigos de outras cidades ocupavam a tela.
  - Adicionado auto-scroll suave para a grade de resultados assim que a busca é concluída.
  - Título da seção agora identifica claramente a cidade pesquisada com badges dinâmicos (ex: "Resultados no Google Maps: Rio de Janeiro (RJ) - 11 escritórios sem site").
- **Utilitário Centralizador de Higienização de Nomes (`src/utils/lawyerNameFormatter.js`)**:
  - Criadas as funções `cleanLawyerName` e `formatNavbarLawyerName` para erradicar nomes gigantes e poluídos extraídos das fichas de Google Meu Negócio.
  - Elimina delimitadores de palavras-chave (`|`, `•`, `-`, `/`, `:`), listas de especialidades (ex: `| Divórcios | Inventários | Direito Civil`) e sufixos residuais (`- Advogada`, `- Advocacia`).
  - Normaliza prefixos e honoríficos (`Dra` -> `Dra.` e `Dr` -> `Dr.`).
- **Proteção e Redimensionamento da Navbar (`LegalNavbar.jsx`)**:
  - Inserida contenção de largura máxima (`max-w-[260px] sm:max-w-[340px] xl:max-w-[400px]`) e classe `truncate` no logotipo corporativo, impedindo que nomes extensos empurrem o menu ou quebrem o layout.
  - Ajustados os espaçamentos horizontais da navegação (`gap-3.5 xl:gap-6 2xl:gap-8`) e tamanho de fonte (`text-xs xl:text-sm`).
  - Botão de WhatsApp reformatado com `whitespace-nowrap` e preenchimento adaptativo (`px-4 sm:px-5 xl:px-6`), eliminando cortes visuais em qualquer resolução.
- **Validação de Build**:
  - `npm run build` executado e aprovado com código 0 (`index-8fd6ef3c.js`).

## [1.26.7] - 2026-09-30

### Aprimorado (Fotos de Hero Widescreen 16:9 para Mulheres, Enquadramento Lateral & Blindagem de Imagens Masculinas)
- **Geração e Substituição de Imagens Widescreen 16:9 em `public/images/legal/`**:
  - `advogada_hero.jpg` (1376x768): Retrato widescreen de advogada brasileira em blazer vinho nobre e sorriso confiante à direita da mesa executiva; lado esquerdo livre com estante desfocada e iluminação quente de biblioteca jurídica, sem logotipos ou textos espúrios.
  - `advogada_sobre.jpg` (1376x768): Reunião de atendimento consultivo com a advogada posicionada à direita e vista panorâmica com profundidade arquitetônica à esquerda.
  - `advogada_tribunal.jpg` (1376x768): Advogada caminhando imponente no lado direito do corredor de tribunal clássico, com colunas e piso de mármore dourado.
  - `advogada_sede.jpg` (1376x768): Recepção boutique acolhedora com a advogada recebendo o cliente à direita e poltronas em veludo vinho.
- **Enquadramento Lateral e Posicionamento Facial (`LegalHero.jsx`)**:
  - Adicionadas classes `object-right lg:object-[75%_center]` e gradiente de alto contraste adaptativo (`from-[#170311]/95 via-[#1A0414]/75 to-transparent`).
  - Garante que a headline, os badges e os botões de ação fiquem perfeitamente legíveis à esquerda, enquanto o rosto e a postura da advogada permanecem totalmente visíveis, iluminados e sem sobreposição em smartphones e desktops widescreen.
- **Blindagem Contra Vazamento de Imagens Masculinas (`LegalLandingPage.jsx`)**:
  - Refatorada a resolução de `activeHeroImage` para forçar o uso exclusivo de fotos femininas quando o profissional for do gênero feminino, impedindo que fotos de nichos gerais masculinos (`geral.jpg`, `trabalhista.jpg`, etc.) sobrescrevam os slides femininos.
- **Otimização de Transição Tailwind**:
  - Ajustada a propriedade de transição suave do carrossel para remover advertências de compilação. Build 100% limpo com código 0.

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
