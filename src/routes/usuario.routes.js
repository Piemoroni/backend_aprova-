const express = require("express");
const router = express.Router();

const { 
    adicionar, 
    login, 
    listar, 
    buscar, 
    atualizar, 
    excluir 
} = require("../controller/usuario.controller");

router.post("/adicionar", adicionar); 
router.post("/login", login); 
router.get("/listar", listar); 
router.get("/buscar/:id", buscar); 
router.put("/atualizar/:id", atualizar); 
router.delete("/excluir/:id", excluir); 

module.exports = router;