// API Service - Conexão com o Backend Real
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'token';

// ============================================
// Funções auxiliares
// ============================================
const getToken = () => localStorage.getItem(TOKEN_KEY);

const getHeaders = (authenticated = false) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (authenticated) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(error.message || error.error || 'Erro na requisição');
    }
    return response.json();
};

// ============================================
// Autenticação
// ============================================
export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ username, password }),
    });

    const data = await handleResponse(response);
    localStorage.setItem(TOKEN_KEY, data.token);
    return data.token;
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const verifyToken = async () => {
    const token = getToken();
    if (!token) return false;

    try {
        const response = await fetch(`${API_URL}/auth/verify`, {
            headers: getHeaders(true),
        });
        return response.ok;
    } catch {
        return false;
    }
};

// ============================================
// Veículos - Operações Públicas
// ============================================
export const getVehicles = async (params = {}) => {
    // Buscar todos os veículos por padrão (limite alto)
    const defaultParams = { limit: 1000, ...params };
    const queryString = new URLSearchParams(defaultParams).toString();
    const url = `${API_URL}/catalogo?${queryString}`;

    const response = await fetch(url, {
        headers: getHeaders(),
    });
    const result = await handleResponse(response);

    // Backend retorna { data: [...], pagination: {...} }
    // Retorna apenas o array para compatibilidade
    return Array.isArray(result) ? result : (result.data || []);
};

// Versão com paginação completa
export const getVehiclesPaginated = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_URL}/catalogo?${queryString}` : `${API_URL}/catalogo`;

    const response = await fetch(url, {
        headers: getHeaders(),
    });
    return handleResponse(response);
};

export const getVehicleById = async (id) => {
    const response = await fetch(`${API_URL}/detalhes/${id}`, {
        headers: getHeaders(),
    });
    return handleResponse(response);
};

// ============================================
// Veículos - Operações Protegidas (Admin)
// ============================================
export const createVehicle = async (vehicleData) => {
    const response = await fetch(`${API_URL}/catalogo`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(vehicleData),
    });
    return handleResponse(response);
};

export const updateVehicle = async (id, vehicleData) => {
    const response = await fetch(`${API_URL}/catalogo/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(vehicleData),
    });
    return handleResponse(response);
};

export const deleteVehicle = async (id) => {
    const response = await fetch(`${API_URL}/catalogo/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
    });
    return handleResponse(response);
};

// ============================================
// Normalização de dados (compatibilidade)
// ============================================
const normalizeVehicle = (vehicle) => ({
    images: [],
    features: [],
    price: 0,
    year: new Date().getFullYear(),
    kms: 0,
    color: 'Prata',
    fuelType: '',
    transmission: '',
    doors: 4,
    engine: '',
    power: 0,
    consumption: '',
    docsStatus: '',
    warranty: '',
    accidents: false,
    paintOriginal: '',
    tiresCondition: '',
    lastMaintenance: '',
    description: '',
    isPromotion: false,
    ...vehicle
});

// Exportar versão com normalização
export const getVehiclesNormalized = async () => {
    const vehicles = await getVehicles();
    return vehicles.map(normalizeVehicle);
};

export const getVehicleByIdNormalized = async (id) => {
    const vehicle = await getVehicleById(id);
    return normalizeVehicle(vehicle);
};
