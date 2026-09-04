const { conteudoExiste, questaoExiste, possuiAlternativas, possuiRespostas} = require("../services/questao.service");
const prisma = require("../data/prisma");

const adicionar = async (req, res) => {
    try {
        const { enunciado, dificuldade, area, ano, conteudoId } = req.body || {};

        if (!enunciado || typeof enunciado !== "string" || enunciado.trim() === "") {
            return res.status(400).json({
                erro: "O enunciado da questão é obrigatório."
            });
        }

        if (!dificuldade || typeof dificuldade !== "string" || dificuldade.trim() === "") {
            return res.status(400).json({
                erro: "A dificuldade da questão é obrigatória."
            });
        }

        if (!area || typeof area !== "string" || area.trim() === "") {
            return res.status(400).json({
                erro: "A área de conhecimento é obrigatória."
            });
        }

        if (!ano || typeof ano !== "string" || ano.trim() === "") {
            return res.status(400).json({
                erro: "O ano da questão é obrigatório."
            });
        }

        if (!conteudoId || isNaN(Number(conteudoId))) {
            return res.status(400).json({
                erro: "O ID do conteúdo (conteudoId) é obrigatório e deve ser um número."
            });
        }

        if (!(await conteudoExiste(conteudoId))) {
            return res.status(404).json({
                erro: "O conteúdo informado não existe."
            });
        }

        const questao = await prisma.questao.create({
            data: {
                enunciado: enunciado.trim(),
                dificuldade: dificuldade.trim(),
                area: area.trim(),
                ano: ano.trim(),
                conteudoId: Number(conteudoId)
            }
        });

        return res.status(201).json({
            mensagem: "Questão cadastrada com sucesso!",
            questao
        });
    } catch (erro) {
        console.error("ERRO DETALHADO AO CADASTRAR QUESTÃO:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao cadastrar questão."
        });
    }
};

const listar = async (req, res) => {
    try {
        const questoes = await prisma.questao.findMany({
            include: {
                conteudo: {
                    select: {
                        id: true,
                        titulo: true
                    }
                }
            }
        });
        return res.status(200).json(questoes);
    } catch (erro) {
        console.error("ERRO DETALHADO AO LISTAR QUESTÕES:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao listar questões."
        });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;

        const questao = await prisma.questao.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                alternativas: true,
                conteudo: true
            }
        });

        if (!questao) {
            return res.status(404).json({
                erro: "Questão não encontrada."
            });
        }

        return res.status(200).json(questao);
    } catch (erro) {
        console.error("ERRO DETALHADO AO BUSCAR QUESTÃO:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao buscar questão."
        });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { enunciado, dificuldade, area, ano, conteudoId } = req.body || {};

        if (!(await questaoExiste(id))) {
            return res.status(404).json({
                erro: "Questão não encontrada."
            });
        }

        const dadosAtualizacao = {};

        if (enunciado !== undefined) {
            if (typeof enunciado !== "string" || enunciado.trim() === "") {
                return res.status(400).json({
                    erro: "O enunciado da questão não pode ser vazio."
                });
            }
            dadosAtualizacao.enunciado = enunciado.trim();
        }

        if (dificuldade !== undefined) {
            if (typeof dificuldade !== "string" || dificuldade.trim() === "") {
                return res.status(400).json({
                    erro: "A dificuldade não pode ser vazia."
                });
            }
            dadosAtualizacao.dificuldade = dificuldade.trim();
        }

        if (area !== undefined) {
            if (typeof area !== "string" || area.trim() === "") {
                return res.status(400).json({
                    erro: "A área não pode ser vazia."
                });
            }
            dadosAtualizacao.area = area.trim();
        }

        if (ano !== undefined) {
            if (typeof ano !== "string" || ano.trim() === "") {
                return res.status(400).json({
                    erro: "O ano não pode ser vazio."
                });
            }
            dadosAtualizacao.ano = ano.trim();
        }

        if (conteudoId !== undefined) {
            if (isNaN(Number(conteudoId))) {
                return res.status(400).json({
                    erro: "O ID do conteúdo deve ser um número válido."
                });
            }

            if (!(await conteudoExiste(conteudoId))) {
                return res.status(404).json({
                    erro: "O conteúdo informado não existe."
                });
            }
            dadosAtualizacao.conteudoId = Number(conteudoId);
        }

        const questao = await prisma.questao.update({
            where: {
                id: Number(id)
            },
            data: dadosAtualizacao
        });

        return res.status(200).json({
            mensagem: "Questão atualizada com sucesso!",
            questao
        });
    } catch (erro) {
        console.error("ERRO DETALHADO AO ATUALIZAR QUESTÃO:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao atualizar questão."
        });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        if (!(await questaoExiste(id))) {
            return res.status(404).json({
                erro: "Questão não encontrada."
            });
        }

        if (await possuiAlternativas(id)) {
            return res.status(400).json({
                erro: "Não é possível excluir a questão pois existem alternativas vinculadas."
            });
        }

        if (await possuiRespostas(id)) {
            return res.status(400).json({
                erro: "Não é possível excluir a questão pois existem respostas de simulados vinculadas."
            });
        }

        const questao = await prisma.questao.delete({
            where: {
                id: Number(id)
            }
        });

        return res.status(200).json({
            mensagem: "Questão removida com sucesso!",
            questao
        });
    } catch (erro) {
        console.error("ERRO DETALHADO AO EXCLUIR QUESTÃO:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao excluir questão."
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