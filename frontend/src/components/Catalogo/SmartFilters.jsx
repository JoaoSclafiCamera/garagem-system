import React, { useState, useEffect } from 'react';
import styles from '../../styles/SmartFilters.module.css';
import { 
  FaTimes, FaCarSide, FaChevronDown, FaChevronUp 
} from 'react-icons/fa';
import { 
  MdAttachMoney, MdCalendarToday, MdSpeed, MdColorLens 
} from 'react-icons/md';

const SmartFilters = ({ vehicles, filters, onFilterChange, onClearFilters, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({
    price: false,
    year: false,
    km: false,
    brand: false,
    color: false
  });

  // Extrair opções únicas dos veículos
  const brands = [...new Set(vehicles.map(v => v.brand))].sort();
  const colors = [...new Set(vehicles.map(v => v.color))].sort();

  // Estatísticas dos veículos (converter strings para números)
  const stats = vehicles.length > 0 ? {
    minPrice: Math.min(...vehicles.map(v => Number(v.price) || 0)),
    maxPrice: Math.max(...vehicles.map(v => Number(v.price) || 0)),
    minYear: Math.min(...vehicles.map(v => Number(v.year) || 1990)),
    maxYear: Math.max(...vehicles.map(v => Number(v.year) || 2025)),
    minKm: Math.min(...vehicles.map(v => Number(v.kms) || 0)),
    maxKm: Math.max(...vehicles.map(v => Number(v.kms) || 0))
  } : {
    minPrice: 0,
    maxPrice: 1000000,
    minYear: 1990,
    maxYear: 2025,
    minKm: 0,
    maxKm: 500000
  };

  // Atualizar filtros locais quando os filtros externos mudarem
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Toggle seção expandida
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handlers para mudanças nos filtros
  const handlePriceChange = (type, value) => {
    const newRange = [...localFilters.priceRange];
    if (type === 'min') {
      newRange[0] = Number(value);
    } else {
      newRange[1] = Number(value);
    }
    setLocalFilters(prev => ({ ...prev, priceRange: newRange }));
    onFilterChange({ priceRange: newRange });
  };

  const handleYearChange = (type, value) => {
    const newRange = [...localFilters.yearRange];
    if (type === 'min') {
      newRange[0] = Number(value);
    } else {
      newRange[1] = Number(value);
    }
    setLocalFilters(prev => ({ ...prev, yearRange: newRange }));
    onFilterChange({ yearRange: newRange });
  };

  const handleKmChange = (type, value) => {
    const newRange = [...localFilters.kmRange];
    if (type === 'min') {
      newRange[0] = Number(value);
    } else {
      newRange[1] = Number(value);
    }
    setLocalFilters(prev => ({ ...prev, kmRange: newRange }));
    onFilterChange({ kmRange: newRange });
  };

  const handleBrandToggle = (brand) => {
    const newBrands = localFilters.brands.includes(brand)
      ? localFilters.brands.filter(b => b !== brand)
      : [...localFilters.brands, brand];
    
    setLocalFilters(prev => ({ ...prev, brands: newBrands }));
    onFilterChange({ brands: newBrands });
  };

  const handleColorToggle = (color) => {
    const newColors = localFilters.colors.includes(color)
      ? localFilters.colors.filter(c => c !== color)
      : [...localFilters.colors, color];
    
    setLocalFilters(prev => ({ ...prev, colors: newColors }));
    onFilterChange({ colors: newColors });
  };

  // Contar veículos por marca
  const getBrandCount = (brand) => {
    return vehicles.filter(v => v.brand === brand).length;
  };

  // Contar veículos por cor
  const getColorCount = (color) => {
    return vehicles.filter(v => v.color === color).length;
  };

  // Formatar valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Verificar se há filtros ativos
  const hasActiveFilters = () => {
    return localFilters.brands.length > 0 ||
           localFilters.colors.length > 0 ||
           localFilters.priceRange[0] > stats.minPrice ||
           localFilters.priceRange[1] < stats.maxPrice ||
           localFilters.yearRange[0] > stats.minYear ||
           localFilters.yearRange[1] < stats.maxYear ||
           localFilters.kmRange[0] > stats.minKm ||
           localFilters.kmRange[1] < stats.maxKm;
  };

  return (
    <aside className={styles.filters} aria-label="Filtros de veiculos">
      {/* Header */}
      <div className={styles.header}>
        <h2 id="filters-title">Filtros</h2>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Fechar painel de filtros"
        >
          <FaTimes size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters() && (
        <button className={styles.clearBtn} onClick={onClearFilters} aria-label="Limpar todos os filtros">
          Limpar Filtros
        </button>
      )}

      {/* Price Range */}
      <div className={styles.section}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => toggleSection('price')}
          aria-expanded={expandedSections.price}
          aria-controls="price-section"
        >
          <h3><MdAttachMoney size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} aria-hidden="true" /> Preco</h3>
          <span className={styles.toggle} aria-hidden="true">
            {expandedSections.price ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </span>
        </button>
        
        {expandedSections.price && (
          <div className={styles.sectionContent} id="price-section">
            <div className={styles.rangeInputs}>
              <div className={styles.inputGroup}>
                <label htmlFor="price-min">Minimo</label>
                <input
                  id="price-min"
                  type="number"
                  value={localFilters.priceRange[0]}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  min={stats.minPrice}
                  max={localFilters.priceRange[1]}
                  step="5000"
                  aria-describedby="price-range-display"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="price-max">Maximo</label>
                <input
                  id="price-max"
                  type="number"
                  value={localFilters.priceRange[1]}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  min={localFilters.priceRange[0]}
                  max={stats.maxPrice}
                  step="5000"
                  aria-describedby="price-range-display"
                />
              </div>
            </div>
            <div className={styles.rangeDisplay}>
              <span>{formatCurrency(localFilters.priceRange[0])}</span>
              <div className={styles.rangeBar}>
                <div 
                  className={styles.rangeProgress}
                  style={{
                    left: `${((localFilters.priceRange[0] - stats.minPrice) / (stats.maxPrice - stats.minPrice)) * 100}%`,
                    right: `${100 - ((localFilters.priceRange[1] - stats.minPrice) / (stats.maxPrice - stats.minPrice)) * 100}%`
                  }}
                />
              </div>
              <span>{formatCurrency(localFilters.priceRange[1])}</span>
            </div>
            
            {/* Quick Price Buttons */}
            <div className={styles.quickButtons}>
              <button onClick={() => onFilterChange({ priceRange: [0, 50000] })}>
                Até 50k
              </button>
              <button onClick={() => onFilterChange({ priceRange: [50000, 100000] })}>
                50k-100k
              </button>
              <button onClick={() => onFilterChange({ priceRange: [100000, 200000] })}>
                100k-200k
              </button>
              <button onClick={() => onFilterChange({ priceRange: [200000, stats.maxPrice] })}>
                200k+
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Year Range */}
      <div className={styles.section}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => toggleSection('year')}
          aria-expanded={expandedSections.year}
          aria-controls="year-section"
        >
          <h3><MdCalendarToday size={18} style={{marginRight: '8px', verticalAlign: 'middle'}} aria-hidden="true" /> Ano</h3>
          <span className={styles.toggle} aria-hidden="true">
            {expandedSections.year ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </span>
        </button>

        {expandedSections.year && (
          <div className={styles.sectionContent} id="year-section">
            <div className={styles.rangeInputs}>
              <div className={styles.inputGroup}>
                <label htmlFor="year-min">De</label>
                <input
                  id="year-min"
                  type="number"
                  value={localFilters.yearRange[0]}
                  onChange={(e) => handleYearChange('min', e.target.value)}
                  min={stats.minYear}
                  max={localFilters.yearRange[1]}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="year-max">Ate</label>
                <input
                  id="year-max"
                  type="number"
                  value={localFilters.yearRange[1]}
                  onChange={(e) => handleYearChange('max', e.target.value)}
                  min={localFilters.yearRange[0]}
                  max={stats.maxYear}
                />
              </div>
            </div>
            <div className={styles.rangeDisplay}>
              <span>{localFilters.yearRange[0]}</span>
              <div className={styles.rangeBar}>
                <div 
                  className={styles.rangeProgress}
                  style={{
                    left: `${((localFilters.yearRange[0] - stats.minYear) / (stats.maxYear - stats.minYear)) * 100}%`,
                    right: `${100 - ((localFilters.yearRange[1] - stats.minYear) / (stats.maxYear - stats.minYear)) * 100}%`
                  }}
                />
              </div>
              <span>{localFilters.yearRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Kilometer Range */}
      <div className={styles.section}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => toggleSection('km')}
          aria-expanded={expandedSections.km}
          aria-controls="km-section"
        >
          <h3><MdSpeed size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} aria-hidden="true" /> Quilometragem</h3>
          <span className={styles.toggle} aria-hidden="true">
            {expandedSections.km ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </span>
        </button>

        {expandedSections.km && (
          <div className={styles.sectionContent} id="km-section">
            <div className={styles.rangeInputs}>
              <div className={styles.inputGroup}>
                <label htmlFor="km-min">Minimo</label>
                <input
                  id="km-min"
                  type="number"
                  value={localFilters.kmRange[0]}
                  onChange={(e) => handleKmChange('min', e.target.value)}
                  min={stats.minKm}
                  max={localFilters.kmRange[1]}
                  step="5000"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="km-max">Maximo</label>
                <input
                  id="km-max"
                  type="number"
                  value={localFilters.kmRange[1]}
                  onChange={(e) => handleKmChange('max', e.target.value)}
                  min={localFilters.kmRange[0]}
                  max={stats.maxKm}
                  step="5000"
                />
              </div>
            </div>
            <div className={styles.rangeDisplay}>
              <span>{localFilters.kmRange[0].toLocaleString('pt-BR')} km</span>
              <div className={styles.rangeBar}>
                <div 
                  className={styles.rangeProgress}
                  style={{
                    left: `${((localFilters.kmRange[0] - stats.minKm) / (stats.maxKm - stats.minKm)) * 100}%`,
                    right: `${100 - ((localFilters.kmRange[1] - stats.minKm) / (stats.maxKm - stats.minKm)) * 100}%`
                  }}
                />
              </div>
              <span>{localFilters.kmRange[1].toLocaleString('pt-BR')} km</span>
            </div>
            
            {/* Quick KM Buttons */}
            <div className={styles.quickButtons}>
              <button onClick={() => onFilterChange({ kmRange: [0, 20000] })}>
                Até 20k
              </button>
              <button onClick={() => onFilterChange({ kmRange: [0, 50000] })}>
                Até 50k
              </button>
              <button onClick={() => onFilterChange({ kmRange: [0, 100000] })}>
                Até 100k
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div className={styles.section}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => toggleSection('brand')}
          aria-expanded={expandedSections.brand}
          aria-controls="brand-section"
        >
          <h3><FaCarSide size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} aria-hidden="true" /> Marca</h3>
          <span className={styles.toggle} aria-hidden="true">
            {expandedSections.brand ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </span>
        </button>

        {expandedSections.brand && (
          <div className={styles.sectionContent} id="brand-section" role="group" aria-label="Filtrar por marca">
            <div className={styles.checkboxList}>
              {brands.map(brand => (
                <label key={brand} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={localFilters.brands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                  />
                  <span className={styles.checkmark}></span>
                  <span className={styles.label}>
                    {brand} <span className={styles.count}>({getBrandCount(brand)})</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className={styles.section}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => toggleSection('color')}
          aria-expanded={expandedSections.color}
          aria-controls="color-section"
        >
          <h3><MdColorLens size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} aria-hidden="true" /> Cor</h3>
          <span className={styles.toggle} aria-hidden="true">
            {expandedSections.color ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </span>
        </button>

        {expandedSections.color && (
          <div className={styles.sectionContent} id="color-section" role="group" aria-label="Filtrar por cor">
            <div className={styles.colorGrid}>
              {colors.map(color => (
                <button
                  key={color}
                  className={`${styles.colorBtn} ${
                    localFilters.colors.includes(color) ? styles.active : ''
                  }`}
                  onClick={() => handleColorToggle(color)}
                  aria-label={`${color} - ${getColorCount(color)} veiculos`}
                  aria-pressed={localFilters.colors.includes(color)}
                >
                  <span className={styles.colorSwatch} data-color={color} aria-hidden="true"></span>
                  <span className={styles.colorName}>{color}</span>
                  <span className={styles.colorCount}>{getColorCount(color)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Apply Button (Mobile) */}
      <button className={styles.applyBtn} onClick={onClose} aria-label="Aplicar filtros selecionados">
        Aplicar Filtros
      </button>
    </aside>
  );
};

export default SmartFilters;