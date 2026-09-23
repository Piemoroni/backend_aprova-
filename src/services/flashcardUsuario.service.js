const prisma = require("../data/prisma");

const usuarioExiste = async (usuarioId) => {
    const usuario = await prisma.usuario.findUnique({
        where: { id: Number(usuarioId) }
    });
    return usuario != null;
};

const flashcardExiste = async (flashcardId) => {
    const flashcard = await prisma.flashcard.findUnique({
        where: { id: Number(flashcardId) }
    });
    return flashcard != null;
};

const validarNivelDominio = (nivel) => {
    if (nivel === undefined || nivel === null || isNaN(Number(nivel))) {
        return false;
    }
    const num = Number(nivel);
    return num >= 1 && num <= 5;
};

const buscarPorUsuario = async (usuarioId) => {
    return await prisma.flashcardUsuario.findMany({
        where: {
            usuarioId: Number(usuarioId)
        },
        include: {
            flashcard: true
        }
    });
};

const buscarPorId = async (id) => {
    return await prisma.flashcardUsuario.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            usuario: true,
            flashcard: true
        }
    });
};

module.exports = {
    usuarioExiste,
    flashcardExiste,
    validarNivelDominio,
    buscarPorUsuario,
    buscarPorId
};