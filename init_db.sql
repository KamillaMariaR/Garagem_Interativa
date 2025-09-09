-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS almadepapel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE almadepapel_db;

-- Criação da tabela products
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0.00,
  description TEXT,
  image_url VARCHAR(255)
);

-- Inserção de dados de exemplo
INSERT INTO products (title, author, price, description, image_url) VALUES
('Amor não é óbvio', 'Elayne Baeta', 29.90, 'Livro de romance contemporâneo', 'imagens/o amor nao é óbvio.jpg'),
('Coisas óbvias sobre o amor', 'Elayne Baeta', 34.90, 'Reflexões sobre o amor', 'imagens/coisas óbvias sobre o amor - Copia.jpg'),
('A cabeça do santo', 'Socorro Acioli', 39.90, 'Romance brasileiro', 'imagens/a cabeça do santo.png');
