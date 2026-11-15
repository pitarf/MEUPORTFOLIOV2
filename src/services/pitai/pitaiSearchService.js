/**
 * PIT.AI — Serviço de Pesquisa Web e Inteligência em Tempo Real (Search Service)
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Executa pesquisas ao vivo sem necessidade de APIs pagas, conectando o PIT.AI
 * diretamente a fontes abertas em tempo real:
 * 1. Google News RSS Brasil (notícias de hoje e de última hora)
 * 2. DuckDuckGo Instant Search (resumos, definições e tópicos relacionados)
 * 3. Wikipédia em Português (fatos históricos, biografias, conceitos técnicos)
 * 4. Feeds Oficiais do Rio de Janeiro e Economia (COR, G1, InfoMoney)
 */

class PitAiSearchService {
  /**
   * Realiza uma busca combinada e enriquecida sobre qualquer tópico
   * @param {string} query - Termo de busca
   * @returns {Promise<Object>}
   */
  async search(query) {
    const cleanQuery = (query || '')
      .replace(/^(pesquise|pesquisa|busque|busca|o que é|quem é|notícias sobre|fale sobre|procure por)\s*/i, '')
      .trim();

    if (!cleanQuery) {
      return { query: '', summary: '', results: [], sources: [] };
    }

    try {
      // Dispara em paralelo buscas no Google News, DuckDuckGo e Wikipedia
      const [newsResults, ddgResult, wikiResults] = await Promise.allSettled([
        this.fetchGoogleNews(cleanQuery),
        this.fetchDuckDuckGo(cleanQuery),
        this.fetchWikipedia(cleanQuery)
      ]);

      const news = newsResults.status === 'fulfilled' ? newsResults.value : [];
      const ddg = ddgResult.status === 'fulfilled' ? ddgResult.value : null;
      const wiki = wikiResults.status === 'fulfilled' ? wikiResults.value : [];

      // Constrói resumo executivo e lista consolidada
      const allResults = [];
      const sources = new Set();

      if (ddg && ddg.abstract) {
        allResults.push({
          source: 'DuckDuckGo / Fatos',
          title: ddg.heading || cleanQuery,
          snippet: ddg.abstract,
          url: ddg.url
        });
        sources.add('DuckDuckGo');
      }

      news.forEach((item) => {
        allResults.push({
          source: 'Google News',
          title: item.title,
          snippet: item.snippet || item.title,
          url: item.link,
          date: item.pubDate
        });
        sources.add('Notícias em Tempo Real');
      });

      wiki.forEach((item) => {
        allResults.push({
          source: 'Wikipédia Brasil',
          title: item.title,
          snippet: item.snippet,
          url: `https://pt.wikipedia.org/wiki/${encodeURIComponent(item.title)}`
        });
        sources.add('Wikipédia');
      });

      // Gera um resumo textual executivo para o assistente vocal
      let executiveSummary = '';
      if (ddg && ddg.abstract) {
        executiveSummary = ddg.abstract;
      } else if (news.length > 0) {
        executiveSummary = `Notícia recente: ${news[0].title}.`;
      } else if (wiki.length > 0) {
        executiveSummary = wiki[0].snippet;
      }

      return {
        query: cleanQuery,
        summary: executiveSummary,
        results: allResults.slice(0, 6),
        sources: Array.from(sources)
      };
    } catch (err) {
      console.warn('[PIT.AI Search] Erro durante a pesquisa web:', err);
      return {
        query: cleanQuery,
        summary: '',
        results: [],
        sources: []
      };
    }
  }

  /**
   * Busca notícias em tempo real via RSS do Google News
   */
  async fetchGoogleNews(query) {
    try {
      const encodedQuery = encodeURIComponent(query);
      const directProxyUrl = `/api/news/search?q=${encodedQuery}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
      
      let xml = '';
      try {
        const res = await fetch(directProxyUrl);
        if (res.ok) {
          xml = await res.text();
        }
      } catch {
        // Tenta fallback via proxy CORS público
      }

      if (!xml) {
        const externalUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
        const fallbackUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(externalUrl)}`;
        const res = await fetch(fallbackUrl);
        if (res.ok) {
          const json = await res.json();
          xml = json?.contents || '';
        }
      }

      if (!xml) return [];

      const items = [];
      const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

      for (const item of itemMatches.slice(0, 4)) {
        const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
        const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
        const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

        const title = (titleMatch ? titleMatch[1] : '')
          .replace(/<!\[CDATA\[|\]\]>/g, '')
          .trim();
        const link = linkMatch ? linkMatch[1].trim() : '';
        const pubDate = dateMatch ? new Date(dateMatch[1]).toLocaleDateString('pt-BR') : '';

        if (title && !title.toLowerCase().startsWith('google notícias')) {
          items.push({ title, link, pubDate });
        }
      }

      return items;
    } catch {
      return [];
    }
  }

  /**
   * Busca resumos e respostas diretas no DuckDuckGo Instant Search
   */
  async fetchDuckDuckGo(query) {
    try {
      const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      const res = await fetch(url);
      if (!res.ok) return null;

      const data = await res.json();
      return {
        heading: data.Heading || '',
        abstract: data.AbstractText || '',
        url: data.AbstractURL || ''
      };
    } catch {
      return null;
    }
  }

  /**
   * Busca tópicos enciclopédicos na Wikipédia em Português
   */
  async fetchWikipedia(query) {
    try {
      const url = `https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&utf8=1`;
      const res = await fetch(url);
      if (!res.ok) return [];

      const data = await res.json();
      const searchItems = data.query?.search || [];

      return searchItems.slice(0, 3).map((item) => ({
        title: item.title,
        snippet: (item.snippet || '').replace(/<[^>]*>?/gm, '').trim()
      }));
    } catch {
      return [];
    }
  }
}

export const pitaiSearchService = new PitAiSearchService();
export default pitaiSearchService;
