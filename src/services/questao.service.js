const prisma = require("../data/prisma");

const conteudoExiste = async (conteudoId) => {
    if (!conteudoId || isNaN(Number(conteudoId))) return false;

    const conteudo = await prisma.conteudo.findUnique({
        where: {
            id: Number(conteudoId)
        }
    });
    return !!conteudo;
};

const questaoExiste = async (id) => {
    if (!id || isNaN(Number(id))) return false;

    const questao = await prisma.questao.findUnique({
        where: {
            id: Number(id)
        }
    });
    return !!questao;
};

const possuiAlternativas = async (id) => {
    if (!id || isNaN(Number(id))) return false;

    const total = await prisma.alternativa.count({
        where: {
            questaoId: Number(id)
        }
    });
    return total > 0;
};

const possuiRespostas = async (id) => {
    if (!id || isNaN(Number(id))) return false;

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