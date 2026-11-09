import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Sparkles } from 'lucide-react';
import { buildWhatsAppLink, buildItemOrderMessage } from '../../utils/burgerProspectUtils';

/**
 * BurgerMenu - Cardápio Gastronômico Anti-Slop
 * Layout editorial de restaurante, tipografia limpa, filtros rápidos e pedidos diretos.
 */
export default function BurgerMenu({ data }) {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    let items = data.menuItems || [];

    if (activeCategory !== 'todos') {
      items = items.filter((item) => item.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.highlights?.some((h) => h.toLowerCase().includes(q))
      );
    }

    return items;
  }, [data.menuItems, activeCategory, searchQuery]);

  return (
    <section id="cardapio" className="bg-[#0C0A09] py-16 sm:py-24 border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Seção */}
        <div className="max-w-3xl mb-12 text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
            Cardápio Principal
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
            Preparados na chapa, um a um.
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed mt-3">
            Escolha pelo blend, queijo ou acompanhamento. Cada pedido é montado no momento do envio para chegar com a temperatura e a crocância corretas.
          </p>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-stone-800">
          {/* Abas Minimalistas */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {data.menuCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 shadow-sm'
                      : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Campo de Busca */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar no cardápio..."
              className="w-full pl-9 pr-4 py-2 bg-stone-900 border border-stone-800 rounded-lg text-white placeholder-stone-500 text-xs focus:outline-none focus:border-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Grid de Itens */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-stone-900/40 rounded-xl border border-stone-800">
            <p className="text-stone-400 text-sm mb-2">Nenhum prato encontrado com esse termo.</p>
            <button
              onClick={() => {
                setActiveCategory('todos');
                setSearchQuery('');
              }}
              className="text-amber-400 text-xs font-mono uppercase tracking-wider hover:underline"
            >
              Exibir todo o cardápio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => {
              const itemWhatsappUrl = buildWhatsAppLink(
                data.contact.whatsapp,
                buildItemOrderMessage(item, data.name)
              );

              const formattedPrice = Number(item.price).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              });

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#12100E] rounded-xl border border-stone-800 overflow-hidden flex flex-col group hover:border-stone-700 transition-colors"
                >
                  {/* Foto do Prato */}
                  <div className="relative h-56 overflow-hidden bg-stone-950">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                      loading="lazy"
                    />

                    {item.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-stone-950/90 text-amber-400 border border-stone-800 text-[10px] font-mono uppercase tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-4">
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-lg font-bold text-white tracking-tight">
                          {item.name}
                        </h3>
                        <span className="text-base font-mono font-bold text-amber-400 shrink-0">
                          {formattedPrice}
                        </span>
                      </div>

                      <p className="text-stone-400 text-xs leading-relaxed mt-2 line-clamp-3">
                        {item.description}
                      </p>

                      {/* Lista de Ingredientes / Tags Técnicas */}
                      {item.highlights && item.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {item.highlights.map((hl, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800/80 text-[10px] font-mono text-stone-300"
                            >
                              {hl}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Botão de Pedido */}
                    <div className="pt-2 border-t border-stone-900">
                      <motion.a
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        href={itemWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-stone-900 hover:bg-amber-500 text-stone-200 hover:text-stone-950 font-bold text-xs uppercase tracking-wider border border-stone-800 hover:border-amber-500 transition-all duration-150"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Pedir pelo WhatsApp</span>
                      </motion.a>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
