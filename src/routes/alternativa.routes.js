const express = require("express");
const router = express.Router();
const { autenticarToken, autorizarNivel } = require("../middlewares/auth.middleware");

const { 
    adicionar, 
    listarPorQuestao, 
    atualizar, 
    excluir 
} = require("../controller/alternativa.controller");

router.get("/listar/:questaoId", autenticarToken, listarPorQuestao);

router.post("/adicionar", autenticarToken, autorizarNivel("ADMIN", "PROFESSOR"), adicionar);
router.put("/atualizar/:id", autenticarToken, autorizarNivel("ADMIN", "PROFESSOR"), atualizar);
router.delete("/excluir/:id", autenticarToken, autorizarNivel("ADMIN", "PROFESSOR"), excluir);

module.exports = router;