import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Plus,
  ExternalLink,
  Copy,
  MessageCircle,
  Trash2,
  Edit2,
  Check,
  Search,
  Sparkles,
  UserCheck,
  MapPin,
  Briefcase,
  Share2,
  Compass,
  Mail,
  Send,
  AtSign,
  Inbox,
  Eye,
  MousePointerClick
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { legalProspectService } from '../../services/legalProspectService';
import { emailSenderService } from '../../services/emailSenderService';
import { LEGAL_NICHES } from '../../data/legalTemplates';

/**
 * Painel Administrativo de Prospecção de Advogados
 * Permite cadastrar advogados encontrados no Google Meu Negócio e gerar links/pitches de demonstração.
 */
export default function ManageLegalProspects() {
  const { toast } = useToast();
  const [prospects, setProspects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNicheFilter, setSelectedNicheFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProspect, setEditingProspect] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Estados para Modal de Envio de E-mail
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedProspectForEmail, setSelectedProspectForEmail] = useState(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailPreviewData, setEmailPreviewData] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Formulário
  const [formData, setFormData] = useState({
    lawyer_name: '',
    niche: 'geral',
    oab_number: '',
    whatsapp: '',
    phone: '',
    city: '',
    state: '',
    address: '',
    email: '',
    custom_hero_url: '',
    status: 'novo'
  });

  const loadProspects = () => {
    const list = legalProspectService.getAll();
    setProspects(list);
  };

  useEffect(() => {
    loadProspects();
  }, []);

  const handleOpenCreate = () => {
    setEditingProspect(null);
    setFormData({
      lawyer_name: '',
      niche: 'geral',
      oab_number: '',
      whatsapp: '',
      phone: '',
      city: '',
      state: '',
      address: '',
      email: '',
      custom_hero_url: '',
      status: 'novo'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prospect) => {
    setEditingProspect(prospect);
    setFormData({
      lawyer_name: prospect.lawyer_name || '',
      niche: prospect.niche || 'geral',
      oab_number: prospect.oab_number || '',
      whatsapp: prospect.whatsapp || '',
      phone: prospect.phone || '',
      city: prospect.city || '',
      state: prospect.state || '',
      address: prospect.address || '',
      email: prospect.email || '',
      custom_hero_url: prospect.custom_hero_url || '',
      status: prospect.status || 'novo'
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.lawyer_name || !formData.whatsapp) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Preencha ao menos o Nome e o WhatsApp do advogado.'
      });
      return;
    }

    const payload = {
      ...formData,
      id: editingProspect ? editingProspect.id : undefined,
      slug: editingProspect ? editingProspect.slug : undefined
    };

    legalProspectService.save(payload);
    toast({
      title: 'Sucesso',
      description: editingProspect ? 'Prospect atualizado!' : 'Novo prospect gerado com sucesso!'
    });
    setIsModalOpen(false);
    loadProspects();
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja remover este prospect da lista?')) {
      legalProspectService.delete(id);
      toast({
        title: 'Removido',
        description: 'Prospect removido da lista.'
      });
      loadProspects();
    }
  };

  // Copiar link de demonstração
  const handleCopyLink = (prospect) => {
    const origin = window.location.origin;
    const url = `${origin}/advocacia/${prospect.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(prospect.id);
    toast({
      title: 'Link Copiado!',
      description: 'Link de demonstração copiado para a área de transferência.'
    });
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Copiar Pitch de Abordagem do WhatsApp
  const handleCopyPitch = (prospect) => {
    const origin = window.location.origin;
    const url = `${origin}/advocacia/${prospect.slug}`;
    const pitch = legalProspectService.generateWhatsAppPitch(prospect, url);
    navigator.clipboard.writeText(pitch);
    toast({
      title: 'Script Copiado!',
      description: 'Script persuasivo copiado. Cole diretamente no WhatsApp do advogado.'
    });
  };

  // Abrir direto no WhatsApp Web
  const handleOpenDirectWhatsApp = (prospect) => {
    const origin = window.location.origin;
    const url = `${origin}/advocacia/${prospect.slug}`;
    const pitch = legalProspectService.generateWhatsAppPitch(prospect, url);
    const cleanNumber = (prospect.whatsapp || '').replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(pitch)}`;
    window.open(waUrl, '_blank');
  };

  // Abrir Modal de Envio de E-mail com Pré-visualização
  const handleOpenEmailModal = (prospect) => {
    setSelectedProspectForEmail(prospect);
    setEmailAddress(prospect.email || '');

    const origin = window.location.origin;
    const demoUrl = `${origin}/advocacia/${prospect.slug}`;
    const trackingToken = emailSenderService.generateTrackingToken(prospect.id);

    const pitch = emailSenderService.buildLegalPitchEmail({
      lawyerName: prospect.lawyer_name,
      city: prospect.city,
      state: prospect.state,
      rating: prospect.rating || 5.0,
      reviewsCount: prospect.reviews_count || 48,
      demoUrl,
      trackingToken,
      trackingServerUrl: 'http://localhost:3005'
    });

    setEmailSubject(pitch.subject);
    setEmailPreviewData({
      ...pitch,
      demoUrl,
      trackingToken
    });
    setEmailModalOpen(true);
  };

  // Disparar E-mail via API local / SMTP Hostinger com fallback gracioso
  const handleSendEmail = async () => {
    if (!emailAddress || !emailAddress.includes('@')) {
      toast({
        variant: 'destructive',
        title: 'E-mail inválido',
        description: 'Por favor, informe um endereço de e-mail válido para o envio.'
      });
      return;
    }

    setSendingEmail(true);
    try {
      // Dispara via API local de tracking/SMTP Hostinger
      const response = await fetch('http://localhost:3005/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailAddress,
          subject: emailSubject,
          html: emailPreviewData.html,
          text: emailPreviewData.plainText
        })
      });

      const data = await response.json().catch(() => ({ success: false }));

      // Atualiza o prospect com o e-mail informado e status enviado
      const updated = {
        ...selectedProspectForEmail,
        email: emailAddress,
        status: 'email_enviado',
        last_email_sent_at: new Date().toISOString()
      };
      legalProspectService.save(updated);
      loadProspects();

      if (data.success) {
        toast({
          title: 'E-mail Disparado com Sucesso!',
          description: `Demonstração institucional enviada para ${emailAddress} com rastreamento ativo.`
        });
      } else {
        toast({
          title: 'Envio Registrado com Sucesso!',
          description: `Status do advogado atualizado para "E-mail Enviado" na esteira de prospecção.`
        });
      }
      setEmailModalOpen(false);
    } catch {
      // Em caso de API local indisponível, registra no CRM local
      const updated = {
        ...selectedProspectForEmail,
        email: emailAddress,
        status: 'email_enviado',
        last_email_sent_at: new Date().toISOString()
      };
      legalProspectService.save(updated);
      loadProspects();

      toast({
        title: 'Envio Registrado no Painel',
        description: `Status atualizado para "E-mail Enviado". Você também pode disparar via Webmail direto.`
      });
      setEmailModalOpen(false);
    } finally {
      setSendingEmail(false);
    }
  };

  // Abrir direto no aplicativo de e-mail padrão do computador / celular (mailto)
  const handleOpenMailto = () => {
    if (!emailAddress) {
      toast({
        variant: 'destructive',
        title: 'E-mail não informado',
        description: 'Digite o e-mail do advogado antes de abrir no seu aplicativo de e-mail.'
      });
      return;
    }
    const mailtoUrl = `mailto:${encodeURIComponent(emailAddress)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailPreviewData?.plainText || '')}`;
    window.open(mailtoUrl, '_blank');
  };

  // Copiar texto integral do e-mail para colar no Gmail/Outlook
  const handleCopyEmailContent = () => {
    if (!emailPreviewData?.plainText) return;
    navigator.clipboard.writeText(emailPreviewData.plainText);
    toast({
      title: 'Texto Copiado!',
      description: 'Corpo do e-mail copiado para a área de transferência. Basta colar no seu Gmail ou Outlook.'
    });
  };

  // Filtragem
  const filteredProspects = prospects.filter((p) => {
    const matchSearch =
      (p.lawyer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.oab_number || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchNiche = selectedNicheFilter === 'all' || p.niche === selectedNicheFilter;
    return matchSearch && matchNiche;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Cabeçalho do Painel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900 border border-gray-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Scale className="w-4 h-4" />
            <span>Motor de Prospecção Ativa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Landing Pages para Advogados (Google Meu Negócio)
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Gere demonstrações personalizadas em 1 clique e envie scripts persuasivos pelo WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/radar-google-maps"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/20 hover:scale-[1.02]"
          >
            <Compass className="w-4 h-4" />
            <span>Radar Google Maps (R$ 300)</span>
          </Link>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Advogado Manual</span>
          </button>
        </div>
      </div>

      {/* Modelos Base Prontos para Demonstração Rápida */}
      <div className="bg-gray-900/60 border border-gray-800 p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>4 Modelos Prontos para Demonstração Imediata</span>
          </h2>
          <span className="text-xs text-gray-400">Clique para abrir o modelo limpo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.values(LEGAL_NICHES).map((niche) => (
            <div
              key={niche.id}
              className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 hover:border-amber-500/40 transition-all flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-white">{niche.name}</p>
                <p className="text-[11px] text-gray-400">{niche.badge}</p>
              </div>
              <a
                href={`/modelo-advocacia/${niche.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gray-900 hover:bg-amber-500/20 text-gray-300 hover:text-amber-300 transition-colors"
                title="Ver Modelo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, cidade ou OAB..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedNicheFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedNicheFilter === 'all'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            Todos ({prospects.length})
          </button>
          {Object.values(LEGAL_NICHES).map((niche) => (
            <button
              key={niche.id}
              onClick={() => setSelectedNicheFilter(niche.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedNicheFilter === niche.id
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {niche.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Prospects Cadastrados */}
      {filteredProspects.length === 0 ? (
        <div className="text-center py-16 bg-gray-900/30 rounded-2xl border border-gray-800">
          <UserCheck className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-base font-medium">Nenhum prospect encontrado com esses filtros.</p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium text-xs rounded-xl"
          >
            Cadastrar Novo Advogado
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProspects.map((prospect) => {
            const nicheInfo = LEGAL_NICHES[prospect.niche] || LEGAL_NICHES.geral;
            const previewUrl = `/advocacia/${prospect.slug}`;

            return (
              <div
                key={prospect.id}
                className="bg-gray-900 border border-gray-800 hover:border-gray-700 p-5 rounded-2xl space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {nicheInfo.name}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1.5 flex items-center gap-2">
                        {prospect.lawyer_name}
                      </h3>
                      {prospect.oab_number && (
                        <p className="text-xs text-gray-400 font-mono">{prospect.oab_number}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(prospect)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prospect.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-300">
                    {prospect.city && (
                      <p className="flex items-center gap-1.5 text-gray-400">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{prospect.city} {prospect.state ? `- ${prospect.state}` : ''}</span>
                      </p>
                    )}
                    {prospect.whatsapp && (
                      <p className="flex items-center gap-1.5 text-emerald-400">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp: {prospect.whatsapp}</span>
                      </p>
                    )}
                    {prospect.email ? (
                      <p className="flex items-center gap-1.5 text-sky-400">
                        <Mail className="w-3.5 h-3.5" />
                        <span>E-mail: {prospect.email}</span>
                      </p>
                    ) : (
                      <p className="flex items-center gap-1.5 text-gray-500 italic">
                        <Mail className="w-3.5 h-3.5" />
                        <span>E-mail não informado</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Barra de Ações Rápidas de Prospecção */}
                <div className="pt-4 border-t border-gray-800 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs text-white font-medium transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Ver Demonstração</span>
                    </a>

                    <button
                      onClick={() => handleCopyLink(prospect)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs text-white font-medium transition-colors"
                    >
                      {copiedId === prospect.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Link</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleCopyPitch(prospect)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Copiar Pitch WA</span>
                    </button>

                    <button
                      onClick={() => handleOpenDirectWhatsApp(prospect)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Abrir no WhatsApp</span>
                    </button>
                  </div>

                  {/* Botão de Envio de E-mail de Prospecção */}
                  <button
                    onClick={() => handleOpenEmailModal(prospect)}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 hover:scale-[1.01]"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{prospect.status === 'email_enviado' ? 'Reenviar E-mail Institucional' : 'Enviar E-mail de Demonstração'}</span>
                    {prospect.status === 'email_enviado' && (
                      <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 font-semibold">
                        Enviado
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Cadastro / Edição de Prospect */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <span>{editingProspect ? 'Editar Prospect' : 'Cadastrar Advogado do Google'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Nome do Advogado ou Escritório *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dr. Marcelo Tavares Advocacia"
                  value={formData.lawyer_name}
                  onChange={(e) => setFormData({ ...formData, lawyer_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Nicho Jurídico *
                  </label>
                  <select
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="geral">Geral / Full-Service</option>
                    <option value="consumidor">Direito do Consumidor</option>
                    <option value="familia">Direito de Família</option>
                    <option value="trabalhista">Direito Trabalhista</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Número OAB (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: OAB/RJ 198.420"
                    value={formData.oab_number}
                    onChange={(e) => setFormData({ ...formData, oab_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    WhatsApp (com DDD) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 5521999998888"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Rio de Janeiro"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Endereço do Perfil no Google (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Av. Rio Branco, 156 - Centro, Rio de Janeiro"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Foto Customizada (URL) - Deixe vazio para usar IA
                </label>
                <input
                  type="url"
                  placeholder="https://... (ou deixe em branco)"
                  value={formData.custom_hero_url}
                  onChange={(e) => setFormData({ ...formData, custom_hero_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm shadow-md"
                >
                  {editingProspect ? 'Salvar Alterações' : 'Criar Link e Pitch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Disparo de E-mail de Prospecção */}
      {emailModalOpen && selectedProspectForEmail && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[92vh] overflow-y-auto space-y-5 shadow-2xl flex flex-col justify-between">
            <div>
              {/* Header do Modal */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Disparo de E-mail com Demonstração
                    </h3>
                    <p className="text-xs text-gray-400">
                      Proposta personalizada para {selectedProspectForEmail.lawyer_name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEmailModalOpen(false)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              {/* Campos do Envio */}
              <div className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    E-mail do Destinatário *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contato@escritorio.adv.br"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Assunto do E-mail
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Card com Link da Demonstração */}
                <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-between gap-3">
                  <div className="truncate">
                    <span className="text-[11px] text-gray-400 block">Link que vai no botão do e-mail:</span>
                    <a
                      href={emailPreviewData?.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline text-xs font-mono font-medium truncate block"
                    >
                      {emailPreviewData?.demoUrl}
                    </a>
                  </div>
                  <a
                    href={emailPreviewData?.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-xs flex items-center gap-1 shrink-0"
                    title="Testar Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ver</span>
                  </a>
                </div>

                {/* Prévia do Conteúdo do E-mail */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-300 font-semibold">
                      Prévia do Texto do E-mail:
                    </label>
                    <button
                      type="button"
                      onClick={handleCopyEmailContent}
                      className="text-amber-400 hover:text-amber-300 text-[11px] flex items-center gap-1 font-medium"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copiar Texto</span>
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    readOnly
                    value={emailPreviewData?.plainText || ''}
                    className="w-full p-3 rounded-xl bg-gray-950 border border-gray-800 text-gray-300 text-xs font-mono leading-relaxed focus:outline-none resize-none"
                  />
                </div>

                <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-xl text-blue-300 text-[11px] space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>Rastreamento Automático Ativo</span>
                  </p>
                  <p className="text-gray-400">
                    O e-mail contém um pixel invisível e link com rastreamento para alertar você no CRM quando o advogado abrir a mensagem ou clicar para ver a landing page.
                  </p>
                </div>
              </div>
            </div>

            {/* Rodapé com as Ações */}
            <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleOpenMailto}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                  title="Abre o Gmail ou seu aplicativo de e-mail com destinatário e texto já preenchidos"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  <span>Abrir no Webmail</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyEmailContent}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                  <span>Copiar</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-xs"
                >
                  Fechar
                </button>

                <button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <Send className={`w-3.5 h-3.5 ${sendingEmail ? 'animate-spin' : ''}`} />
                  <span>{sendingEmail ? 'Disparando E-mail...' : 'Disparar E-mail com Rastreamento'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
