const express = require("express");
const router = express.Router();

const { 
    adicionar, 
    listarPorQuestao, 
    atualizar, 
    excluir 
} = require("../controller/alternativa.controller");

router.post("/adicionar", adicionar);
router.get("/listar/:questaoId", listarPorQuestao);
router.put("/atualizar/:id", atualizar);
router.delete("/excluir/:id", excluir);

module.exports = router;