# CHANGELOG - Rafael Pita Solutions / MeuPortfolio v2

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

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
