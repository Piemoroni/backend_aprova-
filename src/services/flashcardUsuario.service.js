const prisma = require("../data/prisma");

const usuarioExiste = async (usuarioId) => {
    if (!usuarioId || isNaN(Number(usuarioId))) return false;

    const usuario = await prisma.usuario.findUnique({
        where: { id: Number(usuarioId) }
    });
    return usuario != null;
};

const flashcardExiste = async (flashcardId) => {
    if (!flashcardId || isNaN(Number(flashcardId))) return false;

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
    // Garante que é um número inteiro entre 1 e 5
    return Number.isInteger(num) && num >= 1 && num <= 5;
};

const buscarPorUsuario = async (usuarioId) => {
    if (!usuarioId || isNaN(Number(usuarioId))) return [];

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
    if (!id || isNaN(Number(id))) return null;

    return await prisma.flashcardUsuario.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            usuario: {
                select: { id: true, nome: true, email: true } 
            },
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