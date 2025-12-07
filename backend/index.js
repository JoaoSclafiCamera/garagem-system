require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// ============================================
// Configuração de Segurança
// ============================================

// CORS Configuração
const allowedOrigins = process.env.ALLOWED_ORIGINS;
const corsOptions = {
    origin: allowedOrigins === '*'
        ? true
        : (allowedOrigins
            ? allowedOrigins.split(',').map(o => o.trim())
            : ['http://localhost:3000', 'http://127.0.0.1:3000']),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Rate Limiting - Geral
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requisições por IP
    message: { error: 'Muitas requisições. Tente novamente em 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false
});
app.use(generalLimiter);

// Rate Limiting - Login (mais restritivo)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 tentativas de login
    message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false
});

// ============================================
// Configuração do Banco de Dados (Connection Pool)
// ============================================
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'garagem',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Adiciona SSL se estiver em produção (TiDB Cloud requer SSL)
if (process.env.NODE_ENV === 'production') {
    dbConfig.ssl = { rejectUnauthorized: true };
}

const db = mysql.createPool(dbConfig);

const SECRET_KEY = process.env.JWT_SECRET || 'TROQUE_ESTA_CHAVE_EM_PRODUCAO_32chars';
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Testar conexão inicial
db.getConnection((err, connection) => {
    if (err) {
        console.error(`[${new Date().toISOString()}] ERRO: Falha ao conectar ao banco:`, err.message);
        return;
    }
    console.log(`[${new Date().toISOString()}] INFO: Conectado ao MySQL (${NODE_ENV})`);
    connection.release();
});

// ============================================
// Logging Middleware
// ============================================
const logger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
        if (res.statusCode >= 400) {
            console.error(log);
        } else {
            console.log(log);
        }
    });
    next();
};
app.use(logger);

// ============================================
// Middleware de Autenticação JWT
// ============================================
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ error: 'Token mal formatado' });
    }

    try {
        const decoded = jwt.verify(parts[1], SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        return res.status(401).json({ error: 'Token inválido' });
    }
};

// ============================================
// Validação de Inputs
// ============================================
const validateLogin = (username, password) => {
    const errors = [];
    if (!username || typeof username !== 'string') {
        errors.push('Username é obrigatório');
    } else if (username.length < 3 || username.length > 50) {
        errors.push('Username deve ter entre 3 e 50 caracteres');
    }
    if (!password || typeof password !== 'string') {
        errors.push('Senha é obrigatória');
    } else if (password.length < 4) {
        errors.push('Senha deve ter no mínimo 4 caracteres');
    }
    return errors;
};

const validateVehicle = (data) => {
    const errors = [];
    if (!data.name || typeof data.name !== 'string' || data.name.length < 2) {
        errors.push('Nome do veículo é obrigatório (mínimo 2 caracteres)');
    }
    if (!data.brand || typeof data.brand !== 'string') {
        errors.push('Marca é obrigatória');
    }
    if (!data.price || isNaN(Number(data.price)) || Number(data.price) < 0) {
        errors.push('Preço deve ser um número positivo');
    }
    if (!data.year || isNaN(Number(data.year)) || Number(data.year) < 1900 || Number(data.year) > 2030) {
        errors.push('Ano deve ser entre 1900 e 2030');
    }
    return errors;
};

// ============================================
// Health Check
// ============================================
app.get('/health', (req, res) => {
    db.ping((err) => {
        if (err) {
            return res.status(503).json({
                status: 'unhealthy',
                database: 'disconnected',
                timestamp: new Date().toISOString()
            });
        }
        res.json({
            status: 'healthy',
            database: 'connected',
            environment: NODE_ENV,
            timestamp: new Date().toISOString()
        });
    });
});

// ============================================
// Rotas de Autenticação
// ============================================
app.post('/auth/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body;

    // Validação
    const errors = validateLogin(username, password);
    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(', ') });
    }

    try {
        const query = 'SELECT * FROM users WHERE username = ?';
        db.query(query, [username], async (err, result) => {
            if (err) {
                console.error(`[${new Date().toISOString()}] ERRO: Login DB:`, err.message);
                return res.status(500).json({ error: 'Erro interno do servidor' });
            }

            if (result.length === 0) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            const user = result[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username },
                SECRET_KEY,
                { expiresIn: '8h' }
            );

            res.json({
                token,
                user: { id: user.id, username: user.username },
                expiresIn: '8h'
            });
        });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] ERRO: Login:`, error.message);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/auth/verify', authMiddleware, (req, res) => {
    res.json({ valid: true, user: req.user });
});

// ============================================
// Rotas de Catálogo (Públicas)
// ============================================

// Buscar veículos com paginação, busca e ordenação
app.get('/catalogo', (req, res) => {
    const {
        page = 1,
        limit = 12,
        search = '',
        brand = '',
        minPrice = '',
        maxPrice = '',
        minYear = '',
        maxYear = '',
        sort = 'id',
        order = 'DESC'
    } = req.query;

    // Validar e sanitizar parâmetros
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
    const offset = (pageNum - 1) * limitNum;

    // Ordenação permitida
    const allowedSorts = ['id', 'price', 'year', 'kms', 'name', 'brand'];
    const allowedOrders = ['ASC', 'DESC'];
    const sortColumn = allowedSorts.includes(sort) ? sort : 'id';
    const sortOrder = allowedOrders.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';

    // Construir query com filtros
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
        whereClause += ' AND (name LIKE ? OR brand LIKE ? OR description LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
    }

    if (brand) {
        whereClause += ' AND brand = ?';
        params.push(brand);
    }

    if (minPrice) {
        whereClause += ' AND price >= ?';
        params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
        whereClause += ' AND price <= ?';
        params.push(parseFloat(maxPrice));
    }

    if (minYear) {
        whereClause += ' AND year >= ?';
        params.push(parseInt(minYear));
    }

    if (maxYear) {
        whereClause += ' AND year <= ?';
        params.push(parseInt(maxYear));
    }

    // Query para contar total
    const countQuery = `SELECT COUNT(*) as total FROM vehicles ${whereClause}`;

    db.query(countQuery, params, (err, countResult) => {
        if (err) {
            console.error(`[${new Date().toISOString()}] ERRO: Count veículos:`, err.message);
            return res.status(500).json({ error: 'Erro ao buscar catálogo' });
        }

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limitNum);

        // Query principal com paginação
        const query = `
            SELECT * FROM vehicles
            ${whereClause}
            ORDER BY ${sortColumn} ${sortOrder}
            LIMIT ? OFFSET ?
        `;

        db.query(query, [...params, limitNum, offset], (err, result) => {
            if (err) {
                console.error(`[${new Date().toISOString()}] ERRO: Buscar veículos:`, err.message);
                return res.status(500).json({ error: 'Erro ao buscar catálogo' });
            }

            const vehicles = result.map(vehicle => ({
                ...vehicle,
                images: parseJSON(vehicle.images),
                features: parseJSON(vehicle.features)
            }));

            res.json({
                data: vehicles,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages,
                    hasNext: pageNum < totalPages,
                    hasPrev: pageNum > 1
                }
            });
        });
    });
});

// Buscar todas as marcas (para filtros)
app.get('/catalogo/brands', (req, res) => {
    const query = 'SELECT DISTINCT brand FROM vehicles ORDER BY brand ASC';
    db.query(query, (err, result) => {
        if (err) {
            console.error(`[${new Date().toISOString()}] ERRO: Buscar marcas:`, err.message);
            return res.status(500).json({ error: 'Erro ao buscar marcas' });
        }
        res.json(result.map(r => r.brand));
    });
});

// Buscar veículo por ID
app.get('/detalhes/:id', (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    const query = 'SELECT * FROM vehicles WHERE id = ?';
    db.query(query, [parseInt(id)], (err, result) => {
        if (err) {
            console.error(`[${new Date().toISOString()}] ERRO: Buscar veículo ${id}:`, err.message);
            return res.status(500).json({ error: 'Erro ao buscar veículo' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Veículo não encontrado' });
        }

        const vehicle = {
            ...result[0],
            images: parseJSON(result[0].images),
            features: parseJSON(result[0].features)
        };

        res.json(vehicle);
    });
});

// ============================================
// Rotas de Catálogo (Protegidas - Admin)
// ============================================

// Adicionar veículo
app.post('/catalogo', authMiddleware, (req, res) => {
    const errors = validateVehicle(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(', ') });
    }

    const {
        name, brand, price, kms, description, year, color,
        images, features, fuelType, transmission, doors,
        engine, power, consumption, docsStatus, warranty,
        accidents, paintOriginal, tiresCondition, lastMaintenance, isPromotion
    } = req.body;

    const query = `
        INSERT INTO vehicles (
            name, brand, price, kms, description, year, color,
            images, features, fuelType, transmission, doors,
            engine, power, consumption, docsStatus, warranty,
            accidents, paintOriginal, tiresCondition, lastMaintenance, isPromotion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        name.trim(),
        brand.trim(),
        parseFloat(price),
        parseInt(kms) || 0,
        description || '',
        parseInt(year),
        color || '',
        JSON.stringify(images || []),
        JSON.stringify(features || []),
        fuelType || '',
        transmission || '',
        parseInt(doors) || 4,
        engine || '',
        parseInt(power) || 0,
        consumption || '',
        docsStatus || '',
        warranty || '',
        Boolean(accidents),
        paintOriginal || '',
        tiresCondition || '',
        lastMaintenance || '',
        Boolean(isPromotion)
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error(`[${new Date().toISOString()}] ERRO: Criar veículo:`, err.message);
            return res.status(500).json({ error: 'Erro ao adicionar veículo' });
        }

        console.log(`[${new Date().toISOString()}] INFO: Veículo criado ID=${result.insertId} por ${req.user.username}`);

        res.status(201).json({
            message: 'Veículo adicionado com sucesso',
            id: result.insertId
        });
    });
});

// Atualizar veículo
app.put('/catalogo/:id', authMiddleware, (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    const errors = validateVehicle(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join(', ') });
    }

    const {
        name, brand, price, kms, description, year, color,
        images, features, fuelType, transmission, doors,
        engine, power, consumption, docsStatus, warranty,
        accidents, paintOriginal, tiresCondition, lastMaintenance, isPromotion
    } = req.body;

    const query = `
        UPDATE vehicles SET
            name = ?, brand = ?, price = ?, kms = ?, description = ?, year = ?, color = ?,
            images = ?, features = ?, fuelType = ?, transmission = ?, doors = ?,
            engine = ?, power = ?, consumption = ?, docsStatus = ?, warranty = ?,
            accidents = ?, paintOriginal = ?, tiresCondition = ?, lastMaintenance = ?, isPromotion = ?
        WHERE id = ?
    `;

    const values = [
        name.trim(),
        brand.trim(),
        parseFloat(price),
        parseInt(kms) || 0,
        description || '',
        parseInt(year),
        color || '',
        JSON.stringify(images || []),
        JSON.stringify(features || []),
        fuelType || '',
        transmission || '',
        parseInt(doors) || 4,
        engine || '',
        parseInt(power) || 0,
        consumption || '',
        docsStatus || '',
        warranty || '',
        Boolean(accidents),
        paintOriginal || '',
        tiresCondition || '',
        lastMaintenance || '',
        Boolean(isPromotion),
        parseInt(id)
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error(`[${new Date().toISOString()}] ERRO: Atualizar veículo ${id}:`, err.message);
            return res.status(500).json({ error: 'Erro ao atualizar veículo' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Veículo não encontrado' });
        }

        console.log(`[${new Date().toISOString()}] INFO: Veículo ID=${id} atualizado por ${req.user.username}`);
        res.json({ message: 'Veículo atualizado com sucesso' });
    });
});

// Remover veículo
app.delete('/catalogo/:id', authMiddleware, (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    const query = 'DELETE FROM vehicles WHERE id = ?';
    db.query(query, [parseInt(id)], (err, result) => {
        if (err) {
            console.error(`[${new Date().toISOString()}] ERRO: Deletar veículo ${id}:`, err.message);
            return res.status(500).json({ error: 'Erro ao remover veículo' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Veículo não encontrado' });
        }

        console.log(`[${new Date().toISOString()}] INFO: Veículo ID=${id} removido por ${req.user.username}`);
        res.json({ message: 'Veículo removido com sucesso' });
    });
});

// ============================================
// Funções Auxiliares
// ============================================
function parseJSON(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// ============================================
// Error Handler Global
// ============================================
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ERRO NÃO TRATADO:`, err.stack);
    res.status(500).json({
        error: NODE_ENV === 'production'
            ? 'Erro interno do servidor'
            : err.message
    });
});

// Rota 404
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// ============================================
// Iniciar Servidor
// ============================================
app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] INFO: Servidor rodando na porta ${PORT} (${NODE_ENV})`);
    if (SECRET_KEY.includes('TROQUE') || SECRET_KEY.includes('padrao')) {
        console.warn(`[${new Date().toISOString()}] AVISO: JWT_SECRET não configurado! Troque em produção.`);
    }
});
