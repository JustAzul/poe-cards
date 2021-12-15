import styles from '../index.module.css';

import Transition from '../../Transition';

interface Props {
    children: React.ReactNode
}

export default function Wrapper({ children }: Props) {
  return (
        <Transition styles={`${styles.table100} ${styles.ver1} user-select-none`}>
                <table className={styles.table}>
                    {children}
                </table>
        </Transition>
  );
}
