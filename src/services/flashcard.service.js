const prisma = require("../data/prisma");

const flashcardDuplicado = async (pergunta, conteudoId, flashcardIdIgnorado = null) => {
    if (!pergunta || !conteudoId || isNaN(Number(conteudoId))) return false;

    const where = {
        pergunta: pergunta.trim(),
        conteudoId: Number(conteudoId)
    };
    
    if (flashcardIdIgnorado && !isNaN(Number(flashcardIdIgnorado))) {
        where.NOT = {
            id: Number(flashcardIdIgnorado)
        };
    }

    const flashcard = await prisma.flashcard.findFirst({ where });
    return flashcard != null;
};

const conteudoExiste = async (conteudoId) => {
    if (!conteudoId || isNaN(Number(conteudoId))) return false;

    const conteudo = await prisma.conteudo.findUnique({
        where: { id: Number(conteudoId) }
    });
    return conteudo != null;
};

const validarOrdem = (ordem) => {
    if (ordem === undefined || ordem === null || isNaN(Number(ordem))) {
        return false;
    }
    const num = Number(ordem);
    return Number.isInteger(num) && num > 0;
};

const possuiUsuarios = async (flashcardId) => {
    if (!flashcardId || isNaN(Number(flashcardId))) return false;

    const totalUsuarios = await prisma.flashcardUsuario.count({
        where: { flashcardId: Number(flashcardId) }
    });

    return totalUsuarios > 0;
};

module.exports = {
    flashcardDuplicado,
    conteudoExiste,
    validarOrdem,
    possuiUsuarios
};