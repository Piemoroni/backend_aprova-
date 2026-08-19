const { eventoDuplicado } = require("../services/agenda.service");
const prisma = require("../data/prisma");

const adicionar = async (req, res) => {

    const { usuarioId, dataEvento, horaEvento } = req.body;

    if (await eventoDuplicado(usuarioId, dataEvento, horaEvento)) {
        return res.status(400).json({
            erro: "Você já possui um evento cadastrado neste horário."
        });
    }

    const evento = await prisma.agenda.create({
        data: req.body
    });

    res.status(201).json({
        mensagem: "Evento adicionado à agenda com sucesso!",
        evento
    });
};

const listar = async (req, res) => {
    const eventos = await prisma.agenda.findMany({
        include: {
            usuario: {
                select: {
                    id: true,
                    nome: true,
                    email: true
                }
            }
        }
    });

    res.status(200).json(eventos);
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const evento = await prisma.agenda.findUnique({
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
            }
        }
    });

    res.status(200).json(evento);
};

const atualizar = async (req, res) => {
    const { id } = req.params;

    const evento = await prisma.agenda.update({
        where: {
            id: Number(id)
        },
        data: req.body
    });

    res.status(200).json(evento);
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const evento = await prisma.agenda.delete({
        where: {
            id: Number(id)
        }
    });

    res.status(200).json({
        mensagem: "Evento removido da agenda com sucesso!",
        evento
    });
};

module.exports = {
    adicionar,
    listar,
    buscar,
    atualizar,
    excluir
};