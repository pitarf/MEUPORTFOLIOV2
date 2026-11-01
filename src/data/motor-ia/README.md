# Motor de IA - Gerador de Propostas Comerciais 99Freelas

Este diretório reúne **todos os recursos, diretrizes, templates e inteligência de vendas** utilizados para alimentar a inteligência artificial (Gemini e ChatGPT) na geração de propostas de alta conversão para a plataforma 99Freelas.

---

## 📂 Estrutura de Arquivos

| Arquivo | Descrição |
| :--- | :--- |
| [`diretrizes.txt`](./diretrizes.txt) | **Diretrizes Comerciais & Regras de Formatação:** Tom de voz por gênero, links únicos de portfólio, modelo 100% remoto, piso mínimo de R$ 56,00, tags customizadas (`{b}`, `{i}`, `{u}`) e proibição de traços/markdown robotizado. |
| [`prompt_sistema.md`](./prompt_sistema.md) | **Template Mestre do Prompt do Sistema:** O prompt completo injetado na API da IA com a documentação de todas as variáveis dinâmicas de projeto e instruções de input prioritário. |
| [`repertorio_cases.md`](./repertorio_cases.md) | **Autoridade e 55 Cases Reais:** Síntese categorizada dos 55 projetos executados e avaliados com 5 estrelas no 99Freelas por Rafael Pita + os 60 projetos reais do portfólio para citar como prova de conceito. |
| [`guia_precificacao_prazos.md`](./guia_precificacao_prazos.md) | **Regras de Negócio, Preço e Prazo:** Lógica de cálculo de valor médio, faixas por complexidade, piso mínimo da plataforma, regras de urgência (+30%) e malícia comercial para sistemas robustos. |
| [`exemplos_propostas.md`](./exemplos_propostas.md) | **Modelos de Propostas Aprovadas:** Exemplos práticos de micro-propostas ultra-diretas (50-90 palavras) e propostas estruturadas em estilo *One-Page* (140-200 palavras). |
| [`historico_projetos_realizados.md`](./historico_projetos_realizados.md) | **Raio-X Completo dos 55 Projetos:** Documentação exaustiva de cada um dos 55 projetos avaliados no perfil com briefing na íntegra, escopo técnico, ferramentas e depoimentos dos clientes. |
| [`projetos_detalhados_completos.json`](./projetos_detalhados_completos.json) | **Base Estruturada Bruta (JSON):** Dados completos extraídos dos 55 projetos (títulos, briefings, valores, notas e depoimentos). |
| [`projetos_consolidados.json`](./projetos_consolidados.json) | **Síntese Estruturada Bruta (JSON):** Resumo compacto dos projetos concluídos. |

---

## 🔄 Sincronização Obrigatória (Extensão & Backend do Portfólio)

Por diretriz mestre de arquitetura, toda alteração nesta pasta deve ser refletida simultaneamente nos dois projetos:

1. **Na Extensão Chrome / Userscript:**
   `c:\Git\extencion\propsotas 99freelas\motor-ia\`
2. **No Backend do Portfólio (MeuPortfolio v2):**
   `c:\Git\React\MeuPortfolio v2\src\data\motor-ia\`

Dessa forma, tanto a API oficial de produção na Vercel quanto o motor local da extensão operam sempre com os dados, cases e regras comerciais rigorosamente idênticos.
