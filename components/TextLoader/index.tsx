import styles from './index.module.css';

interface Props {
    children?: React.ReactNode,
    Class?: string
}

export default function TextLoader({ children, Class }: Props) {
  return (
    <h1 className={`${styles.animated} ${styles.infinite} ${styles.pulse} text-center ${Class ? ` ${Class}` : ''}`}>
        {children}
    </h1>);
}
