const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "sua_chave_secreta_aqui";

// Middleware 1: Verificação do Token
const autenticarToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Formato: Bearer TOKEN

    if (!token) {
        return res.status(401).json({ erro: "Acesso negado. Token não fornecido." });
    }

    try {
        const usuarioPayload = jwt.verify(token, SECRET_KEY);
        req.usuario = usuarioPayload; // Salva os dados do usuário na requisição
        next();
    } catch (erro) {
        return res.status(403).json({ erro: "Token inválido ou expirado." });
    }
};

// Middleware 2: Validar Nível de Acesso (Exemplo: apenas 'ADMIN')
const autorizarNivel = (...tipoPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario || !tipoPermitidos.includes(req.usuario.tipo)) {
            return res.status(403).json({ erro: "Acesso negado. Nível de acesso insuficiente." });
        }
        next();
    };
};

module.exports = {
    autenticarToken,
    autorizarNivel
};