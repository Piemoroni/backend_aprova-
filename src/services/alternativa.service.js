const prisma = require("../data/prisma");

const questaoExiste = async (questaoId) => {
    if (!questaoId || isNaN(Number(questaoId))) return false;

    const questao = await prisma.questao.findUnique({
        where: { id: Number(questaoId) }
    });
    return !!questao;
};

const alternativaExiste = async (id) => {
    if (!id || isNaN(Number(id))) return false;

    const alternativa = await prisma.alternativa.findUnique({
        where: { id: Number(id) }
    });
    return !!alternativa;
};

const possuiRespostas = async (id) => {
    if (!id || isNaN(Number(id))) return false;

    const total = await prisma.resposta.count({
        where: { alternativaId: Number(id) }
    });
    return total > 0;
};

const ordemDuplicadaNaQuestao = async (ordem, questaoId, alternativaIdIgnorada = null) => {
    if (!ordem || !questaoId || isNaN(Number(questaoId))) return false;

    const where = {
        ordem: ordem.trim().toUpperCase(),
        questaoId: Number(questaoId)
    };

    if (alternativaIdIgnorada && !isNaN(Number(alternativaIdIgnorada))) {
        where.NOT = { id: Number(alternativaIdIgnorada) };
    }

    const alternativa = await prisma.alternativa.findFirst({ where });
    return !!alternativa;
};

const questaoJaTemCorreta = async (questaoId, alternativaIdIgnorada = null) => {
    if (!questaoId || isNaN(Number(questaoId))) return false;

    const where = {
        questaoId: Number(questaoId),
        correta: true
    };

    if (alternativaIdIgnorada && !isNaN(Number(alternativaIdIgnorada))) {
        where.NOT = { id: Number(alternativaIdIgnorada) };
    }

    const alternativaCorreta = await prisma.alternativa.findFirst({ where });
    return !!alternativaCorreta;
};

module.exports = {
    questaoExiste,
    alternativaExiste,
    possuiRespostas,
    ordemDuplicadaNaQuestao,
    questaoJaTemCorreta
};