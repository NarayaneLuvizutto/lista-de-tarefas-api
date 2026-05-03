import { expect } from 'chai';
import request from 'supertest';
import appModule from '../src/app.js';
import { obterToken } from '../helpers/autenticacao.js';
import {
  descricaoComMaisDe300Caracteres,
  detalhesComMaisDe500Caracteres
} from '../helpers/geradores.js';
import postTarefas from '../fixtures/postTarefas.json' with { type: 'json' };

const { app, resetDb } = appModule;

async function criarTarefa(token, camposAlterados = {}) {
  return request(app)
    .post('/api/tarefas')
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send({
      ...postTarefas,
      ...camposAlterados
    });
}

async function concluirTarefa(token, id) {
  return request(app)
    .patch(`/api/tarefas/${id}/status`)
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send({
      status: 'Concluido'
    });
}

describe('Tarefas', () => {
  beforeEach(() => {
    resetDb();
  });

  describe('POST /tarefas', () => {
    it('Deve retornar sucesso com 201 quando a Tarefa for cadastrada', async () => {
      const token = await obterToken();

      const resposta = await criarTarefa(token);

      expect(resposta.status).to.equal(201);
      expect(resposta.body).to.include({
        ...postTarefas,
        status: 'Em aberto'
      });
    });

    it('Deve retornar falha com 401 quando a Tarefa for cadastrada sem token', async () => {
      const resposta = await request(app)
        .post('/api/tarefas')
        .set('Content-Type', 'application/json')
        .send(postTarefas);

      expect(resposta.status).to.equal(401);
      expect(resposta.body).to.include({
        mensagem: 'Nao autorizado.'
      });
    });

    it('Deve retornar falha com 401 quando a Tarefa for cadastrada com token incorreto', async () => {
      const resposta = await request(app)
        .post('/api/tarefas')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer 123456')
        .send(postTarefas);

      expect(resposta.status).to.equal(401);
      expect(resposta.body).to.include({
        mensagem: 'Nao autorizado.'
      });
    });

    it('Deve retornar falha com 400 quando a Tarefa for cadastrada sem descricao', async () => {
      const token = await obterToken();

      const resposta = await criarTarefa(token, {
        descricao: ''
      });

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.include({
        mensagem: 'Descricao e obrigatoria.'
      });
    });

    it('Deve retornar falha com 400 quando a Tarefa for cadastrada sem detalhes', async () => {
      const token = await obterToken();

      const resposta = await criarTarefa(token, {
        detalhes: ''
      });

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.include({
        mensagem: 'Detalhes sao obrigatorios.'
      });
    });

    it('Deve retornar falha com 400 quando a Tarefa for cadastrada sem data', async () => {
      const token = await obterToken();

      const resposta = await criarTarefa(token, {
        data: ''
      });

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.include({
        mensagem: 'Data deve estar no formato YYYY-MM-DD.'
      });
    });

    it('Deve retornar falha com 400 quando a descricao tiver mais de 300 caracteres', async () => {
      const token = await obterToken();

      const resposta = await criarTarefa(token, {
        descricao: descricaoComMaisDe300Caracteres
      });

      expect(resposta.status).to.equal(400);
    });

    it('Deve retornar falha com 400 quando os detalhes tiverem mais de 500 caracteres', async () => {
      const token = await obterToken();

      const resposta = await criarTarefa(token, {
        detalhes: detalhesComMaisDe500Caracteres
      });

      expect(resposta.status).to.equal(400);
    });

    it('Deve retornar falha com 400 quando a data estiver em formato incorreto', async () => {
      const token = await obterToken();

      const resposta = await criarTarefa(token, {
        data: '01/05/2026'
      });

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.include({
        mensagem: 'Data deve estar no formato YYYY-MM-DD.'
      });
    });
  });

  describe('GET /tarefas', () => {
    it('Deve retornar sucesso com 200 listando tarefas em aberto', async () => {
      const token = await obterToken();

      await criarTarefa(token, {
        descricao: 'Tarefa em aberto'
      });

      const resposta = await request(app)
        .get('/api/tarefas')
        .query({ status: 'Em aberto' })
        .set('Authorization', `Bearer ${token}`);

      expect(resposta.status).to.equal(200);
      expect(resposta.body[0]).to.include({
        descricao: 'Tarefa em aberto',
        detalhes: postTarefas.detalhes,
        data: postTarefas.data,
        status: 'Em aberto'
      });
    });

    it('Deve retornar sucesso com 200 listando tarefas concluidas', async () => {
      const token = await obterToken();

      const tarefa = await criarTarefa(token, {
        descricao: 'Tarefa concluida'
      });

      await concluirTarefa(token, tarefa.body.id);

      const resposta = await request(app)
        .get('/api/tarefas')
        .query({ status: 'Concluido' })
        .set('Authorization', `Bearer ${token}`);

      expect(resposta.status).to.equal(200);
      expect(resposta.body[0].descricao).to.equal('Tarefa concluida');
    });

    it('Deve retornar falha com 401 ao listar tarefas com token invalido', async () => {
      const resposta = await request(app)
        .get('/api/tarefas')
        .set('Authorization', 'Bearer token-invalido');

      expect(resposta.status).to.equal(401);
      expect(resposta.body).to.include({
        mensagem: 'Nao autorizado.'
      });
    });

    it('Deve retornar falha com 401 ao listar tarefas sem token', async () => {
      const resposta = await request(app)
        .get('/api/tarefas');

      expect(resposta.status).to.equal(401);
      expect(resposta.body).to.include({
        mensagem: 'Nao autorizado.'
      });
    });

  });

  describe('GET /tarefas/{id}', () => {
    it('Deve retornar sucesso com 200 buscando uma tarefa em aberto', async () => {
      const token = await obterToken();

      const tarefa = await criarTarefa(token, {
        descricao: 'Buscar tarefa em aberto'
      });

      const resposta = await request(app)
        .get(`/api/tarefas/${tarefa.body.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(resposta.status).to.equal(200);
      expect(resposta.body).to.include({
        descricao: 'Buscar tarefa em aberto',
        detalhes: postTarefas.detalhes,
        data: postTarefas.data,
        status: 'Em aberto'
      });
    });

    it('Deve retornar sucesso com 200 buscando uma tarefa concluida', async () => {
      const token = await obterToken();

      const tarefa = await criarTarefa(token, {
        descricao: 'Buscar tarefa concluida'
      });

      await concluirTarefa(token, tarefa.body.id);

      const resposta = await request(app)
        .get(`/api/tarefas/${tarefa.body.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(resposta.status).to.equal(200);
      expect(resposta.body.descricao).to.equal('Buscar tarefa concluida');
    });

    it('Deve retornar falha com 404 buscando tarefa com id inexistente', async () => {
      const token = await obterToken();

      const resposta = await request(app)
        .get('/api/tarefas/999')
        .set('Authorization', `Bearer ${token}`);

      expect(resposta.status).to.equal(404);
      expect(resposta.body).to.include({
        mensagem: 'Tarefa nao encontrada.'
      });
    });

    it('Deve retornar falha com 401 buscando tarefa com token invalido', async () => {
      const resposta = await request(app)
        .get('/api/tarefas/1')
        .set('Authorization', 'Bearer token-invalido');

      expect(resposta.status).to.equal(401);
      expect(resposta.body).to.include({
        mensagem: 'Nao autorizado.'
      });
    });

    it('Deve retornar falha com 401 buscando tarefa sem token', async () => {
      const resposta = await request(app)
        .get('/api/tarefas/1');

      expect(resposta.status).to.equal(401);
      expect(resposta.body).to.include({
        mensagem: 'Nao autorizado.'
      });
    });
  });

  describe('PUT /tarefas/{id}', () => {
    it('Deve retornar sucesso com 200 alterando descricao, detalhes e data', async () => {
      const token = await obterToken();

      const tarefa = await criarTarefa(token);

      const resposta = await request(app)
        .put(`/api/tarefas/${tarefa.body.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...postTarefas,
          descricao: 'Descricao alterada',
          detalhes: 'Detalhes alterados',
          data: '2026-05-10'
        });

      expect(resposta.status).to.equal(200);
      expect(resposta.body).to.include({
        descricao: 'Descricao alterada',
        detalhes: 'Detalhes alterados',
        data: '2026-05-10'
      });
    });

    it('Deve retornar falha com 401 alterando tarefa sem token', async () => {
      const resposta = await request(app)
        .put('/api/tarefas/1')
        .set('Content-Type', 'application/json')
        .send({
          ...postTarefas,
          descricao: 'Descricao alterada',
          detalhes: 'Detalhes alterados',
          data: '2026-05-10'
        });

      expect(resposta.status).to.equal(401);
      expect(resposta.body).to.include({
        mensagem: 'Nao autorizado.'
      });
    });

    it('Deve retornar falha com 401 alterando tarefa com token invalido', async () => {
      const resposta = await request(app)
        .put('/api/tarefas/1')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token-invalido')
        .send({
          ...postTarefas,
          descricao: 'Descricao alterada',
          detalhes: 'Detalhes alterados',
          data: '2026-05-10'
        });

      expect(resposta.status).to.equal(401);
      expect(resposta.body).to.include({
        mensagem: 'Nao autorizado.'
      });
    });

    it('Deve retornar falha com 404 alterando tarefa com id inexistente', async () => {
      const token = await obterToken();

      const resposta = await request(app)
        .put('/api/tarefas/999')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...postTarefas,
          descricao: 'Descricao alterada',
          detalhes: 'Detalhes alterados',
          data: '2026-05-10'
        });

      expect(resposta.status).to.equal(404);
      expect(resposta.body).to.include({
        mensagem: 'Tarefa nao encontrada.'
      });
    });

    it('Deve retornar falha com 400 alterando tarefa com descricao vazia', async () => {
      const token = await obterToken();
      const tarefa = await criarTarefa(token);

      const resposta = await request(app)
        .put(`/api/tarefas/${tarefa.body.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...postTarefas,
          descricao: ''
        });

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.include({
        mensagem: 'Descricao e obrigatoria.'
      });
    });

    it('Deve retornar falha com 400 alterando tarefa com detalhes vazio', async () => {
      const token = await obterToken();
      const tarefa = await criarTarefa(token);

      const resposta = await request(app)
        .put(`/api/tarefas/${tarefa.body.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...postTarefas,
          detalhes: ''
        });

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.include({
        mensagem: 'Detalhes sao obrigatorios.'
      });
    });

    it('Deve retornar falha com 400 alterando tarefa com data vazia', async () => {
      const token = await obterToken();
      const tarefa = await criarTarefa(token);

      const resposta = await request(app)
        .put(`/api/tarefas/${tarefa.body.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...postTarefas,
          data: ''
        });

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.include({
        mensagem: 'Data deve estar no formato YYYY-MM-DD.'
      });
    });

    it('Deve retornar falha com 400 alterando tarefa com descricao maior que 300 caracteres', async () => {
      const token = await obterToken();
      const tarefa = await criarTarefa(token);

      const resposta = await request(app)
        .put(`/api/tarefas/${tarefa.body.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...postTarefas,
          descricao: descricaoComMaisDe300Caracteres
        });

      expect(resposta.status).to.equal(400);
    });

    it('Deve retornar falha com 400 alterando tarefa com detalhes maior que 500 caracteres', async () => {
      const token = await obterToken();
      const tarefa = await criarTarefa(token);

      const resposta = await request(app)
        .put(`/api/tarefas/${tarefa.body.id}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...postTarefas,
          detalhes: detalhesComMaisDe500Caracteres
        });

      expect(resposta.status).to.equal(400);
    });

    it('Deve retornar falha com 400 alterando tarefa com data em formato incorreto', async () => {
      const token = await obterToken();
      const tarefa = await criarTarefa(token);

      const resposta = await request(app)
        .put(`/api/tarefas/${tarefa.body.id}`)
        .set('Content-Type', 'application/json')
        
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...postTarefas,
          data: '10/05/2026'
        });

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.include({
        mensagem: 'Data deve estar no formato YYYY-MM-DD.'
      });
    });
  });

  describe('DELETE /tarefas/{id}', () => {
    it('Deve retornar sucesso com 204 quando a tarefa for excluida', async () => {
      const token = await obterToken();
      const tarefa = await criarTarefa(token);

      const resposta = await request(app)
        .delete(`/api/tarefas/${tarefa.body.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(resposta.status).to.equal(204);
    });

    it('Deve retornar falha com 401 excluindo tarefa sem token', async () => {
      const resposta = await request(app)
        .delete('/api/tarefas/1');

      expect(resposta.status).to.equal(401);
      expect(resposta.body).to.include({
        mensagem: 'Nao autorizado.'
      });
    });

    it('Deve retornar falha com 401 excluindo tarefa com token invalido', async () => {
      const resposta = await request(app)
        .delete('/api/tarefas/1')
        .set('Authorization', 'Bearer token-invalido');

      expect(resposta.status).to.equal(401);
      expect(resposta.body).to.include({
        mensagem: 'Nao autorizado.'
      });
    });

    it('Deve retornar falha com 404 excluindo tarefa com id inexistente', async () => {
      const token = await obterToken();

      const resposta = await request(app)
        .delete('/api/tarefas/999')
        .set('Authorization', `Bearer ${token}`);

      expect(resposta.status).to.equal(404);
      expect(resposta.body).to.include({
        mensagem: 'Tarefa nao encontrada.'
      });
    });
  });

  describe('PATCH /tarefas/{id}/status', () => {
    it('Deve retornar sucesso com 200 mudando tarefa em aberto para concluido', async () => {
      const token = await obterToken();
      const tarefa = await criarTarefa(token);

      const resposta = await concluirTarefa(token, tarefa.body.id);

      expect(resposta.status).to.equal(200);
      expect(resposta.body.id).to.equal(tarefa.body.id);
      expect(resposta.body.status).to.not.equal('Em aberto');
    });

    it('Deve retornar sucesso com 200 mudando tarefa concluida para em aberto', async () => {
      const token = await obterToken();
      const tarefa = await criarTarefa(token);

      await concluirTarefa(token, tarefa.body.id);

      const resposta = await request(app)
        .patch(`/api/tarefas/${tarefa.body.id}/status`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'Em aberto'
        });

      expect(resposta.status).to.equal(200);
      expect(resposta.body).to.include({
        id: tarefa.body.id,
        status: 'Em aberto'
      });
    });

    it('Deve retornar falha com 401 alterando status com token inexistente', async () => {
      const resposta = await request(app)
        .patch('/api/tarefas/1/status')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer token-inexistente')
        .send({
          status: 'Concluido'
        });

      expect(resposta.status).to.equal(401);
      expect(resposta.body).to.include({
        mensagem: 'Nao autorizado.'
      });
    });

    it('Deve retornar falha com 401 alterando status sem token', async () => {
      const resposta = await request(app)
        .patch('/api/tarefas/1/status')
        .set('Content-Type', 'application/json')
        .send({
          status: 'Concluido'
        });

      expect(resposta.status).to.equal(401);
      expect(resposta.body).to.include({
        mensagem: 'Nao autorizado.'
      });
    });

    it('Deve retornar falha com 404 alterando status com id inexistente', async () => {
      const token = await obterToken();

      const resposta = await request(app)
        .patch('/api/tarefas/999/status')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'Concluido'
        });

      expect(resposta.status).to.equal(404);
      expect(resposta.body).to.include({
        mensagem: 'Tarefa nao encontrada.'
      });
    });

    it('Deve retornar falha com 400 alterando status com status inexistente', async () => {
      const token = await obterToken();
      const tarefa = await criarTarefa(token);

      const resposta = await request(app)
        .patch(`/api/tarefas/${tarefa.body.id}/status`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'Cancelado'
        });

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.include({
        mensagem: 'Status invalido.'
      });
    });

    it('Deve retornar falha com 400 alterando status com status vazio', async () => {
      const token = await obterToken();
      const tarefa = await criarTarefa(token);

      const resposta = await request(app)
        .patch(`/api/tarefas/${tarefa.body.id}/status`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: ''
        });

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.include({
        mensagem: 'Status invalido.'
      });
    });
  });
});
