# TEMPLATE & BRIEFING PARA CADASTRO DE PROJETOS DE INTELIGÊNCIA ARTIFICIAL

Este documento serve como guia e formulário padronizado para cadastrar novos projetos de **Inteligência Artificial (IA), Automações com LLMs e Machine Learning** no portfólio oficial de Rafael Pita Solutions.

---

## 1. FORMULÁRIO DE CADASTRO (COPIE E PREENCHA)

```markdown
### 1. DADOS DE IDENTIFICAÇÃO
* Titulo do Projeto: [Ex: Agente Autônomo de Vendas e Qualificação no WhatsApp]
* Slug da URL: [Ex: agente-ia-vendas-whatsapp (ou deixar em branco para geração automática)]
* Categoria no Portfólio: [Automações / Inteligência Artificial / Desenvolvimento de Sistemas]
* Cliente ou Empresa: [Ex: Construtora e Incorporadora Alpha / ou "Confidencial" / ou "Projeto Próprio"]
* Ano de Realização: [Ex: 2026]
* Link de Produção ou Demonstração: [Ex: https://demo.agenteia.com.br ou wa.me/... (ou "Privado / Interno")]

### 2. STACK TECNOLÓGICA & FERRAMENTAS
* Modelos de IA (LLMs): [Ex: OpenAI GPT-4o, Claude 3.5 Sonnet, Whisper para transcrição de áudio]
* Frameworks & Bibliotecas: [Ex: LangChain, LlamaIndex, OpenAI Assistant API, pgvector]
* Backend & Banco de Dados: [Ex: Python (FastAPI), Node.js, PostgreSQL, Redis]
* Orquestração & Automação: [Ex: n8n, Webhooks, Evolution API, Typebot]
* Frontend / Interface: [Ex: React, Tailwind CSS, Next.js, Streamlit (ou API pura)]

### 3. VISÃO GERAL (RESUMO EXECUTIVO)
[Escreva de 2 a 4 linhas explicando o que é o sistema, para quem foi feito e seu propósito central.
Exemplo: Sistema inteligente de atendimento e prospecção ativa via WhatsApp com RAG (Retrieval-Augmented Generation). O agente consulta o catálogo de imóveis e tabela de preços em tempo real, tira dúvidas técnicas de financiamento e agenda reuniões diretamente na agenda dos corretores.]

### 4. O DESAFIO (A DOR DO NEGÓCIO)
[Explique qual problema ou gargalo a empresa enfrentava antes da IA.
Exemplo: A construtora recebia mais de 400 contatos por semana provenientes de anúncios no Meta Ads e Google, mas a equipe humana demorava até 4 horas para responder o primeiro contato. Mais de 60% dos leads esfriavam antes da qualificação, gerando perda massiva de oportunidades e sobrecarga de atendimento.]

### 5. A SOLUÇÃO IMPLEMENTADA
[Explique como a arquitetura de Inteligência Artificial resolveu a questão na prática.
Exemplo:
1. Integração com WhatsApp Oficial via Webhook e processamento assíncrono.
2. Base de conhecimento vetorial com RAG utilizando embeddings da documentação de 12 empreendimentos.
3. Capacidade de entender áudios dos clientes através do Whisper e responder por texto ou áudio natural.
4. Triagem inteligente que identifica a renda, urgência e interesse do comprador.
5. Agendamento automático com o corretor responsável via integração com Google Calendar API.]

### 6. RESULTADOS & MÉTRICAS DE SUCESSO
[Apresente os números e ganhos concretos alcançados.
Exemplo:
* Redução do tempo de primeira resposta de 4 horas para menos de 10 segundos.
* Atendimento ininterrupto 24 horas por dia, 7 dias por semana (incluindo fins de semana).
* Aumento de 42% no volume de visitas agendadas aos plantões de vendas.
* Mais de 15.000 mensagens processadas no primeiro mês sem intervenção manual.]

### 7. ASSETS VISUAIS & MÍDIAS
* Imagem Principal (Mockup / Capa 16:9): [Enviar arquivo ou indicar se deseja criação de mockup personalizado]
* Galeria de Imagens (Opcional): [Prints do fluxo no n8n, arquitetura técnica, dashboards de métricas]
* Vídeo Demonstrativo (Opcional): [Link do YouTube, Vimeo ou gravação de tela]
```

---

## 2. EXEMPLO REAL PREENCHIDO (MODELO DE REFERÊNCIA)

Para referência de padrão executivo de redação, veja como fica um projeto pronto para ir ao ar:

### Identificação
* **Título do Projeto:** Agente Inteligente de Atendimento Jurídico & Triagem de Casos
* **Slug:** `agente-ia-atendimento-juridico`
* **Categoria:** Automações & Sistemas Inteligentes
* **Cliente:** Escritório de Advocacia Empresarial (São Paulo, SP)
* **Ano:** 2026
* **Link:** `Demonstração Privada em Sandbox`

### Tecnologias Utilizadas
* **Modelos de IA:** Anthropic Claude 3.5 Sonnet (raciocínio jurídico) e OpenAI text-embedding-3-small
* **Arquitetura:** Python, FastAPI, Supabase (PostgreSQL com extensão pgvector), LangChain
* **Comunicação:** Evolution API (WhatsApp Gateway), Webhooks assíncronos e n8n Cloud

### Visão Geral
Assistente virtual com inteligência artificial generativa treinado nas teses jurídicas e áreas de atuação do escritório. O agente conversa em linguagem empática, acolhe o cliente, faz perguntas de triagem conforme a matéria jurídica (Trabalhista, Cível ou Tributário) e gera um relatório prévio para o advogado titular.

### O Desafio
O escritório recebia dezenas de mensagens diárias com dúvidas genéricas e pessoas que não se enquadravam no perfil de clientes atendidos. Os advogados seniores gastavam mais de 15 horas semanais filtrando casos sem viabilidade jurídica.

### A Solução
Desenvolvimento de uma esteira com RAG e avaliação semântica. O robô faz a anamnese inicial do caso sem emitir parecer de mérito reservado à advocacia, reúne os dados essenciais (datas, documentos disponíveis, partes envolvidas) e aciona o advogado especialista com o caso estruturado.

### Resultados
* 100% dos contatos atendidos em menos de 15 segundos.
* Economia estimada de 60 horas mensais da equipe jurídica sênior.
* Triagem com 96% de assertividade na identificação da área do Direito.
* Integração segura respeitando as diretrizes de privacidade e normas da OAB.

---

## 3. TABELA TÉCNICA DE CAMPOS NO BANCO DE DADOS (`projects`)

| Campo no Banco | Tipo | Obrigatório? | Descrição |
| :--- | :--- | :--- | :--- |
| `title` | Text | **Sim** | Nome de destaque do projeto exibido no card e no cabeçalho |
| `slug` | Text (Unique) | **Sim** | URL amigável (ex: `meu-projeto-ia`) |
| `category_id` | UUID | **Sim** | Categoria vinculada da tabela `categories` |
| `client` | Text | Não | Nome do cliente ou "Projeto Próprio" |
| `year` | Integer | Não | Ano do projeto (padrão: ano corrente) |
| `services` | Text | Não | Tecnologias e tags separadas por vírgula para as pílulas visuais |
| `description` | Text | Não | Resumo executivo do projeto |
| `challenge` | Text | Não | O problema de negócio |
| `solution` | Text | Não | A arquitetura e implementação da solução |
| `results` | Text | Não | Métricas, porcentagens e impactos obtidos |
| `project_url` | Text | Não | Link externo de teste ou produção |
| `main_image_url` | Text | Não | Imagem de capa (formato 16:9 em WebP) |
| `gallery_urls` | Text[] | Não | Array de URLs de imagens secundárias para o carrossel |
| `video_urls` | Text | Não | Links de vídeos explicativos |
| `display_order` | Integer | Não | Ordem de exibição na grade do portfólio (ex: 10, 20, 30) |

---

## 4. DIRETRIZES DE ASSETS E IMAGENS
* **Proporção Recomendada:** 16:9 (paisagem widescreen) para visualização impecável tanto no Desktop quanto no Mobile.
* **Resolução Recomendada:** 1920x1080 pixels (Full HD) ou 1280x720 pixels.
* **Formato Ideal:** WebP (o próprio sistema faz a conversão e compressão automática no momento do upload).
* **Identidade Visual:** Se o projeto for próprio, utilize acentos com o verde neon `#bcf13b` e fundo escuro `#0a0a08` em harmonia com a nova marca da Rafael Pita Solutions.
