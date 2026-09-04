const { materiaDuplicada, materiaExiste, possuiConteudos } = require("../services/materia.service");
const prisma = require("../data/prisma");

const adicionar = async (req, res) => {
    try {
        const { nome, descricao } = req.body || {};

        if (!nome || typeof nome !== "string" || nome.trim() === "") {
            return res.status(400).json({
                erro: "O nome da matéria é obrigatório."
            });
        }

        if (!descricao || typeof descricao !== "string" || descricao.trim() === "") {
            return res.status(400).json({
                erro: "A descrição da matéria é obrigatória."
            });
        }

        if (await materiaDuplicada(nome)) {
            return res.status(400).json({
                erro: "Esta matéria já está cadastrada."
            });
        }

        const materia = await prisma.materia.create({
            data: {
                nome: nome.trim(),
                descricao: descricao.trim()
            }
        });

        return res.status(201).json({
            mensagem: "Matéria cadastrada com sucesso!",
            materia
        });
    } catch (erro) {
        console.error("ERRO AO CADASTRAR MATÉRIA:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao cadastrar matéria."
        });
    }
};

const listar = async (req, res) => {
    try {
        const materias = await prisma.materia.findMany();
        return res.status(200).json(materias);
    } catch (erro) {
        console.error("ERRO AO LISTAR MATÉRIAS:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao listar matérias."
        });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;

        const materia = await prisma.materia.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!materia) {
            return res.status(404).json({
                erro: "Matéria não encontrada."
            });
        }

        return res.status(200).json(materia);
    } catch (erro) {
        console.error("ERRO AO BUSCAR MATÉRIA:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao buscar matéria."
        });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao } = req.body || {};

        if (!(await materiaExiste(id))) {
            return res.status(404).json({
                erro: "Matéria não encontrada."
            });
        }

        const dadosAtualizacao = {};

        if (nome !== undefined) {
            if (typeof nome !== "string" || nome.trim() === "") {
                return res.status(400).json({
                    erro: "O nome da matéria não pode ser vazio."
                });
            }

            if (await materiaDuplicada(nome, id)) {
                return res.status(400).json({
                    erro: "Este nome de matéria já está em uso."
                });
            }

            dadosAtualizacao.nome = nome.trim();
        }

        if (descricao !== undefined) {
            if (typeof descricao !== "string" || descricao.trim() === "") {
                return res.status(400).json({
                    erro: "A descrição da matéria não pode ser vazia."
                });
            }

            dadosAtualizacao.descricao = descricao.trim();
        }

        const materia = await prisma.materia.update({
            where: {
                id: Number(id)
            },
            data: dadosAtualizacao
        });

        return res.status(200).json({
            mensagem: "Matéria atualizada com sucesso!",
            materia
        });
    } catch (erro) {
        console.error("ERRO AO ATUALIZAR MATÉRIA:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao atualizar matéria."
        });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        if (!(await materiaExiste(id))) {
            return res.status(404).json({
                erro: "Matéria não encontrada."
            });
        }

        if (await possuiConteudos(id)) {
            return res.status(400).json({
                erro: "Não é possível excluir a matéria pois existem conteúdos vinculados."
            });
        }

        const materia = await prisma.materia.delete({
            where: {
                id: Number(id)
            }
        });

        return res.status(200).json({
            mensagem: "Matéria removida com sucesso!",
            materia
        });
    } catch (erro) {
        console.error("ERRO AO EXCLUIR MATÉRIA:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao excluir matéria."
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