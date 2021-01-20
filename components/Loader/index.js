import styles from './index.module.css';

export default function Loader() {
    return (
        <div className={styles['gooey']}>
            <span className={styles['dot']}></span>
            <div className={styles['dots']}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
};