import styles from './index.module.css';

import Transition from '../Transition';

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

    return <Transition styles={styles['loading']} />;
}