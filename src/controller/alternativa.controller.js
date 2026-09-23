const { questaoExiste, alternativaExiste, possuiRespostas,ordemDuplicadaNaQuestao,questaoJaTemCorreta} = require("../services/alternativa.service");
const prisma = require("../data/prisma");

const adicionar = async (req, res) => {
    try {
        const { texto, correta, ordem, questaoId } = req.body || {};

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

        if (!ordem || typeof ordem !== "string" || ordem.trim() === "") {
            return res.status(400).json({
                erro: "A ordem da alternativa é obrigatória e deve ser um texto (ex: 'A', 'B', 'C')."
            });
        }

        if (!questaoId || isNaN(Number(questaoId))) {
            return res.status(400).json({
                erro: "O ID da questão (questaoId) é obrigatório e deve ser um número válido."
            });
        }

        if (!(await questaoExiste(questaoId))) {
            return res.status(404).json({
                erro: "A questão informada não existe."
            });
        }

        const ordemFormatada = ordem.trim().toUpperCase();

        if (await ordemDuplicadaNaQuestao(ordemFormatada, questaoId)) {
            return res.status(400).json({
                erro: `Já existe uma alternativa marcada como '${ordemFormatada}' nesta questão.`
            });
        }

        if (correta && (await questaoJaTemCorreta(questaoId))) {
            return res.status(400).json({
                erro: "Esta questão já possui uma alternativa marcada como correta."
            });
        }

        const alternativa = await prisma.alternativa.create({
            data: {
                texto: texto.trim(),
                correta,
                ordem: ordemFormatada,
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
            },
            orderBy: {
                ordem: "asc"
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
        const { texto, correta, ordem, questaoId } = req.body || {};

        if (isNaN(Number(id))) {
            return res.status(400).json({
                erro: "O ID da alternativa deve ser um número válido."
            });
        }

        const alternativaExistente = await prisma.alternativa.findUnique({
            where: { id: Number(id) }
        });

        if (!alternativaExistente) {
            return res.status(404).json({
                erro: "Alternativa não encontrada."
            });
        }

        const targetQuestaoId = questaoId !== undefined ? Number(questaoId) : alternativaExistente.questaoId;

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

        if (ordem !== undefined) {
            if (typeof ordem !== "string" || ordem.trim() === "") {
                return res.status(400).json({
                    erro: "A ordem da alternativa deve ser um texto válido (ex: 'A', 'B')."
                });
            }

            const ordemFormatada = ordem.trim().toUpperCase();

            if (await ordemDuplicadaNaQuestao(ordemFormatada, targetQuestaoId, id)) {
                return res.status(400).json({
                    erro: `Já existe uma alternativa marcada como '${ordemFormatada}' nesta questão.`
                });
            }

            dadosAtualizacao.ordem = ordemFormatada;
        }

        if (correta !== undefined) {
            if (typeof correta !== "boolean") {
                return res.status(400).json({
                    erro: "O campo 'correta' deve ser um valor booleano (true ou false)."
                });
            }

            if (correta && (await questaoJaTemCorreta(targetQuestaoId, id))) {
                return res.status(400).json({
                    erro: "Esta questão já possui outra alternativa marcada como correta."
                });
            }

            dadosAtualizacao.correta = correta;
        }

        if (questaoId !== undefined) {
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

        if (isNaN(Number(id))) {
            return res.status(400).json({
                erro: "O ID da alternativa deve ser um número válido."
            });
        }

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