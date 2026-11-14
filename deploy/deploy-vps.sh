#!/bin/bash
# ==============================================================================
# Script de Deploy e Atualização Contínua via Git na VPS — Rafael Pita Solutions
# Uso: bash deploy/deploy-vps.sh
# ==============================================================================

set -e

echo "======================================================================"
echo "🚀 INICIANDO DEPLOY DO SISTEMA & PIT.AI NA VPS"
echo "======================================================================"

# Diretório base do projeto (ajuste se necessário para seu caminho na VPS)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo "📂 Diretório de Trabalho: $PROJECT_DIR"

# 1. Puxa as atualizações mais recentes do Git
echo "📥 1. Atualizando repositório via Git..."
git fetch origin main
git reset --hard origin/main

# 2. Verifica existência do arquivo .env
if [ ! -f .env ]; then
    echo "⚠️ Arquivo .env não encontrado! Criando a partir de .env.example..."
    cp .env.example .env
    echo "❗ Por favor, revise e configure suas chaves reais no arquivo .env."
fi

# 3. Compilação e inicialização dos containers Docker
echo "🐳 2. Construindo e subindo os containers Docker..."
docker compose build portfolio-web
docker compose up -d

# 4. Limpeza de imagens intermediárias antigas
echo "🧹 3. Limpando imagens órfãs para liberar espaço em disco..."
docker image prune -f

# 5. Verificação de Saúde (Health Check)
echo "🩺 4. Validando integridade do sistema..."
sleep 5

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3002/healthz || echo "000")

if [ "$HTTP_STATUS" == "200" ]; then
    echo "✅ [SUCESSO] Aplicação Web online e respondendo na porta 3002 (HTTP 200 OK)."
else
    echo "⚠️ Aplicação respondeu com status: $HTTP_STATUS. Verifique os logs com 'docker compose logs portfolio-web'."
fi

# 6. Recarrega o Nginx do Host se existir
if command -v systemctl &> /dev/null && systemctl is-active --quiet nginx; then
    echo "🔄 5. Recarregando proxy reverso Nginx da VPS..."
    sudo systemctl reload nginx || true
fi

echo "======================================================================"
echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
echo "   Domínio Principal: https://rafaelpitaoficial.com.br"
echo "   PIT.AI (J.A.R.V.I.S.): https://pitai.rafaelpitaoficial.com.br"
echo "======================================================================"
