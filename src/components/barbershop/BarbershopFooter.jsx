import React from 'react';
import { Scissors, MapPin, Phone, Clock, Instagram, Heart } from 'lucide-react';
import { formatBarbershopWhatsappUrl } from '@/utils/barbershopProspectUtils';

/**
 * Rodapé da Barbearia (Dark Luxury Vintage)
 * Exibe contatos, horário resumido, endereço completo, links rápidos e créditos institucionais.
 * 
 * @param {object} props.data - Dados da barbearia
 */
export default function BarbershopFooter({ data }) {
  const whatsappUrl = formatBarbershopWhatsappUrl(data.contact?.whatsapp, data.name);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/90 pt-16 pb-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Coluna 1: Marca e Conceito */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-zinc-950 font-bold">
                <Scissors className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white font-serif uppercase tracking-tight">
                {data.name}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              {data.subheadline || 'Tradição e maestria na navalha. Cuidado impecável com o visual masculino, ambiente climatizado e chopp artesanal cortesia.'}
            </p>
            {data.contact?.instagram && (
              <a
                href={data.contact?.instagramUrl || 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-amber-400 hover:text-amber-300 font-medium"
              >
                <Instagram className="w-4 h-4" />
                <span>{data.contact.instagram}</span>
              </a>
            )}
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#inicio" className="hover:text-amber-400 transition-colors">Início</a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-amber-400 transition-colors">Serviços & Combos</a>
              </li>
              <li>
                <a href="#equipe" className="hover:text-amber-400 transition-colors">Mestres Barbeiros</a>
              </li>
              <li>
                <a href="#espaco" className="hover:text-amber-400 transition-colors">O Nosso Espaço</a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-amber-400 transition-colors">Avaliações de Clientes</a>
              </li>
              <li>
                <a href="#localizacao" className="hover:text-amber-400 transition-colors">Localização & Contato</a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Horários de Atendimento */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Horários
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-zinc-300 mb-2">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">{data.hours?.display || 'Segunda a Sábado'}</p>
                <p className="text-zinc-400 text-[11px] mt-0.5">{data.hours?.badge || 'Horário marcado sem filas'}</p>
              </div>
            </div>
          </div>

          {/* Coluna 4: Endereço & Agendamento */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Atendimento & Contato
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-zinc-300 mb-3">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{data.location?.address}, {data.location?.neighborhood} - {data.location?.city}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-300 mb-4">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{data.contact?.phone || '(21) 98844-3210'}</span>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-amber-500 hover:text-zinc-950 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30 transition-all duration-200"
            >
              <span>Agendar no WhatsApp</span>
            </a>
          </div>

        </div>

        {/* Linha Divisória e Assinatura */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>
            © {currentYear} {data.name}. Todos os direitos reservados.
          </p>
          <p className="flex items-center gap-1">
            <span>Desenvolvido com excelência por</span>
            <a
              href="https://rafaelpitaoficial.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              Rafael Pita Solutions
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}
