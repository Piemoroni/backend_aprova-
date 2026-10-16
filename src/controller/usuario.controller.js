const prisma = require("../data/prisma");
const usuarioService = require("../services/usuario.service");

const adicionar = async (req, res) => {
    try {
        const { nome, email, senha, tipo } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "Os campos nome, email e senha são obrigatórios."
            });
        }

        if (!usuarioService.validarEmail(email)) {
            return res.status(400).json({
                erro: "Formato de e-mail inválido."
            });
        }

        if (!usuarioService.validarSenha(senha)) {
            return res.status(400).json({
                erro: "A senha deve ter no mínimo 6 caracteres."
            });
        }

        if (tipo && !usuarioService.validarTipo(tipo)) {
            return res.status(400).json({
                erro: "Tipo de usuário inválido. Escolha entre ALUNO, PROFESSOR ou ADMIN."
            });
        }

        const existeEmail = await usuarioService.emailDuplicado(email);
        if (existeEmail) {
            return res.status(400).json({
                erro: "Já existe um usuário cadastrado com este e-mail."
            });
        }

        const senhaHash = await usuarioService.gerarHashSenha(senha);

        const novoUsuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: senhaHash,
                tipo: tipo ? tipo.toUpperCase() : "ALUNO"
            },
            select: {
                id: true,
                nome: true,
                email: true,
                tipo: true,
                dataCadastro: true
            }
        });

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

        if (email) {
            if (!usuarioService.validarEmail(email)) {
                return res.status(400).json({ erro: "Formato de e-mail inválido." });
            }
            if (email !== usuarioExiste.email && await usuarioService.emailDuplicado(email)) {
                return res.status(400).json({ erro: "E-mail já está em uso por outro usuário." });
            }
            dadosAtualizacao.email = email;
        }

        if (senha) {
            if (!usuarioService.validarSenha(senha)) {
                return res.status(400).json({ erro: "A senha deve ter no mínimo 6 caracteres." });
            }
            dadosAtualizacao.senha = await usuarioService.gerarHashSenha(senha);
        }

        if (tipo) {
            if (!usuarioService.validarTipo(tipo)) {
                return res.status(400).json({ erro: "Tipo de usuário inválido." });
            }
            dadosAtualizacao.tipo = tipo.toUpperCase();
        }

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

        const temDados = await usuarioService.possuiDados(id);
        if (temDados) {
            return res.status(400).json({
                erro: "Não é possível excluir o usuário pois ele possui simulados ou flashcards vinculados."
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
    listar,
    buscar,
    atualizar,
    excluir
};