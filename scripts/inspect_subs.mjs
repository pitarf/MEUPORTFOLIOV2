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

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: subs } = await supabase
    .from('maintenance_subscriptions')
    .select('id, subscription_code, client_name, client_email, current_price, next_due_date, last_payment_date, billing_day');
  console.log('Subscriptions:', JSON.stringify(subs, null, 2));

  const { data: invs } = await supabase
    .from('maintenance_invoices')
    .select('id, subscription_id, invoice_code, amount, due_date, status, paid_at, notes')
    .order('created_at', { ascending: false });
  console.log('Invoices:', JSON.stringify(invs, null, 2));
}

run();
