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
import {
  buildPsychologyShareUrl,
  PSYCHOLOGY_PITCH_SCRIPTS,
  cleanPsychologistName
} from '../../utils/psychologyProspectUtils';

/**
 * Painel Flutuante de Customização e Prospecção Ativa para Psicologia
 * Permite ao operador do CRM ou prospecção personalizar instantaneamente os dados de qualquer psicólogo.
 * 
 * @param {object} props
 * @param {object} props.currentData - Dados atualmente exibidos na página
 * @param {function} props.onApplyOverrides - Callback para atualizar dados em tempo real
 * @param {function} props.onReset - Callback para resetar dados padrão
 */
export default function PsychologyProspectDrawer({
  currentData,
  onApplyOverrides,
  onReset
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'scripts'
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedScriptId, setCopiedScriptId] = useState(null);

  // Formulário Local
  const [formData, setFormData] = useState({
    name: currentData?.name || '',
    whatsapp: currentData?.phone || '',
    crp: currentData?.crp || '',
    city: currentData?.city || '',
    state: currentData?.state || '',
    neighborhood: currentData?.neighborhood || '',
    address: currentData?.address || '',
    title: currentData?.title || '',
    avatarUrl: currentData?.avatarUrl || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = (e) => {
    if (e) e.preventDefault();
    onApplyOverrides(formData);
  };

  const shareUrl = buildPsychologyShareUrl(formData);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyScript = (script) => {
    const text = script.text(formData.name || 'Doutor(a)', shareUrl);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedScriptId(script.id);
      setTimeout(() => setCopiedScriptId(null), 2500);
    }
  };

  return (
    <>
      {/* Gatilho Flutuante (Lado Esquerdo Inferior) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-950 text-white text-xs font-semibold shadow-lg backdrop-blur-md border border-slate-700/60 transition-all duration-300 hover:scale-105 active:scale-95 group"
        aria-label="Abrir Simulador de Prospecção"
      >
        <Settings2 className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
        <span className="hidden sm:inline">Personalizar Demonstração</span>
        <span className="sm:hidden">Simular</span>
      </button>

      {/* Backdrop e Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay Escuro */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              
              {/* Header do Drawer */}
              <div className="px-6 py-5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-serif text-lg font-medium">Simulador de Demonstração</h3>
                  </div>
                  <p className="text-xs text-slate-300 font-light mt-0.5">
                    Personalize em tempo real para apresentar a qualquer psicólogo.
                  </p>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Abas Alternadoras */}
              <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === 'editor'
                      ? 'border-emerald-700 text-emerald-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Dados do Profissional
                </button>
                <button
                  onClick={() => setActiveTab('scripts')}
                  className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === 'scripts'
                      ? 'border-emerald-700 text-emerald-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Scripts de Abordagem
                </button>
              </div>

              {/* Conteúdo do Drawer */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
                {activeTab === 'editor' ? (
                  <form onSubmit={handleApply} className="space-y-4">
                    
                    {/* Nome */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nome do Psicólogo(a):
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ex: Dra. Juliana Mendes"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                      />
                    </div>

                    {/* CRP */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Registro CRP:
                        </label>
                        <input
                          type="text"
                          name="crp"
                          value={formData.crp}
                          onChange={handleChange}
                          placeholder="Ex: CRP 05/67890"
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                        />
                      </div>

                      {/* WhatsApp */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          WhatsApp / Telefone:
                        </label>
                        <input
                          type="text"
                          name="whatsapp"
                          value={formData.whatsapp}
                          onChange={handleChange}
                          placeholder="Ex: 21987654321"
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    {/* Título / Abordagem */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Título ou Abordagem Clínica:
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex: Psicóloga Clínica e Terapeuta TCC"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                      />
                    </div>

                    {/* Cidade e Bairro */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Cidade:
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Ex: Rio de Janeiro"
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Bairro:
                        </label>
                        <input
                          type="text"
                          name="neighborhood"
                          value={formData.neighborhood}
                          onChange={handleChange}
                          placeholder="Ex: Ipanema"
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    {/* Endereço */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Endereço do Consultório:
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Ex: Rua Visconde de Pirajá, 550, Sala 804"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                      />
                    </div>

                    {/* URL da Foto */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        URL da Foto do Profissional:
                      </label>
                      <input
                        type="text"
                        name="avatarUrl"
                        value={formData.avatarUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
                      />
                    </div>

                    {/* Ações */}
                    <div className="pt-3 space-y-2">
                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Aplicar Alterações na Tela</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Link Copiado com Sucesso!' : 'Copiar Link Personalizado'}</span>
                      </button>

                      {onReset && (
                        <button
                          type="button"
                          onClick={() => {
                            onReset();
                            setIsOpen(false);
                          }}
                          className="w-full py-2 px-3 text-slate-400 hover:text-slate-600 text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restaurar Perfil Padrão</span>
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-600 font-light">
                      Copie o roteiro pronto para enviar via WhatsApp ao psicólogo prospectado. O link personalizado com os dados dele já está incluso.
                    </p>

                    {PSYCHOLOGY_PITCH_SCRIPTS.map((script) => (
                      <div
                        key={script.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-800">
                            {script.title}
                          </span>
                          <button
                            onClick={() => handleCopyScript(script)}
                            className="p-1.5 rounded-lg bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 text-xs flex items-center gap-1 shadow-2xs"
                          >
                            {copiedScriptId === script.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedScriptId === script.id ? 'Copiado!' : 'Copiar'}</span>
                          </button>
                        </div>

                        <p className="text-xs text-slate-600 whitespace-pre-line font-mono bg-white p-3 rounded-xl border border-slate-200/80">
                          {script.text(formData.name || 'Doutor(a)', shareUrl)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Rodapé do Drawer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
                <span className="text-[11px] text-slate-400">
                  MeuPortfolio v2 • Motor de Prospecção Especializada
                </span>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
