import React, { useRef, useState } from 'react';
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
    Eye,
    EyeOff,
    CreditCard,
    Layers
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { detectPaymentMode } from '@/components/admin/BudgetModal';

/**
 * Modal de Visualização e Emissão de Proposta Comercial em PDF Ultra-Premium
 * Estilizado na identidade visual corporativa da Rafael Pita Solutions.
 */
const BudgetPdfModal = ({
    isOpen,
    onClose,
    budget,
    pricingSettings,
    categoryTitle = 'Tecnologia & Desenvolvimento'
}) => {
    const { toast } = useToast();
    const pdfRef = useRef(null);
    const [downloading, setDownloading] = useState(false);
    const [showHoursInPdf, setShowHoursInPdf] = useState(true);

    if (!budget) return null;

    // Dados da Empresa (Emissor) com Fallbacks Seguros
    const company = {
        name: pricingSettings?.company_name || 'Rafael Pita Solutions',
        tradeName: pricingSettings?.company_trade_name || 'Rafael Pita',
        cnpj: pricingSettings?.company_cnpj || '',
        cpf: pricingSettings?.company_cpf || '',
        email: pricingSettings?.company_email || 'contato@rafaelpitaoficial.com.br',
        phone: pricingSettings?.company_phone || '(21) 96614-9077',
        address: pricingSettings?.company_address || 'Rio de Janeiro, RJ - Brasil',
        website: pricingSettings?.company_website || 'https://rafaelpitaoficial.com.br',
        pixKey: pricingSettings?.pix_key || '',
        pixKeyType: pricingSettings?.pix_key_type || 'CNPJ',
        logoUrl: pricingSettings?.company_logo_url || '/logo.png',
        validityDays: pricingSettings?.proposal_validity_days || 15,
        terms: pricingSettings?.proposal_terms || '1. Esta proposta tem validade pelo período estipulado.\n2. O início dos trabalhos ocorre após a confirmação do sinal/primeira parcela.\n3. Alterações de escopo não previstas serão orçadas separadamente.\n4. Garantia técnica de 30 dias após a entrega final para suporte e ajustes.'
    };

    // Formatação de Datas
    const createdAt = budget.created_at ? new Date(budget.created_at) : new Date();
    const issueDateStr = createdAt.toLocaleDateString('pt-BR');
    const validityDate = new Date(createdAt);
    validityDate.setDate(validityDate.getDate() + Number(company.validityDays));
    const validityDateStr = validityDate.toLocaleDateString('pt-BR');

    // Código do Orçamento
    const budgetCode = budget.budget_code || `ORC-${createdAt.getFullYear()}-${String(budget.id ? String(budget.id).slice(-4) : '001').toUpperCase()}`;

    // Entregáveis / Etapas
    const deliverables = Array.isArray(budget.deliverables) ? budget.deliverables : [];

    // Gerador de PDF via html2pdf.js
    const handleDownloadPdf = async () => {
        if (!pdfRef.current) return;
        setDownloading(true);

        const safeClient = (budget.client_name || 'Cliente')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `Proposta_${budgetCode}_${safeClient}.pdf`;

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
                description: `Arquivo "${filename}" baixado para o seu computador.`
            });
        } catch (err) {
            console.error('Erro ao gerar PDF:', err);
            toast({
                variant: 'destructive',
                title: 'Falha ao baixar PDF',
                description: 'Tente a opção "Imprimir Proposta" pelo navegador.'
            });
        } finally {
            setDownloading(false);
        }
    };

    // Impressão Nativa do Navegador
    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-card border-border text-foreground p-0">
                {/* Barra de Ações Superior Responsiva */}
                <DialogHeader className="p-4 px-6 border-b border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-20 backdrop-blur-md">
                    <DialogTitle className="text-base font-bold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Proposta Comercial & PDF ({budgetCode})
                    </DialogTitle>

                    <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowHoursInPdf(!showHoursInPdf)}
                            className="h-8 text-xs gap-1.5 border border-border px-2 sm:px-3"
                            title="Alternar visibilidade das horas das etapas no documento"
                        >
                            {showHoursInPdf ? <Eye className="w-3.5 h-3.5 text-blue-500" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
                            <span className="hidden sm:inline">{showHoursInPdf ? 'Horas Visíveis' : 'Horas Ocultas'}</span>
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                            className="h-8 text-xs gap-1.5 border-border px-2 sm:px-3"
                            title="Imprimir Proposta"
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

                {/* Conteúdo da Folha A4 para Visualização e Impressão */}
                <div className="p-6 bg-slate-100 dark:bg-slate-900/60 overflow-x-auto flex justify-center">
                    <div
                        ref={pdfRef}
                        id="budget-printable-document"
                        className="w-full max-w-[210mm] bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-lg border border-slate-200 font-sans space-y-6 text-sm"
                    >
                        {/* CABEÇALHO CORPORATIVO */}
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
                                            Soluções Digitais & Inteligência Comercial
                                        </p>
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-500 pt-1">
                                    {company.website} • {company.email} • {company.phone}
                                </p>
                            </div>

                            <div className="text-left sm:text-right bg-slate-50 p-3 rounded-lg border border-slate-200 min-w-[200px]">
                                <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider mb-1">
                                    Proposta Comercial
                                </div>
                                <div className="text-base font-black text-slate-900 font-mono">
                                    #{budgetCode}
                                </div>
                                <div className="text-[11px] text-slate-600 space-y-0.5 mt-1">
                                    <div><strong>Emissão:</strong> {issueDateStr}</div>
                                    <div><strong>Válido até:</strong> {validityDateStr}</div>
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
                                    Contratante / Cliente
                                </div>
                                <div className="space-y-1 text-xs">
                                    <p className="font-bold text-slate-900 text-sm">{budget.client_name || 'Cliente'}</p>
                                    {budget.client_company && (
                                        <p className="text-slate-700 font-medium">Empresa: {budget.client_company}</p>
                                    )}
                                    {budget.client_document && (
                                        <p className="text-slate-700"><strong>CPF / CNPJ:</strong> {budget.client_document}</p>
                                    )}
                                    {budget.client_phone && (
                                        <p className="text-slate-600"><strong>Telefone:</strong> {budget.client_phone}</p>
                                    )}
                                    {budget.client_email && (
                                        <p className="text-slate-600"><strong>E-mail:</strong> {budget.client_email}</p>
                                    )}
                                    {budget.client_address && (
                                        <p className="text-slate-600"><strong>Endereço:</strong> {budget.client_address}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* BLOCO 2: ESCOPO E OBJETIVO DO PROJETO */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                                <h3 className="text-sm font-bold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    1. Objeto & Escopo do Projeto
                                </h3>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                    {categoryTitle}
                                </span>
                            </div>
                            <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100 space-y-1.5">
                                <p className="font-bold text-slate-900 text-base">{budget.title}</p>
                                {budget.scope_description ? (
                                    <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                                        {budget.scope_description}
                                    </p>
                                ) : (
                                    <p className="text-xs text-slate-500 italic">
                                        Desenvolvimento de solução profissional sob medida de acordo com as especificações acordadas.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* BLOCO 3: ETAPAS E CRONOGRAMA DE ENTREGAS */}
                        {deliverables.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold uppercase text-slate-800 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                    2. Etapas & Entregáveis
                                </h3>

                                <div className="border border-slate-200 rounded-lg overflow-hidden">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                                                <th className="py-2.5 px-3 w-10 text-center">#</th>
                                                <th className="py-2.5 px-3">Etapa / Entregável</th>
                                                <th className="py-2.5 px-3">Detalhamento Técnico</th>
                                                {showHoursInPdf && <th className="py-2.5 px-3 w-20 text-center">Estimativa</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {deliverables.map((d, index) => (
                                                <tr key={d.id || index} className="hover:bg-slate-50/50">
                                                    <td className="py-2.5 px-3 text-center font-bold text-slate-400">
                                                        {index + 1}
                                                    </td>
                                                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                                                        {d.stage || d.title || d.name || 'Etapa do Projeto'}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-slate-600 leading-snug">
                                                        {d.description || 'Execução técnica padrão da etapa.'}
                                                    </td>
                                                    {showHoursInPdf && (
                                                        <td className="py-2.5 px-3 text-center font-mono text-slate-700 font-medium">
                                                            {d.hours ? `${d.hours}h` : '-'}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* BLOCO 4: INVESTIMENTO E CONDIÇÕES DE PAGAMENTO */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold uppercase text-slate-800 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                                <DollarSign className="w-4 h-4 text-blue-600" />
                                3. Investimento & Condições Comerciais
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
                                {/* Detalhamento de Prazos e Condições */}
                                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div>
                                            <span className="font-bold text-slate-800 block mb-1">Condição de Pagamento:</span>
                                            {(() => {
                                                const mode = detectPaymentMode(budget.payment_terms || '');
                                                const total = Number(budget.final_price || 0);

                                                if (mode === '50_50') {
                                                    const half = total / 2;
                                                    return (
                                                        <div className="space-y-1.5">
                                                            <div className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between">
                                                                <span className="font-semibold text-slate-700">1º Sinal (50% no início):</span>
                                                                <span className="font-mono font-bold text-blue-700">R$ {half.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                                            </div>
                                                            <div className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between">
                                                                <span className="font-semibold text-slate-700">2º Saldo (50% na aprovação):</span>
                                                                <span className="font-mono font-bold text-slate-800">R$ {half.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                }

                                                if (mode === 'etapas_split') {
                                                    const delivs = Array.isArray(budget.deliverables) && budget.deliverables.length > 0
                                                        ? budget.deliverables
                                                        : [{ stage: 'Início & Planejamento' }, { stage: 'Execução & Protótipo' }, { stage: 'Entrega Final' }];
                                                    const splitVal = total / delivs.length;
                                                    return (
                                                        <div className="space-y-1">
                                                            <span className="text-[11px] text-slate-500 block">Faturamento em splits conforme marcos concluídos:</span>
                                                            <div className="space-y-1">
                                                                {delivs.map((d, idx) => (
                                                                    <div key={idx} className="p-1.5 rounded bg-white border border-slate-200 flex items-center justify-between text-[11px]">
                                                                        <span className="font-medium text-slate-700 truncate pr-2">
                                                                            Split {idx + 1}: {d.stage || d.title || `Etapa ${idx + 1}`}
                                                                        </span>
                                                                        <span className="font-mono font-bold text-indigo-700 whitespace-nowrap">
                                                                            R$ {splitVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                }

                                                if (mode === 'cartao_credito') {
                                                    return (
                                                        <div className="p-2.5 rounded bg-white border border-slate-200 space-y-1">
                                                            <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                                                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                                                                Cartão de Crédito em até 12x
                                                            </div>
                                                            <p className="text-[11px] text-slate-600 leading-tight">
                                                                Pagamento via link seguro ou maquininha. Tarifas da operadora e juros do parcelamento por conta do contratante.
                                                            </p>
                                                        </div>
                                                    );
                                                }

                                                return <span className="text-slate-600 block">{budget.payment_terms || 'A combinar'}</span>;
                                            })()}
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-800 block">Prazo Estimado de Execução:</span>
                                            <span className="text-slate-600">{budget.deadline_days || 15} dias úteis após a confirmação e envio dos insumos.</span>
                                        </div>
                                    </div>

                                    {/* Dados PIX se cadastrados */}
                                    {company.pixKey && (
                                        <div className="pt-2 border-t border-slate-200 mt-2">
                                            <span className="font-bold text-emerald-700 flex items-center gap-1">
                                                <QrCode className="w-3.5 h-3.5" />
                                                Chave PIX para Faturamento ({company.pixKeyType}):
                                            </span>
                                            <span className="font-mono text-xs font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                                                {company.pixKey}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Caixa de Destaque do Valor Total */}
                                <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-blue-950 text-white flex flex-col justify-between shadow-md">
                                    <div className="flex justify-between items-center text-slate-300 text-xs pb-2 border-b border-slate-700/60">
                                        <span>Valor Total dos Serviços:</span>
                                        {budget.discount_percent > 0 && (
                                            <span className="text-amber-400 font-semibold font-mono">
                                                Desconto: {budget.discount_percent}%
                                            </span>
                                        )}
                                    </div>

                                    <div className="py-3 text-center sm:text-left">
                                        <span className="text-xs text-blue-300 font-medium block uppercase tracking-wider">
                                            Investimento Total Proposto
                                        </span>
                                        <span className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
                                            R$ {Number(budget.final_price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                    <div className="text-[11px] text-slate-400 text-center sm:text-left pt-1 border-t border-slate-800">
                                        Parcelamento facilitado conforme termos contratuais.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BLOCO 5: TERMOS GERAIS & VALIDADE */}
                        <div className="space-y-1.5 pt-2">
                            <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1">
                                <Shield className="w-3.5 h-3.5 text-blue-600" />
                                4. Termos de Aceite & Garantia
                            </h3>
                            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-relaxed font-mono whitespace-pre-line">
                                {company.terms}
                            </div>
                        </div>

                        {/* BLOCO 6: ASSINATURAS FORMAIS */}
                        <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
                            <div className="space-y-1">
                                <div className="border-t border-slate-400 w-3/4 mx-auto pt-2"></div>
                                <p className="font-bold text-slate-900">{company.name}</p>
                                <p className="text-[11px] text-slate-500">Prestador de Serviços</p>
                            </div>

                            <div className="space-y-1">
                                <div className="border-t border-slate-400 w-3/4 mx-auto pt-2"></div>
                                <p className="font-bold text-slate-900">{budget.client_name || 'Contratante'}</p>
                                <p className="text-[11px] text-slate-500">De acordo com a Proposta</p>
                            </div>
                        </div>

                        {/* RODAPÉ DO DOCUMENTO */}
                        <div className="text-center pt-6 border-t border-slate-200 text-[10px] text-slate-400">
                            Documento gerado automaticamente pela plataforma oficial Rafael Pita Solutions ({company.website}) em {issueDateStr}.
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BudgetPdfModal;
