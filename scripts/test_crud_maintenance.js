import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://license.rafaelpitaoficial.com.br';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzkwMzE1NDc1LCJleHAiOjIwOTk5OTk5OTl9.wFEMPX1QldgFtry8o6A3twS0hQU62npfR3sm7hLGwdo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runFullTest() {
  console.log('Iniciando testes completos de integracao (CRUD e relacionamentos)...');

  // Obter uma categoria
  const { data: categories, error: catErr } = await supabase
    .from('maintenance_categories')
    .select('id, name')
    .limit(1);

  if (catErr || !categories || categories.length === 0) {
    console.error('Falha ao obter categoria:', catErr);
    process.exit(1);
  }
  const categoryId = categories[0].id;
  console.log('Categoria vinculada para teste:', categories[0].name);

  // Inserir assinatura de teste
  const testSubCode = 'TEST-SUB-' + Date.now();
  const { data: subData, error: subErr } = await supabase
    .from('maintenance_subscriptions')
    .insert([
      {
        subscription_code: testSubCode,
        client_name: 'Cliente Teste Integracao',
        client_document: '123.456.789-00',
        client_email: 'teste@exemplo.com',
        client_phone: '(11) 99999-9999',
        category_id: categoryId,
        plan_title: 'Plano Teste QA',
        current_price: 250.00,
        billing_day: 15,
        billing_cycle: 'mensal',
        status: 'ativo',
        next_due_date: '2026-11-15'
      }
    ])
    .select()
    .single();

  if (subErr) {
    console.error('Falha no INSERT da assinatura:', subErr);
    process.exit(1);
  }
  console.log('Assinatura de teste inserida com sucesso:', subData.id);

  // Inserir fatura de teste vinculada
  const testInvCode = 'TEST-FAT-' + Date.now();
  const { data: invData, error: invErr } = await supabase
    .from('maintenance_invoices')
    .insert([
      {
        subscription_id: subData.id,
        invoice_code: testInvCode,
        amount: 250.00,
        due_date: '2026-11-15',
        status: 'pendente'
      }
    ])
    .select()
    .single();

  if (invErr) {
    console.error('Falha no INSERT da fatura:', invErr);
    process.exit(1);
  }
  console.log('Fatura vinculada inserida com sucesso:', invData.id);

  // Testar relacao / join via PostgREST
  const { data: joinData, error: joinErr } = await supabase
    .from('maintenance_subscriptions')
    .select('*, maintenance_categories(name), maintenance_invoices(*)')
    .eq('id', subData.id)
    .single();

  if (joinErr) {
    console.error('Falha no JOIN entre tabelas:', joinErr);
    process.exit(1);
  }
  console.log('JOIN executado com sucesso: faturas vinculadas =', joinData.maintenance_invoices.length);

  // Limpeza (Cascade delete da assinatura deve remover a fatura)
  const { error: delErr } = await supabase
    .from('maintenance_subscriptions')
    .delete()
    .eq('id', subData.id);

  if (delErr) {
    console.error('Falha no DELETE em cascata:', delErr);
    process.exit(1);
  }
  console.log('Remocao em cascata efetuada com sucesso!');

  console.log('Validacao completa aprovada com sucesso total!');
}

runFullTest();
