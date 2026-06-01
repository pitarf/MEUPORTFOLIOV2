import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Palette, Camera, Code, BarChart3, Video, Target, Wrench, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data, error } = await supabase
                    .from('services')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (error) throw error;
                setServices(data || []);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Icon mapping
    const iconMap = {
        Palette, Camera, Code, BarChart3, Video, Target, Wrench, Shield
    };

    return (
        <>
            <Helmet>
                <title>Serviços - Rafael Pita Solutions</title>
                <meta name="description" content="Conheça todos os serviços oferecidos pela Rafael Pita Solutions: design gráfico, fotografia, desenvolvimento web, Power BI, vídeos com IA, tráfego pago e muito mais." />
            </Helmet>

            <div className="pt-20">
                {/* Hero Section */}
                <section className="py-20 tech-pattern">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-16"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                <span className="gradient-text">Nossos Serviços</span>
                            </h1>
                            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                                Soluções completas e personalizadas para transformar sua presença digital e impulsionar seu negócio
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {services.map((service, index) => {
                                const IconComponent = iconMap[service.icon] || Palette;
                                return (
                                    <motion.div
                                        key={service.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="service-card p-8 rounded-xl group"
                                    >
                                        <div className="flex items-start space-x-6">
                                            <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                                <IconComponent className="w-8 h-8 text-white" />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                                    {service.title}
                                                </h3>
                                                <p className="text-gray-400 mb-6 leading-relaxed">
                                                    {service.description}
                                                </p>

                                                <div className="space-y-2 mb-6">
                                                    {service.features.map((feature, idx) => (
                                                        <div key={idx} className="flex items-center space-x-2">
                                                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                            <span className="text-gray-300 text-sm">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <Link to={`/portfolio#${service.slug}`} className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                                                    <span className="text-sm font-medium">Saiba mais</span>
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Process Section */}
                <section className="py-20 bg-gray-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold gradient-text mb-6">Como Trabalhamos</h2>
                            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                                Nosso processo é estruturado para garantir resultados excepcionais em cada projeto
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {[
                                { step: '01', title: 'Análise', description: 'Entendemos suas necessidades e objetivos' },
                                { step: '02', title: 'Planejamento', description: 'Criamos uma estratégia personalizada' },
                                { step: '03', title: 'Execução', description: 'Desenvolvemos com qualidade e precisão' },
                                { step: '04', title: 'Entrega', description: 'Apresentamos resultados excepcionais' }
                            ].map((item, index) => (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-xl font-bold text-white">{item.step}</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                                    <p className="text-gray-400">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-center glass-effect p-12 rounded-2xl"
                        >
                            <h2 className="text-4xl font-bold gradient-text mb-6">
                                Pronto para começar seu projeto?
                            </h2>
                            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                                Entre em contato conosco e descubra como podemos transformar suas ideias em realidade
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/contato">
                                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4">
                                        Solicitar Orçamento
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link to="/portfolio">
                                    <Button size="lg" variant="outline" className="border-gray-600 hover:border-blue-500 text-lg px-8 py-4">
                                        Ver Portfólio
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Services;