import React from 'react';
import { ExternalLink } from 'lucide-react';

/**
 * PIT.AI — Renderizador de Markdown e Tipografia Tática
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Converte marcações de Markdown (cabeçalhos, negrito, itálico, listas, links,
 * citações e código) em elementos React estilizados para a interface sci-fi do PIT.AI.
 */

// Parseia texto inline com suporte a links, negrito, itálico e código inline
function renderInlineText(text) {
  if (!text) return null;

  // Regex para tokens inline:
  // 1. Links: [texto](url)
  // 2. Negrito: **texto**
  // 3. Itálico: *texto* ou _texto_
  // 4. Código inline: `código`
  const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|`[^`]+`)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Link [texto](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 inline-flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 inline-block shrink-0 opacity-80" />
        </a>
      );
    }

    // Negrito **texto**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const content = part.slice(2, -2);
      return (
        <strong key={index} className="text-white font-bold tracking-tight">
          {renderInlineText(content)}
        </strong>
      );
    }

    // Código inline `código`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const content = part.slice(1, -1);
      return (
        <code
          key={index}
          className="bg-slate-950/80 border border-slate-800 text-cyan-300 font-mono text-[11px] px-1.5 py-0.5 rounded mx-0.5"
        >
          {content}
        </code>
      );
    }

    // Itálico *texto* ou _texto_
    if (
      (part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
      (part.startsWith('_') && part.endsWith('_') && part.length >= 2)
    ) {
      const content = part.slice(1, -1);
      return (
        <em key={index} className="text-slate-300 italic font-normal">
          {renderInlineText(content)}
        </em>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

export default function PitAiMarkdown({ content, className = '' }) {
  if (!content) return null;

  // Sanitização de segurança: Se o texto for acidentalmente um JSON cru contendo displayText ou spokenText
  let cleanContent = String(content).trim();
  if (cleanContent.startsWith('{') && cleanContent.endsWith('}')) {
    try {
      const parsed = JSON.parse(cleanContent);
      if (parsed.displayText) cleanContent = parsed.displayText;
      else if (parsed.spokenText) cleanContent = parsed.spokenText;
    } catch {
      // Ignore
    }
  }

  // Divide o conteúdo por blocos de linha
  const lines = cleanContent.split('\n');
  const elements = [];
  let keyIndex = 0;

  let inList = false;
  let currentListItems = [];

  const flushList = () => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul key={`ul_${keyIndex++}`} className="space-y-1 my-1.5 pl-1">
          {currentListItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0 opacity-80" />
              <div className="flex-1 leading-relaxed">{renderInlineText(item)}</div>
            </li>
          ))}
        </ul>
      );
      currentListItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Linha vazia
    if (!line) {
      flushList();
      continue;
    }

    // Linha horizontal (--- ou ***)
    if (/^[-*_]{3,}$/.test(line)) {
      flushList();
      elements.push(<hr key={`hr_${keyIndex++}`} className="border-slate-800 my-2" />);
      continue;
    }

    // Cabeçalho H3 (### Título)
    if (line.startsWith('### ')) {
      flushList();
      const headingText = line.replace(/^###\s+/, '');
      elements.push(
        <h4
          key={`h3_${keyIndex++}`}
          className="text-sm font-bold text-cyan-300 mt-3 mb-1.5 flex items-center gap-1.5 font-mono tracking-wide"
        >
          {renderInlineText(headingText)}
        </h4>
      );
      continue;
    }

    // Cabeçalho H2 (## Título)
    if (line.startsWith('## ')) {
      flushList();
      const headingText = line.replace(/^##\s+/, '');
      elements.push(
        <h3
          key={`h2_${keyIndex++}`}
          className="text-base font-extrabold text-white mt-3.5 mb-1.5 tracking-tight"
        >
          {renderInlineText(headingText)}
        </h3>
      );
      continue;
    }

    // Cabeçalho H1 (# Título)
    if (line.startsWith('# ')) {
      flushList();
      const headingText = line.replace(/^#\s+/, '');
      elements.push(
        <h2
          key={`h1_${keyIndex++}`}
          className="text-base sm:text-lg font-black text-white mt-4 mb-2 tracking-tight"
        >
          {renderInlineText(headingText)}
        </h2>
      );
      continue;
    }

    // Citação Blockquote (> texto)
    if (line.startsWith('> ')) {
      flushList();
      const quoteText = line.replace(/^>\s+/, '');
      elements.push(
        <blockquote
          key={`quote_${keyIndex++}`}
          className="border-l-2 border-cyan-500/50 bg-cyan-950/20 pl-3 py-1 my-1.5 text-xs text-slate-300 italic rounded-r"
        >
          {renderInlineText(quoteText)}
        </blockquote>
      );
      continue;
    }

    // Item de Lista (• , - , * )
    if (/^([•\-\*]|\d+\.)\s+/.test(line)) {
      inList = true;
      const itemText = line.replace(/^([•\-\*]|\d+\.)\s+/, '');
      currentListItems.push(itemText);
      continue;
    }

    // Linha de texto normal (Parágrafo)
    flushList();
    elements.push(
      <p key={`p_${keyIndex++}`} className="leading-relaxed text-slate-200 my-1">
        {renderInlineText(line)}
      </p>
    );
  }

  flushList();

  return <div className={`space-y-1 text-xs sm:text-sm ${className}`}>{elements}</div>;
}
