import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Pagina nao encontrada</h2>
        <p className={styles.message}>
          Desculpe, a pagina que voce esta procurando nao existe ou foi movida.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.homeBtn}>
            Voltar para Home
          </Link>
          <Link to="/catalogo" className={styles.catalogBtn}>
            Ver Catalogo
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
