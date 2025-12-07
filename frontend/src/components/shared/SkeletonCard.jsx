import React from 'react';
import styles from './SkeletonCard.module.css';

const SkeletonCard = ({ viewMode = 'grid' }) => {
  return (
    <div
      className={`${styles.skeleton} ${styles[viewMode]}`}
      aria-hidden="true"
      role="presentation"
    >
      <div className={styles.image}></div>
      <div className={styles.content}>
        <div className={styles.title}></div>
        <div className={styles.subtitle}></div>
        <div className={styles.details}>
          <div className={styles.detail}></div>
          <div className={styles.detail}></div>
          <div className={styles.detail}></div>
        </div>
        <div className={styles.price}></div>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 6, viewMode = 'grid' }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} viewMode={viewMode} />
      ))}
    </>
  );
};

export default SkeletonCard;
