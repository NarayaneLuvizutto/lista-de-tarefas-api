const { db } = require('../database/memoryDatabase');

function buscarTarefaDoUsuario(id, usuarioId) {
  const tarefaId = Number(id);

  if (!Number.isInteger(tarefaId)) {
    return null;
  }

  return db.tarefas.find((tarefa) => tarefa.id === tarefaId && tarefa.usuarioId === usuarioId);
}

module.exports = { buscarTarefaDoUsuario };
