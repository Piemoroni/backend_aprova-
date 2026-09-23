const jsonwebtoken = require("jsonwebtoken");

const autenticarToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                erro: "Acesso negado. Nenhum token foi fornecido."
            });
        }

        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({
                erro: "Formato do token inválido. O formato correto é: Bearer <token>."
            });
        }

        const token = parts[1];
        const payload = jsonwebtoken.verify(token, process.env.SECRET_JWT);
        
        req.headers['user'] = payload;
        req.usuario = payload; 

        return next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                erro: "Token expirado. Por favor, faça login novamente."
            });
        }

        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({
                erro: "Token inválido."
            });
        }

        console.error("ERRO NO MIDDLEWARE DE AUTENTICAÇÃO:", err);
        return res.status(500).json({
            erro: "Erro interno no servidor ao validar autenticação."
        });
    }
};

const autorizarNivel = (...niveisPermitidos) => {
    return (req, res, next) => {
        try {
            if (!req.usuario) {
                return res.status(401).json({
                    erro: "Usuário não autenticado."
                });
            }

            const nivelUsuario = req.usuario.tipo || req.usuario.nivel || req.usuario.role;

            if (!niveisPermitidos.includes(nivelUsuario)) {
                return res.status(403).json({
                    erro: "Acesso negado. Você não tem permissão para realizar esta ação."
                });
            }

            return next();
        } catch (err) {
            console.error("ERRO NO MIDDLEWARE DE AUTORIZAÇÃO:", err);
            return res.status(500).json({
                erro: "Erro interno ao verificar permissões de acesso."
            });
        }
    };
};

module.exports = {
    autenticarToken,
    autorizarNivel
};