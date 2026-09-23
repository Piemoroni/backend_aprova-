const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const controller = require("../controller/flashcard.controller");

console.log("--- TESTE DE IMPORTAÇÃO ---");
console.log("auth.autenticarToken:", auth?.autenticarToken);
console.log("auth.autorizarNivel:", auth?.autorizarNivel);
console.log("controller.listar:", controller?.listar);
console.log("controller.buscar:", controller?.buscar);
console.log("----------------------------");

const { autenticarToken, autorizarNivel } = auth;
const { adicionar, listar, buscar, atualizar, excluir } = controller;

router.get("/listar", autenticarToken, listar);
router.get("/buscar/:id", autenticarToken, buscar);
router.post("/adicionar", autenticarToken, autorizarNivel("ADMIN", "PROFESSOR"), adicionar);
router.put("/atualizar/:id", autenticarToken, autorizarNivel("ADMIN", "PROFESSOR"), atualizar);
router.delete("/excluir/:id", autenticarToken, autorizarNivel("ADMIN", "PROFESSOR"), excluir);

module.exports = router;