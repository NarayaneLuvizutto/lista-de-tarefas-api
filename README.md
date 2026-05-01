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
