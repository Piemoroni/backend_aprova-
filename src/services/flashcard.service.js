const prisma = require("../data/prisma");

const flashcardDuplicado = async (pergunta, conteudoId) => {
  const flashcard = await prisma.flashcard.findFirst({
    where: {
      pergunta,
      conteudoId: Number(conteudoId)
    }
  });
  return flashcard != null;
};

const conteudoExiste = async (conteudoId) => {
  const conteudo = await prisma.conteudo.findUnique({
    where: { id: Number(conteudoId) }
  });
  return conteudo != null;
};

const validarOrdem = (ordem) => {
  if (ordem <= 0) return false;
  return true;
};

const possuiUsuarios = async (flashcardId) => {
  const flashcard = await prisma.flashcard.findUnique({
    where: { id: Number(flashcardId) },
    include: { usuarios: true }
  });

  if (!flashcard) return false;
  return flashcard.usuarios.length > 0;
};

module.exports = {
  flashcardDuplicado,
  conteudoExiste,
  validarOrdem,
  possuiUsuarios
};