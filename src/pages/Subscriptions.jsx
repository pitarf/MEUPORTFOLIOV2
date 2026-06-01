import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Check, Star, Zap, Crown } from 'lucide-react';
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
                                <span className="gradient-text">Planos de Assinatura</span>
                            </h1>
                            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                                Economize tempo e dinheiro com nossos planos recorrentes. Soluções flexíveis para suas necessidades contínuas.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-20 bg-gray-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold gradient-text mb-6">Por que assinar?</h2>
                            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
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
                                    className="text-center"
                                >
                                    <div className="text-4xl mb-4">{benefit.icon}</div>
                                    <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                                    <p className="text-gray-400">{benefit.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Plans */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {plans.map((plan, index) => (
                                <motion.div
                                    key={plan.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative service-card p-8 rounded-2xl ${plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                                                Mais Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-center mb-8">
                                        <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center`}>
                                            <plan.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                        <p className="text-gray-400 mb-6">{plan.description}</p>
                                        <div className="mb-6">
                                            <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                                            <span className="text-gray-400">{plan.period}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center space-x-3">
                                                <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                                                <span className="text-gray-300 text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        onClick={() => handleSubscribe(plan.name)}
                                        className={`w-full ${plan.popular
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                                            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                                            }`}
                                    >
                                        Assinar {plan.name}
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-gray-900/50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold gradient-text mb-6">Perguntas Frequentes</h2>
                            <p className="text-xl text-gray-400">
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
                                    className="glass-effect p-6 rounded-xl"
                                >
                                    <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                                    <p className="text-gray-400">{faq.answer}</p>
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
                                Ainda tem dúvidas?
                            </h2>
                            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                                Entre em contato conosco e descubra qual plano é ideal para seu negócio
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4">
                                    Falar com Especialista
                                </Button>
                                <Button size="lg" variant="outline" className="border-gray-600 hover:border-blue-500 text-lg px-8 py-4">
                                    Ver Projetos Avulsos
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Subscriptions;