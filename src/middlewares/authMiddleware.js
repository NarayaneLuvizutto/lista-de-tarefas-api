const { db } = require('../database/memoryDatabase');
const { verificarToken } = require('../services/tokenService');

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [tipo, token] = authHeader.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ mensagem: 'Nao autorizado.' });
  }

  const payload = verificarToken(token);

  if (!payload) {
    return res.status(401).json({ mensagem: 'Nao autorizado.' });
  }

  const usuario = db.usuarios.find((item) => item.id === payload.sub);

  if (!usuario) {
    return res.status(401).json({ mensagem: 'Nao autorizado.' });
  }

  req.usuario = usuario;
  return next();
}

module.exports = { autenticar };
