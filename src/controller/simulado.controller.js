const { usuarioExiste, validarTempo, validarNota, possuiRespostas, simuladoDuplicado } = require("../services/simulado.service");
const prisma = require("../data/prisma");

const adicionar = async (req, res) => {
    const { usuarioId, comTempo, tempoTotalMin, notaObjetiva, dataRealizacao } = req.body;

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
        data: req.body
    });

    res.status(201).json({
        mensagem: "Simulado cadastrado com sucesso!",
        simulado
    });
};

const listar = async (req, res) => {
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

    res.status(200).json(simulados);
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const simulado = await prisma.simulado.findUnique({
        where: {
            id: Number(id)
        },
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

    res.status(200).json(simulado);
};

const atualizar = async (req, res) => {
    const { id } = req.params;

    const simulado = await prisma.simulado.update({
        where: {
            id: Number(id)
        },
        data: req.body
    });

    res.status(200).json(simulado);
};

const excluir = async (req, res) => {
    const { id } = req.params;

    if (await possuiRespostas(id)) {
        return res.status(400).json({
            erro: "Não é possível excluir o simulado pois existem respostas vinculadas."
        });
    }

    const simulado = await prisma.simulado.delete({
        where: {
            id: Number(id)
        }
    });

    res.status(200).json({
        mensagem: "Simulado removido com sucesso!",
        simulado
    });
};

module.exports = {
    adicionar,
    listar,
    buscar,
    atualizar,
    excluir
};