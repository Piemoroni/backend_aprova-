const prisma = require("../data/prisma");


// Verifica se já existe um flashcard com a mesma pergunta no conteúdo
const flashcardDuplicado = async (pergunta, conteudoId) => {

    const flashcard = await prisma.flashcard.findFirst({
        where: {
            pergunta,
            conteudoId
        }
    });

    return flashcard != null;
};



// Verifica se o conteúdo existe
const conteudoExiste = async (conteudoId) => {

    const conteudo = await prisma.conteudo.findUnique({
        where: {
            id: Number(conteudoId)
        }
    });

    return conteudo != null;
};



// Valida a ordem do flashcard
const validarOrdem = (ordem) => {

    if (ordem <= 0) {
        return false;
    }

    return true;
};



// Verifica se o flashcard possui usuários vinculados
const possuiUsuarios = async (flashcardId) => {

    const flashcard = await prisma.flashcard.findUnique({
        where: {
            id: Number(flashcardId)
        },
        include: {
            usuarios: true
        }
    });


    if (!flashcard) {
        return false;
    }


    return flashcard.usuarios.length > 0;
};



module.exports = {
    flashcardDuplicado,
    conteudoExiste,
    validarOrdem,
    possuiUsuarios
};