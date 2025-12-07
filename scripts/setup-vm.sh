#!/bin/bash
# ===========================================
# Script de Setup Inicial - VM Oracle Cloud
# Sistema Garagem - Capatti Veiculos
# Execute este script APENAS na primeira vez
# ===========================================

set -e

echo "============================================"
echo "     SETUP INICIAL - GARAGEM SYSTEM"
echo "============================================"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Verificar se e Oracle Linux ou Ubuntu
if [ -f /etc/oracle-release ]; then
    PKG_MANAGER="dnf"
    log_info "Detectado: Oracle Linux"
elif [ -f /etc/lsb-release ]; then
    PKG_MANAGER="apt"
    log_info "Detectado: Ubuntu"
else
    log_error "Sistema operacional nao suportado"
    exit 1
fi

# ===========================================
# 1. Atualizar sistema
# ===========================================
log_info "Atualizando sistema..."
if [ "$PKG_MANAGER" == "dnf" ]; then
    sudo dnf update -y
else
    sudo apt update && sudo apt upgrade -y
fi

# ===========================================
# 2. Instalar Node.js 20
# ===========================================
log_info "Instalando Node.js 20..."
if [ "$PKG_MANAGER" == "dnf" ]; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo dnf install -y nodejs
else
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

log_info "Node.js versao: $(node --version)"
log_info "NPM versao: $(npm --version)"

# ===========================================
# 3. Instalar MySQL
# ===========================================
log_info "Instalando MySQL..."
if [ "$PKG_MANAGER" == "dnf" ]; then
    sudo dnf install -y mysql-server
    sudo systemctl start mysqld
    sudo systemctl enable mysqld
else
    sudo apt install -y mysql-server
    sudo systemctl start mysql
    sudo systemctl enable mysql
fi

# ===========================================
# 4. Instalar Git
# ===========================================
log_info "Instalando Git..."
if [ "$PKG_MANAGER" == "dnf" ]; then
    sudo dnf install -y git
else
    sudo apt install -y git
fi

# ===========================================
# 5. Instalar PM2
# ===========================================
log_info "Instalando PM2..."
sudo npm install -g pm2

# ===========================================
# 6. Configurar Firewall
# ===========================================
log_info "Configurando firewall..."
if [ "$PKG_MANAGER" == "dnf" ]; then
    sudo firewall-cmd --permanent --add-port=5000/tcp
    sudo firewall-cmd --permanent --add-port=80/tcp
    sudo firewall-cmd --permanent --add-port=443/tcp
    sudo firewall-cmd --reload
else
    sudo ufw allow 5000/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
fi

# ===========================================
# 7. Criar diretorios
# ===========================================
log_info "Criando diretorios..."
mkdir -p ~/backend
mkdir -p ~/backups

# ===========================================
# Resumo
# ===========================================
echo ""
echo "============================================"
echo "     SETUP CONCLUIDO!"
echo "============================================"
echo ""
echo "Proximos passos:"
echo ""
echo "1. Configurar MySQL:"
echo "   sudo mysql"
echo "   CREATE USER 'garagem'@'localhost' IDENTIFIED BY 'SuaSenha123!';"
echo "   CREATE DATABASE garagem CHARACTER SET utf8mb4;"
echo "   GRANT ALL PRIVILEGES ON garagem.* TO 'garagem'@'localhost';"
echo "   FLUSH PRIVILEGES;"
echo "   EXIT;"
echo ""
echo "2. Copiar arquivos do backend para ~/backend"
echo ""
echo "3. Configurar ~/backend/.env"
echo ""
echo "4. Executar: cd ~/backend && npm install"
echo ""
echo "5. Criar tabelas: mysql -u garagem -p garagem < database/init.sql"
echo ""
echo "6. Executar: ./deploy-vm.sh"
echo ""
echo "============================================"
