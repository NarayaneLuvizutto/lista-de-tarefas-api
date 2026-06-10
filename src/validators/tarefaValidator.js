function validarTarefa({ descricao, detalhes, data }) {
  if (!descricao || String(descricao).trim().length === 0) {
    return 'Descricao e obrigatoria.';
  }

  if (String(descricao).trim().length > 300) {
    return 'Descricao deve ter no maximo 300 caracteres.';
  }

  if (!detalhes || String(detalhes).trim().length === 0) {
    return 'Detalhes sao obrigatorios.';
  }

  if (String(detalhes).trim().length > 500) {
    return 'Detalhes devem ter no maximo 500 caracteres.';
  }

  if (!data || !dataValida(data)) {
    return 'Data deve estar no formato YYYY-MM-DD.';
  }

  return null;
}

function dataValida(data) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data))) {
    return false;
  }

  const parsedDate = new Date(`${data}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().startsWith(data);
}

module.exports = { validarTarefa };
