# Visão Geral do Projeto Capatti Veículos

Aplicação completa para catálogo e gestão de veículos, com frontend em React (CRA) e backend em Node.js/Express, usando MySQL e autenticação JWT.

## Estrutura
- `frontend/`: SPA React com rotas para home, catálogo e área administrativa.
  - `src/App.js`: define rotas públicas (`/`, `/home`, `/catalogo`, `/detalhes/:id`) e rota protegida (`/gerente`).
  - Páginas principais:
    - `HomePremium.jsx`: landing page com hero, destaques, serviços e contatos.
    - `components/Catalogo/CatalogoPremium.jsx`: catálogo premium com filtros avançados, busca, paginação e cards (`VehicleCard`).
    - `Detalhes.jsx`: página de detalhes com galeria, especificações e CTA de WhatsApp.
    - `CadastroEstoque.jsx`: painel administrativo para listar, criar, editar e excluir veículos.
    - `Login.js`: tela de autenticação para acesso ao painel.
  - Componentes auxiliares: `VehicleCard`, `SmartFilters`, `SearchBar`, `AnimatedCounter` e estilos em `src/styles/`.
- `backend/`: API Express.
  - `index.js`: rotas `/auth/login`, `/catalogo` (CRUD) e `/detalhes/:id`.
  - `routes/`, `controllers/`: organização das rotas de catálogo e autenticação.
  - `db.js`: conexão MySQL via variáveis de ambiente (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
- `uploads/`: armazenamento local de imagens quando usado upload via multer (`server.js`).

## Fluxos Principais
- **Home**: apresenta destaques, categorias, serviços, depoimentos e CTA para catálogo e WhatsApp.
- **Catálogo**:
  - Filtros: texto, marca, faixa de preço, ano, km, cor e ordenação (preço, ano, km, relevância).
  - Modos de visualização: grid ou lista, com paginação.
  - Cards (`VehicleCard`): mostram badges (0km, destaque, oferta), preço formatado, specs e links para WhatsApp e detalhes.
- **Detalhes**:
  - Galeria com miniaturas e zoom.
  - Especificações técnicas (preço, ano, km, cor, combustível, câmbio, portas, motor, potência, consumo, documentação).
  - Histórico (garantia, acidentes, manutenção) e opcionais listados.
  - CTA direto para WhatsApp com mensagem pré-preenchida.
- **Admin (Gerente)**:
  - Tela `CadastroEstoque` com listagem, criação, edição e exclusão de veículos.
  - Formulário contempla imagens, opcionais, specs (preço, ano, km), mecânica (fuelType, transmission, engine, power, consumption), documentação e histórico.
  - Acesso protegido por login (`Login.js`); token armazenado em `localStorage`.

## Estilo e UI
- CSS modular em `src/styles/` para catálogo premium, cards, filtros, busca e home.
- Ícones com `react-icons`.
- Botões de ação para WhatsApp, detalhes e navegação.

## Configuração
- Backend:
  - Instalar dependências: `cd backend && npm install`.
  - Variáveis `.env`: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`.
  - Rodar API: `node index.js` (porta 5000).
- Uploads (opcional): `node server.js` para testes de upload via `multer` (não usar simultâneo a `index.js` na mesma porta).
- Frontend:
  - Instalar dependências: `cd frontend && npm install`.
  - Rodar dev: `npm start` (http://localhost:3000).
  - Build produção: `npm run build`.

## Endpoints Principais (API)
- `POST /auth/login`: login administrativo (JWT).
- `GET /catalogo`: lista veículos.
- `POST /catalogo`: cria veículo.
- `PUT /catalogo/:id`: atualiza veículo.
- `DELETE /catalogo/:id`: remove veículo.
- `GET /detalhes/:id`: retorna veículo específico com campos completos (imagens, features, specs, docs, manutenção).

## Notas de Segurança e Operação
- Usar apenas uma instância na porta 5000 (API ou servidor de uploads).
- Manter segredos e credenciais em `.env` (não versionar).
- Garantir base MySQL `garagem` ativa antes de iniciar a API.
