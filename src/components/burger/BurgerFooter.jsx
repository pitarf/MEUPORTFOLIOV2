import React from 'react';
import { Instagram, MapPin, Phone } from 'lucide-react';

/**
 * BurgerFooter - Rodapé Anti-Slop
 * Elegante, direto e sem excessos.
 */
export default function BurgerFooter({ data }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0908] text-stone-400 text-xs py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-left">
          
          {/* Identificação */}
          <div className="space-y-3">
            <span className="font-black text-white text-base tracking-tight uppercase block font-sans">
              {data.name}
            </span>
            <p className="text-stone-400 text-xs leading-relaxed">
              Hambúrguer artesanal autêntico com blend Angus fresco, pão brioche de fermentação lenta e molhos da casa.
            </p>
            {data.contact.instagram && (
              <a
                href={`https://instagram.com/${data.contact.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>{data.contact.instagram}</span>
              </a>
            )}
          </div>

          {/* Navegação */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#inicio" className="hover:text-amber-400 transition-colors">Início</a></li>
              <li><a href="#cardapio" className="hover:text-amber-400 transition-colors">Cardápio</a></li>
              <li><a href="#combos" className="hover:text-amber-400 transition-colors">Combos Especiais</a></li>
              <li><a href="#diferenciais" className="hover:text-amber-400 transition-colors">Processo de Cozinha</a></li>
              <li><a href="#localizacao" className="hover:text-amber-400 transition-colors">Salão & Delivery</a></li>
            </ul>
          </div>

          {/* Horários */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Horários
            </h4>
            <div className="space-y-1 text-xs">
              <p className="text-stone-300">{data.schedules.openHours}</p>
              <p className="text-amber-400 font-mono">Delivery: {data.schedules.deliveryHours}</p>
              <p className="text-stone-500">{data.schedules.closedDays}</p>
            </div>
          </div>

          {/* Localização */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Localização
            </h4>
            <div className="space-y-1 text-xs text-stone-300">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{data.location.address}, {data.location.neighborhood}</span>
              </p>
              <p className="text-stone-500 pl-5">{data.location.city} - {data.location.state}</p>
              <p className="flex items-center gap-1.5 pt-1 text-stone-400">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>WhatsApp: {data.contact.phone}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Linha de Copyright */}
        <div className="pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px] font-mono">
          <p>© {currentYear} {data.name}. Todos os direitos reservados.</p>
          <p>Feito para pedidos diretos e entrega ágil.</p>
        </div>

      </div>
    </footer>
  );
}
