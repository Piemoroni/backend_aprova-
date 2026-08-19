const express = require("express");

const router = express.Router();

const { 
    listar, 
    buscar, 
    atualizar, 
    excluir, 
    adicionar} = require("../controller/questao.controller");

router.post("/adicionar", adicionar);
router.get("/listar", listar);
router.get("/buscar/:id", buscar);
router.put("/atualizar/:id", atualizar);
router.delete("/excluir/:id", excluir);

module.exports = router;
