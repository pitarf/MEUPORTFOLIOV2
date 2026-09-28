import React, { useState, useEffect } from 'react';
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
  Share2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { legalProspectService } from '../../services/legalProspectService';
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

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Advogado Prospectado</span>
        </button>
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

    </div>
  );
}
