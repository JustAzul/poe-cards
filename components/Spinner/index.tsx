import { memo } from 'react';
import styles from './index.module.css';

function Raw() {
  return (
    <>
      <div className={styles.loading} />
    </>
  );
}

export default memo(Raw);
