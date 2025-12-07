// Script de Migração - Adiciona e corrige colunas
// Execute: node database/migrate.js

require('dotenv').config();
const mysql = require('mysql2/promise');

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'garagem'
};

// Colunas que devem existir na tabela vehicles
const requiredColumns = [
    { name: 'description', definition: 'TEXT' },
    { name: 'images', definition: 'JSON' },
    { name: 'features', definition: 'JSON' },
    { name: 'fuelType', definition: 'VARCHAR(50)' },
    { name: 'transmission', definition: 'VARCHAR(50)' },
    { name: 'doors', definition: 'INT DEFAULT 4' },
    { name: 'engine', definition: 'VARCHAR(100)' },
    { name: 'power', definition: 'INT' },
    { name: 'consumption', definition: 'VARCHAR(50)' },
    { name: 'docsStatus', definition: 'VARCHAR(100)' },
    { name: 'warranty', definition: 'VARCHAR(50)' },
    { name: 'accidents', definition: 'BOOLEAN DEFAULT FALSE' },
    { name: 'paintOriginal', definition: 'VARCHAR(50)' },
    { name: 'tiresCondition', definition: 'VARCHAR(50)' },
    { name: 'lastMaintenance', definition: 'VARCHAR(50)' },
    { name: 'isPromotion', definition: 'BOOLEAN DEFAULT FALSE' },
    { name: 'created_at', definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
    { name: 'updated_at', definition: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' }
];

// Colunas que precisam ser corrigidas para VARCHAR (caso estejam com tipo errado)
const columnsToFix = {
    'warranty': 'VARCHAR(50)',
    'lastMaintenance': 'VARCHAR(50)',
    'consumption': 'VARCHAR(50)',
    'paintOriginal': 'VARCHAR(50)',
    'tiresCondition': 'VARCHAR(50)',
    'docsStatus': 'VARCHAR(100)',
    'engine': 'VARCHAR(100)',
    'fuelType': 'VARCHAR(50)',
    'transmission': 'VARCHAR(50)',
    'color': 'VARCHAR(100)'
};

async function migrate() {
    let connection;

    try {
        console.log('🔌 Conectando ao MySQL...');
        connection = await mysql.createConnection(config);

        // Buscar colunas existentes com seus tipos
        console.log('📋 Verificando colunas existentes...');
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME, DATA_TYPE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'vehicles'
        `, [config.database]);

        const existingColumns = columns.map(c => c.COLUMN_NAME.toLowerCase());
        const columnTypes = {};
        columns.forEach(c => {
            columnTypes[c.COLUMN_NAME.toLowerCase()] = c.DATA_TYPE.toLowerCase();
        });
        console.log(`   Colunas encontradas: ${existingColumns.join(', ')}`);

        // Corrigir colunas que devem ser VARCHAR
        let fixedCount = 0;
        const typesToFix = ['date', 'datetime', 'decimal', 'int', 'float', 'double', 'tinyint', 'smallint', 'mediumint', 'bigint'];
        for (const [colName, targetType] of Object.entries(columnsToFix)) {
            if (existingColumns.includes(colName.toLowerCase())) {
                const currentType = columnTypes[colName.toLowerCase()];
                if (typesToFix.includes(currentType)) {
                    console.log(`🔧 Corrigindo tipo da coluna ${colName}: ${currentType} → ${targetType}`);
                    await connection.query(`ALTER TABLE vehicles MODIFY COLUMN ${colName} ${targetType}`);
                    fixedCount++;
                }
            }
        }

        if (fixedCount > 0) {
            console.log(`   ${fixedCount} coluna(s) corrigida(s) de DATE para VARCHAR`);
        }

        // Adicionar colunas faltantes
        let addedCount = 0;
        for (const col of requiredColumns) {
            if (!existingColumns.includes(col.name.toLowerCase())) {
                console.log(`➕ Adicionando coluna: ${col.name}`);
                await connection.query(`ALTER TABLE vehicles ADD COLUMN ${col.name} ${col.definition}`);
                addedCount++;
            }
        }

        if (addedCount === 0 && fixedCount === 0) {
            console.log('✅ Banco de dados já está atualizado!');
        } else {
            console.log(`\n✅ Migração concluída!`);
            if (addedCount > 0) console.log(`   ${addedCount} coluna(s) adicionada(s)`);
            if (fixedCount > 0) console.log(`   ${fixedCount} coluna(s) corrigida(s)`);
        }

    } catch (error) {
        console.error('❌ Erro durante migração:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

migrate();
