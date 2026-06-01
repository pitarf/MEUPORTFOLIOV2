# CHANGELOG - Rafael Pita Solutions / MeuPortfolio v2

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

## [1.2.0] - 2026-06-01

### Adicionado
- **Tema Claro (Light Mode) Corporativo Padrão**: Toda a identidade visual do portfólio agora inicia no Tema Claro por padrão para novos visitantes, oferecendo excelente legibilidade, contraste comercial sofisticado e estética ultra-clean inspirada em grandes empresas de tecnologia (Stripe/Apple).
- **Mapeamento de Cores Adaptativas (HSL)**: Redefinição das variáveis de cores CSS semânticas no `:root` e na classe `.dark` do Tailwind, habilitando compatibilidade fluida de temas.
- **Alternador de Tema Reativo (Toggle)**: Inserido o botão de alternância de tema premium diretamente na `Navbar.jsx` (Desktop e Mobile) com micro-animações de rotação e troca de ícone (Sol/Lua) alimentado pelo Framer Motion.
- **ThemeContext e ThemeProvider**: Implementada a infraestrutura global para controle do estado dos temas, salvando as preferências do usuário localmente no `localStorage`.
- **Estilo de Estúdio para Fotografia**: Proteção forçada de Tema Escuro exclusivamente para a área artística de fotografia (`/portfolio-fotografia`), para preservar a fidelidade e o contraste das cores de fotos profissionais em padrão de cinema.

### Alterado
- **`Home.jsx`**: Refatoração completa das cores textuais fixas e seções (como as Estatísticas e o Hero) para suportar com extrema elegância e contraste as duas paletas de tema.
- **`Contact.jsx`**: Formulários de contato, de solicitação de propostas de orçamento e de suporte adaptados para Glassmorphism claro premium e botões de seleção de preço com legibilidade semântica polida.
- **`Footer.jsx`**: Rodapé otimizado com bordas sutis e contraste dinâmico de links e ícones para ambos os modos.
- **`index.css`**: Ajustadas as classes premium `.glass-effect`, `.service-card` e `.gradient-text` para transição dinâmica suave e cores reativas refinadas.
- **`App.jsx`**: Wrapper principal atualizado com transições de cores e integrado com o `<ThemeProvider>`.

### Corrigido
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
