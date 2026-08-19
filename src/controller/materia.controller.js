const prisma = require("../data/prisma");
const {materiaDuplicada, validarMateria, possuiConteudos }= require("../services/materia.service");

// Cadastrar matéria
const adicionar = async (req, res) => {

    const { nome, descricao, cor, icone } = req.body;


    const valida = materiaService.validarMateria(
        nome,
        descricao,
        cor,
        icone
    );


    if (!valida) {
        return res.status(400).json({
            mensagem: "Preencha todos os campos obrigatórios."
        });
    }


    const duplicada = await materiaService.materiaDuplicada(nome);


    if (duplicada) {
        return res.status(400).json({
            mensagem: "Essa matéria já está cadastrada."
        });
    }


    const materia = await prisma.materia.create({
        data: req.body
    });


    res.status(201).json({
        mensagem: "Matéria cadastrada com sucesso!",
        materia
    });

};



// Listar matérias
const listar = async (req, res) => {

    const materias = await prisma.materia.findMany({
        include: {
            conteudos: true
        }
    });


    res.status(200).json(materias);

};



// Buscar matéria
const buscar = async (req, res) => {

    const { id } = req.params;


    const materia = await prisma.materia.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            conteudos: true
        }
    });


    res.status(200).json(materia);

};



// Atualizar matéria
const atualizar = async (req, res) => {

    const { id } = req.params;


    const materia = await prisma.materia.update({
        where: {
            id: Number(id)
        },
        data: req.body
    });


    res.status(200).json({
        mensagem: "Matéria atualizada com sucesso!",
        materia
    });

};



// Excluir matéria
const excluir = async (req, res) => {

    const { id } = req.params;


    const possuiConteudos = await materiaService.possuiConteudos(id);


    if (possuiConteudos) {
        return res.status(400).json({
            mensagem: "Não é possível excluir essa matéria, pois existem conteúdos vinculados."
        });
    }


    const materia = await prisma.materia.delete({
        where: {
            id: Number(id)
        }
    });


    res.status(200).json({
        mensagem: "Matéria excluída com sucesso!",
        materia
    });

};





module.exports = {
    adicionar,
    listar,
    buscar,
    atualizar,
    excluir
};