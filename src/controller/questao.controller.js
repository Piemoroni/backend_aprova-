const prisma = require("../data/prisma");
const {questaoDuplicada, conteudoExiste, validarDificuldade, possuiRespostas, possuiAlternativas}= require("../services/questao.service");

const prisma = require("../data/prisma");

// Cadastrar questão
const adicionar = async (req, res) => {

    const { enunciado, conteudoId, dificuldade } = req.body;


    const conteudo = await questaoService.conteudoExiste(conteudoId);

    if (!conteudo) {
        return res.status(400).json({
            mensagem: "O conteúdo informado não existe."
        });
    }


    const duplicada = await questaoService.questaoDuplicada(
        enunciado,
        conteudoId
    );


    if (duplicada) {
        return res.status(400).json({
            mensagem: "Essa questão já está cadastrada nesse conteúdo."
        });
    }


    const dificuldadeValida = questaoService.validarDificuldade(
        dificuldade
    );


    if (!dificuldadeValida) {
        return res.status(400).json({
            mensagem: "A dificuldade deve ser Fácil, Médio ou Difícil."
        });
    }


    const questao = await prisma.questao.create({
        data: req.body,
        include: {
            conteudo: true,
            alternativas: true
        }
    });


    res.status(201).json({
        mensagem: "Questão cadastrada com sucesso!",
        questao
    });

};



// Listar questões
const listar = async (req, res) => {

    const questoes = await prisma.questao.findMany({
        include: {
            conteudo: true,
            alternativas: true
        }
    });


    res.status(200).json(questoes);

};



// Buscar questão
const buscar = async (req, res) => {

    const { id } = req.params;


    const questao = await prisma.questao.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            conteudo: true,
            alternativas: true
        }
    });


    res.status(200).json(questao);

};



// Atualizar questão
const atualizar = async (req, res) => {

    const { id } = req.params;


    const questao = await prisma.questao.update({
        where: {
            id: Number(id)
        },
        data: req.body
    });


    res.status(200).json({
        mensagem: "Questão atualizada com sucesso!",
        questao
    });

};



// Excluir questão
const excluir = async (req, res) => {

    const { id } = req.params;


    const possuiRespostas = await questaoService.possuiRespostas(id);


    if (possuiRespostas) {
        return res.status(400).json({
            mensagem: "Não é possível excluir essa questão, pois ela já foi utilizada em simulados."
        });
    }


    const questao = await prisma.questao.delete({
        where: {
            id: Number(id)
        }
    });


    res.status(200).json({
        mensagem: "Questão excluída com sucesso!",
        questao
    });

};

module.exports = {
    adicionar,
    listar,
    buscar,
    atualizar,
    excluir
};