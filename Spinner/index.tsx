import Dynamic from 'next/dynamic';
import styles from './index.module.css';

const Transition = Dynamic(import('../Transition'), { loading: () => <div className={styles.loading} /> });

export default function Spinner() {
  const transition: Object = {
    duration: 0.4,
  };

  return <Transition transition={transition} styles={styles.loading} />;
}
