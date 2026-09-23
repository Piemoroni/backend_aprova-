const prisma = require("../data/prisma");
const bcrypt = require("bcrypt");

const emailDuplicado = async (email) => {
    const usuario = await prisma.usuario.findUnique({
        where: { email }
    });
    return usuario != null;
};

const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validarSenha = (senha) => {
    return senha && senha.length >= 6;
};

const validarTipo = (tipo) => {
    const tiposPermitidos = ["ALUNO", "PROFESSOR", "ADMIN"];
    return tipo ? tiposPermitidos.includes(tipo.toUpperCase()) : true;
};

const gerarHashSenha = async (senha) => {
    const SALTS = 10;
    return await bcrypt.hash(senha, SALTS);
};

const compararSenha = async (senhaDigitada, senhaHash) => {
    return await bcrypt.compare(senhaDigitada, senhaHash);
};

const possuiDados = async (usuarioId) => {
    const usuario = await prisma.usuario.findUnique({
        where: {
            id: Number(usuarioId)
        },
        include: {
            simulados: true,
            flashcards: true
        }
    });

    if (!usuario) {
        return false;
    }

    return usuario.simulados.length > 0 || usuario.flashcards.length > 0;
};

module.exports = {
    emailDuplicado,
    validarEmail,
    validarSenha,
    validarTipo,
    gerarHashSenha,
    compararSenha,
    possuiDados
};