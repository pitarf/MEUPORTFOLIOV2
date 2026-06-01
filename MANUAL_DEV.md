# MANUAL DO DESENVOLVEDOR (MANUAL_DEV) - ESTRUTURA DE SEO DINÂMICO

Este documento detalha o funcionamento técnico da infraestrutura de SEO Dinâmico e Branding implementada no projeto **MeuPortfolio v2**.

---

## 1. Modelagem do Banco de Dados (Supabase / PostgreSQL)

As configurações globais do site e metadados de SEO estão centralizados na tabela `site_config`. A migração [08_add_seo_columns.sql](file:///C:/Git/React/MeuPortfolio%20v2/migrations/08_add_seo_columns.sql) adicionou com segurança as seguintes colunas à tabela:

| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| `site_title` | `TEXT` | Título SEO global do site para a aba do navegador. |
| `site_description` | `TEXT` | Descrição SEO global (Meta Description) exibida no Google. |
| `site_keywords` | `TEXT` | Palavras-chave do site separadas por vírgula. |
| `favicon_url` | `TEXT` | URL pública da imagem de favicon do site (Bucket: `site-assets`). |
| `og_image_url` | `TEXT` | URL pública da imagem padrão de compartilhamento social (Open Graph). |

---

## 2. Arquitetura do Frontend e Fluxo de Dados

O sistema de SEO utiliza um fluxo dinâmico alimentado pelo Supabase e injetado de forma segura no lado do cliente:

```
[Banco de Dados] -> [SiteConfigContext.jsx] -> [SEO.jsx (react-helmet-async)] -> [Navegador (<head>)]
```

### 2.1 Contexto Geral (`SiteConfigContext.jsx`)
O [SiteConfigContext.jsx](file:///C:/Git/React/MeuPortfolio%20v2/src/contexts/SiteConfigContext.jsx) gerencia a busca em tempo real da tabela `site_config`. Ele expõe o objeto `config`. Em caso de falha de conexão ou tabela vazia, o contexto injeta com segurança os valores padrões do `defaultConfig` para evitar quebras no frontend.

### 2.2 Componente Centralizador (`SEO.jsx`)
O componente [SEO.jsx](file:///C:/Git/React/MeuPortfolio%20v2/src/components/SEO.jsx) é responsável pela injeção dos metadados nas tags `<head>` utilizando a biblioteca `react-helmet-async`. Suas principais atribuições são:

1. **Prioridade de Título e Descrição**: 
   - Utiliza as propriedades passadas via `props` individualmente por página.
   - Caso estejam ausentes, busca as informações personalizadas do banco (`site_title` / `site_description`).
   - Se ainda assim não encontrar, recorre aos fallbacks do `defaultConfig`.
2. **URLs Absolutas Obrigatórias**:
   - Redes sociais exigem URLs absolutas para imagens de compartilhamento e ícones. O componente analisa as URLs vindas do banco e, se forem relativas (ex: `/favicon.png`), concatena-as automaticamente com o `window.location.origin`.
3. **Canonical Tags**:
   - Injeta de forma autônoma a tag `<link rel="canonical" href={currentUrl} />` baseado na URL ativa do navegador, evitando punições do Google por conteúdo duplicado.
4. **Segurança e noindex Automático**:
   - Identifica automaticamente se a rota em navegação pertence a caminhos administrativos ou privados (`/admin`, `/dashboard`, `/area-clientes`, `/support`, `/track-ticket`).
   - Caso seja uma página interna, injeta `<meta name="robots" content="noindex, nofollow" />`.
   - Se for uma página pública, injeta `<meta name="robots" content="index, follow" />`.

---

## 3. Como Estender e Definir Metadados por Página

Por utilizar o `react-helmet-async`, o SEO permite a sobreposição de tags. Caso você crie uma nova página pública e deseje definir metadados específicos para ela, basta importar e renderizar o componente `<SEO />` no topo do arquivo passando as propriedades desejadas:

```jsx
import React from 'react';
import SEO from '@/components/SEO';

const NovaPagina = () => {
    return (
        <>
            <SEO 
                title="Novo Serviço de Desenvolvimento" 
                description="Conheça nossas soluções completas de desenvolvimento de sistemas." 
                keywords="desenvolvimento, sistemas, react, software"
                image="/imagens/og-servico.jpg" // Pode ser relativo ou absoluto
            />
            
            {/* Conteúdo da Página */}
            <div>...</div>
        </>
    );
};

export default NovaPagina;
```

O `react-helmet-async` identificará a tag mais interna e substituirá os metadados globais configurados no `App.jsx` de forma automática e transparente.

---

## 4. Otimização de Imagens e Favicons

Os uploads de Favicon e Imagem Open Graph são processados e compactados no frontend através da função utilitária `compressImage` (dentro de [ManageGeneralSettings.jsx](file:///C:/Git/React/MeuPortfolio%20v2/src/pages/admin/ManageGeneralSettings.jsx)) antes de serem enviados para o bucket de armazenamento `site-assets` no Supabase. Isso garante arquivos leves e carregamentos instantâneos.
