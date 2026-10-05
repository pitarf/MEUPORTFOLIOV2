import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
    Download,
    Printer,
    FileText,
    Building2,
    User,
    Calendar,
    CheckCircle2,
    DollarSign,
    Shield,
    Clock,
    QrCode,
    Sparkles,
    Copy,
    Check,
    CheckCircle,
    Info,
    Layers,
    Receipt,
    Globe
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { fetchPricingSettings } from '@/services/budgetService';
import {
    formatCurrencyBRL,
    formatDateBR,
    maskCpfCnpj,
    maskPhone,
    getInvoiceStatusMeta,
    parseCoveredWebsites,
    extractDomain
} from '@/utils/maintenanceFormatters';

/**
 * Modal de Visualizacao e Emissao de Fatura de Manutencao em PDF Ultra-Premium.
 * Estilizado no padrao corporativo da Rafael Pita Solutions.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen Estado de abertura do modal
 * @param {Function} props.onClose Callback ao fechar modal
 * @param {Object|null} props.invoice Dados completos da fatura e assinatura vinculada
 * @param {Object} [props.pricingSettings] Configuracoes corporativas da empresa emissora
 */
const InvoicePdfModal = ({
    isOpen,
    onClose,
    invoice,
    pricingSettings: initialPricingSettings = null
}) => {
    const { toast } = useToast();
    const pdfRef = useRef(null);
    const [downloading, setDownloading] = useState(false);
    const [copiedPix, setCopiedPix] = useState(false);
    const [companySettings, setCompanySettings] = useState(initialPricingSettings);

    // Carrega configuracoes corporativas caso nao tenham sido injetadas
    useEffect(() => {
        if (initialPricingSettings) {
            setCompanySettings(initialPricingSettings);
            return;
        }

        let isMounted = true;
        const loadSettings = async () => {
            try {
                const settings = await fetchPricingSettings();
                if (isMounted && settings) {
                    setCompanySettings(settings);
                }
            } catch (err) {
                console.error('Erro ao carregar dados da empresa para fatura:', err);
            }
        };

        if (isOpen) {
            loadSettings();
        }

        return () => {
            isMounted = false;
        };
    }, [isOpen, initialPricingSettings]);

    if (!invoice) return null;

    const subscription = invoice.subscription || {};
    const isPaid = invoice.status === 'pago';
    const statusMeta = getInvoiceStatusMeta(invoice.status);

    // Dados da Empresa Emissora (Rafael Pita Solutions) com fallbacks
    const company = {
        name: companySettings?.company_name || 'Rafael Pita Solutions',
        tradeName: companySettings?.company_trade_name || 'Rafael Pita Soluções Digitais',
        cnpj: companySettings?.company_cnpj || '12.345.678/0001-90',
        cpf: companySettings?.company_cpf || '',
        email: companySettings?.company_email || 'contato@rafaelpitaoficial.com.br',
        phone: companySettings?.company_phone || '(21) 96614-9077',
        address: companySettings?.company_address || 'Rio de Janeiro, RJ : Brasil',
        website: companySettings?.company_website || 'https://rafaelpitaoficial.com.br',
        pixKey: companySettings?.pix_key || '12.345.678/0001-90',
        pixKeyType: companySettings?.pix_key_type || 'CNPJ',
        logoUrl: companySettings?.company_logo_url || '/logo.png'
    };

    // Datas formatadas
    const createdAtDate = invoice.created_at ? new Date(invoice.created_at) : new Date();
    const issueDateStr = formatDateBR(createdAtDate);
    const dueDateStr = formatDateBR(invoice.due_date);
    const paidDateStr = invoice.paid_at ? formatDateBR(invoice.paid_at) : null;

    // Competencia calculada (mes e ano do vencimento)
    const dueDateObj = invoice.due_date ? new Date(invoice.due_date + 'T12:00:00') : new Date();
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const competenceStr = `${monthNames[dueDateObj.getMonth()]} de ${dueDateObj.getFullYear()}`;

    // Codigo da Fatura
    const invoiceCode = invoice.invoice_code || `FAT-${new Date().getFullYear()}-001`;

    // Websites Cobertos pela Manutencao
    const rawCoveredWebsites = invoice.covered_websites || subscription.covered_websites || '';
    const coveredWebsitesList = parseCoveredWebsites(rawCoveredWebsites);

    // PIX dados
    const pixCode = invoice.pix_qr_code || '';
    const pixQrImage = invoice.pix_qr_code_base64;

    /**
     * Copia o codigo Pix Copia e Cola para a area de transferencia
     */
    const handleCopyPix = async () => {
        if (!pixCode) return;
        try {
            await navigator.clipboard.writeText(pixCode);
            setCopiedPix(true);
            toast({
                title: 'Código PIX copiado!',
                description: 'A chave Copia e Cola da fatura foi copiada para a área de transferência.'
            });
            setTimeout(() => setCopiedPix(false), 3000);
        } catch (err) {
            console.error('Falha ao copiar PIX:', err);
            toast({
                variant: 'destructive',
                title: 'Falha ao copiar',
                description: 'Por favor, selecione e copie o código manualmente.'
            });
        }
    };

    /**
     * Gera e baixa o arquivo PDF no formato A4 corporativo
     */
    const handleDownloadPdf = async () => {
        if (!pdfRef.current) return;
        setDownloading(true);

        const safeClient = (subscription.client_name || 'Cliente')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `Fatura_${invoiceCode}_${safeClient}.pdf`;

        const opt = {
            margin: [8, 8, 8, 8],
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
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        try {
            await html2pdf().set(opt).from(pdfRef.current).save();
            toast({
                title: 'PDF Gerado com Sucesso!',
                description: `Arquivo "${filename}" baixado para o seu dispositivo.`
            });
        } catch (err) {
            console.error('Erro ao gerar PDF da fatura:', err);
            toast({
                variant: 'destructive',
                title: 'Falha ao baixar PDF',
                description: 'Tente a opção "Imprimir" pelo navegador para salvar como PDF.'
            });
        } finally {
            setDownloading(false);
        }
    };

    /**
     * Abre a caixa de impressao nativa do navegador
     */
    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-card border-border text-foreground p-0">
                {/* Barra de Acoes Superior */}
                <DialogHeader className="p-4 px-6 border-b border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-20 backdrop-blur-md">
                    <DialogTitle className="text-base font-bold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Fatura de Manutenção : {invoiceCode}
                    </DialogTitle>

                    <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                        {!isPaid && pixCode && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleCopyPix}
                                className="h-8 text-xs gap-1.5 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 px-2 sm:px-3"
                                title="Copiar código PIX Copia e Cola"
                            >
                                {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedPix ? 'PIX Copiado!' : 'Copiar PIX'}</span>
                            </Button>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                            className="h-8 text-xs gap-1.5 border-border px-2 sm:px-3"
                            title="Imprimir fatura"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Imprimir</span>
                        </Button>

                        <Button
                            type="button"
                            size="sm"
                            onClick={handleDownloadPdf}
                            disabled={downloading}
                            className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground shadow-sm px-2.5 sm:px-3"
                            title="Baixar Arquivo PDF"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>{downloading ? 'Gerando...' : 'Baixar PDF'}</span>
                        </Button>
                    </div>
                </DialogHeader>

                {/* Conteudo da Folha A4 para Visualizacao e Impressao */}
                <div className="p-4 sm:p-6 bg-slate-100 dark:bg-slate-900/60 overflow-x-auto flex justify-center">
                    <div
                        ref={pdfRef}
                        id="invoice-printable-document"
                        className="w-full max-w-[210mm] bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-lg border border-slate-200 font-sans space-y-6 text-sm"
                    >
                        {/* CABECALHO CORPORATIVO */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-slate-800 gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    {company.logoUrl && company.logoUrl !== '/logo.png' ? (
                                        <img
                                            src={company.logoUrl}
                                            alt={company.name}
                                            crossOrigin="anonymous"
                                            className="w-12 h-12 object-contain rounded-lg border border-slate-200 bg-white p-0.5"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                            RP
                                        </div>
                                    )}
                                    <div>
                                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                                            {company.name}
                                        </h1>
                                        <p className="text-xs text-blue-600 font-semibold tracking-wider uppercase mt-0.5">
                                            Soluções Digitais & Manutenção Contínua
                                        </p>
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-500 pt-1">
                                    {company.website} • {company.email} • {company.phone}
                                </p>
                            </div>

                            <div className="text-left sm:text-right bg-slate-50 p-3 rounded-lg border border-slate-200 min-w-[220px]">
                                <div className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider mb-1 ${
                                    isPaid
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                                }`}>
                                    {isPaid ? 'Recibo de Quitação' : 'Fatura de Manutenção'}
                                </div>
                                <div className="text-base font-black text-slate-900 font-mono">
                                    #{invoiceCode}
                                </div>
                                <div className="text-[11px] text-slate-600 space-y-0.5 mt-1">
                                    <div><strong>Emissão:</strong> {issueDateStr}</div>
                                    <div><strong>Vencimento:</strong> {dueDateStr}</div>
                                    <div><strong>Competência:</strong> {competenceStr}</div>
                                </div>
                            </div>
                        </div>

                        {/* BLOCO 1: EMISSOR E CLIENTE (DUAS COLUNAS) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Dados do Emissor */}
                            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                                <div className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                                    Prestador de Serviços
                                </div>
                                <div className="space-y-1 text-xs">
                                    <p className="font-bold text-slate-900 text-sm">{company.name}</p>
                                    {company.tradeName && <p className="text-slate-600">Titular: {company.tradeName}</p>}
                                    {company.cnpj && <p className="text-slate-700"><strong>CNPJ:</strong> {company.cnpj}</p>}
                                    {company.cpf && !company.cnpj && <p className="text-slate-700"><strong>CPF:</strong> {company.cpf}</p>}
                                    <p className="text-slate-600"><strong>Contato:</strong> {company.phone}</p>
                                    <p className="text-slate-600"><strong>E-mail:</strong> {company.email}</p>
                                    <p className="text-slate-600"><strong>Localidade:</strong> {company.address}</p>
                                </div>
                            </div>

                            {/* Dados do Cliente */}
                            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                                <div className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                                    <User className="w-3.5 h-3.5 text-blue-600" />
                                    Contratante / Assinante
                                </div>
                                <div className="space-y-1 text-xs">
                                    <p className="font-bold text-slate-900 text-sm">
                                        {subscription.client_name || 'Cliente'}
                                    </p>
                                    {subscription.client_company && (
                                        <p className="text-slate-600">
                                            <strong>Empresa:</strong> {subscription.client_company}
                                        </p>
                                    )}
                                    {subscription.client_document ? (
                                        <p className="text-slate-700">
                                            <strong>Documento:</strong> {maskCpfCnpj(subscription.client_document)}
                                        </p>
                                    ) : (
                                        <p className="text-slate-400 italic">Documento não informado</p>
                                    )}
                                    <p className="text-slate-600">
                                        <strong>WhatsApp:</strong> {maskPhone(subscription.client_phone) || 'Não informado'}
                                    </p>
                                    <p className="text-slate-600">
                                        <strong>E-mail:</strong> {subscription.client_email || 'Não informado'}
                                    </p>
                                    {subscription.subscription_code && (
                                        <p className="text-slate-600">
                                            <strong>Código do Contrato:</strong> {subscription.subscription_code}
                                        </p>
                                    )}

                                    {coveredWebsitesList.length > 0 && (
                                        <div className="pt-1 mt-1 border-t border-slate-200">
                                            <span className="text-slate-700 font-semibold block text-[11px]">
                                                Sites Cobertos ({coveredWebsitesList.length}):
                                            </span>
                                            <div className="flex flex-wrap gap-1 pt-0.5">
                                                {coveredWebsitesList.map((site, sIdx) => (
                                                    <span key={sIdx} className="text-blue-700 font-mono text-[10px] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                                        {extractDomain(site)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* BLOCO 2: DISCRIMINACAO DOS SERVICOS DE MANUTENCAO */}
                        <div className="space-y-3">
                            <div className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                                <Layers className="w-3.5 h-3.5 text-blue-600" />
                                Discriminação dos Serviços de Manutenção & Suporte
                            </div>

                            <div className="rounded-lg border border-slate-200 overflow-hidden">
                                <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                        <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                                            <th className="py-2.5 px-3">Item / Descrição dos Serviços</th>
                                            <th className="py-2.5 px-3 text-center">Competência</th>
                                            <th className="py-2.5 px-3 text-center">Ciclo</th>
                                            <th className="py-2.5 px-3 text-right">Valor Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        <tr>
                                            <td className="py-3.5 px-3 space-y-1">
                                                <div className="font-bold text-slate-900 text-sm">
                                                    {subscription.plan_title || 'Plano de Manutenção Contínua'}
                                                </div>
                                                <p className="text-slate-600 text-[11px] leading-relaxed">
                                                    {subscription.plan_description || 'Serviços de sustentação tecnológica, hospedagem e monitoramento contínuo da aplicação web.'}
                                                </p>

                                                {/* Destaque das Aplicacoes e Websites Cobertos */}
                                                {coveredWebsitesList.length > 0 && (
                                                    <div className="p-2.5 rounded-lg bg-blue-50/80 border border-blue-200/90 my-2 space-y-1">
                                                        <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                                                            <Globe className="w-3.5 h-3.5 text-blue-600" />
                                                            Aplicações & Websites Cobertos nesta Fatura:
                                                        </div>
                                                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                                                            {coveredWebsitesList.map((siteUrl, sIdx) => (
                                                                <span
                                                                    key={sIdx}
                                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-white text-blue-950 border border-blue-300 shadow-2xs"
                                                                >
                                                                    <Globe className="w-3 h-3 text-blue-600" />
                                                                    {siteUrl}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <ul className="text-[11px] text-slate-500 list-disc list-inside space-y-0.5 pt-1">
                                                    <li>Monitoramento e estabilidade do ambiente web</li>
                                                    <li>Correções preventivas, corretivas e ajustes de segurança</li>
                                                    <li>Backups regulares de banco de dados e arquivos</li>
                                                    <li>Suporte técnico prioritário via canal exclusivo e WhatsApp</li>
                                                </ul>
                                            </td>
                                            <td className="py-3.5 px-3 text-center text-slate-700 font-medium align-top">
                                                {competenceStr}
                                            </td>
                                            <td className="py-3.5 px-3 text-center text-slate-700 font-medium capitalize align-top">
                                                {subscription.billing_cycle || 'Mensal'}
                                            </td>
                                            <td className="py-3.5 px-3 text-right font-bold text-slate-900 text-sm align-top">
                                                {formatCurrencyBRL(invoice.amount)}
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                                            <td colSpan={3} className="py-3 px-3 text-right text-slate-700 uppercase text-xs">
                                                Total da Fatura:
                                            </td>
                                            <td className="py-3 px-3 text-right text-base text-slate-900 font-black">
                                                {formatCurrencyBRL(invoice.amount)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* BLOCO 3: SITUACAO DO PAGAMENTO / LIQUIDACAO PIX */}
                        <div className="break-inside-avoid">
                            {isPaid ? (
                                <div className="p-4 rounded-lg bg-emerald-50 border-2 border-emerald-300 space-y-2">
                                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                        Comprovante de Quitação Digital
                                    </div>
                                    <p className="text-xs text-emerald-900 leading-relaxed">
                                        Declaramos que a presente fatura foi devidamente quitada pelo assinante, dando plena e irrevogável quitação dos serviços contratados para a competência indicada.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs border-t border-emerald-200 text-emerald-950 font-medium">
                                        <div>
                                            <span className="text-emerald-700 block text-[11px]">Data de Liquidação:</span>
                                            <strong>{paidDateStr || dueDateStr}</strong>
                                        </div>
                                        <div>
                                            <span className="text-emerald-700 block text-[11px]">Forma de Pagamento:</span>
                                            <strong>PIX Instantâneo / Transferência</strong>
                                        </div>
                                        <div>
                                            <span className="text-emerald-700 block text-[11px]">Autenticação Digital:</span>
                                            <strong className="font-mono text-[10px] break-all">
                                                {invoice.end_to_end_id || invoice.pushinpay_id || `AUTH-${String(invoice.id).slice(0, 12)}`}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                                    <div className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                                        <QrCode className="w-3.5 h-3.5 text-blue-600" />
                                        Instruções de Pagamento via PIX
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        {/* QR Code */}
                                        <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm flex-shrink-0">
                                            {pixQrImage ? (
                                                <img
                                                    src={
                                                        pixQrImage.startsWith('data:')
                                                            ? pixQrImage
                                                            : `data:image/png;base64,${pixQrImage}`
                                                    }
                                                    alt="QR Code PIX"
                                                    crossOrigin="anonymous"
                                                    className="w-32 h-32 object-contain"
                                                />
                                            ) : pixCode ? (
                                                <img
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(pixCode)}`}
                                                    alt="QR Code PIX"
                                                    crossOrigin="anonymous"
                                                    className="w-32 h-32 object-contain"
                                                />
                                            ) : (
                                                <div className="w-32 h-32 flex items-center justify-center text-xs text-slate-400 text-center p-2">
                                                    Pagar na Chave PIX abaixo
                                                </div>
                                            )}
                                        </div>

                                        {/* Informacoes de PIX */}
                                        <div className="space-y-2 text-xs flex-1">
                                            <p className="text-slate-700 font-medium">
                                                Para efetuar o pagamento, abra o aplicativo do seu banco, acesse a opção <strong>PIX</strong> e escaneie o QR Code ao lado.
                                            </p>

                                            {pixCode && (
                                                <div className="space-y-1">
                                                    <span className="text-[11px] font-semibold text-slate-600">
                                                        Código PIX Copia e Cola:
                                                    </span>
                                                    <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[10px] break-all select-all text-slate-800 leading-tight">
                                                        {pixCode}
                                                    </div>
                                                </div>
                                            )}

                                            {company.pixKey && !pixCode && (
                                                <div className="p-2 bg-white rounded border border-slate-200 text-xs">
                                                    <span className="text-slate-600">Chave PIX Oficial ({company.pixKeyType}): </span>
                                                    <strong className="text-slate-900 select-all">{company.pixKey}</strong>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                                                <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                                <span>A compensação é processada em poucos segundos pelo sistema.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* BLOCO 4: TERMOS E CONDICOES */}
                        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1 break-inside-avoid">
                            <p className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                                Termos e Condições do Serviço:
                            </p>
                            <p>1. O pagamento desta fatura garante a continuidade ininterrupta da hospedagem, manutenção preventiva e suporte técnico.</p>
                            <p>2. Abertura de chamados emergenciais ou dúvidas técnicas podem ser encaminhados pelo Portal do Assinante ou WhatsApp oficial.</p>
                            <p>3. Este documento é emitido eletronicamente e possui validade jurídica como comprovante financeiro e de prestação de serviços.</p>
                        </div>

                        {/* RODAPE DA FATURA */}
                        <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500 space-y-1 break-inside-avoid">
                            <p className="font-semibold text-slate-700">
                                {company.name} : CNPJ: {company.cnpj} : {company.email}
                            </p>
                            <p>
                                Documento gerado pelo Sistema de Gestão Rafael Pita Solutions em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InvoicePdfModal;
