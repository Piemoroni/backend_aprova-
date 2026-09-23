const prisma = require("../data/prisma");

const materiaDuplicada = async (nome, idAtual = null) => {
    if (!nome || typeof nome !== "string") return false;

    const idValido = idAtual && !isNaN(Number(idAtual)) ? Number(idAtual) : null;

    const materia = await prisma.materia.findFirst({
        where: {
            nome: {
                equals: nome.trim(),
                mode: "insensitive" 
            },
            ...(idValido && { NOT: { id: idValido } })
        }
    });
    return !!materia;
};

const materiaExiste = async (id) => {
    if (!id || isNaN(Number(id))) return false;

    const materia = await prisma.materia.findUnique({
        where: {
            id: Number(id)
        }
    });
    return !!materia;
};

const possuiConteudos = async (id) => {
    if (!id || isNaN(Number(id))) return false;

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