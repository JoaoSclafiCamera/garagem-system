# Guia Completo de Deploy - Oracle Cloud Free Tier

## Sistema de Garagem - Capatti Veiculos

---

## 1. Analise do Projeto

### Stack Identificada

| Componente | Tecnologia | Versao |
|------------|------------|--------|
| **Frontend** | React (Create React App) | 18.3.1 |
| **Backend** | Node.js + Express | 4.21.1 |
| **Banco de Dados** | MySQL | 2.x |
| **Autenticacao** | JWT (jsonwebtoken) | 9.x |

### Variaveis de Ambiente Necessarias

**Backend (.env):**
```env
PORT=5000
DB_HOST=<IP_DO_BANCO>
DB_USER=<USUARIO>
DB_PASSWORD=<SENHA>
DB_NAME=garagem
JWT_SECRET=<CHAVE_SECRETA_32_CHARS>
ALLOWED_ORIGINS=https://seu-dominio.com
NODE_ENV=production
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://<IP_DA_VM>:5000
```

### Endpoints da API

- `GET /health` - Health check (verificacao de saude)
- `POST /auth/login` - Login
- `GET /catalogo` - Listar veiculos
- `GET /detalhes/:id` - Detalhes do veiculo
- `POST/PUT/DELETE /catalogo` - CRUD (protegido)

---

## 2. Arquitetura Recomendada (100% Gratuita)

```
┌─────────────────────────────────────────────────────────────┐
│                    ORACLE CLOUD FREE TIER                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────┐     ┌─────────────────┐              │
│   │   VERCEL/NETLIFY│     │  VM Always Free │              │
│   │   (Frontend)    │────▶│  (Backend Node) │              │
│   │   React Build   │     │  + MySQL local  │              │
│   └─────────────────┘     └─────────────────┘              │
│          │                        │                         │
│          │                        ▼                         │
│          │               ┌─────────────────┐               │
│          └──────────────▶│  Porta 5000     │               │
│                          │  (API REST)      │               │
│                          └─────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Opcao Escolhida:

| Servico | Plataforma | Custo |
|---------|------------|-------|
| Frontend | Vercel (Free) | R$ 0 |
| Backend | Oracle VM Always Free | R$ 0 |
| Banco de Dados | MySQL na propria VM | R$ 0 |

> **Por que nao Oracle Autonomous Database?**
> O projeto usa MySQL. Oracle Autonomous Database e Oracle SQL (diferente).
> Seria necessario reescrever queries. Para simplicidade, usaremos MySQL na VM.

---

## 3. Passo a Passo Detalhado

### PARTE 1: Criar Conta Oracle Cloud

#### 1.1 Acesse e Crie a Conta

1. Acesse: https://www.oracle.com/cloud/free/
2. Clique em **"Start for free"**
3. Preencha seus dados:
   - Email valido
   - Pais: Brasil
   - Nome completo
4. **IMPORTANTE**: Voce precisara de um cartao de credito para verificacao
   - Nao sera cobrado nada
   - E apenas verificacao de identidade
5. Escolha a regiao: **Brazil East (Sao Paulo)** - melhor latencia
6. Aguarde o email de confirmacao (pode demorar ate 30 min)

#### 1.2 Recursos Always Free (Gratuitos para Sempre)

- 2 VMs Ampere A1 (ARM) com 4 OCPUs e 24 GB RAM total
- OU 2 VMs AMD com 1/8 OCPU e 1 GB RAM cada
- 200 GB de armazenamento em bloco
- 10 GB de Object Storage

---

### PARTE 2: Criar a VM (Maquina Virtual)

#### 2.1 Acessar o Console

1. Faca login em: https://cloud.oracle.com
2. Va em **Menu (☰) > Compute > Instances**
3. Clique em **"Create Instance"**

#### 2.2 Configurar a VM

```
Nome da Instancia: garagem-backend
Compartment: (deixe o padrao)

Placement:
- Availability Domain: AD-1

Image and Shape:
- Clique em "Edit"
- Image: Oracle Linux 8 (ou Ubuntu 22.04)
- Shape: Clique em "Change Shape"
  - Instance Type: Virtual Machine
  - Shape Series: Ampere (ARM) - GRATUITO!
  - Shape: VM.Standard.A1.Flex
  - OCPUs: 1
  - Memory: 6 GB

Networking:
- Virtual Cloud Network: Criar nova VCN
- Nome: vcn-garagem
- Subnet: Criar nova subnet publica
- Public IP: Assign a public IPv4 address

Add SSH Keys:
- Generate a key pair for me
- BAIXE E SALVE as chaves (ssh-key.key e ssh-key.key.pub)
  MUITO IMPORTANTE: Guarde esses arquivos!
```

#### 2.3 Clicar em "Create" e Aguardar

- A VM levara 2-5 minutos para ficar pronta
- Anote o **IP Publico** quando aparecer (ex: 144.22.xxx.xxx)

---

### PARTE 3: Configurar Firewall (Liberar Portas)

#### 3.1 No Console Oracle

1. Va em **Menu > Networking > Virtual Cloud Networks**
2. Clique na VCN criada (vcn-garagem)
3. Clique na **Subnet publica**
4. Clique na **Security List** (Default Security List)
5. Clique em **"Add Ingress Rules"**

#### 3.2 Adicionar Regras

Adicione estas 3 regras:

| Source CIDR | Protocol | Destination Port | Descricao |
|-------------|----------|------------------|-----------|
| 0.0.0.0/0 | TCP | 5000 | Backend API |
| 0.0.0.0/0 | TCP | 80 | HTTP |
| 0.0.0.0/0 | TCP | 443 | HTTPS |

**Para cada regra:**
```
Source Type: CIDR
Source CIDR: 0.0.0.0/0
IP Protocol: TCP
Destination Port Range: [PORTA]
Description: [DESCRICAO]
```

---

### PARTE 4: Conectar na VM via SSH

#### 4.1 No Mac/Linux

```bash
# Dar permissao a chave
chmod 400 ~/Downloads/ssh-key.key

# Conectar (substitua o IP)
ssh -i ~/Downloads/ssh-key.key opc@SEU_IP_PUBLICO
```

#### 4.2 No Windows (usando PowerShell ou Git Bash)

```powershell
ssh -i C:\Users\SeuUsuario\Downloads\ssh-key.key opc@SEU_IP_PUBLICO
```

Se pedir para confirmar, digite `yes`.

---

### PARTE 5: Instalar Dependencias na VM

Apos conectar via SSH, execute estes comandos:

```bash
# Atualizar sistema
sudo dnf update -y

# Instalar Node.js 20 (LTS)
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# Verificar instalacao
node --version
npm --version

# Instalar MySQL
sudo dnf install -y mysql-server

# Iniciar MySQL
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Instalar Git
sudo dnf install -y git

# Abrir portas no firewall do Linux
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=3306/tcp
sudo firewall-cmd --reload
```

---

### PARTE 6: Configurar MySQL

```bash
# Acessar MySQL como root
sudo mysql

# Dentro do MySQL, execute:
```

```sql
-- Criar usuario
CREATE USER 'garagem'@'localhost' IDENTIFIED BY 'SuaSenhaSegura123!';

-- Criar banco
CREATE DATABASE garagem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Dar permissoes
GRANT ALL PRIVILEGES ON garagem.* TO 'garagem'@'localhost';
FLUSH PRIVILEGES;

-- Sair
EXIT;
```

---

### PARTE 7: Deploy do Backend

#### 7.1 Clonar/Copiar o Projeto

**Opcao A - Via Git (se tiver repositorio):**
```bash
cd ~
git clone https://github.com/seu-usuario/garagem-system.git
cd garagem-system/backend
```

**Opcao B - Via SCP (copiar arquivos locais):**

No seu computador local:
```bash
# Compactar o backend
cd /Users/joaocamera/Desktop/WalterGaragem/garagem-system
tar -czvf backend.tar.gz backend/

# Enviar para a VM
scp -i ~/Downloads/ssh-key.key backend.tar.gz opc@SEU_IP:/home/opc/
```

Na VM:
```bash
cd ~
tar -xzvf backend.tar.gz
cd backend
```

#### 7.2 Configurar Variaveis de Ambiente

```bash
# Criar arquivo .env
nano .env
```

Cole este conteudo (ajuste os valores):

```env
PORT=5000
DB_HOST=localhost
DB_USER=garagem
DB_PASSWORD=SuaSenhaSegura123!
DB_NAME=garagem
JWT_SECRET=sua_chave_super_secreta_com_32_caracteres_minimo
ALLOWED_ORIGINS=https://seu-projeto.vercel.app,http://localhost:3000
NODE_ENV=production
```

Salve: `Ctrl+O`, `Enter`, `Ctrl+X`

#### 7.3 Instalar Dependencias e Criar Tabelas

```bash
# Instalar dependencias
npm install --production

# Criar tabelas no banco
mysql -u garagem -p garagem < database/init.sql
# Digite a senha quando solicitado
```

#### 7.4 Testar Backend

```bash
# Iniciar para teste
node index.js
```

Se aparecer:
```
[...] INFO: Servidor rodando na porta 5000 (production)
[...] INFO: Conectado ao MySQL (production)
```

Sucesso! Pressione `Ctrl+C` para parar.

#### 7.5 Configurar PM2 (Manter Rodando)

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar o backend com PM2
pm2 start index.js --name garagem-backend

# Configurar para iniciar com o sistema
pm2 startup
# Execute o comando que aparecer (sudo env PATH=...)

pm2 save

# Verificar status
pm2 status
pm2 logs garagem-backend
```

---

### PARTE 8: Deploy do Frontend (Vercel)

#### 8.1 Preparar o Frontend

No seu computador local:

```bash
cd /Users/joaocamera/Desktop/WalterGaragem/garagem-system/frontend

# Criar arquivo .env.production
echo "REACT_APP_API_URL=http://SEU_IP_ORACLE:5000" > .env.production
```

#### 8.2 Subir para GitHub

```bash
# Se ainda nao tiver repositorio
git init
git add .
git commit -m "Projeto garagem para deploy"

# Criar repositorio no GitHub e conectar
git remote add origin https://github.com/seu-usuario/garagem-system.git
git push -u origin main
```

#### 8.3 Deploy na Vercel

1. Acesse: https://vercel.com
2. Clique em **"Sign up"** > Continue with GitHub
3. Clique em **"Add New Project"**
4. Selecione o repositorio `garagem-system`
5. Configure:
   ```
   Framework Preset: Create React App
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: build
   ```
6. Em **Environment Variables**, adicione:
   ```
   REACT_APP_API_URL = http://SEU_IP_ORACLE:5000
   ```
7. Clique em **"Deploy"**
8. Aguarde o deploy (2-3 minutos)
9. Anote a URL gerada (ex: `garagem-system.vercel.app`)

#### 8.4 Atualizar CORS no Backend

Na VM Oracle:

```bash
nano ~/backend/.env
```

Atualize ALLOWED_ORIGINS com a URL da Vercel:
```env
ALLOWED_ORIGINS=https://garagem-system.vercel.app,http://localhost:3000
```

Reinicie o backend:
```bash
pm2 restart garagem-backend
```

---

### PARTE 9: Adicionar Dados de Teste

Na VM Oracle:

```bash
cd ~/backend

# Executar seed (se existir)
npm run seed

# OU adicionar manualmente via MySQL:
mysql -u garagem -p garagem
```

```sql
-- Inserir usuario admin (senha: admin123)
INSERT INTO users (username, password) VALUES
('admin', '$2a$10$rOzJqQZQZQZQZQZQZQZQZOx.XxXxXxXxXxXxXxXxXxXxXxXxXxXxX');

-- Verificar
SELECT * FROM users;
SELECT * FROM vehicles;

EXIT;
```

---

### PARTE 10: Configurar HTTPS (Opcional mas Recomendado)

Para producao real, voce precisaria de um dominio e certificado SSL.
Para projeto academico, HTTP funciona.

Se quiser HTTPS gratuito depois:
1. Registre um dominio gratuito em https://freenom.com
2. Use Cloudflare para SSL gratuito
3. Ou use Nginx como proxy reverso com Let's Encrypt

---

## 4. Scripts Prontos

### 4.1 Script de Deploy Automatizado

Crie este arquivo na VM como `deploy.sh`:

```bash
#!/bin/bash

echo "=== Deploy Garagem System ==="

# Parar servico atual
pm2 stop garagem-backend 2>/dev/null

# Ir para pasta do projeto
cd ~/backend

# Atualizar codigo (se usar git)
# git pull origin main

# Instalar dependencias
npm install --production

# Rodar migrations (se houver)
# npm run migrate

# Iniciar com PM2
pm2 start index.js --name garagem-backend
pm2 save

echo "=== Deploy concluido! ==="
pm2 status
```

Dar permissao: `chmod +x deploy.sh`

### 4.2 Script de Backup do Banco

```bash
#!/bin/bash
# backup.sh

DATA=$(date +%Y%m%d_%H%M%S)
mysqldump -u garagem -pSuaSenhaSegura123! garagem > ~/backups/garagem_$DATA.sql
echo "Backup criado: garagem_$DATA.sql"

# Manter apenas ultimos 7 backups
cd ~/backups
ls -t | tail -n +8 | xargs rm -f 2>/dev/null
```

### 4.3 Dockerfile (Alternativa com Docker)

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
```

### 4.4 docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - DB_HOST=mysql
      - DB_USER=garagem
      - DB_PASSWORD=SuaSenhaSegura123!
      - DB_NAME=garagem
      - JWT_SECRET=sua_chave_secreta_32_caracteres
      - ALLOWED_ORIGINS=https://seu-app.vercel.app
      - NODE_ENV=production
    depends_on:
      - mysql
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=garagem
      - MYSQL_USER=garagem
      - MYSQL_PASSWORD=SuaSenhaSegura123!
    volumes:
      - mysql_data:/var/lib/mysql
      - ./backend/database/init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

volumes:
  mysql_data:
```

---

## 5. Deixar Apresentavel para o Professor

### 5.1 URLs Finais

Apos o deploy, voce tera:

| Servico | URL |
|---------|-----|
| Frontend | https://garagem-system.vercel.app |
| API Backend | http://SEU_IP:5000 |
| Health Check | http://SEU_IP:5000/health |

### 5.2 Credenciais de Teste

```
Usuario: admin
Senha: admin123
```

### 5.3 Testar Health Check

```bash
curl http://SEU_IP:5000/health
```

Resposta esperada:
```json
{
  "status": "healthy",
  "database": "connected",
  "environment": "production",
  "timestamp": "2024-..."
}
```

### 5.4 Instrucoes para o Professor

Crie um arquivo `INSTRUCOES.txt`:

```
============================================
SISTEMA DE GARAGEM - CAPATTI VEICULOS
Projeto Academico
============================================

ACESSO AO SISTEMA:
------------------
URL: https://garagem-system.vercel.app

CREDENCIAIS DE ADMIN:
---------------------
Usuario: admin
Senha: admin123

FUNCIONALIDADES:
----------------
1. Pagina inicial com destaques
2. Catalogo de veiculos com filtros
3. Detalhes do veiculo
4. Area administrativa (login necessario)
   - Cadastro de veiculos
   - Edicao de veiculos
   - Exclusao de veiculos

TECNOLOGIAS UTILIZADAS:
-----------------------
- Frontend: React 18
- Backend: Node.js + Express
- Banco de Dados: MySQL
- Hospedagem: Oracle Cloud + Vercel

API ENDPOINTS:
--------------
- GET  /health - Status do sistema
- GET  /catalogo - Lista veiculos
- GET  /detalhes/:id - Detalhes
- POST /auth/login - Autenticacao

============================================
```

---

## 6. Checklist Final de Validacao

### Pre-Deploy
- [ ] Conta Oracle Cloud criada
- [ ] VM Always Free criada
- [ ] IP Publico anotado
- [ ] Chave SSH salva em local seguro
- [ ] Portas 5000, 80, 443 liberadas no Security List

### Backend
- [ ] Node.js instalado na VM
- [ ] MySQL instalado e rodando
- [ ] Banco 'garagem' criado
- [ ] Usuario do banco criado
- [ ] Tabelas criadas (init.sql executado)
- [ ] Arquivo .env configurado
- [ ] Backend rodando com PM2
- [ ] `curl http://IP:5000/health` retorna "healthy"

### Frontend
- [ ] Repositorio no GitHub
- [ ] Projeto importado na Vercel
- [ ] Variavel REACT_APP_API_URL configurada
- [ ] Build com sucesso
- [ ] Site abrindo na URL da Vercel

### Integracao
- [ ] Frontend consegue chamar o backend (sem erro de CORS)
- [ ] Login funcionando
- [ ] Listagem de veiculos funcionando
- [ ] Cadastro de veiculo funcionando

### Apresentacao
- [ ] URL do frontend anotada
- [ ] URL do health check anotada
- [ ] Credenciais de teste prontas
- [ ] Dados de exemplo no banco
- [ ] Arquivo de instrucoes criado

---

## 7. Troubleshooting (Problemas Comuns)

### Erro de CORS
```
Access to fetch at 'http://IP:5000' has been blocked by CORS
```
**Solucao:** Verifique se a URL do frontend esta em `ALLOWED_ORIGINS` no .env do backend.

### Conexao Recusada
```
curl: (7) Failed to connect to IP port 5000
```
**Solucao:**
1. Verifique se o backend esta rodando: `pm2 status`
2. Verifique o firewall: `sudo firewall-cmd --list-all`
3. Verifique o Security List na Oracle

### Banco Nao Conecta
```
ERRO: Falha ao conectar ao banco
```
**Solucao:**
1. Verifique se MySQL esta rodando: `sudo systemctl status mysqld`
2. Verifique credenciais no .env
3. Teste conexao: `mysql -u garagem -p garagem`

### VM Nao Inicia
Se a VM ficar em "Provisioning" por muito tempo:
- Pode ser falta de recursos na regiao
- Tente outra Availability Domain (AD-2 ou AD-3)
- Ou tente shape AMD ao inves de ARM

---

## 8. Custos (Confirmacao)

| Recurso | Custo Mensal |
|---------|--------------|
| VM Always Free (ARM 1 OCPU, 6GB) | R$ 0,00 |
| Armazenamento 50GB | R$ 0,00 |
| Vercel Free Tier | R$ 0,00 |
| **TOTAL** | **R$ 0,00** |

> Voce pode usar esses recursos indefinidamente sem pagar nada!

---

## Conclusao

Seguindo este guia, voce tera:

1. **Frontend** rodando na Vercel com URL publica
2. **Backend** rodando na Oracle Cloud 24/7
3. **Banco de dados** MySQL com seus dados
4. **Link funcional** para enviar ao professor

Boa sorte com seu projeto academico! 🎓
