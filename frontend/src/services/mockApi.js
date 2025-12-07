import baseVehicles from '../data/vehicles';

const STORAGE_KEY = 'garagem_mock_vehicles';
const TOKEN_KEY = 'token';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

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
  ...vehicle
});

const loadVehicles = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // se parsing falhar, recomeça do mock base
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(baseVehicles));
  return baseVehicles;
};

const saveVehicles = (vehicles) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
};

export const getVehicles = async () => {
  await delay();
  return loadVehicles().map(normalizeVehicle);
};

export const getVehicleById = async (id) => {
  await delay();
  const vehicles = loadVehicles();
  const vehicle = vehicles.find((v) => v.id === Number(id));
  return vehicle ? normalizeVehicle(vehicle) : null;
};

export const createVehicle = async (data) => {
  await delay();
  const vehicles = loadVehicles();
  const newVehicle = normalizeVehicle({
    ...data,
    id: Date.now()
  });
  vehicles.unshift(newVehicle);
  saveVehicles(vehicles);
  return newVehicle;
};

export const updateVehicle = async (id, data) => {
  await delay();
  const vehicles = loadVehicles();
  const idx = vehicles.findIndex((v) => v.id === Number(id));
  if (idx === -1) return null;
  vehicles[idx] = normalizeVehicle({
    ...vehicles[idx],
    ...data,
    id: vehicles[idx].id
  });
  saveVehicles(vehicles);
  return vehicles[idx];
};

export const deleteVehicle = async (id) => {
  await delay();
  const vehicles = loadVehicles().filter((v) => v.id !== Number(id));
  saveVehicles(vehicles);
  return true;
};

// Auth mock simples
export const login = async (username, password) => {
  await delay();
  // aceita qualquer combinação para propósito de demo
  const token = btoa(`${username}:${password}:${Date.now()}`);
  localStorage.setItem(TOKEN_KEY, token);
  return token;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => !!localStorage.getItem(TOKEN_KEY);
