import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BsGrid3X3GapFill, BsListUl } from 'react-icons/bs';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import VehicleCard from './VehicleCard';
import SmartFilters from './SmartFilters';
import SearchBar from './SearchBar';
import styles from '../../styles/CatalogoPremium.module.css';
import { getVehicles } from '../../services/api';

const CatalogoPremium = () => {
  // Estados
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [filters, setFilters] = useState({
    search: '',
    brands: [],
    priceRange: [0, 1000000],
    yearRange: [1990, 2025],
    kmRange: [0, 500000],
    colors: [],
    sortBy: 'relevance'
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'list' ? 10 : 9;

  function sortVehicles(vehiclesList, sortBy) {
    const sorted = [...vehiclesList];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => Number(a.price) - Number(b.price));
      case 'price-desc':
        return sorted.sort((a, b) => Number(b.price) - Number(a.price));
      case 'year-desc':
        return sorted.sort((a, b) => Number(b.year) - Number(a.year));
      case 'year-asc':
        return sorted.sort((a, b) => Number(a.year) - Number(b.year));
      case 'km-asc':
        return sorted.sort((a, b) => Number(a.kms) - Number(b.kms));
      case 'km-desc':
        return sorted.sort((a, b) => Number(b.kms) - Number(a.kms));
      case 'relevance':
      default:
        return sorted.sort((a, b) => b.id - a.id);
    }
  }

  // Buscar veiculos do backend
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const data = await getVehicles();
        setVehicles(data);
        setFilteredVehicles(data);
      } catch (error) {
        console.error('Erro ao buscar veiculos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...vehicles];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(searchLower) ||
        v.brand.toLowerCase().includes(searchLower) ||
        v.description?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter(v => filters.brands.includes(v.brand));
    }

    filtered = filtered.filter(v =>
      Number(v.price) >= filters.priceRange[0] && Number(v.price) <= filters.priceRange[1]
    );

    filtered = filtered.filter(v =>
      Number(v.year) >= filters.yearRange[0] && Number(v.year) <= filters.yearRange[1]
    );

    filtered = filtered.filter(v =>
      Number(v.kms) >= filters.kmRange[0] && Number(v.kms) <= filters.kmRange[1]
    );

    if (filters.colors.length > 0) {
      filtered = filtered.filter(v => filters.colors.includes(v.color));
    }

    filtered = sortVehicles(filtered, filters.sortBy);
    setFilteredVehicles(filtered);
    setCurrentPage(1);
  }, [filters, vehicles]);

  // Handlers
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, []);

  const clearFilters = () => {
    setFilters({
      search: '',
      brands: [],
      priceRange: [0, 1000000],
      yearRange: [1990, 2025],
      kmRange: [0, 500000],
      colors: [],
      sortBy: 'relevance'
    });
  };

  // Paginacao
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            <img
              src="https://i.pinimg.com/564x/cc/ce/d6/ccced6f239b2f02cff647986f47fef5c.jpg"
              alt="Capatti Veiculos"
            />
          </Link>

          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/catalogo" className={`${styles.navLink} ${styles.active}`}>
              Catalogo
            </Link>
            {localStorage.getItem('token') && (
              <Link to="/gerente" className={styles.navLink}>Gerenciar</Link>
            )}
          </nav>

          <div className={styles.headerActions}>
            <div className={styles.contactLinks}>
              <a
                href="https://wa.me/5517981328888"
                target="_blank"
                rel="noreferrer"
                className={styles.contactItem}
                title="WhatsApp"
              >
                <span className={styles.contactIcon}><FaWhatsapp size={14} /></span>
                <span className={styles.contactText}>+55 (17) 98132-8888</span>
              </a>
              <a
                href="https://instagram.com/capattiveiculos"
                target="_blank"
                rel="noreferrer"
                className={styles.contactItem}
                title="Instagram"
              >
                <span className={styles.contactIcon}><FaInstagram size={14} /></span>
                <span className={styles.contactText}>@capattiveiculos</span>
              </a>
              <a
                href="https://facebook.com/capattiveiculos"
                target="_blank"
                rel="noreferrer"
                className={styles.contactItem}
                title="Facebook"
              >
                <span className={styles.contactIcon}><FaFacebook size={14} /></span>
                <span className={styles.contactText}>Capatti Veiculos</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Mobile Filter Button */}
          <button
            className={styles.mobileFilterBtn}
            onClick={() => setMobileFiltersOpen(true)}
          >
            Filtros ({filteredVehicles.length})
          </button>

          {/* Sidebar Filters */}
          <aside className={`${styles.sidebar} ${mobileFiltersOpen ? styles.mobileOpen : ''}`}>
            <SmartFilters
              vehicles={vehicles}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              onClose={() => setMobileFiltersOpen(false)}
            />
          </aside>

          {/* Content Area */}
          <div className={styles.content}>
            {/* Toolbar with Search */}
            <div className={styles.toolbar}>
              {/* Search Bar */}
              <div className={styles.toolbarSearch}>
                <SearchBar onSearch={handleSearch} />
              </div>

              <div className={styles.toolbarActions}>
                {/* Sort */}
                <select
                  className={styles.sortSelect}
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                >
                  <option value="relevance">Mais Relevantes</option>
                  <option value="price-asc">Menor Preco</option>
                  <option value="price-desc">Maior Preco</option>
                  <option value="year-desc">Mais Novos</option>
                  <option value="year-asc">Mais Antigos</option>
                  <option value="km-asc">Menor Km</option>
                  <option value="km-desc">Maior Km</option>
                </select>

                {/* View Mode */}
                <div className={styles.viewMode}>
                  <button
                    className={viewMode === 'grid' ? styles.active : ''}
                    onClick={() => setViewMode('grid')}
                    title="Visualizacao em Grade"
                  >
                    <BsGrid3X3GapFill />
                  </button>
                  <button
                    className={viewMode === 'list' ? styles.active : ''}
                    onClick={() => setViewMode('list')}
                    title="Visualizacao em Lista"
                  >
                    <BsListUl />
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicles Grid/List */}
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Carregando veiculos...</p>
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className={styles.noResults}>
                <h3>Nenhum veiculo encontrado</h3>
                <p>Tente ajustar os filtros ou fazer uma nova busca</p>
                <button onClick={clearFilters} className={styles.clearBtn}>
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <>
                <div className={`${styles.vehicleGrid} ${styles[viewMode]}`}>
                  {paginatedVehicles.map(vehicle => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                      Anterior
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        className={currentPage === i + 1 ? styles.active : ''}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      Proximo
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>Contato</h4>
            <a href="https://wa.me/5517981328888">+55 (17) 98132-8888</a>
            <a href="https://instagram.com/capattiveiculos">@capattiveiculos</a>
          </div>
          <div className={styles.footerSection}>
            <h4>Endereco</h4>
            <p>Rua das Palmeiras, 1575</p>
            <p>Jd. Leonor - Guapiacu</p>
          </div>
          <div className={styles.footerSection}>
            <h4>2025 Capatti Veiculos</h4>
            <p>CNPJ: 50.200.649/0001-24</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CatalogoPremium;
