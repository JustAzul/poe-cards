import styles from './index.module.css';

export default function Arrow({ isUp = true }) {
  return (<div className={styles.container}>
      <div className={`${styles.arrow} ${isUp ? styles.up : styles.down} `} />
  </div>);
}
