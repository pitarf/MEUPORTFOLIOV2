import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Send,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Scale,
  Lock
} from 'lucide-react';

/**
 * Diagnóstico Jurídico Interativo de 60 Segundos em Puro Glassmorphism e Fluidez
 */
export default function LegalDiagnosisCalculator({ lawyer, nicheInfo, theme }) {
  const [currentStep, setCurrentStep] = useState(1);
  const honorific = theme?.honorific || 'Dr(a).';
  const articlePreposition = theme?.gender === 'female' ? 'à Dra.' : 'ao Dr.';
  const [answers, setAnswers] = useState({
    objetivo: '',
    tempo: '',
    documentos: ''
  });
  const [isCalculated, setIsCalculated] = useState(false);

  // Perguntas contextuais por nicho
  const getQuestions = () => {
    switch (nicheInfo.id) {
      case 'consumidor':
        return {
          step1: {
            title: 'Qual foi a principal infração cometida contra você?',
            options: [
              'Nome negativado indevidamente no SPC/Serasa',
              'Golpe do Pix ou fraude bancária em conta corrente',
              'Voo cancelado, atrasado ou extravio de bagagem',
              'Recusa de cobertura de plano de saúde ou remédios'
            ]
          },
          step2: {
            title: 'Há quanto tempo ocorreu o fato?',
            options: [
              'Ocorreu recentemente (últimos 30 dias)',
              'Ocorreu há menos de 1 ano',
              'Ocorreu há mais de 1 ano (ainda sem solução)',
              'Descobri agora e estou buscando orientação'
            ]
          },
          step3: {
            title: 'Você possui comprovantes ou números de protocolo?',
            options: [
              'Sim, tenho prints, extratos e protocolos gravados',
              'Tenho parte das conversas e e-mails',
              'Não tenho comprovantes em mãos no momento'
            ]
          }
        };

      case 'familia':
        return {
          step1: {
            title: 'Qual demanda familiar necessita de orientação jurídica?',
            options: [
              'Divórcio consensual (amigável) ou litigioso',
              'Guarda de filhos e regime de convivência familiar',
              'Fixação, revisão ou cobrança de pensão alimentícia',
              'Abertura de inventário em cartório ou partilha de bens'
            ]
          },
          step2: {
            title: 'Existe consenso preliminar entre os envolvidos?',
            options: [
              'Sim, estamos em comum acordo sobre os termos',
              'Parcialmente, há divergências sobre bens ou valores',
              'Não há consenso, o diálogo amigável é inviável'
            ]
          },
          step3: {
            title: 'Há filhos menores de idade envolvidos na partilha?',
            options: [
              'Sim, existem filhos menores de 18 anos',
              'Não há filhos menores (apenas maiores ou sem filhos)'
            ]
          }
        };

      case 'trabalhista':
        return {
          step1: {
            title: 'Qual direito foi descumprido no seu contrato de trabalho?',
            options: [
              'Horas extras habituais e intervalos não quitados',
              'Demitido sem o pagamento integral das verbas rescisórias',
              'Contratado como MEI/PJ mas sujeito a horários e ordens de CLT',
              'Assédio moral, humilhação pública ou ambiente insalubre'
            ]
          },
          step2: {
            title: 'Qual a situação atual do seu vínculo empregatício?',
            options: [
              'Ainda continuo trabalhando na empresa',
              'Fui dispensado há menos de 1 ano',
              'Fui dispensado há mais de 1 ano (menos de 2 anos)',
              'Pedi demissão por não suportar os descumprimentos'
            ]
          },
          step3: {
            title: 'Você possui registros de horários, mensagens ou holerites?',
            options: [
              'Sim, possuo holerites, extrato de FGTS e mensagens',
              'Tenho apenas conversas de WhatsApp e fotos',
              'A empresa não fornecia comprovantes com frequência'
            ]
          }
        };

      default:
        // Geral
        return {
          step1: {
            title: 'Qual área do direito melhor define sua demanda?',
            options: [
              'Descumprimento de contrato ou cobrança de dívida',
              'Negócio imobiliário, posse ou inventário de bens',
              'Relação de trabalho ou questão trabalhista empresarial',
              'Defesa do consumidor, negativação ou dano moral'
            ]
          },
          step2: {
            title: 'Qual a urgência atual do seu caso?',
            options: [
              'Urgência imediata (risco de perda de prazo ou liminar)',
              'Em fase de negociação amigável prévia',
              'Desejo consultoria preventiva antes de assinar contrato'
            ]
          },
          step3: {
            title: 'Você possui documentação inicial organizada?',
            options: [
              'Sim, documentos organizados e prontos em PDF/foto',
              'Tenho a documentação básica em formato digital',
              'Preciso de orientações para organizar os documentos'
            ]
          }
        };
    }
  };

  const questions = getQuestions();

  const handleSelectOption = (key, value) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);

    if (currentStep === 1) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(3);
    else if (currentStep === 3) setIsCalculated(true);
  };

  const handleReset = () => {
    setAnswers({ objetivo: '', tempo: '', documentos: '' });
    setCurrentStep(1);
    setIsCalculated(false);
  };

  const getDossierMessage = () => {
    return (
      `*Solicitação de Análise Prévia (Diagnóstico do Site)*\n\n` +
      `⚖️ *Especialidade:* ${nicheInfo.name}\n` +
      `📌 *Demanda:* ${answers.objetivo}\n` +
      `⏱️ *Cenário:* ${answers.tempo}\n` +
      `📂 *Documentos:* ${answers.documentos}\n\n` +
      `Gostaria de agendar um atendimento inicial com ${articlePreposition} ${lawyer.name}.`
    );
  };

  const isFemale = theme?.gender === 'female';
  const bgImage = isFemale ? "bg-[url('/images/legal/advogada_tribunal.jpg')]" : "bg-[url('/images/legal/tribunal.jpg')]";

  return (
    <section 
      id="diagnostico" 
      className={`py-28 text-white relative overflow-hidden ${bgImage} bg-fixed bg-cover bg-center`}
    >
      {/* Overlay Escuro com Revelação Suave ao Scroll e Alto Contraste */}
      <div className={`absolute inset-0 ${isFemale ? 'bg-gradient-to-b from-[#1C0515]/95 via-[#23061A]/85 to-[#12020D]/95' : 'bg-gradient-to-b from-[#070F1E]/95 via-[#070F1E]/82 to-[#070F1E]/95'} backdrop-blur-[1px] pointer-events-none`} />
      
      {/* Luz ambiente de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-amber-500/15 via-blue-600/10 to-transparent rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-white/[0.05] to-amber-500/10 border border-amber-400/40 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-4 shadow-[0_0_20px_rgba(245,158,11,0.25)] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ferramenta Interativa de Viabilidade</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-extrabold text-white tracking-tight">
            Diagnóstico Jurídico em{' '}
            <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              60 Segundos
            </span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 font-normal">
            Identifique a viabilidade e os precedentes preliminares aplicáveis ao seu caso.
          </p>
        </div>

        {/* Card Glassmorphism 3D Futurista */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-gradient-to-b from-white/[0.1] via-white/[0.03] to-[#0A1222]/90 backdrop-blur-3xl border border-white/20 p-7 sm:p-12 shadow-[0_25px_70px_rgba(0,0,0,0.8)] relative overflow-hidden"
        >
          {/* Brilho de Vidro Superior */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>

          {!isCalculated ? (
            <div>
              {/* Barra de Progresso com Gradiente Líquido */}
              <div className="mb-10">
                <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-2.5">
                  <span className="text-amber-300 font-bold tracking-wider">ETAPA {currentStep} DE 3</span>
                  <span className="text-gray-300">{currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%'} COMPLETO</span>
                </div>
                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/10 shadow-inner">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.6)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / 3) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  ></motion.div>
                </div>
              </div>

              {/* Perguntas Dinâmicas */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <h3 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-wide mb-6">
                    {currentStep === 1 && questions.step1.title}
                    {currentStep === 2 && questions.step2.title}
                    {currentStep === 3 && questions.step3.title}
                  </h3>

                  <div className="grid grid-cols-1 gap-3.5">
                    {currentStep === 1 &&
                      questions.step1.options.map((opt, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.015, x: 4 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelectOption('objetivo', opt)}
                          className="w-full text-left p-4 sm:p-5 rounded-2xl bg-white/[0.04] hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-white/[0.08] border border-white/10 hover:border-amber-400/60 text-sm sm:text-base text-gray-200 hover:text-white transition-all duration-200 flex items-center justify-between group shadow-lg backdrop-blur-md"
                        >
                          <span className="font-medium pr-4">{opt}</span>
                          <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-amber-400 flex items-center justify-center flex-shrink-0 transition-colors shadow-md">
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                          </div>
                        </motion.button>
                      ))}

                    {currentStep === 2 &&
                      questions.step2.options.map((opt, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.015, x: 4 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelectOption('tempo', opt)}
                          className="w-full text-left p-4 sm:p-5 rounded-2xl bg-white/[0.04] hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-white/[0.08] border border-white/10 hover:border-amber-400/60 text-sm sm:text-base text-gray-200 hover:text-white transition-all duration-200 flex items-center justify-between group shadow-lg backdrop-blur-md"
                        >
                          <span className="font-medium pr-4">{opt}</span>
                          <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-amber-400 flex items-center justify-center flex-shrink-0 transition-colors shadow-md">
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                          </div>
                        </motion.button>
                      ))}

                    {currentStep === 3 &&
                      questions.step3.options.map((opt, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.015, x: 4 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelectOption('documentos', opt)}
                          className="w-full text-left p-4 sm:p-5 rounded-2xl bg-white/[0.04] hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-white/[0.08] border border-white/10 hover:border-amber-400/60 text-sm sm:text-base text-gray-200 hover:text-white transition-all duration-200 flex items-center justify-between group shadow-lg backdrop-blur-md"
                        >
                          <span className="font-medium pr-4">{opt}</span>
                          <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-amber-400 flex items-center justify-center flex-shrink-0 transition-colors shadow-md">
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                          </div>
                        </motion.button>
                      ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Botão de Voltar */}
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="mt-8 text-xs text-gray-400 hover:text-amber-300 flex items-center gap-2 font-mono transition-colors"
                >
                  <span>← VOLTAR À ETAPA ANTERIOR</span>
                </button>
              )}
            </div>
          ) : (
            /* Dossiê Estruturado Final */
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-7 h-7 flex-shrink-0" />
                <div>
                  <h4 className="font-black text-sm sm:text-base uppercase tracking-wider text-emerald-300">
                    Demanda com Alta Elegibilidade Forense
                  </h4>
                  <p className="text-xs text-emerald-200/90 mt-0.5">
                    Os dados informados encontram sólido respaldo legal nas normas e precedentes vigentes.
                  </p>
                </div>
              </div>

              {/* Dossiê em Card de Vidro */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-xs sm:text-sm backdrop-blur-md">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-mono uppercase tracking-widest text-amber-300 font-bold text-xs">
                    Dossiê Preliminar Estruturado:
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    Sigilo Ético OAB
                  </span>
                </div>
                <div className="space-y-2 text-gray-200 pt-1">
                  <p>
                    <strong className="text-white font-mono uppercase text-xs">Área / Demanda:</strong> {answers.objetivo}
                  </p>
                  <p>
                    <strong className="text-white font-mono uppercase text-xs">Espaço Temporal:</strong> {answers.tempo}
                  </p>
                  <p>
                    <strong className="text-white font-mono uppercase text-xs">Documentação:</strong> {answers.documentos}
                  </p>
                </div>
              </div>

              {/* Ações Finais com Shimmer */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <motion.a
                  whileHover={{ scale: 1.03, boxShadow: '0 0 35px rgba(245,158,11,0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  href={whatsappDossierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full sm:flex-1 py-4 px-6 ${isFemale ? 'rounded-full bg-gradient-to-r from-[#D8A756] via-[#E5BF7C] to-[#C79540] text-[#1A0314] font-bold shadow-lg shadow-[#D8A756]/25' : 'rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-black shadow-2xl'} text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 group transition-all`}
                >
                  <MessageCircle className={`w-5 h-5 ${isFemale ? 'fill-[#1A0314] text-[#1A0314]' : 'text-black'}`} />
                  <span>TRANSMITIR DIAGNÓSTICO {isFemale ? 'À DRA.' : 'AO DR.'} {lawyer.name}</span>
                  <ArrowRight className={`w-4 h-4 ${isFemale ? 'text-[#1A0314]' : 'text-black'} group-hover:translate-x-1.5 transition-transform`} />
                </motion.a>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider border border-white/15 flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Refazer</span>
                </button>
              </div>

              <p className="text-[11px] text-gray-400 text-center font-mono">
                * Triagem orientativa. Sigilo profissional assegurado pelas prerrogativas da advocacia.
              </p>
            </motion.div>
          )}

        </motion.div>

      </div>
    </section>
  );
}
