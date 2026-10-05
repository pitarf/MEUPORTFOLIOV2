import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://license.rafaelpitaoficial.com.br';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzkwMzE1NDc1LCJleHAiOjIwOTk5OTk5OTl9.wFEMPX1QldgFtry8o6A3twS0hQU62npfR3sm7hLGwdo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('Iniciando verificacoes nas tabelas PostgREST...');
  let hasErrors = false;

  // 1. Teste maintenance_categories
  const resCat = await supabase.from('maintenance_categories').select('*');
  if (resCat.error) {
    console.error('Erro em maintenance_categories:', resCat.error);
    hasErrors = true;
  } else {
    console.log('Sucesso maintenance_categories: registros encontrados =', resCat.data.length);
    resCat.data.forEach(c => console.log('  Categoria:', c.name, '| Cor:', c.color, '| Icone:', c.icon));
  }

  // 2. Teste maintenance_subscriptions
  const resSub = await supabase.from('maintenance_subscriptions').select('*');
  if (resSub.error) {
    console.error('Erro em maintenance_subscriptions:', resSub.error);
    hasErrors = true;
  } else {
    console.log('Sucesso maintenance_subscriptions: registros encontrados =', resSub.data.length);
  }

  // 3. Teste maintenance_invoices
  const resInv = await supabase.from('maintenance_invoices').select('*');
  if (resInv.error) {
    console.error('Erro em maintenance_invoices:', resInv.error);
    hasErrors = true;
  } else {
    console.log('Sucesso maintenance_invoices: registros encontrados =', resInv.data.length);
  }

  // 4. Teste maintenance_settings
  const resSet = await supabase.from('maintenance_settings').select('*');
  if (resSet.error) {
    console.error('Erro em maintenance_settings:', resSet.error);
    hasErrors = true;
  } else {
    console.log('Sucesso maintenance_settings: registros encontrados =', resSet.data.length);
  }

  // 5. Teste support_tickets com as novas colunas
  const resTick = await supabase.from('support_tickets').select('id, ticket_code, client_document, subscription_id').limit(1);
  if (resTick.error) {
    console.error('Erro em support_tickets (novas colunas):', resTick.error);
    hasErrors = true;
  } else {
    console.log('Sucesso support_tickets com client_document e subscription_id');
  }

  if (hasErrors) {
    process.exit(1);
  } else {
    console.log('Todos os testes concluiram com exito absoluto!');
  }
}

runTests();
