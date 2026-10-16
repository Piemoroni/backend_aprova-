const { usuarioExiste, validarTempo, validarNota, possuiRespostas, simuladoDuplicado } = require("../services/simulado.service");
const prisma = require("../data/prisma");

const adicionar = async (req, res) => {
    try {
        const { usuarioId, comTempo, tempoTotalMin, notaObjetiva, dataRealizacao } = req.body;

        if (!usuarioId || isNaN(Number(usuarioId))) {
            return res.status(400).json({
                erro: "O ID do usuário (usuarioId) é obrigatório."
            });
        }

        if (!(await usuarioExiste(usuarioId))) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        if (!validarTempo(comTempo, tempoTotalMin)) {
            return res.status(400).json({
                erro: "Tempo total em minutos é obrigatório quando o cronômetro está ativado."
            });
        }

        if (!validarNota(notaObjetiva)) {
            return res.status(400).json({
                erro: "A nota do simulado deve estar entre 0 e 1000."
            });
        }

        if (await simuladoDuplicado(usuarioId, dataRealizacao)) {
            return res.status(400).json({
                erro: "Você já possui um simulado realizado nesta data."
            });
        }

        const simulado = await prisma.simulado.create({
            data: {
                ...req.body,
                usuarioId: Number(usuarioId)
            }
        });

        return res.status(201).json({
            mensagem: "Simulado cadastrado com sucesso!",
            simulado
        });
    } catch (erro) {
        console.error("Erro ao adicionar simulado:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao cadastrar simulado."
        });
    }
};

const listar = async (req, res) => {
    try {
        const simulados = await prisma.simulado.findMany({
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                respostas: true
            }
        });

        return res.status(200).json(simulados);
    } catch (erro) {
        console.error("Erro ao listar simulados:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao listar simulados."
        });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return res.status(400).json({ erro: "ID de simulado inválido." });
        }

        const simulado = await prisma.simulado.findUnique({
            where: { id: Number(id) },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                respostas: true
            }
        });

        if (!simulado) {
            return res.status(404).json({
                erro: "Simulado não encontrado."
            });
        }

        return res.status(200).json(simulado);
    } catch (erro) {
        console.error("Erro ao buscar simulado:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao buscar simulado."
        });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return res.status(400).json({ erro: "ID de simulado inválido." });
        }

        const simuladoExiste = await prisma.simulado.findUnique({
            where: { id: Number(id) }
        });

        if (!simuladoExiste) {
            return res.status(404).json({
                erro: "Simulado não encontrado."
            });
        }

        const simulado = await prisma.simulado.update({
            where: { id: Number(id) },
            data: req.body
        });

        return res.status(200).json({
            mensagem: "Simulado atualizado com sucesso!",
            simulado
        });
    } catch (erro) {
        console.error("Erro ao atualizar simulado:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao atualizar simulado."
        });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return res.status(400).json({ erro: "ID de simulado inválido." });
        }

        const simuladoExiste = await prisma.simulado.findUnique({
            where: { id: Number(id) }
        });

        if (!simuladoExiste) {
            return res.status(404).json({
                erro: "Simulado não encontrado."
            });
        }

        if (await possuiRespostas(id)) {
            return res.status(400).json({
                erro: "Não é possível excluir o simulado pois existem respostas vinculadas."
            });
        }

        const simulado = await prisma.simulado.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({
            mensagem: "Simulado removido com sucesso!",
            simulado
        });
    } catch (erro) {
        console.error("Erro ao excluir simulado:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao excluir simulado."
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