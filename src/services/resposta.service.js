const prisma = require("../data/prisma");

const usuarioExiste = async (usuarioId) => {
    if (!usuarioId || isNaN(Number(usuarioId))) return false;

    const usuario = await prisma.usuario.findUnique({
        where: { id: Number(usuarioId) }
    });
    return usuario != null;
};

const questaoExiste = async (questaoId) => {
    if (!questaoId || isNaN(Number(questaoId))) return false;

    const questao = await prisma.questao.findUnique({
        where: { id: Number(questaoId) }
    });
    return questao != null;
};

const alternativaExiste = async (alternativaId) => {
    if (!alternativaId || isNaN(Number(alternativaId))) return false;

    const alternativa = await prisma.alternativa.findUnique({
        where: { id: Number(alternativaId) }
    });
    return alternativa != null;
};

const simuladoExiste = async (simuladoId) => {
    if (!simuladoId || isNaN(Number(simuladoId))) return false;

    const simulado = await prisma.simulado.findUnique({
        where: { id: Number(simuladoId) }
    });
    return simulado != null;
};

const respostaDuplicada = async (simuladoId, questaoId) => {
    if (!simuladoId || !questaoId || isNaN(Number(simuladoId)) || isNaN(Number(questaoId))) return false;

    const resposta = await prisma.resposta.findFirst({
        where: {
            simuladoId: Number(simuladoId),
            questaoId: Number(questaoId)
        }
    });
    return resposta != null;
};

const verificarAlternativaCorreta = async (alternativaId) => {
    if (!alternativaId || isNaN(Number(alternativaId))) return false;

    const alternativa = await prisma.alternativa.findUnique({
        where: { id: Number(alternativaId) }
    });
    return alternativa ? Boolean(alternativa.correta) : false;
};

const alternativaPertenceAQuestao = async (alternativaId, questaoId) => {
    if (!alternativaId || !questaoId || isNaN(Number(alternativaId)) || isNaN(Number(questaoId))) return false;

    const alternativa = await prisma.alternativa.findFirst({
        where: {
            id: Number(alternativaId),
            questaoId: Number(questaoId)
        }
    });

    return alternativa != null;
};

module.exports = {
    usuarioExiste,
    questaoExiste,
    alternativaExiste,
    simuladoExiste,
    respostaDuplicada,
    verificarAlternativaCorreta,
    alternativaPertenceAQuestao
};