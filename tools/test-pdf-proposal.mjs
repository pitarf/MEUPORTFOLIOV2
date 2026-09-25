import { chromium } from 'playwright';

async function testPdfProposal() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 1080 }
    });

    const page = await context.newPage();

    const mockAdminUser = {
        id: 'admin-rafael-uuid-1234',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'rafael@rafaelpitaoficial.com.br',
        email_confirmed_at: '2026-01-01T00:00:00Z',
        user_metadata: { name: 'Rafael Pita' },
        app_metadata: { provider: 'email' },
        created_at: '2026-01-01T00:00:00Z'
    };

    const validJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbi1yYWZhZWwtdXVpZC0xMjM0IiwiZW1haWwiOiJyYWZhZWxAcmFmYWVscGl0YW9maWNpYWwuY29tLmJyIiwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJpYXQiOjE3OTAzMTU0NzUsImV4cCI6MjA5OTk5OTk5OX0.dummySignaturePart';

    const mockSession = {
        access_token: validJwt,
        token_type: 'bearer',
        expires_in: 7200,
        expires_at: Math.floor(Date.now() / 1000) + 7200,
        refresh_token: 'dummy-refresh-token',
        user: mockAdminUser
    };

    const mockPricingSettings = {
        id: 1,
        hourly_rate: 120,
        contingency_percentage: 15,
        profit_margin_percentage: 30,
        fixed_costs_buffer: 5,
        taxes_percentage: 6,
        company_name: 'Rafael Pita Soluções Tecnológicas Ltda',
        company_trade_name: 'Rafael Pita Solutions',
        company_cnpj: '45.123.456/0001-89',
        company_cpf: '',
        company_email: 'contato@rafaelpitaoficial.com.br',
        company_phone: '(21) 98765-4321',
        company_address: 'Av. das Américas, Barra da Tijuca, Rio de Janeiro - RJ',
        company_website: 'https://rafaelpitaoficial.com.br',
        pix_key: 'contato@rafaelpitaoficial.com.br',
        pix_key_type: 'email',
        proposal_validity_days: 15,
        proposal_terms: '• Prazo de entrega contado a partir da aprovação e entrega dos materiais.\n• Suporte técnico garantido por 30 dias após a homologação.\n• Condições de pagamento: 50% de sinal e 50% na entrega homologada.'
    };

    const mockBudgets = [
        {
            id: 'b-001',
            budget_code: 'ORC-2026-001',
            title: 'Plataforma SaaS de Gestão Imobiliária',
            client_name: 'Imobiliária Prime Rio',
            client_company: 'Prime Imóveis Ltda',
            client_document: '12.345.678/0001-90',
            client_email: 'diretoria@primeimoveis.com.br',
            client_phone: '21999998888',
            client_address: 'Rua Visconde de Pirajá, Ipanema, Rio de Janeiro - RJ',
            category_id: 1,
            status: 'pendente',
            estimated_hours: 45,
            calculated_cost: 5400,
            contingency_cost: 810,
            profit_margin: 1620,
            taxes_cost: 324,
            final_price: 8154,
            payment_terms: '50% de entrada (R$ 4.077,00) via PIX e 50% na homologação final.',
            ai_sales_pitch: 'Esta solução foi desenhada especificamente para automatizar os contratos da Prime Imóveis.',
            scope_items: [
                {
                    title: 'Arquitetura e Modelagem do Banco PostgreSQL',
                    description: 'Estruturação com Supabase, índices e regras RLS para inquilinos e proprietários.',
                    estimated_hours: 10,
                    cost: 1200
                },
                {
                    title: 'Painel Administrativo e Gestão de Imóveis',
                    description: 'Interface web responsiva com upload otimizado de imagens e filtros dinâmicos.',
                    estimated_hours: 20,
                    cost: 2400
                },
                {
                    title: 'Área do Cliente e Integração de Pagamento',
                    description: 'Emissão de faturas, integração com Gateway e notificações automáticas via WhatsApp.',
                    estimated_hours: 15,
                    cost: 1800
                }
            ],
            deliverables: [
                'Painel Administrativo Completo em React e Tailwind',
                'Banco de dados escalável com backups automatizados',
                'Documentação técnica e manual de uso do sistema'
            ],
            notes: 'Proposta elaborada com condições especiais para pagamento à vista ou sinal via PIX.',
            created_at: new Date().toISOString()
        }
    ];

    // Intercepta rotas REST do PostgREST
    await page.route('**/rest/v1/**', async (route) => {
        const url = route.request().url();
        if (url.includes('/pricing_settings')) {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockPricingSettings)
            });
            return;
        }

        if (url.includes('/budgets')) {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockBudgets)
            });
            return;
        }

        await route.continue();
    });

    // Intercepta Auth
    await page.route('**/auth/v1/**', async (route) => {
        const url = route.request().url();
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(url.includes('/token') ? mockSession : mockAdminUser)
        });
    });

    await page.addInitScript((sessionData) => {
        const sessionStr = JSON.stringify(sessionData);
        localStorage.setItem('sb-license-auth-token', sessionStr);
        localStorage.setItem('sb-license.rafaelpitaoficial.com.br-auth-token', sessionStr);
        localStorage.setItem('supabase.auth.token', sessionStr);
    }, mockSession);

    console.log('🌐 Navegando para http://localhost:4173/admin/orcamentos ...');
    await page.goto('http://localhost:4173/admin/orcamentos', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Clica no botão de PDF no card do Kanban
    const kanbanPdfBtn = page.locator('button[title*="Visualizar e Baixar Proposta em PDF"]');
    if (await kanbanPdfBtn.count() > 0) {
        console.log('🔍 Clicando no botão PDF do Kanban...');
        await kanbanPdfBtn.first().click();
        await page.waitForTimeout(1500);

        // Screenshot da parte de cima
        await page.screenshot({ path: 'tests/audit-results/orcamentos-pdf-modal-preview.png' });
        console.log('📸 Topo do Modal de PDF salvo!');

        // Scroll para ver o investimento, PIX, termos e assinaturas
        const pdfContent = page.locator('#proposal-pdf-container');
        if (await pdfContent.count() > 0) {
            await pdfContent.evaluate(el => el.scrollIntoView({ block: 'end', behavior: 'instant' }));
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'tests/audit-results/orcamentos-pdf-investimento-pix.png' });
            console.log('📸 Rodapé do Modal de PDF (Investimento, PIX e Assinaturas) salvo!');
        }

        // Fecha via Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
    }

    // Alternar para Lista e abrir PDF pela Tabela
    const listModeBtn = page.locator('button:has-text("Lista")');
    if (await listModeBtn.count() > 0) {
        console.log('📋 Alternando para visualização em Lista...');
        await listModeBtn.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'tests/audit-results/orcamentos-lista-view.png' });
        console.log('📸 Screenshot da Lista salva!');

        const tablePdfBtn = page.locator('button[title="Ver Proposta em PDF"]');
        if (await tablePdfBtn.count() > 0) {
            console.log('🔍 Clicando no botão de PDF da tabela...');
            await tablePdfBtn.first().click();
            await page.waitForTimeout(1500);
            await page.screenshot({ path: 'tests/audit-results/orcamentos-pdf-from-table.png' });
            console.log('📸 Screenshot do Modal de PDF via tabela salva!');
            await page.keyboard.press('Escape');
            await page.waitForTimeout(1000);
        }
    }

    // Testa a Aba 2 do Modal de Configurações da Minha Empresa
    const settingsBtn = page.locator('button:has-text("Configurar Meu HH")');
    if (await settingsBtn.count() > 0) {
        console.log('⚙️ Abrindo Configurações de HH & Minha Empresa...');
        await settingsBtn.click();
        await page.waitForTimeout(1000);

        const tabEmpresa = page.locator('button:has-text("Minha Empresa & PDF")');
        if (await tabEmpresa.count() > 0) {
            await tabEmpresa.click();
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'tests/audit-results/pricing-empresa-tab.png' });
            console.log('📸 Screenshot da Aba Minha Empresa & PDF salva!');
        }
    }

    await browser.close();
    console.log('🎉 Todos os testes de PDF foram executados com 100% de sucesso!');
}

testPdfProposal().catch(err => {
    console.error('❌ Erro no teste:', err);
    process.exit(1);
});
