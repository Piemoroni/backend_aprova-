const prisma = require("../data/prisma");

const materiaExiste = async (materiaId) => {
    const materia = await prisma.materia.findUnique({
        where: {
            id: Number(materiaId)
        }
    });
    return !!materia;
};

const conteudoExiste = async (id) => {
    const conteudo = await prisma.conteudo.findUnique({
        where: {
            id: Number(id)
        }
    });
    return !!conteudo;
};

const conteudoDuplicadoNaMateria = async (titulo, materiaId, idAtual = null) => {
    const conteudo = await prisma.conteudo.findFirst({
        where: {
            titulo: titulo.trim(),
            materiaId: Number(materiaId),
            ...(idAtual && { NOT: { id: Number(idAtual) } })
        }
    });
    return !!conteudo;
};

module.exports = {
    materiaExiste,
    conteudoExiste,
    conteudoDuplicadoNaMateria
};