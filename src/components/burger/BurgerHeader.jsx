import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Clock } from 'lucide-react';
import { buildWhatsAppLink, buildGeneralOrderMessage } from '../../utils/burgerProspectUtils';

/**
 * BurgerHeader - Estilo Editorial Contemporâneo
 * Sem cores berrantes de circo; preto carvão, âmbar suave, tipografia sóbria e navegação limpa.
 */
export default function BurgerHeader({ data }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = buildWhatsAppLink(
    data.contact.whatsapp,
    buildGeneralOrderMessage(data.name, data.discountDirectOrder)
  );

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Cardápio', href: '#cardapio' },
    { label: 'Combos', href: '#combos' },
    { label: 'Diferenciais', href: '#diferenciais' },
    { label: 'Localização', href: '#localizacao' },
    { label: 'Dúvidas', href: '#faq' }
  ];

  return (
    <header className="sticky top-0 z-50 transition-all duration-200">
      {/* Top Banner Operacional Limpo */}
      <div className="bg-[#141210] border-b border-stone-800 text-stone-300 text-xs py-1.5 px-4 font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-stone-300">
              Cozinha Aberta em {data.location.neighborhood || data.location.city} • Atendimento até {data.schedules.deliveryHours.split('às')[1] || '23h45'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-stone-400">
            <span className="text-amber-400 font-semibold">{data.discountDirectOrder} no pedido direto</span>
            <span className="opacity-40">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              Tempo médio: {data.avgDeliveryTime}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Navegação Principal */}
      <div
        className={`transition-colors duration-200 ${
          isScrolled
            ? 'bg-[#0C0A09]/95 backdrop-blur-md border-b border-stone-800 shadow-xl'
            : 'bg-[#0C0A09] border-b border-stone-800/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logotipo e Identificação */}
            <a href="#inicio" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center font-black text-amber-400 font-serif text-lg tracking-tighter">
                {data.name?.charAt(0) || 'B'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-black tracking-tight text-white uppercase font-sans">
                  {data.name}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">
                  Artesanal & Gastrobar
                </span>
              </div>
            </a>

            {/* Links Centrais no Desktop */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="text-sm font-medium text-stone-300 hover:text-amber-400 transition-colors tracking-wide"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Ações da Direita */}
            <div className="hidden sm:flex items-center gap-4">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pedir no WhatsApp</span>
              </motion.a>
            </div>

            {/* Botão Mobile */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
                aria-label="Abrir menu de navegação"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0C0A09] border-b border-stone-800 px-4 pt-3 pb-6 space-y-3"
          >
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-stone-200 font-medium text-sm hover:text-amber-400 border-b border-stone-900"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-500 text-stone-950 font-bold text-sm uppercase tracking-wider"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Pedir no WhatsApp</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
