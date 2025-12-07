import React from 'react';
import { FaWhatsapp, FaInstagram, FaFacebook, FaMapMarkerAlt } from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h4>Contatos</h4>
          <a
            href="https://wa.me/5517981328888"
            target="_blank"
            rel="noreferrer"
            className={styles.contactLink}
            aria-label="Contato via WhatsApp"
          >
            <FaWhatsapp aria-hidden="true" />
            <span>+55 (17) 98132-8888</span>
          </a>
          <a
            href="https://instagram.com/capattiveiculos"
            target="_blank"
            rel="noreferrer"
            className={styles.contactLink}
            aria-label="Perfil no Instagram"
          >
            <FaInstagram aria-hidden="true" />
            <span>@capattiveiculos</span>
          </a>
          <a
            href="https://facebook.com/capattiveiculos"
            target="_blank"
            rel="noreferrer"
            className={styles.contactLink}
            aria-label="Pagina no Facebook"
          >
            <FaFacebook aria-hidden="true" />
            <span>Capatti Veiculos</span>
          </a>
        </div>

        <div className={styles.footerSection}>
          <h4>Endereco</h4>
          <div className={styles.address}>
            <FaMapMarkerAlt aria-hidden="true" />
            <div>
              <p>Rua das Palmeiras, n 1575 - Jd. Leonor</p>
              <p>Guapiacu - SP</p>
              <p>CEP: 15.110-000</p>
            </div>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h4>Capatti Veiculos</h4>
          <p>&copy; {currentYear} Todos os direitos reservados</p>
          <p>CNPJ: 50.200.649/0001-24</p>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>Developed by Boris</p>
      </div>
    </footer>
  );
};

export default Footer;
