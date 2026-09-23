const prisma = require("../data/prisma");

const usuarioExiste = async (usuarioId) => {
    const usuario = await prisma.usuario.findUnique({
        where: { id: Number(usuarioId) }
    });
    return usuario != null;
};

const questaoExiste = async (questaoId) => {
    const questao = await prisma.questao.findUnique({
        where: { id: Number(questaoId) }
    });
    return questao != null;
};

const alternativaExiste = async (alternativaId) => {
    const alternativa = await prisma.alternativa.findUnique({
        where: { id: Number(alternativaId) }
    });
    return alternativa != null;
};

const simuladoExiste = async (simuladoId) => {
    const simulado = await prisma.simulado.findUnique({
        where: { id: Number(simuladoId) }
    });
    return simulado != null;
};

const respostaDuplicada = async (simuladoId, questaoId) => {
    const resposta = await prisma.resposta.findFirst({
        where: {
            simuladoId: Number(simuladoId),
            questaoId: Number(questaoId)
        }
    });
    return resposta != null;
};

const verificarAlternativaCorreta = async (alternativaId) => {
    const alternativa = await prisma.alternativa.findUnique({
        where: { id: Number(alternativaId) }
    });
    return alternativa ? alternativa.correta : false;
};

module.exports = {
    usuarioExiste,
    questaoExiste,
    alternativaExiste,
    simuladoExiste,
    respostaDuplicada,
    verificarAlternativaCorreta
};