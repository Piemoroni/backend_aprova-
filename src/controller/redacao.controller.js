const prisma = require("../data/prisma");
const {usuarioExiste, redacaoDuplicada, validarTexto, validarNota, possuiCorrecao}= require("../services/redacao.service");
// Cadastrar redação
const adicionar = async (req, res) => {

    const { usuarioId, tema, texto } = req.body;


    const usuario = await redacaoService.usuarioExiste(usuarioId);

    if (!usuario) {
        return res.status(400).json({
            mensagem: "Usuário não encontrado."
        });
    }


    const textoValido = redacaoService.validarTexto(texto);

    if (!textoValido) {
        return res.status(400).json({
            mensagem: "O texto da redação não pode estar vazio."
        });
    }


    const duplicada = await redacaoService.redacaoDuplicada(
        usuarioId,
        tema
    );


    if (duplicada) {
        return res.status(400).json({
            mensagem: "Já existe uma redação com esse tema cadastrada."
        });
    }


    const redacao = await prisma.redacao.create({
        data: req.body,
        include: {
            usuario: true
        }
    });


    res.status(201).json({
        mensagem: "Redação enviada com sucesso!",
        redacao
    });

};



// Listar redações
const listar = async (req, res) => {

    const redacoes = await prisma.redacao.findMany({
        include: {
            usuario: true
        }
    });


    res.status(200).json(redacoes);

};



// Buscar redação
const buscar = async (req, res) => {

    const { id } = req.params;


    const redacao = await prisma.redacao.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            usuario: true
        }
    });


    res.status(200).json(redacao);

};



// Atualizar redação
const atualizar = async (req, res) => {

    const { id } = req.params;
    const { nota } = req.body;


    const notaValida = redacaoService.validarNota(nota);


    if (!notaValida) {
        return res.status(400).json({
            mensagem: "A nota da redação deve estar entre 0 e 1000."
        });
    }


    const redacao = await prisma.redacao.update({
        where: {
            id: Number(id)
        },
        data: req.body
    });


    res.status(200).json({
        mensagem: "Redação atualizada com sucesso!",
        redacao
    });

};



// Excluir redação
const excluir = async (req, res) => {

    const { id } = req.params;


    const possuiCorrecao = await redacaoService.possuiCorrecao(id);


    if (possuiCorrecao) {
        return res.status(400).json({
            mensagem: "Não é possível excluir uma redação que já possui correção."
        });
    }


    const redacao = await prisma.redacao.delete({
        where: {
            id: Number(id)
        }
    });


    res.status(200).json({
        mensagem: "Redação excluída com sucesso!",
        redacao
    });

};



module.exports = {
    adicionar,
    listar,
    buscar,
    atualizar,
    excluir
};