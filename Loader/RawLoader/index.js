import styles from '../index.module.css';

export default function RawLoader({ detail }) {
  return (
        <>
            <span className={styles.dot} />
            <div className={styles.dots}>
                <span />
                <span />
                <span />
            </div>
            {!!detail && <p align="center" className={styles.desc} >{detail}</p>}
        </>
  );
}
