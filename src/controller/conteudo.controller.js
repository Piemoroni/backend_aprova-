const { materiaExiste, conteudoExiste, conteudoDuplicadoNaMateria } = require("../services/conteudo.service");
const prisma = require("../data/prisma");

const adicionar = async (req, res) => {
    try {
        const { titulo, resumo, ordem, materiaId } = req.body || {};

        if (!titulo || typeof titulo !== "string" || titulo.trim() === "") {
            return res.status(400).json({
                erro: "O título do conteúdo é obrigatório."
            });
        }

        if (!resumo || typeof resumo !== "string" || resumo.trim() === "") {
            return res.status(400).json({
                erro: "O resumo do conteúdo é obrigatório."
            });
        }

        if (ordem === undefined || ordem === null || isNaN(Number(ordem))) {
            return res.status(400).json({
                erro: "A ordem do conteúdo deve ser um número válido."
            });
        }

        if (!materiaId || isNaN(Number(materiaId))) {
            return res.status(400).json({
                erro: "O ID da matéria (materiaId) é obrigatório e deve ser um número."
            });
        }

        if (!(await materiaExiste(materiaId))) {
            return res.status(404).json({
                erro: "A matéria informada não existe."
            });
        }

        if (await conteudoDuplicadoNaMateria(titulo, materiaId)) {
            return res.status(400).json({
                erro: "Já existe um conteúdo com este título nesta matéria."
            });
        }

        const conteudo = await prisma.conteudo.create({
            data: {
                titulo: titulo.trim(),
                resumo: resumo.trim(),
                ordem: Number(ordem),
                materiaId: Number(materiaId)
            }
        });

        return res.status(201).json({
            mensagem: "Conteúdo cadastrado com sucesso!",
            conteudo
        });
    } catch (erro) {
        console.error("ERRO DETALHADO AO CADASTRAR CONTEÚDO:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao cadastrar conteúdo."
        });
    }
};

module.exports = {
    adicionar
};