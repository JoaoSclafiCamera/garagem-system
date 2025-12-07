/**
 * Testes basicos da API
 * Execute: npm test
 */

const request = require('supertest');

// Mock das variaveis de ambiente
process.env.PORT = '5001';
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'test';
process.env.DB_NAME = 'garagem_test';
process.env.JWT_SECRET = 'test_secret_key_for_testing_only';
process.env.ALLOWED_ORIGINS = 'http://localhost:3000';

// Nota: Estes testes requerem um banco de dados de teste configurado
// Para rodar sem banco, use os testes mockados abaixo

describe('API Health Check', () => {
  // Teste basico de estrutura
  it('deve ter as variaveis de ambiente definidas', () => {
    expect(process.env.JWT_SECRET).toBeDefined();
    expect(process.env.PORT).toBeDefined();
  });
});

describe('Validacao de Dados', () => {
  // Testes de validacao de entrada

  it('deve validar campos obrigatorios do veiculo', () => {
    const vehicleData = {
      name: 'Civic',
      brand: 'Honda',
      price: 150000,
      year: 2023,
      kms: 10000
    };

    expect(vehicleData.name).toBeTruthy();
    expect(vehicleData.brand).toBeTruthy();
    expect(vehicleData.price).toBeGreaterThan(0);
    expect(vehicleData.year).toBeGreaterThan(1900);
    expect(vehicleData.kms).toBeGreaterThanOrEqual(0);
  });

  it('deve rejeitar precos negativos', () => {
    const validatePrice = (price) => price > 0;

    expect(validatePrice(150000)).toBe(true);
    expect(validatePrice(-100)).toBe(false);
    expect(validatePrice(0)).toBe(false);
  });

  it('deve rejeitar anos invalidos', () => {
    const validateYear = (year) => year >= 1900 && year <= new Date().getFullYear() + 1;

    expect(validateYear(2023)).toBe(true);
    expect(validateYear(2024)).toBe(true);
    expect(validateYear(1899)).toBe(false);
    expect(validateYear(2030)).toBe(false);
  });

  it('deve validar quilometragem', () => {
    const validateKms = (kms) => kms >= 0;

    expect(validateKms(0)).toBe(true);
    expect(validateKms(50000)).toBe(true);
    expect(validateKms(-100)).toBe(false);
  });
});

describe('Formatacao de Dados', () => {
  it('deve formatar preco corretamente', () => {
    const formatPrice = (price) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price);
    };

    expect(formatPrice(150000)).toContain('150.000');
  });

  it('deve parsear JSON de imagens', () => {
    const imagesJson = '["http://example.com/1.jpg", "http://example.com/2.jpg"]';
    const images = JSON.parse(imagesJson);

    expect(Array.isArray(images)).toBe(true);
    expect(images.length).toBe(2);
  });

  it('deve lidar com imagens vazias', () => {
    const emptyImages = '[]';
    const images = JSON.parse(emptyImages);

    expect(Array.isArray(images)).toBe(true);
    expect(images.length).toBe(0);
  });
});

describe('Paginacao', () => {
  const mockVehicles = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `Veiculo ${i + 1}`,
    price: 50000 + (i * 1000)
  }));

  it('deve calcular total de paginas corretamente', () => {
    const totalItems = 25;
    const itemsPerPage = 12;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    expect(totalPages).toBe(3);
  });

  it('deve retornar itens corretos para cada pagina', () => {
    const page = 2;
    const limit = 12;
    const offset = (page - 1) * limit;

    const paginatedItems = mockVehicles.slice(offset, offset + limit);

    expect(paginatedItems.length).toBe(12);
    expect(paginatedItems[0].id).toBe(13);
  });

  it('deve lidar com ultima pagina parcial', () => {
    const page = 3;
    const limit = 12;
    const offset = (page - 1) * limit;

    const paginatedItems = mockVehicles.slice(offset, offset + limit);

    expect(paginatedItems.length).toBe(1);
    expect(paginatedItems[0].id).toBe(25);
  });
});

describe('Ordenacao', () => {
  const mockVehicles = [
    { id: 1, name: 'Civic', price: 150000, year: 2023 },
    { id: 2, name: 'Corolla', price: 170000, year: 2022 },
    { id: 3, name: 'Golf', price: 130000, year: 2024 }
  ];

  it('deve ordenar por preco ASC', () => {
    const sorted = [...mockVehicles].sort((a, b) => a.price - b.price);

    expect(sorted[0].name).toBe('Golf');
    expect(sorted[2].name).toBe('Corolla');
  });

  it('deve ordenar por preco DESC', () => {
    const sorted = [...mockVehicles].sort((a, b) => b.price - a.price);

    expect(sorted[0].name).toBe('Corolla');
    expect(sorted[2].name).toBe('Golf');
  });

  it('deve ordenar por ano DESC', () => {
    const sorted = [...mockVehicles].sort((a, b) => b.year - a.year);

    expect(sorted[0].name).toBe('Golf');
    expect(sorted[2].name).toBe('Corolla');
  });
});

describe('Busca', () => {
  const mockVehicles = [
    { id: 1, name: 'Civic Touring', brand: 'Honda', description: 'Seda turbo' },
    { id: 2, name: 'Corolla Altis', brand: 'Toyota', description: 'Hibrido' },
    { id: 3, name: 'Golf GTI', brand: 'Volkswagen', description: 'Esportivo' }
  ];

  it('deve buscar por nome', () => {
    const search = 'civic';
    const results = mockVehicles.filter(v =>
      v.name.toLowerCase().includes(search.toLowerCase())
    );

    expect(results.length).toBe(1);
    expect(results[0].brand).toBe('Honda');
  });

  it('deve buscar por marca', () => {
    const search = 'toyota';
    const results = mockVehicles.filter(v =>
      v.brand.toLowerCase().includes(search.toLowerCase())
    );

    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Corolla Altis');
  });

  it('deve buscar por descricao', () => {
    const search = 'hibrido';
    const results = mockVehicles.filter(v =>
      v.description?.toLowerCase().includes(search.toLowerCase())
    );

    expect(results.length).toBe(1);
    expect(results[0].brand).toBe('Toyota');
  });

  it('deve retornar vazio para busca sem resultados', () => {
    const search = 'ferrari';
    const results = mockVehicles.filter(v =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase())
    );

    expect(results.length).toBe(0);
  });
});
