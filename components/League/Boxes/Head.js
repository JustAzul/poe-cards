import styles from './index.module.css';

export default function Head({children}) {
    return (
        <div className={`pl-2 pr-2 text-center ${styles['header2']} user-select-none`}>
            {children}
        </div>
    );
}