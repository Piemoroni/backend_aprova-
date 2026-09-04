const {
    usuarioExiste,
    flashcardExiste,
    buscarRegistro
} = require("../services/flashcardUsuario.service");
const prisma = require("../data/prisma");

const registrarEstudo = async (req, res) => {
    try {
        const { usuarioId, flashcardId, facilidade, proximaRevisao } = req.body || {};

        if (!usuarioId || isNaN(Number(usuarioId))) {
            return res.status(400).json({
                erro: "O ID do usuário (usuarioId) é obrigatório e deve ser um número."
            });
        }

        if (!flashcardId || isNaN(Number(flashcardId))) {
            return res.status(400).json({
                erro: "O ID do flashcard (flashcardId) é obrigatório e deve ser um número."
            });
        }

        if (facilidade === undefined || facilidade === null || isNaN(Number(facilidade))) {
            return res.status(400).json({
                erro: "O nível de facilidade é obrigatório e deve ser um número."
            });
        }

        if (!(await usuarioExiste(usuarioId))) {
            return res.status(404).json({
                erro: "O usuário informado não existe."
            });
        }

        if (!(await flashcardExiste(flashcardId))) {
            return res.status(404).json({
                erro: "O flashcard informado não existe."
            });
        }

        const dataRevisao = proximaRevisao ? new Date(proximaRevisao) : new Date();
        if (isNaN(dataRevisao.getTime())) {
            return res.status(400).json({
                erro: "A data da próxima revisão (proximaRevisao) é inválida."
            });
        }

        const registroExistente = await buscarRegistro(usuarioId, flashcardId);

        let resultado;
        if (registroExistente) {
            resultado = await prisma.flashcardUsuario.update({
                where: { id: registroExistente.id },
                data: {
                    facilidade: Number(facilidade),
                    proximaRevisao: dataRevisao,
                    ultimaRevisao: new Date()
                }
            });
        } else {
            resultado = await prisma.flashcardUsuario.create({
                data: {
                    usuarioId: Number(usuarioId),
                    flashcardId: Number(flashcardId),
                    facilidade: Number(facilidade),
                    proximaRevisao: dataRevisao,
                    ultimaRevisao: new Date()
                }
            });
        }

        return res.status(200).json({
            mensagem: "Estudo do flashcard registrado com sucesso!",
            registro: resultado
        });
    } catch (erro) {
        console.error("ERRO DETALHADO AO REGISTRAR ESTUDO DE FLASHCARD:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao registrar estudo do flashcard."
        });
    }
};

const listarPorUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        if (isNaN(Number(usuarioId))) {
            return res.status(400).json({
                erro: "O ID do usuário deve ser um número válido."
            });
        }

        if (!(await usuarioExiste(usuarioId))) {
            return res.status(404).json({
                erro: "O usuário informado não existe."
            });
        }

        const revisoes = await prisma.flashcardUsuario.findMany({
            where: {
                usuarioId: Number(usuarioId)
            },
            include: {
                flashcard: true
            }
        });

        return res.status(200).json(revisoes);
    } catch (erro) {
        console.error("ERRO DETALHADO AO LISTAR REVISÕES DO USUÁRIO:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao listar revisões."
        });
    }
};

module.exports = {
    registrarEstudo,
    listarPorUsuario
};