const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const API_PREFIX = '/api';
const JWT_SECRET = process.env.JWT_SECRET || 'lista-de-tarefas-api-dev-secret';
const TOKEN_TTL_SECONDS = 24 * 60 * 60;
const STATUS_EM_ABERTO = 'Em aberto';
const STATUS_CONCLUIDO = 'Concluido';
const STATUS_CONCLUIDO_COM_ACENTO = 'Concluído';

const db = {
  usuarios: [],
  tarefas: [],
  proximoUsuarioId: 1,
  proximaTarefaId: 1
};

app.use(express.json());

app.get('/', (req, res) => {
  res.redirect('/docs');
});

app.get('/docs', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lista de Tarefas API - Swagger</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '/docs/swagger.yaml',
          dom_id: '#swagger-ui',
          deepLinking: true,
          persistAuthorization: true
        });
      };
    </script>
  </body>
</html>`);
});

app.get('/docs/swagger.yaml', (req, res) => {
  const swaggerPath = resolveSwaggerPath();
  res.type('text/yaml').send(fs.readFileSync(swaggerPath, 'utf8'));
});

app.post(`${API_PREFIX}/usuarios`, (req, res) => {
  const { nome, email, senha } = req.body || {};
  const erro = validarUsuario({ nome, email, senha });

  if (erro) {
    return res.status(400).json({ mensagem: erro });
  }

  if (db.usuarios.some((usuario) => usuario.email === email)) {
    return res.status(409).json({ mensagem: 'Email ja cadastrado.' });
  }

  const usuario = {
    id: db.proximoUsuarioId++,
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    senha
  };

  db.usuarios.push(usuario);

  return res.status(201).json(formatarUsuario(usuario));
});

app.post(`${API_PREFIX}/login`, (req, res) => {
  const { email, senha } = req.body || {};

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Email e senha sao obrigatorios.' });
  }

  const usuario = db.usuarios.find(
    (item) => item.email === String(email).trim().toLowerCase() && item.senha === senha
  );

  if (!usuario) {
    return res.status(401).json({ mensagem: 'Nao autorizado.' });
  }

  return res.json({
    token: criarToken({ sub: usuario.id, email: usuario.email }),
    tipo: 'Bearer',
    expiraEm: TOKEN_TTL_SECONDS
  });
});

app.post(`${API_PREFIX}/tarefas`, autenticar, (req, res) => {
  const { descricao, detalhes, data } = req.body || {};
  const erro = validarTarefa({ descricao, detalhes, data });

  if (erro) {
    return res.status(400).json({ mensagem: erro });
  }

  const tarefa = {
    id: db.proximaTarefaId++,
    descricao: descricao.trim(),
    detalhes: detalhes.trim(),
    data,
    status: STATUS_EM_ABERTO,
    usuarioId: req.usuario.id
  };

  db.tarefas.push(tarefa);

  return res.status(201).json(tarefa);
});

app.get(`${API_PREFIX}/tarefas`, autenticar, (req, res) => {
  const status = normalizarStatus(req.query.status);
  let tarefas = db.tarefas.filter((tarefa) => tarefa.usuarioId === req.usuario.id);

  if (req.query.status && !status) {
    return res.status(400).json({ mensagem: 'Status invalido.' });
  }

  if (status) {
    tarefas = tarefas.filter((tarefa) => tarefa.status === status);
  }

  return res.json(tarefas);
});

app.get(`${API_PREFIX}/tarefas/:id`, autenticar, (req, res) => {
  const tarefa = buscarTarefaDoUsuario(req.params.id, req.usuario.id);

  if (!tarefa) {
    return res.status(404).json({ mensagem: 'Tarefa nao encontrada.' });
  }

  return res.json(tarefa);
});

app.put(`${API_PREFIX}/tarefas/:id`, autenticar, (req, res) => {
  const tarefa = buscarTarefaDoUsuario(req.params.id, req.usuario.id);

  if (!tarefa) {
    return res.status(404).json({ mensagem: 'Tarefa nao encontrada.' });
  }

  const { descricao, detalhes, data } = req.body || {};
  const erro = validarTarefa({ descricao, detalhes, data });

  if (erro) {
    return res.status(400).json({ mensagem: erro });
  }

  tarefa.descricao = descricao.trim();
  tarefa.detalhes = detalhes.trim();
  tarefa.data = data;

  return res.json(tarefa);
});

app.delete(`${API_PREFIX}/tarefas/:id`, autenticar, (req, res) => {
  const tarefa = buscarTarefaDoUsuario(req.params.id, req.usuario.id);

  if (!tarefa) {
    return res.status(404).json({ mensagem: 'Tarefa nao encontrada.' });
  }

  db.tarefas = db.tarefas.filter((item) => item.id !== tarefa.id);

  return res.status(204).send();
});

app.patch(`${API_PREFIX}/tarefas/:id/status`, autenticar, (req, res) => {
  const tarefa = buscarTarefaDoUsuario(req.params.id, req.usuario.id);

  if (!tarefa) {
    return res.status(404).json({ mensagem: 'Tarefa nao encontrada.' });
  }

  const status = normalizarStatus(req.body && req.body.status);

  if (!status) {
    return res.status(400).json({ mensagem: 'Status invalido.' });
  }

  tarefa.status = status;

  return res.json(tarefa);
});

app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota nao encontrada.' });
});

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [tipo, token] = authHeader.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ mensagem: 'Nao autorizado.' });
  }

  const payload = verificarToken(token);

  if (!payload) {
    return res.status(401).json({ mensagem: 'Nao autorizado.' });
  }

  const usuario = db.usuarios.find((item) => item.id === payload.sub);

  if (!usuario) {
    return res.status(401).json({ mensagem: 'Nao autorizado.' });
  }

  req.usuario = usuario;
  return next();
}

function criarToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = {
    ...payload,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS
  };
  const unsignedToken = `${base64UrlJson(header)}.${base64UrlJson(body)}`;
  const signature = assinar(unsignedToken);

  return `${unsignedToken}.${signature}`;
}

function verificarToken(token) {
  const partes = token.split('.');

  if (partes.length !== 3) {
    return null;
  }

  const [header, payload, signature] = partes;
  const unsignedToken = `${header}.${payload}`;
  const expectedSignature = assinar(unsignedToken);

  if (!timingSafeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);

    if (!decodedPayload.exp || decodedPayload.exp < now) {
      return null;
    }

    return decodedPayload;
  } catch (error) {
    return null;
  }
}

function assinar(value) {
  return crypto.createHmac('sha256', JWT_SECRET).update(value).digest('base64url');
}

function timingSafeEqual(a, b) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
}

function base64UrlJson(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function validarUsuario({ nome, email, senha }) {
  if (!nome || String(nome).trim().length < 2) {
    return 'Nome deve ter pelo menos 2 caracteres.';
  }

  if (!email || !emailValido(email)) {
    return 'Email invalido.';
  }

  if (!senha || String(senha).length < 6) {
    return 'Senha deve ter pelo menos 6 caracteres.';
  }

  return null;
}

function validarTarefa({ descricao, detalhes, data }) {
  if (!descricao || String(descricao).trim().length === 0) {
    return 'Descricao e obrigatoria.';
  }

  if (!detalhes || String(detalhes).trim().length === 0) {
    return 'Detalhes sao obrigatorios.';
  }

  if (!data || !dataValida(data)) {
    return 'Data deve estar no formato YYYY-MM-DD.';
  }

  return null;
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function dataValida(data) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data))) {
    return false;
  }

  const parsedDate = new Date(`${data}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().startsWith(data);
}

function normalizarStatus(status) {
  if (!status) {
    return null;
  }

  const value = String(status).trim();

  if (value === STATUS_EM_ABERTO) {
    return STATUS_EM_ABERTO;
  }

  if (
    value === STATUS_CONCLUIDO ||
    value === STATUS_CONCLUIDO_COM_ACENTO ||
    value === 'ConcluÃ­do'
  ) {
    return STATUS_CONCLUIDO_COM_ACENTO;
  }

  return null;
}

function buscarTarefaDoUsuario(id, usuarioId) {
  const tarefaId = Number(id);

  if (!Number.isInteger(tarefaId)) {
    return null;
  }

  return db.tarefas.find((tarefa) => tarefa.id === tarefaId && tarefa.usuarioId === usuarioId);
}

function formatarUsuario(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email
  };
}

function resolveSwaggerPath() {
  const swaggerPath = path.resolve(__dirname, '../docs/swagger.yaml');
  const openapiPath = path.resolve(__dirname, '../docs/openapi.yaml');

  return fs.existsSync(swaggerPath) ? swaggerPath : openapiPath;
}

module.exports = { app, db };
