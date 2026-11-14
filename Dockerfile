# ==============================================================================
# Dockerfile Multi-Stage — Rafael Pita Solutions / MeuPortfolio v2 & PIT.AI
# Otimizado para Produção com Node.js 20 Alpine e Nginx Alpine (Tamanho Final < 35MB)
# ==============================================================================

# ------------------------------------------------------------------------------
# Estágio 1: Compilação dos Assets React + Vite
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Variáveis de Build (injetadas pelo Docker Compose ou CI/CD)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_GEMINI_API_KEY
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG GOOGLE_PLACES_API_KEY
ARG VITE_VPS_MONITOR_API_URL
ARG VITE_VPS_MONITOR_TOKEN
ARG VITE_GOOGLE_CLIENT_ID

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY \
    VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
    VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
    GOOGLE_PLACES_API_KEY=$GOOGLE_PLACES_API_KEY \
    VITE_VPS_MONITOR_API_URL=$VITE_VPS_MONITOR_API_URL \
    VITE_VPS_MONITOR_TOKEN=$VITE_VPS_MONITOR_TOKEN \
    VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Instala dependências incluindo devDependencies para que o Vite e plugins fiquem disponíveis
COPY package*.json ./
RUN npm install --include=dev --legacy-peer-deps

# Copia código-fonte e scripts de sitemap
COPY . .

# Compilação otimizada de produção
RUN npm run build

# ------------------------------------------------------------------------------
# Estágio 2: Imagem Final de Execução com Nginx Alpine Ultra-Leve
# ------------------------------------------------------------------------------
FROM nginx:1.25-alpine AS runner

# Remove configuração padrão do Nginx
RUN rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*

# Copia a configuração otimizada de SPA e compressão
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados do estágio anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposição da porta padrão HTTP
EXPOSE 80

# Verificação de saúde nativa do container
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/healthz || exit 1

# Comando de inicialização do servidor
CMD ["nginx", "-g", "daemon off;"]
