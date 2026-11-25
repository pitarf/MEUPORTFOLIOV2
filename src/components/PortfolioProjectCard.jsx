import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';

/**
 * Componente de Card de Projeto RAMIELL
 * Estética editorial minimalista, fundo #0B0B0B, bordas de 6% e cantos de 20px.
 */
export default function PortfolioProjectCard({
    project,
    cat,
    techs = [],
    effectiveBasePath = '/portfolio',
    t = (k, fallback) => fallback,
    isCarousel = false
}) {
    const categoryTitle = cat?.title || 'Geral';
    const categorySlug = cat?.slug || 'geral';
    const projectUrl = `${effectiveBasePath}/${categorySlug}/${project.slug}`;

    return (
        <div
            className={`
                group relative rounded-[20px] overflow-hidden border border-white/[0.06]
                hover:border-[#C9A227]/40 shadow-sm
                hover:shadow-[0_0_24px_rgba(201,162,39,0.12)]
                transition-all duration-300 cursor-pointer bg-[#0B0B0B] flex flex-col h-full
                ${isCarousel ? 'select-none' : ''}
            `}
        >
            <Link to={projectUrl} className="flex flex-col h-full w-full">
                {/* Imagem de Fundo com Proporção 16:10 */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#121212]">
                    <img
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-95"
                        src={project.main_image_url || 'https://images.unsplash.com/photo-1572177812156-58036aae439c'}
                        loading="lazy"
                    />

                    {/* Gradiente sutil no hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badge da Categoria em Pílula Dourada */}
                    <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center text-[10px] font-semibold text-[#070707] px-3 py-1 rounded-full bg-[#C9A227] shadow-sm uppercase tracking-wider">
                            {categoryTitle}
                        </span>
                    </div>

                    {/* Ícone de Acesso no Hover */}
                    <div className="absolute top-3 right-3 z-10 bg-[#070707]/90 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-md border border-white/[0.08]">
                        <ExternalLink className="w-3.5 h-3.5 text-[#C9A227]" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-5 flex flex-col justify-between flex-1 space-y-3 bg-[#0B0B0B]">
                    <div className="space-y-1.5">
                        {/* Cliente e Ano */}
                        <div className="flex items-center justify-between text-xs font-mono text-[#9E9E9E]">
                            <span className="truncate">{project.client || t('portfolio_corporate_client', 'Solução Corporativa')}</span>
                            {project.year && <span className="flex-shrink-0 ml-2">{project.year}</span>}
                        </div>

                        {/* Título do Projeto */}
                        <h3 className="text-base sm:text-lg font-semibold text-white leading-snug group-hover:text-[#ECBD57] transition-colors line-clamp-1 tracking-[-0.02em]">
                            {project.title}
                        </h3>

                        {/* Descrição Curta */}
                        {project.description && (
                            <p className="text-[#9E9E9E] text-xs line-clamp-2 leading-relaxed font-normal">
                                {project.description}
                            </p>
                        )}
                    </div>

                    {/* Rodapé do Card: Tecnologias em Mono e CTA */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1 max-w-[70%]">
                            {techs.slice(0, 3).map((tech) => (
                                <span
                                    key={tech}
                                    className="text-[10px] font-mono text-[#ECBD57] bg-[#121212] border border-white/[0.06] px-2 py-0.5 rounded-full truncate"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center text-xs font-semibold text-[#C9A227] group-hover:translate-x-1 transition-transform duration-200 shrink-0 gap-1">
                            <span>Ver Projeto</span>
                            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
