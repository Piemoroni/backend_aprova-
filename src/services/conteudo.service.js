const prisma = require("../data/prisma");

const conteudoDuplicado = async (titulo, materiaId) => {

    const conteudo = await prisma.conteudo.findFirst({
        where: {
            titulo,
            materiaId
        }
    });

    return conteudo != null;
};

const materiaExiste = async (materiaId) => {

    const materia = await prisma.materia.findUnique({
        where: {
            id: Number(materiaId)
        }
    });

    return materia != null;
};

const possuiRelacionamentos = async (conteudoId) => {

    const conteudo = await prisma.conteudo.findUnique({
        where: {
            id: Number(conteudoId)
        },
        include: {
            questoes: true,
            flashcards: true
        }
    });


    if (!conteudo) {
        return false;
    }


    return (
        conteudo.questoes.length > 0 ||
        conteudo.flashcards.length > 0
    );
};


module.exports = {
    conteudoDuplicado,
    materiaExiste,
    possuiRelacionamentos
};