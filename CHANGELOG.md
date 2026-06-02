# CHANGELOG - Rafael Pita Solutions / MeuPortfolio v2

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

## [1.2.3] - 2026-06-02

### Adicionado
- **Alternador de Temas no Painel Administrativo (`AdminLayout.jsx`)**: Adicionado o botão de alternar de tema (Sol/Lua) no rodapé da barra lateral (Sidebar) no desktop e à direita no cabeçalho móvel no mobile, permitindo que o administrador altere o tema Claro/Escuro do painel e do site de forma prática diretamente de dentro da área restrita.

### Alterado
- **Contraste e Suporte a Temas no Formulário de Edição de Projetos (`ProjectFormModal.jsx`)**: Ajustado o modal de criar/editar projetos de portfólio para se adequar perfeitamente ao tema selecionado. Removemos fundos, bordas e textos escuros rígidos e substituímos por classes utilitárias semânticas HSL (`bg-card`, `bg-muted` e `border-border`), resolvendo a ilegibilidade das fontes cinzas sob fundo escuro fixo em telas claras.

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
