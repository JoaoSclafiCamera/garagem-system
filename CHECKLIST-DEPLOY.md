# Checklist de Deploy - Sistema Garagem

Use esta checklist para validar cada etapa do deploy.

---

## Pre-Requisitos

- [ ] Conta Oracle Cloud criada (https://cloud.oracle.com)
- [ ] Email de confirmacao recebido
- [ ] Consegue fazer login no console Oracle

---

## Configuracao da VM Oracle

### Criacao
- [ ] VM criada com shape Always Free (ARM ou AMD)
- [ ] IP Publico atribuido
- [ ] Chaves SSH baixadas e salvas em local seguro
- [ ] Anotei o IP: `___________________`

### Security List (Firewall Oracle)
- [ ] Porta 5000 liberada (TCP)
- [ ] Porta 80 liberada (TCP)
- [ ] Porta 443 liberada (TCP)

### Conexao SSH
- [ ] Consegui conectar via SSH: `ssh -i chave.key opc@IP`

---

## Instalacao na VM

### Sistema
- [ ] Sistema atualizado (`sudo dnf update -y`)
- [ ] Firewall do Linux configurado

### Node.js
- [ ] Node.js 20 instalado
- [ ] `node --version` retorna v20.x.x
- [ ] `npm --version` funciona

### MySQL
- [ ] MySQL instalado
- [ ] MySQL rodando (`sudo systemctl status mysqld`)
- [ ] Usuario 'garagem' criado
- [ ] Banco 'garagem' criado
- [ ] Permissoes concedidas

### PM2
- [ ] PM2 instalado globalmente
- [ ] `pm2 --version` funciona

---

## Backend

### Arquivos
- [ ] Codigo copiado para ~/backend
- [ ] Arquivo .env criado e configurado
- [ ] Dependencias instaladas (`npm install`)

### Banco de Dados
- [ ] Tabelas criadas (init.sql executado)
- [ ] Usuario admin inserido
- [ ] Dados de teste inseridos (opcional)

### Execucao
- [ ] Backend inicia sem erros
- [ ] PM2 configurado
- [ ] Backend aparece como "online" no `pm2 status`
- [ ] PM2 configurado para iniciar com sistema (`pm2 startup`)

### Testes
- [ ] Health check funciona: `curl http://localhost:5000/health`
- [ ] Health check externo: `curl http://IP:5000/health`
- [ ] Retorna `{"status":"healthy","database":"connected",...}`

---

## Frontend

### GitHub
- [ ] Repositorio criado no GitHub
- [ ] Codigo do frontend enviado (push)

### Vercel
- [ ] Conta criada na Vercel
- [ ] Projeto importado do GitHub
- [ ] Root Directory configurado: `frontend`
- [ ] Variavel `REACT_APP_API_URL` configurada
- [ ] Build com sucesso
- [ ] URL da Vercel anotada: `___________________`

### CORS
- [ ] URL da Vercel adicionada em ALLOWED_ORIGINS no backend
- [ ] Backend reiniciado (`pm2 restart garagem-backend`)

---

## Integracao

- [ ] Site abre na URL da Vercel
- [ ] Nao aparece erro de CORS no console do navegador
- [ ] Pagina inicial carrega
- [ ] Catalogo exibe veiculos
- [ ] Login funciona (admin/admin123)
- [ ] Area administrativa abre apos login
- [ ] Consegue cadastrar novo veiculo
- [ ] Consegue editar veiculo
- [ ] Consegue excluir veiculo

---

## URLs Finais

| Servico | URL |
|---------|-----|
| Frontend | https://_________________________.vercel.app |
| Backend API | http://_____________:5000 |
| Health Check | http://_____________:5000/health |

---

## Credenciais

| Campo | Valor |
|-------|-------|
| Usuario Admin | admin |
| Senha Admin | admin123 |

---

## Pronto para Avaliacao!

Se todos os itens acima estao marcados, seu projeto esta pronto para ser enviado ao professor!

### O que enviar:

1. **URL do sistema**: https://seu-projeto.vercel.app
2. **Credenciais de acesso**: admin / admin123
3. **URL do health check**: http://IP:5000/health

### Dica: Faca um teste final

1. Abra uma janela anonima do navegador
2. Acesse a URL do frontend
3. Navegue pelo catalogo
4. Faca login
5. Cadastre um veiculo de teste
6. Saia e verifique se o veiculo aparece no catalogo

---

## Em caso de problemas

Consulte a secao "Troubleshooting" no arquivo `DEPLOY-ORACLE-CLOUD.md`
