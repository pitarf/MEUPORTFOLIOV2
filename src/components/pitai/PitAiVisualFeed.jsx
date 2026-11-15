import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  ExternalLink,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Globe,
  TrendingUp,
  ShieldAlert,
  Newspaper,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft,
  Receipt,
  Building2,
  Sparkles,
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  Eye,
  CloudFog,
  RefreshCw
} from 'lucide-react';

/**
 * Renderiza ícone com glow neon correspondente à condição meteorológica
 */
function WeatherIcon({ name, className = 'w-6 h-6' }) {
  switch (name) {
    case 'sun':
      return <Sun className={`${className} text-amber-400 filter drop-shadow-[0_0_8px_#f59e0b]`} />;
    case 'cloud-sun':
      return <CloudSun className={`${className} text-cyan-400 filter drop-shadow-[0_0_8px_#06b6d4]`} />;
    case 'cloud':
      return <Cloud className={`${className} text-sky-300 filter drop-shadow-[0_0_6px_#38bdf8]`} />;
    case 'cloud-drizzle':
      return <CloudDrizzle className={`${className} text-cyan-300 filter drop-shadow-[0_0_8px_#22d3ee]`} />;
    case 'cloud-rain':
      return <CloudRain className={`${className} text-blue-400 filter drop-shadow-[0_0_10px_#3b82f6]`} />;
    case 'cloud-lightning':
      return <CloudLightning className={`${className} text-violet-400 filter drop-shadow-[0_0_12px_#a855f7]`} />;
    case 'cloud-fog':
      return <CloudFog className={`${className} text-slate-300 filter drop-shadow-[0_0_6px_#94a3b8]`} />;
    case 'snowflake':
      return <Snowflake className={`${className} text-cyan-200 filter drop-shadow-[0_0_8px_#a5f3fc]`} />;
    default:
      return <CloudSun className={`${className} text-cyan-400`} />;
  }
}

/**
 * PIT.AI — Painel HUD de Projeção Visual Generativa
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Renderiza elementos visuais evocados dinamicamente pela conversa:
 * Telemetria Climática Stark, Mapas do RJ/Brasil, Cards de Notícias, Alertas e Finanças.
 */
export default function PitAiVisualFeed({
  payload,
  onResolveConflict,
  onRefreshBriefing,
  onRefreshWeather
}) {
  if (!payload || payload.type === 'none') {
    return null;
  }

  const { type, data } = payload;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={type}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl mx-auto space-y-4"
      >
        {/* 0. Projeção de Telemetria Meteorológica Stark Industries (Open-Meteo) */}
        {type === 'weather_card' && data && (
          <div className="relative bg-card/95 border-2 border-cyan-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl overflow-hidden space-y-5">
            {/* Linha decorativa Stark HUD no topo */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            
            {/* Header Tático com Grid de Coordenadas */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold font-mono tracking-wider text-foreground uppercase">
                      STARK SATELLITE TELEMETRY // MET-01
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      Ao Vivo
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-muted-foreground">
                    {data.city || 'Rio de Janeiro, RJ'} • S 22° 54' 24" W 43° 10' 22"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onRefreshWeather && (
                  <button
                    type="button"
                    onClick={onRefreshWeather}
                    className="p-1.5 rounded-lg border border-border/60 hover:border-cyan-500/40 text-muted-foreground hover:text-cyan-300 transition-colors"
                    title="Atualizar Telemetria"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  REFRESH 15M
                </span>
              </div>
            </div>

            {/* Painel Central: Temperatura em Destaque & Condição */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-muted/20 border border-border/50 rounded-xl p-4 sm:p-5">
              {/* Destaque de Temperatura e Ícone */}
              <div className="md:col-span-6 flex items-center gap-4 sm:gap-6 border-b md:border-b-0 md:border-r border-border/40 pb-4 md:pb-0 md:pr-4">
                <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 shrink-0 shadow-inner">
                  <WeatherIcon name={data.current?.icon} className="w-12 h-12 sm:w-14 sm:h-14" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-extrabold font-mono text-foreground tracking-tight">
                      {data.current?.temperature ?? '--'}
                    </span>
                    <span className="text-2xl font-mono text-cyan-400 font-bold">°C</span>
                  </div>
                  <h5 className="text-sm font-bold text-cyan-300 mt-0.5">
                    {data.current?.condition || 'Parcialmente nublado'}
                  </h5>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                    <span>Sensação térmica de <strong className="text-foreground">{data.current?.apparentTemperature ?? '--'}°C</strong></span>
                  </p>
                </div>
              </div>

              {/* Sub-painel: Previsão Rápida Hoje e Amanhã */}
              <div className="md:col-span-6 grid grid-cols-2 gap-3">
                {/* Bloco Hoje */}
                <div className="p-3 rounded-lg bg-card/60 border border-border/60 flex flex-col justify-between space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground uppercase">
                    <span>HOJE</span>
                    <span className="text-[10px] text-cyan-400">TÁTICO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <WeatherIcon name={data.forecast?.today?.icon} className="w-5 h-5" />
                    <span className="text-sm font-mono font-bold text-foreground">
                      {data.forecast?.today?.min}° / {data.forecast?.today?.max}°
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                    <span>Chuva</span>
                    <span className="font-mono text-cyan-300 font-semibold">{data.forecast?.today?.rainChance ?? 0}%</span>
                  </div>
                </div>

                {/* Bloco Amanhã */}
                <div className="p-3 rounded-lg bg-card/60 border border-border/60 flex flex-col justify-between space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground uppercase">
                    <span>AMANHÃ</span>
                    <span className="text-[10px] text-emerald-400">PROJEÇÃO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <WeatherIcon name={data.forecast?.tomorrow?.icon} className="w-5 h-5" />
                    <span className="text-sm font-mono font-bold text-foreground">
                      {data.forecast?.tomorrow?.min}° / {data.forecast?.tomorrow?.max}°
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                    <span>Chuva</span>
                    <span className="font-mono text-cyan-300 font-semibold">{data.forecast?.tomorrow?.rainChance ?? 0}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de Métricas de Telemetria Stark HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Umidade */}
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Umidade Relativa</span>
                  <Droplets className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xl font-bold font-mono text-foreground">
                  {data.current?.humidity ?? '--'}%
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-cyan-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, data.current?.humidity ?? 50))}%` }}
                  />
                </div>
              </div>

              {/* Ventos */}
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Velocidade Vento</span>
                  <Wind className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-bold font-mono text-foreground">
                  {data.current?.windSpeed ?? '--'} <span className="text-xs text-muted-foreground">km/h</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">
                  {data.current?.windSpeed > 25 ? 'Brisa intensa / rajadas' : 'Ventos regulares na costa'}
                </p>
              </div>

              {/* Probabilidade de Chuva */}
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Probabilidade Chuva</span>
                  <CloudRain className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl font-bold font-mono text-foreground">
                  {data.current?.rainChance ?? 0}%
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      (data.current?.rainChance ?? 0) > 50
                        ? 'bg-rose-500'
                        : (data.current?.rainChance ?? 0) > 25
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, data.current?.rainChance ?? 0))}%` }}
                  />
                </div>
              </div>

              {/* Índice de Radiação UV */}
              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] font-mono uppercase tracking-wider">Índice Solar UV</span>
                  <Sun className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl font-bold font-mono text-foreground">
                  {data.forecast?.today?.uvIndex ?? 7} <span className="text-xs text-muted-foreground">/ 11</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-mono">
                  {(data.forecast?.today?.uvIndex ?? 7) >= 8 ? 'Radiação muito alta' : 'Radiação moderada'}
                </p>
              </div>
            </div>

            {/* Rodapé Tático */}
            <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-muted-foreground pt-2 border-t border-border/40">
              <span>Sincronização: {new Date(data.updatedAt).toLocaleTimeString('pt-BR')} (Horário de Brasília)</span>
              <span className="text-cyan-400/80">Open-Meteo Sat Telemetry • Protocolo J.A.R.V.I.S.</span>
            </div>
          </div>
        )}

        {/* 1. Projeção de Mapa Interativo (Ocorrências no Rio de Janeiro / Brasil) */}
        {type === 'map' && data?.map && (
          <div className="bg-card border border-primary/20 rounded-2xl p-4 shadow-xl overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-foreground">
                  {data.map.title || 'Mapeamento de Ocorrência'}
                </h4>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Coordenadas RJ
              </span>
            </div>

            {data.map.newsTitle && (
              <p className="text-xs text-muted-foreground italic">
                "{data.map.newsTitle}"
              </p>
            )}

            {/* Embed OpenStreetMap 100% gratuito e seguro */}
            <div className="w-full h-56 rounded-xl overflow-hidden border border-border relative bg-slate-900">
              <iframe
                title="Mapa do Rio de Janeiro"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=-43.35%2C-22.98%2C-43.10%2C-22.85&layer=mapnik&marker=${data.map.lat}%2C${data.map.lng}`}
                className="w-full h-full filter contrast-125 brightness-90"
              />
            </div>
          </div>
        )}

        {/* 2. Projeção de Notícias em Tempo Real (Mundo, Brasil, Rio de Janeiro) */}
        {(type === 'news_cards' || (type === 'map' && data?.briefing)) && (
          <div className="bg-card border rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-primary" />
                <h4 className="text-sm font-bold text-foreground">
                  Acontecimentos Relevantes • Últimas {data.briefing?.deltaHours || 12}h
                </h4>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                Fontes Oficiais & Verificadas
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Coluna 1: Rio de Janeiro */}
              <div className="bg-muted/30 border border-border/60 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Rio de Janeiro</span>
                </div>
                <div className="space-y-2">
                  {data.briefing?.rj?.map(n => (
                    <a
                      key={n.id}
                      href={n.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 rounded-lg bg-card hover:bg-muted border border-border/50 text-xs transition-colors group"
                    >
                      <span className="font-semibold text-foreground group-hover:text-primary line-clamp-2">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-1 block">
                        {n.sourceName}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Coluna 2: Brasil & Economia B3 */}
              <div className="bg-muted/30 border border-border/60 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Brasil & B3</span>
                </div>
                <div className="space-y-2">
                  {data.briefing?.brazil?.map(n => (
                    <a
                      key={n.id}
                      href={n.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 rounded-lg bg-card hover:bg-muted border border-border/50 text-xs transition-colors group"
                    >
                      <span className="font-semibold text-foreground group-hover:text-primary line-clamp-2">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-1 block">
                        {n.sourceName}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Coluna 3: Cenário Global */}
              <div className="bg-muted/30 border border-border/60 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Mundo</span>
                </div>
                <div className="space-y-2">
                  {data.briefing?.world?.map(n => (
                    <a
                      key={n.id}
                      href={n.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 rounded-lg bg-card hover:bg-muted border border-border/50 text-xs transition-colors group"
                    >
                      <span className="font-semibold text-foreground group-hover:text-primary line-clamp-2">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-1 block">
                        {n.sourceName}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Projeção de Resultados de Pesquisa Web em Tempo Real */}
        {type === 'web_results' && data?.results && (
          <div className="bg-card border border-primary/20 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-foreground">
                  Pesquisa em Tempo Real: "{data.query}"
                </h4>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Fontes Abertas Verificadas
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.results.map((res, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-muted/30 border border-border/60 hover:border-primary/40 transition-all flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {res.source}
                      </span>
                      {res.date && (
                        <span className="text-[10px] text-muted-foreground">
                          {res.date}
                        </span>
                      )}
                    </div>
                    <h5 className="text-xs font-semibold text-foreground line-clamp-2">
                      {res.title}
                    </h5>
                    {res.snippet && (
                      <p className="text-[11px] text-muted-foreground line-clamp-3">
                        {res.snippet}
                      </p>
                    )}
                  </div>
                  {res.url && (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-medium text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 self-start pt-1"
                    >
                      <span>Acessar fonte</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Alerta Crítico de Conflito de Horários */}
        {type === 'conflict_alert' && data?.conflictEvent && (
          <div className="bg-rose-950/20 border-2 border-rose-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <h4 className="text-base font-bold text-foreground">
                Conflito de Horários Detectado na Google Agenda
              </h4>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              O evento que você tentou agendar coincide com o compromisso existente:
            </p>

            <div className="p-3.5 rounded-xl bg-card border border-rose-500/30 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-foreground block">
                  {data.conflictEvent.title}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-rose-400" />
                  <span>
                    {new Date(data.conflictEvent.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} até {new Date(data.conflictEvent.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 font-bold">
                Ocupado
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onResolveConflict && onResolveConflict('reschedule')}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors"
              >
                Reagendar para próxima hora livre
              </button>
              <button
                type="button"
                onClick={() => onResolveConflict && onResolveConflict('keep_both')}
                className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-medium text-xs transition-colors"
              >
                Manter ambos os eventos
              </button>
            </div>
          </div>
        )}

        {/* 4. Lista da Google Agenda & Tarefas */}
        {type === 'agenda_list' && (
          <div className="bg-card border rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-foreground">
                  Google Workspace • Agenda & Tarefas
                </h4>
              </div>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sincronizado
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Eventos */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Compromissos Agendados
                </span>
                {data.events?.length > 0 ? (
                  data.events.map(evt => (
                    <div
                      key={evt.id}
                      className="p-3 rounded-xl bg-muted/30 border text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-foreground block">
                          {evt.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>
                            {new Date(evt.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {new Date(evt.endTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary">
                        Confirmado
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic p-2">
                    Nenhum compromisso marcado para este período.
                  </p>
                )}
              </div>

              {/* Tarefas */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Google Tarefas (Pendências)
                </span>
                {data.tasks?.length > 0 ? (
                  data.tasks.map(tsk => (
                    <div
                      key={tsk.id}
                      className="p-3 rounded-xl bg-muted/30 border text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-foreground block">
                          {tsk.title}
                        </span>
                        {tsk.notes && (
                          <span className="text-[11px] text-muted-foreground block truncate max-w-xs">
                            {tsk.notes}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">
                        {tsk.priority === 'high' ? 'Alta' : 'Normal'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic p-2">
                    Todas as tarefas concluídas.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. Projeção de Cartão Financeiro Executivo Grana+ (Finanças Fácil) */}
        {type === 'finance_card' && data && (
          <div className="bg-card border border-primary/20 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-foreground">
                  Grana+ (Finanças Fácil) • Lançamento Registrado
                </h4>
              </div>
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border flex items-center gap-1 ${
                  data.offline
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>{data.offline ? 'Buffer Local Offline' : 'API Grana+ Sincronizada'}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Bloco 1: Valor em Destaque */}
              <div className="p-4 rounded-xl bg-muted/40 border flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {data.type === 'INCOME' ? 'Receita Confirmada' : data.type === 'TRANSFER' ? 'Transferência' : 'Despesa Lançada'}
                  </span>
                  {data.type === 'INCOME' ? (
                    <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                  ) : data.type === 'TRANSFER' ? (
                    <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <div
                  className={`text-2xl font-bold font-mono tracking-tight ${
                    data.type === 'INCOME'
                      ? 'text-emerald-400'
                      : data.type === 'TRANSFER'
                      ? 'text-cyan-400'
                      : 'text-rose-400'
                  }`}
                >
                  {data.formattedAmount || `R$ ${Number(data.amount || 0).toFixed(2).replace('.', ',')}`}
                </div>
                <span className="text-[10px] text-muted-foreground truncate">
                  {data.transaction?.description || 'Transação PIT.AI'}
                </span>
              </div>

              {/* Bloco 2: Categoria e Origem/Destino */}
              <div className="p-4 rounded-xl bg-muted/40 border flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                    Classificação
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground">
                      {data.category?.name || (data.type === 'INCOME' ? 'Serviços PJ' : 'Alimentação')}
                    </span>
                  </div>
                </div>

                <div className="pt-1 border-t border-border/50">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                    Conta / Instrumento
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {data.isCard ? (
                      <>
                        <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs font-semibold text-cyan-300">
                          {data.creditCard?.name || 'Cartão de Crédito'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Building2 className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-semibold text-foreground">
                          {data.type === 'TRANSFER'
                            ? `${data.account?.name || 'Conta PF'} ➔ ${data.targetAccount?.name || 'Caixinha Inter'}`
                            : data.account?.name || (data.type === 'INCOME' ? 'Conta PJ' : 'Conta PF')}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Bloco 3: Metadados Executivos */}
              <div className="p-4 rounded-xl bg-muted/40 border flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                    Auditoria & Data
                  </span>
                  <span className="text-xs font-mono text-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span>{new Date().toLocaleString('pt-BR')}</span>
                  </span>
                </div>

                <div className="pt-1 border-t border-border/50 text-[10px] text-muted-foreground space-y-0.5">
                  <div>Status Fatura: <span className="font-mono text-foreground">{data.isCard ? 'Pendente Fatura' : 'Compensado'}</span></div>
                  <div>Assistente: <span className="font-mono text-cyan-400">Jarvis PIT.AI</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. Projeção de Lista de Transações Recentes Grana+ */}
        {type === 'finance_list' && data && (
          <div className="bg-card border border-primary/20 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-foreground">
                  Grana+ • Transações Recentes
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-muted-foreground block">Total Acumulado</span>
                <span className="text-xs font-bold font-mono text-foreground">{data.totalFormatted}</span>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {data.transactions?.length > 0 ? (
                data.transactions.map((tx, idx) => (
                  <div
                    key={tx.id || idx}
                    className="p-3 rounded-xl bg-muted/30 border text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          tx.type === 'INCOME'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {tx.type === 'INCOME' ? (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-foreground block">
                          {tx.description || 'Lançamento Grana+'}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {tx.date ? new Date(tx.date).toLocaleDateString('pt-BR') : 'Data recente'}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`font-mono font-bold text-xs ${
                        tx.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {tx.type === 'INCOME' ? '+' : '-'} {(Number(tx.amount) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic p-3 text-center">
                  Nenhuma transação recente localizada no Grana+.
                </p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
