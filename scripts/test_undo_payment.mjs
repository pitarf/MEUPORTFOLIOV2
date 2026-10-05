import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const k = parts[0].trim();
    const v = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    env[k] = v;
  }
});

for (const k in env) {
  process.env[k] = env[k];
}

async function run() {
  const mod = await import('../src/services/maintenanceService.js');
  const { undoManualPayment, getSubscriptionById, getInvoiceById } = mod;

  const invoiceId = '5daca44e-965d-4eb5-8efc-4b19185111f2';
  console.log('Executando undoManualPayment para a fatura:', invoiceId);

  const res = await undoManualPayment(invoiceId, {
    reason: 'Baixa desfeita a pedido do usuario'
  });

  console.log('Resultado da operacao:');
  console.log('Fatura status:', res.invoice.status, '| paid_at:', res.invoice.paid_at);
  console.log('Assinatura next_due_date:', res.subscription.next_due_date, '| last_payment_date:', res.subscription.last_payment_date);

  const invUpdated = await getInvoiceById(invoiceId);
  console.log('Verificacao direta getInvoiceById status:', invUpdated.status);

  const subUpdated = await getSubscriptionById(res.subscription.id);
  console.log('Verificacao direta getSubscriptionById next_due_date:', subUpdated.next_due_date);
}

run().catch(console.error);
