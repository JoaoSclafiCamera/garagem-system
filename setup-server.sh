#!/bin/bash
# Setup completo do servidor - Garagem System

set -e
echo "=== INICIANDO SETUP ==="

# 1. Instalar Node.js via dnf module (mais rapido)
echo ">>> Instalando Node.js..."
sudo dnf module enable nodejs:20 -y
sudo dnf install nodejs -y
node --version

# 2. Instalar MySQL
echo ">>> Instalando MySQL..."
sudo dnf install mysql-server -y
sudo systemctl start mysqld
sudo systemctl enable mysqld

# 3. Configurar MySQL
echo ">>> Configurando banco de dados..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS garagem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'garagem'@'localhost' IDENTIFIED BY 'Garagem123!';"
sudo mysql -e "GRANT ALL PRIVILEGES ON garagem.* TO 'garagem'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# 4. Abrir firewall
echo ">>> Configurando firewall..."
sudo firewall-cmd --permanent --add-port=5000/tcp 2>/dev/null || true
sudo firewall-cmd --reload 2>/dev/null || true

# 5. Criar diretorio do projeto
echo ">>> Preparando diretorio..."
mkdir -p ~/garagem-backend

echo "=== SETUP CONCLUIDO ==="
echo "Node: $(node --version)"
echo "NPM: $(npm --version)"
