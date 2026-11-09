import React from 'react';
import { Sparkles, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

/**
 * Rodapé Institucional da Clínica Odontológica
 * Inclui conformidade com o CFO/CRO, informações de contato, horários e links.
 * 
 * @param {object} props
 * @param {object} props.data - Dados da clínica
 */
export default function DentalFooter({ data }) {
  const { clinicName, professional, contact, location } = data;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bloco Superior do Rodapé */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Coluna 1: Marca & Registro CRO */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold text-white block">
                  {clinicName}
                </span>
                <span className="text-[11px] text-sky-400 font-medium">
                  {professional.cro || 'CRO Verificado'}
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm mb-4">
              {professional.shortBio ||
                'Odontologia de alta precisão, acolhedora e focada em tratamentos sem dor com escaneamento 3D e biossegurança hospitalar.'}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Responsável Técnico: {professional.name} - {professional.cro}</span>
            </div>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#inicio" className="hover:text-sky-400 transition-colors">Início</a>
              </li>
              <li>
                <a href="#tratamentos" className="hover:text-sky-400 transition-colors">Tratamentos Odontológicos</a>
              </li>
              <li>
                <a href="#tecnologia" className="hover:text-sky-400 transition-colors">Tecnologia 3D & Equipamentos</a>
              </li>
              <li>
                <a href="#sorrisos" className="hover:text-sky-400 transition-colors">Galeria de Sorrisos</a>
              </li>
              <li>
                <a href="#clinica" className="hover:text-sky-400 transition-colors">A Clínica & Localização</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-sky-400 transition-colors">Dúvidas Frequentes (FAQ)</a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Atendimento & Horários */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Atendimento & Contato
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{location.address}, {location.neighborhood}, {location.city} - {location.state}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{contact.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{contact.email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{location.hours}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bloco Inferior: Conformidade Ética CFO e Direitos */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[11px] text-slate-500">
          <div>
            <p>
              © {currentYear} {clinicName}. Todos os direitos reservados.
            </p>
            <p className="mt-1 text-slate-600">
              Em estrita conformidade com a Lei nº 5.081/1966 e o Código de Ética Odontológica do CFO.
            </p>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <span>Desenvolvido com padrão médico de excelência</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </div>
        </div>

      </div>
    </footer>
  );
}
