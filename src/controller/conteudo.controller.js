const prisma = require("../data/prisma");
const { conteudoDuplicado, materiaExiste, possuiRelacionamentos} = require("../services/conteudo.service");

const adicionar = async (req, res) => {

    const { titulo, materiaId } = req.body;


    const materia = await conteudoService.materiaExiste(materiaId);

    if (!materia) {
        return res.status(400).json({
            mensagem: "A matéria informada não existe."
        });
    }


    const duplicado = await conteudoService.conteudoDuplicado(
        titulo,
        materiaId
    );


    if (duplicado) {
        return res.status(400).json({
            mensagem: "Esse conteúdo já está cadastrado nessa matéria."
        });
    }


    const conteudo = await prisma.conteudo.create({
        data: req.body,
        include: {
            materia: true
        }
    });


    res.status(201).json({
        mensagem: "Conteúdo cadastrado com sucesso!",
        conteudo
    });
};

const listar = async (req, res) => {

    const conteudos = await prisma.conteudo.findMany({
        include: {
            materia: true
        }
    });

    res.status(200).json(conteudos);
};

const buscar = async (req, res) => {

    const { id } = req.params;

    const conteudo = await prisma.conteudo.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            materia: true,
            questoes: true,
            flashcards: true
        }
    });

    res.status(200).json(conteudo);
};

const atualizar = async (req, res) => {

    const { id } = req.params;

    const conteudo = await prisma.conteudo.update({
        where: {
            id: Number(id)
        },
        data: req.body
    });

    res.status(200).json({
        mensagem: "Conteúdo atualizado com sucesso!",
        conteudo
    });
};

const excluir = async (req, res) => {

    const { id } = req.params;


    const possuiRelacionamentos = await conteudoService.possuiRelacionamentos(id);


    if (possuiRelacionamentos) {
        return res.status(400).json({
            mensagem: "Não é possível excluir esse conteúdo, pois ele possui questões ou flashcards vinculados."
        });
    }


    const conteudo = await prisma.conteudo.delete({
        where: {
            id: Number(id)
        }
    });


    res.status(200).json({
        mensagem: "Conteúdo excluído com sucesso!",
        conteudo
    });

};

module.exports = {
    adicionar,
    listar,
    buscar,
    atualizar,
    excluir
};