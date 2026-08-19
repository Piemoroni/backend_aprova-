const prisma = require("../data/prisma");


// Verifica se o e-mail já está cadastrado
const emailDuplicado = async (email) => {

    const usuario = await prisma.usuario.findUnique({
        where: {
            email
        }
    });

    return usuario != null;
};



// Valida formato do e-mail
const validarEmail = (email) => {

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
};



// Valida tamanho da senha
const validarSenha = (senha) => {

    if (!senha || senha.length < 6) {
        return false;
    }

    return true;
};



// Verifica se o usuário possui dados vinculados
const possuiDados = async (usuarioId) => {

    const usuario = await prisma.usuario.findUnique({
        where: {
            id: Number(usuarioId)
        },
        include: {
            simulados: true,
            redacoes: true,
            agendas: true,
            mensagensIA: true,
            desempenhos: true,
            historicosEstudo: true
        }
    });


    if (!usuario) {
        return false;
    }


    return (
        usuario.simulados.length > 0 ||
        usuario.redacoes.length > 0 ||
        usuario.agendas.length > 0 ||
        usuario.mensagensIA.length > 0 ||
        usuario.desempenhos.length > 0 ||
        usuario.historicosEstudo.length > 0
    );
};



module.exports = {
    emailDuplicado,
    validarEmail,
    validarSenha,
    possuiDados
};