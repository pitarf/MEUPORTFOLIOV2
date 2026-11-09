import React, { useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Flame, Sliders, X, Check, RefreshCw } from 'lucide-react';

import { getBurgerBySlug, getDefaultBurger } from '../../data/burgerData';
import { applyBurgerOverrides } from '../../utils/burgerProspectUtils';

import BurgerHeader from '../../components/burger/BurgerHeader';
import BurgerHero from '../../components/burger/BurgerHero';
import BurgerTrustBar from '../../components/burger/BurgerTrustBar';
import BurgerMenu from '../../components/burger/BurgerMenu';
import BurgerCombos from '../../components/burger/BurgerCombos';
import BurgerDifferentials from '../../components/burger/BurgerDifferentials';
import BurgerLocation from '../../components/burger/BurgerLocation';
import BurgerTestimonials from '../../components/burger/BurgerTestimonials';
import BurgerFaq from '../../components/burger/BurgerFaq';
import BurgerFinalCta from '../../components/burger/BurgerFinalCta';
import BurgerFooter from '../../components/burger/BurgerFooter';
import BurgerFloatingWhatsApp from '../../components/burger/BurgerFloatingWhatsApp';

/**
 * Página Mestre da Landing Page de Hamburgueria Artesanal & Gastrobar
 * Rotas: /hamburgueria e /hamburgueria/:slug
 * 100% maleável via parâmetros de URL do Google Maps Scraper ou CRM de Vendas.
 */
export default function BurgerPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Estado para gaveta de teste rápido de prospecção do operador
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [customName, setCustomName] = useState(searchParams.get('nome') || '');
  const [customCity, setCustomCity] = useState(searchParams.get('cidade') || '');
  const [customBairro, setCustomBairro] = useState(searchParams.get('bairro') || '');
  const [customPhone, setCustomPhone] = useState(searchParams.get('whatsapp') || '');

  // 1. Obtém os dados base pelo slug ou fallback
  const baseData = useMemo(() => {
    if (slug) {
      return getBurgerBySlug(slug);
    }
    return getDefaultBurger();
  }, [slug]);

  // 2. Aplica sobreposições vindas de query params
  const activeData = useMemo(() => {
    return applyBurgerOverrides(baseData, searchParams);
  }, [baseData, searchParams]);

  // Aplica as edições da barra de prospecção na URL
  const handleApplySimulator = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);

    if (customName.trim()) newParams.set('nome', customName.trim());
    else newParams.delete('nome');

    if (customCity.trim()) newParams.set('cidade', customCity.trim());
    else newParams.delete('cidade');

    if (customBairro.trim()) newParams.set('bairro', customBairro.trim());
    else newParams.delete('bairro');

    if (customPhone.trim()) newParams.set('whatsapp', customPhone.trim());
    else newParams.delete('whatsapp');

    setSearchParams(newParams);
    setIsDrawerOpen(false);
  };

  const handleResetSimulator = () => {
    setCustomName('');
    setCustomCity('');
    setCustomBairro('');
    setCustomPhone('');
    setSearchParams({});
    setIsDrawerOpen(false);
  };

  const hasOverrides = searchParams.toString().length > 0;

  return (
    <div className="min-h-screen bg-[#0C0A09] text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Metadados Dinâmicos de SEO */}
      <Helmet>
        <title>{`${activeData.name} | Hambúrguer Artesanal Angus & Gastrobar`}</title>
        <meta name="description" content={activeData.description} />
        <meta property="og:title" content={`${activeData.name} - Hambúrguer Artesanal`} />
        <meta property="og:description" content={activeData.tagline} />
        <meta property="og:type" content="restaurant.restaurant" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80" />
      </Helmet>

      {/* Barra de Prospecção & Demonstração (Para Vendedores e Clientes em Teste) */}
      <div className="bg-[#141210] border-b border-stone-800 py-1.5 px-4 text-xs text-stone-300 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>
              Modelo de Prospecção Gastronômica: <strong className="text-white">{activeData.name}</strong> ({activeData.location.city} - {activeData.location.state})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-400 font-semibold transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Simular com Outro Restaurante</span>
            </button>

            {hasOverrides && (
              <button
                onClick={handleResetSimulator}
                className="text-stone-400 hover:text-white flex items-center gap-1"
                title="Restaurar padrão"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Resetar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gaveta Flutuante de Simulação */}
      {isDrawerOpen && (
        <div className="bg-[#141210] border-b border-stone-800 p-4 sm:p-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Personalização Dinâmica de Prospecção
                </h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplySimulator} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-stone-400 block mb-1">Nome da Hamburgueria:</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ex: Texas Burger Artesanal"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Cidade:</label>
                <input
                  type="text"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  placeholder="Ex: Belo Horizonte"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Bairro:</label>
                <input
                  type="text"
                  value={customBairro}
                  onChange={(e) => setCustomBairro(e.target.value)}
                  placeholder="Ex: Savassi"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-stone-400 block mb-1">WhatsApp:</label>
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="Ex: 31988887777"
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="sm:col-span-4 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Aplicar Alterações Instantâneas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Componentes Estruturais da Landing Page */}
      <BurgerHeader data={activeData} />
      <BurgerHero data={activeData} />
      <BurgerTrustBar data={activeData} />
      <BurgerMenu data={activeData} />
      <BurgerCombos data={activeData} />
      <BurgerDifferentials data={activeData} />
      <BurgerLocation data={activeData} />
      <BurgerTestimonials data={activeData} />
      <BurgerFaq data={activeData} />
      <BurgerFinalCta data={activeData} />
      <BurgerFooter data={activeData} />
      <BurgerFloatingWhatsApp data={activeData} />
    </div>
  );
}
