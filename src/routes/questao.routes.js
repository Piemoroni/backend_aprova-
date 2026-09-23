const express = require("express");
const router = express.Router();
const { autenticarToken, autorizarNivel } = require("../middlewares/auth.middleware");

const { 
    adicionar, 
    listar, 
    buscar, 
    atualizar, 
    excluir 
} = require("../controller/questoes.controller");

router.post("/adicionar", autenticarToken, autorizarNivel("ADMIN", "PROFESSOR"), adicionar); 
router.get("/listar", autenticarToken, listar); 
router.get("/buscar/:id", autenticarToken, buscar); 
router.put("/atualizar/:id", autenticarToken, autorizarNivel("ADMIN", "PROFESSOR"), atualizar); 
router.delete("/excluir/:id", autenticarToken, autorizarNivel("ADMIN", "PROFESSOR"), excluir); 

module.exports = router;