const crypto = require('crypto');
const { JWT_SECRET, TOKEN_TTL_SECONDS } = require('../config/constants');

function criarToken(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = {
    ...payload,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS
  };
  const unsignedToken = `${base64UrlJson(header)}.${base64UrlJson(body)}`;
  const signature = assinar(unsignedToken);

  return `${unsignedToken}.${signature}`;
}

function verificarToken(token) {
  const partes = token.split('.');

  if (partes.length !== 3) {
    return null;
  }

  const [header, payload, signature] = partes;
  const unsignedToken = `${header}.${payload}`;
  const expectedSignature = assinar(unsignedToken);

  if (!timingSafeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);

    if (!decodedPayload.exp || decodedPayload.exp < now) {
      return null;
    }

    return decodedPayload;
  } catch (error) {
    return null;
  }
}

function assinar(value) {
  return crypto.createHmac('sha256', JWT_SECRET).update(value).digest('base64url');
}

function timingSafeEqual(a, b) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
}

function base64UrlJson(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

module.exports = { criarToken, verificarToken };
