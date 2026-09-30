import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Search,
  MapPin,
  Star,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  Sparkles,
  BookmarkPlus,
  Globe,
  DollarSign,
  Filter,
  RefreshCw,
  PlusCircle,
  AlertCircle,
  ShieldCheck,
  Send,
  Building,
  PhoneCall,
  Trash2,
  Clock
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { googleMapsProspectService, generateLawyerSlug, buildGoogleMapsUrl, buildDemoUrl } from '../../services/googleMapsProspectService';
import { LEGAL_NICHES } from '../../data/legalTemplates';

/**
 * Radar Google Maps de Prospecção Ativa para Advogados
 * Busca advogados com alta reputação no Google Maps sem site,
 * extrai WhatsApp e gera proposta personalizada de R$ 300 + taxa anual de domínio.
 */
export default function RadarGoogleMaps() {
  const { toast } = useToast();

  // Estados de busca e filtros
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [niche, setNiche] = useState('todos');
  const [minRating, setMinRating] = useState('4.5');
  const [useLiveApi, setUseLiveApi] = useState(true);
  const [loading, setLoading] = useState(false);

  // Lista de resultados
  const [results, setResults] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);

  // Modal de Proposta
  const [selectedLawyerForProposal, setSelectedLawyerForProposal] = useState(null);
  const [proposalVariant, setProposalVariant] = useState('direto'); // 'direto', 'autoridade', 'curto'

  // Modal de Adição Manual
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualData, setManualData] = useState({
    lawyer_name: '',
    rating: '5.0',
    reviews_count: '25',
    whatsapp: '',
    phone: '',
    city: '',
    state: '',
    address: '',
    niche: 'geral'
  });

  // Capitais sugeridas para busca com 1 clique
  const POPULAR_CITIES = [
    { name: 'São Paulo', uf: 'SP' },
    { name: 'Campinas', uf: 'SP' },
    { name: 'Valinhos', uf: 'SP' },
    { name: 'Rio de Janeiro', uf: 'RJ' },
    { name: 'Belo Horizonte', uf: 'MG' },
    { name: 'Curitiba', uf: 'PR' },
    { name: 'Salvador', uf: 'BA' },
    { name: 'Brasília', uf: 'DF' },
    { name: 'Aracaju', uf: 'SE' },
    { name: 'Goiânia', uf: 'GO' },
    { name: 'Porto Alegre', uf: 'RS' },
    { name: 'Fortaleza', uf: 'CE' }
  ];

  // Executa a busca
  const handleSearch = async (overrideCity, overrideUf) => {
    const searchCity = overrideCity !== undefined ? overrideCity : city;
    const searchState = overrideUf !== undefined ? overrideUf : state;

    setLoading(true);
    setResults([]);
    try {
      const data = await googleMapsProspectService.search({
        city: searchCity,
        state: searchState,
        niche,
        minRating: Number(minRating),
        liveApi: useLiveApi
      });
      setResults(data);

      if (data.length === 0) {
        toast({
          title: 'Nenhum lead sem site encontrado com estes filtros',
          description: 'Dica: diminua a avaliação mínima para 4.0★ ou pesquise outras cidades da região.'
        });
      } else {
        toast({
          title: `${data.length} advogados reais sem site identificados!`,
          description: useLiveApi
            ? 'Dados extraídos em tempo real via Google Places API Oficial.'
            : 'Leads carregados do histórico salvo.'
        });
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erro na busca do Radar Maps',
        description: err?.message || 'Falha ao processar os dados do Google Maps.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Carregamento inicial com todos os leads curados
  useEffect(() => {
    handleSearch('', '');
  }, []);

  // Atalho para clicar em uma capital sugerida
  const handleQuickCityClick = (cityObj) => {
    setCity(cityObj.name);
    setState(cityObj.uf);
    handleSearch(cityObj.name, cityObj.uf);
  };

  // Estados de demonstrações ativas salvas na nuvem (Supabase VPS)
  const [cloudDemos, setCloudDemos] = useState([]);
  const [loadingCloudDemos, setLoadingCloudDemos] = useState(false);

  // Carrega demonstrações ativas da nuvem
  const loadCloudDemos = async () => {
    setLoadingCloudDemos(true);
    try {
      const list = await googleMapsProspectService.listCloudDemos();
      setCloudDemos(list);
    } catch (e) {
      console.warn('Erro ao carregar demos da nuvem:', e);
    } finally {
      setLoadingCloudDemos(false);
    }
  };

  useEffect(() => {
    loadCloudDemos();
  }, []);

  // Excluir possível cliente da nuvem com 1 clique
  const handleDeleteCloudDemo = async (id, name) => {
    const ok = window.confirm(`Deseja realmente excluir a demonstração e o possível cliente "${name}" da nuvem?`);
    if (!ok) return;

    const success = await googleMapsProspectService.deleteCloudDemo(id);
    if (success) {
      toast({
        title: 'Possível cliente excluído!',
        description: `A demonstração de ${name} foi removida da nuvem com sucesso.`
      });
      loadCloudDemos();
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description: 'Não foi possível remover da nuvem.'
      });
    }
  };

  // Copiar proposta e salvar na nuvem automaticamente por 5 dias
  const handleCopyProposal = async (lawyer, variant = 'direto') => {
    const text = googleMapsProspectService.generateProposalMessage(lawyer, variant);
    navigator.clipboard.writeText(text);
    setCopiedId(lawyer.id);
    
    // Salva na nuvem para garantir que o link limpo funcione no celular do cliente
    googleMapsProspectService.saveCloudDemo(lawyer).then(() => {
      loadCloudDemos();
    });

    toast({
      title: 'Proposta copiada com sucesso!',
      description: 'Mensagem com link curto e valor de R$ 300 + domínio pronta para envio.'
    });
    setTimeout(() => setCopiedId(null), 3000);
  };

  // Abrir WhatsApp Web diretamente com a mensagem pronta e salvar na nuvem
  const handleSendWhatsApp = (lawyer, variant = 'direto') => {
    const cleanNumber = (lawyer.whatsapp || lawyer.phone || '').replace(/\D/g, '');
    if (!cleanNumber || cleanNumber.length < 10) {
      toast({
        variant: 'destructive',
        title: 'WhatsApp não informado',
        description: 'Edite o lead para inserir o número com DDD antes de disparar.'
      });
      return;
    }

    // Salva na nuvem para garantir que a cliente abra a demo personalizada
    googleMapsProspectService.saveCloudDemo(lawyer).then(() => {
      loadCloudDemos();
    });

    const fullNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;
    const message = googleMapsProspectService.generateProposalMessage(lawyer, variant);
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${fullNumber}?text=${encoded}`;
    window.open(url, '_blank');
  };

  // Salvar no CRM interno (legalProspectService)
  const handleSaveToCrm = (lawyer) => {
    googleMapsProspectService.saveToCrm(lawyer);
    googleMapsProspectService.saveCloudDemo(lawyer).then(() => {
      loadCloudDemos();
    });
    setSavedIds((prev) => new Set([...prev, lawyer.id]));
    toast({
      title: 'Advogado salvo no CRM de Prospecção!',
      description: 'Você pode gerenciar o funil na aba "Prospecção Advogados".'
    });
  };

  // Salvar cadastro manual / ficha colada
  const handleSaveManual = (e) => {
    e.preventDefault();
    if (!manualData.lawyer_name || !manualData.whatsapp) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Informe o nome do escritório e o WhatsApp.'
      });
      return;
    }

    const updated = googleMapsProspectService.addRealLead(manualData);
    setResults(updated);
    setIsManualModalOpen(false);
    toast({
      title: 'Escritório real adicionado à lista!',
      description: 'Lead registrado e proposta de R$ 300 gerada com sucesso.'
    });
  };

  // Limpar todos os leads do radar
  const handleClearAllLeads = () => {
    googleMapsProspectService.clearAllLeads();
    setResults([]);
    toast({
      title: 'Histórico do Radar limpo!',
      description: 'Todos os registros foram removidos com sucesso.'
    });
  };

  // Métricas dinâmicas da busca
  const metrics = useMemo(() => {
    const total = results.length;
    const avgRating = total > 0
      ? (results.reduce((acc, curr) => acc + Number(curr.rating || 0), 0) / total).toFixed(1)
      : '0.0';
    const potentialRevenue = total * 300;

    return { total, avgRating, potentialRevenue };
  }, [results]);

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header Executivo com Indicadores de Negócio */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card border rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Radar de Vendas B2B • Google Maps Brasil</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Radar Google Maps: Advogados com Avaliação Alta & Sem Site
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Identifique escritórios com excelente reputação no Google que não possuem presença na web. 
            Dispare propostas irresistíveis de <strong className="text-foreground font-semibold">R$ 300 (implementação única) + anuidade do domínio</strong> direto no WhatsApp.
          </p>
        </div>

        {/* Cards de Métricas em Tempo Real */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 flex-shrink-0">
          <div className="bg-muted/50 border rounded-xl p-3.5 text-center">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block font-medium">
              Sem Site
            </span>
            <span className="text-xl sm:text-2xl font-bold text-foreground">
              {metrics.total}
            </span>
          </div>

          <div className="bg-muted/50 border rounded-xl p-3.5 text-center">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block font-medium">
              Média Google
            </span>
            <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-xl sm:text-2xl">
              <span>{metrics.avgRating}</span>
              <Star className="w-4 h-4 fill-amber-500" />
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 text-center">
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block font-medium">
              Potencial (R$)
            </span>
            <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              R$ {metrics.potentialRevenue.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      {/* Caixa de Filtros de Busca */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Filter className="w-4 h-4 text-primary" />
            <span>Filtros de Prospecção Geográfica</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={googleMapsProspectService.getGoogleMapsWebSearchUrl(city, state, niche)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir Pesquisa no Google Maps</span>
            </a>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsManualModalOpen(true)}
              className="gap-1.5 text-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-primary" />
              <span>Colar Ficha do Maps</span>
            </Button>

            {results.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAllLeads}
                className="gap-1.5 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                title="Limpar todos os leads e remover histórico"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar Histórico</span>
              </Button>
            )}
          </div>
        </div>

        {/* Inputs de Filtro */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Cidade */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Cidade / Município
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Ex: São Paulo, Belo Horizonte, Aracaju..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Estado UF */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Estado (UF)
            </label>
            <input
              type="text"
              maxLength={2}
              placeholder="SP, RJ, MG, SE..."
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-sm uppercase text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center font-mono font-semibold"
            />
          </div>

          {/* Nicho / Especialidade */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Especialidade
            </label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              <option value="todos">Todos os Nichos</option>
              <option value="geral">Geral / Full-Service</option>
              <option value="trabalhista">Direito Trabalhista</option>
              <option value="familia">Família & Sucessões</option>
              <option value="consumidor">Direito do Consumidor</option>
            </select>
          </div>

          {/* Avaliação Mínima */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Avaliação Mínima
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              <option value="4.0">4.0★ ou mais</option>
              <option value="4.5">4.5★ ou mais (Recomendado)</option>
              <option value="4.8">4.8★ ou mais (Alta Reputação)</option>
              <option value="5.0">5.0★ (Nota Máxima)</option>
            </select>
          </div>

        </div>

        {/* Barra Inferior: Capitais Rápidas + Botão de Busca */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          
          {/* Pílulas de Capitais e Cidades Estratégicas */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-muted-foreground mr-1">Cidades:</span>
            {POPULAR_CITIES.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => handleQuickCityClick(c)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                  city.toLowerCase() === c.name.toLowerCase()
                    ? 'bg-primary text-primary-foreground border-primary font-semibold'
                    : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {c.name} ({c.uf})
              </button>
            ))}
          </div>

          {/* Ações de Busca */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none" title="Busca advogados reais e sem site em tempo real pela API oficial do Google">
              <input
                type="checkbox"
                checked={useLiveApi}
                onChange={(e) => setUseLiveApi(e.target.checked)}
                className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary"
              />
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Google Places API (Ao Vivo)</span>
              </span>
            </label>

            <Button
              onClick={() => handleSearch()}
              disabled={loading}
              className="gap-2 px-6 shadow-sm"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Consultando API Oficial...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Escanear Google Maps</span>
                </>
              )}
            </Button>
          </div>

        </div>

      </div>

      {/* Seção de Demonstrações Ativas na Nuvem (Validade de 5 Dias) */}
      {cloudDemos.length > 0 && (
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4 border-amber-500/20 bg-amber-500/[0.02]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <Globe className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <span>Demonstrações Ativas na Nuvem</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-semibold">
                    {cloudDemos.length} ativas
                  </span>
                </h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Modelos exclusivos salvos com links curtos oficiais. Cada proposta permanece disponível por 5 dias corridos.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={loadCloudDemos}
              disabled={loadingCloudDemos}
              className="gap-1.5 text-xs self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingCloudDemos ? 'animate-spin' : ''}`} />
              <span>Atualizar Nuvem</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cloudDemos.map((demo) => {
              const demoUrl = `https://rafaelpitaoficial.com.br/adv/${demo.slug}`;

              return (
                <div
                  key={demo.id}
                  className="p-4 rounded-xl border bg-background/80 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-foreground line-clamp-1">
                        {demo.name}
                      </h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${
                        demo.isExpired
                          ? 'bg-muted text-muted-foreground border'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {demo.isExpired ? 'Expirada' : `${demo.daysLeft} dias restantes`}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {demo.city ? `${demo.city} - ${demo.state || 'SP'}` : 'Localização não informada'}
                    </p>

                    <div className="pt-1">
                      <span className="text-[11px] font-mono text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10 block truncate">
                        {demoUrl}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t">
                    <a
                      href={`/adv/${demo.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-muted transition-colors text-foreground"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-primary" />
                      <span>Abrir Demo</span>
                    </a>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(demoUrl);
                        toast({
                          title: 'Link copiado!',
                          description: demoUrl
                        });
                      }}
                      className="px-2.5 py-1.5 h-auto text-xs"
                      title="Copiar Link Curto"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCloudDemo(demo.id, demo.name)}
                      className="px-2.5 py-1.5 h-auto text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/20"
                      title="Excluir Possível Cliente da Nuvem"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grade de Resultados com Cards dos Advogados */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span>Resultados Encontrados</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-semibold">
              {results.length} escritórios
            </span>
          </h2>

          <span className="text-xs text-muted-foreground hidden sm:block">
            Proposta padronizada: <strong>R$ 300</strong> implementação + domínio anual (~R$ 60/ano)
          </span>
        </div>

        {results.length === 0 && !loading && (
          <div className="text-center py-16 bg-card border rounded-2xl p-8 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-foreground">
                Base Limpa de Dados Fictícios
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Todos os dados simulados foram removidos com sucesso. O Radar agora opera estritamente com fichas 100% reais do Google Maps.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                onClick={() => setIsManualModalOpen(true)}
                className="gap-2 text-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Colar Ficha Real do Google Maps</span>
              </Button>

              <a
                href={googleMapsProspectService.getGoogleMapsWebSearchUrl(city, state, niche)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-muted text-foreground text-xs font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-primary" />
                <span>Pesquisar Advogados no Google Maps</span>
              </a>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((lawyer) => {
            const nicheDetails = LEGAL_NICHES[lawyer.niche] || LEGAL_NICHES.geral;
            const isSaved = savedIds.has(lawyer.id);
            const isCopied = copiedId === lawyer.id;

            // Link dinâmico para a demonstração com parâmetros portáteis
            const demoUrl = buildDemoUrl(lawyer);

            // Link oficial ou de busca do Google Maps baseado na correspondência precisa de Nome e Endereço
            const mapsUrl = buildGoogleMapsUrl(lawyer);

            return (
              <div
                key={lawyer.id}
                className="bg-card border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                {/* Linha de Destaque Superior */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {nicheDetails.name}
                        </span>
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          Sem Site Oficial
                        </span>
                        {lawyer.source === 'google_places_api' && (
                          <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Google Places Oficial
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-foreground leading-snug pt-1 group-hover:text-primary transition-colors">
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline inline-flex items-center gap-1.5"
                          title="Abrir perfil deste advogado no Google Maps"
                        >
                          <span>{lawyer.lawyer_name || lawyer.name}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-60 group-hover:opacity-100" />
                        </a>
                      </h3>
                    </div>

                    {/* Badge Clicável de Avaliação no Google Maps */}
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 font-bold text-xs flex-shrink-0 transition-colors"
                      title="Ver ficha e avaliações no Google Maps"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{Number(lawyer.rating).toFixed(1)}</span>
                      {lawyer.reviews_count && (
                        <span className="text-[10px] font-normal text-muted-foreground">
                          ({lawyer.reviews_count})
                        </span>
                      )}
                    </a>
                  </div>

                  {/* Endereço & Cidade com link para o Maps */}
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="line-clamp-2 hover:text-primary hover:underline transition-colors"
                        title="Ver endereço no Google Maps"
                      >
                        {lawyer.address || `${lawyer.city} - ${lawyer.state}`}
                      </a>
                    </div>

                    {lawyer.highlights && (
                      <p className="text-[11px] text-muted-foreground italic bg-muted/40 p-2 rounded-lg border mt-2">
                        "{lawyer.highlights}"
                      </p>
                    )}
                  </div>

                  {/* Telefone / WhatsApp */}
                  <div className="pt-2 border-t flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">WhatsApp / Fone:</span>
                    <span className="font-mono font-semibold text-foreground">
                      {lawyer.phone || lawyer.whatsapp || 'Não informado'}
                    </span>
                  </div>
                </div>

                {/* Bloco de Ações e Proposta */}
                <div className="space-y-2.5 pt-3 border-t">
                  
                  {/* Botão Principal: Enviar no WhatsApp com a Proposta de R$ 300 */}
                  <button
                    type="button"
                    onClick={() => handleSendWhatsApp(lawyer, 'direto')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enviar Proposta no WhatsApp (R$ 300)</span>
                  </button>

                  {/* Linha de 4 Ações Rápidas */}
                  <div className="grid grid-cols-4 gap-1.5">
                    
                    {/* Link Direto do Google Maps */}
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 text-[11px] px-1.5 h-8 rounded-md border border-input bg-background hover:bg-primary/10 hover:text-primary text-foreground transition-colors"
                      title="Abrir a ficha oficial no Google Maps"
                    >
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span className="truncate">Maps</span>
                    </a>

                    {/* Ver Proposta / Copiar */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedLawyerForProposal(lawyer);
                        googleMapsProspectService.saveCloudDemo(lawyer).then(() => loadCloudDemos());
                      }}
                      className="text-[11px] px-1.5 h-8 gap-1"
                      title="Ver e personalizar o texto da proposta"
                    >
                      <Copy className="w-3 h-3 text-muted-foreground" />
                      <span className="truncate">Texto</span>
                    </Button>

                    {/* Ver Demonstração Criada */}
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 text-[11px] px-1.5 h-8 rounded-md border border-input bg-background hover:bg-muted text-foreground transition-colors"
                      title="Abrir o site modelo gerado para este escritório"
                    >
                      <ExternalLink className="w-3 h-3 text-primary" />
                      <span className="truncate">Demo</span>
                    </a>

                    {/* Salvar no CRM */}
                    <Button
                      variant={isSaved ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleSaveToCrm(lawyer)}
                      disabled={isSaved}
                      className="text-[11px] px-1.5 h-8 gap-1"
                      title="Salvar no gerenciador de prospecção do painel"
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3 h-3 text-white" />
                          <span className="truncate">Salvo</span>
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-3 h-3 text-muted-foreground" />
                          <span className="truncate">Salvar</span>
                        </>
                      )}
                    </Button>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Pré-visualização & Edição da Proposta (R$ 300 + Domínio) */}
      {selectedLawyerForProposal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                  Proposta Comercial de Impacto
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {selectedLawyerForProposal.lawyer_name || selectedLawyerForProposal.name}
                </h3>
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-xs text-muted-foreground">
                    Avaliação: {selectedLawyerForProposal.rating}★ no Google Maps
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <a
                    href={buildGoogleMapsUrl(selectedLawyerForProposal)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>Ver no Google Maps ↗</span>
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLawyerForProposal(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            {/* Alternador de Variações de Copy */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">
                Modelo da Mensagem:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setProposalVariant('direto')}
                  className={`text-xs py-2 px-3 rounded-lg border font-medium transition-colors ${
                    proposalVariant === 'direto'
                      ? 'bg-primary text-primary-foreground border-primary font-bold'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  Padrão (Direto)
                </button>

                <button
                  type="button"
                  onClick={() => setProposalVariant('autoridade')}
                  className={`text-xs py-2 px-3 rounded-lg border font-medium transition-colors ${
                    proposalVariant === 'autoridade'
                      ? 'bg-primary text-primary-foreground border-primary font-bold'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  Consultivo
                </button>

                <button
                  type="button"
                  onClick={() => setProposalVariant('curto')}
                  className={`text-xs py-2 px-3 rounded-lg border font-medium transition-colors ${
                    proposalVariant === 'curto'
                      ? 'bg-primary text-primary-foreground border-primary font-bold'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  Curto (WhatsApp)
                </button>
              </div>
            </div>

            {/* Caixa de Texto da Mensagem */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground block">
                Texto Formatado para Envio:
              </label>
              <textarea
                readOnly
                rows={9}
                value={googleMapsProspectService.generateProposalMessage(
                  selectedLawyerForProposal,
                  proposalVariant
                )}
                className="w-full p-4 rounded-xl border bg-muted/40 text-xs text-foreground font-mono leading-relaxed outline-none resize-none select-all"
              />
            </div>

            {/* Destaque das Condições de Preço */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Valor de Implementação:</span>
                <strong className="text-foreground font-bold">R$ 300,00 (único)</strong>
              </div>
              <div className="text-muted-foreground text-[11px]">
                + Domínio Anual (~R$ 60/ano)
              </div>
            </div>

            {/* Ações do Modal */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLawyerForProposal(null)}
              >
                Fechar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyProposal(selectedLawyerForProposal, proposalVariant)}
                className="gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Texto</span>
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  handleSendWhatsApp(selectedLawyerForProposal, proposalVariant);
                  setSelectedLawyerForProposal(null);
                }}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Abrir WhatsApp Web</span>
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Modal de Importação Manual de Ficha do Maps */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Colar / Inserir Ficha do Google Maps
                </h3>
                <p className="text-xs text-muted-foreground">
                  Adicione qualquer escritório encontrado no Maps para gerar a proposta automaticamente.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveManual} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Nome do Advogado ou Escritório *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dr. Marcelo Santos Advocacia"
                  value={manualData.lawyer_name}
                  onChange={(e) => setManualData({ ...manualData, lawyer_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-sm text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    WhatsApp (com DDD) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="(11) 99999-9999"
                    value={manualData.whatsapp}
                    onChange={(e) => setManualData({ ...manualData, whatsapp: e.target.value, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-sm text-foreground outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Nota no Google Maps
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={manualData.rating}
                    onChange={(e) => setManualData({ ...manualData, rating: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-sm text-foreground outline-none font-mono text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    placeholder="Cidade"
                    value={manualData.city}
                    onChange={(e) => setManualData({ ...manualData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-sm text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    UF
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    placeholder="UF"
                    value={manualData.state}
                    onChange={(e) => setManualData({ ...manualData, state: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-sm text-foreground outline-none text-center uppercase font-mono font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Especialidade / Nicho
                </label>
                <select
                  value={manualData.niche}
                  onChange={(e) => setManualData({ ...manualData, niche: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-sm text-foreground outline-none"
                >
                  <option value="geral">Geral & Full-Service</option>
                  <option value="trabalhista">Direito Trabalhista</option>
                  <option value="familia">Família & Sucessões</option>
                  <option value="consumidor">Direito do Consumidor</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsManualModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" size="sm">
                  Adicionar ao Radar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
