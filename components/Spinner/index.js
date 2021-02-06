import styles from './index.module.css';

export default function Spinner() {
    console.log(new Date(), 'Spinner');
    return <div styles={styles['loading']} />;
}