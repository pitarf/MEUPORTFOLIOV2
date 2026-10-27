/**
 * Servico de Monitoramento e Manutencao da VPS Oracle Cloud
 * Permite coletar metricas de hardware em tempo real (SSD, RAM, CPU, Uptime)
 * e gerenciar containers Docker atraves do agente autenticado.
 */

const API_BASE_URL = import.meta.env.VITE_VPS_MONITOR_API_URL || 'https://license.rafaelpitaoficial.com.br/api/vps';
const API_TOKEN = import.meta.env.VITE_VPS_MONITOR_TOKEN || 'rp_vps_94a7e8f1b2c3d4e5f6a7b8c9d0e1f2a3';

/**
 * Monta os cabecalhos padrao para requisicoes a API da VPS.
 * @returns {Record<string, string>} Cabecalhos HTTP com token de autenticacao.
 */
function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'x-vps-token': API_TOKEN
    };
}

/**
 * Obtem o status completo da VPS (disco, memoria, cpu, uptime e containers Docker).
 * @returns {Promise<Object>} Dados consolidados de saude do servidor.
 */
export async function fetchVPSStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/status`, {
            method: 'GET',
            headers: getHeaders()
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Chave de seguranca da VPS invalida ou expirada.');
            }
            if (response.status === 502 || response.status === 504) {
                throw new Error('Agente de monitoramento temporariamente indisponivel (Gateway Timeout).');
            }
            throw new Error(`Falha na comunicacao com a VPS (Codigo HTTP: ${response.status}).`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao consultar status da VPS:', error);
        throw error;
    }
}

/**
 * Solicita a limpeza do cache de build e camadas orfas do Docker na VPS.
 * @returns {Promise<Object>} Resultado da execucao do comando na VPS.
 */
export async function cleanDockerBuildCache() {
    try {
        const response = await fetch(`${API_BASE_URL}/clean-docker-cache`, {
            method: 'POST',
            headers: getHeaders()
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `Erro ao limpar cache do Docker (Status: ${response.status}).`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao executar limpeza de cache:', error);
        throw error;
    }
}

/**
 * Reinicia um container Docker especifico na VPS.
 * @param {string} containerName - Nome do container a ser reiniciado.
 * @returns {Promise<Object>} Resposta com o status da reinicializacao.
 */
export async function restartDockerContainer(containerName) {
    if (!containerName) {
        throw new Error('O nome do container e obrigatorio.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/restart-container`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ container: containerName })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || `Falha ao reiniciar container ${containerName}.`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erro ao reiniciar container ${containerName}:`, error);
        throw error;
    }
}
