function validarUsuario({ nome, email, senha }) {
  if (!nome || String(nome).trim().length < 2) {
    return 'Nome deve ter pelo menos 2 caracteres.';
  }

  if (!email || !emailValido(email)) {
    return 'Email invalido.';
  }

  if (!senha || String(senha).length < 6) {
    return 'Senha deve ter pelo menos 6 caracteres.';
  }

  return null;
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

module.exports = { validarUsuario };
