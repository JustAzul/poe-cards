import Head from 'next/head';
import styles from './index.module.css';

export default function Loader({title = "poe.cards"}) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/images/InventoryIcon.png" />
            </Head>

            <div className={styles['gooey']}>
                <span className={styles['dot']} />
                <div className={styles['dots']}>
                    <span />
                    <span />
                    <span />
                </div>
            </div>
        </>
        
    );
};