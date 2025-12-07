FROM node:20-alpine

# Criar diretorio de trabalho
WORKDIR /app

# Copiar arquivos de dependencias
COPY package*.json ./

# Instalar dependencias (apenas producao)
RUN npm install --production

# Copiar codigo fonte
COPY . .

# Expor porta
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Comando de inicializacao
CMD ["node", "index.js"]
