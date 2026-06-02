# ROADMAP DE TAREFAS - REDESENHO ULTRA-PREMIUM CORPORATIVO

Roadmap de acompanhamento para a reestruturação visual de alta conversão, com tema claro por padrão e alternador reativo de temas.

## CONCLUÍDO (DONE)
- [x] **Contexto de Temas (`ThemeContext.jsx`)**: Desenvolver gerenciador global de temas com persistência de preferências de navegação no `localStorage`.
- [x] **Integração na Raiz (`App.jsx`)**: Envelopar toda a aplicação com o `<ThemeProvider>` e criar o corpo da aplicação com transições dinâmicas de cores (`transition-colors duration-300`).
- [x] **Variáveis de Estilo HSL (`index.css`)**: Definir a nova paleta do Tema Claro Premium corporativa (estilo Stripe e Apple) no `:root`, transferir a paleta escura existente para a classe `.dark` e adequar as classes premium `.glass-effect`, `.service-card` e `.gradient-text` para transições inteligentes.
- [x] **Seletor de Temas na Barra de Navegação (`Navbar.jsx`)**: Desenhar e integrar o botão de toggle dinâmico (ícones Sol/Lua) com micro-animações do Framer Motion nas versões de computadores e smartphones.
- [x] **Refatoração da Home (`Home.jsx`)**: Eliminar fundos e fontes escuras estáticas, implantando classes semânticas HSL que reagem e trazem extremo contraste e legibilidade corporativa.
- [x] **Refatoração de Contato (`Contact.jsx`)**: Refinar formulários de orçamentos, seleção de faixas de preço e chamados técnicos de suporte para legibilidade e Glassmorphism claro premium impecável.
- [x] **Ajustes de Componentes Adicionais (`Footer.jsx`)**: Otimizar bordas e links do rodapé corporativo para perfeita visualização nos dois modos.
- [x] **Isolamento Artístico de Fotografia**: Garantir o bloqueio de tema escuro permanente apenas para `/portfolio-fotografia` (preservando o tom artístico original das fotos).
- [x] **Build de Validação de Produção**: Processo de build (`vite build`) executado localmente para garantir a integridade estrutural e de tipos do React.
- [x] **Atualização de Manuais**: Documentação do projeto estendida com os arquivos `CHANGELOG.md`, `documents/task.md`, `MANUAL_DEV.md` e `MANUAL_USER.md`.
- [x] **Ajuste de Altura e Espaçamento do Hero (`Home.jsx`)**: Redefinir a altura para `min-h-[calc(100vh-5rem)]` e diminuir margens e dimensões da logo para trazer os botões de CTA ("Solicitar Orçamento" e "Ver Portfólio") para cima, totalmente visíveis sem necessidade de rolagem.
- [x] **Atenuação do Marquee de Projetos (`Home.jsx`)**: Forçar `grayscale` nas tags `<img>` e adicionar um overlay semi-transparente de `bg-background/90` para suavizar e tornar o marquee uma textura sutil no tema claro.
- [x] **Contraste de Inputs e Labels em Área do Cliente e Rastreamento (`ClientArea.jsx` e `TrackTicket.jsx`)**: Substituir classes estáticas pretas e cinzas de labels e caixas de texto por classes dinâmicas com suporte reativo e alto contraste para ambos os temas.
- [x] **Fundo e Links do Rodapé (`Footer.jsx`)**: Substituir o fundo translúcido no tema claro por um fundo sólido corporativo `bg-slate-50` com divisor em `border-slate-200` para garantir legibilidade impecável de todos os links institucionais e de contato.
- [x] **Redesenho do Portfólio Geral (`Portfolio.jsx`)**: Substituição completa dos antigos carrosséis isolados por um layout estilo dashboard de elite, com contadores de autoridade, abas interativas com contadores dinâmicos, grid fluida animada com Framer Motion, pílulas de tecnologia exibidas no hover das cartas e uma seção de 'Pilares de Excelência' detalhando a alta competência.
- [x] **Otimização Ergonômica de Filtros e Limpeza Geral (`Portfolio.jsx`)**: Eliminar a antiga barra de rolagem horizontal inestética em dispositivos Windows/Celulares, substituindo-a por um layout de pílulas refinado e compacto (estilo Stripe) com fontes discretas e contadores modernos, acomodando-os em uma única linha no desktop ao lado do campo de busca, evitando quebras de linha com indicador ativo deslizante (`layoutId` do Framer Motion). Adicionar exclusão estrita de fotos/ensaios sem categoria ("Geral") e ocultação automática de categorias que possuam 0 projetos corporativos ativos.
- [x] **Legibilidade de Temas em Detalhes de Projetos (`ProjectPage.jsx`)**: Substituir as cores estáticas cinzas de detalhes, desafio, solução e resultados por cores dinâmicas de alto contraste, ajustar o link de retorno, badges de serviços e a reatividade do botão de avaliações em fundos brancos.
- [x] **Legibilidade no Hover de Projetos (`Portfolio.jsx`)**: Corrigir a mistura de letras causadas por screenshots claros adicionando uma cortina escura (`bg-slate-950/85`) com desfoque de fundo (`backdrop-blur-[3px]`) sob o texto de hover de cada card de projeto.
- [x] **Nomenclatura Discreta e Profissional de Categorias (`Portfolio.jsx` & `ProjectPage.jsx`)**: Mapear dinamicamente "Desenvolvimento de Sites" para o termo compacto **"Sites"** e "Dashboards em Power BI" para o objetivo **"Power BI"**, tanto no portfólio quanto nas páginas individuais, e gerar a migração de banco oficial `09_update_category_titles.sql` do Supabase.
- [x] **Abreviação e Robustez Adicional de Categorias (`Portfolio.jsx`, `ProjectPage.jsx`, `09_update_category_titles.sql`)**: Adição de mapeamento dinâmico insensível a maiúsculas/minúsculas no front-end para evitar quebra caso a migração ainda não tenha sido rodada no banco. Mapeamento e encurtamento da categoria "Produção com IA" para a nomenclatura executiva **"Produção IA"** no banco e no código.
- [x] **Legibilidade do Tema Claro em Serviços (`Services.jsx`)**: Refatoração das cores estáticas pretas e brancas por classes adaptativas (HSL) e novos fundos de seções corporativas, garantindo legibilidade perfeita e refinamento estético premium.
- [x] **Correção de Cores Purgadas e Ícones Invisíveis (`Services.jsx`)**: Implementação de mapeamento estático e literal de gradientes de cores (`serviceColors`) no front-end para evitar a purga do Tailwind CSS, restaurando a visibilidade de todos os ícones da página.
- [x] **Otimização de Espaçamento no Hero (`Home.jsx`)**: Redução em 30-40% do padding top acumulado (section principal ajustada para `sm:pt-24` conforme feedback e div interna) no Hero, aproximando a logo e o nome da marca em relação à navbar de forma fluida.

## EM ANDAMENTO (DOING)
*Nenhuma tarefa em andamento. Ajustes visuais 100% implementados, validados com build e documentados.*

## PENDENTE (TODO)
- [ ] Mapeamento e coleta de feedbacks dos usuários corporativos após lançamento em produção.
