const express = require("express");
const router = express.Router();

const { 
    adicionar, 
    listar, 
    buscar, 
    atualizar, 
    excluir 
} = require("../controller/conteudo.controller");

router.get("/listar", listar);
router.get("/buscar/:id", buscar);
router.post("/adicionar", adicionar);
router.put("/atualizar/:id", atualizar);
router.delete("/excluir/:id", excluir);

module.exports = router;