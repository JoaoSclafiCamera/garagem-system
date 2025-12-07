// Script de Seed - Insere veículos de exemplo
// Execute: node database/seed.js

require('dotenv').config();
const mysql = require('mysql2/promise');

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'garagem'
};

// Veículos mock com dados realistas
const mockVehicles = [
    {
        name: 'Civic Touring',
        brand: 'Honda',
        price: 179900.00,
        year: 2023,
        kms: 8500,
        color: 'Branco Pérola',
        description: 'Sedã turbo com pacote Honda Sensing completo. Único dono, revisões em concessionária. Teto solar elétrico, bancos em couro, multimídia com CarPlay e Android Auto.',
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
            'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800'
        ]),
        features: JSON.stringify(['Teto solar', 'Bancos em couro', 'Honda Sensing', 'CarPlay/Android Auto', 'Câmera 360°', 'Piloto automático adaptativo']),
        fuelType: 'Gasolina',
        transmission: 'Automático',
        doors: 4,
        engine: '1.5 Turbo',
        power: 173,
        consumption: '13 km/l',
        docsStatus: 'IPVA pago',
        warranty: '2026-12-31',
        accidents: false,
        paintOriginal: 'Sim',
        tiresCondition: 'Novos',
        lastMaintenance: '2024-08-10',
        isPromotion: true
    },
    {
        name: 'Corolla Cross XRX Hybrid',
        brand: 'Toyota',
        price: 219900.00,
        year: 2024,
        kms: 3200,
        color: 'Prata Supernova',
        description: 'SUV híbrido topo de linha. Economia excepcional com tecnologia de ponta. Pacote Safety Sense completo, teto solar panorâmico.',
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
            'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800'
        ]),
        features: JSON.stringify(['Teto panorâmico', 'Bancos elétricos', 'Carregador por indução', 'JBL Premium Sound', 'Head-up display']),
        fuelType: 'Híbrido',
        transmission: 'CVT',
        doors: 4,
        engine: '1.8 Hybrid',
        power: 122,
        consumption: '18 km/l',
        docsStatus: 'IPVA pago',
        warranty: '2027-06-30',
        accidents: false,
        paintOriginal: 'Sim',
        tiresCondition: 'Originais',
        lastMaintenance: '2024-06-18',
        isPromotion: false
    },
    {
        name: 'Compass Limited T270',
        brand: 'Jeep',
        price: 199900.00,
        year: 2023,
        kms: 12800,
        color: 'Cinza Granite',
        description: 'SUV médio com pacote ADAS completo. Interior premium com acabamento em couro, multimídia 10.1" com navegação.',
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800'
        ]),
        features: JSON.stringify(['Teto panorâmico', 'Bancos ventilados', 'Som Beats', 'Park Assist', 'Modo Off-road']),
        fuelType: 'Flex',
        transmission: 'Automático',
        doors: 4,
        engine: '1.3 Turbo',
        power: 185,
        consumption: '11 km/l',
        docsStatus: 'IPVA pago',
        warranty: '2026-02-15',
        accidents: false,
        paintOriginal: 'Sim',
        tiresCondition: 'Semi-novos',
        lastMaintenance: '2024-07-20',
        isPromotion: false
    },
    {
        name: '320i M Sport',
        brand: 'BMW',
        price: 289900.00,
        year: 2023,
        kms: 15000,
        color: 'Preto Safira',
        description: 'Sedã esportivo alemão com pacote M Sport. Performance excepcional com conforto premium. Tração traseira, suspensão adaptativa.',
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
            'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'
        ]),
        features: JSON.stringify(['Pacote M Sport', 'Suspensão adaptativa', 'Teto solar', 'Harman Kardon', 'Live Cockpit Professional', 'Assistente de estacionamento']),
        fuelType: 'Gasolina',
        transmission: 'Automático',
        doors: 4,
        engine: '2.0 Turbo',
        power: 184,
        consumption: '12 km/l',
        docsStatus: 'IPVA pago',
        warranty: '2026-08-20',
        accidents: false,
        paintOriginal: 'Sim',
        tiresCondition: 'Semi-novos',
        lastMaintenance: '2024-05-15',
        isPromotion: true
    },
    {
        name: 'C 200 Avantgarde',
        brand: 'Mercedes-Benz',
        price: 319900.00,
        year: 2023,
        kms: 9800,
        color: 'Branco Polar',
        description: 'Sedã de luxo com acabamento impecável. Motor turbo eficiente, interior em couro Artico, sistema MBUX de última geração.',
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
            'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800'
        ]),
        features: JSON.stringify(['MBUX', 'Couro Artico', 'Burmester Sound', 'Ambient lighting', 'Teto solar', 'Assistente de direção']),
        fuelType: 'Gasolina',
        transmission: 'Automático',
        doors: 4,
        engine: '2.0 Turbo',
        power: 204,
        consumption: '11 km/l',
        docsStatus: 'IPVA pago',
        warranty: '2026-11-30',
        accidents: false,
        paintOriginal: 'Sim',
        tiresCondition: 'Novos',
        lastMaintenance: '2024-09-01',
        isPromotion: false
    },
    {
        name: 'Polo Track',
        brand: 'Volkswagen',
        price: 79900.00,
        year: 2024,
        kms: 0,
        color: 'Vermelho Sunset',
        description: 'Hatch compacto 0km! Motor 1.0 MPI econômico, ideal para cidade. Ar condicionado, direção elétrica, multimídia.',
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800',
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800'
        ]),
        features: JSON.stringify(['Ar condicionado', 'Direção elétrica', 'VW Play', 'Computador de bordo', 'Airbags frontais']),
        fuelType: 'Flex',
        transmission: 'Manual',
        doors: 4,
        engine: '1.0 MPI',
        power: 84,
        consumption: '14 km/l',
        docsStatus: 'Documentação em dia',
        warranty: '2027-12-31',
        accidents: false,
        paintOriginal: 'Sim',
        tiresCondition: 'Novos',
        lastMaintenance: '',
        isPromotion: true
    },
    {
        name: 'Onix Premier',
        brand: 'Chevrolet',
        price: 99900.00,
        year: 2023,
        kms: 22000,
        color: 'Azul Seeker',
        description: 'Hatch turbo completo. Motor 1.0 turbo com ótimo desempenho, acabamento top de linha com MyLink e OnStar.',
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
            'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800'
        ]),
        features: JSON.stringify(['MyLink 8"', 'OnStar', 'Câmera de ré', 'Sensor de estacionamento', 'Piloto automático', 'Bancos em couro']),
        fuelType: 'Flex',
        transmission: 'Automático',
        doors: 4,
        engine: '1.0 Turbo',
        power: 116,
        consumption: '13 km/l',
        docsStatus: 'IPVA pago',
        warranty: '2026-03-15',
        accidents: false,
        paintOriginal: 'Sim',
        tiresCondition: 'Semi-novos',
        lastMaintenance: '2024-04-20',
        isPromotion: false
    },
    {
        name: 'HB20S Platinum',
        brand: 'Hyundai',
        price: 109900.00,
        year: 2024,
        kms: 5600,
        color: 'Cinza Silk',
        description: 'Sedã compacto topo de linha. Motor turbo, câmbio automático, central multimídia 8" com Bluelink.',
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800'
        ]),
        features: JSON.stringify(['Bluelink', 'Carregador wireless', 'Ar digital', 'Câmera de ré', 'Partida por botão', 'Chave presencial']),
        fuelType: 'Flex',
        transmission: 'Automático',
        doors: 4,
        engine: '1.0 Turbo GDI',
        power: 120,
        consumption: '13.5 km/l',
        docsStatus: 'IPVA pago',
        warranty: '2029-01-15',
        accidents: false,
        paintOriginal: 'Sim',
        tiresCondition: 'Originais',
        lastMaintenance: '2024-10-05',
        isPromotion: false
    },
    {
        name: 'Hilux SRX',
        brand: 'Toyota',
        price: 339900.00,
        year: 2023,
        kms: 28000,
        color: 'Branco Lunar',
        description: 'Picape diesel 4x4 top de linha. Robustez e conforto para qualquer terreno. Caçamba com capota marítima.',
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800',
            'https://images.unsplash.com/photo-1612544448445-b8232cff3b4c?w=800'
        ]),
        features: JSON.stringify(['Tração 4x4', 'Capota marítima', 'Controle de tração', 'Bancos em couro', '7 airbags', 'Multimídia 8"']),
        fuelType: 'Diesel',
        transmission: 'Automático',
        doors: 4,
        engine: '2.8 Turbo Diesel',
        power: 204,
        consumption: '10 km/l',
        docsStatus: 'IPVA pago',
        warranty: '2026-05-20',
        accidents: false,
        paintOriginal: 'Sim',
        tiresCondition: 'Semi-novos',
        lastMaintenance: '2024-08-25',
        isPromotion: false
    },
    {
        name: 'Pulse Impetus',
        brand: 'Fiat',
        price: 119900.00,
        year: 2024,
        kms: 8900,
        color: 'Vermelho Amore',
        description: 'SUV compacto turbo flex. Design moderno, central multimídia 10.1" com wireless CarPlay e Android Auto.',
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
            'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800'
        ]),
        features: JSON.stringify(['Wireless CarPlay', 'Teto biton', 'Keyless', 'Ar digital', 'Multimídia 10.1"', 'Câmera de ré HD']),
        fuelType: 'Flex',
        transmission: 'Automático',
        doors: 4,
        engine: '1.0 Turbo',
        power: 130,
        consumption: '12 km/l',
        docsStatus: 'IPVA pago',
        warranty: '2027-02-28',
        accidents: false,
        paintOriginal: 'Sim',
        tiresCondition: 'Originais',
        lastMaintenance: '2024-09-15',
        isPromotion: true
    },
    {
        name: 'T-Cross Highline',
        brand: 'Volkswagen',
        price: 159900.00,
        year: 2023,
        kms: 18500,
        color: 'Azul Biscay',
        description: 'SUV compacto premium. Motor TSI turbo, interior refinado com acabamento em couro, teto solar panorâmico.',
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800',
            'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800'
        ]),
        features: JSON.stringify(['Teto panorâmico', 'Active Info Display', 'Park Assist', 'Climatronic', 'Bancos em couro', 'Beats Audio']),
        fuelType: 'Flex',
        transmission: 'Automático',
        doors: 4,
        engine: '1.4 TSI',
        power: 150,
        consumption: '11 km/l',
        docsStatus: 'IPVA pago',
        warranty: '2026-07-10',
        accidents: false,
        paintOriginal: 'Sim',
        tiresCondition: 'Semi-novos',
        lastMaintenance: '2024-06-30',
        isPromotion: false
    },
    {
        name: 'Tracker Premier',
        brand: 'Chevrolet',
        price: 169900.00,
        year: 2024,
        kms: 4200,
        color: 'Preto Ouro Negro',
        description: 'SUV compacto completo. Wi-Fi nativo, OnStar com assistência 24h, motor turbo e câmbio automático de 6 marchas.',
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
            'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800'
        ]),
        features: JSON.stringify(['Wi-Fi nativo', 'OnStar', 'Teto solar', 'Bancos aquecidos', 'Alerta de ponto cego', 'Frenagem autônoma']),
        fuelType: 'Flex',
        transmission: 'Automático',
        doors: 4,
        engine: '1.2 Turbo',
        power: 133,
        consumption: '12 km/l',
        docsStatus: 'IPVA pago',
        warranty: '2027-04-20',
        accidents: false,
        paintOriginal: 'Sim',
        tiresCondition: 'Novos',
        lastMaintenance: '2024-11-01',
        isPromotion: false
    },
    {
        name: 'Creta Ultimate',
        brand: 'Hyundai',
        price: 179900.00,
        year: 2024,
        kms: 6800,
        color: 'Verde Amazon',
        description: 'SUV compacto premium. Nova geração com design arrojado, motor turbo e tecnologia Bluelink conectada.',
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800',
            'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800'
        ]),
        features: JSON.stringify(['Bluelink', 'Teto solar', 'Cluster digital', 'Câmera 360°', 'Bancos ventilados', 'Carregador wireless']),
        fuelType: 'Flex',
        transmission: 'Automático',
        doors: 4,
        engine: '1.0 Turbo GDI',
        power: 120,
        consumption: '12.5 km/l',
        docsStatus: 'IPVA pago',
        warranty: '2029-03-10',
        accidents: false,
        paintOriginal: 'Sim',
        tiresCondition: 'Originais',
        lastMaintenance: '2024-10-20',
        isPromotion: true
    },
    {
        name: 'Ranger Limited',
        brand: 'Ford',
        price: 299900.00,
        year: 2024,
        kms: 12000,
        color: 'Cinza Carbonizado',
        description: 'Picape média diesel. Nova geração com design robusto, motor bi-turbo e tecnologia SYNC 4.',
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
            'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800'
        ]),
        features: JSON.stringify(['SYNC 4', 'Tração 4x4', 'Capota elétrica', 'Matrix LED', 'B&O Sound', 'Pro Trailer Backup']),
        fuelType: 'Diesel',
        transmission: 'Automático',
        doors: 4,
        engine: '3.0 V6 Bi-Turbo',
        power: 250,
        consumption: '9 km/l',
        docsStatus: 'IPVA pago',
        warranty: '2027-08-15',
        accidents: false,
        paintOriginal: 'Sim',
        tiresCondition: 'Originais',
        lastMaintenance: '2024-09-28',
        isPromotion: false
    },
    {
        name: 'Kicks Exclusive',
        brand: 'Nissan',
        price: 139900.00,
        year: 2023,
        kms: 21000,
        color: 'Laranja Atacama',
        description: 'SUV compacto biton. Design marcante, motor e-Power e tecnologia Nissan Intelligent Mobility.',
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800'
        ]),
        features: JSON.stringify(['e-Power', 'ProPILOT', 'Teto biton', 'Around View', 'NissanConnect', 'Alerta de fadiga']),
        fuelType: 'Híbrido',
        transmission: 'CVT',
        doors: 4,
        engine: '1.6 e-Power',
        power: 129,
        consumption: '20 km/l',
        docsStatus: 'IPVA pago',
        warranty: '2026-09-30',
        accidents: false,
        paintOriginal: 'Sim',
        tiresCondition: 'Semi-novos',
        lastMaintenance: '2024-07-12',
        isPromotion: false
    }
];

async function seed() {
    let connection;

    try {
        console.log('🔌 Conectando ao MySQL...');
        connection = await mysql.createConnection(config);

        // Limpar tabela (opcional - comente se quiser manter dados existentes)
        console.log('🗑️  Limpando veículos existentes...');
        await connection.query('DELETE FROM vehicles');

        // Inserir veículos
        console.log('🚗 Inserindo veículos...\n');

        for (const vehicle of mockVehicles) {
            const columns = Object.keys(vehicle).join(', ');
            const placeholders = Object.keys(vehicle).map(() => '?').join(', ');
            const values = Object.values(vehicle);

            await connection.query(
                `INSERT INTO vehicles (${columns}) VALUES (${placeholders})`,
                values
            );
            console.log(`   ✅ ${vehicle.brand} ${vehicle.name}`);
        }

        console.log(`\n🎉 ${mockVehicles.length} veículos inseridos com sucesso!`);
        console.log('\n📋 Resumo:');

        // Agrupar por marca
        const brands = {};
        mockVehicles.forEach(v => {
            brands[v.brand] = (brands[v.brand] || 0) + 1;
        });
        Object.entries(brands).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
            console.log(`   ${brand}: ${count} veículo(s)`);
        });

        const promotions = mockVehicles.filter(v => v.isPromotion).length;
        console.log(`\n   🏷️  Em promoção: ${promotions}`);
        console.log(`   💰 Faixa de preço: R$ ${Math.min(...mockVehicles.map(v => v.price)).toLocaleString('pt-BR')} - R$ ${Math.max(...mockVehicles.map(v => v.price)).toLocaleString('pt-BR')}`);

    } catch (error) {
        console.error('❌ Erro durante seed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

seed();
