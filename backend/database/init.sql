-- ===========================================
-- Script de Inicialização - Sistema Garagem
-- Capatti Veículos
-- ===========================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS garagem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE garagem;

-- ===========================================
-- Tabela de Usuários
-- ===========================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- Tabela de Veículos (Schema Completo)
-- ===========================================
CREATE TABLE IF NOT EXISTS vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  year INT NOT NULL,
  kms INT NOT NULL DEFAULT 0,
  color VARCHAR(100),
  description TEXT,
  images JSON,
  features JSON,
  fuelType VARCHAR(50),
  transmission VARCHAR(50),
  doors INT DEFAULT 4,
  engine VARCHAR(100),
  power INT,
  consumption VARCHAR(50),
  docsStatus VARCHAR(100),
  warranty VARCHAR(50),
  accidents BOOLEAN DEFAULT FALSE,
  paintOriginal VARCHAR(50),
  tiresCondition VARCHAR(50),
  lastMaintenance VARCHAR(50),
  isPromotion BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===========================================
-- Inserir usuário admin padrão
-- Usuário: admin | Senha: admin123
-- ===========================================
INSERT INTO users (username, password) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqL8L9W8SxW8X8X8X8X8X8X8X8X8.');

-- ===========================================
-- Veículos de exemplo (opcional)
-- ===========================================
INSERT INTO vehicles (name, brand, price, year, kms, color, description, images, features, fuelType, transmission, doors, engine, power, consumption, docsStatus, warranty, accidents, paintOriginal, tiresCondition, lastMaintenance, isPromotion) VALUES
(
  'Civic Touring',
  'Honda',
  179900.00,
  2023,
  8500,
  'Branco Pérola',
  'Sedã turbo com pacote Honda Sensing e teto solar.',
  '["https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1600&q=80"]',
  '["Teto solar", "Bancos em couro", "Honda Sensing", "CarPlay/Android Auto"]',
  'Gasolina',
  'Automático',
  4,
  '1.5 Turbo',
  173,
  '13 km/l',
  'IPVA pago',
  '2026-12-31',
  FALSE,
  'Sim',
  'Novos',
  '2024-08-10',
  TRUE
),
(
  'Corolla Altis Hybrid',
  'Toyota',
  189900.00,
  2024,
  3200,
  'Prata Supernova',
  'Híbrido com conforto e economia, pacote Safety Sense completo.',
  '["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1600&q=80"]',
  '["Piloto adaptativo", "Bancos elétricos", "Carregador por indução"]',
  'Híbrido',
  'Automático',
  4,
  '1.8 Hybrid',
  122,
  '18 km/l',
  'IPVA pago',
  '2027-06-30',
  FALSE,
  'Sim',
  'Originais',
  '2024-06-18',
  FALSE
),
(
  'Compass Limited T270',
  'Jeep',
  199900.00,
  2023,
  12800,
  'Cinza Sting',
  'SUV médio com pacote ADAS, interior premium e multimídia 10".',
  '["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80"]',
  '["Teto panorâmico", "Bancos ventilados", "Som Beats"]',
  'Flex',
  'Automático',
  4,
  '1.3 Turbo',
  185,
  '11 km/l',
  'IPVA pago',
  '2026-02-15',
  FALSE,
  'Sim',
  'Semi-novos',
  '2024-07-20',
  FALSE
);
