const gerarTexto = (quantidade) => 'a'.repeat(quantidade);

const descricaoComMaisDe300Caracteres = gerarTexto(301);
const detalhesComMaisDe500Caracteres = gerarTexto(501);

export {
  gerarTexto,
  descricaoComMaisDe300Caracteres,
  detalhesComMaisDe500Caracteres
};
