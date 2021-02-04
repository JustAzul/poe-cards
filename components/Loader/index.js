import Head from 'next/head';
import styles from './index.module.css';

import { motion } from 'framer-motion';

export default function Loader({title = "poe.cards"}) {
    return (
        <motion.div initial={{opacity: 0}} animate={{opacity:1}}>

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

        </motion.div>
    );
};