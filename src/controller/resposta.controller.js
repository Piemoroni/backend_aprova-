const {
    questaoExiste,
    alternativaExiste,
    simuladoExiste,
    respostaDuplicada,
    verificarAlternativaCorreta
} = require("../services/resposta.service");
const prisma = require("../data/prisma");

const adicionar = async (req, res) => {
    try {
        const { simuladoId, questaoId, alternativaId } = req.body;

        if (!simuladoId || !questaoId || !alternativaId) {
            return res.status(400).json({
                erro: "Os campos simuladoId, questaoId e alternativaId são obrigatórios."
            });
        }

        if (!(await simuladoExiste(simuladoId))) {
            return res.status(404).json({
                erro: "Simulado não encontrado."
            });
        }

        if (!(await questaoExiste(questaoId))) {
            return res.status(404).json({
                erro: "Questão não encontrada."
            });
        }

        if (!(await alternativaExiste(alternativaId))) {
            return res.status(404).json({
                erro: "Alternativa não encontrada."
            });
        }

        if (await respostaDuplicada(simuladoId, questaoId)) {
            return res.status(400).json({
                erro: "Esta questão já foi respondida para este simulado."
            });
        }

        const correta = await verificarAlternativaCorreta(alternativaId);

        const resposta = await prisma.resposta.create({
            data: {
                simuladoId: Number(simuladoId),
                questaoId: Number(questaoId),
                alternativaId: Number(alternativaId),
                correta
            }
        });

        return res.status(201).json({
            mensagem: "Resposta registrada com sucesso!",
            resposta
        });
    } catch (erro) {
        console.error("Erro ao adicionar resposta:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao registrar resposta."
        });
    }
};

const listar = async (req, res) => {
    try {
        const respostas = await prisma.resposta.findMany({
            include: {
                simulado: true,
                questao: true,
                alternativa: true
            }
        });

        return res.status(200).json(respostas);
    } catch (erro) {
        console.error("Erro ao listar respostas:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao listar respostas."
        });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;

        const resposta = await prisma.resposta.findUnique({
            where: {
                id: Number(id)
            },
            include: {
                simulado: true,
                questao: true,
                alternativa: true
            }
        });

        if (!resposta) {
            return res.status(404).json({
                erro: "Resposta não encontrada."
            });
        }

        return res.status(200).json(resposta);
    } catch (erro) {
        console.error("Erro ao buscar resposta:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao buscar resposta."
        });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { alternativaId } = req.body;

        const respostaExiste = await prisma.resposta.findUnique({
            where: { id: Number(id) }
        });

        if (!respostaExiste) {
            return res.status(404).json({
                erro: "Resposta não encontrada."
            });
        }

        if (!alternativaId) {
            return res.status(400).json({
                erro: "O campo alternativaId é obrigatório para atualização."
            });
        }

        if (!(await alternativaExiste(alternativaId))) {
            return res.status(404).json({
                erro: "Alternativa não encontrada."
            });
        }

        const correta = await verificarAlternativaCorreta(alternativaId);

        const resposta = await prisma.resposta.update({
            where: { id: Number(id) },
            data: {
                alternativaId: Number(alternativaId),
                correta
            }
        });

        return res.status(200).json({
            mensagem: "Resposta atualizada com sucesso!",
            resposta
        });
    } catch (erro) {
        console.error("Erro ao atualizar resposta:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao atualizar resposta."
        });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        const respostaExiste = await prisma.resposta.findUnique({
            where: { id: Number(id) }
        });

        if (!respostaExiste) {
            return res.status(404).json({
                erro: "Resposta não encontrada."
            });
        }

        const resposta = await prisma.resposta.delete({
            where: {
                id: Number(id)
            }
        });

        return res.status(200).json({
            mensagem: "Resposta removida com sucesso!",
            resposta
        });
    } catch (erro) {
        console.error("Erro ao excluir resposta:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao excluir resposta."
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