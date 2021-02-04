import styles from '../index.module.css';

import { motion } from 'framer-motion';

export default function Wrapper({children}) {
    return (
        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className={`${styles['table100']} ${styles['ver1']} user-select-none`}>
                <table className={styles.table}>
                    {children}
                </table>
        </motion.div>
    );
}