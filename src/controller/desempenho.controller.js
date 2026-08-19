const prisma = require("../data/prisma");
const {desempenhoDuplicado, usuarioExiste, validarDesempenho} = require("../services/desempenho.service");

const adicionar = async (req, res) => {

    const { usuarioId, dataReferencia, acertos, erros } = req.body;


    const usuario = await desempenhoService.usuarioExiste(usuarioId);

    if (!usuario) {
        return res.status(400).json({
            mensagem: "Usuário não encontrado."
        });
    }


    const duplicado = await desempenhoService.desempenhoDuplicado(
        usuarioId,
        dataReferencia
    );


    if (duplicado) {
        return res.status(400).json({
            mensagem: "Já existe um desempenho registrado nessa data."
        });
    }


    const valido = desempenhoService.validarDesempenho(
        acertos,
        erros
    );


    if (!valido) {
        return res.status(400).json({
            mensagem: "Quantidade de acertos e erros inválida."
        });
    }


    const desempenho = await prisma.desempenho.create({
        data: req.body,
        include: {
            usuario: true
        }
    });


    res.status(201).json({
        mensagem: "Desempenho registrado com sucesso!",
        desempenho
    });

};

const listar = async (req, res) => {

    const desempenhos = await prisma.desempenho.findMany({
        include: {
            usuario: true
        }
    });


    res.status(200).json(desempenhos);
};

const buscar = async (req, res) => {

    const { id } = req.params;


    const desempenho = await prisma.desempenho.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            usuario: true
        }
    });


    res.status(200).json(desempenho);
};

const atualizar = async (req, res) => {

    const { id } = req.params;


    const desempenho = await prisma.desempenho.update({
        where: {
            id: Number(id)
        },
        data: req.body
    });


    res.status(200).json({
        mensagem: "Desempenho atualizado com sucesso!",
        desempenho
    });

};

const excluir = async (req, res) => {

    const { id } = req.params;


    const desempenho = await prisma.desempenho.delete({
        where: {
            id: Number(id)
        }
    });


    res.status(200).json({
        mensagem: "Desempenho excluído com sucesso!",
        desempenho
    });

};


module.exports = {
    adicionar,
    listar,
    buscar,
    atualizar,
    excluir
};