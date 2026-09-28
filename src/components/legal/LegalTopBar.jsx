import React from 'react';
import { MapPin, Clock, Phone, Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';

/**
 * TopBar Utilitária Executiva no Estilo Summit Financial (Topo da Referência)
 */
export default function LegalTopBar({ lawyer }) {
  return (
    <div className="bg-[#071326] text-gray-300 text-xs py-2.5 border-b border-white/10 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Esquerda: Endereço & Horário de Atendimento */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#C6923C]" />
            <span>{lawyer.address || 'Av. Principal, 1000 - Centro Empresarial, Cidade - UF'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#C6923C]" />
            <span>Atendimento Seg a Sex: 08h às 18h</span>
          </div>
        </div>

        {/* Direita: Telefone & Redes Sociais */}
        <div className="flex items-center gap-5">
          {lawyer.phone && (
            <a
              href={`tel:${lawyer.whatsapp || lawyer.phone}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-[#C6923C]" />
              <span>{lawyer.phone}</span>
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
