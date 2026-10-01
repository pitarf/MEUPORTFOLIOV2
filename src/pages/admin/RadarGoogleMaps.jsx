import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { cleanLawyerName } from '../../utils/lawyerNameFormatter';

/**
 * Radar Google Maps de Prospecção Ativa para Advogados
 * Busca advogados com alta reputação no Google Maps sem site,
/**
 * Banco oficial de Scripts e Respostas Rápidas salvos para prospecção no WhatsApp
 */
const SAVED_PITCH_SCRIPTS = [
  {
    id: 'passo1',
    title: '1. Abertura (Anti-Spam)',
    badge: 'Filtro Secretária',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    objective: 'Quebra de gelo sem envio de link. Identifica se o canal fala com a assessoria ou com o advogado titular para romper o filtro sem risco de bloqueio.',
    text: `Olá, bom dia! Tudo bem?

Por gentileza, este canal é o contato direto com o(a) Dr(a). [Nome do Advogado] ou falo com a equipe do escritório?`
  },
  {
    id: 'passo2',
    title: '2. Oportunidade & Permissão',
    badge: 'Permissão',
    badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    objective: 'Elogio sincero à reputação no Google Maps, alerta de perda de clientes na região para a concorrência e solicitação de autorização expressa para envio da demonstração.',
    text: `Aqui é o Rafael. Estava analisando os escritórios de advocacia em [Cidade] e vi que vocês possuem uma excelente reputação e ótimas avaliações no Google (5.0★)!

Porém, notei que ainda não possuem um site próprio de atendimento rápido conectado ao perfil, e hoje muitos clientes em potencial da região acabam fechando com outros escritórios por não encontrarem uma página oficial.

Desenvolvi um protótipo exclusivo para o escritório de vocês para mostrar na prática como reter esses clientes.

Me autoriza a enviar o link rápido de demonstração para vocês darem uma olhada sem nenhum compromisso?`
  },
  {
    id: 'passo3',
    title: '3. Demonstração Oficial',
    badge: 'Link + Proposta',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    objective: 'Entrega da Landing Page personalizada sob demanda, com menção à personalização de fotos/textos, respeito ao Código de Ética da OAB e proposta de R$ 300 mais domínio anual.',
    text: `Perfeito, Dr(a). [Nome]! Montei esta prévia personalizada pensando exatamente no posicionamento de vocês:

👉 https://rafaelpitaoficial.com.br/adv/[slug-do-advogado]

O objetivo é transformar quem pesquisa por advogados em [Cidade] no Google em contatos diretos no WhatsApp de vocês, com alto padrão visual e total respeito ao Código de Ética da OAB.

Todos os textos, fotos e áreas de atuação podem ser 100% personalizados com a identidade oficial do escritório.

Para colocar no ar com domínio próprio e configurado, o valor é de apenas R$ 300 (taxa única de implementação) mais a anuidade do domínio próprio (em média R$ 60 ao ano).

Depois me conte o que achou da estrutura!`
  },
  {
    id: 'recuperacao1',
    title: '4. Resgate Parte 1 (Pergunta do Canal Certo)',
    badge: 'Desarmador',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    objective: 'Para quem não respondeu. Pergunta de forma despretensiosa se aquele é o canal adequado ou se recomendam outro. Desarma defesas imediatamente com taxa recorde de resposta.',
    text: `Olá, tudo bem? 

Mandei uma mensagem aqui anteriormente, mas nem sei se este é o melhor contato para tratar sobre a presença digital e novos clientes do escritório... 

Caso não seja, teria algum outro canal ou pessoa responsável que você pudesse me indicar?`
  },
  {
    id: 'recuperacao2',
    title: '5. Resgate Parte 2 (Confirmou "É Comigo / Sou Eu")',
    badge: 'Pós-Retorno',
    badgeColor: 'bg-purple-700/10 text-purple-700 dark:text-purple-300 border-purple-700/20',
    objective: 'Disparada assim que o cliente responde "sou eu", "é aqui" ou "pode falar". Reapresenta a demonstração já pronta e alerta sobre clientes da comarca escapando para a concorrência.',
    text: `Perfeito, Dr(a). [Nome]! 

Quis apenas retomar o contato porque verifiquei que vocês possuem excelente avaliação no Google Maps em [Cidade], mas ainda não têm um site oficial cadastrado.

Hoje, potenciais clientes que pesquisam por advogados na sua região acabam fechando com outros escritórios por não encontrarem uma página de contato rápido de vocês.

Cheguei a desenhar um modelo exclusivo para o escritório de vocês verem na prática como resolver isso:

👉 https://rafaelpitaoficial.com.br/adv/[slug-do-advogado]

(Lembrando que todos os textos, áreas de atuação e fotos podem ser 100% personalizados com a identidade oficial de vocês).

Para subir com domínio próprio e configurado, o valor é de apenas R$ 300 (taxa única de implementação) mais a anuidade do domínio (em média R$ 60 ao ano).

Depois me dê um retorno sobre o que achou da estrutura!`
  },
  {
    id: 'recuperacao_indicado',
    title: '6. Resposta: Passou Outro Contato (Abordagem da Indicação)',
    badge: 'Novo Contato',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    objective: 'Aborda a secretária, sócio ou responsável indicado com respaldo de quem indicou.',
    text: `Olá! Tudo bem?

Falei anteriormente no canal principal do escritório do(a) Dr(a). [Nome] e me indicaram falar com você sobre a presença digital e captação de clientes.

Desenvolvi um protótipo visual exclusivo para o escritório em [Cidade]:
👉 https://rafaelpitaoficial.com.br/adv/[slug-do-advogado]

Gostaria de saber se você teria 2 minutinhos para dar uma olhada sem nenhum compromisso?`
  },
  {
    id: 'recuperacao_recusa',
    title: '7. Resposta: "Sem Interesse" (Saída Elegante)',
    badge: 'Porta Aberta',
    badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    objective: 'Agradece educadamente, preserva a autoridade e deixa as portas abertas para futuras contratações.',
    text: `Sem problemas! Agradeço pelo retorno e pela atenção.

Caso em algum momento decidam estruturar uma página rápida para converter quem pesquisa pelo escritório no Google em [Cidade], fico à disposição. 

Um abraço e excelente trabalho para toda a equipe!`
  }
];

export default function RadarGoogleMaps() {
  const { toast } = useToast();
  const resultsRef = useRef(null);

  // Aba ativa: 'radar' (busca e leads) ou 'scripts' (banco de respostas salvas)
  const [activeTab, setActiveTab] = useState('radar');

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
  const [proposalVariant, setProposalVariant] = useState('passo1');

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
      if (data.length > 0) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }

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

      {/* Alternador de Abas Principais da Página */}
      <div className="flex items-center gap-2 border-b pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('radar')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'radar'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted/40 hover:bg-muted text-muted-foreground'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Radar de Prospecção</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('scripts')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'scripts'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-muted/40 hover:bg-muted text-muted-foreground'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Banco de Respostas & Scripts Salvos</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
            {SAVED_PITCH_SCRIPTS.length}
          </span>
        </button>
      </div>

      {activeTab === 'radar' ? (
        <>
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

      {/* Grade de Resultados com Cards dos Advogados (Exibida Imediatamente após os Filtros) */}
      <div ref={resultsRef} className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5 flex-wrap">
              <span>Resultados no Google Maps</span>
              {city && (
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                  {city} {state ? `(${state})` : ''}
                </span>
              )}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold border border-emerald-500/20">
                {results.length} escritórios sem site
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Advogados reais de boa avaliação identificados no Google Maps que não possuem website oficial cadastrado.
            </p>
          </div>

          <span className="text-xs text-muted-foreground self-start sm:self-auto font-medium">
            Proposta padronizada: <strong className="text-emerald-600 dark:text-emerald-400">R$ 300</strong> implementação + domínio anual (~R$ 60/ano)
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
                          <span>{cleanLawyerName(lawyer.lawyer_name || lawyer.name)}</span>
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

                {/* Roteiro Cadenciado de Abordagem WhatsApp (3 Etapas + Recuperação) */}
                <div className="space-y-2 pt-3 border-t">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Roteiro em 3 Passos:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSendWhatsApp(lawyer, 'recuperacao')}
                        className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline font-semibold flex items-center gap-0.5"
                        title="Enviar mensagem de recuperação para quem já recebeu mensagem antes e não respondeu"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>Recuperar</span>
                      </button>
                      <span className="text-muted-foreground">•</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLawyerForProposal(lawyer);
                          setProposalVariant('passo1');
                          googleMapsProspectService.saveCloudDemo(lawyer).then(() => loadCloudDemos());
                        }}
                        className="text-[10px] text-primary hover:underline font-medium"
                        title="Ver os textos completos e dicas de cada etapa"
                      >
                        Ver Roteiro
                      </button>
                    </div>
                  </div>

                  {/* 3 Botões de Disparo Cadenciado */}
                  <div className="grid grid-cols-3 gap-1.5">
                    
                    {/* Passo 1: Abertura e Filtro da Secretária */}
                    <button
                      type="button"
                      onClick={() => handleSendWhatsApp(lawyer, 'passo1')}
                      title="Passo 1: Abertura e quebra de gelo com a secretária (anti-spam, sem link)"
                      className="flex flex-col items-center justify-center p-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 transition-all text-center group"
                    >
                      <div className="flex items-center gap-1 text-[11px] font-bold">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px]">1</span>
                        <span>Abertura</span>
                      </div>
                      <span className="text-[9px] text-muted-foreground mt-0.5 truncate max-w-full">
                        Anti-Spam
                      </span>
                    </button>

                    {/* Passo 2: Oportunidade e Concorrência */}
                    <button
                      type="button"
                      onClick={() => handleSendWhatsApp(lawyer, 'passo2')}
                      title="Passo 2: Alerta perda de clientes para concorrentes e pede permissão para enviar demonstração"
                      className="flex flex-col items-center justify-center p-2 rounded-xl border border-sky-500/30 bg-sky-500/5 hover:bg-sky-500/15 text-sky-700 dark:text-sky-300 transition-all text-center group"
                    >
                      <div className="flex items-center gap-1 text-[11px] font-bold">
                        <span className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[9px]">2</span>
                        <span>Oportunidade</span>
                      </div>
                      <span className="text-[9px] text-muted-foreground mt-0.5 truncate max-w-full">
                        Permissão
                      </span>
                    </button>

                    {/* Passo 3: Envio da Demonstração e Proposta */}
                    <button
                      type="button"
                      onClick={() => handleSendWhatsApp(lawyer, 'passo3')}
                      title="Passo 3: Envia a Landing Page personalizada e a proposta de R$ 300"
                      className="flex flex-col items-center justify-center p-2 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15 text-amber-700 dark:text-amber-300 transition-all text-center group"
                    >
                      <div className="flex items-center gap-1 text-[11px] font-bold">
                        <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[9px]">3</span>
                        <span>Demo</span>
                      </div>
                      <span className="text-[9px] text-muted-foreground mt-0.5 truncate max-w-full">
                        Link + R$ 300
                      </span>
                    </button>

                  </div>

                  {/* Linha de 4 Ações Rápidas */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    
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

                    {/* Ver Proposta / Roteiro Completo */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedLawyerForProposal(lawyer);
                        setProposalVariant('passo1');
                        googleMapsProspectService.saveCloudDemo(lawyer).then(() => loadCloudDemos());
                      }}
                      className="text-[11px] px-1.5 h-8 gap-1"
                      title="Ver e copiar os textos de cada etapa do roteiro"
                    >
                      <Copy className="w-3 h-3 text-muted-foreground" />
                      <span className="truncate">Textos</span>
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

      {/* Seção de Demonstrações Ativas na Nuvem (Validade de 5 Dias - Abaixo dos Resultados) */}
      {cloudDemos.length > 0 && (
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4 border-amber-500/20 bg-amber-500/[0.02] mt-6">
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
                        {cleanLawyerName(demo.name)}
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

                  {/* Roteiro Cadenciado Rápido na Nuvem (3 Passos + Recuperação) */}
                  <div className="pt-2 border-t space-y-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground block">
                      Disparo Cadenciado (WhatsApp):
                    </span>
                    <div className="grid grid-cols-4 gap-1">
                      <button
                        type="button"
                        onClick={() => handleSendWhatsApp({ ...demo, lawyer_name: demo.name }, 'passo1')}
                        title="Passo 1: Abertura e quebra de gelo"
                        className="py-1 px-1 rounded-lg border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold text-center"
                      >
                        1. Abertura
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendWhatsApp({ ...demo, lawyer_name: demo.name }, 'passo2')}
                        title="Passo 2: Alerta perda de clientes e pede permissão"
                        className="py-1 px-1 rounded-lg border border-sky-500/30 bg-sky-500/5 hover:bg-sky-500/15 text-sky-700 dark:text-sky-300 text-[10px] font-bold text-center"
                      >
                        2. Oportunidade
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendWhatsApp({ ...demo, lawyer_name: demo.name }, 'passo3')}
                        title="Passo 3: Envia link da demonstração e proposta R$ 300"
                        className="py-1 px-1 rounded-lg border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-bold text-center"
                      >
                        3. Demo
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendWhatsApp({ ...demo, lawyer_name: demo.name }, 'recuperacao')}
                        title="Passo 4: Follow-up cordial para resgatar quem não respondeu"
                        className="py-1 px-1 rounded-lg border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-bold text-center"
                      >
                        4. Resgate
                      </button>
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
        </>
      ) : (
        /* Aba 2: Banco de Respostas & Scripts Salvos */
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
                <MessageCircle className="w-4 h-4" />
                <span>Banco de Respostas Salvas & Roteiro Completo</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Scripts Estratégicos de Prospecção e Resgate
              </h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                Consulte e copie com 1 clique todas as mensagens do roteiro cadenciado, perguntas de resgate e respostas para cada reação do cliente no WhatsApp.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('radar')}
              className="gap-2 text-xs"
            >
              <Compass className="w-4 h-4 text-primary" />
              <span>Voltar ao Radar de Busca</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SAVED_PITCH_SCRIPTS.map((script, idx) => (
              <div
                key={script.id}
                className="bg-card border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${script.badgeColor}`}>
                        {script.badge}
                      </span>
                      <h3 className="font-bold text-sm text-foreground pt-1.5">
                        {script.title}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-muted-foreground">
                      #{idx + 1}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {script.objective}
                  </p>

                  <div className="pt-1">
                    <textarea
                      readOnly
                      rows={6}
                      value={script.text}
                      className="w-full p-3 rounded-xl border bg-muted/40 text-xs text-foreground font-mono leading-relaxed outline-none resize-none select-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(script.text);
                      toast({
                        title: 'Script copiado!',
                        description: `${script.title} copiado para a área de transferência.`
                      });
                    }}
                    className="w-full gap-2 text-xs font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Este Script</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Roteiro Cadenciado & Edição da Proposta */}
      {selectedLawyerForProposal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                  Roteiro Estratégico de Abordagem WhatsApp
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

            {/* Alternador de Passos do Roteiro */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground block">
                Selecione a Etapa do Contato:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => setProposalVariant('passo1')}
                  className={`text-xs py-2 px-1 rounded-lg border font-medium transition-all text-center ${
                    proposalVariant === 'passo1'
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="text-[11px]">1. Abertura</div>
                  <div className="text-[9px] opacity-80">Anti-Spam</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProposalVariant('passo2')}
                  className={`text-xs py-2 px-1 rounded-lg border font-medium transition-all text-center ${
                    proposalVariant === 'passo2'
                      ? 'bg-sky-600 text-white border-sky-600 font-bold shadow-sm'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="text-[11px]">2. Oportunidade</div>
                  <div className="text-[9px] opacity-80">Permissão</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProposalVariant('passo3')}
                  className={`text-xs py-2 px-1 rounded-lg border font-medium transition-all text-center ${
                    proposalVariant === 'passo3'
                      ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-sm'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="text-[11px]">3. Demo</div>
                  <div className="text-[9px] opacity-80">Link + R$ 300</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProposalVariant('recuperacao1')}
                  className={`text-xs py-2 px-1 rounded-lg border font-medium transition-all text-center ${
                    proposalVariant === 'recuperacao1' || proposalVariant === 'recuperacao'
                      ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-sm'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="text-[11px]">4. Resgate 1</div>
                  <div className="text-[9px] opacity-80">Canal Certo?</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProposalVariant('recuperacao2')}
                  className={`text-xs py-2 px-1 rounded-lg border font-medium transition-all text-center ${
                    proposalVariant === 'recuperacao2'
                      ? 'bg-purple-700 text-white border-purple-700 font-bold shadow-sm'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="text-[11px]">5. "É Comigo"</div>
                  <div className="text-[9px] opacity-80">Link Pós-Retorno</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProposalVariant('recuperacao_indicado')}
                  className={`text-xs py-2 px-1 rounded-lg border font-medium transition-all text-center ${
                    proposalVariant === 'recuperacao_indicado'
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-sm'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="text-[11px]">6. Novo Contato</div>
                  <div className="text-[9px] opacity-80">Indicação</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProposalVariant('recuperacao_recusa')}
                  className={`text-xs py-2 px-1 rounded-lg border font-medium transition-all text-center ${
                    proposalVariant === 'recuperacao_recusa'
                      ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-sm'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="text-[11px]">7. "Sem Interesse"</div>
                  <div className="text-[9px] opacity-80">Saída Elegante</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProposalVariant('direto')}
                  className={`text-xs py-2 px-1 rounded-lg border font-medium transition-all text-center ${
                    proposalVariant === 'direto'
                      ? 'bg-primary text-primary-foreground border-primary font-bold shadow-sm'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <div className="text-[11px]">Direta</div>
                  <div className="text-[9px] opacity-80">Completa</div>
                </button>
              </div>
            </div>

            {/* Dica Estratégica do Passo Selecionado */}
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground space-y-1">
              <div className="font-semibold text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {proposalVariant === 'passo1' && 'Estratégia do Passo 1: Quebra de Gelo & Filtro da Secretária'}
                  {proposalVariant === 'passo2' && 'Estratégia do Passo 2: Alerta de Concorrência & Micro-Compromisso'}
                  {proposalVariant === 'passo3' && 'Estratégia do Passo 3: Entrega do Link com Proposta Transparente'}
                  {(proposalVariant === 'recuperacao1' || proposalVariant === 'recuperacao') && 'Estratégia de Resgate (Parte 1): Pergunta do Canal Certo'}
                  {proposalVariant === 'recuperacao2' && 'Estratégia de Resgate (Parte 2): Entrega da Demonstração após Confirmação'}
                  {proposalVariant === 'recuperacao_indicado' && 'Resposta para Novo Contato Indicado'}
                  {proposalVariant === 'recuperacao_recusa' && 'Saída Elegante para Declínio de Interesse'}
                  {proposalVariant === 'direto' && 'Estratégia Direta: Abordagem completa em mensagem única'}
                </span>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {proposalVariant === 'passo1' && 'Sem links e sem texto longo. Evita bloqueio do WhatsApp e passa pela secretária solicitando o contato do titular.'}
                {proposalVariant === 'passo2' && 'Reconhece a boa avaliação no Google, alerta clientes escapando na cidade e pede permissão para enviar a prévia.'}
                {proposalVariant === 'passo3' && 'Envia a página oficial com o nome deles, respeitando as normas da OAB e com taxa de R$ 300 mais anuidade do domínio.'}
                {(proposalVariant === 'recuperacao1' || proposalVariant === 'recuperacao') && 'Pergunta com total naturalidade se este é o contato certo para tratar do assunto ou se indicam outro. Zero pressão de venda, desarma defesas.'}
                {proposalVariant === 'recuperacao2' && 'Usada assim que a pessoa responde "é comigo", "sou eu" ou "pode falar". Entrega o protótipo e alerta a concorrência local.'}
                {proposalVariant === 'recuperacao_indicado' && 'Mensagem pronta para abordar com respeito o novo contato ou sócio indicado pela equipe.'}
                {proposalVariant === 'recuperacao_recusa' && 'Agradece cordialmente e deixa as portas abertas para o futuro, mantendo a reputação profissional impecável.'}
                {proposalVariant === 'direto' && 'Recomendado apenas quando o contato já demonstrar abertura prévia.'}
              </p>
            </div>

            {/* Cenários de Resposta para a Recuperação */}
            {(['recuperacao', 'recuperacao1', 'recuperacao2', 'recuperacao_indicado', 'recuperacao_recusa'].includes(proposalVariant)) && (
              <div className="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-1.5">
                <span className="text-[11px] font-semibold text-purple-700 dark:text-purple-300 block">
                  Como o cliente respondeu ao Resgate?
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setProposalVariant('recuperacao2')}
                    className={`text-[10px] py-1.5 px-2 rounded-lg border font-medium transition-all text-center ${
                      proposalVariant === 'recuperacao2'
                        ? 'bg-purple-600 text-white border-purple-600 font-bold'
                        : 'bg-background hover:bg-muted text-foreground'
                    }`}
                  >
                    1. "Sou eu / É aqui"
                  </button>
                  <button
                    type="button"
                    onClick={() => setProposalVariant('recuperacao_indicado')}
                    className={`text-[10px] py-1.5 px-2 rounded-lg border font-medium transition-all text-center ${
                      proposalVariant === 'recuperacao_indicado'
                        ? 'bg-purple-600 text-white border-purple-600 font-bold'
                        : 'bg-background hover:bg-muted text-foreground'
                    }`}
                  >
                    2. Passou outro contato
                  </button>
                  <button
                    type="button"
                    onClick={() => setProposalVariant('recuperacao_recusa')}
                    className={`text-[10px] py-1.5 px-2 rounded-lg border font-medium transition-all text-center ${
                      proposalVariant === 'recuperacao_recusa'
                        ? 'bg-purple-600 text-white border-purple-600 font-bold'
                        : 'bg-background hover:bg-muted text-foreground'
                    }`}
                  >
                    3. "Sem interesse"
                  </button>
                </div>
              </div>
            )}

            {/* Caixa de Texto da Mensagem */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">Texto Formatado para Envio:</span>
                <span className="text-[10px] text-muted-foreground font-mono">Clique para selecionar tudo</span>
              </div>
              <textarea
                readOnly
                rows={7}
                value={googleMapsProspectService.generateProposalMessage(
                  selectedLawyerForProposal,
                  proposalVariant
                )}
                className="w-full p-3.5 rounded-xl border bg-muted/40 text-xs text-foreground font-mono leading-relaxed outline-none resize-none select-all"
              />
            </div>

            {/* Destaque das Condições de Preço */}
            {(proposalVariant === 'passo3' || proposalVariant === 'recuperacao2') && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-muted-foreground">Proposta transparente:</span>
                  <strong className="text-foreground font-bold">R$ 300 (implementação única)</strong>
                </div>
                <div className="text-muted-foreground text-[11px]">
                  + Domínio (~R$ 60/ano)
                </div>
              </div>
            )}

            {/* Ações do Modal */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t">
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
                <span>Copiar Este Passo</span>
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
                <span>Enviar no WhatsApp</span>
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
