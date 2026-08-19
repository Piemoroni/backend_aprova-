-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `dataCadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `foto` VARCHAR(191) NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MensagemIA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pergunta` VARCHAR(191) NOT NULL,
    `resposta` VARCHAR(191) NOT NULL,
    `dataEnvio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agenda` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `dataEvento` DATETIME(3) NOT NULL,
    `horaEvento` DATETIME(3) NOT NULL,
    `cor` VARCHAR(191) NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Simulado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataRealizacao` DATETIME(3) NOT NULL,
    `comTempo` BOOLEAN NOT NULL,
    `tempoTotalMin` INTEGER NULL,
    `notaObjetiva` DOUBLE NULL,
    `notaTri` DOUBLE NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Redacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tema` VARCHAR(191) NOT NULL,
    `texto` VARCHAR(191) NOT NULL,
    `nota` DOUBLE NULL,
    `feedback` VARCHAR(191) NULL,
    `dataEnvio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Desempenho` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataReferencia` DATETIME(3) NOT NULL,
    `acertos` INTEGER NOT NULL,
    `erros` INTEGER NOT NULL,
    `notaTri` DOUBLE NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Materia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `cor` VARCHAR(191) NOT NULL,
    `icone` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Conteudo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `resumo` VARCHAR(191) NOT NULL,
    `ordem` INTEGER NOT NULL,
    `dataCriacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `materiaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Questao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enunciado` VARCHAR(191) NOT NULL,
    `dificuldade` VARCHAR(191) NOT NULL,
    `area` VARCHAR(191) NOT NULL,
    `ano` VARCHAR(191) NOT NULL,
    `conteudoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Alternativa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `texto` VARCHAR(191) NOT NULL,
    `correta` BOOLEAN NOT NULL,
    `ordem` VARCHAR(191) NOT NULL,
    `questaoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resposta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataResposta` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `correta` BOOLEAN NOT NULL,
    `simuladoId` INTEGER NOT NULL,
    `questaoId` INTEGER NOT NULL,
    `alternativaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistoricoEstudo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataConclusao` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `conteudoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Flashcard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pergunta` VARCHAR(191) NOT NULL,
    `resposta` VARCHAR(191) NOT NULL,
    `ordem` INTEGER NOT NULL,
    `conteudoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlashcardUsuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataRevisao` DATETIME(3) NOT NULL,
    `nivelDominio` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `flashcardId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MensagemIA` ADD CONSTRAINT `MensagemIA_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agenda` ADD CONSTRAINT `Agenda_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Simulado` ADD CONSTRAINT `Simulado_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Redacao` ADD CONSTRAINT `Redacao_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Desempenho` ADD CONSTRAINT `Desempenho_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conteudo` ADD CONSTRAINT `Conteudo_materiaId_fkey` FOREIGN KEY (`materiaId`) REFERENCES `Materia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Questao` ADD CONSTRAINT `Questao_conteudoId_fkey` FOREIGN KEY (`conteudoId`) REFERENCES `Conteudo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Alternativa` ADD CONSTRAINT `Alternativa_questaoId_fkey` FOREIGN KEY (`questaoId`) REFERENCES `Questao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resposta` ADD CONSTRAINT `Resposta_simuladoId_fkey` FOREIGN KEY (`simuladoId`) REFERENCES `Simulado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resposta` ADD CONSTRAINT `Resposta_questaoId_fkey` FOREIGN KEY (`questaoId`) REFERENCES `Questao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resposta` ADD CONSTRAINT `Resposta_alternativaId_fkey` FOREIGN KEY (`alternativaId`) REFERENCES `Alternativa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistoricoEstudo` ADD CONSTRAINT `HistoricoEstudo_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistoricoEstudo` ADD CONSTRAINT `HistoricoEstudo_conteudoId_fkey` FOREIGN KEY (`conteudoId`) REFERENCES `Conteudo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Flashcard` ADD CONSTRAINT `Flashcard_conteudoId_fkey` FOREIGN KEY (`conteudoId`) REFERENCES `Conteudo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlashcardUsuario` ADD CONSTRAINT `FlashcardUsuario_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlashcardUsuario` ADD CONSTRAINT `FlashcardUsuario_flashcardId_fkey` FOREIGN KEY (`flashcardId`) REFERENCES `Flashcard`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
