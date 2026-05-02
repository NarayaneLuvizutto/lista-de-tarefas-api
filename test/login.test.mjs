import { expect } from 'chai';
import request from 'supertest';
import appModule from '../src/app.js';
import postLogin from '../fixtures/postLogin.json' with { type: 'json' };
import postUsuarios from '../fixtures/postUsuarios.json' with { type: 'json' };

const { app, resetDb } = appModule;

async function cadastrarUsuario(usuario = postUsuarios) {
    return request(app)
        .post('/api/usuarios')
        .set('Content-Type', 'application/json')
        .send(usuario)
        .expect(201);
}

describe('Login', () => {
    describe('POST /login', () => {
        beforeEach(() => {
            resetDb();
        });

        it('Deve retornar sucesso com 200 quando o login for realizado', async () => {
            await cadastrarUsuario();
            const bodyLogin = { ...postLogin };

            const resposta = await request(app)
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin);

            expect(resposta.status).to.equal(200);
            expect(resposta.body).to.include({
                tipo: 'Bearer',
                expiraEm: 86400
            });
            expect(resposta.body.token).to.be.a('string');
        });

        it('Deve retornar falha com 401 quando o email for inválido', async () => {
            await cadastrarUsuario();

            const resposta = await request(app)
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: 'emailinvalido',
                    senha: postUsuarios.senha
                });

            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.deep.equal({
                mensagem: 'Nao autorizado.'
            });
        });

        it('Deve retornar falha com 401 quando a senha for inválida', async () => {
            await cadastrarUsuario();

            const resposta = await request(app)
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: postUsuarios.email,
                    senha: 'senha-invalida'
                });

            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.deep.equal({
                mensagem: 'Nao autorizado.'
            });
        });

        it('Deve retornar falha com 400 quando email não for informado', async () => {
            const resposta = await request(app)

                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send({
                    senha: postUsuarios.senha
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.deep.equal({
                mensagem: 'Email e senha sao obrigatorios.'
            });
        });

        it('Deve retornar falha com 400 quando a senha não for informado', async () => {
            const resposta = await request(app)

                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: postUsuarios.email
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.deep.equal({
                mensagem: 'Email e senha sao obrigatorios.'
            });
        });

        it('Deve retornar falha com 400 quando a email e senha não forem informados', async () => {
            const resposta = await request(app)

                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: '',
                    senha: ''
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.deep.equal({
                mensagem: 'Email e senha sao obrigatorios.'
            });
        });

        it('Deve retornar falha com 400 quando a email e senha não forem informados', async () => {
            const resposta = await request(app)
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: '',
                    senha: ''
                });

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.deep.equal({
                mensagem: 'Email e senha sao obrigatorios.'
            });
        });

        it('Deve retornar falha com 401 quando a email e senha informados não existirem', async () => {
            const resposta = await request(app)
                .post('/api/login')
                .set('Content-Type', 'application/json')
                .send({
                    email: 'pedro@teste.com',
                    senha: '987654'
                });

            expect(resposta.status).to.equal(401);
            expect(resposta.body).to.deep.equal({
                mensagem: 'Nao autorizado.'
            });
        });
    });
});