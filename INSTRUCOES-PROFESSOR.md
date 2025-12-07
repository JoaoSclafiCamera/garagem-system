# Sistema de Garagem - Capatti Veiculos
## Projeto Academico

---

## Acesso ao Sistema

**URL do Sistema:** https://[URL_VERCEL]

**Credenciais de Administrador:**
- Usuario: `admin`
- Senha: `admin123`

---

## Funcionalidades do Sistema

### Area Publica (Sem Login)

1. **Pagina Inicial**
   - Apresentacao da empresa
   - Veiculos em destaque/promocao
   - Navegacao para o catalogo

2. **Catalogo de Veiculos**
   - Listagem de todos os veiculos
   - Filtros por marca, preco, ano
   - Busca por nome
   - Ordenacao

3. **Detalhes do Veiculo**
   - Informacoes completas
   - Galeria de fotos
   - Especificacoes tecnicas
   - Caracteristicas

### Area Administrativa (Com Login)

4. **Login**
   - Acesse `/login` ou clique em "Entrar"
   - Use as credenciais acima

5. **Gerenciamento de Veiculos**
   - Cadastrar novo veiculo
   - Editar veiculo existente
   - Excluir veiculo
   - Upload de imagens

---

## Tecnologias Utilizadas

| Camada | Tecnologia | Descricao |
|--------|------------|-----------|
| Frontend | React 18 | Biblioteca JavaScript para interfaces |
| Estilizacao | CSS3 | Estilos customizados |
| Roteamento | React Router | Navegacao SPA |
| Backend | Node.js + Express | API REST |
| Banco de Dados | MySQL | Banco relacional |
| Autenticacao | JWT | Tokens seguros |
| Hospedagem Frontend | Vercel | CDN global |
| Hospedagem Backend | Oracle Cloud | VM Always Free |

---

## Arquitetura

```
┌─────────────┐     HTTP      ┌─────────────┐     SQL      ┌─────────────┐
│   Browser   │ ────────────▶ │   Backend   │ ──────────▶  │   MySQL     │
│   (React)   │ ◀──────────── │  (Node.js)  │ ◀──────────  │  Database   │
└─────────────┘    JSON       └─────────────┘              └─────────────┘
     │
     │ Deploy
     ▼
┌─────────────┐
│   Vercel    │
│   (CDN)     │
└─────────────┘
```

---

## API REST - Endpoints

### Publicos

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/health` | Status do sistema |
| GET | `/catalogo` | Listar veiculos |
| GET | `/catalogo/brands` | Listar marcas |
| GET | `/detalhes/:id` | Detalhes de um veiculo |

### Protegidos (Requer Login)

| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | `/auth/login` | Autenticacao |
| GET | `/auth/verify` | Verificar token |
| POST | `/catalogo` | Criar veiculo |
| PUT | `/catalogo/:id` | Atualizar veiculo |
| DELETE | `/catalogo/:id` | Remover veiculo |

---

## Verificacao do Sistema

### Health Check

Acesse: `http://[IP_BACKEND]:5000/health`

Resposta esperada:
```json
{
  "status": "healthy",
  "database": "connected",
  "environment": "production",
  "timestamp": "2024-..."
}
```

---

## Estrutura do Banco de Dados

### Tabela: users
| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | INT | Chave primaria |
| username | VARCHAR(255) | Nome de usuario |
| password | VARCHAR(255) | Senha (hash bcrypt) |
| created_at | TIMESTAMP | Data de criacao |

### Tabela: vehicles
| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | INT | Chave primaria |
| name | VARCHAR(255) | Nome do veiculo |
| brand | VARCHAR(255) | Marca |
| price | DECIMAL(12,2) | Preco |
| year | INT | Ano |
| kms | INT | Quilometragem |
| color | VARCHAR(100) | Cor |
| description | TEXT | Descricao |
| images | JSON | URLs das imagens |
| features | JSON | Caracteristicas |
| fuelType | VARCHAR(50) | Combustivel |
| transmission | VARCHAR(50) | Cambio |
| ... | ... | (outros campos) |

---

## Seguranca Implementada

- Senhas criptografadas com bcrypt
- Autenticacao via JWT com expiracao
- Rate limiting para prevenir ataques
- Validacao de inputs
- CORS configurado
- Queries parametrizadas (prevencao SQL Injection)

---

## Contato

**Aluno:** [Seu Nome]
**Curso:** [Nome do Curso]
**Disciplina:** [Nome da Disciplina]
**Professor:** [Nome do Professor]
