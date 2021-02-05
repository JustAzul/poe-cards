import Head from 'next/head';
import styles from './index.module.css';

import { motion } from 'framer-motion';

export default function Loader({title = "poe.cards"}) {
    const transition = {
        duration: 0.5
    };

    const start = {
        opacity: 0,
        transition
    }

    const end = {
        opacity: 1,
        transition
    };

    return (
        <>
            <Head>
                <title>{title}</title>
                <link rel="icon" href="/images/InventoryIcon.png" />
            </Head>

            <motion.div initial={start} animate={end} exit={start}>
                <div className={styles['gooey']}>
                    <span className={styles['dot']} />
                    <div className={styles['dots']}>
                        <span />
                        <span />
                        <span />
                    </div>
                </div>

            </motion.div>
        </>
        
    );
};