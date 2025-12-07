import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/VehicleCard.module.css';
import { 
  FaCamera, FaWhatsapp, FaBolt, FaHeart, FaRegHeart, FaShare, FaEye
} from 'react-icons/fa';
import { 
  MdCalendarToday, MdSpeed, MdColorLens, MdDescription
} from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';

const VehicleCard = ({
  vehicle,
  viewMode
}) => {
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  // Formatar preço
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Formatar quilometragem
  const formatKm = (km) => {
    return new Intl.NumberFormat('pt-BR').format(km);
  };

  // Determinar badges
  const getBadges = () => {
    const badges = [];
    
    // Veículo novo (menos de 10.000 km)
    if (vehicle.kms < 10000) {
      badges.push({ text: '0KM', type: 'new', icon: <HiSparkles /> });
    }
    
    // Ano atual ou próximo
    const currentYear = new Date().getFullYear();
    if (vehicle.year >= currentYear) {
      badges.push({ text: `${vehicle.year}`, type: 'year' });
    }
    
    // Promoção (exemplo: baseado em alguma lógica)
    if (vehicle.isPromotion) {
      badges.push({ text: 'OFERTA', type: 'promo' });
    }

    // Destaque
    if (vehicle.id % 3 === 0) {
      badges.push({ text: 'DESTAQUE', type: 'featured' });
    }
    
    return badges;
  };

  const badges = getBadges();

  const getMainImage = () => {
    if (Array.isArray(vehicle.images)) {
      return vehicle.images[0] || '/placeholder-car.jpg';
    }
    return vehicle.images || 'https://placehold.co/600x400/1a1a1a/dc2626?text=Foto+em+breve';
  };

  // Gerar WhatsApp link
  const getWhatsAppLink = () => {
    const message = `Olá! Tenho interesse no ${vehicle.brand} ${vehicle.name} ${vehicle.year} por ${formatPrice(vehicle.price)}. Código: #${vehicle.id}`;
    return `https://wa.me/5517981328888?text=${encodeURIComponent(message)}`;
  };

  // View Mode: List
  if (viewMode === 'list') {
    return (
      <div className={styles.cardList}>
        <div className={styles.listImageContainer}>
          <img 
            src={imageError ? '/placeholder-car.jpg' : getMainImage()}
            alt={`${vehicle.brand} ${vehicle.name}`}
            onError={() => setImageError(true)}
            className={styles.listImage}
          />
          {badges.length > 0 && (
            <div className={styles.badges}>
              {badges.map((badge, index) => (
                <span key={index} className={`${styles.badge} ${styles[badge.type]}`}>
                  {badge.text}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.listContent}>
          <div className={styles.listHeader}>
            <h3 className={styles.listTitle}>
              {vehicle.brand} <span>{vehicle.name}</span>
            </h3>
            <div className={styles.listPrice}>{formatPrice(vehicle.price)}</div>
          </div>

          <div className={styles.listSpecs}>
            <span className={styles.spec}>
              <MdCalendarToday size={16} style={{marginRight: '4px'}} /> {vehicle.year}
            </span>
            <span className={styles.spec}>
              <MdSpeed size={16} style={{marginRight: '4px'}} /> {formatKm(vehicle.kms)} km
            </span>
            <span className={styles.spec}>
              <MdColorLens size={16} style={{marginRight: '4px'}} /> {vehicle.color}
            </span>
            {vehicle.description && (
              <span className={styles.spec}>
                <MdDescription size={16} style={{marginRight: '4px'}} /> {vehicle.description.substring(0, 50)}...
              </span>
            )}
          </div>

          <div className={styles.listActions}>
            <a 
              href={getWhatsAppLink()} 
              target="_blank" 
              rel="noreferrer"
              className={styles.whatsappLink}
            >
              <><FaWhatsapp size={16} style={{marginRight: '6px'}} /> WhatsApp</>
            </a>
            <Link to={`/detalhes/${vehicle.id}`} className={styles.detailsLink}>
              Ver Detalhes →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // View Mode: Grid (default)
  return (
    <div className={styles.cardPremium}>
      {/* Favorite Button */}
      <button 
        className={styles.favoriteBtn}
        onClick={(e) => {
          e.preventDefault();
          setIsFavorite(!isFavorite);
        }}
        aria-label="Adicionar aos favoritos"
      >
        {isFavorite ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
      </button>

      {/* Share Button */}
      <button 
        className={styles.shareBtn}
        onClick={(e) => {
          e.preventDefault();
          // Share logic here
        }}
        aria-label="Compartilhar"
      >
        <FaShare size={16} />
      </button>

      {/* Badges */}
      {badges.length > 0 && (
        <div className={styles.badgesPremium}>
          {badges.map((badge, index) => (
            <span key={index} className={`${styles.badgePremium} ${styles[badge.type]}`}>
              {badge.icon && <span className={styles.badgeIcon}>{badge.icon}</span>}
              {badge.text}
            </span>
          ))}
        </div>
      )}

      {/* Image Container */}
      <div className={styles.imageContainerPremium}>
        <img 
          src={imageError ? '/placeholder-car.jpg' : getMainImage()}
          alt={`${vehicle.brand} ${vehicle.name}`}
          onError={() => setImageError(true)}
          className={styles.imagePremium}
        />

        {/* Quick View Overlay */}
        <div
          className={styles.quickViewOverlay}
          onClick={() => navigate(`/detalhes/${vehicle.id}`)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && navigate(`/detalhes/${vehicle.id}`)}
        >
          <button className={styles.quickViewBtn}>
            <FaEye size={20} />
            <span>Ver Rápido</span>
          </button>
        </div>

        {/* Image Counter */}
        {vehicle.imageCount > 1 && (
          <div className={styles.imageCountPremium}>
            <FaCamera size={14} />
            <span>{vehicle.imageCount}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.contentPremium}>
        <div className={styles.headerPremium}>
          <span className={styles.brandPremium}>{vehicle.brand}</span>
          <h3 className={styles.modelPremium}>{vehicle.name}</h3>
        </div>

        <div className={styles.pricePremium}>
          <span className={styles.priceLabel}>A partir de</span>
          <span className={styles.priceValue}>{formatPrice(vehicle.price)}</span>
        </div>

        <div className={styles.specsPremium}>
          <div className={styles.specItemPremium}>
            <MdCalendarToday className={styles.specIcon} />
            <span>{vehicle.year}</span>
          </div>
          <div className={styles.specItemPremium}>
            <MdSpeed className={styles.specIcon} />
            <span>{formatKm(vehicle.kms)} km</span>
          </div>
          <div className={styles.specItemPremium}>
            <MdColorLens className={styles.specIcon} />
            <span>{vehicle.color}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionsPremium}>
          <a 
            href={getWhatsAppLink()} 
            target="_blank" 
            rel="noreferrer"
            className={styles.whatsappBtnPremium}
          >
            <FaWhatsapp size={18} />
            <span>WhatsApp</span>
          </a>
          <Link to={`/detalhes/${vehicle.id}`} className={styles.detailsBtnPremium}>
            <span>Ver Detalhes</span>
            <FaBolt size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
