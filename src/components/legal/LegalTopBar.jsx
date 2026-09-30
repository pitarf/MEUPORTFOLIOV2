import React from 'react';
import { MapPin, Clock, Phone, Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';

/**
 * TopBar Utilitária Executiva no Estilo Summit Financial (Topo da Referência)
 */
// Função auxiliar para formatar números com máscara amigável (DDD)
const formatPhoneDisplay = (raw) => {
  if (!raw) return '';
  const digits = String(raw).replace(/\D/g, '');
  const clean = (digits.startsWith('55') && digits.length >= 12) ? digits.slice(2) : digits;
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }
  if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  }
  return raw;
};

export default function LegalTopBar({ lawyer, theme }) {
  const displayPhone = formatPhoneDisplay(lawyer.phone || lawyer.whatsapp);

  return (
    <div className={`${theme?.topBarBgClass || 'bg-[#071326] border-b border-white/10'} text-gray-300 text-xs py-2.5 hidden md:block transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Esquerda: Endereço & Horário de Atendimento */}
        <div className="flex items-center gap-6">
          <a
            href={lawyer.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lawyer.address || `${lawyer.city || ''} ${lawyer.state || ''}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-[#C6923C] transition-colors"
            title="Abrir localização no Google Maps"
          >
            <MapPin className="w-3.5 h-3.5 text-[#C6923C] flex-shrink-0" />
            <span>{lawyer.address || 'Av. Principal, 1000 - Centro Empresarial, Cidade - UF'}</span>
          </a>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#C6923C] flex-shrink-0" />
            <span>Atendimento Seg a Sex: 08h às 18h</span>
          </div>
        </div>

        {/* Direita: Telefone & Redes Sociais */}
        <div className="flex items-center gap-5">
          {displayPhone && (
            <a
              href={lawyer.whatsapp ? `https://wa.me/${lawyer.whatsapp}` : `tel:${lawyer.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-[#C6923C]" />
              <span>{displayPhone}</span>
            </a>
          )}

          <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
            {lawyer.instagram && (
              <a
                href={lawyer.instagram.startsWith('http') ? lawyer.instagram : `https://instagram.com/${lawyer.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded-full bg-white/5 hover:bg-[#C6923C] hover:text-black flex items-center justify-center transition-colors text-gray-300"
                aria-label="Instagram"
              >
                <Instagram className="w-3 h-3" />
              </a>
            )}
            <a
              href={`https://wa.me/${lawyer.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-full bg-white/5 hover:bg-[#C6923C] hover:text-black flex items-center justify-center transition-colors text-gray-300"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
