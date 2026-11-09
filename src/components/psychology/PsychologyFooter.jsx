import React from 'react';
import { Heart, Shield, PhoneCall, AlertCircle, ArrowUp } from 'lucide-react';

/**
 * Rodapé Institucional com Informações Éticas do CFP e Suporte Imediato CVV 188
 * Atende com rigor técnico aos deveres informativos e éticos da profissão.
 * 
 * @param {object} props
 * @param {object} props.data - Dados dinâmicos da psicóloga
 */
export default function PsychologyFooter({ data }) {
  const { name, title, crp, address, addressComplement, city, state, neighborhood, phoneFormatted, email, emergencySupport } = data;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1E293B] text-slate-300 pt-16 pb-12 border-t border-slate-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner de Emergência e Apoio Imediato (CVV 188) */}
        <div className="mb-14 p-5 sm:p-6 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                {emergencySupport?.title || 'Precisa de ajuda imediata ou está passando por uma crise emocional?'}
              </h4>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                {emergencySupport?.description || 'O Centro de Valorização da Vida (CVV) oferece apoio emocional voluntário e gratuito, 24 horas por dia.'}
              </p>
            </div>
          </div>

          <a
            href="tel:188"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs sm:text-sm font-semibold transition-colors shrink-0"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Ligue 188 (CVV Gratuito)</span>
          </a>
        </div>

        {/* Grid Principal do Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-700/60 text-left">
          
          {/* Coluna 1: Nome e Apresentação (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-white">{name}</h3>
                <span className="text-xs text-emerald-400 font-medium">{crp}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed max-w-sm">
              {title}. Consultório dedicado ao acolhimento empático, autoconhecimento e desenvolvimento de recursos psicológicos sólidos através de abordagens baseadas em evidências.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p>WhatsApp: <span className="text-slate-300 font-medium">{phoneFormatted}</span></p>
              {email && <p>E-mail: <span className="text-slate-300 font-medium">{email}</span></p>}
            </div>
          </div>

          {/* Coluna 2: Navegação Rápida (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400 font-light">
              <li><a href="#inicio" className="hover:text-emerald-400 transition-colors">Início</a></li>
              <li><a href="#especialidades" className="hover:text-emerald-400 transition-colors">Áreas de Atuação</a></li>
              <li><a href="#como-funciona" className="hover:text-emerald-400 transition-colors">Como Funciona</a></li>
              <li><a href="#sobre" className="hover:text-emerald-400 transition-colors">Sobre a Psicóloga</a></li>
              <li><a href="#espaco" className="hover:text-emerald-400 transition-colors">Consultório & Teleconsulta</a></li>
              <li><a href="#depoimentos" className="hover:text-emerald-400 transition-colors">Depoimentos</a></li>
              <li><a href="#faq" className="hover:text-emerald-400 transition-colors">Perguntas Frequentes</a></li>
            </ul>
          </div>

          {/* Coluna 3: Endereço & Horários (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Atendimento e Consultório
            </h4>
            
            <div className="text-xs sm:text-sm text-slate-400 font-light space-y-1">
              <p className="text-slate-300 font-medium">{address}</p>
              {addressComplement && <p className="text-xs text-slate-400">{addressComplement}</p>}
              <p>{neighborhood ? `${neighborhood}, ${city}` : city} - {state}</p>
            </div>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <span className="block font-medium text-slate-300">Modalidades:</span>
              <p>• Presencial no consultório</p>
              <p>• Online (Brasil e Exterior - Plataforma Criptografada)</p>
            </div>

            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Voltar ao topo</span>
              </button>
            </div>
          </div>

        </div>

        {/* Rodapé Ético e Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-light text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Exercício profissional em conformidade com as resoluções do Conselho Federal de Psicologia (CFP).
            </span>
          </div>

          <p>
            © {new Date().getFullYear()} {name} ({crp}). Todos os direitos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}
