const prisma = require("../data/prisma");

const materiaDuplicada = async (nome, idAtual = null) => {
    const materia = await prisma.materia.findFirst({
        where: {
            nome: nome.trim(),
            ...(idAtual && { NOT: { id: Number(idAtual) } })
        }
    });
    return !!materia;
};

const materiaExiste = async (id) => {
    const materia = await prisma.materia.findUnique({
        where: {
            id: Number(id)
        }
    });
    return !!materia;
};

const possuiConteudos = async (id) => {
    const total = await prisma.conteudo.count({
        where: {
            materiaId: Number(id)
        }
    });
    return total > 0;
};

module.exports = {
    materiaDuplicada,
    materiaExiste,
    possuiConteudos
};