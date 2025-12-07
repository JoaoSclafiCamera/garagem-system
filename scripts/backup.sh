#!/bin/bash
# ===========================================
# Script de Backup - Banco de Dados
# Sistema Garagem
# ===========================================

# Configuracoes
BACKUP_DIR="${HOME}/backups"
DB_USER="garagem"
DB_NAME="garagem"
RETENTION_DAYS=7

# Criar diretorio se nao existir
mkdir -p "$BACKUP_DIR"

# Data atual
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/garagem_${DATE}.sql"

echo "============================================"
echo "     BACKUP - GARAGEM DATABASE"
echo "============================================"

# Solicitar senha
read -sp "Digite a senha do MySQL: " DB_PASSWORD
echo ""

# Realizar backup
echo "[INFO] Criando backup..."
mysqldump -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    # Comprimir backup
    gzip "$BACKUP_FILE"
    BACKUP_FILE="${BACKUP_FILE}.gz"

    echo "[INFO] Backup criado: $BACKUP_FILE"
    echo "[INFO] Tamanho: $(du -h "$BACKUP_FILE" | cut -f1)"

    # Limpar backups antigos
    echo "[INFO] Removendo backups com mais de $RETENTION_DAYS dias..."
    find "$BACKUP_DIR" -name "garagem_*.sql.gz" -mtime +$RETENTION_DAYS -delete

    # Listar backups
    echo ""
    echo "Backups disponiveis:"
    ls -lh "$BACKUP_DIR"/*.gz 2>/dev/null || echo "Nenhum backup encontrado"
else
    echo "[ERROR] Falha ao criar backup!"
    exit 1
fi

echo "============================================"
