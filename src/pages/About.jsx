import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Target, Eye, Heart, Award, Users, Lightbulb } from 'lucide-react';
import teamImage from '@/Assets/team-work.webp';

const About = () => {
    const values = [
        {
            icon: Lightbulb,
            title: 'Inovação',
            description: 'Sempre buscamos as tecnologias mais avançadas e soluções criativas para nossos clientes.'
        },
        {
            icon: Award,
            title: 'Qualidade',
            description: 'Comprometimento com a excelência em cada projeto, garantindo resultados superiores.'
        },
        {
            icon: Users,
            title: 'Parceria',
            description: 'Construímos relacionamentos duradouros baseados na confiança e transparência.'
        },
        {
            icon: Heart,
            title: 'Paixão',
            description: 'Amamos o que fazemos e isso se reflete na dedicação em cada detalhe.'
        }
    ];

    const teamMembers = [
        {
            name: 'Rafael Pita',
            role: 'Fundador & CEO',
            bio: 'Especialista em soluções digitais com mais de 10 anos de experiência em tecnologia e design.',
            image: 'https://horizons-cdn.hostinger.com/55810f13-6c54-4da4-a823-2e484d52677d/img_0208-aveV3.JPG'
        },
        {
            name: 'Equipe Design',
            role: 'Designers Criativos',
            bio: 'Profissionais especializados em criar identidades visuais marcantes e experiências únicas.',
            image: 'https://images.unsplash.com/photo-1495224814653-94f36c0a31ea'
        },
        {
            name: 'Equipe Tech',
            role: 'Desenvolvedores',
            bio: 'Especialistas em desenvolvimento web, mobile e soluções tecnológicas avançadas.',
            image: 'https://images.unsplash.com/photo-1634836023845-eddbfe9937da'
        }
    ];

    return (
        <>
            <SEO 
                title="Sobre Nós - Rafael Pita Solutions | Criatividade e Tecnologia"
                description="Conheça a história, missão, visão e valores da Rafael Pita Solutions. Empresa especializada em desenvolvimento web, sistemas, Power BI e fotografia profissional."
                keywords="sobre rafael pita solutions, equipe rafael pita, empresa desenvolvimento de sites rj, missao visao valores pita solutions"
            />

            <div className="pt-20 min-h-screen bg-slate-50 dark:bg-[#0a0a08] text-slate-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
                {/* Hero Section */}
                <section className="py-20 relative bg-slate-50 dark:bg-[#0a0a08]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-16"
                        >
                            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
                                Sobre <span className="text-[#4d7c0f] dark:text-[#bcf13b]">Nós</span>
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
                                Conheça a história por trás da Rafael Pita Solutions e nossa paixão por transformar ideias em realidade digital
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-20 overflow-hidden bg-slate-50 dark:bg-[#0a0a08]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                                    Nossa <span className="text-[#4d7c0f] dark:text-[#bcf13b]">História</span>
                                </h2>
                                <div className="space-y-4 text-slate-600 dark:text-gray-300 font-medium leading-relaxed">
                                    <p>
                                        A Rafael Pita Solutions nasceu da paixão por tecnologia e criatividade. Fundada com o objetivo de oferecer soluções digitais completas e inovadoras, nossa empresa cresceu rapidamente, conquistando a confiança de centenas de clientes.
                                    </p>
                                    <p>
                                        Fundada a partir de uma trajetória que começou com serviços de informática e design, hoje a Rafael Pita Solutions é uma empresa completa, oferecendo soluções integradas em design gráfico, fotografia, desenvolvimento de sistemas, dashboards em Power BI e estratégias de marketing digital.
                                    </p>
                                    <p>
                                        Nossa jornada é marcada pela constante busca por excelência e inovação, sempre mantendo o foco na satisfação do cliente e na entrega de resultados excepcionais.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="relative"
                            >
                                <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b]/50 transition-colors shadow-sm dark:shadow-none">
                                    <img
                                        alt="Equipe Rafael Pita Solutions trabalhando"
                                        src={teamImage}
                                        className="w-full h-auto rounded-lg shadow-lg"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Mission, Vision, Values */}
                <section className="py-20 bg-slate-100/60 dark:bg-[#121210] border-y border-slate-200 dark:border-[#23231f] overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="text-center space-y-4 p-8 rounded-xl bg-white dark:bg-[#181814] border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b] hover:shadow-[0_0_20px_rgba(77,124,15,0.15)] dark:hover:shadow-[0_0_20px_rgba(188,241,59,0.15)] transition-all duration-300 group shadow-sm"
                            >
                                <div className="w-16 h-16 mx-auto bg-slate-50 dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] group-hover:border-lime-500 dark:group-hover:border-[#bcf13b] rounded-full flex items-center justify-center shadow-md transition-colors">
                                    <Target className="w-8 h-8 text-[#4d7c0f] dark:text-[#bcf13b]" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#4d7c0f] dark:group-hover:text-[#bcf13b] transition-colors">Missão</h3>
                                <p className="text-slate-600 dark:text-gray-400 font-medium">
                                    Transformar ideias em soluções digitais inovadoras, ajudando nossos clientes a alcançar seus objetivos através da tecnologia e criatividade.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-center space-y-4 p-8 rounded-xl bg-white dark:bg-[#181814] border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b] hover:shadow-[0_0_20px_rgba(77,124,15,0.15)] dark:hover:shadow-[0_0_20px_rgba(188,241,59,0.15)] transition-all duration-300 group shadow-sm"
                            >
                                <div className="w-16 h-16 mx-auto bg-slate-50 dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] group-hover:border-lime-500 dark:group-hover:border-[#bcf13b] rounded-full flex items-center justify-center shadow-md transition-colors">
                                    <Eye className="w-8 h-8 text-[#4d7c0f] dark:text-[#bcf13b]" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#4d7c0f] dark:group-hover:text-[#bcf13b] transition-colors">Visão</h3>
                                <p className="text-slate-600 dark:text-gray-400 font-medium">
                                    Ser reconhecida como a principal referência em soluções digitais criativas, liderando a transformação digital de empresas no Brasil.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-center space-y-4 p-8 rounded-xl bg-white dark:bg-[#181814] border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b] hover:shadow-[0_0_20px_rgba(77,124,15,0.15)] dark:hover:shadow-[0_0_20px_rgba(188,241,59,0.15)] transition-all duration-300 group shadow-sm"
                            >
                                <div className="w-16 h-16 mx-auto bg-slate-50 dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] group-hover:border-lime-500 dark:group-hover:border-[#bcf13b] rounded-full flex items-center justify-center shadow-md transition-colors">
                                    <Heart className="w-8 h-8 text-[#4d7c0f] dark:text-[#bcf13b]" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#4d7c0f] dark:group-hover:text-[#bcf13b] transition-colors">Valores</h3>
                                <p className="text-slate-600 dark:text-gray-400 font-medium">
                                    Inovação, qualidade, transparência e compromisso com o sucesso de nossos clientes são os pilares que guiam todas as nossas ações.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Values Detail */}
                <section className="py-20 overflow-hidden bg-slate-50 dark:bg-[#0a0a08]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
                                Nossos <span className="text-[#4d7c0f] dark:text-[#bcf13b]">Valores</span>
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
                                Os princípios que norteiam nossa empresa e garantem a excelência em tudo que fazemos
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {values.map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="service-card p-8 rounded-xl border border-slate-200 dark:border-[#23231f] bg-white dark:bg-[#121210] hover:border-lime-500 dark:hover:border-[#bcf13b] hover:shadow-[0_0_20px_rgba(77,124,15,0.15)] dark:hover:shadow-[0_0_20px_rgba(188,241,59,0.15)] transition-all duration-300 group shadow-sm"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="w-12 h-12 bg-slate-50 dark:bg-[#181814] border border-slate-200 dark:border-[#23231f] group-hover:border-lime-500 dark:group-hover:border-[#bcf13b] rounded-lg flex items-center justify-center flex-shrink-0 transition-colors shadow-md">
                                            <value.icon className="w-6 h-6 text-[#4d7c0f] dark:text-[#bcf13b]" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#4d7c0f] dark:group-hover:text-[#bcf13b] transition-colors">{value.title}</h3>
                                            <p className="text-slate-600 dark:text-gray-400 font-medium leading-relaxed">{value.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 bg-slate-100/60 dark:bg-[#121210] border-t border-slate-200 dark:border-[#23231f] overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
                                Nossa <span className="text-[#4d7c0f] dark:text-[#bcf13b]">Equipe</span>
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
                                Profissionais especializados e apaixonados por tecnologia, unidos pelo objetivo comum de entregar excelência
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {teamMembers.map((member, index) => (
                                <motion.div
                                    key={member.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center p-8 rounded-xl bg-white dark:bg-[#181814] border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b] hover:shadow-[0_0_20px_rgba(77,124,15,0.15)] dark:hover:shadow-[0_0_20px_rgba(188,241,59,0.15)] transition-all duration-300 group shadow-sm"
                                >
                                    <div className="relative mb-6 inline-block">
                                        <img
                                            alt={member.name}
                                            className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-slate-200 dark:border-[#23231f] group-hover:border-lime-500 dark:group-hover:border-[#bcf13b] shadow-xl transition-all duration-300"
                                            src={member.image}
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#4d7c0f] dark:group-hover:text-[#bcf13b] transition-colors">{member.name}</h3>
                                    <p className="text-[#4d7c0f] dark:text-[#bcf13b] mb-3 font-bold">{member.role}</p>
                                    <p className="text-slate-600 dark:text-gray-400 text-sm font-medium leading-relaxed">
                                        {member.bio}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-slate-50 dark:bg-[#0a0a08] border-t border-slate-200 dark:border-[#23231f]">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                            Vamos construir algo incrível <span className="text-[#4d7c0f] dark:text-[#bcf13b]">juntos</span>?
                        </h2>
                        <p className="text-slate-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto font-medium text-lg">
                            Entre em contato conosco e descubra como podemos acelerar seu negócio digital com excelência e tecnologia de ponta.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/contato"
                                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#bcf13b] hover:bg-[#a8df2a] text-[#0a0a08] font-bold rounded-lg shadow-lg shadow-[#bcf13b]/20 transition-all text-base"
                            >
                                Iniciar Projeto
                            </Link>
                            <Link
                                to="/servicos"
                                className="inline-flex items-center justify-center px-8 py-3.5 bg-white dark:bg-transparent border border-slate-300 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b] text-slate-900 dark:text-white hover:text-[#4d7c0f] dark:hover:text-[#bcf13b] font-bold rounded-lg transition-all text-base shadow-sm dark:shadow-none"
                            >
                                Conhecer Serviços
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default About;