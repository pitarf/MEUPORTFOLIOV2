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
  PhoneCall
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { googleMapsProspectService } from '../../services/googleMapsProspectService';
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
  const [useAi, setUseAi] = useState(false);
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
    try {
      const data = await googleMapsProspectService.search({
        city: searchCity,
        state: searchState,
        niche,
        minRating: Number(minRating),
        useAi
      });
      setResults(data);

      if (data.length === 0) {
        toast({
          title: 'Nenhum lead encontrado com estes filtros',
          description: 'Tente diminuir a nota mínima ou ativar a varredura profunda com IA.'
        });
      } else {
        toast({
          title: `${data.length} advogados sem site identificados!`,
          description: 'Contatos e propostas geradas com sucesso.'
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

  // Copiar proposta
  const handleCopyProposal = (lawyer, variant = 'direto') => {
    const text = googleMapsProspectService.generateProposalMessage(lawyer, variant);
    navigator.clipboard.writeText(text);
    setCopiedId(lawyer.id);
    toast({
      title: 'Proposta copiada com sucesso!',
      description: 'Mensagem com o valor de R$ 300 + taxa de domínio pronta para envio.'
    });
    setTimeout(() => setCopiedId(null), 3000);
  };

  // Abrir WhatsApp Web diretamente com a mensagem pronta
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

    const fullNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;
    const message = googleMapsProspectService.generateProposalMessage(lawyer, variant);
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${fullNumber}?text=${encoded}`;
    window.open(url, '_blank');
  };

  // Salvar no CRM interno (legalProspectService)
  const handleSaveToCrm = (lawyer) => {
    googleMapsProspectService.saveToCrm(lawyer);
    setSavedIds((prev) => new Set([...prev, lawyer.id]));
    toast({
      title: 'Advogado salvo no CRM de Prospecção!',
      description: 'Você pode gerenciar o funil na aba "Prospecção Advogados".'
    });
  };

  // Salvar cadastro manual
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

    const newLead = {
      ...manualData,
      id: `maps-manual-${Date.now()}`,
      rating: Number(manualData.rating || 5.0),
      reviews_count: Number(manualData.reviews_count || 10),
      has_website: false,
      google_maps_url: googleMapsProspectService.getGoogleMapsWebSearchUrl(manualData.city, manualData.state)
    };

    setResults((prev) => [newLead, ...prev]);
    setIsManualModalOpen(false);
    toast({
      title: 'Escritório adicionado à lista do Radar!',
      description: 'Proposta de R$ 300 gerada com sucesso.'
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
          
          {/* Pílulas de Capitais */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-muted-foreground mr-1">Capitais:</span>
            {POPULAR_CITIES.slice(0, 6).map((c) => (
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
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useAi}
                onChange={(e) => setUseAi(e.target.checked)}
                className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary"
              />
              <span className="flex items-center gap-1 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Varredura com IA ao Vivo</span>
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
                  <span>Escaneando...</span>
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
            Proposta padronizada: <strong>R$ 300</strong> implementação + domínio anual
          </span>
        </div>

        {results.length === 0 && !loading && (
          <div className="text-center py-16 bg-card border rounded-2xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Nenhum escritório localizado para esses filtros
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Experimente buscar por cidades como "São Paulo", "Rio de Janeiro", "Curitiba" ou selecione "Todos os Nichos".
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((lawyer) => {
            const nicheDetails = LEGAL_NICHES[lawyer.niche] || LEGAL_NICHES.geral;
            const isSaved = savedIds.has(lawyer.id);
            const isCopied = copiedId === lawyer.id;

            // Link dinâmico para a demonstração
            const slugBase = (lawyer.lawyer_name || 'advogado')
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)+/g, '');
            const demoUrl = `/advocacia/${slugBase}`;

            // Link oficial ou de busca do Google Maps
            const mapsUrl = lawyer.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lawyer.lawyer_name} ${lawyer.city || ''} ${lawyer.state || ''}`)}`;

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
                      </div>

                      <h3 className="font-bold text-base text-foreground leading-snug pt-1 group-hover:text-primary transition-colors">
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline inline-flex items-center gap-1.5"
                          title="Abrir perfil deste advogado no Google Maps"
                        >
                          <span>{lawyer.lawyer_name}</span>
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
                      onClick={() => setSelectedLawyerForProposal(lawyer)}
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
                  {selectedLawyerForProposal.lawyer_name}
                </h3>
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-xs text-muted-foreground">
                    Avaliação: {selectedLawyerForProposal.rating}★ no Google Maps
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <a
                    href={selectedLawyerForProposal.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedLawyerForProposal.lawyer_name} ${selectedLawyerForProposal.city || ''} ${selectedLawyerForProposal.state || ''}`)}`}
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
                + Domínio Anual (~R$ 40/ano)
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
