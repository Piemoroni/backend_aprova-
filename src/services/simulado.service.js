const prisma = require("../data/prisma");


// Verifica se o usuário existe
const usuarioExiste = async (usuarioId) => {

    const usuario = await prisma.usuario.findUnique({
        where: {
            id: Number(usuarioId)
        }
    });

    return usuario != null;
};



// Valida configuração do cronômetro
const validarTempo = (comTempo, tempoTotalMin) => {

    if (comTempo && (!tempoTotalMin || tempoTotalMin <= 0)) {
        return false;
    }


    return true;
};



// Valida notas do simulado
const validarNota = (nota) => {

    if (nota == null) {
        return true;
    }


    return nota >= 0 && nota <= 1000;
};



// Verifica se o simulado possui respostas
const possuiRespostas = async (simuladoId) => {

    const simulado = await prisma.simulado.findUnique({
        where: {
            id: Number(simuladoId)
        },
        include: {
            respostas: true
        }
    });


    if (!simulado) {
        return false;
    }


    return simulado.respostas.length > 0;
};



// Verifica se o usuário já realizou simulado na mesma data
const simuladoDuplicado = async (usuarioId, dataRealizacao) => {

    const simulado = await prisma.simulado.findFirst({
        where: {
            usuarioId,
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