require('dotenv').config();
const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const agendaRoutes = require('./src/routes/agenda.routes');
const conteudoRoutes = require('./src/routes/conteudo.routes');
const desempenhoRoutes = require('./src/routes/desempenho.routes');
const flascardsRoutes = require('./src/routes/flashcard.routes');
const iaRoutes = require('./src/routes/ia.routes');
const materiaRoutes = require('./src/routes/materia.routes');
const questaoRoutes = require('./src/routes/questao.routes');
const redacaoRoutes = require('./src/routes/redacao.routes');
const simuladoRoutes = require('./src/routes/simulado.routes');
const usuarioRoutes = require('./src/routes/usuario.routes');

app.use('/agenda', agendaRoutes);
app.use('/conteudo', conteudoRoutes);
app.use('/desempenho', desempenhoRoutes);
app.use('/flashcards', flascardsRoutes);
app.use('/ia', iaRoutes);
app.use('/materia', materiaRoutes);
app.use('/questao', questaoRoutes);
app.use('/redacao', redacaoRoutes);
app.use('/simulado', simuladoRoutes);
app.use('/usuario', usuarioRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});