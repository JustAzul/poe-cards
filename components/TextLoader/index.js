import styles from './index.module.css';

export default function TextLoader({children, Class}) {
    console.log(new Date(), 'TextLoader');
    return (
    <h1 class={`${styles['animated']} ${styles['infinite']} ${styles['pulse']} text-center ${Class ? ` ${Class}` : ""}`}>
        {children}
    </h1>);
}