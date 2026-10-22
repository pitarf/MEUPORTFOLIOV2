import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';

// Componentes estruturais e utilitários mantidos no bundle base para renderização ágil
import ScrollToTop from '@/components/ScrollToTop';
import SEO from '@/components/SEO';
import GTMRouteTracker from '@/components/GTMRouteTracker';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/MainLayout';
import AdminLayout from '@/components/AdminLayout';

import { SiteConfigProvider } from '@/contexts/SiteConfigContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Divisão de código com React.lazy: cada rota pública ou administrativa carrega apenas seu próprio chunk
const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Services = lazy(() => import('@/pages/Services'));
const Portfolio = lazy(() => import('@/pages/Portfolio'));
const ClientArea = lazy(() => import('@/pages/ClientArea'));
const Subscriptions = lazy(() => import('@/pages/Subscriptions'));
const Reviews = lazy(() => import('@/pages/Reviews'));
const Contact = lazy(() => import('@/pages/Contact'));
const PhotographyLanding = lazy(() => import('@/pages/PhotographyLanding'));
const ProjectPage = lazy(() => import('@/pages/ProjectPage'));
const ServiceDetailPage = lazy(() => import('@/pages/ServiceDetailPage'));

// Páginas de suporte e área do cliente
const Support = lazy(() => import('@/pages/Support'));
const TrackTicket = lazy(() => import('@/pages/TrackTicket'));
const ClientProjectTrack = lazy(() => import('@/pages/ClientProjectTrack'));
const ClientSubscriptionPortal = lazy(() => import('@/pages/ClientSubscriptionPortal'));

// Landing pages jurídicas e prospecção
const LegalLandingPage = lazy(() => import('@/pages/legal/LegalLandingPage'));
const LegalSalesLandingPage = lazy(() => import('@/pages/legal/LegalSalesLandingPage'));
const RadarGoogleMaps = lazy(() => import('@/pages/admin/RadarGoogleMaps'));

// Landing pages de nutricionistas e vendas
const NutritionistPage = lazy(() => import('@/pages/nutrition/NutritionistPage'));
const NutritionSalesLandingPage = lazy(() => import('@/pages/nutrition/NutritionSalesLandingPage'));

// Painel administrativo sob demanda (não sobrecarrega o carregamento para visitantes públicos)
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ManagePortfolio = lazy(() => import('@/pages/ManagePortfolio'));
const AdminSubmissions = lazy(() => import('@/pages/AdminSubmissions'));
const ManageReviews = lazy(() => import('@/pages/ManageReviews'));
const AdminSupport = lazy(() => import('@/pages/AdminSupport'));
const ManageServices = lazy(() => import('@/pages/ManageServices'));
const ManageLandingPage = lazy(() => import('@/pages/admin/ManageLandingPage'));
const ManageGeneralSettings = lazy(() => import('@/pages/admin/ManageGeneralSettings'));
const PhotographyPortfolio = lazy(() => import('@/pages/PhotographyPortfolio'));
const Profile = lazy(() => import('@/pages/Profile'));
const StorageOptimization = lazy(() => import('@/pages/StorageOptimization'));
const ManageBudgets = lazy(() => import('@/pages/admin/ManageBudgets'));
const ManageMaintenanceSubscriptions = lazy(() => import('@/pages/admin/ManageMaintenanceSubscriptions'));
const ManageLegalProspects = lazy(() => import('@/pages/admin/ManageLegalProspects'));

/**
 * Componente principal da aplicação MeuPortfolio v2 / Rafael Pita Solutions
 * Configura as rotas públicas, rotas protegidas do painel administrativo,
 * e integra os provedores de estado global (Autenticação, Configurações de Site, Temas e Idiomas).
 */
const isPhotoSubdomain = typeof window !== 'undefined' && window.location.hostname.includes('fotografia');

function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <SiteConfigProvider>
                <Router>
                    <ScrollToTop />
                    <GTMRouteTracker />
                    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                        <SEO />

                        <Suspense fallback={<div className="min-h-screen bg-background" />}>
                            <Routes>
                                {/* Rotas Públicas - Envolvidas com o MainLayout */}
                                <Route element={<MainLayout />}>
                                    <Route path="/" element={isPhotoSubdomain ? <PhotographyLanding /> : <Home />} />
                                    <Route path="/sobre" element={<About />} />
                                    <Route path="/servicos" element={<Services />} />
                                    <Route path="/criacao-de-sites" element={<ServiceDetailPage serviceSlug="criacao-de-sites" />} />
                                    <Route path="/landing-pages" element={<ServiceDetailPage serviceSlug="landing-pages" />} />
                                    <Route path="/desenvolvimento-de-sistemas" element={<ServiceDetailPage serviceSlug="desenvolvimento-de-sistemas" />} />
                                    <Route path="/automacoes" element={<ServiceDetailPage serviceSlug="automacoes" />} />
                                    <Route path="/dashboards-power-bi" element={<ServiceDetailPage serviceSlug="dashboards-power-bi" />} />
                                    <Route path="/fotografia-eventos" element={<ServiceDetailPage serviceSlug="fotografia-eventos" />} />
                                    <Route path="/fotografia-corporativa" element={<ServiceDetailPage serviceSlug="fotografia-corporativa" />} />
                                    <Route path="/portfolio" element={<Portfolio />} />
                                    <Route path="/portfolio/:categorySlug/:projectSlug" element={<ProjectPage />} />
                                    <Route path="/area-clientes" element={<ClientArea />} />
                                    <Route path="/assinaturas" element={<Subscriptions />} />
                                    <Route path="/minha-assinatura" element={<ClientSubscriptionPortal />} />
                                    <Route path="/area-cliente-assinaturas" element={<ClientSubscriptionPortal />} />
                                    <Route path="/portfolio-fotografia" element={<PhotographyLanding />} />
                                    <Route path="/portfolio-fotografia/galeria" element={<PhotographyPortfolio />} />
                                    {isPhotoSubdomain && <Route path="/galeria" element={<PhotographyPortfolio />} />}
                                    <Route path="/avaliacoes" element={<Reviews />} />
                                    <Route path="/contato" element={<Contact />} />
                                    <Route path="/support" element={<Support />} />
                                    <Route path="/track-ticket" element={<TrackTicket />} />
                                    <Route path="/track-ticket/:ticketCode" element={<TrackTicket />} />
                                    <Route path="/projeto" element={<ClientProjectTrack />} />
                                    <Route path="/projeto/:budgetCode" element={<ClientProjectTrack />} />
                                    <Route path="/acompanhar-projeto/:budgetCode" element={<ClientProjectTrack />} />
                                </Route>

                                {/* Rotas Especiais de Demonstração & Landing Pages de Advocacia (Layout Dedicado Próprio) */}
                                <Route path="/advocacia" element={<LegalLandingPage />} />
                                <Route path="/advocacia/:slug" element={<LegalLandingPage />} />
                                <Route path="/adv/:slug" element={<LegalLandingPage />} />
                                <Route path="/modelo-advocacia/:niche" element={<LegalLandingPage />} />

                                {/* Nova Landing Page de Vendas de Criação de Sites para Advogados */}
                                <Route path="/criacao-site-advogado" element={<LegalSalesLandingPage />} />
                                <Route path="/sites-para-advogados" element={<LegalSalesLandingPage />} />

                                {/* Landing Pages de Demonstração & Vendas para Nutricionistas */}
                                <Route path="/nutricionista" element={<NutritionistPage />} />
                                <Route path="/nutricionista/:slug" element={<NutritionistPage />} />
                                <Route path="/criacao-site-nutricionista" element={<NutritionSalesLandingPage />} />
                                <Route path="/sites-para-nutricionistas" element={<NutritionSalesLandingPage />} />
                                
                                {/* Acesso Direto ao Radar Google Maps de Prospecção */}
                                <Route path="/radar-google-maps" element={<RadarGoogleMaps />} />
                                <Route path="/clientes/radar-maps" element={<RadarGoogleMaps />} />

                                {/* Rotas Administrativas - Protegidas por Autenticação JWT do Supabase */}
                                <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/admin/profile" element={<Profile />} />
                                    <Route path="/admin/orcamentos" element={<ProtectedRoute adminOnly={true}><ManageBudgets /></ProtectedRoute>} />
                                    <Route path="/admin/assinaturas" element={<ProtectedRoute adminOnly={true}><ManageMaintenanceSubscriptions /></ProtectedRoute>} />
                                    <Route path="/admin/radar-google-maps" element={<ProtectedRoute adminOnly={true}><RadarGoogleMaps /></ProtectedRoute>} />
                                    <Route path="/admin/prospeccao-advogados" element={<ProtectedRoute adminOnly={true}><ManageLegalProspects /></ProtectedRoute>} />
                                    <Route path="/admin/portfolio" element={<ProtectedRoute adminOnly={true}><ManagePortfolio /></ProtectedRoute>} />
                                    <Route path="/admin/submissions" element={<ProtectedRoute adminOnly={true}><AdminSubmissions /></ProtectedRoute>} />
                                    <Route path="/admin/reviews" element={<ProtectedRoute adminOnly={true}><ManageReviews /></ProtectedRoute>} />
                                    <Route path="/admin/support" element={<ProtectedRoute adminOnly={true}><AdminSupport /></ProtectedRoute>} />
                                    <Route path="/admin/services" element={<ProtectedRoute adminOnly={true}><ManageServices /></ProtectedRoute>} />
                                    <Route path="/admin/storage" element={<ProtectedRoute adminOnly={true}><StorageOptimization /></ProtectedRoute>} />
                                    <Route path="/admin/landing-page" element={<ProtectedRoute adminOnly={true}><ManageLandingPage /></ProtectedRoute>} />
                                    <Route path="/admin/settings" element={<ProtectedRoute adminOnly={true}><ManageGeneralSettings /></ProtectedRoute>} />
                                </Route>
                            </Routes>
                        </Suspense>
                        <Toaster />
                    </div>
                </Router>
            </SiteConfigProvider>
        </LanguageProvider>
    </ThemeProvider>
    );
}

export default App;