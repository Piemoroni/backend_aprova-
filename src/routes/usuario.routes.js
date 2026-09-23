const express = require("express");
const router = express.Router();
const { autenticarToken, autorizarNivel } = require("../middlewares/auth.middleware");

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
router.get("/listar", autenticarToken, autorizarNivel("ADMIN"), listar); 
router.get("/buscar/:id", autenticarToken, buscar); 
router.put("/atualizar/:id", autenticarToken, atualizar); 
router.delete("/excluir/:id", autenticarToken, autorizarNivel("ADMIN"), excluir); 

module.exports = router;