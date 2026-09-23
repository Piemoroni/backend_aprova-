const prisma = require("../data/prisma");

const materiaExiste = async (materiaId) => {
    if (!materiaId || isNaN(Number(materiaId))) return false;

    const materia = await prisma.materia.findUnique({
        where: { id: Number(materiaId) }
    });
    return !!materia;
};

const conteudoExiste = async (id) => {
    if (!id || isNaN(Number(id))) return false;

    const conteudo = await prisma.conteudo.findUnique({
        where: { id: Number(id) }
    });
    return !!conteudo;
};

const conteudoDuplicadoNaMateria = async (titulo, materiaId, idAtual = null) => {
    if (!titulo || !materiaId || isNaN(Number(materiaId))) return false;

    const where = {
        titulo: titulo.trim(),
        materiaId: Number(materiaId)
    };

    if (idAtual && !isNaN(Number(idAtual))) {
        where.NOT = { id: Number(idAtual) };
    }

    const conteudo = await prisma.conteudo.findFirst({ where });
    return !!conteudo;
};

const possuiQuestoesOuFlashcards = async (conteudoId) => {
    if (!conteudoId || isNaN(Number(conteudoId))) return false;

    const [totalQuestoes, totalFlashcards] = await Promise.all([
        prisma.questao.count({ where: { conteudoId: Number(conteudoId) } }),
        prisma.flashcard.count({ where: { conteudoId: Number(conteudoId) } })
    ]);

    return totalQuestoes > 0 || totalFlashcards > 0;
};

module.exports = {
    materiaExiste,
    conteudoExiste,
    conteudoDuplicadoNaMateria,
    possuiQuestoesOuFlashcards
};