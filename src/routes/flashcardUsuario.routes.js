const express = require("express");
const router = express.Router();

const { 
    registrarEstudo,
    listarPorUsuario
} = require("../controller/flashcardUsuario.controller");

router.post("/adicionar", registrarEstudo); 
router.get("/buscar/:id", listarPorUsuario); 


module.exports = router;