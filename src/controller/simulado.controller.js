const prisma = require("../data/prisma");
const {usuarioExiste, validarTempo, validarNota, possuiRespostas, simuladoDuplicado}= require("../services/simulado.service");

// Cadastrar simulado
const adicionar = async (req, res) => {

    const { usuarioId, comTempo, tempoTotalMin, dataRealizacao } = req.body;


    const usuario = await simuladoService.usuarioExiste(usuarioId);

    if (!usuario) {
        return res.status(400).json({
            mensagem: "Usuário não encontrado."
        });
    }


    const tempoValido = simuladoService.validarTempo(
        comTempo,
        tempoTotalMin
    );


    if (!tempoValido) {
        return res.status(400).json({
            mensagem: "Informe o tempo total do simulado."
        });
    }


    const duplicado = await simuladoService.simuladoDuplicado(
        usuarioId,
        dataRealizacao
    );


    if (duplicado) {
        return res.status(400).json({
            mensagem: "Já existe um simulado registrado nessa data."
        });
    }


    const simulado = await prisma.simulado.create({
        data: req.body,
        include: {
            usuario: true,
            respostas: true
        }
    });


    res.status(201).json({
        mensagem: "Simulado iniciado com sucesso!",
        simulado
    });

};



// Listar simulados
const listar = async (req, res) => {

    const simulados = await prisma.simulado.findMany({
        include: {
            usuario: true,
            respostas: true
        }
    });


    res.status(200).json(simulados);

};



// Buscar simulado
const buscar = async (req, res) => {

    const { id } = req.params;


    const simulado = await prisma.simulado.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            usuario: true,
            respostas: {
                include: {
                    questao: true,
                    alternativa: true
                }
            }
        }
    });


    res.status(200).json(simulado);

};



// Atualizar simulado
const atualizar = async (req, res) => {

    const { id } = req.params;
    const { notaObjetiva, notaTri } = req.body;


    const notaObjetivaValida = simuladoService.validarNota(
        notaObjetiva
    );


    const notaTriValida = simuladoService.validarNota(
        notaTri
    );


    if (!notaObjetivaValida || !notaTriValida) {
        return res.status(400).json({
            mensagem: "As notas devem estar entre 0 e 1000."
        });
    }


    const simulado = await prisma.simulado.update({
        where: {
            id: Number(id)
        },
        data: req.body
    });


    res.status(200).json({
        mensagem: "Simulado atualizado com sucesso!",
        simulado
    });

};



// Excluir simulado
const excluir = async (req, res) => {

    const { id } = req.params;


    const possuiRespostas = await simuladoService.possuiRespostas(id);


    if (possuiRespostas) {
        return res.status(400).json({
            mensagem: "Não é possível excluir um simulado que possui respostas registradas."
        });
    }


    const simulado = await prisma.simulado.delete({
        where: {
            id: Number(id)
        }
    });


    res.status(200).json({
        mensagem: "Simulado excluído com sucesso!",
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