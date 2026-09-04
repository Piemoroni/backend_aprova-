const prisma = require("../data/prisma");
const crypto = require("crypto");

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

const gerarHashSenha = (senha) => {
    return crypto.createHash("sha256").update(senha).digest("hex");
};

const compararSenha = (senhaDigitada, senhaHash) => {
    const hashDigitado = gerarHashSenha(senhaDigitada);
    return hashDigitado === senhaHash;
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
    gerarHashSenha,
    compararSenha,
    possuiDados
};