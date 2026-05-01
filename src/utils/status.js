const {
  STATUS_EM_ABERTO,
  STATUS_CONCLUIDO,
  STATUS_CONCLUIDO_COM_ACENTO
} = require('../config/constants');

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
    value === 'ConcluÃ­do' ||
    value === 'ConcluÃƒÂ­do'
  ) {
    return STATUS_CONCLUIDO_COM_ACENTO;
  }

  return null;
}

module.exports = { normalizarStatus };
