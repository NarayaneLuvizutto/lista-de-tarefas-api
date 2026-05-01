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

```bash
npm test
```

No Windows PowerShell, caso a politica de execucao bloqueie o `npm`, use:

```bash
npm.cmd test
```

## URLs

- API: `http://localhost:3000/api`
- Swagger UI: `http://localhost:3000/docs`
- Arquivo OpenAPI servido pela API: `http://localhost:3000/docs/swagger.yaml`

## Fluxo basico

1. Cadastre um usuario em `POST /api/usuarios`.
2. Faça login em `POST /api/login`.
3. Copie o token retornado.
4. No Swagger UI, clique em `Authorize` e informe o token como Bearer.
5. Use os endpoints de tarefas autenticados.

## Estrutura do projeto

```text
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
