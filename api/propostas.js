/**
 * @file api/propostas.js
 * @description Ponto de entrada alternativo para o endpoint de geração de propostas (/api/propostas).
 * Redireciona para o handler oficial em api/propostas/gerar.js.
 */

import propostasHandler from './propostas/gerar.js';

export default propostasHandler;
