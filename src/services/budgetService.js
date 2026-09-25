import { supabase } from '@/lib/customSupabaseClient';

/**
 * Serviço de Gerenciamento de Orçamentos, Precificação (HH) e Conversão em Portfólio
 * Integração com o banco de dados Supabase e suporte ao Kanban de Vendas.
 */

/**
 * Busca as configurações de precificação e taxa de Hora-Homem (HH)
 * @returns {Promise<Object>}
 */
export const fetchPricingSettings = async () => {
    try {
        const { data, error } = await supabase
            .from('pricing_settings')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error('Erro ao buscar pricing_settings:', error);
            // Retorna fallback seguro se a tabela estiver inicializando
            return {
                hourly_rate: 120.00,
                profit_margin_percent: 20.00,
                contingency_margin_percent: 15.00,
                fixed_costs_monthly: 0.00,
                min_project_value: 500.00
            };
        }

        if (!data) {
            // Cria configuração inicial padrão se não existir
            const defaultSettings = {
                hourly_rate: 120.00,
                profit_margin_percent: 20.00,
                contingency_margin_percent: 15.00,
                fixed_costs_monthly: 0.00,
                min_project_value: 500.00,
                notes: 'Configuração padrão inicial'
            };
            const { data: created, error: insertError } = await supabase
                .from('pricing_settings')
                .insert([defaultSettings])
                .select()
                .single();

            if (insertError) throw insertError;
            return created;
        }

        return data;
    } catch (err) {
        console.error('Falha no serviço fetchPricingSettings:', err);
        return {
            hourly_rate: 120.00,
            profit_margin_percent: 20.00,
            contingency_margin_percent: 15.00,
            fixed_costs_monthly: 0.00,
            min_project_value: 500.00
        };
    }
};

/**
 * Salva as configurações de precificação e taxa de Hora-Homem (HH)
 * @param {Object} settings 
 * @returns {Promise<Object>}
 */
export const updatePricingSettings = async (settings) => {
    const payload = {
        hourly_rate: parseFloat(settings.hourly_rate) || 120.00,
        profit_margin_percent: parseFloat(settings.profit_margin_percent) || 20.00,
        contingency_margin_percent: parseFloat(settings.contingency_margin_percent) || 15.00,
        fixed_costs_monthly: parseFloat(settings.fixed_costs_monthly) || 0.00,
        min_project_value: isNaN(parseFloat(settings.min_project_value)) ? 500.00 : parseFloat(settings.min_project_value),
        notes: settings.notes || '',
        company_name: settings.company_name ?? 'Rafael Pita Solutions',
        company_trade_name: settings.company_trade_name ?? 'Rafael Pita',
        company_cnpj: settings.company_cnpj ?? '',
        company_cpf: settings.company_cpf ?? '',
        company_email: settings.company_email ?? 'contato@rafaelpitaoficial.com.br',
        company_phone: settings.company_phone ?? '(21) 96614-9077',
        company_address: settings.company_address ?? 'Rio de Janeiro, RJ - Brasil',
        company_logo_url: settings.company_logo_url ?? '',
        company_website: settings.company_website ?? 'https://rafaelpitaoficial.com.br',
        pix_key: settings.pix_key ?? '',
        pix_key_type: settings.pix_key_type ?? 'CNPJ',
        proposal_validity_days: parseInt(settings.proposal_validity_days, 10) || 15,
        proposal_terms: settings.proposal_terms ?? '',
        updated_at: new Date().toISOString()
    };

    if (settings.id) {
        const { data, error } = await supabase
            .from('pricing_settings')
            .update(payload)
            .eq('id', settings.id)
            .select()
            .single();

        if (error) throw new Error(`Falha ao atualizar configurações de preço: ${error.message}`);
        return data;
    } else {
        const { data, error } = await supabase
            .from('pricing_settings')
            .insert([payload])
            .select()
            .single();

        if (error) throw new Error(`Falha ao criar configurações de preço: ${error.message}`);
        return data;
    }
};

/**
 * Busca a listagem completa de orçamentos cadastrados com dados de categorias e projetos vinculados
 * @returns {Promise<Array>}
 */
export const fetchBudgets = async () => {
    const { data, error } = await supabase
        .from('budgets')
        .select(`
            *,
            category:categories(id, title, slug),
            project:projects(id, title, slug)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar orçamentos:', error);
        throw new Error(`Não foi possível carregar os orçamentos: ${error.message}`);
    }

    return data || [];
};

/**
 * Cria um novo orçamento no banco de dados
 * @param {Object} budgetData 
 * @returns {Promise<Object>}
 */
export const createBudget = async (budgetData) => {
    const cleanData = { ...budgetData };
    delete cleanData.category;
    delete cleanData.project;

    const { data, error } = await supabase
        .from('budgets')
        .insert([{
            ...cleanData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }])
        .select(`
            *,
            category:categories(id, title, slug)
        `)
        .single();

    if (error) {
        throw new Error(`Erro ao salvar orçamento: ${error.message}`);
    }

    return data;
};

/**
 * Atualiza um orçamento existente
 * @param {string} id 
 * @param {Object} budgetData 
 * @returns {Promise<Object>}
 */
export const updateBudget = async (id, budgetData) => {
    const cleanData = { ...budgetData };
    delete cleanData.category;
    delete cleanData.project;

    const { data, error } = await supabase
        .from('budgets')
        .update({
            ...cleanData,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
            *,
            category:categories(id, title, slug),
            project:projects(id, title, slug)
        `)
        .single();

    if (error) {
        throw new Error(`Erro ao atualizar orçamento: ${error.message}`);
    }

    return data;
};

/**
 * Atualiza de forma expressa o status do orçamento no Kanban
 * @param {string} id 
 * @param {string} newStatus 
 * @returns {Promise<Object>}
 */
export const updateBudgetStatus = async (id, newStatus) => {
    const { data, error } = await supabase
        .from('budgets')
        .update({
            status: newStatus,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
            *,
            category:categories(id, title, slug)
        `)
        .single();

    if (error) {
        throw new Error(`Erro ao mudar status do orçamento: ${error.message}`);
    }

    return data;
};

/**
 * Deleta um orçamento do sistema
 * @param {string} id 
 * @returns {Promise<boolean>}
 */
export const deleteBudget = async (id) => {
    const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(`Erro ao excluir orçamento: ${error.message}`);
    }

    return true;
};

/**
 * Converte um orçamento concluído diretamente em um projeto publicado do portfólio público
 * @param {Object} params
 * @param {Object} params.budget Dados do orçamento
 * @param {Object} params.customData Dados complementares opcionais
 * @returns {Promise<Object>}
 */
export const convertBudgetToPortfolioProject = async ({ budget, customData = {} }) => {
    // 1. Gera o slug baseado no título
    const generateSlug = (text) => {
        return (text || 'projeto')
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
    };

    const projectSlug = customData.slug || generateSlug(budget.title);

    // 2. Monta o objeto de inserção para a tabela 'projects'
    const newProject = {
        title: budget.title,
        slug: projectSlug,
        category_id: budget.category_id || customData.category_id,
        client: budget.client_company || budget.client_name,
        year: new Date().getFullYear(),
        description: customData.description || budget.scope_description || 'Projeto desenvolvido com excelência por Rafael Pita Solutions.',
        challenge: customData.challenge || 'Desenvolver solução sob medida atendendo aos mais rigorosos padrões de qualidade e performance.',
        solution: customData.solution || 'Planejamento ágil, arquitetura moderna e execução orientada aos objetivos do cliente.',
        results: customData.results || 'Entrega com máxima satisfação, pontualidade e impacto comercial mensurável.',
        project_url: customData.project_url || budget.project_url || '',
        main_image_url: customData.main_image_url || budget.main_image_url || '',
        gallery_urls: customData.gallery_urls || budget.gallery_urls || [],
        services: customData.services || ['Soluções Sob Medida', 'Desenvolvimento', 'Design'],
        display_order: 0,
        created_at: new Date().toISOString()
    };

    // 3. Insere o projeto na tabela 'projects'
    const { data: createdProject, error: projectError } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single();

    if (projectError) {
        throw new Error(`Falha ao criar projeto no portfólio: ${projectError.message}`);
    }

    // 4. Atualiza o orçamento associando o ID do novo projeto
    const { data: updatedBudget, error: budgetUpdateError } = await supabase
        .from('budgets')
        .update({
            project_id: createdProject.id,
            status: 'concluido',
            updated_at: new Date().toISOString()
        })
        .eq('id', budget.id)
        .select()
        .single();

    if (budgetUpdateError) {
        console.warn('Projeto criado no portfólio, mas houve aviso ao vincular com o orçamento:', budgetUpdateError);
    }

    return { project: createdProject, budget: updatedBudget };
};
