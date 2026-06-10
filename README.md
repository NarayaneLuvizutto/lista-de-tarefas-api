# Lista de Tarefas API

API REST em JavaScript com Express e armazenamento em memoria, implementando o contrato OpenAPI em `docs/swagger.yaml`.

## Como executar

```bash
npm install
npm start
```

No Windows PowerShell, caso a politica de execucao bloqueie o `npm`, use:

```bash
npm.cmd start
```

## Testes automatizados

### API

```bash
npm test
```

No Windows PowerShell, caso a politica de execucao bloqueie o `npm`, use:

```bash
npm.cmd test
```

### Front-end

O projeto tambem inclui automacao de testes end-to-end para o front-end em
`frontend/cypress`, usando Cypress. Os cenarios cobrem fluxos da aplicacao React,
como cadastro de usuario, login com sucesso, validacao de senha invalida e
validacao de campos obrigatorios.

Para executar os testes em modo headless a partir da raiz do projeto:

```bash
npx cypress run --e2e
```

Para abrir a interface do Cypress a partir da raiz do projeto:

```bash
npx cypress open --e2e
```

A configuracao da raiz em `cypress.config.js` verifica se a API e o front-end
estao disponiveis. Caso necessario, ela inicia automaticamente a API em
`http://localhost:3000` e o front-end em `http://127.0.0.1:5173` antes de rodar
os testes.

Tambem e possivel executar os comandos diretamente dentro de `frontend/`:

```bash
cd frontend
npm run cy:run
npm run cy:open
npm run cy:verify
```

Nesse caso, garanta que a API e o front-end estejam em execucao antes de rodar
os cenarios.

## URLs

- API: `http://localhost:3000/api`
- Swagger UI: `http://localhost:3000/docs`
- Arquivo OpenAPI servido pela API: `http://localhost:3000/docs/swagger.yaml`
- Front-end: `http://127.0.0.1:5173`

## Fluxo basico

1. Cadastre um usuario em `POST /api/usuarios`.
2. Faca login em `POST /api/login`.
3. Copie o token retornado.
4. No Swagger UI, clique em `Authorize` e informe o token como Bearer.
5. Use os endpoints de tarefas autenticados.

## Estrutura do projeto

```text
frontend/                # Aplicacao React/Vite que consome a API
  cypress/               # Automacao end-to-end do front-end com Cypress
cypress.config.js        # Configuracao Cypress da raiz, com bootstrap da API e do front-end
src/
  app.js                 # Configuracao principal do Express
  server.js              # Inicializacao do servidor
  config/                # Constantes e configuracoes da aplicacao
  database/              # Banco em memoria e utilitarios de teste
  middlewares/           # Middlewares compartilhados
  routes/                # Rotas HTTP agrupadas por dominio
  services/              # Regras auxiliares e servicos de apoio
  utils/                 # Funcoes utilitarias
  validators/            # Validacoes de entrada
test/                    # Testes automatizados com Mocha, Chai e Supertest
```
