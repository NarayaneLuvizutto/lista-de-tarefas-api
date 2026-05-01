const express = require('express');
const { TOKEN_TTL_SECONDS } = require('../config/constants');
const { db } = require('../database/memoryDatabase');
const { criarToken } = require('../services/tokenService');

const router = express.Router();

router.post('/login', (req, res) => {
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

module.exports = router;
