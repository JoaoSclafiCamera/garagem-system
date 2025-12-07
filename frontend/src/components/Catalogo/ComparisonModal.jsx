import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/ComparisonModal.module.css';

const ComparisonModal = ({ vehicles, onClose, onRemove }) => {
  // Formatar valores
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatKm = (km) => {
    return new Intl.NumberFormat('pt-BR').format(km);
  };

  // Gerar WhatsApp link
  const getWhatsAppLink = (vehicle) => {
    const message = `Olá! Tenho interesse no ${vehicle.brand} ${vehicle.name} ${vehicle.year} por ${formatPrice(vehicle.price)}. Código: #${vehicle.id}`;
    return `https://wa.me/5517981328888?text=${encodeURIComponent(message)}`;
  };

  // Comparar e destacar diferenças
  const compareValue = (value, allValues, type = 'default') => {
    if (type === 'price' || type === 'km') {
      const min = Math.min(...allValues);
      const max = Math.max(...allValues);
      if (value === min) return 'best';
      if (value === max && type === 'price') return 'worst';
      if (value === max && type === 'km') return 'worst';
    }
    if (type === 'year') {
      const max = Math.max(...allValues);
      if (value === max) return 'best';
    }
    return 'neutral';
  };

  // Especificações para comparar
  const specs = [
    { key: 'price', label: 'Preço', format: formatPrice, type: 'price' },
    { key: 'year', label: 'Ano', format: (v) => v, type: 'year' },
    { key: 'kms', label: 'Quilometragem', format: formatKm, type: 'km' },
    { key: 'color', label: 'Cor', format: (v) => v },
    { key: 'description', label: 'Descrição', format: (v) => v || 'N/A' }
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2>Comparar Veículos</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {vehicles.length === 0 ? (
            <div className={styles.empty}>
              <p>Nenhum veículo selecionado para comparação</p>
              <button onClick={onClose} className={styles.emptyBtn}>
                Voltar ao Catálogo
              </button>
            </div>
          ) : (
            <div className={styles.comparisonTable}>
              {/* Vehicle Headers */}
              <div className={styles.row}>
                <div className={styles.specLabel}></div>
                {vehicles.map(vehicle => (
                  <div key={vehicle.id} className={styles.vehicleHeader}>
                    <button
                      className={styles.removeBtn}
                      onClick={() => onRemove(vehicle.id)}
                      title="Remover da comparação"
                    >
                      ×
                    </button>
                    <img 
                      src={vehicle.images || 'https://placehold.co/300x200/1a1a1a/dc2626?text=Foto+em+breve'}
                      alt={`${vehicle.brand} ${vehicle.name}`}
                      className={styles.vehicleImage}
                    />
                    <h3>{vehicle.brand}</h3>
                    <h4>{vehicle.name}</h4>
                  </div>
                ))}
                {/* Add more vehicles placeholder */}
                {vehicles.length < 3 && (
                  <div className={styles.addMore}>
                    <button onClick={onClose} className={styles.addBtn}>
                      + Adicionar Veículo
                    </button>
                    <p>Você pode comparar até 3 veículos</p>
                  </div>
                )}
              </div>

              {/* Specifications */}
              {specs.map(spec => {
                const allValues = vehicles.map(v => v[spec.key]);
                
                return (
                  <div key={spec.key} className={styles.row}>
                    <div className={styles.specLabel}>
                      {spec.label}
                    </div>
                    {vehicles.map(vehicle => {
                      const compareClass = spec.type 
                        ? compareValue(vehicle[spec.key], allValues.filter(v => typeof v === 'number'), spec.type)
                        : '';
                      
                      return (
                        <div 
                          key={vehicle.id} 
                          className={`${styles.specValue} ${styles[compareClass]}`}
                        >
                          {spec.format(vehicle[spec.key])}
                          {compareClass === 'best' && (
                            <span className={styles.badge}>Melhor</span>
                          )}
                        </div>
                      );
                    })}
                    {vehicles.length < 3 && <div className={styles.specValue}></div>}
                  </div>
                );
              })}

              {/* Actions */}
              <div className={styles.row}>
                <div className={styles.specLabel}>Ações</div>
                {vehicles.map(vehicle => (
                  <div key={vehicle.id} className={styles.actions}>
                    <Link 
                      to={`/detalhes/${vehicle.id}`}
                      className={styles.detailsBtn}
                      onClick={onClose}
                    >
                      Ver Detalhes
                    </Link>
                    <a 
                      href={getWhatsAppLink(vehicle)}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.whatsappBtn}
                    >
                      WhatsApp
                    </a>
                  </div>
                ))}
                {vehicles.length < 3 && <div className={styles.actions}></div>}
              </div>
            </div>
          )}
        </div>

        {/* Footer Tips */}
        {vehicles.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.tips}>
              <p>💡 Dica: Os valores destacados em verde indicam a melhor opção naquela categoria</p>
              <p>📞 Entre em contato conosco para mais informações sobre qualquer veículo</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonModal;