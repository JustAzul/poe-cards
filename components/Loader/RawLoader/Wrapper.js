import styles from '../index.module.css';

export default function Wrapper({children}) {
    return (
        <div className={styles['gooey']}>
            {children}
        </div>   
    );
};