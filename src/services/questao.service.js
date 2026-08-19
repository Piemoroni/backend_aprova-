const prisma = require("../data/prisma");


// Verifica se já existe uma questão igual no mesmo conteúdo
const questaoDuplicada = async (enunciado, conteudoId) => {

    const questao = await prisma.questao.findFirst({
        where: {
            enunciado,
            conteudoId
        }
    });

    return questao != null;
};



// Verifica se o conteúdo existe
const conteudoExiste = async (conteudoId) => {

    const conteudo = await prisma.conteudo.findUnique({
        where: {
            id: Number(conteudoId)
        }
    });

    return conteudo != null;
};



// Valida o nível de dificuldade da questão
const validarDificuldade = (dificuldade) => {

    const niveis = [
        "Fácil",
        "Médio",
        "Difícil"
    ];


    return niveis.includes(dificuldade);
};



// Verifica se a questão já foi respondida em algum simulado
const possuiRespostas = async (questaoId) => {

    const questao = await prisma.questao.findUnique({
        where: {
            id: Number(questaoId)
        },
        include: {
            respostas: true
        }
    });


    if (!questao) {
        return false;
    }


    return questao.respostas.length > 0;
};



// Verifica se a questão possui alternativas cadastradas
const possuiAlternativas = async (questaoId) => {

    const questao = await prisma.questao.findUnique({
        where: {
            id: Number(questaoId)
        },
        include: {
            alternativas: true
        }
    });


    if (!questao) {
        return false;
    }


    return questao.alternativas.length > 0;
};



module.exports = {
    questaoDuplicada,
    conteudoExiste,
    validarDificuldade,
    possuiRespostas,
    possuiAlternativas
};