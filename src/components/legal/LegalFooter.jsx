import React from 'react';
import { Scale, MapPin, Phone, Mail, Clock, Instagram, MessageCircle, ShieldCheck } from 'lucide-react';

/**
 * Rodapé Corporativo de Alto Padrão no Estilo Exato da Summit Financial (Imagem de Referência)
 */
export default function LegalFooter({ lawyer, nicheInfo }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#05101E] text-slate-300 text-xs font-sans border-t border-slate-800 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Colunas Institucionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Coluna 1: Identidade e Resumo (4 colunas) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-[#C6923C] flex items-center justify-center shadow-sm">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-sans text-base font-bold text-white block">
                  {lawyer.name}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#C6923C] uppercase font-semibold">
                  {lawyer.oab || 'Advocacia & Consultoria'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-normal">
              Prestamos assessoria jurídica independente e estratégica com o propósito de blindar direitos e assegurar soluções céleres e transparentes para cada assistido.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {lawyer.instagram && (
                <a
                  href={lawyer.instagram.startsWith('http') ? lawyer.instagram : `https://instagram.com/${lawyer.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#C6923C] hover:text-black flex items-center justify-center transition-colors text-slate-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              )}
              <a
                href={`https://wa.me/${lawyer.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#C6923C] hover:text-black flex items-center justify-center transition-colors text-slate-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Coluna 2: Links Rápidos (2 colunas) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-tight">
              Navegação
            </h4>
            <ul className="space-y-2 text-slate-400 font-normal">
              <li>
                <a href="#inicio" className="hover:text-[#C6923C] transition-colors">Início</a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-[#C6923C] transition-colors">Sobre Nós</a>
              </li>
              <li>
                <a href="#atuacao" className="hover:text-[#C6923C] transition-colors">Especialidades</a>
              </li>
              <li>
                <a href="#metodologia" className="hover:text-[#C6923C] transition-colors">Como Funciona</a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-[#C6923C] transition-colors">Depoimentos</a>
              </li>
              <li>
                <a href="#contato" className="hover:text-[#C6923C] transition-colors">Contato</a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Áreas de Atuação (3 colunas) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-tight">
              Áreas de Atuação
            </h4>
            <ul className="space-y-2 text-slate-400 font-normal">
              {nicheInfo?.practiceAreas && nicheInfo.practiceAreas.length > 0 ? (
                nicheInfo.practiceAreas.slice(0, 5).map((area, idx) => (
                  <li key={idx}>
                    <a href="#atuacao" className="hover:text-[#C6923C] transition-colors line-clamp-1">
                      {area.title}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li><a href="#atuacao" className="hover:text-[#C6923C] transition-colors">Direito Trabalhista</a></li>
                  <li><a href="#atuacao" className="hover:text-[#C6923C] transition-colors">Distrato de Lotes & Imobiliário</a></li>
                  <li><a href="#atuacao" className="hover:text-[#C6923C] transition-colors">Família & Inventários</a></li>
                  <li><a href="#atuacao" className="hover:text-[#C6923C] transition-colors">Defesa do Consumidor</a></li>
                  <li><a href="#atuacao" className="hover:text-[#C6923C] transition-colors">Direito Empresarial & Contratos</a></li>
                </>
              )}
            </ul>
          </div>

          {/* Coluna 4: Contato e Horários (3 colunas) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-tight">
              Canais & Endereço
            </h4>
            <ul className="space-y-2.5 text-slate-400 font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C6923C] flex-shrink-0 mt-0.5" />
                <a
                  href={lawyer.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lawyer.address || `${lawyer.city || ''} ${lawyer.state || ''}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  title="Abrir no Google Maps"
                >
                  {lawyer.address || 'Av. Principal, 1000 - Centro Empresarial, Cidade - UF'}
                </a>
              </li>
              {(lawyer.phone || lawyer.whatsapp) && (
                <li className="flex items-center gap-2.5 font-mono">
                  <Phone className="w-4 h-4 text-[#C6923C] flex-shrink-0" />
                  <a
                    href={lawyer.whatsapp ? `https://wa.me/${lawyer.whatsapp}` : `tel:${lawyer.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {lawyer.phone || (String(lawyer.whatsapp).length >= 10 ? `(${String(lawyer.whatsapp).replace(/\D/g, '').slice(2, 4)}) ${String(lawyer.whatsapp).replace(/\D/g, '').slice(4, 9)}-${String(lawyer.whatsapp).replace(/\D/g, '').slice(9)}` : lawyer.whatsapp)}
                  </a>
                </li>
              )}
              {lawyer.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#C6923C] flex-shrink-0" />
                  <a href={`mailto:${lawyer.email}`} className="hover:text-white transition-colors truncate">
                    {lawyer.email}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C6923C] flex-shrink-0" />
                <span>Seg a Sex: 08h às 18h</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer Oficial OAB e Direitos */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {currentYear} {lawyer.name}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span>Provimento CFOAB nº 205/2021</span>
            <span>•</span>
            <a href="#inicio" className="hover:text-slate-400 transition-colors">Voltar ao Topo</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
