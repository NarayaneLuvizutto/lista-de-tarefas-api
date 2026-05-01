const express = require('express');
const routes = require('./routes');
const { db, resetDb } = require('./database/memoryDatabase');

const app = express();

app.use(express.json());
app.use(routes);

app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota nao encontrada.' });
});

module.exports = { app, db, resetDb };
