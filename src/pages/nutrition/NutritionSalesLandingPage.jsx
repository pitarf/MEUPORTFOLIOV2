import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Shield,
  CheckCircle2,
  Star,
  ArrowRight,
  Clock,
  Flame,
  ExternalLink,
  Search,
  Smartphone,
  ChevronDown,
  Users,
  Check,
  Award,
  Zap,
  HeartHandshake
} from 'lucide-react';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import SEO from '@/components/SEO';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Landing Page de Alta Conversao para Venda de Criacao de Sites para Nutricionistas
 * Focada no ranqueamento organico no Google e captacao ativa de profissionais de nutricao.
 * Rotas: /criacao-site-nutricionista e /sites-para-nutricionistas
 */
export default function NutritionSalesLandingPage() {
  const [openFaq, setOpenFaq] = useState(0);

  // Controle de tema
  const { setTheme } = useTheme();

  useEffect(() => {
    const previousTheme = localStorage.getItem('theme') || 'dark';
    if (setTheme) {
      setTheme('light');
    }
    return () => {
      if (setTheme) {
        setTheme(previousTheme);
      }
    };
  }, []);

  // Contador regressivo de 48 horas persistido no localStorage
  const [timeLeft, setTimeLeft] = useState(() => {
    try {
      const storedExpiry = localStorage.getItem('nutrition_sales_timer_expiry');
      let targetExpiry;
      if (storedExpiry && !isNaN(Number(storedExpiry))) {
        targetExpiry = Number(storedExpiry);
      } else {
        targetExpiry = Date.now() + 48 * 3600 * 1000;
        localStorage.setItem('nutrition_sales_timer_expiry', targetExpiry.toString());
      }

      const remainingMs = Math.max(0, targetExpiry - Date.now());
      const totalSeconds = Math.floor(remainingMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return { hours, minutes, seconds };
    } catch {
      return { hours: 47, minutes: 58, seconds: 42 };
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      try {
        const storedExpiry = localStorage.getItem('nutrition_sales_timer_expiry');
        let targetExpiry = storedExpiry ? Number(storedExpiry) : Date.now() + 48 * 3600 * 1000;
        if (Date.now() >= targetExpiry) {
          targetExpiry = Date.now() + 48 * 3600 * 1000;
          localStorage.setItem('nutrition_sales_timer_expiry', targetExpiry.toString());
        }
        const remainingMs = Math.max(0, targetExpiry - Date.now());
        const totalSeconds = Math.floor(remainingMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        setTimeLeft({ hours, minutes, seconds });
      } catch {
        // silencioso
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Formatador de WhatsApp
  const makeWhatsAppUrl = (customMessage) => {
    const basePhone = '5521992929983';
    const message = customMessage || 'Ola Rafael, vi a pagina de criacao de sites para nutricionistas e quero garantir a condicao especial de R$ 297 para o meu consultorio.';
    return `https://wa.me/${basePhone}?text=${encodeURIComponent(message)}`;
  };

  // Modelos ao vivo para demonstracao
  const demoSites = [
    {
      id: 'clinica',
      title: 'Nutricao Clinica & Comportamental',
      professional: 'Dra. Camila Rocha (CRN-4)',
      city: 'Rio de Janeiro, RJ (Ipanema e Copacabana)',
      focus: 'Emagrecimento saudavel, reeducacao alimentar e saude da mulher',
      url: '/nutricionista/dra-camila-rocha-rio-de-janeiro',
      accentColor: 'from-emerald-700 to-[#244B3B]'
    },
    {
      id: 'esportiva',
      title: 'Nutricao Esportiva & Performance',
      professional: 'Dr. Lucas Mendes (CRN-3)',
      city: 'Sao Paulo, SP (Jardins e Moema)',
      focus: 'Hipertrofia, composicao corporal e rendimento atletico',
      url: '/nutricionista/dr-lucas-mendes-nutricao-esportiva',
      accentColor: 'from-[#557A61] to-[#1e3c2f]'
    },
    {
      id: 'nutrivida',
      title: 'Modelo NutriVida : Clinica & Emagrecimento',
      professional: 'Dra. Beatriz Lima (CRN-4)',
      city: 'Rio de Janeiro, RJ (Barra da Tijuca)',
      focus: 'Emagrecimento saudavel, nutricao esportiva e clinica com formulario direto',
      url: '/nutrivida',
      accentColor: 'from-[#0284C7] to-[#0C4A6E]'
    }
  ];

  // Schema.org para SEO
  const schemaOffer = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Criacao de Sites para Nutricionistas: Rafael Pita Solutions',
    description: 'Desenvolvimento de sites de alta conversao para nutricionistas com SEO local no Google, conformidade com o CFN e captacao de pacientes pelo WhatsApp.',
    image: 'https://rafaelpitaoficial.com.br/og-image.jpg',
    url: 'https://rafaelpitaoficial.com.br/criacao-site-nutricionista',
    telephone: '+5521992929983',
    priceRange: 'R$ 297,00',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Rio de Janeiro',
      addressRegion: 'RJ',
      addressCountry: 'BR'
    },
    offers: {
      '@type': 'Offer',
      price: '297.00',
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      validThrough: '2026-12-31'
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#252925] font-sans selection:bg-[#244B3B] selection:text-white">
      {/* Metadados SEO */}
      <SEO
        title="Criacao de Sites para Nutricionistas | Paginas de Alta Conversao e SEO Local"
        description="Tenha um site moderno para o seu consultorio de nutricao. 100% compativel com o CFN, com SEO local para o Google e focado em atrair pacientes pelo WhatsApp."
        keywords="criacao de site para nutricionista, sites para nutricionistas, landing page nutricao, marketing para nutricionistas, consultorio de nutricao, seo local nutricao"
        canonical="https://rafaelpitaoficial.com.br/criacao-site-nutricionista"
      />

      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schemaOffer)}</script>
      </Helmet>

      {/* Top Banner de Urgencia e Escassez */}
      <div className="bg-[#244B3B] text-white py-2.5 px-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-200 uppercase tracking-wider text-[11px] font-bold">
              Condicao de Parceria Comercial:
            </span>
            <span>Apenas 3 vagas promocionais com 80% de desconto</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-emerald-200 bg-white/10 px-2.5 py-1 rounded-md">
              <Clock className="w-3.5 h-3.5 text-emerald-300" />
              <span>
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
            <a
              href={makeWhatsAppUrl('Ola Rafael, quero garantir a minha vaga promocional de R$ 297 para o meu site de nutricao.')}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1faa53] text-[#0a2318] px-3 py-1 rounded-md font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>Garantir Vaga</span>
            </a>
          </div>
        </div>
      </div>

      {/* Header Editorial */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#244B3B]/10 sticky top-[41px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#244B3B] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              RP
            </div>
            <div>
              <span className="text-base font-bold text-[#244B3B] tracking-tight block leading-tight">
                Rafael Pita Solutions
              </span>
              <span className="text-xs text-[#557A61] font-medium block">
                Especialista em Sites para a Area da Saude
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#252925]/80">
            <a href="#modelos" className="hover:text-[#244B3B] transition-colors">
              Modelos ao Vivo
            </a>
            <a href="#como-funciona" className="hover:text-[#244B3B] transition-colors">
              Como Funciona
            </a>
            <a href="#precos" className="hover:text-[#244B3B] transition-colors">
              Valores
            </a>
            <a href="#faq" className="hover:text-[#244B3B] transition-colors">
              Duvidas Frequentes
            </a>
          </div>

          <a
            href={makeWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#244B3B] hover:bg-[#1b382c] text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>Falar com o Especialista</span>
          </a>
        </div>
      </header>

      {/* HERO SECTION DE ALTA CONVERSAO */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-white to-[#F8F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Badge de Conformidade */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#244B3B]/10 border border-[#244B3B]/20 text-[#244B3B] text-xs font-semibold">
                <Shield className="w-4 h-4 text-[#244B3B]" />
                <span>100% de Acordo com o Codigo de Etica do CFN / CRN</span>
              </div>

              {/* Titulo Principal */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#244B3B] tracking-tight leading-[1.15]">
                O seu consultorio de nutricao na{' '}
                <span className="text-[#557A61] underline decoration-[#557A61]/30">
                  primeira pagina do Google
                </span>{' '}
                e com a agenda cheia.
              </h1>

              {/* Descricao */}
              <p className="text-base sm:text-xl text-[#252925]/80 leading-relaxed font-normal">
                Desenvolvemos landing pages profissionais sob medida para nutricionistas. Design acolhedor e elegante, velocidade maxima no celular e foco absoluto em transformar visitantes em pacientes particulares no seu WhatsApp.
              </p>

              {/* Pontos Chave */}
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#252925]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>SEO Local no Google (sua cidade e bairro)</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#252925]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Agendamentos diretos no WhatsApp</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#252925]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Entrega expressa em ate 72 horas</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#252925]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Sem mensalidades obrigatorias</span>
                </div>
              </div>

              {/* Acoes Principais */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href={makeWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#244B3B] hover:bg-[#1b382c] text-white font-bold text-base shadow-xl shadow-[#244B3B]/20 transition-all hover:scale-[1.02]"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Garantir Meu Site por R$ 297</span>
                  <ArrowRight className="w-5 h-5" />
                </a>

                <a
                  href="#modelos"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white border border-[#244B3B]/20 text-[#244B3B] hover:bg-[#244B3B]/5 font-semibold text-base transition-all"
                >
                  <span>Ver Modelos Prontos</span>
                </a>
              </div>

              {/* Aviso de Preco */}
              <div className="flex items-center gap-3 pt-1 text-xs text-[#252925]/70">
                <span className="line-through">Preco Normal: R$ 1.500</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Condicao Especial: R$ 297 a vista ou 12x de R$ 29,70
                </span>
              </div>
            </div>

            {/* Coluna Visual do Hero */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Card Flutuante de Estatistica */}
                <div className="absolute -top-4 -left-4 z-20 bg-white p-4 rounded-2xl shadow-xl border border-[#244B3B]/10 max-w-[210px]">
                  <div className="flex items-center gap-2 text-amber-500 mb-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <p className="text-xs font-bold text-[#252925]">
                    +85% de Credibilidade
                  </p>
                  <p className="text-[11px] text-[#252925]/70 leading-tight mt-0.5">
                    Pacientes confiam muito mais em quem tem site proprio no Google.
                  </p>
                </div>

                {/* Preview em Mockup Limpo */}
                <div className="bg-white rounded-3xl p-6 shadow-2xl border border-[#244B3B]/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[11px] font-mono text-[#557A61]">
                      seunome.com.br
                    </span>
                    <span className="w-4" />
                  </div>

                  <div className="space-y-3">
                    <div className="h-6 w-3/4 bg-[#244B3B]/10 rounded-lg animate-pulse" />
                    <div className="h-4 w-full bg-gray-100 rounded" />
                    <div className="h-4 w-5/6 bg-gray-100 rounded" />
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8F7F2] border border-[#244B3B]/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#244B3B]">
                        Consulta Nutricional Presencial ou Online
                      </p>
                      <p className="text-[11px] text-[#557A61]">
                        Agendamento rapido no WhatsApp
                      </p>
                    </div>
                    <div className="p-2.5 rounded-full bg-[#25D366] text-white shadow-md">
                      <WhatsAppIcon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                      <span className="block text-lg font-extrabold text-[#244B3B]">
                        100%
                      </span>
                      <span className="text-[10px] text-[#252925]/70 uppercase tracking-wider font-semibold">
                        Responsivo Mobile
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                      <span className="block text-lg font-extrabold text-[#244B3B]">
                        98/100
                      </span>
                      <span className="text-[10px] text-[#252925]/70 uppercase tracking-wider font-semibold">
                        Velocidade Google
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Flutuante Inferior */}
                <div className="absolute -bottom-5 -right-4 z-20 bg-[#244B3B] text-white p-4 rounded-2xl shadow-xl max-w-[220px]">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-emerald-300" />
                    <span className="text-xs font-bold text-emerald-200 uppercase">
                      Entrega Expressa
                    </span>
                  </div>
                  <p className="text-xs text-white/90 leading-tight">
                    Seu site no ar pronto para receber pacientes em 48 a 72 horas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECAO DE ESTATISTICAS DE MERCADO */}
      <section className="py-14 bg-white border-y border-[#244B3B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
            <div className="border-l-4 border-[#244B3B] pl-4 space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#244B3B]">
                82%
              </span>
              <p className="text-sm font-semibold text-[#252925]">
                Buscam no Google antes de agendar
              </p>
              <p className="text-xs text-[#252925]/70">
                Quem nao esta na primeira pagina perde pacientes todos os dias para a concorrencia.
              </p>
            </div>

            <div className="border-l-4 border-[#557A61] pl-4 space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#557A61]">
                73%
              </span>
              <p className="text-sm font-semibold text-[#252925]">
                Desistem se o site for lento
              </p>
              <p className="text-xs text-[#252925]/70">
                Nossos sites carregam em menos de 1 segundo em qualquer conexao 4G ou 5G.
              </p>
            </div>

            <div className="border-l-4 border-emerald-600 pl-4 space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700">
                3x Mais
              </span>
              <p className="text-sm font-semibold text-[#252925]">
                Valor percebido na consulta
              </p>
              <p className="text-xs text-[#252925]/70">
                Um posicionamento premium permite cobrar valores justos sem desconto.
              </p>
            </div>

            <div className="border-l-4 border-amber-500 pl-4 space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-600">
                Zero Risco
              </span>
              <p className="text-sm font-semibold text-[#252925]">
                Conformidade Total com o CFN
              </p>
              <p className="text-xs text-[#252925]/70">
                Textos e imagens rigorosamente alinhados com o codigo de conduta do nutricionista.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECAO DE MOSTRUARIO: MODELOS AO VIVO */}
      <section id="modelos" className="py-20 bg-[#F8F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#557A61]">
              Mostruario Interativo
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#244B3B] tracking-tight">
              Veja na pratica como ficara o site do seu consultorio
            </h2>
            <p className="text-base text-[#252925]/80">
              Clique para navegar nos modelos reais desenvolvidos na plataforma. Todos sao 100% personalizaveis com o seu nome, fotos, especialidades e cidade de atendimento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {demoSites.map((demo) => (
              <div
                key={demo.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#244B3B]/10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className={`p-8 bg-gradient-to-br ${demo.accentColor} text-white space-y-3`}>
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                    Modelo Demonstrativo Ativo
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight">
                    {demo.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {demo.professional}
                  </p>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2 text-sm text-[#252925]">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-[#244B3B]">Localizacao:</span>
                      <span className="text-[#252925]/80">{demo.city}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-[#244B3B]">Foco de Atuacao:</span>
                      <span className="text-[#252925]/80">{demo.focus}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                    <Link
                      to={demo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#244B3B] hover:text-[#557A61] transition-colors"
                    >
                      <span>Abrir Modelo ao Vivo</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <a
                      href={makeWhatsAppUrl(`Ola Rafael, adorei o modelo de ${demo.title} e quero um igual para mim.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#244B3B] text-white hover:bg-[#1b382c] text-xs font-bold transition-all"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>Quero Esse Modelo</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-[#252925]/70 max-w-xl mx-auto">
              Nao encontrou o seu nicho especifico? Desenvolvemos tambem para Nutricao Materno-Infantil, Vegetariana, Oncologica, Saude do Idoso e outras areas com a mesma excelencia.
            </p>
          </div>
        </div>
      </section>

      {/* SECAO: O QUE ESTA INCLUSO */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#557A61]">
              Estrutura Completa
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#244B3B] tracking-tight">
              Tudo o que voce precisa para dominar o digital
            </h2>
            <p className="text-base text-[#252925]/80">
              Voce nao precisa se preocupar com tecnologia, programacao ou configuracoes complexas. Entregamos a solucao 100% pronta para uso.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#F8F7F2] border border-[#244B3B]/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#244B3B] text-white flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#244B3B]">
                SEO Local para o Google
              </h3>
              <p className="text-sm text-[#252925]/80 leading-relaxed">
                Estruturamos as palavras-chave da sua especialidade e cidade para que os pacientes encontrem o seu nome quando buscarem por nutricionista na sua regiao.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8F7F2] border border-[#244B3B]/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#557A61] text-white flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#244B3B]">
                Mobile-First Perfeito
              </h3>
              <p className="text-sm text-[#252925]/80 leading-relaxed">
                Mais de 80% do trafego vem de smartphones. Seu site tera leitura confortavel, botoes de toque faceis e navegacao instantanea no iPhone e Android.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8F7F2] border border-[#244B3B]/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center">
                <WhatsAppIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#244B3B]">
                Agendamento Instantaneo
              </h3>
              <p className="text-sm text-[#252925]/80 leading-relaxed">
                O paciente clica e cai diretamente no seu WhatsApp com mensagem padronizada, solicitando informacoes e agendamento da consulta.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8F7F2] border border-[#244B3B]/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#244B3B] text-white flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#244B3B]">
                Etica e Seguranca CFN
              </h3>
              <p className="text-sm text-[#252925]/80 leading-relaxed">
                Linguagem sobria, sem sensacionalismo ou falsas promessas, com aviso legal no rodape e protecao para o seu registro profissional.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8F7F2] border border-[#244B3B]/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#557A61] text-white flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#244B3B]">
                Hospedagem & Certificado SSL
              </h3>
              <p className="text-sm text-[#252925]/80 leading-relaxed">
                Servidores com protecao de seguranca avancada e cadeado SSL (HTTPS) incluso para garantir a privacidade dos dados dos seus pacientes.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8F7F2] border border-[#244B3B]/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#244B3B]">
                Suporte Humano Dedicado
              </h3>
              <p className="text-sm text-[#252925]/80 leading-relaxed">
                Atendimento direto pelo WhatsApp com o Rafael Pita. Sempre que precisar alterar telefones, horarios ou informacoes, cuidamos de tudo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECAO DE PRECOS E OFERTA PROMOCIONAL */}
      <section id="precos" className="py-20 bg-gradient-to-b from-[#F8F7F2] to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#557A61]">
              Investimento Transparente
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#244B3B] tracking-tight">
              Tenha o seu site profissional por um valor que cabe no seu consultorio
            </h2>
            <p className="text-sm sm:text-base text-[#252925]/80">
              Uma unica consulta particular agendada pelo seu novo site ja paga todo o seu investimento.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#244B3B] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#244B3B] text-white text-xs font-extrabold py-2 px-6 rounded-bl-2xl uppercase tracking-wider">
              Oferta Especial de Entrada
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#557A61] uppercase tracking-wider">
                  Pacote Completo de Lancamento
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#244B3B] mt-1">
                  Landing Page Profissional para Nutricionista
                </h3>
              </div>

              {/* Preco */}
              <div className="flex items-baseline gap-3 pb-6 border-b border-gray-100">
                <span className="text-gray-400 line-through text-lg">De R$ 1.500</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-bold text-[#252925]">Por apenas</span>
                  <span className="text-4xl sm:text-5xl font-black text-[#244B3B]">
                    R$ 297
                  </span>
                  <span className="text-xs text-[#252925]/70">a vista</span>
                </div>
              </div>

              <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg inline-block border border-emerald-200">
                Ou em ate 12x de R$ 29,70 no cartao de credito
              </p>

              {/* Lista de Entregaveis */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-[#252925]">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Site completo com 12 secoes de conversao otimizadas</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#252925]">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Otimizacao de SEO Local para o Google (cidade e bairros atendidos)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#252925]">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Integracao com WhatsApp para agendamento de consultas</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#252925]">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Adaptado para consultas presenciais e teleconsultas</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#252925]">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Certificado SSL de seguranca incluso</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#252925]">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>Garantia incondicional de 7 dias ou seu dinheiro de volta</span>
                </div>
              </div>

              {/* Botao de Fechamento */}
              <div className="pt-6">
                <a
                  href={makeWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 py-4 px-8 rounded-2xl bg-[#244B3B] hover:bg-[#1b382c] text-white font-extrabold text-base sm:text-lg shadow-xl shadow-[#244B3B]/20 transition-all hover:scale-[1.01]"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Contratar Meu Site Agora por R$ 297</span>
                </a>
              </div>

              <div className="text-center text-xs text-[#252925]/60">
                Pagamento seguro via PIX ou Cartao de Credito. Nota Fiscal emitida.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECAO DE FAQ: DUVIDAS FREQUENTES */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#557A61]">
              Transparencia Absoluta
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#244B3B] tracking-tight">
              Perguntas Frequentes
            </h2>
            <p className="text-base text-[#252925]/80">
              Tudo o que voce precisa saber antes de iniciar o desenvolvimento.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Em quanto tempo meu site fica pronto?',
                a: 'Apos voce nos enviar as suas fotos basicas e dados de contato, o seu site e finalizado e publicado em ate 48 a 72 horas uteis.'
              },
              {
                q: 'Existe alguma mensalidade ou taxa oculta?',
                a: 'Nao ha taxas ocultas. O valor de R$ 297 e referente a criacao completa da sua pagina. Caso voce queira hospedar nos nossos servidores de alta velocidade com manutencao e suporte continuos, oferecemos planos opcionais a partir de R$ 49/mes.'
              },
              {
                q: 'O site realmente segue as normas do CFN e CRN?',
                a: 'Sim, com rigor absoluto. Nao utilizamos promessas de emagrecimento garantido, nem fotos de antes e depois que firam o codigo de etica do nutricionista. A autoridade e construida com base na sua qualificacao tecnica e servicos prestados.'
              },
              {
                q: 'Como os pacientes entram em contato comigo?',
                a: 'O site possui botoes estrategicos conectados diretamente ao seu WhatsApp particular ou da sua secretaria. O paciente clica e ja inicia a conversa com o texto de solicitacao de agendamento pronto.'
              },
              {
                q: 'Posso usar meu proprio dominio (ex: www.drafulana.com.br)?',
                a: 'Com certeza! Conectamos o seu dominio proprio registrado no Registro.br ou provedor de sua preferencia. Se ainda nao tiver um, orientamos o registro com custo de apenas R$ 40/ano no Registro.br.'
              }
            ].map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#244B3B]/10 overflow-hidden bg-[#F8F7F2]/50"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#244B3B] hover:bg-white/80 transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#557A61] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#252925]/80 leading-relaxed border-t border-[#244B3B]/5 bg-white">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECAO DE CTA FINAL */}
      <section className="py-20 bg-[#244B3B] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-emerald-200 text-xs font-bold uppercase tracking-wider">
            Nao Perca Mais Pacientes
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Pronto para transformar a presenca digital do seu consultorio?
          </h2>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Fale diretamente com o Rafael Pita no WhatsApp e receba uma demonstracao personalizada com o seu nome e especialidades ainda hoje.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={makeWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#1faa53] text-[#0a2318] font-bold text-base shadow-xl transition-all hover:scale-105"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>Iniciar Conversa no WhatsApp</span>
            </a>
          </div>

          <p className="text-xs text-white/60 pt-2">
            Atendimento agil de segunda a sabado das 09h as 19h.
          </p>
        </div>
      </section>

      {/* RODAPE */}
      <footer className="bg-[#1b382c] text-white/70 py-10 border-t border-white/10 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-bold text-white text-sm block">
              Rafael Pita Solutions
            </span>
            <span>
              Solucoes Tecnologicas e Desenvolvimento de Sites de Alta Conversao.
            </span>
          </div>

          <div className="text-center sm:text-right">
            <span>CNPJ e Contato Oficial via WhatsApp (21) 99292-9983</span>
            <span className="block mt-1">
              Desenvolvido com excelencia para nutricionistas em todo o Brasil.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
