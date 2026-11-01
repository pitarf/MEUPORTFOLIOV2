/**
 * @file api/propostas/gerar.js
 * @description Serverless Function para gerar propostas comerciais inteligentes para o 99Freelas.
 * Conectado à IA (Google Gemini) e alimentado pelo histórico real de cases e repertório de projetos.
 * Suporta CORS irrestrito para extensões do Google Chrome e clientes externos.
 */

import { generateProposal } from '../../src/services/proposalAiService.js';

/**
 * Utilitário para parsear o corpo da requisição em ambientes variados (Vercel, Express, Node HTTP).
 * @param {Object} req - Objeto de requisição HTTP.
 * @returns {Promise<Object>} Payload parseado em objeto.
 */
async function parseBody(req) {
    if (req.body && typeof req.body === 'object') {
        return req.body;
    }
    if (typeof req.body === 'string') {
        try {
            return JSON.parse(req.body);
        } catch {
            return {};
        }
    }
    return new Promise((resolve) => {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(data || '{}'));
            } catch {
                resolve({});
            }
        });
        req.on('error', () => resolve({}));
    });
}

/**
 * Handler principal do endpoint de propostas.
 * @param {Object} req - Requisição HTTP.
 * @param {Object} res - Resposta HTTP.
 */
export default async function handler(req, res) {
    // Configuração de cabeçalhos CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    // Responde requisições preflight OPTIONS
    if (req.method === 'OPTIONS') {
        if (typeof res.status === 'function') {
            return res.status(200).end();
        } else {
            res.statusCode = 200;
            return res.end();
        }
    }

    // Apenas método POST é aceito para geração
    if (req.method !== 'POST') {
        const errorPayload = {
            sucesso: false,
            mensagem: 'Método não permitido. Utilize POST para enviar o briefing do projeto.'
        };
        if (typeof res.status === 'function') {
            return res.status(405).json(errorPayload);
        } else {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(errorPayload));
        }
    }

    try {
        const body = await parseBody(req);

        if (!body || (!body.titulo && !body.descricao)) {
            const invalidPayload = {
                sucesso: false,
                mensagem: 'Briefing inválido. É necessário fornecer pelo menos o título ou a descrição do projeto.'
            };
            if (typeof res.status === 'function') {
                return res.status(400).json(invalidPayload);
            } else {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(invalidPayload));
            }
        }

        // Executa a inteligência de propostas com o repertório de projetos
        const result = await generateProposal(body);

        if (typeof res.status === 'function') {
            return res.status(200).json(result);
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(result));
        }
    } catch (error) {
        console.error('[API Propostas Gerar] Erro na geração:', error);
        const failPayload = {
            sucesso: false,
            mensagem: `Falha ao gerar proposta comercial: ${error?.message || 'Servidor instável'}`
        };
        if (typeof res.status === 'function') {
            return res.status(500).json(failPayload);
        } else {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(failPayload));
        }
    }
}
