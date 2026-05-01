function formatarUsuario(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email
  };
}

module.exports = { formatarUsuario };
