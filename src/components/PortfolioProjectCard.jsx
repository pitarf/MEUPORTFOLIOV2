import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';

/**
 * Componente de Card de Projeto do Portfólio
 * Utilizado de forma unificada tanto no Grid Desktop quanto no Carrossel Horizontal Mobile.
 *
 * @param {Object} props - Propriedades do componente.
 * @param {Object} props.project - Dados do projeto.
 * @param {Object} props.cat - Categoria associada ao projeto.
 * @param {string[]} props.techs - Pílulas de tecnologia calculadas para o projeto.
 * @param {string} props.effectiveBasePath - Caminho base para links internos (/portfolio ou /portfolio-v2).
 * @param {Function} props.t - Função de internacionalização (i18n).
 * @param {boolean} [props.isCarousel=false] - Se o card está inserido dentro de um carrossel horizontal.
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
                group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-[#23231f]
                hover:border-lime-500 dark:hover:border-[#bcf13b] shadow-sm hover:shadow-md dark:shadow-none
                hover:shadow-lime-500/10 dark:hover:shadow-[0_0_20px_rgba(188,241,59,0.15)]
                transition-all duration-300 cursor-pointer bg-white dark:bg-[#121210] flex flex-col h-full
                ${isCarousel ? 'select-none' : ''}
            `}
        >
            <Link to={projectUrl} className="flex flex-col h-full w-full">
                {/* Imagem de Fundo com Proporção 16:10 */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-[#181814]">
                    <img
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={project.main_image_url || 'https://images.unsplash.com/photo-1572177812156-58036aae439c'}
                        loading="lazy"
                    />

                    {/* Gradiente sutil no hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-[#121210]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badge da Categoria sobre a Imagem */}
                    <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center text-[11px] font-bold text-[#0a0a08] px-2.5 py-1 rounded-full bg-[#bcf13b] shadow-sm uppercase tracking-wider">
                            {categoryTitle}
                        </span>
                    </div>

                    {/* Ícone de Link Externo no Hover */}
                    <div className="absolute top-3 right-3 z-10 bg-white/90 dark:bg-[#121210]/90 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-md border border-slate-200 dark:border-[#23231f]">
                        <ExternalLink className="w-3.5 h-3.5 text-[#4d7c0f] dark:text-[#bcf13b]" />
                    </div>
                </div>

                {/* Conteúdo do Card Abaixo da Imagem */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3 bg-white dark:bg-[#121210]">
                    <div className="space-y-1.5">
                        {/* Cliente e Ano */}
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-gray-400">
                            <span className="truncate">{project.client || t('portfolio_corporate_client', 'Cliente Corporativo')}</span>
                            {project.year && <span className="flex-shrink-0 ml-2">{project.year}</span>}
                        </div>

                        {/* Título do Projeto */}
                        <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-[#4d7c0f] dark:group-hover:text-[#bcf13b] transition-colors line-clamp-1">
                            {project.title}
                        </h3>

                        {/* Descrição Curta */}
                        {project.description && (
                            <p className="text-slate-600 dark:text-gray-400 text-xs line-clamp-2 leading-relaxed font-normal">
                                {project.description}
                            </p>
                        )}
                    </div>

                    {/* Rodapé do Card: Tecnologias e Call to Action */}
                    <div className="pt-3 border-t border-slate-100 dark:border-[#23231f] flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1 max-w-[70%]">
                            {techs.slice(0, 3).map((tech) => (
                                <span
                                    key={tech}
                                    className="text-[10px] font-semibold text-lime-700 dark:text-[#bcf13b] bg-lime-50 dark:bg-[#bcf13b]/10 border border-lime-200 dark:border-[#bcf13b]/20 px-1.5 sm:px-2 py-0.5 rounded truncate"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center text-xs font-bold text-[#4d7c0f] dark:text-[#bcf13b] group-hover:translate-x-1 transition-transform duration-200 shrink-0">
                            <span>{t('portfolio_view_case', 'Ver Case')}</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
