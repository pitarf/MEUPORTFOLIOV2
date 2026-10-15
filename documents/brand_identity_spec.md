# Especificacao de Identidade Visual e Design System

Documento tecnico de padronizacao visual para o portfolio de Rafael Pita, extraido e consolidado a partir das diretrizes de marca e componentes de interface.

---

## 1. Paleta de Cores Hexadecimal

A paleta fundamenta-se no contraste de alta fidelidade entre um fundo escuro profundo mineral (obsidian black) e pontos de atencao em verde neon acido (chartreuse / lime).

| Token de Design | Codigo Hex | Aplicacao Principal | Detalhes de Uso |
| :--- | :--- | :--- | :--- |
| `background-deep` | `#0a0a08` | Fundo principal da pagina | Obsidian black ultra profundo, base de contraste geral |
| `surface-card` | `#121210` | Fundo dos cards e conteineres | Superficie escura neutra para delimitacao de conteudo |
| `surface-elevated`| `#161613` | Modais, dropdowns e inputs | Camada de elevacao intermediaria |
| `surface-pill` | `#1a1a16` | Tags de tecnologias e capsulas | Fundo de badges secundarios e tags de habilidades |
| `border-subtle` | `#23231f` | Bordas padrao e divisores | Tracos sutis para contorno sem poluir a interface |
| `border-separator`| `#1f1f1b` | Divisores de secao horizontais | Linhas minimas de separacao estrutural |
| `primary-neon` | `#bcf13b` | Destaque principal e CTAs | Verde neon / chartreuse vibrante de alta visibilidade |
| `primary-accent` | `#a8df2a` | Hover de botoes primarios | Variacao de verde com maior profundidade tonal |
| `text-primary` | `#ffffff` | Titulos e enfases de texto | Branco puro para maxima legibilidade |
| `text-secondary` | `#9da3af` | Paragrafos e subtitulos | Cinza neutro balanceado para reducao de fadiga visual |
| `text-muted` | `#71717a` | Numeradores (/01, /02) e metadados | Cinza escuro para informacoes de suporte |
| `glow-neon` | `rgba(188, 241, 59, 0.15)` | Sombras difusas e glow | Iluminacao suave em estado hover e foco |

---

## 2. Logotipo e Identidade 'rp .'

O logotipo e composto pela tipografia minimalista minuscula `rp` em corte reto sans-serif, acompanhada por um ponto neon caracteristico.

### 2.1 Especificacoes Geometricas
* Texto: `rp` em caixa-baixa, fonte sans-serif geometrica de peso Bold ou Black.
* Cor do texto: `#ffffff` (Branco puro).
* Ponto final: quadrado ou circulo perfeito com dimensao proporcional a espessura da haste da letra `p`.
* Cor do ponto: `#bcf13b` (Verde neon).
* Margem entre `rp` e o ponto: espacamento fixo de 2px a 4px.

### 2.2 Estrutura SVG Vetorial

```xml
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 72 32"
  fill="none"
  aria-label="Logo rp."
  class="h-8 w-auto"
>
  <text
    x="0"
    y="26"
    fill="#ffffff"
    font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    font-size="28"
    font-weight="800"
    letter-spacing="-0.04em"
  >rp</text>
  <rect
    x="38"
    y="20"
    width="6"
    height="6"
    rx="1"
    fill="#bcf13b"
  />
</svg>
```

### 2.3 Componente React Reutilizavel (`RpLogo.tsx`)

```tsx
import React from 'react';

interface RpLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  dotColor?: string;
  showCategory?: boolean;
}

export const RpLogo: React.FC<RpLogoProps> = ({
  className = '',
  size = 'md',
  dotColor = '#bcf13b',
  showCategory = false,
}) => {
  const sizeMap = {
    sm: { text: 'text-xl', dot: 'w-1.5 h-1.5', spacing: 'gap-1' },
    md: { text: 'text-2xl', dot: 'w-2 h-2', spacing: 'gap-1.5' },
    lg: { text: 'text-4xl', dot: 'w-3 h-3', spacing: 'gap-2' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div className={`inline-flex items-baseline ${currentSize.spacing} font-extrabold tracking-tighter leading-none select-none`}>
        <span className={`${currentSize.text} text-white font-sans`}>rp</span>
        <span
          className={`${currentSize.dot} rounded-sm inline-block`}
          style={{ backgroundColor: dotColor }}
          aria-hidden="true"
        />
      </div>

      {showCategory && (
        <div className="flex items-center ml-4 pl-4 border-l border-[#23231f]">
          <span className="text-xs font-mono font-medium tracking-widest text-[#bcf13b] uppercase">
            RAFAEL PITA SOLUTIONS
          </span>
        </div>
      )}
    </div>
  );
};

export default RpLogo;
```

---

## 3. Tipografia e Estrutura Hierarquica

A escala tipografica adota uma combinacao equilibrada de fonte Sans-serif para titulos e leitura corrida, com fonte Monospace para dados tecnicos, numeradores e badges.

### 3.1 Familias Tipograficas Recomendadas
* Primaria (Interface / Display): Inter, Plus Jakarta Sans, Geist Sans ou system-ui.
* Secundaria (Codigo / Metadados): JetBrains Mono, Fira Code ou ui-monospace.

### 3.2 Escala de Estilos
* Hero Title:
  * Classes: `text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white`
  * Termos de destaque: `text-[#bcf13b]`
* Hero Subtitle:
  * Classes: `text-base sm:text-lg text-[#9da3af] max-w-2xl leading-relaxed font-normal`
* Titulos de Secao / Cards:
  * Classes: `text-xl sm:text-2xl font-bold text-white tracking-tight`
* Paragrafos de Cards:
  * Classes: `text-sm sm:text-base text-[#9da3af] leading-relaxed font-normal`
* Metadados e Numeradores:
  * Classes: `text-xs sm:text-sm font-mono text-[#71717a] font-medium`

---

## 4. Biblioteca de Classes Tailwind CSS Recomendadas

### 4.1 Cards de Servicos e Projetos

Padrao estrutural com cabecalho (icone na esquerda, numeracao no canto superior direito), corpo explicativo e rodape com tags tecnicas.

```html
<div class="group relative bg-[#121210] border border-[#23231f] rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ease-out hover:border-[#bcf13b] hover:shadow-[0_0_25px_rgba(188,241,59,0.15)] hover:-translate-y-1">
  
  <!-- Cabecalho do Card -->
  <div class="flex items-center justify-between mb-6">
    <div class="text-[#bcf13b] w-8 h-8 flex items-center justify-center">
      <!-- Icone SVG com traco fino stroke-2 -->
    </div>
    <span class="font-mono text-xs text-[#71717a] tracking-wider font-semibold">
      /01
    </span>
  </div>

  <!-- Titulo e Descricao -->
  <div class="space-y-3 mb-8">
    <h3 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
      Business Intelligence
    </h3>
    <p class="text-sm text-[#9da3af] leading-relaxed">
      Dados que contam historias. Desenvolvimento e manutencao de dashboards e relatorios que apoiam a gestao e a tomada de decisoes.
    </p>
  </div>

  <!-- Tags de Tecnologia -->
  <div class="flex flex-wrap gap-2 pt-4 border-t border-[#1f1f1b]">
    <span class="px-2.5 py-1 rounded bg-[#1a1a16] border border-[#23231f] text-xs font-mono text-[#a1a1aa] transition-colors group-hover:border-[#bcf13b]/30 group-hover:text-white">
      Power BI
    </span>
    <span class="px-2.5 py-1 rounded bg-[#1a1a16] border border-[#23231f] text-xs font-mono text-[#a1a1aa] transition-colors group-hover:border-[#bcf13b]/30 group-hover:text-white">
      Dashboards
    </span>
    <span class="px-2.5 py-1 rounded bg-[#1a1a16] border border-[#23231f] text-xs font-mono text-[#a1a1aa] transition-colors group-hover:border-[#bcf13b]/30 group-hover:text-white">
      Analise de dados
    </span>
  </div>

</div>
```

### 4.2 Botoes de Acao (CTAs)

#### Botao Primario Solido (Verde Neon)
```html
<button class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#bcf13b] text-[#0a0a08] font-bold text-sm tracking-wide transition-all duration-200 ease-out hover:bg-[#a8df2a] hover:shadow-[0_0_20px_rgba(188,241,59,0.35)] active:scale-[0.98] cursor-pointer">
  <span>Conheca minha trajetoria</span>
  <svg class="w-4 h-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
</button>
```

#### Botao Secundario / Outline Escuro
```html
<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#121210]/70 border border-[#23231f] text-white font-medium text-sm tracking-wide transition-all duration-200 ease-out hover:border-[#bcf13b] hover:text-[#bcf13b] hover:bg-[#161613] active:scale-[0.98] cursor-pointer">
  <svg class="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
    <!-- Icone LinkedIn -->
  </svg>
  <span>LinkedIn</span>
  <svg class="w-4 h-4 stroke-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
</a>
```

### 4.3 Badge de Posicionamento e Impacto

Badge utilizado no topo do Hero para destacar pilares de atuacao.

```html
<div class="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#121210] border border-[#23231f]">
  <span class="w-2 h-2 rounded-full bg-[#bcf13b] shadow-[0_0_8px_#bcf13b] animate-pulse"></span>
  <span class="text-xs font-mono font-medium uppercase tracking-wider text-[#bcf13b]">
    DADOS. INTELIGENCIA. IMPACTO.
  </span>
</div>
```

---

## 5. Diretrizes de Microinteracoes e Efeitos Hover

### 5.1 Transicoes e Easing
* Duracao padrao para botoes e links: `duration-200 ease-out`.
* Duracao padrao para cards e modais: `duration-300 ease-out`.
* Propriedade de animacao recomendada: `transition-all`.

### 5.2 Efeito Glow (Neon Halo)
O brilho difuso neon e aplicado exclusivamente em elementos de destaque primario e em estados de foco ou hover para manter a sofisticacao visual.
* Glow suave para cards: `box-shadow: 0 0 25px rgba(188, 241, 59, 0.15)`
* Glow ativo para botao primario: `box-shadow: 0 0 20px rgba(188, 241, 59, 0.35)`
* Glow para ponto de status / badge: `box-shadow: 0 0 8px #bcf13b`

### 5.3 Bordas Interativas
* Estado inativo: borda neutra solida de 1px com tom `#23231f`.
* Estado hover: substituicao instantanea ou transicionada para `#bcf13b`, sem variacao na espessura para evitar deslocamento de layout (layout shift).
* Deslocamento sutil no eixo Y: `hover:-translate-y-1` para transmitir sensacao tatil de elevacao fisica do card.

---

## 6. Configuracao do Tailwind Config (`tailwind.config.js`)

Sugestao de extensao do tema no Tailwind para utilizacao direta dos nomes semanticos de cores e sombras:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          deep: '#0a0a08',
          card: '#121210',
          elevated: '#161613',
          pill: '#1a1a16',
          border: '#23231f',
          separator: '#1f1f1b',
          neon: '#bcf13b',
          accent: '#a8df2a',
          text: {
            primary: '#ffffff',
            secondary: '#9da3af',
            muted: '#71717a',
          },
        },
      },
      boxShadow: {
        'neon-sm': '0 0 10px rgba(188, 241, 59, 0.20)',
        'neon-md': '0 0 20px rgba(188, 241, 59, 0.30)',
        'neon-card': '0 0 25px rgba(188, 241, 59, 0.15)',
      },
    },
  },
};
```
