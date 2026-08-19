const prisma = require("../data/prisma");

const desempenhoDuplicado = async (usuarioId, dataReferencia) => {

    const desempenho = await prisma.desempenho.findFirst({
        where: {
            usuarioId,
            dataReferencia
        }
    });

    return desempenho != null;
};

const usuarioExiste = async (usuarioId) => {

    const usuario = await prisma.usuario.findUnique({
        where: {
            id: Number(usuarioId)
        }
    });

    return usuario != null;
};

const validarDesempenho = (acertos, erros) => {

    if (acertos < 0 || erros < 0) {
        return false;
    }

    return true;
};


module.exports = {
    desempenhoDuplicado,
    usuarioExiste,
    validarDesempenho
};