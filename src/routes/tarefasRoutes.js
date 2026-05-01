const express = require('express');
const { STATUS_EM_ABERTO } = require('../config/constants');
const { db } = require('../database/memoryDatabase');
const { autenticar } = require('../middlewares/authMiddleware');
const { validarTarefa } = require('../validators/tarefaValidator');
const { normalizarStatus } = require('../utils/status');
const { buscarTarefaDoUsuario } = require('../utils/tarefaFinder');

const router = express.Router();

router.post('/tarefas', autenticar, (req, res) => {
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

router.get('/tarefas', autenticar, (req, res) => {
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

router.get('/tarefas/:id', autenticar, (req, res) => {
  const tarefa = buscarTarefaDoUsuario(req.params.id, req.usuario.id);

  if (!tarefa) {
    return res.status(404).json({ mensagem: 'Tarefa nao encontrada.' });
  }

  return res.json(tarefa);
});

router.put('/tarefas/:id', autenticar, (req, res) => {
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

router.delete('/tarefas/:id', autenticar, (req, res) => {
  const tarefa = buscarTarefaDoUsuario(req.params.id, req.usuario.id);

  if (!tarefa) {
    return res.status(404).json({ mensagem: 'Tarefa nao encontrada.' });
  }

  db.tarefas = db.tarefas.filter((item) => item.id !== tarefa.id);

  return res.status(204).send();
});

router.patch('/tarefas/:id/status', autenticar, (req, res) => {
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

module.exports = router;
