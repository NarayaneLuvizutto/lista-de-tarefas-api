function validarUsuario({ nome, email, senha }) {
  if (!nome || String(nome).trim().length < 2) {
    return 'Nome deve ter pelo menos 2 caracteres.';
  }

  if (String(nome).trim().length > 300) {
    return 'Nome não pode conter mais que 300 caracteres.';
  }

  if (!email || !emailValido(email)) {
    return 'Email invalido.';
  }

  if (String(email).trim().length > 300) {
    return 'Email não pode conter mais que 300 caracteres.';
  }

  if (!senha || String(senha).length < 6) {
    return 'Senha deve ter pelo menos 6 caracteres.';
  }

  if (String(senha).length > 100) {
    return 'Senha não pode conter mais que 100 caracteres.';
  }

  return null;
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

module.exports = { validarUsuario };
