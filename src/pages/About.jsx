import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Target, Eye, Heart, Award, Users, Lightbulb } from 'lucide-react';
import teamImage from '@/Assets/IMG_5637.JPG';
const About = () => {
    const values = [{
        icon: Lightbulb,
        title: 'Inovação',
        description: 'Sempre buscamos as tecnologias mais avançadas e soluções criativas para nossos clientes.'
    }, {
        icon: Award,
        title: 'Qualidade',
        description: 'Comprometimento com a excelência em cada projeto, garantindo resultados superiores.'
    }, {
        icon: Users,
        title: 'Parceria',
        description: 'Construímos relacionamentos duradouros baseados na confiança e transparência.'
    }, {
        icon: Heart,
        title: 'Paixão',
        description: 'Amamos o que fazemos e isso se reflete na dedicação em cada detalhe.'
    }];
    return <>
        <Helmet>
            <title>Sobre Nós - Rafael Pita Solutions</title>
            <meta name="description" content="Conheça a história, missão, visão e valores da Rafael Pita Solutions. Uma empresa dedicada à inovação e excelência em soluções digitais." />
        </Helmet>

        <div className="pt-20">
            {/* Hero Section */}
            <section className="py-20 tech-pattern">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{
                        opacity: 0,
                        y: 20
                    }} animate={{
                        opacity: 1,
                        y: 0
                    }} className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="gradient-text">Sobre Nós</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Conheça a história por trás da Rafael Pita Solutions e nossa paixão por transformar ideias em realidade digital
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{
                            opacity: 0,
                            x: -50
                        }} whileInView={{
                            opacity: 1,
                            x: 0
                        }} className="space-y-6">
                            <h2 className="text-4xl font-bold gradient-text">Nossa História</h2>
                            <div className="space-y-4 text-gray-300">
                                <p>
                                    A Rafael Pita Solutions nasceu da paixão por tecnologia e criatividade. Fundada com o objetivo de oferecer soluções digitais completas e inovadoras, nossa empresa cresceu rapidamente, conquistando a confiança de centenas de clientes.
                                </p>
                                <p>Fundada a partir de uma trajetória que começou com serviços de informática e design, hoje a Rafael Pita Solutions é uma empresa completa, oferecendo soluções integradas em design gráfico, fotografia, desenvolvimento de sistemas, dashboards em Power BI e estratégias de marketing digital.</p>
                                <p>
                                    Nossa jornada é marcada pela constante busca por excelência e inovação, sempre mantendo o foco na satisfação do cliente e na entrega de resultados excepcionais.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div initial={{
                            opacity: 0,
                            x: 50
                        }} whileInView={{
                            opacity: 1,
                            x: 0
                        }} className="relative">
                            <div className="glass-effect p-8 rounded-2xl">
                                <img alt="Equipe Rafael Pita Solutions trabalhando" src={teamImage} className="w-full h-auto rounded-lg shadow-lg" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission, Vision, Values */}
            <section className="py-20 bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div initial={{
                            opacity: 0,
                            y: 20
                        }} whileInView={{
                            opacity: 1,
                            y: 0
                        }} className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Missão</h3>
                            <p className="text-gray-400">
                                Transformar ideias em soluções digitais inovadoras, ajudando nossos clientes a alcançar seus objetivos através da tecnologia e criatividade.
                            </p>
                        </motion.div>

                        <motion.div initial={{
                            opacity: 0,
                            y: 20
                        }} whileInView={{
                            opacity: 1,
                            y: 0
                        }} transition={{
                            delay: 0.1
                        }} className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                                <Eye className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Visão</h3>
                            <p className="text-gray-400">
                                Ser reconhecida como a principal referência em soluções digitais criativas, liderando a transformação digital de empresas no Brasil.
                            </p>
                        </motion.div>

                        <motion.div initial={{
                            opacity: 0,
                            y: 20
                        }} whileInView={{
                            opacity: 1,
                            y: 0
                        }} transition={{
                            delay: 0.2
                        }} className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Valores</h3>
                            <p className="text-gray-400">
                                Inovação, qualidade, transparência e compromisso com o sucesso de nossos clientes são os pilares que guiam todas as nossas ações.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Detail */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{
                        opacity: 0,
                        y: 20
                    }} whileInView={{
                        opacity: 1,
                        y: 0
                    }} className="text-center mb-16">
                        <h2 className="text-4xl font-bold gradient-text mb-6">Nossos Valores</h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Os princípios que norteiam nossa empresa e garantem a excelência em tudo que fazemos
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {values.map((value, index) => <motion.div key={value.title} initial={{
                            opacity: 0,
                            y: 20
                        }} whileInView={{
                            opacity: 1,
                            y: 0
                        }} transition={{
                            delay: index * 0.1
                        }} className="service-card p-8 rounded-xl">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <value.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                                    <p className="text-gray-400">{value.description}</p>
                                </div>
                            </div>
                        </motion.div>)}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{
                        opacity: 0,
                        y: 20
                    }} whileInView={{
                        opacity: 1,
                        y: 0
                    }} className="text-center mb-16">
                        <h2 className="text-4xl font-bold gradient-text mb-6">Nossa Equipe</h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Profissionais especializados e apaixonados por tecnologia, unidos pelo objetivo comum de entregar excelência
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div initial={{
                            opacity: 0,
                            y: 20
                        }} whileInView={{
                            opacity: 1,
                            y: 0
                        }} className="text-center">
                            <div className="relative mb-6">
                                <img alt="Rafael Pita - Fundador" className="w-32 h-32 rounded-full mx-auto object-cover" src="https://horizons-cdn.hostinger.com/55810f13-6c54-4da4-a823-2e484d52677d/img_0208-aveV3.JPG" />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full"></div>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Rafael Pita</h3>
                            <p className="text-blue-400 mb-3">Fundador & CEO</p>
                            <p className="text-gray-400 text-sm">
                                Especialista em soluções digitais com mais de 10 anos de experiência em tecnologia e design.
                            </p>
                        </motion.div>

                        <motion.div initial={{
                            opacity: 0,
                            y: 20
                        }} whileInView={{
                            opacity: 1,
                            y: 0
                        }} transition={{
                            delay: 0.1
                        }} className="text-center">
                            <div className="relative mb-6">
                                <img alt="Designer Gráfico" className="w-32 h-32 rounded-full mx-auto object-cover" src="https://images.unsplash.com/photo-1495224814653-94f36c0a31ea" />
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-full"></div>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Equipe Design</h3>
                            <p className="text-purple-400 mb-3">Designers Criativos</p>
                            <p className="text-gray-400 text-sm">
                                Profissionais especializados em criar identidades visuais marcantes e experiências únicas.
                            </p>
                        </motion.div>

                        <motion.div initial={{
                            opacity: 0,
                            y: 20
                        }} whileInView={{
                            opacity: 1,
                            y: 0
                        }} transition={{
                            delay: 0.2
                        }} className="text-center">
                            <div className="relative mb-6">
                                <img alt="Equipe de Desenvolvimento" className="w-32 h-32 rounded-full mx-auto object-cover" src="https://images.unsplash.com/photo-1634836023845-eddbfe9937da" />
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-600/20 rounded-full"></div>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Equipe Tech</h3>
                            <p className="text-green-400 mb-3">Desenvolvedores</p>
                            <p className="text-gray-400 text-sm">
                                Especialistas em desenvolvimento web, mobile e soluções tecnológicas avançadas.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    </>;
};
export default About;