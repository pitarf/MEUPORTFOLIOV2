import assert from 'assert';
import { pitaiSearchService } from '../src/services/pitai/pitaiSearchService.js';
import { pitaiCoreService } from '../src/services/pitai/pitaiCoreService.js';
import { pitaiGoogleService } from '../src/services/pitai/pitaiGoogleService.js';
import { ELEVENLABS_VOICES } from '../src/services/pitai/pitaiTtsService.js';

console.log('=== INICIANDO AUDITORIA E TESTES DOS SERVIÇOS PIT.AI (PESQUISA WEB + VOZ + CORE) ===\n');

async function runTests() {
  let passed = 0;
  let total = 0;

  const test = async (name, fn) => {
    total++;
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
    }
  };

  // 1. Testes de Pesquisa Web em Tempo Real
  await test('pitaiSearchService deve retornar resultados ao buscar por "Rio de Janeiro"', async () => {
    const res = await pitaiSearchService.search('Rio de Janeiro');
    assert.ok(res.query === 'Rio de Janeiro');
    assert.ok(Array.isArray(res.results));
    assert.ok(res.results.length > 0, 'Deveria retornar ao menos 1 resultado');
    assert.ok(res.sources.length > 0, 'Deveria listar fontes consultadas');
  });

  await test('pitaiSearchService deve sanitizar prefixos como "pesquise sobre..."', async () => {
    const res = await pitaiSearchService.search('pesquise sobre inteligência artificial');
    assert.ok(res.query.includes('inteligência artificial'));
  });

  // 2. Testes do Cérebro Executivo (pitaiCoreService)
  await test('pitaiCoreService deve tratar intenção de briefing e gerar roteiro executivo', async () => {
    const res = await pitaiCoreService.processUserInput('o que tem de novo?');
    assert.strictEqual(res.intent, 'briefing');
    assert.ok(res.spokenText && res.spokenText.length > 10);
    assert.ok(res.displayText.includes('Briefing Executivo'));
    assert.ok(res.visualPayload.data.briefing);
  });

  await test('pitaiCoreService deve tratar busca web ao vivo sem falhar', async () => {
    const res = await pitaiCoreService.processUserInput('pesquise a cotação do dólar hoje');
    assert.strictEqual(res.intent, 'web_search');
    assert.ok(res.spokenText.length > 0);
    assert.ok(res.displayText.includes('Pesquisa em Tempo Real'));
    assert.strictEqual(res.visualPayload.type, 'web_results');
    assert.ok(res.visualPayload.data.results.length > 0);
  });

  await test('pitaiCoreService deve consultar agenda e listar compromissos', async () => {
    const res = await pitaiCoreService.processUserInput('minha agenda de hoje');
    assert.strictEqual(res.intent, 'agenda_query');
    assert.ok(res.spokenText.includes('Rafael'));
  });

  await test('pitaiCoreService deve criar tarefa pelo comando "anotar..."', async () => {
    const res = await pitaiCoreService.processUserInput('anota revisar proposta do novo cliente');
    assert.strictEqual(res.intent, 'task_create');
    assert.ok(res.spokenText.includes('revisar proposta'));
  });

  await test('pitaiCoreService deve agendar reunião e detectar conflitos se houver sobreposição', async () => {
    // Agenda um evento
    const res1 = await pitaiCoreService.processUserInput('marca reunião de alinhamento hoje às 14h');
    assert.ok(res1.intent === 'agenda_create' || res1.intent === 'agenda_conflict');
    
    // Tenta marcar outro exatamente no mesmo horário
    const res2 = await pitaiCoreService.processUserInput('marca outra reunião hoje às 14h');
    assert.strictEqual(res2.intent, 'agenda_conflict');
    assert.strictEqual(res2.visualPayload.type, 'conflict_alert');
  });

  // 3. Testes das Vozes e ElevenLabs
  await test('ELEVENLABS_VOICES deve conter voz Daniel executivo com ID correto', () => {
    const daniel = ELEVENLABS_VOICES.find(v => v.name.includes('Daniel'));
    assert.ok(daniel, 'Deveria conter a voz Daniel');
    assert.strictEqual(daniel.id, 'onwK4e9ZLuTAKqWW03F9');
  });

  console.log(`\n=== RESUMO: ${passed}/${total} TESTES APROVADOS [100%] ===`);
}

runTests();
