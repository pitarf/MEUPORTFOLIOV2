# ROADMAP DE TAREFAS - SEO & BRANDING PREMIUM

Roadmap de acompanhamento de tarefas de otimização de SEO e Branding.

## CONCLUÍDO (DONE)
- [x] **Modelagem de SEO no Banco de Dados**: Criar migration segura `08_add_seo_columns.sql` para a tabela `site_config` contendo colunas de título, descrição, palavras-chave, favicon e og_image.
- [x] **Atualização de Contextos**: Estender `SiteConfigContext.jsx` adicionando os fallbacks correspondentes aos novos campos.
- [x] **Componente SEO Dinâmico**: Reestruturar `SEO.jsx` com injeção automática de links canônicos, suporte a palavras-chave, conversão de caminhos de imagens em URLs absolutas e fallbacks inteligentes.
- [x] **Políticas de noindex Automatizadas**: Proteção de áreas administrativas/logadas (`/admin`, `/dashboard`, `/area-clientes`, etc.) injetando automaticamente tag robots noindex/nofollow.
- [x] **Arquivos de Indexação do Google**: Geração e inclusão de `public/robots.txt` e `public/sitemap.xml` para rápida indexação no buscador.
- [x] **Nova Interface do Painel Admin**: Seção premium "Configurações de SEO & Compartilhamento" integrada na tela de Configurações Gerais (`/admin/settings`), habilitando inputs e seletores de arquivos de imagens (Favicon, OG Image) com compressão e preview ativo.
- [x] **Validação e Integridade**: Teste de compilação de produção (`vite build`) executado e concluído com 100% de sucesso.
- [x] **Documentações Automáticas**: Geração de `CHANGELOG.md`, `documents/task.md`, `MANUAL_DEV.md` e `MANUAL_USER.md`.

## EM ANDAMENTO (DOING)
*Nenhuma tarefa em andamento. Todas as atividades propostas foram implementadas e validadas.*

## PENDENTE (TODO)
- [ ] Monitoramento de cliques e métricas do Google Search Console após a indexação do site.
