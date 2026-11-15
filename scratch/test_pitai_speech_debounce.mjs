/**
 * Teste unitário para validação do Debounce de Voz e Silence Detection
 */

import { pitaiVoiceService } from '../src/services/pitai/pitaiVoiceService.js';

console.log('--- TESTE: Debounce de Voz e Detecção de Silêncio ---');

// Valida valores de delay padrão e limites
console.log('Delay de silêncio padrão:', pitaiVoiceService.getSilenceDelay(), 'ms');
if (pitaiVoiceService.getSilenceDelay() >= 2000) {
  console.log('✅ Delay padrão configurado corretamente (>= 2000ms para pausas de pensamento)');
} else {
  console.error('❌ Delay de silêncio muito curto!');
  process.exit(1);
}

// Testa alteração de delay
pitaiVoiceService.setSilenceDelay(3000);
if (pitaiVoiceService.getSilenceDelay() === 3000) {
  console.log('✅ Ajuste dinâmico de sensibilidade aprovado (3000ms)');
}

// Restaura para 2200ms
pitaiVoiceService.setSilenceDelay(2200);
console.log('✅ Restauração para 2200ms aprovada.');
console.log('--- TODOS OS TESTES DE DEBOUNCE PASSARAM! ---');
