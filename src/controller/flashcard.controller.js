const { flashcardDuplicado, conteudoExiste, validarOrdem, possuiUsuarios } = require("../services/flashcard.service");
const prisma = require("../data/prisma");

const adicionar = async (req, res) => {
    const { pergunta, conteudoId, ordem } = req.body;

    if (!validarOrdem(ordem)) {
        return res.status(400).json({
            erro: "A ordem do flashcard deve ser maior que zero."
        });
    }

    if (!(await conteudoExiste(conteudoId))) {
        return res.status(404).json({
            erro: "O conteúdo informado não existe."
        });
    }

    if (await flashcardDuplicado(pergunta, conteudoId)) {
        return res.status(400).json({
            erro: "Já existe um flashcard com esta pergunta para este conteúdo."
        });
    }

    const flashcard = await prisma.flashcard.create({
        data: req.body
    });

    res.status(201).json({
        mensagem: "Flashcard adicionado com sucesso!",
        flashcard
    });
};

const listar = async (req, res) => {
    const flashcards = await prisma.flashcard.findMany({
        include: {
            conteudo: true
        }
    });

    res.status(200).json(flashcards);
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const flashcard = await prisma.flashcard.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            conteudo: true
        }
    });

    if (!flashcard) {
        return res.status(404).json({
            erro: "Flashcard não encontrado."
        });
    }

    res.status(200).json(flashcard);
};

const atualizar = async (req, res) => {
    const { id } = req.params;

    const flashcard = await prisma.flashcard.update({
        where: {
            id: Number(id)
        },
        data: req.body
    });

    res.status(200).json(flashcard);
};

const excluir = async (req, res) => {
    const { id } = req.params;

    if (await possuiUsuarios(id)) {
        return res.status(400).json({
            erro: "Não é possível excluir o flashcard pois existem usuários vinculados."
        });
    }

    const flashcard = await prisma.flashcard.delete({
        where: {
            id: Number(id)
        }
    });

    res.status(200).json({
        mensagem: "Flashcard removido com sucesso!",
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