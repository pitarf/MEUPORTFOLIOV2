import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Check, Star, Zap, Crown, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Subscriptions = () => {
    const plans = [
        {
            name: 'Básico',
            icon: Star,
            price: 'R$ 299',
            period: '/mês',
            description: 'Ideal para pequenos negócios que estão começando',
            features: [
                '2 projetos de design por mês',
                'Suporte por email',
                'Revisões ilimitadas',
                'Entrega em até 5 dias úteis',
                'Formatos básicos (JPG, PNG)',
                'Consultoria mensal (1h)'
            ],
            color: 'from-blue-500 to-cyan-600',
            popular: false
        },
        {
            name: 'Profissional',
            icon: Zap,
            price: 'R$ 599',
            period: '/mês',
            description: 'Perfeito para empresas em crescimento',
            features: [
                '5 projetos de design por mês',
                'Suporte prioritário',
                'Revisões ilimitadas',
                'Entrega em até 3 dias úteis',
                'Todos os formatos inclusos',
                'Consultoria quinzenal (2h)',
                '1 projeto web simples',
                'Relatórios mensais'
            ],
            color: 'from-purple-500 to-pink-600',
            popular: true
        },
        {
            name: 'Enterprise',
            icon: Crown,
            price: 'R$ 1.299',
            period: '/mês',
            description: 'Solução completa para grandes empresas',
            features: [
                'Projetos ilimitados',
                'Suporte 24/7',
                'Revisões ilimitadas',
                'Entrega em até 24h',
                'Todos os formatos inclusos',
                'Consultoria semanal (4h)',
                'Projetos web complexos',
                'Dashboard personalizado',
                'Gerente de conta dedicado',
                'Treinamento da equipe'
            ],
            color: 'from-yellow-500 to-orange-600',
            popular: false
        }
    ];

    const benefits = [
        {
            title: 'Economia Garantida',
            description: 'Economize até 40% comparado aos projetos avulsos',
            icon: '💰'
        },
        {
            title: 'Prioridade Total',
            description: 'Seus projetos sempre terão prioridade na fila',
            icon: '⚡'
        },
        {
            title: 'Flexibilidade',
            description: 'Pause ou cancele sua assinatura a qualquer momento',
            icon: '🔄'
        },
        {
            title: 'Suporte Dedicado',
            description: 'Acesso direto à nossa equipe especializada',
            icon: '🎯'
        }
    ];

    const handleSubscribe = (planName) => {
        toast({
            title: "🚧 Assinatura em desenvolvimento",
            description: `O plano ${planName} será implementado em breve! Entre em contato para mais informações.`,
            duration: 4000,
        });
    };

    return (
        <>
            <Helmet>
                <title>Assinaturas - Rafael Pita Solutions</title>
                <meta name="description" content="Conheça nossos planos de assinatura e economize em seus projetos recorrentes. Soluções flexíveis para empresas de todos os tamanhos." />
            </Helmet>

            <div className="pt-20 min-h-screen bg-slate-50 dark:bg-[#0a0a08] text-slate-900 dark:text-white transition-colors duration-300">
                {/* Hero Section */}
                <section className="py-20 bg-slate-50 dark:bg-[#0a0a08] tech-pattern">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-16 space-y-4"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-slate-900 dark:text-white">
                                Planos de <span className="text-[#4d7c0f] dark:text-[#bcf13b]">Assinatura</span>
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
                                Economize tempo e dinheiro com nossos planos recorrentes. Soluções flexíveis para suas necessidades contínuas.
                            </p>

                            {/* Banner do Portal do Assinante */}
                            <div className="mt-8 inline-block max-w-2xl mx-auto">
                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b]/50 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-left transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#181814] border border-slate-200 dark:border-[#23231f] text-[#4d7c0f] dark:text-[#bcf13b] flex-shrink-0 mt-0.5">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                                Já é nosso cliente de Manutenção?
                                            </h3>
                                            <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">
                                                Acesse o Portal do Assinante sem senha para pagar faturas com PIX, obter recibos e abrir chamados.
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        to="/minha-assinatura"
                                        className="w-full sm:w-auto flex-shrink-0 px-4 py-2.5 rounded-xl bg-[#bcf13b] hover:bg-[#a8df2a] text-[#0a0a08] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                                    >
                                        Acessar Portal
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-20 bg-slate-100/60 dark:bg-[#0a0a08] border-y border-slate-200 dark:border-[#23231f]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-center mb-16 space-y-4"
                        >
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Por que <span className="text-[#4d7c0f] dark:text-[#bcf13b]">assinar?</span>
                            </h2>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto font-medium">
                                Vantagens exclusivas para quem escolhe nossos serviços recorrentes
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={benefit.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center p-6 rounded-2xl bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b] hover:shadow-[0_0_20px_rgba(77,124,15,0.15)] dark:hover:shadow-[0_0_20px_rgba(188,241,59,0.15)] transition-all shadow-sm"
                                >
                                    <div className="text-4xl mb-4">{benefit.icon}</div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{benefit.title}</h3>
                                    <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed font-medium">{benefit.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Plans */}
                <section className="py-20 bg-slate-50 dark:bg-[#0a0a08]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                            {plans.map((plan, index) => (
                                <motion.div
                                    key={plan.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative p-8 rounded-2xl flex flex-col justify-between transition-all shadow-sm ${
                                        plan.popular
                                            ? 'bg-white dark:bg-[#121210] border-2 border-lime-600 dark:border-[#bcf13b] shadow-[0_0_30px_rgba(77,124,15,0.15)] dark:shadow-[0_0_30px_rgba(188,241,59,0.2)] md:-translate-y-2'
                                            : 'bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b] hover:shadow-[0_0_20px_rgba(77,124,15,0.15)] dark:hover:shadow-[0_0_20px_rgba(188,241,59,0.15)]'
                                    }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-[#bcf13b] text-[#0a0a08] px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md">
                                                Mais Popular
                                            </span>
                                        </div>
                                    )}

                                    <div>
                                        <div className="text-center mb-8">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-[#181814] border border-slate-200 dark:border-[#23231f] rounded-full flex items-center justify-center">
                                                <plan.icon className="w-8 h-8 text-[#4d7c0f] dark:text-[#bcf13b]" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                                            <p className="text-slate-600 dark:text-gray-400 text-sm mb-6 font-medium">{plan.description}</p>
                                            <div className="mb-6 flex items-baseline justify-center">
                                                <span className="text-4xl md:text-5xl font-extrabold text-[#4d7c0f] dark:text-[#bcf13b]">{plan.price}</span>
                                                <span className="text-slate-500 dark:text-gray-400 font-medium ml-1.5">{plan.period}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3.5 mb-8">
                                            {plan.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start space-x-3">
                                                    <Check className="w-5 h-5 text-[#4d7c0f] dark:text-[#bcf13b] flex-shrink-0 mt-0.5" />
                                                    <span className="text-slate-700 dark:text-gray-300 text-sm font-medium">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => handleSubscribe(plan.name)}
                                        className={`w-full py-6 rounded-xl font-bold text-base transition-all ${
                                            plan.popular
                                                ? 'bg-[#bcf13b] hover:bg-[#a8df2a] text-[#0a0a08] shadow-lg shadow-[#bcf13b]/20'
                                                : 'bg-slate-100 dark:bg-[#181814] border border-slate-300 dark:border-[#23231f] text-slate-800 dark:text-white hover:border-lime-500 dark:hover:border-[#bcf13b] hover:text-[#4d7c0f] dark:hover:text-[#bcf13b]'
                                        }`}
                                    >
                                        Assinar Agora
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-slate-100/60 dark:bg-[#0a0a08] border-y border-slate-200 dark:border-[#23231f]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-center mb-16 space-y-4"
                        >
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Perguntas <span className="text-[#4d7c0f] dark:text-[#bcf13b]">Frequentes</span>
                            </h2>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 font-medium">
                                Tire suas dúvidas sobre nossos planos de assinatura
                            </p>
                        </motion.div>

                        <div className="space-y-6">
                            {[
                                {
                                    question: 'Posso cancelar minha assinatura a qualquer momento?',
                                    answer: 'Sim! Você pode pausar ou cancelar sua assinatura a qualquer momento, sem taxas de cancelamento.'
                                },
                                {
                                    question: 'O que acontece se eu não usar todos os projetos do mês?',
                                    answer: 'Os projetos não utilizados não acumulam para o próximo mês, mas oferecemos flexibilidade para ajustar seu plano conforme necessário.'
                                },
                                {
                                    question: 'Posso fazer upgrade ou downgrade do meu plano?',
                                    answer: 'Claro! Você pode alterar seu plano a qualquer momento. As mudanças entram em vigor no próximo ciclo de cobrança.'
                                },
                                {
                                    question: 'Há desconto para pagamento anual?',
                                    answer: 'Sim! Oferecemos 15% de desconto para assinaturas anuais. Entre em contato para mais detalhes.'
                                }
                            ].map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 rounded-xl bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] hover:border-lime-500 dark:hover:border-[#bcf13b]/50 transition-all shadow-sm"
                                >
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{faq.question}</h3>
                                    <p className="text-slate-600 dark:text-gray-400 leading-relaxed font-medium">{faq.answer}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-slate-50 dark:bg-[#0a0a08]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-center bg-white dark:bg-[#121210] border border-slate-200 dark:border-[#23231f] p-12 rounded-3xl shadow-xl max-w-4xl mx-auto"
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                                Ainda tem <span className="text-[#4d7c0f] dark:text-[#bcf13b]">dúvidas?</span>
                            </h2>
                            <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto font-medium">
                                Entre em contato conosco e descubra qual plano é ideal para seu negócio
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/contato">
                                    <Button size="lg" className="w-full sm:w-auto bg-[#bcf13b] hover:bg-[#a8df2a] text-[#0a0a08] font-bold text-lg px-8 py-6 rounded-xl shadow-lg shadow-[#bcf13b]/20">
                                        Falar com Especialista
                                    </Button>
                                </Link>
                                <Link to="/portfolio">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-300 dark:border-[#23231f] bg-slate-100 dark:bg-[#181814] text-slate-800 dark:text-white hover:border-lime-500 dark:hover:border-[#bcf13b] hover:text-[#4d7c0f] dark:hover:text-[#bcf13b] text-lg px-8 py-6 rounded-xl font-bold">
                                        Ver Projetos Avulsos
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

export default Subscriptions;