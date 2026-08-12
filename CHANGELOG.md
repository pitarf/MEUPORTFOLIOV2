# CHANGELOG - Rafael Pita Solutions / MeuPortfolio v2

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

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
