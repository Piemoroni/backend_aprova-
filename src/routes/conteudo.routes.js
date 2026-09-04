const express = require("express");
const router = express.Router();

const { 
    adicionar
} = require("../controller/conteudo.controller");

router.post("/adicionar", adicionar); 

module.exports = router;