const prisma = require("../data/prisma");

const conteudoExiste = async (conteudoId) => {
    const conteudo = await prisma.conteudo.findUnique({
        where: {
            id: Number(conteudoId)
        }
    });
    return !!conteudo;
};

const questaoExiste = async (id) => {
    const questao = await prisma.questao.findUnique({
        where: {
            id: Number(id)
        }
    });
    return !!questao;
};

const possuiAlternativas = async (id) => {
    const total = await prisma.alternativa.count({
        where: {
            questaoId: Number(id)
        }
    });
    return total > 0;
};

const possuiRespostas = async (id) => {
    const total = await prisma.resposta.count({
        where: {
            questaoId: Number(id)
        }
    });
    return total > 0;
};

module.exports = {
    conteudoExiste,
    questaoExiste,
    possuiAlternativas,
    possuiRespostas
};