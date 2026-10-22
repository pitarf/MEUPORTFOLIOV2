import React, { useState } from 'react';
import {
  Settings2,
  X,
  Copy,
  Check,
  Send,
  Sparkles,
  MapPin,
  Phone,
  User,
  Shield,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import {
  buildNutritionistShareUrl,
  NUTRITION_PITCH_SCRIPTS,
  cleanNutritionistName
} from '../../utils/nutritionProspectUtils';

/**
 * Componente: NutritionProspectDrawer
 * Painel flutuante de customizacao rapida em tempo real para prospeccao ativa de nutricionistas.
 * Permite alterar nome, telefone, CRN, endereco e gerar links no ato da negociacao.
 */
export default function NutritionProspectDrawer({
  currentData,
  onApplyOverrides,
  onReset
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'scripts'
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedScriptId, setCopiedScriptId] = useState(null);

  // Formulario local
  const [formData, setFormData] = useState({
    name: currentData?.professional?.name || '',
    whatsapp: currentData?.contact?.whatsapp || '',
    crn: currentData?.professional?.crn || '',
    city: currentData?.location?.city || '',
    state: currentData?.location?.state || '',
    neighborhood: currentData?.location?.neighborhood || '',
    address: currentData?.location?.address || '',
    nicheTitle: currentData?.professional?.title || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Aplica as alteracoes na tela imediatamente
  const handleApply = (e) => {
    if (e) e.preventDefault();
    onApplyOverrides(formData);
  };

  // Gera o link de compartilhamento com a query string
  const shareUrl = buildNutritionistShareUrl(
    formData,
    typeof window !== 'undefined' ? window.location.origin : 'https://rafaelpitaoficial.com.br'
  );

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleOpenWhatsApp = (scriptText) => {
    const cleanPhone = (formData.whatsapp || '').replace(/\D/g, '');
    if (!cleanPhone) {
      alert('Preencha o numero de WhatsApp do profissional primeiro.');
      return;
    }
    const targetUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(scriptText)}`;
    window.open(targetUrl, '_blank');
  };

  const handleCopyScript = (scriptId, text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedScriptId(scriptId);
      setTimeout(() => setCopiedScriptId(null), 2000);
    }
  };

  return (
    <>
      {/* Botao Flutuante no Canto Inferior Esquerdo */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#244B3B] hover:bg-[#1b382c] text-white font-bold text-xs shadow-2xl shadow-[#244B3B]/40 border border-white/20 transition-all hover:scale-105 group"
          title="Abrir painel de prospecção e customização em tempo real"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-400 text-[#0f2e21] flex items-center justify-center font-bold text-[10px] group-hover:rotate-45 transition-transform">
            ✏️
          </div>
          <span>Personalizar Lead</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] bg-white/20 uppercase tracking-wider font-mono">
            Prospecção
          </span>
        </button>
      </div>

      {/* Modal / Gaveta Lateral */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 text-[#252925] flex flex-col">
            {/* Cabecalho */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-[#F8F7F2] rounded-t-3xl sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#244B3B] text-white flex items-center justify-center font-bold">
                  <Settings2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#244B3B] leading-tight">
                    Simulador & Personalizador de Prospecção
                  </h3>
                  <p className="text-xs text-[#557A61]">
                    Altere os dados na hora para criar a proposta do nutricionista
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-200/70 flex items-center justify-center text-stone-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Abas */}
            <div className="flex border-b border-stone-200 px-6 pt-3 bg-stone-50 gap-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab('editor')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'editor'
                    ? 'border-[#244B3B] text-[#244B3B]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                1. Editar Dados do Candidato
              </button>
              <button
                onClick={() => setActiveTab('scripts')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'scripts'
                    ? 'border-[#244B3B] text-[#244B3B]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                2. Scripts de Abordagem WhatsApp ({NUTRITION_PITCH_SCRIPTS.length})
              </button>
            </div>

            {/* Conteudo */}
            <div className="p-6 space-y-6 flex-1">
              {activeTab === 'editor' ? (
                <form onSubmit={handleApply} className="space-y-4">
                  {/* Nome e Especialidade */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#557A61]" />
                        <span>Nome do(a) Profissional</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ex: Dra. Juliana Peixoto"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-[#244B3B] focus:ring-1 focus:ring-[#244B3B] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#557A61]" />
                        <span>Título ou Especialidade</span>
                      </label>
                      <input
                        type="text"
                        name="nicheTitle"
                        value={formData.nicheTitle}
                        onChange={handleChange}
                        placeholder="Ex: Nutricionista Clínica e Esportiva"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-[#244B3B] focus:ring-1 focus:ring-[#244B3B] outline-none"
                      />
                    </div>
                  </div>

                  {/* WhatsApp e CRN */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#557A61]" />
                        <span>WhatsApp (com DDD)</span>
                      </label>
                      <input
                        type="text"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="Ex: 21992929983"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-[#244B3B] focus:ring-1 focus:ring-[#244B3B] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-[#557A61]" />
                        <span>Registro CRN</span>
                      </label>
                      <input
                        type="text"
                        name="crn"
                        value={formData.crn}
                        onChange={handleChange}
                        placeholder="Ex: CRN-4 12345"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-[#244B3B] focus:ring-1 focus:ring-[#244B3B] outline-none"
                      />
                    </div>
                  </div>

                  {/* Cidade, UF e Bairro */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#557A61]" />
                        <span>Cidade</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Ex: Niterói"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-[#244B3B] focus:ring-1 focus:ring-[#244B3B] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        UF
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Ex: RJ"
                        maxLength={2}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm uppercase focus:border-[#244B3B] focus:ring-1 focus:ring-[#244B3B] outline-none"
                      />
                    </div>
                  </div>

                  {/* Bairro e Endereco */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Bairro
                      </label>
                      <input
                        type="text"
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleChange}
                        placeholder="Ex: Icaraí"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-[#244B3B] focus:ring-1 focus:ring-[#244B3B] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Endereço Completo (Consultório)
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Ex: Rua Cel. Moreira César, 229"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-[#244B3B] focus:ring-1 focus:ring-[#244B3B] outline-none"
                      />
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#244B3B] hover:bg-[#1b382c] text-white font-bold text-sm shadow-md transition-all"
                    >
                      <span>Aplicar na Tela Agora</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-2 py-3 px-4 rounded-xl border border-[#244B3B]/30 hover:bg-[#244B3B]/5 text-[#244B3B] font-bold text-xs transition-all"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Link Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiar Link Parametrizado</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onReset();
                        setFormData({
                          name: '',
                          whatsapp: '',
                          crn: '',
                          city: '',
                          state: '',
                          neighborhood: '',
                          address: '',
                          nicheTitle: ''
                        });
                      }}
                      className="p-3 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
                      title="Restaurar padrão demonstrativo"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Link Preview */}
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-600 block mb-1">
                      Link Dinâmico de Prospecção:
                    </span>
                    <p className="text-[11px] font-mono text-stone-700 truncate select-all">
                      {shareUrl}
                    </p>
                  </div>
                </form>
              ) : (
                /* Aba de Scripts de Abordagem */
                <div className="space-y-4">
                  {NUTRITION_PITCH_SCRIPTS.map((script) => {
                    const scriptText = script.getText(formData, shareUrl);
                    const isCopied = copiedScriptId === script.id;

                    return (
                      <div
                        key={script.id}
                        className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-[#244B3B]">
                              {script.title}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${script.badgeColor}`}
                            >
                              {script.badge}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyScript(script.id, scriptText)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-[#244B3B] text-stone-700 text-xs font-semibold transition-all"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copiar</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleOpenWhatsApp(scriptText)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1faa53] text-[#0a2318] text-xs font-bold transition-all shadow-sm"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5" />
                              <span>Disparar</span>
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-stone-500 italic">
                          Objetivo: {script.objective}
                        </p>

                        <div className="p-3 rounded-xl bg-white border border-stone-200/80 text-xs text-stone-800 whitespace-pre-wrap font-sans leading-relaxed">
                          {scriptText}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
