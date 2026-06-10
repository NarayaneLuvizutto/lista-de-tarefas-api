const express = require('express');
const routes = require('./routes');
const { db, resetDb } = require('./database/memoryDatabase');

const app = express();

app.use((req, res, next) => {
  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173').split(',');
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).send();
  }

  return next();
});

app.use(express.json());
app.use(routes);

app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota nao encontrada.' });
});

module.exports = { app, db, resetDb };
