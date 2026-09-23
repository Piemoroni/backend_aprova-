const prisma = require("../data/prisma");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

const adicionar = async (req, res) => {
    try {
        const { nome, email, senha, tipo } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "Os campos nome, email e senha são obrigatórios."
            });
        }

        const usuarioExiste = await prisma.usuario.findUnique({
            where: { email }
        });

        if (usuarioExiste) {
            return res.status(400).json({
                erro: "Já existe um usuário cadastrado com este e-mail."
            });
        }

        const novoUsuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha,
                tipo: tipo ? tipo.toUpperCase() : "ALUNO"
            }
        });

        delete novoUsuario.senha;

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            usuario: novoUsuario
        });
    } catch (erro) {
        console.error("Erro ao adicionar usuário:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao cadastrar usuário."
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: "E-mail e senha são obrigatórios."
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: { email }
        });

        if (!usuario || usuario.senha !== senha) {
            return res.status(401).json({
                erro: "E-mail ou senha incorretos."
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                tipo: usuario.tipo
            },
            SECRET_KEY,
            { expiresIn: "8h" }
        );

        delete usuario.senha;

        return res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            usuario,
            token
        });
    } catch (erro) {
        console.error("Erro ao realizar login:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao realizar login."
        });
    }
};

const listar = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                tipo: true,
                dataCadastro: true
            }
        });

        return res.status(200).json(usuarios);
    } catch (erro) {
        console.error("Erro ao listar usuários:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao listar usuários."
        });
    }
};

const buscar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return res.status(400).json({
                erro: "ID de usuário inválido."
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                nome: true,
                email: true,
                tipo: true,
                dataCadastro: true
            }
        });

        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        return res.status(200).json(usuario);
    } catch (erro) {
        console.error("Erro ao buscar usuário:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao buscar usuário."
        });
    }
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, senha, tipo } = req.body;

        if (isNaN(Number(id))) {
            return res.status(400).json({
                erro: "ID de usuário inválido."
            });
        }

        const usuarioExiste = await prisma.usuario.findUnique({
            where: { id: Number(id) }
        });

        if (!usuarioExiste) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        const dadosAtualizacao = {};
        if (nome) dadosAtualizacao.nome = nome;
        if (email) dadosAtualizacao.email = email;
        if (senha) dadosAtualizacao.senha = senha;
        if (tipo) dadosAtualizacao.tipo = tipo.toUpperCase();

        const usuarioAtualizado = await prisma.usuario.update({
            where: { id: Number(id) },
            data: dadosAtualizacao,
            select: {
                id: true,
                nome: true,
                email: true,
                tipo: true,
                dataCadastro: true
            }
        });

        return res.status(200).json({
            mensagem: "Usuário atualizado com sucesso!",
            usuario: usuarioAtualizado
        });
    } catch (erro) {
        console.error("Erro ao atualizar usuário:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao atualizar usuário."
        });
    }
};

const excluir = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return res.status(400).json({
                erro: "ID de usuário inválido."
            });
        }

        const usuarioExiste = await prisma.usuario.findUnique({
            where: { id: Number(id) }
        });

        if (!usuarioExiste) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        await prisma.usuario.delete({
            where: { id: Number(id) }
        });

        return res.status(200).json({
            mensagem: "Usuário removido com sucesso!"
        });
    } catch (erro) {
        console.error("Erro ao excluir usuário:", erro);
        return res.status(500).json({
            erro: "Erro interno no servidor ao excluir usuário."
        });
    }
};

module.exports = {
    adicionar,
    login,
    listar,
    buscar,
    atualizar,
    excluir
};