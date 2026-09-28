import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lock, MessageCircle, Send, ShieldCheck, Check, Sparkles } from 'lucide-react';

/**
 * Formulário em Estilo Protocolo Digital Seguro em Glassmorphism de Alto Padrão
 */
export default function LegalLeadForm({ lawyer, nicheInfo }) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    cidade: '',
    assunto: '',
    relato: ''
  });
  const [loading, setLoading] = useState(false);

  // Código aleatório de protocolo institucional para dar ar de segurança e processo formal
  const protocolNumber = useMemo(() => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `PROT-${new Date().getFullYear()}-${randomDigits}`;
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.telefone) return;

    setLoading(true);

    const message = `*Protocolo de Atendimento Jurídico (${protocolNumber})*\n\n` +
      `👤 *Nome:* ${formData.nome}\n` +
      `📱 *Telefone/WhatsApp:* ${formData.telefone}\n` +
      (formData.cidade ? `📍 *Localização:* ${formData.cidade}\n` : '') +
      (formData.assunto ? `⚖️ *Assunto:* ${formData.assunto}\n` : '') +
      `📝 *Relato:* ${formData.relato || 'Solicito consulta jurídica inicial.'}\n\n` +
      `_Protocolado através do canal oficial de ${lawyer.name}_`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${lawyer.whatsapp}?text=${encoded}`;

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setLoading(false);
    }, 400);
  };

  return (
    <section id="contato" className="py-24 sm:py-32 bg-[#050B14] text-white border-t border-white/5 relative overflow-hidden">
      
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl backdrop-blur-3xl bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-[#070D1A]/95 border border-white/15 p-8 sm:p-14 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_50px_rgba(245,158,11,0.08)] relative overflow-hidden"
        >
          {/* Header do Protocolo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 mb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono uppercase tracking-wider mb-2">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Canal Criptografado & Sigiloso</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                Abertura de Protocolo de Atendimento
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-light mt-1">
                Seus dados serão recebidos diretamente pelo Dr(a). {lawyer.name} sob sigilo profissional.
              </p>
            </div>

            <div className="text-left sm:text-right font-mono bg-white/[0.03] p-3.5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block">
                Nº de Referência
              </span>
              <span className="text-sm sm:text-base text-amber-300 font-bold tracking-wider">
                {protocolNumber}
              </span>
            </div>
          </div>

          {/* Formulário com Inputs em Frosted Glass */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono text-amber-200/80 uppercase tracking-wider mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Seu nome completo"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl backdrop-blur-xl bg-white/[0.04] focus:bg-white/[0.08] border border-white/10 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 text-white placeholder-gray-500 text-sm transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-amber-200/80 uppercase tracking-wider mb-2">
                  WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(00) 90000-0000"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl backdrop-blur-xl bg-white/[0.04] focus:bg-white/[0.08] border border-white/10 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 text-white placeholder-gray-500 text-sm transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono text-amber-200/80 uppercase tracking-wider mb-2">
                  Cidade / Estado
                </label>
                <input
                  type="text"
                  placeholder="Ex: Aracaju - SE"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl backdrop-blur-xl bg-white/[0.04] focus:bg-white/[0.08] border border-white/10 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 text-white placeholder-gray-500 text-sm transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-amber-200/80 uppercase tracking-wider mb-2">
                  Tema / Assunto Principal
                </label>
                <input
                  type="text"
                  placeholder="Ex: Negativação indevida, Rescisão..."
                  value={formData.assunto}
                  onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl backdrop-blur-xl bg-white/[0.04] focus:bg-white/[0.08] border border-white/10 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 text-white placeholder-gray-500 text-sm transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-amber-200/80 uppercase tracking-wider mb-2">
                Breve Resumo dos Fatos (Opcional)
              </label>
              <textarea
                rows={3}
                placeholder="Descreva resumidamente os fatos para que o advogado compreenda sua demanda..."
                value={formData.relato}
                onChange={(e) => setFormData({ ...formData, relato: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl backdrop-blur-xl bg-white/[0.04] focus:bg-white/[0.08] border border-white/10 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 text-white placeholder-gray-500 text-sm transition-all outline-none resize-none"
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black font-extrabold text-sm sm:text-base tracking-wide shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 flex items-center justify-center gap-3 group transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5 text-black" />
              <span>{loading ? 'Formatando Protocolo...' : 'Transmitir Protocolo para o WhatsApp'}</span>
              <Send className="w-4 h-4 text-black group-hover:translate-x-1.5 transition-transform" />
            </motion.button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Garantia de sigilo profissional conforme a LGPD e o Provimento nº 205/2021 CFOAB.</span>
            </div>
          </form>

        </motion.div>
      </div>
    </section>
  );
}
