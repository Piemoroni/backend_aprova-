const {
    usuarioExiste,
    flashcardExiste,
    validarNivelDominio,
    buscarPorUsuario,
    buscarPorId
} = require("../services/flashcardUsuario.service");
const prisma = require("../data/prisma");

const adicionar = async (req, res) => {
    try {
        const { usuarioId, flashcardId, dataRevisao, nivelDominio, nivelFacilidade } = req.body || {};

        if (!usuarioId || isNaN(Number(usuarioId))) {
            return res.status(400).json({
                erro: "ID de usuário inválido ou não fornecido."
            });
        }

        if (!flashcardId || isNaN(Number(flashcardId))) {
            return res.status(400).json({
                erro: "ID de flashcard inválido ou não fornecido."
            });
        }

        const nivel = nivelDominio !== undefined ? nivelDominio : nivelFacilidade;

        if (!validarNivelDominio(nivel)) {
            return res.status(400).json({
                erro: "O nível de domínio/facilidade é obrigatório e deve ser um número inteiro de 1 a 5."
            });
        }
        
        let dataFinal = new Date();
        if (dataRevisao) {
            dataFinal = new Date(dataRevisao);
            if (isNaN(dataFinal.getTime())) {
                return res.status(400).json({
                    erro: "Formato de dataRevisao inválido."
                });
            }
        }

        if (!(await usuarioExiste(usuarioId))) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        if (!(await flashcardExiste(flashcardId))) {
            return res.status(404).json({
                erro: "Flashcard não encontrado."
            });
        }

        const registro = await prisma.flashcardUsuario.create({
            data: {
                usuarioId: Number(usuarioId),
                flashcardId: Number(flashcardId),
                nivelDominio: Number(nivel),
                dataRevisao: dataFinal
            }
        });

        return res.status(201).json({
            mensagem: "Revisão de flashcard registrada com sucesso!",
            registro
        });
    } catch (erro) {
        console.error("ERRO AO ADICIONAR REVISÃO:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao registrar revisão."
        });
    }
};

const listar = async (req, res) => {
    try {
        const { usuarioId } = req.query;

        if (usuarioId) {
            if (isNaN(Number(usuarioId))) {
                return res.status(400).json({
                    erro: "ID de usuário inválido."
                });
            }

            if (!(await usuarioExiste(usuarioId))) {
                return res.status(404).json({
                    erro: "Usuário não encontrado."
                });
            }

            const revisoes = await buscarPorUsuario(usuarioId);
            return res.status(200).json(revisoes);
        }

        const revisoes = await prisma.flashcardUsuario.findMany({
            include: {
                usuario: {
                    select: { id: true, nome: true, email: true }
                },
                flashcard: true
            }
        });

        return res.status(200).json(revisoes);
    } catch (erro) {
        console.error("ERRO AO LISTAR REVISÕES:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao listar revisões."
        });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return res.status(400).json({
                erro: "ID de revisão inválido."
            });
        }

        const registro = await buscarPorId(id);

        if (!registro) {
            return res.status(404).json({
                erro: "Registro de revisão não encontrado."
            });
        }

        return res.status(200).json(registro);
    } catch (erro) {
        console.error("ERRO AO BUSCAR REVISÃO:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao buscar revisão."
        });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { dataRevisao, nivelDominio, nivelFacilidade } = req.body || {};

        if (isNaN(Number(id))) {
            return res.status(400).json({
                erro: "ID de revisão inválido."
            });
        }

        const registroExiste = await prisma.flashcardUsuario.findUnique({
            where: { id: Number(id) }
        });

        if (!registroExiste) {
            return res.status(404).json({
                erro: "Registro de revisão não encontrado."
            });
        }

        const nivel = nivelDominio !== undefined ? nivelDominio : nivelFacilidade;

        if (nivel !== undefined && !validarNivelDominio(nivel)) {
            return res.status(400).json({
                erro: "O nível de domínio/facilidade deve ser um número inteiro de 1 a 5."
            });
        }

        const dadosAtualizacao = {};
        if (nivel !== undefined) dadosAtualizacao.nivelDominio = Number(nivel);

        if (dataRevisao) {
            const novaData = new Date(dataRevisao);
            if (isNaN(novaData.getTime())) {
                return res.status(400).json({
                    erro: "Formato de dataRevisao inválido."
                });
            }
            dadosAtualizacao.dataRevisao = novaData;
        }

        const registro = await prisma.flashcardUsuario.update({
            where: { id: Number(id) },
            data: dadosAtualizacao
        });

        return res.status(200).json({
            mensagem: "Revisão atualizada com sucesso!",
            registro
        });
    } catch (erro) {
        console.error("ERRO AO ATUALIZAR REVISÃO:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao atualizar revisão."
        });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return res.status(400).json({
                erro: "ID de revisão inválido."
            });
        }

        const registroExiste = await prisma.flashcardUsuario.findUnique({
            where: { id: Number(id) }
        });

        if (!registroExiste) {
            return res.status(404).json({
                erro: "Registro de revisão não encontrado."
            });
        }

        const registro = await prisma.flashcardUsuario.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({
            mensagem: "Registro de revisão removido com sucesso!",
            registro
        });
    } catch (erro) {
        console.error("ERRO AO EXCLUIR REVISÃO:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao excluir revisão."
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