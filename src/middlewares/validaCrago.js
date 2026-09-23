const validaTipo = (...tiposPermitidos) => {
    return (req, res, next) => {
        try {
            const usuario = req.usuario || req.headers['user'];

            if (!usuario || !usuario.tipo) {
                return res.status(401).json({
                    erro: "Acesso negado. Informações do perfil não encontradas na requisição."
                });
            }

            if (!tiposPermitidos.includes(usuario.tipo)) {
                return res.status(403).json({
                    erro: "Sem nível de acesso necessário para realizar esta operação."
                });
            }

            return next();
        } catch (erro) {
            console.error("ERRO NO MIDDLEWARE DE VALIDAÇÃO DE TIPO:", erro);
            return res.status(500).json({
                erro: "Erro interno no servidor ao verificar permissões de acesso."
            });
        }
    };
};

const validaAluno = validaTipo("ALUNO");
const validaAdmin = validaTipo("ADMIN", "ADM");
const validaProfessor = validaTipo("PROFESSOR");
const validaAdminEProfessor = validaTipo("ADMIN", "ADM", "PROFESSOR");

module.exports = {
    validaTipo,
    validaAluno,
    validaAdmin,
    validaProfessor,
    validaAdminEProfessor
};