const prisma = require("../data/prisma");

const usuarioExiste = async (usuarioId) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id: Number(usuarioId) }
  });
  return usuario != null;
};

const validarTempo = (comTempo, tempoTotalMin) => {
  if (comTempo && (!tempoTotalMin || tempoTotalMin <= 0)) {
    return false;
  }
  return true;
};

const validarNota = (nota) => {
  if (nota == null) return true;
  return nota >= 0 && nota <= 1000;
};

const possuiRespostas = async (simuladoId) => {
  const simulado = await prisma.simulado.findUnique({
    where: { id: Number(simuladoId) },
    include: { respostas: true }
  });

  if (!simulado) return false;
  return simulado.respostas.length > 0;
};

const simuladoDuplicado = async (usuarioId, dataRealizacao) => {
  const simulado = await prisma.simulado.findFirst({
    where: {
      usuarioId: Number(usuarioId),
      dataRealizacao
    }
  });
  return simulado != null;
};

module.exports = {
  usuarioExiste,
  validarTempo,
  validarNota,
  possuiRespostas,
  simuladoDuplicado
};