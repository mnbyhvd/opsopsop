-- Создание базы данных и пользователя
CREATE DATABASE IF NOT EXISTS master_sps CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'master_user'@'localhost' IDENTIFIED BY 'master_password';
GRANT ALL PRIVILEGES ON master_sps.* TO 'master_user'@'localhost';
FLUSH PRIVILEGES;

-- Используем базу данных
USE master_sps;

-- Включаем UTF-8
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
