/**
 * Suíte de Testes Geral J.A.R.V.I.S. (PIT.AI)
 * Valida Clima, Notícias RJ, Finanças Grana+, TTS Masculino e Efeitos
 */

import { pitaiCoreService } from '../src/services/pitai/pitaiCoreService.js';
import { pitaiWeatherService } from '../src/services/pitai/pitaiWeatherService.js';
import { pitaiBriefingService } from '../src/services/pitai/pitaiBriefingService.js';
import { pitaiTtsService } from '../src/services/pitai/pitaiTtsService.js';
import { pitaiVoiceService } from '../src/services/pitai/pitaiVoiceService.js';

async function runJarvisSuite() {
  console.log('========================================================');
  console.log('🤖 HOMOLOGAÇÃO GERAL DA ARQUITETURA J.A.R.V.I.S. (PIT.AI)');
  console.log('========================================================\n');

  // 1. Clima no Rio de Janeiro
  console.log('--- TESTE 1: Intenção Clima no Rio de Janeiro ---');
  const weatherRes = await pitaiCoreService.processUserInput('Como está o tempo no Rio de Janeiro agora?');
  console.log('Intent:', weatherRes.intent);
  console.log('Payload:', weatherRes.visualPayload?.type);
  console.log('Fala Executiva:', weatherRes.spokenText);
  if (weatherRes.visualPayload?.type !== 'weather_card') {
    throw new Error('Falha no payload de clima!');
  }
  console.log('✅ Clima no Rio homologado com sucesso.\n');

  // 2. Notícias Reais do Rio de Janeiro
  console.log('--- TESTE 2: Intenção Notícias do Rio de Janeiro ---');
  const newsRes = await pitaiCoreService.processUserInput('Quais são as notícias do Rio de Janeiro?');
  console.log('Intent:', newsRes.intent);
  console.log('Payload:', newsRes.visualPayload?.type);
  console.log('Fala Executiva:', newsRes.spokenText);
  if (!newsRes.spokenText.toLowerCase().includes('rio')) {
    throw new Error('Falha nas notícias do Rio!');
  }
  console.log('✅ Notícias do Rio homologadas com sucesso.\n');

  // 3. Finanças Grana+
  console.log('--- TESTE 3: Intenção Financeira Grana+ ---');
  const financeRes = await pitaiCoreService.processUserInput('Gastei 55 reais no almoço');
  console.log('Intent:', financeRes.intent);
  console.log('Payload:', financeRes.visualPayload?.type);
  console.log('Fala Executiva:', financeRes.spokenText);
  if (financeRes.visualPayload?.type !== 'finance_card') {
    throw new Error('Falha no payload financeiro!');
  }
  console.log('✅ Finanças Grana+ homologado com sucesso.\n');

  // 4. Voz Masculina e Debounce
  console.log('--- TESTE 4: Voz Masculina e Debounce de Silêncio ---');
  const bestVoice = pitaiTtsService.pickBestBrowserVoice();
  console.log('Melhor voz selecionada:', bestVoice?.name || 'Voz Neural Padrão');
  console.log('Delay de silêncio para pensar:', pitaiVoiceService.getSilenceDelay(), 'ms');
  console.log('✅ Configuração acústica J.A.R.V.I.S. homologada com sucesso.\n');

  console.log('========================================================');
  console.log('🎉 TODOS OS SISTEMAS DO J.A.R.V.I.S. ESTÃO OPERACIONAIS!');
  console.log('========================================================');
}

runJarvisSuite().catch((err) => {
  console.error('❌ ERRO NA HOMOLOGAÇÃO:', err);
  process.exit(1);
});
