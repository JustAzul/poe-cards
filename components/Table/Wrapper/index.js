import styles from '../index.module.css';

export default function Wrapper({children}) {
    return (
        <div className={`${styles['table100']} ${styles['ver1']} user-select-none`}>
                <table className={styles.table}>
                    {children}
                </table>
        </div>
    );
}