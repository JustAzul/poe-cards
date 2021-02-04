import styles from './index.module.css';

import { motion } from 'framer-motion';

export default function Spinner() {
    return (<motion.div initial={{opacity: 0}} animate={{opacity: 1}} className={styles['loading']}></motion.div>);
}