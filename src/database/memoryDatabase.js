const db = {
  usuarios: [],
  tarefas: [],
  proximoUsuarioId: 1,
  proximaTarefaId: 1
};

function resetDb() {
  db.usuarios = [];
  db.tarefas = [];
  db.proximoUsuarioId = 1;
  db.proximaTarefaId = 1;
}

module.exports = { db, resetDb };
