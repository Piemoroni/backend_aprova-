const express = require("express");
const router = express.Router();

const { 
    adicionar, 
    listarPorQuestao, 
    atualizar, 
    excluir 
} = require("../controller/alternativa.controller");

router.get("/listar/:questaoId", listarPorQuestao);
router.post("/adicionar", adicionar);
router.put("/atualizar/:id", atualizar);
router.delete("/excluir/:id", excluir);

module.exports = router;