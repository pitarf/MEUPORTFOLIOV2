import React, { useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getNutritionistBySlug, getDefaultNutritionist } from '../../data/nutritionistsData';
import { applyNutritionistOverrides } from '../../utils/nutritionProspectUtils';

import NutritionSeo from '../../components/nutrition/NutritionSeo';
import {
  ModernNutritionHero,
  ModernNutritionServicesGrid,
  ModernNutritionBenefitsBar,
  ModernNutritionHowItWorks,
  ModernNutritionAbout,
  ModernNutritionDarkLocation,
  ModernNutritionCtaBanner
} from '../../components/nutrition/modern';
import NutritionFloatingWhatsApp from '../../components/nutrition/NutritionFloatingWhatsApp';
import NutritionProspectDrawer from '../../components/nutrition/NutritionProspectDrawer';
import WhatsAppIcon from '../../components/common/WhatsAppIcon';
import { Heart, Menu, X, ArrowRight, ShieldCheck, CheckCircle2, Phone, Calendar, Sparkles } from 'lucide-react';

/**
 * ModernNutritionHeader: Cabecalho Superior com Logo NutriVida e Navegacao
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados da nutricionista
 * @param {function} props.onBookingClick - Callback para rolagem ao agendamento rapido
 */
function ModernNutritionHeader({ data, onBookingClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profile = data || {};
  const prof = profile.professional || profile;
  const contact = profile.contact || profile;
  const brandName = profile.brandName || 'NutriVida';

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Como Funciona', href: '#como-funciona' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Localização', href: '#localizacao' }
  ];

  const rawPhone = contact.whatsapp || '5521999999999';
  const cleanPhone = String(rawPhone).replace(/\D/g, '');
  const bookingWhatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Olá! Gostaria de agendar uma consulta nutricional.')}`;

  const handleBooking = (e) => {
    if (onBookingClick) {
      e.preventDefault();
      onBookingClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Identificacao de Marca e Profissional */}
        <a href="#inicio" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#0EA5E9] flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6 fill-current text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-[#0284C7] transition-colors leading-tight">
              {brandName}
            </span>
            <span className="text-[11px] font-semibold text-[#0284C7] tracking-wider uppercase">
              {prof.name || 'Dra. Beatriz Lima'}
            </span>
          </div>
        </a>

        {/* Navegacao Desktop */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="hover:text-[#0284C7] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#0284C7] hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Botao de Acao Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={bookingWhatsappUrl}
            onClick={handleBooking}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/20 hover:shadow-lg transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar consulta</span>
          </a>
        </div>

        {/* Botao Menu Mobile */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 focus:outline-none transition-colors"
            aria-label="Abrir menu de navegacao"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Retratil */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-sky-100 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-sky-50 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <a
              href={bookingWhatsappUrl}
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleBooking(e);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0284C7] text-white font-bold text-sm shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar consulta</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/**
 * ModernNutritionFooter: Rodape Clean e Harmonioso com Aviso Legal do CFN
 * @param {object} props - Propriedades do componente
 * @param {object} props.data - Dados da nutricionista
 */
function ModernNutritionFooter({ data }) {
  const profile = data || {};
  const prof = profile.professional || profile;
  const loc = profile.location || profile;
  const contact = profile.contact || profile;
  const brandName = profile.brandName || 'NutriVida';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Coluna 1: Marca e Missao */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0284C7] to-[#0EA5E9] flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">{brandName}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nutrição baseada em evidências, acolhimento humanizado e planos alimentares personalizados para sua rotina real.
            </p>
            <div className="text-xs text-sky-400 font-semibold">
              {prof.name} {prof.crn ? `(${prof.crn})` : ''}
            </div>
          </div>

          {/* Coluna 2: Navegacao Rapida */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navegação</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#inicio" className="hover:text-sky-400 transition-colors">Início</a></li>
              <li><a href="#servicos" className="hover:text-sky-400 transition-colors">Especialidades</a></li>
              <li><a href="#como-funciona" className="hover:text-sky-400 transition-colors">Como Funciona</a></li>
              <li><a href="#sobre" className="hover:text-sky-400 transition-colors">Sobre a Profissional</a></li>
              <li><a href="#localizacao" className="hover:text-sky-400 transition-colors">Consultório e Online</a></li>
            </ul>
          </div>

          {/* Coluna 3: Atendimento e Localizacao */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Consultório</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {loc.address || 'Av. Ayrton Senna, 3000, Bloco 2, Sala 415'}<br />
              {loc.neighborhood || 'Barra da Tijuca'}, {loc.city || 'Rio de Janeiro'} : {loc.state || 'RJ'}
            </p>
            <p className="text-xs text-slate-400">
              {loc.hours || 'Segunda a Sexta: 08h00 às 19h00'}
            </p>
          </div>

          {/* Coluna 4: Contato Oficial */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contato Direto</h4>
            <p className="text-xs text-slate-400">
              WhatsApp: {contact.phone || '(21) 96614-9077'}
            </p>
            <p className="text-xs text-slate-400">
              E-mail: {contact.email || 'contato@nutrivida.com.br'}
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 rounded-full bg-sky-950 text-sky-400 text-[10px] font-semibold border border-sky-800/60">
                Atendimento Presencial e Teleconsulta
              </span>
            </div>
          </div>
        </div>

        {/* Rodape Legal com Aviso do Conselho Federal de Nutricionistas (CFN) */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 text-center md:text-left">
          <p>
            &copy; {currentYear} {brandName} : Todos os direitos reservados. Projeto demonstrativo desenvolvido em conformidade com as normas do CFN.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/criacao-site-nutricionista" className="hover:text-sky-400 transition-colors">
              Plataforma para Nutricionistas
            </Link>
            <span>•</span>
            <Link to="/nutricionista" className="hover:text-sky-400 transition-colors">
              Ver Modelo Editorial Verde
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * ModernNutritionPage: Pagina Dedicada de Alta Conversao inspirada no layout NutriVida
 * Oferece suporte completo a dados dinamicos via slug, query params da URL e customizador manual de prospeccao.
 */
export default function ModernNutritionPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  // Estado para customizacoes manuais feitas no painel flutuante de prospeccao
  const [manualOverrides, setManualOverrides] = useState(null);

  // 1. Recupera o perfil correspondente ou perfil NutriVida padrao
  const baseNutritionist = useMemo(() => {
    if (slug) {
      const found = getNutritionistBySlug(slug);
      if (found) return found;
    }
    // Fallback prioritario para o novo perfil NutriVida
    return getNutritionistBySlug('dra-beatriz-lima-nutrivida') || getDefaultNutritionist();
  }, [slug]);

  // 2. Aplica sobreposicoes vindas da URL e edicoes manuais do operador
  const activeNutritionist = useMemo(() => {
    if (!baseNutritionist) return null;

    let combined = applyNutritionistOverrides(baseNutritionist, searchParams);

    if (manualOverrides) {
      combined = applyNutritionistOverrides(combined, manualOverrides);
    }

    return combined;
  }, [baseNutritionist, searchParams, manualOverrides]);

  // Handler para rolagem suave ate o formulario de agendamento rapido no Hero
  const scrollToBookingForm = () => {
    const el = document.getElementById('agendamento-rapido') || document.getElementById('inicio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!activeNutritionist) {
    return (
      <div className="min-h-screen bg-[#F0F9FF] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-[#0C4A6E] mb-4">
          Perfil Nutricional Não Encontrado
        </h1>
        <p className="text-slate-600 max-w-md mb-8 text-sm">
          O perfil de nutricionista solicitado não está disponível no momento.
        </p>
        <Link
          to="/criacao-site-nutricionista"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#0284C7] text-white font-medium hover:bg-[#0369A1] transition-colors"
        >
          Conhecer Plataforma para Nutricionistas
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#0284C7] selection:text-white">
      {/* 1. Barra Flutuante Superior com Alternador de Modelos Visuais */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-xs py-2 px-4 border-b border-slate-700/80 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="font-medium">Ambiente de Demonstração Interativo de Nutrição</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 hidden md:inline">Alternar Modelo Visual:</span>
            
            {/* Modelo Ativo: NutriVida Azul */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500 text-white font-bold text-[11px] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              NutriVida (Azul)
            </span>

            {/* Alternador para o Modelo Editorial Verde */}
            <Link
              to="/nutricionista"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700 transition-colors text-[11px] font-semibold"
              title="Visualizar este profissional no Modelo Editorial Verde"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Editorial (Verde)
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Metadados e SEO Dinamico */}
      <NutritionSeo data={activeNutritionist} nutritionist={activeNutritionist} />

      {/* 3. Cabecalho Fixo Moderno */}
      <ModernNutritionHeader data={activeNutritionist} onBookingClick={scrollToBookingForm} />

      <main>
        {/* 4. Secao Hero em 3 Colunas com Formulario Embutido */}
        <ModernNutritionHero
          data={activeNutritionist}
          nutritionist={activeNutritionist}
          onBookingClick={scrollToBookingForm}
        />

        {/* 5. Grade de 4 Servicos Horizontais */}
        <ModernNutritionServicesGrid
          data={activeNutritionist}
          onSelectService={() => scrollToBookingForm()}
        />

        {/* 6. Faixa Solida Azul Marinho com 4 Facilidades de Atendimento */}
        <ModernNutritionBenefitsBar
          data={activeNutritionist}
          nutritionist={activeNutritionist}
        />

        {/* 7. Secao 'Como Funciona a Consulta' com Prato Saudavel e 3 Etapas */}
        <ModernNutritionHowItWorks
          data={activeNutritionist}
          nutritionist={activeNutritionist}
        />

        {/* 8. Secao 'Sobre a Nutricionista' com Foto, Selo CRN, Checklist e Diferenciais */}
        <ModernNutritionAbout
          data={activeNutritionist}
          nutritionist={activeNutritionist}
          onStoryClick={scrollToBookingForm}
        />

        {/* 9. Secao Dark Navy de Localizacao, Mapa Google Maps e Horarios */}
        <ModernNutritionDarkLocation
          data={activeNutritionist}
          nutritionist={activeNutritionist}
          onBookingClick={scrollToBookingForm}
        />

        {/* 10. Banner Panoramico de Conversao Final em Azul Degrade */}
        <ModernNutritionCtaBanner
          data={activeNutritionist}
          nutritionist={activeNutritionist}
          onBookingClick={scrollToBookingForm}
        />
      </main>

      {/* 11. Rodape Institucional com Normas do CFN */}
      <ModernNutritionFooter data={activeNutritionist} />

      {/* 12. Botao Flutuante Oficial do WhatsApp */}
      <NutritionFloatingWhatsApp data={activeNutritionist} nutritionist={activeNutritionist} />

      {/* 13. Gaveta de Prospeccao e Customizacao Manual em Tempo Real */}
      <NutritionProspectDrawer
        currentData={activeNutritionist}
        onApplyOverrides={(updatedFields) => setManualOverrides(updatedFields)}
        onReset={() => setManualOverrides(null)}
      />
    </div>
  );
}
