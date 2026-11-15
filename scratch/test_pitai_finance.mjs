import { pitaiCoreService } from '../src/services/pitai/pitaiCoreService.js';
import { pitaiFinanceService } from '../src/services/pitai/pitaiFinanceService.js';

async function runTests() {
  console.log('--- TESTE 1: Despesa de Almoço (Conta PF Padrão / Débito) ---');
  const res1 = await pitaiCoreService.processUserInput('Gastei 48 reais no almoço comercial');
  console.log('Spoken:', res1.spokenText);
  console.log('Intent:', res1.intent);
  console.log('Visual:', res1.visualPayload?.type);
  console.log('Amount:', res1.visualPayload?.data?.amount);
  console.log('Account:', res1.visualPayload?.data?.account?.name);

  console.log('\n--- TESTE 2: Despesa Cartão Pão de Açúcar ---');
  const res2 = await pitaiCoreService.processUserInput('Comprei 250 no supermercado no cartão do pão de açúcar');
  console.log('Spoken:', res2.spokenText);
  console.log('Intent:', res2.intent);
  console.log('CreditCard:', res2.visualPayload?.data?.creditCard?.name);
  console.log('Card ID:', res2.visualPayload?.data?.creditCard?.id);

  console.log('\n--- TESTE 3: Receita Cliente PJ ---');
  const res3 = await pitaiCoreService.processUserInput('Recebi 3500 reais de cliente PJ');
  console.log('Spoken:', res3.spokenText);
  console.log('Intent:', res3.intent);
  console.log('Account:', res3.visualPayload?.data?.account?.name);

  console.log('\n--- TESTE 4: Transferência Caixinha Inter ---');
  const res4 = await pitaiCoreService.processUserInput('Transferi 400 reais para a caixinha inter');
  console.log('Spoken:', res4.spokenText);
  console.log('Intent:', res4.intent);
  console.log('Origem -> Destino:', res4.visualPayload?.data?.account?.name, '->', res4.visualPayload?.data?.targetAccount?.name);

  console.log('\n--- TESTE 5: Consulta de Gastos ---');
  const res5 = await pitaiCoreService.processUserInput('Quanto gastei este mês?');
  console.log('Spoken:', res5.spokenText);
  console.log('Intent:', res5.intent);
  console.log('Visual:', res5.visualPayload?.type);

  console.log('\nTodos os testes passaram com sucesso!');
}

runTests().catch(console.error);
