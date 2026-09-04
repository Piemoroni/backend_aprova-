const {questaoExiste, alternativaExiste, possuiRespostas} = require("../services/alternativa.service");
const prisma = require("../data/prisma");

const adicionar = async (req, res) => {
    try {
        const { texto, correta, questaoId } = req.body || {};

        if (!texto || typeof texto !== "string" || texto.trim() === "") {
            return res.status(400).json({
                erro: "O texto da alternativa é obrigatório."
            });
        }

        if (typeof correta !== "boolean") {
            return res.status(400).json({
                erro: "O campo 'correta' é obrigatório e deve ser um valor booleano (true ou false)."
            });
        }

        if (!questaoId || isNaN(Number(questaoId))) {
            return res.status(400).json({
                erro: "O ID da questão (questaoId) é obrigatório e deve ser um número."
            });
        }

        if (!(await questaoExiste(questaoId))) {
            return res.status(404).json({
                erro: "A questão informada não existe."
            });
        }

        const alternativa = await prisma.alternativa.create({
            data: {
                texto: texto.trim(),
                correta,
                questaoId: Number(questaoId)
            }
        });

        return res.status(201).json({
            mensagem: "Alternativa cadastrada com sucesso!",
            alternativa
        });
    } catch (erro) {
        console.error("ERRO DETALHADO AO CADASTRAR ALTERNATIVA:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao cadastrar alternativa."
        });
    }
};

const listarPorQuestao = async (req, res) => {
    try {
        const { questaoId } = req.params;

        if (isNaN(Number(questaoId))) {
            return res.status(400).json({
                erro: "O ID da questão deve ser um número válido."
            });
        }

        if (!(await questaoExiste(questaoId))) {
            return res.status(404).json({
                erro: "A questão informada não existe."
            });
        }

        const alternativas = await prisma.alternativa.findMany({
            where: {
                questaoId: Number(questaoId)
            }
        });

        return res.status(200).json(alternativas);
    } catch (erro) {
        console.error("ERRO DETALHADO AO LISTAR ALTERNATIVAS:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao listar alternativas."
        });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { texto, correta, questaoId } = req.body || {};

        if (!(await alternativaExiste(id))) {
            return res.status(404).json({
                erro: "Alternativa não encontrada."
            });
        }

        const dadosAtualizacao = {};

        if (texto !== undefined) {
            if (typeof texto !== "string" || texto.trim() === "") {
                return res.status(400).json({
                    erro: "O texto da alternativa não pode ser vazio."
                });
            }
            dadosAtualizacao.texto = texto.trim();
        }

        if (correta !== undefined) {
            if (typeof correta !== "boolean") {
                return res.status(400).json({
                    erro: "O campo 'correta' deve ser um valor booleano (true ou false)."
                });
            }
            dadosAtualizacao.correta = correta;
        }

        if (questaoId !== undefined) {
            if (isNaN(Number(questaoId))) {
                return res.status(400).json({
                    erro: "O ID da questão deve ser um número válido."
                });
            }

            if (!(await questaoExiste(questaoId))) {
                return res.status(404).json({
                    erro: "A questão informada não existe."
                });
            }
            dadosAtualizacao.questaoId = Number(questaoId);
        }

        const alternativa = await prisma.alternativa.update({
            where: {
                id: Number(id)
            },
            data: dadosAtualizacao
        });

        return res.status(200).json({
            mensagem: "Alternativa atualizada com sucesso!",
            alternativa
        });
    } catch (erro) {
        console.error("ERRO DETALHADO AO ATUALIZAR ALTERNATIVA:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao atualizar alternativa."
        });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        if (!(await alternativaExiste(id))) {
            return res.status(404).json({
                erro: "Alternativa não encontrada."
            });
        }

        if (await possuiRespostas(id)) {
            return res.status(400).json({
                erro: "Não é possível excluir a alternativa pois existem respostas de simulados vinculadas a ela."
            });
        }

        const alternativa = await prisma.alternativa.delete({
            where: {
                id: Number(id)
            }
        });

        return res.status(200).json({
            mensagem: "Alternativa removida com sucesso!",
            alternativa
        });
    } catch (erro) {
        console.error("ERRO DETALHADO AO EXCLUIR ALTERNATIVA:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao excluir alternativa."
        });
    }
};

module.exports = {
    adicionar,
    listarPorQuestao,
    atualizar,
    excluir
};