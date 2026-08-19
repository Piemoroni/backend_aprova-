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



// Verifica se já existe uma redação do mesmo tema no mesmo dia
const redacaoDuplicada = async (usuarioId, tema) => {

    const redacao = await prisma.redacao.findFirst({
        where: {
            usuarioId,
            tema
        }
    });

    return redacao != null;
};



// Valida se o texto da redação foi preenchido
const validarTexto = (texto) => {

    if (!texto || texto.trim().length === 0) {
        return false;
    }

    return true;
};



// Valida a nota da redação
const validarNota = (nota) => {

    if (nota == null) {
        return true;
    }


    return nota >= 0 && nota <= 1000;
};



// Verifica se a redação possui correção realizada
const possuiCorrecao = async (redacaoId) => {

    const redacao = await prisma.redacao.findUnique({
        where: {
            id: Number(redacaoId)
        }
    });


    if (!redacao) {
        return false;
    }


    return redacao.nota != null || redacao.feedback != null;
};



module.exports = {
    usuarioExiste,
    redacaoDuplicada,
    validarTexto,
    validarNota,
    possuiCorrecao
};