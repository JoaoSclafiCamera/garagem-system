import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/SearchBar.module.css';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { BiTimeFive } from 'react-icons/bi';

const vehicleDatabase = [
  'Honda Civic 2020',
  'Honda Civic 2021',
  'Honda Civic 2022',
  'Honda City',
  'Honda CR-V',
  'Honda HR-V',
  'Honda Fit',
  'Toyota Corolla 2020',
  'Toyota Corolla 2021',
  'Toyota Corolla 2022',
  'Toyota Corolla Cross',
  'Toyota Hilux',
  'Toyota Yaris',
  'Volkswagen Golf',
  'Volkswagen Polo',
  'Volkswagen T-Cross',
  'Volkswagen Tiguan',
  'Volkswagen Jetta',
  'Chevrolet Onix',
  'Chevrolet Onix Plus',
  'Chevrolet Tracker',
  'Chevrolet Cruze',
  'Chevrolet S10',
  'Ford Ka',
  'Ford EcoSport',
  'Ford Ranger',
  'Ford Territory',
  'Fiat Argo',
  'Fiat Cronos',
  'Fiat Toro',
  'Fiat Mobi',
  'Fiat Pulse',
  'Hyundai HB20',
  'Hyundai Creta',
  'Hyundai Tucson',
  'Jeep Compass',
  'Jeep Renegade',
  'Jeep Commander',
  'Nissan Kicks',
  'Nissan Versa',
  'Nissan Frontier',
  'Renault Kwid',
  'Renault Sandero',
  'Renault Duster',
  'Renault Captur'
];

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  // Filtrar sugestões baseado no termo de busca
  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = vehicleDatabase
        .filter(item =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 8);

      setSuggestions(filtered);
      setShowSuggestions(true);
    } else if (searchTerm.length === 0 && recentSearches.length > 0) {
      setSuggestions(recentSearches.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, recentSearches]);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        onSearch(value);
      } else {
        onSearch('');
      }
    }, 250);
  };

  const handleSearch = (value = searchTerm) => {
    if (!value.trim()) return;

    const updatedRecent = [value, ...recentSearches.filter(item => item !== value)].slice(0, 10);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
    onSearch(value);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch('');
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    handleSearch(suggestion);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  return (
    <div className={styles.searchContainer} ref={searchRef} role="search">
      <div className={styles.searchBox}>
        <label htmlFor="vehicle-search" className={styles.srOnly}>
          Buscar veiculos
        </label>
        <input
          id="vehicle-search"
          type="text"
          className={styles.searchInput}
          placeholder="Buscar por marca, modelo ou caracteristica..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchTerm.length > 1 || recentSearches.length > 0) {
              setShowSuggestions(true);
            }
          }}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showSuggestions}
        />

        <div className={styles.searchActions}>
          {searchTerm && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
              aria-label="Limpar busca"
            >
              <FaTimes size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {showSuggestions && (
        <ul
          id="search-suggestions"
          className={styles.suggestions}
          role="listbox"
          aria-label="Sugestoes de busca"
        >
          {searchTerm === '' && recentSearches.length > 0 && (
            <>
              <li className={styles.suggestionHeader} role="presentation">
                <span>Buscas Recentes</span>
                <button
                  type="button"
                  onClick={clearRecentSearches}
                  aria-label="Limpar historico de buscas"
                >
                  Limpar
                </button>
              </li>
              {recentSearches.slice(0, 5).map((search, index) => (
                <li
                  key={index}
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(search)}
                  role="option"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleSuggestionClick(search)}
                >
                  <span className={styles.icon} aria-hidden="true"><BiTimeFive size={16} /></span>
                  <span>{search}</span>
                </li>
              ))}
            </>
          )}

          {searchTerm && suggestions.length > 0 && (
            <>
              <li className={styles.suggestionHeader} role="presentation">
                <span>Sugestoes</span>
              </li>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(suggestion)}
                  role="option"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleSuggestionClick(suggestion)}
                >
                  <span className={styles.icon} aria-hidden="true"><FaSearch size={16} /></span>
                  <span>
                    {suggestion.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) => (
                      <span key={i}>
                        {part.toLowerCase() === searchTerm.toLowerCase() ? (
                          <strong>{part}</strong>
                        ) : (
                          part
                        )}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </>
          )}

          {searchTerm && suggestions.length === 0 && (
            <li className={styles.noResults} role="option" aria-selected="false">
              Nenhuma sugestao encontrada para "{searchTerm}"
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
