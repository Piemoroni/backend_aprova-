const express = require("express");
const router = express.Router();
const { autenticarToken, autorizarNivel } = require("../middlewares/auth.middleware");

const { 
    adicionar
} = require("../controller/conteudo.controller");

router.post("/adicionar", autenticarToken, autorizarNivel("ADMIN"), adicionar); 

module.exports = router;