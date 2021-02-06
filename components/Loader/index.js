import Head from 'next/head';
import styles from './index.module.css';

import Transition from '../Transition';

export default function Loader({title = "poe.cards"}) {
    console.log(new Date(), 'Loader');
    
    const transition = {
        duration: 0.3
    }
    
    return (
        <>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/images/InventoryIcon.png" />
            </Head>

            <Transition transition={transition} styles={styles['gooey']}>
                <span className={styles['dot']} />
                <div className={styles['dots']}>
                    <span />
                    <span />
                    <span />
                </div>
            </Transition>
        </>
        
    );
};