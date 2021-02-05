import styles from '../index.module.css';

import Transition from '../../Transition';

export default function Wrapper({children}) {
    return (
        <Transition styles={`${styles['table100']} ${styles['ver1']} user-select-none`}>
                <table className={styles.table}>
                    {children}
                </table>
        </Transition>
    );
}