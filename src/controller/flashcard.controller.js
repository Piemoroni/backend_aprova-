const prisma = require("../data/prisma");
const { flashcardDuplicado, conteudoExiste, validarOrdem, possuiUsuarios} = require("../services/flashcard.service");

const adicionar = async (req, res) => {

    const { pergunta, conteudoId, ordem } = req.body;


    const conteudo = await flashcardService.conteudoExiste(conteudoId);

    if (!conteudo) {
        return res.status(400).json({
            mensagem: "O conteúdo informado não existe."
        });
    }


    const duplicado = await flashcardService.flashcardDuplicado(
        pergunta,
        conteudoId
    );


    if (duplicado) {
        return res.status(400).json({
            mensagem: "Esse flashcard já está cadastrado nesse conteúdo."
        });
    }


    const ordemValida = flashcardService.validarOrdem(ordem);


    if (!ordemValida) {
        return res.status(400).json({
            mensagem: "A ordem do flashcard deve ser maior que zero."
        });
    }


    const flashcard = await prisma.flashcard.create({
        data: req.body,
        include: {
            conteudo: true
        }
    });


    res.status(201).json({
        mensagem: "Flashcard cadastrado com sucesso!",
        flashcard
    });

};



// Listar flashcards
const listar = async (req, res) => {

    const flashcards = await prisma.flashcard.findMany({
        include: {
            conteudo: true
        }
    });


    res.status(200).json(flashcards);

};



// Buscar flashcard
const buscar = async (req, res) => {

    const { id } = req.params;


    const flashcard = await prisma.flashcard.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            conteudo: true,
            usuarios: true
        }
    });


    res.status(200).json(flashcard);

};



// Atualizar flashcard
const atualizar = async (req, res) => {

    const { id } = req.params;


    const flashcard = await prisma.flashcard.update({
        where: {
            id: Number(id)
        },
        data: req.body
    });


    res.status(200).json({
        mensagem: "Flashcard atualizado com sucesso!",
        flashcard
    });

};



// Excluir flashcard
const excluir = async (req, res) => {

    const { id } = req.params;


    const possuiUsuarios = await flashcardService.possuiUsuarios(id);


    if (possuiUsuarios) {
        return res.status(400).json({
            mensagem: "Não é possível excluir esse flashcard, pois ele possui revisões de usuários."
        });
    }


    const flashcard = await prisma.flashcard.delete({
        where: {
            id: Number(id)
        }
    });


    res.status(200).json({
        mensagem: "Flashcard excluído com sucesso!",
        flashcard
    });

};




module.exports = {
    adicionar,
    listar,
    buscar,
    atualizar,
    excluir
};