/**
 * PIT.AI — Serviço de Briefing de Inteligência em Tempo Real
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Agrega acontecimentos do Mundo, Brasil e Rio de Janeiro através de fontes
 * oficiais e abertas (RSS / Feeds / COR-Rio / Agência Brasil) com cache de 7 dias
 * e cálculo do intervalo de ausência do Rafael.
 */

const STORAGE_LAST_BRIEFING_KEY = 'pitai_last_briefing_timestamp';
const STORAGE_CACHE_KEY = 'pitai_briefings_cache_v1';
const CACHE_TTL_DAYS = 7;

// Feeds RSS de alta credibilidade para leitura ao vivo via proxies CORS seguros
const RSS_SOURCES = [
  {
    category: 'rio_de_janeiro',
    name: 'G1 Rio de Janeiro',
    url: 'https://g1.globo.com/rss/g1/rio-de-janeiro/',
    priority: 1
  },
  {
    category: 'brasil',
    name: 'Agência Brasil (Governo)',
    url: 'https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml',
    priority: 2
  },
  {
    category: 'mercado_b3',
    name: 'InfoMoney (Mercado & Bolsa)',
    url: 'https://www.infomoney.com.br/feed/',
    priority: 3
  },
  {
    category: 'mundo',
    name: 'BBC News Brasil (Mundo)',
    url: 'https://feeds.bbci.co.uk/portuguese/rss.xml',
    priority: 4
  }
];

class PitAiBriefingService {
  /**
   * Obtém o timestamp da última consulta do Rafael
   * @returns {Date}
   */
  getLastBriefingTime() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_LAST_BRIEFING_KEY);
        if (stored) {
          return new Date(stored);
        }
      }
    } catch {
      // Ignore
    }
    // Se for a primeira vez, considera as últimas 12 horas
    return new Date(Date.now() - 12 * 60 * 60 * 1000);
  }

  /**
   * Atualiza o timestamp do último briefing para o momento atual
   */
  markBriefingAsRead() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_LAST_BRIEFING_KEY, new Date().toISOString());
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Recupera o cache local de notícias válido (dentro dos 7 dias)
   * @returns {Array}
   */
  getCachedNews() {
    try {
      if (typeof localStorage === 'undefined') return [];
      const raw = localStorage.getItem(STORAGE_CACHE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      const now = Date.now();
      const maxAgeMs = CACHE_TTL_DAYS * 24 * 60 * 60 * 1000;

      // Filtra apenas notícias com menos de 7 dias
      const valid = parsed.filter(item => {
        const itemTime = new Date(item.publishedAt || item.date).getTime();
        return (now - itemTime) < maxAgeMs;
      });

      return valid;
    } catch {
      return [];
    }
  }

  /**
   * Salva as notícias no cache garantindo TTL de 7 dias
   * @param {Array} newsList 
   */
  saveToCache(newsList) {
    try {
      if (typeof localStorage === 'undefined') return;
      const existing = this.getCachedNews();
      const combined = [...newsList, ...existing];
      
      // Deduplica por link ou título
      const seen = new Set();
      const deduplicated = [];
      for (const item of combined) {
        const key = item.link || item.title;
        if (!seen.has(key)) {
          seen.add(key);
          deduplicated.push(item);
        }
      }

      // Limita a 150 itens mais recentes
      const sorted = deduplicated
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 150);

      localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(sorted));
    } catch (e) {
      console.warn('[PIT.AI Briefing] Erro ao gravar cache local:', e);
    }
  }

  /**
   * Converte XML RSS em itens estruturados
   * @param {string} xmlText 
   * @param {string} category 
   * @param {string} sourceName 
   * @returns {Array}
   */
  parseRssXml(xmlText, category, sourceName) {
    try {
      if (typeof DOMParser !== 'undefined') {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');
        const parsedItems = [];

        items.forEach((item, index) => {
          if (index >= 10) return; // Limita a 10 por fonte para manter agilidade
          const title = item.querySelector('title')?.textContent?.trim() || '';
          const descriptionRaw = item.querySelector('description')?.textContent || '';
          const link = item.querySelector('link')?.textContent?.trim() || '';
          const pubDateRaw = item.querySelector('pubDate')?.textContent || '';

          // Limpa HTML da descrição
          let description = descriptionRaw;
          if (typeof document !== 'undefined') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = descriptionRaw;
            description = (tempDiv.textContent || tempDiv.innerText || '').trim();
          } else {
            description = descriptionRaw.replace(/<[^>]*>/g, '').trim();
          }

          if (title) {
            parsedItems.push({
              id: `news_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
              category,
              sourceName,
              title,
              summary: description.slice(0, 280),
              link,
              publishedAt: pubDateRaw ? new Date(pubDateRaw).toISOString() : new Date().toISOString()
            });
          }
        });

        return parsedItems;
      } else {
        // Fallback regex para ambientes sem DOMParser (como testes Node.js)
        const parsedItems = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
        let match;
        let count = 0;

        while ((match = itemRegex.exec(xmlText)) !== null && count < 10) {
          count++;
          const itemContent = match[1];
          const getTag = (tag) => {
            const m = itemContent.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
            if (!m) return '';
            return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
          };

          const title = getTag('title');
          const descriptionRaw = getTag('description');
          const link = getTag('link');
          const pubDateRaw = getTag('pubDate');
          const description = descriptionRaw.replace(/<[^>]*>/g, '').trim();

          if (title) {
            parsedItems.push({
              id: `news_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
              category,
              sourceName,
              title,
              summary: description.slice(0, 280),
              link,
              publishedAt: pubDateRaw ? new Date(pubDateRaw).toISOString() : new Date().toISOString()
            });
          }
        }
        return parsedItems;
      }
    } catch (e) {
      console.warn(`[PIT.AI Briefing] Erro ao analisar RSS de ${sourceName}:`, e);
      return [];
    }
  }

  /**
   * Realiza a coleta ao vivo de notícias de múltiplas fontes
   * @param {boolean} forceRefresh - Se verdadeiro, ignora o cache local
   * @returns {Promise<{world: Array, brazil: Array, rj: Array, deltaHours: number}>}
   */
  async fetchLiveBriefing(forceRefresh = false) {
    const lastTime = this.getLastBriefingTime();
    const now = new Date();
    const deltaHours = Math.max(1, Math.round((now.getTime() - lastTime.getTime()) / (1000 * 60 * 60)));

    let allNews = [];

    if (!forceRefresh) {
      const cached = this.getCachedNews();
      if (cached.length >= 10) {
        allNews = cached;
      }
    }

    // Se estiver sem cache ou refresh forçado, dispara requisições para os feeds
    if (allNews.length === 0 || forceRefresh) {
      const fetchPromises = RSS_SOURCES.map(async (source) => {
        try {
          // Usa proxy CORS público seguro e confiável (allorigins)
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(source.url)}`;
          const response = await fetch(proxyUrl, { cache: 'no-store' });
          if (!response.ok) return [];
          const data = await response.json();
          if (!data?.contents) return [];
          return this.parseRssXml(data.contents, source.category, source.name);
        } catch (err) {
          console.warn(`[PIT.AI Briefing] Falha ao coletar ${source.name}:`, err?.message);
          return [];
        }
      });

      const results = await Promise.allSettled(fetchPromises);
      const freshlyFetched = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value);

      if (freshlyFetched.length > 0) {
        this.saveToCache(freshlyFetched);
        allNews = freshlyFetched;
      }
    }

    // Classifica por grupos
    const rj = allNews.filter(n => n.category === 'rio_de_janeiro');
    const brazil = allNews.filter(n => n.category === 'brasil' || n.category === 'mercado_b3');
    const world = allNews.filter(n => n.category === 'mundo');

    return {
      rj: rj.slice(0, 5),
      brazil: brazil.slice(0, 5),
      world: world.slice(0, 5),
      deltaHours,
      lastBriefingTime: lastTime
    };
  }

  /**
   * Monta o texto de briefing falado estilo J.A.R.V.I.S.
   * @param {Object} briefingData 
   * @param {string} userName 
   * @returns {string}
   */
  generateSpokenScript(briefingData, userName = 'Rafael') {
    const { rj, brazil, world, deltaHours } = briefingData;
    const hour = new Date().getHours();
    let greeting = 'Bom dia';
    if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
    else if (hour >= 18 || hour < 5) greeting = 'Boa noite';

    let script = `${greeting}, ${userName}. Aqui está o seu relatório dos acontecimentos das últimas ${deltaHours} horas. `;

    // 1. Rio de Janeiro
    if (rj.length > 0) {
      script += `No Rio de Janeiro: ${rj[0].title}. `;
      if (rj[1]) script += `Além disso, ${rj[1].title}. `;
    }

    // 2. Brasil & Mercado
    if (brazil.length > 0) {
      script += `No Brasil e mercado financeiro: ${brazil[0].title}. `;
      if (brazil[1]) script += `E também: ${brazil[1].title}. `;
    }

    // 3. Mundo
    if (world.length > 0) {
      script += `No cenário internacional: ${world[0].title}. `;
    }

    script += `Todos os sistemas estão estáveis. Deseja que eu detalhe alguma ocorrência ou verifique sua agenda?`;

    return script;
  }
}

export const pitaiBriefingService = new PitAiBriefingService();
export default pitaiBriefingService;
