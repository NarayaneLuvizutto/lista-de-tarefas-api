import { expect } from 'chai';
import request from 'supertest';
import appModule from '../src/app.js';
import { obterToken } from '../helpers/autenticacao.js';

const { app, resetDb } = appModule;

describe('Tarefas', () => {
  beforeEach(() => {
    resetDb();
  });

  describe ('POST /tarefas', () => {
    it('Deve retornar sucesso com 201 quando a Tarefa for cadastrada', async () => {
      const token = await obterToken();

      const resposta = await request(app)
        .post('/api/tarefas')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          descricao: 'Estudar testes automatizados',
          detalhes: 'Criar testes com Mocha, Chai e Supertest',
          data: '2026-05-01'
        });

      expect(resposta.status).to.equal(201);
      expect(resposta.body).to.include({
        id: 1,
        descricao: 'Estudar testes automatizados',
        detalhes: 'Criar testes com Mocha, Chai e Supertest',
        data: '2026-05-01',
        status: 'Em aberto'
      })
    })
  })
})
