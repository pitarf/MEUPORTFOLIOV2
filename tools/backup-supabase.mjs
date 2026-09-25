import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Carrega variáveis de ambiente do .env
const envPath = path.join(rootDir, '.env');
let supabaseUrl = '';
let supabaseAnonKey = '';

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
            supabaseUrl = trimmed.split('=')[1].trim();
        } else if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
            supabaseAnonKey = trimmed.split('=')[1].trim();
        }
    });
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Erro: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não encontradas no .env');
    process.exit(1);
}

console.log(`🔌 Conectando ao Supabase: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Lista de tabelas conhecidas do sistema para extração
const TABLES_TO_BACKUP = [
    'categories',
    'projects',
    'reviews',
    'site_config',
    'landing_page_content',
    'services',
    'support_tickets',
    'contact_submissions',
    'submissions',
    'subscriptions',
    'pricing_settings',
    'budgets'
];

async function runBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(rootDir, 'backups');
    
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupData = {
        metadata: {
            supabaseUrl,
            createdAt: new Date().toISOString(),
            tablesBackedUp: []
        },
        tables: {}
    };

    let sqlDump = `-- BACKUP COMPLETO DO BANCO DE DADOS SUPABASE\n`;
    sqlDump += `-- Projeto: ${supabaseUrl}\n`;
    sqlDump += `-- Data de Extração: ${new Date().toISOString()}\n\n`;

    console.log('📦 Iniciando extração de dados das tabelas...');

    for (const table of TABLES_TO_BACKUP) {
        try {
            const { data, error } = await supabase.from(table).select('*');
            
            if (error) {
                console.warn(`⚠️ Tabela [${table}]: Não pôde ser lida ou ainda não existe (${error.message})`);
                continue;
            }

            console.log(`✅ Tabela [${table}]: ${data.length} registros extraídos com sucesso!`);
            backupData.tables[table] = data;
            backupData.metadata.tablesBackedUp.push({
                table,
                count: data.length
            });

            // Gera SQL INSERT se houver registros
            if (data && data.length > 0) {
                sqlDump += `-- -----------------------------------------------------\n`;
                sqlDump += `-- Dados da Tabela: ${table} (${data.length} registros)\n`;
                sqlDump += `-- -----------------------------------------------------\n`;

                for (const row of data) {
                    const columns = Object.keys(row).map(c => `"${c}"`).join(', ');
                    const values = Object.values(row).map(val => {
                        if (val === null || val === undefined) return 'NULL';
                        if (typeof val === 'number' || typeof val === 'boolean') return val;
                        if (typeof val === 'object') {
                            const jsonStr = JSON.stringify(val).replace(/'/g, "''");
                            return `'${jsonStr}'::jsonb`;
                        }
                        const escaped = String(val).replace(/'/g, "''");
                        return `'${escaped}'`;
                    }).join(', ');

                    sqlDump += `INSERT INTO "${table}" (${columns}) VALUES (${values}) ON CONFLICT DO NOTHING;\n`;
                }
                sqlDump += `\n`;
            }

        } catch (err) {
            console.error(`❌ Erro ao extrair [${table}]:`, err.message);
        }
    }

    // Salva arquivo JSON
    const jsonPath = path.join(backupDir, `backup_supabase_${timestamp}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(backupData, null, 2), 'utf8');

    // Salva arquivo SQL
    const sqlPath = path.join(backupDir, `backup_supabase_${timestamp}.sql`);
    fs.writeFileSync(sqlPath, sqlDump, 'utf8');

    // Salva também uma cópia como "latest" para fácil localização
    fs.writeFileSync(path.join(backupDir, `backup_latest.json`), JSON.stringify(backupData, null, 2), 'utf8');
    fs.writeFileSync(path.join(backupDir, `backup_latest.sql`), sqlDump, 'utf8');

    console.log('\n======================================================');
    console.log('🎉 BACKUP CONCLUÍDO COM SUCESSO TOTAL!');
    console.log(`📁 Arquivo JSON: ${jsonPath}`);
    console.log(`📁 Arquivo SQL:  ${sqlPath}`);
    console.log('======================================================\n');
}

runBackup().catch(err => {
    console.error('Fatal backup error:', err);
    process.exit(1);
});
