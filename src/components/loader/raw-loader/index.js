import { memo } from 'react';
import styles from '../index.module.css';

function InternalLoader() {
  return (
    <>
        <span className={styles.dot} />
            <div className={styles.dots}>
                <span />
                <span />
                <span />
            </div>
    </>
  );
}

export default function RawLoader({ detail }) {
  const AnimatedLoader = memo(InternalLoader);
  return (
        <>
            <AnimatedLoader />
            {!!detail && <p align="center" className={styles.desc} >{detail}</p>}
        </>
  );
}
