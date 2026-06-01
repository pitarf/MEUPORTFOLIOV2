# MANUAL DO DESENVOLVEDOR (MANUAL_DEV) - ESTRUTURA DE SEO & TEMAS PREMIUM

Este documento detalha o funcionamento técnico da infraestrutura de SEO Dinâmico e da Arquitetura Dinâmica de Temas (Claro/Escuro) implementada no projeto **MeuPortfolio v2**.

---

## 1. Arquitetura de Temas (Claro e Escuro)

O projeto foi reestruturado para suportar a alternância entre o **Tema Claro (Light Mode)** — padrão comercial corporativo focado em legibilidade e conversão — e o **Tema Escuro (Dark Mode)**, preservando a imersão visual original.

### 1.1 Contexto de Tema (`ThemeContext.jsx`)
O [ThemeContext.jsx](file:///C:/Git/React/MeuPortfolio%20v2/src/contexts/ThemeContext.jsx) gerencia o estado global de temas. Ele é inicializado por padrão como `'light'`. Suas atribuições principais são:
1. **Persistência**: Grava a preferência escolhida do usuário no `localStorage`. Em futuras visitas, a aplicação lê esse valor e carrega a interface de acordo com a preferência do usuário.
2. **Injeção do Tailwind**: Adiciona ou remove a classe `.dark` e `.light` no elemento principal `document.documentElement`, permitindo que o Tailwind CSS aplique as cores de tema reativo de forma fluida.
3. **Exposição**: Disponibiliza a string `theme` e a função `toggleTheme` através do hook customizado `useTheme()`.

### 1.2 Estilos Globais e Variáveis HSL (`index.css`)
As cores do projeto são dinâmicas e definidas em classes semânticas HSL. O arquivo [index.css](file:///C:/Git/React/MeuPortfolio%20v2/src/index.css) organiza a paleta de cores nos seguintes blocos:

* **`:root` (Tema Claro)**: Tons neutros de branco e cinza ultra claros com contraste perfeito para tipografia escura, aliado a um azul primário corporativo sofisticado (`--primary: 221.2 83.2% 53.3%`).
* **`.dark` (Tema Escuro)**: Tons pretos/espaciais com nuances escuras e azul/lavanda neon original.

As classes premium utilitárias adaptam-se dinamicamente conforme a classe `.dark` na tag `html`:
* **`.glass-effect`**:
  * *Tema Claro*: Vidro branco brilhante translúcido (`rgba(255,255,255,0.7)`) com bordas muito sutis e sombra de profundidade leve.
  * *Tema Escuro*: Vidro preto espacial translúcido (`rgba(255,255,255,0.05)`) com bordas escuras.
* **`.service-card`**:
  * *Tema Claro*: Fundo branco translúcido, bordas sutis e elevação de -5px com sombra pastel roxa no hover.
  * *Tema Escuro*: Gradiente preto sutil, elevação de -10px com brilho neon roxo no hover.
* **`.gradient-text`**:
  * *Tema Claro*: Gradiente escuro de azul a violeta para legibilidade impecável e contraste em fundos brancos.
  * *Tema Escuro*: Gradiente brilhante lavanda original.

### 1.3 Isolamento da Seção de Fotografia
Para manter a identidade visual clássica de estúdios fotográficos profissionais de luxo, a área de fotografia (`/portfolio-fotografia`) possui **Tema Escuro forçado**. Independentemente da seleção do usuário global, o cabeçalho e rodapé desta seção são travados no tema escuro para assegurar o maior realce artístico e contraste das fotos corporativas e artísticas do profissional.

---

## 2. Estrutura de SEO Dinâmico

As configurações globais de metadados e marcas são carregadas diretamente do banco de dados (tabela `site_config`). A migração [08_add_seo_columns.sql](file:///C:/Git/React/MeuPortfolio%20v2/migrations/08_add_seo_columns.sql) adicionou com segurança as colunas de metadados à tabela.

### 2.1 Componente Centralizador (`SEO.jsx`)
O componente [SEO.jsx](file:///C:/Git/React/MeuPortfolio%20v2/src/components/SEO.jsx) é responsável pela injeção das tags de cabeçalho via `react-helmet-async`. Suas principais funções são:
1. **Hierarquia de Prioridade**: Combina as propriedades individuais de páginas com as variáveis globais de SEO cadastradas no banco de dados.
2. **URLs Absolutas Obrigatórias**: Transforma caminhos relativos em caminhos absolutos completos concatenando `window.location.origin` para exibição correta de previews de imagens em redes sociais (WhatsApp/LinkedIn).
3. **Canonical Tags**: Evita conteúdo duplicado no Google ao injetar a tag canônica com a URL ativa do navegador.
4. **noindex Automatizado**: Injeta a tag `<meta name="robots" content="noindex, nofollow" />` em qualquer rota administrativa ou privada (`/admin`, `/dashboard`, `/area-clientes`, `/support`, `/track-ticket`), garantindo a segurança e proteção das faturas e dados de suporte.

---

## 3. Como Estender e Adicionar Novos Componentes Reativos

Ao criar novos componentes de interface, **nunca** utilize classes de cores escuras ou claras estáticas (como `bg-gray-900` ou `text-white`) se o componente precisar de adaptabilidade de temas. Utilize o padrão semântico do Tailwind:

```jsx
import React from 'react';

const NovoCard = () => {
    return (
        <div className="bg-card text-card-foreground border border-border p-6 rounded-xl shadow-sm transition-colors duration-300">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">Título do Bloco</h4>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Descrição descritiva do bloco adaptável.</p>
        </div>
    );
};

export default NovoCard;
```
As classes `text-gray-900 dark:text-white` e `text-gray-600 dark:text-gray-400` garantem contraste impecável e conforto visual nos dois modos sem quebras de layout.
