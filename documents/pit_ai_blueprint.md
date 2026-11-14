# PIT.AI (PIT AI) — Especificação Arquitetural e Funcional

Documento de especificação viva e incremental para a criação do assistente operacional e executivo de Rafael Pita, inspirado no conceito de inteligência central (J.A.R.V.I.S.), integrado à plataforma RP Solutions.

---

## 1. Visão Geral e Identidade

* **Nome Oficial:** PIT.AI (soletrado `P I T . A I` / Pita AI).
* **Conceito de Referência:** Assistente operacional executivo, analítico e de comando em tempo real. Não apenas um chatbot convencional, mas um centro de comando integrado ao dia a dia pessoal, financeiro e profissional.
* **Pontos de Acesso:**
  * Plataforma Web responsiva adaptada para celular e computador.
  * Subdomínio ou rota dedicada: `pitai.rafaelpitaoficial.com.br` (ou `/pit-ai` / `/jarvis` dentro da arquitetura do sistema).
* **Estilo de Comunicação:**
  * Respostas diretas, analíticas e sem rodeios.
  * Modo vocal nativo: capacidade de falar o briefing matinal/diário logo ao abrir a tela e processar ordens por voz do usuário.

---

## 2. Módulo de Briefing de Inteligência em Tempo Real ("O que tem de novo?")

Quando o usuário acessa o PIT.AI e pergunta ou solicita as novidades, a IA faz uma varredura das informações mais relevantes ocorridas desde o último acesso registrado.

### 2.1. Camadas Geográficas e de Impacto
1. **Mundo (Cenário Global):**
   * Geopolítica internacional de grande repercussão.
   * Movimentações econômicas globais e tecnologia.
   * Eventos graves e descobertas relevantes.
2. **Brasil (Nível Nacional):**
   * Economia e mercado financeiro: oscilações da B3 (bolsa de valores), dólar, juros e decisões fiscais.
   * Política e atos governamentais de impacto direto.
   * Segurança nacional e fatos positivos ou de alerta.
3. **Rio de Janeiro (Nível Local - Estado e Capital):**
   * Segurança pública e operações de impacto na mobilidade urbana e rotina.
   * Decisões e publicações da Prefeitura e do Governo do Estado (incluindo atos e diários oficiais).
   * Clima extremo, ocorrências de infraestrutura e acontecimentos de destaque da região metropolitana.

### 2.2. Critérios de Coleta e Confiabilidade
* Filtro estrito contra desinformação: prioridade para veículos e órgãos com credibilidade pública comprovada.
* Consulta a dados abertos e publicações oficiais quando o assunto envolver normas ou atos de governo.
* Janela temporal reativa: a IA mantém o registro de quando foi o último briefing e resume exclusivamente o intervalo de ausência do usuário.

---

## 3. Módulo de Raciocínio Vivo & Pesquisa Web em Tempo Real (Live Search)

O PIT.AI deve operar como uma inteligência cognitiva genuína e reativa, apta a sanar dúvidas pontuais ou realizar investigações profundas sob demanda.

### 3.1. Raciocínio Imediato vs. Pesquisa Ativa
* **Respostas Imediatas de Alta Precisão:** Dúvidas lógicas, estratégicas, conceituais e arquiteturais são respondidas de prontidão com base na inteligência central.
* **Gatilho de Busca Web ao Vivo (Real-Time Web Grounding):**
  * Sempre que a pergunta envolver dados recentes, cotações de mercado, acontecimentos do dia, legislação em trâmite, pessoas, locais ou informações mutáveis, a IA ativa autonomamente um crawler/mecanismo de busca na web.
  * Realiza a varredura em tempo real em múltiplas fontes na internet.
  * Cruza os dados apurados para descartar boatos e entrega a resposta final mais precisa e atualizada do momento, acompanhada das referências de onde a informação foi extraída.

### 3.2. Formato de Resposta
* Síntese objetiva no estilo executivo (sem floreios desnecessários).
* Disponível tanto em texto na tela quanto falada em áudio (voz natural e fluida).

---

## 4. Módulo de Produtividade: Google Agenda & Google Tarefas

Controle rigoroso da rotina pessoal e profissional com comandos bidirecionais (leitura e escrita), tanto por texto quanto por áudio, projetado especificamente para a alta carga de compromissos e necessidade de memória auxiliar de Rafael Pita.

### 4.1. Visão Temporal Completa (Granularidade Total)
* **Consciência de Tempo Multinível:**
  * **Hoje (Tempo Real):** O que está agendado para as próximas horas, compromissos em andamento e janelas livres.
  * **Semana:** Distribuição da carga de trabalho dos próximos 7 dias.
  * **Mês & Ano:** Visão ampla de entregas de projetos, renovações de contratos, audiências, datas fiscais e compromissos de longo prazo.

### 4.2. Protocolo de Inserção Rápida por Voz (Cenário de Ligação / Multitarefa)
* **Objetivo:** Permitir que o Rafael, durante ou logo após uma ligação telefônica ou mensagem rápida, apenas fale com a IA sem precisar abrir calendários manuais ou preencher formulários.
* **Exemplos de Comandos Naturais:**
  * *"PIT, marca na minha agenda reunião com o Dr. Marcos quinta-feira às 15h."*
  * *"Cria um lembrete para eu emitir a nota fiscal do cliente X amanhã às 10h."*
  * *"Cria uma tarefa para revisar a landing page da barbearia com lembretes a cada 2 horas até eu concluir."*

### 4.3. Detector Proativo de Conflitos de Agenda
* **Bloqueio e Alerta Inteligente:** Sempre que um novo evento for solicitado, o PIT.AI cruza os horários em milissegundos com todos os compromissos existentes na conta Google.
* **Intervenção Conversacional Ativa:** Se houver sobreposição total ou parcial, a IA interrompe e avisa vocalmente e em texto:
  > *"Rafael, identifiquei um possível conflito de agendas: você já tem a reunião 'Alinhamento com Cliente' agendada exatamente das 14h30 às 15h30 desse dia. O que você prefere fazer? Posso alocar para as 16h, reagendar o compromisso anterior ou manter os dois?"*
* **Ajuste Guiado por Diálogo:** O usuário responde naturalmente ("joga pras 16h") e o PIT.AI efetiva a alteração imediatamente.

### 4.4. Sistema de Lembretes Espaçados e Cadenciados
* **Configuração de Intervalos Personalizados:**
  * Lembretes prévios pontuais (ex: 24 horas antes, 2 horas antes, 15 minutos antes).
  * Lembretes de cadência contínua (ex: "me lembre de 2 em 2 horas", "me avise no início e no fim do dia").
* **Notificação Sonora e Visual:** Alerta sonoro sutil e card holográfico pulsante na tela quando o momento do compromisso se aproximar.

### 4.5. Google Tarefas (Google Tasks)
* **Acompanhamento de Pendências:** Listagem e ordenação automática por prioridade ou prazo.
* **Operações por Voz:** Criação, adiamento e marcação de conclusão de tarefas com atualização em tempo real no app oficial do Google no celular.

---

## 5. Paradigma de Interface Viva (Conversational First & UI Generativa)

O PIT.AI não deve ser uma interface convencional engessada, repleta de menus, cliques e formulários estáticos. Ao entrar no domínio, a interação é imediata, fluida e centrada no diálogo contínuo.

### 5.1. Dinâmica de Interação Sem Fricção ("Zero Cliques Desnecessários")
* **Abertura Imediata:** O usuário acessa o sistema e já é recebido em conversa ativa (áudio e texto).
* **Projeção Contextual na Tela (HUD Reativo):** Conforme a conversa se desenvolve, o próprio PIT.AI decide autonomamente quando e como projetar elementos visuais de apoio na tela:
  * **Modais Visuais & Imagens:** Exibição de fotografias, infográficos ou ilustrações relacionadas à notícia ou assunto tratado.
  * **Mapas Interativos com Locais/Prints:** Ao mencionar ocorrências, rotas, segurança ou bairros do Rio de Janeiro / Brasil, evoca automaticamente cartões geográficos com mapas e prints dos pontos citados.
  * **Navegação & Previews da Web:** Capacidade de renderizar na própria tela capturas ou telas de navegação ao vivo de sites pesquisados para o usuário visualizar o fato sem sair do ambiente.

---

## 6. Arquitetura de Memória & Cache Inteligente (TTL de 7 Dias)

Para garantir respostas ultrarrápidas e controle estrito sobre os custos de chamadas de APIs externas e scrapers de busca:

### 6.1. Regra de Retenção de 7 Dias
* **Janela Temporal de Cache:** Notícias, fatos coletados, resumos de portais e capturas de pesquisa web ficam armazenados em banco por até **7 dias** (Time-To-Live de 7 dias).
* **Prevenção de Retrabalho:** Se um acontecimento da semana for revisitado pelo usuário, o PIT.AI resgata imediatamente a informação estruturada do banco local, economizando custos e tempo de resposta.
* **Invalidação Inteligente (Freshness Check):** Se o usuário solicitar novidades urgentes ("aconteceu algo na última meia hora?"), a IA sobrepõe o cache e dispara uma nova varredura ao vivo.
* **Limpeza Automática:** Registros de notícias que ultrapassarem os 7 dias são purgados ou arquivados de forma leve para manter a base enxuta.

---

## 7. Anatomia do J.A.R.V.I.S. & Mapeamento de Recursos para o PIT.AI

Para guiar as próximas decisões de engenharia, este mapeamento disseca as reais capacidades do J.A.R.V.I.S. (do Tony Stark) e traduz cada uma para o ecossistema prático de Rafael Pita:

| Pilar do J.A.R.V.I.S. | Como o Tony Stark usava | O que significa na prática para o PIT.AI |
| :--- | :--- | :--- |
| **1. Consciência Situacional & Briefing Diário** | "Bom dia, senhor. São 7h. Clima, trânsito e ocorrências..." | **Briefing ao entrar:** Resumo falado e visual de notícias mundiais, Brasil (B3/governo/segurança), Rio de Janeiro e previsão do dia. |
| **2. HUD Reativo & Projeção Visual Dinâmica** | Hologramas na tela conforme pensa ou fala, sem cliques. | **UI Generativa:** Exibição espontânea de cards, mapas interativos do RJ/BR, fotos e telas de navegação web. |
| **3. Conversação Vocal Fluida** | Diálogo contínuo por voz com tom executivo, calmo e direto. | **Voice-First:** Processamento de voz do Rafael via microfone, gerando respostas faladas naturais em PT-BR. |
| **4. Gestor Executivo de Rotina** | Controle de reuniões, e-mails prioritários e agenda da Stark Industries. | **Google Agenda + Tarefas:** Leitura, criação, alteração e cancelamento de eventos e pendências por voz e texto. |
| **5. Pesquisa Profunda & Varredura Web** | Cruzamento de dados na internet, checagem de fatos e investigações. | **Live Web Grounding:** Busca autônoma ao vivo com checagem de fontes confiáveis e síntese imediata. |
| **6. Telemetria & Monitoramento de Sistemas** | Alertas de integridade da armadura, energia, servidor central da mansão. | **Sentinela dos Servidores:** Monitoramento da VPS Hostinger, status dos sites dos clientes, banco Supabase e APIs externas. |
| **7. Radar Financeiro & Comercial** | Acompanhamento do valor das ações e contratos industriais. | **Radar RP Solutions:** Monitoramento de faturamento, pagamentos recebidos, cotação do dólar, bolsa B3 e propostas abertas. |
| **8. Sentinela de Segurança & Alertas Críticos** | Detecção de ameaças físicas e digitais antes de qualquer dano. | **Vigilância Ativa:** Notificações de segurança no RJ (tiroteios, bloqueios), falhas de segurança no sistema ou instabilidades graves. |
| **9. Automação Multiagente ("Protocolo House Party")** | Disparo de múltiplos protocolos e armaduras atuando em paralelo. | **Subagentes Operacionais:** Capacidade do PIT.AI delegar tarefas em segundo plano (ex: varreduras de prospecção, disparos de e-mail). |
| **10. Notificações Proativas (Dispositivos Móveis)** | Contato direto via fone/comunicador onde quer que o Tony esteja. | **WhatsApp & Celular:** Alertas urgentes, lembretes de tarefas e resumos despachados direto no WhatsApp do Rafael. |

---

## 8. Levantamento Técnico de Requisitos, Custos, APIs e Análise de Skills Open-Source

Para viabilizar o PIT.AI de forma sustentável, profissional e sem gerar faturas mensais pesadas, a arquitetura foi planejada para operar com **custo de API próximo a zero (R$ 0,00)** através de tecnologias nativas e cotas oficiais gratuitas:

### 8.1. Análise Funcionalidade x Tecnologia x Custo

| Funcionalidade | Ferramenta Proposta | Há API Paga? | Como Contornar Gratuitamente | Custo Estimado |
| :--- | :--- | :--- | :--- | :--- |
| **Voz (Falar e Ouvir)** | Web Speech API (`SpeechRecognition` e `SpeechSynthesis`) | Existem APIs pagas caras (ElevenLabs, OpenAI Whisper) | Usar a **Web Speech API nativa dos navegadores**. É embutida no Chrome, Edge e Safari (celular e PC), suporta português brasileiro com perfeição e não consome nenhuma cota de API externa. | **R$ 0,00** |
| **Cérebro / LLM (Raciocínio de Última Geração)** | **Google Gemini 2.0 Flash** (nova geração de alta velocidade) | Modelos proprietários fechados cobram por token | O **Gemini 2.0 Flash** entrega respostas em milissegundos (latência ultra-baixa essencial para experiência estilo JARVIS), raciocínio multimodal de ponta e cota oficial gratuita no Google AI Studio. | **R$ 0,00** |
| **Google Agenda & Tarefas** | Google Calendar API v3 & Google Tasks API v1 | Não é paga para uso individual | O Google Cloud Console disponibiliza até **1.000.000 de requisições gratuitas diárias** para as APIs de Calendar e Tasks. Autenticação via OAuth 2.0 oficial. | **R$ 0,00** |
| **Live Web Search (Notícias & Fatos)** | Feeds RSS Oficiais + DuckDuckGo HTML + Gemini Grounding | APIs como SerpApi e Tavily cobram após 100 buscas | Combinar **RSS Feeds Oficiais** (G1 Rio, Centro de Operações Rio/COR, Agência Brasil, Valor Econômico, InfoMoney, Diários Oficiais) com o grounding nativo do Gemini e busca pública do DuckDuckGo. | **R$ 0,00** |
| **Mapas e Localização no HUD** | Leaflet.js + OpenStreetMap | Google Maps JavaScript API cobra por visualização | Usar **Leaflet.js com OpenStreetMap**. 100% open-source, ultraleve, sem necessidade de cartão de crédito ou faturamento por mapa exibido. | **R$ 0,00** |
| **Banco de Dados Dedicado (VPS)** | **PostgreSQL 16 em Container Docker Dedicado na VPS Hostinger** | Bancos gerenciados cobram planos mensais | Criar um container Docker isolado na VPS Hostinger exclusivo para o PIT.AI, com volume persistente mapeado (`postgres-data`), garantindo isolamento total, velocidade e dados blindados. | **R$ 0,00** (Infra já contratada) |

---

### 8.2. Análise de Repositórios e Skills Open-Source no GitHub

Foram analisadas as principais iniciativas abertas inspiradas em J.A.R.V.I.S. no GitHub:

1. **`open-jarvis/OpenJarvis`**:
   * *O que é:* Plataforma local de agentes com foco em briefing matinal (e-mail e calendário) e modelos locais via Ollama.
   * *Confiabilidade:* Alta reputação, código modular.
   * *Limitação:* Feito para rodar em Python local via terminal/WSL, exigindo máquina potente ligada direto se usar modelos locais pesados.
2. **`synth-mania/jarvis`**:
   * *O que é:* Assistente focado na tríade do Google: Google Calendar, Google Tasks e Gmail.
   * *Confiabilidade:* Excelente como referência arquitetural para os payloads do Google Cloud.
   * *Aproveitamento:* Mostra a modelagem exata dos prompts de detecção de eventos e conflitos de horários.
3. **`bnsware/jarvis-windows`**:
   * *O que é:* Assistente executivo para Windows usando streaming de áudio e automação de rotinas.
   * *Limitação:* Focado em aplicativo desktop `.exe` do Windows, não operando de forma nativa e portátil na web ou celular.

### 8.3. Decisão de Engenharia para o PIT.AI
* **Não clonar scripts Python isolados:** A maioria dos projetos do GitHub são scripts de terminal (`pyaudio`, `pyttsx3`) que amarram o assistente a uma única máquina física e quebram no celular.
* **Construção Nativa na Stack do Sistema (React + Node.js + Web Speech API):** Desenvolver o PIT.AI diretamente na nossa infraestrutura web responsiva. Isso garante que o Rafael acesse via URL (`pitai.rafaelpitaoficial.com.br`) tanto no iPhone/Android quanto no computador de trabalho, com zero custo de infraestrutura adicional.

---

### 8.4. Banco de Dados Dedicado na VPS: Container Docker PostgreSQL

Conforme as Diretrizes Mestres de Desenvolvimento do projeto, o PIT.AI terá seu próprio banco de dados isolado na VPS Hostinger, blindado contra perda de dados através de volumes Docker mapeados:

* **Nome do Container:** `pitai-postgres`
* **Imagem:** `postgres:16-alpine` (estável, ultraleve e performática).
* **Volume Persistente Mapeado:** `pitai_postgres_data:/var/lib/postgresql/data` (mesmo se o container for atualizado, reiniciado ou recriado, nenhum dado ou histórico é perdido).
* **Porta de Conexão:** Porta dedicada mapeada com segurança.
* **Tabelas do Banco (com versionamento por Migrations):**
  * `briefings_cache`: notícias e acontecimentos apurados na web com expiração automática (TTL de 7 dias).
  * `agenda_events_sync`: cache dos eventos do Google Calendar para verificação instantânea de conflitos em milissegundos sem depender da latência da API do Google.
  * `tasks_sync`: histórico de tarefas do Google Tasks e lembretes recorrentes.
  * `conversation_memory`: memória de preferências, notas e contexto pessoal de Rafael Pita.

```yaml
# Arquitetura do Container na VPS (docker-compose.pitai-db.yml)
version: '3.8'

services:
  pitai-postgres:
    image: postgres:16-alpine
    container_name: pitai-postgres
    restart: always
    environment:
      POSTGRES_DB: pitai_core
      POSTGRES_USER: pitai_admin
      POSTGRES_PASSWORD: ${PITAI_DB_PASSWORD}
    ports:
      - "5434:5432"
    volumes:
      - pitai_postgres_data:/var/lib/postgresql/data
    networks:
      - rp_solutions_net

volumes:
  pitai_postgres_data:
    driver: local

networks:
  rp_solutions_net:
    external: true
```

---

## 9. Roadmap de Funcionalidades Futuras

* **Alertas via WhatsApp:** Envio automatizado de lembretes antes de compromissos importantes ou resumo diário no início da manhã.
* **Abertura Automática com Voz:** Ao abrir o navegador no celular ou desktop, o PIT.AI saúda e entrega o resumo dos compromissos do dia e notícias sem necessidade de clique prévio.
* **Outras integrações:** (Reservado para os próximos tópicos que o Rafael irá detalhar).

---

## 10. Histórico Incremental de Requisitos

| Versão | Data | Autor | Resumo da Adição |
| :--- | :--- | :--- | :--- |
| **0.7.0** | 13/11/2026 | Rafael Pita | Atualização do cérebro para a família Gemini 2.0 Flash (alta velocidade, geração mais recente), validação da estratégia de feeds RSS e busca gratuita, e especificação do container Docker PostgreSQL isolado na VPS com volume persistente mapeado. |
| **0.6.0** | 13/11/2026 | Rafael Pita | Levantamento técnico completo de requisitos, viabilidade de custo zero (R$ 0,00) via Web Speech API e cotas gratuitas do Google/Gemini, estratégias para evitar APIs pagas e análise comparativa de repositórios open-source do GitHub. |
| **0.5.0** | 13/11/2026 | Rafael Pita | Detalhamento do motor de produtividade: granularidade completa (hoje/semana/mês/ano), captura veloz por voz (cenário de ligação), detector de conflito de agenda com diálogo de resolução e lembretes espaçados recorrentes. |
| **0.4.0** | 13/11/2026 | Rafael Pita | Mapeamento dos 10 pilares funcionais do J.A.R.V.I.S. traduzidos para a arquitetura real do PIT.AI (Telemetria de VPS, Radar Financeiro, UI Generativa, Multiagente e Sentinela). |
| **0.3.0** | 13/11/2026 | Rafael Pita | Interface Viva (UI generativa sem fricção, projeção de mapas, imagens e navegação web na tela durante o bate-papo) e política de cache inteligente com retenção de 7 dias para economia de custos e velocidade. |
| **0.2.0** | 13/11/2026 | Rafael Pita | Adicionado o módulo de Raciocínio Vivo e Pesquisa Web ao Vivo (Live Search) com cruzamento de fontes para informações recentes e em tempo real. |
| **0.1.0** | 13/11/2026 | Rafael Pita | Criação do documento base: Briefing de notícias (Mundo, Brasil, RJ), integração total com Google Agenda + Google Tarefas por voz/texto e identidade PIT.AI. |
