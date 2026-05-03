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

const obterToken = async (usuario, senha) => {
    await cadastrarUsuario();
    const bodyLogin = { ...postLogin }

    const respostaLogin = await request(app)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send(bodyLogin)
        .expect(200);

    return respostaLogin.body.token
}

export { obterToken };