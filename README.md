# Sistema Garagem - Capatti Veiculos

Sistema completo de gerenciamento e catalogo de veiculos para a Capatti Veiculos.

## Arquitetura

```
garagem-system/
├── backend/           # API Node.js/Express
│   ├── database/      # Scripts SQL e setup
│   ├── index.js       # Servidor principal
│   └── .env.example   # Template de variaveis
├── frontend/          # React 18
│   ├── src/
│   │   ├── components/  # Componentes reutilizaveis
│   │   ├── pages/       # Paginas da aplicacao
│   │   ├── services/    # Servicos de API
│   │   └── styles/      # CSS Modules
│   └── .env.example   # Template de variaveis
└── README.md
```

## Pre-requisitos

- Node.js 18+
- MySQL 8.0+
- npm ou yarn

## Configuracao Rapida

### 1. Banco de Dados

```bash
# Crie o banco e usuario no MySQL
mysql -u root -p

# Execute o script de setup
cd backend
node database/setup.js
```

### 2. Backend

```bash
cd backend

# Copie e configure as variaveis
cp .env.example .env

# Edite o .env com suas credenciais
# IMPORTANTE: Gere um JWT_SECRET forte!

# Instale dependencias
npm install

# Inicie o servidor
npm start
```

### 3. Frontend

```bash
cd frontend

# Copie e configure as variaveis
cp .env.example .env

# Instale dependencias
npm install

# Inicie a aplicacao
npm start
```

### 4. Acesse

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## Credenciais Padrao

```
Usuario: admin
Senha: admin123
```

**IMPORTANTE:** Altere a senha do admin em producao!

## API Endpoints

### Publicos

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/health` | Status do servidor |
| GET | `/catalogo` | Lista veiculos (com paginacao) |
| GET | `/detalhes/:id` | Detalhes de um veiculo |
| POST | `/auth/login` | Autenticacao |

### Protegidos (requer JWT)

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/auth/verify` | Verifica token |
| POST | `/catalogo` | Criar veiculo |
| PUT | `/catalogo/:id` | Atualizar veiculo |
| DELETE | `/catalogo/:id` | Remover veiculo |

### Query Parameters (GET /catalogo)

| Parametro | Descricao | Exemplo |
|-----------|-----------|---------|
| page | Pagina atual | `?page=1` |
| limit | Itens por pagina | `?limit=12` |
| search | Busca por texto | `?search=civic` |
| brand | Filtrar por marca | `?brand=Honda` |
| sort | Campo de ordenacao | `?sort=price` |
| order | Direcao (ASC/DESC) | `?order=ASC` |

## Estrutura do Banco de Dados

### Tabela: users

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | INT | ID unico |
| username | VARCHAR(255) | Nome de usuario |
| password | VARCHAR(255) | Senha (bcrypt) |
| created_at | TIMESTAMP | Data de criacao |

### Tabela: vehicles

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | INT | ID unico |
| name | VARCHAR(255) | Nome/modelo |
| brand | VARCHAR(255) | Marca |
| price | DECIMAL(12,2) | Preco |
| year | INT | Ano |
| kms | INT | Quilometragem |
| color | VARCHAR(100) | Cor |
| description | TEXT | Descricao |
| images | JSON | Array de URLs |
| features | JSON | Array de opcionais |
| fuelType | VARCHAR(50) | Combustivel |
| transmission | VARCHAR(50) | Cambio |
| doors | INT | Portas |
| engine | VARCHAR(100) | Motor |
| power | INT | Potencia (cv) |
| consumption | VARCHAR(50) | Consumo |
| docsStatus | VARCHAR(100) | Status dos docs |
| warranty | VARCHAR(50) | Garantia |
| accidents | BOOLEAN | Teve sinistros |
| paintOriginal | VARCHAR(50) | Pintura original |
| tiresCondition | VARCHAR(50) | Condicao dos pneus |
| lastMaintenance | VARCHAR(50) | Ultima revisao |
| isPromotion | BOOLEAN | Em promocao |

## Seguranca

O sistema implementa:

- **CORS restritivo** - Apenas origins permitidos
- **Rate Limiting** - 100 req/15min geral, 5 req/15min login
- **JWT** - Tokens de autenticacao
- **Bcrypt** - Hash de senhas
- **Validacao de inputs** - Sanitizacao de dados

## Componentes Reutilizaveis

### Layout

- `Header` - Cabecalho com navegacao
- `Footer` - Rodape com contatos

### Shared

- `Toast` / `useToast` - Sistema de notificacoes
- `ConfirmModal` - Modal de confirmacao
- `SkeletonCard` - Loading skeleton
- `ErrorBoundary` - Tratamento de erros

## Variaveis de Ambiente

### Backend (.env)

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=garagem
JWT_SECRET=chave_segura_32_caracteres
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000
```

## Scripts Disponiveis

### Backend

```bash
npm start      # Inicia o servidor
npm run dev    # Modo desenvolvimento (nodemon)
```

### Frontend

```bash
npm start      # Servidor de desenvolvimento
npm run build  # Build de producao
npm test       # Executa testes
```

## Tecnologias

### Backend

- Node.js
- Express 4.21
- MySQL2
- JWT (jsonwebtoken)
- Bcryptjs
- Express Rate Limit
- CORS

### Frontend

- React 18.3
- React Router DOM 6.29
- CSS Modules
- React Icons

## Contato

- **WhatsApp:** +55 (17) 98132-8888
- **Instagram:** @capattiveiculos
- **Facebook:** Capatti Veiculos

## Licenca

Todos os direitos reservados - Capatti Veiculos
CNPJ: 50.200.649/0001-24
