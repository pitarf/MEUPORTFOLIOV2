# Motor de IA - Gerador de Propostas Comerciais 99Freelas

Este diretório reúne **todos os recursos, diretrizes, templates e inteligência de vendas** utilizados para alimentar a inteligência artificial (Gemini e ChatGPT) na geração de propostas de alta conversão para a plataforma 99Freelas.

---

## 📂 Estrutura de Arquivos

| Arquivo | Descrição |
| :--- | :--- |
| [`diretrizes.txt`](./diretrizes.txt) | **Diretrizes Comerciais & Regras de Formatação:** Tom de voz por gênero, links únicos de portfólio, modelo 100% remoto, piso mínimo de R$ 56,00, tags customizadas (`{b}`, `{i}`, `{u}`) e proibição de traços/markdown robotizado. |
| [`prompt_sistema.md`](./prompt_sistema.md) | **Template Mestre do Prompt do Sistema:** O prompt completo injetado na API da IA com a documentação de todas as variáveis dinâmicas de projeto e instruções de input prioritário. |
| [`repertorio_cases.md`](./repertorio_cases.md) | **Autoridade e 55 Cases Reais:** Síntese categorizada dos 55 projetos executados e avaliados com 5 estrelas no 99Freelas por Rafael Pita (Next.js, React, APIs, Automação, WordPress, ERP, etc.) para citar como prova de conceito. |
| [`guia_precificacao_prazos.md`](./guia_precificacao_prazos.md) | **Regras de Negócio, Preço e Prazo:** Lógica de cálculo de valor médio, faixas por complexidade, piso mínimo da plataforma, regras de urgência (+30%) e malícia comercial para sistemas robustos. |
| [`exemplos_propostas.md`](./exemplos_propostas.md) | **Modelos de Propostas Aprovadas:** Exemplos práticos de micro-propostas ultra-diretas (50-90 palavras) e propostas estruturadas em estilo *One-Page* (140-200 palavras). |

---

## 🚀 Como Esse Motor é Utilizado

### 1. Pela Extensão Chrome e Userscript (Uso Automático)
Na extensão do navegador (`content.js` e `userscript/99freelas-produtividade.user.js`):
1. O script raspa os dados da página do projeto no 99Freelas (título, descrição, cliente, valores e prazos médios dos concorrentes, hora de envio).
2. Se o freelancer preencher o campo opcional **"Informações para IA (Opcional)"**, esse conteúdo é capturado como **Prioridade Absoluta** (com histórias reais, convites para call e valores fixos).
3. O script lê as diretrizes (`diretrizes.txt`), monta o `systemPrompt` estruturado e dispara a requisição para a chave ativa (Gemini `gemini-2.5-flash` ou OpenAI `gpt-4o-mini`).
4. A IA retorna um JSON estrito contendo:
   - `valorFinal`: apenas dígitos do valor proposto;
   - `prazoDias`: apenas dígitos do prazo proposto;
   - `textoDetalhes`: texto da proposta com formatação nativa (`{b}`, `{i}`, `{u}`).
5. A extensão preenche os inputs do formulário do 99Freelas instantaneamente.

### 2. Manualmente em Chats de IA (ChatGPT, Claude, Gemini Web)
Se desejar gerar uma proposta diretamente na interface web de qualquer IA:
1. Abra o arquivo [`prompt_sistema.md`](./prompt_sistema.md).
2. Substitua os dados do projeto no bloco `DADOS DO PROJETO`.
3. Se tiver alguma anotação, preencha o bloco `INSTRUÇÕES EXTRAS E INPUT DIRETO DO FREELANCER`.
4. Cole todo o texto no ChatGPT ou Gemini e solicite a proposta.

---

> [!NOTE]
> Uma cópia de `diretrizes.txt` permanece na raiz do projeto por requisitos de empacotamento do Chrome Manifest V3 (`chrome.runtime.getURL("diretrizes.txt")`). Sempre que atualizar as diretrizes, mantenha ambos os arquivos sincronizados.

