# GUIA OFICIAL DE MIGRAÇÃO DA VERCEL PARA A VPS COM DOCKER & GIT

Este documento contém o passo a passo completo para migrar a aplicação principal (**Portfólio**, **Landing Pages**, **Radar Google Maps** e **PIT.AI / J.A.R.V.I.S.**) da Vercel para a sua **VPS Hostinger / Oracle Cloud**, rodando em **Docker** e atualizada via **Git**.

---

## 1. Visão Geral da Arquitetura na VPS

* **`portfolio-web`**: Imagem Docker customizada com Node.js 20 Alpine para compilação do Vite e Nginx Alpine ultra-rápido para servir o SPA.
* **Porta Interna do Web**: `127.0.0.1:3002` (vinculada com segurança apenas ao localhost).
* **`pitai-postgres`**: Banco de Dados PostgreSQL 16 Alpine dedicado ao PIT.AI na porta `127.0.0.1:5434`, com volume persistente mapeado (`pitai_postgres_data`).
* **Nginx da VPS (Host)**: Proxy reverso com terminação SSL (Let's Encrypt / Certbot) encaminhando os domínios `rafaelpitaoficial.com.br`, `www` e `pitai.rafaelpitaoficial.com.br` para o container.

---

## 2. Passo a Passo de Instalação na VPS (Primeira Vez)

### Passo 2.1: Conectar na VPS via SSH
No seu terminal local (PowerShell ou Bash):
```bash
ssh usuario@ip-da-sua-vps
```

### Passo 2.2: Clonar o Repositório do Git
Se o repositório ainda não estiver clonado na VPS:
```bash
cd ~
git clone https://github.com/pitarf/MEUPORTFOLIOV2.git
cd MEUPORTFOLIOV2
```

Se já estiver clonado, basta entrar na pasta e atualizar:
```bash
cd ~/MEUPORTFOLIOV2
git pull origin main
```

### Passo 2.3: Configurar o Arquivo `.env` na VPS
Copie o exemplo e configure as variáveis de produção:
```bash
cp .env.example .env
nano .env
```
Preencha os valores reais de:
* `VITE_SUPABASE_URL`
* `VITE_SUPABASE_ANON_KEY`
* `VITE_GEMINI_API_KEY`
* `VITE_GOOGLE_CLIENT_ID` (já preenchido no seu repositório)
* `PITAI_DB_PASSWORD` (defina uma senha forte para o PostgreSQL)
* Chaves do Firebase e Google Places

Pressione `Ctrl + O` e `Enter` para salvar, e `Ctrl + X` para sair do editor `nano`.

### Passo 2.4: Construir e Iniciar os Containers Docker
Execute na raiz da pasta do projeto:
```bash
docker compose up -d --build
```

Para verificar se os dois containers estão saudáveis (`healthy`):
```bash
docker compose ps
```

E para testar se a aplicação web está respondendo localmente:
```bash
curl -I http://127.0.0.1:3002/healthz
```
*Deve retornar `HTTP/1.1 200 OK`.*

---

## 3. Configurar o Nginx da VPS & Certificados SSL (HTTPS)

### Passo 3.1: Copiar a Configuração do Nginx
Copie o arquivo preparado para os sites disponíveis do Nginx:
```bash
sudo cp deploy/nginx/rafaelpitaoficial.conf /etc/nginx/sites-available/rafaelpitaoficial.conf
sudo ln -s /etc/nginx/sites-available/rafaelpitaoficial.conf /etc/nginx/sites-enabled/
```

### Passo 3.2: Testar e Recarregar o Nginx
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Passo 3.3: Gerar os Certificados SSL Gratuitos (Certbot)
Execute o Certbot para blindar todos os domínios com HTTPS automático:
```bash
sudo certbot --nginx -d rafaelpitaoficial.com.br -d www.rafaelpitaoficial.com.br -d pitai.rafaelpitaoficial.com.br
```
Selecione a opção de redirecionar todo o tráfego HTTP para HTTPS.

---

## 4. Desvincular da Vercel & Apontar o DNS

No painel onde você comprou o domínio (Hostinger, Registro.br, Cloudflare ou GoDaddy):

1. **Localize as entradas de DNS do tipo `A`**:
   * Substitua o IP da Vercel (`76.76.21.21`) pelo **IP público da sua VPS** para:
     * `@` (ou `rafaelpitaoficial.com.br`)
     * `www`
     * `pitai` (crie uma entrada tipo `A` com nome `pitai` apontando para o IP da VPS)
2. **Na Vercel:**
   * Acesse o projeto na Vercel → **Settings** → **Domains** → Remova o domínio `rafaelpitaoficial.com.br`.

---

## 5. Como Fazer Atualizações Futuras pelo Git

Sempre que você alterar o código no seu computador e subir para o GitHub:
```bash
git add .
git commit -m "sua mensagem"
git push origin main
```

Na VPS, você só precisa rodar o script automatizado de 1 linha:
```bash
bash deploy/deploy-vps.sh
```

O script automaticamente:
1. Faz `git pull` da `main`.
2. Reconstrói a imagem Docker otimizada.
3. Reinicia os containers sem perda de dados.
4. Limpa imagens antigas para poupar espaço em disco.
5. Recarrega o Nginx com zero tempo de inatividade.
