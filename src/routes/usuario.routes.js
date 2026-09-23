const express = require("express");
const router = express.Router();

const { 
    autenticarToken, 
    autorizarNivel 
} = require("../middlewares/auth.middleware");

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

router.use(autenticarToken); 

router.get("/listar", autorizarNivel("ADMIN"), listar); 
router.get("/buscar/:id", buscar); 
router.put("/atualizar/:id", atualizar); 
router.delete("/excluir/:id", autorizarNivel("ADMIN"), excluir); 

module.exports = router;