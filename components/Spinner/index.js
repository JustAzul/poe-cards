import styles from './index.module.css';

import Dynamic from 'next/dynamic';
const Transition = Dynamic(import('../Transition'), {loading: () => <div className={styles['loading']} />});

export default function Spinner() {

    const transition = {
        duration: 0.4
    }

    return <Transition transition={transition} styles={styles['loading']} />
}