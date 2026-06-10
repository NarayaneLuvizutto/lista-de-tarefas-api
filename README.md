# Lista de Tarefas

## Sobre o Projeto

O **lista-de-tarefas-api** é uma aplicação de gerenciamento de tarefas composta por uma **API REST** desenvolvida em **JavaScript com Express** e uma interface web desenvolvida em **React**, **Vite** e **TypeScript**. Atualmente, os dados são armazenados em memória, tornando o projeto simples e ideal para fins de estudo e experimentação.

O projeto base foi criado com o auxílio da inteligência artificial **Codex**, servindo como ambiente de aprendizado para explorar o uso de IA tanto no desenvolvimento quanto na automação de testes.

## Objetivo

O principal objetivo deste projeto é disponibilizar uma aplicação de referência para estudos e implementação de **testes automatizados de back-end e front-end utilizando Inteligência Artificial**, permitindo avaliar diferentes abordagens, ferramentas e estratégias de automação assistidas por IA.

## Tecnologias Utilizadas

### Aplicação

* JavaScript
* Express
* React
* Vite
* TypeScript

### Automação de Testes da API

* Mocha
* Chai
* Supertest

### Automação de Testes do Front-end

* Cypress

## Finalidade Educacional

Este projeto foi desenvolvido com foco em aprendizado e experimentação, sendo utilizado para estudos relacionados a:

* Desenvolvimento assistido por IA com Codex;
* Automação de testes de APIs REST;
* Automação de testes de aplicações web;
* Boas práticas de qualidade de software;
* Avaliação do potencial da IA na geração e manutenção de testes automatizados.

## Mais informações sobre a regra de negócio: 
Para entender como que funciona a aplicação de Lista de Tarefas, veja a documentação em: https://github.com/NarayaneLuvizutto/lista-de-tarefas-api/wiki


## Informações técnicas: 

Contrato da API REST disponível em `docs/swagger.yaml`.

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
