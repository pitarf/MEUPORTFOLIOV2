import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart } from 'lucide-react';

/**
 * Rodape Institucional e Etico para Pagina de Nutricionistas
 * Exibe informacoes legais, CRN, aviso etico de saude e links institucionais.
 * 
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados completos do nutricionista
 */
export default function NutritionFooter({ data }) {
    const { professional, location, contact } = data;
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#1D211E] text-stone-300 py-12 border-t border-stone-800 text-xs">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    {/* Identificação Profissional */}
                    <div className="md:col-span-6 space-y-3">
                        <div className="text-white font-bold text-lg tracking-tight">
                            {professional.name}
                        </div>
                        <p className="text-stone-400 max-w-md leading-relaxed">
                            {professional.title} • {professional.crn}
                        </p>
                        <p className="text-stone-400">
                            {location.city}, {location.state} • Atendimento Presencial e Teleconsulta
                        </p>
                    </div>

                    {/* Contato & Atendimento */}
                    <div className="md:col-span-3 space-y-2">
                        <span className="block font-bold text-white text-xs uppercase tracking-wider">
                            Contato & Agendamentos
                        </span>
                        <p className="text-stone-400">{contact.phone}</p>
                        <p className="text-stone-400">{contact.email}</p>
                        <p className="text-stone-400">{location.hours}</p>
                    </div>

                    {/* Navegação Rápida */}
                    <div className="md:col-span-3 space-y-2">
                        <span className="block font-bold text-white text-xs uppercase tracking-wider">
                            Navegação
                        </span>
                        <ul className="space-y-1">
                            <li><a href="#sobre" className="hover:text-white transition-colors">Sobre o Profissional</a></li>
                            <li><a href="#servicos" className="hover:text-white transition-colors">Serviços e Especialidades</a></li>
                            <li><a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a></li>
                            <li><a href="#faq" className="hover:text-white transition-colors">Dúvidas Frequentes</a></li>
                            <li><a href="#localizacao" className="hover:text-white transition-colors">Localização</a></li>
                        </ul>
                    </div>
                </div>

                {/* Aviso Ético Obrigatório da Área de Saúde */}
                <div className="pt-6 border-t border-stone-800/80 text-[11px] text-stone-400 leading-relaxed space-y-2">
                    <p className="flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#557A61] shrink-0 mt-0.5" />
                        <span>
                            <strong>Aviso Importante:</strong> As informações contidas neste site possuem caráter exclusivamente informativo, educativo e de orientação sobre hábitos saudáveis. Elas não substituem a consulta, o diagnóstico e a prescrição dietética individualizada realizada por profissional nutricionista devidamente habilitado e registrado no Conselho Regional de Nutricionistas (CRN).
                        </span>
                    </p>
                    <p>
                        Em conformidade com as resoluções do Conselho Federal de Nutricionistas (CFN), este site não divulga fotos de antes e depois corporais nem faz promessas garantidas de emagrecimento rápido.
                    </p>
                </div>

                {/* Linha Final de Copyright */}
                <div className="pt-4 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
                    <div>
                        © {currentYear} {professional.displayName}. Todos os direitos reservados.
                    </div>
                    <div className="flex items-center gap-1">
                        <span>Desenvolvido com excelência por</span>
                        <Link to="/" className="text-stone-300 hover:text-white font-semibold underline">
                            Rafael Pita Solutions
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
