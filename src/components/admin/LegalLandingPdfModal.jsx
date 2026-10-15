import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
    Download,
    Printer,
    FileText,
    Star,
    Shield,
    CheckCircle2,
    Calendar,
    Phone,
    MapPin,
    Globe,
    Layers,
    Sparkles,
    Loader2,
    Check
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import WhatsAppIcon from '@/components/common/WhatsAppIcon';
import { cleanLawyerName } from '@/utils/lawyerNameFormatter';
import { formatLawyerSalutation } from '@/utils/greetingUtils';
import { LEGAL_NICHES } from '@/data/legalTemplates';
import { buildDemoUrl } from '@/services/googleMapsProspectService';

/**
 * Modal de Visualizacao e Exportacao da Previa da Landing Page Juridica em PDF.
 * Permite ao consultor baixar um PDF executivo e enviar diretamente pelo WhatsApp
 * para advogados que tem receio de clicar em links externos.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen Estado de visibilidade do modal
 * @param {Function} props.onClose Callback ao fechar
 * @param {Object|null} props.lawyer Dados do advogado prospectado
 */
export default function LegalLandingPdfModal({ isOpen, onClose, lawyer }) {
    const { toast } = useToast();
    const pdfRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

    if (!lawyer) return null;

    const salutation = formatLawyerSalutation(lawyer.lawyer_name || lawyer.name);
    const lawyerName = salutation.fullNameWithTitle;
    const city = lawyer.city || 'sua regiao';
    const state = lawyer.state || 'BR';
    const oab = lawyer.oab_number || lawyer.oab || `Inscrição Regular OAB/${state}`;
    const rating = lawyer.rating ? Number(lawyer.rating).toFixed(1) : '5.0';
    const reviewsCount = lawyer.reviews_count || 48;
    const phone = lawyer.phone || lawyer.whatsapp || '(00) 00000-0000';
    const targetNiche = lawyer.niche || 'geral';
    const nicheInfo = LEGAL_NICHES[targetNiche] || LEGAL_NICHES.geral;
    const demoUrl = buildDemoUrl(lawyer, window.location.origin);

    /**
     * Gera e baixa o arquivo PDF no formato A4 corporativo de alta resolucao
     */
    const handleDownloadPdf = async () => {
        if (!pdfRef.current) return;
        setDownloading(true);

        const safeName = salutation.cleanName
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `Previa_Site_${safeName}.pdf`;

        const opt = {
            margin: [6, 6, 6, 6],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                scrollY: 0
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            },
            pagebreak: { mode: ['css', 'legacy'] }
        };

        try {
            const getPdfGenerator = () => (typeof html2pdf === 'function' ? html2pdf : html2pdf?.default || window?.html2pdf);
            const pdfFactory = getPdfGenerator();
            if (!pdfFactory) {
                throw new Error('Biblioteca html2pdf não disponível');
            }
            await pdfFactory().set(opt).from(pdfRef.current).save();
            toast({
                title: 'PDF Gerado com Sucesso!',
                description: `Arquivo "${filename}" baixado. Pronto para anexar no WhatsApp.`
            });
        } catch (err) {
            console.error('Erro ao gerar PDF da demonstracao:', err);
            toast({
                variant: 'destructive',
                title: 'Falha ao baixar PDF',
                description: 'Tente a opcao "Imprimir" para salvar como PDF no navegador.'
            });
        } finally {
            setDownloading(false);
        }
    };

    /**
     * Imprime diretamente pelo navegador
     */
    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 bg-background">
                <DialogHeader className="pb-3 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold">
                            <FileText className="w-5 h-5 text-primary" />
                            Prévia da Landing Page em PDF
                        </DialogTitle>
                        <p className="text-xs text-muted-foreground pt-1">
                            Envie este PDF diretamente no WhatsApp para clientes com receio de links.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleDownloadPdf}
                            disabled={downloading}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1.5 text-xs shadow-sm"
                        >
                            {downloading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Download className="w-3.5 h-3.5" />
                            )}
                            <span>{downloading ? 'Gerando...' : 'Baixar PDF para WhatsApp'}</span>
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                            className="gap-1.5 text-xs"
                            title="Imprimir ou salvar via navegador"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Imprimir</span>
                        </Button>
                    </div>
                </DialogHeader>

                {/* AREA DE RENDERIZACAO DO DOCUMENTO PDF */}
                <div className="overflow-x-auto py-2 flex justify-center">
                    <div
                        ref={pdfRef}
                        className="w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-xl p-8 sm:p-10 font-sans border border-slate-200"
                        style={{ boxSizing: 'border-box' }}
                    >
                        {/* FOLHA 1: CAPA EXECUTIVA & SEÇÃO HERO */}
                        <div className="space-y-6">
                            {/* Topo Institucional do PDF */}
                            <div className="flex items-center justify-between pb-4 border-b border-slate-200 text-xs">
                                <div>
                                    <span className="font-bold text-slate-900 tracking-wider uppercase text-[11px]">
                                        Apresentação de Estrutura Digital & Landing Page Oficial
                                    </span>
                                    <p className="text-slate-700 text-[10px]">
                                        Desenvolvido sob medida por Rafael Pita Solutions
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[10px]">
                                        <Shield className="w-3 h-3 text-emerald-700" />
                                        100% Conforme Normas OAB
                                    </span>
                                </div>
                            </div>

                            {/* Card Superior de Identificacao do Advogado */}
                            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-semibold">
                                            Banca Jurídica & Advocacia Especializada
                                        </span>
                                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
                                            {lawyerName}
                                        </h1>
                                        <p className="text-slate-300 text-xs mt-1 flex items-center gap-2">
                                            <span>{oab}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-emerald-400" />
                                                {city}, {state}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-center sm:text-right">
                                        <div className="flex items-center justify-center sm:justify-end gap-1 text-amber-400 text-sm font-bold">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <span>{rating}★</span>
                                            <span className="text-slate-300 text-xs font-normal">
                                                ({reviewsCount} avaliações)
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-300 mt-0.5">
                                            Destaque no Google Maps
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Seção Hero Diagramada */}
                            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 space-y-4">
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                    {nicheInfo.badge || 'Defesa Jurídica Estratégica'}
                                </span>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                                    {nicheInfo.hero?.headline || nicheInfo.headline || `Excelência Jurídica e Atendimento Consultivo em ${city}`}
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                    {nicheInfo.hero?.subheadline || nicheInfo.subheadline || 'Atuação combativa com transparência, rigor técnico e foco integral na preservação dos seus direitos e do seu patrimônio.'}
                                </p>

                                <div className="pt-2 flex flex-wrap items-center gap-3">
                                    <div className="bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2">
                                        <WhatsAppIcon className="w-4 h-4 text-white" />
                                        <span>Falar no WhatsApp com {lawyerName}</span>
                                    </div>
                                    <div className="bg-white border border-slate-300 text-slate-800 text-xs px-4 py-2.5 rounded-xl font-medium">
                                        Conhecer Áreas de Atuação
                                    </div>
                                </div>
                            </div>

                            {/* Especialidades Principais */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between border-b pb-1.5">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                        Áreas de Atuação & Soluções Jurídicas
                                    </h3>
                                    <span className="text-[10px] text-slate-600">
                                        Atendimento presencial e digital
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {(nicheInfo.practiceAreas || []).slice(0, 4).map((area, idx) => (
                                        <div key={idx} className="border border-slate-200 rounded-xl p-3 bg-white">
                                            <span className="text-[10px] font-mono font-bold text-emerald-800 block">
                                                0{idx + 1}.
                                            </span>
                                            <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                                                {area.title}
                                            </h4>
                                            <p className="text-[10px] text-slate-700 mt-1 line-clamp-2">
                                                {area.desc || area.summary}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* QUEBRA DE PAGINA PARA FOLHA 2 */}
                        <div style={{ pageBreakBefore: 'always', marginTop: '28px', paddingTop: '20px' }}>
                            {/* Rito de Atendimento em 4 Etapas */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between border-b pb-1.5">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                        Rito de Atendimento & Condução do Caso
                                    </h3>
                                    <span className="text-[10px] text-slate-600">
                                        Metodologia transparente
                                    </span>
                                </div>

                                <div className="grid grid-cols-4 gap-2 text-center">
                                    <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50">
                                        <span className="text-[11px] font-bold text-emerald-800 block">Passo 1</span>
                                        <h5 className="text-[11px] font-bold text-slate-900 mt-0.5">Diagnóstico</h5>
                                        <p className="text-[9px] text-slate-700 mt-1">Análise minuciosa de documentos e viabilidade.</p>
                                    </div>
                                    <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50">
                                        <span className="text-[11px] font-bold text-emerald-800 block">Passo 2</span>
                                        <h5 className="text-[11px] font-bold text-slate-900 mt-0.5">Estratégia</h5>
                                        <p className="text-[9px] text-slate-700 mt-1">Planejamento das medidas e alinhamento.</p>
                                    </div>
                                    <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50">
                                        <span className="text-[11px] font-bold text-emerald-800 block">Passo 3</span>
                                        <h5 className="text-[11px] font-bold text-slate-900 mt-0.5">Execução</h5>
                                        <p className="text-[9px] text-slate-700 mt-1">Peticionamento ágil e acompanhamento firme.</p>
                                    </div>
                                    <div className="border border-slate-200 rounded-xl p-2.5 bg-slate-50">
                                        <span className="text-[11px] font-bold text-emerald-800 block">Passo 4</span>
                                        <h5 className="text-[11px] font-bold text-slate-900 mt-0.5">Prestação</h5>
                                        <p className="text-[9px] text-slate-700 mt-1">Relatórios claros e reporte constante ao cliente.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Prova Social & Avaliações */}
                            <div className="space-y-3 pt-5">
                                <div className="flex items-center justify-between border-b pb-1.5">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                        O que Clientes Atendidos Dizem
                                    </h3>
                                    <span className="text-[10px] text-slate-600">
                                        Avaliações verificadas do Google Maps
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="border border-slate-200 rounded-xl p-3 bg-white">
                                        <div className="flex items-center gap-1 text-amber-500 text-[10px] mb-1">
                                            ★★★★★
                                        </div>
                                        <p className="text-[10px] text-slate-800 italic leading-relaxed">
                                            "Profissionalismo exemplar! O atendimento pelo WhatsApp foi imediato e todas as minhas dúvidas foram sanadas com total clareza."
                                        </p>
                                        <span className="text-[9px] font-bold text-slate-900 block mt-1.5">
                                            Cliente Atendido em {city}
                                        </span>
                                    </div>
                                    <div className="border border-slate-200 rounded-xl p-3 bg-white">
                                        <div className="flex items-center gap-1 text-amber-500 text-[10px] mb-1">
                                            ★★★★★
                                        </div>
                                        <p className="text-[10px] text-slate-800 italic leading-relaxed">
                                            "Segurança técnica impecável na condução do processo. Recomendo de olhos fechados para quem busca tranquilidade jurídica."
                                        </p>
                                        <span className="text-[9px] font-bold text-slate-900 block mt-1.5">
                                            Consulta Jurídica Especializada
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* BOX DA PROPOSTA COMERCIAL TRANSPARENTE */}
                            <div className="mt-6 border-2 border-emerald-600 rounded-2xl p-5 bg-emerald-50/60">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                                            Oferta Especial de Implementação
                                        </span>
                                        <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                                            Coloque Este Site no Ar com a Sua Marca
                                        </h4>
                                        <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed">
                                            Configuração completa: Logotipo, fotos reais, biografia, áreas de atuação e botão do seu WhatsApp oficial.
                                        </p>
                                    </div>

                                    <div className="bg-white border border-emerald-300 rounded-xl p-3 text-center sm:text-right shrink-0">
                                        <span className="text-[10px] text-slate-600 line-through block">De R$ 450,00</span>
                                        <div className="text-xl font-extrabold text-emerald-800">
                                            R$ 297,00
                                        </div>
                                        <span className="text-[9px] text-slate-700 block font-medium">
                                            Taxa única de implementação
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-emerald-200/80 mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-slate-700">
                                    <div>
                                        • Domínio próprio oficial registrado em seu nome (em média R$ 40 a R$ 60 ao ano no Registro.br).
                                    </div>
                                    <div className="font-semibold text-emerald-900">
                                        Sem mensalidades forçadas ou contratos de fidelidade.
                                    </div>
                                </div>
                            </div>

                            {/* Rodape do Documento */}
                            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-slate-600">
                                <div>
                                    <span className="font-bold text-slate-800">Link da Demonstração Online:</span>{' '}
                                    <span className="font-mono text-slate-700">{demoUrl}</span>
                                </div>
                                <div className="text-right">
                                    Desenvolvimento: <span className="font-semibold text-slate-900">Rafael Pita Solutions</span> • WhatsApp: (21) 96614-9077
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
