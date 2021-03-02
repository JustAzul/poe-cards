import styles from '../index.module.css';

export default function RawLoader() {
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
