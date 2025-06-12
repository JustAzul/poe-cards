import { memo } from 'react';
import styles from './index.module.css';

function Arrow({ isUp = true }) {
  return (<div className={styles.container}>
      <div className={`${styles.arrow} ${isUp ? styles.up : styles.down} `} />
  </div>);
}

export default memo(Arrow);
