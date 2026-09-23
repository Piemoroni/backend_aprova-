const express = require("express");
const router = express.Router();
const { autenticarToken, autorizarNivel } = require("../middlewares/auth.middleware");

const { 
    adicionar, 
    listar,
    buscar,
    atualizar,
    excluir
} = require("../controller/flashcardUsuario.controller");

router.post("/adicionar", autenticarToken, adicionar); 
router.get("/listar", autenticarToken, listar);
router.get("/buscar/:id", autenticarToken, buscar); 
router.put("/atualizar/:id", autenticarToken, atualizar);
router.delete("/excluir/:id", autenticarToken, excluir);

module.exports = router;