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
    console.log(new Date(), 'Transition');
    return <motion.div initial={start} animate={end} className={styles}>{children}</motion.div>;
}