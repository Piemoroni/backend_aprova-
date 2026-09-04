const prisma = require("../data/prisma");

const usuarioExiste = async (usuarioId) => {
    const usuario = await prisma.usuario.findUnique({
        where: { id: Number(usuarioId) }
    });
    return !!usuario;
};

const flashcardExiste = async (flashcardId) => {
    const flashcard = await prisma.flashcard.findUnique({
        where: { id: Number(flashcardId) }
    });
    return !!flashcard;
};

const buscarRegistro = async (usuarioId, flashcardId) => {
    return await prisma.flashcardUsuario.findFirst({
        where: {
            usuarioId: Number(usuarioId),
            flashcardId: Number(flashcardId)
        }
    });
};

module.exports = {
    usuarioExiste,
    flashcardExiste,
    buscarRegistro
};