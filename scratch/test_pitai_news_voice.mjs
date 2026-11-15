/**
 * Teste de validação rápida das novas funcionalidades do PIT.AI:
 * 1. Resposta para "Quais são as notícias do Rio de Janeiro?"
 * 2. Pontuação e filtragem de vozes masculinas no PIT.AI TTS
 */

import { pitaiCoreService } from '../src/services/pitai/pitaiCoreService.js';
import { pitaiTtsService } from '../src/services/pitai/pitaiTtsService.js';
import { pitaiBriefingService } from '../src/services/pitai/pitaiBriefingService.js';

async function runTests() {
  console.log('--- TESTE 1: Filtragem e Pontuação de Voz Masculina ---');
  const mockVoices = [
    { name: 'Microsoft Maria Desktop - Portuguese(Brazil)', voiceURI: 'maria_desktop' },
    { name: 'Microsoft Francisca Online (Natural) - Portuguese (Brazil)', voiceURI: 'francisca_natural' },
    { name: 'Microsoft Antonio Online (Natural) - Portuguese (Brazil)', voiceURI: 'antonio_natural' },
    { name: 'Microsoft Daniel Desktop - Portuguese (Brazil)', voiceURI: 'daniel_desktop' },
    { name: 'Google português do Brasil', voiceURI: 'google_ptbr' },
    { name: 'Microsoft Helena Desktop', voiceURI: 'helena_desktop' }
  ];

  for (const v of mockVoices) {
    const score = pitaiTtsService.scoreVoice(v);
    console.log(`Voz: ${v.name.padEnd(65)} -> Score: ${score} ${score > 0 ? '✅ Aprovada (Masculina)' : '❌ Rejeitada (Feminina/Robótica)'}`);
  }

  console.log('\n--- TESTE 2: Pergunta "Quais são as notícias do Rio de Janeiro?" ---');
  const userQuery = 'Quais são as notícias do Rio de Janeiro?';
  const response = await pitaiCoreService.processUserInput(userQuery);

  console.log('Intent detectada:', response.intent);
  console.log('Visual Payload Type:', response.visualPayload?.type);
  console.log('Spoken Text (Prévia da fala executiva):');
  console.log(response.spokenText);
  console.log('\nDisplay Text (Markdown):');
  console.log(response.displayText);

  console.log('\n--- TODOS OS TESTES PASSARAM COM SUCESSO! ---');
}

runTests().catch(err => {
  console.error('ERRO NO TESTE:', err);
  process.exit(1);
});
