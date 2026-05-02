import { expect } from 'chai';
import request from 'supertest';
import appModule from '../src/app.js';
import postUsuarios from '../fixtures/postUsuarios.json' with { type: 'json' };

const { app, resetDb } = appModule;

describe('Usuarios', () => {

  describe('POST /usuarios', () => {
    beforeEach(() => {
      resetDb();
    });

    it('Deve retornar sucesso com 201 quando o usuario for cadastrado', async () => {
      const bodyUsuarios = { ...postUsuarios };

      const resposta = await request(app)
        .post('/api/usuarios')
        .set('Content-Type', 'application/json')
        .send(bodyUsuarios);

      expect(resposta.status).to.equal(201);
      expect(resposta.body).to.include({
        id: 1,
        nome: bodyUsuarios.nome,
        email: bodyUsuarios.email
      });
      expect(resposta.body).not.to.have.property('senha');
    });

    it('Deve retornar falha com 400 quando o usuario for cadastrado sem informar Nome', async () => {
      const bodyUsuarios = { ...postUsuarios };
      bodyUsuarios.nome = '';

      const resposta = await request(app)
        .post('/api/usuarios')
        .set('Content-Type', 'application/json')
        .send(bodyUsuarios);

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.include({
        "mensagem": "Nome deve ter pelo menos 2 caracteres."
      });
    });

    it('Deve retornar falha com 400 quando o usuario for cadastrado com Nome maior que 300 caracteres', async () => {
      const bodyUsuarios = { ...postUsuarios };
      bodyUsuarios.nome = 'Mussum Ipsum, cacilds vidis litro abertis. Bota 1 metro de cachacis aí pra viagem! Suco de cevadiss, é um leite divinis, qui tem lupuliz, matis, aguis e fermentis. Eu nunca mais boto a boca num copo de cachaça, agora eu só uso canudis! In elementis mé pra quem é amistosis quis leo. Mussum Ipsum, cacilds vidis litro abertis';

      const resposta = await request(app)
        .post('/api/usuarios')
        .set('Content-Type', 'application/json')
        .send(bodyUsuarios);

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.include({
        "mensagem": "Nome não pode conter mais que 300 caracteres."
      });
    });

    it('Deve retornar falha com 400 quando o usuario for cadastrado sem informar Email', async () => {
      const bodyUsuarios = { ...postUsuarios };
      bodyUsuarios.email = '';

      const resposta = await request(app)
        .post('/api/usuarios')
        .set('Content-Type', 'application/json')
        .send(bodyUsuarios);

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.include({
        "mensagem": "Email invalido."
      });
    });

    it('Deve retornar falha com 400 quando o usuario for cadastrado com Email com formato inválido', async () => {
      const bodyUsuarios = { ...postUsuarios };
      bodyUsuarios.email = 'EmailInvalido';

      const resposta = await request(app)
        .post('/api/usuarios')
        .set('Content-Type', 'application/json')
        .send(bodyUsuarios);

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.include({
        "mensagem": "Email invalido."
      });
    });

    it('Deve retornar falha com 400 quando o usuario for cadastrado com Email com mais de 300 caracteres', async () => {
      const bodyUsuarios = { ...postUsuarios };
      bodyUsuarios.email = 'testetestestestestesttestetestestestestesttestetestestestestesttestetestestestestesttestetestestestestesttestetestestestestesttestetestestestestesttestetestestestestesttestetestestestestesttestetestestestestesttestetestestestestesttestetestestestestesttestetestestestestesttestetestestestestest1@email.com';

      const resposta = await request(app)
        .post('/api/usuarios')
        .set('Content-Type', 'application/json')
        .send(bodyUsuarios);

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.include({
        "mensagem": "Email não pode conter mais que 300 caracteres."
      });
    });

    it('Deve retornar falha com 400 quando o usuario for cadastrado sem informar Senha', async () => {
      const bodyUsuarios = { ...postUsuarios };
      bodyUsuarios.senha = '';

      const resposta = await request(app)
        .post('/api/usuarios')
        .set('Content-Type', 'application/json')
        .send(bodyUsuarios);

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.include({
        "mensagem": "Senha deve ter pelo menos 6 caracteres."
      });
    });

    it('Deve retornar falha com 400 quando o usuario for cadastrado com a Senha com mais de 100 caracteres', async () => {
      const bodyUsuarios = { ...postUsuarios };
      bodyUsuarios.senha = '123456abc123456abc123456abc123456abc123456abc123456abc123456abc123456abc123456abc123456abc123456abc123456abc';

      const resposta = await request(app)
        .post('/api/usuarios')
        .set('Content-Type', 'application/json')
        .send(bodyUsuarios);

      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.include({
        "mensagem": "Senha não pode conter mais que 100 caracteres."
      });
    });
  });


  describe('POST /usuarios duplicados', () => {
    beforeEach(() => {
      resetDb();
    });

    it('Deve retornar falha com 409 quando o usuario for cadastrado com Email já existente na base', async () => {
      const bodyUsuarios = { ...postUsuarios };

      const primeiraResposta = await request(app)
        .post('/api/usuarios')
        .set('Content-Type', 'application/json')
        .send(bodyUsuarios);

      expect(primeiraResposta.status).to.equal(201);

      const segundaResposta = await request(app)
        .post('/api/usuarios')
        .set('Content-Type', 'application/json')
        .send(bodyUsuarios);

      expect(segundaResposta.status).to.equal(409);
      expect(segundaResposta.body).to.include({
        "mensagem": "Email ja cadastrado."
      });
    });
  });


});
