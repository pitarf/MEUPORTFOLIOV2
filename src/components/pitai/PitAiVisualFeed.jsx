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
  Newspaper
} from 'lucide-react';

/**
 * PIT.AI — Painel HUD de Projeção Visual Generativa
 * Rafael Pita Solutions / MeuPortfolio v2
 * 
 * Renderiza elementos visuais evocados dinamicamente pela conversa:
 * Mapas do RJ/Brasil, Cards de Notícias, Alertas de Conflito e Agenda.
 */
export default function PitAiVisualFeed({ payload, onResolveConflict, onRefreshBriefing }) {
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
      </motion.div>
    </AnimatePresence>
  );
}
