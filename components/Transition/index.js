import { motion } from 'framer-motion';

export default function Transition({transition, children, styles}) {
    const start = {
        opacity: 0,
        transition
    }

    const end = {
        opacity: 1,
        transition
    }

    return <motion.div initial={start} animate={end} exit={start} className={styles}>{children}</motion.div>;
}