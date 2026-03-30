import React from 'react';
import styles from '../index.module.css';

interface Props {
    children: React.ReactNode
}

export default function Wrapper({ children }: Props) {
  return (
        <div className={`${styles.table100} ${styles.ver1} user-select-none`}>
                <table className={styles.table}>
                    {children}
                </table>
        </div>
  );
}
