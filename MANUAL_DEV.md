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

### 1.3 Integração e Reatividade Total de Temas na Fotografia

Diferente da estrutura legada que forçava o Tema Escuro em toda a área de fotografia (`/portfolio-fotografia` e `/portfolio-fotografia/galeria`), a seção foi integralmente integrada ao alternador dinâmico de temas da Navbar. 

1. **Tema Claro Editorial (Light Mode)**: Foco em fundos marfim/branco limpos, molduras finas, tipografia em cinza-escuro (`text-gray-900`) e rótulos discretos em cinza (`text-gray-400`), resultando em um visual de portfólio artístico de altíssimo nível.
2. **Tema Escuro Cinematográfico (Dark Mode)**: Preservação de fundos pretos espaciais profundos de alto contraste e realce cromático de fotos em lote.

As páginas transitam suavemente através do wrapper `min-h-screen bg-background text-foreground transition-colors duration-300`.

---

## 2. Estrutura de SEO Dinâmico

As configurações globais de metadados e marcas são carregadas diretamente do banco de dados (tabela `site_config`). A migração [08_add_seo_columns.sql](file:///C:/Git/React/MeuPortfolio%20v2/migrations/08_add_seo_columns.sql) adicionou com segurança as colunas de metadados à tabela.

### 2.1 Componente Centralizador (`SEO.jsx`)
O componente [SEO.jsx](file:///C:/Git/React/MeuPortfolio%20v2/src/components/SEO.jsx) é responsável pela injeção das tags de cabeçalho via `react-helmet-async`. Suas principais funções são:
1. **Hierarquia de Prioridade**: Combina as propriedades individuais de páginas com as variáveis globais de SEO cadastradas no banco de dados.
2. **URLs Absolutas Obrigatórias**: Transforma caminhos relativos em caminhos absolutos completos concatenando `window.location.origin` para exibição correta de previews de imagens em redes sociais (WhatsApp/LinkedIn).
3. **Canonical Tags**: Evita conteúdo duplicado no Google ao injetar a tag canônica com a URL ativa do navegador.
4. **noindex Automatizado**: Injeta a tag `<meta name="robots" content="noindex, nofollow" />` em qualquer rota administrativa ou privada (`/admin`, `/dashboard`, `/area-clientes`, `/support`, `/track-ticket`), garantindo a segurança e proteção das faturas e dados de suporte.

### 2.2 Fallback Automático e Otimização Regional (RJ)
1. **Herança do Logotipo**: Se a URL do Favicon (`favicon_url`) ou a imagem Open Graph (`og_image_url`) não estiverem cadastradas no banco de dados, o componente resolve dinamicamente herdando a URL da logo principal do site (`logo_url`) de forma automatizada.
2. **Integração Unificada**: O componente `<SEO />` substitui todas as tags `<Helmet>` brutas nas páginas chaves (`Home.jsx`, `Services.jsx`, `Portfolio.jsx`, `PhotographyLanding.jsx`, `PhotographyPortfolio.jsx` e `ProjectPage.jsx`).
3. **SEO Local RJ**: As palavras-chave e descrições foram estruturadas nas páginas públicas com termos fortes de buscas regionais, como *"fotos de pre wedding rio de janeiro"*, *"fotos casamento rio de janeiro"* e *"desenvolvimento de sites rj"*, garantindo prioridade de ranqueamento para o portfólio nessas palavras-chave.

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

---

## 4. Arquitetura de Abas e Otimização de Filtros do Portfólio (`Portfolio.jsx`)

Para garantir uma interface corporativa refinada de alta autoridade, o portfólio geral implementa uma lógica de dados inteligente combinada com design multilinha adaptável.

### 4.1 Limpeza Estrita de Dados (Filtro Fotografia/"Geral")
Os projetos de fotografia possuem seu próprio estúdio dedicado em `/portfolio-fotografia`. No portfólio geral corporativo, registros legados ou sem categoria atribuída (classificados como "Geral") são eliminados no carregamento de dados (`fetchPortfolioData`):
1. O sistema obtém as categorias corporativas ativas no Supabase (excluindo o slug `'fotografia'`).
2. Os projetos carregados são filtrados em lote, permitindo a exibição **apenas** daqueles que possuem um `category_id` pertencente à lista de IDs corporativos ativos. Isso blinda a rota corporativa contra poluição de conteúdos artísticos de fotografia.

### 4.2 Ocultação Automática de Especialidades Vazias
Para manter a interface limpa e focada nas entregas do portfólio, categorias que possuem `0 projetos` associados na base de dados ativa são ocultadas de forma dinâmica. O array de abas é calculado filtrando as categorias carregadas, restando apenas especialidades com projetos vinculados (`count > 0`).

### 4.3 Pílulas Multilinha Sem Rolagem (`layoutId`)
Para banir a barra de rolagem inestética horizontal do Windows, o seletor utiliza uma grade multilinha flexível (`flex flex-wrap gap-2.5`). A troca de abas é suavizada usando a animação física de mola do **Framer Motion**:
* O botão ativo renderiza internamente um `motion.span` configurado with `layoutId="activeTabBackground"`.
* Ao clicar em uma nova pílula de categoria, o gradiente azul-púrpura de fundo "desliza" de forma contínua e orgânica entre as abas em vez de dar um salto brusco, simulando a fluidez de interfaces móveis e de alta sofisticação.

### 4.4 Visualizador de Mídias e Zoom Vertical Inteligente (`ImageGalleryModal.jsx`)
O lightbox de visualização pública de mídias integra em um único carrossel unificado a capa principal e as fotos da galeria do projeto. Ele dispõe de comportamento adaptativo baseado no zoom:
1. **Visualização Padrão**: A imagem é exibida de forma contida e centralizada (`items-center max-w-full max-h-full object-contain`).
2. **Modo Zoom**: Ao clicar na imagem, se for uma captura vertical longa (como prints de páginas inteiras de sites), o wrapper do slide altera seu alinhamento para o topo (`items-start`) e ativa a rolagem vertical (`overflow-y-auto`), enquanto a imagem expande para preencher a largura (`w-full max-w-4xl h-auto`). Isso possibilita ler o conteúdo e rolar de cima a baixo com perfeita legibilidade e sem distorções de escala.

---

## 5. Armazenamento Híbrido & Otimização WebP

Para contornar o limite restrito de 1 GB do Supabase Cloud, o projeto adota uma arquitetura híbrida:
- **Dados Estruturados e Login:** Supabase Database (PostgreSQL) e Supabase Auth.
- **Arquivos e Mídias Pesadas:** Firebase Storage ( Spark Plan - 5 GB gratuitos).

### 5.1 Otimizador de Imagem (`src/utils/imageOptimizer.js`)
O utilitário `optimizeAndConvertToWebP` utiliza a biblioteca `browser-image-compression` para processar arquivos de imagem localmente no navegador antes de realizar qualquer envio:
1. **Detecção de Proporção**: Obtém a largura e altura nativas da imagem. Se a proporção `altura/largura > 1.5` (prints de tela cheia/verticais), estende dinamicamente o limite máximo de resolução (`maxWidthOrHeight`) para até `8192px` para preservar a largura original da imagem e manter os textos e elementos legíveis no zoom.
2. **Compressão**: Para imagens normais (quadradas ou horizontais), limita a resolução máxima a `1920px` (largura ou altura) para economia de banda, e reduz o tamanho do arquivo a no máximo `1.2MB`.
3. **Conversão**: Converte forçadamente arquivos PNG, JPG e JPEG para a extensão `.webp`.
4. **Qualidade**: Qualidade de compressão definida para `0.85`, preservando o padrão visual de fotografia premium sem sobrecarregar o tráfego do usuário.

### 5.2 Cliente Firebase (`src/lib/firebaseClient.js`)
Centraliza as chaves do Firebase obtidas a partir de variáveis de ambiente do Vite (`import.meta.env`). Exporta a instância `storage` usada em toda a plataforma.

### 5.3 Painel de Migração (`StorageOptimization.jsx`)
A tela de otimização no painel administrativo foi transformada em uma ferramenta de migração segura de dados. Ao rodar a rotina:
1. Baixa as imagens originais do Supabase.
2. Otimiza localmente para `.webp` de forma transparente.
3. Faz o upload para o Firebase Storage e recupera a URL pública definitiva.
4. Atualiza os campos correspondentes na tabela `projects` do Supabase.
5. Deleta a imagem antiga do Supabase Storage, liberando espaço imediatamente.

