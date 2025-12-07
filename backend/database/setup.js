// Script de Setup do Banco de Dados
// Execute: node database/setup.js

require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
};

const dbName = process.env.DB_NAME || 'garagem';

async function setup() {
    let connection;

    try {
        console.log('🔌 Conectando ao MySQL...');
        connection = await mysql.createConnection(config);

        // Criar banco de dados
        console.log('📦 Criando banco de dados...');
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        await connection.query(`USE \`${dbName}\``);

        // Criar tabela de usuários
        console.log('👤 Criando tabela de usuários...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Criar tabela de veículos
        console.log('🚗 Criando tabela de veículos...');
        await connection.query(`
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
            )
        `);

        // Verificar se usuário admin já existe
        const [users] = await connection.query('SELECT * FROM users WHERE username = ?', ['admin']);

        if (users.length === 0) {
            // Gerar hash da senha
            console.log('🔐 Criando usuário admin...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await connection.query(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                ['admin', hashedPassword]
            );
            console.log('✅ Usuário admin criado com sucesso!');
            console.log('   📧 Usuário: admin');
            console.log('   🔑 Senha: admin123');
        } else {
            console.log('ℹ️  Usuário admin já existe');
        }

        // Verificar se existem veículos
        const [vehicles] = await connection.query('SELECT COUNT(*) as count FROM vehicles');

        if (vehicles[0].count === 0) {
            console.log('🚙 Inserindo veículos de exemplo...');
            await connection.query(`
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
                )
            `);
            console.log('✅ Veículos de exemplo inseridos!');
        } else {
            console.log(`ℹ️  Já existem ${vehicles[0].count} veículos no banco`);
        }

        console.log('\n🎉 Setup concluído com sucesso!');
        console.log('\n📋 Próximos passos:');
        console.log('   1. Inicie o backend: cd backend && npm start');
        console.log('   2. Inicie o frontend: cd frontend && npm start');
        console.log('   3. Acesse: http://localhost:3000');
        console.log('   4. Login admin: admin / admin123\n');

    } catch (error) {
        console.error('❌ Erro durante o setup:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Verifique se o MySQL está rodando e as credenciais no .env estão corretas');
        }
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

setup();
