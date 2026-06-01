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

## EM ANDAMENTO (DOING)
*Nenhuma tarefa em andamento. Redesenho visual 100% implementado, testado e documentado.*

## PENDENTE (TODO)
- [ ] Mapeamento e coleta de feedbacks dos usuários corporativos após lançamento em produção.
