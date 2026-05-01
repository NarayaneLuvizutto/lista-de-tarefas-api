const express = require('express');
const { db } = require('../database/memoryDatabase');
const { validarUsuario } = require('../validators/usuarioValidator');
const { formatarUsuario } = require('../utils/usuarioPresenter');

const router = express.Router();

router.post('/usuarios', (req, res) => {
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

module.exports = router;
