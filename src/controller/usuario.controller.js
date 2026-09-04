const { emailDuplicado, validarEmail, validarSenha, gerarHashSenha, compararSenha, possuiDados } = require("../services/usuario.service");
const prisma = require("../data/prisma");

const adicionar = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!validarEmail(email)) {
        return res.status(400).json({
            erro: "Formato de e-mail inválido."
        });
    }

    if (!validarSenha(senha)) {
        return res.status(400).json({
            erro: "A senha deve conter no mínimo 6 caracteres."
        });
    }

    if (await emailDuplicado(email)) {
        return res.status(400).json({
            erro: "Este e-mail já está cadastrado."
        });
    }

    const senhaHash = gerarHashSenha(senha);

    const usuario = await prisma.usuario.create({
        data: {
            nome,
            email,
            senha: senhaHash
        }
    });

    delete usuario.senha;

    res.status(201).json({
        mensagem: "Usuário cadastrado com sucesso!",
        usuario
    });
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    const usuario = await prisma.usuario.findUnique({
        where: { email }
    });

    if (!usuario || !compararSenha(senha, usuario.senha)) {
        return res.status(401).json({
            erro: "E-mail ou senha incorretos."
        });
    }

    delete usuario.senha;

    res.status(200).json({
        mensagem: "Login realizado com sucesso!",
        usuario
    });
};

const listar = async (req, res) => {
    const usuarios = await prisma.usuario.findMany({
        select: {
            id: true,
            nome: true,
            email: true,
            dataCadastro: true
        }
    });

    res.status(200).json(usuarios);
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
        where: {
            id: Number(id)
        },
        select: {
            id: true,
            nome: true,
            email: true,
            dataCadastro: true,
            simulados: true,
            flashcards: true
        }
    });

    if (!usuario) {
        return res.status(404).json({
            erro: "Usuário não encontrado."
        });
    }

    res.status(200).json(usuario);
};

const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, senha, ...outrosDados } = req.body;

        const usuarioExiste = await prisma.usuario.findUnique({
            where: { id: Number(id) }
        });

        if (!usuarioExiste) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        if (email) {
            if (!validarEmail(email)) {
                return res.status(400).json({
                    erro: "Formato de e-mail inválido."
                });
            }

            const emailEmUso = await prisma.usuario.findFirst({
                where: {
                    email,
                    NOT: { id: Number(id) }
                }
            });

            if (emailEmUso) {
                return res.status(400).json({
                    erro: "Este e-mail já está em uso por outro usuário."
                });
            }

            outrosDados.email = email;
        }

        if (senha) {
            if (!validarSenha(senha)) {
                return res.status(400).json({
                    erro: "A nova senha deve conter no mínimo 6 caracteres."
                });
            }
            outrosDados.senha = gerarHashSenha(senha);
        }

        const usuario = await prisma.usuario.update({
            where: { id: Number(id) },
            data: outrosDados
        });

        delete usuario.senha;

        return res.status(200).json({
            mensagem: "Usuário atualizado com sucesso!",
            usuario
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

        const usuarioExiste = await prisma.usuario.findUnique({
            where: { id: Number(id) }
        });

        if (!usuarioExiste) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        if (await possuiDados(id)) {
            return res.status(400).json({
                erro: "Não é possível excluir o usuário pois existem simulados ou flashcards vinculados."
            });
        }

        const usuario = await prisma.usuario.delete({
            where: {
                id: Number(id)
            }
        });

        delete usuario.senha;

        return res.status(200).json({
            mensagem: "Usuário removido com sucesso!",
            usuario
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