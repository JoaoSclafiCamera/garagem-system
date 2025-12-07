import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle, logout as apiLogout } from './services/api';

// Helper para formatar data para input type="date" (YYYY-MM-DD)
const formatDateForInput = (dateValue) => {
  if (!dateValue) return '';
  try {
    // Se já está no formato YYYY-MM-DD, retorna direto
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }
    // Converte ISO ou outros formatos para YYYY-MM-DD
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

const CadastroEstoque = () => {
  const [carros, setCarros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    year: '',
    kms: '',
    color: '',
    description: '',
    images: [],
    features: [],
    fuelType: '',
    transmission: '',
    doors: '4',
    engine: '',
    power: '',
    consumption: '',
    docsStatus: '',
    warranty: '',
    accidents: 'false',
    paintOriginal: '',
    tiresCondition: '',
    lastMaintenance: '',
    isPromotion: false
  });
  const [newImage, setNewImage] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      price: '',
      year: '',
      kms: '',
      color: '',
      description: '',
      images: [],
      features: [],
      fuelType: '',
      transmission: '',
      doors: '4',
      engine: '',
      power: '',
      consumption: '',
      docsStatus: '',
      warranty: '',
      accidents: 'false',
      paintOriginal: '',
      tiresCondition: '',
      lastMaintenance: '',
      isPromotion: false
    });
    setNewImage('');
    setNewFeature('');
    setError('');
  };

  const logout = useCallback(() => {
    apiLogout();
    navigate('/login');
  }, [navigate]);

  const fetchCarros = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getVehicles();
      setCarros(data);
      setError('');
    } catch (err) {
      console.error('Erro ao buscar carros:', err);
      if (err.message.includes('Token')) {
        logout();
      } else {
        setError('Erro ao carregar veículos. Verifique se o servidor está rodando.');
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchCarros();
  }, [fetchCarros]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const carData = {
        ...formData,
        price: Number(formData.price),
        year: Number(formData.year),
        kms: Number(formData.kms),
        doors: Number(formData.doors),
        power: Number(formData.power) || 0,
        accidents: formData.accidents === 'true'
      };

      if (editingCar) {
        await updateVehicle(editingCar, carData);
      } else {
        await createVehicle(carData);
      }

      setShowModal(false);
      setEditingCar(null);
      resetForm();
      fetchCarros();
    } catch (err) {
      console.error('Erro ao salvar carro:', err);
      setError(err.message || 'Erro ao salvar veículo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo permanentemente?')) {
      try {
        await deleteVehicle(id);
        fetchCarros();
      } catch (err) {
        console.error('Erro ao deletar carro:', err);
        setError(err.message || 'Erro ao deletar veículo');
      }
    }
  };

  const handleEdit = (carro) => {
    setFormData({
      name: carro.name || '',
      brand: carro.brand || '',
      price: carro.price || '',
      year: carro.year || '',
      kms: carro.kms || '',
      color: carro.color || '',
      description: carro.description || '',
      images: Array.isArray(carro.images) ? carro.images : [],
      features: Array.isArray(carro.features) ? carro.features : [],
      fuelType: carro.fuelType || '',
      transmission: carro.transmission || '',
      doors: carro.doors || '4',
      engine: carro.engine || '',
      power: carro.power || '',
      consumption: carro.consumption || '',
      docsStatus: carro.docsStatus || '',
      warranty: formatDateForInput(carro.warranty),
      accidents: carro.accidents ? 'true' : 'false',
      paintOriginal: carro.paintOriginal || '',
      tiresCondition: carro.tiresCondition || '',
      lastMaintenance: formatDateForInput(carro.lastMaintenance),
      isPromotion: carro.isPromotion || false
    });
    setEditingCar(carro.id);
    setShowModal(true);
  };

  const getFirstImage = (images) => {
    if (Array.isArray(images) && images.length > 0) {
      return images[0];
    }
    if (typeof images === 'string' && images) {
      return images;
    }
    return 'https://via.placeholder.com/300x200?text=Sem+Imagem';
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Painel Administrativo</h1>
        <button onClick={logout} className="botao-logout">Sair</button>
      </div>

      {error && <div className="erro-mensagem">{error}</div>}

      <button onClick={() => { resetForm(); setEditingCar(null); setShowModal(true); }} className="botao-novo">
        + Adicionar Novo Veículo
      </button>

      {loading ? (
        <div className="loading">Carregando veículos...</div>
      ) : (
        <div className="carros-grid">
          {carros.length === 0 ? (
            <p>Nenhum veículo cadastrado.</p>
          ) : (
            carros.map(carro => (
              <div key={carro.id} className="carro-card">
                <img
                  src={getFirstImage(carro.images)}
                  alt={carro.name}
                  className="carro-thumbnail"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Sem+Imagem'; }}
                />
                <div className="carro-info">
                  <h3>{carro.brand} {carro.name}</h3>
                  <p className="carro-preco">R$ {new Intl.NumberFormat('pt-BR').format(carro.price)}</p>
                  <p className="carro-detalhes">{carro.year} • {new Intl.NumberFormat('pt-BR').format(carro.kms)} km</p>
                  <div className="botoes-acao">
                    <button onClick={() => handleEdit(carro)} className="botao-editar">Editar</button>
                    <button onClick={() => handleDelete(carro.id)} className="botao-excluir">Excluir</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="admin-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={() => setShowModal(false)}>&times;</span>
            <h2>{editingCar ? 'Editar Veículo' : 'Novo Veículo'}</h2>

            {error && <div className="erro-form">{error}</div>}

            <form onSubmit={handleSubmit} className="form-admin">
              {/* Seção: Informações Básicas */}
              <div className="form-section">
                <h3>Informações Básicas</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome do Modelo: *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Marca: *</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Preço (R$): *</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" />
                  </div>
                  <div className="form-group">
                    <label>Ano: *</label>
                    <input type="number" name="year" value={formData.year} onChange={handleInputChange} required min="1900" max="2030" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Quilometragem:</label>
                    <input type="number" name="kms" value={formData.kms} onChange={handleInputChange} min="0" />
                  </div>
                  <div className="form-group">
                    <label>Cor:</label>
                    <input type="text" name="color" value={formData.color} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Descrição:</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" />
                </div>
              </div>

              {/* Seção: Especificações Técnicas */}
              <div className="form-section">
                <h3>Especificações Técnicas</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Combustível:</label>
                    <select name="fuelType" value={formData.fuelType} onChange={handleInputChange}>
                      <option value="">Selecione...</option>
                      <option value="Gasolina">Gasolina</option>
                      <option value="Etanol">Etanol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Flex">Flex</option>
                      <option value="Elétrico">Elétrico</option>
                      <option value="Híbrido">Híbrido</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Câmbio:</label>
                    <select name="transmission" value={formData.transmission} onChange={handleInputChange}>
                      <option value="">Selecione...</option>
                      <option value="Manual">Manual</option>
                      <option value="Automático">Automático</option>
                      <option value="CVT">CVT</option>
                      <option value="PDK">PDK</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Portas:</label>
                    <select name="doors" value={formData.doors} onChange={handleInputChange}>
                      <option value="2">2 portas</option>
                      <option value="4">4 portas</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Motor:</label>
                    <input type="text" name="engine" value={formData.engine} onChange={handleInputChange} placeholder="Ex: 2.0 Turbo" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Potência (cv):</label>
                    <input type="number" name="power" value={formData.power} onChange={handleInputChange} min="0" />
                  </div>
                  <div className="form-group">
                    <label>Consumo:</label>
                    <input type="text" name="consumption" value={formData.consumption} onChange={handleInputChange} placeholder="Ex: 12 km/l" />
                  </div>
                </div>
              </div>

              {/* Seção: Documentação e Condição */}
              <div className="form-section">
                <h3>Documentação e Condição</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Documentação:</label>
                    <select name="docsStatus" value={formData.docsStatus} onChange={handleInputChange}>
                      <option value="">Selecione...</option>
                      <option value="IPVA pago">IPVA pago</option>
                      <option value="IPVA pendente">IPVA pendente</option>
                      <option value="IPVA isento">IPVA isento</option>
                      <option value="Documentação em dia">Documentação em dia</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Garantia até:</label>
                    <input type="date" name="warranty" value={formData.warranty} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Sinistro/Acidente:</label>
                    <select name="accidents" value={formData.accidents} onChange={handleInputChange}>
                      <option value="false">Não</option>
                      <option value="true">Sim</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Pintura Original:</label>
                    <select name="paintOriginal" value={formData.paintOriginal} onChange={handleInputChange}>
                      <option value="">Selecione...</option>
                      <option value="Sim">Sim</option>
                      <option value="Não">Não</option>
                      <option value="Parcial">Parcial</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Estado dos Pneus:</label>
                    <select name="tiresCondition" value={formData.tiresCondition} onChange={handleInputChange}>
                      <option value="">Selecione...</option>
                      <option value="Novos">Novos</option>
                      <option value="Semi-novos">Semi-novos</option>
                      <option value="Originais">Originais</option>
                      <option value="Desgastados">Desgastados</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Última Manutenção:</label>
                    <input type="date" name="lastMaintenance" value={formData.lastMaintenance} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              {/* Seção: Promoção */}
              <div className="form-section">
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="isPromotion"
                      checked={formData.isPromotion}
                      onChange={handleInputChange}
                    />
                    Veículo em Promoção
                  </label>
                </div>
              </div>

              {/* Seção: Imagens */}
              <div className="form-section">
                <h3>Imagens</h3>
                <div className="add-item-container">
                  <input
                    type="text"
                    className="add-item-input"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="URL da imagem"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                  />
                  <button type="button" className="botao-adicionar" onClick={handleAddImage}>
                    Adicionar
                  </button>
                </div>
                <div className="preview-grid">
                  {formData.images.map((img, index) => (
                    <div key={index} className="preview-item">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=Erro'; }}
                      />
                      <button type="button" className="remove-preview-btn" onClick={() => handleRemoveImage(index)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seção: Opcionais */}
              <div className="form-section">
                <h3>Opcionais / Equipamentos</h3>
                <div className="add-item-container">
                  <input
                    type="text"
                    className="add-item-input"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Ex: Teto solar, Bancos em couro..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <button type="button" className="botao-adicionar" onClick={handleAddFeature}>
                    Adicionar
                  </button>
                </div>
                <div className="preview-grid features-grid">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="preview-item feature-tag">
                      {feature}
                      <button type="button" className="remove-preview-btn" onClick={() => handleRemoveFeature(index)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="botao-salvar" disabled={submitting}>
                {submitting ? 'Salvando...' : (editingCar ? 'Atualizar Veículo' : 'Cadastrar Veículo')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastroEstoque;
