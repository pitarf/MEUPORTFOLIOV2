/**
 * PIT.AI — Serviço Meteorológico & Telemetria Climática (Open-Meteo)
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Coleta condições atmosféricas em tempo real e previsões para o Rio de Janeiro
 * via API pública Open-Meteo, com sistema de cache de 15 minutos e síntese
 * de relatórios executivos no estilo J.A.R.V.I.S.
 */

// Coordenadas padrão da sede operacional no Rio de Janeiro (RJ)
const RJ_COORDINATES = {
  latitude: -22.9068,
  longitude: -43.1729,
  city: 'Rio de Janeiro',
  state: 'RJ',
  timezone: 'America/Sao_Paulo'
};

// Duração do cache local: 15 minutos em milissegundos
const CACHE_TTL_MS = 15 * 60 * 1000;
const CACHE_STORAGE_KEY = 'pitai_weather_cache_v1';

// Mapeamento dos códigos meteorológicos WMO (World Meteorological Organization)
const WMO_WEATHER_CODES = {
  0: { label: 'Céu limpo', icon: 'sun', category: 'clear' },
  1: { label: 'Predominantemente limpo', icon: 'sun', category: 'clear' },
  2: { label: 'Parcialmente nublado', icon: 'cloud-sun', category: 'cloudy' },
  3: { label: 'Nublado e encoberto', icon: 'cloud', category: 'cloudy' },
  45: { label: 'Nevoeiro visível', icon: 'cloud-fog', category: 'fog' },
  48: { label: 'Nevoeiro com formação de geada', icon: 'cloud-fog', category: 'fog' },
  51: { label: 'Chuvisco fraco', icon: 'cloud-drizzle', category: 'rain' },
  53: { label: 'Chuvisco moderado', icon: 'cloud-drizzle', category: 'rain' },
  55: { label: 'Chuvisco denso', icon: 'cloud-drizzle', category: 'rain' },
  56: { label: 'Chuvisco congelante leve', icon: 'cloud-drizzle', category: 'rain' },
  57: { label: 'Chuvisco congelante denso', icon: 'cloud-drizzle', category: 'rain' },
  61: { label: 'Chuva leve', icon: 'cloud-rain', category: 'rain' },
  63: { label: 'Chuva moderada', icon: 'cloud-rain', category: 'rain' },
  65: { label: 'Chuva torrencial', icon: 'cloud-rain', category: 'rain' },
  66: { label: 'Chuva congelante fraca', icon: 'cloud-rain', category: 'rain' },
  67: { label: 'Chuva congelante intensa', icon: 'cloud-rain', category: 'rain' },
  71: { label: 'Queda de neve leve', icon: 'snowflake', category: 'snow' },
  73: { label: 'Queda de neve moderada', icon: 'snowflake', category: 'snow' },
  75: { label: 'Queda de neve intensa', icon: 'snowflake', category: 'snow' },
  77: { label: 'Grãos de gelo', icon: 'snowflake', category: 'snow' },
  80: { label: 'Pancadas de chuva passageiras', icon: 'cloud-rain', category: 'rain' },
  81: { label: 'Pancadas de chuva moderadas', icon: 'cloud-rain', category: 'rain' },
  82: { label: 'Pancadas de chuva violentas', icon: 'cloud-lightning', category: 'storm' },
  85: { label: 'Pancadas de neve leves', icon: 'snowflake', category: 'snow' },
  86: { label: 'Pancadas de neve pesadas', icon: 'snowflake', category: 'snow' },
  95: { label: 'Tempestade elétrica', icon: 'cloud-lightning', category: 'storm' },
  96: { label: 'Tempestade com granizo leve', icon: 'cloud-lightning', category: 'storm' },
  99: { label: 'Tempestade severa com granizo', icon: 'cloud-lightning', category: 'storm' }
};

class PitAiWeatherService {
  constructor() {
    this.memoryCache = null;
  }

  /**
   * Converte o código WMO num objeto legível com descrição e tipo de ícone
   * @param {number} code - Código WMO da API
   * @returns {Object} { label, icon, category }
   */
  getWeatherCondition(code) {
    if (code in WMO_WEATHER_CODES) {
      return WMO_WEATHER_CODES[code];
    }
    return { label: 'Condição não identificada', icon: 'cloud', category: 'cloudy' };
  }

  /**
   * Recupera o cache meteorológico do localStorage ou memória
   * @returns {Object|null}
   */
  getCachedWeather() {
    if (this.memoryCache && Date.now() - this.memoryCache.timestamp < CACHE_TTL_MS) {
      return this.memoryCache.data;
    }

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(CACHE_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
            this.memoryCache = parsed;
            return parsed.data;
          }
        }
      }
    } catch (e) {
      console.warn('[PIT.AI Weather] Falha ao ler cache meteorológico:', e);
    }

    return null;
  }

  /**
   * Salva dados meteorológicos no cache em memória e localStorage
   * @param {Object} data - Objeto de telemetria climática
   */
  setCachedWeather(data) {
    const payload = {
      timestamp: Date.now(),
      data
    };
    this.memoryCache = payload;

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (e) {
      console.warn('[PIT.AI Weather] Falha ao gravar cache meteorológico:', e);
    }
  }

  /**
   * Busca as condições climáticas e previsão para o Rio de Janeiro na Open-Meteo
   * @param {boolean} forceRefresh - Força nova requisição ignorando o cache
   * @returns {Promise<Object>} Telemetria climática completa
   */
  async fetchWeatherData(forceRefresh = false) {
    if (!forceRefresh) {
      const cached = this.getCachedWeather();
      if (cached) {
        return cached;
      }
    }

    const { latitude, longitude, city, state, timezone } = RJ_COORDINATES;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&timezone=${encodeURIComponent(timezone)}`;

    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Erro na API Open-Meteo: status ${response.status}`);
      }

      const json = await response.json();
      const current = json.current || {};
      const daily = json.daily || {};

      const currentCondition = this.getWeatherCondition(current.weather_code);
      const todayCondition = this.getWeatherCondition(daily.weather_code?.[0]);
      const tomorrowCondition = this.getWeatherCondition(daily.weather_code?.[1]);

      const telemetry = {
        city: `${city}, ${state}`,
        coordinates: { latitude, longitude },
        timezone,
        updatedAt: new Date().toISOString(),
        current: {
          temperature: Math.round(current.temperature_2m ?? 26),
          apparentTemperature: Math.round(current.apparent_temperature ?? 27),
          humidity: current.relative_humidity_2m ?? 65,
          precipitation: current.precipitation ?? 0,
          windSpeed: Math.round(current.wind_speed_10m ?? 12),
          windDirection: current.wind_direction_10m ?? 0,
          weatherCode: current.weather_code ?? 0,
          condition: currentCondition.label,
          icon: currentCondition.icon,
          category: currentCondition.category,
          rainChance: daily.precipitation_probability_max?.[0] ?? 0
        },
        forecast: {
          today: {
            date: daily.time?.[0] || new Date().toISOString().split('T')[0],
            min: Math.round(daily.temperature_2m_min?.[0] ?? 21),
            max: Math.round(daily.temperature_2m_max?.[0] ?? 29),
            rainChance: daily.precipitation_probability_max?.[0] ?? 10,
            uvIndex: daily.uv_index_max?.[0] ?? 7,
            condition: todayCondition.label,
            icon: todayCondition.icon
          },
          tomorrow: {
            date: daily.time?.[1] || '',
            min: Math.round(daily.temperature_2m_min?.[1] ?? 22),
            max: Math.round(daily.temperature_2m_max?.[1] ?? 30),
            rainChance: daily.precipitation_probability_max?.[1] ?? 20,
            uvIndex: daily.uv_index_max?.[1] ?? 8,
            condition: tomorrowCondition.label,
            icon: tomorrowCondition.icon
          }
        }
      };

      this.setCachedWeather(telemetry);
      return telemetry;
    } catch (err) {
      console.warn('[PIT.AI Weather] Falha ao consultar Open-Meteo, acionando fallback:', err);
      
      // Se tiver cache expirado, devolve o cache antes de falhar
      if (this.memoryCache?.data) {
        return this.memoryCache.data;
      }

      // Fallback operacional em caso de ausência total de rede
      return {
        city: `${city}, ${state}`,
        coordinates: { latitude, longitude },
        timezone,
        updatedAt: new Date().toISOString(),
        isFallback: true,
        current: {
          temperature: 27,
          apparentTemperature: 29,
          humidity: 65,
          precipitation: 0,
          windSpeed: 14,
          windDirection: 180,
          weatherCode: 1,
          condition: 'Predominantemente limpo',
          icon: 'sun',
          category: 'clear',
          rainChance: 15
        },
        forecast: {
          today: {
            date: new Date().toISOString().split('T')[0],
            min: 21,
            max: 29,
            rainChance: 15,
            uvIndex: 7,
            condition: 'Predominantemente limpo',
            icon: 'sun'
          },
          tomorrow: {
            date: '',
            min: 22,
            max: 30,
            rainChance: 25,
            uvIndex: 8,
            condition: 'Parcialmente nublado',
            icon: 'cloud-sun'
          }
        }
      };
    }
  }

  /**
   * Constrói o texto de fala executivo no estilo J.A.R.V.I.S.
   * @param {Object} data - Dados meteorológicos
   * @param {string} userName - Nome do usuário (ex: 'Rafael')
   * @returns {string} Texto fluido para TTS
   */
  formatSpokenWeather(data, userName = 'Rafael') {
    const { current, forecast, city } = data;
    const chuvaDesc = current.rainChance > 40
      ? `Atenção: há ${current.rainChance}% de probabilidade de chuva hoje.`
      : `Probabilidade de precipitação baixa para hoje, em ${current.rainChance}%.`;

    return `Senhor, no ${city} a temperatura atual é de ${current.temperature} graus com sensação térmica de ${current.apparentTemperature} graus e ${current.condition.toLowerCase()}. A umidade relativa está em ${current.humidity}% e os ventos sopram a ${current.windSpeed} quilômetros por hora. ${chuvaDesc} Para amanhã, a máxima prevista é de ${forecast.tomorrow.max} graus.`;
  }

  /**
   * Constrói a mensagem em Markdown para exibição no HUD do PIT.AI
   * @param {Object} data - Dados meteorológicos
   * @returns {string} Markdown estruturado
   */
  formatDisplayWeather(data) {
    const { current, forecast, city, updatedAt } = data;
    const hora = new Date(updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return `### ⛅ **Telemetria Meteorológica • ${city}**\n\n` +
      `• **Temperatura Atual:** ${current.temperature}°C (Sensação de ${current.apparentTemperature}°C)\n` +
      `• **Condição do Céu:** ${current.condition}\n` +
      `• **Umidade do Ar:** ${current.humidity}%\n` +
      `• **Velocidade dos Ventos:** ${current.windSpeed} km/h\n` +
      `• **Probabilidade de Chuva Hoje:** ${current.rainChance}%\n\n` +
      `**Previsão Tática:**\n` +
      `• **Hoje:** Min ${forecast.today.min}°C | Max ${forecast.today.max}°C (${forecast.today.condition})\n` +
      `• **Amanhã:** Min ${forecast.tomorrow.min}°C | Max ${forecast.tomorrow.max}°C (${forecast.tomorrow.condition}, Chuva: ${forecast.tomorrow.rainChance}%)\n\n` +
      `*Dados obtidos via Open-Meteo Sat Telemetry às ${hora}.*`;
  }
}

export const pitaiWeatherService = new PitAiWeatherService();
export default pitaiWeatherService;
