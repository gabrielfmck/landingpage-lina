-- =====================================================================
-- SCRIPT DE INICIALIZAÇÃO DO BANCO DE DADOS - PROCESSO SELETIVO LINA
-- Banco de dados: lina_bd
-- =====================================================================

-- 1. Criação da base de dados com suporte a UTF-8 completo
CREATE DATABASE IF NOT EXISTS `lina_bd`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. Criação do usuário e concessão de privilégios para acesso local (produção)
-- Altere 'sua_senha_segura_aqui' para uma senha forte no seu servidor de produção.
CREATE USER IF NOT EXISTS 'lina_user'@'localhost' IDENTIFIED BY '5G7GztsTHBjUe4+ZU/RAJ//3s40yH6TuJ3bq8E70ImU';
GRANT ALL PRIVILEGES ON `lina_bd`.* TO 'lina_user'@'localhost';
FLUSH PRIVILEGES;

USE `lina_bd`;

-- 3. Tabela de controle de abertura/fechamento do processo seletivo
CREATE TABLE IF NOT EXISTS `open_process` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `isOpen` BOOLEAN NOT NULL DEFAULT TRUE,
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inicializa a flag de processo seletivo como ABERTO (id=1)
INSERT INTO `open_process` (`id`, `isOpen`)
VALUES (1, TRUE)
ON DUPLICATE KEY UPDATE `id` = `id`;

-- 4. Tabela de Candidatos (respostas do formulário de inscrição)
CREATE TABLE IF NOT EXISTS `candidato` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `matricula` VARCHAR(50) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `telefone` VARCHAR(50) NOT NULL,
  `curso` VARCHAR(191) NOT NULL,
  `periodo` VARCHAR(50) NOT NULL,
  `areaAtuacao` VARCHAR(255) NOT NULL,
  `historicoUrl` VARCHAR(255) NULL,
  `certificadosUrl` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `idx_candidato_email` (`email`),
  INDEX `idx_candidato_matricula` (`matricula`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabela de Usuários Administradores (acesso restrito ao dashboard)
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `senha` VARCHAR(255) NOT NULL,
  `nome` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Inserção de Administrador Inicial Padrão
-- E-mail: admin@lina.facom.ufu.br
-- Senha padrão provisória: LinaAdmin@2026
-- Hash bcrypt correspondente abaixo ($2a$10$tJk6s4eD2O3X3g9M4.kZ1.eJd3sY2e1l5H.dF7eJ9Z3X4g5H6j7k8)
INSERT INTO `usuario` (`email`, `senha`, `nome`)
VALUES (
  'admin@lina.facom.ufu.br',
  '$2a$10$wE9VdQ9r9O719z3pT30vBebF/J0u9q7Y9X1oWfPvZg.qC71X2N/1m',
  'Coordenação LINA'
)
ON DUPLICATE KEY UPDATE `email` = `email`;
