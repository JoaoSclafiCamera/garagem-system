#!/bin/bash
# ===========================================
# Script de Deploy - VM Oracle Cloud
# Sistema Garagem - Capatti Veiculos
# ===========================================

set -e

echo "============================================"
echo "     DEPLOY - GARAGEM SYSTEM"
echo "============================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funcao de log
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se PM2 esta instalado
if ! command -v pm2 &> /dev/null; then
    log_warn "PM2 nao encontrado. Instalando..."
    sudo npm install -g pm2
fi

# Diretorio do projeto
PROJECT_DIR="${HOME}/backend"

if [ ! -d "$PROJECT_DIR" ]; then
    log_error "Diretorio do projeto nao encontrado: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

# Parar servico atual
log_info "Parando servico atual..."
pm2 stop garagem-backend 2>/dev/null || true

# Instalar/atualizar dependencias
log_info "Instalando dependencias..."
npm install --production

# Verificar arquivo .env
if [ ! -f ".env" ]; then
    log_error "Arquivo .env nao encontrado!"
    log_info "Copie .env.production para .env e configure os valores"
    exit 1
fi

# Iniciar com PM2
log_info "Iniciando backend com PM2..."
pm2 start index.js --name garagem-backend

# Salvar configuracao PM2
pm2 save

# Verificar status
log_info "Verificando status..."
sleep 3

if pm2 show garagem-backend | grep -q "online"; then
    log_info "Backend iniciado com sucesso!"
    echo ""
    echo "============================================"
    echo "  Status do servico:"
    pm2 status garagem-backend
    echo ""
    echo "  Testar health check:"
    echo "  curl http://localhost:5000/health"
    echo "============================================"
else
    log_error "Falha ao iniciar backend!"
    pm2 logs garagem-backend --lines 20
    exit 1
fi
