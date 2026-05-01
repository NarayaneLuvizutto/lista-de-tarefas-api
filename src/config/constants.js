const API_PREFIX = '/api';
const JWT_SECRET = process.env.JWT_SECRET || 'lista-de-tarefas-api-dev-secret';
const TOKEN_TTL_SECONDS = 24 * 60 * 60;
const STATUS_EM_ABERTO = 'Em aberto';
const STATUS_CONCLUIDO = 'Concluido';
const STATUS_CONCLUIDO_COM_ACENTO = 'Concluído';

module.exports = {
  API_PREFIX,
  JWT_SECRET,
  TOKEN_TTL_SECONDS,
  STATUS_EM_ABERTO,
  STATUS_CONCLUIDO,
  STATUS_CONCLUIDO_COM_ACENTO
};
