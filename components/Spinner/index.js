import styles from './index.module.css';

import { motion } from 'framer-motion';

export default function Spinner() {
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

    return <motion.div initial={start} animate={end} exit={start} className={styles['loading']} />;
}