const prisma = require("../data/prisma");


// Verifica se já existe uma matéria com o mesmo nome
const materiaDuplicada = async (nome) => {

    const materia = await prisma.materia.findFirst({
        where: {
            nome
        }
    });

    return materia != null;
};



// Verifica se os dados obrigatórios foram preenchidos
const validarMateria = (nome, descricao, cor, icone) => {

    if (!nome || !descricao || !cor || !icone) {
        return false;
    }

    return true;
};



// Verifica se a matéria possui conteúdos vinculados
const possuiConteudos = async (materiaId) => {

    const materia = await prisma.materia.findUnique({
        where: {
            id: Number(materiaId)
        },
        include: {
            conteudos: true
        }
    });


    if (!materia) {
        return false;
    }


    return materia.conteudos.length > 0;
};



module.exports = {
    materiaDuplicada,
    validarMateria,
    possuiConteudos
};