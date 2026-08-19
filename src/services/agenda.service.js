const prisma = require("../data/prisma");

const eventoDuplicado = async (usuarioId, dataEvento, horaEvento) => {

    const evento = await prisma.agenda.findFirst({
        where: {
            usuarioId,
            dataEvento,
            horaEvento
        }
    });

    return evento != null;
};

module.exports = {
    eventoDuplicado
};