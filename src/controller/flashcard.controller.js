const { 
    flashcardDuplicado, 
    conteudoExiste, 
    validarOrdem, 
    possuiUsuarios 
} = require("../services/flashcard.service");
const prisma = require("../data/prisma");

const adicionar = async (req, res) => {
    try {
        const { pergunta, resposta, conteudoId, ordem } = req.body || {};

        if (!pergunta || typeof pergunta !== "string" || !pergunta.trim()) {
            return res.status(400).json({
                erro: "A pergunta do flashcard é obrigatória."
            });
        }

        if (!resposta || typeof resposta !== "string" || !resposta.trim()) {
            return res.status(400).json({
                erro: "A resposta do flashcard é obrigatória."
            });
        }

        if (!conteudoId || isNaN(Number(conteudoId))) {
            return res.status(400).json({
                erro: "O campo conteudoId é obrigatório e deve ser um número válido."
            });
        }

        if (!validarOrdem(ordem)) {
            return res.status(400).json({
                erro: "A ordem do flashcard é obrigatória e deve ser um número maior que zero."
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
            data: {
                pergunta: pergunta.trim(),
                resposta: resposta.trim(),
                ordem: Number(ordem),
                conteudoId: Number(conteudoId)
            }
        });

        return res.status(201).json({
            mensagem: "Flashcard adicionado com sucesso!",
            flashcard
        });
    } catch (erro) {
        console.error("ERRO AO ADICIONAR FLASHCARD:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao adicionar flashcard."
        });
    }
};

const listar = async (req, res) => {
    try {
        const { conteudoId } = req.query;

        const filtro = {};
        if (conteudoId) {
            if (isNaN(Number(conteudoId))) {
                return res.status(400).json({ erro: "ID de conteúdo inválido." });
            }
            filtro.conteudoId = Number(conteudoId);
        }

        const flashcards = await prisma.flashcard.findMany({
            where: filtro,
            include: {
                conteudo: true
            },
            orderBy: {
                ordem: "asc"
            }
        });

        return res.status(200).json(flashcards);
    } catch (erro) {
        console.error("ERRO AO LISTAR FLASHCARDS:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao listar flashcards."
        });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return res.status(400).json({
                erro: "ID de flashcard inválido."
            });
        }

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

        return res.status(200).json(flashcard);
    } catch (erro) {
        console.error("ERRO AO BUSCAR FLASHCARD:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao buscar flashcard."
        });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { pergunta, resposta, conteudoId, ordem } = req.body || {};

        if (isNaN(Number(id))) {
            return res.status(400).json({
                erro: "ID de flashcard inválido."
            });
        }

        const flashcardExistente = await prisma.flashcard.findUnique({
            where: { id: Number(id) }
        });

        if (!flashcardExistente) {
            return res.status(404).json({
                erro: "Flashcard não encontrado."
            });
        }

        const targetConteudoId = conteudoId !== undefined ? Number(conteudoId) : flashcardExistente.conteudoId;
        const targetPergunta = pergunta !== undefined ? pergunta.trim() : flashcardExistente.pergunta;

        if (conteudoId !== undefined && !(await conteudoExiste(targetConteudoId))) {
            return res.status(404).json({
                erro: "O conteúdo informado não existe."
            });
        }

        if (ordem !== undefined && !validarOrdem(ordem)) {
            return res.status(400).json({
                erro: "A ordem do flashcard deve ser um número maior que zero."
            });
        }

        if (await flashcardDuplicado(targetPergunta, targetConteudoId, id)) {
            return res.status(400).json({
                erro: "Já existe um flashcard com esta pergunta para este conteúdo."
            });
        }

        const dadosAtualizacao = {};
        if (pergunta !== undefined) dadosAtualizacao.pergunta = pergunta.trim();
        if (resposta !== undefined) dadosAtualizacao.resposta = resposta.trim();
        if (ordem !== undefined) dadosAtualizacao.ordem = Number(ordem);
        if (conteudoId !== undefined) dadosAtualizacao.conteudoId = Number(conteudoId);

        const flashcard = await prisma.flashcard.update({
            where: {
                id: Number(id)
            },
            data: dadosAtualizacao
        });

        return res.status(200).json({
            mensagem: "Flashcard atualizado com sucesso!",
            flashcard
        });
    } catch (erro) {
        console.error("ERRO AO ATUALIZAR FLASHCARD:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao atualizar flashcard."
        });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return res.status(400).json({
                erro: "ID de flashcard inválido."
            });
        }

        const flashcardExistente = await prisma.flashcard.findUnique({
            where: { id: Number(id) }
        });

        if (!flashcardExistente) {
            return res.status(404).json({
                erro: "Flashcard não encontrado."
            });
        }

        if (await possuiUsuarios(id)) {
            return res.status(400).json({
                erro: "Não é possível excluir o flashcard pois existem revisões de usuários vinculadas."
            });
        }

        const flashcard = await prisma.flashcard.delete({
            where: {
                id: Number(id)
            }
        });

        return res.status(200).json({
            mensagem: "Flashcard removido com sucesso!",
            flashcard
        });
    } catch (erro) {
        console.error("ERRO AO EXCLUIR FLASHCARD:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao excluir flashcard."
        });
    }
};

module.exports = {
    adicionar,
    listar,
    buscar,
    atualizar,
    excluir
};