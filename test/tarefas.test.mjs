import { expect } from 'chai';
import request from 'supertest';
import appModule from '../src/app.js';

const { app, resetDb } = appModule;

describe('Lista de Tarefas API', () => {
  beforeEach(() => {
    resetDb();
  });

  async function cadastrarEAutenticar() {
    await request(app)
      .post('/api/usuarios')
      .send({ nome: 'Maria Souza', email: 'maria@example.com', senha: '123456' })
      .expect(201);

    const loginResponse = await request(app)
      .post('/api/login')
      .send({ email: 'maria@example.com', senha: '123456' })
      .expect(200);

    return loginResponse.body.token;
  }

  it('cadastra usuario, autentica e cria uma tarefa', async () => {
    const token = await cadastrarEAutenticar();

    const response = await request(app)
      .post('/api/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        descricao: 'Estudar testes automatizados',
        detalhes: 'Criar testes com Mocha, Chai e Supertest',
        data: '2026-05-01'
      })
      .expect(201);

    expect(response.body).to.include({
      id: 1,
      descricao: 'Estudar testes automatizados',
      detalhes: 'Criar testes com Mocha, Chai e Supertest',
      data: '2026-05-01',
      status: 'Em aberto',
      usuarioId: 1
    });
  });

  it('bloqueia rotas de tarefas sem token', async () => {
    const response = await request(app).get('/api/tarefas').expect(401);

    expect(response.body).to.deep.equal({ mensagem: 'Nao autorizado.' });
  });

  it('lista somente as tarefas do usuario autenticado', async () => {
    const token = await cadastrarEAutenticar();

    await request(app)
      .post('/api/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        descricao: 'Revisar API',
        detalhes: 'Validar endpoints principais',
        data: '2026-05-02'
      })
      .expect(201);

    const response = await request(app)
      .get('/api/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.lengthOf(1);
    expect(response.body[0]).to.include({ descricao: 'Revisar API' });
  });

  it('atualiza o status da tarefa', async () => {
    const token = await cadastrarEAutenticar();

    const createdTask = await request(app)
      .post('/api/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        descricao: 'Finalizar cobertura inicial',
        detalhes: 'Cobrir fluxo feliz e autenticacao',
        data: '2026-05-03'
      })
      .expect(201);

    const response = await request(app)
      .patch(`/api/tarefas/${createdTask.body.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Concluído' })
      .expect(200);

    expect(response.body.status).to.equal('Concluído');
  });
});
