const prisma = require("../data/prisma");

const usuarioExiste = async (usuarioId) => {
    if (!usuarioId || isNaN(Number(usuarioId))) return false;

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
    if (!simuladoId || isNaN(Number(simuladoId))) return false;

    const simulado = await prisma.simulado.findUnique({
        where: { id: Number(simuladoId) },
        include: { respostas: true }
    });

    if (!simulado) return false;
    return simulado.respostas && simulado.respostas.length > 0;
};

const simuladoDuplicado = async (usuarioId, dataRealizacao) => {
    if (!usuarioId || !dataRealizacao) return false;

    const dataFiltro = new Date(dataRealizacao);

    const simulado = await prisma.simulado.findFirst({
        where: {
            usuarioId: Number(usuarioId),
            dataRealizacao: dataFiltro
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