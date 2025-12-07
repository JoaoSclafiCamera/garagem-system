import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import styles from './Header.module.css';

const Header = ({ showContacts = true }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('token');

  const isActive = (path) => location.pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logo}>
          <img
            src="https://i.pinimg.com/564x/cc/ce/d6/ccced6f239b2f02cff647986f47fef5c.jpg"
            alt="Capatti Veiculos"
          />
        </Link>

        <nav className={styles.nav} aria-label="Navegacao principal">
          <Link
            to="/"
            className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link
            to="/catalogo"
            className={`${styles.navLink} ${isActive('/catalogo') ? styles.active : ''}`}
          >
            Catalogo
          </Link>
          {isLoggedIn && (
            <Link
              to="/gerente"
              className={`${styles.navLink} ${isActive('/gerente') ? styles.active : ''}`}
            >
              Gerenciar
            </Link>
          )}
        </nav>

        {showContacts && (
          <div className={styles.contacts}>
            <a
              href="https://wa.me/5517981328888"
              target="_blank"
              rel="noreferrer"
              className={styles.contactItem}
              aria-label="Contato via WhatsApp"
            >
              <FaWhatsapp className={styles.icon} aria-hidden="true" />
              <span className={styles.contactText}>+55 (17) 98132-8888</span>
            </a>
            <a
              href="https://instagram.com/capattiveiculos"
              target="_blank"
              rel="noreferrer"
              className={styles.contactItem}
              aria-label="Perfil no Instagram"
            >
              <FaInstagram className={styles.icon} aria-hidden="true" />
              <span className={styles.contactText}>@capattiveiculos</span>
            </a>
            <a
              href="https://facebook.com/capattiveiculos"
              target="_blank"
              rel="noreferrer"
              className={styles.contactItem}
              aria-label="Pagina no Facebook"
            >
              <FaFacebook className={styles.icon} aria-hidden="true" />
              <span className={styles.contactText}>Capatti Veiculos</span>
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
