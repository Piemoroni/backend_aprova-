const prisma = require("../data/prisma");

const questaoExiste = async (questaoId) => {
    const questao = await prisma.questao.findUnique({
        where: {
            id: Number(questaoId)
        }
    });
    return !!questao;
};

const alternativaExiste = async (id) => {
    const alternativa = await prisma.alternativa.findUnique({
        where: {
            id: Number(id)
        }
    });
    return !!alternativa;
};

const possuiRespostas = async (id) => {
    const total = await prisma.resposta.count({
        where: {
            alternativaId: Number(id)
        }
    });
    return total > 0;
};

module.exports = {
    questaoExiste,
    alternativaExiste,
    possuiRespostas
};