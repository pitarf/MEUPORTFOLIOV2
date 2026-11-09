import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { buildWhatsAppBookingUrl } from '../../utils/psychologyProspectUtils';

/**
 * Seção de Perguntas Frequentes (FAQ)
 * Esclarece dúvidas cruciais com delicadeza e transparência para destravar a decisão do paciente.
 * 
 * @param {object} props
 * @param {object} props.data - Dados dinâmicos da psicóloga
 */
export default function PsychologyFaq({ data }) {
  const { faq } = data;
  const [openIndex, setOpenIndex] = useState(0); // Primeiro item aberto por padrão

  const bookingUrl = buildWhatsAppBookingUrl(data.phone, data.name, 'Dúvidas sobre o funcionamento das sessões');

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const defaultFaq = [
    {
      question: 'Como funciona a primeira consulta de psicoterapia?',
      answer: 'A primeira sessão é um momento de acolhimento e reconhecimento mútuo. Você terá liberdade total para trazer os motivos que o levaram a buscar ajuda, suas angústias e expectativas. Não há necessidade de saber exatamente por onde começar: nós conduzimos a conversa de forma suave e confortável para que você se sinta seguro.'
    },
    {
      question: 'O atendimento psicológico online tem a mesma eficácia do presencial?',
      answer: 'Sim, absolutamente. Diversos estudos científicos internacionais demonstram que a psicoterapia online possui eficácia equivalente ao modelo presencial. Utilizamos salas virtuais criptografadas, garantindo qualidade de áudio, vídeo e total privacidade. Tudo o que você precisa é de um ambiente privativo e conexão estável à internet.'
    },
    {
      question: 'O que eu falar na sessão é realmente confidencial?',
      answer: 'Sim. O sigilo profissional é um dever ético e legal inegociável, previsto no artigo 9º do Código de Ética Profissional do Psicólogo. Absolutamente nada do que é compartilhado durante as consultas é divulgado a terceiros, empregadores ou familiares, garantindo um ambiente de total proteção e respeito.'
    },
    {
      question: 'Qual é a duração e a frequência das sessões?',
      answer: 'As sessões duram 50 minutos e ocorrem habitualmente uma vez por semana, com dia e horário fixos pré-agendados. Em fases de manutenção ou desmame terapêutico, a frequência pode ser ajustada quinzenalmente conforme a evolução clínica acordada entre nós.'
    },
    {
      question: 'Você atende por convênio médico ou emite nota para reembolso?',
      answer: 'Os atendimentos são particulares, garantindo tempo estendido, atenção personalizada e dedicação exclusiva a cada caso. No entanto, forneço recibos e notas fiscais detalhadas com meu número de CRP para que você possa solicitar reembolso integral ou parcial junto ao seu plano de saúde, além de dedução no Imposto de Renda.'
    },
    {
      question: 'Como sei que está na hora de procurar um psicólogo?',
      answer: 'Você não precisa esperar chegar ao seu limite ou vivenciar uma crise insuportável para buscar psicoterapia. Se você sente que suas emoções estão difíceis de digerir, se há angústias recorrentes, dúvidas sobre decisões de vida ou simplesmente o desejo de se conhecer melhor, o acompanhamento psicológico é indicado para você.'
    }
  ];

  const faqList = faq && faq.length > 0 ? faq : defaultFaq;

  return (
    <section id="faq" className="py-20 sm:py-28 bg-white border-b border-[#EAE5DC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs sm:text-sm font-medium">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Tire Suas Dúvidas</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-800 tracking-tight">
            Perguntas frequentes sobre a psicoterapia
          </h2>

          <p className="text-base text-slate-600 font-light leading-relaxed max-w-2xl mx-auto">
            É natural ter dúvidas antes de dar o primeiro passo. Reunimos aqui as respostas para os questionamentos mais comuns sobre o processo terapêutico.
          </p>
        </div>

        {/* Lista de Acordeão */}
        <div className="space-y-4 text-left">
          {faqList.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#FAF8F5] border-emerald-200/80 shadow-xs'
                    : 'bg-white border-[#E7E2D8] hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base sm:text-lg font-medium text-slate-800 pr-4">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'bg-emerald-100/70 text-emerald-800 rotate-180' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-0 animate-in fade-in duration-200">
                    <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed border-t border-slate-200/60 pt-4">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Card de Apoio WhatsApp */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#E7E2D8] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="font-serif text-lg font-medium text-slate-800">
              Ficou com alguma dúvida específica?
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 font-light">
              Envie uma mensagem direta e conversaremos sobre sua necessidade sem nenhum compromisso.
            </p>
          </div>

          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-medium shadow-sm transition-all duration-200 shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-emerald-200" />
            <span>Falar com a Psicóloga</span>
          </a>
        </div>

      </div>
    </section>
  );
}
