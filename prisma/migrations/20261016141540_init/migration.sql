-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `tipo` ENUM('ALUNO', 'PROFESSOR', 'ADMIN') NOT NULL DEFAULT 'ALUNO',
    `dataCadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conteudos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `resumo` VARCHAR(191) NOT NULL,
    `ordem` INTEGER NOT NULL,
    `dataCriacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `materiaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `questoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enunciado` VARCHAR(191) NOT NULL,
    `dificuldade` VARCHAR(191) NOT NULL,
    `area` VARCHAR(191) NOT NULL,
    `ano` VARCHAR(191) NOT NULL,
    `conteudoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alternativas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `texto` VARCHAR(191) NOT NULL,
    `correta` BOOLEAN NOT NULL,
    `ordem` VARCHAR(191) NOT NULL,
    `questaoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `simulados` (
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
CREATE TABLE `respostas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataResposta` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `correta` BOOLEAN NOT NULL,
    `simuladoId` INTEGER NOT NULL,
    `questaoId` INTEGER NOT NULL,
    `alternativaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flashcards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pergunta` VARCHAR(191) NOT NULL,
    `resposta` VARCHAR(191) NOT NULL,
    `ordem` INTEGER NOT NULL,
    `conteudoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flashcards_usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataRevisao` DATETIME(3) NOT NULL,
    `nivelDominio` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `flashcardId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `conteudos` ADD CONSTRAINT `conteudos_materiaId_fkey` FOREIGN KEY (`materiaId`) REFERENCES `materias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `questoes` ADD CONSTRAINT `questoes_conteudoId_fkey` FOREIGN KEY (`conteudoId`) REFERENCES `conteudos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alternativas` ADD CONSTRAINT `alternativas_questaoId_fkey` FOREIGN KEY (`questaoId`) REFERENCES `questoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `simulados` ADD CONSTRAINT `simulados_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `respostas` ADD CONSTRAINT `respostas_simuladoId_fkey` FOREIGN KEY (`simuladoId`) REFERENCES `simulados`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `respostas` ADD CONSTRAINT `respostas_questaoId_fkey` FOREIGN KEY (`questaoId`) REFERENCES `questoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `respostas` ADD CONSTRAINT `respostas_alternativaId_fkey` FOREIGN KEY (`alternativaId`) REFERENCES `alternativas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flashcards` ADD CONSTRAINT `flashcards_conteudoId_fkey` FOREIGN KEY (`conteudoId`) REFERENCES `conteudos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flashcards_usuarios` ADD CONSTRAINT `flashcards_usuarios_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flashcards_usuarios` ADD CONSTRAINT `flashcards_usuarios_flashcardId_fkey` FOREIGN KEY (`flashcardId`) REFERENCES `flashcards`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
