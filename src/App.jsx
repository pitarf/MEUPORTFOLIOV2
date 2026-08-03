import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';

import Home from '@/pages/Home';
import About from '@/pages/About';
import Services from '@/pages/Services';
import Portfolio from '@/pages/Portfolio';
import ClientArea from '@/pages/ClientArea';
import Subscriptions from '@/pages/Subscriptions';
import Reviews from '@/pages/Reviews';
import Contact from '@/pages/Contact';
import PhotographyLanding from '@/pages/PhotographyLanding';
import ProjectPage from '@/pages/ProjectPage';
import ScrollToTop from '@/components/ScrollToTop';
import SEO from '@/components/SEO';
import ServiceDetailPage from '@/pages/ServiceDetailPage';

import ProtectedRoute from '@/components/ProtectedRoute';
import Dashboard from '@/pages/Dashboard';
import ManagePortfolio from '@/pages/ManagePortfolio';
import AdminSubmissions from '@/pages/AdminSubmissions';
import ManageReviews from '@/pages/ManageReviews';
import Support from '@/pages/Support';
import TrackTicket from '@/pages/TrackTicket';
import AdminSupport from '@/pages/AdminSupport';
import ManageServices from '@/pages/ManageServices';
import ManageLandingPage from '@/pages/admin/ManageLandingPage';
import ManageGeneralSettings from '@/pages/admin/ManageGeneralSettings';
import PhotographyPortfolio from '@/pages/PhotographyPortfolio';
import Profile from '@/pages/Profile';
import StorageOptimization from '@/pages/StorageOptimization';
import MainLayout from '@/components/MainLayout';
import AdminLayout from '@/components/AdminLayout';

import { SiteConfigProvider } from '@/contexts/SiteConfigContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

/**
 * Componente principal da aplicação MeuPortfolio v2 / Rafael Pita Solutions
 * Configura as rotas públicas, rotas protegidas do painel administrativo,
 * e integra os provedores de estado global do Supabase (Autenticação, Configurações de Site e Temas).
 */
const isPhotoSubdomain = typeof window !== 'undefined' && window.location.hostname.includes('fotografia');

function App() {
    return (
        <ThemeProvider>
            <SiteConfigProvider>
                <Router>
                    <ScrollToTop />
                    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                        <SEO />

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
                                <Route path="/portfolio-fotografia" element={<PhotographyLanding />} />
                                <Route path="/portfolio-fotografia/galeria" element={<PhotographyPortfolio />} />
                                {isPhotoSubdomain && <Route path="/galeria" element={<PhotographyPortfolio />} />}
                                <Route path="/avaliacoes" element={<Reviews />} />
                                <Route path="/contato" element={<Contact />} />
                                <Route path="/support" element={<Support />} />
                                <Route path="/track-ticket" element={<TrackTicket />} />
                                <Route path="/track-ticket/:ticketCode" element={<TrackTicket />} />
                            </Route>

                            {/* Rotas Administrativas - Protegidas por Autenticação JWT do Supabase */}
                            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/admin/profile" element={<Profile />} />
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
                        <Toaster />
                    </div>
                </Router>
            </SiteConfigProvider>
        </ThemeProvider>
    );
}

export default App;