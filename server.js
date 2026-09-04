require('dotenv').config();
const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const flashcardRoutes = require('./src/routes/flashcard.routes');
const materiaRoutes = require('./src/routes/materia.routes');
const simuladoRoutes = require('./src/routes/simulado.routes');
const usuarioRoutes = require('./src/routes/usuario.routes');
const conteudoRoutes = require('./src/routes/conteudo.routes');
const questaoRoutes = require('./src/routes/questao.routes');
const alternativaRoutes = require('./src/routes/alternativa.routes');
const flashcardUsuarioRoutes = require('./src/routes/flashcardUsuario.routes');

app.use('/flashcards', flashcardRoutes);
app.use('/materia', materiaRoutes);
app.use('/simulado', simuladoRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/conteudo', conteudoRoutes);
app.use('/questao', questaoRoutes);
app.use('/alternativa', alternativaRoutes);
app.use('/flashcardUsuario', flashcardUsuarioRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});