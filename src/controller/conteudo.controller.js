const { materiaExiste, conteudoExiste, conteudoDuplicadoNaMateria,possuiQuestoesOuFlashcards } = require("../services/conteudo.service");
const prisma = require("../data/prisma");

const adicionar = async (req, res) => {
    try {
        const { titulo, resumo, ordem, materiaId } = req.body || {};

        if (!titulo || typeof titulo !== "string" || titulo.trim() === "") {
            return res.status(400).json({
                erro: "O título do conteúdo é obrigatório."
            });
        }

        if (!resumo || typeof resumo !== "string" || resumo.trim() === "") {
            return res.status(400).json({
                erro: "O resumo do conteúdo é obrigatório."
            });
        }

        if (ordem === undefined || ordem === null || isNaN(Number(ordem))) {
            return res.status(400).json({
                erro: "A ordem do conteúdo deve ser um número válido."
            });
        }

        if (!materiaId || isNaN(Number(materiaId))) {
            return res.status(400).json({
                erro: "O ID da matéria (materiaId) é obrigatório e deve ser um número."
            });
        }

        if (!(await materiaExiste(materiaId))) {
            return res.status(404).json({
                erro: "A matéria informada não existe."
            });
        }

        if (await conteudoDuplicadoNaMateria(titulo, materiaId)) {
            return res.status(400).json({
                erro: "Já existe um conteúdo com este título nesta matéria."
            });
        }

        const conteudo = await prisma.conteudo.create({
            data: {
                titulo: titulo.trim(),
                resumo: resumo.trim(),
                ordem: Number(ordem),
                materiaId: Number(materiaId)
            }
        });

        return res.status(201).json({
            mensagem: "Conteúdo cadastrado com sucesso!",
            conteudo
        });
    } catch (erro) {
        console.error("ERRO DETALHADO AO CADASTRAR CONTEÚDO:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao cadastrar conteúdo."
        });
    }
};

const listar = async (req, res) => {
    try {
        const { materiaId } = req.query;

        const filtro = {};
        if (materiaId) {
            if (isNaN(Number(materiaId))) {
                return res.status(400).json({ erro: "ID de matéria inválido." });
            }
            filtro.materiaId = Number(materiaId);
        }

        const conteudos = await prisma.conteudo.findMany({
            where: filtro,
            include: {
                materia: {
                    select: { id: true, nome: true }
                }
            },
            orderBy: {
                ordem: "asc"
            }
        });

        return res.status(200).json(conteudos);
    } catch (erro) {
        console.error("ERRO AO LISTAR CONTEÚDOS:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao listar conteúdos."
        });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return res.status(400).json({
                erro: "ID de conteúdo inválido."
            });
        }

        const conteudo = await prisma.conteudo.findUnique({
            where: { id: Number(id) },
            include: {
                materia: {
                    select: { id: true, nome: true }
                },
                questoes: true,
                flashcards: true
            }
        });

        if (!conteudo) {
            return res.status(404).json({
                erro: "Conteúdo não encontrado."
            });
        }

        return res.status(200).json(conteudo);
    } catch (erro) {
        console.error("ERRO AO BUSCAR CONTEÚDO:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao buscar conteúdo."
        });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, resumo, ordem, materiaId } = req.body || {};

        if (isNaN(Number(id))) {
            return res.status(400).json({
                erro: "ID de conteúdo inválido."
            });
        }

        const conteudoExistente = await prisma.conteudo.findUnique({
            where: { id: Number(id) }
        });

        if (!conteudoExistente) {
            return res.status(404).json({
                erro: "Conteúdo não encontrado."
            });
        }

        const targetMateriaId = materiaId !== undefined ? Number(materiaId) : conteudoExistente.materiaId;
        const targetTitulo = titulo !== undefined ? titulo.trim() : conteudoExistente.titulo;

        if (materiaId !== undefined && !(await materiaExiste(targetMateriaId))) {
            return res.status(404).json({
                erro: "A matéria informada não existe."
            });
        }

        if (ordem !== undefined && isNaN(Number(ordem))) {
            return res.status(400).json({
                erro: "A ordem deve ser um número válido."
            });
        }

        if (await conteudoDuplicadoNaMateria(targetTitulo, targetMateriaId, id)) {
            return res.status(400).json({
                erro: "Já existe um conteúdo com este título nesta matéria."
            });
        }

        const dadosAtualizacao = {};
        if (titulo !== undefined) dadosAtualizacao.titulo = titulo.trim();
        if (resumo !== undefined) dadosAtualizacao.resumo = resumo.trim();
        if (ordem !== undefined) dadosAtualizacao.ordem = Number(ordem);
        if (materiaId !== undefined) dadosAtualizacao.materiaId = Number(materiaId);

        const conteudo = await prisma.conteudo.update({
            where: { id: Number(id) },
            data: dadosAtualizacao
        });

        return res.status(200).json({
            mensagem: "Conteúdo atualizado com sucesso!",
            conteudo
        });
    } catch (erro) {
        console.error("ERRO AO ATUALIZAR CONTEÚDO:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao atualizar conteúdo."
        });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return res.status(400).json({
                erro: "ID de conteúdo inválido."
            });
        }

        const conteudoExistente = await prisma.conteudo.findUnique({
            where: { id: Number(id) }
        });

        if (!conteudoExistente) {
            return res.status(404).json({
                erro: "Conteúdo não encontrado."
            });
        }

        if (await possuiQuestoesOuFlashcards(id)) {
            return res.status(400).json({
                erro: "Não é possível excluir o conteúdo pois existem questões ou flashcards vinculados a ele."
            });
        }

        const conteudo = await prisma.conteudo.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({
            mensagem: "Conteúdo removido com sucesso!",
            conteudo
        });
    } catch (erro) {
        console.error("ERRO AO EXCLUIR CONTEÚDO:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao excluir conteúdo."
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