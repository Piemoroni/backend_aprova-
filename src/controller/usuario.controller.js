const prisma = require("../data/prisma");
const {emailDuplicado, validarEmail, validarSenha, possuiDados}= require("../services/usuario.service");

const prisma = require("../data/prisma");


// Cadastrar usuário
const adicionar = async (req, res) => {

    const { nome, email, senha } = req.body;


    const emailValido = usuarioService.validarEmail(email);

    if (!emailValido) {
        return res.status(400).json({
            mensagem: "E-mail inválido."
        });
    }


    const duplicado = await usuarioService.emailDuplicado(email);

    if (duplicado) {
        return res.status(400).json({
            mensagem: "Esse e-mail já está cadastrado."
        });
    }


    const senhaValida = usuarioService.validarSenha(senha);

    if (!senhaValida) {
        return res.status(400).json({
            mensagem: "A senha deve possuir no mínimo 6 caracteres."
        });
    }


    const usuario = await prisma.usuario.create({
        data: req.body
    });


    res.status(201).json({
        mensagem: "Usuário cadastrado com sucesso!",
        usuario
    });

};



// Listar usuários
const listar = async (req, res) => {

    const usuarios = await prisma.usuario.findMany();


    res.status(200).json(usuarios);

};



// Buscar usuário
const buscar = async (req, res) => {

    const { id } = req.params;


    const usuario = await prisma.usuario.findUnique({
        where: {
            id: Number(id)
        }
    });


    res.status(200).json(usuario);

};



// Atualizar usuário
const atualizar = async (req, res) => {

    const { id } = req.params;


    const usuario = await prisma.usuario.update({
        where: {
            id: Number(id)
        },
        data: req.body
    });


    res.status(200).json({
        mensagem: "Usuário atualizado com sucesso!",
        usuario
    });

};



// Excluir usuário
const excluir = async (req, res) => {

    const { id } = req.params;


    const possuiDados = await usuarioService.possuiDados(id);


    if (possuiDados) {
        return res.status(400).json({
            mensagem: "Não é possível excluir esse usuário, pois ele possui dados registrados."
        });
    }


    const usuario = await prisma.usuario.delete({
        where: {
            id: Number(id)
        }
    });


    res.status(200).json({
        mensagem: "Usuário excluído com sucesso!",
        usuario
    });

};



module.exports = {
    adicionar,
    listar,
    buscar,
    atualizar,
    excluir
};